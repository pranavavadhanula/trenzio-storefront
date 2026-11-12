import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles, Crown } from 'lucide-react';

export const TraditionalAttireShowcase: React.FC = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    setTilt({
      rotateX: -normY * 4,
      rotateY: normX * 4,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  };

  return (
    <section className="relative w-full px-4 sm:px-10 lg:px-14 max-w-[1480px] mx-auto select-none font-sans">
      {/* Outer 3D Perspective Wrapper */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full rounded-2xl overflow-hidden border-2 transition-all duration-300"
        style={{
          perspective: '1200px',
          borderColor: tilt.isHovered ? '#F88379' : 'rgba(30, 58, 102, 0.7)',
          boxShadow: tilt.isHovered
            ? '0 30px 80px rgba(0, 0, 0, 0.95), 0 0 50px rgba(248, 131, 121, 0.35)'
            : '0 20px 50px rgba(0, 0, 0, 0.8)',
        }}
      >
        <div
          className="relative min-h-[580px] sm:min-h-[660px] lg:min-h-[720px] w-full overflow-hidden will-change-transform"
          style={{
            transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.isHovered ? 1.01 : 1}, ${tilt.isHovered ? 1.01 : 1}, 1)`,
            transition: tilt.isHovered
              ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1)'
              : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          {/* Main High-Fashion Royal Traditional Photo */}
          <img
            src="/images/traditional_couture_with_logo.jpg"
            alt="Trevori Royal Traditional Couture - Men and Women Indian Ethnic Heritage Wear"
            className="absolute inset-0 w-full h-full object-cover object-[50%_25%] sm:object-center filter brightness-95 contrast-105 transition-transform duration-700 group-hover:scale-105"
          />

          {/* Luxury Ambient Shading Overlays */}
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/40 to-transparent" />
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07111E]/80 via-transparent to-transparent sm:max-w-3xl" />

          {/* Interactive Dynamic Glare Effect */}
          {tilt.isHovered && (
            <div
              className="pointer-events-none absolute inset-0 mix-blend-overlay opacity-30 transition-opacity duration-300"
              style={{
                background: `radial-gradient(circle 600px at ${tilt.glareX}% ${tilt.glareY}%, rgba(248, 131, 121, 0.4), transparent 70%)`,
              }}
            />
          )}

          {/* Main Content Layout Container */}
          <div className="absolute inset-0 z-20 flex flex-col justify-between p-6 sm:p-10 lg:p-14 pointer-events-none">
            {/* Top Row: Heritage Badge */}
            <div className="flex items-center gap-3 pointer-events-auto">
              <div className="flex items-center gap-2 px-3.5 py-1.5 bg-[#07111E]/85 backdrop-blur-md border border-[#F88379]/50 rounded-full shadow-[0_4px_16px_rgba(0,0,0,0.6)]">
                <Crown className="w-3.5 h-3.5 text-[#F88379]" />
                <span className="text-[10px] sm:text-xs font-bold tracking-[0.2em] uppercase text-[#F88379]">
                  HERITAGE COUTURE
                </span>
              </div>
            </div>

            {/* Bottom Content Area */}
            <div className="max-w-2xl pointer-events-auto">
              {/* Sub-badge */}
              <div className="flex items-center gap-2 mb-2 sm:mb-3">
                <Sparkles className="w-4 h-4 text-[#F88379]" />
                <span className="text-xs sm:text-sm font-semibold tracking-[0.25em] text-[#FA958D] uppercase">
                  TREVORI PERSPECTIVE 2026
                </span>
              </div>

              {/* Headline */}
              <h2 className="text-2xl sm:text-4xl lg:text-5xl font-black uppercase tracking-[0.04em] text-white leading-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)]">
                ROYAL TRADITIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F88379] via-[#FA958D] to-white">COUTURE</span>
              </h2>

              {/* Description */}
              <p className="mt-2.5 sm:mt-3 text-xs sm:text-sm md:text-base text-slate-200 font-normal leading-relaxed max-w-xl drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
                Bespoke midnight-navy velvet Bandhgalas, handcrafted Zardozi zari lehengas, and architectural royal silhouettes engineered for timeless celebration.
              </p>

              {/* Feature Pills */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 mt-3 sm:mt-4 text-[10px] sm:text-xs text-slate-300 font-medium">
                <span className="px-2.5 py-1 bg-[#0A1728]/85 border border-white/15 backdrop-blur-sm">
                  ✦ Handcrafted Zardozi
                </span>
                <span className="px-2.5 py-1 bg-[#0A1728]/85 border border-white/15 backdrop-blur-sm">
                  ✦ Royal Velvet & Raw Silk
                </span>
                <span className="px-2.5 py-1 bg-[#0A1728]/85 border border-white/15 backdrop-blur-sm">
                  ✦ Tailored Bespoke Drape
                </span>
              </div>

              {/* Action CTA Buttons */}
              <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-5 sm:mt-7">
                <Link
                  to="/collections/traditional-men"
                  className="px-5 sm:px-7 py-3 sm:py-3.5 bg-[#F88379] hover:bg-[#FA958D] text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_6px_24px_rgba(248,131,121,0.5)] transition-all flex items-center gap-2 group cursor-pointer"
                >
                  <span>Men's Traditional</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>

                <Link
                  to="/collections/traditional-women"
                  className="px-5 sm:px-7 py-3 sm:py-3.5 bg-[#071324]/85 hover:bg-white hover:text-black border border-white/30 text-white font-bold text-xs sm:text-sm uppercase tracking-widest backdrop-blur-md transition-all flex items-center gap-2 cursor-pointer"
                >
                  <span>Women's Traditional</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1.5 transition-transform" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
