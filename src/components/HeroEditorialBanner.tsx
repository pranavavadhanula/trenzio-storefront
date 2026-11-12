import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HeroEditorialBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 3;
    const rotateX = -((y - centerY) / centerY) * 2;
    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, isHovered: false });
  };

  return (
    <section className="relative w-full select-none font-sans overflow-hidden bg-black border-b border-white/10">
      <div
        ref={bannerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[480px] sm:h-[580px] lg:h-[660px] overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        {/* 3D Moving / Parallax Background Image */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: tilt.isHovered
              ? `scale(1.04) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
              : 'scale(1) rotateX(0deg) rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src="/images/hero_banner.jpg"
            alt="Trevori Haute Streetwear - Models in Custom Hoodie and Graphic Tee by Luxury Vehicle"
            className="w-full h-full object-cover object-center filter brightness-95 contrast-110"
          />
        </div>

        {/* Ambient Dark Haute Vignette & Radial Atmospheric Glow */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/90 via-black/40 to-black/85 z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-transparent to-black/50 z-10" />

        {/* Specular Glare Follow */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: tilt.isHovered ? 1 : 0,
            background: `radial-gradient(circle 500px at ${tilt.glareX}% 40%, rgba(248, 131, 121, 0.18) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 75%)`,
            mixBlendMode: 'screen',
          }}
        />

        {/* Floating Official Trevori Monogram Crest Badge (Top Right) */}
        <div className="absolute top-6 right-6 sm:top-10 sm:right-10 z-30 flex items-center gap-3 bg-[#081220]/80 border border-[#F88379]/40 backdrop-blur-md py-2 px-3.5 shadow-[0_8px_30px_rgba(0,0,0,0.8)] group hover:border-[#F88379] transition-all">
          <img
            src="/images/trevori_logo.jpg"
            alt="Trevori Official Monogram Crest"
            className="w-10 h-10 sm:w-12 sm:h-12 object-contain mix-blend-screen drop-shadow-[0_0_12px_rgba(248,131,121,0.6)] group-hover:scale-110 transition-transform"
          />
          <div className="text-left font-sans">
            <span className="block text-[9px] uppercase tracking-[0.28em] text-[#F88379] font-black">
              Official Crest
            </span>
            <span className="block text-[11px] uppercase tracking-wider text-white font-extrabold">
              Trevori Monogram
            </span>
          </div>
        </div>

        {/* Foreground Content: Title, Badges, CTA */}
        <div className="relative z-30 h-full max-w-[1480px] mx-auto px-4 sm:px-10 lg:px-14 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-2xl">
            {/* Editorial Category Pill */}
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-black/70 border border-white/20 backdrop-blur-md text-[#F88379] text-[10px] sm:text-xs font-bold tracking-widest uppercase mb-4 shadow-lg">
              <Sparkles className="w-3.5 h-3.5 text-[#F88379]" />
              <span>PERSPECTIVE 2026 &bull; NEW SEASON DROP</span>
            </div>

            {/* Massive Haute Headline */}
            <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] leading-[1.05]">
              Wear Your Perspective
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-sm md:text-base text-slate-200 font-normal mt-3 max-w-xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Engineered with 400 GSM heavyweight French Terry, custom dropped shoulders, and the iconic Trevori rose-gold monogram emblem embroidered on the chest.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Link
                to="/collections/sweatshirts"
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-[#F88379] text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-none shadow-[0_4px_20px_rgba(248,131,121,0.5)] hover:bg-white hover:text-black transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Monogram Hoodies</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/collections/oversized-tees"
                className="px-6 sm:px-8 py-3 sm:py-3.5 bg-black/60 border border-white/30 text-white font-bold text-xs sm:text-sm uppercase tracking-widest rounded-none backdrop-blur-md hover:bg-white/10 hover:border-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Custom Tees</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
