import os
import datetime
from typing import Optional
from fastapi import FastAPI, UploadFile, File, Form, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from models.schemas import AnalysisReport, StructuredResume, StructuredJob
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

app = FastAPI(
    title="GetPlacedResume — AI Resume & CV ATS Analyzer API",
    description="Explainable, semantic, multi-dimensional ATS resume evaluation platform.",
    version="1.0.0"
)

# Enable CORS for frontend Vite server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

@app.get("/")
def root():
    return {
        "message": "GetPlacedResume API is running successfully!",
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

@app.get("/api/sample-data")
def get_sample_data():
    return {
        "sample_resume": SAMPLE_RESUME_TEXT,
        "sample_jobs": SAMPLE_JOB_DESCRIPTIONS
    }

class TextAnalysisRequest(BaseModel):
    resume_text: str
    job_description: str
    profile_mode: Optional[str] = "auto"
    job_title: Optional[str] = None

@app.post("/api/analyze-text", response_model=AnalysisReport)
def analyze_text(request: TextAnalysisRequest):
    if not request.resume_text.strip():
        raise HTTPException(status_code=400, detail="Resume content cannot be empty.")
    if not request.job_description.strip():
        raise HTTPException(status_code=400, detail="Job description cannot be empty.")

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
    return run_pipeline(request.resume_text, request.job_description, meta, request.profile_mode, request.job_title)

@app.post("/api/analyze", response_model=AnalysisReport)
async def analyze_resume(
    resume_file: Optional[UploadFile] = File(None),
    resume_text: Optional[str] = Form(None),
    job_description: str = Form(...),
    profile_mode: Optional[str] = Form("auto"),
    job_title: Optional[str] = Form(None)
):
    if not job_description or not job_description.strip():
        raise HTTPException(status_code=400, detail="Job description is required.")

    # Extract resume content
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

    if resume_file:
        file_bytes = await resume_file.read()
        if len(file_bytes) == 0:
            raise HTTPException(status_code=400, detail="Uploaded file is empty.")
        raw_text, doc_meta = DocumentParser.parse_file(file_bytes, resume_file.filename)
    elif resume_text and resume_text.strip():
        raw_text = resume_text.strip()
    else:
        raise HTTPException(status_code=400, detail="Please upload a PDF/DOCX resume or paste resume text.")

    if len(raw_text.strip()) < 40 and not doc_meta.get("is_scanned"):
        raise HTTPException(
            status_code=422,
            detail="Resume text is too brief for a credible ATS evaluation. Please provide a complete resume."
        )

    return run_pipeline(raw_text, job_description, doc_meta, profile_mode, job_title)

@app.post("/api/analyze-demo", response_model=AnalysisReport)
def analyze_demo(preset: Optional[str] = "ml_engineer"):
    jd_text = SAMPLE_JOB_DESCRIPTIONS.get(preset, SAMPLE_JOB_DESCRIPTIONS["ml_engineer"])
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
        "total_bullets": sum(len(e.bullets) for e in resume.experience),
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
        processed_at=datetime.datetime.now(datetime.timezone.utc).strftime("%Y-%m-%d %H:%M:%S UTC")
    )

if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
