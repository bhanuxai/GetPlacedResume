import sys
import os
import re

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from main import run_pipeline
from services.job_parser import JobParser
from services.resume_parser import ResumeParser
from services.bullet_analyzer import BulletAnalyzer
from services.project_analyzer import ProjectAnalyzer

TEST_JD = """Machine Learning Engineer - NLP & LLM Applications
Company: NovaAI Technologies
Location: San Francisco, CA (Hybrid)
Employment Type: Full-time
Department: Core Intelligence

About the Role:
We are seeking a Machine Learning Engineer to join our Core Intelligence team. In this role, you will design, train, and deploy production-ready NLP and machine learning systems that power semantic understanding across millions of enterprise documents.

Required Qualifications:
• Bachelor's or Master's degree in Computer Science, Data Science, or related STEM field.
• 2+ years of practical experience developing NLP applications, transformer models, or text processing systems.
• Strong proficiency in Python, PyTorch or TensorFlow, and Scikit-learn.
• Hands-on experience building and deploying machine learning pipelines and REST APIs (FastAPI or Flask).
• Experience with vector embeddings, semantic search, and similarity metrics (cosine similarity, FAISS).
• Proficiency in SQL and database design (PostgreSQL).
• Hands-on experience deploying models to cloud infrastructure (AWS S3, EC2).
• Familiarity with containerization using Docker and Kubernetes.
• Track record of quantifying model performance and latency optimizations in production environments.
• Experience with LLM prompt engineering, RAG architectures, and fine-tuning.

Preferred Qualifications:
• Experience with Hugging Face Transformers and modern open-source LLMs.
• Familiarity with vector databases (Pinecone, Weaviate, Milvus).
• Experience with MLflow or other experiment-tracking platforms.
• Familiarity with CI/CD and cloud-native deployment.
• Experience with big data technologies like Spark.

Responsibilities:
• Architect, train, and benchmark NLP models for classification, information extraction, and semantic matching.
• Collaborate with backend engineers to integrate ML microservices into scalable production pipelines.
• Drive rigorous evaluation frameworks measuring accuracy, latency, and operational cost.
"""

STUDENT_RESUME = """ALEX CHEN
San Francisco, CA | (555) 382-9102 | alex.chen@email.com
linkedin.com/in/alexchen-ai | github.com/alexchen-ml

PROFESSIONAL SUMMARY
Machine Learning Practitioner and Software Engineer with hands-on experience building, fine-tuning, and evaluating transformer-based NLP pipelines, tabular predictive models, and scalable REST APIs.

EDUCATION
University of California, Berkeley — Bachelor of Science in Computer Science
Graduated: May 2024 | GPA: 3.82 / 4.00

TECHNICAL SKILLS
Languages: Python, SQL, C++, TypeScript
Frameworks & Libraries: PyTorch, Scikit-learn, Pandas, NumPy, FastAPI, Flask
Data & Cloud: PostgreSQL, Redis, Git, AWS (S3, EC2)

PROJECTS
Hoplid Interconnected Intelligence System | GitHub Aug '26
• Architected a prototype intelligence system to interconnect Recommendation,
  Matching, and Card Rolling engines through a shared user-signal layer
  and feedback loop.
• Implemented weighted recommendation and compatibility scoring using 5
  recommendation signals, 4 matching signals, cosine/Jaccard similarity, FastAPI,
  NumPy, Pandas, and Scikit-learn.
• Validated the interconnected workflow with 5 automated Pytest cases, supporting
  0–100 normalized scores, recently-seen/disliked-item filtering, feedback-driven signal
  updates, and API latency measurement.

Smart Logistics & Delivery Intelligence Platform | GitHub | Live Jul '26
• Designed a logistics intelligence platform to optimize delivery route planning
  using Ant Colony Optimization (ACO).
• Integrated and processed the Olist dataset in MySQL, loading 99K+ customers,
  99K+ orders, 112K+ order items, and 32K+ products, with a React-based dashboard.
• Delivered an end-to-end prototype combining route optimization, structured
  logistics data, and dashboard-based visualization.
"""

