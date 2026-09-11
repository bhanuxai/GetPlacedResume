import io
import re
from typing import Tuple, Dict, Any, List
import pdfplumber
import PyPDF2
import docx
from services.bullet_analyzer import STRONG_ACTION_VERBS

BULLET_PREFIX_REGEX = re.compile(
    r"^(?:"
    r"[\u2022\u25cf\u25aa\u25a0\u25e6\u25cb\u00b7\uf0b7\uf0a7\u25ba\u25b8\u2023\u2714\u2713\*]"
    r"|(?:\(cid:\d+\))"
    r"|(?:[-–—]\s+)"
    r"|(?:\(?\d{1,2}[\.\)\:\-]\s+)"
    r")\s*"
)

class DocumentParser:
    """
    Parses PDF, DOCX, and raw text resumes while inspecting document layout,
    detecting multi-column layouts, tables, headers/footers, and image-only/scanned documents.
    """

    @staticmethod
    def _reconstruct_page_lines(lines: List[Dict[str, Any]]) -> str:
        if not lines:
            return ""

        output_lines = []
        base_bullet_x0 = None
        prev_line = None

        for l in lines:
            raw_text = l.get("text", "").strip()
            if not raw_text:
                continue

            # Normalize CID and wingdings bullets
            raw_text = re.sub(r"\(cid:\d+\)\s*", "• ", raw_text)
            raw_text = re.sub(r"[\uf0b7\uf0a7]\s*", "• ", raw_text)

            x0 = float(l.get("x0", 0.0))
            x1 = float(l.get("x1", 0.0))
            top = float(l.get("top", 0.0))
            bottom = float(l.get("bottom", 0.0))
            line_height = bottom - top
            spacing = (top - prev_line["bottom"]) if prev_line else 0.0

            has_glyph = bool(BULLET_PREFIX_REGEX.match(raw_text))
            clean_text = BULLET_PREFIX_REGEX.sub("", raw_text).strip()

            words = clean_text.split()
            first_word = words[0] if words else ""
            first_word_clean = re.sub(r"[^\w]", "", first_word).lower()
            starts_action = bool(first_word and first_word[0].isupper() and first_word_clean in STRONG_ACTION_VERBS)

            prev_raw = prev_line.get("raw_text", "").strip() if prev_line else ""
            prev_ended = bool(re.search(r"[\.\!\?\;]\s*$", prev_raw)) if prev_raw else False

            is_header = bool(
                " | " in raw_text or
                re.search(r"\b(?:PROJECTS|EXPERIENCE|EDUCATION|SKILLS|CERTIFICATIONS|PUBLICATIONS|SUMMARY)\b", raw_text) or
                (not has_glyph and len(raw_text) < 45 and not raw_text.endswith("."))
            )

            is_new_bullet = False
            is_continuation = False

            if has_glyph:
                is_new_bullet = True
                base_bullet_x0 = x0
            elif starts_action and not is_header:
                # 1. Hanging indent reset: prev line was indented, current line resets left
                if prev_line and prev_line.get("is_continuation") and x0 < prev_line["x0"] - 3.0:
                    is_new_bullet = True
                    base_bullet_x0 = x0
                # 2. Inter-bullet vertical spacing: gap between items is significantly larger than regular line spacing
                elif prev_line and spacing >= max(5.0, line_height * 0.4):
                    is_new_bullet = True
                    base_bullet_x0 = x0
                # 3. Sentence ended and aligns with previous bullet margin
                elif prev_ended and (base_bullet_x0 is None or abs(x0 - base_bullet_x0) <= 3.0):
                    is_new_bullet = True
                    base_bullet_x0 = x0
            elif base_bullet_x0 is not None and x0 > base_bullet_x0 + 3.0:
                is_continuation = True
            elif not prev_ended and not has_glyph:
                is_continuation = True

            line_info = {
                "text": clean_text,
                "raw_text": raw_text,
                "x0": x0,
                "x1": x1,
                "top": top,
                "bottom": bottom,
                "spacing": spacing,
                "is_bullet": is_new_bullet,
                "is_continuation": is_continuation
            }

            if is_new_bullet:
                output_lines.append(f"• {clean_text}")
            elif is_continuation and output_lines:
                output_lines.append(f"  {clean_text}")
            else:
                output_lines.append(raw_text)

            prev_line = line_info

        return "\n".join(output_lines)

    @staticmethod
    def parse_file(file_bytes: bytes, filename: str) -> Tuple[str, Dict[str, Any]]:
        filename_lower = filename.lower()
        if filename_lower.endswith(".pdf"):
            return DocumentParser.parse_pdf(file_bytes)
        elif filename_lower.endswith(".docx"):
            return DocumentParser.parse_docx(file_bytes)
        else:
            raise ValueError(f"Unsupported resume format '{filename}'. Only PDF (.pdf) and Word (.docx) files are supported.")

    @staticmethod
    def parse_pdf(file_bytes: bytes) -> Tuple[str, Dict[str, Any]]:
        extracted_text = []
        issues = []
        two_column = False
        table_count = 0
        is_scanned = False
        page_count = 0
        header_footer_risk = False
        font_sizes_seen = set()

        try:
            with pdfplumber.open(io.BytesIO(file_bytes)) as pdf:
                page_count = len(pdf.pages)
                total_chars = 0

                for page_idx, page in enumerate(pdf.pages):
                    lines = []
                    try:
                        lines = page.extract_text_lines()
                    except Exception:
                        lines = []

                    if lines:
                        p_text = DocumentParser._reconstruct_page_lines(lines)
                    else:
                        p_text = page.extract_text(layout=False) or ""
                        p_text = re.sub(r"\(cid:\d+\)\s*", "• ", p_text)
                        p_text = re.sub(r"[\uf0b7\uf0a7]\s*", "• ", p_text)

                    total_chars += len(p_text.strip())

                    # Check for tables
                    tables = page.find_tables()
                    if tables:
                        table_count += len(tables)

                    # Inspect layout: check horizontal clustering of words to detect multi-column layout
                    words = page.extract_words()
                    if words:
                        # Inspect font sizes
                        for w in words:
                            if "size" in w:
                                font_sizes_seen.add(round(w["size"], 1))

                        # Column detection heuristic:
                        # Divide page into left half and right half, check if substantial text exists in both columns without overlapping
                        page_width = page.width
                        mid = page_width / 2
                        left_words = [w for w in words if w["x1"] < mid + 20]
                        right_words = [w for w in words if w["x0"] > mid - 20]

                        # If both columns have significant content (>20% of words each)
                        if len(words) > 40:
                            left_ratio = len(left_words) / len(words)
                            right_ratio = len(right_words) / len(words)
                            if left_ratio > 0.25 and right_ratio > 0.25:
                                two_column = True

                    # Header/footer risk: text within top 35pt or bottom 35pt
                    header_words = [w for w in words if w["top"] < 35]
                    footer_words = [w for w in words if w["bottom"] > (page.height - 35)]
                    # Check if email/phone or critical info is inside header/footer
                    header_text = " ".join(w["text"] for w in header_words)
                    footer_text = " ".join(w["text"] for w in footer_words)
                    if "@" in header_text or "@" in footer_text or re.search(r"\d{3}[-\.\s]\d{3}", header_text + footer_text):
                        header_footer_risk = True

                    extracted_text.append(p_text)

                # Check if scanned / image-only
                if page_count > 0 and (total_chars / page_count) < 60:
                    # Very few characters extracted, likely scanned
                    is_scanned = True
                    issues.append({
                        "severity": "HIGH",
                        "title": "Image-Based / Scanned PDF Detected",
                        "description": "The uploaded PDF has minimal or no selectable text layer. ATS systems and AI parsers cannot reliably extract your skills.",
                        "recommendation": "Use a standard text-based PDF created with Word, Google Docs, or LaTeX rather than a scanned graphic."
                    })

        except Exception as e:
            # Fallback to PyPDF2
            try:
                reader = PyPDF2.PdfReader(io.BytesIO(file_bytes))
                page_count = len(reader.pages)
                for page in reader.pages:
                    txt = page.extract_text() or ""
                    txt = re.sub(r"\(cid:\d+\)\s*", "• ", txt)
                    txt = re.sub(r"[\uf0b7\uf0a7]\s*", "• ", txt)
                    extracted_text.append(txt)
            except Exception as e2:
                issues.append({
                    "severity": "HIGH",
                    "title": "PDF Extraction Warning",
                    "description": f"Failed to extract text using standard PDF parsers: {str(e2)}",
                    "recommendation": "Ensure the PDF is not password-protected or corrupted."
                })

        full_text = "\n\n".join(extracted_text).strip()

        # Assess font issues
        font_issues = []
        if any(sz < 8.5 for sz in font_sizes_seen):
            font_issues.append("Font size below 8.5pt detected (may be unreadable or ignored by legacy ATS).")
        if len(font_sizes_seen) > 6:
            font_issues.append(f"Too many distinct font sizes ({len(font_sizes_seen)}) indicating inconsistent styling.")

        meta = {
            "format": "pdf",
            "page_count": page_count,
            "is_scanned": is_scanned,
            "two_column": two_column,
            "table_count": table_count,
            "header_footer_risk": header_footer_risk,
            "font_issues": font_issues,
            "issues": issues
        }

        return full_text, meta

    @staticmethod
    def parse_docx(file_bytes: bytes) -> Tuple[str, Dict[str, Any]]:
        issues = []
        extracted_text = []
        table_count = 0

        try:
            doc = docx.Document(io.BytesIO(file_bytes))
            
            # Paragraphs
            for p in doc.paragraphs:
                p_text = p.text.strip()
                if p_text:
                    extracted_text.append(p_text)

            # Tables
            table_count = len(doc.tables)
            for table in doc.tables:
                table_rows = []
                for row in table.rows:
                    row_text = [cell.text.strip() for cell in row.cells if cell.text.strip()]
                    if row_text:
                        table_rows.append(" | ".join(row_text))
                if table_rows:
                    extracted_text.append("\n".join(table_rows))

        except Exception as e:
            issues.append({
                "severity": "HIGH",
                "title": "DOCX Extraction Error",
                "description": f"Failed to parse Word document: {str(e)}",
                "recommendation": "Save the document as standard DOCX or export as PDF."
            })

        full_text = "\n\n".join(extracted_text).strip()
        meta = {
            "format": "docx",
            "page_count": max(1, len(extracted_text) // 30),
            "is_scanned": False,
            "two_column": False,
            "table_count": table_count,
            "header_footer_risk": False,
            "font_issues": [],
            "issues": issues
        }
        return full_text, meta
