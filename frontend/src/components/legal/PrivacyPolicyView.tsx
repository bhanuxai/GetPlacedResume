import React from 'react';
import { ShieldCheck, ArrowLeft, Lock, EyeOff, Trash2, Cookie, ExternalLink, Mail, CheckCircle2 } from 'lucide-react';

interface PrivacyPolicyViewProps {
  onBack: () => void;
}

export const PrivacyPolicyView: React.FC<PrivacyPolicyViewProps> = ({ onBack }) => {
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-emerald-50 dark:bg-emerald-950/60 border border-emerald-200 dark:border-emerald-800/60 rounded-full text-emerald-700 dark:text-emerald-300 text-xs font-semibold mb-4 uppercase tracking-wider font-mono">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>Official Privacy Protocol &amp; Policy</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Privacy Policy &amp; Data Protection Statement
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono">
            Effective Date: September 21, 2026 | Last Updated: September 21, 2026 | Compliant with GDPR, CCPA, and Google AdSense Publisher Policies
          </p>
        </div>

        {/* Executive Guarantee Highlights */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-4 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-xs">
            <Trash2 className="w-5 h-5 text-[#2563EB] mb-2" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Ephemeral In-Memory Processing</h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Resumes uploaded to GetPlacedResume are parsed entirely in transient RAM and automatically deallocated once your diagnostic score is produced. No files are stored permanently on server disks.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-xs">
            <EyeOff className="w-5 h-5 text-emerald-600 dark:text-emerald-400 mb-2" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">Zero AI Model Training</h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              Your resume text, contact details, work history, and proprietary project information are strictly never used to train, retrain, or fine-tune public or private machine learning models.
            </p>
          </div>
          <div className="p-4 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-xs">
            <Lock className="w-5 h-5 text-purple-600 dark:text-purple-400 mb-2" />
            <h2 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-white">No Data Commercialization</h2>
            <p className="text-[11px] text-slate-600 dark:text-slate-400 mt-1 leading-relaxed">
              We never sell, rent, monetize, or broker your personal information or resume records to third-party headhunters, data brokers, or marketing syndicates.
            </p>
          </div>
        </div>

        {/* Content Body */}
        <div className="prose prose-slate dark:prose-invert max-w-none text-xs sm:text-sm space-y-8 leading-relaxed">
          
          {/* Section 1 */}
          <section className="space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#2563EB] inline-block" />
              <span>1. Introduction &amp; Scope</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Welcome to <strong>GetPlacedResume</strong> (&quot;we&quot;, &quot;our&quot;, &quot;us&quot;), accessible via <a href="https://getplacedresume.vercel.app" className="text-[#2563EB] dark:text-[#60A5FA] underline">https://getplacedresume.vercel.app</a>. We are dedicated to maintaining the confidentiality, privacy, and integrity of your personal and professional career data.
            </p>
            <p className="text-slate-700 dark:text-slate-300">
              This Privacy Policy explains how information about you is collected, processed, and maintained when you use our website, tools, and resume evaluation services. By accessing or using GetPlacedResume, you acknowledge that you have read and agreed to the data collection and usage practices outlined herein.
            </p>
          </section>

          {/* Section 2: Advertising & Google AdSense Disclosure - MANDATORY FOR ADSENSE ACCEPTANCE */}
          <section className="space-y-4 bg-blue-50/50 dark:bg-blue-950/20 border border-blue-200 dark:border-blue-900/60 p-6 rounded-xs">
            <div className="flex items-center space-x-2">
              <Cookie className="w-5 h-5 text-[#2563EB]" />
              <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white">
                2. Third-Party Advertising &amp; Google AdSense Disclosures
              </h2>
            </div>
            <p className="text-slate-700 dark:text-slate-300 font-semibold">
              Please review this section carefully regarding Google AdSense, DoubleClick cookies, and advertising partners serving ads on this website:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-slate-700 dark:text-slate-300">
              <li>
                <strong>Third-Party Vendor Advertising:</strong> Third-party vendors, including Google, use cookies to serve ads based on a user&apos;s prior visits to this website or other websites on the Internet.
              </li>
              <li>
                <strong>Google DoubleClick / DART Cookies:</strong> Google&apos;s use of advertising cookies enables it and its partners to serve ads to users based on their visits to GetPlacedResume and/or other sites across the World Wide Web.
              </li>
              <li>
                <strong>Personalized Advertising Opt-Out:</strong> Users may opt out of personalized advertising at any time by visiting Google Ads Settings at{' '}
                <a 
                  href="https://www.google.com/settings/ads" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#2563EB] dark:text-[#60A5FA] inline-flex items-center space-x-1 underline font-semibold"
                >
                  <span>https://www.google.com/settings/ads</span>
                  <ExternalLink className="w-3 h-3 inline" />
                </a>.
              </li>
              <li>
                <strong>Digital Advertising Alliance (DAA) Opt-Out:</strong> Alternatively, users may opt out of a third-party vendor&apos;s use of cookies for personalized advertising by visiting{' '}
                <a 
                  href="http://www.aboutads.info/choices/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#2563EB] dark:text-[#60A5FA] inline-flex items-center space-x-1 underline font-semibold"
                >
                  <span>http://www.aboutads.info/choices/</span>
                  <ExternalLink className="w-3 h-3 inline" />
                </a>{' '}
                or the Network Advertising Initiative (NAI) opt-out tool at{' '}
                <a 
                  href="https://optout.networkadvertising.org/" 
                  target="_blank" 
                  rel="noopener noreferrer" 
                  className="text-[#2563EB] dark:text-[#60A5FA] inline-flex items-center space-x-1 underline font-semibold"
                >
                  <span>https://optout.networkadvertising.org/</span>
                  <ExternalLink className="w-3 h-3 inline" />
                </a>.
              </li>
              <li>
                <strong>Ad Network Partners:</strong> If third-party ad networks or ad servers display advertisements on GetPlacedResume, they may also use cookies, JavaScript, or Web Beacons to measure the effectiveness of their campaigns and personalize advertising content. GetPlacedResume has no direct access to or control over these third-party cookies.
              </li>
            </ul>
          </section>

          {/* Section 3: Information We Collect */}
          <section className="space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#2563EB] inline-block" />
              <span>3. Information We Collect and Process</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              We collect minimal information necessary to deliver accurate resume parsing and diagnostic scoring:
            </p>
            <div className="space-y-3 pl-2">
              <div>
                <strong className="text-slate-900 dark:text-white block font-semibold">A. Resume Documents &amp; Job Description Text (User Inputs):</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  When you upload a resume (.pdf, .docx) or paste plain text into the evaluation workbench, this payload is transferred securely via TLS encryption to our parsing pipeline. The text is held only in transient RAM to compute scoring dimensions (keywords, syntax, semantic vector distance, bullet point action structure) and is discarded as soon as the response report is returned.
                </p>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block font-semibold">B. Client-Side Browser Storage (LocalStorage):</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  To provide a seamless user experience, your light/dark display mode preference and multi-job match history are saved locally on your personal device via HTML5 LocalStorage. You can clear this data at any time by resetting your browser storage.
                </p>
              </div>
              <div>
                <strong className="text-slate-900 dark:text-white block font-semibold">C. Automated Technical Telemetry &amp; Log Data:</strong>
                <p className="text-slate-600 dark:text-slate-400 mt-0.5">
                  Like standard web applications, our web hosting infrastructure (e.g. Vercel, Render) may automatically record standard HTTP server log data such as your IP address, browser type, referral URL, operating system, and request timestamps to prevent denial-of-service abuse.
                </p>
              </div>
            </div>
          </section>

          {/* Section 4: GDPR & CCPA Compliance */}
          <section className="space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#2563EB] inline-block" />
              <span>4. Rights Under GDPR (European Union) &amp; CCPA / CPRA (California)</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              Depending on your geographical location, you possess distinct statutory rights regarding personal data:
            </p>
            <ul className="space-y-2 list-disc pl-5 text-slate-700 dark:text-slate-300">
              <li><strong>The Right to Access:</strong> You have the right to request copies of any personal data we hold. Since we operate on ephemeral in-memory processing and do not maintain user profile databases, no personal identity records are stored on our servers.</li>
              <li><strong>The Right to Rectification &amp; Erasure:</strong> You can request correction or immediate erasure of any data by contacting our privacy officer.</li>
              <li><strong>The Right to Restrict &amp; Object to Processing:</strong> You may object to data processing or exercise opt-out rights concerning third-party advertising cookies.</li>
              <li><strong>Non-Discrimination (CCPA):</strong> We will never discriminate against you, alter diagnostic scoring, or restrict features because you exercise statutory privacy rights.</li>
            </ul>
          </section>

          {/* Section 5: Children's Privacy */}
          <section className="space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#2563EB] inline-block" />
              <span>5. Children&apos;s Online Privacy Protection (COPPA)</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              GetPlacedResume does not knowingly address or solicit personal data from children under the age of 13. If you believe a minor under 13 has submitted personally identifiable information through our service, please contact us immediately, and we will take prompt corrective action.
            </p>
          </section>

          {/* Section 6: Security Safeguards */}
          <section className="space-y-3 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <span className="w-2 h-2 bg-[#2563EB] inline-block" />
              <span>6. Data Security Safeguards</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              We employ industry-standard administrative, physical, and technical safeguards to protect information submitted to us. All client-to-server traffic is encrypted in transit using Transport Layer Security (TLS 1.3 / HTTPS). In-memory document buffers are protected against cross-session contamination and purged automatically upon request completion.
            </p>
          </section>

          {/* Section 7: Contact Information */}
          <section className="space-y-3 bg-slate-50 dark:bg-[#050505] border border-slate-200 dark:border-[#262626] p-6 rounded-xs">
            <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
              <Mail className="w-5 h-5 text-[#2563EB]" />
              <span>7. Privacy Inquiries &amp; Data Protection Officer</span>
            </h2>
            <p className="text-slate-700 dark:text-slate-300">
              If you have any questions, clarifications, or requests concerning this Privacy Policy or our advertising practices, please reach out to our dedicated privacy contact:
            </p>
            <div className="p-4 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs font-mono text-xs space-y-1">
              <div><strong>Website:</strong> GetPlacedResume (https://getplacedresume.vercel.app)</div>
              <div><strong>Email:</strong> privacy@getplacedresume.com / support@getplacedresume.com</div>
              <div><strong>Response SLA:</strong> All formal privacy inquiries receive a response within 48 business hours.</div>
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
          <span className="text-[11px] font-mono text-slate-500">Document Hash: PRV-2026-ADSENSE-V4</span>
        </div>

      </div>
    </div>
  );
};
