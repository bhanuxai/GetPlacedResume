import React from 'react';
import { FileText, ArrowLeft, Scale, AlertCircle, ShieldAlert, CheckCircle, Mail } from 'lucide-react';

interface TermsOfServiceViewProps {
  onBack: () => void;
}

export const TermsOfServiceView: React.FC<TermsOfServiceViewProps> = ({ onBack }) => {
  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#000000] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation back */}
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center space-x-2 text-xs font-mono font-semibold text-[#2563EB] hover:text-[#1D4ED8] dark:text-[#60A5FA] transition-colors cursor-pointer"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>RETURN TO RESUME ANALYZER</span>
          </button>
        </div>

        {/* Header */}
        <div className="border-b border-slate-200 dark:border-[#262626] pb-8">
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 rounded-full text-[#2563EB] dark:text-blue-300 text-xs font-semibold mb-4 uppercase tracking-wider font-mono">
            <Scale className="w-3.5 h-3.5" />
            <span>Legal Agreement</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Terms of Service &amp; User Agreement
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono">
            Effective Date: September 21, 2026 | Last Updated: September 21, 2026 | Governing Web Platform: GetPlacedResume
          </p>
        </div>

        {/* Summary Card */}
        <div className="p-5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-xs space-y-2">
          <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white flex items-center space-x-2">
            <CheckCircle className="w-4 h-4 text-[#059669]" />
            <span>Summary of Key Provisions</span>
          </h2>
          <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
            By accessing GetPlacedResume (https://getplacedresume.vercel.app), you agree to these Terms. You retain full ownership of your uploaded resume content. Our ATS evaluation metrics are educational diagnostic tools designed to assist your job search, not guarantees of employment, interview callbacks, or hiring decisions.
          </p>
        </div>

        {/* Body Sections */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm space-y-8 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#2563EB] inline-block" />
              <span>1. Acceptance of Terms</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              These Terms of Service (&quot;Terms&quot;) constitute a legally binding agreement between you (&quot;User&quot;, &quot;you&quot;) and GetPlacedResume (&quot;we&quot;, &quot;our&quot;, &quot;Platform&quot;). By visiting our website, uploading files, or utilizing any of our automated resume analysis tools, you confirm your eligibility, that you are at least 18 years old (or possess valid parental/guardian consent), and that you accept these Terms in full.
            </p>
          </section>

          {/* Section 2: Permitted Use & Document Upload Rules */}
          <section className="space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#2563EB] inline-block" />
              <span>2. Permitted Use &amp; Code of Conduct</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              GetPlacedResume grants you a revocable, non-exclusive, non-transferable license to access our platform for personal, non-commercial resume evaluation and career development purposes. When utilizing the service, you agree NOT to:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-slate-700 dark:text-slate-300">
              <li>Upload files containing malicious code, viruses, corrupted macros, or executable payloads.</li>
              <li>Upload resumes, documents, or confidential records belonging to third parties without their explicit legal consent.</li>
              <li>Deploy automated scripts, bots, spiders, or scrapers to harvest data, bypass rate limits, or disrupt server infrastructure.</li>
              <li>Reverse-engineer, decompile, or attempt to extract the underlying source algorithms or heuristic weighting matrices of the platform.</li>
              <li>Use the platform for any illegal purpose or in violation of local, state, national, or international employment laws.</li>
            </ul>
          </section>

          {/* Section 3: Diagnostic Disclaimer - Critical for Legal and AdSense Trust */}
          <section className="space-y-4 bg-amber-50/50 dark:bg-amber-950/20 border border-amber-200 dark:border-amber-900/60 p-6 rounded-xs">
            <div className="flex items-center space-x-2">
              <AlertCircle className="w-5 h-5 text-amber-600 dark:text-amber-400" />
              <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
                3. Career Guidance &amp; Diagnostic Scoring Disclaimer
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300">
              <strong>NO EMPLOYMENT GUARANTEE:</strong> GetPlacedResume calculates ATS compatibility scores, semantic relevancy ratios, layout parseability checks, and simulated recruiter scan heuristics using natural language processing models. 
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              These analyses are diagnostic indicators and educational estimations only. They do NOT guarantee that any applicant tracking system, corporate hiring manager, employer, or talent agency will invite you for an interview, review your application, or extend an offer of employment. Hiring decisions remain exclusively under the discretion of individual employers.
            </p>
          </section>

          {/* Section 4: Intellectual Property */}
          <section className="space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#2563EB] inline-block" />
              <span>4. Intellectual Property &amp; Content Ownership</span>
            </h2>
            <div className="space-y-2">
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Your Content:</strong> You retain complete, undivided ownership and copyright of all resume documents, CVs, text snippets, and career materials submitted to GetPlacedResume. We claim no intellectual property rights over your resume.
              </p>
              <p className="text-slate-700 dark:text-slate-300">
                <strong>Our Platform:</strong> All visual interfaces, software code, graphic designs, logos, scoring algorithms, interactive components, documentation, and written guides on GetPlacedResume are the proprietary intellectual property of GetPlacedResume and are protected under international copyright, trademark, and trade secret laws.
              </p>
            </div>
          </section>

          {/* Section 5: Third-Party Links & Advertising (AdSense Compliance) */}
          <section className="space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#2563EB] inline-block" />
              <span>5. Third-Party Advertisements &amp; Outbound Links</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              GetPlacedResume may feature commercial advertisements delivered via Google AdSense and third-party advertising partners, as well as hyperlinks pointing to external third-party websites. 
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              We do not endorse, sponsor, control, or assume responsibility for any third-party products, services, claims, or privacy practices. Your interactions with advertisers or third-party web domains found on or through our platform are solely between you and the respective third party.
            </p>
          </section>

          {/* Section 6: Limitation of Liability */}
          <section className="space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-red-600 dark:text-red-400" />
              <span>6. Limitation of Liability</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              To the maximum extent permitted by applicable law, GetPlacedResume, its creators, contributors, and hosting providers shall not be liable for any indirect, incidental, special, consequential, or punitive damages, including loss of profits, career opportunities, data, or goodwill, arising from or related to your use of, or inability to use, this platform.
            </p>
          </section>

          {/* Section 7: Contact Us for Terms Questions */}
          <section className="space-y-3 bg-slate-50 dark:bg-[#050505] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <Mail className="w-5 h-5 text-[#2563EB]" />
              <span>7. Inquiries Regarding Terms of Service</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              For questions regarding these Terms or legal compliance, please contact:
            </p>
            <div className="p-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs font-mono text-xs">
              <div>Email: legal@getplacedresume.com / support@getplacedresume.com</div>
              <div>Platform: GetPlacedResume (https://getplacedresume.vercel.app)</div>
            </div>
          </section>

        </div>

        {/* Bottom return button */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#262626] flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xs transition-colors cursor-pointer"
          >
            Back to Resume Workspace
          </button>
          <span className="text-[11px] font-mono text-slate-500">Document Hash: TOS-2026-ADSENSE-V4</span>
        </div>

      </div>
    </div>
  );
};
