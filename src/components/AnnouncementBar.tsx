import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#0B1B3D] border-b border-[#1E3B75] text-[10px] uppercase tracking-[0.25em] py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="hidden md:inline px-2 py-0.5 bg-atelier-coral/20 text-atelier-coral font-bold font-mono text-[9px] border border-atelier-coral/40">
          PAN-INDIA EXPRESS
        </span>
        <span className="mx-auto text-atelier-cream font-light">
          Free Shipping Across India On Orders Above ₹1,999 &bull; UPI, Cards & Cash on Delivery Available
        </span>
        <span className="hidden md:inline text-atelier-cream/70 font-mono text-[9px]">
          100% COMBED COTTON &bull; 240–400 GSM
        </span>
      </div>
    </div>
  );
};
