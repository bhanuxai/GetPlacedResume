import io
import os
import sys
import time
import zipfile
import pytest
from starlette.testclient import TestClient

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import app
from security.config import (
    DEFAULT_ALLOWED_ORIGINS,
    MAX_UPLOAD_SIZE_BYTES,
    RATE_LIMIT_ANALYZE,
    SESSION_SECRET_KEY,
    ADMIN_API_KEY
)
from security.token_manager import generate_session_token, verify_session_token

client = TestClient(app)

SAMPLE_JD = """Machine Learning Engineer - NLP Applications
NovaAI Technologies is seeking an ML Engineer.
Required Qualifications:
- Bachelor's degree in Computer Science or related STEM field.
- 2+ years experience in Python, PyTorch or TensorFlow, and Scikit-learn.
- Hands-on experience deploying machine learning REST APIs (FastAPI).
- Proficiency in SQL and relational database design.
Responsibilities:
- Train and evaluate NLP transformer models for classification.
- Build scalable prediction microservices.
"""

def create_dummy_pdf() -> bytes:
    """Creates a minimal valid PDF byte sequence starting with %PDF-"""
    return b"%PDF-1.4\n1 0 obj\n<< /Type /Catalog /Pages 2 0 R >>\nendobj\n2 0 obj\n<< /Type /Pages /Kids [3 0 R] /Count 1 >>\nendobj\n3 0 obj\n<< /Type /Page /Parent 2 0 R /MediaBox [0 0 612 792] /Contents 4 0 R >>\nendobj\n4 0 obj\n<< /Length 44 >>\nstream\nBT /F1 12 Tf 72 712 Td (ALEX CHEN RESUME) Tj ET\nendstream\nendobj\nxref\n0 5\n0000000000 65535 f \n0000000009 00000 n \n0000000058 00000 n \n0000000115 00000 n \n0000000206 00000 n \ntrailer\n<< /Size 5 /Root 1 0 R >>\nstartxref\n300\n%%EOF\n"

def create_dummy_docx() -> bytes:
    """Creates a minimal valid DOCX file (ZIP archive containing word/document.xml)"""
    buf = io.BytesIO()
    with zipfile.ZipFile(buf, "w", zipfile.ZIP_DEFLATED) as zf:
        zf.writestr("[Content_Types].xml", '<?xml version="1.0" encoding="UTF-8"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"/>')
        zf.writestr("word/document.xml", '<?xml version="1.0" encoding="UTF-8"?><w:document xmlns:w="http://schemas.openxmlformats.org/wordprocessingml/2006/main"><w:body><w:p><w:r><w:t>Alex Chen Software Engineer Resume with Python, PyTorch, FastAPI, SQL</w:t></w:r></w:p></w:body></w:document>')
    return buf.getvalue()

# -----------------------------------------------------------------------------
# Test 1: Security Headers on Responses
# -----------------------------------------------------------------------------
def test_security_headers_present():
    response = client.get("/")
    assert response.status_code == 200
    headers = response.headers
    assert headers.get("x-content-type-options") == "nosniff"
    assert headers.get("x-frame-options") == "DENY"
    assert headers.get("referrer-policy") == "strict-origin-when-cross-origin"
    assert "permissions-policy" in headers
    assert "content-security-policy" in headers
    assert "default-src 'self'" in headers["content-security-policy"]

