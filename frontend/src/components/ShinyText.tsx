import React, { useState, useRef, useEffect, useCallback } from 'react';
import { motion, useMotionValue, useTransform, useAnimationFrame } from 'framer-motion';

export interface ShinyTextProps {
  text: string;
  disabled?: boolean;
  speed?: number;
  className?: string;
  color?: string;
  shineColor?: string;
  spread?: number;
  yoyo?: boolean;
  pauseOnHover?: boolean;
  direction?: 'left' | 'right';
  delay?: number;
}

export const ShinyText: React.FC<ShinyTextProps> = ({
  text,
  disabled = false,
  speed = 2,
  className = '',
  color = '#b5b5b5',
  shineColor = '#ffffff',
  spread = 120,
  yoyo = false,
  pauseOnHover = false,
  direction = 'left',
  delay = 0
}) => {
  const [isPaused, setIsPaused] = useState(false);
  const progress = useMotionValue(0);
  const elapsed = useRef(0);
  const lastTime = useRef<number | null>(null);
  const dir = useRef(direction === 'left' ? 1 : -1);

  const durationMs = speed * 1000;
  const delayMs = delay * 1000;

  useAnimationFrame((time) => {
    if (disabled || isPaused) {
      lastTime.current = null;
      return;
    }
    if (lastTime.current === null) {
      lastTime.current = time;
      return;
    }
    const delta = time - lastTime.current;
    lastTime.current = time;
    elapsed.current += delta;

    if (yoyo) {
      const cycle = durationMs + delayMs;
      const totalCycle = cycle * 2;
      const t = elapsed.current % totalCycle;
      if (t < durationMs) {
        const p = (t / durationMs) * 100;
        progress.set(dir.current === 1 ? p : 100 - p);
      } else if (t < cycle) {
        progress.set(dir.current === 1 ? 100 : 0);
      } else if (t < cycle + durationMs) {
        const p = 100 - ((t - cycle) / durationMs) * 100;
        progress.set(dir.current === 1 ? p : 100 - p);
      } else {
        progress.set(dir.current === 1 ? 0 : 100);
      }
    } else {
      const cycle = durationMs + delayMs;
      const t = elapsed.current % cycle;
      if (t < durationMs) {
        const p = (t / durationMs) * 100;
        progress.set(dir.current === 1 ? p : 100 - p);
      } else {
        progress.set(dir.current === 1 ? 100 : 0);
      }
    }
  });

  useEffect(() => {
    dir.current = direction === 'left' ? 1 : -1;
    elapsed.current = 0;
    progress.set(0);
  }, [direction, progress]);

  const backgroundPosition = useTransform(progress, (p) => `${150 - p * 2}% center`);

  const handleMouseEnter = useCallback(() => {
    if (pauseOnHover) setIsPaused(true);
  }, [pauseOnHover]);

  const handleMouseLeave = useCallback(() => {
    if (pauseOnHover) setIsPaused(false);
  }, [pauseOnHover]);

  const gradientStyle: React.CSSProperties = {
    backgroundImage: `linear-gradient(${spread}deg, ${color} 0%, ${color} 35%, ${shineColor} 50%, ${color} 65%, ${color} 100%)`,
    backgroundSize: '200% auto',
    WebkitBackgroundClip: 'text',
    backgroundClip: 'text',
    WebkitTextFillColor: 'transparent'
  };

  return (
    <motion.span
      className={`inline-block ${className}`.trim()}
      style={{
        ...gradientStyle,
        backgroundPosition
      }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {text}
    </motion.span>
  );
};

export default ShinyText;
