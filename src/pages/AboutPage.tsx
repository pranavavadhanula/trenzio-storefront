import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Feather, Sparkles, ArrowRight, Check } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-10 sm:py-20 max-w-5xl mx-auto px-6 sm:px-10 bg-[#EBF3FA] text-[#FFFFFF]">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/40 text-[#2563EB] text-[10px] uppercase tracking-[0.3em] font-mono font-bold shadow-[0_0_15px_rgba(255,122,0,0.25)] mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#2563EB] animate-pulse" />
          <span>The Philosophy</span>
        </div>
        <h1 className="font-serif text-4xl sm:text-6xl font-light text-[#FFFFFF] tracking-tight mt-1 mb-4">
          Rejecting Flimsy. <br />
          <span className="italic text-[#2563EB]">Engineering Substance.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#3B82F6] font-light leading-relaxed">
          Trenzio was founded with a single obsession: to dismantle the disposable 160 GSM mall t-shirt culture and create authentic heavyweight luxury streetwear designed, milled, and crafted in India.
        </p>
      </div>

      {/* The 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-8 bg-white border border-[#3B82F6]/20 space-y-4 shadow-xl text-[#FFFFFF] backdrop-blur-md">
          <Feather className="w-6 h-6 text-[#2563EB]" />
          <h3 className="font-serif text-2xl text-[#FFFFFF]">350 GSM Density</h3>
          <p className="text-xs text-[#3B82F6]/80 font-light leading-relaxed">
            Twice the weight of fast-fashion blanks. Creates a sharp, boxy drape that does not cling or wrinkle throughout the day.
          </p>
        </div>

        <div className="p-8 bg-white border border-[#3B82F6]/20 space-y-4 shadow-xl text-[#FFFFFF] backdrop-blur-md">
          <ShieldCheck className="w-6 h-6 text-[#2563EB]" />
          <h3 className="font-serif text-2xl text-[#FFFFFF]">Zero Shrinkage</h3>
          <p className="text-xs text-[#3B82F6]/80 font-light leading-relaxed">
            Our fabrics undergo biological enzyme washes and rigorous pre-shrinking. Your tee fits the exact same way after 50 machine cycles.
          </p>
        </div>

        <div className="p-8 bg-white border border-[#3B82F6]/20 space-y-4 shadow-xl text-[#FFFFFF] backdrop-blur-md">
          <Sparkles className="w-6 h-6 text-[#2563EB]" />
          <h3 className="font-serif text-2xl text-[#FFFFFF]">Unisex Geometry</h3>
          <p className="text-xs text-[#3B82F6]/80 font-light leading-relaxed">
            Calibrated dropped shoulders and tailored armholes that flatter both men and women with relaxed effortless drape.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="p-8 sm:p-14 bg-white border border-[#3B82F6]/20 space-y-6 mb-20 text-[#3B82F6] font-light leading-relaxed text-xs sm:text-sm shadow-2xl backdrop-blur-md">
        <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
          Crafted With Printrove Fulfillment Across India
        </h2>
        <p>
          We partnered directly with Printrove's cutting-edge facilities to ensure every garment meets strict dimensional accuracy. Every seam is double-needle stitched, collars are reinforced with 1x1 elastane ribbed cotton, and eco-friendly Oeko-Tex certified inks ensure color stays rich wash after wash.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#3B82F6]/20 font-mono text-xs text-[#FFFFFF]">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#2563EB] font-bold" />
            <span>100% Super-Combed Indian Cotton</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#2563EB] font-bold" />
            <span>Bio-Washed & Silicon Softened</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#2563EB] font-bold" />
            <span>Anti-Pilling Yarn Construction</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#2563EB] font-bold" />
            <span>Pan-India Doorstep Dispatch within 24h</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <Link
          to="/collections/all"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs uppercase tracking-widest font-black shadow-[0_4px_16px_rgba(248,131,121,0.4)] transition-all cursor-pointer font-mono"
        >
          <span>Shop The Heavyweight Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
