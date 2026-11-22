import React, { useRef, useState, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

interface Glossy3DCardProps {
  badge: string;
  image: string;
  title: string;
  description: string;
  linkTo: string;
  linkText?: string;
}

export const Glossy3DCard: React.FC<Glossy3DCardProps> = ({
  badge,
  image,
  title,
  description,
  linkTo,
  linkText = 'Explore Capsule',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotate, setRotate] = useState({ x: 0, y: 0 });
  const [glare, setGlare] = useState({ x: 50, y: 50, opacity: 0 });
  const [isHovered, setIsHovered] = useState(false);

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width;
    const y = (e.clientY - rect.top) / rect.height;

    // 3D rotation angles (-14 to +14 degrees)
    const rotX = (0.5 - y) * 20;
    const rotY = (x - 0.5) * 20;

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

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      style={{
        perspective: '1200px',
      }}
      className="relative group select-none"
    >
      <div
        style={{
          transform: isHovered
            ? `rotateX(${rotate.x.toFixed(2)}deg) rotateY(${rotate.y.toFixed(2)}deg) translateY(-10px) scale3d(1.03, 1.03, 1.03)`
            : 'rotateX(0deg) rotateY(0deg) translateY(0px) scale3d(1, 1, 1)',
          transition: isHovered
            ? 'transform 0.12s ease-out, box-shadow 0.25s ease-out'
            : 'transform 0.55s cubic-bezier(0.2, 0.8, 0.25, 1), box-shadow 0.55s ease-out',
          transformStyle: 'preserve-3d',
        }}
        className="relative bg-white/90 backdrop-blur-2xl border border-white/70 overflow-hidden flex flex-col justify-between shadow-[0_16px_36px_rgba(23,23,23,0.08),0_2px_6px_rgba(0,0,0,0.04),inset_0_1px_2px_rgba(255,255,255,0.95)] hover:shadow-[0_32px_70px_rgba(23,23,23,0.18),0_6px_20px_rgba(0,0,0,0.08),inset_0_2px_4px_rgba(255,255,255,1)] transition-shadow duration-300"
      >
        {/* Top Edge Specular Reflection Beam */}
        <div className="absolute top-0 left-0 right-0 h-[1.5px] bg-gradient-to-r from-transparent via-white to-transparent z-40 opacity-90" />
        
        {/* Subtle Glass Inner Border */}
        <div className="absolute inset-0 z-35 pointer-events-none border border-white/40" />
        {/* Dynamic Specular Gloss Glare Reflection */}
        <div
          className="absolute inset-0 z-30 pointer-events-none transition-opacity duration-200"
          style={{
            opacity: glare.opacity,
            background: `radial-gradient(circle at ${glare.x}% ${glare.y}%, rgba(255,255,255,0.85) 0%, rgba(255,255,255,0.3) 28%, rgba(255,255,255,0) 65%)`,
          }}
        />

        {/* Diagonal High-Gloss Liquid Sheen Overlay */}
        <div className="absolute inset-0 z-25 pointer-events-none bg-gradient-to-tr from-transparent via-white/10 to-white/45 opacity-60 group-hover:opacity-90 transition-opacity duration-300" />

        {/* 3D Image Surface */}
        <div
          className="relative aspect-[4/5] overflow-hidden bg-[#DDD8CE]"
          style={{ transform: 'translateZ(15px)' }}
        >
          <img
            src={image}
            alt={title}
            className="w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-108"
            style={{
              imageRendering: 'auto',
            }}
          />
          {/* Glossy lighting gradient over image */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-white/15 pointer-events-none" />

          {/* 3D Elevated Badge */}
          <div
            style={{ transform: 'translateZ(35px)' }}
            className="absolute top-4 left-4 bg-[#171717]/90 backdrop-blur-md text-white text-[9px] uppercase tracking-widest px-3 py-1 shadow-lg border border-white/20"
          >
            {badge}
          </div>
        </div>

        {/* 3D Content Container */}
        <div
          className="p-6 sm:p-8 flex flex-col justify-between flex-1 bg-white/85 backdrop-blur-md"
          style={{ transform: 'translateZ(25px)' }}
        >
          <div>
            <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#171717] mb-2 tracking-tight">
              {title}
            </h3>
            <p className="text-xs text-[#706B64] leading-relaxed mb-6 font-light">
              {description}
            </p>
          </div>
          <Link
            to={linkTo}
            className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#171717] group-hover:text-[#B9AA96] transition-colors"
          >
            <span>{linkText}</span>
            <ArrowRight className="w-3.5 h-3.5 transform group-hover:translate-x-1.5 transition-transform duration-200" />
          </Link>
        </div>
      </div>
    </div>
  );
};
