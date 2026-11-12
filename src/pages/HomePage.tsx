import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-10 lg:px-14 py-8 sm:py-14 max-w-[1480px] mx-auto w-full bg-[#07111E] text-white overflow-hidden font-sans">
      {/* Deep Royal Midnight Ambient Glow */}
      <div className="pointer-events-none absolute top-10 left-1/3 w-[650px] h-72 bg-gradient-to-r from-[#1D4ED8]/25 via-[#2563EB]/15 to-transparent blur-3xl rounded-full" />

      {/* Editorial Header - Dark Blue Haute Aesthetics */}
      <div className="relative z-10 text-center mb-8 sm:mb-12 space-y-2.5">
        <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl text-white font-extrabold tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          Choose Your Line
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] font-normal max-w-lg mx-auto leading-relaxed">
          Heavyweight luxury streetwear engineered with bio-washed combed cotton and zero post-wash shrinkage.
        </p>
      </div>

      {/* Main Split Showcase: Large Prominent Men's Wear & Women's Wear Showcase */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 flex-1">
        {/* Card 1: MEN'S WEAR (Large High-Impact Showcase Box) */}
        <Link
          to="/collections/men"
          className="group relative min-h-[580px] sm:min-h-[700px] lg:min-h-[780px] rounded-sm overflow-hidden bg-[#0B1A30] border border-[#1E3A66] hover:border-[#F88379] transition-all duration-500 flex flex-col justify-end p-8 sm:p-14 lg:p-16 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_rgba(248,131,121,0.35)]"
          title="Explore Men's Wear (Right click to open in new tab)"
        >
          {/* Authentic Male Streetwear Model in Heavyweight Hoodie - High Clarity & Size */}
          <img
            src="/images/models/man_streetwear_hoodie.jpg"
            alt="Men's Wear Heavyweight Streetwear Hoodie"
            className="absolute inset-0 w-full h-full object-cover object-top sm:object-center group-hover:scale-105 transition-transform duration-700 opacity-90 filter contrast-115 brightness-95"
          />
          {/* Deep Navy Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/60 to-transparent group-hover:via-[#07111E]/40 transition-colors duration-500" />

          {/* Card Content */}
          <div className="relative z-10 space-y-4">
            <h2 className="font-sans text-4xl sm:text-6xl text-white font-extrabold group-hover:text-[#F88379] transition-colors tracking-tight drop-shadow-lg">
              Men's Wear
            </h2>

            <p className="text-sm sm:text-base text-[#E2E8F0] font-medium max-w-md leading-relaxed drop-shadow-sm">
              Boxy dropped-shoulders, reinforced ribbed collars, and structured 240–400 GSM bio-washed cotton.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#F88379] hover:bg-[#FA958D] text-white font-bold text-sm uppercase tracking-wider font-sans shadow-[0_4px_25px_rgba(248,131,121,0.55)] group-hover:translate-x-2 transition-all">
                <span>Explore Men's Wear</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>

        {/* Card 2: WOMEN'S WEAR (Large High-Impact Showcase Box) */}
        <Link
          to="/collections/women"
          className="group relative min-h-[580px] sm:min-h-[700px] lg:min-h-[780px] rounded-sm overflow-hidden bg-[#0B1A30] border border-[#1E3A66] hover:border-[#F88379] transition-all duration-500 flex flex-col justify-end p-8 sm:p-14 lg:p-16 cursor-pointer shadow-[0_20px_50px_rgba(0,0,0,0.8)] hover:shadow-[0_25px_60px_rgba(248,131,121,0.35)]"
          title="Explore Women's Wear (Right click to open in new tab)"
        >
          {/* Background Streetwear Photography - High Clarity & Size */}
          <img
            src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85"
            alt="Women's Wear Oversized Cuts"
            className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-85 filter contrast-115 brightness-95"
          />
          {/* Deep Navy Subtle Gradient Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/60 to-transparent group-hover:via-[#07111E]/40 transition-colors duration-500" />

          {/* Card Content */}
          <div className="relative z-10 space-y-4">
            <h2 className="font-sans text-4xl sm:text-6xl text-white font-extrabold group-hover:text-[#F88379] transition-colors tracking-tight drop-shadow-lg">
              Women's Wear
            </h2>

            <p className="text-sm sm:text-base text-[#E2E8F0] font-medium max-w-md leading-relaxed drop-shadow-sm">
              Relaxed dropped-shoulder drape with proportioned armholes and 400 GSM diagonal loop French Terry.
            </p>

            <div className="pt-2">
              <span className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#F88379] hover:bg-[#FA958D] text-white font-bold text-sm uppercase tracking-wider font-sans shadow-[0_4px_25px_rgba(248,131,121,0.55)] group-hover:translate-x-2 transition-all">
                <span>Explore Women's Wear</span>
                <ArrowRight className="w-4 h-4" />
              </span>
            </div>
          </div>
        </Link>
      </div>

      {/* Subtle Footer Bar */}
      <div className="relative z-10 mt-10 pt-8 border-t border-[#1E3A66]/50 flex flex-wrap items-center justify-between text-xs font-sans font-medium text-[#94A3B8] gap-4 text-center sm:text-left">
        <div>Pan-India Express Dispatch &bull; Delivery in 3–5 Days</div>
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <Link to="/try-on" className="text-[#F88379] hover:underline font-bold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try in 3D Fitting Room</span>
          </Link>
          <span>&bull;</span>
          <Link to="/about" className="text-white hover:text-[#F88379] transition-colors font-semibold">
            Our 350 GSM Craft
          </Link>
        </div>
        <div>Hassle-Free 7-Day Size Exchanges</div>
      </div>
    </div>
  );
};