def test_audit():
    print("==================================================================")
    print("RUNNING COMPREHENSIVE PIPELINE AUDIT WITH TEST JD AND STUDENT RESUME")
    print("==================================================================")

    # 1. Test Raw Job Parsing
    job = JobParser.parse(TEST_JD)
    print(f"\n1. JD Metadata Parsed:")
    print(f"   - Company: {job.company}")
    print(f"   - Location: {job.location}")
    print(f"   - Department: {job.department}")
    print(f"   - Employment Type: {job.employment_type}")
    print(f"   - Title: {job.title}")

    # Check for metadata leakage into requirements
    metadata_leaks = [
        r for r in job.requirements
        if r.category == "metadata" or any(k in r.text.lower() for k in ["company:", "location:", "department:", "employment type:"])
    ]
    print(f"\n2. Metadata Leaks in Scorable Requirements: {len(metadata_leaks)} (Target: 0)")
    assert len(metadata_leaks) == 0, f"Found metadata leaks: {metadata_leaks}"

    heading_leaks = [
        r for r in job.requirements
        if r.category == "section_heading" or r.text.strip().lower() in ["responsibilities:", "about the role:", "required qualifications:", "preferred qualifications:"]
    ]
    print(f"   Heading Leaks in Scorable Requirements: {len(heading_leaks)} (Target: 0)")
    assert len(heading_leaks) == 0, f"Found heading leaks: {heading_leaks}"

    print(f"\n3. Extracted Scorable Requirements Breakdown ({len(job.requirements)} total):")
    req_by_prio = {}
    for r in job.requirements:
        prio = r.priority or r.importance
        req_by_prio.setdefault(prio, []).append(r)
        print(f"   [{prio.upper()}] [{r.category}] {r.text[:65]}...")

    # 2. Test Resume Parsing
    resume = ResumeParser.parse(STUDENT_RESUME)
    print(f"\n4. Resume Parsing:")
    print(f"   - Projects detected: {len(resume.projects)}")
    assert len(resume.projects) == 2, f"Expected 2 projects, got {len(resume.projects)}"
    total_proj_bullets = sum(len(p.bullets) for p in resume.projects)
    print(f"   - Total project bullets reconstructed: {total_proj_bullets}")
    assert total_proj_bullets == 6, f"Expected 6 logical bullets across projects, got {total_proj_bullets}"

    for p in resume.projects:
        print(f"     * Name: '{p.name}'")
        print(f"       Bullets ({len(p.bullets)}):")
        assert len(p.bullets) == 3, f"Expected 3 bullets in project '{p.name}', got {len(p.bullets)}"
        for b in p.bullets:
            print(f"         - {b[:70]}...")
            assert not re.search(r"\b(?:github|live)\b", b, re.IGNORECASE) and "hoplid" not in b.lower(), f"Header leaked as bullet: {b}"

    # 3. Test Bullet Analyzer & Metrics
    print(f"\n5. Bullet Quantification & Metric Evaluation:")
    bullets = BulletAnalyzer.analyze_resume_bullets(resume)
    print(f"   Total bullets evaluated: {len(bullets)}")
    assert len(bullets) == 6, f"Expected exactly 6 analyzed bullets, got {len(bullets)}"
    quantified_count = 0
    for b in bullets:
        if b.is_quantified:
            quantified_count += 1
            print(f"   [QUANTIFIED: {b.metric_category}] '{b.original_text[:60]}...'")
            print(f"      Elements: {b.quantified_elements} | Verb: '{b.action_verb}' | Grade: {b.structure_grade} | Score: {b.score}")
            if b.suggested_revision:
                assert "measuring and optimizing execution efficiency" not in b.suggested_revision, "Found hallucinated metric suffix in rewrite!"
                assert not b.suggested_revision.startswith("Architected and implemented validated"), "Found duplicate prepended verb!"
        else:
            print(f"   [UNQUANTIFIED] '{b.original_text[:60]}...' | Grade: {b.structure_grade} | Score: {b.score}")
    print(f"   Total quantified bullets: {quantified_count}/{len(bullets)}")
    assert quantified_count == 3, f"Expected exactly 3 quantified bullets out of 6 (50%), got {quantified_count}"

    # 4. Full Pipeline Analysis
    doc_meta = {
        "format": "text",
        "page_count": 1,
        "is_scanned": False,
        "two_column": False,
        "table_count": 0,
        "header_footer_risk": False,
        "font_issues": [],
        "issues": []
    }

    report = run_pipeline(
        raw_resume=STUDENT_RESUME,
        jd_text=TEST_JD,
        doc_meta=doc_meta,
        profile_mode="auto"
    )

    print("\n6. Full Pipeline Results:")
    print(f"   Overall Score: {report.overall_score}/100 ({report.tier})")
    print(f"   Candidate Profile: {report.candidate_profile_type}")
    print(f"   Score Breakdown:")
    print(f"     - Job Relevance: {report.score_breakdown.job_relevance}/30")
    print(f"     - Skills Competency: {report.score_breakdown.skills_competency}/20")
    print(f"     - Experience Relevance: {report.score_breakdown.experience_relevance}/20")
    print(f"     - ATS Parseability: {report.score_breakdown.ats_parseability}/15")
    print(f"     - Content Quality: {report.score_breakdown.content_quality}/10")
    print(f"     - Professional Presentation: {report.score_breakdown.professional_presentation}/5")

    print("\n7. Skills Matrix 5-Category Breakdown:")
    print(f"   - Strongly Demonstrated: {report.skills_analysis.get('strongly_demonstrated', [])}")
    print(f"   - Partially Demonstrated: {report.skills_analysis.get('partially_demonstrated', [])}")
    print(f"   - Mentioned Only: {report.skills_analysis.get('mentioned_only', [])}")
    print(f"   - Missing Required: {report.skills_analysis.get('missing_required', [])}")
    print(f"   - Missing Preferred: {report.skills_analysis.get('missing_preferred', [])}")

    print("\n8. Weaknesses & Categorization Audit:")
    for w in report.weaknesses:
        print(f"   - {w}")
        assert "experience bullet points lack" not in w, f"Found misleading 'experience bullet points' in: {w}"
        if "Missing core competencies" in w:
            for pref in ["Hugging Face", "Pinecone", "Weaviate", "Milvus", "MLflow", "CI/CD", "Spark"]:
                assert pref.lower() not in w.lower(), f"Preferred skill '{pref}' erroneously labeled as missing core competency in: {w}"

    print("\n9. Recommendations Audit:")
    for rec in report.recommendations:
        print(f"   [{rec.priority}] {rec.title}: {rec.description}")
        assert "describe duties without specifying" not in rec.description, f"Found outdated duty phrasing in: {rec.description}"
        if "bullets lack" in rec.description:
            assert "analyzed bullets lack measurable outcomes" in rec.description, f"Recommendation wording mismatch: {rec.description}"

    print("\n10. Project Analyses:")
    for pa in report.project_analyses:
        print(f"    * {pa.project_name}: Relevance={pa.relevance_to_job} ({pa.relevance_score}), Complexity={pa.complexity_score}, Metrics={pa.metrics_summary}")
        # Verify deduplicated clean metrics
        if "Hoplid" in pa.project_name:
            assert "5 recommendation signals" in pa.metrics_identified, f"Missing 5 recommendation signals in {pa.metrics_identified}"
            assert "4 matching signals" in pa.metrics_identified, f"Missing 4 matching signals in {pa.metrics_identified}"
            assert "5 automated Pytest cases" in pa.metrics_identified, f"Missing 5 automated Pytest cases in {pa.metrics_identified}"
            assert "0–100 normalized scores" in pa.metrics_identified or "0-100 normalized scores" in pa.metrics_identified, f"Missing normalized scores in {pa.metrics_identified}"
            assert "5" not in pa.metrics_identified, f"Raw number '5' not deduplicated in {pa.metrics_identified}"
            assert "4" not in pa.metrics_identified, f"Raw number '4' not deduplicated in {pa.metrics_identified}"
        elif "Logistics" in pa.project_name:
            assert "99K+ customers" in pa.metrics_identified, f"Missing 99K+ customers in {pa.metrics_identified}"
            assert "99K+ orders" in pa.metrics_identified, f"Missing 99K+ orders in {pa.metrics_identified}"
            assert "112K+ order items" in pa.metrics_identified, f"Missing 112K+ order items in {pa.metrics_identified}"
            assert "32K+ products" in pa.metrics_identified, f"Missing 32K+ products in {pa.metrics_identified}"
            assert "112K+ order" not in pa.metrics_identified, f"Truncated '112K+ order' found in {pa.metrics_identified}"
            assert "99K+" not in pa.metrics_identified, f"Raw '99K+' not deduplicated in {pa.metrics_identified}"
            assert "112K+" not in pa.metrics_identified, f"Raw '112K+' not deduplicated in {pa.metrics_identified}"

    print("\n==================================================================")
    print("ALL AUDIT VERIFICATIONS PASSED SUCCESSFULLY!")
    print("==================================================================")

