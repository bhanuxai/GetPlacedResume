import React from 'react';
import { ShieldCheck, MessageSquarePlus } from 'lucide-react';
import { Logo } from './Logo';
import CircularText from './CircularText';
import MaskedHeading from './MaskedHeading';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenFeedback?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ onOpenPrivacy, onOpenFeedback }) => {
  return (
    <footer className="w-full bg-white dark:bg-[#000000] border-t border-slate-200 dark:border-[#262626] py-12 text-slate-600 dark:text-[#94A3B8] text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 pb-12 border-b border-slate-200 dark:border-[#262626] items-center">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <Logo size={28} textClassName="text-lg font-bold" text="GETPLACEDRESUME" />
            <p className="max-w-sm text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Explainable AI-powered resume analysis evaluating semantic relevance, evidence verification, document structure, and ATS parseability.
            </p>
          </div>

          {/* Col 2: Platform */}
          <div className="space-y-2 font-mono">
            <span className="text-slate-900 dark:text-white font-bold block mb-2 uppercase">Platform</span>
            <ul className="space-y-1.5 text-[11px]">
              <li><a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How It Works</a></li>
              <li><a href="#resume-guide" className="hover:text-slate-900 dark:hover:text-white transition-colors">Resume vs CV Guide</a></li>
              <li><a href="#scoring" className="hover:text-slate-900 dark:hover:text-white transition-colors">6-Axis Scoring Formula</a></li>
              <li><a href="#analyze" className="hover:text-slate-900 dark:hover:text-white transition-colors">Resume Analyzer</a></li>
            </ul>
          </div>

          {/* Col 3: Trust & Privacy */}
          <div className="space-y-2 font-mono">
            <span className="text-slate-900 dark:text-white font-bold block mb-2 uppercase">Trust &amp; Compliance</span>
            <ul className="space-y-1.5 text-[11px]">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669] dark:text-[#10B981]" />
                  <span>Privacy Protocol</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenFeedback} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer">
                  <MessageSquarePlus className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Review &amp; Suggestions</span>
                </button>
              </li>
              <li><span className="text-slate-400 dark:text-[#64748B]">Zero Model Retention</span></li>
              <li><span className="text-slate-400 dark:text-[#64748B]">Deterministic Parsing</span></li>
            </ul>
          </div>

          {/* Col 4: Corner Brand Stamp of GetPlacedResume */}
          <div className="flex md:justify-end items-center justify-start">
            <div className="relative w-28 h-28 flex items-center justify-center group" title="GetPlacedResume ATS Verified Brand Stamp">
              <CircularText
                text="GETPLACEDRESUME ✦ ATS VERIFIED ✦ "
                onHover="speedUp"
                spinDuration={20}
                className="w-28 h-28 text-[9px] font-bold text-slate-800 dark:text-slate-200 tracking-wider"
              />
              <div className="absolute inset-0 m-auto w-12 h-12 rounded-full bg-slate-100 dark:bg-[#0A0A0A] border border-slate-300 dark:border-[#262626] flex flex-col items-center justify-center shadow-xs select-none transition-transform group-hover:scale-105 pointer-events-none">
                <span className="font-display font-extrabold text-[11px] text-[#2563EB] tracking-tighter leading-none">GPR</span>
                <span className="text-[7px] font-mono text-slate-500 dark:text-slate-400 leading-none mt-0.5 font-semibold">2026</span>
              </div>
            </div>
          </div>

        </div>

        {/* Masked Heading Brand Display */}
        <div className="py-10 my-4 border-b border-slate-200 dark:border-[#262626] flex flex-col items-center justify-center overflow-hidden">
          <MaskedHeading
            text="GETPLACEDRESUME"
            mediaType="video"
            src="/reel.mp4"
            poster="/reel-poster.jpg"
            fillScale={1.3}
            parallax={34}
            reveal="wipe"
            trigger="view"
            weight={900}
            textScale={0.11}
            className="tracking-tight uppercase font-extrabold"
          />
        </div>

        {/* Bottom Disclaimer */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] font-mono text-slate-500 dark:text-[#64748B]">
          <p>
            &copy; {new Date().getFullYear()} GETPLACEDRESUME. AI-estimated compatibility scores are diagnostic tools and not guarantees of employer hiring decisions.
          </p>
          <div className="flex items-center space-x-4">
            <span>SECURE CLIENT INFERENCE</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
