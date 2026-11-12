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
    <section id="collection-section" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-10 text-[#F4ECE1]">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#162E21] border border-[#D4C3A3]/35 text-[#E6D7C3] text-[10px] uppercase tracking-[0.3em] font-mono font-bold shadow-[0_0_15px_rgba(212,195,163,0.15)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#E6D7C3] animate-pulse" />
            <span>Heavyweight Streetwear &bull; India</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#F4ECE1] tracking-tight mt-1">
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
                  ? 'border-[#E6D7C3] bg-gradient-to-r from-[#E6D7C3] to-[#D4C3A3] text-[#0A160F] font-black shadow-[0_0_20px_rgba(212,195,163,0.35)] scale-[1.02]'
                  : 'border-white/10 bg-white/[0.04] text-[#F4ECE1] hover:border-[#D4C3A3] hover:text-[#E6D7C3]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-bar: Gender Filter + Sorting + Item Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-[#D4C3A3]/20 text-xs">
        {/* Gender Pills */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[#D4C3A3] font-mono">Fit For:</span>
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer font-mono ${
                selectedGender === g
                  ? 'text-[#E6D7C3] font-bold underline underline-offset-4'
                  : 'text-[#D4C3A3] hover:text-[#F4ECE1]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sorting & Count */}
        <div className="flex items-center gap-4 text-[#D4C3A3]">
          <span className="text-[11px] font-mono">
            Showing <strong className="text-[#E6D7C3]">{filteredProducts.length}</strong> styles
          </span>

          <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#D4C3A3]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#112319] text-xs uppercase tracking-wider text-[#F4ECE1] border border-[#D4C3A3]/25 px-2 py-1 focus:outline-none focus:border-[#E6D7C3] cursor-pointer font-mono"
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
          <Loader2 className="w-8 h-8 text-[#E6D7C3] animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#D4C3A3] font-mono font-medium">
            Fetching Heavyweight Apparel...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-16 text-center border border-[#D4C3A3]/25 p-8 bg-[#112319] space-y-3">
          <p className="text-base text-[#F4ECE1] font-serif">No products found in this category.</p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedGender('All');
            }}
            className="text-xs uppercase tracking-wider text-[#E6D7C3] underline font-mono cursor-pointer"
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