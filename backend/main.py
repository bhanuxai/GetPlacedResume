import os
import datetime
import logging
import traceback
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException, Request, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import JSONResponse
from fastapi.exceptions import RequestValidationError
from pydantic import BaseModel, Field

from models.schemas import AnalysisReport, StructuredResume, StructuredJob, FeedbackRequest, FeedbackResponse
from services.document_parser import DocumentParser
from services.resume_parser import ResumeParser
from services.job_parser import JobParser
from services.semantic_matcher import SemanticMatcher
from services.ats_analyzer import ATSAnalyzer
from services.bullet_analyzer import BulletAnalyzer
from services.project_analyzer import ProjectAnalyzer
from services.scoring_engine import ScoringEngine
from services.recommendation_engine import RecommendationEngine
from sample_data import SAMPLE_RESUME_TEXT, SAMPLE_JOB_DESCRIPTIONS

# Security module imports
from security.config import (
    get_allowed_origins,
    RATE_LIMIT_ANALYZE,
    RATE_LIMIT_DEMO,
    RATE_LIMIT_FEEDBACK,
    RATE_LIMIT_SESSION,
    ADMIN_API_KEY
)
from security.rate_limiter import check_rate_limit, get_client_ip
from security.token_manager import generate_session_token, require_session_token
from security.validators import (
    validate_and_read_upload,
    validate_job_description,
    validate_resume_text,
    sanitize_job_title,
    validate_profile_mode,
    check_duplicate_request
)
from security.middleware import SecurityHeadersMiddleware

# Configure server-side logging for diagnostics without leaking details to clients
logging.basicConfig(level=logging.INFO, format="%(asctime)s [%(levelname)s] %(name)s: %(message)s")
logger = logging.getLogger("getplacedresume.backend")

app = FastAPI(
    title="GetPlacedResume — AI Resume & CV ATS Analyzer API",
    description="Explainable, semantic, multi-dimensional ATS resume evaluation platform.",
    version="1.0.0"
)

# -----------------------------------------------------------------------------
# Security Middleware & CORS Configuration
# -----------------------------------------------------------------------------
# 1. Custom Security Headers (CSP, HSTS, X-Content-Type-Options, Permissions-Policy)
app.add_middleware(SecurityHeadersMiddleware)

# 2. Strict CORS policy: Allow only production domain & local development (no wildcard "*")
allowed_origins = get_allowed_origins()
app.add_middleware(
    CORSMiddleware,
    allow_origins=allowed_origins,
    allow_credentials=True,
    allow_methods=["GET", "POST", "OPTIONS"],
    allow_headers=[
        "Content-Type",
        "Authorization",
        "X-Requested-With",
        "X-Session-Token",
        "x-session-token",
        "X-Admin-Key",
        "x-admin-key",
        "Accept",
        "Origin"
    ],
    max_age=600
)

# -----------------------------------------------------------------------------
# Global Error Handlers (Hiding Stack Traces & Internal Implementation Details)
# -----------------------------------------------------------------------------
@app.exception_handler(HTTPException)
async def http_exception_handler(request: Request, exc: HTTPException):
    headers = getattr(exc, "headers", None)
    return JSONResponse(
        status_code=exc.status_code,
        content={"detail": exc.detail},
        headers=headers
    )

@app.exception_handler(RequestValidationError)
async def validation_exception_handler(request: Request, exc: RequestValidationError):
    # Log raw validation errors internally
    logger.warning(f"Request validation error on {request.url.path}: {exc.errors()}")
    return JSONResponse(
        status_code=422,
        content={"detail": "Request validation failed. Please ensure all submitted fields match the required formats."}
    )

@app.exception_handler(Exception)
async def unhandled_exception_handler(request: Request, exc: Exception):
    # Securely log stack trace to server logs for debugging
    client_ip = get_client_ip(request)
    logger.error(
        f"Unhandled 500 error on {request.method} {request.url.path} from {client_ip}:\n"
        f"{traceback.format_exc()}"
    )
    # Never expose stack trace, file paths, or internal variables to client
    return JSONResponse(
        status_code=500,
        content={"detail": "An internal server error occurred while processing your request. Please try again later."}
    )

