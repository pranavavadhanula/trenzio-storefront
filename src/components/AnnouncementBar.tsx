import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#0A160F] border-b border-[#D4C3A3]/20 text-[10px] uppercase tracking-[0.25em] py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="hidden md:inline px-2.5 py-0.5 bg-[#162E21] text-[#E6D7C3] font-bold font-mono text-[9px] border border-[#D4C3A3]/40 shadow-[0_0_12px_rgba(212,195,163,0.15)]">
          PAN-INDIA EXPRESS
        </span>
        <span className="mx-auto text-[#F4ECE1] font-light">
          Free Shipping Across India On Orders Above ₹1,999 &bull; UPI, Cards & Cash on Delivery Available
        </span>
        <span className="hidden md:inline text-[#D4C3A3] font-mono text-[9px]">
          100% COMBED COTTON &bull; 240–400 GSM
        </span>
      </div>
    </div>
  );
};