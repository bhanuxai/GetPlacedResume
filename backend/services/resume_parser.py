import re
from typing import Dict, List, Any, Optional
from models.schemas import (
    ContactInfo, EducationItem, ExperienceItem, ProjectItem, SkillItem, StructuredResume
)

class ResumeParser:
    """
    Parses resume text into a rich structured representation, extracting
    sections, contact info, experience items, project details, skills, and profile classification.
    """

    SECTION_PATTERNS = {
        "summary": r"(?:professional\s+summary|profile|about\s+me|objective|executive\s+summary)",
        "experience": r"(?:work\s+experience|professional\s+experience|employment\s+history|experience)",
        "education": r"(?:education|academic\s+background|qualifications|academic\s+history)",
        "skills": r"(?:technical\s+skills|skills\s*(?:&|and)?\s*competencies|skills|technologies|tools|core\s+competencies)",
        "projects": r"(?:personal\s+projects|academic\s+projects|key\s+projects|projects)",
        "certifications": r"(?:certifications|certificates|licenses|courses)",
        "achievements": r"(?:honors\s*(?:&|and)?\s*awards|achievements|awards|accomplishments)",
        "publications": r"(?:publications|research\s+papers|conference\s+proceedings)",
        "leadership": r"(?:leadership|extracurricular\s+activities|volunteer\s+experience|activities)"
    }

    ACTION_VERBS = {
        "built", "developed", "created", "engineered", "designed", "architected",
        "implemented", "deployed", "spearheaded", "optimized", "accelerated",
        "reduced", "increased", "boosted", "scaled", "automated", "orchestrated",
        "authored", "integrated", "led", "managed", "trained", "tuned", "benchmarked"
    }

    @classmethod
    def parse(cls, raw_text: str, doc_meta: Optional[Dict[str, Any]] = None) -> StructuredResume:
        candidate = cls.extract_contact(raw_text)
        sections = cls.split_sections(raw_text)
        
        education = cls.parse_education(sections.get("education", ""))
        experience = cls.parse_experience(sections.get("experience", ""))
        projects = cls.parse_projects(sections.get("projects", ""))
        skills = cls.parse_skills(sections.get("skills", ""), experience, projects)
        certifications = cls.parse_list_items(sections.get("certifications", ""))
        achievements = cls.parse_list_items(sections.get("achievements", ""))
        summary = sections.get("summary", "").strip() or None

        profile_type = cls.classify_profile(raw_text, education, experience, projects)
        
        detected = list(sections.keys())
        missing_recommended = cls.get_missing_recommended_sections(detected, profile_type)

        return StructuredResume(
            candidate=candidate,
            summary=summary,
            education=education,
            experience=experience,
            projects=projects,
            skills=skills,
            certifications=certifications,
            achievements=achievements,
            detected_sections=detected,
            missing_recommended_sections=missing_recommended,
            profile_type=profile_type,
            raw_text=raw_text
        )

    @classmethod
    def extract_contact(cls, text: str) -> ContactInfo:
        # Email
        email_match = re.search(r"[\w\.-]+@[\w\.-]+\.\w+", text)
        email = email_match.group(0) if email_match else None

        # Phone
        phone_match = re.search(r"(?:\+?\d{1,3}[-.\s]?)?\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}", text)
        phone = phone_match.group(0) if phone_match else None

        # LinkedIn
        li_match = re.search(r"(?:https?://)?(?:www\.)?linkedin\.com/in/[\w\-\_]+/?", text, re.IGNORECASE)
        linkedin = li_match.group(0) if li_match else None

        # GitHub
        gh_match = re.search(r"(?:https?://)?(?:www\.)?github\.com/[\w\-\_]+/?", text, re.IGNORECASE)
        github = gh_match.group(0) if gh_match else None

        # Portfolio/Website
        web_match = re.search(r"(?:https?://)?(?:www\.)?[\w-]+\.(?:io|me|dev|app|ai|org)(?:/[\w-]*)?", text, re.IGNORECASE)
        portfolio = web_match.group(0) if (web_match and web_match.group(0) not in (linkedin or "") and web_match.group(0) not in (github or "")) else None

        # Name heuristic: First non-empty line of resume if reasonable length (< 45 chars) and doesn't contain contact tokens
        lines = [line.strip() for line in text.split("\n") if line.strip()]
        name = None
        for line in lines[:5]:
            if len(line) < 45 and not re.search(r"[@|github|linkedin|resume|curriculum|\d{3}]", line, re.IGNORECASE):
                name = line
                break

        return ContactInfo(
            name=name or "Candidate",
            email=email,
            phone=phone,
            linkedin=linkedin,
            github=github,
            portfolio=portfolio
        )

    @classmethod
    def split_sections(cls, text: str) -> Dict[str, str]:
        """
        Splits text into section blocks based on recognizable section headers.
        """
        # Find all header matches with their positions
        pattern_str = r"(?:^|\n)\s*([A-Z][A-Za-z\s&]{2,30})\s*(?:\n|:)"
        lines = text.split("\n")
        sections = {}
        current_section = "header"
        section_lines = {current_section: []}

        for line in lines:
            trimmed = line.strip()
            # Check if trimmed matches any known section header
            matched_sec = None
            for sec_key, sec_regex in cls.SECTION_PATTERNS.items():
                if re.fullmatch(sec_regex, trimmed, re.IGNORECASE):
                    matched_sec = sec_key
                    break

            if matched_sec:
                current_section = matched_sec
                if current_section not in section_lines:
                    section_lines[current_section] = []
            else:
                section_lines.setdefault(current_section, []).append(line)

        for sec, lns in section_lines.items():
            if sec != "header" and lns:
                sections[sec] = "\n".join(lns).strip()

        # If experience was not caught cleanly, look for common substrings
        return sections

    @classmethod
    def parse_education(cls, edu_text: str) -> List[EducationItem]:
        if not edu_text:
            return []
        items = []
        # Split by empty lines or double lines
        blocks = [b.strip() for b in edu_text.split("\n\n") if b.strip()]
        if not blocks:
            blocks = [edu_text]

        for block in blocks:
            lines = [l.strip() for l in block.split("\n") if l.strip()]
            inst = lines[0] if lines else "University"
            deg = None
            date_str = None
            gpa = None
            coursework = []

            for line in lines:
                if re.search(r"(?:bachelor|master|b\.s|m\.s|ph\.?d|b\.tech|b\.e|degree|diploma)", line, re.IGNORECASE):
                    deg = line
                if re.search(r"(?:20\d\d|19\d\d|present|expected)", line, re.IGNORECASE):
                    date_str = line
                gpa_m = re.search(r"(?:gpa|cgpa)[\s:]*([0-4]\.\d{1,2}|[0-9]\.\d{1,2}/10|[0-9]\.\d{1,2})", line, re.IGNORECASE)
                if gpa_m:
                    gpa = gpa_m.group(1)
                if "coursework" in line.lower() or "relevant courses" in line.lower():
                    coursework = [c.strip() for c in re.split(r"[,;•|]", line) if c.strip() and "coursework" not in c.lower()]

            items.append(EducationItem(
                institution=inst,
                degree=deg or inst,
                graduation_date=date_str,
                gpa=gpa,
                coursework=coursework
            ))
        return items

    BULLET_PREFIX_REGEX = re.compile(
        r"^(?:"
        r"[\u2022\u25cf\u25aa\u25a0\u25e6\u25cb\u00b7\uf0b7\uf0a7\u25ba\u25b8\u2023\u2714\u2713\*]"
        r"|(?:\(cid:\d+\))"
        r"|(?:[-–—]\s+)"
        r"|(?:\(?\d{1,2}[\.\)\:\-]\s+)"
        r")\s*"
    )

    @classmethod
    def is_bullet_line(cls, line: str) -> bool:
        trimmed = line.strip()
        return bool(cls.BULLET_PREFIX_REGEX.match(trimmed))

    @classmethod
    def strip_bullet_marker(cls, line: str) -> str:
        trimmed = line.strip()
        return cls.BULLET_PREFIX_REGEX.sub("", trimmed).strip()

    @classmethod
    def deduplicate_metrics(cls, metrics: List[str]) -> List[str]:
        cleaned = [m.strip() for m in metrics if m and m.strip()]
        unique = list(dict.fromkeys(cleaned))
        result = []
        for m in unique:
            m_lower = m.lower()
            is_subsumed = False
            for other in unique:
                other_lower = other.lower()
                if m_lower != other_lower and m_lower in other_lower:
                    is_subsumed = True
                    break
            if not is_subsumed:
                result.append(m)
        return result

    @classmethod
    def parse_experience(cls, exp_text: str) -> List[ExperienceItem]:
        if not exp_text:
            return []
        
        items = []
        raw_lines = [l.strip() for l in exp_text.split("\n") if l.strip()]
        current_exp = None

        for line in raw_lines:
            line_str = line.strip()
            if not line_str:
                continue

            is_bullet = cls.is_bullet_line(line_str)
            has_date = bool(re.search(r"(?:20\d\d|19\d\d|present|current|'\d{2})", line_str, re.IGNORECASE))
            has_title_delimiter = (" | " in line_str) or (" — " in line_str) or (" - " in line_str and len(line_str) < 65)

            # Check if this line is an experience header (Company, Title, Location, Date)
            is_header = False
            if not is_bullet:
                if has_date or has_title_delimiter:
                    is_header = True
                elif current_exp is None:
                    is_header = True
                elif not current_exp.bullets and (len(line_str) < 60 and not line_str.endswith(".")):
                    is_header = True

            if is_header:
                # If current_exp exists but has no bullets and this line looks like metadata (e.g. "Berkeley, CA | June 2023 – August 2023")
                if current_exp and not current_exp.bullets and (has_date or " | " in line_str):
                    parts = [p.strip() for p in re.split(r"[|–—]", line_str) if p.strip()]
                    if len(parts) >= 2:
                        current_exp.location = parts[0]
                        current_exp.start_date = parts[1]
                    elif parts:
                        if has_date:
                            current_exp.start_date = parts[0]
                        else:
                            current_exp.location = parts[0]
                    continue

                parts = [p.strip() for p in re.split(r"[|–—]", line_str) if p.strip()]
                title = parts[0] if parts else "Role"
                company = parts[1] if len(parts) > 1 else "Company"
                date_str = parts[2] if len(parts) > 2 else (parts[1] if len(parts) > 1 and has_date and not re.search(r"[a-zA-Z]{3,}\s+[a-zA-Z]{3,}", parts[1]) else None)

                current_exp = ExperienceItem(
                    title=title,
                    company=company,
                    start_date=date_str,
                    bullets=[],
                    technologies=[]
                )
                items.append(current_exp)
            else:
                cleaned_line = cls.strip_bullet_marker(line_str)
                # Ensure header/metadata is never added as a bullet
                if cleaned_line and (" | " not in cleaned_line or len(cleaned_line.split()) > 7):
                    if not current_exp:
                        current_exp = ExperienceItem(title="Professional Experience", company="Company", bullets=[])
                        items.append(current_exp)

                    if is_bullet or not current_exp.bullets:
                        current_exp.bullets.append(cleaned_line)
                    else:
                        # Wrapped continuation line: append to current bullet
                        current_exp.bullets[-1] = f"{current_exp.bullets[-1]} {cleaned_line}"

        return items

    @classmethod
    def parse_projects(cls, proj_text: str) -> List[ProjectItem]:
        if not proj_text:
            return []
        
        projects = []
        raw_lines = [l.strip() for l in proj_text.split("\n") if l.strip()]
        current_proj = None

        for line in raw_lines:
            line_str = line.strip()
            if not line_str:
                continue

            is_bullet = cls.is_bullet_line(line_str)
            has_pipe = (" | " in line_str) or (" |" in line_str) or ("| " in line_str)
            has_repo_tokens = bool(re.search(r"\b(?:github|gitlab|bitbucket|live|demo|app)\b", line_str, re.IGNORECASE))
            has_date = bool(re.search(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*'?\d{2,4}\b|20\d\d", line_str, re.IGNORECASE))
            is_meta_line = bool(re.match(r"^(?:technologies|tech\s*stack|tools|built\s*with)\s*:", line_str, re.IGNORECASE))

            # Determine whether this line is a project header
            is_proj_header = False
            if not is_bullet:
                if is_meta_line:
                    is_proj_header = True
                elif current_proj is None:
                    is_proj_header = True
                elif not current_proj.bullets:
                    # Current project has no bullets yet
                    if has_pipe or has_repo_tokens or has_date or (len(line_str) < 70 and not line_str.endswith(".")):
                        is_proj_header = True
                else:
                    # Current project already has bullets.
                    # Only treat as a new project header if there are strong header signals:
                    # e.g. pipe delimiter WITH repo tokens, dates, or comma-separated technologies.
                    # A bullet continuation never has pipe delimiters combined with dates/repo links.
                    if has_pipe and (has_repo_tokens or has_date or "," in line_str):
                        is_proj_header = True

            if is_proj_header:
                if is_meta_line and current_proj:
                    tech_part = re.sub(r"^(?:technologies|tech\s*stack|tools|built\s*with)\s*:", "", line_str, flags=re.IGNORECASE).strip()
                    techs = [t.strip() for t in re.split(r"[,;•|]", tech_part) if t.strip()]
                    current_proj.technologies.extend(techs)
                    continue

                # Project header line: separate title, technologies, URLs, dates
                parts = [p.strip() for p in line_str.split("|") if p.strip()]
                raw_name = parts[0]
                clean_name = re.sub(r"\b(?:github|gitlab|live|demo)\b.*$", "", raw_name, flags=re.IGNORECASE).strip()
                clean_name = clean_name or raw_name

                techs = []
                url = None
                for part in parts[1:]:
                    if re.search(r"\b(?:github|gitlab|live|demo|http|www)\b", part, re.IGNORECASE):
                        url = part
                    elif "," in part:
                        techs.extend([t.strip() for t in part.split(",") if t.strip()])
                    elif not re.search(r"\b(?:Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)[a-z]*\s*'?\d{2,4}\b", part, re.IGNORECASE):
                        techs.append(part)

                current_proj = ProjectItem(
                    name=clean_name,
                    bullets=[],
                    technologies=techs,
                    metrics=[],
                    url=url
                )
                projects.append(current_proj)
            else:
                cleaned_line = cls.strip_bullet_marker(line_str)
                if not cleaned_line:
                    continue

                # Safety check: Never treat standalone metadata lines as bullets
                if (has_pipe and (has_repo_tokens or has_date)) or is_meta_line:
                    if current_proj and has_pipe:
                        parts = [p.strip() for p in cleaned_line.split("|") if p.strip()]
                        for p in parts:
                            if "," in p:
                                current_proj.technologies.extend([t.strip() for t in p.split(",") if t.strip()])
                    continue

                if not current_proj:
                    current_proj = ProjectItem(name="Featured Project", bullets=[], technologies=[], metrics=[])
                    projects.append(current_proj)

                if is_bullet or not current_proj.bullets:
                    # New bullet
                    current_proj.bullets.append(cleaned_line)
                else:
                    # Wrapped continuation line: append to current bullet
                    current_proj.bullets[-1] = f"{current_proj.bullets[-1]} {cleaned_line}"

                # Metric extraction from the current bullet (evaluated with full reconstructed context)
                latest_bullet = current_proj.bullets[-1]
                metric_matches = re.findall(
                    r"(?:\d+%\s*|\$\d+[\d,]*|\b\d+x\b|\b\d+\s*(?:ms|seconds|users|requests|records|queries|GB|TB|accuracy|f1)\b|\b\d+\s+(?:automated\s+)?(?:pytest|test)?\s*cases?\b|\b\d+\s+(?:recommendation|matching)?\s*signals?\b|\b\d+[KkMmBb]\+?\s*(?:customers?|order\s+items?|orders?|products?|users?)\b|\b\d+[-–—]\d+\s*normalized\s*scores?\b)",
                    latest_bullet,
                    re.IGNORECASE
                )
                if metric_matches:
                    current_proj.metrics.extend(metric_matches)
                    current_proj.metrics = cls.deduplicate_metrics(current_proj.metrics)

        return projects

    @classmethod
    def parse_skills(cls, skills_text: str, experience: List[ExperienceItem], projects: List[ProjectItem]) -> List[SkillItem]:
        raw_tokens = []
        if skills_text:
            # Parse skills block
            for line in skills_text.split("\n"):
                clean = re.sub(r"^[^:]+:\s*", "", line) # Strip "Languages:", "Frameworks:"
                parts = [p.strip() for p in re.split(r"[,;•|/]", clean) if p.strip()]
                raw_tokens.extend(parts)

        # Aggregate all text in experience and projects to evaluate demonstration
        exp_text = " ".join(" ".join(e.bullets) for e in experience).lower()
        proj_text = " ".join(" ".join(p.bullets) for p in projects).lower()

        skill_items = []
        seen = set()

        for token in raw_tokens:
            t_clean = token.strip()
            t_lower = t_clean.lower()
            if not t_clean or len(t_clean) < 2 or len(t_clean) > 40 or t_lower in seen:
                continue
            seen.add(t_lower)

            in_exp = bool(re.search(rf"\b{re.escape(t_lower)}\b", exp_text))
            in_proj = bool(re.search(rf"\b{re.escape(t_lower)}\b", proj_text))
            evidence_cnt = exp_text.count(t_lower) + proj_text.count(t_lower)

            confidence = 0.95 if (in_exp and in_proj) else (0.80 if (in_exp or in_proj) else 0.40)

            skill_items.append(SkillItem(
                name=t_clean,
                demonstrated_in_experience=in_exp,
                demonstrated_in_projects=in_proj,
                evidence_count=evidence_cnt,
                confidence=confidence
            ))

        return skill_items

    @classmethod
    def parse_list_items(cls, text: str) -> List[str]:
        if not text:
            return []
        items = []
        for line in text.split("\n"):
            line_str = line.strip()
            if not line_str:
                continue
            is_bullet = cls.is_bullet_line(line_str)
            clean = cls.strip_bullet_marker(line_str)
            if clean:
                if is_bullet or not items:
                    items.append(clean)
                else:
                    items[-1] = f"{items[-1]} {clean}"
        return items

    @classmethod
    def classify_profile(cls, raw_text: str, education: List[EducationItem], experience: List[ExperienceItem], projects: List[ProjectItem]) -> str:
        text_lower = raw_text.lower()
        student_signals = [
            "expected graduation", "pursuing", "student", "undergraduate", "bachelor of science candidate",
            "freshman", "sophomore", "junior", "senior year", "gpa", "dean's list", "intern"
        ]
        score_student = sum(1 for s in student_signals if s in text_lower)

        # Total work experience bullets
        total_exp_bullets = sum(len(e.bullets) for e in experience)
        
        # Check graduation dates
        future_or_recent_grad = False
        for edu in education:
            if edu.graduation_date:
                m = re.search(r"20(2[4-9]|3[0-5])", edu.graduation_date)
                if m:
                    future_or_recent_grad = True

        if future_or_recent_grad or score_student >= 2 or (len(projects) >= 2 and total_exp_bullets <= 3):
            if total_exp_bullets == 0:
                return "student"
            return "fresher"
        elif len(experience) <= 2:
            return "early_career"
        else:
            return "experienced"

    @classmethod
    def get_missing_recommended_sections(cls, detected: List[str], profile_type: str) -> List[str]:
        core = ["education", "skills"]
        if profile_type in ("student", "fresher"):
            core.extend(["projects"])
        else:
            core.extend(["experience", "summary"])

        missing = []
        for c in core:
            if c not in detected:
                missing.append(c.capitalize())
        return missing