# -----------------------------------------------------------------------------
# Public & Utility Endpoints
# -----------------------------------------------------------------------------
@app.get("/")
def root():
    return {
        "message": "GetPlacedResume API is running securely!",
        "docs_url": "/docs",
        "health_check": "/api/health"
    }

@app.get("/api/health")
def health_check():
    return {
        "status": "healthy",
        "service": "GetPlacedResume Backend Engine",
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat()
    }

@app.get("/api/session-token")
def get_session_token(request: Request):
    """
    Issues a short-lived, signed session token for anti-abuse & CSRF mitigation.
    Enforces rate limiting to prevent token-harvesting loops.
    """
    check_rate_limit(request, "session_token", RATE_LIMIT_SESSION)
    client_ip = get_client_ip(request)
    token = generate_session_token(client_fingerprint=client_ip)
    return {
        "token": token,
        "expires_in": 3600
    }

@app.get("/api/sample-data")
def get_sample_data(request: Request):
    """
    Returns sample resume & job descriptions.
    Includes a fresh session token so the frontend receives a token automatically on mount.
    """
    client_ip = get_client_ip(request)
    token = generate_session_token(client_fingerprint=client_ip)
    return {
        "sample_resume": SAMPLE_RESUME_TEXT,
        "sample_jobs": SAMPLE_JOB_DESCRIPTIONS,
        "session_token": token
    }

# -----------------------------------------------------------------------------
# Resume Analysis Endpoints
# -----------------------------------------------------------------------------
class TextAnalysisRequest(BaseModel):
    resume_text: str = Field(..., max_length=50000)
    job_description: str = Field(..., max_length=30000)
    profile_mode: Optional[str] = "auto"
    job_title: Optional[str] = None

@app.post("/api/analyze-text", response_model=AnalysisReport)
def analyze_text(request_data: TextAnalysisRequest, request: Request):
    client_ip = get_client_ip(request)

    # 1. Cheap Rate Limit Check
    check_rate_limit(request, "analyze", RATE_LIMIT_ANALYZE)

    # 2. Ephemeral Session Token Verification
    require_session_token(request)

    # 3. Input Validations
    valid_resume = validate_resume_text(request_data.resume_text)
    valid_jd = validate_job_description(request_data.job_description)
    valid_title = sanitize_job_title(request_data.job_title)
    valid_mode = validate_profile_mode(request_data.profile_mode)

    # 4. Replay / Duplicate Submission Guard
    check_duplicate_request(client_ip, valid_resume, valid_jd)

    meta = {
        "format": "text",
        "page_count": 1,
        "is_scanned": False,
        "two_column": False,
        "table_count": 0,
        "header_footer_risk": False,
        "font_issues": [],
        "issues": []
    }

    try:
        return run_pipeline(valid_resume, valid_jd, meta, valid_mode, valid_title)
    except Exception as e:
        logger.error(f"Error in analyze_text pipeline: {e}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail="Failed to complete resume analysis. Please verify your input and try again."
        )

