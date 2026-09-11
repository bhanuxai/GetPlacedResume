import React, { useState } from 'react';
import { X, Star, CheckCircle2, MessageSquarePlus, Send } from 'lucide-react';

interface FeedbackModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const API_BASE_URL = 
  import.meta.env.VITE_API_URL || 
  (import.meta.env.PROD 
    ? 'https://getplacedresume-backend.onrender.com' 
    : 'http://localhost:8000');

export const FeedbackModal: React.FC<FeedbackModalProps> = ({ isOpen, onClose }) => {
  const [rating, setRating] = useState<number>(5);
  const [hoverRating, setHoverRating] = useState<number>(0);
  const [satisfaction, setSatisfaction] = useState<string>('Very Helpful');
  const [category, setCategory] = useState<string>('general');
  const [feedbackText, setFeedbackText] = useState<string>('');
  const [email, setEmail] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isSubmitted, setIsSubmitted] = useState<boolean>(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  if (!isOpen) return null;

  const satisfactionOptions = [
    { label: 'Spot on & Accurate', value: 'Spot On' },
    { label: 'Very Helpful', value: 'Very Helpful' },
    { label: 'Good, Needs Tweaks', value: 'Needs Tweaks' },
    { label: 'Needs Improvement', value: 'Needs Work' },
  ];

  const categories = [
    { label: 'General Experience', value: 'general' },
    { label: 'Requirement Matching', value: 'requirements' },
    { label: 'Scoring Fairness', value: 'scoring' },
    { label: 'UI & Design', value: 'ui' },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!feedbackText.trim()) {
      setErrorMsg('Please share a few words on your experience or suggestions.');
      return;
    }

    setIsSubmitting(true);
    setErrorMsg(null);

    const payload = {
      rating,
      satisfaction,
      category,
      feedback_text: feedbackText.trim(),
      email: email.trim() || undefined,
    };

    try {
      const saved = JSON.parse(localStorage.getItem('getplaced_user_reviews') || '[]');
      saved.push({ ...payload, date: new Date().toISOString() });
      localStorage.setItem('getplaced_user_reviews', JSON.stringify(saved));

      const res = await fetch(`${API_BASE_URL}/api/feedback`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });

      if (res.status === 429) {
        throw new Error('Too many submissions. Please wait a moment before submitting feedback again.');
      }

      setIsSubmitted(true);
    } catch (err: any) {
      setErrorMsg(err.message || 'Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResetAndClose = () => {
    setIsSubmitted(false);
    setFeedbackText('');
    setEmail('');
    setRating(5);
    setErrorMsg(null);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div className="bg-white dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs max-w-lg w-full p-6 sm:p-7 shadow-2xl relative transition-colors">
        
        <button
          onClick={handleResetAndClose}
          className="absolute top-4 right-4 text-slate-400 hover:text-slate-600 dark:hover:text-white transition-colors cursor-pointer"
          aria-label="Close"
        >
          <X className="w-5 h-5" />
        </button>

        {isSubmitted ? (
          <div className="text-center py-6 space-y-4">
            <div className="w-12 h-12 rounded-full bg-emerald-100 dark:bg-emerald-950/60 border border-emerald-300 dark:border-emerald-700/60 mx-auto flex items-center justify-center text-emerald-600 dark:text-emerald-400">
              <CheckCircle2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold font-display text-slate-900 dark:text-white">
              Thank You for Your Review!
            </h3>
            <p className="text-xs text-slate-600 dark:text-slate-400 max-w-sm mx-auto leading-relaxed">
              Your suggestions and feedback help us refine our ATS semantic parsers, scoring algorithms, and user experience.
            </p>
            <div className="pt-2">
              <button
                onClick={handleResetAndClose}
                className="px-5 py-2 bg-[#2563EB] hover:bg-blue-700 text-white text-xs font-semibold rounded-xs transition-colors cursor-pointer"
              >
                Done
              </button>
            </div>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="space-y-4">
            
            <div>
              <div className="inline-flex items-center space-x-1.5 px-2.5 py-0.5 rounded-full bg-blue-50 dark:bg-blue-950/60 border border-blue-200 dark:border-blue-800/60 text-blue-700 dark:text-blue-300 font-mono text-[10px] font-bold uppercase tracking-wider mb-2">
                <MessageSquarePlus className="w-3 h-3" />
                <span>User Review & Suggestions</span>
              </div>
              <h2 className="text-lg sm:text-xl font-bold font-display text-slate-900 dark:text-white tracking-tight">
                How is GetPlacedResume working for you?
              </h2>
              <p className="text-xs text-slate-500 dark:text-[#94A3B8] mt-1">
                We value your input! Share your review, suggestions, or ideas for improving our evaluation engine.
              </p>
            </div>

            <div className="pt-1">
              <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Overall Rating
              </label>
              <div className="flex items-center space-x-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    className="p-1 text-slate-300 dark:text-[#262626] transition-colors focus:outline-hidden cursor-pointer"
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        (hoverRating || rating) >= star
                          ? 'fill-amber-400 text-amber-400'
                          : 'fill-transparent text-slate-300 dark:text-slate-700'
                      }`}
                    />
                  </button>
                ))}
                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 ml-2 font-mono">
                  {rating === 5 ? '5/5 — Excellent' : rating === 4 ? '4/5 — Great' : rating === 3 ? '3/5 — Good' : rating === 2 ? '2/5 — Fair' : '1/5 — Poor'}
                </span>
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Your Experience
              </label>
              <div className="grid grid-cols-2 gap-2">
                {satisfactionOptions.map((opt) => (
                  <button
                    key={opt.value}
                    type="button"
                    onClick={() => setSatisfaction(opt.value)}
                    className={`px-3 py-1.5 text-xs rounded-xs border text-left font-medium transition-colors cursor-pointer ${
                      satisfaction === opt.value
                        ? 'bg-blue-50 dark:bg-blue-950/60 border-blue-600 text-blue-700 dark:text-blue-300 font-bold'
                        : 'bg-slate-50 dark:bg-[#000000] border-slate-200 dark:border-[#262626] text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {opt.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Feedback Focus
              </label>
              <div className="flex flex-wrap gap-1.5">
                {categories.map((cat) => (
                  <button
                    key={cat.value}
                    type="button"
                    onClick={() => setCategory(cat.value)}
                    className={`px-2.5 py-1 text-[11px] font-mono uppercase rounded-xs border transition-colors cursor-pointer ${
                      category === cat.value
                        ? 'bg-[#2563EB] text-white border-[#2563EB]'
                        : 'bg-slate-100 dark:bg-[#000000] text-slate-600 dark:text-slate-400 border-slate-300 dark:border-[#262626]'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 dark:text-slate-300 mb-1.5">
                Any Suggestions or Improvements? <span className="text-red-500">*</span>
              </label>
              <textarea
                value={feedbackText}
                onChange={(e) => setFeedbackText(e.target.value)}
                placeholder="Tell us how the analysis worked, what features you'd like to see, or any requirements that felt mismatched..."
                rows={3}
                required
                className="w-full p-2.5 bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] rounded-xs text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-hidden transition-colors resize-none"
              />
            </div>

            <div>
              <label className="block text-[11px] font-mono uppercase font-bold text-slate-700 dark:text-slate-300 mb-1">
                Your Email <span className="text-[10px] text-slate-400 font-normal lowercase">(optional, for updates)</span>
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full p-2 bg-slate-50 dark:bg-[#000000] border border-slate-300 dark:border-[#262626] rounded-xs text-xs text-slate-900 dark:text-white placeholder-slate-400 focus:border-blue-500 focus:outline-hidden transition-colors"
              />
            </div>

            {errorMsg && (
              <p className="text-xs text-red-600 dark:text-red-400">{errorMsg}</p>
            )}

            <div className="pt-2 flex items-center justify-end space-x-2.5">
              <button
                type="button"
                onClick={handleResetAndClose}
                className="px-3.5 py-2 text-xs font-semibold text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white transition-colors cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-2 bg-[#2563EB] hover:bg-blue-700 text-white font-semibold text-xs rounded-xs transition-colors flex items-center space-x-1.5 cursor-pointer shadow-xs disabled:opacity-50"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isSubmitting ? 'Submitting...' : 'Submit Review'}</span>
              </button>
            </div>

          </form>
        )}

      </div>
    </div>
  );
};
