import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="relative bg-black text-[#F8FAFC] border-b border-white/10 text-[10px] uppercase tracking-[0.25em] py-2 px-4 text-center overflow-hidden shadow-[inset_0_1px_0_0_rgba(255,255,255,0.18)]">
      {/* Glossy sheen reflection */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-b from-white/[0.08] via-transparent to-black/60" />

      <div className="relative z-10 max-w-7xl mx-auto flex items-center justify-between">
        <span className="hidden md:inline px-2.5 py-0.5 bg-black/90 text-[#EDE0CC] font-bold font-mono text-[9px] border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_2px_6px_rgba(0,0,0,0.8)]">
          PAN-INDIA EXPRESS
        </span>
        <span className="mx-auto text-[#e5e5e5] font-light tracking-[0.2em]">
          Free Shipping Across India On Orders Above ₹1,999 &bull; UPI, Cards & Cash on Delivery Available
        </span>
        <span className="hidden md:inline text-[#a3a3a3] font-mono text-[9px]">
          100% COMBED COTTON &bull; 240–400 GSM
        </span>
      </div>
    </div>
  );
};