@app.post("/api/analyze", response_model=AnalysisReport)
async def analyze_resume(
    request: Request,
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    job_description: str = Form(...),
    profile_mode: Optional[str] = Form("auto"),
    job_title: Optional[str] = Form(None)
):
    client_ip = get_client_ip(request)

    # 1. Cheap Rate Limit Check (Runs before reading file into RAM or executing pipeline)
    check_rate_limit(request, "analyze", RATE_LIMIT_ANALYZE)

    # 2. Ephemeral Session Token Verification
    require_session_token(request)

    # 3. Form Field Input Validations
    valid_jd = validate_job_description(job_description)
    valid_title = sanitize_job_title(job_title)
    valid_mode = validate_profile_mode(profile_mode)

    doc_meta = {
        "format": "text",
        "page_count": 1,
        "is_scanned": False,
        "two_column": False,
        "table_count": 0,
        "header_footer_risk": False,
        "font_issues": [],
        "issues": []
    }

    # 4. File Upload or Raw Text Extraction with Strict Validation
    if resume_file:
        # Stream file safely, enforce 5MB limit, verify extension & magic bytes
        file_bytes, clean_filename = await validate_and_read_upload(resume_file)
        try:
            raw_text, doc_meta = DocumentParser.parse_file(file_bytes, clean_filename)
        except ValueError as ve:
            raise HTTPException(status_code=415, detail=str(ve))
        except Exception as pe:
            logger.warning(f"Document parsing error for {clean_filename}: {pe}")
            raise HTTPException(
                status_code=400,
                detail="Unable to parse the uploaded document. Please ensure it is an uncorrupted, standard PDF or DOCX file."
            )
    elif resume_text and resume_text.strip():
        raw_text = validate_resume_text(resume_text)
    else:
        raise HTTPException(status_code=400, detail="Please upload a PDF/DOCX resume or paste resume text.")

    # 5. Minimum content check
    if len(raw_text.strip()) < 40 and not doc_meta.get("is_scanned"):
        raise HTTPException(
            status_code=422,
            detail="Resume text is too brief for a credible ATS evaluation. Please provide a complete resume."
        )

    # 6. Replay / Duplicate Submission Guard
    check_duplicate_request(client_ip, raw_text, valid_jd)

    # 7. Execute Multi-stage ML/AI Pipeline with Error Shielding
    try:
        return run_pipeline(raw_text, valid_jd, doc_meta, valid_mode, valid_title)
    except Exception as e:
        logger.error(f"Error during run_pipeline execution: {e}\n{traceback.format_exc()}")
        raise HTTPException(
            status_code=500,
            detail="An error occurred while evaluating the resume against the job description. Please try again."
        )

@app.post("/api/analyze-demo", response_model=AnalysisReport)
def analyze_demo(request: Request, preset: Optional[str] = "ml_engineer"):
    # Rate limit demo endpoint
    check_rate_limit(request, "analyze_demo", RATE_LIMIT_DEMO)
    require_session_token(request)

    # Validate preset
    safe_preset = preset if preset in SAMPLE_JOB_DESCRIPTIONS else "ml_engineer"
    jd_text = SAMPLE_JOB_DESCRIPTIONS[safe_preset]

    doc_meta = {
        "format": "pdf",
        "page_count": 1,
        "is_scanned": False,
        "two_column": False,
        "table_count": 0,
        "header_footer_risk": False,
        "font_issues": [],
        "issues": []
    }
    return run_pipeline(SAMPLE_RESUME_TEXT, jd_text, doc_meta, profile_mode="auto", job_title=None)

