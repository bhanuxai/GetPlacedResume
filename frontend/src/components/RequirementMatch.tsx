import React, { useState } from 'react';
import { RequirementMatch as IRequirementMatch } from '../types';
import { EvidenceCard } from './EvidenceCard';
import { Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface RequirementMatchProps {
  matches: IRequirementMatch[];
}

export const RequirementMatch: React.FC<RequirementMatchProps> = ({ matches }) => {
  const [filter, setFilter] = useState<string>('ALL');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  const filterOptions = [
    { id: 'ALL', label: 'All Requirements' },
    { id: 'STRONG_MATCH', label: 'Strong Match' },
    { id: 'PARTIAL_MATCH', label: 'Partial Match' },
    { id: 'WEAK_EVIDENCE', label: 'Weak Evidence' },
    { id: 'MISSING', label: 'Missing' }
  ];

  const filteredMatches = matches.filter((m) => {
    if (filter === 'ALL') return true;
    return m.match_status === filter;
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'STRONG_MATCH':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 bg-emerald-50 dark:bg-[#064E3B] text-[#059669] dark:text-[#10B981] border border-[#059669] dark:border-[#10B981] text-[10px] font-mono uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#059669] dark:bg-[#10B981]" />
            <span>STRONG MATCH</span>
          </span>
        );
      case 'PARTIAL_MATCH':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 bg-amber-50 dark:bg-[#451A03] text-[#D97706] dark:text-[#F59E0B] border border-[#D97706] dark:border-[#F59E0B] text-[10px] font-mono uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] dark:bg-[#F59E0B]" />
            <span>PARTIAL MATCH</span>
          </span>
        );
      case 'WEAK_EVIDENCE':
        return (
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 bg-orange-50 dark:bg-[#431407] text-[#EA580C] dark:text-[#F97316] border border-[#EA580C] dark:border-[#F97316] text-[10px] font-mono uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#EA580C] dark:bg-[#F97316]" />
            <span>WEAK EVIDENCE</span>
          </span>
        );
      case 'MISSING':
      default:
        return (
          <span className="inline-flex items-center space-x-1.5 px-2 py-0.5 bg-red-50 dark:bg-[#450A0A] text-[#DC2626] dark:text-[#EF4444] border border-[#DC2626] dark:border-[#EF4444] text-[10px] font-mono uppercase font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-[#DC2626] dark:bg-[#EF4444]" />
            <span>MISSING</span>
          </span>
        );
    }
  };

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Header & Filter Controls */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#262626]">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#2563EB] inline-block" />
            <span>REQUIREMENT &amp; EVIDENCE VERIFICATION</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 font-mono">
            {matches.length} PARSED JOB SPECIFICATIONS EVALUATED WITH CONTEXTUAL CITATIONS
          </p>
        </div>

        {/* Filter Pills */}
        <div className="flex flex-wrap items-center gap-1.5">
          <Filter className="w-3.5 h-3.5 text-slate-500 dark:text-[#94A3B8] mr-1 hidden sm:inline" />
          {filterOptions.map((opt) => (
            <button
              key={opt.id}
              onClick={() => setFilter(opt.id)}
              className={`px-2.5 py-1 text-xs font-mono uppercase transition-colors rounded-xs border ${
                filter === opt.id
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-slate-100 dark:bg-[#000000] text-slate-600 dark:text-[#94A3B8] border-slate-300 dark:border-[#262626] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {opt.label}
            </button>
          ))}
        </div>
      </div>

      {/* Requirement List */}
      <div className="pt-6 space-y-3">
        {filteredMatches.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-600 dark:text-[#94A3B8] font-mono bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626]">
            No requirements match the active filter.
          </div>
        ) : (
          filteredMatches.map((item) => {
            const isExpanded = expandedId === item.requirement_id;

            return (
              <div
                key={item.requirement_id}
                className="bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] p-4 transition-colors"
              >
                <div
                  onClick={() => setExpandedId(isExpanded ? null : item.requirement_id)}
                  className="cursor-pointer flex flex-col sm:flex-row sm:items-center justify-between gap-3"
                >
                  <div className="flex-1">
                    <div className="flex items-center space-x-2 mb-1.5">
                      {getStatusBadge(item.match_status)}
                      <span className="text-[10px] font-mono px-1.5 py-0.2 bg-slate-200 dark:bg-[#171717] text-slate-700 dark:text-[#94A3B8] border border-slate-300 dark:border-[#262626] uppercase">
                        {item.category.replace('_', ' ')}
                      </span>
                      {item.importance === 'required' && (
                        <span className="text-[10px] font-mono text-[#DC2626] dark:text-[#EF4444] uppercase font-bold">
                          REQUIRED
                        </span>
                      )}
                    </div>
                    <p className="text-sm font-semibold text-slate-900 dark:text-white leading-snug">
                      {item.requirement_text}
                    </p>
                  </div>

                  <div className="flex items-center justify-between sm:justify-end space-x-4 flex-shrink-0">
                    <div className="text-right">
                      <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                        {(item.confidence * 100).toFixed(0)}%
                      </span>
                      <span className="block text-[10px] font-mono text-slate-500 dark:text-[#64748B]">CONFIDENCE</span>
                    </div>

                    <div className="p-1 bg-white dark:bg-[#171717] border border-slate-300 dark:border-[#262626] text-slate-600 dark:text-[#94A3B8]">
                      {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                    </div>
                  </div>
                </div>

                {/* Expanded Evidence Drawer */}
                {isExpanded && (
                  <div className="mt-4 pt-4 border-t border-slate-300 dark:border-[#262626]">
                    <span className="text-[10px] font-mono text-slate-600 dark:text-[#94A3B8] uppercase block mb-2">
                      EXTRACTED RESUME EVIDENCE &amp; GROUNDING:
                    </span>
                    <EvidenceCard
                      snippets={item.evidence_snippets}
                      explanation={item.explanation}
                    />
                  </div>
                )}
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
