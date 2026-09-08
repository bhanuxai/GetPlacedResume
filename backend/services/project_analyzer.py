import re
from typing import List, Optional
from models.schemas import ProjectAnalysis, ProjectItem, StructuredJob

class ProjectAnalyzer:
    """
    Analyzes project entries individually, evaluating problem framing,
    solution implementation, technologies used, complexity, and quantifiable results.
    """

    @classmethod
    def analyze_projects(cls, projects: List[ProjectItem], job: Optional[StructuredJob] = None) -> List[ProjectAnalysis]:
        results = []
        for p in projects:
            results.append(cls.analyze_single_project(p, job))
        return results

    @classmethod
    def analyze_single_project(cls, project: ProjectItem, job: Optional[StructuredJob] = None) -> ProjectAnalysis:
        bullet_text = " ".join(project.bullets)
        full_text = f"{project.name}. {project.description or ''} {bullet_text}"
        words = full_text.split()

        # Detect technologies
        techs = list(set(project.technologies))
        # Look for common tech words in text
        for t in ["Python", "PyTorch", "TensorFlow", "React", "Docker", "FastAPI", "PostgreSQL", "AWS", "Scikit-learn", "Redis", "TypeScript", "Node.js"]:
            if re.search(rf"\b{re.escape(t)}\b", full_text, re.IGNORECASE) and t not in techs:
                techs.append(t)

        # Detect metrics
        metrics = project.metrics or []
        metrics_found = re.findall(r"(\d+%\s*|\$\d+[\d,]*|\b\d+x\b|\b\d+\s*(?:ms|seconds|users|requests|records|queries|accuracy|f1)\b)", full_text, re.IGNORECASE)
        all_metrics = list(set(metrics + metrics_found))

        # Problem / Solution heuristic
        has_problem = any(w in full_text.lower() for w in ["address", "problem", "challenge", "bottleneck", "resolve", "to eliminate", "designed to"])
        has_solution = any(w in full_text.lower() for w in ["built", "developed", "architected", "implemented", "leveraged", "trained", "deployed"])

        problem = "Inferred from system design and domain requirements." if not has_problem else "Explicitly outlined in project bullets."
        solution = f"Engineered system leveraging {', '.join(techs[:3]) if techs else 'core technologies'}."

        # Complexity Score
        complexity = 60
        if len(techs) >= 4:
            complexity += 15
        elif len(techs) >= 2:
            complexity += 10

        if all_metrics:
            complexity += 15
        if len(words) > 35:
            complexity += 10
        complexity = min(95, complexity)

        # Relevance to Job
        relevance_score = 75
        relevance_tier = "Moderate"
        if job:
            job_techs = [s.lower() for s in job.required_skills + job.preferred_skills]
            matches = [t for t in techs if t.lower() in job_techs]
            if len(matches) >= 2 or any(m in full_text.lower() for m in job_techs):
                relevance_score = 90
                relevance_tier = "High"
            elif not matches and len(job_techs) > 0:
                relevance_score = 55
                relevance_tier = "Low"

        # Critique and suggestions
        suggestions = []
        critique = "Project demonstrates applied technical competence."

        if not all_metrics:
            critique = "Project explains what was built, but lacks measurable outcome or validation metrics."
            suggestions.append("Add quantifiable validation metrics (e.g., test accuracy, latency, data scale, or active users).")

        if len(project.bullets) <= 1 and len(words) < 20:
            critique = "Project description is brief and under-specified."
            suggestions.append(f"Expand upon the architecture of {project.name}: specify input datasets, modeling approach, and operational deployment.")

        if not has_problem:
            suggestions.append("State the core problem or business objective before detailing the implementation.")

        return ProjectAnalysis(
            project_name=project.name,
            problem=problem,
            solution=solution,
            technologies=techs,
            complexity_score=complexity,
            candidate_contribution="Primary Architect & Developer",
            metrics_present=bool(all_metrics),
            metrics_summary=", ".join(all_metrics) if all_metrics else "None specified",
            relevance_to_job=relevance_tier,
            relevance_score=relevance_score,
            critique=critique,
            suggested_improvements=suggestions
        )
