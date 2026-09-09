import React from 'react';
import './GlareHover.css';

export interface GlareHoverProps {
  width?: string;
  height?: string;
  background?: string;
  borderRadius?: string;
  borderColor?: string;
  children?: React.ReactNode;
  glareColor?: string;
  glareOpacity?: number;
  glareAngle?: number;
  glareSize?: number;
  transitionDuration?: number;
  playOnce?: boolean;
  className?: string;
  style?: React.CSSProperties;
  onClick?: (e: React.MouseEvent<any>) => void;
  disabled?: boolean;
  as?: 'div' | 'button';
  type?: 'button' | 'submit' | 'reset';
}

const GlareHover: React.FC<GlareHoverProps> = ({
  width = 'auto',
  height = 'auto',
  background = '#000',
  borderRadius = '10px',
  borderColor = '#333',
  children,
  glareColor = '#ffffff',
  glareOpacity = 0.5,
  glareAngle = -45,
  glareSize = 250,
  transitionDuration = 650,
  playOnce = false,
  className = '',
  style = {},
  onClick,
  disabled = false,
  as = 'div',
  type = 'button'
}) => {
  const hex = glareColor.replace('#', '');
  let rgba = glareColor;
  if (/^[0-9A-Fa-f]{6}$/.test(hex)) {
    const r = parseInt(hex.slice(0, 2), 16);
    const g = parseInt(hex.slice(2, 4), 16);
    const b = parseInt(hex.slice(4, 6), 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  } else if (/^[0-9A-Fa-f]{3}$/.test(hex)) {
    const r = parseInt(hex[0] + hex[0], 16);
    const g = parseInt(hex[1] + hex[1], 16);
    const b = parseInt(hex[2] + hex[2], 16);
    rgba = `rgba(${r}, ${g}, ${b}, ${glareOpacity})`;
  }

  const vars: React.CSSProperties & { [k: string]: string } = {
    '--gh-width': width,
    '--gh-height': height,
    '--gh-bg': background,
    '--gh-br': borderRadius,
    '--gh-angle': `${glareAngle}deg`,
    '--gh-duration': `${transitionDuration}ms`,
    '--gh-size': `${glareSize}%`,
    '--gh-rgba': rgba,
    '--gh-border': borderColor
  };

  const combinedClass = `glare-hover ${playOnce ? 'glare-hover--play-once' : ''} ${className} ${disabled ? 'opacity-50 cursor-not-allowed' : ''}`;

  if (as === 'button') {
    return (
      <button
        type={type}
        disabled={disabled}
        onClick={onClick}
        className={combinedClass}
        style={{ ...vars, ...style } as React.CSSProperties}
      >
        <div className="relative z-10 w-full h-full flex items-center justify-center pointer-events-none">
          {children}
        </div>
      </button>
    );
  }

  return (
    <div
      onClick={disabled ? undefined : onClick}
      className={combinedClass}
      style={{ ...vars, ...style } as React.CSSProperties}
      role={onClick ? 'button' : undefined}
      tabIndex={onClick && !disabled ? 0 : undefined}
    >
      <div className="relative z-10 w-full h-full flex items-center justify-center">
        {children}
      </div>
    </div>
  );
};

export default GlareHover;
