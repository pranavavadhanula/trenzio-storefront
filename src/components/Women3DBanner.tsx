import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, ArrowRight, Eye } from 'lucide-react';

interface Women3DBannerProps {
  onOpenModal?: () => void;
}

export const Women3DBanner: React.FC<Women3DBannerProps> = ({ onOpenModal }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  // Smooth mouse move tracking for fluid 3D tilt & movable interactive effect
  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Tilt range: -8 to +8 deg for cinematic, controlled luxury motion
    const rotX = (0.5 - y) * 12;
    const rotY = (x - 0.5) * 14;

    setRotate({ x: rotX, y: rotY });
    setGlare({ x: x * 100, y: y * 100, opacity: 0.75 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  // Touch support for mobile devices
  const handleTouchMove = useCallback((e: React.TouchEvent<HTMLDivElement>) => {
    if (!cardRef.current || e.touches.length === 0) return;
    const touch = e.touches[0];
    const rect = cardRef.current.getBoundingClientRect();
    const x = Math.max(0, Math.min(1, (touch.clientX - rect.left) / rect.width));
    const y = Math.max(0, Math.min(1, (touch.clientY - rect.top) / rect.height));

    const rotX = (0.5 - y) * 10;
    const rotY = (x - 0.5) * 12;

    setIsHovered(true);
    setRotate({ x: rotX, y: rotY });
    setGlare({ x: x * 100, y: y * 100, opacity: 0.6 });
  }, []);

  const handleTouchEnd = useCallback(() => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <div className="w-full mb-12 select-none">
      {/* Eyebrow Header directly inspired by user reference: "NEWEST DROPS OF THE SEASON" */}
      <div className="text-center mb-4">
        <span className="text-[11px] sm:text-xs uppercase tracking-[0.32em] font-serif text-[#171717] font-semibold flex items-center justify-center gap-2">
          <span className="w-6 h-[1px] bg-[#DDD8CE]" />
          NEWEST DROPS OF THE SEASON
          <span className="w-6 h-[1px] bg-[#DDD8CE]" />
        </span>
      </div>

      {/* 3D Perspective Canvas Container */}
      <div
        style={{ perspective: '1600px' }}
        className="w-full flex justify-center cursor-pointer"
        onClick={onOpenModal}
      >
        <div
          ref={cardRef}
          onMouseMove={handleMouseMove}
          onMouseEnter={handleMouseEnter}
          onMouseLeave={handleMouseLeave}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          style={{
            transform: isHovered
              ? `rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateY(-6px) scale3d(1.015, 1.015, 1.015)`
              : 'rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
            transition: isHovered
              ? 'transform 0.1s ease-out, box-shadow 0.2s ease-out'
              : 'transform 0.6s cubic-bezier(0.2, 0.8, 0.25, 1), box-shadow 0.6s ease-out',
            transformStyle: 'preserve-3d',
          }}
          className="relative w-full rounded-2xl overflow-hidden bg-[#171717] border border-[#DDD8CE]/80 shadow-[0_20px_50px_rgba(23,23,23,0.14),0_2px_8px_rgba(0,0,0,0.06)] hover:shadow-[0_32px_80px_rgba(23,23,23,0.26),0_10px_30px_rgba(0,0,0,0.12)] transition-shadow duration-300 group"
        >
          {/* 16:9 aspect ratio container */}
          <div className="relative aspect-[16/9] sm:aspect-[21/9] w-full overflow-hidden">
            
            {/* Background 4K Editorial Image Layer */}
            <img
              src="/images/banners/trevori_women_editorial_banner_4k.jpg"
              alt="TREVORI Women's Streetwear Campaign Drop"
              className="w-full h-full object-cover object-center filter contrast-[1.04] brightness-[0.98] transition-transform duration-700 ease-out group-hover:scale-105"
              style={{
                imageRendering: '-webkit-optimize-contrast',
                transform: 'translateZ(0px)',
              }}
            />

            {/* Subtle Gradient Overlays for contrast & typography readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-black/40 via-transparent to-black/70 pointer-events-none" />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent pointer-events-none" />

            {/* Top Gloss Edge Reflection Beam */}
            <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/80 to-transparent opacity-80 pointer-events-none z-30" />

            {/* Dynamic Specular Glare (tracks cursor/finger) */}
            <div
              className="absolute inset-0 pointer-events-none transition-opacity duration-200 z-20"
              style={{
                opacity: glare.opacity,
                background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.45) 0%, rgba(255,255,255,0.1) 25%, transparent 60%)`,
              }}
            />

            {/* 3D PARALLAX FOREGROUND CONTENT */}
            <div
              className="absolute inset-0 p-5 sm:p-8 lg:p-10 flex flex-col justify-between z-30 pointer-events-none"
              style={{ transform: 'translateZ(35px)' }}
            >
              {/* Top Row: Brand Badges & 3D Interactive Indicator */}
              <div className="flex items-center justify-between pointer-events-auto">
                <div className="flex items-center gap-2 bg-[#171717]/85 backdrop-blur-md px-3 py-1.5 rounded-full border border-white/20 text-white shadow-sm">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span className="text-[9px] sm:text-[10px] uppercase tracking-[0.22em] font-medium font-sans">
                    4K Editorial Campaign // Vol. IV
                  </span>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full text-[#171717] text-[10px] uppercase tracking-wider font-semibold border border-white/60 shadow-sm">
                  <Sparkles className="w-3 h-3 text-[#B9AA96]" />
                  <span>Interactive 3D Motion</span>
                </div>
              </div>

              {/* Bottom Row: Stylized Headline & Actionable Pills */}
              <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pointer-events-auto">
                
                {/* Left: Atelier Concept Title */}
                <div className="max-w-md">
                  <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.3em] text-[#DDD8CE] font-semibold block mb-1 drop-shadow-sm">
                    TREVORI ATELIER FEMME
                  </span>
                  <h2 className="font-serif text-2xl sm:text-4xl lg:text-5xl font-normal text-white tracking-tight leading-tight drop-shadow-md">
                    The Modern Fluidity
                  </h2>
                  <p className="text-xs sm:text-sm text-neutral-200 font-light mt-1.5 line-clamp-2 sm:line-clamp-none drop-shadow">
                    Heavyweight drop-shoulder graphic jersey & architectural pleated trousers engineered for effortless motion.
                  </p>
                </div>

                {/* Right: Trevori-Style Fandom / Lineup Graphic Lockup */}
                <div
                  className="flex flex-col items-start md:items-end gap-2.5"
                  style={{ transform: 'translateZ(25px)' }}
                >
                  {/* Distinctive Graphic Pill Lockup */}
                  <div className="bg-white/95 backdrop-blur-md border border-[#DDD8CE] px-4 py-2 sm:py-2.5 rounded-xl shadow-lg flex items-center gap-3">
                    <div className="w-2 h-2 rounded-full bg-red-600 animate-ping" />
                    <div>
                      <div className="text-[10px] sm:text-xs font-serif font-semibold tracking-wider text-[#171717] uppercase">
                        THE FEMME LINEUP
                      </div>
                      <div className="text-[9px] sm:text-[10px] text-[#706B64] tracking-normal font-light">
                        Architectural Streetwear & Fluid Drapes
                      </div>
                    </div>
                  </div>

                  {/* Navigation Action Buttons */}
                  <div className="flex flex-wrap items-center gap-2">
                    <Link
                      to="/collections/women-tees"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 bg-[#171717]/80 hover:bg-[#171717] backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-medium border border-white/20 transition-all rounded-md"
                    >
                      Oversized Tees
                    </Link>
                    <Link
                      to="/collections/women-sweatshirts"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 bg-[#171717]/80 hover:bg-[#171717] backdrop-blur-md text-white text-[10px] uppercase tracking-wider font-medium border border-white/20 transition-all rounded-md"
                    >
                      French Terry
                    </Link>
                    <Link
                      to="/collections/women"
                      onClick={(e) => e.stopPropagation()}
                      className="px-3 py-1.5 bg-white text-black hover:bg-neutral-100 text-[10px] uppercase tracking-wider font-semibold transition-all rounded-md flex items-center gap-1 shadow-sm"
                    >
                      <span>Shop Collection</span>
                      <ArrowRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>

              </div>

            </div>

            {/* Bottom-right 4K Master resolution indicator */}
            <div className="absolute bottom-3 right-3 bg-black/75 backdrop-blur-md text-white/80 text-[8px] sm:text-[9px] uppercase px-2 py-0.5 tracking-wider rounded border border-white/10 z-30 pointer-events-none">
              3440 × 1920 UHD
            </div>

            {/* Bottom-left hint overlay on hover */}
            <div className="absolute bottom-3 left-3 flex items-center gap-1.5 text-white/70 text-[9px] tracking-wider uppercase font-light z-30 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <Eye className="w-3 h-3 text-white" />
              <span>Tilt to move in 3D • Click to view full resolution</span>
            </div>

          </div>
        </div>
      </div>
    </div>
  );
};
