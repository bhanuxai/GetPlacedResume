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
import { RecruiterPerspective } from './components/RecruiterPerspective';
import { Footer } from './components/Footer';
import TextLoop from './components/TextLoop';
import ScrollVelocity from './components/ScrollVelocity';
import CursorGrid from './components/CursorGrid';
import GlareHover from './components/GlareHover';
import CountUp from './components/CountUp';
import { AboutSection } from './components/AboutSection';
import {
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  Play,
  Sparkles,
  Eye,
  Scale
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
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#000000] text-[#0F172A] dark:text-[#F8FAFC] flex flex-col font-sans transition-colors duration-200 relative selection:bg-blue-500 selection:text-white">
      
      {/* Background Interactive CursorGrid */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden opacity-30 dark:opacity-40">
        <CursorGrid
          cellSize={70}
          color="#D946EF"
          radius={140}
          falloff="smooth"
          holdTime={400}
          fadeDuration={800}
          lineWidth={1.2}
          maxOpacity={1}
          fillOpacity={0}
          gridOpacity={0}
          cellRadius={0}
          clickPulse
          pulseSpeed={600}
        />
      </div>

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
      <main className="flex-1 relative z-10">
        
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
            <section className="py-12 border-b border-slate-200 dark:border-[#262626] bg-white dark:bg-[#050505] transition-colors overflow-hidden">
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

              {/* Real-time CountUp Performance Metrics */}
              <div className="max-w-5xl mx-auto px-4 mt-8 grid grid-cols-2 sm:grid-cols-4 gap-4">
                <div className="p-4 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs text-center shadow-xs">
                  <div className="text-2xl sm:text-3xl font-black font-display text-blue-600 dark:text-blue-400">
                    <CountUp from={0} to={15420} separator="," direction="up" duration={2} className="count-up-text" />+
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                    Resumes Scanned
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs text-center shadow-xs">
                  <div className="text-2xl sm:text-3xl font-black font-display text-emerald-600 dark:text-emerald-400">
                    <CountUp from={0} to={94} separator="" direction="up" duration={1.5} className="count-up-text" />.8%
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                    Interview Shortlist Rate
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs text-center shadow-xs">
                  <div className="text-2xl sm:text-3xl font-black font-display text-amber-600 dark:text-amber-400">
                    <CountUp from={0} to={150} separator="," direction="up" duration={1.8} className="count-up-text" />+
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                    Students Placed
                  </div>
                </div>
                <div className="p-4 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs text-center shadow-xs">
                  <div className="text-2xl sm:text-3xl font-black font-display text-purple-600 dark:text-purple-400">
                    <CountUp from={0} to={6} separator="" direction="up" duration={1} className="count-up-text" />
                  </div>
                  <div className="text-[11px] font-mono text-slate-500 dark:text-slate-400 mt-1 uppercase tracking-wider">
                    ATS Scoring Axes
                  </div>
                </div>
              </div>
            </section>

            {/* How It Works Section */}
            <section id="how-it-works" className="py-16 md:py-24 border-b border-slate-200 dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#000000] transition-colors">
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
                    <div key={idx} className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 relative shadow-sm dark:shadow-none transition-colors">
                      <span className="text-4xl font-bold text-slate-300 dark:text-[#262626] block mb-4 font-sans">
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
            <section id="analyze" className="py-16 md:py-24 border-b border-slate-200 dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#000000] transition-colors">
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
                    {/* Submit Action Bar */}
                    <div className="pt-4 flex flex-col space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-5 shadow-sm dark:shadow-none transition-colors">
                      {analysisError && (
                        <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-800/60 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs text-red-700 dark:text-red-300">
                          <div className="flex items-center space-x-2">
                            <AlertCircle className="w-4 h-4 text-red-600 dark:text-red-400 flex-shrink-0" />
                            <span>{analysisError}</span>
                          </div>
                          <button
                            onClick={handleTryDemo}
                            className="text-xs font-bold text-[#2563EB] dark:text-blue-400 hover:underline flex items-center space-x-1 cursor-pointer self-start sm:self-auto"
                          >
                            <Play className="w-3.5 h-3.5" />
                            <span>Load sample resume &amp; job description</span>
                          </button>
                        </div>
                      )}

                      <div className="flex flex-col sm:flex-row items-center justify-between gap-4">
                        <div className="text-xs text-slate-600 dark:text-[#94A3B8]">
                          <span className="font-mono text-slate-900 dark:text-white block">INPUT STATUS:</span>
                          <span>{file ? `1 File (${file.name})` : resumeText ? `${resumeText.length} chars` : 'No resume loaded'} | {jobDescription ? `${jobDescription.split(/\s+/).filter(Boolean).length} JD words` : 'No JD loaded'}</span>
                        </div>

                        <div className="flex items-center space-x-3 w-full sm:w-auto">
                          <button
                            onClick={handleTryDemo}
                            className="flex-1 sm:flex-initial px-4 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-[#000000] dark:hover:bg-[#171717] text-slate-800 dark:text-[#F8FAFC] border border-slate-300 dark:border-[#262626] text-xs font-semibold rounded-xs transition-colors flex items-center justify-center space-x-2 cursor-pointer"
                          >
                            <Play className="w-3.5 h-3.5 text-[#2563EB]" />
                            <span>Load Sample Demo</span>
                          </button>

                          <GlareHover
                            as="button"
                            onClick={handleAnalyze}
                            disabled={isAnalyzing}
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
                            className="flex-1 sm:flex-initial px-6 py-3 text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer hover:bg-[#1D4ED8]"
                          >
                            <div className="flex items-center justify-center space-x-2">
                              <span>Analyze Resume</span>
                              <ArrowRight className="w-4 h-4" />
                            </div>
                          </GlareHover>
                        </div>
                      </div>
                    </div>

                  </div>
                )}

              </div>
            </section>

            {/* About & Technology Stack Section with LogoLoop */}
            <AboutSection theme={theme} />

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
            <div className="flex-1 p-4 sm:p-6 lg:p-8 overflow-y-auto space-y-8 bg-[#F8FAFC] dark:bg-[#000000] transition-colors">
              
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
                  <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs transition-colors shadow-sm dark:shadow-none">
                    <div className="pb-4 border-b border-slate-200 dark:border-[#262626]">
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
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6 pt-6 border-t border-slate-200 dark:border-[#262626]">
                      <div className="bg-emerald-50/60 dark:bg-[#000000] border border-[#059669] dark:border-[#10B981] p-4">
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

                      <div className="bg-red-50/60 dark:bg-[#000000] border border-[#DC2626] dark:border-[#EF4444] p-4">
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

                  {/* Recruiter Review & Platform Difference Overview Banner */}
                  <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs transition-colors shadow-sm dark:shadow-none space-y-6">
                    <div className="pb-4 border-b border-slate-200 dark:border-[#262626] flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div>
                        <div className="inline-flex items-center space-x-2 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-mono text-[11px] font-bold mb-1.5 uppercase tracking-wider">
                          <Eye className="w-3.5 h-3.5" />
                          <span>Recruiter Perspective &amp; ATS Difference</span>
                        </div>
                        <h3 className="text-base sm:text-lg font-bold text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
                          <span>How Recruiters Review Your Resume &amp; Why GetPlaced ATS Differs</span>
                        </h3>
                      </div>
                      <button
                        onClick={() => setActiveTab('recruiter-lens')}
                        className="self-start sm:self-auto px-3.5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs"
                      >
                        <span>Open Full Deep-Dive</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>

                    {/* 2-Column Split: Recruiter Scan Lens vs Why We Differ */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                      {/* Left: How a Recruiter Sees The Resume */}
                      <div className="p-5 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white flex items-center space-x-2">
                            <Eye className="w-4 h-4 text-[#2563EB]" />
                            <span>The 6–8 Second Recruiter Reality</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-amber-100 dark:bg-amber-950/60 text-amber-800 dark:text-amber-400 font-bold rounded-xs">
                            EYE PATH SCAN
                          </span>
                        </div>

                        <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                          Recruiters spend only <strong>6 to 8 seconds</strong> on an initial scan. They don&apos;t read full paragraphs—they follow an &quot;F-Pattern&quot; looking for title relevance, core stack keywords, and metrics.
                        </p>

                        <div className="space-y-2.5 pt-1">
                          <div className="flex items-start space-x-2.5 text-xs">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-blue-100 dark:bg-blue-900/60 text-blue-700 dark:text-blue-300 font-bold rounded-xs flex-shrink-0">
                              0-2s
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">Title &amp; Header Alignment:</span>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">Target role match: {report.job_title || 'Identified in JD'}</p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2.5 text-xs">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-indigo-100 dark:bg-indigo-900/60 text-indigo-700 dark:text-indigo-300 font-bold rounded-xs flex-shrink-0">
                              2-4s
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">Skills Matrix Triage:</span>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {report.skills_analysis?.strongly_demonstrated?.length || 0} demonstrated skills found against target role.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2.5 text-xs">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-purple-100 dark:bg-purple-900/60 text-purple-700 dark:text-purple-300 font-bold rounded-xs flex-shrink-0">
                              4-6s
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">Quantifiable Proof &amp; Verbs:</span>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                {report.bullet_analyses?.filter((b) => b.is_quantified).length || 0} of {report.bullet_analyses?.length || 0} bullets have measurable metrics.
                              </p>
                            </div>
                          </div>

                          <div className="flex items-start space-x-2.5 text-xs">
                            <span className="font-mono text-[10px] px-1.5 py-0.5 bg-emerald-100 dark:bg-emerald-900/60 text-emerald-700 dark:text-emerald-300 font-bold rounded-xs flex-shrink-0">
                              6-8s
                            </span>
                            <div>
                              <span className="font-bold text-slate-900 dark:text-white">Triage Decision:</span>
                              <p className="text-[11px] text-slate-500 dark:text-slate-400">
                                Reading order risk: {report.ats_format_report?.broken_reading_order_risk || 'LOW'}. Overall ATS fit: {report.overall_score}/100.
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Right: How GetPlaced Differs from other ATS sites */}
                      <div className="p-5 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs space-y-4">
                        <div className="flex items-center justify-between">
                          <span className="text-xs font-mono font-bold uppercase text-slate-900 dark:text-white flex items-center space-x-2">
                            <Scale className="w-4 h-4 text-indigo-600 dark:text-indigo-400" />
                            <span>Other ATS Sites vs. GetPlacedResume</span>
                          </span>
                          <span className="text-[10px] font-mono px-2 py-0.5 bg-blue-100 dark:bg-blue-950/60 text-blue-800 dark:text-blue-300 font-bold rounded-xs">
                            ENGINE CONTRAST
                          </span>
                        </div>

                        <div className="space-y-3 pt-1 text-xs">
                          <div className="p-2.5 rounded-xs bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900 dark:text-white">1. Semantic Vector NLP vs Exact Keyword Counting</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                              <span className="text-red-500 font-semibold">Other ATS sites:</span> Demand exact repetitive keywords (penalizing natural writing).<br />
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">GetPlacedResume:</span> Uses cosine vector similarity to understand synonyms, frameworks, and equivalents.
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xs bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900 dark:text-white">2. Anti-Stuffing Guardrails vs Keyword Stuffing Pressure</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                              <span className="text-red-500 font-semibold">Other ATS sites:</span> Urge you to force keywords 5–10 times (causing human recruiters to reject you).<br />
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">GetPlacedResume:</span> Requires skills to appear inside real project &amp; experience achievement bullets.
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xs bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900 dark:text-white">3. Deterministic 6-Axis Scoring vs Black-Box Scores</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                              <span className="text-red-500 font-semibold">Other ATS sites:</span> Show a single arbitrary vanity percentage.<br />
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">GetPlacedResume:</span> Transparent mathematical weights across Relevance, Skills, Experience, Layout, Content &amp; Presentation.
                            </p>
                          </div>

                          <div className="p-2.5 rounded-xs bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626]">
                            <div className="flex items-center justify-between mb-1">
                              <span className="font-bold text-slate-900 dark:text-white">4. PDF Geometry Parsing vs Flat Regex Scrapers</span>
                            </div>
                            <p className="text-[11px] text-slate-600 dark:text-slate-400 leading-relaxed">
                              <span className="text-red-500 font-semibold">Other ATS sites:</span> Blind to multi-column bleed and table traps.<br />
                              <span className="text-emerald-600 dark:text-emerald-400 font-semibold">GetPlacedResume:</span> Uses <code className="font-mono text-[10px]">pdfplumber</code> bounding boxes to verify real ATS reading order.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Action strip */}
                    <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                      <div className="text-xs text-slate-500 dark:text-[#94A3B8]">
                        Want to view the complete side-by-side comparison table and recruiter triage guide?
                      </div>
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => setActiveTab('recruiter-lens')}
                          className="px-3.5 py-1.5 bg-slate-100 hover:bg-slate-200 dark:bg-[#000000] dark:hover:bg-[#171717] text-slate-800 dark:text-slate-200 border border-slate-300 dark:border-[#262626] font-semibold text-xs rounded-xs transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
                          <span>Recruiter Lens Tab</span>
                        </button>
                        <button
                          onClick={() => setActiveTab('improvements')}
                          className="px-3.5 py-1.5 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xs transition-colors flex items-center space-x-1 cursor-pointer"
                        >
                          <Sparkles className="w-3.5 h-3.5" />
                          <span>Fix My Bullets Now</span>
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* Dimension Breakdown summary */}
                  <ScoreBreakdown breakdown={report.score_breakdown} />
                </div>
              )}

              {/* TAB: RECRUITER PERSPECTIVE & ATS ENGINE COMPARISON */}
              {activeTab === 'recruiter-lens' && (
                <RecruiterPerspective
                  overallScore={report.overall_score}
                  tier={report.tier}
                  onNavigateTab={(tab) => setActiveTab(tab)}
                  report={report}
                />
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
      <section className="relative w-full overflow-hidden border-t border-b border-slate-200 dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#000000] py-1 transition-colors">
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
