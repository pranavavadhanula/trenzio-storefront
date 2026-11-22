import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft, ArrowRight, ArrowUpRight, Sparkles } from 'lucide-react';

interface LookItem {
  id: string;
  lookNumber: string;
  name: string;
  category: string;
  textile: string;
  priceINR: number;
  image: string;
  link: string;
}

const EDITORIAL_LOOKS: LookItem[] = [
  {
    id: 'look-1',
    lookNumber: '01',
    name: 'Heavyweight Boxy Hoodie',
    category: 'Oversized Streetwear',
    textile: '450 GSM French Terry',
    priceINR: 2999,
    image: '/images/looks/look_1_black_hoodie.jpg',
    link: '/collections',
  },
  {
    id: 'look-2',
    lookNumber: '02',
    name: 'Structured Ribbed Polo',
    category: 'Atelier Knitwear',
    textile: 'Combed Cotton Piqué',
    priceINR: 2299,
    image: '/images/looks/look_2_maroon_polo.jpg',
    link: '/collections',
  },
  {
    id: 'look-3',
    lookNumber: '03',
    name: 'Architectural Chest-Print Tee',
    category: 'Essential Silhouette',
    textile: '280 GSM Pure Cotton',
    priceINR: 1499,
    image: '/images/looks/look_3_white_tee.jpg',
    link: '/collections',
  },
  {
    id: 'look-4',
    lookNumber: '04',
    name: 'Raw Relaxed Linen Shirt',
    category: 'Resort Atelier',
    textile: 'Breathable Organic Flax',
    priceINR: 2499,
    image: '/images/looks/look_4_cream_linen.jpg',
    link: '/collections',
  },
  {
    id: 'look-5',
    lookNumber: '05',
    name: 'Trevori Est. 2025 Back-Print Tee',
    category: 'Limited Edition Graphic',
    textile: 'Drop-Shoulder Bio-Washed',
    priceINR: 1699,
    image: '/images/looks/look_5_green_backprint.jpg',
    link: '/collections',
  },
];

