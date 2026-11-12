import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

export const HeroEditorialBanner: React.FC = () => {
  const bannerRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, glareX: 50, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!bannerRef.current) return;
    const rect = bannerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    const rotateY = ((x - centerX) / centerX) * 3;
    const rotateX = -((y - centerY) / centerY) * 2;
    setTilt({
      rotateX,
      rotateY,
      glareX: (x / rect.width) * 100,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, glareX: 50, isHovered: false });
  };

  return (
    <section className="relative w-full select-none font-sans overflow-hidden bg-black border-b border-white/10">
      <div
        ref={bannerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative w-full h-[650px] sm:h-[820px] lg:h-[940px] min-h-[85vh] overflow-hidden"
        style={{ perspective: '1200px' }}
      >
        {/* 3D Moving / Parallax Background Image with Object-Top so Faces are Fully Visible */}
        <div
          className="absolute inset-0 w-full h-full transition-transform duration-300 ease-out"
          style={{
            transform: tilt.isHovered
              ? `scale(1.03) rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
              : 'scale(1) rotateX(0deg) rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          <img
            src="/images/hero_banner.jpg"
            alt="Trevori Haute Streetwear - Models in Custom Hoodie and Graphic Tee by Luxury Vehicle"
            className="w-full h-full object-cover object-top sm:object-[50%_8%] filter brightness-100 contrast-105"
          />
        </div>

        {/* Ambient Dark Haute Vignette - Keeps Top Clear so Man's Face & Head are Fully Visible */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/85 via-black/25 to-black/80 z-10" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent z-10" />

        {/* Specular Glare Follow */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: tilt.isHovered ? 1 : 0,
            background: `radial-gradient(circle 500px at ${tilt.glareX}% 40%, rgba(248, 131, 121, 0.16) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 75%)`,
            mixBlendMode: 'screen',
          }}
        />

        {/* Foreground Content: Title, Subtitle, CTA */}
        <div className="relative z-30 h-full max-w-[1480px] mx-auto px-4 sm:px-10 lg:px-14 flex flex-col justify-end pb-12 sm:pb-16">
          <div className="max-w-2xl">
            {/* Massive Haute Headline */}
            <h1 className="font-sans text-4xl sm:text-6xl md:text-7xl font-black text-white tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.95)] leading-[1.05]">
              Wear Your Perspective
            </h1>

            {/* Subtitle Description */}
            <p className="text-xs sm:text-base md:text-lg text-slate-200 font-normal mt-4 max-w-xl leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
              Engineered with 400 GSM heavyweight French Terry, custom dropped shoulders, and the iconic Trevori rose-gold monogram emblem embroidered on the chest.
            </p>

            {/* Action Buttons */}
            <div className="flex flex-wrap items-center gap-3 sm:gap-4 mt-6 sm:mt-8">
              <Link
                to="/collections/sweatshirts"
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-[#F88379] text-white font-extrabold text-xs sm:text-sm uppercase tracking-widest rounded-none shadow-[0_4px_20px_rgba(248,131,121,0.5)] hover:bg-white hover:text-black transition-all flex items-center gap-2 group cursor-pointer"
              >
                <span>Shop Monogram Hoodies</span>
                <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
              </Link>

              <Link
                to="/collections/oversized-tees"
                className="px-6 sm:px-8 py-3.5 sm:py-4 bg-black/60 border border-white/30 text-white font-bold text-xs sm:text-sm uppercase tracking-widest rounded-none backdrop-blur-md hover:bg-white/10 hover:border-white transition-all flex items-center gap-2 cursor-pointer"
              >
                <span>Explore Custom Tees</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
