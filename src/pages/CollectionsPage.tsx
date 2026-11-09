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
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-neutral-400 font-mono mb-8">
        <Link to="/" className="hover:text-atelier-gold transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/collections/all" className="hover:text-atelier-gold transition-colors">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-atelier-gold font-bold">{config.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-white/10">
        <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-mono font-medium">
          The Heavyweight Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-atelier-100 tracking-tight mt-1 mb-3">
          {config.label}
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 font-light max-w-2xl leading-relaxed">
          {config.desc}
        </p>

        {/* Collection Tab Links (Can be opened in separate tabs!) */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-white/5">
          {Object.entries(CATEGORY_MAP).map(([slug, item]) => {
            const isTabActive = currentCategory === slug;
            return (
              <Link
                key={slug}
                to={`/collections/${slug}`}
                className={`px-4 py-2 text-xs uppercase tracking-wider border transition-all cursor-pointer font-mono ${
                  isTabActive
                    ? 'border-atelier-gold bg-gradient-to-r from-atelier-gold to-[#b39369] text-atelier-950 font-bold shadow-lg shadow-black/40'
                    : 'border-white/10 text-neutral-300 hover:border-atelier-gold/50 bg-white/5'
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-white/5 text-xs">
        <span className="text-[11px] font-mono text-neutral-400">
          Showing <strong className="text-atelier-100">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
        </span>

        <div className="flex items-center gap-2 text-neutral-400">
          <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
          <span className="text-[10px] uppercase font-mono">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-atelier-900 border border-white/10 text-xs uppercase tracking-wider text-neutral-200 px-3 py-1.5 focus:outline-none focus:border-atelier-gold font-mono cursor-pointer"
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
          <Loader2 className="w-8 h-8 text-atelier-gold animate-spin" />
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
            Loading Trenzio Catalog...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-white/10 p-8 sm:p-14 bg-atelier-900/40 space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-atelier-950 border border-atelier-gold/40 flex items-center justify-center text-atelier-gold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-atelier-100 font-light">
            New Drop Dropping Soon
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-light leading-relaxed">
            Our next heavyweight pieces for <strong>{config.label}</strong> are currently in production with Printrove.
          </p>
          <div className="pt-2">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-atelier-gold to-[#b39369] text-atelier-950 text-xs uppercase tracking-widest font-bold hover:brightness-110 shadow-lg shadow-black/40 transition-all cursor-pointer"
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
