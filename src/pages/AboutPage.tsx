import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Feather, Sparkles, ArrowRight, Check } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-10 sm:py-20 max-w-5xl mx-auto px-6 sm:px-10 bg-[#07111E] text-white font-sans">
      {/* Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F88379]/15 border border-[#F88379]/40 text-[#F88379] text-[10px] uppercase tracking-wider font-bold shadow-sm mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F88379] animate-pulse" />
          <span>The Philosophy</span>
        </div>
        <h1 className="font-sans text-4xl sm:text-6xl font-extrabold text-white tracking-tight mt-1 mb-4">
          Rejecting Flimsy. <br />
          <span className="italic text-[#F88379]">Engineering Substance.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] font-normal leading-relaxed">
          Trenzio was founded with a single obsession: to dismantle the disposable 160 GSM mall t-shirt culture and create authentic heavyweight luxury streetwear designed, milled, and crafted in India.
        </p>
      </div>

      {/* The 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-20">
        <div className="p-8 bg-[#0B1A30] border border-[#1E3A66]/60 space-y-4 shadow-xl text-white backdrop-blur-md">
          <Feather className="w-6 h-6 text-[#F88379]" />
          <h3 className="font-sans text-2xl font-bold text-white">350 GSM Density</h3>
          <p className="text-xs text-[#94A3B8] font-normal leading-relaxed">
            Twice the weight of fast-fashion blanks. Creates a sharp, boxy drape that does not cling or wrinkle throughout the day.
          </p>
        </div>

        <div className="p-8 bg-[#0B1A30] border border-[#1E3A66]/60 space-y-4 shadow-xl text-white backdrop-blur-md">
          <ShieldCheck className="w-6 h-6 text-[#F88379]" />
          <h3 className="font-sans text-2xl font-bold text-white">Zero Shrinkage</h3>
          <p className="text-xs text-[#94A3B8] font-normal leading-relaxed">
            Our fabrics undergo biological enzyme washes and rigorous pre-shrinking. Your tee fits the exact same way after 50 machine cycles.
          </p>
        </div>

        <div className="p-8 bg-[#0B1A30] border border-[#1E3A66]/60 space-y-4 shadow-xl text-white backdrop-blur-md">
          <Sparkles className="w-6 h-6 text-[#F88379]" />
          <h3 className="font-sans text-2xl font-bold text-white">Unisex Geometry</h3>
          <p className="text-xs text-[#94A3B8] font-normal leading-relaxed">
            Calibrated dropped shoulders and tailored armholes that flatter both men and women with relaxed effortless drape.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="p-8 sm:p-14 bg-[#0B1A30] border border-[#1E3A66]/60 space-y-6 mb-20 text-[#CBD5E1] font-normal leading-relaxed text-xs sm:text-sm shadow-2xl backdrop-blur-md">
        <h2 className="font-sans text-2xl sm:text-3xl text-white font-bold">
          Crafted In Our Dedicated Indian Ateliers
        </h2>
        <p className="text-[#94A3B8]">
          We operate direct artisan production facilities across India to ensure every garment meets strict dimensional accuracy. Every seam is double-needle stitched, collars are reinforced with 1x1 elastane ribbed cotton, and eco-friendly Oeko-Tex certified inks ensure color stays rich wash after wash.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#1E3A66]/40 text-xs text-white font-medium">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#F88379] font-bold" />
            <span>100% Super-Combed Indian Cotton</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#F88379] font-bold" />
            <span>Bio-Washed & Silicon Softened</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#F88379] font-bold" />
            <span>Anti-Pilling Yarn Construction</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#F88379] font-bold" />
            <span>Pan-India Doorstep Dispatch within 24h</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <Link
          to="/collections/all"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs uppercase tracking-wider font-bold shadow-[0_4px_16px_rgba(248,131,121,0.4)] transition-all cursor-pointer font-sans"
        >
          <span>Shop The Heavyweight Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
