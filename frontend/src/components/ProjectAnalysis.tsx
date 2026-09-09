import React from 'react';
import { ProjectAnalysis as IProjectAnalysis } from '../types';
import { FolderGit2, AlertCircle, BarChart3 } from 'lucide-react';

interface ProjectAnalysisProps {
  projects: IProjectAnalysis[];
}

export const ProjectAnalysis: React.FC<ProjectAnalysisProps> = ({ projects }) => {
  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-[#262626]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#2563EB] inline-block" />
          <span>PROJECTS TECHNICAL AUDIT</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 font-mono">
          EVALUATION OF PROBLEM FORMULATION, ARCHITECTURE COMPLEXITY, AND MEASURABLE IMPACT
        </p>
      </div>

      {/* Projects List */}
      <div className="pt-6 space-y-6">
        {projects.length === 0 ? (
          <div className="p-8 text-center text-xs text-slate-600 dark:text-[#94A3B8] font-mono bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626]">
            No projects section found in resume. For students and freshers, dedicated technical projects are critical for ATS passing.
          </div>
        ) : (
          projects.map((proj, idx) => (
            <div key={idx} className="bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] p-5 transition-colors">
              
              {/* Project Title Bar */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-200 dark:border-[#262626]">
                <div className="flex items-center space-x-3">
                  <div className="w-8 h-8 bg-white dark:bg-[#171717] border border-slate-300 dark:border-[#262626] flex items-center justify-center text-[#2563EB]">
                    <FolderGit2 className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-sm font-bold text-slate-900 dark:text-white tracking-tight">{proj.project_name}</h4>
                    <span className="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8]">
                      ROLE: {proj.candidate_contribution.toUpperCase()}
                    </span>
                  </div>
                </div>

                <div className="flex items-center space-x-4">
                  <div>
                    <span className="text-xs font-mono font-bold text-slate-900 dark:text-white">
                      {proj.complexity_score} / 100
                    </span>
                    <span className="block text-[10px] font-mono text-slate-400 dark:text-[#64748B]">COMPLEXITY</span>
                  </div>
                  <div className="h-6 w-px bg-slate-200 dark:bg-[#262626]" />
                  <div>
                    <span
                      className={`text-xs font-mono font-bold ${
                        proj.relevance_to_job === 'High'
                          ? 'text-[#059669] dark:text-[#10B981]'
                          : proj.relevance_to_job === 'Moderate'
                          ? 'text-[#D97706] dark:text-[#F59E0B]'
                          : 'text-slate-500 dark:text-[#94A3B8]'
                      }`}
                    >
                      {proj.relevance_to_job.toUpperCase()}
                    </span>
                    <span className="block text-[10px] font-mono text-slate-400 dark:text-[#64748B]">JOB RELEVANCE</span>
                  </div>
                </div>
              </div>

              {/* Technologies Tag Bar */}
              <div className="py-3 flex flex-wrap items-center gap-1.5 border-b border-slate-200 dark:border-[#141414]">
                <span className="text-[10px] font-mono text-slate-600 dark:text-[#94A3B8] mr-1">TECH STACK:</span>
                {proj.technologies.map((t, tIdx) => (
                  <span
                    key={tIdx}
                    className="px-2 py-0.5 text-[11px] font-mono bg-white dark:bg-[#171717] text-slate-800 dark:text-[#F8FAFC] border border-slate-300 dark:border-[#262626]"
                  >
                    {t}
                  </span>
                ))}
              </div>

              {/* Details & Metrics */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 text-xs">
                <div className="bg-white dark:bg-[#0A0A0A] p-3 border border-slate-300 dark:border-[#262626]">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] block mb-1">SYSTEM IMPLEMENTATION:</span>
                  <p className="text-slate-900 dark:text-white leading-relaxed">{proj.solution}</p>
                </div>

                <div className="bg-white dark:bg-[#0A0A0A] p-3 border border-slate-300 dark:border-[#262626]">
                  <span className="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] block mb-1">QUANTIFIABLE METRICS:</span>
                  <div className="flex items-center space-x-2 text-slate-900 dark:text-white">
                    <BarChart3 className={`w-4 h-4 ${proj.metrics_present ? 'text-[#059669] dark:text-[#10B981]' : 'text-slate-400 dark:text-[#64748B]'}`} />
                    <span className="font-mono text-[11px]">{proj.metrics_summary || 'No empirical metrics detected'}</span>
                  </div>
                </div>
              </div>

              {/* Critique & Grounded Recommendations */}
              <div className="mt-4 bg-white dark:bg-[#0A0A0A] border border-slate-300 dark:border-[#262626] p-3.5">
                <div className="flex items-start space-x-2.5">
                  <AlertCircle className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B] flex-shrink-0 mt-0.5" />
                  <div>
                    <p className="text-xs text-slate-900 dark:text-white font-medium">{proj.critique}</p>
                    {proj.suggested_improvements.length > 0 && (
                      <ul className="mt-2 space-y-1 text-[11px] text-slate-600 dark:text-[#94A3B8] list-disc list-inside">
                        {proj.suggested_improvements.map((sug, sIdx) => (
                          <li key={sIdx}>{sug}</li>
                        ))}
                      </ul>
                    )}
                  </div>
                </div>
              </div>

            </div>
          ))
        )}
      </div>

    </div>
  );
};
