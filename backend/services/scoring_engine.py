from typing import List, Dict, Any, Tuple
from models.schemas import (
    ScoreBreakdown, StructuredResume, StructuredJob, RequirementMatch,
    ATSFormatReport, BulletAnalysis, ProjectAnalysis
)

class ScoringEngine:
    """
    Computes an explainable, multi-dimensional ATS compatibility score across 6 distinct axes:
    - Job Relevance (30%)
    - Skills & Technical Competency (20%)
    - Experience Relevance (20%)
    - Resume Structure & ATS Parseability (15%)
    - Content Quality (10%)
    - Professional Presentation (5%)
    """

    @classmethod
    def calculate_score(
        cls,
        resume: StructuredResume,
        job: StructuredJob,
        matches: List[RequirementMatch],
        skills_analysis: Dict[str, List[str]],
        ats_report: ATSFormatReport,
        bullet_analyses: List[BulletAnalysis],
        project_analyses: List[ProjectAnalysis]
    ) -> Tuple[ScoreBreakdown, List[str], List[str], List[str]]:

        # 1. Job Relevance (30 pts max)
        # Average confidence of all requirement matches with weight on required vs preferred
        total_weight = 0.0
        weighted_sim = 0.0
        for m in matches:
            if m.category == "responsibility":
                weight = 1.0
            elif m.importance == "required":
                weight = 1.5
            else:
                weight = 1.0
            total_weight += weight
            if m.match_status == "STRONG_MATCH":
                score_factor = 1.0
            elif m.match_status == "PARTIAL_MATCH":
                score_factor = 0.65
            elif m.match_status == "WEAK_EVIDENCE":
                score_factor = 0.35
            else:
                score_factor = 0.0
            weighted_sim += (score_factor * m.confidence * weight)

        norm_relevance = (weighted_sim / total_weight) if total_weight > 0 else 0.70
        job_relevance_score = round(norm_relevance * 30.0, 1)

        # 2. Skills & Technical Competency (20 pts max)
        # Reward demonstrated skills; penalize missing skills; do not reward keyword stuffing
        num_strong = len(skills_analysis.get("strongly_demonstrated", []))
        num_partial = len(skills_analysis.get("partially_demonstrated", []))
        num_mentioned = len(skills_analysis.get("mentioned_only", []))
        num_missing = len(skills_analysis.get("missing", []))

        total_req_skills = max(1, num_strong + num_partial + num_mentioned + num_missing)
        skill_points = (num_strong * 1.0 + num_partial * 0.6 + num_mentioned * 0.25) / total_req_skills
        skills_score = round(min(20.0, skill_points * 20.0), 1)

        # 3. Experience Relevance (20 pts max)
        if resume.profile_type in ("student", "fresher"):
            # For students/freshers, evaluate projects and coursework depth without penalizing years of tenure
            proj_relevance_avg = (sum(p.relevance_score for p in project_analyses) / len(project_analyses)) if project_analyses else 70.0
            has_internship = any("intern" in e.title.lower() for e in resume.experience)
            exp_factor = (proj_relevance_avg / 100.0) * 0.8 + (0.2 if has_internship else 0.1)
            experience_score = round(min(20.0, exp_factor * 20.0), 1)
        else:
            # For experienced candidates, evaluate roles and relevance
            role_matches = 0
            job_title_words = (job.title or "").lower().split()
            for exp in resume.experience:
                if any(w in exp.title.lower() for w in job_title_words if len(w) > 3):
                    role_matches += 1
            exp_factor = min(1.0, 0.5 + (0.2 * len(resume.experience)) + (0.15 * role_matches))
            experience_score = round(min(20.0, exp_factor * 20.0), 1)

        # 4. Resume Structure & ATS Parseability (15 pts max)
        ats_score_norm = ats_report.parseability_score / 100.0
        ats_parseability_score = round(ats_score_norm * 15.0, 1)

        # 5. Content Quality (10 pts max)
        # Based on bullet point scores (action verbs, quantification, outcome)
        if bullet_analyses:
            avg_bullet_score = sum(b.score for b in bullet_analyses) / len(bullet_analyses)
            content_quality_score = round((avg_bullet_score / 100.0) * 10.0, 1)
        else:
            content_quality_score = 6.5

        # 6. Professional Presentation (5 pts max)
        pres_score = 5.0
        if ats_report.two_column_layout_detected:
            pres_score -= 0.5
        if ats_report.font_issues:
            pres_score -= 0.5
        if not resume.candidate.linkedin and not resume.candidate.github:
            pres_score -= 0.5
        presentation_score = round(max(2.0, pres_score), 1)

        # Total Calculation
        total = round(job_relevance_score + skills_score + experience_score + ats_parseability_score + content_quality_score + presentation_score)
        total_clamped = max(10, min(99, int(total)))

        # Tier Assignment
        if total_clamped >= 80:
            tier = "STRONG MATCH"
        elif total_clamped >= 60:
            tier = "MODERATE MATCH"
        else:
            tier = "NEEDS IMPROVEMENT"

        breakdown = ScoreBreakdown(
            job_relevance=job_relevance_score,
            skills_competency=skills_score,
            experience_relevance=experience_score,
            ats_parseability=ats_parseability_score,
            content_quality=content_quality_score,
            professional_presentation=presentation_score,
            total_score=total_clamped,
            tier=tier
        )

        # Executive Summary Findings
        exec_summary = []
        exec_summary.append(f"AI-estimated ATS compatibility stands at {total_clamped}/100, placing this application in the '{tier}' category.")
        if num_strong >= 3:
            exec_summary.append(f"Identified strong practical demonstration across {num_strong} primary competencies.")
        if num_missing > 0:
            exec_summary.append(f"Detected {num_missing} required competency gaps that require attention.")
        if ats_report.parseability_score >= 85:
            exec_summary.append("Document structure is cleanly parseable by modern Applicant Tracking Systems.")
        else:
            exec_summary.append("Formatting risks (e.g. columns, tables, or layout density) may impede automated extraction.")

        # Strengths
        strengths = []
        if job_relevance_score >= 23:
            strengths.append("High contextual alignment between candidate background and job requirements.")
        if num_strong >= 3:
            strengths.append(f"Demonstrated applied experience with {', '.join(skills_analysis['strongly_demonstrated'][:3])}.")
        if any(b.is_quantified for b in bullet_analyses):
            strengths.append("Contains quantified impact metrics illustrating measurable candidate outcomes.")
        if ats_report.parseability_score >= 88:
            strengths.append("Excellent ATS parseability with clear section hierarchy and single-column readability.")

        # Weaknesses
        weaknesses = []
        if num_missing > 0:
            weaknesses.append(f"Missing core competencies: {', '.join(skills_analysis['missing'][:3])}.")
        if num_mentioned > 0:
            weaknesses.append(f"Skills mentioned without practical evidence: {', '.join(skills_analysis['mentioned_only'][:2])}.")
        if ats_report.two_column_layout_detected:
            weaknesses.append("Multi-column layout presents a risk of fragmented text extraction in legacy ATS.")
        if any(not b.is_quantified for b in bullet_analyses):
            weaknesses.append("Several experience bullet points lack quantifiable business or technical metrics.")

        return breakdown, exec_summary, strengths, weaknesses
