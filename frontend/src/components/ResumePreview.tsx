import React, { useState } from 'react';
import { FileText, Check } from 'lucide-react';

interface ResumePreviewProps {
  rawText: string;
}

export const ResumePreview: React.FC<ResumePreviewProps> = ({ rawText }) => {
  const [copied, setCopied] = useState(false);

  const handleCopy = () => {
    navigator.clipboard.writeText(rawText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      {/* Header */}
      <div className="flex items-center justify-between pb-6 border-b border-slate-200 dark:border-[#262626]">
        <div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#2563EB] inline-block" />
            <span>EXTRACTED RESUME DOCUMENT</span>
          </h3>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 font-mono">
            RAW PARSED TOKEN STREAM AS INGESTED BY ATS PREPROCESSORS
          </p>
        </div>

        <button
          onClick={handleCopy}
          className="flex items-center space-x-1.5 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#000000] dark:hover:bg-[#171717] border border-slate-300 dark:border-[#262626] text-xs font-mono text-slate-800 dark:text-white rounded-xs transition-colors"
        >
          {copied ? <Check className="w-3.5 h-3.5 text-[#059669] dark:text-[#10B981]" /> : <FileText className="w-3.5 h-3.5 text-[#2563EB]" />}
          <span>{copied ? 'Copied' : 'Copy Text'}</span>
        </button>
      </div>

      {/* Monospace Document Viewer */}
      <div className="mt-6 bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] p-5 max-h-[550px] overflow-y-auto transition-colors">
        <pre className="text-xs font-mono text-slate-800 dark:text-[#CBD5E1] whitespace-pre-wrap leading-relaxed select-text">
          {rawText || "No resume text extracted yet."}
        </pre>
      </div>
    </div>
  );
};
