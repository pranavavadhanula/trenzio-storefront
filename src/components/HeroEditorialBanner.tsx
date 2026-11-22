import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroEditorialBanner: React.FC = () => {
  return (
    <section className="relative w-full select-none font-sans overflow-hidden bg-[#DDD8CE]">
      <div className="relative w-full h-[700px] sm:h-[820px] lg:h-[920px] min-h-[85vh] overflow-hidden">
        {/* Editorial Fashion Photography: Concrete architectural background & warm studio lighting */}
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=90"
          alt="TREVORI Editorial Campaign - Contemporary Architectural Streetwear"
          className="w-full h-full object-cover object-[50%_25%] filter contrast-105"
        />

        {/* Editorial Graded Warm Scrim: Matches the Warm Ivory & Charcoal Aesthetic */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171717]/85 via-[#171717]/30 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-0 bg-[#F4F1EA]/10 mix-blend-overlay z-10" />

        {/* Minimal Editorial Badge (Top-Left) */}
        <div className="absolute top-8 left-6 sm:left-12 lg:left-16 z-20 hidden sm:flex items-center gap-3">
          <span className="text-[10px] tracking-[0.3em] uppercase text-white/80 bg-black/40 backdrop-blur-md px-3 py-1 border border-white/15">
            CAMPAIGN // AW 2026
          </span>
          <span className="text-[10px] tracking-[0.2em] uppercase text-white/70">
            VOLUME IV &bull; BRUTALIST PROPORTIONS
          </span>
        </div>

        {/* Editorial Hero Content */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-end pb-16 sm:pb-20">
          <div className="max-w-3xl text-white">
            <span className="inline-block text-xs sm:text-sm uppercase tracking-[0.35em] text-[#DDD8CE] font-medium mb-3">
              Contemporary Streetwear & Lifestyle
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-white leading-[1.02]">
              The Contemporary Silhouette.
            </h1>

            <p className="font-sans text-sm sm:text-base lg:text-lg text-[#DDD8CE] font-light mt-4 sm:mt-6 max-w-xl leading-relaxed">
              Engineered with 450 GSM bio-washed French Terry, dropped architectural shoulders, and precision utilitarian tailoring for an international luxury presence.
            </p>

            <div className="flex flex-wrap items-center gap-4 mt-8 sm:mt-10">
              <Link
                to="/collections"
                className="px-8 py-4 bg-[#FFFFFF] text-[#171717] hover:bg-[#F4F1EA] hover:text-[#171717] font-medium text-xs sm:text-sm uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2.5 shadow-sm group cursor-pointer"
              >
                <span>Explore New Arrivals</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#lookbook"
                className="px-8 py-4 bg-transparent border border-white/60 text-white hover:bg-white hover:text-[#171717] font-medium text-xs sm:text-sm uppercase tracking-[0.2em] backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                <span>View Lookbook</span>
              </a>
            </div>

            {/* Editorial Spec Sheet Bar */}
            <div className="mt-12 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] sm:text-[11px] tracking-widest uppercase text-white/75 font-mono">
              <div>
                <span className="text-[#B9AA96] block mb-0.5">TEXTILE</span>
                <span>450 GSM Combed Cotton</span>
              </div>
              <div>
                <span className="text-[#B9AA96] block mb-0.5">SILHOUETTE</span>
                <span>Boxy Drop-Shoulder</span>
              </div>
              <div>
                <span className="text-[#B9AA96] block mb-0.5">ORIGIN</span>
                <span>Ethical Atelier Mills</span>
              </div>
              <div>
                <span className="text-[#B9AA96] block mb-0.5">AVAILABILITY</span>
                <span>Worldwide Express</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
