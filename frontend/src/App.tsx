import React, { useState, useEffect } from 'react';
import confetti from 'canvas-confetti';
import { AnalysisReport, JobMatchRecord } from './types';
import { Navbar } from './components/Navbar';
import { Hero } from './components/Hero';
import { UploadZone } from './components/UploadZone';
import { JobDescriptionInput } from './components/JobDescriptionInput';
import { AnalysisProgress } from './components/AnalysisProgress';
import { ScoreCard } from './components/ScoreCard';
import { ScoreBreakdown } from './components/ScoreBreakdown';
import { RequirementMatch } from './components/RequirementMatch';
import { SkillsAnalysis } from './components/SkillsAnalysis';
import { ExperienceAnalysis } from './components/ExperienceAnalysis';
import { ProjectAnalysis } from './components/ProjectAnalysis';
import { ATSFormatAnalysis } from './components/ATSFormatAnalysis';
import { RecommendationCard } from './components/RecommendationCard';
import { ResumeImprovement } from './components/ResumeImprovement';
import { JobMatchHistory } from './components/JobMatchHistory';
import { DashboardSidebar } from './components/DashboardSidebar';
import { PrivacyModal } from './components/PrivacyModal';
import { ResumeKnowledgeBase } from './components/ResumeKnowledgeBase';
import { Footer } from './components/Footer';
import TextLoop from './components/TextLoop';
import ScrollVelocity from './components/ScrollVelocity';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play
} from 'lucide-react';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

