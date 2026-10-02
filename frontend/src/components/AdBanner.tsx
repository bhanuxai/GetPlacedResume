import React, { useEffect, useRef } from 'react';

interface AdBannerProps {
  slotId?: string;
  format?: 'auto' | 'horizontal' | 'rectangle';
  className?: string;
}

declare global {
  interface Window {
    adsbygoogle?: any[];
  }
}

export const AdBanner: React.FC<AdBannerProps> = ({
  slotId,
  format = 'auto',
  className = ''
}) => {
  const adRef = useRef<HTMLModElement | null>(null);
  const isLoaded = useRef(false);

  // During site review phase or when no production slot is provided, don't display dummy empty boxes
  const isValidSlot = slotId && slotId !== '1234567890' && /^\d{10,}$/.test(slotId);

  useEffect(() => {
    if (!isValidSlot) return;
    try {
      if (typeof window !== 'undefined' && !isLoaded.current) {
        (window.adsbygoogle = window.adsbygoogle || []).push({});
        isLoaded.current = true;
      }
    } catch (e) {
      // Ignore adsbygoogle errors during development or pending site review
    }
  }, [isValidSlot]);

  if (!isValidSlot) {
    return null;
  }

  return (
    <div className={`w-full max-w-5xl mx-auto my-8 px-4 sm:px-6 transition-colors ${className}`}>
      <div className="bg-slate-50 dark:bg-[#0A0A0A] border border-slate-200 dark:border-[#262626] rounded-xs p-3 text-center overflow-hidden">
        {/* Compliant AdSense Label */}
        <div className="text-[10px] font-mono tracking-widest text-slate-400 dark:text-slate-500 uppercase mb-2">
          Advertisement
        </div>

        {/* AdSense Unit */}
        <div className="min-h-[90px] flex items-center justify-center">
          <ins
            ref={adRef}
            className="adsbygoogle"
            style={{ display: 'block', textAlign: 'center', width: '100%' }}
            data-ad-client="ca-pub-9348521072257318"
            data-ad-slot={slotId}
            data-ad-format={format}
            data-full-width-responsive="true"
          />
        </div>
      </div>
    </div>
  );
};