def test_wrapped_bullet_1():
    print("\n[REGRESSION TEST 1] Wrapped Bullet Reconstruction")
    sample = """PROJECTS
Demo Project | GitHub
• Architected a prototype intelligence system to interconnect Recommendation,
  Matching, and Card Rolling engines through a shared user-signal layer
  and feedback loop.
"""
    resume = ResumeParser.parse(sample)
    assert len(resume.projects) == 1, f"Expected 1 project, got {len(resume.projects)}"
    assert len(resume.projects[0].bullets) == 1, f"Expected 1 logical bullet, got {len(resume.projects[0].bullets)}"
    expected_text = "Architected a prototype intelligence system to interconnect Recommendation, Matching, and Card Rolling engines through a shared user-signal layer and feedback loop."
    assert resume.projects[0].bullets[0] == expected_text, f"Mismatch in reconstructed bullet:\nGot: '{resume.projects[0].bullets[0]}'\nExpected: '{expected_text}'"
    print("  -> PASSED: Successfully reconstructed into 1 logical bullet (NOT 3)")

def test_metric_heavy_wrapped_bullet_2():
    print("\n[REGRESSION TEST 2] Metric-Heavy Wrapped Bullet")
    sample = """PROJECTS
Demo Project | GitHub
• Implemented weighted recommendation using 5 recommendation signals,
  4 matching signals, cosine/Jaccard similarity, FastAPI, NumPy,
  Pandas, and Scikit-learn.
"""
    resume = ResumeParser.parse(sample)
    assert len(resume.projects[0].bullets) == 1, f"Expected 1 logical bullet, got {len(resume.projects[0].bullets)}"
    bullet = resume.projects[0].bullets[0]
    is_q, cat, elements = BulletAnalyzer.detect_metrics(bullet)
    assert is_q is True, "Expected bullet to be quantified = True"
    assert "5 recommendation signals" in elements, f"Missing '5 recommendation signals' in {elements}"
    assert "4 matching signals" in elements, f"Missing '4 matching signals' in {elements}"
    print(f"  -> PASSED: 1 logical bullet, quantified = YES ({elements})")

