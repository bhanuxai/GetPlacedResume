import React, { useEffect, useState } from 'react';
import { ShieldCheck, Info, Printer } from 'lucide-react';

interface ScoreCardProps {
  score: number;
  tier: "STRONG MATCH" | "MODERATE MATCH" | "NEEDS IMPROVEMENT";
  profileType: string;
  processedAt: string;
  jobTitle?: string;
}

export const ScoreCard: React.FC<ScoreCardProps> = ({
  score,
  tier,
  profileType,
  processedAt,
  jobTitle
}) => {
  const [animatedScore, setAnimatedScore] = useState(0);

  useEffect(() => {
    let start = 0;
    const duration = 1200; // ms
    const stepTime = 20;
    const steps = duration / stepTime;
    const increment = score / steps;

    const timer = setInterval(() => {
      start += increment;
      if (start >= score) {
        setAnimatedScore(score);
        clearInterval(timer);
      } else {
        setAnimatedScore(Math.round(start));
      }
    }, stepTime);

    return () => clearInterval(timer);
  }, [score]);

  // SVG Radial parameters
  const radius = 68;
  const strokeWidth = 10;
  const circumference = 2 * Math.PI * radius;
  const strokeDashoffset = circumference - (animatedScore / 100) * circumference;

  // Solid tier colors
  const tierColor =
    tier === "STRONG MATCH"
      ? "#059669"
      : tier === "MODERATE MATCH"
      ? "#D97706"
      : "#DC2626";

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Top Meta Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#262626]">
        <div>
          <div className="flex items-center space-x-2">
            <span className="w-2 h-2 rounded-full" style={{ backgroundColor: tierColor }} />
            <h2 className="text-sm font-mono uppercase tracking-widest text-slate-600 dark:text-[#94A3B8]">
              Target Role: <span className="text-slate-900 dark:text-white font-sans font-bold normal-case text-base ml-1">{jobTitle || "Evaluated Position"}</span>
            </h2>
          </div>
        </div>

        <div className="flex items-center space-x-3 font-mono text-xs text-slate-600 dark:text-[#94A3B8]">
          <span className="px-2 py-0.5 bg-slate-100 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] rounded-xs uppercase">
            PROFILE: {profileType.toUpperCase()}
          </span>
          <span className="hidden sm:inline text-slate-300 dark:text-[#262626]">|</span>
          <span className="hidden sm:inline">{processedAt}</span>
          <button
            onClick={() => window.print()}
            className="no-print flex items-center space-x-1 px-2.5 py-1 bg-slate-100 hover:bg-slate-200 dark:bg-[#171717] dark:hover:bg-[#1f1f1f] text-slate-800 dark:text-white border border-slate-300 dark:border-[#262626] rounded-xs transition-colors"
            title="Export / Print Report as PDF"
          >
            <Printer className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Print Report</span>
          </button>
        </div>
      </div>

      {/* Main Score Visualization */}
      <div className="pt-8 pb-4 flex flex-col md:flex-row items-center justify-between gap-8">
        
        {/* Radial Gauge */}
        <div className="flex flex-col items-center flex-shrink-0">
          <div className="relative w-44 h-44 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90" viewBox="0 0 160 160">
              {/* Background Circle */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                className="stroke-slate-200 dark:stroke-[#141414]"
                strokeWidth={strokeWidth}
                fill="none"
              />
              {/* Animated Progress Circle (SOLID COLOR, NO GRADIENT) */}
              <circle
                cx="80"
                cy="80"
                r={radius}
                stroke={tierColor}
                strokeWidth={strokeWidth}
                fill="none"
                strokeLinecap="square"
                strokeDasharray={circumference}
                strokeDashoffset={strokeDashoffset}
                className="transition-all duration-300 ease-out"
              />
            </svg>

            {/* Score Text in Center */}
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center select-none">
              <span className="text-4xl sm:text-5xl font-extrabold tracking-tight text-slate-900 dark:text-white font-mono">
                {animatedScore}
              </span>
              <span className="text-[11px] font-mono text-slate-500 dark:text-[#94A3B8] uppercase tracking-wider">
                OUT OF 100
              </span>
            </div>
          </div>

          {/* Tier Label */}
          <div className="mt-4 flex items-center space-x-2">
            <span
              className="px-3 py-1 text-xs font-bold font-mono uppercase tracking-wider rounded-xs text-white"
              style={{ backgroundColor: tierColor }}
            >
              {tier}
            </span>
          </div>
        </div>

        {/* Score Context & Explanatory Details */}
        <div className="flex-1 space-y-4 text-left">
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white tracking-tight">
              AI-Estimated ATS Compatibility Score
            </h3>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 leading-relaxed">
              This score models how enterprise Applicant Tracking Systems (Workday, Taleo, Greenhouse) parse your document structure and how semantic search models evaluate your demonstrated technical competencies against the job description.
            </p>
          </div>

          <div className="bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] p-3.5 space-y-2 text-xs">
            <div className="flex items-start space-x-2 text-slate-700 dark:text-[#94A3B8]">
              <Info className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
              <span>
                <strong className="text-slate-900 dark:text-white">Explainability Assurance:</strong> Calculated across 6 weighted dimensions rather than raw keyword frequency. Evidence must be substantiated by work experience or project achievements.
              </span>
            </div>
            <div className="flex items-center space-x-2 text-slate-600 dark:text-[#94A3B8] pt-1">
              <ShieldCheck className="w-4 h-4 text-[#059669] dark:text-[#10B981] flex-shrink-0" />
              <span className="font-mono text-[11px]">NOT AN OFFICIAL SCORE FROM ANY INDIVIDUAL ATS VENDOR.</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  );
};
