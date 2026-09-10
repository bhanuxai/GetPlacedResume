import React from 'react';
import { AnalysisReport } from '../types';
import {
  CheckCircle2,
  AlertTriangle,
  FileCheck,
  ShieldCheck,
  Target,
  Sparkles,
  Award,
  Layers,
  AlertCircle
} from 'lucide-react';

interface PrintReportProps {
  report: AnalysisReport;
}

export const PrintReport: React.FC<PrintReportProps> = ({ report }) => {
  const {
    overall_score,
    tier,
    job_title,
    candidate_profile_type,
    processed_at,
    score_breakdown,
    executive_summary,
    strengths,
    weaknesses,
    skills_analysis,
    ats_format_report,
    requirement_matches,
    improvement_suggestions
  } = report;

  const tierBg =
    tier === 'STRONG MATCH'
      ? '#ECFDF5'
      : tier === 'MODERATE MATCH'
      ? '#FFFBEB'
      : '#FEF2F2';

  const tierBorder =
    tier === 'STRONG MATCH'
      ? '#10B981'
      : tier === 'MODERATE MATCH'
      ? '#F59E0B'
      : '#EF4444';

  const verdictText =
    overall_score >= 80
      ? 'High ATS Pass Likelihood — Candidate meets or exceeds key requirement thresholds.'
      : overall_score >= 60
      ? 'Moderate ATS Pass Likelihood — Meets core qualifications with targeted keyword and bullet gaps.'
      : 'Low ATS Pass Likelihood — Requires immediate alignment with job requirements and ATS formatting.';

  const dimensions = [
    { label: 'Job Relevance', score: score_breakdown.job_relevance, max: 30 },
    { label: 'Skills Competency', score: score_breakdown.skills_competency, max: 20 },
    { label: 'Experience Relevance', score: score_breakdown.experience_relevance, max: 20 },
    { label: 'ATS Parseability', score: score_breakdown.ats_parseability, max: 15 },
    { label: 'Content Quality', score: score_breakdown.content_quality, max: 10 },
    { label: 'Professional Presentation', score: score_breakdown.professional_presentation, max: 5 }
  ];

  return (
    <div className="print-only w-full max-w-[210mm] mx-auto bg-white text-slate-900 font-sans p-6 text-[10pt] leading-normal">
      {/* 1. DOCUMENT HEADER */}
      <div className="border-b-2 border-slate-900 pb-4 mb-5">
        <div className="flex items-start justify-between">
          <div>
            <div className="flex items-center space-x-2.5">
              <div className="w-8 h-8 rounded-xs bg-[#2563EB] flex items-center justify-center text-white font-bold text-base">
                GP
              </div>
              <div>
                <h1 className="text-xl font-bold tracking-tight text-slate-900 leading-none">
                  GetPlacedResume
                </h1>
                <p className="text-[8.5pt] font-medium text-slate-500 uppercase tracking-wider mt-1">
                  AI Resume &amp; CV ATS Evaluation Audit Report
                </p>
              </div>
            </div>
          </div>

          <div className="text-right text-[8.5pt] font-mono text-slate-600 space-y-0.5">
            <div>
              <span className="text-slate-400">Date:</span> {processed_at || new Date().toLocaleDateString()}
            </div>
            <div>
              <span className="text-slate-400">Engine:</span> Semantic NLP + Layout Heuristics
            </div>
            <div>
              <span className="text-slate-400">Evaluation Mode:</span>{' '}
              <span className="font-bold text-slate-800 uppercase">{candidate_profile_type || 'Standard'}</span>
            </div>
          </div>
        </div>

        {/* Target Position Strip */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-200 flex items-center justify-between text-[9pt]">
          <div className="flex items-center space-x-2">
            <span className="font-semibold text-slate-500 uppercase text-[8pt] tracking-wider">Target Position:</span>
            <span className="font-bold text-slate-900 text-sm">{job_title || 'Evaluated Position'}</span>
          </div>
          <div className="text-[8pt] text-slate-500 font-medium font-mono uppercase">
            CONFIDENTIAL CANDIDATE AUDIT
          </div>
        </div>
      </div>

      {/* 2. EXECUTIVE SCORECARD BANNER */}
      <div
        className="print-break-inside-avoid border rounded-md p-4 mb-5"
        style={{
          borderColor: tierBorder,
          backgroundColor: tierBg
        }}
      >
        <div className="flex items-center justify-between gap-4">
          {/* Left: Overall Score Badge */}
          <div className="flex items-center space-x-4">
            <div
              className="w-20 h-20 rounded-full border-4 flex flex-col items-center justify-center bg-white shadow-xs flex-shrink-0"
              style={{ borderColor: tierBorder }}
            >
              <span className="text-2xl font-black text-slate-900 leading-none">{overall_score}</span>
              <span className="text-[7.5pt] font-bold text-slate-500 uppercase tracking-widest mt-0.5">/ 100</span>
            </div>

            <div>
              <div className="flex items-center space-x-2">
                <span
                  className="px-2.5 py-0.5 rounded-xs text-[8.5pt] font-black tracking-wider uppercase border text-white"
                  style={{
                    backgroundColor: tierBorder,
                    borderColor: tierBorder
                  }}
                >
                  {tier}
                </span>
                <span className="text-xs font-semibold text-slate-600">ATS Verdict</span>
              </div>
              <p className="text-[9pt] font-medium text-slate-700 mt-1.5 max-w-md leading-snug">
                {verdictText}
              </p>
            </div>
          </div>

          {/* Right: Quick Meta Stats */}
          <div className="text-right border-l border-slate-300 pl-4 space-y-1 text-[8.5pt]">
            <div>
              <span className="text-slate-500">Skills Verified:</span>{' '}
              <span className="font-bold text-slate-800">
                {(skills_analysis?.strongly_demonstrated?.length || 0) + (skills_analysis?.partially_demonstrated?.length || 0)}
              </span>
            </div>
            <div>
              <span className="text-slate-500">Missing Keywords:</span>{' '}
              <span className="font-bold text-rose-600">
                {skills_analysis?.missing?.length || 0}
              </span>
            </div>
            <div>
              <span className="text-slate-500">ATS Parseability:</span>{' '}
              <span className="font-bold text-slate-800">
                {ats_format_report?.parseability_score || 95}%
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* 3. 6-DIMENSIONAL SCORE BREAKDOWN */}
      <div className="print-break-inside-avoid border border-slate-200 rounded-md p-4 mb-5 bg-slate-50/50">
        <h2 className="text-[9.5pt] font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-1.5">
          <Layers className="w-4 h-4 text-blue-600" />
          <span>Multi-Dimensional Score Breakdown</span>
        </h2>

        <div className="grid grid-cols-3 gap-2.5">
          {dimensions.map((dim, idx) => {
            const pct = Math.min(100, Math.round((dim.score / dim.max) * 100));
            const barColor = pct >= 80 ? '#10B981' : pct >= 60 ? '#F59E0B' : '#EF4444';

            return (
              <div key={idx} className="bg-white border border-slate-200 rounded p-2.5">
                <div className="flex items-center justify-between text-[8.5pt] mb-1">
                  <span className="font-medium text-slate-700">{dim.label}</span>
                  <span className="font-bold text-slate-900">
                    {dim.score.toFixed(1)} <span className="text-slate-400 font-normal text-[7.5pt]">/ {dim.max}</span>
                  </span>
                </div>
                <div className="w-full bg-slate-100 rounded-full h-1.5 overflow-hidden">
                  <div
                    className="h-full rounded-full"
                    style={{ width: `${pct}%`, backgroundColor: barColor }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* 4. EXECUTIVE SUMMARY, STRENGTHS & VULNERABILITIES */}
      <div className="print-break-inside-avoid border border-slate-200 rounded-md p-4 mb-5">
        <h2 className="text-[9.5pt] font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center space-x-1.5">
          <Award className="w-4 h-4 text-blue-600" />
          <span>Executive Summary &amp; Findings</span>
        </h2>

        {executive_summary && executive_summary.length > 0 && (
          <ul className="space-y-1.5 mb-3 text-[8.5pt] text-slate-700">
            {executive_summary.map((item, idx) => (
              <li key={idx} className="flex items-start space-x-2">
                <span className="w-1.5 h-1.5 rounded-full bg-blue-600 mt-1.5 flex-shrink-0" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        )}

        <div className="grid grid-cols-2 gap-3 pt-3 border-t border-slate-200 text-[8.5pt]">
          <div className="bg-emerald-50/70 border border-emerald-200 rounded p-3">
            <span className="font-bold uppercase tracking-wider text-emerald-800 text-[8pt] block mb-1.5">
              Primary Strengths
            </span>
            <ul className="space-y-1.5 text-slate-800">
              {strengths?.slice(0, 4).map((str, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{str}</span>
                </li>
              ))}
            </ul>
          </div>

          <div className="bg-rose-50/70 border border-rose-200 rounded p-3">
            <span className="font-bold uppercase tracking-wider text-rose-800 text-[8pt] block mb-1.5">
              Identified Vulnerabilities
            </span>
            <ul className="space-y-1.5 text-slate-800">
              {weaknesses?.slice(0, 4).map((wk, idx) => (
                <li key={idx} className="flex items-start space-x-1.5">
                  <AlertCircle className="w-3.5 h-3.5 text-rose-600 flex-shrink-0 mt-0.5" />
                  <span className="leading-tight">{wk}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* 5. ATS DOCUMENT & FORMAT AUDIT */}
      <div className="print-break-inside-avoid border border-slate-200 rounded-md p-4 mb-5">
        <h2 className="text-[9.5pt] font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center space-x-1.5">
          <FileCheck className="w-4 h-4 text-blue-600" />
          <span>ATS Document Parsing &amp; Format Audit</span>
        </h2>

        <div className="grid grid-cols-4 gap-2.5 text-[8.5pt] mb-2">
          <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
            <span className="text-slate-500 block text-[7.5pt] uppercase font-semibold">Columns</span>
            <span className={`font-bold ${ats_format_report?.two_column_layout_detected ? 'text-amber-600' : 'text-emerald-600'}`}>
              {ats_format_report?.two_column_layout_detected ? '2-Column Risk' : 'Single Column (Safe)'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
            <span className="text-slate-500 block text-[7.5pt] uppercase font-semibold">Tables</span>
            <span className={`font-bold ${(ats_format_report?.tables_detected || 0) > 0 ? 'text-amber-600' : 'text-emerald-600'}`}>
              {(ats_format_report?.tables_detected || 0) > 0 ? `${ats_format_report?.tables_detected} Detected` : '0 Tables (Safe)'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
            <span className="text-slate-500 block text-[7.5pt] uppercase font-semibold">Text Extraction</span>
            <span className={`font-bold ${ats_format_report?.scanned_image_detected ? 'text-rose-600' : 'text-emerald-600'}`}>
              {ats_format_report?.scanned_image_detected ? 'Scanned Image (Risk)' : 'True Text Layer'}
            </span>
          </div>

          <div className="bg-slate-50 border border-slate-200 rounded p-2 text-center">
            <span className="text-slate-500 block text-[7.5pt] uppercase font-semibold">Reading Order</span>
            <span className={`font-bold ${ats_format_report?.broken_reading_order_risk === 'HIGH' ? 'text-rose-600' : 'text-emerald-600'}`}>
              {ats_format_report?.broken_reading_order_risk || 'LOW'} Risk
            </span>
          </div>
        </div>

        {ats_format_report?.detected_issues && ats_format_report.detected_issues.length > 0 && (
          <div className="border-t border-slate-200 pt-2 space-y-1">
            <span className="text-[7.5pt] font-bold text-slate-500 uppercase tracking-wider">Formatting Warnings:</span>
            {ats_format_report.detected_issues.slice(0, 2).map((issue, idx) => (
              <div key={idx} className="flex items-start space-x-2 text-[8pt] bg-amber-50/60 border border-amber-200 rounded p-1.5">
                <AlertTriangle className="w-3 h-3 text-amber-600 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-slate-800">{issue.title}: </span>
                  <span className="text-slate-600">{issue.recommendation}</span>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* PAGE BREAK FOR EXTENSIVE SECTIONS */}
      <div className="print-break-before" />

      {/* 6. SKILLS GAP ANALYSIS MATRIX */}
      <div className="print-break-inside-avoid border border-slate-200 rounded-md p-4 mb-5">
        <h2 className="text-[9.5pt] font-bold uppercase tracking-wider text-slate-700 mb-3 flex items-center space-x-1.5">
          <Target className="w-4 h-4 text-blue-600" />
          <span>Skills Gap Analysis Matrix</span>
        </h2>

        <div className="space-y-3 text-[8.5pt]">
          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-emerald-500" />
              <span className="font-bold uppercase tracking-wider text-emerald-800 text-[8pt]">
                Strongly Demonstrated in Experience &amp; Projects ({skills_analysis?.strongly_demonstrated?.length || 0})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills_analysis?.strongly_demonstrated?.length ? (
                skills_analysis.strongly_demonstrated.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[8pt] font-medium bg-emerald-100/70 border border-emerald-300 text-emerald-900"
                  >
                    ✓ {sk}
                  </span>
                ))
              ) : (
                <span className="text-slate-400 italic">None strongly demonstrated</span>
              )}
            </div>
          </div>

          {skills_analysis?.mentioned_only && skills_analysis.mentioned_only.length > 0 && (
            <div>
              <div className="flex items-center space-x-2 mb-1.5">
                <span className="w-2 h-2 rounded-full bg-amber-500" />
                <span className="font-bold uppercase tracking-wider text-amber-800 text-[8pt]">
                  Mentioned in Skills but Lacks Experience Proof ({skills_analysis.mentioned_only.length})
                </span>
              </div>
              <div className="flex flex-wrap gap-1.5">
                {skills_analysis.mentioned_only.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[8pt] font-medium bg-amber-100/70 border border-amber-300 text-amber-900"
                  >
                    ~ {sk}
                  </span>
                ))}
              </div>
            </div>
          )}

          <div>
            <div className="flex items-center space-x-2 mb-1.5">
              <span className="w-2 h-2 rounded-full bg-rose-500" />
              <span className="font-bold uppercase tracking-wider text-rose-800 text-[8pt]">
                Missing Critical Job Description Keywords ({skills_analysis?.missing?.length || 0})
              </span>
            </div>
            <div className="flex flex-wrap gap-1.5">
              {skills_analysis?.missing?.length ? (
                skills_analysis.missing.map((sk, idx) => (
                  <span
                    key={idx}
                    className="px-2 py-0.5 rounded text-[8pt] font-medium bg-rose-100/70 border border-rose-300 text-rose-900"
                  >
                    ✕ {sk}
                  </span>
                ))
              ) : (
                <span className="text-emerald-700 font-medium text-[8pt]">No critical skills missing from job description!</span>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* 7. TOP REQUIREMENT MATCHES */}
      {requirement_matches && requirement_matches.length > 0 && (
        <div className="print-break-inside-avoid border border-slate-200 rounded-md p-4 mb-5">
          <h2 className="text-[9.5pt] font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center space-x-1.5">
            <ShieldCheck className="w-4 h-4 text-blue-600" />
            <span>Job Requirement Verification Table</span>
          </h2>

          <table className="w-full border-collapse text-[8pt]">
            <thead>
              <tr className="bg-slate-100 text-slate-700 text-left border-b border-slate-300">
                <th className="py-1.5 px-2 font-bold uppercase">Requirement</th>
                <th className="py-1.5 px-2 font-bold uppercase w-28">Status</th>
                <th className="py-1.5 px-2 font-bold uppercase w-20">Confidence</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {requirement_matches.slice(0, 6).map((req, idx) => {
                const isMatch = req.match_status === 'STRONG_MATCH';
                const isPartial = req.match_status === 'PARTIAL_MATCH';
                const statusColor = isMatch
                  ? 'text-emerald-700 bg-emerald-50 border-emerald-200'
                  : isPartial
                  ? 'text-amber-700 bg-amber-50 border-amber-200'
                  : 'text-rose-700 bg-rose-50 border-rose-200';

                return (
                  <tr key={idx} className="hover:bg-slate-50/50">
                    <td className="py-1.5 px-2">
                      <span className="font-semibold text-slate-900 block leading-tight">
                        {req.requirement_text}
                      </span>
                      {req.explanation && (
                        <span className="text-[7.5pt] text-slate-500 block mt-0.5 leading-tight">
                          {req.explanation}
                        </span>
                      )}
                    </td>
                    <td className="py-1.5 px-2 whitespace-nowrap">
                      <span className={`px-2 py-0.5 rounded text-[7.5pt] font-bold border ${statusColor}`}>
                        {req.match_status.replace('_', ' ')}
                      </span>
                    </td>
                    <td className="py-1.5 px-2 font-mono font-bold text-slate-700">
                      {Math.round(req.confidence * 100)}%
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}

      {/* 8. HIGH-IMPACT FIX MY RESUME SUGGESTIONS */}
      {improvement_suggestions && improvement_suggestions.length > 0 && (
        <div className="print-break-inside-avoid border border-slate-200 rounded-md p-4 mb-5 bg-slate-50/40">
          <h2 className="text-[9.5pt] font-bold uppercase tracking-wider text-slate-700 mb-2.5 flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-blue-600" />
            <span>High-Impact Actionable Bullet Revisions</span>
          </h2>

          <div className="space-y-2.5">
            {improvement_suggestions.slice(0, 3).map((item, idx) => (
              <div key={idx} className="bg-white border border-slate-200 rounded p-2.5 text-[8.5pt]">
                <div className="flex items-center justify-between mb-1 text-[7.5pt]">
                  <span className="font-bold text-slate-500 uppercase tracking-wider">
                    {item.section || 'Experience Bullet'}
                  </span>
                  <span className="px-1.5 py-0.2 bg-blue-100 text-blue-800 font-bold rounded">
                    Impact: {item.impact}
                  </span>
                </div>

                <div className="space-y-1">
                  <div className="text-slate-600 line-through text-[8pt]">
                    <span className="text-rose-600 font-bold mr-1">Before:</span>
                    {item.original}
                  </div>
                  <div className="text-emerald-950 font-semibold text-[8.5pt] bg-emerald-50/60 p-1.5 rounded border border-emerald-200">
                    <span className="text-emerald-700 font-bold mr-1">Recommended:</span>
                    {item.suggested}
                  </div>
                  {item.why && (
                    <div className="text-[7.5pt] text-slate-500 italic mt-0.5">
                      Rationale: {item.why}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* 9. PROFESSIONAL REPORT FOOTER */}
      <div className="border-t border-slate-300 pt-3 mt-4 text-[7.5pt] text-slate-400 flex items-center justify-between font-mono">
        <div>
          GetPlacedResume — Multi-Dimensional ATS Evaluation Engine
        </div>
        <div>
          Confidential Candidate Audit Report
        </div>
      </div>
    </div>
  );
};
