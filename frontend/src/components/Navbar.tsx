import React from 'react';
import { ShieldCheck, Play, ArrowRight, Sun, Moon } from 'lucide-react';
import { Logo } from './Logo';

interface NavbarProps {
  onTryDemo: () => void;
  onNavigateLanding?: () => void;
  onOpenPrivacy?: () => void;
  currentView: 'landing' | 'upload' | 'dashboard';
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  onTryDemo,
  onNavigateLanding,
  onOpenPrivacy,
  currentView,
  theme,
  onToggleTheme
}) => {
  return (
    <header className="sticky top-0 z-50 w-full bg-white dark:bg-[#0A0D12] border-b border-slate-200 dark:border-[#273142] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Logo */}
        <div 
          onClick={onNavigateLanding}
          className="cursor-pointer"
        >
          <Logo size={36} />
        </div>

        {/* Navigation links */}
        <nav className="hidden md:flex items-center space-x-8 text-sm font-medium text-slate-600 dark:text-[#94A3B8]">
          <button 
            onClick={onNavigateLanding} 
            className={`hover:text-slate-900 dark:hover:text-white transition-colors ${currentView === 'landing' ? 'text-slate-900 dark:text-white font-semibold' : ''}`}
          >
            Product
          </button>
          <a href="#how-it-works" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            How It Works
          </a>
          <a href="#resume-guide" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Resume vs CV
          </a>
          <a href="#scoring" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            Scoring Dimensions
          </a>
          <a href="#about" className="hover:text-slate-900 dark:hover:text-white transition-colors">
            About &amp; Tech
          </a>
          <button 
            onClick={onOpenPrivacy}
            className="flex items-center space-x-1.5 hover:text-slate-900 dark:hover:text-white transition-colors"
          >
            <ShieldCheck className="w-4 h-4 text-[#059669] dark:text-[#10B981]" />
            <span>Privacy First</span>
          </button>
        </nav>

        {/* Action buttons & Theme toggle */}
        <div className="flex items-center space-x-2.5 sm:space-x-3">
          
          {/* Light / Dark Mode Switcher */}
          <button
            onClick={onToggleTheme}
            className="p-2 text-slate-600 hover:text-slate-900 dark:text-[#94A3B8] dark:hover:text-white bg-slate-100 hover:bg-slate-200 dark:bg-[#1A202C] dark:hover:bg-[#222938] border border-slate-300 dark:border-[#273142] rounded-xs transition-colors"
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
            className="flex items-center space-x-1.5 px-3 py-2 text-xs sm:text-sm font-medium text-slate-800 dark:text-[#F8FAFC] bg-slate-100 hover:bg-slate-200 dark:bg-[#1A202C] dark:hover:bg-[#222938] border border-slate-300 dark:border-[#273142] rounded-xs transition-colors"
          >
            <Play className="w-3.5 h-3.5 text-[#2563EB]" />
            <span className="hidden xs:inline">Try Demo</span>
          </button>
          
          <a
            href="#analyze"
            className="flex items-center space-x-1.5 px-3.5 py-2 text-xs sm:text-sm font-semibold text-white bg-[#2563EB] hover:bg-[#1D4ED8] rounded-xs transition-colors"
          >
            <span>Analyze</span>
            <ArrowRight className="w-4 h-4" />
          </a>
        </div>
      </div>
    </header>
  );
};
