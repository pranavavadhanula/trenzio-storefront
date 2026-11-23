import React, { useMemo } from 'react';

interface LuxurySnowfallProps {
  count?: number;
  className?: string;
  isContainerRelative?: boolean;
}

interface SnowflakeConfig {
  id: number;
  x: number;
  size: number;
  duration: number;
  delay: number;
  swayDuration: number;
  swayDistance: number;
  opacity: number;
  blur: number;
  glow: number;
}

export const LuxurySnowfall: React.FC<LuxurySnowfallProps> = ({
  count = 28,
  className = '',
  isContainerRelative = false,
}) => {
  // Generate deterministic particles to avoid hydration mismatches and unnecessary re-renders
  const snowflakes = useMemo<SnowflakeConfig[]>(() => {
    // Deterministic pseudo-random seed sequence
    const pseudoRandom = (seed: number) => {
      const x = Math.sin(seed * 9999) * 10000;
      return x - Math.floor(x);
    };

    return Array.from({ length: count }, (_, i) => {
      const r1 = pseudoRandom(i + 1);
      const r2 = pseudoRandom(i + 2);
      const r3 = pseudoRandom(i + 3);
      const r4 = pseudoRandom(i + 4);
      const r5 = pseudoRandom(i + 5);

      // Sizes: between 2px and 5px with subtle realistic variation
      const size = Math.round((2 + r1 * 2.8) * 10) / 10;
      // Duration: 14s to 26s (slow, tranquil luxury snowfall)
      const duration = Math.round((14 + r2 * 12) * 10) / 10;
      // Negative delays: so particles are already dispersed and falling immediately on page load
      const delay = -Math.round(r3 * duration * 10) / 10;
      // Gentle horizontal sway: 10px to 24px
      const swayDuration = Math.round((3.5 + r4 * 3.5) * 10) / 10;
      const swayDistance = Math.round(10 + r1 * 14);
      // Soft opacity: 0.35 to 0.85
      const opacity = Math.round((0.35 + r5 * 0.45) * 100) / 100;
      // Photographic depth blur: subtle blur for a few background particles
      const blur = size > 3.8 ? 0.8 : size < 2.5 ? 0.4 : 0;
      // Soft glow: subtle aura
      const glow = size > 3.2 ? 3 : 1.5;

      return {
        id: i,
        x: Math.round(r4 * 98 * 10) / 10, // 0% to 98%
        size,
        duration,
        delay,
        swayDuration,
        swayDistance,
        opacity,
        blur,
        glow,
      };
    });
  }, [count]);

  return (
    <>
      <style>{`
        @keyframes luxurySnowFallViewport {
          0% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(105vh);
          }
        }
        @keyframes luxurySnowFallContainer {
          0% {
            transform: translateY(-20px);
          }
          100% {
            transform: translateY(105%);
          }
        }
        @keyframes luxurySnowSway {
          0% {
            margin-left: -12px;
          }
          100% {
            margin-left: 12px;
          }
        }
        @media (prefers-reduced-motion: reduce) {
          .luxury-snow-particle {
            display: none !important;
          }
        }
      `}</style>
      <div
        className={`pointer-events-none select-none overflow-hidden ${
          isContainerRelative ? 'absolute inset-0 z-20' : 'fixed inset-0 z-0'
        } ${className}`}
        aria-hidden="true"
      >
        {snowflakes.map((flake) => (
          <span
            key={flake.id}
            className="luxury-snow-particle absolute rounded-full bg-[#FFFFFF]"
            style={{
              left: `${flake.x}%`,
              top: 0,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              opacity: flake.opacity,
              filter: flake.blur > 0 ? `blur(${flake.blur}px)` : undefined,
              boxShadow: `0 0 ${flake.glow}px rgba(255, 255, 255, 0.85)`,
              animation: `${
                isContainerRelative ? 'luxurySnowFallContainer' : 'luxurySnowFallViewport'
              } ${flake.duration}s linear ${flake.delay}s infinite, luxurySnowSway ${
                flake.swayDuration
              }s ease-in-out infinite alternate`,
              willChange: 'transform',
            }}
          />
        ))}
      </div>
    </>
  );
};
