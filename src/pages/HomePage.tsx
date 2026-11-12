import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full bg-[#0B0512] text-[#FAF5FF]">
      {/* Editorial Header - Clean Zara Aesthetic in Orchid */}
      <div className="text-center mb-6 sm:mb-10 space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#FAF5FF] font-light tracking-tight">
          Choose Your Line
        </h1>
        <p className="text-xs sm:text-sm text-[#D8B4FE] font-light max-w-md mx-auto">
          Heavyweight luxury streetwear engineered with bio-washed combed cotton and zero post-wash shrinkage.
        </p>
      </div>

      {/* Main Split Showcase: Men's Wear & Women's Wear */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 flex-1">
        {/* Card 1: MEN'S WEAR */}
        <Link
          to="/collections/men"
          className="group relative min-h-[460px] sm:min-h-[580px] rounded-none overflow-hidden bg-[#140A21] border border-[#BA55D3]/20 hover:border-[#DA70D6] transition-all duration-500 flex flex-col justify-end p-8 sm:p-12 cursor-pointer shadow-2xl backdrop-blur-xl"
          title="Explore Men's Wear (Right click to open in new tab)"
        >
          {/* Authentic Male Streetwear Model Photography */}
          <img
            src="/images/models/man_model_fashion.jpg"
            alt="Men's Wear Heavyweight Streetwear"
            className="absolute inset-0 w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 opacity-70 filter contrast-115 brightness-95"
          />
          {/* Orchid Night Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0512] via-[#0B0512]/75 to-transparent group-hover:via-[#0B0512]/55 transition-colors duration-500" />

          {/* Card Content */}
          <div className="relative z-10 space-y-3">
            <span className="inline-block px-2.5 py-1 bg-[#DA70D6] text-black text-[10px] uppercase tracking-[0.25em] font-mono font-extrabold shadow-[0_0_18px_rgba(218,112,214,0.45)]">
              Line 01 &bull; Heavyweight Cuts
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#FAF5FF] font-light group-hover:text-[#DA70D6] transition-colors tracking-tight">
              Men's Wear
            </h2>

            <p className="text-xs sm:text-sm text-[#E9D5FF] font-light max-w-sm leading-relaxed">
              Boxy dropped-shoulders, reinforced ribbed collars, and structured 240–400 GSM bio-washed cotton.
            </p>

            <div className="pt-3">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#DA70D6] to-[#BA55D3] hover:from-[#E056FD] hover:to-[#DA70D6] text-black font-black text-xs uppercase tracking-widest font-mono shadow-[0_0_25px_rgba(218,112,214,0.45)] group-hover:translate-x-1 transition-all">
                <span>Explore Men's Wear</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2: WOMEN'S WEAR */}
        <Link
          to="/collections/women"
          className="group relative min-h-[460px] sm:min-h-[580px] rounded-none overflow-hidden bg-[#140A21] border border-[#BA55D3]/20 hover:border-[#DA70D6] transition-all duration-500 flex flex-col justify-end p-8 sm:p-12 cursor-pointer shadow-2xl backdrop-blur-xl"
          title="Explore Women's Wear (Right click to open in new tab)"
        >
          {/* Background Photography */}
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85"
            alt="Women's Wear Oversized Cuts"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65 filter contrast-115 brightness-95"
          />
          {/* Orchid Night Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#0B0512] via-[#0B0512]/75 to-transparent group-hover:via-[#0B0512]/55 transition-colors duration-500" />

          {/* Card Content */}
          <div className="relative z-10 space-y-3">
            <span className="inline-block px-2.5 py-1 bg-[#DA70D6] text-black text-[10px] uppercase tracking-[0.25em] font-mono font-extrabold shadow-[0_0_18px_rgba(218,112,214,0.45)]">
              Line 02 &bull; Oversized Silhouettes
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#FAF5FF] font-light group-hover:text-[#DA70D6] transition-colors tracking-tight">
              Women's Wear
            </h2>

            <p className="text-xs sm:text-sm text-[#E9D5FF] font-light max-w-sm leading-relaxed">
              Relaxed dropped-shoulder drape with proportioned armholes and 400 GSM diagonal loop French Terry.
            </p>

            <div className="pt-3">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#DA70D6] to-[#BA55D3] hover:from-[#E056FD] hover:to-[#DA70D6] text-black font-black text-xs uppercase tracking-widest font-mono shadow-[0_0_25px_rgba(218,112,214,0.45)] group-hover:translate-x-1 transition-all">
                <span>Explore Women's Wear</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Subtle Footer Bar */}
      <div className="mt-8 pt-6 border-t border-[#BA55D3]/20 flex flex-wrap items-center justify-between text-xs font-mono text-[#D8B4FE] gap-4 text-center sm:text-left">
        <div>Pan-India Express Dispatch &bull; Delivery in 3–5 Days</div>
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <Link to="/try-on" className="text-[#DA70D6] hover:underline font-bold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try in 3D Fitting Room</span>
          </Link>
          <span>&bull;</span>
          <Link to="/about" className="text-[#FAF5FF] hover:text-[#DA70D6] transition-colors font-medium">
            Our 350 GSM Craft
          </Link>
        </div>
        <div>Hassle-Free 7-Day Size Exchanges</div>
      </div>
    </div>
  );
};
