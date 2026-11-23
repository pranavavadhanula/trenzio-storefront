import React, { useState } from 'react';
import { Copy, Check } from 'lucide-react';

export const TrevoriMenWinterBanner: React.FC = () => {
  const [copiedCode, setCopiedCode] = useState<string | null>(null);

  const handleCopy = (code: string) => {
    navigator.clipboard?.writeText(code);
    setCopiedCode(code);
    setTimeout(() => setCopiedCode(null), 2500);
  };

  return (
    <div className="relative overflow-hidden mb-8 rounded-sm bg-gradient-to-r from-[#D94F2B] via-[#C8411F] to-[#B33516] text-white shadow-sm border border-[#C8411F]/30">
      <div className="flex flex-col md:flex-row items-center justify-between min-h-[170px] sm:min-h-[190px] px-6 sm:px-10 py-6 relative">
        
        {/* Subtle Brand Watermark Background */}
        <div className="absolute top-2 left-6 text-[10px] uppercase tracking-[0.3em] font-semibold text-white/50 select-none">
          TREVORI ATELIER // WINTER EDITIONS
        </div>

        {/* Left Side: Big Bold WINTERWEAR Headline */}
        <div className="w-full md:w-auto flex flex-col justify-center mb-6 md:mb-0 md:pr-8 md:border-r md:border-white/20">
          <h2 className="font-sans font-black text-3xl sm:text-4xl lg:text-5xl uppercase tracking-wider text-white drop-shadow-[0_2px_4px_rgba(0,0,0,0.35)] leading-tight">
            WINTERWEAR
          </h2>
          <span className="text-[11px] uppercase tracking-[0.2em] text-white/80 font-medium mt-1">
            Loopback Fleece & Heavyweight Knits
          </span>
        </div>

        {/* Center: Promo Offers and Coupon Codes */}
        <div className="w-full md:w-auto flex-1 flex flex-col sm:flex-row items-start sm:items-center justify-center gap-6 sm:gap-10 md:px-8 mb-6 md:mb-0">
          
          {/* Offer 1: Buy 2 Get ₹200 OFF */}
          <div className="flex flex-col items-start">
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white drop-shadow-sm">
              Buy 2 Get <span className="font-extrabold text-[#FFF4E0]">Flat ₹200 OFF</span>
            </span>
            <button
              onClick={() => handleCopy('TREVORI200')}
              className="mt-1.5 flex items-center gap-1.5 px-3 py-1 bg-black/90 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
              title="Click to copy coupon code"
            >
              <span>Code: <strong>TREVORI200</strong></span>
              {copiedCode === 'TREVORI200' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-white/60 hover:text-white" />
              )}
            </button>
          </div>

          <div className="hidden sm:block w-px h-10 bg-white/20" />

          {/* Offer 2: Buy 3 Get ₹500 OFF */}
          <div className="flex flex-col items-start">
            <span className="text-xs sm:text-sm font-semibold tracking-wide text-white drop-shadow-sm">
              Buy 3 Get <span className="font-extrabold text-[#FFF4E0]">Flat ₹500 OFF</span>
            </span>
            <button
              onClick={() => handleCopy('TREVORI500')}
              className="mt-1.5 flex items-center gap-1.5 px-3 py-1 bg-black/90 hover:bg-black text-white text-[11px] font-bold uppercase tracking-wider rounded border border-white/20 transition-all hover:scale-[1.02] active:scale-[0.98] shadow-sm cursor-pointer"
              title="Click to copy coupon code"
            >
              <span>Code: <strong>TREVORI500</strong></span>
              {copiedCode === 'TREVORI500' ? (
                <Check className="w-3 h-3 text-emerald-400" />
              ) : (
                <Copy className="w-3 h-3 text-white/60 hover:text-white" />
              )}
            </button>
          </div>
        </div>

        {/* Right Side: Editorial Models in Streetwear Hoodies */}
        <div className="hidden lg:flex items-center gap-3 shrink-0">
          <div className="w-16 h-24 sm:w-20 sm:h-28 rounded overflow-hidden shadow-md border border-white/25">
            <img
              src="/images/models/street_man_hoodie.jpg"
              alt="TREVORI Winterwear Hoodie"
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
            />
          </div>
          <div className="w-16 h-24 sm:w-20 sm:h-28 rounded overflow-hidden shadow-md border border-white/25">
            <img
              src="/images/models/man_hoodie.jpg"
              alt="TREVORI French Terry Streetwear"
              className="w-full h-full object-cover object-top hover:scale-105 transition-transform duration-500"
            />
          </div>
        </div>

        {/* Terms notice bottom right */}
        <div className="absolute bottom-2 right-4 text-[9px] uppercase tracking-wider text-white/60 select-none">
          *T&C Apply • Automatic at checkout
        </div>
      </div>
    </div>
  );
};
