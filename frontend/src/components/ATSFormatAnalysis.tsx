import React from 'react';
import { ATSFormatReport } from '../types';
import { CheckCircle2, AlertTriangle, Columns, Table, EyeOff, Layout } from 'lucide-react';

interface ATSFormatAnalysisProps {
  report: ATSFormatReport;
}

export const ATSFormatAnalysis: React.FC<ATSFormatAnalysisProps> = ({ report }) => {
  const isHealthy = report.parseability_score >= 85;
  const isModerate = report.parseability_score >= 70 && report.parseability_score < 85;

  const scoreColor = isHealthy ? '#059669' : isModerate ? '#D97706' : '#DC2626';

  const formatChecks = [
    {
      name: "Column Structure",
      passed: !report.two_column_layout_detected,
      detail: report.two_column_layout_detected ? "Multi-column layout detected (risk of fragmented horizontal scanning)" : "Single-column linear flow (optimal ATS reading order)",
      icon: Columns
    },
    {
      name: "Table Flattening Risk",
      passed: report.tables_detected === 0,
      detail: report.tables_detected > 0 ? `${report.tables_detected} embedded table(s) detected (may corrupt skill tags)` : "No tables detected (clean plaintext stream)",
      icon: Table
    },
    {
      name: "Text Layer / OCR Check",
      passed: !report.scanned_image_detected,
      detail: report.scanned_image_detected ? "Image-based document detected (requires OCR)" : "Selectable text layer verified (direct token extraction)",
      icon: EyeOff
    },
    {
      name: "Contact In Margins",
      passed: !report.headers_footers_with_content,
      detail: report.headers_footers_with_content ? "Contact info detected inside header/footer margins" : "Contact details located in document body flow",
      icon: Layout
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#273142] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      
      {/* Header */}
      <div className="pb-6 border-b border-slate-200 dark:border-[#273142]">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#2563EB] inline-block" />
          <span>ATS DOCUMENT PARSEABILITY AUDIT</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 font-mono">
          SCANNING FOR PHYSICAL LAYOUT ANOMALIES THAT CAUSE RESUME INGESTION FAILURES
        </p>
      </div>

      {/* Parseability Score Header */}
      <div className="py-6 flex flex-col sm:flex-row items-center justify-between gap-6 border-b border-slate-200 dark:border-[#273142]">
        <div className="flex items-center space-x-6">
          <div className="w-24 h-24 bg-slate-50 dark:bg-[#0A0D12] border-2 flex flex-col items-center justify-center rounded-xs" style={{ borderColor: scoreColor }}>
            <span className="text-3xl font-extrabold font-mono text-slate-900 dark:text-white">
              {report.parseability_score}
            </span>
            <span className="text-[9px] font-mono text-slate-500 dark:text-[#94A3B8] uppercase">
              / 100 PARSE
            </span>
          </div>

          <div>
            <h4 className="text-base font-bold text-slate-900 dark:text-white">
              {isHealthy ? "High ATS Ingestion Confidence" : isModerate ? "Moderate Parsing Risks Detected" : "Severe Parsing Barriers"}
            </h4>
            <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 leading-relaxed max-w-lg">
              Enterprise parsers (Workday, Taleo, Greenhouse) strip visual layout styling. Resumes must maintain deterministic single-column reading order.
            </p>
          </div>
        </div>

        <div className="text-right font-mono text-xs text-slate-600 dark:text-[#94A3B8] self-start sm:self-center">
          <span className="block">READING ORDER RISK:</span>
          <span className="font-bold text-sm" style={{ color: scoreColor }}>
            {report.broken_reading_order_risk} RISK
          </span>
        </div>
      </div>

      {/* Checklist Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 py-6 border-b border-slate-200 dark:border-[#273142]">
        {formatChecks.map((chk, idx) => (
          <div key={idx} className="bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-4 flex items-start space-x-3 transition-colors">
            <div className="mt-0.5 flex-shrink-0">
              {chk.passed ? (
                <CheckCircle2 className="w-4 h-4 text-[#059669] dark:text-[#10B981]" />
              ) : (
                <AlertTriangle className="w-4 h-4 text-[#D97706] dark:text-[#F59E0B]" />
              )}
            </div>
            <div>
              <span className="text-xs font-bold text-slate-900 dark:text-white block">{chk.name}</span>
              <p className="text-[11px] text-slate-600 dark:text-[#94A3B8] mt-0.5">{chk.detail}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Detected Issues Breakdown */}
      <div className="pt-6">
        <h4 className="text-xs font-mono uppercase text-slate-600 dark:text-[#94A3B8] mb-4">
          DETECTED PARSING ISSUES &amp; RECOVERY STEPS ({report.detected_issues.length}):
        </h4>

        {report.detected_issues.length === 0 ? (
          <div className="bg-emerald-50 dark:bg-[#0A0D12] border border-[#059669] dark:border-[#10B981] p-4 text-xs text-[#059669] dark:text-[#10B981] font-mono flex items-center space-x-2">
            <CheckCircle2 className="w-4 h-4 flex-shrink-0" />
            <span>Zero structural or formatting hazards identified. Document layout complies with standard ATS parsing criteria.</span>
          </div>
        ) : (
          <div className="space-y-3">
            {report.detected_issues.map((iss, idx) => (
              <div key={idx} className="bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-4 text-xs transition-colors">
                <div className="flex items-center space-x-2 mb-2">
                  <span
                    className={`px-2 py-0.5 text-[10px] font-mono font-bold uppercase rounded-xs ${
                      iss.severity === 'HIGH'
                        ? 'bg-red-50 dark:bg-[#450A0A] text-[#DC2626] dark:text-[#EF4444] border border-[#DC2626] dark:border-[#EF4444]'
                        : iss.severity === 'MEDIUM'
                        ? 'bg-amber-50 dark:bg-[#451A03] text-[#D97706] dark:text-[#F59E0B] border border-[#D97706] dark:border-[#F59E0B]'
                        : 'bg-slate-100 dark:bg-[#1A202C] text-slate-700 dark:text-[#94A3B8] border border-slate-300 dark:border-[#273142]'
                    }`}
                  >
                    {iss.severity} SEVERITY
                  </span>
                  <strong className="text-slate-900 dark:text-white text-sm">{iss.title}</strong>
                </div>

                <p className="text-slate-700 dark:text-[#CBD5E1] mb-2 leading-relaxed">{iss.description}</p>
                
                <div className="bg-white dark:bg-[#12161F] p-2.5 border border-slate-300 dark:border-[#273142] text-[11px] text-slate-600 dark:text-[#94A3B8]">
                  <strong className="text-slate-900 dark:text-white font-mono uppercase block mb-0.5">REMEDY:</strong>
                  {iss.recommendation}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

    </div>
  );
};
