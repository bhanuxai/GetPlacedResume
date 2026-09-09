import React, { useState, useRef } from 'react';
import { Upload, CheckCircle2, AlertCircle, X, Shield } from 'lucide-react';

interface UploadZoneProps {
  file: File | null;
  onFileSelect: (file: File | null) => void;
  rawText: string;
  onRawTextChange: (text: string) => void;
  profileMode: string;
  onProfileModeChange: (mode: string) => void;
}

export const UploadZone: React.FC<UploadZoneProps> = ({
  file,
  onFileSelect,
  rawText,
  onRawTextChange,
  profileMode,
  onProfileModeChange
}) => {
  const [tab, setTab] = useState<'upload' | 'paste'>('upload');
  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    setErrorMessage(null);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      validateAndSetFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage(null);
    if (e.target.files && e.target.files.length > 0) {
      validateAndSetFile(e.target.files[0]);
    }
  };

  const validateAndSetFile = (f: File) => {
    const ext = f.name.split('.').pop()?.toLowerCase();
    if (ext !== 'pdf' && ext !== 'docx' && ext !== 'doc') {
      setErrorMessage('Please select a valid PDF or DOCX file.');
      return;
    }
    if (f.size > 15 * 1024 * 1024) {
      setErrorMessage('File size exceeds 15MB limit.');
      return;
    }
    onFileSelect(f);
  };

  return (
    <div className="w-full bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-5 sm:p-6 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Header & Tabs */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-5 border-b border-slate-200 dark:border-[#262626]">
        <div>
          <h2 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
            <span className="w-2 h-2 bg-[#2563EB] inline-block" />
            <span>1. RESUME / CV DOCUMENT</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1">Upload your original PDF or DOCX to inspect layout and parseability.</p>
        </div>

        {/* Upload Mode Switcher */}
        <div className="flex bg-slate-100 dark:bg-[#000000] p-1 border border-slate-300 dark:border-[#262626] rounded-xs self-start">
          <button
            onClick={() => setTab('upload')}
            className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors ${
              tab === 'upload' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            File Upload
          </button>
          <button
            onClick={() => setTab('paste')}
            className={`px-3 py-1 text-xs font-semibold rounded-xs transition-colors ${
              tab === 'paste' ? 'bg-[#2563EB] text-white' : 'text-slate-600 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            Paste Text
          </button>
        </div>
      </div>

      {/* Profile Mode Selection */}
      <div className="py-4 border-b border-slate-200 dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
        <span className="text-slate-600 dark:text-[#94A3B8] font-mono uppercase tracking-wider">Analysis Profile:</span>
        <div className="flex flex-wrap gap-2">
          {[
            { id: 'auto', label: 'Auto-Detect' },
            { id: 'student', label: 'Student / Fresher Mode' },
            { id: 'experienced', label: 'Experienced Professional' }
          ].map((mode) => (
            <button
              key={mode.id}
              onClick={() => onProfileModeChange(mode.id)}
              className={`px-2.5 py-1 text-xs font-medium border rounded-xs transition-colors ${
                profileMode === mode.id
                  ? 'bg-slate-200 dark:bg-[#141414] text-slate-900 dark:text-white border-[#2563EB]'
                  : 'bg-slate-50 dark:bg-[#000000] text-slate-600 dark:text-[#94A3B8] border-slate-300 dark:border-[#262626] hover:text-slate-900 dark:hover:text-white'
              }`}
            >
              {mode.label}
            </button>
          ))}
        </div>
      </div>

      {/* Main Upload / Text Area */}
      <div className="pt-5">
        {tab === 'upload' ? (
          <div>
            {!file ? (
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`w-full border border-dashed p-8 sm:p-12 text-center cursor-pointer transition-colors ${
                  isDragging
                    ? 'border-[#2563EB] bg-blue-50 dark:bg-[#171717]'
                    : 'border-slate-300 dark:border-[#262626] hover:border-[#2563EB] bg-slate-50 dark:bg-[#000000]'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".pdf,.docx,.doc"
                  onChange={handleFileChange}
                  className="hidden"
                />
                
                <div className="w-12 h-12 bg-white dark:bg-[#171717] border border-slate-300 dark:border-[#262626] flex items-center justify-center mx-auto mb-4 text-[#2563EB]">
                  <Upload className="w-6 h-6" />
                </div>

                <p className="text-sm font-semibold text-slate-900 dark:text-white">
                  Drop your resume file here, or <span className="text-[#2563EB] underline">browse</span>
                </p>
                <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-2 font-mono">
                  SUPPORTS PDF, DOCX (UP TO 15MB)
                </p>
              </div>
            ) : (
              <div className="w-full bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] p-4 flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="w-10 h-10 bg-white dark:bg-[#171717] border border-slate-300 dark:border-[#262626] flex items-center justify-center text-[#059669] dark:text-[#10B981]">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-sm font-bold text-slate-900 dark:text-white truncate max-w-xs sm:max-w-md">{file.name}</p>
                    <p className="text-xs text-slate-500 dark:text-[#94A3B8] font-mono">
                      {(file.size / 1024).toFixed(1)} KB | READY FOR ATS PARSING
                    </p>
                  </div>
                </div>

                <button
                  onClick={() => onFileSelect(null)}
                  className="p-2 hover:bg-slate-200 dark:hover:bg-[#171717] text-slate-500 dark:text-[#94A3B8] hover:text-slate-900 dark:hover:text-white rounded-xs transition-colors"
                  title="Remove file"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            )}

            {errorMessage && (
              <div className="mt-3 flex items-center space-x-2 text-xs text-[#DC2626] dark:text-[#EF4444] bg-red-50 dark:bg-[#000000] p-2 border border-[#DC2626] dark:border-[#EF4444]">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}
          </div>
        ) : (
          <div>
            <textarea
              value={rawText}
              onChange={(e) => onRawTextChange(e.target.value)}
              placeholder="Paste the full text of your resume here..."
              rows={8}
              className="w-full bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] focus:border-[#2563EB] p-3 text-sm text-slate-900 dark:text-white font-mono placeholder-slate-400 dark:placeholder-[#64748B] outline-none rounded-xs resize-y"
            />
            <div className="flex justify-between items-center text-xs text-slate-500 dark:text-[#94A3B8] font-mono mt-2">
              <span>CHARACTERS: {rawText.length}</span>
              <span>{rawText.split(/\s+/).filter(Boolean).length} WORDS</span>
            </div>
          </div>
        )}
      </div>

      {/* Privacy Guarantee Note */}
      <div className="mt-5 pt-3 border-t border-slate-200 dark:border-[#262626] flex items-center space-x-2 text-xs text-slate-600 dark:text-[#94A3B8]">
        <Shield className="w-3.5 h-3.5 text-[#059669] dark:text-[#10B981] flex-shrink-0" />
        <span>Your resume is processed ephemerally in memory and never stored or used to train models.</span>
      </div>

    </div>
  );
};
