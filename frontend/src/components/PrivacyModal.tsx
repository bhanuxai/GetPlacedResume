import React from 'react';
import { ShieldCheck, X, Lock, EyeOff, Trash2 } from 'lucide-react';

interface PrivacyModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PrivacyModal: React.FC<PrivacyModalProps> = ({ isOpen, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-slate-900/60 dark:bg-[#000000]/80 flex items-center justify-center p-4">
      <div className="w-full max-w-lg bg-white dark:bg-[#0A0A0A] border border-slate-300 dark:border-[#262626] p-6 rounded-xs relative shadow-xl transition-colors">
        
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 text-slate-400 hover:text-slate-700 dark:text-[#94A3B8] dark:hover:text-white transition-colors"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Title */}
        <div className="flex items-center space-x-3 pb-4 border-b border-slate-200 dark:border-[#262626]">
          <div className="w-9 h-9 bg-emerald-50 dark:bg-[#064E3B] border border-[#059669] dark:border-[#10B981] flex items-center justify-center text-[#059669] dark:text-[#10B981]">
            <ShieldCheck className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold font-sans text-slate-900 dark:text-white tracking-tight">
              Data Privacy &amp; Security Protocol
            </h3>
            <p className="text-xs font-semibold font-sans text-[#059669] dark:text-[#10B981]">
              EPHEMERAL IN-MEMORY PROCESSING
            </p>
          </div>
        </div>

        {/* Core Principles */}
        <div className="py-6 space-y-4 text-xs text-slate-700 dark:text-[#CBD5E1]">
          <div className="flex items-start space-x-3">
            <Trash2 className="w-4 h-4 text-[#2563EB] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white block font-sans">Immediate Ephemeral Discard:</strong>
              Uploaded PDF and DOCX documents are parsed entirely in-memory and discarded upon report generation. No binary files are stored on disk.
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <EyeOff className="w-4 h-4 text-[#059669] dark:text-[#10B981] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white block font-sans">Zero Model Training:</strong>
              Your resume content and personal identifiers are strictly never used to train, fine-tune, or adjust AI models.
            </div>
          </div>

          <div className="flex items-start space-x-3">
            <Lock className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] flex-shrink-0 mt-0.5" />
            <div>
              <strong className="text-slate-900 dark:text-white block font-sans">Client-Side Control:</strong>
              Job match history and report analyses are stored only within your current local session. You retain full ownership of your data.
            </div>
          </div>
        </div>

        {/* Notice box */}
        <div className="bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] p-3 text-[11px] font-mono text-slate-600 dark:text-[#94A3B8]">
          STATEMENT: &quot;Your resume is processed securely and is not used to train models.&quot;
        </div>

        {/* CTA */}
        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xs transition-colors"
          >
            I Understand
          </button>
        </div>

      </div>
    </div>
  );
};
