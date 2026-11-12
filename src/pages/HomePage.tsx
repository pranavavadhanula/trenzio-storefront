import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-[85vh] flex flex-col justify-center px-4 sm:px-8 py-8 sm:py-12 max-w-7xl mx-auto w-full bg-[#060C1A] text-white overflow-hidden">
      {/* Luminous Royal Blue Ambient Lighting Glow */}
      <div className="pointer-events-none absolute top-10 left-1/3 w-[550px] h-60 bg-gradient-to-r from-[#2563EB]/20 via-[#1D4ED8]/15 to-transparent blur-3xl rounded-full" />

      {/* Editorial Header - Royal Sapphire Haute Couture */}
      <div className="relative z-10 text-center mb-6 sm:mb-10 space-y-2">
        <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl text-white font-light tracking-tight">
          Choose Your Line
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] font-light max-w-md mx-auto">
          Heavyweight luxury streetwear engineered with bio-washed combed cotton and zero post-wash shrinkage.
        </p>
      </div>

      {/* Main Split Showcase: Men's Wear & Women's Wear in Sapphire Blue Aesthetic */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-6 sm:gap-8 flex-1">
        {/* Card 1: MEN'S WEAR (Streetwear Hoodie Model - No Suit) */}
        <Link
          to="/collections/men"
          className="group relative min-h-[460px] sm:min-h-[580px] rounded-none overflow-hidden bg-[#0D1B3A] border border-[#2563EB]/25 hover:border-[#3B82F6] transition-all duration-500 flex flex-col justify-end p-8 sm:p-12 cursor-pointer shadow-[0_15px_45px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.25)]"
          title="Explore Men's Wear (Right click to open in new tab)"
        >
          {/* Authentic Male Streetwear Model in Heavyweight Hoodie */}
          <img
            src="/images/models/man_streetwear_hoodie.jpg"
            alt="Men's Wear Heavyweight Streetwear Hoodie"
            className="absolute inset-0 w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 opacity-70 filter contrast-115 brightness-95"
          />
          {/* Deep Sapphire Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060C1A] via-[#060C1A]/75 to-transparent group-hover:via-[#060C1A]/55 transition-colors duration-500" />

          {/* Card Content */}
          <div className="relative z-10 space-y-3">
            <h2 className="font-serif text-4xl sm:text-5xl text-white font-light group-hover:text-[#60A5FA] transition-colors tracking-tight">
              Men's Wear
            </h2>

            <p className="text-xs sm:text-sm text-[#CBD5E1] font-light max-w-sm leading-relaxed">
              Boxy dropped-shoulders, reinforced ribbed collars, and structured 240–400 GSM bio-washed cotton.
            </p>

            <div className="pt-3">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#EDE0CC] hover:bg-[#F5E6D0] text-[#060C1A] font-black text-xs uppercase tracking-widest font-mono shadow-[0_0_20px_rgba(237,224,204,0.25)] group-hover:translate-x-1 transition-all">
                <span>Explore Men's Wear</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2: WOMEN'S WEAR */}
        <Link
          to="/collections/women"
          className="group relative min-h-[460px] sm:min-h-[580px] rounded-none overflow-hidden bg-[#0D1B3A] border border-[#2563EB]/25 hover:border-[#3B82F6] transition-all duration-500 flex flex-col justify-end p-8 sm:p-12 cursor-pointer shadow-[0_15px_45px_rgba(0,0,0,0.8)] hover:shadow-[0_20px_50px_rgba(37,99,235,0.25)]"
          title="Explore Women's Wear (Right click to open in new tab)"
        >
          {/* Background Streetwear Photography */}
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85"
            alt="Women's Wear Oversized Cuts"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-65 filter contrast-115 brightness-95"
          />
          {/* Deep Sapphire Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#060C1A] via-[#060C1A]/75 to-transparent group-hover:via-[#060C1A]/55 transition-colors duration-500" />

          {/* Card Content */}
          <div className="relative z-10 space-y-3">
            <h2 className="font-serif text-4xl sm:text-5xl text-white font-light group-hover:text-[#60A5FA] transition-colors tracking-tight">
              Women's Wear
            </h2>

            <p className="text-xs sm:text-sm text-[#CBD5E1] font-light max-w-sm leading-relaxed">
              Relaxed dropped-shoulder drape with proportioned armholes and 400 GSM diagonal loop French Terry.
            </p>

            <div className="pt-3">
              <span className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#EDE0CC] hover:bg-[#F5E6D0] text-[#060C1A] font-black text-xs uppercase tracking-widest font-mono shadow-[0_0_20px_rgba(237,224,204,0.25)] group-hover:translate-x-1 transition-all">
                <span>Explore Women's Wear</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Subtle Footer Bar */}
      <div className="relative z-10 mt-8 pt-6 border-t border-[#1E293B] flex flex-wrap items-center justify-between text-xs font-mono text-[#94A3B8] gap-4 text-center sm:text-left">
        <div>Pan-India Express Dispatch &bull; Delivery in 3–5 Days</div>
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <Link to="/try-on" className="text-[#3B82F6] hover:underline font-bold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try in 3D Fitting Room</span>
          </Link>
          <span>&bull;</span>
          <Link to="/about" className="text-white hover:text-[#3B82F6] transition-colors font-medium">
            Our 350 GSM Craft
          </Link>
        </div>
        <div>Hassle-Free 7-Day Size Exchanges</div>
      </div>
    </div>
  );
};