export function App() {
  // Theme state: defaults to light mode
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    const saved = localStorage.getItem('resumeiq_theme');
    return saved === 'dark' ? 'dark' : 'light';
  });

  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    localStorage.setItem('resumeiq_theme', theme);
  }, [theme]);

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'light' ? 'dark' : 'light'));
  };

  // Navigation & View states
  const [view, setView] = useState<'landing' | 'upload' | 'dashboard'>('landing');
  const [activeTab, setActiveTab] = useState<string>('overview');
  const [isPrivacyOpen, setIsPrivacyOpen] = useState(false);

  // Form Inputs
  const [file, setFile] = useState<File | null>(null);
  const [resumeText, setResumeText] = useState<string>('');
  const [jobDescription, setJobDescription] = useState<string>('');
  const [jobTitle, setJobTitle] = useState<string>('');
  const [profileMode, setProfileMode] = useState<string>('auto');

  // Loading & Reports
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisError, setAnalysisError] = useState<string | null>(null);
  const [report, setReport] = useState<AnalysisReport | null>(null);

  // Multi-job analysis history
  const [history, setHistory] = useState<JobMatchRecord[]>([]);
  const [activeHistoryId, setActiveHistoryId] = useState<string | null>(null);

  // Sample data presets
  const [presets, setPresets] = useState<Record<string, string>>({});
  const [sampleResume, setSampleResume] = useState<string>('');

  // Fetch presets on load
  useEffect(() => {
    fetch(`${API_BASE_URL}/api/sample-data`)
      .then((res) => res.json())
      .then((data) => {
        if (data.sample_jobs) setPresets(data.sample_jobs);
        if (data.sample_resume) setSampleResume(data.sample_resume);
      })
      .catch((err) => {
        console.warn('Backend not yet reachable on mount, sample data ready as fallback.', err);
      });
  }, []);

  const handleLoadPreset = (key: string) => {
    if (presets[key]) {
      setJobDescription(presets[key]);
      const titleMatch = presets[key].split('\n')[0];
      setJobTitle(titleMatch);
    }
  };

  const handleTryDemo = async () => {
    setIsAnalyzing(true);
    setAnalysisError(null);
    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze-demo?preset=ml_engineer`, {
        method: 'POST'
      });
      if (!res.ok) {
        throw new Error(`Demo failed: ${res.statusText}`);
      }
      const data: AnalysisReport = await res.json();
      
      const recordId = `hist_${Date.now()}`;
      const record: JobMatchRecord = {
        id: recordId,
        jobTitle: data.job_title || 'Machine Learning Engineer',
        score: data.overall_score,
        tier: data.tier,
        date: new Date().toLocaleDateString(),
        report: data
      };

      setReport(data);
      setResumeText(sampleResume);
      setJobDescription(presets['ml_engineer'] || '');
      setJobTitle(data.job_title || 'Machine Learning Engineer');
      setHistory([record]);
      setActiveHistoryId(recordId);
      setView('dashboard');
      setActiveTab('overview');

      if (data.overall_score >= 80) {
        confetti({ particleCount: 70, spread: 60, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'Failed to initialize demo report.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleAnalyze = async () => {
    if (!file && !resumeText.trim()) {
      setAnalysisError('Please upload a PDF/DOCX resume file or paste resume text.');
      return;
    }
    if (!jobDescription.trim()) {
      setAnalysisError('Please provide a job description to evaluate against.');
      return;
    }

    setIsAnalyzing(true);
    setAnalysisError(null);

    const formData = new FormData();
    if (file) {
      formData.append('resume_file', file);
    } else {
      formData.append('resume_text', resumeText);
    }
    formData.append('job_description', jobDescription);
    formData.append('profile_mode', profileMode);
    if (jobTitle.trim()) {
      formData.append('job_title', jobTitle.trim());
    }

    try {
      const res = await fetch(`${API_BASE_URL}/api/analyze`, {
        method: 'POST',
        body: formData
      });

      if (!res.ok) {
        const errorData = await res.json().catch(() => ({}));
        throw new Error(errorData.detail || `Server returned status ${res.status}`);
      }

      const data: AnalysisReport = await res.json();
      const recordId = `hist_${Date.now()}`;
      const record: JobMatchRecord = {
        id: recordId,
        jobTitle: data.job_title || jobTitle || 'Target Role',
        score: data.overall_score,
        tier: data.tier,
        date: new Date().toLocaleDateString(),
        report: data
      };

      setReport(data);
      setHistory((prev) => [record, ...prev]);
      setActiveHistoryId(recordId);
      setView('dashboard');
      setActiveTab('overview');

      if (data.overall_score >= 80) {
        confetti({ particleCount: 80, spread: 70, origin: { y: 0.6 } });
      }
    } catch (err: any) {
      console.error(err);
      setAnalysisError(err.message || 'An error occurred during resume analysis.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleSelectHistoryRecord = (record: JobMatchRecord) => {
    setReport(record.report);
    setActiveHistoryId(record.id);
    setActiveTab('overview');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#0A0D12] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-200">
      
      {/* Global Navbar with Theme Switcher */}
      <Navbar
        onTryDemo={handleTryDemo}
        onNavigateLanding={() => setView('landing')}
        onOpenPrivacy={() => setIsPrivacyOpen(true)}
        currentView={view}
        theme={theme}
        onToggleTheme={handleToggleTheme}
      />

      {/* Main Content Area */}
      <main className="flex-1">
        
        {/* VIEW 1: LANDING PAGE */}
        {view === 'landing' && (
          <div>
            <Hero
              onTryDemo={handleTryDemo}
              onScrollToUpload={() => {
                const el = document.getElementById('analyze');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
              theme={theme}
            />

            {/* University Trust & Velocity Marquee Section */}
            <section className="py-12 border-b border-slate-200 dark:border-[#273142] bg-white dark:bg-[#0E121A] transition-colors overflow-hidden">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
                <h3 className="text-xl sm:text-2xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                  Trusted by 150+ Students Across Leading Universities
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 dark:text-[#94A3B8] max-w-xl mx-auto mt-1">
                  Engineered for high-stakes campus placement drives, off-campus referrals, and competitive ATS screening.
                </p>
              </div>

              <div className="py-2">
                <ScrollVelocity
                  texts={[
                    'SRM UNIVERSITY ✦ VIT-AP UNIVERSITY ✦ LOVELY PROFESSIONAL UNIVERSITY (LPU) ✦ 150+ CANDIDATES PLACED ✦',
                    'SRM INSTITUTE ✦ VIT AP TECH ✦ LPU CAMPUS ✦ 94.8% INTERVIEW SHORTLIST ✦ ATS CERTIFIED ✦'
                  ]}
                  velocity={45}
                  className="font-display font-black uppercase text-xl sm:text-3xl md:text-4xl text-slate-700 dark:text-slate-300 tracking-wider py-1.5 opacity-90 hover:opacity-100 transition-opacity"
                />
              </div>

              <div className="max-w-4xl mx-auto mt-6 px-4 flex flex-wrap items-center justify-center gap-6 sm:gap-10 text-xs font-mono font-bold text-slate-500 dark:text-slate-400">
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB]" />
                  <span>SRM University</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#10B981]" />
                  <span>VIT-AP University</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#F59E0B]" />
                  <span>LPU (Lovely Professional University)</span>
                </span>
                <span className="flex items-center space-x-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-[#8B5CF6]" />
                  <span>150+ Placed Students</span>
                </span>
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 md:py-24 border-b border-slate-200 dark:border-[#273142] bg-[#F8FAFC] dark:bg-[#0A0D12] transition-colors">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="pb-12 text-left">
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                    How GetPlacedResume Evaluates Compatibility
                  </h2>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
                  {[
                    {
                      step: "01",
                      title: "Upload & Structure Extraction",
                      desc: "Deterministic parsers extract text coordinates, check table structures, multi-column flows, and detect typography anomalies."
                    },
                    {
                      step: "02",
                      title: "Semantic Vector Alignment",
                      desc: "Job specifications and resume experiences are mapped to semantic vector spaces, recognizing competencies beyond exact word matches."
                    },
                    {
                      step: "03",
                      title: "Explainable 6-Axis Scoring",
                      desc: "Generates an evidence-backed ATS compatibility score with line-by-line grounded recommendations and bullet point upgrades."
                    }
                  ].map((s, idx) => (
                    <div key={idx} className="bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#273142] p-6 relative shadow-sm dark:shadow-none transition-colors">
                      <span className="text-4xl font-bold text-slate-300 dark:text-[#273142] block mb-4 font-sans">
                        {s.step}
                      </span>
                      <h3 className="text-base font-bold text-slate-900 dark:text-white mb-2 font-sans">{s.title}</h3>
                      <p className="text-xs text-slate-600 dark:text-[#94A3B8] leading-relaxed font-sans">{s.desc}</p>
                    </div>
                  ))}
                </div>

              </div>
            </section>

            {/* Upload & Form Section directly accessible on Landing */}
            <section id="analyze" className="py-16 md:py-24 border-b border-slate-200 dark:border-[#273142] bg-[#F8FAFC] dark:bg-[#0A0D12] transition-colors">
              <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                
                <div className="pb-10">
                  <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                    Submit Resume and Job Specifications
                  </h2>
                  <p className="text-xs text-slate-600 dark:text-[#94A3B8] mt-1">
                    Upload your resume file or paste text alongside target job specifications to initiate analysis.
                  </p>
                </div>

                {/* Progress Animation during analysis */}
                {isAnalyzing ? (
                  <AnalysisProgress />
                ) : (
                  <div className="space-y-8">
                    
                    {/* Error Banner */}
                    {analysisError && (
                      <div className="bg-red-50 dark:bg-[#450A0A] border border-[#DC2626] dark:border-[#EF4444] p-4 text-xs text-[#DC2626] dark:text-white flex items-center space-x-3">
                        <AlertCircle className="w-5 h-5 text-[#DC2626] dark:text-[#EF4444] flex-shrink-0" />
                        <span>{analysisError}</span>
                      </div>
                    )}

                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                      {/* Upload Zone */}
                      <UploadZone
                        file={file}
                        onFileSelect={setFile}
                        rawText={resumeText}
                        onRawTextChange={setResumeText}
                        profileMode={profileMode}
                        onProfileModeChange={setProfileMode}
                      />

                      {/* Job Description Input */}
                      <JobDescriptionInput
                        jobDescription={jobDescription}
                        onJobDescriptionChange={setJobDescription}
                        jobTitle={jobTitle}
                        onJobTitleChange={setJobTitle}
                        onLoadPreset={handleLoadPreset}
                        presets={presets}
                      />
                    </div>

                    {/* Submit Action Bar */}
                    <div className="pt-4 flex flex-col sm:flex-row items-center justify-between gap-4 bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#273142] p-5 shadow-sm dark:shadow-none transition-colors">
                      <div className="text-xs text-slate-600 dark:text-[#94A3B8]">
                        <span className="font-mono text-slate-900 dark:text-white block">INPUT STATUS:</span>
                        <span>{file ? `1 File (${file.name})` : resumeText ? `${resumeText.length} chars` : 'No resume loaded'} | {jobDescription ? `${jobDescription.split(/\s+/).filter(Boolean).length} JD words` : 'No JD loaded'}</span>
                      </div>

                      <div className="flex items-center space-x-3 w-full sm:w-auto">
                        <button
                          onClick={handleTryDemo}
                          className="flex-1 sm:flex-initial px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#0A0D12] dark:hover:bg-[#1A202C] text-slate-800 dark:text-[#F8FAFC] border border-slate-300 dark:border-[#273142] text-xs font-semibold rounded-xs transition-colors flex items-center justify-center space-x-2"
                        >
                          <Play className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Load Sample Demo</span>
                        </button>

                        <button
                          onClick={handleAnalyze}
                          disabled={isAnalyzing}
                          className="flex-1 sm:flex-initial px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xs transition-colors flex items-center justify-center space-x-2"
                        >
                          <span>Analyze Resume</span>
                          <ArrowRight className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </section>

            {/* Resume vs CV Guide, ATS Anatomy, Common Pitfalls & FAQ */}
            <ResumeKnowledgeBase
              onScrollToWorkbench={() => {
                const el = document.getElementById('analyze');
                el?.scrollIntoView({ behavior: 'smooth' });
              }}
            />

          </div>
        )}

        {/* VIEW 2: DASHBOARD VIEW */}
        {view === 'dashboard' && report && (
          <div className="flex flex-col lg:flex-row min-h-[calc(100vh-65px)]">
            
            {/* Sidebar Navigation */}
            <DashboardSidebar
              activeTab={activeTab}
              onTabChange={setActiveTab}
              onNewAnalysis={() => setView('landing')}
              overallScore={report.overall_score}
              tier={report.tier}
            />

            {/* Dashboard Content Panes */}
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8 bg-[#F8FAFC] dark:bg-[#0A0D12] transition-colors">
              
              {/* TAB 1: OVERVIEW */}
              {activeTab === 'overview' && (
                <div className="space-y-8">
                  {/* Primary Score Card */}
                  <ScoreCard
                    score={report.overall_score}
                    tier={report.tier}
                    profileType={report.candidate_profile_type}
                    processedAt={report.processed_at}
                    jobTitle={report.job_title}
                  />

                  {/* Executive Summary & Findings */}
                  <div className="bg-white dark:bg-[#12161F] border border-slate-200 dark:border-[#273142] p-6 rounded-xs transition-colors shadow-sm dark:shadow-none">
                    <div className="pb-4 border-b border-slate-200 dark:border-[#273142]">
                      <h3 className="text-base font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                        <span className="w-2 h-2 bg-[#2563EB] inline-block" />
                        <span>EXECUTIVE AUDIT SUMMARY</span>
                      </h3>
                    </div>
                    
                    <ul className="mt-4 space-y-2 text-xs text-slate-700 dark:text-[#CBD5E1]">
                      {report.executive_summary.map((item, idx) => (
                        <li key={idx} className="flex items-start space-x-2.5">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] mt-1.5 flex-shrink-0" />
                          <span className="leading-relaxed">{item}</span>
                        </li>
                      ))}
                    </ul>

                    {/* Strengths & Weaknesses Grid */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-[#273142]">
                      <div className="bg-emerald-50/60 dark:bg-[#0A0D12] border border-[#059669] dark:border-[#10B981] p-4">
                        <span className="text-[10px] font-mono text-[#059669] dark:text-[#10B981] uppercase font-bold block mb-2">
                          PRIMARY STRENGTHS:
                        </span>
                        <ul className="space-y-2 text-xs text-slate-900 dark:text-white">
                          {report.strengths.map((str, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <CheckCircle2 className="w-3.5 h-3.5 text-[#059669] dark:text-[#10B981] flex-shrink-0 mt-0.5" />
                              <span>{str}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      <div className="bg-red-50/60 dark:bg-[#0A0D12] border border-[#DC2626] dark:border-[#EF4444] p-4">
                        <span className="text-[10px] font-mono text-[#DC2626] dark:text-[#EF4444] uppercase font-bold block mb-2">
                          IDENTIFIED VULNERABILITIES:
                        </span>
                        <ul className="space-y-2 text-xs text-slate-900 dark:text-white">
                          {report.weaknesses.map((w, idx) => (
                            <li key={idx} className="flex items-start space-x-2">
                              <AlertCircle className="w-3.5 h-3.5 text-[#DC2626] dark:text-[#EF4444] flex-shrink-0 mt-0.5" />
                              <span>{w}</span>
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>
                  </div>

                  {/* Dimension Breakdown summary */}
                  <ScoreBreakdown breakdown={report.score_breakdown} />
                </div>
              )}

              {/* TAB 2: SCORING */}
              {activeTab === 'scoring' && (
                <ScoreBreakdown breakdown={report.score_breakdown} />
              )}

              {/* TAB 3: REQUIREMENTS */}
              {activeTab === 'requirements' && (
                <RequirementMatch matches={report.requirement_matches} />
              )}

              {/* TAB 4: SKILLS */}
              {activeTab === 'skills' && (
                <SkillsAnalysis skills={report.skills_analysis} />
              )}

              {/* TAB 5: EXPERIENCE */}
              {activeTab === 'experience' && (
                <ExperienceAnalysis
                  bullets={report.bullet_analyses}
                  profileType={report.candidate_profile_type}
                  summary={report.experience_summary}
                />
              )}

              {/* TAB 6: PROJECTS */}
              {activeTab === 'projects' && (
                <ProjectAnalysis projects={report.project_analyses} />
              )}

              {/* TAB 7: ATS FORMAT */}
              {activeTab === 'ats-format' && (
                <ATSFormatAnalysis report={report.ats_format_report} />
              )}

              {/* TAB 8: IMPROVEMENTS ("Fix My Resume") */}
              {activeTab === 'improvements' && (
                <ResumeImprovement
                  suggestions={report.improvement_suggestions}
                  baseScore={report.overall_score}
                />
              )}

              {/* TAB 9: RECOMMENDATIONS */}
              {activeTab === 'recommendations' && (
                <RecommendationCard recommendations={report.recommendations} />
              )}

              {/* TAB 10: HISTORY */}
              {activeTab === 'history' && (
                <JobMatchHistory
                  history={history}
                  activeId={activeHistoryId}
                  onSelectRecord={handleSelectHistoryRecord}
                  onCompareWithNewJD={() => setView('landing')}
                />
              )}

            </div>

          </div>
        )}

      </main>

      {/* Dynamic Ribbon Text Loop at Bottom of Site */}
      <section className="relative w-full overflow-hidden border-t border-b border-slate-200 dark:border-[#273142] bg-[#F8FAFC] dark:bg-[#0A0D12] py-1 transition-colors">
        <div className="w-full max-h-[120px] sm:max-h-[140px] flex items-center justify-center">
          <TextLoop
            text="GetPlacedResume ✦ ATS Intelligence ✦ Career Fit ✦ Verified Analysis"
            shape="wave"
            speed={75}
            direction="forward"
            separator="✦"
            curviness={22}
            fontSize={20}
            fontWeight={800}
            letterSpacing={2}
            uppercase
            color="#ffffff"
            ribbon
            ribbonColor="#5227FF"
            ribbonWidth={48}
            viewBoxWidth={1400}
            viewBoxHeight={120}
            pauseOnHover
            className="w-full h-auto max-h-[120px] sm:max-h-[140px]"
          />
        </div>
      </section>

      {/* Global Footer */}
      <Footer onOpenPrivacy={() => setIsPrivacyOpen(true)} />

      {/* Privacy Guarantee Modal */}
      <PrivacyModal
        isOpen={isPrivacyOpen}
        onClose={() => setIsPrivacyOpen(false)}
      />

    </div>
  );
}
export default App;
