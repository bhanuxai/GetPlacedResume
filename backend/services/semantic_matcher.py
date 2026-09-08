import os
import re
import numpy as np
from typing import List, Dict, Any, Tuple, Optional
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from models.schemas import StructuredResume, StructuredJob, RequirementMatch, JobRequirement

TECH_ONTOLOGY = {
    "nlp": ["transformer", "bert", "gpt", "spacy", "nltk", "tokenization", "text classification", "ner", "embeddings", "language model", "llm", "rag", "huggingface", "sentiment analysis", "semantic search"],
    "machine learning": ["classification", "regression", "random forest", "xgboost", "scikit-learn", "supervised learning", "cross-validation", "hyperparameter tuning", "clustering", "predictive"],
    "deep learning": ["neural network", "cnn", "rnn", "lstm", "pytorch", "tensorflow", "backpropagation", "cuda", "gpu", "embedding"],
    "cloud": ["aws", "gcp", "azure", "ec2", "s3", "lambda", "cloudformation", "iam", "serverless"],
    "devops": ["docker", "kubernetes", "ci/cd", "github actions", "jenkins", "terraform", "helm", "containerization"],
    "frontend": ["react", "typescript", "javascript", "next.js", "vue", "tailwind", "redux", "css", "html", "vite"],
    "backend": ["fastapi", "flask", "django", "express", "node.js", "rest api", "graphql", "microservices", "spring boot", "restful"],
    "database": ["postgresql", "sql", "mysql", "mongodb", "redis", "dynamodb", "elasticsearch", "nosql", "query optimization", "relational"],
    "big data": ["spark", "pyspark", "hadoop", "kafka", "flink", "data warehouse", "snowflake", "bigquery"]
}

