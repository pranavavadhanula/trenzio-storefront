import React from 'react';
import { ArrowDown, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Hero: React.FC = () => {
  return (
    <section className="relative min-h-[82vh] flex items-center justify-center overflow-hidden">
      {/* Background Hero Image */}
      <div className="absolute inset-0 z-0">
        <img
          src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=2200&q=90"
          alt="Heavyweight streetwear oversized apparel"
          className="w-full h-full object-cover object-center scale-100 opacity-35 filter contrast-125 brightness-90"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-atelier-950 via-atelier-950/70 to-atelier-950/40" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-8 pb-16">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-atelier-gold/40 bg-atelier-900/70 backdrop-blur-md mb-6">
          <Sparkles className="w-3 h-3 text-atelier-gold" />
          <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-medium">
            New Drop &bull; 240–450 GSM Pure Cotton
          </span>
        </div>

        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-light text-atelier-100 tracking-tight leading-[1.1] mb-6">
          Heavyweight Oversized Tees <br />
          <span className="italic font-normal text-atelier-sand">& Luxury Sweatshirts</span>
        </h1>

        <p className="max-w-xl mx-auto text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-10 tracking-wide">
          Engineered for <strong>Men & Women</strong>. Super-combed bio-washed cotton, structured boxy dropped-shoulders, and zero post-wash shrinkage.
        </p>

        {/* Action Buttons - Pure Luxury, No Stark White */}
        <div className="flex flex-col sm:flex-row items-center justify-center gap-3 sm:gap-4">
          <Link
            to="/collections/oversized-tees"
            className="w-full sm:w-auto px-8 py-3.5 bg-gradient-to-r from-atelier-gold via-[#d4b38a] to-atelier-gold text-atelier-950 text-xs font-bold uppercase tracking-[0.2em] hover:brightness-110 shadow-lg shadow-black/40 transition-all duration-300 flex items-center justify-center cursor-pointer"
          >
            Shop Oversized Tees (₹285)
          </Link>
          <Link
            to="/collections/sweatshirts"
            className="w-full sm:w-auto px-8 py-3.5 border border-atelier-gold/40 text-atelier-100 text-xs uppercase tracking-[0.2em] hover:bg-atelier-gold hover:text-atelier-950 transition-all duration-300 backdrop-blur-sm flex items-center justify-center cursor-pointer"
          >
            Shop Sweatshirts (400 GSM)
          </Link>
        </div>

        {/* Feature stats */}
        <div className="mt-14 pt-8 border-t border-white/10 grid grid-cols-3 gap-4 max-w-md mx-auto text-center">
          <div>
            <div className="font-mono text-lg sm:text-xl text-atelier-gold font-bold">280–350 GSM</div>
            <div className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">Heavyweight Drop</div>
          </div>
          <div>
            <div className="font-mono text-lg sm:text-xl text-atelier-gold font-bold">400 GSM</div>
            <div className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">French Terry</div>
          </div>
          <div>
            <div className="font-mono text-lg sm:text-xl text-atelier-gold font-bold">Zero Shrink</div>
            <div className="text-[9px] uppercase tracking-wider text-neutral-400 mt-0.5">Pre-Shrunk Cotton</div>
          </div>
        </div>
      </div>

      {/* Scroll indicator */}
      <Link
        to="/collections/all"
        className="absolute bottom-4 left-1/2 -translate-x-1/2 text-neutral-500 hover:text-atelier-gold transition-colors flex flex-col items-center gap-1 cursor-pointer z-10"
      >
        <span className="text-[9px] uppercase tracking-widest font-mono">View Full Catalog</span>
        <ArrowDown className="w-3.5 h-3.5 animate-bounce" />
      </Link>
    </section>
  );
};
