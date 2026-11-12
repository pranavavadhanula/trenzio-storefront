import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-[#091B11] text-[#F8FAFC] border-b border-[#1E452E]/60 text-[10px] uppercase tracking-[0.25em] py-2 px-4 text-center">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="hidden md:inline px-2.5 py-0.5 bg-[#133320] text-[#4ADE80] font-bold font-mono text-[9px] border border-[#22C55E]/40 shadow-sm">
          PAN-INDIA EXPRESS
        </span>
        <span className="mx-auto text-[#F8FAFC] font-light">
          Free Shipping Across India On Orders Above ₹1,999 &bull; UPI, Cards & Cash on Delivery Available
        </span>
        <span className="hidden md:inline text-[#86EFAC] font-mono text-[9px]">
          100% COMBED COTTON &bull; 240–400 GSM
        </span>
      </div>
    </div>
  );
};