def test_dataset_wrapped_bullet_3():
    print("\n[REGRESSION TEST 3] Dataset Wrapped Bullet")
    sample = """PROJECTS
Demo Project | GitHub
• Integrated and processed the Olist dataset in MySQL, loading 99K+
  customers, 99K+ orders, 112K+ order items, and 32K+ products,
  with a React-based dashboard.
"""
    resume = ResumeParser.parse(sample)
    assert len(resume.projects[0].bullets) == 1, f"Expected 1 logical bullet, got {len(resume.projects[0].bullets)}"
    bullet = resume.projects[0].bullets[0]
    is_q, cat, elements = BulletAnalyzer.detect_metrics(bullet)
    assert is_q is True, "Expected bullet to be quantified = True"
    assert "99K+ customers" in elements, f"Missing '99K+ customers' in {elements}"
    assert "99K+ orders" in elements, f"Missing '99K+ orders' in {elements}"
    assert "112K+ order items" in elements, f"Missing '112K+ order items' in {elements}"
    assert "32K+ products" in elements, f"Missing '32K+ products' in {elements}"
    assert "112K+ order" not in elements, f"Found truncated '112K+ order' in {elements}"
    print(f"  -> PASSED: 1 logical bullet, quantified = YES ({elements})")

def test_pdf_extraction_six_bullets_4():
    print("\n[REGRESSION TEST 4] Multi-Bullet PDF Extraction & Logical Reconstruction")
    import io
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    from services.document_parser import DocumentParser

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    y = 750
    lines = [
        "ALEX CHEN",
        "San Francisco, CA | (555) 382-9102 | alex.chen@email.com",
        "EDUCATION",
        "University of California, Berkeley — Bachelor of Science in Computer Science",
        "TECHNICAL SKILLS",
        "Languages: Python, SQL, C++, TypeScript",
        "Frameworks & Libraries: PyTorch, Scikit-learn, Pandas, NumPy, FastAPI, Flask",
        "PROJECTS",
        "Hoplid Interconnected Intelligence System | GitHub Aug '26",
        chr(8226) + " Architected a prototype intelligence system to interconnect Recommendation,",
        "  Matching, and Card Rolling engines through a shared user-signal layer",
        "  and feedback loop.",
        chr(8226) + " Implemented weighted recommendation and compatibility scoring using 5",
        "  recommendation signals, 4 matching signals, cosine/Jaccard similarity, FastAPI,",
        "  NumPy, Pandas, and Scikit-learn.",
        chr(8226) + " Validated the interconnected workflow with 5 automated Pytest cases, supporting",
        "  0–100 normalized scores, recently-seen/disliked-item filtering, feedback-driven signal",
        "  updates, and API latency measurement.",
        "Smart Logistics & Delivery Intelligence Platform | GitHub | Live Jul '26",
        chr(8226) + " Designed a logistics intelligence platform to optimize delivery route planning",
        "  using Ant Colony Optimization (ACO).",
        chr(8226) + " Integrated and processed the Olist dataset in MySQL, loading 99K+ customers,",
        "  99K+ orders, 112K+ order items, and 32K+ products, with a React-based dashboard.",
        chr(8226) + " Delivered an end-to-end prototype combining route optimization, structured",
        "  logistics data, and dashboard-based visualization."
    ]

    for l in lines:
        c.drawString(72, y, l)
        y -= 18
    c.save()

    buf.seek(0)
    pdf_bytes = buf.read()
    extracted_text, meta = DocumentParser.parse_file(pdf_bytes, "test_wrapped.pdf")

    resume = ResumeParser.parse(extracted_text, meta)
    assert len(resume.projects) == 2, f"Expected 2 projects from PDF, got {len(resume.projects)}"
    total_bullets = sum(len(p.bullets) for p in resume.projects)
    assert total_bullets == 6, f"Expected 6 logical bullets from PDF, got {total_bullets}"

    evaluated_bullets = BulletAnalyzer.analyze_resume_bullets(resume)
    assert len(evaluated_bullets) == 6, f"Expected 6 evaluated bullets, got {len(evaluated_bullets)}"
    quantified = [b for b in evaluated_bullets if b.is_quantified]
    assert len(quantified) == 3, f"Expected 3 quantified bullets from PDF (50%), got {len(quantified)}"
    print(f"  -> PASSED: Exactly 6 logical bullets reconstructed from PDF, 3 quantified (50%)")

