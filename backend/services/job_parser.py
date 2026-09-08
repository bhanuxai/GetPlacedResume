import re
import uuid
from typing import List, Optional
from models.schemas import StructuredJob, JobRequirement

class JobParser:
    """
    Analyzes job description text to extract categorized requirements,
    distinguishing required vs preferred, experience thresholds, education, and domain competencies.
    """

    REQUIRED_INDICATORS = [
        "must have", "required", "requirements", "minimum qualifications", "essential",
        "proven experience", "proficient in", "experience with", "expertise in", "hands-on experience"
    ]

    PREFERRED_INDICATORS = [
        "preferred", "nice to have", "plus", "bonus", "desirable", "good to have",
        "optional", "would be an asset", "advantageous"
    ]

    TECH_KEYWORDS = [
        "python", "java", "c++", "c#", "golang", "rust", "javascript", "typescript",
        "react", "angular", "vue", "node.js", "django", "fastapi", "flask", "spring boot",
        "sql", "postgresql", "mysql", "mongodb", "redis", "elasticsearch",
        "aws", "azure", "gcp", "docker", "kubernetes", "terraform", "ci/cd", "git",
        "machine learning", "deep learning", "nlp", "computer vision", "llm", "transformers",
        "pytorch", "tensorflow", "scikit-learn", "pandas", "numpy", "spark", "hadoop",
        "rest api", "graphql", "microservices", "distributed systems", "kafka"
    ]

    @classmethod
    def parse(cls, jd_text: str) -> StructuredJob:
        lines = [l.strip() for l in jd_text.split("\n") if l.strip()]
        title = cls.extract_title(lines)
        requirements = []
        required_skills = []
        preferred_skills = []

        current_mode = "required"
        
        for line in lines:
            line_lower = line.lower()

            # Mode switcher based on headers
            if any(p in line_lower for p in cls.PREFERRED_INDICATORS) and len(line) < 60:
                current_mode = "preferred"
                continue
            elif any(r in line_lower for r in cls.REQUIRED_INDICATORS) and len(line) < 60:
                current_mode = "required"
                continue

            # Strip leading bullet indicators
            clean_line = re.sub(r"^[\s•\-\*–—\d\.\)]+", "", line).strip()
            if not clean_line or len(clean_line) < 8:
                continue

            # Determine category
            category = cls.classify_line(clean_line)
            importance = "preferred" if (current_mode == "preferred" or any(p in line_lower for p in cls.PREFERRED_INDICATORS)) else "required"

            # Keywords
            keywords = [t for t in cls.TECH_KEYWORDS if re.search(rf"\b{re.escape(t)}\b", line_lower)]

            req_id = f"req_{uuid.uuid4().hex[:8]}"
            requirements.append(JobRequirement(
                id=req_id,
                text=clean_line,
                category=category,
                importance=importance,
                keywords=keywords
            ))

            if category in ("required_skill", "tool") or (keywords and importance == "required"):
                required_skills.extend(keywords)
            elif category == "preferred_skill" or (keywords and importance == "preferred"):
                preferred_skills.extend(keywords)

        # Min experience
        exp_match = re.search(r"(\d+)\+?\s*(?:to\s*(\d+))?\s*years?(?:\s*of)?\s*experience", jd_text, re.IGNORECASE)
        min_exp = float(exp_match.group(1)) if exp_match else None

        # Education level
        edu_level = None
        if re.search(r"ph\.?d", jd_text, re.IGNORECASE):
            edu_level = "Ph.D."
        elif re.search(r"master'?s|m\.?s", jd_text, re.IGNORECASE):
            edu_level = "Master's Degree"
        elif re.search(r"bachelor'?s|b\.?s|b\.?tech|undergraduate", jd_text, re.IGNORECASE):
            edu_level = "Bachelor's Degree"

        return StructuredJob(
            title=title or "Target Position",
            summary=lines[0] if lines else "",
            requirements=requirements,
            required_skills=list(set(required_skills)),
            preferred_skills=list(set(preferred_skills)),
            min_experience_years=min_exp,
            education_level=edu_level,
            raw_text=jd_text
        )

    @classmethod
    def extract_title(cls, lines: List[str]) -> Optional[str]:
        # Search for job title in the first 3 lines
        for line in lines[:4]:
            if any(w in line.lower() for w in ["engineer", "developer", "scientist", "analyst", "architect", "manager", "intern", "specialist"]):
                return line.split("|")[0].strip()
        return None

    @classmethod
    def classify_line(cls, text: str) -> str:
        text_lower = text.lower()
        if re.search(r"(?:bachelor|master|degree|computer science|phd|education|diploma)", text_lower):
            return "education"
        if re.search(r"(?:years?(?:\s*of)?\s*experience|track record|background in)", text_lower):
            return "experience"
        if re.search(r"(?:certification|certified|aws certified|pmp)", text_lower):
            return "certification"
        if re.search(r"(?:communication|collaboration|team player|leadership|problem-solving|self-starter|verbal)", text_lower):
            return "soft_skill"
        if re.search(r"(?:responsible for|collaborate with|participate in|drive|lead|own|manage)", text_lower):
            return "responsibility"
        if any(p in text_lower for p in ["preferred", "nice to have", "plus", "bonus"]):
            return "preferred_skill"
        if any(t in text_lower for t in ["python", "sql", "aws", "docker", "react", "kubernetes", "c++", "pytorch", "database"]):
            return "required_skill"
        return "domain"
