import React, { useState } from 'react';
import { BulletAnalysis } from '../types';
import { AlertTriangle } from 'lucide-react';

interface ExperienceAnalysisProps {
  bullets: BulletAnalysis[];
  profileType: string;
  summary: {
    roles_count: number;
    total_bullets: number;
    profile_type: string;
    education_highest: string;
  };
}

export const ExperienceAnalysis: React.FC<ExperienceAnalysisProps> = ({
  bullets,
  summary
}) => {
  const [filterGrade, setFilterGrade] = useState<string>('ALL');

  const filteredBullets = bullets.filter((b) => {
    if (filterGrade === 'ALL') return true;
    return b.structure_grade === filterGrade;
  });

  return (
    <div className="w-full bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#273142] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-6 border-b border-slate-200 dark:border-[#273142]">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#2563EB] inline-block" />
            <span>EXPERIENCE BULLET ANALYZER</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 font-mono">
            EVALUATING ACTION VERBS, QUANTIFICATION, AND ACTION + WHAT + HOW + RESULT STRUCTURE
          </p>
        </div>

        {/* Grade Filter Pills */}
        <div className="flex items-center space-x-1">
          <span className="text-xs font-mono text-slate-600 dark:text-[#94A3B8] mr-2">Grade:</span>
          {['ALL', 'A', 'B', 'C', 'D'].map((gr) => (
            <button
              key={gr}
              onClick={() => setFilterGrade(gr)}
              className={`px-2 py-0.5 text-xs font-mono border rounded-xs transition-colors ${
                filterGrade === gr
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-slate-100 dark:bg-[#0A0D12] text-slate-600 dark:text-[#94A3B8] border-slate-300 dark:border-[#273142] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {gr}
            </button>
          ))}
        </div>
      </div>

      {/* Summary Metrics */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 py-6 border-b border-slate-200 dark:border-[#273142]">
        <div className="bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-3 text-center">
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{summary.roles_count}</span>
          <span className="block text-[10px] font-mono text-slate-500 dark:text-[#64748B] uppercase">Documented Roles</span>
        </div>
        <div className="bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-3 text-center">
          <span className="text-xl font-bold font-mono text-slate-900 dark:text-white">{bullets.length}</span>
          <span className="block text-[10px] font-mono text-slate-500 dark:text-[#64748B] uppercase">Analyzed Bullets</span>
        </div>
        <div className="bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-3 text-center">
          <span className="text-xl font-bold font-mono text-[#059669] dark:text-[#10B981]">
            {bullets.filter((b) => b.is_quantified).length}
          </span>
          <span className="block text-[10px] font-mono text-slate-500 dark:text-[#64748B] uppercase">Quantified Bullets</span>
        </div>
        <div className="bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-3 text-center">
          <span className="text-xl font-bold font-mono text-[#2563EB]">
            {bullets.filter((b) => b.has_strong_verb).length}
          </span>
          <span className="block text-[10px] font-mono text-slate-500 dark:text-[#64748B] uppercase">Strong Verbs</span>
        </div>
      </div>

      {/* Bullet Audits List */}
      <div className="pt-6 space-y-4">
        {filteredBullets.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-600 dark:text-[#94A3B8] font-mono bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142]">
            No bullets match this filter.
          </div>
        ) : (
          filteredBullets.map((bullet) => (
            <div key={bullet.id} className="bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-4 transition-colors">
              
              <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 pb-3">
                <div className="flex-1">
                  <p className="text-sm font-mono text-slate-900 dark:text-white leading-relaxed">
                    &bull; {bullet.original_text}
                  </p>
                </div>

                <div className="flex items-center space-x-3 flex-shrink-0 self-start">
                  <span
                    className={`px-2 py-0.5 text-xs font-mono font-bold border rounded-xs ${
                      bullet.structure_grade === 'A'
                        ? 'bg-emerald-50 dark:bg-[#064E3B] text-[#059669] dark:text-[#10B981] border-[#059669] dark:border-[#10B981]'
                        : bullet.structure_grade === 'B'
                        ? 'bg-blue-50 dark:bg-[#1E3A8A] text-[#2563EB] dark:text-[#60A5FA] border-[#2563EB] dark:border-[#60A5FA]'
                        : bullet.structure_grade === 'C'
                        ? 'bg-amber-50 dark:bg-[#451A03] text-[#D97706] dark:text-[#F59E0B] border-[#D97706] dark:border-[#F59E0B]'
                        : 'bg-red-50 dark:bg-[#450A0A] text-[#DC2626] dark:text-[#EF4444] border-[#DC2626] dark:border-[#EF4444]'
                    }`}
                  >
                    GRADE: {bullet.structure_grade} ({bullet.score}/100)
                  </span>
                </div>
              </div>

              {/* Attributes checklist */}
              <div className="flex flex-wrap items-center gap-3 pt-3 border-t border-slate-200 dark:border-[#1E2633] text-[11px] font-mono">
                <div className="flex items-center space-x-1 text-slate-700 dark:text-[#CBD5E1]">
                  <span className="text-slate-500 dark:text-[#94A3B8]">Verb:</span>
                  <strong className={bullet.has_strong_verb ? 'text-[#059669] dark:text-[#10B981]' : 'text-[#DC2626] dark:text-[#EF4444]'}>
                    {bullet.action_verb || 'None'}
                  </strong>
                </div>

                <div className="flex items-center space-x-1 text-slate-700 dark:text-[#CBD5E1]">
                  <span className="text-slate-500 dark:text-[#94A3B8]">Quantified:</span>
                  <strong className={bullet.is_quantified ? 'text-[#059669] dark:text-[#10B981]' : 'text-[#DC2626] dark:text-[#EF4444]'}>
                    {bullet.is_quantified ? 'YES' : 'NO'}
                  </strong>
                </div>

                <div className="flex items-center space-x-1 text-slate-700 dark:text-[#CBD5E1]">
                  <span className="text-slate-500 dark:text-[#94A3B8]">Technical Substance:</span>
                  <strong className="text-slate-900 dark:text-white">{bullet.technical_substance.toUpperCase()}</strong>
                </div>
              </div>

              {/* Recommendation note if grade is low */}
              {bullet.recommendation && bullet.structure_grade !== 'A' && (
                <div className="mt-3 bg-white dark:bg-[#12161F] p-2.5 border border-slate-300 dark:border-[#273142] text-xs text-[#D97706] dark:text-[#F59E0B] flex items-start space-x-2">
                  <AlertTriangle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                  <span>{bullet.recommendation}</span>
                </div>
              )}

            </div>
          ))
        )}
      </div>

    </div>
  );
};
