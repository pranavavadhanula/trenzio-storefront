import React from 'react';
import { ShieldCheck, Sparkles, Feather } from 'lucide-react';

export const FabricPromise: React.FC = () => {
  return (
    <section className="py-20 max-w-7xl mx-auto px-6 sm:px-10 border-t border-white/5">
      <div className="text-center max-w-2xl mx-auto mb-14">
        <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-mono font-medium">
          The Trenzio Standard
        </span>
        <h2 className="font-serif text-3xl sm:text-4xl font-light text-atelier-100 tracking-tight mt-2">
          Engineered to Outlast Standard Tees
        </h2>
        <p className="text-xs sm:text-sm text-neutral-300 font-light mt-3">
          We reject thin, see-through 160 GSM mall t-shirts. Every piece is constructed in India with heavy cotton that maintains its boxy drape.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-7 bg-atelier-900/60 border border-white/10 space-y-3">
          <Feather className="w-5 h-5 text-atelier-gold" />
          <h3 className="font-serif text-xl text-atelier-100">240–450 GSM Heavyweights</h3>
          <p className="text-xs text-neutral-300 font-light leading-relaxed">
            Our oversized tees start at 240 GSM and our sweatshirts are crafted in 400 GSM diagonal loop French Terry. Noticeably weighty with zero transparency.
          </p>
        </div>

        <div className="p-7 bg-atelier-900/60 border border-white/10 space-y-3">
          <ShieldCheck className="w-5 h-5 text-atelier-gold" />
          <h3 className="font-serif text-xl text-atelier-100">Zero Shrinkage Guarantee</h3>
          <p className="text-xs text-neutral-300 font-light leading-relaxed">
            Pre-shrunk and bio-washed combed cotton. Tested to resist collar sagging, side-seam twisting, and shrinkage even after 50+ wash cycles.
          </p>
        </div>

        <div className="p-7 bg-atelier-900/60 border border-white/10 space-y-3">
          <Sparkles className="w-5 h-5 text-atelier-gold" />
          <h3 className="font-serif text-xl text-atelier-100">Unisex Streetwear Cuts</h3>
          <p className="text-xs text-neutral-300 font-light leading-relaxed">
            Carefully proportioned dropped shoulders with structured sleeves that flatter both men and women effortlessly.
          </p>
        </div>
      </div>
    </section>
  );
};
