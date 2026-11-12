import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const TraditionalAttireShowcase: React.FC = () => {
  return (
    <section className="relative w-full select-none font-sans overflow-hidden bg-black">
      {/* 100% Full-Bleed Edge-to-Edge Enlarged Container (Covers Left & Right Corners With Zero Gaps) */}
      <div className="relative w-full h-[680px] sm:h-[840px] lg:h-[960px] min-h-[85vh] overflow-hidden">
        {/* High-Resolution Royal Traditional Photo Anchored to Top so Heads and Full Figures are Fully Visible */}
        <img
          src="/images/traditional_couture_banner.jpg"
          alt="Trevori Royal Traditional Couture - Men's and Women's Indian Heritage Wear"
          className="absolute inset-0 w-full h-full object-cover object-[50%_0%] filter brightness-95 contrast-105"
        />

        {/* Cinematic Midnight Shading & Ambient Vignette Matching Dark Blue Website Theme */}
        <div className="pointer-events-none absolute inset-0 bg-[#07111E]/20 mix-blend-multiply z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/40 to-[#07111E]/15 z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07111E]/80 via-transparent to-transparent z-10" />

        {/* Clean Minimal Foreground Content: Headline, Description & Action CTAs */}
        <div className="relative z-20 h-full max-w-[1480px] mx-auto px-4 sm:px-10 lg:px-14 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-2xl">
            {/* Category Tag */}
            <p className="text-xs sm:text-sm font-extrabold tracking-[0.25em] text-[#F88379] uppercase mb-2 sm:mb-3 drop-shadow-[0_2px_10px_rgba(0,0,0,0.9)]">
              ROYAL TRADITIONAL COUTURE
            </p>

            {/* Bold Headline matching Hero Banner */}
            <h2 className="font-sans text-4xl sm:text-6xl md:text-7xl lg:text-8xl font-black uppercase tracking-[0.06em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.95)] leading-[1.05]">
              WEAR YOUR PERSPECTIVE
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
