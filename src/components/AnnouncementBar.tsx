import React from 'react';

export const AnnouncementBar: React.FC = () => {
  return (
    <div className="bg-atelier-950 border-b border-white/10 text-[10px] uppercase tracking-[0.25em] text-atelier-300 py-2.5 px-4 text-center">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <span className="hidden md:inline text-atelier-gold font-medium">Pan-India Express Delivery</span>
        <span className="mx-auto text-atelier-100 font-light">
          Free Shipping Across India On Orders Above ₹1,999 &bull; UPI & Cash on Delivery Available
        </span>
        <span className="hidden md:inline text-neutral-400 font-mono">100% Cotton &bull; 240–450 GSM</span>
      </div>
    </div>
  );
};
