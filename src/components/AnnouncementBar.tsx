import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="relative bg-[#071324] text-[#E2E8F0] border-b border-[#1A3050] text-[11px] uppercase tracking-[0.2em] py-2 px-4 text-center overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.15)] font-sans">
      {/* Glossy specular reflection */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between font-sans">
        <span className="hidden md:inline px-2.5 py-0.5 bg-[#0D2240] text-[#F88379] font-bold text-[10px] tracking-wider border border-[#F88379]/40 shadow-sm rounded-none">
          PAN-INDIA EXPRESS
        </span>
        <span className="mx-auto text-[#E2E8F0] font-medium tracking-wider text-[11px]">
          Free Shipping Across India On Orders Above ₹1,999 &bull; UPI, Cards & Cash on Delivery Available
        </span>
        <span className="hidden md:inline text-[#94A3B8] font-bold text-[10px] tracking-wider">
          100% COMBED COTTON &bull; 240–400 GSM
        </span>
      </div>
    </div>
  );
};
