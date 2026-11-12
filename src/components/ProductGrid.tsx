import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Sparkles, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CATEGORIES = ['All', 'Oversized Tees', 'Sweatshirts', 'T-Shirts'] as const;
const GENDERS = ['All', 'Men', 'Women'] as const;

export const ProductGrid: React.FC = () => {
  const { products, isLoadingProducts, selectedCategory, setSelectedCategory, selectedGender, setSelectedGender } = useShop();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = products.filter((p) => {
    const matchesCat = selectedCategory === 'All' || p.category === selectedCategory;
    const matchesGender = selectedGender === 'All' || p.gender === selectedGender || p.gender === 'Unisex';
    return matchesCat && matchesGender;
  }).sort((a, b) => {
    if (sortBy === 'price-asc') return a.priceINR - b.priceINR;
    if (sortBy === 'price-desc') return b.priceINR - a.priceINR;
    return 0;
  });

  return (
    <section id="collection-section" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-10 text-white">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#2563EB]/15 border border-[#2563EB]/40 text-[#60A5FA] text-[10px] uppercase tracking-[0.3em] font-mono font-bold shadow-[0_0_15px_rgba(37,99,235,0.25)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#3B82F6] animate-pulse" />
            <span>Heavyweight Streetwear &bull; India</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-white tracking-tight mt-1">
            {selectedCategory === 'All' ? 'Catalog' : selectedCategory}
          </h2>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-none border transition-all cursor-pointer font-mono ${
                selectedCategory === cat
                  ? 'border-[#3B82F6] bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] text-white font-black shadow-[0_0_20px_rgba(37,99,235,0.5)] scale-[1.02]'
                  : 'border-white/10 bg-white/[0.04] text-[#CBD5E1] hover:border-[#3B82F6] hover:text-[#60A5FA]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-bar: Gender Filter + Sorting + Item Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-[#2563EB]/20 text-xs">
        {/* Gender Pills */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[#94A3B8] font-mono">Fit For:</span>
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer font-mono ${
                selectedGender === g
                  ? 'text-[#3B82F6] font-bold underline underline-offset-4'
                  : 'text-[#94A3B8] hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sorting & Count */}
        <div className="flex items-center gap-4 text-[#94A3B8]">
          <span className="text-[11px] font-mono">
            Showing <strong className="text-[#3B82F6]">{filteredProducts.length}</strong> styles
          </span>

          <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#3B82F6]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0D1B3A] text-xs uppercase tracking-wider text-white border border-[#2563EB]/30 px-2 py-1 focus:outline-none focus:border-[#3B82F6] cursor-pointer font-mono"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Products */}
      {isLoadingProducts ? (
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#3B82F6] animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#94A3B8] font-mono font-medium">
            Fetching Heavyweight Apparel...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center border border-[#2563EB]/25 p-8 bg-[#0D1B3A] space-y-3">
          <p className="text-base text-white font-serif">No products found in this category.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedGender('All');
            }}
            className="text-xs uppercase tracking-wider text-[#3B82F6] underline font-mono cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-12">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};