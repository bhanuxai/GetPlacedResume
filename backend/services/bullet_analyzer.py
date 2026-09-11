import re
import uuid
from typing import List, Dict, Any, Optional, Tuple
from models.schemas import BulletAnalysis, StructuredResume

STRONG_ACTION_VERBS = {
    # Engineering & Implementation
    "architected", "engineered", "developed", "built", "implemented", "deployed",
    "spearheaded", "orchestrated", "optimized", "accelerated", "scaled", "automated",
    "designed", "constructed", "configured", "integrated", "established", "streamlined",
    "refactored", "maintained", "modeled", "transformed", "migrated",
    # Evaluation, Testing & Benchmarking
    "validated", "evaluated", "tested", "benchmarked", "measured", "monitored",
    "assessed", "verified", "analyzed", "profiled", "audited", "debugged",
    # Optimization & Impact
    "reduced", "increased", "boosted", "enhanced", "improved", "maximized",
    "minimized", "expanded", "curated",
    # Research & Machine Learning
    "trained", "fine-tuned", "tuned", "extracted", "retrieved", "indexed",
    "tokenized", "authored", "published", "formulated", "created", "delivered",
    "generated", "executed", "conducted"
}

WEAK_OPENINGS = [
    "responsible for", "worked on", "helped with", "assisted in", "involved in",
    "handled", "participated in", "duties included", "tasked with", "served as", "contributed to"
]

METRIC_PATTERNS = [
    (
        "TEST_COVERAGE",
        re.compile(r"\b\d+\s+(?:automated\s+)?(?:pytest|unit\s*test|integration\s*test|test|regression)?\s*cases?\b", re.IGNORECASE)
    ),
    (
        "ENGINEERING",
        re.compile(r"\b\d+\s+(?:recommendation|matching|ranking|search|scoring)?\s*signals?\b|\b\d+\s+(?:rest\s+)?(?:apis?|endpoints?|microservices?|services?|models?|layers?|pipelines?)\b", re.IGNORECASE)
    ),
    (
        "SCALE",
        re.compile(r"\b(?:\d+(?:\.\d+)?[KkMmBb]\+?|\d{1,3}(?:,\d{3})+\+?|\d+\+?)\s*(?:customers?|users?|clients?|accounts?|tenants?|candidate\s+profiles?)\b", re.IGNORECASE)
    ),
    (
        "DATA_VOLUME",
        re.compile(r"\b(?:\d+(?:\.\d+)?[KkMmBb]\+?|\d{1,3}(?:,\d{3})+\+?|\d+\+?)\s*(?:order\s+items?|orders?|products?|items?|records?|queries|requests|documents?|rows?|samples?|examples?|headlines?)\b|\b\d+\s*(?:gb|tb|mb|kb|pb)\b", re.IGNORECASE)
    ),
    (
        "PERFORMANCE",
        re.compile(r"\b(?:sub-?)?\d+(?:\.\d+)?\s*(?:ms|milliseconds?|seconds?|mins?|minutes?|hours?|rps|rpm|qps)\b|\b\d+(?:\.\d+)?x\b", re.IGNORECASE)
    ),
    (
        "BUSINESS_IMPACT",
        re.compile(r"\b\d+(?:\.\d+)?%\s*(?:f1(?:-score)?|accuracy|precision|recall|improvement|reduction|increase|boost|savings?|growth|conversion|shortlist)?\b|\$\d+(?:,\d{3})*(?:\.\d+)?\b", re.IGNORECASE)
    ),
    (
        "USAGE",
        re.compile(r"\b\d+\s*[-–—]\s*\d+\s*(?:normalized\s+)?scores?\b|\b\d+[-–—]dimensional\b", re.IGNORECASE)
    )
]

