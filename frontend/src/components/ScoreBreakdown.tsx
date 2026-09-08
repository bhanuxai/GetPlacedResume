import React from 'react';
import { ScoreBreakdown as IScoreBreakdown } from '../types';
import { Target, Wrench, Briefcase, FileCheck, Award, Eye } from 'lucide-react';

interface ScoreBreakdownProps {
  breakdown: IScoreBreakdown;
}

export const ScoreBreakdown: React.FC<ScoreBreakdownProps> = ({ breakdown }) => {
  const dimensions = [
    {
      title: "Job Relevance",
      score: breakdown.job_relevance,
      max: 30,
      icon: Target,
      color: "#2563EB",
      description: "Evaluates whether candidate projects, coursework, and past duties semantically address the core target role requirements."
    },
    {
      title: "Skills & Technical Competency",
      score: breakdown.skills_competency,
      max: 20,
      icon: Wrench,
      color: "#059669",
      description: "Rewards competencies backed by project and work experience evidence; penalizes unsupported keyword stuffing."
    },
    {
      title: "Experience Relevance",
      score: breakdown.experience_relevance,
      max: 20,
      icon: Briefcase,
      color: "#3B82F6",
      description: "Assesses seniority, project complexity, and engineering deliverables aligned to target expectations."
    },
    {
      title: "ATS Structure & Parseability",
      score: breakdown.ats_parseability,
      max: 15,
      icon: FileCheck,
      color: "#2563EB",
      description: "Detects layout hazards: multi-column reading flow, embedded table fragmentation, and missing standard headers."
    },
    {
      title: "Content Quality",
      score: breakdown.content_quality,
      max: 10,
      icon: Award,
      color: "#D97706",
      description: "Analyzes action verb strength, technical depth, outcome orientation, and quantifiable metrics in bullet points."
    },
    {
      title: "Professional Presentation",
      score: breakdown.professional_presentation,
      max: 5,
      icon: Eye,
      color: "#64748B",
      description: "Evaluates typography consistency, date format uniformity, and clean visual hierarchy."
    }
  ];

  return (
    <div className="w-full bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#273142] p-6 sm:p-8 rounded-xs transition-colors shadow-sm dark:shadow-none">
      <div className="pb-6 border-b border-slate-200 dark:border-[#273142]">
        <h3 className="text-base sm:text-lg font-bold font-sans text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
          <span className="w-2 h-2 bg-[#2563EB] inline-block" />
          <span>EXPLAINABLE SCORING BREAKDOWN</span>
        </h3>
        <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1 font-sans">
          WEIGHTED SUM: 30% RELEVANCE + 20% SKILLS + 20% EXPERIENCE + 15% ATS + 10% CONTENT + 5% PRESENTATION
        </p>
      </div>

      {/* 6 Dimensions Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-6">
        {dimensions.map((dim, idx) => {
          const Icon = dim.icon;
          const percentage = (dim.score / dim.max) * 100;

          return (
            <div key={idx} className="bg-slate-50 dark:bg-[#0A0D12] border border-slate-300 dark:border-[#273142] p-4 flex flex-col justify-between transition-colors">
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2.5">
                    <div className="w-7 h-7 bg-white dark:bg-[#1A202C] border border-slate-300 dark:border-[#273142] flex items-center justify-center">
                      <Icon className="w-4 h-4 text-slate-900 dark:text-white" />
                    </div>
                    <span className="text-sm font-bold text-slate-900 dark:text-white">{dim.title}</span>
                  </div>
                  <span className="font-mono text-sm font-bold text-slate-900 dark:text-white">
                    {dim.score} <span className="text-slate-400 dark:text-[#64748B] text-xs font-normal">/ {dim.max}</span>
                  </span>
                </div>

                <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-2.5 leading-relaxed">
                  {dim.description}
                </p>
              </div>

              {/* Solid Progress Bar */}
              <div className="mt-4">
                <div className="w-full bg-slate-200 dark:bg-[#1A202C] h-2 rounded-xs overflow-hidden">
                  <div
                    className="h-full transition-all duration-500"
                    style={{
                      width: `${Math.min(100, percentage)}%`,
                      backgroundColor: dim.color
                    }}
                  />
                </div>
                <div className="flex justify-between items-center text-[10px] font-mono text-slate-500 dark:text-[#64748B] mt-1.5">
                  <span>WEIGHT: {dim.max}%</span>
                  <span>{percentage.toFixed(0)}% OF AXIS MET</span>
                </div>
              </div>

            </div>
          );
        })}
      </div>
    </div>
  );
};
