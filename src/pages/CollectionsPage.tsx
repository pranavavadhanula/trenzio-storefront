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
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 bg-[#F9F6F0] text-[#2A1810]">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#6E4733]/80 font-mono mb-8">
        <Link to="/" className="hover:text-[#7BB8E8] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/collections/all" className="hover:text-[#7BB8E8] transition-colors">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-[#7BB8E8] font-bold">{config.label}</span>
      </nav>

      {/* Header */}
      <div className="mb-10 pb-8 border-b border-[#2A1810]/15">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#7BB8E8] font-mono font-bold">
          The Heavyweight Catalog
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#2A1810] tracking-tight mt-1 mb-3">
          {config.label}
        </h1>
        <p className="text-xs sm:text-sm text-[#6E4733] font-light max-w-2xl leading-relaxed">
          {config.desc}
        </p>

        {/* Collection Tab Links (Can be opened in separate tabs!) */}
        <div className="flex flex-wrap items-center gap-2 mt-6 pt-4 border-t border-[#2A1810]/15">
          {Object.entries(CATEGORY_MAP).map(([slug, item]) => {
            const isTabActive = currentCategory === slug;
            return (
              <Link
                key={slug}
                to={`/collections/${slug}`}
                className={`px-4 py-2 text-xs uppercase tracking-wider border-2 transition-all cursor-pointer font-mono ${
                  isTabActive
                    ? 'border-[#7BB8E8] bg-[#7BB8E8] text-[#2A1810] font-bold shadow-md'
                    : 'border-[#2A1810] bg-[#2A1810] text-[#FAF6EE] hover:bg-[#7BB8E8] hover:text-[#2A1810] hover:border-[#7BB8E8] transition-colors font-bold'
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
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-[#2A1810]/15 text-xs">
        <span className="text-[11px] font-mono text-[#2A1810] font-medium">
          Showing <strong className="text-[#7BB8E8] font-bold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
        </span>

        <div className="flex items-center gap-2 text-[#2A1810]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#7BB8E8]" />
          <span className="text-[10px] uppercase font-mono font-bold">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#2A1810] border border-[#4E3022] text-xs uppercase tracking-wider text-[#FAF6EE] px-3 py-1.5 focus:outline-none focus:border-[#7BB8E8] font-mono cursor-pointer"
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
          <Loader2 className="w-8 h-8 text-[#7BB8E8] animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#2A1810] font-mono font-bold">
            Loading Trenzio Catalog...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-[#4E3022] p-8 sm:p-14 bg-[#2A1810] text-[#FAF6EE] space-y-5 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#362016] border border-[#7BB8E8]/40 flex items-center justify-center text-[#7BB8E8]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF6EE] font-light">
            New Drop Dropping Soon
          </h3>
          <p className="text-xs sm:text-sm text-[#EAE2D2] max-w-md mx-auto font-light leading-relaxed">
            Our next heavyweight pieces for <strong className="text-[#7BB8E8]">{config.label}</strong> are currently in production with Printrove.
          </p>
          <div className="pt-2">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#7BB8E8] to-[#5E9ED5] text-[#2A1810] text-xs uppercase tracking-widest font-bold hover:brightness-105 shadow-lg transition-all cursor-pointer font-mono"
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
