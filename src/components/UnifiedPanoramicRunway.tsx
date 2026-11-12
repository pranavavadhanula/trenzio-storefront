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
    image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=800&q=85',
    alt: 'Trevori Men Streetwear French Terry Hoodie',
  },
  {
    title: 'pants',
    startingPrice: '₹1,799',
    categorySlug: 'men',
    link: '/collections/men',
    image: 'https://images.unsplash.com/photo-1624378439575-d8705ad7ae80?auto=format&fit=crop&w=800&q=85',
    alt: 'Trevori Men Dark Streetwear Wide-Leg Cargo Pants',
  },
  {
    title: 'tank tops',
    startingPrice: '₹899',
    categorySlug: 'men-classic-tees',
    link: '/collections/men-classic-tees',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85',
    alt: 'Trevori Men Structured Sleeveless Drop Tank',
  },
  {
    title: 'jackets',
    startingPrice: '₹2,299',
    categorySlug: 'men-sweatshirts',
    link: '/collections/men-sweatshirts',
    image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=800&q=85',
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
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=85',
    alt: 'Trevori Women Cropped Heavy French Terry Hoodie',
  },
  {
    title: 'pants',
    startingPrice: '₹1,799',
    categorySlug: 'women',
    link: '/collections/women',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=85',
    alt: 'Trevori Women Flared Streetwear Drape Pants',
  },
  {
    title: 'tank tops',
    startingPrice: '₹899',
    categorySlug: 'women-classic-tees',
    link: '/collections/women-classic-tees',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=85',
    alt: 'Trevori Women Ribbed Minimalist Crop Tank',
  },
  {
    title: 'jackets',
    startingPrice: '₹2,299',
    categorySlug: 'women-sweatshirts',
    link: '/collections/women-sweatshirts',
    image: 'https://images.unsplash.com/photo-1548883354-7622d03aca27?auto=format&fit=crop&w=800&q=85',
    alt: 'Trevori Women Street Bomber & Windbreaker',
  },
  {
    title: 't-shirts',
    startingPrice: '₹1,499',
    categorySlug: 'women-oversized-tees',
    link: '/collections/women-oversized-tees',
    image: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?auto=format&fit=crop&w=800&q=85',
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

  const currentDept = allowSwitch ? internalDept : department;
  const items = currentDept === 'women' ? WOMEN_PANORAMIC_ITEMS : MEN_PANORAMIC_ITEMS;

  return (
    <section className="w-full select-none font-sans overflow-hidden bg-black">
      {/* 1. TOP MARQUEE TICKER: Full-Bleed Infinite Scrolling Line */}
      <div className="relative w-full overflow-hidden bg-black border-y border-white/10 py-2.5 sm:py-3 shadow-[0_4px_24px_rgba(0,0,0,0.8)] z-30">
        <div className="animate-marquee-infinite flex items-center whitespace-nowrap">
          {[...Array(6)].map((_, loopIdx) => (
            <div
              key={loopIdx}
              className="flex items-center text-[11px] sm:text-xs uppercase tracking-[0.28em] font-extrabold text-white mx-5 gap-6 font-sans"
            >
              <span className="text-[#F88379] flex items-center gap-1.5 drop-shadow-[0_0_12px_rgba(248,131,121,0.6)]">
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

      {/* 2. FULL-BLEED PANORAMIC STAGE: Edge-to-Edge from left corner to right corner (0 gap) */}
      <div
        ref={containerRef}
        onMouseLeave={() => setHoveredIdx(null)}
        className="relative w-full overflow-hidden bg-black border-b border-white/10"
      >
        {/* Continuous 5-Item Grid: Fills 100% width with 0 gap and 0 space between photos */}
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 w-full gap-0 p-0 m-0">
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
                className={`group relative w-full h-[380px] sm:h-[460px] md:h-[540px] overflow-hidden cursor-pointer transition-all duration-500 bg-black ${
                  isSibling ? 'opacity-50 filter brightness-70' : 'opacity-100'
                }`}
                onClick={() => {
                  if (onSelectCategory) {
                    onSelectCategory(item.categorySlug);
                  }
                }}
              >
                <Link to={item.link} className="relative block w-full h-full overflow-hidden">
                  {/* Photo: Fills entire column with ZERO margins and ZERO space */}
                  <img
                    src={item.image}
                    alt={item.alt}
                    className="w-full h-full object-cover object-center filter brightness-90 contrast-110 group-hover:brightness-105 group-hover:scale-105 transition-all duration-700 ease-out"
                  />

                  {/* Gradient Vignettes so text remains ultra-sharp on top & bottom */}
                  <div className="absolute top-0 inset-x-0 h-28 bg-gradient-to-b from-black/85 via-black/35 to-transparent pointer-events-none z-10" />
                  <div className="absolute bottom-0 inset-x-0 h-36 bg-gradient-to-t from-black/95 via-black/50 to-transparent pointer-events-none z-10" />

                  {/* Subtle hover color beam & glossy sheen */}
                  <div className="absolute inset-0 bg-gradient-to-t from-[#F88379]/15 via-transparent to-white/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none z-20" />

                  {/* Top: Category Title in clean lowercase typography (like reference) */}
                  <div className="absolute top-5 inset-x-0 text-center z-30 pointer-events-none px-2">
                    <h3
                      className={`font-sans text-xs sm:text-sm md:text-base font-bold tracking-[0.22em] lowercase transition-colors duration-300 ${
                        isHovered || isActive
                          ? 'text-white drop-shadow-[0_2px_12px_rgba(255,255,255,0.7)]'
                          : 'text-slate-200 drop-shadow-[0_2px_6px_rgba(0,0,0,0.9)]'
                      }`}
                    >
                      {item.title}
                    </h3>
                    {(isHovered || isActive) && (
                      <div className="w-8 h-0.5 bg-[#F88379] mx-auto mt-1.5 rounded-full shadow-[0_0_10px_#F88379]" />
                    )}
                  </div>

                  {/* Bottom Left: Price badge ("starts \n @ ₹1299" reference typography) */}
                  <div className="absolute bottom-5 left-4 sm:left-6 z-30 pointer-events-none">
                    <span className="block text-[10px] sm:text-xs font-sans lowercase text-slate-300 font-medium tracking-wide drop-shadow-[0_2px_4px_rgba(0,0,0,0.95)]">
                      starts
                    </span>
                    <span className="block text-sm sm:text-lg md:text-xl font-extrabold text-white font-sans tracking-tight mt-0.5 drop-shadow-[0_2px_8px_rgba(0,0,0,0.95)] group-hover:text-[#F88379] transition-colors">
                      @ {item.startingPrice}
                    </span>
                  </div>

                  {/* Bottom Right: Explore indicator */}
                  <div className="absolute bottom-5 right-4 sm:right-6 z-30 pointer-events-none inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-white/80 group-hover:text-[#F88379] transition-colors">
                    <span className="hidden sm:inline">View</span>
                    <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
                  </div>
                </Link>
              </div>
            );
          })}
        </div>

        {/* 3. BOTTOM SUB-BAR: Full-Bleed width */}
        <div className="relative z-20 bg-[#02050B] border-t border-white/10 py-3 px-4 sm:px-8 flex flex-col sm:flex-row items-center justify-between gap-3 text-xs font-sans w-full">
          <div className="flex flex-wrap items-center gap-3">
            {allowSwitch ? (
              <div className="inline-flex rounded-full bg-[#081222] p-1 border border-[#1E3A66]/60 shadow-inner">
                <button
                  type="button"
                  onClick={() => setInternalDept('men')}
                  className={`px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all ${
                    currentDept === 'men'
                      ? 'bg-[#F88379] text-white shadow-[0_2px_12px_rgba(248,131,121,0.6)]'
                      : 'text-slate-400 hover:text-white'
                  }`}
                >
                  Men's Drops
                </button>
                <button
                  type="button"
                  onClick={() => setInternalDept('women')}
                  className={`px-4 py-1.5 rounded-full text-[10px] sm:text-[11px] font-extrabold uppercase tracking-wider transition-all ${
                    currentDept === 'women'
                      ? 'bg-[#F88379] text-white shadow-[0_2px_12px_rgba(248,131,121,0.6)]'
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
    </section>
  );
};
