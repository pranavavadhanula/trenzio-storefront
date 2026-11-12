import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="min-h-[85vh] flex flex-col justify-center px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full">
      {/* Editorial Header - Clean Zara Aesthetic */}
      <div className="text-center mb-6 sm:mb-10 space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-[#2A1810] font-light tracking-tight">
          Choose Your Line
        </h1>
        <p className="text-xs sm:text-sm text-[#6E4733] font-light max-w-md mx-auto">
          Heavyweight luxury streetwear engineered with bio-washed combed cotton and zero post-wash shrinkage.
        </p>
      </div>

      {/* Main Split Showcase: Men's Wear & Women's Wear */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 flex-1">
        {/* Card 1: MEN'S WEAR */}
        <Link
          to="/collections/men"
          className="group relative min-h-[460px] sm:min-h-[580px] rounded-none overflow-hidden bg-[#2A1810] border border-[#4E3022] hover:border-[#7BB8E8]/70 transition-all duration-500 flex flex-col justify-end p-8 sm:p-12 cursor-pointer shadow-2xl"
          title="Explore Men's Wear (Right click to open in new tab)"
        >
          {/* Authentic Male Streetwear Model Photography */}
          <img
            src="https://images.unsplash.com/photo-1550246140-5119ae4790b8?auto=format&fit=crop&w=1400&q=85"
            alt="Men's Wear Heavyweight Streetwear"
            className="absolute inset-0 w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 opacity-75 filter contrast-110 brightness-95"
          />
          {/* Deep Chocolate Brown Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1810] via-[#2A1810]/75 to-[#2A1810]/20 group-hover:via-[#2A1810]/55 transition-colors duration-500" />

          {/* Card Content */}
          <div className="relative z-10 space-y-3">
            <span className="inline-block px-2.5 py-1 bg-[#7BB8E8] text-[#2A1810] text-[10px] uppercase tracking-[0.25em] font-mono font-bold shadow-md">
              Line 01 &bull; Heavyweight Cuts
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#FAF6EE] font-light group-hover:text-[#7BB8E8] transition-colors tracking-tight">
              Men's Wear
            </h2>

            <p className="text-xs sm:text-sm text-[#EAE2D2] font-light max-w-sm leading-relaxed">
              Boxy dropped-shoulders, reinforced ribbed collars, and structured 240–400 GSM bio-washed cotton.
            </p>

            <div className="pt-3">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#7BB8E8] to-[#5E9ED5] text-[#2A1810] font-bold text-xs uppercase tracking-widest font-mono shadow-xl group-hover:brightness-105 group-hover:translate-x-1 transition-all">
                <span>Explore Men's Wear</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2: WOMEN'S WEAR */}
        <Link
          to="/collections/women"
          className="group relative min-h-[460px] sm:min-h-[580px] rounded-none overflow-hidden bg-[#2A1810] border border-[#4E3022] hover:border-[#7BB8E8]/70 transition-all duration-500 flex flex-col justify-end p-8 sm:p-12 cursor-pointer shadow-2xl"
          title="Explore Women's Wear (Right click to open in new tab)"
        >
          {/* Background Photography */}
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85"
            alt="Women's Wear Oversized Cuts"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65 filter contrast-115 brightness-95"
          />
          {/* Deep Chocolate Brown Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#2A1810] via-[#2A1810]/75 to-[#2A1810]/20 group-hover:via-[#2A1810]/55 transition-colors duration-500" />

          {/* Card Content */}
          <div className="relative z-10 space-y-3">
            <span className="inline-block px-2.5 py-1 bg-[#7BB8E8] text-[#2A1810] text-[10px] uppercase tracking-[0.25em] font-mono font-bold shadow-md">
              Line 02 &bull; Oversized Silhouettes
            </span>

            <h2 className="font-serif text-4xl sm:text-5xl text-[#FAF6EE] font-light group-hover:text-[#7BB8E8] transition-colors tracking-tight">
              Women's Wear
            </h2>

            <p className="text-xs sm:text-sm text-[#EAE2D2] font-light max-w-sm leading-relaxed">
              Relaxed dropped-shoulder drape with proportioned armholes and 400 GSM diagonal loop French Terry.
            </p>

            <div className="pt-3">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#7BB8E8] to-[#5E9ED5] text-[#2A1810] font-bold text-xs uppercase tracking-widest font-mono shadow-xl group-hover:brightness-105 group-hover:translate-x-1 transition-all">
                <span>Explore Women's Wear</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Subtle Footer Bar */}
      <div className="mt-8 pt-6 border-t border-[#2A1810]/15 flex flex-wrap items-center justify-between text-xs font-mono text-[#6E4733] gap-4 text-center sm:text-left">
        <div>Pan-India Express Dispatch &bull; Delivery in 3–5 Days</div>
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <Link to="/try-on" className="text-[#7BB8E8] hover:underline font-bold flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try in 3D Fitting Room</span>
          </Link>
          <span>&bull;</span>
          <Link to="/about" className="text-[#2A1810] hover:text-[#7BB8E8] transition-colors font-medium">
            Our 350 GSM Craft
          </Link>
        </div>
        <div>Hassle-Free 7-Day Size Exchanges</div>
      </div>
    </div>
  );
};
