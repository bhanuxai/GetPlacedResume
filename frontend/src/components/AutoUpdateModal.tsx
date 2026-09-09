import React, { useState } from 'react';
import { AutoUpdateResult } from '../types';
import {
  Sparkles,
  CheckCircle2,
  Copy,
  CheckCheck,
  Download,
  RotateCcw,
  X,
  TrendingUp,
  FileText,
  Layers,
  ArrowRight
} from 'lucide-react';

interface AutoUpdateModalProps {
  isOpen: boolean;
  onClose: () => void;
  result: AutoUpdateResult | null;
  originalText: string;
  originalScore: number;
  isLoading: boolean;
  onApplyAndReAnalyze: (newResumeText: string) => void;
}

export const AutoUpdateModal: React.FC<AutoUpdateModalProps> = ({
  isOpen,
  onClose,
  result,
  originalText,
  originalScore,
  isLoading,
  onApplyAndReAnalyze
}) => {
  const [activeTab, setActiveTab] = useState<'UPDATED' | 'COMPARE'>('UPDATED');
  const [copied, setCopied] = useState(false);
  const [editableText, setEditableText] = useState<string>('');

  // Synchronize result into editable text
  React.useEffect(() => {
    if (result?.updated_resume_text) {
      setEditableText(result.updated_resume_text);
    }
  }, [result]);

  if (!isOpen) return null;

  const handleCopy = () => {
    const textToCopy = editableText || result?.updated_resume_text || '';
    if (textToCopy) {
      navigator.clipboard.writeText(textToCopy);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownload = () => {
    const textToDownload = editableText || result?.updated_resume_text || '';
    if (!textToDownload) return;
    const blob = new Blob([textToDownload], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `Optimized_Resume_ATS_${result?.job_title ? result.job_title.replace(/\s+/g, '_') : 'Tailored'}.txt`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/70 backdrop-blur-xs overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-5xl bg-white dark:bg-[#0E121A] border border-slate-300 dark:border-[#273142] rounded-xs shadow-2xl overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-6 bg-gradient-to-r from-blue-600 via-indigo-600 to-blue-700 text-white flex items-center justify-between flex-shrink-0">
          <div className="flex items-center space-x-3">
            <div className="p-2 bg-white/10 rounded-xs backdrop-blur-xs">
              <Sparkles className="w-5 h-5 text-yellow-300 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-2">
                <span className="text-[10px] font-mono uppercase tracking-widest px-2 py-0.5 bg-white/20 rounded-xs font-bold">
                  ONE-CLICK AI ENGINE
                </span>
                <span className="text-xs text-blue-100 font-mono">100% ATS SINGLE-COLUMN PARSER</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight font-display mt-0.5">
                Auto-Optimized Resume Upgrade
              </h2>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-xs text-white/80 hover:text-white hover:bg-white/10 transition-colors"
            title="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Score & Change Summary Banner */}
        {result && (
          <div className="p-4 sm:px-6 bg-slate-50 dark:bg-[#121620] border-b border-slate-200 dark:border-[#273142] flex flex-col md:flex-row md:items-center justify-between gap-4 flex-shrink-0">
            {/* Score jump */}
            <div className="flex items-center space-x-4">
              <div className="flex items-center space-x-3 bg-white dark:bg-[#0A0D12] border border-emerald-500/40 px-3.5 py-2 rounded-xs shadow-xs">
                <TrendingUp className="w-5 h-5 text-emerald-500" />
                <div className="font-mono">
                  <span className="text-[10px] text-slate-500 dark:text-slate-400 block font-semibold">ATS SCORE PROJECTION</span>
                  <div className="flex items-baseline space-x-2">
                    <span className="text-sm line-through text-slate-400">{originalScore}</span>
                    <ArrowRight className="w-3.5 h-3.5 text-emerald-500 inline" />
                    <span className="text-base font-extrabold text-emerald-600 dark:text-emerald-400">
                      {result.projected_score} / 100
                    </span>
                    <span className="text-xs font-bold text-emerald-600 dark:text-emerald-400">
                      (+{result.score_increase} PTS)
                    </span>
                  </div>
                </div>
              </div>

              {result.job_title && (
                <div className="hidden sm:block text-xs font-mono text-slate-600 dark:text-slate-400">
                  <span className="text-[10px] uppercase block text-slate-400">Targeting Role:</span>
                  <span className="font-bold text-slate-900 dark:text-white">{result.job_title}</span>
                </div>
              )}
            </div>

            {/* Quick action buttons */}
            <div className="flex items-center space-x-2">
              <div className="flex bg-white dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-0.5 rounded-xs font-mono text-xs">
                <button
                  onClick={() => setActiveTab('UPDATED')}
                  className={`px-3 py-1 font-semibold transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'UPDATED'
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <FileText className="w-3.5 h-3.5" />
                  <span>Optimized Resume</span>
                </button>
                <button
                  onClick={() => setActiveTab('COMPARE')}
                  className={`px-3 py-1 font-semibold transition-colors flex items-center space-x-1.5 ${
                    activeTab === 'COMPARE'
                      ? 'bg-[#2563EB] text-white'
                      : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Side-by-Side</span>
                </button>
              </div>

              <button
                onClick={handleCopy}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#1E2633] dark:hover:bg-[#273142] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#273142] rounded-xs text-xs font-semibold transition-colors"
                title="Copy full text"
              >
                {copied ? <CheckCheck className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy'}</span>
              </button>

              <button
                onClick={handleDownload}
                className="flex items-center space-x-1 px-3 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#1E2633] dark:hover:bg-[#273142] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#273142] rounded-xs text-xs font-semibold transition-colors"
                title="Download text file"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export .txt</span>
              </button>
            </div>
          </div>
        )}

        {/* Change Log Pills */}
        {result?.changes_made && result.changes_made.length > 0 && (
          <div className="p-3 sm:px-6 bg-blue-50/70 dark:bg-blue-950/20 border-b border-blue-100 dark:border-blue-900/30 text-xs flex flex-wrap items-center gap-2 flex-shrink-0">
            <span className="font-mono text-[10px] font-bold text-blue-700 dark:text-blue-400 uppercase mr-1">
              AUTOMATED ENHANCEMENTS:
            </span>
            {result.changes_made.map((chg, idx) => (
              <span
                key={idx}
                className="inline-flex items-center space-x-1 px-2.5 py-0.5 rounded-full bg-white dark:bg-[#0A0D12] border border-blue-200 dark:border-blue-800/40 text-slate-700 dark:text-slate-300 text-[11px]"
              >
                <CheckCircle2 className="w-3 h-3 text-emerald-500 flex-shrink-0" />
                <span>{chg}</span>
              </span>
            ))}
          </div>
        )}

        {/* Main Content Area */}
        <div className="flex-1 overflow-y-auto p-4 sm:p-6">
          {isLoading ? (
            <div className="h-64 flex flex-col items-center justify-center space-y-4 text-center">
              <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin" />
              <div className="space-y-1">
                <p className="text-sm font-bold text-slate-900 dark:text-white">
                  Rewriting and Optimizing Your Resume...
                </p>
                <p className="text-xs text-slate-500 dark:text-slate-400 font-mono">
                  Synthesizing missing keywords • Quantifying bullets with XYZ formula • Enforcing ATS structure
                </p>
              </div>
            </div>
          ) : activeTab === 'UPDATED' ? (
            <div className="space-y-3">
              <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                <span>EDITABLE ATS-OPTIMIZED RESUME TEXT</span>
                <span>CLEAN STANDARD PLAIN TEXT • 0% SCANNER AMBIGUITY</span>
              </div>
              <textarea
                value={editableText}
                onChange={(e) => setEditableText(e.target.value)}
                rows={20}
                className="w-full p-4 font-mono text-xs sm:text-sm bg-white dark:bg-[#07090E] border border-slate-300 dark:border-[#273142] rounded-xs text-slate-900 dark:text-slate-100 focus:outline-hidden focus:border-[#2563EB] leading-relaxed resize-y"
                placeholder="Optimized resume content..."
              />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 h-full">
              {/* Left: Original */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs font-mono text-slate-500 dark:text-slate-400">
                  <span className="font-bold text-red-600 dark:text-red-400 uppercase">ORIGINAL RESUME (Score: {originalScore})</span>
                  <span>PRE-OPTIMIZATION</span>
                </div>
                <div className="flex-1 p-4 font-mono text-xs bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] rounded-xs text-slate-600 dark:text-slate-400 overflow-y-auto max-h-[500px] whitespace-pre-wrap leading-relaxed">
                  {originalText || 'No original resume text available.'}
                </div>
              </div>

              {/* Right: Updated */}
              <div className="flex flex-col space-y-2">
                <div className="flex items-center justify-between text-xs font-mono">
                  <span className="font-bold text-emerald-600 dark:text-emerald-400 uppercase">
                    AUTO-UPDATED RESUME (Projected: {result?.projected_score || 94})
                  </span>
                  <span className="text-emerald-500 font-bold">100% RESTRUCTURED</span>
                </div>
                <div className="flex-1 p-4 font-mono text-xs bg-emerald-50/20 dark:bg-[#07120D] border border-emerald-400/40 dark:border-emerald-500/30 rounded-xs text-slate-900 dark:text-emerald-100 overflow-y-auto max-h-[500px] whitespace-pre-wrap leading-relaxed">
                  {editableText || result?.updated_resume_text || ''}
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Footer Bar with Re-analyze CTA */}
        <div className="p-4 sm:p-5 bg-white dark:bg-[#0E121A] border-t border-slate-200 dark:border-[#273142] flex flex-col sm:flex-row items-center justify-between gap-3 flex-shrink-0">
          <p className="text-xs text-slate-500 dark:text-slate-400 text-center sm:text-left">
            💡 Pro-Tip: You can re-run the evaluation right now with this updated resume to confirm your score increase.
          </p>

          <div className="flex items-center space-x-3 w-full sm:w-auto">
            <button
              onClick={onClose}
              className="px-4 py-2 border border-slate-300 dark:border-[#273142] text-xs font-semibold text-slate-700 dark:text-slate-300 rounded-xs hover:bg-slate-50 dark:hover:bg-[#1A2230] transition-colors"
            >
              Close
            </button>

            <button
              onClick={() => {
                const textToUse = editableText || result?.updated_resume_text;
                if (textToUse) {
                  onApplyAndReAnalyze(textToUse);
                  onClose();
                }
              }}
              disabled={isLoading || !editableText}
              className="flex-1 sm:flex-none flex items-center justify-center space-x-2 px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-bold rounded-xs shadow-md transition-all hover:shadow-blue-500/25 disabled:opacity-50"
            >
              <RotateCcw className="w-4 h-4" />
              <span>Apply &amp; Re-Analyze Score</span>
            </button>
          </div>
        </div>

      </div>
    </div>
  );
};
