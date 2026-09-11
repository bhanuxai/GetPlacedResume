import hmac
import hashlib
import base64
import json
import time
import uuid
from typing import Optional, Tuple
from fastapi import Request, HTTPException

from .config import SESSION_SECRET_KEY, SESSION_TOKEN_TTL_SECONDS, REQUIRE_SESSION_TOKEN

def _b64_encode(data: bytes) -> str:
    return base64.urlsafe_b64encode(data).decode("utf-8").rstrip("=")

def _b64_decode(data: str) -> bytes:
    padding = 4 - (len(data) % 4)
    if padding < 4:
        data += "=" * padding
    return base64.urlsafe_b64decode(data)

def generate_session_token(client_fingerprint: Optional[str] = None) -> str:
    """
    Generates a cryptographically signed, short-lived session token (anti-abuse token).
    The token contains a random nonce, issue timestamp, expiration, and HMAC-SHA256 signature.
    """
    now = int(time.time())
    payload = {
        "nonce": uuid.uuid4().hex,
        "iat": now,
        "exp": now + SESSION_TOKEN_TTL_SECONDS,
    }
    if client_fingerprint:
        payload["fp"] = hashlib.sha256(client_fingerprint.encode("utf-8")).hexdigest()[:16]

    payload_bytes = json.dumps(payload, separators=(',', ':')).encode("utf-8")
    payload_b64 = _b64_encode(payload_bytes)

    # Compute HMAC-SHA256 signature
    signature = hmac.new(
        SESSION_SECRET_KEY.encode("utf-8"),
        payload_b64.encode("utf-8"),
        hashlib.sha256
    ).digest()
    sig_b64 = _b64_encode(signature)

    return f"{payload_b64}.{sig_b64}"

def verify_session_token(token: str, client_fingerprint: Optional[str] = None) -> Tuple[bool, Optional[str]]:
    """
    Verifies the HMAC-SHA256 signature and expiration of a session token.
    Returns: (is_valid, error_reason)
    """
    if not token or "." not in token:
        return False, "Malformed token structure."

    parts = token.split(".")
    if len(parts) != 2:
        return False, "Invalid token format."

    payload_b64, sig_b64 = parts[0], parts[1]

    # Verify signature
    expected_sig = hmac.new(
        SESSION_SECRET_KEY.encode("utf-8"),
        payload_b64.encode("utf-8"),
        hashlib.sha256
    ).digest()
    expected_sig_b64 = _b64_encode(expected_sig)

    if not hmac.compare_digest(sig_b64, expected_sig_b64):
        return False, "Invalid token signature."

    # Parse and verify payload
    try:
        payload_bytes = _b64_decode(payload_b64)
        payload = json.loads(payload_bytes.decode("utf-8"))
    except Exception:
        return False, "Could not decode token payload."

    now = int(time.time())
    if payload.get("exp", 0) < now:
        return False, "Session token has expired."

    return True, None

def require_session_token(request: Request) -> None:
    """
    FastAPI dependency / validation step to verify presence of valid X-Session-Token header.
    Only strictly enforced if REQUIRE_SESSION_TOKEN is True.
    """
    token = request.headers.get("X-Session-Token") or request.headers.get("x-session-token")
    if not token:
        if REQUIRE_SESSION_TOKEN:
            raise HTTPException(
                status_code=403,
                detail="Missing session token. Please obtain a valid session token before submitting requests."
            )
        return

    is_valid, reason = verify_session_token(token)
    if not is_valid:
        if REQUIRE_SESSION_TOKEN:
            raise HTTPException(
                status_code=403,
                detail=f"Unauthorized session: {reason}"
            )
