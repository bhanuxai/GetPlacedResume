import React from 'react';
import { Recommendation } from '../types';
import { ArrowRight } from 'lucide-react';

interface RecommendationCardProps {
  recommendations: Recommendation[];
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({ recommendations }) => {
  return (
    <div className="w-full bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#273142] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-[#273142]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#2563EB] inline-block" />
          <span>PRIORITIZED OPTIMIZATION ROADMAP</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 font-mono">
          ACTIONABLE HIGHEST-LEVERAGE EDITS ORDERED BY EXPECTED ATS SCORE IMPACT
        </p>
      </div>

      {/* Recommendations List */}
      <div className="pt-6 space-y-4">
        {recommendations.length === 0 ? (
          <div className="p-8 text-center text-xs text-[#059669] dark:text-[#10B981] font-mono bg-emerald-50 dark:bg-[#0A0D12] border border-[#059669] dark:border-[#10B981]">
            No urgent adjustments detected. Your resume is exceptionally well-aligned.
          </div>
        ) : (
          recommendations.map((rec) => (
            <div key={rec.id} className="bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-5 transition-colors">
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-2">
                <div className="flex items-center space-x-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-xs ${
                      rec.priority === 'HIGH'
                        ? 'bg-red-50 dark:bg-[#450A0A] text-[#DC2626] dark:text-[#EF4444] border border-[#DC2626] dark:border-[#EF4444]'
                        : rec.priority === 'MEDIUM'
                        ? 'bg-amber-50 dark:bg-[#451A03] text-[#D97706] dark:text-[#F59E0B] border border-[#D97706] dark:border-[#F59E0B]'
                        : 'bg-blue-50 dark:bg-[#1A202C] text-[#2563EB] dark:text-[#60A5FA] border border-[#2563EB] dark:border-[#60A5FA]'
                    }`}
                  >
                    {rec.priority} IMPACT
                  </span>
                  <span className="text-xs font-mono text-slate-600 dark:text-[#94A3B8] uppercase">
                    [{rec.category}]
                  </span>
                </div>
              </div>

              <h4 className="text-sm font-bold text-slate-900 dark:text-white mt-1 mb-2">
                {rec.title}
              </h4>

              <p className="text-xs text-slate-700 dark:text-[#CBD5E1] leading-relaxed mb-3">
                {rec.description}
              </p>

              <div className="bg-white dark:bg-[#12161F] p-3 border border-slate-300 dark:border-[#273142] flex items-start space-x-2 text-xs text-slate-900 dark:text-white font-mono">
                <ArrowRight className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-slate-500 dark:text-[#94A3B8] text-[10px] block mb-0.5">DIRECT ACTION:</span>
                  <span>{rec.action_item}</span>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
