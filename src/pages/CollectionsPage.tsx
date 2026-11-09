import React, { useState, useMemo } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Sparkles, Plus, ExternalLink, Loader2, ChevronRight } from 'lucide-react';

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
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 bg-[#F8F5EE] text-[#0B1B3D]">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#2A3C5E]/70 font-mono mb-8">
        <Link to="/" className="hover:text-atelier-coral transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/collections/all" className="hover:text-atelier-coral transition-colors">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-atelier-coral font-bold">{config.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#0B1B3D]/10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-coral font-mono font-bold">
          The Heavyweight Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#0B1B3D] tracking-tight mt-1 mb-3">
          {config.label}
        </h1>
        <p className="text-xs sm:text-sm text-[#2A3C5E]/80 font-light max-w-2xl leading-relaxed">
          {config.desc}
        </p>

        {/* Collection Tab Links (Can be opened in separate tabs!) */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#0B1B3D]/5">
          {Object.entries(CATEGORY_MAP).map(([slug, item]) => {
            const isTabActive = currentCategory === slug;
            return (
              <Link
                key={slug}
                to={`/collections/${slug}`}
                className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all cursor-pointer font-mono ${
                  isTabActive
                    ? 'border-atelier-coral bg-atelier-coral text-white font-bold shadow-md'
                    : 'border-[#0B1B3D]/20 text-[#0B1B3D] hover:border-atelier-coral hover:text-atelier-coral bg-transparent'
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-[#0B1B3D]/10 text-xs">
        <span className="text-[11px] font-mono text-[#2A3C5E]/80">
          Showing <strong className="text-[#0B1B3D]">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
        </span>

        <div className="flex items-center gap-2 text-[#2A3C5E]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#2A3C5E]/70" />
          <span className="text-[10px] uppercase font-mono">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-white border border-[#0B1B3D]/15 text-xs uppercase tracking-wider text-[#0B1B3D] px-3 py-1.5 focus:outline-none focus:border-atelier-coral font-mono cursor-pointer"
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
          <Loader2 className="w-8 h-8 text-atelier-coral animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#2A3C5E]/80 font-mono">
            Loading Trenzio Catalog...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-[#0B1B3D]/10 p-8 sm:p-14 bg-white space-y-5 shadow-sm">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F8F5EE] border border-atelier-coral/40 flex items-center justify-center text-atelier-coral">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#0B1B3D] font-light">
            New Drop Dropping Soon
          </h3>
          <p className="text-xs sm:text-sm text-[#2A3C5E]/80 max-w-md mx-auto font-light leading-relaxed">
            Our next heavyweight pieces for <strong>{config.label}</strong> are currently in production with Printrove.
          </p>
          <div className="pt-2">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-atelier-coral to-[#ff7b6f] text-white text-xs uppercase tracking-widest font-bold hover:brightness-110 shadow-lg transition-all cursor-pointer"
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
