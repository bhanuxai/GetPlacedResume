import React, { useState } from 'react';
import { 
  ShieldCheck, 
  Play, 
  ArrowRight, 
  Sun, 
  Moon, 
  MessageSquarePlus, 
  BookOpen, 
  Info, 
  Mail, 
  Menu, 
  X 
} from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onTryDemo: () => void;
  onNavigateLanding?: () => void;
  onNavigateGuides?: () => void;
  onNavigateAbout?: () => void;
  onNavigateContact?: () => void;
  onOpenPrivacy?: () => void;
  onOpenFeedback?: () => void;
  currentView: string;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onTryDemo,
  onNavigateLanding,
  onNavigateGuides,
  onNavigateAbout,
  onNavigateContact,
  onOpenPrivacy,
  onOpenFeedback,
  currentView,
  theme,
  onToggleTheme
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleNavClick = (callback?: () => void) => {
    setMobileMenuOpen(false);
    if (callback) callback();
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#000000] border-b border-slate-200 dark:border-[#262626] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        
        {/* Logo */}
        <div 
          onClick={() => handleNavClick(onNavigateLanding)}
          className="cursor-pointer"
        >
          <Logo size={36} />
        </div>

        {/* Desktop Navigation links */}
        <nav className="hidden lg:flex items-center space-x-6 xl:space-x-8 text-sm font-medium text-slate-600 dark:text-[#94A3B8]">
          <button 
            onClick={() => handleNavClick(onNavigateLanding)} 
            className={`hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${currentView === 'landing' ? 'text-slate-900 dark:text-white font-semibold' : ''}`}
          >
            Analyzer
          </button>
          
          <button
            onClick={() => handleNavClick(onNavigateGuides)}
            className={`flex items-center space-x-1.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${currentView === 'guides' ? 'text-[#2563EB] dark:text-[#60A5FA] font-semibold' : ''}`}
          >
            <BookOpen className="w-4 h-4 text-[#2563EB]" />
            <span>Career &amp; ATS Guides</span>
          </button>

          <a href="#how-it-works" onClick={() => currentView !== 'landing' && onNavigateLanding?.()} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            How It Works
          </a>

          <a href="#scoring" onClick={() => currentView !== 'landing' && onNavigateLanding?.()} className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Scoring Dimensions
          </a>

          <button
            onClick={() => handleNavClick(onNavigateAbout)}
            className={`flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${currentView === 'about-us' ? 'text-[#2563EB] dark:text-[#60A5FA] font-semibold' : ''}`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>About Us</span>
          </button>

          <button
            onClick={() => handleNavClick(onNavigateContact)}
            className={`flex items-center space-x-1 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer ${currentView === 'contact' ? 'text-[#2563EB] dark:text-[#60A5FA] font-semibold' : ''}`}
          >
            <Mail className="w-3.5 h-3.5" />
            <span>Contact</span>
          </button>

          <button 
            onClick={onOpenFeedback}
            className="flex items-center space-x-1.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#2563EB]" />
            <span>Review</span>
          </button>

          <button 
            onClick={onOpenPrivacy}
            className="flex items-center space-x-1.5 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
          >
            <ShieldCheck className="w-4 h-4 text-[#059669] dark:text-[#10B981]" />
            <span>Privacy</span>
          </button>
        </nav>

        {/* Action buttons & Theme toggle */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          
          {/* Light / Dark Mode Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#171717] dark:hover:bg-[#1f1f1f] border border-slate-300 dark:border-[#262626] rounded-xs transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Switch to Light Mode' : 'Switch to Dark Mode'}
            aria-label="Toggle theme"
          >
            {theme === 'dark' ? (
              <Sun className="w-4 h-4 text-[#F59E0B]" />
            ) : (
              <Moon className="w-4 h-4 text-slate-700" />
            )}
          </button>

          <button
            onClick={onTryDemo}
            className="hidden sm:flex items-center space-x-1.5 px-3 py-2 text-xs font-medium text-slate-800 dark:text-[#F8FAFC] bg-slate-100 hover:bg-slate-200 dark:bg-[#171717] dark:hover:bg-[#1f1f1f] border border-slate-300 dark:border-[#262626] rounded-xs transition-colors cursor-pointer"
          >
            <Play className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>Try Demo</span>
          </button>
          
          <button
            onClick={() => {
              if (currentView !== 'landing') {
                onNavigateLanding?.();
              }
              setTimeout(() => {
                const el = document.getElementById('analyze');
                el?.scrollIntoView({ behavior: 'smooth' });
              }, 100);
            }}
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xs transition-colors cursor-pointer"
          >
            <span>Analyze</span>
            <ArrowRight className="w-4 h-4" />
          </button>

          {/* Mobile hamburger button */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="p-2 lg:hidden text-slate-700 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white cursor-pointer"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-white dark:bg-[#0A0A0A] border-b border-slate-200 dark:border-[#262626] px-4 pt-2 pb-6 space-y-3 text-sm">
          <button
            onClick={() => handleNavClick(onNavigateLanding)}
            className="w-full text-left py-2 px-3 rounded-xs font-medium hover:bg-slate-100 dark:hover:bg-[#171717]"
          >
            Resume Analyzer
          </button>
          <button
            onClick={() => handleNavClick(onNavigateGuides)}
            className="w-full text-left py-2 px-3 rounded-xs font-medium text-[#2563EB] dark:text-[#60A5FA] hover:bg-slate-100 dark:hover:bg-[#171717] flex items-center space-x-2"
          >
            <BookOpen className="w-4 h-4" />
            <span>Career &amp; ATS Guides (Masterclasses)</span>
          </button>
          <button
            onClick={() => handleNavClick(onNavigateAbout)}
            className="w-full text-left py-2 px-3 rounded-xs font-medium hover:bg-slate-100 dark:hover:bg-[#171717] flex items-center space-x-2"
          >
            <Info className="w-4 h-4" />
            <span>About Us &amp; Methodology</span>
          </button>
          <button
            onClick={() => handleNavClick(onNavigateContact)}
            className="w-full text-left py-2 px-3 rounded-xs font-medium hover:bg-slate-100 dark:hover:bg-[#171717] flex items-center space-x-2"
          >
            <Mail className="w-4 h-4" />
            <span>Contact &amp; Inquiries</span>
          </button>
          <button
            onClick={() => handleNavClick(onOpenPrivacy)}
            className="w-full text-left py-2 px-3 rounded-xs font-medium hover:bg-slate-100 dark:hover:bg-[#171717] flex items-center space-x-2"
          >
            <ShieldCheck className="w-4 h-4 text-[#059669]" />
            <span>Privacy Policy &amp; Security</span>
          </button>
          <button
            onClick={() => handleNavClick(onOpenFeedback)}
            className="w-full text-left py-2 px-3 rounded-xs font-medium hover:bg-slate-100 dark:hover:bg-[#171717] flex items-center space-x-2"
          >
            <MessageSquarePlus className="w-4 h-4 text-[#2563EB]" />
            <span>Submit Review &amp; Feedback</span>
          </button>
        </div>
      )}
    </header>
  );
};
