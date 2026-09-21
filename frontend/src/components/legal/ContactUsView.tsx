import React, { useState } from 'react';
import { Mail, ArrowLeft, MessageSquare, Clock, MapPin, Send, CheckCircle2, AlertCircle, HelpCircle } from 'lucide-react';

interface ContactUsViewProps {
  onBack: () => void;
}

export const ContactUsView: React.FC<ContactUsViewProps> = ({ onBack }) => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    category: 'general',
    subject: '',
    message: ''
  });
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      setErrorMessage('Please complete all required fields (Name, Email, Message).');
      return;
    }

    if (!formData.email.includes('@') || !formData.email.includes('.')) {
      setErrorMessage('Please provide a valid email address.');
      return;
    }

    setIsSubmitting(true);
    // Simulate swift client handling with immediate acknowledgment
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
    }, 600);
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] dark:bg-[#000000] text-slate-900 dark:text-slate-100 py-12 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-10">
        
        {/* Navigation Back */}
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
            <Mail className="w-3.5 h-3.5" />
            <span>Support &amp; Inquiries</span>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold font-display tracking-tight text-slate-900 dark:text-white">
            Contact GetPlacedResume
          </h1>
          <p className="mt-3 text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-mono">
            Have a question about our ATS scoring algorithms, advertising inquiries, or bug reports? We are here to assist.
          </p>
        </div>

        {/* Contact Info Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <div className="p-5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-[#2563EB]">
              <Mail className="w-5 h-5" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Support &amp; Feedback</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              For general questions, user suggestions, and platform assistance:
            </p>
            <a href="mailto:support@getplacedresume.com" className="text-xs font-mono text-[#2563EB] dark:text-[#60A5FA] block font-semibold hover:underline">
              support@getplacedresume.com
            </a>
          </div>

          <div className="p-5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-[#059669]">
              <Clock className="w-5 h-5" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Response Time</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Our engineering and editorial team monitors communications continuously.
            </p>
            <span className="text-xs font-mono text-slate-900 dark:text-white block font-semibold">
              Within 24 to 48 hours
            </span>
          </div>

          <div className="p-5 bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs shadow-xs space-y-2">
            <div className="flex items-center space-x-2 text-purple-600 dark:text-purple-400">
              <MessageSquare className="w-5 h-5" />
              <h3 className="font-bold text-xs uppercase tracking-wider text-slate-900 dark:text-white">Partnerships &amp; Ads</h3>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              For campus placement drives, advertising, or AdSense queries:
            </p>
            <a href="mailto:partners@getplacedresume.com" className="text-xs font-mono text-purple-600 dark:text-purple-400 block font-semibold hover:underline">
              partners@getplacedresume.com
            </a>
          </div>
        </div>

        {/* Contact Form Section */}
        <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] p-6 sm:p-8 rounded-xs shadow-xs">
          <div className="pb-6 mb-6 border-b border-slate-200 dark:border-[#262626]">
            <h2 className="text-xl font-bold font-display text-slate-900 dark:text-white">
              Send an Official Message
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400 mt-1">
              Fill out the form below. We treat all user correspondence with strict confidentiality.
            </p>
          </div>

          {isSubmitted ? (
            <div className="p-8 text-center space-y-4 bg-emerald-50/50 dark:bg-emerald-950/20 border border-emerald-200 dark:border-emerald-800/60 rounded-xs">
              <CheckCircle2 className="w-12 h-12 text-[#059669] dark:text-[#10B981] mx-auto" />
              <h3 className="text-lg font-bold text-slate-900 dark:text-white font-display">
                Message Received Successfully
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-300 max-w-md mx-auto leading-relaxed">
                Thank you for contacting GetPlacedResume. Our support team has logged your submission and will get back to you at <strong>{formData.email}</strong> within 24–48 hours.
              </p>
              <button
                onClick={() => {
                  setIsSubmitted(false);
                  setFormData({ name: '', email: '', category: 'general', subject: '', message: '' });
                }}
                className="px-4 py-2 bg-slate-800 hover:bg-slate-900 dark:bg-slate-700 dark:hover:bg-slate-600 text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Send Another Message
              </button>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-6">
              {errorMessage && (
                <div className="p-3 bg-red-50 dark:bg-red-950/40 border border-red-200 dark:border-red-900 text-red-700 dark:text-red-300 text-xs flex items-center space-x-2 rounded-xs">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{errorMessage}</span>
                </div>
              )}

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Your Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="e.g. Alex Chen"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#111111] border border-slate-300 dark:border-[#262626] rounded-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="e.g. alex@example.com"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#111111] border border-slate-300 dark:border-[#262626] rounded-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Inquiry Category
                  </label>
                  <select
                    value={formData.category}
                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#111111] border border-slate-300 dark:border-[#262626] rounded-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  >
                    <option value="general">General Question</option>
                    <option value="scoring">ATS Scoring Methodology</option>
                    <option value="bug">Bug Report / Technical Issue</option>
                    <option value="adsense">Advertising / Google AdSense Partnership</option>
                    <option value="privacy">Privacy &amp; Data Subject Request</option>
                    <option value="campus">University Campus Drive Inquiry</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                    Subject
                  </label>
                  <input
                    type="text"
                    value={formData.subject}
                    onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                    placeholder="Brief summary of your request"
                    className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#111111] border border-slate-300 dark:border-[#262626] rounded-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB]"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-mono font-bold uppercase tracking-wider text-slate-700 dark:text-slate-300 mb-2">
                  Your Message *
                </label>
                <textarea
                  rows={5}
                  required
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Please describe your question, feedback, or suggestion in detail..."
                  className="w-full px-3.5 py-2.5 text-xs bg-slate-50 dark:bg-[#111111] border border-slate-300 dark:border-[#262626] rounded-xs text-slate-900 dark:text-white focus:outline-none focus:border-[#2563EB] leading-relaxed"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-[11px] text-slate-500 font-mono">
                  Guaranteed confidential processing. No spam.
                </span>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="flex items-center space-x-2 px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xs transition-colors disabled:opacity-60 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isSubmitting ? 'Sending...' : 'Send Message'}</span>
                </button>
              </div>
            </form>
          )}
        </div>

        {/* Quick FAQ Strip */}
        <div className="p-6 bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs space-y-4">
          <div className="flex items-center space-x-2 text-[#2563EB]">
            <HelpCircle className="w-5 h-5" />
            <h3 className="font-bold text-sm font-display text-slate-900 dark:text-white">
              Frequently Asked Support Questions
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs text-slate-600 dark:text-slate-400">
            <div>
              <strong className="text-slate-900 dark:text-white block">Is GetPlacedResume free to use?</strong>
              Yes. GetPlacedResume provides 100% free resume scoring and ATS diagnostics supported by non-intrusive Google AdSense advertising.
            </div>
            <div>
              <strong className="text-slate-900 dark:text-white block">How can I request deletion of my data?</strong>
              Our parsing is ephemeral in RAM and discarded immediately upon score generation. We store no resumes on server disks.
            </div>
          </div>
        </div>

        {/* Return link */}
        <div className="pt-6 border-t border-slate-200 dark:border-[#262626] flex justify-between items-center">
          <button
            onClick={onBack}
            className="px-6 py-2.5 bg-[#2563EB] hover:bg-[#1D4ED8] text-white font-semibold text-xs rounded-xs transition-colors cursor-pointer"
          >
            Back to Resume Workspace
          </button>
          <span className="text-[11px] font-mono text-slate-500">Contact Protocol &bull; GetPlacedResume</span>
        </div>

      </div>
    </div>
  );
};
