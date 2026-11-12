import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="relative bg-[#C8523B] text-[#FFF5F0] border-b border-[#B0432E] text-[11px] uppercase tracking-[0.2em] py-2 px-4 text-center overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25)] font-sans">
      {/* Glossy sheen reflection */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.15] via-transparent to-black/20" />

      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between font-sans">
        <span className="hidden md:inline px-2.5 py-0.5 bg-[#A33925] text-white font-bold text-[10px] tracking-wider border border-white/30 shadow-sm">
          PAN-INDIA EXPRESS
        </span>
        <span className="mx-auto text-white font-medium tracking-wider text-[11px]">
          Free Shipping Across India On Orders Above ₹1,999 &bull; UPI, Cards & Cash on Delivery Available
        </span>
        <span className="hidden md:inline text-[#FFE4DC] font-semibold text-[10px] tracking-wider">
          100% COMBED COTTON &bull; 240–400 GSM
        </span>
      </div>
    </div>
  );
};
