import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Feather, Sparkles, ArrowRight, Check } from 'lucide-react';

export const AboutPage: React.FC = () => {
  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 bg-[#F4F1EA] text-[#171717] font-sans">
      {/* Editorial Header */}
      <div className="text-center max-w-2xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B9AA96] font-semibold block mb-2">
          The Trevori Atelier
        </span>
        <h1 className="font-serif text-4xl sm:text-6xl font-normal text-[#171717] tracking-tight mb-4">
          Rejecting Flimsy. <br />
          <span className="italic">Engineering Substance.</span>
        </h1>
        <p className="text-xs sm:text-sm text-[#706B64] font-light leading-relaxed">
          Trevori was conceived with an uncompromising conviction: to build contemporary luxury streetwear rooted in architectural brutalism, generous minimalist drape, and tactile garment integrity.
        </p>
      </div>

      {/* The 3 Core Pillars */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16">
        <div className="p-8 bg-[#FFFFFF] border border-[#DDD8CE] space-y-4">
          <Feather className="w-6 h-6 text-[#B9AA96]" />
          <h3 className="font-serif text-2xl font-normal text-[#171717]">Architectural Cotton</h3>
          <p className="text-xs text-[#706B64] font-light leading-relaxed">
            Constructed with high-density bio-washed combed cotton jersey and French Terry for an enduring architectural silhouette.
          </p>
        </div>

        <div className="p-8 bg-[#FFFFFF] border border-[#DDD8CE] space-y-4">
          <ShieldCheck className="w-6 h-6 text-[#B9AA96]" />
          <h3 className="font-serif text-2xl font-normal text-[#171717]">Zero Synthetic Fillers</h3>
          <p className="text-xs text-[#706B64] font-light leading-relaxed">
            Our textiles are 100% natural organic cotton fibers, biological enzyme washed for softness without chemical synthetic residues.
          </p>
        </div>

        <div className="p-8 bg-[#FFFFFF] border border-[#DDD8CE] space-y-4">
          <Sparkles className="w-6 h-6 text-[#B9AA96]" />
          <h3 className="font-serif text-2xl font-normal text-[#171717]">Mathematical Drape</h3>
          <p className="text-xs text-[#706B64] font-light leading-relaxed">
            Calibrated dropped shoulders and reinforced 1.25" collars engineered to flatter with natural spatial presence.
          </p>
        </div>
      </div>

      {/* Narrative Section */}
      <div className="p-8 sm:p-14 bg-[#FFFFFF] border border-[#DDD8CE] space-y-6 mb-16 text-[#706B64] font-light leading-relaxed text-xs sm:text-sm">
        <h2 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal">
          Crafted with Reverence for Pure Textile Chemistry
        </h2>
        <p>
          We operate direct artisan production facilities to ensure every garment meets strict dimensional accuracy. Every seam is double-needle flatlock stitched, collars are reinforced with high-density elastane ribbed cotton, and low-impact dyes preserve textile luster wash after wash.
        </p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#DDD8CE] text-xs text-[#171717] font-medium">
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#B9AA96]" />
            <span>100% Super-Combed Ring-Spun Cotton</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#B9AA96]" />
            <span>Enzyme Bio-Washed & Silicon Softened</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#B9AA96]" />
            <span>Anti-Torque & Anti-Pilling Yarn Weave</span>
          </div>
          <div className="flex items-center gap-2">
            <Check className="w-4 h-4 text-[#B9AA96]" />
            <span>Worldwide Tracked Courier Dispatch</span>
          </div>
        </div>
      </div>

      {/* CTA */}
      <div className="text-center space-y-4">
        <Link
          to="/collections"
          className="inline-flex items-center gap-2 px-8 py-4 bg-[#171717] text-white text-xs uppercase tracking-[0.2em] font-medium hover:bg-[#333333] transition-colors"
        >
          <span>Explore The Collection</span>
          <ArrowRight className="w-4 h-4" />
        </Link>
      </div>
    </div>
  );
};
