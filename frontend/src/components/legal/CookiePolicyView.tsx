import React from 'react';
import { Cookie, ArrowLeft, ExternalLink, Settings, ShieldCheck, ToggleRight, HelpCircle } from 'lucide-react';

interface CookiePolicyViewProps {
  onBack: () => void;
}

export const CookiePolicyView: React.FC<CookiePolicyViewProps> = ({ onBack }) => {
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
          <div className="inline-flex items-center space-x-2 px-3 py-1 bg-purple-50 dark:bg-purple-950/60 border border-purple-200 dark:border-purple-800/60 rounded-full text-purple-700 dark:text-purple-300 text-xs font-semibold mb-4 uppercase tracking-wider font-mono">
            <Cookie className="w-3.5 h-3.5" />
            <span>Cookie &amp; Tracking Transparency</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Cookie Policy &amp; Advertising Technologies
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono">
            Effective Date: September 21, 2026 | Compliant with ePrivacy Directive, GDPR, and Google AdSense
          </p>
        </div>

        {/* Introduction */}
        <div className="p-6 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-xs space-y-3 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <p>
            This Cookie Policy explains how <strong>GetPlacedResume</strong> (&quot;we&quot;, &quot;us&quot;, &quot;our&quot;) uses cookies, web beacons, browser local storage, and related tracking technologies when you visit our website at <a href="https://getplacedresume.vercel.app" className="text-[#2563EB] dark:text-[#60A5FA] underline font-semibold">https://getplacedresume.vercel.app</a>.
          </p>
          <p>
            We believe in radical transparency. We do not use cookies to track your personal identity or sell your resume data. However, third-party services, such as Google AdSense, use cookies to display contextually relevant advertisements that support our free service.
          </p>
        </div>

        {/* Cookie Breakdown Cards */}
        <div className="space-y-6">
          <h2 className="text-lg font-bold font-display text-slate-900 dark:text-white">
            Types of Cookies &amp; Storage We Use
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            
            {/* Category 1 */}
            <div className="p-5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-3">
              <div className="flex items-center space-x-2 text-[#059669]">
                <ShieldCheck className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">1. Strictly Necessary</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Essential for core website operation and security. These include ephemeral session integrity tokens to prevent API denial-of-service abuse and LocalStorage for your chosen Light/Dark theme.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-[#262626] text-[10px] font-mono text-slate-500">
                Retention: Session to 365 days
              </div>
            </div>

            {/* Category 2 */}
            <div className="p-5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-3">
              <div className="flex items-center space-x-2 text-[#2563EB]">
                <Settings className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">2. Functional Storage</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Allows our web application to remember your multi-job analysis history locally on your browser. This information never leaves your client machine and can be cleared at any time.
              </p>
              <div className="pt-2 border-t border-slate-100 dark:border-[#262626] text-[10px] font-mono text-slate-500">
                Retention: Persistent until cache clear
              </div>
            </div>

            {/* Category 3 */}
            <div className="p-5 bg-white dark:bg-[#0A0A0A] border border-purple-200 dark:border-purple-900/60 rounded-xs space-y-3 bg-purple-50/20">
              <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
                <ToggleRight className="w-5 h-5" />
                <h3 className="font-bold text-sm text-slate-900 dark:text-white">3. Google AdSense &amp; Ads</h3>
              </div>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Google and authorized ad networks use cookies (such as DoubleClick DART cookies) to serve personalized or contextual advertisements based on your visits to this and other websites.
              </p>
              <div className="pt-2 border-t border-purple-100 dark:border-purple-900/40 text-[10px] font-mono text-purple-600 dark:text-purple-300">
                Managed by Google AdSense
              </div>
            </div>

          </div>
        </div>

        {/* Detailed Google AdSense Information */}
        <div className="p-6 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
            <span className="w-2 h-2 bg-purple-600 inline-block" />
            <span>How Google Uses Cookies on GetPlacedResume</span>
          </h2>
          <p>
            Google uses cookies to deliver, evaluate, and personalize advertisements displayed across our website. These cookies allow Google to understand which advertisements you have viewed and prevent identical ads from repeatedly showing.
          </p>
          <div className="p-4 bg-slate-50 dark:bg-[#000000] border border-slate-200 dark:border-[#262626] rounded-xs space-y-2">
            <h3 className="font-bold text-slate-900 dark:text-white text-xs uppercase tracking-wider">
              Opting Out of Google Personalized Advertising:
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              You can personalize or disable ad targeting at any time via:
            </p>
            <ul className="space-y-1.5 list-disc pl-5 text-xs">
              <li>
                <strong>Google Ads Settings:</strong>{' '}
                <a href="https://www.google.com/settings/ads" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] underline font-semibold">
                  https://www.google.com/settings/ads
                </a>
              </li>
              <li>
                <strong>AboutAds.info Choices:</strong>{' '}
                <a href="http://www.aboutads.info/choices/" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] underline font-semibold">
                  http://www.aboutads.info/choices/
                </a>
              </li>
              <li>
                <strong>Network Advertising Initiative (NAI):</strong>{' '}
                <a href="https://optout.networkadvertising.org/" target="_blank" rel="noopener noreferrer" className="text-[#2563EB] underline font-semibold">
                  https://optout.networkadvertising.org/
                </a>
              </li>
            </ul>
          </div>
        </div>

        {/* How to Control Cookies in Browsers */}
        <div className="p-6 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-4 text-xs sm:text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
          <h2 className="text-base sm:text-lg font-bold font-display text-slate-900 dark:text-white flex items-center space-x-2">
            <HelpCircle className="w-5 h-5 text-[#2563EB]" />
            <span>Managing Cookies in Your Browser</span>
          </h2>
          <p>
            Most web browsers automatically accept cookies, but you can modify your browser settings to decline cookies or prompt you before accepting one:
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div className="p-3 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#262626]">
              <strong>Google Chrome:</strong> Settings &gt; Privacy and security &gt; Third-party cookies.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#262626]">
              <strong>Mozilla Firefox:</strong> Settings &gt; Privacy &amp; Security &gt; Enhanced Tracking Protection.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#262626]">
              <strong>Apple Safari:</strong> Preferences &gt; Privacy &gt; Block all cookies.
            </div>
            <div className="p-3 bg-slate-50 dark:bg-[#111111] border border-slate-200 dark:border-[#262626]">
              <strong>Microsoft Edge:</strong> Settings &gt; Cookies and site permissions &gt; Manage cookies.
            </div>
          </div>
        </div>

        {/* Bottom return button */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#262626] flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xs transition-colors cursor-pointer"
          >
            Back to Resume Workspace
          </button>
          <span className="text-[11px] font-mono text-slate-500">Document Hash: CK-2026-ADSENSE-V4</span>
        </div>

      </div>
    </div>
  );
};
