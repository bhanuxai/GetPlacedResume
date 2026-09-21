import React from 'react';
import { ShieldCheck, MessageSquarePlus, BookOpen, Scale, Cookie, Mail, Info, FileText } from 'lucide-react';
import { Logo } from './Logo';
import CircularText from './CircularText';
import MaskedHeading from './MaskedHeading';

interface FooterProps {
  onOpenPrivacy?: () => void;
  onOpenTerms?: () => void;
  onOpenCookies?: () => void;
  onOpenAbout?: () => void;
  onOpenContact?: () => void;
  onOpenGuides?: () => void;
  onOpenFeedback?: () => void;
}

export const Footer: React.FC<FooterProps> = ({ 
  onOpenPrivacy, 
  onOpenTerms, 
  onOpenCookies, 
  onOpenAbout, 
  onOpenContact, 
  onOpenGuides, 
  onOpenFeedback 
}) => {
  return (
    <footer className="w-full bg-white dark:bg-[#000000] border-t border-slate-200 dark:border-[#262626] py-12 text-slate-600 dark:text-[#94A3B8] text-xs transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-8 pb-12 border-b border-slate-200 dark:border-[#262626]">
          
          {/* Col 1: Brand & Mission (2 cols) */}
          <div className="lg:col-span-2 space-y-3">
            <Logo size={28} textClassName="text-lg font-bold" text="GETPLACEDRESUME" />
            <p className="max-w-sm text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed">
              Explainable AI-powered resume analysis evaluating semantic relevance, evidence verification, document structure, and ATS parseability. Helping candidates overcome the automated hiring filter.
            </p>
            <div className="pt-2 text-[11px] font-mono text-slate-400 space-y-1">
              <div>Domain: getplacedresume.vercel.app</div>
              <div>Processing Standard: 100% In-Memory Transient RAM</div>
            </div>
          </div>

          {/* Col 2: Platform Tools */}
          <div className="space-y-2 font-mono">
            <span className="text-slate-900 dark:text-white font-bold block mb-2 uppercase text-xs">Platform</span>
            <ul className="space-y-2 text-[11px]">
              <li><a href="#analyze" className="hover:text-slate-900 dark:hover:text-white transition-colors">Resume Analyzer Tool</a></li>
              <li><a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">How ATS Scoring Works</a></li>
              <li><a href="#scoring" className="hover:text-slate-900 dark:hover:text-white transition-colors">6-Axis Scoring Formula</a></li>
              <li><a href="#resume-guide" className="hover:text-slate-900 dark:hover:text-white transition-colors">Resume vs CV Comparison</a></li>
            </ul>
          </div>

          {/* Col 3: Career & ATS Guides */}
          <div className="space-y-2 font-mono">
            <span className="text-slate-900 dark:text-white font-bold block mb-2 uppercase text-xs">Career &amp; ATS Guides</span>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={onOpenGuides} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer text-left">
                  <BookOpen className="w-3 h-3 text-[#2563EB]" />
                  <span>ATS Architecture (2026)</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenGuides} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  <span>Resume Formatting Blueprint</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenGuides} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  <span>Google XYZ Bullet Formula</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenGuides} className="hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer text-left">
                  <span>Semantic Keywords vs Stuffing</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenAbout} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer text-left">
                  <Info className="w-3 h-3 text-purple-500" />
                  <span>About Our Methodology</span>
                </button>
              </li>
            </ul>
          </div>

          {/* Col 4: Trust & Compliance */}
          <div className="space-y-2 font-mono">
            <span className="text-slate-900 dark:text-white font-bold block mb-2 uppercase text-xs">Legal &amp; Compliance</span>
            <ul className="space-y-2 text-[11px]">
              <li>
                <button onClick={onOpenPrivacy} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer text-left">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#059669] dark:text-[#10B981]" />
                  <span>Privacy Policy (AdSense)</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenTerms} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer text-left">
                  <Scale className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>Terms of Service</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenCookies} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer text-left">
                  <Cookie className="w-3.5 h-3.5 text-purple-500" />
                  <span>Cookie Policy</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenContact} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer text-left">
                  <Mail className="w-3.5 h-3.5 text-amber-500" />
                  <span>Contact &amp; Inquiries</span>
                </button>
              </li>
              <li>
                <button onClick={onOpenFeedback} className="hover:text-slate-900 dark:hover:text-white transition-colors flex items-center space-x-1 cursor-pointer text-left">
                  <MessageSquarePlus className="w-3.5 h-3.5 text-[#2563EB]" />
                  <span>User Suggestions</span>
                </button>
              </li>
            </ul>
          </div>

        </div>

        {/* Brand Stamp & Recognition Display */}
        <div className="py-6 border-b border-slate-200 dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
          <div className="flex items-center space-x-4">
            <div className="relative w-16 h-16 flex items-center justify-center">
              <CircularText
                text="GETPLACEDRESUME ✦ ATS VERIFIED ✦ "
                spinDuration={20}
                className="w-16 h-16 text-[6px] font-bold text-slate-800 dark:text-slate-200"
              />
              <div className="absolute inset-0 m-auto w-8 h-8 rounded-full bg-slate-100 dark:bg-[#0A0A0A] border border-slate-300 dark:border-[#262626] flex flex-col items-center justify-center">
                <span className="font-display font-extrabold text-[8px] text-[#2563EB]">GPR</span>
              </div>
            </div>
            <div className="text-xs">
              <strong className="text-slate-900 dark:text-white block font-sans">GetPlacedResume Architecture</strong>
              <span className="text-[11px] text-slate-500 font-mono">Deterministic Parsers &bull; Zero Cloud Retention &bull; AdSense Compliant</span>
            </div>
          </div>

          <div className="text-xs font-mono text-slate-500 flex flex-wrap gap-4">
            <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="hover:underline">
              Google Ad Settings
            </a>
            <span>&bull;</span>
            <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="hover:underline">
              AboutAds Opt-Out
            </a>
            <span>&bull;</span>
            <button onClick={onOpenCookies} className="hover:underline cursor-pointer">
              Manage Cookies
            </button>
          </div>
        </div>

        {/* Masked Heading Brand Display */}
        <div className="py-8 border-b border-slate-200 dark:border-[#262626] flex flex-col items-center justify-center overflow-hidden">
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
            &copy; {new Date().getFullYear()} GETPLACEDRESUME (getplacedresume.vercel.app). All rights reserved. Diagnostic scores and recruiter heuristics are educational guidance tools and do not constitute guarantees of hiring decisions.
          </p>
          <div className="flex items-center space-x-4">
            <span>SECURE IN-MEMORY INFERENCE</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
