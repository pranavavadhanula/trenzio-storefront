import React, { useState } from 'react';
import { Copy, Check, Sparkles, Tag, ShieldCheck } from 'lucide-react';

interface TrevoriOfferTicketBannerProps {
  code?: string;
  discountText?: string;
  minOrderText?: string;
  perksText?: string;
}

export const TrevoriOfferTicketBanner: React.FC<TrevoriOfferTicketBannerProps> = ({
  code = 'PREPAID100',
  discountText = 'FLAT ₹100 OFF',
  minOrderText = 'on all Prepaid & UPI orders above ₹1,499',
  perksText = 'Instant Checkout Discount • Free Express Delivery',
}) => {
  const [copied, setCopied] = useState(false);

  const handleCopyCode = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => {
      setCopied(false);
    }, 2800);
  };

  return (
    <section className="w-full py-4 sm:py-6 px-3 sm:px-6 lg:px-8 bg-[#F4F1EA] select-none">
      <div className="max-w-6xl mx-auto">
        {/* Ticket Container */}
        <div className="relative group overflow-hidden bg-[#111111] text-white rounded-xl sm:rounded-2xl border border-[#2A2A2A] shadow-[0_12px_36px_rgba(0,0,0,0.18)] transition-all duration-300">
          
          {/* Ambient Background Texture / Luxury Mesh Gradient */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.08),transparent_65%),radial-gradient(ellipse_at_bottom_left,rgba(185,170,150,0.06),transparent_60%)] pointer-events-none" />

          {/* Left Decorative Scalloped Notches (Authentic Ticket Cutouts) */}
          <div className="absolute left-0 top-0 bottom-0 w-3 flex flex-col justify-around py-1 pointer-events-none z-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={`left-notch-${i}`}
                className="w-3 h-3 -ml-1.5 rounded-full bg-[#F4F1EA] shadow-[inset_1px_0_2px_rgba(0,0,0,0.2)]"
              />
            ))}
          </div>

          {/* Right Decorative Scalloped Notches (Authentic Ticket Cutouts) */}
          <div className="absolute right-0 top-0 bottom-0 w-3 flex flex-col justify-around py-1 pointer-events-none z-20">
            {[...Array(5)].map((_, i) => (
              <div
                key={`right-notch-${i}`}
                className="w-3 h-3 -mr-1.5 ml-auto rounded-full bg-[#F4F1EA] shadow-[inset_-1px_0_2px_rgba(0,0,0,0.2)]"
              />
            ))}
          </div>

          {/* Main Content Layout */}
          <div className="relative z-10 flex flex-col md:flex-row items-center justify-between px-6 sm:px-10 py-5 sm:py-4 gap-4 sm:gap-6">
            
            {/* Left Section: Offer Details & Trevori Privilege Tag */}
            <div className="flex-1 min-w-0 pl-1 sm:pl-3 text-center md:text-left">
              {/* Badge Header */}
              <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-[#222222] border border-[#B9AA96]/30 mb-2">
                <Sparkles className="w-3 h-3 text-[#D4AF37] animate-pulse" />
                <span className="text-[10px] tracking-[0.2em] uppercase font-semibold text-[#D4AF37]">
                  TREVORI PRIVILEGE PASS • LIMITED TIME
                </span>
              </div>

              {/* Headline */}
              <div className="flex flex-wrap items-baseline justify-center md:justify-start gap-x-2.5 gap-y-1">
                <h3 className="font-serif text-2xl sm:text-3xl lg:text-[34px] font-bold text-white tracking-tight leading-none">
                  Get <span className="text-white font-extrabold uppercase">{discountText}</span>
                </h3>
              </div>

              {/* Subtext description */}
              <p className="text-xs sm:text-sm text-[#DDD8CE]/90 font-normal mt-1 tracking-wide">
                {minOrderText}
              </p>

              {/* Micro-perks badge */}
              <div className="hidden sm:flex items-center justify-center md:justify-start gap-4 mt-2 text-[11px] text-[#A39E93]">
                <span className="flex items-center gap-1">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4AF37]" />
                  <span>{perksText}</span>
                </span>
                <span className="text-[#555555]">•</span>
                <span className="text-[#D4AF37] font-medium tracking-wider uppercase text-[10px]">
                  Applicable at Checkout
                </span>
              </div>
            </div>

            {/* Vertical Perforated Tear-Line (Visible on Desktop/Tablet) */}
            <div className="hidden md:flex relative flex-col items-center justify-center h-20 px-2">
              {/* Top Semi-Circle Punchout */}
              <div className="absolute -top-6 w-5 h-5 rounded-full bg-[#F4F1EA] shadow-[inset_0_2px_3px_rgba(0,0,0,0.3)] z-20" />
              {/* Dashed Line */}
              <div className="w-[1.5px] h-full border-r-2 border-dashed border-[#444444]" />
              {/* Bottom Semi-Circle Punchout */}
              <div className="absolute -bottom-6 w-5 h-5 rounded-full bg-[#F4F1EA] shadow-[inset_0_-2px_3px_rgba(0,0,0,0.3)] z-20" />
            </div>

            {/* Horizontal Perforated Tear-Line (Visible on Mobile) */}
            <div className="md:hidden relative w-full flex items-center justify-center my-0.5">
              <div className="w-full border-b border-dashed border-[#333333]" />
            </div>

            {/* Right Section: THE GLOWING VOUCHER CODE BOX ("That Particular Thing") */}
            <div className="w-full md:w-auto flex flex-col sm:flex-row items-center justify-center shrink-0 pr-1 sm:pr-3">
              <div
                onClick={handleCopyCode}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => {
                  if (e.key === 'Enter' || e.key === ' ') handleCopyCode(e as any);
                }}
                className="relative group/box cursor-pointer w-full sm:w-auto transition-all duration-300 transform active:scale-95"
                title="Click to copy coupon code"
              >
                {/* 1. UNIQUE LUMINOUS GLOW: Multi-Tier Radiant Aura */}
                <div className="absolute -inset-1 rounded-xl bg-gradient-to-r from-[#F59E0B] via-[#EAB308] to-[#D97706] opacity-75 blur-md group-hover/box:opacity-100 group-hover/box:blur-lg transition-all duration-500 animate-pulse" />
                <div className="absolute -inset-2 rounded-2xl bg-amber-500/20 blur-xl pointer-events-none" />

                {/* 2. Core Golden Voucher Card */}
                <div className="relative flex items-center justify-between sm:justify-start gap-3 sm:gap-4 px-5 py-3 sm:py-3.5 bg-gradient-to-r from-[#F59E0B] via-[#FBBF24] to-[#EAB308] rounded-lg sm:rounded-xl border border-white/40 shadow-[0_6px_25px_rgba(245,158,11,0.55),inset_0_1px_2px_rgba(255,255,255,0.7)] overflow-hidden">
                  
                  {/* Moving Shimmer Specular Light Sweep */}
                  <div className="absolute inset-0 -translate-x-full group-hover/box:animate-none animate-[shimmer-sweep_3.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent pointer-events-none" />

                  {/* Left: Coupon Details */}
                  <div className="flex flex-col text-left">
                    <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.2em] font-extrabold text-[#78350F] leading-none mb-1">
                      USE CODE:
                    </span>
                    <span className="font-mono text-xl sm:text-2xl font-black text-[#171717] tracking-wider leading-none select-all drop-shadow-[0_1px_1px_rgba(255,255,255,0.6)]">
                      {code}
                    </span>
                  </div>

                  {/* Right: 3D Glowing Ticket / Percent Tag & Copy Feedback */}
                  <div className="flex items-center gap-2">
                    {/* 3D Tilted Glowing Red/Coral Discount Ticket Graphic (Matches User's Reference) */}
                    <div className="relative transform -rotate-12 group-hover/box:rotate-0 transition-transform duration-300">
                      <div className="relative flex items-center justify-center w-8 h-8 rounded bg-gradient-to-br from-[#EF4444] to-[#DC2626] text-white font-bold text-xs shadow-[0_4px_12px_rgba(220,38,38,0.5)] border border-red-300/40">
                        <Tag className="w-4 h-4 text-white" />
                        <span className="absolute -top-1 -right-1 flex h-2.5 w-2.5">
                          <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-yellow-300 opacity-75" />
                          <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-yellow-400" />
                        </span>
                      </div>
                    </div>

                    {/* Copy Button / Status Pill */}
                    <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-md bg-[#171717] text-white text-[10px] sm:text-[11px] font-bold uppercase tracking-wider shadow-sm group-hover/box:bg-[#262626] transition-colors">
                      {copied ? (
                        <>
                          <Check className="w-3.5 h-3.5 text-emerald-400" />
                          <span className="text-emerald-300 font-extrabold">COPIED!</span>
                        </>
                      ) : (
                        <>
                          <Copy className="w-3.5 h-3.5 text-[#FBBF24]" />
                          <span>COPY</span>
                        </>
                      )}
                    </div>
                  </div>
                </div>

                {/* Subtitle helper under button */}
                <div className="text-center mt-1.5">
                  <span className="text-[10px] text-[#A39E93] tracking-wider uppercase font-medium group-hover/box:text-[#D4AF37] transition-colors">
                    {copied ? '✓ Applied to clipboard' : '⚡ Tap voucher to copy'}
                  </span>
                </div>
              </div>
            </div>

          </div>
        </div>
      </div>
    </section>
  );
};
