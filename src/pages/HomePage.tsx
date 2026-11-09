import React from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, ShieldCheck, Feather, Truck, RotateCcw } from 'lucide-react';

export const HomePage: React.FC = () => {
  return (
    <div className="space-y-16 sm:space-y-24 pb-20">
      {/* 1. Main Editorial Campaign Hero (Zara Style Full Viewport) */}
      <section className="relative min-h-[85vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <img
            src="https://images.unsplash.com/photo-1523381294911-8d3cead13475?auto=format&fit=crop&w=2200&q=90"
            alt="Trenzio Heavyweight Streetwear Editorial"
            className="w-full h-full object-cover object-center scale-100 opacity-40 filter contrast-125 brightness-90"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-atelier-950 via-atelier-950/60 to-atelier-950/30" />
        </div>

        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center pt-10 pb-16">
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-atelier-gold/40 bg-atelier-900/80 backdrop-blur-md mb-6">
            <Sparkles className="w-3 h-3 text-atelier-gold" />
            <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-medium">
              Campaign Drop 01 &bull; 350 GSM Pure Cotton
            </span>
          </div>

          <h1 className="font-serif text-4xl sm:text-6xl md:text-7xl font-light text-atelier-100 tracking-tight leading-[1.08] mb-6">
            Heavyweight Oversized Tees <br />
            <span className="italic font-normal text-atelier-sand">& Luxury Streetwear</span>
          </h1>

          <p className="max-w-xl mx-auto text-xs sm:text-sm text-neutral-300 font-light leading-relaxed mb-10 tracking-wide">
            Rejecting flimsy mall apparel. Super-combed bio-washed cotton engineered in India for a structured boxy drape with zero shrinkage.
          </p>

          {/* Zara-Style Direct Tab Links */}
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              to="/collections/oversized-tees"
              className="w-full sm:w-auto px-8 py-4 bg-gradient-to-r from-atelier-gold via-[#d4b38a] to-atelier-gold text-atelier-950 text-xs font-bold uppercase tracking-[0.2em] hover:brightness-110 shadow-lg shadow-black/40 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
            >
              <span>Explore Oversized Tees (₹285)</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
            <Link
              to="/collections/sweatshirts"
              className="w-full sm:w-auto px-8 py-4 border border-atelier-gold/40 text-atelier-100 text-xs uppercase tracking-[0.2em] hover:bg-atelier-gold hover:text-atelier-950 transition-all duration-300 backdrop-blur-sm flex items-center justify-center cursor-pointer font-mono"
            >
              <span>Explore Sweatshirts (400 GSM)</span>
            </Link>
          </div>
        </div>
      </section>

      {/* 2. Zara-Style Dual Lookbook Banners (Men & Women) */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="text-center mb-8">
          <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-mono font-medium">
            Lookbook Chapters
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl text-atelier-100 font-light mt-1">
            Curated Lines
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Men's Line */}
          <Link
            to="/collections/men"
            className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-atelier-900 border border-white/10 flex flex-col justify-end p-8 sm:p-12 transition-all block cursor-pointer"
            title="Open Men's Collection Tab"
          >
            <img
              src="https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=1200&q=85"
              alt="Men's Streetwear Heavyweight Fits"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 filter contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-atelier-950 via-atelier-950/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-mono font-medium">
                Line 01
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-atelier-100 font-light group-hover:text-atelier-gold transition-colors">
                Men's Heavyweight Fits
              </h3>
              <p className="text-xs text-neutral-300 font-light max-w-sm">
                Boxy dropped-shoulders, ribbed collars, and structured 240–400 GSM cotton.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-atelier-gold font-mono font-bold group-hover:translate-x-1 transition-transform">
                  <span>Enter Men's Tab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>

          {/* Women's Line */}
          <Link
            to="/collections/women"
            className="group relative aspect-[4/5] sm:aspect-[3/4] overflow-hidden bg-atelier-900 border border-white/10 flex flex-col justify-end p-8 sm:p-12 transition-all block cursor-pointer"
            title="Open Women's Collection Tab"
          >
            <img
              src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85"
              alt="Women's Streetwear Oversized Silhouette"
              className="absolute inset-0 w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 opacity-60 filter contrast-110"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-atelier-950 via-atelier-950/40 to-transparent" />
            <div className="relative z-10 space-y-2">
              <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-mono font-medium">
                Line 02
              </span>
              <h3 className="font-serif text-3xl sm:text-4xl text-atelier-100 font-light group-hover:text-atelier-gold transition-colors">
                Women's Oversized Cuts
              </h3>
              <p className="text-xs text-neutral-300 font-light max-w-sm">
                Relaxed drape with proportional armholes and heavyweight loop Terry.
              </p>
              <div className="pt-2">
                <span className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-atelier-gold font-mono font-bold group-hover:translate-x-1 transition-transform">
                  <span>Enter Women's Tab</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </span>
              </div>
            </div>
          </Link>
        </div>
      </section>

      {/* 3. Interactive 3D Virtual Try-On Studio Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative p-8 sm:p-14 bg-atelier-900/90 border border-atelier-gold/40 overflow-hidden shadow-2xl">
          <div className="relative z-10 max-w-xl space-y-4">
            <div className="inline-flex items-center gap-2 px-3 py-1 bg-atelier-gold text-atelier-950 text-[10px] uppercase tracking-widest font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Interactive Virtual Fitting Room</span>
            </div>
            <h2 className="font-serif text-3xl sm:text-5xl text-atelier-100 font-light leading-tight">
              Try Outfits on Yourself <br />
              <span className="italic text-atelier-sand">In Interactive 3D</span>
            </h2>
            <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
              Upload your photo or snap a selfie with your camera to see how Trenzio's boxy dropped shoulders and 350 GSM drape fit your body before checking out.
            </p>
            <div className="pt-2">
              <Link
                to="/try-on"
                className="inline-flex px-8 py-3.5 bg-gradient-to-r from-atelier-gold via-[#d4b38a] to-atelier-gold text-atelier-950 text-xs font-bold uppercase tracking-[0.2em] hover:brightness-110 shadow-lg shadow-black/40 transition-all items-center justify-center gap-2 font-mono cursor-pointer"
              >
                <span>Launch 3D Try-On Studio</span>
                <ArrowRight className="w-4 h-4" />
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* 4. The Trenzio Standards Banner */}
      <section className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pt-8 border-t border-white/10">
          <div className="p-6 bg-white/[0.02] border border-white/5 space-y-3">
            <Feather className="w-5 h-5 text-atelier-gold" />
            <h3 className="font-serif text-xl text-atelier-100">240–400 GSM Heavyweights</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Twice the weight of mall fast fashion. Holds its clean drape all day with zero fabric cling.
            </p>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/5 space-y-3">
            <ShieldCheck className="w-5 h-5 text-atelier-gold" />
            <h3 className="font-serif text-xl text-atelier-100">Zero Shrinkage Guarantee</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Bio-washed and pre-shrunk cotton. Guaranteed to retain its exact measurements after 50+ washes.
            </p>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/5 space-y-3">
            <Truck className="w-5 h-5 text-atelier-gold" />
            <h3 className="font-serif text-xl text-atelier-100">Pan-India Express Dispatch</h3>
            <p className="text-xs text-neutral-400 font-light leading-relaxed">
              Free delivery on orders above ₹1,999. Easy 7-day size exchanges with doorstep pickup.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
};
