import uuid
from typing import List, Dict, Any
from models.schemas import (
    Recommendation, ImprovementSuggestion, StructuredResume, StructuredJob,
    ScoreBreakdown, ATSFormatReport, BulletAnalysis
)

class RecommendationEngine:
    """
    Synthesizes actionable, prioritized recommendations and grounded bullet rewrites
    based on ATS gaps, missing competencies, and bullet structure evaluations.
    """

    @classmethod
    def generate_recommendations(
        cls,
        resume: StructuredResume,
        job: StructuredJob,
        breakdown: ScoreBreakdown,
        skills_analysis: Dict[str, List[str]],
        ats_report: ATSFormatReport,
        bullet_analyses: List[BulletAnalysis]
    ) -> List[Recommendation]:
        
        recs = []

        # 1. Missing Core Skills (High Priority)
        missing = skills_analysis.get("missing", [])
        if missing:
            recs.append(Recommendation(
                id=f"rec_{uuid.uuid4().hex[:8]}",
                priority="HIGH",
                category="Competency Gap",
                title=f"Address Missing Core Competencies: {', '.join(missing[:3])}",
                description=f"The job requires or emphasizes {', '.join(missing[:3])}, but no direct or transferable evidence was identified in your resume.",
                action_item="Incorporate relevant coursework, personal lab projects, or open-source contributions utilizing these technologies."
            ))

        # 2. Mentioned But Not Demonstrated (High Priority)
        mentioned = skills_analysis.get("mentioned_only", [])
        if mentioned:
            recs.append(Recommendation(
                id=f"rec_{uuid.uuid4().hex[:8]}",
                priority="HIGH",
                category="Evidence Gap",
                title=f"Provide Practical Evidence for {', '.join(mentioned[:2])}",
                description=f"You listed {', '.join(mentioned[:2])} in your skills section, but recruiters and ATS cannot see where or how you applied them.",
                action_item="Add at least one bullet point in your project or experience section detailing what you built with these tools."
            ))

        # 3. ATS Layout Hazards (High/Medium Priority)
        if ats_report.two_column_layout_detected:
            recs.append(Recommendation(
                id=f"rec_{uuid.uuid4().hex[:8]}",
                priority="HIGH",
                category="ATS Parseability",
                title="Convert Multi-Column Layout to Clean Single-Column",
                description="Two-column templates frequently cause ATS text scanners to jumble left and right content across the horizontal plane.",
                action_item="Adopt a clean single-column chronological layout with standard margins."
            ))

        if ats_report.tables_detected > 0:
            recs.append(Recommendation(
                id=f"rec_{uuid.uuid4().hex[:8]}",
                priority="MEDIUM",
                category="ATS Formatting",
                title="Remove Embedded Tables",
                description=f"Found {ats_report.tables_detected} table(s). Table borders and cells often flatten into fragmented strings during ATS ingestion.",
                action_item="Format skills and timelines using tabbed whitespace or bullet points instead of HTML/Word table cells."
            ))

        # 4. Bullet Quantification (Medium Priority)
        unquantified = [b for b in bullet_analyses if not b.is_quantified]
        if len(unquantified) >= 2:
            recs.append(Recommendation(
                id=f"rec_{uuid.uuid4().hex[:8]}",
                priority="MEDIUM",
                category="Content Quality",
                title="Quantify Project and Experience Outcomes",
                description=f"{len(unquantified)} of your bullet points describe duties without specifying measurable business or technical outcomes.",
                action_item="Use the Action + What + How + Result formula to add numbers (e.g., % latency reduction, dataset volume, or user engagement)."
            ))

        # 5. Missing Summary (Low Priority)
        if not resume.summary and resume.profile_type not in ("student", "fresher"):
            recs.append(Recommendation(
                id=f"rec_{uuid.uuid4().hex[:8]}",
                priority="LOW",
                category="Professional Presentation",
                title="Add a 2-Line Professional Summary",
                description="A concise summary immediately anchors the candidate's specialization and core technical domain for human recruiters.",
                action_item="Add a 2-3 sentence executive summary aligning your key technical strengths to the target role."
            ))

        return recs

    @classmethod
    def generate_fix_suggestions(
        cls,
        resume: StructuredResume,
        bullet_analyses: List[BulletAnalysis]
    ) -> List[ImprovementSuggestion]:
        
        suggestions = []

        # Find candidates for bullet rewrites
        for b in bullet_analyses:
            if b.suggested_revision and b.original_text != b.suggested_revision:
                suggestions.append(ImprovementSuggestion(
                    id=f"fix_{uuid.uuid4().hex[:8]}",
                    section="Experience / Projects",
                    original=b.original_text,
                    suggested=b.suggested_revision,
                    why=b.rationale or "Improves active voice and structural impact.",
                    impact="HIGH" if b.score < 55 else "MEDIUM",
                    status="PENDING"
                ))

        # Ensure we return at least 2-3 high quality suggestions
        if len(suggestions) < 2 and resume.projects:
            for p in resume.projects[:2]:
                if p.bullets:
                    b_orig = p.bullets[0]
                    techs = ", ".join(p.technologies[:2]) if p.technologies else "modern frameworks"
                    suggested = f"Architected and implemented {p.name} utilizing {techs}, optimizing computational efficiency and system reliability."
                    suggestions.append(ImprovementSuggestion(
                        id=f"fix_{uuid.uuid4().hex[:8]}",
                        section=f"Project: {p.name}",
                        original=b_orig,
                        suggested=suggested,
                        why="Transforms descriptive summary into a targeted, action-oriented engineering achievement.",
                        impact="HIGH",
                        status="PENDING"
                    ))

        return suggestions[:6]  # Return top 5-6 grounded suggestions
