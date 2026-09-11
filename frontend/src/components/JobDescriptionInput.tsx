import React from 'react';
import { FileCode } from 'lucide-react';
import { DEFAULT_PRESETS } from '../constants/sampleData';

interface JobDescriptionInputProps {
  jobDescription: string;
  onJobDescriptionChange: (text: string) => void;
  jobTitle: string;
  onJobTitleChange: (title: string) => void;
  onLoadPreset: (presetKey: string) => void;
  presets?: Record<string, string>;
}

export const JobDescriptionInput: React.FC<JobDescriptionInputProps> = ({
  jobDescription,
  onJobDescriptionChange,
  jobTitle,
  onJobTitleChange,
  onLoadPreset,
  presets = DEFAULT_PRESETS
}) => {
  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-5 sm:p-6 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Header & Presets */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-[#262626]">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#2563EB] inline-block" />
            <span>2. TARGET JOB DESCRIPTION</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1">Paste the exact role requirements to evaluate semantic fit.</p>
        </div>

        {/* Quick presets */}
        <div className="flex items-center space-x-2">
          <span className="text-xs font-mono text-slate-600 dark:text-[#94A3B8] flex items-center space-x-1">
            <FileCode className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Presets:</span>
          </span>
          <div className="flex flex-wrap gap-1.5">
            <button
              type="button"
              onClick={() => onLoadPreset('ml_engineer')}
              className={`px-2.5 py-1 text-xs font-medium border rounded-xs transition-colors cursor-pointer ${
                jobDescription && jobDescription === (presets?.ml_engineer || DEFAULT_PRESETS.ml_engineer)
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#000000] dark:hover:bg-[#171717] text-slate-800 dark:text-[#F8FAFC] border-slate-300 dark:border-[#262626]'
              }`}
            >
              ML Engineer
            </button>
            <button
              type="button"
              onClick={() => onLoadPreset('data_analyst')}
              className={`px-2.5 py-1 text-xs font-medium border rounded-xs transition-colors cursor-pointer ${
                jobDescription && jobDescription === (presets?.data_analyst || DEFAULT_PRESETS.data_analyst)
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#000000] dark:hover:bg-[#171717] text-slate-800 dark:text-[#F8FAFC] border-slate-300 dark:border-[#262626]'
              }`}
            >
              Data Analyst
            </button>
            <button
              type="button"
              onClick={() => onLoadPreset('fullstack_engineer')}
              className={`px-2.5 py-1 text-xs font-medium border rounded-xs transition-colors cursor-pointer ${
                jobDescription && jobDescription === (presets?.fullstack_engineer || DEFAULT_PRESETS.fullstack_engineer)
                  ? 'bg-[#2563EB] text-white border-[#2563EB]'
                  : 'bg-slate-100 hover:bg-slate-200 dark:bg-[#000000] dark:hover:bg-[#171717] text-slate-800 dark:text-[#F8FAFC] border-slate-300 dark:border-[#262626]'
              }`}
            >
              Full Stack
            </button>
          </div>
        </div>
      </div>

      {/* Role Title (Optional Override) */}
      <div className="pt-4 pb-3">
        <label className="block text-xs font-mono uppercase text-slate-600 dark:text-[#94A3B8] mb-1">
          Target Role Title (Optional):
        </label>
        <div className="relative">
          <input
            type="text"
            value={jobTitle}
            onChange={(e) => onJobTitleChange(e.target.value)}
            placeholder="e.g. Senior Machine Learning Engineer"
            className="w-full bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] focus:border-[#2563EB] px-3 py-2 text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-[#64748B] outline-none rounded-xs"
          />
        </div>
      </div>

      {/* Main JD Textarea */}
      <div>
        <label className="block text-xs font-mono uppercase text-slate-600 dark:text-[#94A3B8] mb-1">
          Full Job Description:
        </label>
        <textarea
          value={jobDescription}
          onChange={(e) => onJobDescriptionChange(e.target.value)}
          placeholder="Paste full job description, requirements, responsibilities, and preferred qualifications here..."
          rows={9}
          className="w-full bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] focus:border-[#2563EB] p-3 text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-[#64748B] outline-none rounded-xs resize-y"
        />
        
        <div className="flex justify-between items-center text-xs text-slate-500 dark:text-[#94A3B8] font-mono mt-2">
          <span>MINIMUM RECOMMENDED: 100 WORDS</span>
          <span>{jobDescription.split(/\s+/).filter(Boolean).length} WORDS</span>
        </div>
      </div>

    </div>
  );
};
