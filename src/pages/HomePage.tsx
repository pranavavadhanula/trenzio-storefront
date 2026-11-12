import React, { useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

interface Showcase3DCardProps {
  to: string;
  title: string;
  heading: string;
  desc: string;
  buttonText: string;
  imageSrc: string;
  imageAlt: string;
  imagePosition?: string;
}

const Showcase3DCard: React.FC<Showcase3DCardProps> = ({
  to,
  title,
  heading,
  desc,
  buttonText,
  imageSrc,
  imageAlt,
  imagePosition = 'object-center',
}) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({
    rotateX: 0,
    rotateY: 0,
    glareX: 50,
    glareY: 50,
    isHovered: false,
  });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Normalizing between -1 and 1
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;

    // Smooth luxury 3D tilt
    const rotateX = -normY * 10;
    const rotateY = normX * 10;

    const glareX = (x / rect.width) * 100;
    const glareY = (y / rect.height) * 100;

    setTilt({
      rotateX,
      rotateY,
      glareX,
      glareY,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({
      rotateX: 0,
      rotateY: 0,
      glareX: 50,
      glareY: 50,
      isHovered: false,
    });
  };

  return (
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      className="relative w-full"
      style={{ perspective: '1200px' }}
    >
      <Link
        to={to}
        title={title}
        className="group relative block min-h-[580px] sm:min-h-[700px] lg:min-h-[780px] rounded-2xl overflow-hidden bg-[#0A1728] border-2 transition-all duration-300 cursor-pointer will-change-transform"
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.isHovered ? 1.025 : 1}, ${tilt.isHovered ? 1.025 : 1}, 1)`,
          transformStyle: 'preserve-3d',
          transition: tilt.isHovered
            ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease, border-color 0.3s ease'
            : 'transform 0.65s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease, border-color 0.3s ease',
          borderColor: tilt.isHovered ? '#F88379' : 'rgba(30, 58, 102, 0.8)',
          boxShadow: tilt.isHovered
            ? '0 30px 70px rgba(0, 0, 0, 0.9), 0 0 45px rgba(248, 131, 121, 0.35), inset 0 1px 2px rgba(255, 255, 255, 0.5)'
            : '0 20px 50px rgba(0, 0, 0, 0.8), inset 0 1px 1px rgba(255, 255, 255, 0.2)',
        }}
      >
        {/* Parallax Photo Layer */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            transform: `scale(${tilt.isHovered ? 1.08 : 1.02}) translate3d(${-tilt.rotateY * 1.6}px, ${tilt.rotateX * 1.6}px, 0)`,
            transition: tilt.isHovered
              ? 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'
              : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <img
            src={imageSrc}
            alt={imageAlt}
            className={`w-full h-full object-cover ${imagePosition} filter contrast-115 brightness-95`}
          />
        </div>

        {/* Deep Atmosphere Base Overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/60 to-transparent group-hover:via-[#07111E]/40 transition-colors duration-500 z-10" />

        {/* Glossy Specular Glass Reflection (Fully Glossy Finish) */}
        {/* Layer A: Dynamic Mouse-Follow Glare Sheen */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: tilt.isHovered ? 1 : 0,
            background: `radial-gradient(circle 520px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.32) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 75%)`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* Layer B: Static Haute Gloss Glass Reflection & Diagonal Specular Shine */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-white/[0.14] via-transparent to-white/[0.18] opacity-80 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-2/5 bg-gradient-to-b from-white/[0.22] via-white/[0.04] to-transparent z-20" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl z-20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.4),inset_0_-2px_4px_rgba(0,0,0,0.8)]" />

        {/* Floating 3D Foreground Content */}
        <div
          className="relative z-30 flex flex-col justify-end h-full p-8 sm:p-14 lg:p-16 space-y-4"
          style={{
            transform: `translate3d(${tilt.rotateY * 1.8}px, ${-tilt.rotateX * 1.8}px, 35px)`,
            transformStyle: 'preserve-3d',
            transition: tilt.isHovered
              ? 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'
              : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <h2 className="font-sans text-4xl sm:text-6xl text-white font-extrabold group-hover:text-[#F88379] transition-colors tracking-tight drop-shadow-[0_4px_20px_rgba(0,0,0,0.95)]">
            {heading}
          </h2>

          <p className="text-sm sm:text-base text-[#E2E8F0] font-medium max-w-md leading-relaxed drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)]">
            {desc}
          </p>

          <div className="pt-2">
            <span className="inline-flex items-center gap-2.5 px-8 py-4 bg-[#F88379] hover:bg-[#FA958D] text-white font-bold text-sm uppercase tracking-wider font-sans shadow-[0_6px_28px_rgba(248,131,121,0.6)] group-hover:translate-x-2 transition-all">
              <span>{buttonText}</span>
              <ArrowRight className="w-4 h-4" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

export const HomePage: React.FC = () => {
  return (
    <div className="relative min-h-[90vh] flex flex-col justify-center px-4 sm:px-10 lg:px-14 py-8 sm:py-14 max-w-[1480px] mx-auto w-full bg-[#07111E] text-white overflow-hidden font-sans">
      {/* Deep Royal Midnight Ambient Glow */}
      <div className="pointer-events-none absolute top-10 left-1/3 w-[650px] h-72 bg-gradient-to-r from-[#1D4ED8]/25 via-[#2563EB]/15 to-transparent blur-3xl rounded-full" />

      {/* Editorial Header - Dark Blue Haute Aesthetics */}
      <div className="relative z-10 text-center mb-8 sm:mb-12 space-y-2.5">
        <h1 className="font-sans text-3xl sm:text-5xl md:text-6xl text-white font-extrabold tracking-tight drop-shadow-[0_4px_24px_rgba(0,0,0,0.8)]">
          Choose Your Line
        </h1>
        <p className="text-sm sm:text-base text-[#94A3B8] font-normal max-w-lg mx-auto leading-relaxed">
          Heavyweight luxury streetwear engineered with bio-washed combed cotton and zero post-wash shrinkage.
        </p>
      </div>

      {/* Main Split Showcase: 3D Interactive Parallax Cards with Fully Glossy Glass Sheen */}
      <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 gap-8 sm:gap-10 flex-1">
        {/* Card 1: MEN'S WEAR (3D Glossy Interactive Parallax Card) */}
        <Showcase3DCard
          to="/collections/men"
          title="Explore Men's Wear"
          heading="Men's Wear"
          desc="Boxy dropped-shoulders, reinforced ribbed collars, and structured 240–400 GSM bio-washed cotton."
          buttonText="Explore Men's Wear"
          imageSrc="/images/models/man_streetwear_hoodie.jpg"
          imageAlt="Men's Wear Heavyweight Streetwear Hoodie"
          imagePosition="object-top sm:object-center"
        />

        {/* Card 2: WOMEN'S WEAR (3D Glossy Interactive Parallax Card) */}
        <Showcase3DCard
          to="/collections/women"
          title="Explore Women's Wear"
          heading="Women's Wear"
          desc="Relaxed dropped-shoulder drape with proportioned armholes and 400 GSM diagonal loop French Terry."
          buttonText="Explore Women's Wear"
          imageSrc="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1400&q=85"
          imageAlt="Women's Wear Oversized Cuts"
          imagePosition="object-center"
        />
      </div>

      {/* Subtle Footer Bar */}
      <div className="relative z-10 mt-10 pt-8 border-t border-[#1E3A66]/50 flex flex-wrap items-center justify-between text-xs font-sans font-medium text-[#94A3B8] gap-4 text-center sm:text-left">
        <div>Pan-India Express Dispatch &bull; Delivery in 3–5 Days</div>
        <div className="flex items-center gap-4 mx-auto sm:mx-0">
          <Link to="/try-on" className="text-[#F88379] hover:underline font-bold flex items-center gap-1 shadow-sm">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Try in 3D Fitting Room</span>
          </Link>
          <span>&bull;</span>
          <Link to="/about" className="text-white hover:text-[#F88379] transition-colors font-semibold">
            Our 350 GSM Craft
          </Link>
        </div>
        <div>Hassle-Free 7-Day Size Exchanges</div>
      </div>
    </div>
  );
};
