import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroEditorialBanner: React.FC = () => {
  return (
    <section className="relative w-full select-none font-sans overflow-hidden bg-[#DDD8CE]">
      <div className="relative w-full h-[620px] sm:h-[720px] lg:h-[820px] min-h-[75vh] overflow-hidden">
        {/* Full 4K Hero Model Image anchored to top to keep face, hair, and sunglasses completely visible */}
        <img
          src="/images/hero_banner_4k.jpg"
          alt="TREVORI Editorial Campaign"
          className="absolute inset-0 w-full h-full object-cover object-[50%_0%] filter contrast-105"
        />

        {/* Subtle Bottom Gradients to guarantee button and brand contrast without dimming model face */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/75 via-black/25 to-transparent z-10" />

        {/* Minimal Editorial Content: TREVORI Brand Heading & Dual CTA Buttons */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-2xl text-white">
            <h1 className="font-serif text-5xl sm:text-7xl lg:text-8xl xl:text-9xl font-normal tracking-[0.16em] sm:tracking-[0.22em] text-white uppercase leading-none mb-6 sm:mb-8 drop-shadow-md">
              TREVORI
            </h1>

            <div className="flex flex-wrap items-center gap-4">
              <Link
                to="/collections"
                className="px-8 py-4 bg-[#FFFFFF] text-[#171717] hover:bg-[#F4F1EA] hover:text-[#171717] font-medium text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2.5 shadow-sm group cursor-pointer"
              >
                <span>Explore New Arrivals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#lookbook"
                className="px-8 py-4 bg-transparent border border-white/70 text-white hover:bg-white hover:text-[#171717] font-medium text-xs sm:text-sm uppercase tracking-[0.2em] backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                <span>View Lookbook</span>
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
