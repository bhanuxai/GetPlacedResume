import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export interface TextCursorProps {
  text: string;
  spacing?: number;
  followMouseDirection?: boolean;
  randomFloat?: boolean;
  exitDuration?: number;
  removalInterval?: number;
  maxPoints?: number;
  className?: string;
  children?: React.ReactNode;
}

interface TrailItem {
  id: number;
  x: number;
  y: number;
  angle: number;
  randomX?: number;
  randomY?: number;
  randomRotate?: number;
}

export const TextCursor: React.FC<TextCursorProps> = ({
  text = 'Hello!',
  spacing = 80,
  followMouseDirection = true,
  randomFloat = true,
  exitDuration = 0.3,
  removalInterval = 20,
  maxPoints = 10,
  className = '',
  children
}) => {
  const [trail, setTrail] = useState<TrailItem[]>([]);
  const containerRef = useRef<HTMLDivElement>(null);
  const lastMoveTimeRef = useRef<number>(Date.now());
  const idCounter = useRef<number>(0);

  const handleMouseMove = (e: MouseEvent) => {
    let mouseX = e.clientX;
    let mouseY = e.clientY;

    if (containerRef.current) {
      const rect = containerRef.current.getBoundingClientRect();
      if (rect.left !== 0 || rect.top !== 0) {
        mouseX = e.clientX - rect.left;
        mouseY = e.clientY - rect.top;
      }
    }

    setTrail(prev => {
      let newTrail = [...prev];
      if (newTrail.length === 0) {
        newTrail.push({
          id: idCounter.current++,
          x: mouseX,
          y: mouseY,
          angle: 0,
          ...(randomFloat && {
            randomX: Math.random() * 10 - 5,
            randomY: Math.random() * 10 - 5,
            randomRotate: Math.random() * 10 - 5
          })
        });
      } else {
        const last = newTrail[newTrail.length - 1];
        const dx = mouseX - last.x;
        const dy = mouseY - last.y;
        const distance = Math.sqrt(dx * dx + dy * dy);
        if (distance >= spacing) {
          let rawAngle = (Math.atan2(dy, dx) * 180) / Math.PI;
          rawAngle = ((rawAngle + 180) % 360) - 180;

          const computedAngle = followMouseDirection ? rawAngle : 0;
          const steps = Math.floor(distance / spacing);
          for (let i = 1; i <= steps; i++) {
            const t = (spacing * i) / distance;
            const newX = last.x + dx * t;
            const newY = last.y + dy * t;
            newTrail.push({
              id: idCounter.current++,
              x: newX,
              y: newY,
              angle: computedAngle,
              ...(randomFloat && {
                randomX: Math.random() * 10 - 5,
                randomY: Math.random() * 10 - 5,
                randomRotate: Math.random() * 10 - 5
              })
            });
          }
        }
      }
      if (newTrail.length > maxPoints) {
        newTrail = newTrail.slice(newTrail.length - maxPoints);
      }
      return newTrail;
    });
    lastMoveTimeRef.current = Date.now();
  };

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove, { passive: true });
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, [spacing, followMouseDirection, randomFloat, maxPoints]);

  useEffect(() => {
    const interval = setInterval(() => {
      if (Date.now() - lastMoveTimeRef.current > 100) {
        setTrail(prev => (prev.length > 0 ? prev.slice(1) : prev));
      }
    }, removalInterval);
    return () => clearInterval(interval);
  }, [removalInterval]);

  return (
    <div
      ref={containerRef}
      className={`pointer-events-none fixed inset-0 z-50 overflow-hidden select-none ${className}`.trim()}
      aria-hidden="true"
    >
      <div className="absolute inset-0 pointer-events-none">
        <AnimatePresence>
          {trail.map(item => (
            <motion.div
              key={item.id}
              initial={{ opacity: 0, scale: 0.8, rotate: item.angle }}
              animate={{
                opacity: 1,
                scale: 1,
                x: randomFloat ? [0, item.randomX || 0, 0] : 0,
                y: randomFloat ? [0, item.randomY || 0, 0] : 0,
                rotate: randomFloat ? [item.angle, item.angle + (item.randomRotate || 0), item.angle] : item.angle
              }}
              exit={{ opacity: 0, scale: 0 }}
              transition={{
                opacity: { duration: exitDuration, ease: 'easeOut' },
                ...(randomFloat && {
                  x: {
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'mirror'
                  },
                  y: {
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'mirror'
                  },
                  rotate: {
                    duration: 2,
                    ease: 'easeInOut',
                    repeat: Infinity,
                    repeatType: 'mirror'
                  }
                })
              }}
              className="absolute select-none whitespace-nowrap text-sm sm:text-base font-bold font-display tracking-tight text-slate-800 dark:text-slate-200 pointer-events-none drop-shadow-sm bg-white/80 dark:bg-black/80 px-2 py-0.5 rounded-full border border-slate-300 dark:border-[#262626] backdrop-blur-xs"
              style={{ left: item.x, top: item.y }}
            >
              {text}
            </motion.div>
          ))}
        </AnimatePresence>
      </div>
      {children}
    </div>
  );
};

export default TextCursor;
