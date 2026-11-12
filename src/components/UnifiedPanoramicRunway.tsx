import React, { useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Sparkles } from 'lucide-react';

export interface PanoramicItem {
  title: string;
  startingPrice: string;
  categorySlug: string;
  link: string;
  image: string;
  alt: string;
}

const MEN_PANORAMIC_ITEMS: PanoramicItem[] = [
  {
    title: 'hoodies',
    startingPrice: '₹2,499',
    categorySlug: 'men-sweatshirts',
    link: '/collections/men-sweatshirts',
    image: '/images/models/man_streetwear_hoodie.jpg',
    alt: 'Trevori Men Streetwear French Terry Hoodie',
  },
  {
    title: 'pants',
    startingPrice: '₹1,799',
    categorySlug: 'men',
    link: '/collections/men',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=700&q=85',
    alt: 'Trevori Men Dark Streetwear Wide-Leg Cargo Pants',
  },
  {
    title: 'tank tops',
    startingPrice: '₹899',
    categorySlug: 'men-classic-tees',
    link: '/collections/men-classic-tees',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=85',
    alt: 'Trevori Men Structured Sleeveless Drop Tank',
  },
  {
    title: 'jackets',
    startingPrice: '₹2,299',
    categorySlug: 'men-sweatshirts',
    link: '/collections/men-sweatshirts',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=700&q=85',
    alt: 'Trevori Men Zip Streetwear Graphic Jacket',
  },
  {
    title: 't-shirts',
    startingPrice: '₹1,499',
    categorySlug: 'men-oversized-tees',
    link: '/collections/men-oversized-tees',
    image: '/images/models/street_tee.jpg',
    alt: 'Trevori Men Heavyweight Oversized Graphic Tee',
  },
];

const WOMEN_PANORAMIC_ITEMS: PanoramicItem[] = [
  {
    title: 'cropped hoodies',
    startingPrice: '₹2,499',
    categorySlug: 'women-sweatshirts',
    link: '/collections/women-sweatshirts',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=700&q=85',
    alt: 'Trevori Women Cropped Heavy French Terry Hoodie',
  },
  {
    title: 'pants',
    startingPrice: '₹1,799',
    categorySlug: 'women',
    link: '/collections/women',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=700&q=85',
    alt: 'Trevori Women Flared Streetwear Drape Pants',
  },
  {
    title: 'tank tops',
    startingPrice: '₹899',
    categorySlug: 'women-classic-tees',
    link: '/collections/women-classic-tees',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=700&q=85',
    alt: 'Trevori Women Ribbed Minimalist Crop Tank',
  },
  {
    title: 'jackets',
    startingPrice: '₹2,299',
    categorySlug: 'women-sweatshirts',
    link: '/collections/women-sweatshirts',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=700&q=85',
    alt: 'Trevori Women Street Bomber & Windbreaker',
  },
  {
    title: 't-shirts',
    startingPrice: '₹1,499',
    categorySlug: 'women-oversized-tees',
    link: '/collections/women-oversized-tees',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=700&q=85',
    alt: 'Trevori Women Draped Oversized Graphic Tee',
  },
];

interface UnifiedPanoramicRunwayProps {
  department?: 'men' | 'women';
  currentCategory?: string;
  onSelectCategory?: (slug: string) => void;
  allowSwitch?: boolean;
}

