import React, { useState, useMemo, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Sparkles, Loader2, ChevronRight, ArrowRight } from 'lucide-react';

interface RunwayItem {
  slug: string;
  title: string;
  subtitle: string;
  startingPrice: string;
  gsm: string;
  image: string;
  tag: string;
}

const MEN_RUNWAY_ITEMS: RunwayItem[] = [
  {
    slug: 'men-sweatshirts',
    title: 'Heavyweight Hoodies',
    subtitle: 'Diagonal Loop French Terry',
    startingPrice: 'Starts @ ₹2,499',
    gsm: '400 GSM',
    image: '/images/models/man_streetwear_hoodie.jpg',
    tag: 'Cold Drops',
  },
  {
    slug: 'men-oversized-tees',
    title: 'Oversized Street Tees',
    subtitle: 'Structured Dropped Shoulders',
    startingPrice: 'Starts @ ₹1,499',
    gsm: '240–350 GSM',
    image: '/images/models/street_tee.jpg',
    tag: 'Signature',
  },
  {
    slug: 'men-classic-tees',
    title: 'Tailored Classic Tees',
    subtitle: 'Reinforced 1x1 Ribbed Collar',
    startingPrice: 'Starts @ ₹1,199',
    gsm: '280 GSM',
    image: '/images/models/man_model_fashion.jpg',
    tag: 'Everyday Luxury',
  },
  {
    slug: 'traditional-men',
    title: 'Royal Ethnic Wear',
    subtitle: 'Artisan Silks & Sherwanis',
    startingPrice: 'Starts @ ₹2,999',
    gsm: 'Silk Blend',
    image: 'https://images.unsplash.com/photo-1617137984095-74e4e5e3613f?auto=format&fit=crop&w=800&q=80',
    tag: 'Festive Atelier',
  },
];

const WOMEN_RUNWAY_ITEMS: RunwayItem[] = [
  {
    slug: 'women-sweatshirts',
    title: 'Cropped & Relaxed Hoodies',
    subtitle: '400 GSM French Terry Drape',
    startingPrice: 'Starts @ ₹2,499',
    gsm: '400 GSM',
    image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=800&q=80',
    tag: 'Cozy Luxury',
  },
  {
    slug: 'women-oversized-tees',
    title: 'Draped Oversized Tees',
    subtitle: 'Effortless Streetwear Cut',
    startingPrice: 'Starts @ ₹1,499',
    gsm: '240 GSM',
    image: 'https://images.unsplash.com/photo-1503342217505-b0a15ec3261c?auto=format&fit=crop&w=800&q=80',
    tag: 'Bio-Washed',
  },
  {
    slug: 'women-classic-tees',
    title: 'Minimal Everyday Tees',
    subtitle: 'Tailored Ribbed Luxury',
    startingPrice: 'Starts @ ₹1,199',
    gsm: '280 GSM',
    image: 'https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=800&q=80',
    tag: 'Essential Fit',
  },
  {
    slug: 'traditional-women',
    title: 'Modern Festive Drapes',
    subtitle: 'Contemporary Sarees & Silks',
    startingPrice: 'Starts @ ₹2,999',
    gsm: 'Pure Loom',
    image: 'https://images.unsplash.com/photo-1610030469983-98e550d6193c?auto=format&fit=crop&w=800&q=80',
    tag: 'Festive Haute',
  },
];