# -----------------------------------------------------------------------------
# Test 2: CORS Whitelisting and Origin Verification
# -----------------------------------------------------------------------------
def test_cors_production_origin_allowed():
    headers = {
        "Origin": "https://getplacedresume.vercel.app",
        "Access-Control-Request-Method": "POST",
        "Access-Control-Request-Headers": "content-type"
    }
    response = client.options("/api/analyze", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "https://getplacedresume.vercel.app"
    assert response.headers.get("access-control-allow-credentials") == "true"

def test_cors_localhost_origin_allowed():
    headers = {
        "Origin": "http://localhost:5173",
        "Access-Control-Request-Method": "POST"
    }
    response = client.options("/api/analyze", headers=headers)
    assert response.status_code == 200
    assert response.headers.get("access-control-allow-origin") == "http://localhost:5173"

def test_cors_unauthorized_origin_rejected():
    headers = {
        "Origin": "https://malicious-phishing-site.com",
        "Access-Control-Request-Method": "POST"
    }
    response = client.options("/api/analyze", headers=headers)
    # Disallowed origin must NOT receive access-control-allow-origin matching the attacker
    allow_origin = response.headers.get("access-control-allow-origin")
    assert allow_origin != "https://malicious-phishing-site.com"

# -----------------------------------------------------------------------------
# Test 3: Ephemeral Anti-Abuse Session Tokens
# -----------------------------------------------------------------------------
def test_session_token_generation_and_validation():
    # 1. Obtain fresh token
    response = client.get("/api/session-token")
    assert response.status_code == 200
    data = response.json()
    assert "token" in data
    assert data["expires_in"] == 3600
    token = data["token"]

    # 2. Verify token locally
    valid, reason = verify_session_token(token)
    assert valid is True
    assert reason is None

    # 3. Tampered token should be rejected
    tampered = token[:-4] + "AAAA"
    valid, reason = verify_session_token(tampered)
    assert valid is False
    assert "signature" in reason.lower()

# -----------------------------------------------------------------------------
# Test 4: Request Validation - Missing Required Fields
# -----------------------------------------------------------------------------
def test_analyze_missing_all_inputs():
    response = client.post("/api/analyze", data={})
    assert response.status_code in (400, 422)

def test_analyze_empty_job_description():
    response = client.post(
        "/api/analyze",
        data={"job_description": "   ", "resume_text": "Alex Chen Python Engineer at NovaAI with PyTorch experience."}
    )
    assert response.status_code == 400
    assert "job description is required" in response.json()["detail"].lower()

def test_analyze_missing_resume_source():
    response = client.post(
        "/api/analyze",
        data={"job_description": SAMPLE_JD}
    )
    assert response.status_code == 400
    assert "please upload a pdf/docx resume or paste resume text" in response.json()["detail"].lower()

# -----------------------------------------------------------------------------
# Test 5: File Type Validation & Magic Bytes Enforcement
# -----------------------------------------------------------------------------
def test_invalid_file_extension_rejected():
    fake_exe = io.BytesIO(b"MZ\x90\x00executable binary content")
    response = client.post(
        "/api/analyze",
        data={"job_description": SAMPLE_JD},
        files={"resume_file": ("malware.exe", fake_exe, "application/octet-stream")}
    )
    assert response.status_code == 415
    assert "unsupported file format" in response.json()["detail"].lower()

def test_fake_pdf_magic_bytes_rejected():
    # File named .pdf but containing plain text / non-PDF bytes
    bad_pdf = io.BytesIO(b"This is not a real PDF file, just random text.")
    response = client.post(
        "/api/analyze",
        data={"job_description": SAMPLE_JD},
        files={"resume_file": ("resume.pdf", bad_pdf, "application/pdf")}
    )
    assert response.status_code == 400
    assert "does not match the standard pdf format" in response.json()["detail"].lower()

def test_fake_docx_magic_bytes_rejected():
    # File named .docx but containing non-zip bytes
    bad_docx = io.BytesIO(b"Not a zip file")
    response = client.post(
        "/api/analyze",
        data={"job_description": SAMPLE_JD},
        files={"resume_file": ("resume.docx", bad_docx, "application/vnd.openxmlformats-officedocument.wordprocessingml.document")}
    )
    assert response.status_code == 400
    assert "invalid word" in response.json()["detail"].lower()

# -----------------------------------------------------------------------------
# Test 6: File Size Limit (413 Payload Too Large)
# -----------------------------------------------------------------------------
def test_oversized_file_rejected():
    # Create bytes exceeding 5 MB limit
    oversized = io.BytesIO(b"%PDF-" + b"A" * (MAX_UPLOAD_SIZE_BYTES + 1024))
    response = client.post(
        "/api/analyze",
        data={"job_description": SAMPLE_JD},
        files={"resume_file": ("large_resume.pdf", oversized, "application/pdf")}
    )
    assert response.status_code == 413
    assert "maximum allowed size" in response.json()["detail"].lower()

# -----------------------------------------------------------------------------
# Test 7: Rate Limiting & 429 Status
# -----------------------------------------------------------------------------
def test_rate_limiting_enforcement():
    # Issue requests exceeding RATE_LIMIT_ANALYZE from a dedicated IP
    test_ip = "198.51.100.42"
    headers = {"X-Forwarded-For": test_ip}

    status_codes = []
    for i in range(RATE_LIMIT_ANALYZE + 5):
        # vary input slightly to avoid duplicate check
        res = client.post(
            "/api/analyze",
            data={
                "job_description": SAMPLE_JD + f"\nPosition variant #{i} with additional qualifications.",
                "resume_text": f"Alex Chen Software Engineer #{i} with Python, FastAPI, and PyTorch production expertise across multiple companies."
            },
            headers=headers
        )
        status_codes.append(res.status_code)

    assert 429 in status_codes, f"Expected HTTP 429 in status codes: {status_codes}"
    # Verify Retry-After header
    last_response = client.post(
        "/api/analyze",
        data={"job_description": SAMPLE_JD, "resume_text": "Alex Chen Software Engineer with Python and PyTorch."},
        headers=headers
    )
    assert last_response.status_code == 429
    assert "retry-after" in last_response.headers
    assert int(last_response.headers["retry-after"]) >= 1

# -----------------------------------------------------------------------------
# Test 8: Duplicate Request Debounce
# -----------------------------------------------------------------------------
def test_duplicate_submission_debounce():
    test_ip = "203.0.113.88"
    headers = {"X-Forwarded-For": test_ip}
    text = "Alex Chen unique resume text for duplicate test with Python, FastAPI, and PyTorch."

    # First request
    r1 = client.post(
        "/api/analyze",
        data={"job_description": SAMPLE_JD, "resume_text": text},
        headers=headers
    )
    assert r1.status_code == 200

    # Immediate second identical request from same client
    r2 = client.post(
        "/api/analyze",
        data={"job_description": SAMPLE_JD, "resume_text": text},
        headers=headers
    )
    assert r2.status_code == 429
    assert "duplicate submission detected" in r2.json()["detail"].lower()

# -----------------------------------------------------------------------------
# Test 9: Protected Feedback Endpoint (Email Harvester Protection)
# -----------------------------------------------------------------------------
def test_get_feedback_unauthorized():
    # Public user attempts to scrape all feedbacks and emails
    res = client.get("/api/feedback")
    assert res.status_code == 403
    assert "administrator authentication required" in res.json()["detail"].lower()

def test_submit_feedback_success():
    payload = {
        "rating": 5,
        "satisfaction": "Very Satisfied",
        "feedback_text": "The ATS breakdown was very thorough and accurate.",
        "email": "candidate@example.com",
        "category": "features"
    }
    res = client.post("/api/feedback", json=payload)
    assert res.status_code == 200
    assert res.json()["status"] == "success"

# -----------------------------------------------------------------------------
# Test 10: Valid Full Resume Analysis (DOCX & Text)
# -----------------------------------------------------------------------------
def test_valid_text_analysis():
    test_ip = "192.0.2.1"
    headers = {"X-Forwarded-For": test_ip}
    valid_resume = (
        "ALEX CHEN\n"
        "alex.chen@email.com | San Francisco, CA\n"
        "SUMMARY: Experienced ML Engineer specializing in NLP, transformers, and FastAPI.\n"
        "EXPERIENCE: Senior ML Engineer at NovaAI building PyTorch NLP pipelines.\n"
        "EDUCATION: B.S. in Computer Science from UC Berkeley."
    )
    response = client.post(
        "/api/analyze",
        data={
            "job_description": SAMPLE_JD,
            "resume_text": valid_resume,
            "profile_mode": "experienced"
        },
        headers=headers
    )
    assert response.status_code == 200
    report = response.json()
    assert "overall_score" in report
    assert "score_breakdown" in report
    assert "requirement_matches" in report

def test_valid_docx_analysis():
    test_ip = "192.0.2.2"
    headers = {"X-Forwarded-For": test_ip}
    sample_docx_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sample_files", "alex_chen_ml_resume.docx")
    assert os.path.exists(sample_docx_path), "Sample docx file missing"
    with open(sample_docx_path, "rb") as f:
        docx_bytes = f.read()

    response = client.post(
        "/api/analyze",
        data={
            "job_description": SAMPLE_JD,
            "profile_mode": "auto"
        },
        files={"resume_file": ("resume.docx", io.BytesIO(docx_bytes), "application/vnd.openxmlformats-officedocument.wordprocessingml.document")},
        headers=headers
    )
    assert response.status_code == 200
    report = response.json()
    assert "overall_score" in report
    assert report["overall_score"] >= 0

def test_valid_pdf_analysis():
    test_ip = "192.0.2.3"
    headers = {"X-Forwarded-For": test_ip}
    sample_pdf_path = os.path.join(os.path.dirname(os.path.dirname(os.path.abspath(__file__))), "sample_files", "alex_chen_ml_resume.pdf")
    assert os.path.exists(sample_pdf_path), "Sample pdf file missing"
    with open(sample_pdf_path, "rb") as f:
        pdf_bytes = f.read()

    response = client.post(
        "/api/analyze",
        data={
            "job_description": SAMPLE_JD,
            "profile_mode": "auto"
        },
        files={"resume_file": ("resume.pdf", io.BytesIO(pdf_bytes), "application/pdf")},
        headers=headers
    )
    assert response.status_code == 200
    report = response.json()
    assert "overall_score" in report
    assert report["overall_score"] >= 0

# -----------------------------------------------------------------------------
# Test 11: Error Shielding - No Stack Traces Exposed
# -----------------------------------------------------------------------------
def test_error_shielding_no_stack_traces():
    # Pass an invalid JSON body to /api/analyze-text
    response = client.post(
        "/api/analyze-text",
        content=b"{bad_json",
        headers={"Content-Type": "application/json"}
    )
    assert response.status_code in (400, 422)
    detail = response.json().get("detail", "")
    # Verify no python file paths or traceback lines
    assert "Traceback (most recent call last)" not in detail
    assert "File \"" not in detail

if __name__ == "__main__":
    pytest.main(["-v", __file__])
