import React from 'react';
import { ShieldCheck, Sparkles, Feather } from 'lucide-react';

export const FabricPromise: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6 sm:px-10 border-t border-[#1E3A66]/40 bg-[#07111E] text-white font-sans">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F88379]/15 border border-[#F88379]/40 text-[#F88379] text-[10px] uppercase tracking-wider font-sans font-bold shadow-sm mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F88379] animate-pulse" />
          <span>The Trevori Standard</span>
        </div>
        <h2 className="font-sans text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-1">
          Engineered to Outlast Standard Tees
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] font-normal mt-3">
          We reject thin, see-through 160 GSM mall t-shirts. Every piece is constructed in India with heavy cotton that maintains its boxy drape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 bg-[#0B1A30] border border-[#1E3A66]/60 space-y-3 shadow-xl text-white backdrop-blur-md">
          <Feather className="w-5 h-5 text-[#F88379]" />
          <h3 className="font-sans text-xl text-white font-bold">240–400 GSM Heavyweights</h3>
          <p className="text-xs text-[#94A3B8] font-normal leading-relaxed">
            Our oversized tees start at 240 GSM and our sweatshirts are crafted in 400 GSM diagonal loop French Terry. Noticeably weighty with zero transparency.
          </p>
        </div>

        <div className="p-7 bg-[#0B1A30] border border-[#1E3A66]/60 space-y-3 shadow-xl text-white backdrop-blur-md">
          <ShieldCheck className="w-5 h-5 text-[#F88379]" />
          <h3 className="font-sans text-xl text-white font-bold">Zero Shrinkage Guarantee</h3>
          <p className="text-xs text-[#94A3B8] font-normal leading-relaxed">
            Pre-shrunk and bio-washed combed cotton. Tested to resist collar sagging, side-seam twisting, and shrinkage even after 50+ wash cycles.
          </p>
        </div>

        <div className="p-7 bg-[#0B1A30] border border-[#1E3A66]/60 space-y-3 shadow-xl text-white backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-[#F88379]" />
          <h3 className="font-sans text-xl text-white font-bold">Unisex Streetwear Cuts</h3>
          <p className="text-xs text-[#94A3B8] font-normal leading-relaxed">
            Carefully proportioned dropped shoulders with structured sleeves that flatter both men and women effortlessly.
          </p>
        </div>
      </div>
    </section>
  );
};
