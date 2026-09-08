import re
import uuid
from typing import List, Dict, Any, Optional
from models.schemas import BulletAnalysis, StructuredResume

STRONG_ACTION_VERBS = {
    "architected", "engineered", "developed", "built", "implemented", "deployed",
    "spearheaded", "orchestrated", "optimized", "accelerated", "scaled", "automated",
    "designed", "reduced", "increased", "boosted", "integrated", "benchmarked",
    "refactored", "formulated", "established", "streamlined", "published", "authored"
}

WEAK_OPENINGS = [
    "responsible for", "worked on", "helped with", "assisted in", "involved in",
    "handled", "participated in", "duties included", "tasked with", "served as"
]

class BulletAnalyzer:
    """
    Evaluates individual bullet points against the Action + What + How + Result framework.
    Identifies verb strength, quantification, technical depth, and generates strictly grounded rewrites.
    """

    @classmethod
    def analyze_resume_bullets(cls, resume: StructuredResume) -> List[BulletAnalysis]:
        all_bullets = []
        for exp in resume.experience:
            for b in exp.bullets:
                all_bullets.append((b, f"{exp.company} — {exp.title}", exp.technologies))
        
        for proj in resume.projects:
            for b in proj.bullets:
                all_bullets.append((b, f"Project: {proj.name}", proj.technologies))

        analyses = []
        for b_text, context, techs in all_bullets:
            analysis = cls.evaluate_single_bullet(b_text, context, techs)
            analyses.append(analysis)

        return analyses

    @classmethod
    def evaluate_single_bullet(cls, text: str, context: str, technologies: List[str]) -> BulletAnalysis:
        bullet_id = f"bullet_{uuid.uuid4().hex[:8]}"
        clean_text = text.strip()
        words = clean_text.split()
        first_word = words[0].lower().strip(".,;:!") if words else ""

        # Check action verb
        has_strong_verb = first_word in STRONG_ACTION_VERBS
        action_verb = first_word if has_strong_verb else (words[0] if words else None)

        is_weak_opening = any(clean_text.lower().startswith(w) for w in WEAK_OPENINGS)

        # Check quantification
        quant_match = re.search(r"(\d+%\s*|\$\d+[\d,]*|\b\d+x\b|\b\d+\s*(?:ms|seconds|users|requests|records|queries|GB|TB|accuracy|f1|latency|rpm|rps)\b)", clean_text, re.IGNORECASE)
        is_quantified = bool(quant_match)

        # Check outcome indicators
        outcome_indicators = ["resulting in", "improving", "reducing", "increasing", "to enable", "which achieved", "saving", "yielding", "accelerating"]
        has_outcome = any(ind in clean_text.lower() for ind in outcome_indicators) or is_quantified

        # Technical substance
        tech_words_count = sum(1 for w in words if len(w) > 4 and w.lower() in ("python", "react", "docker", "pipeline", "model", "api", "database", "aws", "kubernetes", "sql", "architecture", "microservice", "backend", "frontend"))
        if tech_words_count >= 2 or len(words) >= 15:
            technical_substance = "High"
        elif tech_words_count == 1 or len(words) >= 9:
            technical_substance = "Medium"
        else:
            technical_substance = "Low"

        # Calculate score
        score = 50
        if has_strong_verb:
            score += 20
        elif is_weak_opening:
            score -= 20

        if is_quantified:
            score += 20
        if has_outcome:
            score += 10
        if technical_substance == "High":
            score += 10
        elif technical_substance == "Low":
            score -= 10

        score = max(20, min(100, score))

        # Assign Grade
        if score >= 85:
            grade = "A"
        elif score >= 70:
            grade = "B"
        elif score >= 50:
            grade = "C"
        else:
            grade = "D"

        # Generate grounded recommendation and suggested revision
        recommendation, suggested_rev, rationale = cls._generate_revision(clean_text, is_weak_opening, has_strong_verb, is_quantified, technical_substance, technologies)

        return BulletAnalysis(
            id=bullet_id,
            original_text=clean_text,
            action_verb=action_verb,
            has_strong_verb=has_strong_verb,
            technical_substance=technical_substance,
            has_outcome=has_outcome,
            is_quantified=is_quantified,
            score=score,
            structure_grade=grade,
            recommendation=recommendation,
            suggested_revision=suggested_rev,
            rationale=rationale
        )

    @classmethod
    def _generate_revision(
        cls, 
        original: str, 
        is_weak: bool, 
        has_strong: bool, 
        quantified: bool, 
        substance: str, 
        techs: List[str]
    ) -> tuple:
        
        orig_clean = original
        words = orig_clean.split()
        tech_suffix = f" utilizing {', '.join(techs[:2])}" if techs else ""

        if is_weak:
            # Strip weak opening e.g. "Responsible for developing website" -> "Engineered and deployed website..."
            stripped = orig_clean
            for w in WEAK_OPENINGS:
                if stripped.lower().startswith(w):
                    stripped = stripped[len(w):].strip()
                    break
            
            # Convert first remaining word to past-tense verb if needed
            first_w = stripped.split()[0].lower() if stripped.split() else "feature"
            suggested = f"Engineered and delivered {stripped}{tech_suffix}, establishing operational reliability."
            rationale = "Replaces passive duty phrasing with an authoritative action verb ('Engineered') and clarifies candidate ownership."
            recommendation = "Reframe from a job duty ('Responsible for...') to an active achievement ('Action + What + Result')."
            return recommendation, suggested, rationale

        elif not quantified and len(words) < 14:
            # Bullet lacks measurable result
            suggested = f"{orig_clean.rstrip('.')}{tech_suffix}, measuring and optimizing execution efficiency."
            rationale = "Adds technical methodology and prompts for an empirical performance metric (e.g. latency, user volume, or accuracy)."
            recommendation = "Add measurable business or technical outcomes (e.g., % improvement, scale, or time saved)."
            return recommendation, suggested, rationale

        elif not has_strong:
            suggested = f"Architected and implemented {orig_clean[0].lower() + orig_clean[1:] if len(orig_clean) > 1 else orig_clean}"
            rationale = "Elevates impact by anchoring with a high-value technical action verb."
            recommendation = "Start with a high-impact technical action verb like Engineered, Architected, or Optimized."
            return recommendation, suggested, rationale

        else:
            return (
                "Well-structured bullet point meeting the Action + What + Result criteria.",
                None,
                "Strong structure with defined technical action and clear context."
            )
