from typing import Dict, Any, List
from models.schemas import ATSFormatReport, ATSIssue, StructuredResume

class ATSAnalyzer:
    """
    Evaluates physical document layout and parseability risks for Applicant Tracking Systems.
    Inspects multi-column structure, tables, headers/footers, contact info accessibility, and section hierarchy.
    """

    @classmethod
    def analyze(cls, resume: StructuredResume, doc_meta: Dict[str, Any]) -> ATSFormatReport:
        score = 100
        issues: List[ATSIssue] = []

        two_column = doc_meta.get("two_column", False)
        table_count = doc_meta.get("table_count", 0)
        is_scanned = doc_meta.get("is_scanned", False)
        header_footer_risk = doc_meta.get("header_footer_risk", False)
        font_issues = doc_meta.get("font_issues", [])

        # 1. Scanned Image Check
        if is_scanned:
            score -= 50
            issues.append(ATSIssue(
                severity="HIGH",
                issue_type="layout",
                title="Scanned / Image-Based Document",
                description="Your document lacks a selectable text layer. Legacy and standard ATS parsers cannot extract textual content.",
                recommendation="Re-export your resume directly from your word processor (Word, Google Docs, LaTeX) as a native PDF."
            ))

        # 2. Multi-column Layout Check
        if two_column:
            score -= 12
            issues.append(ATSIssue(
                severity="MEDIUM",
                issue_type="layout",
                title="Multi-Column Layout Detected",
                description="Text is arranged across multiple vertical columns. Some ATS parsers read horizontally across columns, interleaving sentences and corrupting section order.",
                recommendation="Adopt a single-column chronological layout to ensure 100% deterministic reading order."
            ))

        # 3. Tables Check
        if table_count > 0:
            penalty = min(12, table_count * 4)
            score -= penalty
            issues.append(ATSIssue(
                severity="MEDIUM",
                issue_type="table",
                title=f"{table_count} Embedded Table(s) Detected",
                description="Tables are frequently flattened into unstructured plain text by older ATS engines, detaching skills from their associated categories.",
                recommendation="Replace tables with clean bullet points or pipe-separated inline text."
            ))

        # 4. Header / Footer Contact Placement
        if header_footer_risk:
            score -= 10
            issues.append(ATSIssue(
                severity="HIGH",
                issue_type="header_footer",
                title="Contact Information in Margins / Header",
                description="Contact details (email, phone, location) appear inside document header or footer zones, which many ATS engines automatically truncate.",
                recommendation="Place all contact details in the top body section of the first page."
            ))

        # 5. Contact Information Validation
        missing_contact = []
        if not resume.candidate.email:
            missing_contact.append("Email Address")
        if not resume.candidate.phone:
            missing_contact.append("Phone Number")
        
        if missing_contact:
            score -= 10
            issues.append(ATSIssue(
                severity="HIGH",
                issue_type="contact",
                title="Missing Critical Contact Information",
                description=f"Could not cleanly detect: {', '.join(missing_contact)}.",
                recommendation="Ensure your email and phone number are clearly typed in plain text near the top."
            ))

        # 6. Missing Core Sections
        if resume.missing_recommended_sections:
            score -= (len(resume.missing_recommended_sections) * 4)
            issues.append(ATSIssue(
                severity="LOW",
                issue_type="section",
                title="Missing Standard Section Headers",
                description=f"Recommended standard headings missing: {', '.join(resume.missing_recommended_sections)}.",
                recommendation="Use conventional headings like 'Experience', 'Education', 'Projects', and 'Skills'."
            ))

        # 7. Font Issues
        if font_issues:
            score -= 5
            for fi in font_issues:
                issues.append(ATSIssue(
                    severity="LOW",
                    issue_type="font",
                    title="Typography / Font Consistency",
                    description=fi,
                    recommendation="Maintain standard body sizes (10-11pt) and section header sizes (13-14pt)."
                ))

        reading_order_risk = "HIGH" if (is_scanned or (two_column and table_count > 1)) else ("MEDIUM" if (two_column or table_count > 0) else "LOW")

        final_score = max(20, min(100, score))

        return ATSFormatReport(
            parseability_score=final_score,
            two_column_layout_detected=two_column,
            tables_detected=table_count,
            scanned_image_detected=is_scanned,
            headers_footers_with_content=header_footer_risk,
            broken_reading_order_risk=reading_order_risk,
            font_issues=font_issues,
            detected_issues=issues
        )
