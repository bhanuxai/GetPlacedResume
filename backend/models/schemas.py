from typing import List, Optional, Dict, Any
from pydantic import BaseModel, Field

class ContactInfo(BaseModel):
    name: Optional[str] = None
    email: Optional[str] = None
    phone: Optional[str] = None
    linkedin: Optional[str] = None
    github: Optional[str] = None
    portfolio: Optional[str] = None
    location: Optional[str] = None

class EducationItem(BaseModel):
    institution: str
    degree: Optional[str] = None
    field_of_study: Optional[str] = None
    graduation_date: Optional[str] = None
    gpa: Optional[str] = None
    coursework: List[str] = Field(default_factory=list)

class ExperienceItem(BaseModel):
    title: str
    company: str
    location: Optional[str] = None
    start_date: Optional[str] = None
    end_date: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)

class ProjectItem(BaseModel):
    name: str
    description: Optional[str] = None
    bullets: List[str] = Field(default_factory=list)
    technologies: List[str] = Field(default_factory=list)
    metrics: List[str] = Field(default_factory=list)
    url: Optional[str] = None

class SkillItem(BaseModel):
    name: str
    category: str = "technical"  # technical, soft, tool, domain
    demonstrated_in_experience: bool = False
    demonstrated_in_projects: bool = False
    evidence_count: int = 0
    confidence: float = 0.0

class StructuredResume(BaseModel):
    candidate: ContactInfo
    summary: Optional[str] = None
    education: List[EducationItem] = Field(default_factory=list)
    experience: List[ExperienceItem] = Field(default_factory=list)
    projects: List[ProjectItem] = Field(default_factory=list)
    skills: List[SkillItem] = Field(default_factory=list)
    certifications: List[str] = Field(default_factory=list)
    achievements: List[str] = Field(default_factory=list)
    detected_sections: List[str] = Field(default_factory=list)
    missing_recommended_sections: List[str] = Field(default_factory=list)
    profile_type: str = "experienced"  # student, fresher, early_career, experienced
    raw_text: str = ""

class JobRequirement(BaseModel):
    id: str
    text: str
    category: str  # required_skill, preferred_skill, responsibility, experience, education, certification, tool, domain, soft_skill
    importance: str = "required"  # required, preferred, bonus
    keywords: List[str] = Field(default_factory=list)

class StructuredJob(BaseModel):
    title: Optional[str] = None
    company: Optional[str] = None
    summary: Optional[str] = None
    requirements: List[JobRequirement] = Field(default_factory=list)
    required_skills: List[str] = Field(default_factory=list)
    preferred_skills: List[str] = Field(default_factory=list)
    min_experience_years: Optional[float] = None
    education_level: Optional[str] = None
    raw_text: str = ""

class RequirementMatch(BaseModel):
    requirement_id: str
    requirement_text: str
    category: str
    importance: str
    match_status: str  # STRONG_MATCH, PARTIAL_MATCH, WEAK_EVIDENCE, MISSING, NOT_APPLICABLE
    confidence: float  # 0.0 - 1.0
    evidence_snippets: List[str] = Field(default_factory=list)
    explanation: str

class BulletAnalysis(BaseModel):
    id: str
    original_text: str
    action_verb: Optional[str] = None
    has_strong_verb: bool = False
    technical_substance: str = "Low"  # High, Medium, Low
    has_outcome: bool = False
    is_quantified: bool = False
    score: int = 50  # 0 - 100
    structure_grade: str = "C"  # A, B, C, D
    recommendation: Optional[str] = None
    suggested_revision: Optional[str] = None
    rationale: Optional[str] = None

class ProjectAnalysis(BaseModel):
    project_name: str
    problem: Optional[str] = None
    solution: Optional[str] = None
    technologies: List[str] = Field(default_factory=list)
    complexity_score: int = 70  # 0 - 100
    candidate_contribution: str = "Direct Contributor"
    metrics_present: bool = False
    metrics_summary: Optional[str] = None
    relevance_to_job: str = "High"  # High, Moderate, Low
    relevance_score: int = 80
    critique: str = ""
    suggested_improvements: List[str] = Field(default_factory=list)

class ATSIssue(BaseModel):
    severity: str  # HIGH, MEDIUM, LOW
    issue_type: str  # layout, table, header_footer, font, section, contact
    title: str
    description: str
    recommendation: str

class ATSFormatReport(BaseModel):
    parseability_score: int = 90  # 0 - 100
    two_column_layout_detected: bool = False
    tables_detected: int = 0
    scanned_image_detected: bool = False
    headers_footers_with_content: bool = False
    broken_reading_order_risk: str = "LOW"  # LOW, MEDIUM, HIGH
    font_issues: List[str] = Field(default_factory=list)
    detected_issues: List[ATSIssue] = Field(default_factory=list)

class ScoreBreakdown(BaseModel):
    job_relevance: float = Field(..., description="Out of 30")
    skills_competency: float = Field(..., description="Out of 20")
    experience_relevance: float = Field(..., description="Out of 20")
    ats_parseability: float = Field(..., description="Out of 15")
    content_quality: float = Field(..., description="Out of 10")
    professional_presentation: float = Field(..., description="Out of 5")
    total_score: int = Field(..., description="Out of 100")
    tier: str = "MODERATE MATCH"  # STRONG MATCH, MODERATE MATCH, NEEDS IMPROVEMENT

class ImprovementSuggestion(BaseModel):
    id: str
    section: str
    original: str
    suggested: str
    why: str
    impact: str = "HIGH"  # HIGH, MEDIUM, LOW
    status: str = "PENDING"  # PENDING, ACCEPTED, REJECTED

class Recommendation(BaseModel):
    id: str
    priority: str  # HIGH, MEDIUM, LOW
    category: str
    title: str
    description: str
    action_item: str

class AnalysisReport(BaseModel):
    overall_score: int
    tier: str
    score_breakdown: ScoreBreakdown
    executive_summary: List[str]
    strengths: List[str]
    weaknesses: List[str]
    candidate_profile_type: str
    requirement_matches: List[RequirementMatch]
    skills_analysis: Dict[str, List[str]]  # strongly_demonstrated, partially_demonstrated, mentioned_only, missing
    experience_summary: Dict[str, Any]
    project_analyses: List[ProjectAnalysis]
    bullet_analyses: List[BulletAnalysis]
    ats_format_report: ATSFormatReport
    recommendations: List[Recommendation]
    improvement_suggestions: List[ImprovementSuggestion]
    job_title: Optional[str] = None
    processed_at: str