def test_unbulleted_flat_projects_5():
    print("\n[REGRESSION TEST 5] Unbulleted Flat Lines Reconstruction")
    sample = """PROJECTS
Hoplid Interconnected Intelligence System | GitHub Aug '26
Architected a prototype intelligence system to interconnect Recommendation,
Matching, and Card Rolling engines through a shared user-signal layer
and feedback loop.
Implemented weighted recommendation and compatibility scoring using 5
recommendation signals, 4 matching signals, cosine/Jaccard similarity, FastAPI,
NumPy, Pandas, and Scikit-learn.
Validated the interconnected workflow with 5 automated Pytest cases, supporting
0–100 normalized scores, recently-seen/disliked-item filtering, feedback-driven signal
updates, and API latency measurement.

Smart Logistics & Delivery Intelligence Platform | GitHub | Live Jul '26
Designed a logistics intelligence platform to optimize delivery route planning
using Ant Colony Optimization (ACO).
Integrated and processed the Olist dataset in MySQL, loading 99K+ customers,
99K+ orders, 112K+ order items, and 32K+ products, with a React-based dashboard.
Delivered an end-to-end prototype combining route optimization, structured
logistics data, and dashboard-based visualization.
"""
    resume = ResumeParser.parse(sample)
    assert len(resume.projects) == 2, f"Expected 2 projects, got {len(resume.projects)}"
    total_bullets = sum(len(p.bullets) for p in resume.projects)
    assert total_bullets == 6, f"Expected 6 logical bullets from flat text without glyphs, got {total_bullets}"
    evaluated = BulletAnalyzer.analyze_resume_bullets(resume)
    assert len(evaluated) == 6, f"Expected 6 evaluated bullets, got {len(evaluated)}"
    quantified = [b for b in evaluated if b.is_quantified]
    assert len(quantified) == 3, f"Expected 3 quantified bullets out of 6 (50%), got {len(quantified)}"
    print("  -> PASSED: Exactly 6 bullets reconstructed from flat text without glyphs, 3 quantified (50%)")

