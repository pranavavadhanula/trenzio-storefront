import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden bg-[#0A160F]">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=2200&q=90"
          alt="Heavyweight streetwear oversized apparel"
          className="w-full h-full object-cover object-center scale-100 opacity-25 filter contrast-125 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-[#0A160F] via-[#0A160F]/80 to-[#0A160F]/45" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-8 pb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-[#D4C3A3]/40 bg-[#162E21] backdrop-blur-md mb-6 shadow-[0_0_15px_rgba(212,195,163,0.15)]">
          <Sparkles className="w-3 h-3 text-[#E6D7C3]" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#E6D7C3] font-medium font-mono font-bold">
            New Drop &bull; 240–400 GSM Pure Cotton
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-[#F4ECE1] tracking-tight leading-[1.1] mb-6">
          Heavyweight Oversized Tees <br />
          <span className="italic font-normal text-[#E6D7C3]">& Luxury Sweatshirts</span>
        </h1>

        <p className="max-w-xl mx-auto text-xs sm:text-sm text-[#D4C3A3] font-light leading-relaxed mb-10 tracking-wide">
          Engineered for <strong>Men & Women</strong>. Super-combed bio-washed cotton, structured boxy dropped-shoulders, and zero post-wash shrinkage.
        </p>

        {/* Action Buttons */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/collections/oversized-tees"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-[#E6D7C3] to-[#D4C3A3] hover:from-[#F4ECE1] hover:to-[#E6D7C3] text-[#0A160F] text-xs font-black uppercase tracking-[0.2em] shadow-[0_0_25px_rgba(212,195,163,0.35)] transition-all duration-300 flex items-center justify-center cursor-pointer font-mono"
          >
            Shop Oversized Tees (₹285)
          </Link>
          <Link
            to="/collections/sweatshirts"
            className="w-full sm:w-auto px-8 py-3.5 border border-[#D4C3A3]/30 bg-white/[0.04] text-[#F4ECE1] text-xs uppercase tracking-[0.2em] hover:border-[#E6D7C3] hover:text-[#E6D7C3] transition-all duration-300 backdrop-blur-sm flex items-center justify-center cursor-pointer font-mono"
          >
            Shop Sweatshirts (400 GSM)
          </Link>
        </div>

        {/* Feature stats */}
        <div className="mt-14 pt-8 border-t border-[#D4C3A3]/20 grid grid-cols-3 gap-4 max-w-md mx-auto text-center">
          <div>
            <div className="font-mono text-lg sm:text-xl text-[#E6D7C3] font-bold">280–350 GSM</div>
            <div className="text-[9px] uppercase tracking-wider text-[#D4C3A3]/80 mt-0.5 font-mono">Heavyweight Drop</div>
          </div>
          <div>
            <div className="font-mono text-lg sm:text-xl text-[#E6D7C3] font-bold">400 GSM</div>
            <div className="text-[9px] uppercase tracking-wider text-[#D4C3A3]/80 mt-0.5 font-mono">French Terry</div>
          </div>
          <div>
            <div className="font-mono text-lg sm:text-xl text-[#E6D7C3] font-bold">Zero Shrink</div>
            <div className="text-[9px] uppercase tracking-wider text-[#D4C3A3]/80 mt-0.5 font-mono">Pre-Shrunk Cotton</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <Link
        to="/collections/all"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-[#D4C3A3]/70 hover:text-[#E6D7C3] transition-colors flex flex-col items-center gap-1 cursor-pointer z-10"
      >
        <span className="text-[9px] uppercase tracking-widest font-mono">View Full Catalog</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce text-[#E6D7C3]" />
      </Link>
    </section>
  );
};