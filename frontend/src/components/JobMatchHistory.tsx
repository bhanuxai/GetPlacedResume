import React from 'react';
import { JobMatchRecord } from '../types';
import { ArrowUpRight } from 'lucide-react';

interface JobMatchHistoryProps {
  history: JobMatchRecord[];
  activeId: string | null;
  onSelectRecord: (record: JobMatchRecord) => void;
  onCompareWithNewJD: () => void;
}

export const JobMatchHistory: React.FC<JobMatchHistoryProps> = ({
  history,
  activeId,
  onSelectRecord,
  onCompareWithNewJD
}) => {
  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#262626]">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#2563EB] inline-block" />
            <span>MULTI-JOB MATCH HISTORY</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 font-mono">
            COMPARE HOW THE SAME RESUME RANKS ACROSS DIVERGENT TARGET ROLES
          </p>
        </div>

        <button
          onClick={onCompareWithNewJD}
          className="px-3 py-1.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xs transition-colors self-start sm:self-auto"
        >
          + Analyze Another Job
        </button>
      </div>

      {/* History Items Grid */}
      <div className="pt-6 space-y-3">
        {history.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-600 dark:text-[#94A3B8] font-mono bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626]">
            No previous job analyses logged. Run another job description to benchmark comparative fit.
          </div>
        ) : (
          history.map((rec) => {
            const isActive = rec.id === activeId;
            const scoreColor =
              rec.score >= 80 ? '#059669' : rec.score >= 60 ? '#D97706' : '#DC2626';

            return (
              <div
                key={rec.id}
                onClick={() => onSelectRecord(rec)}
                className={`cursor-pointer p-4 bg-slate-50 dark:bg-[#000000] border transition-colors flex items-center justify-between ${
                  isActive ? 'border-[#2563EB] bg-blue-50/60 dark:bg-[#0A0A0A]' : 'border-slate-300 dark:border-[#262626] hover:border-[#2563EB]'
                }`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className="w-12 h-12 flex flex-col items-center justify-center font-mono font-bold text-slate-900 dark:text-white border bg-white dark:bg-[#000000]"
                    style={{ borderColor: scoreColor }}
                  >
                    <span className="text-base">{rec.score}</span>
                    <span className="text-[8px] text-slate-500 dark:text-[#94A3B8]">SCORE</span>
                  </div>

                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white flex items-center space-x-2">
                      <span>{rec.jobTitle}</span>
                      {isActive && (
                        <span className="px-1.5 py-0.2 bg-[#2563EB] text-white font-mono text-[9px] uppercase">
                          ACTIVE
                        </span>
                      )}
                    </h4>
                    <span className="text-xs font-mono text-slate-600 dark:text-[#94A3B8] block mt-0.5">
                      TIER: {rec.tier} | {rec.date}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-2 text-xs text-slate-600 dark:text-[#94A3B8] font-mono">
                  <span className="hidden sm:inline">VIEW REPORT</span>
                  <ArrowUpRight className="w-4 h-4 text-slate-900 dark:text-white" />
                </div>
              </div>
            );
          })
        )}
      </div>

    </div>
  );
};
