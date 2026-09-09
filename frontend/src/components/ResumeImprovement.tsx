import React, { useState } from 'react';
import { ImprovementSuggestion } from '../types';
import { Check, X, Copy, CheckCheck, ShieldCheck, TrendingUp, Sparkles } from 'lucide-react';

interface ResumeImprovementProps {
  suggestions: ImprovementSuggestion[];
  baseScore?: number;
  onOpenAutoUpdate?: () => void;
}

export const ResumeImprovement: React.FC<ResumeImprovementProps> = ({
  suggestions: initialSuggestions,
  baseScore = 75,
  onOpenAutoUpdate
}) => {
  const [suggestions, setSuggestions] = useState<ImprovementSuggestion[]>(initialSuggestions);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [copiedAll, setCopiedAll] = useState(false);
  const [statusFilter, setStatusFilter] = useState<'ALL' | 'PENDING' | 'ACCEPTED' | 'REJECTED'>('ALL');

  const handleStatusChange = (id: string, newStatus: 'ACCEPTED' | 'REJECTED') => {
    setSuggestions((prev) =>
      prev.map((s) => (s.id === id ? { ...s, status: newStatus } : s))
    );
  };

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const handleCopyAllAccepted = () => {
    const acceptedTexts = suggestions
      .filter((s) => s.status === 'ACCEPTED')
      .map((s) => `• ${s.suggested}`)
      .join('\n');
    if (acceptedTexts) {
      navigator.clipboard.writeText(acceptedTexts);
      setCopiedAll(true);
      setTimeout(() => setCopiedAll(false), 2000);
    }
  };

  const acceptedCount = suggestions.filter((s) => s.status === 'ACCEPTED').length;
  const projectedScore = Math.min(99, baseScore + (acceptedCount * 2));

  const filteredSuggestions = suggestions.filter((s) => {
    if (statusFilter === 'ALL') return true;
    return s.status === statusFilter;
  });

  return (
    <div className="w-full bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#273142] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#273142]">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#2563EB] inline-block" />
            <span>&quot;FIX MY RESUME&quot; GROUNDED REVISIONS</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 font-mono">
            STRICTLY GROUNDED BULLET REWRITES: NO FABRICATED METRICS, TITLES, OR TOOLS
          </p>
        </div>

        {/* Live Score Projection Capsule */}
        <div className="flex items-center space-x-3 self-start sm:self-auto">
          <div className="bg-emerald-50 dark:bg-[#0A0D12] border border-[#059669] dark:border-[#10B981] px-3 py-1.5 flex items-center space-x-2">
            <TrendingUp className="w-4 h-4 text-[#059669] dark:text-[#10B981]" />
            <div className="text-right font-mono">
              <span className="text-[10px] text-slate-600 dark:text-[#94A3B8] block">PROJECTED ATS SCORE</span>
              <span className="text-xs font-bold text-slate-900 dark:text-white">
                {baseScore} &rarr; <span className="text-[#059669] dark:text-[#10B981]">{projectedScore} / 100</span>
                {acceptedCount > 0 && (
                  <span className="ml-1.5 text-[10px] text-[#059669] dark:text-[#10B981] font-bold">
                    (+{acceptedCount * 2} PTS)
                  </span>
                )}
              </span>
            </div>
          </div>
        </div>
      </div>

      {/* One-Click Auto-Update Banner */}
      {onOpenAutoUpdate && (
        <div className="mt-5 p-4 rounded-xs bg-gradient-to-r from-blue-50 via-indigo-50/60 to-blue-50 dark:from-blue-950/30 dark:via-indigo-950/20 dark:to-blue-950/10 border border-blue-200 dark:border-blue-800/50 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div className="flex items-center space-x-3.5">
            <div className="p-2.5 bg-[#2563EB] text-white rounded-xs flex-shrink-0 shadow-xs">
              <Sparkles className="w-5 h-5 animate-pulse text-yellow-300" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <h4 className="text-sm font-bold text-slate-900 dark:text-white">
                  Want this done automatically?
                </h4>
                <span className="text-[10px] font-mono font-bold uppercase px-2 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 rounded-full">
                  1-Click Auto-Tailor
                </span>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 mt-0.5">
                Let AI automatically apply all bullet upgrades, synthesize missing target skills, and format your entire resume for a 90+ ATS score.
              </p>
            </div>
          </div>

          <button
            onClick={onOpenAutoUpdate}
            className="flex-shrink-0 flex items-center justify-center space-x-2 px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xs shadow-xs transition-all hover:shadow-blue-500/20"
          >
            <Sparkles className="w-3.5 h-3.5" />
            <span>Auto-Update Resume Now</span>
          </button>
        </div>
      )}

      {/* Rationale & Action Bar */}
      <div className="my-6 bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-4 flex flex-col md:flex-row md:items-center justify-between gap-4 text-xs transition-colors">
        <div className="flex items-center space-x-2.5 text-slate-700 dark:text-[#94A3B8]">
          <ShieldCheck className="w-4 h-4 text-[#059669] dark:text-[#10B981] flex-shrink-0" />
          <span>
            Every suggestion is anchored in the technologies verified in your resume. Review and accept or reject each bullet.
          </span>
        </div>

        {/* Filter and Copy All Buttons */}
        <div className="flex items-center space-x-2 flex-shrink-0">
          <div className="flex bg-white dark:bg-[#12161F] p-0.5 border border-slate-300 dark:border-[#273142] rounded-xs font-mono text-[10px]">
            {(['ALL', 'PENDING', 'ACCEPTED', 'REJECTED'] as const).map((filter) => (
              <button
                key={filter}
                onClick={() => setStatusFilter(filter)}
                className={`px-2 py-0.5 transition-colors ${
                  statusFilter === filter ? 'bg-[#2563EB] text-white font-bold' : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {filter}
              </button>
            ))}
          </div>

          {acceptedCount > 0 && (
            <button
              onClick={handleCopyAllAccepted}
              className="flex items-center space-x-1 px-2.5 py-1 bg-[#059669] dark:bg-[#10B981] text-white text-xs font-semibold rounded-xs transition-colors"
            >
              {copiedAll ? <CheckCheck className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copiedAll ? 'Copied' : `Copy ${acceptedCount} Accepted`}</span>
            </button>
          )}
        </div>
      </div>

      {/* Side-by-Side Comparison Cards */}
      <div className="space-y-6">
        {filteredSuggestions.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-600 dark:text-[#94A3B8] font-mono bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142]">
            No suggestions match the selected &quot;{statusFilter}&quot; filter.
          </div>
        ) : (
          filteredSuggestions.map((sug) => {
            const isAccepted = sug.status === 'ACCEPTED';
            const isRejected = sug.status === 'REJECTED';

            return (
              <div
                key={sug.id}
                className={`bg-slate-50 dark:bg-[#0A0D12] border p-5 transition-colors ${
                  isAccepted
                    ? 'border-[#059669] dark:border-[#10B981]'
                    : isRejected
                    ? 'border-[#DC2626] dark:border-[#EF4444] opacity-60'
                    : 'border-slate-300 dark:border-[#273142]'
                }`}
              >
                
                {/* Meta Bar */}
                <div className="flex items-center justify-between pb-3 border-b border-slate-200 dark:border-[#1E2633] text-xs font-mono">
                  <span className="text-slate-600 dark:text-[#94A3B8] uppercase">SECTION: {sug.section}</span>
                  <div className="flex items-center space-x-2">
                    <span
                      className={`px-2 py-0.5 text-[10px] font-bold uppercase rounded-xs ${
                        sug.impact === 'HIGH'
                          ? 'bg-red-50 dark:bg-[#450A0A] text-[#DC2626] dark:text-[#EF4444] border border-[#DC2626] dark:border-[#EF4444]'
                          : 'bg-amber-50 dark:bg-[#451A03] text-[#D97706] dark:text-[#F59E0B] border border-[#D97706] dark:border-[#F59E0B]'
                      }`}
                    >
                      {sug.impact} IMPACT
                    </span>
                    {isAccepted && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-emerald-50 dark:bg-[#064E3B] text-[#059669] dark:text-[#10B981] border border-[#059669] dark:border-[#10B981]">
                        ACCEPTED (+2 PTS)
                      </span>
                    )}
                    {isRejected && (
                      <span className="px-2 py-0.5 text-[10px] font-bold uppercase bg-red-50 dark:bg-[#450A0A] text-[#DC2626] dark:text-[#EF4444] border border-[#DC2626] dark:border-[#EF4444]">
                        REJECTED
                      </span>
                    )}
                  </div>
                </div>

                {/* Comparison Grid (Left Original, Right Suggested) */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-4">
                  
                  {/* Left: Original */}
                  <div className="bg-white dark:bg-[#12161F] border border-slate-300 dark:border-[#273142] p-4">
                    <span className="text-[10px] font-mono text-[#DC2626] dark:text-[#EF4444] uppercase font-bold block mb-1.5">
                      ORIGINAL (LOW TECHNICAL SPECIFICITY):
                    </span>
                    <p className="text-xs sm:text-sm font-mono text-slate-600 dark:text-[#94A3B8] leading-relaxed">
                      &quot;{sug.original}&quot;
                    </p>
                  </div>

                  {/* Right: Suggested */}
                  <div className="bg-white dark:bg-[#12161F] border border-[#2563EB] p-4 relative">
                    <span className="text-[10px] font-mono text-[#059669] dark:text-[#10B981] uppercase font-bold block mb-1.5">
                      SUGGESTED REVISION (ACTION + WHAT + HOW + RESULT):
                    </span>
                    <p className="text-xs sm:text-sm font-mono text-slate-900 dark:text-white font-semibold leading-relaxed">
                      &quot;{sug.suggested}&quot;
                    </p>
                  </div>

                </div>

                {/* Why this is better */}
                <div className="bg-white dark:bg-[#12161F] border border-slate-300 dark:border-[#273142] p-3 text-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] uppercase block mb-0.5">
                      WHY THIS IS STRONGER FOR ATS &amp; RECRUITERS:
                    </span>
                    <p className="text-slate-900 dark:text-white text-xs leading-relaxed">{sug.why}</p>
                  </div>

                  {/* Action Controls */}
                  <div className="flex items-center space-x-2 flex-shrink-0 pt-2 sm:pt-0">
                    <button
                      onClick={() => handleCopy(sug.id, sug.suggested)}
                      className="p-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#0A0D12] dark:hover:bg-[#1E2633] text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white border border-slate-300 dark:border-[#273142] rounded-xs transition-colors"
                      title="Copy to clipboard"
                    >
                      {copiedId === sug.id ? <CheckCheck className="w-4 h-4 text-[#059669] dark:text-[#10B981]" /> : <Copy className="w-4 h-4" />}
                    </button>

                    <button
                      onClick={() => handleStatusChange(sug.id, 'ACCEPTED')}
                      className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xs border transition-colors ${
                        isAccepted
                          ? 'bg-[#059669] dark:bg-[#10B981] text-white border-[#059669] dark:border-[#10B981]'
                          : 'bg-white dark:bg-[#0A0D12] text-[#059669] dark:text-[#10B981] border-[#059669] dark:border-[#10B981] hover:bg-emerald-50 dark:hover:bg-[#064E3B]'
                      }`}
                    >
                      <Check className="w-3.5 h-3.5" />
                      <span>Accept</span>
                    </button>

                    <button
                      onClick={() => handleStatusChange(sug.id, 'REJECTED')}
                      className={`flex items-center space-x-1 px-3 py-1.5 text-xs font-semibold rounded-xs border transition-colors ${
                        isRejected
                          ? 'bg-[#DC2626] dark:bg-[#EF4444] text-white border-[#DC2626] dark:border-[#EF4444]'
                          : 'bg-white dark:bg-[#0A0D12] text-[#DC2626] dark:text-[#EF4444] border-[#DC2626] dark:border-[#EF4444] hover:bg-red-50 dark:hover:bg-[#450A0A]'
                      }`}
                    >
                      <X className="w-3.5 h-3.5" />
                      <span>Reject</span>
                    </button>
                  </div>
                </div>

              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
