import React from 'react';
import { ArrowRight, Play, CheckCircle2, Shield, Layers } from 'lucide-react';
import ParticleText from './ParticleText';
import CountUp from './CountUp';
import GlareHover from './GlareHover';

interface HeroProps {
  onTryDemo: () => void;
  onScrollToUpload: () => void;
  theme?: 'light' | 'dark';
}

export const Hero: React.FC<HeroProps> = ({ onTryDemo, onScrollToUpload, theme = 'light' }) => {
  const isDark = theme === 'dark';

  return (
    <section className="relative w-full border-b border-slate-200 dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#000000] pt-12 pb-16 md:pt-20 md:pb-24 overflow-hidden transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-center">
          
          {/* Left Column: Editorial Headline & Actions */}
          <div className="lg:col-span-7 flex flex-col items-start space-y-6">
            
            {/* Live Scanned Resumes Counter Badge */}
            <div className="inline-flex items-center space-x-2 px-3.5 py-1.5 rounded-full bg-blue-50 dark:bg-blue-950/50 border border-blue-200 dark:border-blue-800/60 text-xs text-blue-700 dark:text-blue-300 font-medium shadow-xs">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-600"></span>
              </span>
              <span>Scanned over</span>
              <span className="font-mono font-bold text-slate-900 dark:text-white">
                <CountUp from={0} to={15420} separator="," direction="up" duration={2} className="count-up-text" />+
              </span>
              <span>resumes for placement drives</span>
            </div>

            {/* Main Headline */}
            <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-slate-900 dark:text-white leading-[1.08] font-display">
              Know how well your resume fits the job.
            </h1>

            {/* Subtitle */}
            <p className="text-base sm:text-lg text-slate-600 dark:text-[#94A3B8] max-w-2xl leading-relaxed">
              Applicant Tracking Systems reject 75% of qualified applicants due to formatting traps and shallow keyword queries. GetPlacedResume performs deep document understanding, vector-based semantic matching, and evidence verification — before you submit.
            </p>

            {/* Core Verification Pillars */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 pt-2 w-full max-w-xl">
              <div className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-[#F8FAFC]">
                <CheckCircle2 className="w-4 h-4 text-[#059669] dark:text-[#10B981] flex-shrink-0" />
                <span>Zero Keyword Stuffing</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-[#F8FAFC]">
                <Layers className="w-4 h-4 text-[#2563EB] flex-shrink-0" />
                <span>6-Dimension Scoring</span>
              </div>
              <div className="flex items-center space-x-2.5 text-xs text-slate-700 dark:text-[#F8FAFC]">
                <Shield className="w-4 h-4 text-[#2563EB] dark:text-[#60A5FA] flex-shrink-0" />
                <span>100% Privacy Secure</span>
              </div>
            </div>

            {/* CTAs */}
            <div className="flex flex-col sm:flex-row items-stretch sm:items-center space-y-3 sm:space-y-0 sm:space-x-4 pt-4 w-full sm:w-auto">
              <GlareHover
                as="button"
                onClick={onScrollToUpload}
                width="auto"
                height="auto"
                background="#2563EB"
                borderRadius="2px"
                borderColor="transparent"
                glareColor="#ffffff"
                glareOpacity={0.3}
                glareAngle={-30}
                glareSize={300}
                transitionDuration={800}
                playOnce={false}
                className="w-full sm:w-auto px-6 py-3.5 text-white font-semibold text-sm cursor-pointer shadow-none hover:bg-[#1D4ED8] transition-colors"
              >
                <div className="flex items-center justify-center space-x-2.5">
                  <span>Analyze My Resume</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </GlareHover>

              <button
                onClick={onTryDemo}
                className="flex items-center justify-center space-x-2.5 px-6 py-3.5 bg-white hover:bg-slate-100 dark:bg-[#0A0A0A] dark:hover:bg-[#171717] text-slate-800 dark:text-[#F8FAFC] border border-slate-300 dark:border-[#262626] font-semibold text-sm rounded-xs transition-colors"
              >
                <Play className="w-4 h-4 text-[#2563EB]" />
                <span>View Demo Report</span>
              </button>
            </div>

          </div>

          {/* Right Column: Particle Text Animation (No surround box) */}
          <div className="lg:col-span-5 relative w-full flex items-center justify-center">
            <div className="w-full h-[320px] sm:h-[360px] flex items-center justify-center overflow-hidden">
              <ParticleText
                text="Resume"
                particleSize={2.2}
                density={4}
                color={isDark ? '#F8FAFC' : '#0F172A'}
                highlightColor={isDark ? '#8B5CF6' : '#2563EB'}
                scatter={190}
                gatherDuration={1600}
                stagger={420}
                pointerRepel={42}
                repelRadius={120}
                idleDrift={0.8}
                trigger="mount"
                fontSize="clamp(3.5rem, 13vw, 9rem)"
                fontWeight={800}
                fontFamily="inherit"
                glow
              />
            </div>
          </div>

        </div>
      </div>
    </section>
  );
};
