import time
import ipaddress
import threading
from typing import Dict, List, Tuple, Optional
from fastapi import Request, HTTPException

from .config import REDIS_URL

def get_client_ip(request: Request) -> str:
    """
    Extracts the real client IP address, accounting for Render's reverse proxy.
    Prefers the leftmost IP in X-Forwarded-For. Validates that it is a valid IP address.
    Falls back to request.client.host if missing or malformed.
    """
    forwarded_for = request.headers.get("X-Forwarded-For")
    if forwarded_for:
        # X-Forwarded-For may contain multiple comma-separated IPs: client, proxy1, proxy2
        ips = [ip.strip() for ip in forwarded_for.split(",") if ip.strip()]
        if ips:
            client_candidate = ips[0]
            try:
                # Validate that it's a valid IPv4 or IPv6 address
                ipaddress.ip_address(client_candidate)
                return client_candidate
            except ValueError:
                pass

    # Fallback to direct client host
    if request.client and request.client.host:
        return request.client.host

    return "127.0.0.1"


class InMemoryRateLimiter:
    """
    Thread-safe sliding-window rate limiter.
    Stores request timestamps per (client_ip, endpoint) in memory.
    Automatically prunes stale entries to prevent memory leaks.
    """
    def __init__(self):
        self._lock = threading.Lock()
        self._records: Dict[str, List[float]] = {}
        self._last_cleanup = time.time()

    def check(self, key: str, limit: int, window: int = 60) -> Tuple[bool, int, int]:
        """
        Check if request is allowed under sliding window limit.
        Returns: (is_allowed, remaining_quota, retry_after_seconds)
        """
        now = time.time()
        cutoff = now - window

        with self._lock:
            # Periodic global cleanup every 5 minutes to prevent memory leaks
            if now - self._last_cleanup > 300:
                self._cleanup(cutoff)
                self._last_cleanup = now

            timestamps = self._records.get(key, [])
            # Prune timestamps older than the sliding window
            valid_timestamps = [ts for ts in timestamps if ts > cutoff]

            if len(valid_timestamps) >= limit:
                # Oldest timestamp determines when the next request will be permitted
                oldest = valid_timestamps[0]
                retry_after = max(1, int(oldest + window - now))
                self._records[key] = valid_timestamps
                return False, 0, retry_after

            valid_timestamps.append(now)
            self._records[key] = valid_timestamps
            remaining = limit - len(valid_timestamps)
            return True, remaining, 0

    def _cleanup(self, cutoff: float):
        keys_to_delete = []
        for key, timestamps in self._records.items():
            valid = [t for t in timestamps if t > cutoff]
            if not valid:
                keys_to_delete.append(key)
            else:
                self._records[key] = valid
        for key in keys_to_delete:
            del self._records[key]


# Global rate limiter instance
_in_memory_limiter = InMemoryRateLimiter()

# Optional Redis client if REDIS_URL is configured
_redis_client = None
if REDIS_URL:
    try:
        import redis
        _redis_client = redis.from_url(REDIS_URL, decode_responses=True)
    except Exception:
        _redis_client = None


def check_rate_limit(
    request: Request,
    endpoint_name: str,
    limit: int,
    window: int = 60
) -> None:
    """
    Enforces a rate limit for the given endpoint and client IP.
    Raises HTTPException(429) if the limit is exceeded.
    """
    client_ip = get_client_ip(request)
    key = f"rate:{endpoint_name}:{client_ip}"

    # Use Redis if available for multi-instance Render deployments
    if _redis_client:
        try:
            now = time.time()
            cutoff = now - window
            pipe = _redis_client.pipeline()
            pipe.zremrangebyscore(key, 0, cutoff)
            pipe.zcard(key)
            pipe.zadd(key, {str(now): now})
            pipe.expire(key, window + 5)
            results = pipe.execute()
            current_count = results[1]

            if current_count >= limit:
                # Exceeded
                headers = {
                    "Retry-After": str(window),
                    "X-RateLimit-Limit": str(limit),
                    "X-RateLimit-Remaining": "0",
                    "X-RateLimit-Reset": str(int(now + window)),
                }
                raise HTTPException(
                    status_code=429,
                    detail=f"Rate limit exceeded. Maximum {limit} requests per {window} seconds allowed. Please wait before retrying.",
                    headers=headers
                )
            return
        except HTTPException:
            raise
        except Exception:
            # Redis error; fall through to in-memory limiter
            pass

    # Fallback to high-performance in-memory sliding window
    allowed, remaining, retry_after = _in_memory_limiter.check(key, limit, window)
    if not allowed:
        headers = {
            "Retry-After": str(retry_after),
            "X-RateLimit-Limit": str(limit),
            "X-RateLimit-Remaining": "0",
            "X-RateLimit-Reset": str(int(time.time() + retry_after)),
        }
        raise HTTPException(
            status_code=429,
            detail=f"Rate limit exceeded. Too many requests. Please wait {retry_after} seconds before retrying.",
            headers=headers
        )
