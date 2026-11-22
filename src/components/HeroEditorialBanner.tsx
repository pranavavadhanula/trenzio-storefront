import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroEditorialBanner: React.FC = () => {
  return (
    <section className="relative w-full select-none font-sans overflow-hidden bg-[#DDD8CE]">
      <div className="relative w-full h-[620px] sm:h-[720px] lg:h-[820px] min-h-[75vh] overflow-hidden">
        {/* Full 4K Hero Model Image without the excess green space at the top */}
        <img
          src="/images/hero_banner_4k.jpg"
          alt="TREVORI Editorial Campaign - Contemporary Architectural Streetwear"
          className="absolute inset-0 w-full h-full object-cover object-[50%_20%] filter contrast-105"
        />

        {/* Editorial Graded Warm Scrim: Matches the Warm Ivory & Charcoal Aesthetic */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171717]/90 via-[#171717]/35 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-0 bg-[#F4F1EA]/10 mix-blend-overlay z-10" />

        {/* Editorial Hero Content */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-3xl text-white">
            <span className="inline-block text-xs sm:text-sm uppercase tracking-[0.35em] text-[#DDD8CE] font-medium mb-3">
              Contemporary Streetwear & Lifestyle
            </span>

            <h1 className="font-serif text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-normal tracking-tight text-white leading-[1.02]">
              The Contemporary Silhouette.
            </h1>

            <p className="font-sans text-sm sm:text-base lg:text-lg text-[#DDD8CE] font-light mt-4 sm:mt-6 max-w-xl leading-relaxed">
              Engineered with bio-washed French Terry cotton, dropped architectural shoulders, and precision utilitarian tailoring for an international luxury presence.
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

            {/* Spec Sheet Bar */}
            <div className="mt-10 pt-6 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-4 text-[10px] sm:text-[11px] tracking-widest uppercase text-white/75 font-mono">
              <div>
                <span className="text-[#B9AA96] block mb-0.5">TEXTILE</span>
                <span>Combed Pure Cotton</span>
              </div>
              <div>
                <span className="text-[#B9AA96] block mb-0.5">STYLE</span>
                <span>Boxy Drop-Shoulder</span>
              </div>
              <div>
                <span className="text-[#B9AA96] block mb-0.5">ORIGIN</span>
                <span>Ethical Mills</span>
              </div>
              <div>
                <span className="text-[#B9AA96] block mb-0.5">SHIPPING</span>
                <span>Worldwide Express</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
