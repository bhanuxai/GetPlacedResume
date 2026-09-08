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

    @classmethod
    def parse_experience(cls, exp_text: str) -> List[ExperienceItem]:
        if not exp_text:
            return []
        
        items = []
        # Split blocks by date patterns or company headers
        raw_lines = [l.strip() for l in exp_text.split("\n") if l.strip()]
        current_exp = None

        for line in raw_lines:
            # Detect bullet point
            is_bullet = line.startswith(("•", "-", "*", "–", "—", ">")) or re.match(r"^\d+\.", line)
            
            # Detect new job header if contains date or pipe / company keywords
            has_date = bool(re.search(r"(?:20\d\d|19\d\d|present|current)", line, re.IGNORECASE))
            has_title_delimiter = (" | " in line) or (" - " in line) or ("," in line and len(line) < 60)

            if not is_bullet and (has_date or has_title_delimiter or len(line) < 50):
                # New role header candidate
                parts = [p.strip() for p in re.split(r"[|–—\n]", line) if p.strip()]
                title = parts[0] if parts else "Role"
                company = parts[1] if len(parts) > 1 else "Company"

                current_exp = ExperienceItem(
                    title=title,
                    company=company,
                    start_date=parts[2] if len(parts) > 2 else None,
                    bullets=[],
                    technologies=[]
                )
                items.append(current_exp)
            else:
                cleaned_bullet = re.sub(r"^[\s•\-\*–—\d\.\)]+", "", line).strip()
                if cleaned_bullet:
                    if not current_exp:
                        current_exp = ExperienceItem(title="Professional Experience", company="Company", bullets=[])
                        items.append(current_exp)
                    current_exp.bullets.append(cleaned_bullet)

        return items

    @classmethod
    def parse_projects(cls, proj_text: str) -> List[ProjectItem]:
        if not proj_text:
            return []
        
        projects = []
        raw_lines = [l.strip() for l in proj_text.split("\n") if l.strip()]
        current_proj = None

        for line in raw_lines:
            is_bullet = line.startswith(("•", "-", "*", "–", "—", ">")) or re.match(r"^\d+\.", line)
            if not is_bullet and len(line) < 70 and not line.endswith("."):
                # Project header
                name_parts = line.split("|")
                p_name = name_parts[0].strip()
                techs = [t.strip() for t in name_parts[1].split(",")] if len(name_parts) > 1 else []
                current_proj = ProjectItem(
                    name=p_name,
                    bullets=[],
                    technologies=techs,
                    metrics=[]
                )
                projects.append(current_proj)
            else:
                cleaned_bullet = re.sub(r"^[\s•\-\*–—\d\.\)]+", "", line).strip()
                if cleaned_bullet:
                    if not current_proj:
                        current_proj = ProjectItem(name="Featured Project", bullets=[], technologies=[], metrics=[])
                        projects.append(current_proj)
                    current_proj.bullets.append(cleaned_bullet)
                    # Detect metric in bullet
                    metric_match = re.findall(r"(?:\d+%\s*|\$\d+[\d,]*|\d+x|\b\d+\s*(?:ms|seconds|users|requests|records|queries|GB|TB|accuracy|f1)\b)", cleaned_bullet, re.IGNORECASE)
                    if metric_match:
                        current_proj.metrics.extend(metric_match)

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
            clean = re.sub(r"^[\s•\-\*–—\d\.\)]+", "", line).strip()
            if clean:
                items.append(clean)
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