export const EditorialLooksScroll: React.FC = () => {
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [isGliding, setIsGliding] = useState(false);
  const animFrameId = useRef<number | null>(null);

  const handleScroll = (direction: 'left' | 'right') => {
    if (scrollContainerRef.current) {
      const scrollAmount = 340;
      scrollContainerRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  // Continuous 3D rightward glide as long as cursor is kept on the cards/reel
  useEffect(() => {
    if (!isGliding) {
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
        animFrameId.current = null;
      }
      return;
    }

    let active = true;

    const glide = () => {
      if (!active || !scrollContainerRef.current) return;
      const el = scrollContainerRef.current;
      const maxScroll = el.scrollWidth - el.clientWidth;

      if (el.scrollLeft >= maxScroll - 3) {
        // Loop back smoothly to allow continuous exploration
        el.scrollLeft = 0;
      } else {
        el.scrollLeft += 2.0; // Buttery smooth 60fps rightward 3D drift
      }

      animFrameId.current = requestAnimationFrame(glide);
    };

    animFrameId.current = requestAnimationFrame(glide);

    return () => {
      active = false;
      if (animFrameId.current) {
        cancelAnimationFrame(animFrameId.current);
      }
    };
  }, [isGliding]);

  const tickerItems = [
    'TREVORI EDITION IV',
    'WEAR YOUR PERSPECTIVE',
    'ARCHITECTURAL SILHOUETTES',
    '450 GSM FRENCH TERRY',
    'BIO-WASHED PURE COTTON',
    'ORGANIC FLAX LINEN',
    'DROP-SHOULDER PROPORTIONS',
    'ATELIER 2026',
    'LIMITED RUN DROP',
  ];

  return (
    <section className="relative w-full py-16 sm:py-24 overflow-hidden bg-[#F4F1EA]">
      {/* 1. Header with Controls */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mb-8 sm:mb-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="w-2 h-2 rounded-full bg-[#171717] animate-pulse" />
              <span className="text-xs uppercase tracking-[0.3em] text-[#706B64] font-medium">
                SEASONAL EDITORIAL REEL // 2026
              </span>
              {isGliding && (
                <span className="ml-2 inline-flex items-center gap-1.5 px-2.5 py-0.5 bg-[#171717] text-[#B9AA96] text-[10px] uppercase font-mono tracking-widest border border-[#B9AA96]/60 shadow-lg animate-pulse rounded-full">
                  <Sparkles className="w-2.5 h-2.5 text-[#B9AA96]" />
                  <span>3D GLIDE ACTIVE</span>
                </span>
              )}
            </div>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl text-[#171717] font-normal tracking-tight">
              Curated Silhouette Looks
            </h2>
          </div>

          {/* Navigation Controls */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => handleScroll('left')}
              className="p-3 border border-[#DDD8CE] bg-white text-[#171717] hover:bg-[#171717] hover:text-white transition-all cursor-pointer shadow-sm group"
              aria-label="Scroll left"
            >
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-0.5 transition-transform" />
            </button>
            <button
              onClick={() => handleScroll('right')}
              className="p-3 border border-[#DDD8CE] bg-white text-[#171717] hover:bg-[#171717] hover:text-white transition-all cursor-pointer shadow-sm group"
              aria-label="Scroll right"
            >
              <ArrowRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
            </button>
          </div>
        </div>
      </div>

      {/* 2. Kinetic 3D-Angled Scrolling Line / Marquee Ribbon */}
      <div className="relative w-full my-6 select-none overflow-hidden py-3">
        <div className="relative -rotate-1 skew-x-[-1.5deg] scale-[1.02] bg-[#171717] text-[#F4F1EA] py-3.5 shadow-2xl border-y border-[#B9AA96]/30 overflow-hidden">
          <div className="animate-editorial-ticker flex items-center gap-8 whitespace-nowrap text-[11px] sm:text-xs font-mono uppercase tracking-[0.28em]">
            {[...tickerItems, ...tickerItems].map((item, idx) => (
              <span key={idx} className="flex items-center gap-6 shrink-0">
                <span className="text-[#DDD8CE] font-light">{item}</span>
                <span className="text-[#B9AA96] text-[9px]">✦</span>
              </span>
            ))}
          </div>
        </div>
      </div>

      {/* 3. Horizontal Scrolling Look Cards with 3D Glow & Rightward Motion on Hover */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 mt-10">
        <div
          ref={scrollContainerRef}
          onMouseEnter={() => setIsGliding(true)}
          onMouseLeave={() => setIsGliding(false)}
          className={`flex gap-5 sm:gap-6 overflow-x-auto no-scrollbar pb-8 pt-4 ${
            isGliding ? 'scroll-auto' : 'scroll-smooth snap-x'
          }`}
          style={{ perspective: '1200px' }}
        >
          {EDITORIAL_LOOKS.map((look) => (
            <div
              key={look.id}
              className="look-card-3d-glow w-[260px] sm:w-[290px] md:w-[320px] shrink-0 snap-start group relative bg-[#DDD8CE] border border-[#DDD8CE] overflow-hidden cursor-pointer"
            >
              {/* Luminous Shimmer Light Beam Effect */}
              <div className="beam-effect" />

              {/* Image Container with 3:4 Aspect Ratio */}
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-[#DDD8CE]">
                <img
                  src={look.image}
                  alt={look.name}
                  className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />

                {/* Scrim Gradient for text contrast */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/25 to-transparent pointer-events-none" />

                {/* Top Look Badge */}
                <div className="absolute top-3.5 left-3.5 flex items-center gap-1.5 px-2.5 py-1 bg-black/60 backdrop-blur-md text-white text-[9px] uppercase tracking-widest font-mono border border-white/20">
                  <Sparkles className="w-2.5 h-2.5 text-[#B9AA96]" />
                  <span>LOOK {look.lookNumber}</span>
                </div>

                {/* Bottom Card Content */}
                <div className="absolute bottom-0 inset-x-0 p-5 text-white z-10">
                  <span className="text-[10px] uppercase tracking-widest text-[#DDD8CE] font-medium block mb-1">
                    {look.category}
                  </span>
                  <h3 className="font-serif text-lg sm:text-xl text-white font-normal leading-tight group-hover:text-[#F4F1EA] transition-colors">
                    {look.name}
                  </h3>
                  <div className="text-[11px] text-[#DDD8CE]/80 font-light mt-1">
                    {look.textile}
                  </div>

                  <div className="flex items-center justify-between mt-4 pt-3 border-t border-white/20">
                    <span className="font-medium text-sm text-white">
                      ₹{look.priceINR.toLocaleString('en-IN')}
                    </span>
                    <Link
                      to={look.link}
                      className="inline-flex items-center gap-1 text-[10px] uppercase tracking-wider text-white bg-white/20 hover:bg-white hover:text-[#171717] px-2.5 py-1 backdrop-blur-sm transition-all"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3 h-3" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          ))}

          {/* 4. Final "View All" Card */}
          <Link
            to="/collections"
            className="look-card-3d-glow w-[240px] sm:w-[270px] shrink-0 snap-start group relative bg-[#171717] text-white flex flex-col items-center justify-center text-center p-8 border border-[#B9AA96]/30 cursor-pointer overflow-hidden"
          >
            {/* Luminous Shimmer Light Beam Effect */}
            <div className="beam-effect" />

            {/* Subtle luxury badge */}
            <span className="text-[10px] uppercase tracking-[0.3em] text-[#B9AA96] font-mono mb-4 block">
              TREVORI ARCHIVE
            </span>

            <h3 className="font-serif text-3xl sm:text-4xl font-normal text-white mb-3">
              View All
            </h3>

            <p className="text-xs text-[#DDD8CE] font-light max-w-[180px] leading-relaxed mb-6">
              Explore all 50+ contemporary drop-shoulder silhouettes.
            </p>

            <div className="w-14 h-14 rounded-full border border-white/40 flex items-center justify-center group-hover:bg-white group-hover:text-[#171717] group-hover:scale-110 transition-all duration-300">
              <ArrowRight className="w-5 h-5 group-hover:translate-x-0.5 transition-transform" />
            </div>
          </Link>
        </div>
      </div>
    </section>
  );
};