export const UnifiedPanoramicRunway: React.FC<UnifiedPanoramicRunwayProps> = ({
  department = 'men',
  currentCategory,
  onSelectCategory,
  allowSwitch = false,
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [internalDept, setInternalDept] = useState<'men' | 'women'>(department);
  const [hoveredIdx, setHoveredIdx] = useState<number | null>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovered: false });

  const currentDept = allowSwitch ? internalDept : department;
  const items = currentDept === 'women' ? WOMEN_PANORAMIC_ITEMS : MEN_PANORAMIC_ITEMS;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const centerX = rect.width / 2;
    const centerY = rect.height / 2;
    // Gentle 3D perspective tilt across the whole unified panoramic picture
    const rotateY = ((x - centerX) / centerX) * 4;
    const rotateX = -((y - centerY) / centerY) * 3;
    setTilt({ rotateX, rotateY, isHovered: true });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false });
    setHoveredIdx(null);
  };

  return (
    <div className="w-full my-6 select-none font-sans">
      {/* 1. TOP MARQUEE TICKER: Smooth Infinite Scrolling Line */}
      <div className="relative overflow-hidden bg-black border-y border-[#1E3A66]/60 py-2 sm:py-2.5 shadow-[0_4px_20px_rgba(0,0,0,0.6)]">
        <div className="animate-marquee-infinite flex items-center whitespace-nowrap">
          {/* Loop items for seamless infinite marquee */}
          {[...Array(6)].map((_, loopIdx) => (
            <div
              key={loopIdx}
              className="flex items-center text-[10px] sm:text-xs uppercase tracking-[0.26em] font-extrabold text-white mx-4 gap-6 font-sans"
            >
              <span className="text-[#F88379] flex items-center gap-1.5 drop-shadow-[0_0_10px_rgba(248,131,121,0.5)]">
                <Sparkles className="w-3.5 h-3.5 inline text-[#F88379]" />
                FREE SHIPPING AND 10% OFF ON FIRST ORDER
              </span>
              <span className="text-white/30 font-light">\\</span>
              <span className="text-white">TREVORI PERSPECTIVE DROP</span>
              <span className="text-white/30 font-light">✦</span>
              <span className="text-slate-300">LIMITED TIME OFFER • CODE: TREVORI200</span>
              <span className="text-white/30 font-light">\\</span>
              <span className="text-[#F88379]">UPTO 60% • NO RESTOCKS</span>
              <span className="text-white/30 font-light">✦</span>
            </div>
          ))}
        </div>
      </div>

      {/* 2. UNIFIED PANORAMIC STAGE: Everything combined like a single picture */}
      <div
        ref={containerRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        className="relative overflow-hidden bg-gradient-to-b from-[#02060E] via-[#040A15] to-[#02050B] border-x border-b border-[#1E3A66]/50 shadow-[0_20px_60px_rgba(0,0,0,0.85)] transition-all duration-300"
        style={{
          perspective: '1200px',
        }}
      >
        {/* Deep Panoramic Ambient Lighting & Vignette */}
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_top,_rgba(248,131,121,0.12)_0%,_transparent_60%)]" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-black/80 via-transparent to-black/80 z-10" />

        {/* 3D Tilt Wrapper */}
        <div
          className="relative transition-transform duration-300 ease-out"
          style={{
            transform: tilt.isHovered
              ? `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg)`
              : 'rotateX(0deg) rotateY(0deg)',
            transformStyle: 'preserve-3d',
          }}
        >
          {/* Continuous Panoramic Grid (No card borders, seamless presentation) */}
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 divide-x divide-white/[0.04]">
            {items.map((item, idx) => {
              const isHovered = hoveredIdx === idx;
              const hasHover = hoveredIdx !== null;
              const isSibling = hasHover && !isHovered;
              const isActive =
                currentCategory === item.categorySlug ||
                (item.categorySlug === 'men-sweatshirts' && currentCategory === 'sweatshirts') ||
                (item.categorySlug === 'men-oversized-tees' && currentCategory === 'oversized-tees') ||
                (item.categorySlug === 'men-classic-tees' && currentCategory === 'classic-tees');

              return (
                <div
                  key={item.title}
                  onMouseEnter={() => setHoveredIdx(idx)}
                  className={`group relative flex flex-col justify-between cursor-pointer transition-all duration-500 min-h-[360px] sm:min-h-[420px] ${
                    isSibling ? 'opacity-55 filter brightness-75' : 'opacity-100'
                  }`}
                  onClick={() => {
                    if (onSelectCategory) {
                      onSelectCategory(item.categorySlug);
                    }
                  }}
                >
                  <Link to={item.link} className="flex flex-col justify-between h-full p-4 sm:p-5 relative z-20">
                    {/* Top: Category Title in clean lowercase typography (like reference pic) */}
                    <div className="text-center pt-1 pb-3 relative z-30">
                      <h3
                        className={`font-sans text-sm sm:text-base font-semibold tracking-wider transition-colors duration-300 ${
                          isHovered || isActive
                            ? 'text-white drop-shadow-[0_0_12px_rgba(255,255,255,0.6)]'
                            : 'text-slate-300'
                        }`}
                      >
                        {item.title}
                      </h3>
                      {isActive && (
                        <div className="w-8 h-0.5 bg-[#F88379] mx-auto mt-1 rounded-full shadow-[0_0_8px_#F88379]" />
                      )}
                    </div>

                    {/* Center: Garment / Model Visual seamlessly blending into the dark stage */}
                    <div className="relative flex-1 flex items-center justify-center my-2 sm:my-4 overflow-hidden">
                      {/* Spotlight Glow Behind Item on Hover */}
                      <div
                        className={`pointer-events-none absolute inset-0 transition-opacity duration-500 rounded-full blur-2xl ${
                          isHovered
                            ? 'opacity-80 bg-[radial-gradient(circle_at_center,_rgba(248,131,121,0.28)_0%,_rgba(37,99,235,0.18)_40%,_transparent_70%)]'
                            : 'opacity-0'
                        }`}
                      />

                      {/* Floating Garment Image */}
                      <div
                        className="relative w-full h-[220px] sm:h-[270px] flex items-center justify-center transition-all duration-500"
                        style={{
                          transform: isHovered
                            ? 'scale(1.08) translateY(-6px)'
                            : 'scale(1) translateY(0)',
                        }}
                      >
                        <img
                          src={item.image}
                          alt={item.alt}
                          className="w-full h-full object-cover object-center filter contrast-120 brightness-90 group-hover:brightness-110 transition-all duration-500 [mask-image:radial-gradient(ellipse_at_center,black_60%,transparent_98%)] rounded-lg"
                        />

                        {/* Glossy specular reflection sheen on hover */}
                        <div
                          className={`pointer-events-none absolute inset-0 bg-gradient-to-tr from-transparent via-white/[0.22] to-transparent transition-opacity duration-500 ${
                            isHovered ? 'opacity-100' : 'opacity-0'
                          }`}
                        />
                      </div>

                      {/* Lower Left Price Badge (matches reference image: "starts \n @ ₹1299") */}
                      <div className="absolute bottom-2 left-2 z-30 pointer-events-none">
                        <span className="block text-[10px] sm:text-[11px] font-sans lowercase text-slate-400 font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.9)]">
                          starts
                        </span>
                        <span className="block text-xs sm:text-sm font-extrabold text-white font-sans tracking-tight mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.9)] group-hover:text-[#F88379] transition-colors">
                          @ {item.startingPrice}
                        </span>
                      </div>
                    </div>

                    {/* Bottom Indicator */}
                    <div className="pt-2 text-center relative z-30">
                      <span
                        className={`inline-flex items-center gap-1 text-[10px] uppercase tracking-wider font-bold transition-colors duration-300 ${
                          isHovered ? 'text-[#F88379]' : 'text-slate-400/80 group-hover:text-white'
                        }`}
                      >
                        <span>Explore</span>
                        <ArrowRight
                          className={`w-3 h-3 transition-transform duration-300 ${
                            isHovered ? 'translate-x-1' : ''
                          }`}
                        />
                      </span>
                    </div>
                  </Link>

                  {/* Subtle column hover highlight beam */}
                  <div
                    className={`pointer-events-none absolute inset-0 border-b-2 transition-all duration-300 ${
                      isHovered
                        ? 'border-[#F88379] bg-white/[0.02]'
                        : 'border-transparent'
                    }`}
                  />
                </div>
              );
            })}
          </div>
        </div>

        {/* 3. BOTTOM SUB-BAR (Matches "BASICS @ 20% OFF" in reference) */}
        <div className="relative z-20 bg-[#02050B] border-t border-[#1E3A66]/50 py-3 px-6 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans">
          <div className="flex flex-wrap items-center gap-3">
            {allowSwitch ? (
              <div className="inline-flex rounded-full bg-[#081222] p-1 border border-[#1E3A66]/60 shadow-inner">
                <button
                  type="button"
                  onClick={() => setInternalDept('men')}
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all ${
                    currentDept === 'men'
                      ? 'bg-[#F88379] text-white shadow-[0_2px_10px_rgba(248,131,121,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Men's Drops
                </button>
                <button
                  type="button"
                  onClick={() => setInternalDept('women')}
                  className={`px-3 py-1 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all ${
                    currentDept === 'women'
                      ? 'bg-[#F88379] text-white shadow-[0_2px_10px_rgba(248,131,121,0.5)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Women's Drops
                </button>
              </div>
            ) : (
              <span className="uppercase tracking-[0.24em] font-extrabold text-white text-[11px] sm:text-xs">
                {currentDept === 'women' ? "WOMEN'S PERSPECTIVE DROPS" : "MEN'S PERSPECTIVE DROPS"}
              </span>
            )}
            <span className="hidden sm:inline-block w-1.5 h-1.5 rounded-full bg-[#F88379]" />
            <span className="text-[11px] text-slate-400 uppercase tracking-wider font-semibold">
              All Silhouettes Available In Dark Palette
            </span>
          </div>

          <div className="flex items-center gap-2 text-[#F88379] font-bold text-[11px] uppercase tracking-wider">
            <span>Click any silhouette to view drop</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </div>
        </div>
      </div>
    </div>
  );
};
