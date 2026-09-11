import React, { useState } from 'react';
import {
  Eye,
  CheckCircle2,
  AlertTriangle,
  Layers,
  ArrowRight,
  Target,
  Sparkles,
  Search,
  Scale
} from 'lucide-react';
import { AnalysisReport } from '../types';

interface RecruiterPerspectiveProps {
  overallScore?: number;
  tier?: string;
  onNavigateTab?: (tab: string) => void;
  report?: AnalysisReport;
}

export const RecruiterPerspective: React.FC<RecruiterPerspectiveProps> = ({
  overallScore = 75,
  tier = 'MODERATE MATCH',
  onNavigateTab,
  report
}) => {
  const [activeSection, setActiveSection] = useState<'all' | 'recruiter' | 'comparison'>('all');

  const totalBullets = report?.bullet_analyses?.length || 0;
  const quantifiedBullets = report?.bullet_analyses?.filter((b) => b.is_quantified)?.length || 0;
  const unquantifiedBullets = totalBullets - quantifiedBullets;
  const quantifiedPct = totalBullets > 0 ? Math.round((quantifiedBullets / totalBullets) * 100) : 0;
  const readingRisk = report?.ats_format_report?.broken_reading_order_risk || 'LOW';
  const hasTwoColumn = report?.ats_format_report?.two_column_layout_detected || false;
  const targetRole = report?.job_title || 'Target Role';
  const strongSkillsCount = report?.skills_analysis?.strongly_demonstrated?.length || 0;

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#262626]">
          <div>
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-mono text-xs font-bold mb-3 uppercase tracking-wider">
              <Eye className="w-3.5 h-3.5" />
              <span>Behind The Hiring Curtain</span>
            </div>
            <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              How Recruiters See Your Resume &amp; Why GetPlacedResume Differs
            </h2>
            <p className="text-xs sm:text-sm text-slate-600 dark:text-[#94A3B8] max-w-3xl mt-2 leading-relaxed">
              Passing an ATS algorithm is only step one. Once your resume clears automated parsing, human reviewers often triage applications in rapid scan passes. Our <span className="font-semibold text-slate-900 dark:text-white">6–8 Second Scan Model</span> provides an internal product heuristic to simulate this scan, highlighting what reviewers observe first and how our evaluation engine assesses candidate strength.
            </p>
          </div>

          {/* Quick Segment Filter */}
          <div className="flex sm:flex-col gap-2 flex-shrink-0">
            <button
              onClick={() => setActiveSection('all')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeSection === 'all'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#000000] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#262626] hover:bg-slate-200 dark:hover:bg-[#171717]'
              }`}
            >
              <Layers className="w-3.5 h-3.5" />
              <span>Complete View</span>
            </button>
            <button
              onClick={() => setActiveSection('recruiter')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeSection === 'recruiter'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#000000] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#262626] hover:bg-slate-200 dark:hover:bg-[#171717]'
              }`}
            >
              <Eye className="w-3.5 h-3.5" />
              <span>6-Sec Recruiter Lens</span>
            </button>
            <button
              onClick={() => setActiveSection('comparison')}
              className={`px-3.5 py-2 text-xs font-bold rounded-xs transition-all flex items-center justify-center space-x-1.5 cursor-pointer ${
                activeSection === 'comparison'
                  ? 'bg-[#2563EB] text-white shadow-xs'
                  : 'bg-slate-100 dark:bg-[#000000] text-slate-700 dark:text-slate-300 border border-slate-300 dark:border-[#262626] hover:bg-slate-200 dark:hover:bg-[#171717]'
              }`}
            >
              <Scale className="w-3.5 h-3.5" />
              <span>Our ATS vs Others</span>
            </button>
          </div>
        </div>

        {/* Quick Summary Pill Bar */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mt-6">
          <div className="p-3.5 rounded-xs bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626]">
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 block mb-1">RECRUITER SCAN HEURISTIC</span>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              Simulates rapid reviewer scanning in an &quot;F-Pattern&quot; looking for title alignment, stack fit, and metric proof.
            </p>
          </div>
          <div className="p-3.5 rounded-xs bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626]">
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 block mb-1">KEYWORD-HEAVY LIMITATION</span>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              Keyword-heavy optimization can encourage repetitive terminology; GetPlacedResume emphasizes contextual evidence instead.
            </p>
          </div>
          <div className="p-3.5 rounded-xs bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626]">
            <span className="text-[10px] font-mono uppercase text-slate-400 dark:text-slate-500 block mb-1">CONTEXTUAL VERIFICATION</span>
            <p className="text-xs font-semibold text-slate-900 dark:text-white">
              GetPlacedResume balances ATS vector parsing with human reviewer readability and proof.
            </p>
          </div>
        </div>

        {/* Live Candidate Diagnostic Block when report is loaded */}
        {report && (
          <div className="mt-6 pt-6 border-t border-slate-200 dark:border-[#262626]">
            <div className="flex items-center justify-between mb-3">
              <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white flex items-center space-x-2">
                <Sparkles className="w-4 h-4 text-[#2563EB]" />
                <span>Live Resume Diagnostic (Under Recruiter Lens)</span>
              </span>
              <span className="text-[10px] font-mono px-2.5 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900/60 text-blue-800 dark:text-blue-300 font-bold">
                {tier} ({overallScore}/100)
              </span>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="p-3 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">METRIC PROOF (SECONDS 4-6)</span>
                <div className="flex items-baseline space-x-2">
                  <span className={`font-bold font-mono text-sm ${quantifiedPct >= 50 ? 'text-emerald-600 dark:text-emerald-400' : 'text-amber-600 dark:text-amber-400'}`}>
                    {quantifiedPct}% Quantified
                  </span>
                  <span className="text-[11px] text-slate-500">({quantifiedBullets}/{totalBullets} bullets)</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {quantifiedPct >= 60 ? 'Strong metric backing catches reviewer attention quickly.' : `${unquantifiedBullets} of ${totalBullets} analyzed bullets lack measurable outcomes. Add metrics (%, scale, latency) to demonstrate impact.`}
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">LAYOUT &amp; READING RISK</span>
                <div className="flex items-baseline space-x-2">
                  <span className={`font-bold font-mono text-sm ${readingRisk === 'LOW' ? 'text-emerald-600 dark:text-emerald-400' : 'text-red-600 dark:text-red-400'}`}>
                    {readingRisk} Risk
                  </span>
                  <span className="text-[11px] text-slate-500">{hasTwoColumn ? '(2-column layout)' : '(Single-column flow)'}</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  {readingRisk === 'LOW' ? 'Clean typography passes ATS without scrambled text blocks.' : 'Multi-column tables risk jumbling text in recruiter screeners.'}
                </p>
              </div>
              <div className="p-3 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs">
                <span className="text-[10px] font-mono text-slate-400 block mb-1">CORE SKILLS IN CONTEXT</span>
                <div className="flex items-baseline space-x-2">
                  <span className="font-bold font-mono text-sm text-blue-600 dark:text-blue-400">
                    {strongSkillsCount} Core Skills
                  </span>
                  <span className="text-[11px] text-slate-500">demonstrated</span>
                </div>
                <p className="text-[11px] text-slate-500 mt-1">
                  Backed by experiential evidence, satisfying modern semantic ATS without triggering anti-stuffing penalties.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ======================================================== */}
      {/* SECTION 1: HOW A RECRUITER SEES YOUR RESUME */}
      {/* ======================================================== */}
      {(activeSection === 'all' || activeSection === 'recruiter') && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none space-y-8">
          
          <div className="pb-4 border-b border-slate-200 dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2 text-blue-600 dark:text-blue-400 mb-1">
                <Eye className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">Recruiter Scan Heuristic</span>
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                6–8 Second Scan Model
              </h3>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 bg-amber-50 dark:bg-amber-950/40 text-amber-700 dark:text-amber-400 border border-amber-200 dark:border-amber-800/60 rounded-full font-bold self-start sm:self-auto">
              RECRUITER SCAN HEURISTIC
            </span>
          </div>

          {/* 6-Second Chronological Eye-Path */}
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            <div className="p-5 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs relative">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold rounded-full">
                  SECONDS 0 – 2
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">25%</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                Header &amp; Title Match
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                The eye lands on your candidate title and location. If the title does not echo the target job (e.g. &quot;Software Engineer&quot; vs &quot;Machine Learning Intern&quot;), hesitation starts immediately.
              </p>
              {report && (
                <div className="mt-3 text-[10px] font-mono bg-blue-50 dark:bg-blue-950/40 p-1.5 rounded-xs border border-blue-200 dark:border-blue-900/50 text-blue-700 dark:text-blue-300">
                  Target: {targetRole}
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#262626] text-[11px] font-mono text-[#059669] dark:text-[#10B981] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Target role clarity in headline</span>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs relative">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-mono text-[10px] font-bold rounded-full">
                  SECONDS 2 – 4
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">50%</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                Skills Stack Scan
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Eyes drop straight to your Technical Skills section. Recruiters do not read paragraphs; they cross-check the top 3 must-have technologies from the hiring manager&apos;s checklist.
              </p>
              {report && (
                <div className="mt-3 text-[10px] font-mono bg-indigo-50 dark:bg-indigo-950/40 p-1.5 rounded-xs border border-indigo-200 dark:border-indigo-900/50 text-indigo-700 dark:text-indigo-300">
                  {strongSkillsCount} demonstrated core skills found
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#262626] text-[11px] font-mono text-[#059669] dark:text-[#10B981] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Grouped categories: Languages, Cloud, Frameworks</span>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs relative">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-mono text-[10px] font-bold rounded-full">
                  SECONDS 4 – 6
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">75%</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                Impact &amp; Numbers
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Eyes jump to prominent bullets in your projects and experience. Reviewers look for measurable outcomes: %, scale, latency, users. Bullets without numbers lack empirical proof.
              </p>
              {report && (
                <div className="mt-3 text-[10px] font-mono bg-purple-50 dark:bg-purple-950/40 p-1.5 rounded-xs border border-purple-200 dark:border-purple-900/50 text-purple-700 dark:text-purple-300">
                  {quantifiedBullets}/{totalBullets} bullets quantified ({quantifiedPct}%)
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#262626] text-[11px] font-mono text-[#059669] dark:text-[#10B981] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Google XYZ: &quot;Accomplished X by doing Y as measured by Z&quot;</span>
              </div>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs relative">
              <div className="flex items-center justify-between mb-3">
                <span className="px-2 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-mono text-[10px] font-bold rounded-full">
                  SECONDS 6 – 8
                </span>
                <span className="text-xs font-mono text-slate-400 font-bold">100%</span>
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-2">
                Credential &amp; Triage Call
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Quick glance at degree credentials, graduation date, and layout neatness. {overallScore >= 80 ? 'Estimated Triage Signal: Strong — high requirement coverage and robust technical evidence.' : overallScore >= 60 ? 'Estimated Triage Signal: Moderate — based on demonstrated skills, requirement coverage, content quality, and ATS parseability.' : 'Estimated Triage Signal: Needs Work — identifiable qualification gaps and unverified competencies.'}
              </p>
              {report && (
                <div className="mt-3 text-[10px] font-mono bg-emerald-50 dark:bg-emerald-950/40 p-1.5 rounded-xs border border-emerald-200 dark:border-emerald-900/50 text-emerald-700 dark:text-emerald-300">
                  Layout: {readingRisk} Risk • Score: {overallScore}/100
                </div>
              )}
              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#262626] text-[11px] font-mono text-[#059669] dark:text-[#10B981] flex items-center space-x-1.5">
                <CheckCircle2 className="w-3.5 h-3.5 flex-shrink-0" />
                <span>Consistent dates, clean typography, 0 clutter</span>
              </div>
            </div>
          </div>

          {/* The Recruiter Triage Matrix: Green Flags vs Red Flags */}
          <div>
            <h4 className="text-sm font-bold font-mono uppercase text-slate-900 dark:text-white tracking-wider mb-4 flex items-center space-x-2">
              <span>Recruiter Triage Criteria: What Advances You vs What Rejects You</span>
            </h4>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Green Flags */}
              <div className="p-5 bg-emerald-50/40 dark:bg-[#081510] border border-emerald-200 dark:border-emerald-800/60 rounded-xs space-y-3.5">
                <div className="flex items-center space-x-2 text-[#059669] dark:text-[#10B981] font-bold text-sm">
                  <CheckCircle2 className="w-4 h-4" />
                  <span>Immediate PASS to Interview (Green Flags)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-[#CBD5E1]">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#10B981] mt-1.5 flex-shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Clean Visual Hierarchy:</strong> Single-column flow with generous whitespace and 10–12pt body text.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#10B981] mt-1.5 flex-shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Active Ownership Verbs:</strong> Bullets opening with &quot;Architected&quot;, &quot;Benchmarked&quot;, &quot;Engineered&quot;, &quot;Optimized&quot; instead of passive duties.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#10B981] mt-1.5 flex-shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Contextual Evidence:</strong> Skills listed inside experience narratives, proving you deployed them in production, not just in school tutorials.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#10B981] mt-1.5 flex-shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Standard ATS Section Headers:</strong> &quot;Professional Experience&quot;, &quot;Technical Skills&quot;, &quot;Education&quot; that match standard parsers.</span>
                  </li>
                </ul>
              </div>

              {/* Red Flags */}
              <div className="p-5 bg-red-50/40 dark:bg-[#1A0808] border border-red-200 dark:border-red-800/60 rounded-xs space-y-3.5">
                <div className="flex items-center space-x-2 text-[#DC2626] dark:text-[#EF4444] font-bold text-sm">
                  <AlertTriangle className="w-4 h-4" />
                  <span>Immediate REJECT / Archive (Red Flags)</span>
                </div>
                <ul className="space-y-2.5 text-xs text-slate-700 dark:text-[#CBD5E1]">
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] dark:bg-[#EF4444] mt-1.5 flex-shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Artificial Keyword Stuffing:</strong> Repeating terms 10 times or copying blocks from the JD. Recruiters spot this instantly and blacklist.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] dark:bg-[#EF4444] mt-1.5 flex-shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Two-Column Layout Bleed:</strong> Multi-column tables that scramble phone numbers, work dates, and company names when converted to plain text.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] dark:bg-[#EF4444] mt-1.5 flex-shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Zero Quantifiable Outcomes:</strong> Bullets saying &quot;Worked on bug fixes and assisted senior team members&quot; without stating scale or impact.</span>
                  </li>
                  <li className="flex items-start space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] dark:bg-[#EF4444] mt-1.5 flex-shrink-0" />
                    <span><strong className="text-slate-900 dark:text-white">Graphic / Rating Bars:</strong> Progress bars rating yourself &quot;80% in Python&quot; or non-parsable Canva icons.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>

          {/* What Modern ATS Shows The Recruiter */}
          <div className="p-5 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs">
            <h4 className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white tracking-wider mb-2 flex items-center space-x-2">
              <Target className="w-4 h-4 text-[#2563EB]" />
              <span>What Modern ATS (Workday, Greenhouse, Lever) Actually Present to Recruiters</span>
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Recruiters rarely open every applicant&apos;s raw PDF document. The ATS first converts your PDF into a structured candidate profile: extracting your contact info, current employer, calculated years of experience, and a computed match score against the job description. If your document has layout defects, text appears jumbled or fields are blank, leading to an automatic discard before human eyes ever view it.
            </p>
          </div>

        </div>
      )}

      {/* ======================================================== */}
      {/* SECTION 2: WHY GETPLACEDRESUME DIFFERS FROM OTHER ATS SITES */}
      {/* ======================================================== */}
      {(activeSection === 'all' || activeSection === 'comparison') && (
        <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none space-y-8">
          
          <div className="pb-4 border-b border-slate-200 dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <div className="flex items-center space-x-2 text-indigo-600 dark:text-indigo-400 mb-1">
                <Scale className="w-4 h-4" />
                <span className="text-xs font-mono font-bold uppercase tracking-wider">Engine Architecture Comparison</span>
              </div>
              <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                GetPlacedResume vs. Conventional Keyword Checkers
              </h3>
            </div>
            <span className="text-[11px] font-mono px-3 py-1 bg-blue-50 dark:bg-blue-950/40 text-blue-700 dark:text-blue-400 border border-blue-200 dark:border-blue-800/60 rounded-full font-bold self-start sm:self-auto">
              MATHEMATICAL VECTOR NLP
            </span>
          </div>

          <p className="text-xs sm:text-sm text-slate-600 dark:text-[#94A3B8] leading-relaxed">
            Keyword-oriented resume checkers may place greater emphasis on exact terminology and keyword coverage, which can encourage repetitive phrasing. GetPlacedResume is architected to balance contextual evidence, structural ATS parsing, and human reviewer readability.
          </p>

          {/* Side-by-Side Comparison Table */}
          <div className="overflow-x-auto border border-slate-200 dark:border-[#262626] rounded-xs">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 dark:bg-[#000000] border-b border-slate-200 dark:border-[#262626]">
                  <th className="p-3.5 font-mono uppercase text-slate-700 dark:text-slate-300 font-bold w-1/4">
                    Evaluation Dimension
                  </th>
                  <th className="p-3.5 font-mono uppercase text-slate-700 dark:text-slate-300 font-bold w-3/8 border-l border-slate-200 dark:border-[#262626]">
                    Conventional Keyword Checkers
                  </th>
                  <th className="p-3.5 font-mono uppercase text-[#2563EB] dark:text-blue-400 font-bold w-3/8 border-l border-slate-200 dark:border-[#262626] bg-blue-50/40 dark:bg-blue-950/20">
                    GetPlacedResume Intelligence
                  </th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#262626] font-sans">
                
                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#0D0D0D]/40">
                    Keyword Matching
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-[#262626]">
                    <strong>Terminology emphasis:</strong> Keyword-oriented resume checkers may place greater emphasis on exact terminology and keyword coverage, potentially overlooking synonyms, framework equivalents, or contextual phrasing.
                  </td>
                  <td className="p-3.5 text-slate-900 dark:text-white border-l border-slate-200 dark:border-[#262626] bg-blue-50/20 dark:bg-blue-950/10">
                    <strong>Semantic Vector Cosine Similarity:</strong> Uses NLP vector embeddings and domain ontologies to recognize synonyms, sub-skills, and framework relationships.
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#0D0D0D]/40">
                    Keyword Stuffing Handling
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-[#262626]">
                    <strong>Repetition incentive:</strong> Keyword-heavy optimization can encourage repetitive terminology; GetPlacedResume emphasizes contextual evidence instead.
                  </td>
                  <td className="p-3.5 text-slate-900 dark:text-white border-l border-slate-200 dark:border-[#262626] bg-blue-50/20 dark:bg-blue-950/10">
                    <strong>Context Verification &amp; Anti-Stuffing Guardrails:</strong> Requires skills to appear in meaningful project and experience bullets with action verbs, protecting your human pass rate.
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#0D0D0D]/40">
                    Scoring Methodology
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-[#262626]">
                    <strong>Single Aggregate Score:</strong> Often relies on a single aggregate percentage without granular breakdown of how each dimension contributes.
                  </td>
                  <td className="p-3.5 text-slate-900 dark:text-white border-l border-slate-200 dark:border-[#262626] bg-blue-50/20 dark:bg-blue-950/10">
                    <strong>Deterministic 6-Axis Weighted Scoring:</strong> Mathematical breakdown across Job Relevance (30%), Skills (20%), Experience (20%), ATS Parseability (15%), Content (10%), Presentation (5%).
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#0D0D0D]/40">
                    Document Parsing Depth
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-[#262626]">
                    <strong>Linear text extraction:</strong> May read text linearly, which can overlook multi-column reading flow, table cell fragmentation, and header/footer boundary issues.
                  </td>
                  <td className="p-3.5 text-slate-900 dark:text-white border-l border-slate-200 dark:border-[#262626] bg-blue-50/20 dark:bg-blue-950/10">
                    <strong>PDF geometry analysis using pdfplumber:</strong> Inspects PDF bounding boxes to verify multi-column read order, table cells, header/footer collision, and glyph issues.
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#0D0D0D]/40">
                    Candidate Profiling
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-[#262626]">
                    <strong>Uniform Criteria:</strong> May apply uniform expectations that do not adapt to student/fresher project evidence or early-career profiles.
                  </td>
                  <td className="p-3.5 text-slate-900 dark:text-white border-l border-slate-200 dark:border-[#262626] bg-blue-50/20 dark:bg-blue-950/10">
                    <strong>Adaptive Profile Calibrations:</strong> Supports Campus/Fresher mode (prioritizes projects &amp; academic competencies) vs Experienced &amp; Career Transition modes.
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#0D0D0D]/40">
                    Actionable Improvements
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-[#262626]">
                    <strong>Keyword insertion prompts:</strong> Frequently recommends inserting missing words without structural guidance or evidence verification.
                  </td>
                  <td className="p-3.5 text-slate-900 dark:text-white border-l border-slate-200 dark:border-[#262626] bg-blue-50/20 dark:bg-blue-950/10">
                    <strong>Grounded Line-by-Line Evidence:</strong> Analyzes each bullet point against the Google XYZ formula and suggests contextual upgrades grounded in your verified stack.
                  </td>
                </tr>

                <tr>
                  <td className="p-3.5 font-semibold text-slate-900 dark:text-white bg-slate-50/50 dark:bg-[#0D0D0D]/40">
                    Data Privacy &amp; Retention
                  </td>
                  <td className="p-3.5 text-slate-600 dark:text-slate-400 border-l border-slate-200 dark:border-[#262626]">
                    <strong>Variable Policies:</strong> Data retention and processing terms vary widely across commercial software providers.
                  </td>
                  <td className="p-3.5 text-slate-900 dark:text-white border-l border-slate-200 dark:border-[#262626] bg-blue-50/20 dark:bg-blue-950/10">
                    <strong>In-memory / Ephemeral Processing:</strong> Resumes are processed in RAM for the duration of the analysis session without persistent database retention.
                  </td>
                </tr>

              </tbody>
            </table>
          </div>

          {/* Architectural Pillars Cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-6 pt-2">
            <div className="p-5 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs">
              <div className="w-8 h-8 rounded-xs bg-blue-100 dark:bg-blue-950/60 text-[#2563EB] flex items-center justify-center mb-3">
                <Target className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                Pass Both Filters
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Engineered so your resume satisfies the software parse pass AND delights the human recruiter during the 6-second scan.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs">
              <div className="w-8 h-8 rounded-xs bg-emerald-100 dark:bg-emerald-950/60 text-[#059669] flex items-center justify-center mb-3">
                <Search className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                Grounded Truth Only
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Zero hallucinated or fabricated skills. Every recommendation is anchored in technologies already present in your background.
              </p>
            </div>

            <div className="p-5 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs">
              <div className="w-8 h-8 rounded-xs bg-purple-100 dark:bg-purple-950/60 text-[#8B5CF6] flex items-center justify-center mb-3">
                <Sparkles className="w-4 h-4" />
              </div>
              <h4 className="font-bold text-sm text-slate-900 dark:text-white mb-1.5">
                High-Yield Revisions
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Actionable bullet upgrades that increase recruiter callbacks by converting vague duties into measurable engineering impact.
              </p>
            </div>
          </div>

          {/* Quick Action Navigation */}
          {onNavigateTab && (
            <div className="pt-4 flex flex-wrap items-center gap-3">
              <button
                onClick={() => onNavigateTab('improvements')}
                className="px-4 py-2.5 bg-[#2563EB] hover:bg-blue-700 text-white font-bold text-xs rounded-xs shadow-xs transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>View Grounded Revisions For Your Bullets</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateTab('ats-format')}
                className="px-4 py-2.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#000000] dark:hover:bg-[#171717] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#262626] font-semibold text-xs rounded-xs transition-colors flex items-center space-x-2 cursor-pointer"
              >
                <span>Inspect Document Layout Parseability</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

        </div>
      )}

    </div>
  );
};
export default RecruiterPerspective;
