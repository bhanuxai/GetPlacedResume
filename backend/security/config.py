import os
import secrets
from typing import List

# -----------------------------------------------------------------------------
# CORS Configuration
# -----------------------------------------------------------------------------
DEFAULT_ALLOWED_ORIGINS = [
    "https://getplacedresume.vercel.app",
    "http://localhost:5173",
    "http://localhost:3000",
    "http://127.0.0.1:5173",
    "http://127.0.0.1:3000",
    "http://localhost:8000",
    "http://127.0.0.1:8000",
]

def get_allowed_origins() -> List[str]:
    """
    Returns the list of allowed CORS origins.
    Merges default production and local development origins with any origins
    specified via the ALLOWED_ORIGINS environment variable (comma-separated).
    Never returns a wildcard "*".
    """
    origins = list(DEFAULT_ALLOWED_ORIGINS)
    env_origins = os.environ.get("ALLOWED_ORIGINS", "")
    if env_origins.strip():
        for o in env_origins.split(","):
            cleaned = o.strip()
            if cleaned and cleaned != "*" and cleaned not in origins:
                origins.append(cleaned)
    return origins

# -----------------------------------------------------------------------------
# Upload and Input Constraints
# -----------------------------------------------------------------------------
MAX_UPLOAD_SIZE_MB = int(os.environ.get("MAX_UPLOAD_SIZE_MB", "5"))
MAX_UPLOAD_SIZE_BYTES = MAX_UPLOAD_SIZE_MB * 1024 * 1024

MAX_JOB_DESCRIPTION_CHARS = int(os.environ.get("MAX_JOB_DESCRIPTION_CHARS", "30000"))
MIN_JOB_DESCRIPTION_CHARS = int(os.environ.get("MIN_JOB_DESCRIPTION_CHARS", "30"))
MAX_RESUME_TEXT_CHARS = int(os.environ.get("MAX_RESUME_TEXT_CHARS", "50000"))
MIN_RESUME_TEXT_CHARS = int(os.environ.get("MIN_RESUME_TEXT_CHARS", "40"))
MAX_JOB_TITLE_CHARS = 200

ALLOWED_EXTENSIONS = {".pdf", ".docx"}
ALLOWED_MIME_TYPES = {
    "application/pdf",
    "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
    "application/octet-stream",  # Often sent by browsers for docx/pdf; validated via magic bytes
}

# -----------------------------------------------------------------------------
# Rate Limiting Configuration (requests per 60-second window)
# -----------------------------------------------------------------------------
RATE_LIMIT_ANALYZE = int(os.environ.get("RATE_LIMIT_ANALYZE", "10"))
RATE_LIMIT_DEMO = int(os.environ.get("RATE_LIMIT_DEMO", "20"))
RATE_LIMIT_FEEDBACK = int(os.environ.get("RATE_LIMIT_FEEDBACK", "5"))
RATE_LIMIT_SESSION = int(os.environ.get("RATE_LIMIT_SESSION", "30"))

# Replay/debounce window in seconds for identical requests from same client
REPLAY_DEBOUNCE_SECONDS = int(os.environ.get("REPLAY_DEBOUNCE_SECONDS", "10"))

# -----------------------------------------------------------------------------
# Ephemeral Session / Anti-Abuse Token Configuration
# -----------------------------------------------------------------------------
SESSION_SECRET_KEY = os.environ.get("SESSION_SECRET_KEY")
if not SESSION_SECRET_KEY:
    # Generate an ephemeral server-side secret for HMAC signing
    SESSION_SECRET_KEY = secrets.token_hex(32)

SESSION_TOKEN_TTL_SECONDS = int(os.environ.get("SESSION_TOKEN_TTL_SECONDS", "3600"))  # 1 hour
REQUIRE_SESSION_TOKEN = os.environ.get("REQUIRE_SESSION_TOKEN", "false").lower() == "true"

# -----------------------------------------------------------------------------
# Administration / Sensitive Endpoint Protection
# -----------------------------------------------------------------------------
ADMIN_API_KEY = os.environ.get("ADMIN_API_KEY", "")

# Optional Redis connection string for distributed rate limiting on Render
REDIS_URL = os.environ.get("REDIS_URL", "")
