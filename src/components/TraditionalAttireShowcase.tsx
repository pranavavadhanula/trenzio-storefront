import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const TraditionalAttireShowcase: React.FC = () => {
  return (
    <section className="relative w-full select-none font-sans overflow-hidden bg-black">
      {/* 100% Full-Bleed Edge-to-Edge Container (Covers Left & Right Corners With Zero Gaps) */}
      <div className="relative w-full h-[600px] sm:h-[740px] lg:h-[860px] overflow-hidden">
        {/* Clean Ultra-High-Resolution Royal Traditional Photo Without Any Logo Overlays */}
        <img
          src="/images/traditional_couture_banner.jpg"
          alt="Trevori Royal Traditional Couture - Men's and Women's Indian Heritage Wear"
          className="w-full h-full object-cover object-[50%_25%] sm:object-center filter brightness-95 contrast-105"
        />

        {/* Cinematic Midnight Shading & Ambient Vignette Matching Dark Blue Website Theme */}
        <div className="pointer-events-none absolute inset-0 bg-[#07111E]/25 mix-blend-multiply z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/40 to-[#07111E]/15 z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07111E]/75 via-transparent to-transparent z-10" />

        {/* Clean Minimal Foreground Content: Headline, Description & Action CTAs */}
        <div className="relative z-20 h-full max-w-[1480px] mx-auto px-4 sm:px-10 lg:px-14 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-2xl">
            {/* Bold Headline */}
            <h2 className="font-sans text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-black uppercase tracking-[0.05em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-[1.05]">
              ROYAL TRADITIONAL <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#F88379] via-[#FA958D] to-white">COUTURE</span>
            </h2>

            {/* Clean Subtitle */}
            <p className="text-xs sm:text-base md:text-lg text-slate-100 font-normal mt-3 sm:mt-4 max-w-xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Bespoke midnight-navy royal velvet Bandhgalas, handcrafted Zardozi zari lehengas, and architectural royal Indian silhouettes engineered for timeless celebration.
            </p>

            {/* Action CTA Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Link
                to="/collections/traditional-men"
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#F88379] text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest shadow-[0_4px_20px_rgba(248,131,121,0.5)] hover:bg-white hover:text-black transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Men's Traditional</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/collections/traditional-women"
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-black/60 border border-white/40 text-white font-bold text-xs sm:text-sm uppercase tracking-widest backdrop-blur-md hover:bg-white hover:text-black transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Shop Women's Traditional</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