def run_pipeline(
    raw_resume: str,
    jd_text: str,
    doc_meta: dict,
    profile_mode: Optional[str] = "auto",
    job_title: Optional[str] = None
) -> AnalysisReport:
    """
    Executes the multi-stage explainable pipeline.
    """
    # 1. Resume Parsing & Entity Extraction
    resume: StructuredResume = ResumeParser.parse(raw_resume, doc_meta)
    if profile_mode in ("student", "fresher", "experienced"):
        resume.profile_type = profile_mode

    # 2. Job Parsing & Requirement Categorization
    job: StructuredJob = JobParser.parse(jd_text)
    if job_title:
        job.title = job_title

    # 3. Semantic Vector Matching & Evidence Extraction
    matches, skills_analysis = SemanticMatcher.match_all(resume, job)

    # 4. ATS Layout & Format Inspection
    ats_report = ATSAnalyzer.analyze(resume, doc_meta)

    # 5. Bullet Point Structure Analysis (Action + What + How + Result)
    bullet_analyses = BulletAnalyzer.analyze_resume_bullets(resume)

    # 6. Project Individual Analysis
    project_analyses = ProjectAnalyzer.analyze_projects(resume.projects, job)

    # 7. 6-Dimensional Explainable Scoring Engine
    breakdown, exec_summary, strengths, weaknesses = ScoringEngine.calculate_score(
        resume=resume,
        job=job,
        matches=matches,
        skills_analysis=skills_analysis,
        ats_report=ats_report,
        bullet_analyses=bullet_analyses,
        project_analyses=project_analyses
    )

    # 8. Actionable Prioritized Recommendations
    recommendations = RecommendationEngine.generate_recommendations(
        resume=resume,
        job=job,
        breakdown=breakdown,
        skills_analysis=skills_analysis,
        ats_report=ats_report,
        bullet_analyses=bullet_analyses
    )

    # 9. Grounded "Fix My Resume" Improvements
    fix_suggestions = RecommendationEngine.generate_fix_suggestions(resume, bullet_analyses)

    # Experience summary
    experience_summary = {
        "roles_count": len(resume.experience),
        "total_bullets": len(bullet_analyses),
        "profile_type": resume.profile_type,
        "education_highest": resume.education[0].degree if resume.education else "Not Specified"
    }

    return AnalysisReport(
        overall_score=breakdown.total_score,
        tier=breakdown.tier,
        score_breakdown=breakdown,
        executive_summary=exec_summary,
        strengths=strengths,
        weaknesses=weaknesses,
        candidate_profile_type=resume.profile_type,
        requirement_matches=matches,
        skills_analysis=skills_analysis,
        experience_summary=experience_summary,
        project_analyses=project_analyses,
        bullet_analyses=bullet_analyses,
        ats_format_report=ats_report,
        recommendations=recommendations,
        improvement_suggestions=fix_suggestions,
        job_title=job.title,
        company=job.company,
        location=job.location,
        processed_at=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    )

# -----------------------------------------------------------------------------
# Feedback & Review Endpoints (Privacy Hardened)
# -----------------------------------------------------------------------------
FEEDBACK_FILE = os.path.join(os.path.dirname(os.path.abspath(__file__)), "user_feedbacks.json")

@app.post("/api/feedback", response_model=FeedbackResponse)
def submit_feedback(feedback: FeedbackRequest, request: Request):
    # Rate limit feedback submissions
    check_rate_limit(request, "feedback", RATE_LIMIT_FEEDBACK)

    import json
    # Sanitize inputs
    rating = max(1, min(5, feedback.rating))
    feedback_text = feedback.feedback_text.strip()[:2000]
    email = feedback.email.strip()[:254] if feedback.email else None

    entry = {
        "timestamp": datetime.datetime.now(datetime.timezone.utc).isoformat(),
        "rating": rating,
        "satisfaction": feedback.satisfaction[:50],
        "feedback_text": feedback_text,
        "email": email,
        "category": feedback.category[:50] if feedback.category else "general"
    }
    try:
        existing = []
        if os.path.exists(FEEDBACK_FILE):
            with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
                existing = json.load(f)
        existing.append(entry)
        with open(FEEDBACK_FILE, "w", encoding="utf-8") as f:
            json.dump(existing, f, indent=2)
    except Exception as e:
        logger.warning(f"Error saving feedback to storage: {e}")

    return FeedbackResponse(
        status="success",
        message="Thank you! Your feedback and suggestions have been recorded to help refine our ATS evaluation models."
    )

@app.get("/api/feedback")
def get_feedbacks(x_admin_key: Optional[str] = Header(None)):
    """
    Returns collected user reviews.
    SECURITY HARDENING: Requires X-Admin-Key header to prevent public email address scraping.
    """
    if not ADMIN_API_KEY or x_admin_key != ADMIN_API_KEY:
        raise HTTPException(
            status_code=403,
            detail="Access forbidden. Administrator authentication required to view feedback data."
        )

    import json
    if os.path.exists(FEEDBACK_FILE):
        try:
            with open(FEEDBACK_FILE, "r", encoding="utf-8") as f:
                return json.load(f)
        except Exception:
            return []
    return []

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
