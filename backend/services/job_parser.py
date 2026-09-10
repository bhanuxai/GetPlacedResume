import re
import uuid
from typing import List, Optional, Tuple, Dict, Any
from models.schemas import StructuredJob, JobRequirement

class JobParser:
    """
    Analyzes job description text with an explainable multi-stage pipeline:
    1. Normalization & safe bullet prefix cleaning (retaining numeric experience values).
    2. Section heading detection and state machine.
    3. Metadata extraction (Company, Location, Work mode, Salary, Job title).
    4. Context detection (intro paragraphs, company missions, recruiting invitations).
    5. Candidate requirement & responsibility classification.
    6. Strict separation of scorable candidate requirements from non-scorable items.
    """

    REQUIRED_INDICATORS = [
        "must have", "required", "requirements", "minimum qualifications", "essential",
        "proven experience", "proficient in", "experience with", "expertise in", "hands-on experience",
        "basic qualifications", "what we're looking for", "what you'll need"
    ]

    PREFERRED_INDICATORS = [
        "preferred", "nice to have", "plus", "bonus", "desirable", "good to have",
        "optional", "would be an asset", "advantageous", "desired qualifications"
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

    @staticmethod
    def clean_bullet(line: str) -> str:
        """
        Strips bullet symbols and numbered list prefixes while strictly preserving
        leading numbers in numeric expressions like '2+ years', '1-3 years', '3D'.
        """
        # 1. Strip standard bullet symbols
        s = re.sub(r"^[\s•\-\*–—▪►✔✓\t]+", "", line).strip()
        # 2. Strip numbered list markers like "1. ", "1) ", "(1) ", "1: ", "1 - "
        # Only strips digits when followed by punctuation and whitespace (list syntax)
        s = re.sub(r"^\(?\d{1,2}[\.\)\:\-]\s+", "", s).strip()
        # 3. Strip any secondary bullet symbol left after list number (e.g. "1. • ")
        s = re.sub(r"^[\s•\-\*–—▪►✔✓\t]+", "", s).strip()
        return s

    @staticmethod
    def extract_min_years(text: str) -> Optional[float]:
        """
        Extracts minimum years of experience from various common phrasing formats.
        Supports: '2+ years', '3+ years', '1-3 years', '2 years', 'minimum 2 years',
        'at least 2 years', '2 years of experience', '2–4 years'.
        """
        text_clean = text.lower()
        # Pattern 1: range like "1-3 years", "2–4 years", "2 to 4 years"
        range_match = re.search(r"\b(\d+(?:\.\d+)?)\s*(?:[-–—]|to)\s*\d+(?:\.\d+)?\s*(?:years?|yrs?)\b", text_clean)
        if range_match:
            return float(range_match.group(1))

        # Pattern 2: "at least X years", "minimum [of] X years", "min X years"
        min_match = re.search(r"\b(?:minimum(?:\s*of)?|at\s*least|min\.?)\s*(\d+(?:\.\d+)?)\s*(?:years?|yrs?)\b", text_clean)
        if min_match:
            return float(min_match.group(1))

        # Pattern 3: "X+ years", "X+ yrs", "X years", "X yrs"
        plus_match = re.search(r"\b(\d+(?:\.\d+)?)\+?\s*(?:years?|yrs?)\b", text_clean)
        if plus_match:
            return float(plus_match.group(1))

        return None

    @classmethod
    def is_section_heading(cls, line: str) -> Tuple[bool, Optional[str]]:
        """
        Detects whether a line represents a section heading and returns the section type.
        """
        l = line.strip().lower()
        if len(l) > 65:
            return False, None

        # Responsibilities
        if re.match(r"^(?:responsibilities|what\s+you(?:'ll|\s+will)\s+do|key\s+responsibilities|core\s+responsibilities|duties|what\s+you'll\s+be\s+doing|in\s+this\s+role\s+you\s+will|essential\s+duties)\s*:?$", l):
            return True, "responsibilities"

        # About / Overview
        if re.match(r"^(?:about\s+(?:the\s+|this\s+)?(?:role|position|job|company|team|opportunity)|role\s+overview|position\s+overview|position\s+summary|who\s+we\s+are|company\s+overview|job\s+summary|the\s+opportunity)\s*:?$", l):
            return True, "about_role"

        # Preferred
        if re.match(r"^(?:preferred\s+qualifications|preferred\s+requirements|preferred\s+skills|nice\s+to\s+have|nice-to-have|bonus\s+points|bonus\s+qualifications|desired\s+qualifications|pluses|what\s+gives\s+you\s+an\s+edge)\s*:?$", l):
            return True, "preferred"

        # Required
        if re.match(r"^(?:required\s+qualifications|requirements|qualifications|minimum\s+qualifications|basic\s+qualifications|what\s+we(?:'re|\s+are)\s+looking\s+for|what\s+you(?:'ll|\s+will)\s+need|who\s+you\s+are|must\s+haves|candidate\s+profile)\s*:?$", l):
            return True, "required"

        # Benefits
        if re.match(r"^(?:benefits|what\s+we\s+offer|perks|compensation\s+&\s+benefits|why\s+join\s+us)\s*:?$", l):
            return True, "benefits"

        # Boilerplate / EEO
        if re.match(r"^(?:about\s+us|equal\s+opportunity|eeo\s+statement|how\s+to\s+apply)\s*:?$", l):
            return True, "boilerplate"

        # Generic short ending with colon
        if l.endswith(":") and len(l.split()) <= 4:
            if any(p in l for p in cls.PREFERRED_INDICATORS):
                return True, "preferred"
            if any(r in l for r in cls.REQUIRED_INDICATORS):
                return True, "required"
            if "responsib" in l or "duties" in l:
                return True, "responsibilities"
            if "about" in l or "overview" in l or "summary" in l:
                return True, "about_role"
            return True, "generic_heading"

        return False, None

    @classmethod
    def is_metadata_line(cls, line: str) -> Tuple[bool, Optional[str], Optional[str]]:
        """
        Detects job metadata (company, location, department, team, employment type, salary, etc.).
        Returns (is_meta, meta_type, value).
        """
        l = line.strip()
        # Company
        m = re.match(r"^(?:company(?:\s*name)?|employer|organization|client)\s*:\s*(.+)$", l, re.IGNORECASE)
        if m:
            return True, "company", m.group(1).strip()

        # Location
        m = re.match(r"^(?:location|work\s*location|based\s*in|job\s*location)\s*:\s*(.+)$", l, re.IGNORECASE)
        if m:
            return True, "location", m.group(1).strip()

        # Department / Team
        m = re.match(r"^(?:department|dept|team|business\s*unit|division|group)\s*:\s*(.+)$", l, re.IGNORECASE)
        if m:
            return True, "department", m.group(1).strip()

        # Employment Type / Job Type
        m = re.match(r"^(?:employment\s*type|job\s*type|position\s*type|role\s*type)\s*:\s*(.+)$", l, re.IGNORECASE)
        if m:
            return True, "employment_type", m.group(1).strip()

        # Work Mode / Workplace Type
        m = re.match(r"^(?:work\s*mode|workplace\s*type|work\s*arrangement|environment)\s*:\s*(.+)$", l, re.IGNORECASE)
        if m:
            return True, "work_mode", m.group(1).strip()

        # Salary / Pay / Compensation
        m = re.match(r"^(?:salary(?:\s*range)?|compensation|pay(?:\s*rate)?|hourly\s*rate|base\s*salary)\s*:\s*(.+)$", l, re.IGNORECASE)
        if m:
            return True, "salary", m.group(1).strip()

        # Job ID / Req ID / Posting ID
        m = re.match(r"^(?:job\s*id|req\s*id|requisition\s*id|posting\s*id|reference\s*(?:no|number|id)|job\s*code)\s*:\s*(.+)$", l, re.IGNORECASE)
        if m:
            return True, "job_id", m.group(1).strip()

        # Posting Date / Date Posted
        m = re.match(r"^(?:posting\s*date|date\s*posted|posted\s*on|closing\s*date|apply\s*by)\s*:\s*(.+)$", l, re.IGNORECASE)
        if m:
            return True, "posting_date", m.group(1).strip()

        # Recruiter / Contact / Application Instructions / Website
        m = re.match(r"^(?:recruiter|contact(?:\s*person)?|reports\s*to|hiring\s*manager|application\s*instructions?|website|url)\s*:\s*(.+)$", l, re.IGNORECASE)
        if m:
            return True, "recruiter_contact", m.group(1).strip()

        return False, None, None

    @classmethod
    def is_context_line(cls, line: str, current_section: str) -> bool:
        """
        Detects introductory, recruiting, or company-mission context that should not be scored.
        """
        l = line.strip().lower()
        if re.match(r"^(?:we\s+(?:are|'re)\s+(?:seeking|looking\s+for|hiring|building|excited\s+to)|seeking\s+an?\b|looking\s+for\s+an?\b|our\s+team\s+is|join\s+our\b|who\s+we\s+are\b|founded\s+in\b|in\s+this\s+role\s+you\s+will)", l):
            return True

        if current_section in ("about_role", "boilerplate") and not line.strip().startswith(("•", "-", "*")):
            # Long narrative overview without explicit requirement markers
            has_req_marker = any(k in l for k in ["bachelor", "master", "proficiency", "must have", "required", "years of", "hands-on experience"])
            if not has_req_marker:
                return True

        return False

    @classmethod
    def is_boilerplate_line(cls, line: str) -> bool:
        """
        Identifies legal statements, benefits, or application instructions.
        """
        l = line.lower()
        if re.search(r"\b(?:equal\s+opportunity\s+employer|affirmative\s+action|without\s+regard\s+to\s+race|protected\s+veteran|reasonable\s+accommodation)\b", l):
            return True
        if re.search(r"\b(?:401\(k\)|health\s+insurance|dental|vision|unlimited\s+pto|parental\s+leave|commuter\s+benefits)\b", l):
            return True
        if re.search(r"\b(?:to\s+apply[,\s]|click\s+here\s+to\s+apply|submit\s+your\s+resume\s+(?:to|at)|send\s+applications\s+to)\b", l):
            return True
        return False

    @classmethod
    def classify_item(cls, raw_line: str, current_section: str = "required", is_header_line: bool = False) -> JobRequirement:
        """
        Classifies an isolated line into an explainable JobRequirement object with scorable flag.
        Used for both end-to-end parsing and direct regression testing.
        """
        req_id = f"req_{uuid.uuid4().hex[:8]}"
        clean = cls.clean_bullet(raw_line)
        line_lower = clean.lower()

        # 1. Check if line is metadata
        is_meta, meta_type, meta_val = cls.is_metadata_line(raw_line)
        if is_meta:
            return JobRequirement(
                id=req_id,
                text=clean,
                category="metadata",
                importance="bonus",
                priority="metadata",
                source_section="metadata",
                scorable=False
            )

        # 2. Check if line is a job title line
        if is_header_line and any(w in line_lower for w in ["engineer", "developer", "scientist", "analyst", "architect", "manager", "intern", "specialist"]):
            if not any(k in line_lower for k in ["experience", "degree", "proficiency", "years"]):
                return JobRequirement(
                    id=req_id,
                    text=clean,
                    category="metadata",
                    importance="bonus",
                    priority="metadata",
                    source_section="header",
                    scorable=False
                )

        # 3. Check if line is a section heading
        is_heading, heading_type = cls.is_section_heading(raw_line)
        if is_heading:
            return JobRequirement(
                id=req_id,
                text=clean,
                category="section_heading",
                importance="bonus",
                priority="metadata",
                source_section=heading_type or "heading",
                scorable=False
            )

        # 4. Check if line is boilerplate or benefits
        if cls.is_boilerplate_line(clean) or current_section in ("benefits", "boilerplate"):
            return JobRequirement(
                id=req_id,
                text=clean,
                category="boilerplate",
                importance="bonus",
                priority="context",
                source_section=current_section,
                scorable=False
            )

        # 5. Check if line is context / intro blurb
        if cls.is_context_line(clean, current_section):
            return JobRequirement(
                id=req_id,
                text=clean,
                category="context",
                importance="bonus",
                priority="context",
                source_section=current_section,
                scorable=False
            )

        # 6. Candidate evaluatable requirement
        min_years = cls.extract_min_years(clean)
        keywords = [t for t in cls.TECH_KEYWORDS if re.search(rf"\b{re.escape(t)}\b", line_lower)]

        is_preferred = (current_section == "preferred" or any(p in line_lower for p in cls.PREFERRED_INDICATORS))
        is_resp = (current_section == "responsibilities" or (not is_preferred and re.match(r"^(?:architect|engineer|develop|build|design|implement|deploy|lead|drive|collaborate|partner|scale|maintain|create|benchmark|own|monitor)\b", line_lower)))

        if is_preferred:
            category = "preferred_qualification"
            importance = "preferred"
            priority = "preferred"
        elif is_resp:
            category = "responsibility"
            importance = "responsibility"
            priority = "responsibility"
        elif re.search(r"\b(?:bachelor|master|degree|computer\s+science|data\s+science|ph\.?d|education|diploma|stem\s+field)\b", line_lower):
            category = "education"
            importance = "required"
            priority = "required"
        elif min_years is not None or re.search(r"\b(?:years?(?:\s*of)?\s*(?:practical|professional|hands-on|industry|work)?\s*experience|track\s*record\s*of|background\s*in)\b", line_lower):
            category = "experience"
            importance = "required"
            priority = "required"
        elif re.search(r"\b(?:certification|certified|aws\s+certified|pmp|license)\b", line_lower):
            category = "certification"
            importance = "required"
            priority = "required"
        else:
            category = "required_qualification"
            importance = "required"
            priority = "required"

        return JobRequirement(
            id=req_id,
            text=clean,
            category=category,
            importance=importance,
            priority=priority,
            source_section=current_section,
            keywords=keywords,
            scorable=True,
            minimum_years=min_years
        )

    @classmethod
    def parse(cls, jd_text: str) -> StructuredJob:
        lines = [l.strip() for l in jd_text.split("\n") if l.strip()]
        title = cls.extract_title(lines)
        company = None
        location = None
        department = None
        employment_type = None
        work_mode = None

        all_items: List[JobRequirement] = []
        requirements: List[JobRequirement] = []
        required_skills: List[str] = []
        preferred_skills: List[str] = []

        current_section = "metadata"

        for idx, line in enumerate(lines):
            # Check for metadata
            is_meta, meta_type, meta_val = cls.is_metadata_line(line)
            if is_meta:
                if meta_type == "company" and not company:
                    company = meta_val
                elif meta_type == "location" and not location:
                    location = meta_val
                    if "hybrid" in meta_val.lower():
                        work_mode = "Hybrid"
                    elif "remote" in meta_val.lower():
                        work_mode = "Remote"
                    elif "on-site" in meta_val.lower() or "onsite" in meta_val.lower():
                        work_mode = "On-site"
                elif meta_type == "department" and not department:
                    department = meta_val
                elif meta_type == "employment_type" and not employment_type:
                    employment_type = meta_val
                elif meta_type == "work_mode" and not work_mode:
                    work_mode = meta_val

                meta_req = JobRequirement(
                    id=f"req_{uuid.uuid4().hex[:8]}",
                    text=line,
                    category="metadata",
                    importance="bonus",
                    priority="metadata",
                    source_section="metadata",
                    scorable=False
                )
                all_items.append(meta_req)
                continue

            # Check if this line is the job title at the top
            if idx <= 1 and title and title in line:
                title_req = JobRequirement(
                    id=f"req_{uuid.uuid4().hex[:8]}",
                    text=line,
                    category="metadata",
                    importance="bonus",
                    priority="metadata",
                    source_section="header",
                    scorable=False
                )
                all_items.append(title_req)
                continue

            # Check section heading
            is_heading, heading_type = cls.is_section_heading(line)
            if is_heading:
                current_section = heading_type or "required"
                heading_req = JobRequirement(
                    id=f"req_{uuid.uuid4().hex[:8]}",
                    text=line,
                    category="section_heading",
                    importance="bonus",
                    priority="metadata",
                    source_section=heading_type or "heading",
                    scorable=False
                )
                all_items.append(heading_req)
                continue

            # Classify candidate item
            item = cls.classify_item(line, current_section=current_section, is_header_line=(idx <= 2))
            all_items.append(item)

            if item.scorable:
                requirements.append(item)
                if item.priority == "preferred" or item.category == "preferred_qualification":
                    preferred_skills.extend(item.keywords)
                elif item.priority == "required":
                    required_skills.extend(item.keywords)

        # Extract overall minimum experience
        exp_match = re.search(r"(\d+)\+?\s*(?:to\s*(\d+))?\s*years?(?:\s*of)?\s*experience", jd_text, re.IGNORECASE)
        min_exp = float(exp_match.group(1)) if exp_match else None

        # Extract education level
        edu_level = None
        if re.search(r"\bph\.?d\b", jd_text, re.IGNORECASE):
            edu_level = "Ph.D."
        elif re.search(r"\b(?:master'?s|m\.?s)\b", jd_text, re.IGNORECASE):
            edu_level = "Master's Degree"
        elif re.search(r"\b(?:bachelor'?s|b\.?s|b\.?tech|undergraduate)\b", jd_text, re.IGNORECASE):
            edu_level = "Bachelor's Degree"

        return StructuredJob(
            title=title or "Target Position",
            company=company,
            location=location,
            department=department,
            employment_type=employment_type,
            work_mode=work_mode,
            summary=lines[0] if lines else "",
            requirements=requirements,
            all_items=all_items,
            required_skills=list(set(required_skills)),
            preferred_skills=list(set(preferred_skills)),
            min_experience_years=min_exp,
            education_level=edu_level,
            raw_text=jd_text
        )

    @classmethod
    def extract_title(cls, lines: List[str]) -> Optional[str]:
        for line in lines[:4]:
            if cls.is_metadata_line(line)[0] or cls.is_section_heading(line)[0]:
                continue
            if any(w in line.lower() for w in ["engineer", "developer", "scientist", "analyst", "architect", "manager", "intern", "specialist"]):
                return line.split("|")[0].strip()
        return None