class BulletAnalyzer:
    """
    Evaluates individual bullet points against the Action + What + How + Result framework.
    Identifies verb strength, multi-category quantification, technical depth, and generates strictly grounded rewrites.
    """

    @classmethod
    def detect_metrics(cls, text: str) -> Tuple[bool, Optional[str], List[str]]:
        found_elements = []
        primary_category = None

        for category, pattern in METRIC_PATTERNS:
            for m in pattern.finditer(text):
                val = m.group(0).strip()
                if val:
                    if not primary_category:
                        primary_category = category
                    found_elements.append(val)

        # Fallback numeric detection for ranges or percentages e.g. "93.4%", "0-100"
        if not found_elements:
            for m in re.finditer(r"\b\d+(?:\.\d+)?%|\b\d+\+?\s*(?:ms|seconds|minutes|users|records|orders)\b", text, re.IGNORECASE):
                val = m.group(0).strip()
                if val:
                    found_elements.append(val)
                    primary_category = "PERFORMANCE"

        unique_elements = list(dict.fromkeys(found_elements))
        return bool(unique_elements), primary_category, unique_elements

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
        has_strong_verb = first_word in STRONG_ACTION_VERBS or first_word.replace("-", "") in STRONG_ACTION_VERBS
        action_verb = first_word if has_strong_verb else (words[0] if words else None)

        is_weak_opening = any(clean_text.lower().startswith(w) for w in WEAK_OPENINGS)

        # Multi-category quantification check
        is_quantified, metric_cat, quant_elements = cls.detect_metrics(clean_text)

        # Check outcome indicators
        outcome_indicators = [
            "resulting in", "improving", "reducing", "increasing", "to enable",
            "which achieved", "saving", "yielding", "accelerating", "achieving",
            "delivering", "enhancing", "optimizing", "reaching", "enabling"
        ]
        has_outcome = any(ind in clean_text.lower() for ind in outcome_indicators) or is_quantified

        # Technical substance evaluation
        tech_tokens = (
            "python", "pytorch", "tensorflow", "scikit-learn", "fastapi", "flask",
            "docker", "kubernetes", "faiss", "redis", "postgres", "sql", "aws",
            "transformer", "embeddings", "nlp", "llm", "pipeline", "api", "model",
            "latency", "pytest", "sentiment", "tfidf", "database", "microservice",
            "react", "architecture", "clustering", "vector", "cache"
        )
        tech_words_count = sum(1 for w in words if w.lower().strip(".,;:()") in tech_tokens)
        if tech_words_count >= 2 or len(words) >= 16:
            technical_substance = "High"
        elif tech_words_count == 1 or len(words) >= 10:
            technical_substance = "Medium"
        else:
            technical_substance = "Low"

        # 5-Axis Non-Binary Quality Evaluation:
        # Axis 1: Action Verb (max 20)
        if has_strong_verb:
            verb_score = 20
        elif is_weak_opening:
            verb_score = 5
        else:
            verb_score = 15

        # Axis 2: Technical Substance (max 20)
        if technical_substance == "High":
            substance_score = 20
        elif technical_substance == "Medium":
            substance_score = 16
        else:
            substance_score = 10

        # Axis 3: Implementation / Methodology (max 20)
        has_how = any(w in clean_text.lower() for w in ["using", "with", "via", "leveraging", "utilizing", "through", "by", "deploying", "implementing"])
        how_score = 20 if has_how else (16 if len(words) >= 12 else 12)

        # Axis 4: Result / Impact (max 20)
        if has_outcome:
            result_score = 20
        elif len(words) >= 14:
            result_score = 15
        else:
            result_score = 10

        # Axis 5: Quantification (max 20)
        # Note: An unquantified bullet gets 12/20 baseline so strong technical bullets are not crushed
        quant_score = 20 if is_quantified else 12

        total_score = verb_score + substance_score + how_score + result_score + quant_score
        score = max(25, min(98, total_score))

        # Assign Grade
        if score >= 85:
            grade = "A"
        elif score >= 70:
            grade = "B"
        elif score >= 55:
            grade = "C"
        else:
            grade = "D"

        # Generate strictly grounded recommendation and suggested revision
        recommendation, suggested_rev, rationale = cls._generate_revision(
            clean_text, is_weak_opening, has_strong_verb, is_quantified, technical_substance, technologies
        )

        return BulletAnalysis(
            id=bullet_id,
            original_text=clean_text,
            action_verb=action_verb,
            has_strong_verb=has_strong_verb,
            technical_substance=technical_substance,
            has_outcome=has_outcome,
            is_quantified=is_quantified,
            metric_category=metric_cat,
            quantified_elements=quant_elements,
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
        orig_clean = original.rstrip(".")
        words = orig_clean.split()
        first_word = words[0] if words else ""

        # Case 1: Passive or weak opening (e.g. "Worked on...", "Responsible for...")
        if is_weak:
            stripped = orig_clean
            for w in WEAK_OPENINGS:
                if stripped.lower().startswith(w):
                    stripped = stripped[len(w):].strip()
                    break
            
            # Grounded active transformation without fake claims
            tech_clause = f" using {', '.join(techs[:2])}" if techs else ""
            suggested = f"Developed and delivered {stripped}{tech_clause}."
            rationale = "Replaces passive duty phrasing with an authoritative action verb while preserving the candidate's exact technical scope."
            recommendation = "Reframe from a generic task description to an active achievement ('Action + What + Outcome')."
            return recommendation, suggested, rationale

        # Case 2: Already has a strong action verb (e.g. "Validated the interconnected workflow...")
        if has_strong:
            if not quantified:
                recommendation = "Strong action-oriented structure. If available, add an empirical verification metric (e.g., test pass rate, dataset volume, or latency)."
                rationale = "Bullet exhibits strong engineering ownership and technical depth; adding a verified metric provides additional empirical proof."
                # Do NOT hallucinate metrics or append fake outcomes
                return recommendation, None, rationale
            else:
                return (
                    "Well-structured bullet point meeting the Action + What + Result criteria.",
                    None,
                    "Strong structure with high-impact action verb, verified technical context, and quantifiable outcome."
                )

        # Case 3: Missing a prominent strong action verb (starts with a noun, adjective, or unlisted verb)
        # Check if first word is a verb-like word
        if first_word.endswith("ed") or first_word.endswith("ing"):
            # Already verb-like; do NOT prepend mechanically!
            base_verb = first_word.capitalize()
            suggested = None
            recommendation = f"Ensure the opening verb '{base_verb}' clearly emphasizes engineering ownership."
            rationale = "Maintains candidate phrasing without grammatically invalid verb duplication."
            return recommendation, suggested, rationale

        # If opening without an action verb (e.g., "Feature for semantic matching...")
        suggested = f"Engineered {orig_clean[0].lower() + orig_clean[1:] if len(orig_clean) > 1 else orig_clean}."
        rationale = "Anchors the bullet with an authoritative technical action verb."
        recommendation = "Begin the bullet with an action verb (e.g., Engineered, Implemented, or Architected)."
        return recommendation, suggested, rationale

