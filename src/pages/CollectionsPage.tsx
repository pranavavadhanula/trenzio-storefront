import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Loader2, ChevronRight } from 'lucide-react';

const CATEGORY_MAP: Record<string, { label: string; catFilter?: string; genderFilter?: string; desc: string; dept: 'men' | 'women' | 'all' }> = {
  // Men's Section
  'men': {
    label: "Men's Contemporary Wear",
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Contemporary box cuts, bio-washed combed cotton tees, dropped-shoulder hoodies, and tailored utilitarian trousers.',
  },
  'men-sweatshirts': {
    label: "Men's Sweatshirts & Hoodies",
    catFilter: 'Hoodies',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Luxury brushed loopback French Terry hoodies engineered with double-layered hood structure and reinforced cuffs.',
  },
  'men-oversized-tees': {
    label: "Men's Oversized T-Shirts",
    catFilter: 'Oversized Tees',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Bio-washed combed cotton jersey with architectural dropped shoulders and reinforced 1.25" ribbed collars.',
  },
  'men-classic-tees': {
    label: "Men's Classic & Tailored Shirts",
    catFilter: 'T-Shirts',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Everyday refined luxury cuts in long-staple Supima cotton for effortless minimalist layering.',
  },
  'traditional-men': {
    label: "Men's Heritage Couture",
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Bespoke velvet bandhgalas and handwoven silk zardozi kurta sets honoring traditional Indian tailoring.',
  },

  // Women's Section
  'women': {
    label: "Women's Silhouettes",
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Relaxed fluid drapes, wide-leg knife-pleated trousers, and structured oversized cotton foundations.',
  },
  'women-sweatshirts': {
    label: "Women's Sweatshirts & Hoodies",
    catFilter: 'Sweatshirts',
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Soft French Terry cotton crewnecks and boxy cropped fleece layers.',
  },
  'women-oversized-tees': {
    label: "Women's Oversized T-Shirts",
    catFilter: 'Oversized Tees',
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Generously proportioned dropped-shoulder cuts in breathable ring-spun organic cotton.',
  },
  'women-classic-tees': {
    label: "Women's Classic Basics",
    catFilter: 'T-Shirts',
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Clean essential cotton tanks and structured tailored basics.',
  },
  'traditional-women': {
    label: "Women's Heritage Couture",
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Pure handloom Chanderi silk lehengas and royal heritage drapes with 24k gold zari artistry.',
  },

  // Generic / Default
  'all': {
    label: "Complete Atelier Collection",
    dept: 'all',
    desc: 'Explore the full contemporary streetwear catalog engineered with 100% bio-washed combed cotton.',
  },
};

const MEN_COLLECTIONS = [
  { slug: 'men', label: "All Men's Wear" },
  { slug: 'men-oversized-tees', label: 'Oversized Tees' },
  { slug: 'men-sweatshirts', label: 'Hoodies & Fleece' },
  { slug: 'men-classic-tees', label: 'Classic Shirts' },
  { slug: 'traditional-men', label: 'Traditional Couture' },
];

const WOMEN_COLLECTIONS = [
  { slug: 'women', label: "All Women's Wear" },
  { slug: 'women-oversized-tees', label: 'Oversized Tees' },
  { slug: 'women-sweatshirts', label: 'Sweatshirts' },
  { slug: 'women-classic-tees', label: 'Classic Basics' },
  { slug: 'traditional-women', label: 'Traditional Couture' },
];

export const CollectionsPage: React.FC = () => {
  const { category: rawCategory = 'all' } = useParams<{ category?: string }>();
  const currentCategory = rawCategory.toLowerCase();
  const config = CATEGORY_MAP[currentCategory] || CATEGORY_MAP['all'];

  const isInitialWomen = currentCategory.startsWith('women') || currentCategory === 'traditional-women';
  const [selectedDept, setSelectedDept] = useState<'men' | 'women' | 'all'>(isInitialWomen ? 'women' : 'men');

  useEffect(() => {
    if (currentCategory.startsWith('women') || currentCategory === 'traditional-women') {
      setSelectedDept('women');
    } else if (currentCategory === 'all') {
      setSelectedDept('all');
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
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 bg-[#F4F1EA] text-[#171717] font-sans">
      {/* Editorial Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <nav className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#706B64] font-medium">
          <Link to="/" className="hover:text-[#171717] transition-colors">Home</Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B9AA96]" />
          <Link
            to={selectedDept === 'women' ? '/collections/women' : '/collections/men'}
            className="hover:text-[#171717] transition-colors text-[#171717]"
          >
            {selectedDept === 'women' ? "Women's Edit" : "Men's Edit"}
          </Link>
          {currentCategory !== 'men' && currentCategory !== 'women' && currentCategory !== 'all' && (
            <>
              <ChevronRight className="w-3.5 h-3.5 text-[#B9AA96]" />
              <span className="text-[#171717] font-semibold">{config.label}</span>
            </>
          )}
        </nav>

        {/* Department Switcher */}
        <Link
          to={selectedDept === 'women' ? '/collections/men' : '/collections/women'}
          className="text-xs uppercase tracking-[0.2em] px-4 py-2 border border-[#DDD8CE] bg-[#FFFFFF] text-[#706B64] hover:text-[#171717] hover:border-[#171717] transition-colors font-medium"
        >
          {selectedDept === 'women' ? "Switch to Men's Silhouettes →" : "Switch to Women's Silhouettes →"}
        </Link>
      </div>

      {/* Editorial Category Header */}
      <div className="mb-10 pb-8 border-b border-[#DDD8CE]">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B9AA96] font-semibold block mb-2">
          {selectedDept === 'women' ? "Women's Collection // Volume IV" : "Men's Collection // Volume IV"}
        </span>
        <h1 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal text-[#171717] tracking-tight mb-3">
          {config.label}
        </h1>
        <p className="text-xs sm:text-sm text-[#706B64] max-w-2xl font-light leading-relaxed">
          {config.desc}
        </p>
      </div>

      {/* Subcategory Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-8">
        {(selectedDept === 'women' ? WOMEN_COLLECTIONS : MEN_COLLECTIONS).map((item) => {
          const isActive = currentCategory === item.slug;
          return (
            <Link
              key={item.slug}
              to={`/collections/${item.slug}`}
              className={`px-4 py-2 text-xs uppercase tracking-wider transition-colors border ${
                isActive
                  ? 'border-[#171717] bg-[#171717] text-white font-medium'
                  : 'border-[#DDD8CE] bg-[#FFFFFF] text-[#706B64] hover:border-[#171717] hover:text-[#171717]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Sorting & Filter Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-[#DDD8CE] text-xs">
        <div className="text-[#706B64]">
          Showing <strong className="text-[#171717]">{filteredProducts.length}</strong> architectural silhouettes
        </div>

        <div className="flex items-center gap-2">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#706B64]" />
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FFFFFF] border border-[#DDD8CE] px-3 py-1.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717] uppercase tracking-wider cursor-pointer"
          >
            <option value="featured">Featured Sequence</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* 4:5 Products Grid */}
      {isLoadingProducts ? (
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-6 h-6 text-[#171717] animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#706B64]">Loading Atelier Silhouettes...</p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-12 text-center">
          <p className="font-serif text-2xl text-[#171717] mb-2">No silhouettes currently active.</p>
          <p className="text-xs text-[#706B64] mb-6">Explore our foundational drops or reset your filter.</p>
          <Link
            to="/collections/men"
            className="px-6 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-widest font-medium"
          >
            View Men's Wear
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </div>
  );
};
