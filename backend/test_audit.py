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
• Validated the interconnected workflow with 5 automated Pytest cases, 0–100 normalized scores, and 150ms latency.
• Engineered a dense vector retrieval system converting documents into embeddings with 5 recommendation signals and 4 matching signals.

Smart Logistics & Delivery Intelligence Platform | GitHub | Live Jul '26
• Designed a logistics intelligence platform processing 99K+ customers, 99K+ orders, 112K+ order items, and 32K+ products from the Olist dataset.
• Built automated data preprocessing and feature pipelines in Python for route optimization.
• Delivered an end-to-end prototype deployed using FastAPI and AWS.
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
    for p in resume.projects:
        print(f"     * Name: '{p.name}'")
        print(f"       Bullets ({len(p.bullets)}):")
        for b in p.bullets:
            print(f"         - {b[:70]}...")
            assert not re.search(r"\b(?:github|live)\b", b, re.IGNORECASE) and "hoplid" not in b.lower(), f"Header leaked as bullet: {b}"

    # 3. Test Bullet Analyzer & Metrics
    print(f"\n5. Bullet Quantification & Metric Evaluation:")
    bullets = BulletAnalyzer.analyze_resume_bullets(resume)
    print(f"   Total bullets evaluated: {len(bullets)}")
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
    assert quantified_count >= 3, f"Expected at least 3 quantified bullets, got {quantified_count}"

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
        if "Missing core competencies" in w:
            for pref in ["Hugging Face", "Pinecone", "Weaviate", "Milvus", "MLflow", "CI/CD", "Spark"]:
                assert pref.lower() not in w.lower(), f"Preferred skill '{pref}' erroneously labeled as missing core competency in: {w}"

    print("\n9. Recommendations Audit:")
    for rec in report.recommendations:
        print(f"   [{rec.priority}] {rec.title}: {rec.description}")

    print("\n10. Project Analyses:")
    for pa in report.project_analyses:
        print(f"    * {pa.project_name}: Relevance={pa.relevance_to_job} ({pa.relevance_score}), Complexity={pa.complexity_score}, Metrics={pa.metrics_summary}")

    print("\n==================================================================")
    print("ALL AUDIT VERIFICATIONS PASSED SUCCESSFULLY!")
    print("==================================================================")

if __name__ == "__main__":
    test_audit()
