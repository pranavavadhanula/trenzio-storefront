import React, { useRef, useState, useCallback } from 'react';
import { Eye } from 'lucide-react';

interface Lookbook3DCardProps {
  image: string;
  title: string;
  aspectRatio?: string;
  onOpenModal: () => void;
}

export const Lookbook3DCard: React.FC<Lookbook3DCardProps> = ({
  image,
  title,
  aspectRatio = '976 / 1024',
  onOpenModal,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // Smooth responsive 3D tilt angles (-14 to +14 deg)
    const rotX = (0.5 - y) * 16;
    const rotY = (x - 0.5) * 16;

    setRotate({ x: rotX, y: rotY });
    setGlare({ x: x * 100, y: y * 100, opacity: 0.8 });
  }, []);

  const handleMouseEnter = useCallback(() => {
    setIsHovered(true);
  }, []);

  const handleMouseLeave = useCallback(() => {
    setIsHovered(false);
    setRotate({ x: 0, y: 0 });
    setGlare({ x: 50, y: 50, opacity: 0 });
  }, []);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{ perspective: '1400px' }}
      className="relative select-none cursor-pointer w-full"
      onClick={onOpenModal}
    >
      <div
        style={{
          aspectRatio: aspectRatio,
          transform: isHovered
            ? `rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateY(-8px) scale3d(1.02, 1.02, 1.02)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
          transition: isHovered
            ? 'transform 0.12s ease-out, box-shadow 0.25s ease-out'
            : 'transform 0.55s cubic-bezier(0.2, 0.8, 0.25, 1), box-shadow 0.55s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="relative w-full bg-white/95 backdrop-blur-2xl border border-white/80 overflow-hidden shadow-[0_20px_45px_rgba(23,23,23,0.1),0_2px_8px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] hover:shadow-[0_36px_85px_rgba(23,23,23,0.22),0_8px_24px_rgba(0,0,0,0.1),inset_0_2px_4px_rgba(255,255,255,1)] transition-shadow duration-300 group"
      >
        {/* Top Edge Specular Reflection Beam */}
        <div className="absolute top-0 left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-white/90 to-transparent z-40 opacity-90 pointer-events-none" />

        {/* Dynamic Specular Gloss Glare Reflection (tracks cursor smoothly on hover) */}
        <div
          className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.7) 0%, rgba(255,255,255,0.18) 25%, rgba(255,255,255,0) 60%)`,
          }}
        />

        {/* Subtle Glass Inner Border */}
        <div className="absolute inset-0 z-35 pointer-events-none border border-white/40" />

        {/* 3D Image Layer - Crystal Clear 4K with Contrast Optimization */}
        <div className="w-full h-full relative" style={{ transform: 'translateZ(15px)' }}>
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover object-top transition-transform duration-700 ease-out group-hover:scale-102"
            style={{
              imageRendering: '-webkit-optimize-contrast',
              backfaceVisibility: 'hidden',
              transform: 'translateZ(0)',
            }}
          />
          {/* Atelier Master Badge in Top-Left */}
          <div className="absolute top-4 left-4 z-20 flex items-center gap-1.5 bg-[#171717]/85 backdrop-blur-md px-2.5 py-1 text-[9px] uppercase tracking-widest text-[#F4F1EA] font-semibold border border-white/20">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 animate-pulse" />
            <span>Editorial Campaign</span>
          </div>

          {/* Very subtle bottom vignette for depth, keeping image crystal clear */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent pointer-events-none" />
        </div>

        {/* 3D Floating Inspect Button - Positioned at bottom-left to not obstruct text */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onOpenModal();
          }}
          style={{ transform: 'translateZ(35px)' }}
          className="absolute bottom-5 left-5 bg-[#171717]/90 hover:bg-[#171717] backdrop-blur-md text-white px-4 py-2.5 text-[10px] uppercase tracking-widest font-medium transition-all flex items-center gap-2 cursor-pointer shadow-xl border border-white/20 group-hover:scale-105"
        >
          <Eye className="w-3.5 h-3.5" />
          <span>Inspect Atelier Details</span>
        </button>
      </div>
    </div>
  );
};
