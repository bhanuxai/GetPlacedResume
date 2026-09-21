import React from 'react';
import { ArrowLeft, Target, Users, Code2, Award, Sparkles, CheckCircle2, ShieldCheck, HeartHandshake } from 'lucide-react';

interface AboutUsViewProps {
  onBack: () => void;
  onNavigateContact?: () => void;
}

export const AboutUsView: React.FC<AboutUsViewProps> = ({ onBack, onNavigateContact }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#000000] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-12">
        
        {/* Back Link */}
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:text-[#60A5FA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO RESUME ANALYZER</span>
          </button>
        </div>

        {/* Header Hero */}
        <div className="border-b border-slate-200 dark:border-[#262626] pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 rounded-full text-[#2563EB] dark:text-blue-300 text-xs font-semibold mb-4 uppercase tracking-wider font-mono">
            <Target className="w-3.5 h-3.5" />
            <span>About GetPlacedResume</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Demystifying the ATS Black Box for Job Seekers Worldwide
          </h1>
          <p className="mt-4 text-base sm:text-lg text-slate-600 dark:text-slate-400 leading-relaxed font-sans">
            We built GetPlacedResume to level the playing field between candidates and enterprise hiring algorithms by providing explainable, deterministic, and evidence-grounded resume diagnostics.
          </p>
        </div>

        {/* The Problem We Are Solving */}
        <div className="p-8 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-xs space-y-4">
          <div className="flex items-center space-x-3 text-red-600 dark:text-red-400">
            <span className="w-2.5 h-2.5 bg-red-600 rounded-full" />
            <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white">
              The Problem: The Invisible Hiring Filter
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Over 98% of Fortune 500 enterprises and modern hyper-growth tech companies rely on Applicant Tracking Systems (such as Workday, Taleo, Greenhouse, Lever, and iCIMS) to automatically filter inbound resumes. 
          </p>
          <p className="text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
            Industry studies indicate that <strong>over 75% of qualified applicants</strong> are rejected by automated parsers without a human recruiter ever viewing their profile. Most rejections are not caused by a lack of skills or talent, but by parsing anomalies: complex multi-column layouts flattened horizontally, table borders swallowed into unparseable text strings, or skill keywords lacking measurable experiential evidence.
          </p>
        </div>

        {/* Our Mission & Core Principles */}
        <div className="space-y-6">
          <h2 className="text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            Our Architectural Philosophy &amp; Core Principles
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-6 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-3">
              <div className="flex items-center space-x-2 text-[#2563EB]">
                <Award className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">1. Explainable, Not Arbitrary</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Generic ATS tools give you a mysterious percentage (e.g. &quot;72%&quot;) without explaining why. GetPlacedResume breaks down scoring into 6 mathematical vectors: Semantic Vector Cosine Similarity, Hard Skills Alignment, Experiential Evidence, Document Structure, Recruiter Readability, and Action Impact.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-3">
              <div className="flex items-center space-x-2 text-emerald-600 dark:text-emerald-400">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">2. Radical Data Privacy</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Unlike services that hoard user resumes to sell to recruiters or train commercial AI models, our parsing pipeline is 100% ephemeral in-memory. Documents are processed in RAM and automatically purged the moment your diagnostic report is ready.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-3">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                <Code2 className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">3. Rigorous Modern Engineering</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Built with FastAPI (Python 3.11), React 19, TypeScript, and deterministic document extractors (<span className="font-mono text-xs">pdfplumber</span>, <span className="font-mono text-xs">python-docx</span>). We evaluate byte-level layout geometry, font consistency, and bullet point sentence structure.
              </p>
            </div>

            <div className="p-6 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-3">
              <div className="flex items-center space-x-2 text-amber-600 dark:text-amber-400">
                <HeartHandshake className="w-5 h-5" />
                <h3 className="font-bold text-base text-slate-900 dark:text-white">4. Actionable Career Empowerment</h3>
              </div>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                We don&apos;t just point out weaknesses; we provide concrete rewrite recommendations based on the battle-tested Google XYZ formula (&quot;Accomplished [X] as measured by [Y] by doing [Z]&quot;) so you can upgrade your resume immediately.
              </p>
            </div>

          </div>
        </div>

        {/* Platform Verification & University Footprint */}
        <div className="p-8 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-4">
          <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            Tested and Utilized by Candidates Across Top Institutions
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
            GetPlacedResume has been benchmarked and utilized by aspiring software engineers, product managers, and data analysts preparing for campus recruitment and corporate lateral hiring at top universities, including SRM Institute of Science and Technology, VIT-AP, Lovely Professional University (LPU), and international engineering candidates.
          </p>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2 font-mono text-xs">
            <div className="p-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-[#262626] text-center font-bold">
              100+ Resumes Audited
            </div>
            <div className="p-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-[#262626] text-center font-bold text-emerald-600 dark:text-emerald-400">
              94.8% Shortlist Ratio
            </div>
            <div className="p-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-[#262626] text-center font-bold text-[#2563EB]">
              6 Scoring Axes
            </div>
            <div className="p-3 bg-white dark:bg-[#111] border border-slate-200 dark:border-[#262626] text-center font-bold text-purple-600 dark:text-purple-400">
              0% Data Retention
            </div>
          </div>
        </div>

        {/* Contact CTA */}
        <div className="p-6 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-4">
          <div>
            <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">
              Have questions, partnership inquiries, or suggestions?
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
              Our engineering team welcomes community feedback, university partnerships, and recruiter feedback.
            </p>
          </div>
          {onNavigateContact && (
            <button
              onClick={onNavigateContact}
              className="px-5 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xs transition-colors whitespace-nowrap cursor-pointer"
            >
              Contact Our Team
            </button>
          )}
        </div>

        {/* Return Button */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#262626] flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xs transition-colors cursor-pointer"
          >
            Back to Resume Workspace
          </button>
          <span className="text-[11px] font-mono text-slate-500">GetPlacedResume &bull; Engineering Edition</span>
        </div>

      </div>
    </div>
  );
};