def test_unbulleted_indented_projects_6():
    print("\n[REGRESSION TEST 6] Unbulleted Hanging-Indent Reconstruction")
    sample = """PROJECTS
Hoplid Interconnected Intelligence System | GitHub Aug '26
Architected a prototype intelligence system to interconnect Recommendation,
  Matching, and Card Rolling engines through a shared user-signal layer
  and feedback loop.
Implemented weighted recommendation and compatibility scoring using 5
  recommendation signals, 4 matching signals, cosine/Jaccard similarity, FastAPI,
  NumPy, Pandas, and Scikit-learn.
Validated the interconnected workflow with 5 automated Pytest cases, supporting
  0–100 normalized scores, recently-seen/disliked-item filtering, feedback-driven signal
  updates, and API latency measurement.

Smart Logistics & Delivery Intelligence Platform | GitHub | Live Jul '26
Designed a logistics intelligence platform to optimize delivery route planning
  using Ant Colony Optimization (ACO).
Integrated and processed the Olist dataset in MySQL, loading 99K+ customers,
  99K+ orders, 112K+ order items, and 32K+ products, with a React-based dashboard.
Delivered an end-to-end prototype combining route optimization, structured
  logistics data, and dashboard-based visualization.
"""
    resume = ResumeParser.parse(sample)
    assert len(resume.projects) == 2, f"Expected 2 projects, got {len(resume.projects)}"
    total_bullets = sum(len(p.bullets) for p in resume.projects)
    assert total_bullets == 6, f"Expected 6 logical bullets from indented text without glyphs, got {total_bullets}"
    evaluated = BulletAnalyzer.analyze_resume_bullets(resume)
    assert len(evaluated) == 6, f"Expected 6 evaluated bullets, got {len(evaluated)}"
    quantified = [b for b in evaluated if b.is_quantified]
    assert len(quantified) == 3, f"Expected 3 quantified bullets out of 6 (50%), got {len(quantified)}"
    print("  -> PASSED: Exactly 6 bullets reconstructed from indented text without glyphs, 3 quantified (50%)")

