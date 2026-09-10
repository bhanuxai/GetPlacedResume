import sys
import os

# Add backend directory to sys.path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import run_pipeline
from sample_data import SAMPLE_RESUME_TEXT, SAMPLE_JOB_DESCRIPTIONS

def test_pipeline():
    print("Testing ResumeIQ analysis pipeline...")
    jd = SAMPLE_JOB_DESCRIPTIONS["ml_engineer"]
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

    report = run_pipeline(
        raw_resume=SAMPLE_RESUME_TEXT,
        jd_text=jd,
        doc_meta=doc_meta,
        profile_mode="auto"
    )

    print(f"\n[OK] Overall ATS Score: {report.overall_score}/100 ({report.tier})")
    print(f"Candidate Profile Detected: {report.candidate_profile_type}")
    print(f"Score Breakdown:")
    print(f" - Job Relevance: {report.score_breakdown.job_relevance}/30")
    print(f" - Skills Competency: {report.score_breakdown.skills_competency}/20")
    print(f" - Experience Relevance: {report.score_breakdown.experience_relevance}/20")
    print(f" - ATS Parseability: {report.score_breakdown.ats_parseability}/15")
    print(f" - Content Quality: {report.score_breakdown.content_quality}/10")
    print(f" - Presentation: {report.score_breakdown.professional_presentation}/5")
    print(f"\nRequirement Matches ({len(report.requirement_matches)}):")
    for rm in report.requirement_matches:
        print(f" - [{rm.match_status}] [{rm.category}] {rm.requirement_text[:55]}... (Confidence: {rm.confidence*100:.0f}%)")
    
    # Regression assertions:
    for rm in report.requirement_matches:
        t_low = rm.requirement_text.lower()
        assert not t_low.startswith("company:"), f"Spurious company metadata found in requirement matches: {rm.requirement_text}"
        assert not t_low.startswith("location:"), f"Spurious location metadata found in requirement matches: {rm.requirement_text}"
        assert not t_low.startswith("about the role"), f"Spurious section heading found in requirement matches: {rm.requirement_text}"
        assert rm.requirement_text.strip() != "Responsibilities:", f"Spurious section heading found in requirement matches: {rm.requirement_text}"
        assert rm.category not in ("metadata", "section_heading", "context", "boilerplate"), f"Invalid category {rm.category} in scorable requirements"

    # Numeric experience preservation check
    exp_reqs = [rm for rm in report.requirement_matches if rm.category == "experience" and "1+" in rm.requirement_text]
    assert len(exp_reqs) == 1, "Expected 1+ years experience requirement to retain its leading number"
    assert not any(rm.requirement_text.startswith("+ years") for rm in report.requirement_matches), "Leading digit stripped from experience requirement!"

    print(f"\nSkills Analysis:")
    print(f" - Strongly Demonstrated: {report.skills_analysis['strongly_demonstrated']}")
    print(f" - Mentioned Only: {report.skills_analysis['mentioned_only']}")
    print(f" - Missing: {report.skills_analysis['missing']}")

    print(f"\nBullet Analyses: {len(report.bullet_analyses)} bullets evaluated")
    print(f"Project Analyses: {len(report.project_analyses)} projects evaluated")
    print(f"Fix Suggestions: {len(report.improvement_suggestions)} suggestions generated")
    
    assert report.overall_score >= 50, "Score should be reasonable for sample resume"
    assert len(report.requirement_matches) == 13, f"Expected 13 genuine requirements, got {len(report.requirement_matches)}"
    assert len(report.strengths) > 0, "Should have strengths"
    print("\nALL PIPELINE TESTS & REGRESSION ASSERTIONS PASSED!")

if __name__ == "__main__":
    test_pipeline()
