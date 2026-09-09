export interface ContactInfo {
  name?: string;
  email?: string;
  phone?: string;
  linkedin?: string;
  github?: string;
  portfolio?: string;
  location?: string;
}

export interface ScoreBreakdown {
  job_relevance: number;
  skills_competency: number;
  experience_relevance: number;
  ats_parseability: number;
  content_quality: number;
  professional_presentation: number;
  total_score: number;
  tier: "STRONG MATCH" | "MODERATE MATCH" | "NEEDS IMPROVEMENT";
}

export interface RequirementMatch {
  requirement_id: string;
  requirement_text: string;
  category: string;
  importance: string;
  match_status: "STRONG_MATCH" | "PARTIAL_MATCH" | "WEAK_EVIDENCE" | "MISSING" | "NOT_APPLICABLE";
  confidence: number;
  evidence_snippets: string[];
  explanation: string;
}

export interface BulletAnalysis {
  id: string;
  original_text: string;
  action_verb?: string;
  has_strong_verb: boolean;
  technical_substance: "High" | "Medium" | "Low";
  has_outcome: boolean;
  is_quantified: boolean;
  score: number;
  structure_grade: "A" | "B" | "C" | "D";
  recommendation?: string;
  suggested_revision?: string;
  rationale?: string;
}

export interface ProjectAnalysis {
  project_name: string;
  problem?: string;
  solution?: string;
  technologies: string[];
  complexity_score: number;
  candidate_contribution: string;
  metrics_present: boolean;
  metrics_summary?: string;
  relevance_to_job: "High" | "Moderate" | "Low";
  relevance_score: number;
  critique: string;
  suggested_improvements: string[];
}

export interface ATSIssue {
  severity: "HIGH" | "MEDIUM" | "LOW";
  issue_type: "layout" | "table" | "header_footer" | "font" | "section" | "contact";
  title: string;
  description: string;
  recommendation: string;
}

export interface ATSFormatReport {
  parseability_score: number;
  two_column_layout_detected: boolean;
  tables_detected: number;
  scanned_image_detected: boolean;
  headers_footers_with_content: boolean;
  broken_reading_order_risk: "LOW" | "MEDIUM" | "HIGH";
  font_issues: string[];
  detected_issues: ATSIssue[];
}

export interface Recommendation {
  id: string;
  priority: "HIGH" | "MEDIUM" | "LOW";
  category: string;
  title: string;
  description: string;
  action_item: string;
}

export interface ImprovementSuggestion {
  id: string;
  section: string;
  original: string;
  suggested: string;
  why: string;
  impact: "HIGH" | "MEDIUM" | "LOW";
  status: "PENDING" | "ACCEPTED" | "REJECTED";
}

export interface AnalysisReport {
  overall_score: number;
  tier: "STRONG MATCH" | "MODERATE MATCH" | "NEEDS IMPROVEMENT";
  score_breakdown: ScoreBreakdown;
  executive_summary: string[];
  strengths: string[];
  weaknesses: string[];
  candidate_profile_type: string;
  requirement_matches: RequirementMatch[];
  skills_analysis: {
    strongly_demonstrated: string[];
    partially_demonstrated: string[];
    mentioned_only: string[];
    missing: string[];
  };
  experience_summary: {
    roles_count: number;
    total_bullets: number;
    profile_type: string;
    education_highest: string;
  };
  project_analyses: ProjectAnalysis[];
  bullet_analyses: BulletAnalysis[];
  ats_format_report: ATSFormatReport;
  recommendations: Recommendation[];
  improvement_suggestions: ImprovementSuggestion[];
  job_title?: string;
  processed_at: string;
}

export interface JobMatchRecord {
  id: string;
  jobTitle: string;
  company?: string;
  score: number;
  tier: string;
  date: string;
  report: AnalysisReport;
}

