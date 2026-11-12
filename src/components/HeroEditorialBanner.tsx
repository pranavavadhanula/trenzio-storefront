import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroEditorialBanner: React.FC = () => {
  return (
    <section className="relative w-full select-none font-sans overflow-hidden bg-black">
      <div className="relative w-full h-[680px] sm:h-[840px] lg:h-[960px] min-h-[85vh] overflow-hidden">
        {/* High-Resolution Photo Graded to Match Website Theme */}
        <img
          src="/images/hero_banner.jpg"
          alt="Trevori Haute Editorial - Models in Clean Contemporary Streetwear"
          className="w-full h-full object-cover object-top sm:object-[50%_10%] filter brightness-90 contrast-105"
        />

        {/* Website Matching Midnight Tint: Harmonizes with the Dark Blue Palette */}
        <div className="pointer-events-none absolute inset-0 bg-[#07111E]/30 mix-blend-multiply z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/40 to-[#07111E]/20 z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-[#07111E]/50 via-transparent to-[#07111E]/30 z-10" />

        {/* Clean Foreground Content: Title, Subtitle, CTA */}
        <div className="relative z-20 h-full max-w-[1480px] mx-auto px-4 sm:px-10 lg:px-14 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-2xl">
            <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-black uppercase tracking-[0.06em] text-white drop-shadow-[0_4px_28px_rgba(0,0,0,0.9)] leading-[1.05]">
              WEAR YOUR PERSPECTIVE
            </h1>

            <p className="text-xs sm:text-base md:text-lg text-slate-100 font-normal mt-4 max-w-xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.85)]">
              Contemporary luxury streetwear crafted with 400 GSM heavyweight French Terry, relaxed silhouettes, and modern neutral tones for effortless everyday elegance.
            </p>

            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Link
                to="/collections/sweatshirts"
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#F88379] text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-none shadow-[0_4px_20px_rgba(248,131,121,0.5)] hover:bg-white hover:text-black transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop The Collection</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/collections/oversized-tees"
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-black/60 border border-white/40 text-white font-bold text-xs sm:text-sm uppercase tracking-widest rounded-none backdrop-blur-md hover:bg-white hover:text-black transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Relaxed Fits</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