def test_unbulleted_pdf_extraction_7():
    print("\n[REGRESSION TEST 7] Unbulleted PDF Extraction & Reconstruction")
    import io
    from reportlab.lib.pagesizes import letter
    from reportlab.pdfgen import canvas
    from services.document_parser import DocumentParser

    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    y = 750
    lines = [
        "ALEX CHEN",
        "San Francisco, CA | (555) 382-9102 | alex.chen@email.com",
        "EDUCATION",
        "University of California, Berkeley — Bachelor of Science in Computer Science",
        "TECHNICAL SKILLS",
        "Languages: Python, SQL, C++, TypeScript",
        "Frameworks & Libraries: PyTorch, Scikit-learn, Pandas, NumPy, FastAPI, Flask",
        "PROJECTS",
        "Hoplid Interconnected Intelligence System | GitHub Aug '26",
        "Architected a prototype intelligence system to interconnect Recommendation,",
        "  Matching, and Card Rolling engines through a shared user-signal layer",
        "  and feedback loop.",
        "Implemented weighted recommendation and compatibility scoring using 5",
        "  recommendation signals, 4 matching signals, cosine/Jaccard similarity, FastAPI,",
        "  NumPy, Pandas, and Scikit-learn.",
        "Validated the interconnected workflow with 5 automated Pytest cases, supporting",
        "  0–100 normalized scores, recently-seen/disliked-item filtering, feedback-driven signal",
        "  updates, and API latency measurement.",
        "Smart Logistics & Delivery Intelligence Platform | GitHub | Live Jul '26",
        "Designed a logistics intelligence platform to optimize delivery route planning",
        "  using Ant Colony Optimization (ACO).",
        "Integrated and processed the Olist dataset in MySQL, loading 99K+ customers,",
        "  99K+ orders, 112K+ order items, and 32K+ products, with a React-based dashboard.",
        "Delivered an end-to-end prototype combining route optimization, structured",
        "  logistics data, and dashboard-based visualization."
    ]

    for l in lines:
        c.drawString(72, y, l)
        y -= 18
    c.save()

    buf.seek(0)
    pdf_bytes = buf.read()
    extracted_text, meta = DocumentParser.parse_file(pdf_bytes, "test_unbulleted.pdf")

    resume = ResumeParser.parse(extracted_text, meta)
    assert len(resume.projects) == 2, f"Expected 2 projects from unbulleted PDF, got {len(resume.projects)}"
    total_bullets = sum(len(p.bullets) for p in resume.projects)
    assert total_bullets == 6, f"Expected 6 logical bullets from unbulleted PDF, got {total_bullets}"

    evaluated_bullets = BulletAnalyzer.analyze_resume_bullets(resume)
    assert len(evaluated_bullets) == 6, f"Expected 6 evaluated bullets, got {len(evaluated_bullets)}"
    quantified = [b for b in evaluated_bullets if b.is_quantified]
    assert len(quantified) == 3, f"Expected 3 quantified bullets from unbulleted PDF (50%), got {len(quantified)}"
    print("  -> PASSED: Exactly 6 logical bullets reconstructed from unbulleted PDF, 3 quantified (50%)")

if __name__ == "__main__":
    test_audit()
    test_wrapped_bullet_1()
    test_metric_heavy_wrapped_bullet_2()
    test_dataset_wrapped_bullet_3()
    test_pdf_extraction_six_bullets_4()
    test_unbulleted_flat_projects_5()
    test_unbulleted_indented_projects_6()
    test_unbulleted_pdf_extraction_7()

