import React from 'react';
import LogoLoop from './LogoLoop';
import { SiReact, SiNextdotjs, SiTypescript, SiTailwindcss, SiPython, SiFastapi, SiVite } from 'react-icons/si';
import { Code2, Cpu, ShieldCheck, Zap } from 'lucide-react';

interface AboutSectionProps {
  theme?: 'light' | 'dark';
}

export const AboutSection: React.FC<AboutSectionProps> = ({ theme = 'light' }) => {
  const isDark = theme === 'dark';

  const techLogos = [
    { node: <SiReact className="w-8 h-8 text-[#61DAFB]" />, title: "React", href: "https://react.dev" },
    { node: <SiNextdotjs className="w-8 h-8 text-black dark:text-white" />, title: "Next.js", href: "https://nextjs.org" },
    { node: <SiTypescript className="w-8 h-8 text-[#3178C6]" />, title: "TypeScript", href: "https://www.typescriptlang.org" },
    { node: <SiTailwindcss className="w-8 h-8 text-[#06B6D4]" />, title: "Tailwind CSS", href: "https://tailwindcss.com" },
    { node: <SiPython className="w-8 h-8 text-[#3776AB]" />, title: "Python 3.11", href: "https://python.org" },
    { node: <SiFastapi className="w-8 h-8 text-[#009688]" />, title: "FastAPI", href: "https://fastapi.tiangolo.com" },
    { node: <SiVite className="w-8 h-8 text-[#646CFF]" />, title: "Vite", href: "https://vitejs.dev" },
  ];

  return (
    <section id="about" className="py-16 md:py-24 border-b border-slate-200 dark:border-[#262626] bg-white dark:bg-[#050505] transition-colors relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="text-center max-w-3xl mx-auto mb-12">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 rounded-full text-blue-700 dark:text-blue-300 text-xs font-semibold mb-4 uppercase tracking-wider font-mono">
            <span>Engineering &amp; Architecture</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            Built with High-Performance Modern Technologies
          </h2>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-[#94A3B8] leading-relaxed">
            GetPlacedResume was engineered from the ground up using strict typing, low-latency microservices, deterministic document parsers, and modern reactive UI frameworks.
          </p>
        </div>

        {/* LogoLoop Infinite Scroll */}
        <div className="py-6 my-4 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs overflow-hidden">
          <div className="text-center text-[11px] font-mono uppercase tracking-widest text-slate-400 dark:text-slate-500 mb-4">
            Core Languages &amp; Frameworks Powering The Platform
          </div>
          <div className="relative overflow-hidden py-3">
            <LogoLoop
              logos={techLogos}
              speed={100}
              direction="left"
              logoHeight={44}
              gap={48}
              hoverSpeed={0}
              scaleOnHover
              fadeOut
              fadeOutColor={isDark ? "#0A0A0A" : "#F8FAFC"}
              ariaLabel="Technologies used to build GetPlacedResume"
            />
          </div>
        </div>

        {/* Tech Stack Breakdown Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
          <div className="p-5 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-blue-100 dark:bg-blue-950/60 rounded-xs text-[#2563EB]">
                <Code2 className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">TypeScript &amp; React</h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Frontend Layer</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Provides end-to-end type safety, fluid state management, instant preview re-rendering, and reactive feedback loops.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-emerald-100 dark:bg-emerald-950/60 rounded-xs text-[#059669]">
                <Cpu className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Python 3.11 &amp; FastAPI</h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Analysis Engine</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              High-throughput asynchronous backend utilizing <span className="font-mono text-slate-800 dark:text-slate-200">pdfplumber</span> and <span className="font-mono text-slate-800 dark:text-slate-200">python-docx</span> for byte-level document parsing.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-cyan-100 dark:bg-cyan-950/60 rounded-xs text-[#0891B2]">
                <Zap className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Tailwind &amp; Vite</h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Design &amp; Tooling</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Sub-second HMR and deterministic utility styling delivering a consistent, accessible dark/light high-contrast interface.
            </p>
          </div>

          <div className="p-5 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs">
            <div className="flex items-center space-x-3 mb-3">
              <div className="p-2 bg-purple-100 dark:bg-purple-950/60 rounded-xs text-[#8B5CF6]">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <div>
                <h4 className="font-bold text-sm text-slate-900 dark:text-white">Vector Math &amp; NLP</h4>
                <span className="text-[10px] font-mono text-slate-500 dark:text-slate-400">Scoring Intelligence</span>
              </div>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              6-dimensional mathematical scoring calculating TF-IDF vectors, cosine similarity, action verb strength, and layout health.
            </p>
          </div>
        </div>

      </div>
    </section>
  );
};
