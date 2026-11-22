import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroEditorialBanner: React.FC = () => {
  return (
    <section className="relative w-full select-none font-sans overflow-hidden bg-[#DDD8CE]">
      {/* Reduced height to eliminate excess green space */}
      <div className="relative w-full h-[460px] sm:h-[520px] lg:h-[580px] overflow-hidden">
        {/* Editorial Fashion Photography: Focused directly on model, cutting out wasted green top */}
        <img
          src="https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=2400&q=90"
          alt="TREVORI Editorial Campaign - Contemporary Architectural Streetwear"
          className="w-full h-full object-cover object-[50%_65%] filter contrast-105"
        />

        {/* Editorial Graded Warm Scrim: Matches the Warm Ivory & Charcoal Aesthetic */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#171717]/90 via-[#171717]/40 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-0 bg-[#F4F1EA]/10 mix-blend-overlay z-10" />

        {/* Editorial Hero Content */}
        <div className="relative z-20 h-full max-w-7xl mx-auto px-6 sm:px-12 lg:px-16 flex flex-col justify-end pb-8 sm:pb-12">
          <div className="max-w-2xl text-white">
            <span className="inline-block text-[11px] sm:text-xs uppercase tracking-[0.3em] text-[#DDD8CE] font-medium mb-2">
              Contemporary Streetwear & Lifestyle
            </span>

            <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-white leading-[1.05]">
              The Contemporary Silhouette.
            </h1>

            <p className="font-sans text-xs sm:text-sm text-[#DDD8CE] font-light mt-2.5 sm:mt-3.5 max-w-lg leading-relaxed">
              Engineered with bio-washed French Terry cotton, dropped architectural shoulders, and precision utilitarian tailoring for an international luxury presence.
            </p>

            <div className="flex flex-wrap items-center gap-3.5 mt-5 sm:mt-6">
              <Link
                to="/collections"
                className="px-6 sm:px-7 py-3 bg-[#FFFFFF] text-[#171717] hover:bg-[#F4F1EA] hover:text-[#171717] font-medium text-xs uppercase tracking-[0.2em] transition-all duration-300 flex items-center gap-2 shadow-sm group cursor-pointer"
              >
                <span>Explore New Arrivals</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>

              <a
                href="#lookbook"
                className="px-6 sm:px-7 py-3 bg-transparent border border-white/60 text-white hover:bg-white hover:text-[#171717] font-medium text-xs uppercase tracking-[0.2em] backdrop-blur-sm transition-all duration-300 cursor-pointer"
              >
                <span>View Lookbook</span>
              </a>
            </div>

            {/* Editorial Spec Sheet Bar */}
            <div className="mt-6 pt-4 border-t border-white/20 grid grid-cols-2 sm:grid-cols-4 gap-3 text-[9px] sm:text-[10px] tracking-widest uppercase text-white/75 font-mono">
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
