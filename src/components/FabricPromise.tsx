import React from 'react';
import { ShieldCheck, Sparkles, Feather } from 'lucide-react';

export const FabricPromise: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6 sm:px-10 border-t border-[#1E293B] bg-[#060C1A] text-white">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/40 text-[#60A5FA] text-[10px] uppercase tracking-[0.3em] font-mono font-bold shadow-[0_0_15px_rgba(37,99,235,0.25)] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
          <span>The Trenzio Standard</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight mt-1">
          Engineered to Outlast Standard Tees
        </h2>
        <p className="text-xs sm:text-sm text-[#94A3B8] font-light mt-3">
          We reject thin, see-through 160 GSM mall t-shirts. Every piece is constructed in India with heavy cotton that maintains its boxy drape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 bg-[#0D1B3A] border border-[#2563EB]/20 space-y-3 shadow-xl text-white backdrop-blur-md">
          <Feather className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="font-serif text-xl text-white">240–400 GSM Heavyweights</h3>
          <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
            Our oversized tees start at 240 GSM and our sweatshirts are crafted in 400 GSM diagonal loop French Terry. Noticeably weighty with zero transparency.
          </p>
        </div>

        <div className="p-7 bg-[#0D1B3A] border border-[#2563EB]/20 space-y-3 shadow-xl text-white backdrop-blur-md">
          <ShieldCheck className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="font-serif text-xl text-white">Zero Shrinkage Guarantee</h3>
          <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
            Pre-shrunk and bio-washed combed cotton. Tested to resist collar sagging, side-seam twisting, and shrinkage even after 50+ wash cycles.
          </p>
        </div>

        <div className="p-7 bg-[#0D1B3A] border border-[#2563EB]/20 space-y-3 shadow-xl text-white backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-[#3B82F6]" />
          <h3 className="font-serif text-xl text-white">Unisex Streetwear Cuts</h3>
          <p className="text-xs text-[#94A3B8] font-light leading-relaxed">
            Carefully proportioned dropped shoulders with structured sleeves that flatter both men and women effortlessly.
          </p>
        </div>
      </div>
    </section>
  );
};