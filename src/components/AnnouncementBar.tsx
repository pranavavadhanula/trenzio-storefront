import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#0B0512] border-b border-[#BA55D3]/20 text-[10px] uppercase tracking-[0.25em] py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="hidden md:inline px-2 py-0.5 bg-[#DA70D6]/15 text-[#DA70D6] font-bold font-mono text-[9px] border border-[#DA70D6]/40 shadow-[0_0_12px_rgba(218,112,214,0.3)]">
          PAN-INDIA EXPRESS
        </span>
        <span className="mx-auto text-[#FAF5FF] font-light">
          Free Shipping Across India On Orders Above ₹1,999 &bull; UPI, Cards & Cash on Delivery Available
        </span>
        <span className="hidden md:inline text-[#D8B4FE] font-mono text-[9px]">
          100% COMBED COTTON &bull; 240–400 GSM
        </span>
      </div>
    </div>
  );
};
