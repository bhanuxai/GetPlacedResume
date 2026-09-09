import React from 'react';
import { CheckCircle2, AlertTriangle, HelpCircle, XCircle } from 'lucide-react';

interface SkillsAnalysisProps {
  skills: {
    strongly_demonstrated: string[];
    partially_demonstrated: string[];
    mentioned_only: string[];
    missing: string[];
  };
}

export const SkillsAnalysis: React.FC<SkillsAnalysisProps> = ({ skills }) => {
  const groups = [
    {
      title: "Strongly Demonstrated",
      badge: "SUBSTANTIATED WITH PROJECTS / EXPERIENCE",
      items: skills.strongly_demonstrated,
      icon: CheckCircle2,
      color: "#059669",
      darkColor: "#10B981",
      emptyMsg: "No skills verified with high-confidence project evidence."
    },
    {
      title: "Partially Demonstrated",
      badge: "TRANSFERABLE / RELATED CONCEPTS",
      items: skills.partially_demonstrated,
      icon: AlertTriangle,
      color: "#D97706",
      darkColor: "#F59E0B",
      emptyMsg: "No intermediate or transferable skills identified."
    },
    {
      title: "Mentioned But Not Demonstrated",
      badge: "LISTED IN SKILLS LIST ONLY (NO SUPPORTING BULLETS)",
      items: skills.mentioned_only,
      icon: HelpCircle,
      color: "#EA580C",
      darkColor: "#F97316",
      emptyMsg: "Zero unsupported skill claims detected."
    },
    {
      title: "Missing Target Competencies",
      badge: "CRITICAL GAPS RELATIVE TO JOB DESCRIPTION",
      items: skills.missing,
      icon: XCircle,
      color: "#DC2626",
      darkColor: "#EF4444",
      emptyMsg: "Candidate addresses all mandatory skill specifications."
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-[#262626]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#2563EB] inline-block" />
          <span>SKILLS &amp; COMPETENCY MATRIX</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 font-mono">
          EVIDENCE-BASED DISCRIMINATION: DISTINGUISHING PRACTICAL APPLICATION FROM KEYWORD INCLUSION
        </p>
      </div>

      {/* Grid of 4 Categories */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        {groups.map((grp, idx) => {
          const Icon = grp.icon;
          return (
            <div key={idx} className="bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] p-5 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-start justify-between gap-2 pb-3 border-b border-slate-200 dark:border-[#262626]">
                  <div className="flex items-center space-x-2">
                    <Icon className="w-4 h-4 flex-shrink-0" style={{ color: grp.color }} />
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{grp.title}</span>
                  </div>
                  <span className="font-mono text-xs font-bold text-slate-900 dark:text-white px-2 py-0.5 bg-white dark:bg-[#171717] border border-slate-300 dark:border-[#262626]">
                    {grp.items.length}
                  </span>
                </div>

                <p className="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] mt-2 uppercase tracking-wide">
                  {grp.badge}
                </p>

                {/* Skill Pills */}
                <div className="flex flex-wrap gap-2 pt-4">
                  {grp.items.length === 0 ? (
                    <span className="text-xs text-slate-500 dark:text-[#64748B] font-mono italic">
                      {grp.emptyMsg}
                    </span>
                  ) : (
                    grp.items.map((skill, sIdx) => (
                      <span
                        key={sIdx}
                        className="px-2.5 py-1 text-xs font-mono font-medium rounded-xs border bg-white dark:bg-[#0A0A0A] text-slate-800 dark:text-[#F8FAFC]"
                        style={{
                          borderColor: grp.color
                        }}
                      >
                        {skill}
                      </span>
                    ))
                  )}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-slate-200 dark:border-[#141414] text-[11px] text-slate-500 dark:text-[#64748B] font-mono">
                STATUS: {grp.items.length > 0 ? `${grp.items.length} TOKENS LOGGED` : 'NONE DETECTED'}
              </div>
            </div>
          );
        })}
      </div>

    </div>
  );
};
