import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Sparkles, Loader2, ChevronRight } from 'lucide-react';

const CATEGORY_MAP: Record<string, { label: string; catFilter?: string; genderFilter?: string; desc: string }> = {
  'all': {
    label: 'All Collections',
    desc: 'Browse our complete catalog of 240–350 GSM heavyweight tees and luxury sweatshirts.',
  },
  'oversized-tees': {
    label: 'Oversized T-Shirts',
    catFilter: 'Oversized Tees',
    desc: 'Super-combed 240–350 GSM cotton with structured dropped shoulders and boxy silhouette.',
  },
  'sweatshirts': {
    label: 'Sweatshirts & Hoodies',
    catFilter: 'Sweatshirts',
    desc: '400 GSM diagonal loop French Terry engineered for cold evenings and relaxed luxury.',
  },
  'classic-tees': {
    label: 'Classic Tees',
    catFilter: 'T-Shirts',
    desc: 'Everyday refined luxury cut with tailored sleeves and reinforced ribbed collar.',
  },
  'men': {
    label: "Men's Wear",
    genderFilter: 'Men',
    desc: 'Heavyweight street fits engineered for men with masculine boxy drape and reinforced ribbed collars.',
  },
  'women': {
    label: "Women's Wear",
    genderFilter: 'Women',
    desc: 'Relaxed unisex oversized streetwear cuts tailored for effortless everyday styling.',
  },
  'accessories': {
    label: 'Accessories',
    desc: 'Curated accessories to complement your heavyweight streetwear — caps, bags, chains & more.',
  },
  'traditional-men': {
    label: "Men's Traditional Wear",
    genderFilter: 'Men',
    desc: 'Premium kurtas, sherwanis and ethnic wear crafted with the finest fabrics for every occasion.',
  },
  'traditional-women': {
    label: "Women's Traditional Wear",
    genderFilter: 'Women',
    desc: 'Elegant sarees, lehengas and ethnic drapes designed for the modern Indian woman.',
  },
};

export const CollectionsPage: React.FC = () => {
  const { category: rawCategory = 'all' } = useParams<{ category?: string }>();
  const currentCategory = rawCategory.toLowerCase();
  const config = CATEGORY_MAP[currentCategory] || CATEGORY_MAP['all'];

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
    <div className="relative min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 bg-[#060C1A] text-white overflow-hidden">
      {/* Luminous Royal Blue Atmospheric Ambient Glow */}
      <div className="pointer-events-none absolute top-4 left-1/4 w-[520px] h-48 bg-gradient-to-r from-[#2563EB]/25 via-[#1D4ED8]/15 to-transparent blur-3xl rounded-full" />

      {/* Breadcrumb Navigation */}
      <nav className="relative z-10 flex items-center space-x-2 text-xs uppercase tracking-widest text-[#94A3B8] font-mono mb-8">
        <Link to="/" className="hover:text-[#3B82F6] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#3B82F6]/60" />
        <Link to="/collections/all" className="hover:text-[#3B82F6] transition-colors">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#3B82F6]/60" />
        <span className="text-[#3B82F6] font-bold drop-shadow-[0_0_8px_rgba(59,130,246,0.6)]">{config.label}</span>
      </nav>

      {/* Header */}
      <div className="relative z-10 mb-10 pb-8 border-b border-[#2563EB]/20">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/40 text-[#60A5FA] text-[10px] uppercase tracking-[0.28em] font-mono font-bold shadow-[0_0_15px_rgba(37,99,235,0.25)] mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] shadow-[0_0_8px_#3B82F6] animate-pulse" />
          <span>The Heavyweight Catalog</span>
        </div>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-white tracking-tight mt-1 mb-3">
          {config.label}
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] font-light max-w-2xl leading-relaxed">
          {config.desc}
        </p>

        {/* Collection Tab Links */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/10">
          {Object.entries(CATEGORY_MAP).map(([slug, item]) => {
            const isTabActive = currentCategory === slug;
            return (
              <Link
                key={slug}
                to={`/collections/${slug}`}
                className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all duration-300 cursor-pointer font-mono ${
                  isTabActive
                    ? 'border-[#3B82F6] bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-black shadow-[0_0_22px_rgba(37,99,235,0.55)] scale-[1.02]'
                    : 'border-white/10 bg-white/[0.04] text-[#CBD5E1] hover:border-[#3B82F6] hover:text-[#60A5FA] hover:bg-[#2563EB]/10'
                }`}
                title={`Open ${item.label} (Right click to open in new tab)`}
              >
                {item.label}
              </Link>
            );
          })}
        </div>
      </div>

      {/* Filter and Count Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-[#2563EB]/20 text-xs">
        <span className="text-[11px] font-mono text-[#94A3B8]">
          Showing <strong className="text-[#3B82F6] font-bold drop-shadow-[0_0_8px_rgba(59,130,246,0.5)]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
        </span>

        <div className="flex items-center gap-2 text-[#94A3B8]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#3B82F6]" />
          <span className="text-[10px] uppercase font-mono font-bold text-white">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0D1B3A] border border-[#2563EB]/30 text-xs uppercase tracking-wider text-white px-3 py-1.5 focus:outline-none focus:border-[#3B82F6] focus:ring-1 focus:ring-[#3B82F6] font-mono cursor-pointer"
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
          <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-mono font-bold">
            Loading Trenzio Catalog...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-[#2563EB]/25 p-8 sm:p-14 bg-[#0D1B3A] text-white space-y-5 shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.04] border border-[#3B82F6]/40 flex items-center justify-center text-[#3B82F6]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-white font-light">
            New Drop Dropping Soon
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto font-light leading-relaxed">
            Our next heavyweight pieces for <strong className="text-[#3B82F6]">{config.label}</strong> are currently in production with Printrove.
          </p>
          <div className="pt-2">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-white text-xs uppercase tracking-widest font-black shadow-[0_0_20px_rgba(37,99,235,0.45)] transition-all cursor-pointer font-mono"
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