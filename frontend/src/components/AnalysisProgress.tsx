import React, { useEffect, useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { LogoMark } from './Logo';

interface AnalysisProgressProps {
  onComplete?: () => void;
}

const STAGES = [
  { id: 1, label: "Uploading resume document...", detail: "Validating file binary & MIME type" },
  { id: 2, label: "Extracting text & document structure...", detail: "pdfplumber inspecting columns, tables & fonts" },
  { id: 3, label: "Analyzing candidate profile & sections...", detail: "Segmenting experience, education & projects" },
  { id: 4, label: "Parsing job requirements...", detail: "Classifying required vs preferred competencies" },
  { id: 5, label: "Computing semantic vector similarity...", detail: "Cosine distance & ontology concept mapping" },
  { id: 6, label: "Evaluating ATS layout parseability...", detail: "Testing multi-column flow & contact extraction" },
  { id: 7, label: "Synthesizing explainable ATS report...", detail: "Computing 6-dimension weighted compatibility" }
];

export const AnalysisProgress: React.FC<AnalysisProgressProps> = () => {
  const [currentStage, setCurrentStage] = useState(1);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentStage((prev) => {
        if (prev < STAGES.length) return prev + 1;
        return prev;
      });
    }, 450);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="w-full max-w-xl mx-auto bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#273142] p-6 sm:p-8 rounded-xs my-12 transition-colors shadow-sm dark:shadow-none">
      
      {/* Header */}
      <div className="flex items-center space-x-3 pb-6 border-b border-slate-200 dark:border-[#273142]">
        <LogoMark size={36} className="animate-pulse" />
        <div>
          <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight uppercase">
            GetPlacedResume Analytical Pipeline
          </h3>
          <p className="text-xs font-mono text-slate-600 dark:text-[#94A3B8]">
            PROCESSING DOCUMENT &amp; EXTRACTING SEMANTIC EVIDENCE
          </p>
        </div>
      </div>

      {/* Progress Steps */}
      <div className="py-6 space-y-4">
        {STAGES.map((stage) => {
          const isDone = currentStage > stage.id;
          const isCurrent = currentStage === stage.id;

          return (
            <div key={stage.id} className="flex items-start space-x-3.5 text-xs">
              <div className="mt-0.5 flex-shrink-0">
                {isDone ? (
                  <div className="w-5 h-5 bg-[#059669] dark:bg-[#10B981] flex items-center justify-center rounded-xs text-white">
                    <Check className="w-3.5 h-3.5 stroke-[3]" />
                  </div>
                ) : isCurrent ? (
                  <div className="w-5 h-5 bg-[#2563EB] flex items-center justify-center rounded-xs text-white">
                    <Loader2 className="w-3.5 h-3.5 animate-spin" />
                  </div>
                ) : (
                  <div className="w-5 h-5 bg-slate-100 dark:bg-[#1E2633] border border-slate-300 dark:border-[#273142] flex items-center justify-center rounded-xs text-slate-500 dark:text-[#64748B] font-mono text-[10px]">
                    0{stage.id}
                  </div>
                )}
              </div>

              <div className="flex-1">
                <p className={`font-semibold tracking-tight ${isCurrent ? 'text-slate-900 dark:text-white' : isDone ? 'text-slate-600 dark:text-[#94A3B8]' : 'text-slate-400 dark:text-[#64748B]'}`}>
                  {stage.label}
                </p>
                <p className="text-[11px] font-mono text-slate-500 dark:text-[#64748B]">
                  {stage.detail}
                </p>
              </div>

              <span className="font-mono text-[10px] text-slate-500 dark:text-[#64748B]">
                {isDone ? "DONE" : isCurrent ? "RUNNING" : "WAITING"}
              </span>
            </div>
          );
        })}
      </div>

      {/* Progress Bar */}
      <div className="w-full bg-slate-100 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] h-2 rounded-xs overflow-hidden">
        <div
          className="bg-[#2563EB] h-full transition-all duration-300"
          style={{ width: `${(currentStage / STAGES.length) * 100}%` }}
        />
      </div>

    </div>
  );
};
