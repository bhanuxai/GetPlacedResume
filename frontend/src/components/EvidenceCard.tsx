import React from 'react';
import { Quote } from 'lucide-react';

interface EvidenceCardProps {
  snippets: string[];
  explanation: string;
}

export const EvidenceCard: React.FC<EvidenceCardProps> = ({ snippets, explanation }) => {
  if (snippets.length === 0) {
    return (
      <div className="bg-slate-100 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-3 text-xs text-slate-600 dark:text-[#94A3B8] font-mono">
        No direct textual evidence identified in resume body.
      </div>
    );
  }

  return (
    <div className="space-y-2">
      {snippets.map((snippet, idx) => (
        <div
          key={idx}
          className="bg-white dark:bg-[#0A0D12] border-l-2 border-l-[#2563EB] border-t border-r border-b border-slate-300 dark:border-[#273142] p-3 text-xs text-slate-800 dark:text-[#F8FAFC] flex items-start space-x-2.5 shadow-none"
        >
          <Quote className="w-3.5 h-3.5 text-[#2563EB] flex-shrink-0 mt-0.5" />
          <p className="font-mono leading-relaxed text-[11px] sm:text-xs text-slate-800 dark:text-[#CBD5E1]">
            {snippet}
          </p>
        </div>
      ))}
      <p className="text-[11px] text-slate-600 dark:text-[#94A3B8] font-sans italic pt-1">
        Analysis rationale: {explanation}
      </p>
    </div>
  );
};
