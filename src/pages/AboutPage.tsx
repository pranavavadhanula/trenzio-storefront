import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Feather, Sparkles, ArrowRight, Check } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-10 sm:py-20 max-w-5xl mx-auto px-6 sm:px-10 bg-[#F9F6F0] text-[#2A1810]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#7BB8E8] font-mono font-bold">
          The Philosophy
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#2A1810] tracking-tight mt-2 mb-4">
          Rejecting Flimsy. <br />
          <span className="italic text-[#6E4733]">Engineering Substance.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#6E4733] font-light leading-relaxed">
          Trenzio was founded with a single obsession: to dismantle the disposable 160 GSM mall t-shirt culture and create authentic heavyweight luxury streetwear designed, milled, and crafted in India.
        </p>
      </div>

      {/* The 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-8 bg-[#2A1810] border border-[#4E3022] space-y-4 shadow-xl text-[#FAF6EE]">
          <Feather className="w-6 h-6 text-[#7BB8E8]" />
          <h3 className="font-serif text-2xl text-[#FAF6EE]">350 GSM Density</h3>
          <p className="text-xs text-[#EAE2D2]/80 font-light leading-relaxed">
            Twice the weight of fast-fashion blanks. Creates a sharp, boxy drape that does not cling or wrinkle throughout the day.
          </p>
        </div>

        <div className="p-8 bg-[#2A1810] border border-[#4E3022] space-y-4 shadow-xl text-[#FAF6EE]">
          <ShieldCheck className="w-6 h-6 text-[#7BB8E8]" />
          <h3 className="font-serif text-2xl text-[#FAF6EE]">Zero Shrinkage</h3>
          <p className="text-xs text-[#EAE2D2]/80 font-light leading-relaxed">
            Our fabrics undergo biological enzyme washes and rigorous pre-shrinking. Your tee fits the exact same way after 50 machine cycles.
          </p>
        </div>

        <div className="p-8 bg-[#2A1810] border border-[#4E3022] space-y-4 shadow-xl text-[#FAF6EE]">
          <Sparkles className="w-6 h-6 text-[#7BB8E8]" />
          <h3 className="font-serif text-2xl text-[#FAF6EE]">Unisex Geometry</h3>
          <p className="text-xs text-[#EAE2D2]/80 font-light leading-relaxed">
            Calibrated dropped shoulders and tailored armholes that flatter both men and women with relaxed effortless drape.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="p-8 sm:p-14 bg-[#2A1810] border border-[#4E3022] space-y-6 mb-20 text-[#EAE2D2] font-light leading-relaxed text-xs sm:text-sm shadow-2xl">
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
          Crafted With Printrove Fulfillment Across India
        </h2>
        <p>
          We partnered directly with Printrove's cutting-edge facilities to ensure every garment meets strict dimensional accuracy. Every seam is double-needle stitched, collars are reinforced with 1x1 elastane ribbed cotton, and eco-friendly Oeko-Tex certified inks ensure color stays rich wash after wash.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#4E3022] font-mono text-xs text-[#FAF6EE]">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#7BB8E8] font-bold" />
            <span>100% Super-Combed Indian Cotton</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#7BB8E8] font-bold" />
            <span>Bio-Washed & Silicon Softened</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#7BB8E8] font-bold" />
            <span>Anti-Pilling Yarn Construction</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#7BB8E8] font-bold" />
            <span>Pan-India Doorstep Dispatch within 24h</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <Link
          to="/collections/all"
          className="inline-flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-[#7BB8E8] to-[#5E9ED5] text-[#2A1810] text-xs uppercase tracking-widest font-bold hover:brightness-105 shadow-lg transition-all cursor-pointer font-mono"
        >
          <span>Shop The Heavyweight Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
