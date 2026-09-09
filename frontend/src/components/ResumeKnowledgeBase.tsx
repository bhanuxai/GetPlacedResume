import React, { useState } from 'react';
import { 
  FileText, 
  BookOpen, 
  Scale, 
  CheckCircle2, 
  AlertTriangle, 
  HelpCircle, 
  ChevronDown, 
  ChevronUp, 
  Check, 
  X,
  Layers,
  ArrowRight
} from 'lucide-react';

interface ResumeKnowledgeBaseProps {
  onScrollToWorkbench?: () => void;
}

export const ResumeKnowledgeBase: React.FC<ResumeKnowledgeBaseProps> = ({ onScrollToWorkbench }) => {
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  const comparisonData = [
    {
      feature: "Primary Meaning",
      resume: "French for 'summary' — a concise overview of relevant skills and work history.",
      cv: "Latin for 'course of life' — an exhaustive, comprehensive biography of all achievements."
    },
    {
      feature: "Document Length",
      resume: "Strictly 1–2 pages tailored to the target role.",
      cv: "No page limit; typically 3 to 10+ pages as career progresses."
    },
    {
      feature: "Primary Purpose",
      resume: "Applying for private-sector corporate, tech, engineering, and startup jobs.",
      cv: "Academic appointments, scientific research, medical fellowships, grants, and professorships."
    },
    {
      feature: "Tailoring & Customization",
      resume: "Heavily customized for every job posting to match specific requirements.",
      cv: "Static chronological document; updated with new publications and credentials."
    },
    {
      feature: "Key Information Included",
      resume: "Relevant work experience, technical skills, quantifiable business impact, select projects.",
      cv: "Full educational history, published papers, conference talks, teaching, grants, affiliations."
    },
    {
      feature: "ATS Parsing Behavior",
      resume: "Evaluated for tight semantic relevance, bullet point impact, and role competency density.",
      cv: "Scanned for publication indexes, citation counts, grant history, and institutional credentials."
    },
    {
      feature: "Geographical Usage",
      resume: "Standard in the United States, Canada, and private-sector tech hubs globally.",
      cv: "Standard in academia worldwide; used colloquially in UK/EU/Australia for standard resumes."
    }
  ];

  const resumeSections = [
    {
      title: "1. Header & Contact Information",
      desc: "Your legal name, phone number, professional email, location (City, State/Country), LinkedIn profile, and GitHub or portfolio link. Avoid photos, date of birth, marital status, or full street addresses.",
      atsTip: "Place contact data in the document body, NOT in Microsoft Word headers or footers, which many ATS engines automatically strip."
    },
    {
      title: "2. Target Role & Professional Summary",
      desc: "A brief, 2 to 3-line statement highlighting your professional identity, years of relevant experience, core domain specialties, and your highest-impact value proposition.",
      atsTip: "Align this section with the exact title of the job description to anchor the ATS semantic relevance vector."
    },
    {
      title: "3. Core Technical & Domain Skills",
      desc: "Categorized skills organized into logical stacks (e.g., Languages, Frameworks, Cloud & Infrastructure, Databases, Methodologies).",
      atsTip: "Every critical skill listed here must be supported by experiential evidence in your work history bullets to earn full ATS competency credit."
    },
    {
      title: "4. Professional Work Experience",
      desc: "Reverse-chronological employment history. For each role, include company name, location, exact job title, employment dates (Month Year – Month Year), and 3 to 5 outcome-oriented bullet points.",
      atsTip: "Structure every bullet as: [Action Verb] + [What You Built/Solved] + [Tools Used] + [Quantifiable Business Result]."
    },
    {
      title: "5. Key Engineering & Business Projects",
      desc: "Essential for students, career switchers, and engineers. Detail 2 to 3 significant projects outlining the problem, architectural choices, and GitHub repository or live URL.",
      atsTip: "Highlight technology keywords in context to reinforce competencies that may not appear in your formal job history."
    },
    {
      title: "6. Education & Industry Certifications",
      desc: "Degree title, major, university name, and graduation year. Include honors, relevant coursework, or GPA only if you are a current student or recent graduate.",
      atsTip: "Use standard degree abbreviations (B.S. in Computer Science, M.S., B.Tech) that ATS parsers recognize natively."
    }
  ];

  const atsTraps = [
    {
      title: "Multi-Column & Table Layouts",
      desc: "Two-column resumes look appealing to human eyes, but primitive ATS parsers flatten tables left-to-right across column divides. This scrambles job titles, dates, and bullet points into unreadable text strings."
    },
    {
      title: "Text Inside Canva Graphics & Icons",
      desc: "Resume templates created in Photoshop, Canva, or Illustrator frequently rasterize text into flat image layers. ATS software cannot read image pixels, resulting in an empty or corrupt applicant profile."
    },
    {
      title: "Header and Footer Margin Bleed",
      desc: "Placing your name, phone number, and email in Word or PDF document headers or footers causes ATS parsers to overlook them, resulting in missing contact credentials or unassigned applicant files."
    },
    {
      title: "Creative or Unconventional Section Headers",
      desc: "Using creative headings like 'Where I Have Made an Impact' or 'My Life Journey' confuses ATS categorization algorithms. Stick to standard headings: 'Work Experience', 'Education', 'Technical Skills', 'Projects'."
    }
  ];

  const faqs = [
    {
      q: "What is the difference between an ATS resume and a traditional resume?",
      a: "An ATS (Applicant Tracking System) resume is engineered for clean, error-free machine ingestion. It uses standard font typography, linear single-column layout, recognized section headers, and semantic terminology that maps directly to the employer's job description. A traditional graphic resume often uses multi-column sidebars, skill rating bars, icons, and text boxes that corrupt ATS text parsing."
    },
    {
      q: "Should I submit my resume in PDF or Word (.docx) format?",
      a: "Both are widely accepted, but standard PDF is preferred when generated from clean text software (Google Docs, Microsoft Word, LaTeX), as it preserves visual formatting across devices. However, ensure the PDF contains selectable, searchable text. If an employer specifically requests .docx, always comply with their instructions."
    },
    {
      q: "Does keyword stuffing help you rank higher in modern ATS platforms?",
      a: "No. Modern ATS platforms and GetPlacedResume use semantic vector models and contextual distance scoring rather than naive word frequency counts. Simply listing a keyword 10 times in white text or a skills block provides zero proof of competency. Top systems verify whether the skill is backed by experiential evidence and measurable outcomes in your work bullets."
    },
    {
      q: "How many pages should my resume be?",
      a: "For professionals with under 5 to 7 years of experience, a strict 1-page resume is optimal. For senior engineers, architects, managers, or professionals with 8+ years of relevant experience, a 2-page resume is completely standard. Only academic CVs, medical credentials, or executive biographies should extend to 3 or more pages."
    },
    {
      q: "How does GetPlacedResume evaluate my resume differently from free keyword scanners?",
      a: "Traditional scanners simply count how many words in the job description appear in your resume. GetPlacedResume conducts a multi-layered diagnostic: document geometry inspection, ATS layout parseability scoring, semantic vector alignment, bullet point Action+Context+Result evaluation, and evidence-based competency verification."
    }
  ];

  return (
    <section id="resume-guide" className="py-16 md:py-24 border-b border-slate-200 dark:border-[#262626] bg-[#F8FAFC] dark:bg-[#000000] transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* Section 1: Header */}
        <div className="text-left max-w-3xl">
          <h2 className="text-3xl sm:text-4xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
            Understanding Resumes, CVs, and ATS Compatibility
          </h2>
          <p className="text-base text-slate-600 dark:text-[#94A3B8] mt-3 font-sans leading-relaxed">
            Before applying to competitive roles, understanding the functional architecture of a resume versus a CV — and how automated Applicant Tracking Systems parse your documents — is the single highest-leverage step you can take.
          </p>
        </div>

        {/* Section 2: What is a Resume vs What is a CV */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* Card 1: Resume */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs shadow-sm dark:shadow-none transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-blue-50 dark:bg-[#171717] border border-[#2563EB] flex items-center justify-center rounded-xs text-[#2563EB]">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">What is a Resume?</h3>
                  <span className="text-xs font-sans text-slate-500 dark:text-[#94A3B8]">French for "Summary"</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-700 dark:text-[#CBD5E1] font-sans leading-relaxed mb-4">
                A <strong>Resume</strong> is a concise, highly targeted 1- to 2-page marketing document created specifically for private-sector job applications. Its sole objective is to demonstrate how your specific skills, employment achievements, and technical capabilities directly solve the hiring manager's needs.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#262626] text-xs font-sans text-slate-600 dark:text-[#94A3B8]">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span><strong>Format:</strong> Tight, curated 1–2 page document.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span><strong>Philosophy:</strong> Impact-driven; highlights quantifiable business outcomes.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span><strong>Adaptability:</strong> Re-tailored for each individual job description.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span><strong>Application Scope:</strong> Software engineering, finance, startups, corporate roles.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#000000] p-3 text-xs font-sans text-slate-700 dark:text-[#CBD5E1]">
              <strong className="text-slate-900 dark:text-white block font-semibold mb-1">ATS Rule for Resumes:</strong>
              ATS engines rank resumes based on semantic relevance scores and direct alignment with required qualifications.
            </div>
          </div>

          {/* Card 2: CV */}
          <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs shadow-sm dark:shadow-none transition-colors flex flex-col justify-between">
            <div>
              <div className="flex items-center space-x-3 mb-4">
                <div className="w-10 h-10 bg-emerald-50 dark:bg-[#064E3B] border border-[#059669] flex items-center justify-center rounded-xs text-[#059669]">
                  <BookOpen className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-xl font-bold font-display text-slate-900 dark:text-white">What is a CV?</h3>
                  <span className="text-xs font-sans text-slate-500 dark:text-[#94A3B8]">Latin for "Course of Life" (Curriculum Vitae)</span>
                </div>
              </div>
              
              <p className="text-sm text-slate-700 dark:text-[#CBD5E1] font-sans leading-relaxed mb-4">
                A <strong>Curriculum Vitae (CV)</strong> is an in-depth, exhaustive record of your entire academic career, credentials, published research, scientific presentations, teaching experience, grants, fellowships, and honors. Unlike a resume, a CV has no page limit and grows continuously throughout your lifetime.
              </p>

              <div className="space-y-2 pt-2 border-t border-slate-200 dark:border-[#262626] text-xs font-sans text-slate-600 dark:text-[#94A3B8]">
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span><strong>Format:</strong> Comprehensive record spanning 3 to 10+ pages.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span><strong>Philosophy:</strong> Credential-driven; complete chronological inventory.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span><strong>Adaptability:</strong> Remains relatively static; updated as milestones occur.</span>
                </div>
                <div className="flex items-start space-x-2">
                  <Check className="w-4 h-4 text-[#059669] flex-shrink-0 mt-0.5" />
                  <span><strong>Application Scope:</strong> University faculty, doctoral research, medicine, grants.</span>
                </div>
              </div>
            </div>

            <div className="mt-6 pt-4 border-t border-slate-200 dark:border-[#262626] bg-slate-50 dark:bg-[#000000] p-3 text-xs font-sans text-slate-700 dark:text-[#CBD5E1]">
              <strong className="text-slate-900 dark:text-white block font-semibold mb-1">Global Nuance:</strong>
              In the UK, Ireland, South Africa, and New Zealand, the term "CV" is often used synonymously with a 2-page resume.
            </div>
          </div>

        </div>

        {/* Section 3: Side-by-Side Comparison Table */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-sm dark:shadow-none overflow-hidden transition-colors">
          <div className="p-6 border-b border-slate-200 dark:border-[#262626] flex items-center justify-between">
            <div className="flex items-center space-x-2.5">
              <Scale className="w-5 h-5 text-[#2563EB]" />
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Detailed Comparison: Resume vs. Curriculum Vitae (CV)
              </h3>
            </div>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 dark:bg-[#000000] border-b border-slate-200 dark:border-[#262626] text-slate-900 dark:text-white font-semibold">
                  <th className="p-4 w-1/4">Evaluation Dimension</th>
                  <th className="p-4 w-3/8 text-[#2563EB]">Standard Resume</th>
                  <th className="p-4 w-3/8 text-[#059669]">Curriculum Vitae (CV)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#262626] text-slate-700 dark:text-[#CBD5E1]">
                {comparisonData.map((row, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-[#171717] transition-colors">
                    <td className="p-4 font-semibold text-slate-900 dark:text-white">{row.feature}</td>
                    <td className="p-4 leading-relaxed">{row.resume}</td>
                    <td className="p-4 leading-relaxed">{row.cv}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Section 4: Anatomical Structure of an ATS-Compliant Resume */}
        <div className="space-y-8">
          <div className="text-left">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
              The Anatomical Structure of an ATS-Optimized Resume
            </h3>
            <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-2 font-sans max-w-2xl leading-relaxed">
              Every Applicant Tracking System employs heuristic section-identification models. Using standard structure ensures your experience and credentials are parsed accurately without missing fields.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {resumeSections.map((sec, idx) => (
              <div key={idx} className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-5 rounded-xs flex flex-col justify-between shadow-sm dark:shadow-none transition-colors">
                <div>
                  <h4 className="text-base font-bold font-sans text-slate-900 dark:text-white mb-2">{sec.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-[#94A3B8] font-sans leading-relaxed mb-4">{sec.desc}</p>
                </div>
                <div className="bg-slate-50 dark:bg-[#000000] border-l-2 border-[#2563EB] p-2.5 text-[11px] font-sans text-slate-700 dark:text-[#CBD5E1]">
                  <span className="font-bold text-[#2563EB] block">ATS Best Practice:</span>
                  {sec.atsTip}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 5: Top 4 ATS Formatting Traps */}
        <div className="space-y-6">
          <div className="text-left">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <AlertTriangle className="w-6 h-6 text-[#DC2626]" />
              <span>Common Formatting Traps That Cause 75% of ATS Rejections</span>
            </h3>
            <p className="text-sm text-slate-600 dark:text-[#94A3B8] mt-1 font-sans">
              Most candidates who fail initial ATS screening are fully qualified engineers rejected purely by parsing anomalies.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {atsTraps.map((trap, idx) => (
              <div key={idx} className="bg-white dark:bg-[#0A0A0A] border border-red-200 dark:border-[#DC2626]/30 p-5 rounded-xs flex items-start space-x-3.5 shadow-sm dark:shadow-none transition-colors">
                <div className="w-7 h-7 bg-red-50 dark:bg-[#450A0A] border border-[#DC2626] flex items-center justify-center rounded-xs text-[#DC2626] flex-shrink-0 mt-0.5">
                  <X className="w-4 h-4" />
                </div>
                <div>
                  <h4 className="text-sm font-bold font-sans text-slate-900 dark:text-white mb-1">{trap.title}</h4>
                  <p className="text-xs text-slate-600 dark:text-[#94A3B8] font-sans leading-relaxed">{trap.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Section 6: Frequently Asked Questions (FAQ) Accordion */}
        <div className="space-y-6">
          <div className="text-left">
            <h3 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight flex items-center space-x-2">
              <HelpCircle className="w-6 h-6 text-[#2563EB]" />
              <span>Frequently Asked Questions About Resumes, CVs, and ATS</span>
            </h3>
          </div>

          <div className="space-y-3">
            {faqs.map((faq, idx) => {
              const isOpen = openFaq === idx;
              return (
                <div 
                  key={idx} 
                  className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-sm dark:shadow-none transition-colors overflow-hidden"
                >
                  <button
                    onClick={() => toggleFaq(idx)}
                    className="w-full px-6 py-4 text-left flex items-center justify-between space-x-4 hover:bg-slate-50 dark:hover:bg-[#171717] transition-colors"
                  >
                    <span className="text-sm font-bold font-sans text-slate-900 dark:text-white">{faq.q}</span>
                    {isOpen ? (
                      <ChevronUp className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    ) : (
                      <ChevronDown className="w-4 h-4 text-slate-500 flex-shrink-0" />
                    )}
                  </button>
                  {isOpen && (
                    <div className="px-6 pb-5 pt-1 border-t border-slate-100 dark:border-[#262626] text-xs font-sans text-slate-600 dark:text-[#CBD5E1] leading-relaxed">
                      {faq.a}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Call to Action Bar */}
        {onScrollToWorkbench && (
          <div className="bg-slate-100 dark:bg-[#0A0A0A] border border-slate-300 dark:border-[#262626] p-6 sm:p-8 rounded-xs flex flex-col sm:flex-row items-center justify-between gap-6 transition-colors">
            <div>
              <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
                Ready to audit your resume with GetPlacedResume?
              </h3>
              <p className="text-xs text-slate-600 dark:text-[#94A3B8] font-sans mt-1">
                Upload your PDF or DOCX file to see your 6-dimension score, ATS layout audit, and grounded bullet point upgrades.
              </p>
            </div>
            <button
              onClick={onScrollToWorkbench}
              className="flex items-center space-x-2 px-6 py-3 bg-[#2563EB] hover:bg-[#1D4ED8] text-white text-xs font-semibold rounded-xs transition-colors shadow-none flex-shrink-0"
            >
              <span>Analyze My Resume Now</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          </div>
        )}

      </div>
    </section>
  );
};
