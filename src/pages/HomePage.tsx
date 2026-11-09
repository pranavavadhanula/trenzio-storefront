import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full">
      {/* Editorial Header - Ultra Minimalist Zara Aesthetic */}
      <div className="text-center mb-6 sm:mb-10 space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-atelier-cream font-light tracking-tight">
          Choose Your Line
        </h1>
        <p className="text-xs sm:text-sm text-atelier-200/80 font-light max-w-md mx-auto">
          Heavyweight luxury streetwear engineered with bio-washed combed cotton and zero post-wash shrinkage.
        </p>
      </div>

      {/* Main Split Showcase: Men's Wear & Women's Wear */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 flex-1">
        {/* Card 1: MEN'S WEAR */}
        <Link
          to="/collections/men"
          className="group relative min-h-[460px] sm:min-h-[580px] rounded-none overflow-hidden bg-atelier-900 border border-white/10 hover:border-atelier-coral/70 transition-all duration-500 flex flex-col justify-end p-8 sm:p-12 cursor-pointer shadow-2xl"
          title="Explore Men's Wear (Right click to open in new tab)"
        >
          {/* Authentic Male Streetwear Model Photography */}
          <img
            src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=1400&q=85"
            alt="Men's Wear Heavyweight Streetwear"
            className="absolute inset-0 w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 opacity-75 filter contrast-110 brightness-95"
          />
          {/* Deep Navy Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-atelier-950 via-atelier-950/70 to-atelier-950/20 group-hover:via-atelier-950/50 transition-colors duration-500" />

          {/* Card Content */}
          <div className="relative z-10 space-y-3">
            <span className="inline-block px-2.5 py-1 bg-atelier-coral text-atelier-950 text-[10px] uppercase tracking-[0.25em] font-mono font-bold">
              Line 01 &bull; Heavyweight Cuts
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl text-atelier-cream font-light group-hover:text-atelier-coral transition-colors tracking-tight">
              Men's Wear
            </h2>

            <p className="text-xs sm:text-sm text-atelier-200/90 font-light max-w-sm leading-relaxed">
              Boxy dropped-shoulders, reinforced ribbed collars, and structured 240–400 GSM bio-washed cotton.
            </p>

            <div className="pt-3">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-atelier-coral to-[#ff7b6f] text-atelier-950 font-bold text-xs uppercase tracking-widest font-mono shadow-xl group-hover:brightness-110 group-hover:translate-x-1 transition-all">
                <span>Explore Men's Wear</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2: WOMEN'S WEAR */}
        <Link
          to="/collections/women"
          className="group relative min-h-[460px] sm:min-h-[580px] rounded-none overflow-hidden bg-atelier-900 border border-white/10 hover:border-atelier-coral/70 transition-all duration-500 flex flex-col justify-end p-8 sm:p-12 cursor-pointer shadow-2xl"
          title="Explore Women's Wear (Right click to open in new tab)"
        >
          {/* Background Photography */}
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85"
            alt="Women's Wear Oversized Cuts"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65 filter contrast-115 brightness-95"
          />
          {/* Deep Navy Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-atelier-950 via-atelier-950/60 to-atelier-950/20 group-hover:via-atelier-950/40 transition-colors duration-500" />

          {/* Card Content */}
          <div className="relative z-10 space-y-3">
            <span className="inline-block px-2.5 py-1 bg-atelier-coral text-atelier-950 text-[10px] uppercase tracking-[0.25em] font-mono font-bold">
              Line 02 &bull; Oversized Silhouettes
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl text-atelier-cream font-light group-hover:text-atelier-coral transition-colors tracking-tight">
              Women's Wear
            </h2>

            <p className="text-xs sm:text-sm text-atelier-200/90 font-light max-w-sm leading-relaxed">
              Relaxed dropped-shoulder drape with proportioned armholes and 400 GSM diagonal loop French Terry.
            </p>

            <div className="pt-3">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-atelier-coral to-[#ff7b6f] text-atelier-950 font-bold text-xs uppercase tracking-widest font-mono shadow-xl group-hover:brightness-110 group-hover:translate-x-1 transition-all">
                <span>Explore Women's Wear</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Subtle Footer Bar */}
      <div className="mt-8 pt-6 border-t border-white/5 flex flex-wrap items-center justify-between text-xs font-mono text-atelier-200/60 gap-4 text-center sm:text-left">
        <div>Pan-India Express Dispatch &bull; Delivery in 3–5 Days</div>
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <Link to="/try-on" className="text-atelier-coral hover:underline font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try in 3D Fitting Room</span>
          </Link>
          <span>&bull;</span>
          <Link to="/about" className="hover:text-atelier-cream transition-colors">
            Our 350 GSM Craft
          </Link>
        </div>
        <div>Hassle-Free 7-Day Size Exchanges</div>
      </div>
    </div>
  );
};
