import React from 'react';
import {
  LayoutDashboard,
  FileText,
  Layers,
  CheckSquare,
  Wrench,
  FolderGit2,
  FileSearch,
  Sparkles,
  ListOrdered,
  History,
  ArrowLeft
} from 'lucide-react';

interface DashboardSidebarProps {
  activeTab: string;
  onTabChange: (tab: string) => void;
  onNewAnalysis: () => void;
  onAutoUpdate?: () => void;
  overallScore: number;
  tier: string;
}

export const DashboardSidebar: React.FC<DashboardSidebarProps> = ({
  activeTab,
  onTabChange,
  onNewAnalysis,
  onAutoUpdate,
  overallScore,
  tier
}) => {
  const navItems = [
    { id: 'overview', label: 'Score & Overview', icon: LayoutDashboard },
    { id: 'scoring', label: '6-Axis Dimensions', icon: Layers },
    { id: 'requirements', label: 'Requirement Match', icon: CheckSquare },
    { id: 'skills', label: 'Skills Matrix', icon: Wrench },
    { id: 'experience', label: 'Experience Bullets', icon: FileText },
    { id: 'projects', label: 'Projects Audit', icon: FolderGit2 },
    { id: 'ats-format', label: 'ATS Parseability', icon: FileSearch },
    { id: 'improvements', label: 'Grounded Revisions', icon: Sparkles },
    { id: 'recommendations', label: 'Action Roadmap', icon: ListOrdered },
    { id: 'history', label: 'Job Match History', icon: History }
  ];

  const scoreColor = overallScore >= 80 ? '#059669' : overallScore >= 60 ? '#D97706' : '#DC2626';

  return (
    <aside className="w-full lg:w-64 bg-white dark:bg-[#0A0D12] border-b lg:border-b-0 lg:border-r border-slate-200 dark:border-[#273142] p-4 flex flex-col justify-between flex-shrink-0 transition-colors">
      
      <div>
        {/* New Analysis Back button */}
        <button
          onClick={onNewAnalysis}
          className="w-full flex items-center justify-center space-x-2 px-3 py-2 text-xs font-semibold text-slate-800 dark:text-[#F8FAFC] bg-slate-100 hover:bg-slate-200 dark:bg-[#12161F] dark:hover:bg-[#1A202C] border border-slate-300 dark:border-[#273142] rounded-xs transition-colors mb-6"
        >
          <ArrowLeft className="w-3.5 h-3.5 text-[#2563EB]" />
          <span>New Analysis</span>
        </button>

        {/* Mini Score Capsule */}
        <div className="bg-slate-50 dark:bg-[#12161F] border border-slate-300 dark:border-[#273142] p-3 mb-6 flex items-center space-x-3">
          <div
            className="w-10 h-10 flex flex-col items-center justify-center font-mono font-bold text-slate-900 dark:text-white border rounded-xs bg-white dark:bg-[#0A0D12]"
            style={{ borderColor: scoreColor }}
          >
            <span className="text-sm">{overallScore}</span>
            <span className="text-[7px] text-slate-500 dark:text-[#94A3B8]">ATS</span>
          </div>
          <div className="overflow-hidden">
            <span className="text-[10px] font-mono text-slate-500 dark:text-[#94A3B8] uppercase block">SCORE TIER</span>
            <span className="text-xs font-bold font-mono truncate block" style={{ color: scoreColor }}>
              {tier}
            </span>
          </div>
        </div>

        {/* 1-Click Auto-Update Resume Button */}
        {onAutoUpdate && (
          <button
            onClick={onAutoUpdate}
            className="w-full flex items-center justify-center space-x-2 px-3.5 py-2.5 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white font-bold text-xs rounded-xs shadow-md transition-all mb-4 group cursor-pointer"
          >
            <Sparkles className="w-4 h-4 text-yellow-300 animate-pulse flex-shrink-0" />
            <span className="tracking-tight">Auto-Update Resume</span>
          </button>
        )}

        {/* Nav List - Horizontal on mobile, vertical on desktop */}
        <nav className="flex lg:flex-col overflow-x-auto lg:overflow-x-visible pb-2 lg:pb-0 gap-1 lg:space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => onTabChange(item.id)}
                className={`flex-shrink-0 lg:flex-shrink flex items-center space-x-2.5 px-3 py-2 text-xs font-medium rounded-xs transition-colors text-left whitespace-nowrap ${
                  isActive
                    ? 'bg-[#2563EB] text-white'
                    : 'text-slate-600 dark:text-[#94A3B8] hover:bg-slate-100 dark:hover:bg-[#12161F] hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-4 h-4 flex-shrink-0" />
                <span className="truncate">{item.label}</span>
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info in Sidebar */}
      <div className="hidden lg:block pt-6 border-t border-slate-200 dark:border-[#273142] text-[11px] font-mono text-slate-500 dark:text-[#64748B] space-y-1">
        <div>ENGINE: DETERMINISTIC + NLP</div>
        <div>DATA PRIVACY: EPHEMERAL</div>
      </div>

    </aside>
  );
};