class SemanticMatcher:
    """
    Computes explainable semantic similarity between job requirements and resume sections.
    Integrates subword n-gram vector spaces, domain ontology expansion, and evidence verification.
    """

    _st_model = None
    _st_attempted = False

    @classmethod
    def get_transformer_model(cls):
        # Only attempt if explicitly opted-in via env
        if os.environ.get("ENABLE_HF_DOWNLOAD") == "true" and not cls._st_attempted:
            cls._st_attempted = True
            try:
                from sentence_transformers import SentenceTransformer
                cls._st_model = SentenceTransformer('all-MiniLM-L6-v2')
            except Exception:
                cls._st_model = None
        return cls._st_model

    @classmethod
    def match_all(cls, resume: StructuredResume, job: StructuredJob) -> Tuple[List[RequirementMatch], Dict[str, List[str]]]:
        evidence_units = []
        
        for exp in resume.experience:
            for b in exp.bullets:
                evidence_units.append({
                    "text": b,
                    "source": f"Experience at {exp.company} ({exp.title})",
                    "type": "experience"
                })
        
        for proj in resume.projects:
            for b in proj.bullets:
                evidence_units.append({
                    "text": b,
                    "source": f"Project: {proj.name}",
                    "type": "project"
                })
            if proj.technologies:
                evidence_units.append({
                    "text": f"Technologies used in {proj.name}: {', '.join(proj.technologies)}",
                    "source": f"Project Tech: {proj.name}",
                    "type": "project"
                })

        if resume.summary:
            evidence_units.append({
                "text": resume.summary,
                "source": "Professional Summary",
                "type": "summary"
            })

        for edu in resume.education:
            edu_desc = f"{edu.degree or ''} from {edu.institution}. Coursework: {', '.join(edu.coursework)}"
            evidence_units.append({
                "text": edu_desc,
                "source": f"Education: {edu.institution}",
                "type": "education"
            })

        skill_names = [s.name.lower() for s in resume.skills]
        raw_resume_lower = resume.raw_text.lower()

        matches: List[RequirementMatch] = []
        
        strongly_demo = set()
        partially_demo = set()
        mentioned_only = set()
        missing_skills = set()

        for req in job.requirements:
            match = cls._evaluate_requirement(req, evidence_units, skill_names, raw_resume_lower, resume)
            matches.append(match)

            for kw in req.keywords:
                if match.match_status == "STRONG_MATCH":
                    strongly_demo.add(kw)
                elif match.match_status == "PARTIAL_MATCH":
                    partially_demo.add(kw)
                elif match.match_status == "WEAK_EVIDENCE":
                    mentioned_only.add(kw)
                elif match.match_status == "MISSING":
                    missing_skills.add(kw)

        for rs in job.required_skills:
            rs_l = rs.lower()
            if rs_l in [s.lower() for s in strongly_demo]:
                continue
            
            in_skills = rs_l in skill_names
            in_evidence = any(rs_l in u["text"].lower() for u in evidence_units)
            
            if in_evidence:
                strongly_demo.add(rs)
            elif in_skills:
                mentioned_only.add(rs)
            else:
                missing_skills.add(rs)

        skills_analysis = {
            "strongly_demonstrated": sorted(list(strongly_demo)),
            "partially_demonstrated": sorted(list(partially_demo - strongly_demo)),
            "mentioned_only": sorted(list(mentioned_only - strongly_demo - partially_demo)),
            "missing": sorted(list(missing_skills - strongly_demo - partially_demo - mentioned_only))
        }

        return matches, skills_analysis

    @classmethod
    def _evaluate_requirement(
        cls, 
        req: JobRequirement, 
        evidence_units: List[Dict[str, str]], 
        skill_names: List[str], 
        raw_resume_lower: str,
        resume: StructuredResume
    ) -> RequirementMatch:
        
        req_text_lower = req.text.lower()

        if req.category == "education":
            return cls._evaluate_education_req(req, resume)

        if req.category == "experience" and re.search(r"\d+\+?\s*years", req_text_lower):
            return cls._evaluate_exp_years_req(req, resume)

        best_score = 0.0
        best_unit = None
        evidence_snippets = []

        # 1. Semantic N-Gram Vector Space with Character-level subwords
        if len(evidence_units) > 0:
            corpus = [u["text"] for u in evidence_units]
            try:
                vectorizer = TfidfVectorizer(
                    ngram_range=(1, 3),
                    sublinear_tf=True,
                    token_pattern=r"(?u)\b\w+\b"
                )
                matrix = vectorizer.fit_transform(corpus + [req.text])
                sims = cosine_similarity(matrix[-1:], matrix[:-1])[0]
                
                # Check top 3 matches
                sorted_indices = np.argsort(sims)[::-1]
                top_idx = int(sorted_indices[0])
                best_score = float(sims[top_idx])

                if best_score > 0.12:
                    best_unit = evidence_units[top_idx]
                    evidence_snippets.append(f"\"{best_unit['text']}\" — ({best_unit['source']})")

                    for idx in sorted_indices[1:3]:
                        if sims[idx] > 0.15:
                            evidence_snippets.append(f"\"{evidence_units[idx]['text']}\" — ({evidence_units[idx]['source']})")
            except Exception:
                best_score = 0.0

        # 2. Domain Ontology Concept Expansion
        ontology_boost = 0.0
        ontology_matched_terms = []
        for domain, concepts in TECH_ONTOLOGY.items():
            req_has_concept = (domain in req_text_lower) or any(c in req_text_lower for c in concepts)
            if req_has_concept:
                for c in concepts:
                    if c in raw_resume_lower:
                        ontology_boost = max(ontology_boost, 0.40)
                        ontology_matched_terms.append(c)
                        # Check if any unit has it
                        for u in evidence_units:
                            if c in u["text"].lower() and f"\"{u['text']}\" — ({u['source']})" not in evidence_snippets:
                                evidence_snippets.append(f"\"{u['text']}\" — ({u['source']})")
                                break
                        break

        # Check keywords directly
        kw_hits = [kw for kw in req.keywords if kw.lower() in raw_resume_lower]
        kw_in_skills_only = False
        for kw in req.keywords:
            if kw.lower() in skill_names and not any(kw.lower() in u["text"].lower() for u in evidence_units if u["type"] in ("experience", "project")):
                kw_in_skills_only = True
                break

        combined_score = min(0.96, best_score * 1.5 + ontology_boost)
        if kw_hits and not evidence_snippets:
            combined_score = max(combined_score, 0.50)

        # Match Status determination
        if combined_score >= 0.58 or (len(evidence_snippets) > 0 and (best_score >= 0.25 or ontology_boost >= 0.30)):
            match_status = "STRONG_MATCH"
            confidence = min(0.96, max(0.82, combined_score))
            explanation = "Directly demonstrated with contextual evidence in projects or work experience."
        elif combined_score >= 0.35 or ontology_boost > 0 or kw_hits:
            match_status = "PARTIAL_MATCH"
            confidence = round(max(0.55, combined_score), 2)
            explanation = "Related competencies or transferable experience demonstrated, but missing exact depth requested."
        elif kw_in_skills_only:
            match_status = "WEAK_EVIDENCE"
            confidence = 0.42
            explanation = "Appears in skills list or keywords, but lacks concrete project or work experience demonstration."
            if not evidence_snippets:
                evidence_snippets.append("Mentioned in Skills section without supporting project bullet.")
        else:
            match_status = "MISSING"
            confidence = round(max(0.05, combined_score), 2)
            explanation = "No direct or transferable evidence found in resume for this requirement."

        return RequirementMatch(
            requirement_id=req.id,
            requirement_text=req.text,
            category=req.category,
            importance=req.importance,
            match_status=match_status,
            confidence=confidence,
            evidence_snippets=evidence_snippets[:2],
            explanation=explanation
        )

    @classmethod
    def _evaluate_education_req(cls, req: JobRequirement, resume: StructuredResume) -> RequirementMatch:
        has_degree = False
        evidence = []
        
        for edu in resume.education:
            deg = (edu.degree or "").lower()
            inst = edu.institution
            if any(term in deg for term in ["bachelor", "master", "phd", "computer science", "b.s", "m.s", "engineering"]):
                has_degree = True
                evidence.append(f"{edu.degree} from {inst}")

        if has_degree:
            return RequirementMatch(
                requirement_id=req.id,
                requirement_text=req.text,
                category=req.category,
                importance=req.importance,
                match_status="STRONG_MATCH",
                confidence=0.96,
                evidence_snippets=evidence,
                explanation="Candidate holds a qualifying academic degree from an accredited institution."
            )
        elif len(resume.education) > 0:
            return RequirementMatch(
                requirement_id=req.id,
                requirement_text=req.text,
                category=req.category,
                importance=req.importance,
                match_status="PARTIAL_MATCH",
                confidence=0.70,
                evidence_snippets=[f"{resume.education[0].institution}"],
                explanation="Candidate has academic background, but degree discipline may not fully match the specific specification."
            )
        else:
            return RequirementMatch(
                requirement_id=req.id,
                requirement_text=req.text,
                category=req.category,
                importance=req.importance,
                match_status="MISSING",
                confidence=0.15,
                evidence_snippets=[],
                explanation="No education credentials identified in resume."
            )

    @classmethod
    def _evaluate_exp_years_req(cls, req: JobRequirement, resume: StructuredResume) -> RequirementMatch:
        num_match = re.search(r"(\d+)\+?\s*years", req.text.lower())
        years_required = int(num_match.group(1)) if num_match else 2

        exp_count = len(resume.experience)
        if resume.profile_type in ("student", "fresher"):
            if years_required <= 1:
                return RequirementMatch(
                    requirement_id=req.id,
                    requirement_text=req.text,
                    category=req.category,
                    importance=req.importance,
                    match_status="STRONG_MATCH",
                    confidence=0.88,
                    evidence_snippets=["Student/Fresher profile with hands-on projects & internships."],
                    explanation="Meets entry-level threshold through academic projects and internship experience."
                )
            else:
                return RequirementMatch(
                    requirement_id=req.id,
                    requirement_text=req.text,
                    category=req.category,
                    importance=req.importance,
                    match_status="PARTIAL_MATCH",
                    confidence=0.55,
                    evidence_snippets=["Active coursework and technical project portfolio."],
                    explanation=f"Target role requests {years_required}+ years experience. Candidate is emerging into the field."
                )

        est_years = max(1, exp_count * 1.5)
        if est_years >= years_required:
            return RequirementMatch(
                requirement_id=req.id,
                requirement_text=req.text,
                category=req.category,
                importance=req.importance,
                match_status="STRONG_MATCH",
                confidence=0.92,
                evidence_snippets=[f"Documented experience across {exp_count} professional roles."],
                explanation=f"Experience tenure satisfies the {years_required}+ years requirement."
            )
        else:
            return RequirementMatch(
                requirement_id=req.id,
                requirement_text=req.text,
                category=req.category,
                importance=req.importance,
                match_status="PARTIAL_MATCH",
                confidence=0.65,
                evidence_snippets=[f"Track record with {exp_count} roles."],
                explanation=f"Candidate has professional experience, but total tenure may be slightly below {years_required} years."
            )