const Runway3DCard: React.FC<{
  item: RunwayItem;
  isActive: boolean;
}> = ({ item, isActive }) => {
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
    const normX = (x / rect.width) * 2 - 1;
    const normY = (y / rect.height) * 2 - 1;
    setTilt({
      rotateX: -normY * 12,
      rotateY: normX * 12,
      glareX: (x / rect.width) * 100,
      glareY: (y / rect.height) * 100,
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
      className="relative flex-1 w-full"
      style={{ perspective: '1000px' }}
    >
      {/* 3D Pedestal Floor Glow */}
      <div
        className={`pointer-events-none absolute -bottom-4 inset-x-4 h-8 rounded-full blur-xl transition-all duration-500 ${
          tilt.isHovered || isActive
            ? 'bg-[#F88379]/45 opacity-100 scale-105'
            : 'bg-[#1E3A66]/30 opacity-40 scale-95'
        }`}
      />

      <Link
        to={`/collections/${item.slug}`}
        className={`group relative block h-[420px] sm:h-[460px] rounded-2xl overflow-hidden border-2 transition-all duration-300 cursor-pointer will-change-transform ${
          isActive
            ? 'border-[#F88379] shadow-[0_20px_50px_rgba(248,131,121,0.35)]'
            : 'border-[#1E3A66]/80 hover:border-[#F88379] shadow-[0_15px_35px_rgba(0,0,0,0.8)]'
        }`}
        style={{
          transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${
            tilt.isHovered ? 1.035 : 1
          }, ${tilt.isHovered ? 1.035 : 1}, 1) translate3d(0, ${tilt.isHovered ? -10 : 0}px, 0)`,
          transformStyle: 'preserve-3d',
          transition: tilt.isHovered
            ? 'transform 0.12s cubic-bezier(0.2, 0, 0, 1), box-shadow 0.3s ease, border-color 0.3s ease'
            : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.5s ease, border-color 0.3s ease',
          background: 'linear-gradient(180deg, #0A1628 0%, #07111E 100%)',
        }}
      >
        {/* Parallax Photo Layer */}
        <div
          className="absolute inset-0 w-full h-full overflow-hidden"
          style={{
            transform: `scale(${tilt.isHovered ? 1.1 : 1.02}) translate3d(${
              -tilt.rotateY * 1.5
            }px, ${tilt.rotateX * 1.5}px, 0)`,
            transition: tilt.isHovered
              ? 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'
              : 'transform 0.7s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <img
            src={item.image}
            alt={item.title}
            className="w-full h-full object-cover object-center filter contrast-115 brightness-90 group-hover:brightness-100 transition-all duration-500"
          />
        </div>

        {/* Ambient Dark Gradient Base */}
        <div className="absolute inset-0 bg-gradient-to-t from-[#07111E] via-[#07111E]/60 to-transparent group-hover:via-[#07111E]/40 transition-colors duration-500 z-10" />

        {/* Dynamic Specular Gloss Glare Sheen */}
        <div
          className="pointer-events-none absolute inset-0 z-20 transition-opacity duration-300"
          style={{
            opacity: tilt.isHovered ? 1 : 0,
            background: `radial-gradient(circle 380px at ${tilt.glareX}% ${tilt.glareY}%, rgba(255, 255, 255, 0.35) 0%, rgba(255, 255, 255, 0.08) 40%, transparent 75%)`,
            mixBlendMode: 'overlay',
          }}
        />

        {/* High-Gloss Edge Bevels & Diagonal Reflection */}
        <div className="pointer-events-none absolute inset-0 z-20 bg-gradient-to-tr from-white/[0.14] via-transparent to-white/[0.18] opacity-70 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-1/3 bg-gradient-to-b from-white/[0.2] to-transparent z-20" />
        <div className="pointer-events-none absolute inset-0 rounded-2xl z-20 shadow-[inset_0_2px_4px_rgba(255,255,255,0.35),inset_0_-2px_4px_rgba(0,0,0,0.8)]" />

        {/* Top Badges (GSM + Tag) */}
        <div className="absolute top-4 inset-x-4 flex items-center justify-between z-30 pointer-events-none">
          <span className="px-2.5 py-1 rounded-full bg-[#0B1A30]/90 border border-white/20 text-white text-[9px] uppercase tracking-wider font-bold backdrop-blur-md shadow-md">
            {item.gsm}
          </span>
          <span className="px-2.5 py-1 rounded-full bg-[#F88379] text-white text-[9px] uppercase tracking-wider font-bold shadow-[0_2px_10px_rgba(248,131,121,0.5)]">
            {item.tag}
          </span>
        </div>

        {/* Floating 3D Foreground Details */}
        <div
          className="relative z-30 flex flex-col justify-end h-full p-5 sm:p-6 space-y-2.5"
          style={{
            transform: `translate3d(${tilt.rotateY * 1.5}px, ${-tilt.rotateX * 1.5}px, 30px)`,
            transformStyle: 'preserve-3d',
            transition: tilt.isHovered
              ? 'transform 0.15s cubic-bezier(0.2, 0, 0, 1)'
              : 'transform 0.6s cubic-bezier(0.16, 1, 0.3, 1)',
          }}
        >
          <div>
            <h3 className="font-sans text-xl sm:text-2xl text-white font-extrabold group-hover:text-[#F88379] transition-colors tracking-tight drop-shadow-[0_2px_12px_rgba(0,0,0,0.9)]">
              {item.title}
            </h3>
            <p className="text-[11px] text-[#CBD5E1] font-medium drop-shadow-sm mt-0.5 line-clamp-1">
              {item.subtitle}
            </p>
          </div>

          <div className="pt-2 flex items-center justify-between border-t border-white/15">
            <span className="text-xs font-extrabold text-[#F88379] font-sans tracking-wide">
              {item.startingPrice}
            </span>
            <span className="inline-flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-white group-hover:text-[#F88379] transition-colors">
              <span>View Drop</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </span>
          </div>
        </div>
      </Link>
    </div>
  );
};

const CATEGORY_MAP: Record<string, { label: string; catFilter?: string; genderFilter?: string; desc: string; dept: 'men' | 'women' }> = {
  // Men's Section
  'men': {
    label: "Men's Wear",
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Heavyweight street fits engineered for men with masculine boxy drape and reinforced ribbed collars.',
  },
  'men-sweatshirts': {
    label: "Men's Sweatshirts & Hoodies",
    catFilter: 'Sweatshirts',
    genderFilter: 'Men',
    dept: 'men',
    desc: '400 GSM diagonal loop French Terry hoodies and relaxed luxury sweatshirts engineered for men.',
  },
  'men-oversized-tees': {
    label: "Men's Oversized T-Shirts",
    catFilter: 'Oversized Tees',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Super-combed 240–350 GSM cotton with structured dropped shoulders and boxy silhouette for men.',
  },
  'men-classic-tees': {
    label: "Men's Classic Tees",
    catFilter: 'T-Shirts',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Everyday refined luxury cut with tailored sleeves and reinforced ribbed collar for men.',
  },
  'traditional-men': {
    label: "Men's Traditional Wear",
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Premium kurtas, sherwanis and ethnic wear crafted with the finest fabrics for men.',
  },

  // Women's Section
  'women': {
    label: "Women's Wear",
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Relaxed oversized streetwear silhouettes and tailored drape for effortless everyday styling.',
  },
  'women-sweatshirts': {
    label: "Women's Sweatshirts & Hoodies",
    catFilter: 'Sweatshirts',
    genderFilter: 'Women',
    dept: 'women',
    desc: '400 GSM French Terry hoodies and relaxed luxury sweatshirts tailored for women.',
  },
  'women-oversized-tees': {
    label: "Women's Oversized T-Shirts",
    catFilter: 'Oversized Tees',
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Draped dropped-shoulder tees in 240–350 GSM bio-washed combed cotton tailored for women.',
  },
  'women-classic-tees': {
    label: "Women's Classic Tees",
    catFilter: 'T-Shirts',
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Tailored everyday luxury cuts and minimalist heavyweight basics for women.',
  },
  'traditional-women': {
    label: "Women's Traditional Wear",
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Elegant sarees, lehengas and ethnic drapes designed for the modern Indian woman.',
  },

  // Fallbacks & legacy routes
  'sweatshirts': {
    label: "Men's Sweatshirts & Hoodies",
    catFilter: 'Sweatshirts',
    genderFilter: 'Men',
    dept: 'men',
    desc: '400 GSM diagonal loop French Terry engineered for cold evenings and relaxed luxury.',
  },
  'oversized-tees': {
    label: "Men's Oversized T-Shirts",
    catFilter: 'Oversized Tees',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Super-combed 240–350 GSM cotton with structured dropped shoulders and boxy silhouette.',
  },
  'classic-tees': {
    label: "Men's Classic Tees",
    catFilter: 'T-Shirts',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Everyday refined luxury cut with tailored sleeves and reinforced ribbed collar.',
  },
  'all': {
    label: "Men's Wear",
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Browse our complete catalog of 240–400 GSM heavyweight tees and luxury sweatshirts.',
  },
};

const MEN_COLLECTIONS = [
  { slug: 'men', label: "All Men's Wear" },
  { slug: 'men-oversized-tees', label: 'Oversized T-Shirts' },
  { slug: 'men-sweatshirts', label: 'Sweatshirts & Hoodies' },
  { slug: 'men-classic-tees', label: 'Classic Tees' },
  { slug: 'traditional-men', label: "Men's Traditional Wear" },
];

const WOMEN_COLLECTIONS = [
  { slug: 'women', label: "All Women's Wear" },
  { slug: 'women-oversized-tees', label: 'Oversized T-Shirts' },
  { slug: 'women-sweatshirts', label: 'Sweatshirts & Hoodies' },
  { slug: 'women-classic-tees', label: 'Classic Tees' },
  { slug: 'traditional-women', label: "Women's Traditional Wear" },
];

export const CollectionsPage: React.FC = () => {
  const { category: rawCategory = 'men' } = useParams<{ category?: string }>();
  const currentCategory = rawCategory.toLowerCase();
  const config = CATEGORY_MAP[currentCategory] || CATEGORY_MAP['men'];

  // Determine active department strictly based on current category or URL
  const isInitialWomen = currentCategory.startsWith('women') || currentCategory === 'traditional-women';
  const [selectedDept, setSelectedDept] = useState<'men' | 'women'>(isInitialWomen ? 'women' : 'men');

  useEffect(() => {
    if (currentCategory.startsWith('women') || currentCategory === 'traditional-women') {
      setSelectedDept('women');
    } else {
      setSelectedDept('men');
    }
  }, [currentCategory]);

  const { products, isLoadingProducts } = useShop();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (config.catFilter && p.category !== config.catFilter) return false;
        if (config.genderFilter && p.gender !== config.genderFilter && p.gender !== 'Unisex') return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceINR - b.priceINR;
        if (sortBy === 'price-desc') return b.priceINR - a.priceINR;
        return 0;
      });
  }, [products, config, sortBy]);

  return (
    <div className="relative min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 bg-[#07111E] text-white overflow-hidden font-sans">
      {/* Dark Blue Atmospheric Glow */}
      <div className="pointer-events-none absolute top-4 left-1/4 w-[520px] h-48 bg-gradient-to-r from-[#1D4ED8]/25 via-[#2563EB]/15 to-transparent blur-3xl rounded-full" />

      {/* Breadcrumb Navigation & Department Switcher */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 mb-8">
        <nav className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#94A3B8] font-sans font-medium">
          <Link to="/" className="hover:text-[#F88379] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
          <Link
            to={selectedDept === 'women' ? '/collections/women' : '/collections/men'}
            className="hover:text-[#F88379] transition-colors font-bold text-white"
          >
            {selectedDept === 'women' ? "Women's Wear" : "Men's Wear"}
          </Link>
          {currentCategory !== 'men' && currentCategory !== 'women' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
              <span className="text-[#F88379] font-bold">{config.label}</span>
            </>
          )}
        </nav>

        {/* Quick Link to Other Department */}
        <Link
          to={selectedDept === 'women' ? '/collections/men' : '/collections/women'}
          className="text-xs uppercase tracking-wider px-3.5 py-1.5 border border-[#1E3A66] bg-[#0B1A30] text-[#94A3B8] hover:border-[#F88379] hover:text-[#F88379] transition-all font-sans font-bold shadow-sm"
        >
          {selectedDept === 'women' ? "Switch to Men's Wear →" : "Switch to Women's Wear →"}
        </Link>
      </div>

      {/* Header */}
      <div className="relative z-10 mb-10 pb-8 border-b border-[#1E3A66]/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F88379]/15 border border-[#F88379]/40 text-[#F88379] text-[10px] uppercase tracking-wider font-sans font-bold shadow-sm mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F88379] animate-pulse" />
          <span>{selectedDept === 'women' ? "Women's Collection" : "Men's Collection"}</span>
        </div>
        <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1 mb-3">
          {config.label}
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] font-normal max-w-2xl leading-relaxed">
          {config.desc}
        </p>

        {/* Unique 3D Interactive Runway Showcase: Men's & Women's Section Separately */}
        <div className="mt-8 pt-8 border-t border-[#1E3A66]/40">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
            <div>
              <div className="inline-flex items-center gap-2 text-[10px] uppercase tracking-widest text-[#F88379] font-bold font-sans">
                <Sparkles className="w-3.5 h-3.5" />
                <span>{selectedDept === 'women' ? "Women's 3D Atelier Runway" : "Men's 3D Atelier Runway"}</span>
              </div>
              <h2 className="text-xl sm:text-2xl font-extrabold text-white font-sans mt-0.5">
                {selectedDept === 'women' ? "Interactive Women's Silhouettes" : "Interactive Men's Silhouettes"}
              </h2>
            </div>
            <span className="text-[11px] text-[#94A3B8] font-sans font-medium">
              3D interactive cards &bull; Move cursor to tilt &bull; Click to explore drop
            </span>
          </div>

          {/* 3D Cards Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
            {(selectedDept === 'men' ? MEN_RUNWAY_ITEMS : WOMEN_RUNWAY_ITEMS).map((item) => (
              <Runway3DCard
                key={item.slug}
                item={item}
                isActive={
                  currentCategory === item.slug ||
                  (item.slug === 'men-sweatshirts' && currentCategory === 'sweatshirts') ||
                  (item.slug === 'men-oversized-tees' && currentCategory === 'oversized-tees') ||
                  (item.slug === 'men-classic-tees' && currentCategory === 'classic-tees')
                }
              />
            ))}
          </div>
        </div>

        {/* Separated Collection Tabs: Shows ONLY Men's or ONLY Women's Categories */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-6 border-t border-[#1E3A66]/40">
          {selectedDept === 'men' ? (
            MEN_COLLECTIONS.map((item) => {
              const isTabActive =
                currentCategory === item.slug ||
                (item.slug === 'men' && currentCategory === 'all') ||
                (item.slug === 'men-sweatshirts' && currentCategory === 'sweatshirts') ||
                (item.slug === 'men-oversized-tees' && currentCategory === 'oversized-tees') ||
                (item.slug === 'men-classic-tees' && currentCategory === 'classic-tees');

              return (
                <Link
                  key={item.slug}
                  to={`/collections/${item.slug}`}
                  className={`px-4 sm:px-5 py-2.5 text-xs uppercase tracking-wider border transition-all duration-300 cursor-pointer font-sans ${
                    isTabActive
                      ? 'border-[#F88379] bg-[#F88379] text-white font-bold shadow-[0_4px_16px_rgba(248,131,121,0.45)] scale-[1.02]'
                      : 'border-[#1E3A66]/70 bg-[#0B1A30] text-[#CBD5E1] hover:border-[#F88379] hover:text-[#F88379] font-medium'
                  }`}
                  title={`Open ${item.label}`}
                >
                  {item.label}
                </Link>
              );
            })
          ) : (
            WOMEN_COLLECTIONS.map((item) => {
              const isTabActive = currentCategory === item.slug;

              return (
                <Link
                  key={item.slug}
                  to={`/collections/${item.slug}`}
                  className={`px-4 sm:px-5 py-2.5 text-xs uppercase tracking-wider border transition-all duration-300 cursor-pointer font-sans ${
                    isTabActive
                      ? 'border-[#F88379] bg-[#F88379] text-white font-bold shadow-[0_4px_16px_rgba(248,131,121,0.45)] scale-[1.02]'
                      : 'border-[#1E3A66]/70 bg-[#0B1A30] text-[#CBD5E1] hover:border-[#F88379] hover:text-[#F88379] font-medium'
                  }`}
                  title={`Open ${item.label}`}
                >
                  {item.label}
                </Link>
              );
            })
          )}
        </div>
      </div>

      {/* Filter and Count Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-[#1E3A66]/50 text-xs">
        <span className="text-[12px] font-sans text-[#94A3B8] font-medium">
          Showing <strong className="text-white font-bold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
        </span>

        <div className="flex items-center gap-2 text-[#94A3B8]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#F88379]" />
          <span className="text-[11px] uppercase font-sans font-bold text-white">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0B1A30] border border-[#1E3A66] text-xs uppercase tracking-wider text-white px-3 py-1.5 focus:outline-none focus:border-[#F88379] focus:ring-1 focus:ring-[#F88379] font-sans font-semibold cursor-pointer"
          >
            <option value="featured">Featured Drops</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoadingProducts ? (
        <div className="py-28 text-center flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#F88379] animate-spin" />
          <p className="text-xs uppercase tracking-wider text-[#94A3B8] font-sans font-bold">
            Loading Trenzio Catalog...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-[#1E3A66]/60 p-8 sm:p-14 bg-[#0B1A30] text-white space-y-5 shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F88379]/15 border border-[#F88379]/30 flex items-center justify-center text-[#F88379]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-sans text-2xl sm:text-3xl text-white font-bold">
            Next Drop Coming Soon
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto font-normal leading-relaxed">
            All previous drop pieces for <strong className="text-[#F88379]">{config.label}</strong> are sold out. We are preparing our next exclusive heavyweight launch.
          </p>
          <div className="pt-2">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs uppercase tracking-wider font-bold shadow-[0_4px_16px_rgba(248,131,121,0.45)] transition-all cursor-pointer font-sans"
            >
              <span>Explore All Available Drops</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
