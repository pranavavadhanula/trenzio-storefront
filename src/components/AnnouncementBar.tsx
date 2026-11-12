import React, { useRef, useState } from 'react';
import { Sparkles, Zap, ShieldCheck } from 'lucide-react';

export const AnnouncementBar: React.FC = () => {
  const barRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    isHovered: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!barRef.current) return;
    const rect = barRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // 3D perspective tilt
    const rotateX = -((y - centerY) / centerY) * 6;
    const rotateY = ((x - centerX) / centerX) * 4;
    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      isHovered: false,
    });
  };

  return (
    <div
      ref={barRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative z-50 w-full overflow-hidden select-none bg-gradient-to-r from-[#040C18] via-[#08182E] to-[#040C18] text-[#E2E8F0] border-b border-[#F88379]/30 py-2 sm:py-2.5 shadow-[0_4px_24px_rgba(0,0,0,0.7)] font-sans"
      style={{
        perspective: '1000px',
      }}
    >
      {/* 3D Moving Holographic Shimmer Sweep Beam */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
        <div className="w-1/3 h-full bg-gradient-to-r from-transparent via-white/[0.18] to-transparent -skew-x-12 animate-shimmer-sweep opacity-75" />
      </div>

      {/* Dynamic 3D Cursor-Tracking Specular Glare */}
      <div
        className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
        style={{
          opacity: tilt.isHovered ? 1 : 0,
          background: `radial-gradient(circle 280px at ${tilt.glareX}% 50%, rgba(248, 131, 121, 0.25) 0%, rgba(255, 255, 255, 0.1) 40%, transparent 75%)`,
          mixBlendMode: 'screen',
        }}
      />

      {/* 3D Glass Bevel Edge Highlights */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-[#F88379]/60 to-transparent z-20" />
      <div className="pointer-events-none absolute inset-x-0 bottom-0 h-[1px] bg-gradient-to-r from-transparent via-[#1E3A66] to-transparent z-20" />

      {/* 3D Interactive Motion Content Layer */}
      <div
        className="relative z-10 transition-transform duration-200 ease-out flex items-center justify-center"
        style={{
          transform: tilt.isHovered
            ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale(1.008)`
            : 'rotateX(0deg) rotateY(0deg) scale(1)',
          transformStyle: 'preserve-3d',
        }}
      >
        {/* Continuous 3D Infinite Marquee Loop */}
        <div className="animate-marquee-infinite flex items-center whitespace-nowrap">
          {[...Array(4)].map((_, loopIdx) => (
            <div
              key={loopIdx}
              className="flex items-center text-[10px] sm:text-[11px] uppercase tracking-[0.22em] font-extrabold text-white mx-6 gap-6 sm:gap-8 font-sans drop-shadow-[0_2px_8px_rgba(0,0,0,0.8)]"
            >
              {/* Badge 1: Pan-India Express */}
              <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#0D2240] text-[#F88379] font-black text-[9px] sm:text-[10px] tracking-wider border border-[#F88379]/50 shadow-[0_0_12px_rgba(248,131,121,0.35)]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#F88379] animate-pulse" />
                PAN-INDIA EXPRESS
              </span>

              {/* Message 1 */}
              <span className="text-[#F1F5F9] font-medium tracking-wider">
                FREE SHIPPING ACROSS INDIA ON ORDERS ABOVE ₹1,999 &bull; UPI, CARDS & CASH ON DELIVERY AVAILABLE
              </span>

              <span className="text-[#F88379]/60 font-light">✦</span>

              {/* Badge 2: 3D Fit */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#0F2D54] text-white font-black text-[9px] sm:text-[10px] tracking-wider border border-white/20 shadow-sm">
                <Sparkles className="w-3 h-3 text-[#F88379]" />
                3D VIRTUAL FIT
              </span>

              {/* Message 2 */}
              <span className="text-slate-300 font-medium tracking-wider">
                TRY STREETWEAR SILHOUETTES LIVE IN 3D ROOM
              </span>

              <span className="text-[#F88379]/60 font-light">✦</span>

              {/* Badge 3: Offer */}
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 bg-[#F88379]/20 text-[#F88379] font-black text-[9px] sm:text-[10px] tracking-wider border border-[#F88379]/50 shadow-[0_0_10px_rgba(248,131,121,0.4)]">
                <Zap className="w-3 h-3 text-[#F88379]" />
                CODE: TREVORI200
              </span>

              {/* Message 3 */}
              <span className="text-[#F88379] font-bold tracking-wider">
                GET FLAT ₹200 OFF ON FIRST ORDER
              </span>

              <span className="text-[#F88379]/60 font-light">✦</span>

              {/* Badge 4: Cotton Specification */}
              <span className="inline-flex items-center gap-1 text-slate-300 font-semibold tracking-wider text-[10px]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#F88379]" />
                100% COMBED BIO-WASH COTTON &bull; 240–400 GSM
              </span>

              <span className="text-white/30 font-light">\\</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
