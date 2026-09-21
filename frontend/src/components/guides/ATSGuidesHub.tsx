import React, { useState } from 'react';
import { 
  BookOpen, 
  ArrowLeft, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  Cpu, 
  FileText, 
  Target, 
  Eye, 
  Zap, 
  Sparkles,
  ChevronRight,
  Search,
  Clock,
  Share2,
  Bookmark
} from 'lucide-react';

interface ATSGuidesHubProps {
  onBack: () => void;
  onNavigateToAnalyzer?: () => void;
}

export const ATSGuidesHub: React.FC<ATSGuidesHubProps> = ({ onBack, onNavigateToAnalyzer }) => {
  const [selectedGuide, setSelectedGuide] = useState<number>(0);
  const [searchQuery, setSearchQuery] = useState('');

  const guides = [
    {
      id: 0,
      badge: "Architecture Deep-Dive",
      readTime: "8 min read",
      title: "The Inner Architecture of Modern ATS Systems (2025–2026 Edition)",
      subtitle: "How enterprise parsers like Workday, Taleo, Greenhouse, and Lever ingest, tokenize, and rank candidate resumes.",
      content: (
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            An <strong>Applicant Tracking System (ATS)</strong> is enterprise human-resources software designed to collect, parse, organize, and rank job applications. Today, over 98% of Fortune 500 corporations and more than 70% of high-growth technology startups use an ATS before a human recruiter ever sees a resume.
          </p>

          <div className="p-5 bg-blue-50 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xs space-y-2">
            <h4 className="font-bold text-slate-900 dark:text-white text-sm">The 5-Stage ATS Parsing Lifecycle</h4>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              When you submit a document through a portal like Workday or Greenhouse, it passes through five distinct automated phases:
            </p>
            <ol className="list-decimal pl-5 space-y-1.5 text-xs text-slate-700 dark:text-slate-300 mt-2">
              <li><strong>Document Ingestion &amp; Decompression:</strong> The PDF or DOCX file is stripped of proprietary container metadata and converted into a raw byte stream.</li>
              <li><strong>Optical Layout Extraction:</strong> The parser analyzes bounding boxes, character coordinates, and linear line heights to reconstruct text strings.</li>
              <li><strong>Named Entity Recognition (NER):</strong> Machine learning models identify tokens corresponding to Job Titles, Company Names, Dates, Educational Institutions, and Skill Keywords.</li>
              <li><strong>Semantic Vector Embedding:</strong> The extracted text is converted into high-dimensional numerical vectors and compared against the target job description using cosine similarity.</li>
              <li><strong>Recruiter Dashboard Indexing:</strong> The candidate profile is indexed into an elastic database where hiring managers search, filter, and review ranked applicant scores.</li>
            </ol>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            Why Qualified Candidates Get Rejected
          </h3>
          <p>
            The most shocking truth about ATS filtering is that <strong>up to 75% of qualified applicants are eliminated due to technical parsing failures</strong> rather than credential inadequacy. When a resume contains complex graphical elements, non-standard headings, or nested table cells, the parser frequently extracts garbage text strings.
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 my-4">
            <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xs">
              <span className="font-bold text-red-700 dark:text-red-400 text-xs block mb-1">What the Candidate Wrote:</span>
              <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200 bg-white dark:bg-[#111] p-2 rounded-xs border border-red-100 dark:border-red-950">
                Left Column: Senior Backend Engineer<br />
                Right Column: 2021 – 2024<br />
                Left Column: Stripe<br />
                Right Column: San Francisco, CA
              </p>
            </div>
            <div className="p-4 bg-amber-50 dark:bg-amber-950/30 border border-amber-200 dark:border-amber-900/60 rounded-xs">
              <span className="font-bold text-amber-700 dark:text-amber-400 text-xs block mb-1">What the ATS Ingested (Scrambled):</span>
              <p className="font-mono text-[11px] text-slate-800 dark:text-slate-200 bg-white dark:bg-[#111] p-2 rounded-xs border border-amber-100 dark:border-amber-950">
                &quot;Senior Backend Engineer 2021 – 2024 Stripe San Francisco, CA&quot; &rarr; <em>Parsing Error: Title and Dates merged; Employer unidentified.</em>
              </p>
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            Key Takeaway for Job Seekers
          </h3>
          <p>
            Write for the machine first, and the human second. By formatting your resume into a single-column, linearly structured layout with standard headings, you guarantee that 100% of your experience is correctly ingested into the recruiter&apos;s candidate pool.
          </p>
        </div>
      )
    },
    {
      id: 1,
      badge: "Formatting Blueprint",
      readTime: "6 min read",
      title: "The Definitive ATS Resume Formatting Blueprint",
      subtitle: "The optimal fonts, margins, section headers, and geometry guaranteed to pass automated parsers without errors.",
      content: (
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Typography, margins, and document geometry are the foundational building blocks of an ATS-compliant resume. If your formatting breaks parser heuristics, your credentials will never be evaluated. Follow these empirical layout guidelines:
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            
            <div className="p-5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>The 6 ATS-Safe Typography Fonts</span>
              </h4>
              <p className="text-xs text-slate-600 dark:text-slate-400">
                Always stick to standard system fonts natively installed across Windows, macOS, and Linux servers:
              </p>
              <ul className="space-y-1 text-xs font-mono">
                <li>&bull; <strong>Inter / Roboto:</strong> Clean, modern sans-serif.</li>
                <li>&bull; <strong>Arial / Calibri:</strong> The corporate standard for Word.</li>
                <li>&bull; <strong>Helvetica:</strong> Crisp, neutral, highly legible.</li>
                <li>&bull; <strong>Georgia / Garamond:</strong> Classic serif for traditional fields.</li>
              </ul>
              <div className="pt-2 text-[11px] font-mono text-slate-500">
                Body Font Size: 10–11pt | Headings: 14–16pt
              </div>
            </div>

            <div className="p-5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-3">
              <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center space-x-2">
                <AlertTriangle className="w-4 h-4 text-red-600" />
                <span>Dangerous Formatting Pitfalls to Avoid</span>
              </h4>
              <ul className="space-y-1.5 text-xs text-slate-600 dark:text-slate-400">
                <li>&bull; <strong>Multi-column tables:</strong> Parsers read across the page, conflating column text.</li>
                <li>&bull; <strong>Text boxes &amp; Callouts:</strong> Microsoft Word text boxes are stored in separate drawing layers that ATS software skips.</li>
                <li>&bull; <strong>Header &amp; Footer Margins:</strong> Do not place phone numbers or email in Word headers.</li>
                <li>&bull; <strong>Canva / Photoshop templates:</strong> Exported text often flattens into rasterized image pixels.</li>
              </ul>
            </div>

          </div>

          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            Standard Section Header Naming Rules
          </h3>
          <p>
            ATS parsers rely on pre-trained regex classifiers and heuristic dictionaries to locate sections. Creative headings confuse the parser. Use these exact labels:
          </p>

          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs font-sans">
              <thead>
                <tr className="bg-slate-100 dark:bg-[#111] border-b border-slate-200 dark:border-[#262626] font-semibold text-slate-900 dark:text-white">
                  <th className="p-3">Section</th>
                  <th className="p-3 text-emerald-600 dark:text-emerald-400">Approved Standard Header</th>
                  <th className="p-3 text-red-600 dark:text-red-400">Hazardous Header (Avoid)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200 dark:divide-[#262626] text-slate-600 dark:text-slate-400">
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Work History</td>
                  <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">Professional Experience</td>
                  <td className="p-3 font-mono text-red-600 dark:text-red-400">&quot;Where I&apos;ve Made an Impact&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Skills Matrix</td>
                  <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">Technical Skills</td>
                  <td className="p-3 font-mono text-red-600 dark:text-red-400">&quot;My Superpowers &amp; Toolkit&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Academics</td>
                  <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">Education</td>
                  <td className="p-3 font-mono text-red-600 dark:text-red-400">&quot;Academic Journey &amp; Milestones&quot;</td>
                </tr>
                <tr>
                  <td className="p-3 font-semibold text-slate-900 dark:text-white">Projects</td>
                  <td className="p-3 font-mono font-bold text-emerald-600 dark:text-emerald-400">Key Projects</td>
                  <td className="p-3 font-mono text-red-600 dark:text-red-400">&quot;Side Hustles &amp; Creations&quot;</td>
                </tr>
              </tbody>
            </table>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            PDF vs. DOCX: The Verdict
          </h3>
          <p>
            Unless an employer specifically requests a Microsoft Word (.docx) file, <strong>a text-encoded PDF generated from Word or Google Docs is the gold standard</strong>. It locks visual formatting so that human recruiters see the exact layout you intended, while allowing machine parsers to extract unicode text cleanly.
          </p>
        </div>
      )
    },
    {
      id: 2,
      badge: "Bullet Point Engineering",
      readTime: "7 min read",
      title: "The Google XYZ Formula & Bullet Point Engineering",
      subtitle: "Transform weak, passive job duties into quantifiable, high-impact achievements that score in the top 5th percentile.",
      content: (
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Former Google Head of People Operations Laszlo Bock established the premier standard for high-scoring resume bullet points: the <strong>Google XYZ Formula</strong>.
          </p>

          <div className="p-6 bg-purple-50 dark:bg-purple-950/30 border border-purple-200 dark:border-purple-900/60 rounded-xs space-y-3 text-center">
            <span className="text-xs font-mono font-bold uppercase tracking-wider text-purple-700 dark:text-purple-300">
              THE GOLDEN ARCHITECTURE
            </span>
            <div className="text-base sm:text-xl font-bold font-display text-slate-900 dark:text-white">
              &quot;Accomplished [X], as measured by [Y], by doing [Z]&quot;
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
              Every bullet point on your resume must articulate: what was the business result, how was it measured with numbers, and what technical tool or strategy did you deploy?
            </p>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            Real-World Transformations: Weak vs. Engineered
          </h3>

          <div className="space-y-4">
            
            {/* Example 1 */}
            <div className="p-4 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-blue-600 uppercase">Software Engineering</span>
              <div className="text-xs text-red-600 line-through">
                Weak: &quot;Responsible for improving backend performance and database queries.&quot;
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Engineered (XYZ): &quot;Reduced API p99 latency by 42% (from 850ms to 490ms) for 1.2M daily users by rewriting MongoDB aggregation pipelines and introducing Redis caching layer.&quot;
              </div>
            </div>

            {/* Example 2 */}
            <div className="p-4 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-indigo-600 uppercase">Data Science &amp; Machine Learning</span>
              <div className="text-xs text-red-600 line-through">
                Weak: &quot;Built a machine learning model to predict customer churn.&quot;
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Engineered (XYZ): &quot;Achieved 89.4% precision in customer churn prediction, saving an estimated $340K annually by training an XGBoost ensemble with hyperparameter tuning on 500K records.&quot;
              </div>
            </div>

            {/* Example 3 */}
            <div className="p-4 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-2">
              <span className="text-[10px] font-mono font-bold text-purple-600 uppercase">Product Management</span>
              <div className="text-xs text-red-600 line-through">
                Weak: &quot;Worked with design and engineering teams to launch a new mobile onboarding flow.&quot;
              </div>
              <div className="text-xs text-emerald-600 dark:text-emerald-400 font-semibold">
                Engineered (XYZ): &quot;Increased mobile user onboarding completion rate by 28% across 45,000 monthly signups by conducting 20+ user interviews and leading a 4-engineer sprint to redesign friction points.&quot;
              </div>
            </div>

          </div>

          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            High-Impact Action Verbs Matrix
          </h3>
          <p>
            Eliminate weak phrases like &quot;Assisted with&quot;, &quot;Worked on&quot;, or &quot;Helped&quot;. Replace them with decisive, results-oriented action verbs:
          </p>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs font-mono">
            <div className="p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#262626]">
              <strong className="text-blue-600 block mb-1">Architecture</strong>
              Architected, Engineered, Designed, Implemented, Deployed
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#262626]">
              <strong className="text-emerald-600 block mb-1">Optimization</strong>
              Optimized, Streamlined, Reduced, Accelerated, Refactored
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#262626]">
              <strong className="text-purple-600 block mb-1">Leadership</strong>
              Spearheaded, Orchestrated, Mentored, Directed, Pioneered
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#111] border border-slate-200 dark:border-[#262626]">
              <strong className="text-amber-600 block mb-1">Research &amp; Data</strong>
              Quantified, Modeled, Evaluated, Diagnosed, Synthesized
            </div>
          </div>
        </div>
      )
    },
    {
      id: 3,
      badge: "NLP & Algorithms",
      readTime: "7 min read",
      title: "Semantic Vector Alignment vs. Naive Keyword Stuffing",
      subtitle: "Why white-text tricks fail in modern ATS engines and how to weave authentic, verified keywords into your experience.",
      content: (
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            In the early 2010s, naive ATS software counted exact keyword frequency. Unethical candidates responded by pasting lists of keywords in tiny 1pt white fonts in the margins. 
          </p>
          <div className="p-4 bg-red-50 dark:bg-red-950/30 border border-red-200 dark:border-red-900/60 rounded-xs">
            <strong className="text-red-700 dark:text-red-400 block font-bold text-xs uppercase mb-1">
              Warning: Modern Parsers Flag &amp; Blacklist White-Text Hacks
            </strong>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              Every modern ATS (Ashby, Greenhouse, Workday) extracts text without visual CSS formatting. If an applicant has 50 hidden words at the bottom of the page, the parser sees them as plain text. The system flags this as an intentional attempt to game the algorithm and automatically disqualifies the applicant.
            </p>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            How Modern Vector Embeddings Work
          </h3>
          <p>
            GetPlacedResume and modern corporate ATS platforms use <strong>Semantic Vector Similarity</strong> (TF-IDF, BERT embeddings, Word2Vec, and LLM embedding models). Rather than checking for exact string matches, the algorithm evaluates contextual proximity:
          </p>

          <div className="p-5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-3">
            <h4 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider font-mono">
              The Contextual Grounding Heuristic
            </h4>
            <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
              If a job description requires <span className="font-mono text-slate-900 dark:text-white font-bold">&quot;Distributed Systems &amp; Kafka&quot;</span>, merely writing &quot;Kafka&quot; in a skills block gives minimal score credit. To earn full score velocity, Kafka must appear in an active work bullet point alongside related terms: <em>&quot;consumer lag&quot;, &quot;partitions&quot;, &quot;throughput&quot;, or &quot;event-driven streaming&quot;</em>.
            </p>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            Ethical Keyword Optimization Checklist
          </h3>
          <ul className="space-y-2 list-disc pl-5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Mirror Target Job Titles:</strong> If the listing says &quot;Full Stack Software Engineer&quot;, avoid ambiguous titles like &quot;Code Architect&quot; or &quot;Technical Guru&quot;.</li>
            <li><strong>Include Acronyms &amp; Full Terms:</strong> Write &quot;AWS (Amazon Web Services)&quot; or &quot;Search Engine Optimization (SEO)&quot; so both string searches and acronym matchers capture the record.</li>
            <li><strong>Ground Every Skill in Work History:</strong> Ensure 80% or more of the technologies in your &quot;Technical Skills&quot; section are referenced at least once in your bullet points.</li>
          </ul>
        </div>
      )
    },
    {
      id: 4,
      badge: "Recruiter Psychology",
      readTime: "5 min read",
      title: "The Recruiter 6-Second Glance & The F-Pattern",
      subtitle: "What happens after the ATS passes your resume: eye-tracking science and optimizing the top third of your page.",
      content: (
        <div className="space-y-8 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            Passing the ATS is only step one. Once your resume clears automated filtering, it arrives in the recruiter&apos;s candidate dashboard. Decades of eye-tracking research (including the famous Ladders Eye-Tracking Study) reveal that <strong>recruiters spend an average of 6 to 7.4 seconds</strong> performing an initial triage on a resume.
          </p>

          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            The F-Pattern Scanning Behavior
          </h3>
          <p>
            Human eyes do not read resumes left-to-right, line-by-line like a novel. Instead, they scan in an &quot;F-Pattern&quot;:
          </p>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 font-mono text-xs">
            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs">
              <span className="text-[#2563EB] font-bold block mb-1">Seconds 0–2</span>
              <strong>Top Horizontal Bar:</strong> Your Name, Target Job Title, and Contact Location.
            </div>
            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs">
              <span className="text-[#2563EB] font-bold block mb-1">Seconds 2–4</span>
              <strong>Left Vertical Scan:</strong> Company names, job titles, and employment date ranges.
            </div>
            <div className="p-4 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs">
              <span className="text-[#2563EB] font-bold block mb-1">Seconds 4–6</span>
              <strong>Anchor Scanning:</strong> Bolded metrics, numbers (%, $), and core technology keywords.
            </div>
          </div>

          <h3 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
            The &quot;Above the Fold&quot; Rule
          </h3>
          <p>
            The top 35% of your resume determines whether the recruiter keeps reading or hits &quot;Reject&quot;. Make sure the following elements are immediately visible without scrolling:
          </p>
          <ul className="space-y-2 list-disc pl-5 text-xs text-slate-600 dark:text-slate-400">
            <li><strong>Your Exact Target Role:</strong> Align your headline with the position you are applying for.</li>
            <li><strong>High-Density Skills Block:</strong> Grouped into Languages, Frameworks, and Tools for rapid visual recognition.</li>
            <li><strong>Most Recent Job with High-Impact Metric:</strong> An impressive outcome right in the very first bullet point.</li>
          </ul>
        </div>
      )
    }
  ];

  const currentGuide = guides[selectedGuide];

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#000000] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">
        
        {/* Navigation & Header */}
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:text-[#60A5FA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO RESUME ANALYZER</span>
          </button>
        </div>

        {/* Hero Header */}
        <div className="border-b border-slate-200 dark:border-[#262626] pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 rounded-full text-[#2563EB] dark:text-blue-300 text-xs font-semibold mb-4 uppercase tracking-wider font-mono">
            <BookOpen className="w-3.5 h-3.5" />
            <span>ATS Education &amp; Career Masterclasses</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            The Complete ATS &amp; Resume Optimization Guide
          </h1>
          <p className="mt-3 text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-3xl leading-relaxed">
            Curated, research-backed editorial guides covering enterprise ATS parsers, resume layout geometry, the Google XYZ bullet formula, and recruiter eye-tracking science.
          </p>
        </div>

        {/* 2-Column Split: Guide Sidebar Navigation + Selected Article Content */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left Sidebar: Guide Selector (4 cols) */}
          <div className="lg:col-span-4 space-y-3 sticky top-20">
            <div className="text-xs font-mono font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 px-1 mb-2">
              All Masterclasses ({guides.length})
            </div>
            
            {guides.map((g, idx) => {
              const isSelected = selectedGuide === idx;
              return (
                <button
                  key={idx}
                  onClick={() => setSelectedGuide(idx)}
                  className={`w-full text-left p-4 rounded-xs border transition-all cursor-pointer ${
                    isSelected
                      ? 'bg-white dark:bg-[#111111] border-[#2563EB] shadow-xs'
                      : 'bg-slate-50 dark:bg-[#0A0A0A] border-slate-200 dark:border-[#262626] hover:border-slate-400 dark:hover:border-slate-600'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="text-[10px] font-mono font-bold px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-950 text-blue-700 dark:text-blue-300">
                      {g.badge}
                    </span>
                    <span className="text-[10px] font-mono text-slate-400 flex items-center space-x-1">
                      <Clock className="w-3 h-3" />
                      <span>{g.readTime}</span>
                    </span>
                  </div>
                  <h3 className={`text-xs font-bold font-sans ${isSelected ? 'text-[#2563EB] dark:text-[#60A5FA]' : 'text-slate-900 dark:text-white'}`}>
                    {g.title}
                  </h3>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 line-clamp-2">
                    {g.subtitle}
                  </p>
                </button>
              );
            })}

            {/* Quick Action CTA */}
            {onNavigateToAnalyzer && (
              <div className="p-5 bg-blue-50/60 dark:bg-blue-950/30 border border-blue-200 dark:border-blue-900/60 rounded-xs mt-6 space-y-3">
                <div className="text-xs font-bold text-slate-900 dark:text-white">
                  Put These Rules into Practice
                </div>
                <p className="text-[11px] text-slate-600 dark:text-slate-400">
                  Audit your resume against a target job description in seconds with our 6-axis engine.
                </p>
                <button
                  onClick={onNavigateToAnalyzer}
                  className="w-full py-2 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xs transition-colors cursor-pointer"
                >
                  Launch Resume Analyzer
                </button>
              </div>
            )}
          </div>

          {/* Right Column: Full Article View (8 cols) */}
          <div className="lg:col-span-8 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-10 rounded-xs shadow-xs space-y-8">
            
            {/* Article Top Meta */}
            <div className="border-b border-slate-200 dark:border-[#262626] pb-6 space-y-3">
              <div className="flex items-center space-x-3 text-xs font-mono text-slate-500">
                <span className="px-2.5 py-0.5 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-[#2563EB] dark:text-blue-300 font-bold rounded-full">
                  {currentGuide.badge}
                </span>
                <span>&bull;</span>
                <span>{currentGuide.readTime}</span>
                <span>&bull;</span>
                <span>Peer-Reviewed by Technical Recruiters</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                {currentGuide.title}
              </h2>
              <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-sans leading-relaxed">
                {currentGuide.subtitle}
              </p>
            </div>

            {/* Article Content */}
            <div className="article-body">
              {currentGuide.content}
            </div>

            {/* Article Footer & Navigation */}
            <div className="pt-8 border-t border-slate-200 dark:border-[#262626] flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="text-[11px] font-mono text-slate-500">
                Published by GetPlacedResume Editorial Staff &bull; Updated for 2026 Hiring Cycles
              </div>
              <div className="flex items-center space-x-3">
                {selectedGuide > 0 && (
                  <button
                    onClick={() => setSelectedGuide(selectedGuide - 1)}
                    className="px-3 py-1.5 border border-slate-300 dark:border-[#262626] text-xs font-mono rounded-xs hover:bg-slate-100 dark:hover:bg-[#111] cursor-pointer"
                  >
                    &larr; Previous Guide
                  </button>
                )}
                {selectedGuide < guides.length - 1 && (
                  <button
                    onClick={() => setSelectedGuide(selectedGuide + 1)}
                    className="px-3 py-1.5 bg-[#2563EB] text-white text-xs font-mono font-bold rounded-xs hover:bg-[#1D4ED8] cursor-pointer"
                  >
                    Next Guide &rarr;
                  </button>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
