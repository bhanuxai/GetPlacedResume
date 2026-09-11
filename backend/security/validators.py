import io
import time
import zipfile
import hashlib
import threading
from typing import Tuple, Dict, Optional
from fastapi import UploadFile, HTTPException

from .config import (
    MAX_UPLOAD_SIZE_BYTES,
    MAX_UPLOAD_SIZE_MB,
    ALLOWED_EXTENSIONS,
    MAX_JOB_DESCRIPTION_CHARS,
    MIN_JOB_DESCRIPTION_CHARS,
    MAX_RESUME_TEXT_CHARS,
    MIN_RESUME_TEXT_CHARS,
    MAX_JOB_TITLE_CHARS,
    REPLAY_DEBOUNCE_SECONDS
)

# -----------------------------------------------------------------------------
# Duplicate / Replay Protection
# -----------------------------------------------------------------------------
class ReplayGuard:
    def __init__(self):
        self._lock = threading.Lock()
        self._seen: Dict[str, float] = {}

    def check_and_record(self, fingerprint: str, debounce_window: int = REPLAY_DEBOUNCE_SECONDS) -> bool:
        """
        Returns True if request is fresh (not a duplicate within debounce window).
        Returns False if duplicate request was received recently.
        """
        now = time.time()
        with self._lock:
            # Cleanup old records
            if len(self._seen) > 200:
                self._seen = {k: ts for k, ts in self._seen.items() if now - ts < debounce_window}

            last_seen = self._seen.get(fingerprint)
            if last_seen and (now - last_seen) < debounce_window:
                return False

            self._seen[fingerprint] = now
            return True

_replay_guard = ReplayGuard()

def check_duplicate_request(client_ip: str, input_content: str, job_description: str) -> None:
    """
    Computes a cryptographic fingerprint of the analysis request.
    Raises HTTPException(429) if an identical request was submitted within the debounce window.
    """
    hasher = hashlib.sha256()
    hasher.update(client_ip.encode("utf-8"))
    hasher.update(input_content[:2000].encode("utf-8"))
    hasher.update(job_description[:2000].encode("utf-8"))
    fingerprint = hasher.hexdigest()

    is_fresh = _replay_guard.check_and_record(fingerprint, REPLAY_DEBOUNCE_SECONDS)
    if not is_fresh:
        raise HTTPException(
            status_code=429,
            detail=f"Duplicate submission detected. Please wait {REPLAY_DEBOUNCE_SECONDS} seconds before re-analyzing the same content."
        )


# -----------------------------------------------------------------------------
# File Validation Functions
# -----------------------------------------------------------------------------
async def validate_and_read_upload(upload_file: UploadFile) -> Tuple[bytes, str]:
    """
    Validates uploaded file:
    1. Checks filename extension (.pdf or .docx only).
    2. Streams file up to MAX_UPLOAD_SIZE_BYTES to prevent memory exhaustion (DoS).
    3. Validates file header magic bytes (ensuring .pdf is truly a PDF, and .docx is truly a Word OpenXML zip).
    Returns (file_bytes, clean_filename).
    """
    if not upload_file.filename:
        raise HTTPException(status_code=400, detail="Uploaded file is missing a filename.")

    filename = upload_file.filename.strip()
    ext = ""
    if "." in filename:
        ext = "." + filename.rsplit(".", 1)[1].lower()

    if ext not in ALLOWED_EXTENSIONS:
        raise HTTPException(
            status_code=415,
            detail=f"Unsupported file format '{ext}'. Only PDF (.pdf) and Microsoft Word (.docx) documents are accepted."
        )

    # Read file content safely in chunks to enforce size limit before buffering into RAM
    chunk_size = 64 * 1024  # 64 KB
    total_read = 0
    buffer = bytearray()

    while True:
        chunk = await upload_file.read(chunk_size)
        if not chunk:
            break
        total_read += len(chunk)
        if total_read > MAX_UPLOAD_SIZE_BYTES:
            raise HTTPException(
                status_code=413,
                detail=f"Uploaded file exceeds the maximum allowed size of {MAX_UPLOAD_SIZE_MB}MB."
            )
        buffer.extend(chunk)

    if total_read == 0:
        raise HTTPException(status_code=400, detail="The uploaded file is empty (0 bytes).")

    file_bytes = bytes(buffer)

    # Magic byte and structural verification
    if ext == ".pdf":
        # PDF files must start with %PDF- (standard allows up to first 1024 bytes for header)
        header_sample = file_bytes[:1024]
        if b"%PDF-" not in header_sample:
            raise HTTPException(
                status_code=400,
                detail="Invalid PDF file. The file header does not match the standard PDF format."
            )
    elif ext == ".docx":
        # DOCX is a ZIP archive starting with PK\x03\x04 and containing word/document.xml
        if not file_bytes.startswith(b"PK\x03\x04"):
            raise HTTPException(
                status_code=400,
                detail="Invalid Word (.docx) file. File does not contain standard OpenXML archive header."
            )
        try:
            with zipfile.ZipFile(io.BytesIO(file_bytes)) as zf:
                namelist = zf.namelist()
                if "word/document.xml" not in namelist:
                    raise HTTPException(
                        status_code=400,
                        detail="Invalid Word (.docx) document structure. Missing main document body."
                    )
        except zipfile.BadZipFile:
            raise HTTPException(
                status_code=400,
                detail="The uploaded DOCX file is corrupted or not a valid archive."
            )

    return file_bytes, filename


# -----------------------------------------------------------------------------
# Input Text Sanitization & Constraints
# -----------------------------------------------------------------------------
def validate_job_description(jd: Optional[str]) -> str:
    """
    Validates job description text.
    """
    if not jd or not jd.strip():
        raise HTTPException(status_code=400, detail="Job description is required.")

    stripped = jd.strip()
    if len(stripped) < MIN_JOB_DESCRIPTION_CHARS:
        raise HTTPException(
            status_code=400,
            detail=f"Job description is too brief (minimum {MIN_JOB_DESCRIPTION_CHARS} characters required)."
        )

    if len(stripped) > MAX_JOB_DESCRIPTION_CHARS:
        raise HTTPException(
            status_code=400,
            detail=f"Job description exceeds the maximum length of {MAX_JOB_DESCRIPTION_CHARS} characters."
        )

    return stripped


def validate_resume_text(text: Optional[str]) -> str:
    """
    Validates raw resume text input.
    """
    if not text or not text.strip():
        raise HTTPException(status_code=400, detail="Resume text cannot be empty.")

    stripped = text.strip()
    if len(stripped) < MIN_RESUME_TEXT_CHARS:
        raise HTTPException(
            status_code=422,
            detail="Resume text is too brief for a credible ATS evaluation. Please provide a complete resume."
        )

    if len(stripped) > MAX_RESUME_TEXT_CHARS:
        raise HTTPException(
            status_code=400,
            detail=f"Resume text exceeds the maximum limit of {MAX_RESUME_TEXT_CHARS} characters."
        )

    return stripped


def sanitize_job_title(title: Optional[str]) -> Optional[str]:
    """
    Sanitizes optional job title string.
    """
    if not title:
        return None
    cleaned = title.strip()[:MAX_JOB_TITLE_CHARS]
    return cleaned if cleaned else None


def validate_profile_mode(mode: Optional[str]) -> str:
    """
    Validates profile mode enum.
    """
    allowed = {"auto", "student", "fresher", "experienced"}
    if mode and mode.lower() in allowed:
        return mode.lower()
    return "auto"
