import React from 'react';
import { ShieldCheck, Sparkles, Feather } from 'lucide-react';

export const FabricPromise: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6 sm:px-10 border-t border-[#D4C3A3]/20 bg-[#0A160F] text-[#F4ECE1]">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162E21] border border-[#D4C3A3]/35 text-[#E6D7C3] text-[10px] uppercase tracking-[0.3em] font-mono font-bold shadow-[0_0_15px_rgba(212,195,163,0.15)] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#E6D7C3] animate-pulse" />
          <span>The Trenzio Standard</span>
        </div>
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#F4ECE1] tracking-tight mt-1">
          Engineered to Outlast Standard Tees
        </h2>
        <p className="text-xs sm:text-sm text-[#D4C3A3] font-light mt-3">
          We reject thin, see-through 160 GSM mall t-shirts. Every piece is constructed in India with heavy cotton that maintains its boxy drape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 bg-[#112319] border border-[#D4C3A3]/20 space-y-3 shadow-xl text-[#F4ECE1] backdrop-blur-md">
          <Feather className="w-5 h-5 text-[#E6D7C3]" />
          <h3 className="font-serif text-xl text-[#F4ECE1]">240–400 GSM Heavyweights</h3>
          <p className="text-xs text-[#D4C3A3]/80 font-light leading-relaxed">
            Our oversized tees start at 240 GSM and our sweatshirts are crafted in 400 GSM diagonal loop French Terry. Noticeably weighty with zero transparency.
          </p>
        </div>

        <div className="p-7 bg-[#112319] border border-[#D4C3A3]/20 space-y-3 shadow-xl text-[#F4ECE1] backdrop-blur-md">
          <ShieldCheck className="w-5 h-5 text-[#E6D7C3]" />
          <h3 className="font-serif text-xl text-[#F4ECE1]">Zero Shrinkage Guarantee</h3>
          <p className="text-xs text-[#D4C3A3]/80 font-light leading-relaxed">
            Pre-shrunk and bio-washed combed cotton. Tested to resist collar sagging, side-seam twisting, and shrinkage even after 50+ wash cycles.
          </p>
        </div>

        <div className="p-7 bg-[#112319] border border-[#D4C3A3]/20 space-y-3 shadow-xl text-[#F4ECE1] backdrop-blur-md">
          <Sparkles className="w-5 h-5 text-[#E6D7C3]" />
          <h3 className="font-serif text-xl text-[#F4ECE1]">Unisex Streetwear Cuts</h3>
          <p className="text-xs text-[#D4C3A3]/80 font-light leading-relaxed">
            Carefully proportioned dropped shoulders with structured sleeves that flatter both men and women effortlessly.
          </p>
        </div>
      </div>
    </section>
  );
};