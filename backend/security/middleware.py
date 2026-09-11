from starlette.middleware.base import BaseHTTPMiddleware
from starlette.requests import Request
from starlette.responses import Response

class SecurityHeadersMiddleware(BaseHTTPMiddleware):
    """
    Applies defense-in-depth HTTP security headers to all outgoing responses.
    """
    async def dispatch(self, request: Request, call_next):
        response: Response = await call_next(request)

        # Prevent MIME type sniffing
        response.headers["X-Content-Type-Options"] = "nosniff"

        # Prevent clickjacking / iframe embedding
        response.headers["X-Frame-Options"] = "DENY"

        # Control referrer information leakages
        response.headers["Referrer-Policy"] = "strict-origin-when-cross-origin"

        # Restrict browser feature access
        response.headers["Permissions-Policy"] = (
            "accelerometer=(), camera=(), geolocation=(), gyroscope=(), "
            "magnetometer=(), microphone=(), payment=(), usb=()"
        )

        # Restrict resource loading & framing for API responses
        response.headers["Content-Security-Policy"] = "default-src 'self'; frame-ancestors 'none';"

        # Enforce HSTS if request arrived over HTTPS (standard for Render deployments)
        proto = request.headers.get("X-Forwarded-Proto", request.url.scheme)
        if proto == "https":
            response.headers["Strict-Transport-Security"] = "max-age=31536000; includeSubDomains; preload"

        # Cache control for sensitive analysis endpoints
        if request.url.path.startswith("/api/analyze"):
            response.headers["Cache-Control"] = "no-store, no-cache, must-revalidate, max-age=0"
            response.headers["Pragma"] = "no-cache"

        return response
