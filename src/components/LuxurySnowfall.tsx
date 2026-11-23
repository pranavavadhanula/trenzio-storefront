import React, { useMemo } from 'react';

interface LuxurySnowfallProps {
  count?: number;
  className?: string;
  isContainerRelative?: boolean;
  theme?: 'dark-particles' | 'light-particles';
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
  color: string;
  blur: number;
  shadow: string;
}

export const LuxurySnowfall: React.FC<LuxurySnowfallProps> = ({
  count = 32,
  className = '',
  isContainerRelative = false,
  theme,
}) => {
  // Determine effective theme: if not explicitly passed, default outer background to dark-particles for high visibility on light bg
  const effectiveTheme = theme || (isContainerRelative ? 'light-particles' : 'dark-particles');

  // Generate deterministic particles to avoid hydration mismatches and unnecessary re-renders
  const snowflakes = useMemo<SnowflakeConfig[]>(() => {
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

      // Sizes: between 3px and 6.5px so snowflakes are clearly visible to customers
      const size = Math.round((2.8 + r1 * 3.4) * 10) / 10;
      // Duration: 12s to 22s (smooth, natural snowfall)
      const duration = Math.round((12 + r2 * 10) * 10) / 10;
      // Negative delays: particles already active on load
      const delay = -Math.round(r3 * duration * 10) / 10;
      // Sway parameters
      const swayDuration = Math.round((3 + r4 * 3) * 10) / 10;
      const swayDistance = Math.round(12 + r1 * 16);
      // High visibility opacity: 0.65 to 0.95
      const opacity = Math.round((0.65 + r5 * 0.3) * 100) / 100;
      // Slight photographic depth blur
      const blur = size > 5.5 ? 0.6 : size < 3.2 ? 0.3 : 0;

      // Color and shadow based on theme:
      let color: string;
      let shadow: string;

      if (effectiveTheme === 'dark-particles') {
        // Darker luxury slate-charcoal tones with crisp contrast against #EAE8E4
        const shades = ['#3D3833', '#4E473F', '#5F574E', '#2E2A26'];
        color = shades[i % shades.length];
        shadow = `0 1px 3px rgba(0, 0, 0, 0.25), 0 0 2px rgba(61, 56, 51, 0.4)`;
      } else {
        // Crisp white and glowing ivory over dark panels (e.g. red campaign photo)
        color = '#FFFFFF';
        shadow = `0 0 4px rgba(255, 255, 255, 0.95), 0 0 8px rgba(255, 255, 255, 0.6)`;
      }

      return {
        id: i,
        x: Math.round(r4 * 98 * 10) / 10,
        size,
        duration,
        delay,
        swayDuration,
        swayDistance,
        opacity,
        color,
        blur,
        shadow,
      };
    });
  }, [count, effectiveTheme]);

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
            margin-left: -14px;
          }
          100% {
            margin-left: 14px;
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
            className="luxury-snow-particle absolute rounded-full"
            style={{
              left: `${flake.x}%`,
              top: 0,
              width: `${flake.size}px`,
              height: `${flake.size}px`,
              backgroundColor: flake.color,
              opacity: flake.opacity,
              filter: flake.blur > 0 ? `blur(${flake.blur}px)` : undefined,
              boxShadow: flake.shadow,
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
