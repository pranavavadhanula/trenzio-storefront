import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="relative bg-gradient-to-r from-[#FFF5F2] via-[#FFF9F7] to-[#FFF5F2] text-[#2D120B] border-b border-[#FFDCD4]/70 text-[11px] uppercase tracking-[0.2em] py-2 px-4 text-center overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,1)] font-sans">
      {/* High-gloss specular reflection */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/80 via-transparent to-transparent" />

      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between font-sans">
        <span className="hidden md:inline px-2.5 py-0.5 bg-white text-[#1C0A06] font-bold text-[10px] tracking-wider border border-[#FFDCD4] shadow-sm rounded-none">
          PAN-INDIA EXPRESS
        </span>
        <span className="mx-auto text-[#2D120B] font-semibold tracking-wider text-[11px]">
          Free Shipping Across India On Orders Above ₹1,999 &bull; UPI, Cards & Cash on Delivery Available
        </span>
        <span className="hidden md:inline text-[#7A3F33] font-bold text-[10px] tracking-wider">
          100% COMBED COTTON &bull; 240–400 GSM
        </span>
      </div>
    </div>
  );
};
