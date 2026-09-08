import React, { useEffect, useState } from 'react';
import { motion, useAnimation } from 'framer-motion';

export interface CircularTextProps {
  text?: string;
  spinDuration?: number;
  onHover?: 'speedUp' | 'slowDown' | 'pause' | 'goBonkers';
  className?: string;
}

export const CircularText: React.FC<CircularTextProps> = ({
  text = 'GETPLACEDRESUME ✦ ATS VERIFIED ✦ ',
  spinDuration = 20,
  onHover = 'speedUp',
  className = ''
}) => {
  const letters = Array.from(text);
  const controls = useAnimation();
  const [currentRotation, setCurrentRotation] = useState(0);

  useEffect(() => {
    controls.start({
      rotate: currentRotation + 360,
      scale: 1,
      transition: {
        ease: 'linear',
        duration: spinDuration,
        repeat: Infinity
      }
    });
  }, [spinDuration, controls, onHover, text]);

  const handleHoverStart = () => {
    if (!onHover) return;
    switch (onHover) {
      case 'slowDown':
        controls.start({
          rotate: currentRotation + 360,
          scale: 1,
          transition: {
            ease: 'linear',
            duration: spinDuration * 2.5,
            repeat: Infinity
          }
        });
        break;
      case 'speedUp':
        controls.start({
          rotate: currentRotation + 360,
          scale: 1,
          transition: {
            ease: 'linear',
            duration: Math.max(spinDuration / 4, 2),
            repeat: Infinity
          }
        });
        break;
      case 'pause':
        controls.stop();
        break;
      case 'goBonkers':
        controls.start({
          rotate: currentRotation + 360,
          scale: 1.05,
          transition: {
            ease: 'linear',
            duration: Math.max(spinDuration / 15, 0.8),
            repeat: Infinity
          }
        });
        break;
      default:
        break;
    }
  };

  const handleHoverEnd = () => {
    controls.start({
      rotate: currentRotation + 360,
      scale: 1,
      transition: {
        ease: 'linear',
        duration: spinDuration,
        repeat: Infinity
      }
    });
  };

  return (
    <motion.div
      initial={{ rotate: 0 }}
      className={`circular-text relative rounded-full select-none cursor-pointer ${className}`}
      animate={controls}
      onUpdate={(latest: any) => {
        if (latest && latest.rotate !== undefined) {
          setCurrentRotation(Number(latest.rotate) || 0);
        }
      }}
      onMouseEnter={handleHoverStart}
      onMouseLeave={handleHoverEnd}
    >
      {letters.map((letter, i) => {
        const rotation = (360 / letters.length) * i;
        const transform = `rotate(${rotation}deg)`;

        return (
          <span
            key={i}
            className="absolute inset-0 flex items-start justify-center text-center font-display font-bold origin-center"
            style={{
              transform,
              WebkitTransform: transform
            }}
          >
            {letter}
          </span>
        );
      })}
    </motion.div>
  );
};

export default CircularText;
