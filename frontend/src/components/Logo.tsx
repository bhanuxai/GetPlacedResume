import React from 'react';

interface LogoProps {
  size?: number;
  showText?: boolean;
  className?: string;
  textClassName?: string;
  text?: string;
}

/**
 * GetPlacedResume Bespoke Brand Mark
 * Combines:
 * 1. Document Folio silhouette with architectural fold
 * 2. Monogram "R" representing Resume & Relevance
 * 3. Forward verification stride representing ATS pass & qualification
 * 4. Optical IQ precision node in cobalt-accent tint
 * Strictly adheres to zero-gradient and solid-color design system.
 */
export const LogoMark: React.FC<{ size?: number; className?: string }> = ({
  size = 36,
  className = ""
}) => {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 36 36"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`flex-shrink-0 select-none ${className}`}
      aria-label="GetPlacedResume Logo Mark"
    >
      {/* Outer Squircle Container - Solid Cobalt */}
      <rect width="36" height="36" rx="8" fill="#2563EB" />

      {/* Layer 1: Folio Sheet Underlay (Solid Navy accent for depth without gradients) */}
      <path
        d="M8.5 8C8.5 7.17157 9.17157 6.5 10 6.5H20.5L27.5 13.5V28C27.5 28.8284 26.8284 29.5 26 29.5H10C9.17157 29.5 8.5 28.8284 8.5 28V8Z"
        fill="#1D4ED8"
      />

      {/* Folio Fold Corner Geometry */}
      <path
        d="M20.5 6.5V13.5H27.5"
        fill="#1E40AF"
      />

      {/* Layer 2: Geometric Monogram "R" (Crisp Solid White) */}
      {/* Vertical Document Spine */}
      <rect x="12" y="10.5" width="2.8" height="15" rx="1.4" fill="#FFFFFF" />

      {/* Intelligence Loop (Upper Bowl of "R") */}
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M13.4 10.5H19.4C21.6 10.5 23.2 11.9 23.2 13.8C23.2 15.7 21.6 17.1 19.4 17.1H13.4V10.5ZM14.8 12.3H19.1C20.3 12.3 21.2 13 21.2 13.8C21.2 14.6 20.3 15.3 19.1 15.3H14.8V12.3Z"
        fill="#FFFFFF"
      />

      {/* Forward Verification Stride (Lower leg of "R" extending toward success) */}
      <path
        d="M17.5 16.5L23.2 25"
        stroke="#FFFFFF"
        strokeWidth="2.8"
        strokeLinecap="round"
      />

      {/* Optical IQ Precision Node (Accent Cyan/Light Blue) */}
      <circle cx="24" cy="10" r="1.6" fill="#93C5FD" />
    </svg>
  );
};

export const Logo: React.FC<LogoProps> = ({
  size = 36,
  showText = true,
  className = "",
  textClassName = "",
  text = "GetPlacedResume"
}) => {
  return (
    <div className={`flex items-center space-x-3 select-none ${className}`}>
      <LogoMark size={size} />
      {showText && (
        <span
          className={`text-2xl font-bold tracking-tight text-slate-900 dark:text-white font-display transition-colors ${textClassName}`}
        >
          {text}
        </span>
      )}
    </div>
  );
};
