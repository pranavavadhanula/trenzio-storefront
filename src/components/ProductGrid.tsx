import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Loader2 } from 'lucide-react';
import { useShop } from '../context/ShopContext';

const CATEGORIES = ['All', 'Hoodies', 'Oversized Tees', 'Pants', 'Sweatshirts', 'T-Shirts', 'Traditional', 'Accessories'] as const;
const GENDERS = ['All', 'Men', 'Women', 'Unisex'] as const;

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
    <section id="collection-section" className="py-16 sm:py-24 max-w-7xl mx-auto px-4 sm:px-8 text-[#171717]">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-10 font-sans border-b border-[#DDD8CE] pb-6">
        <div>
          <span className="text-[11px] uppercase tracking-[0.25em] text-[#706B64] font-medium block mb-1">
            The Complete Atelier Edit
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal text-[#171717] tracking-tight">
            {selectedCategory === 'All' ? 'Current Catalog' : selectedCategory}
          </h2>
        </div>

        {/* Category Filter Buttons */}
        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-3 sm:px-4 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                selectedCategory === cat
                  ? 'border-[#171717] bg-[#171717] text-white font-medium'
                  : 'border-[#DDD8CE] bg-[#FFFFFF] text-[#706B64] hover:text-[#171717] hover:border-[#171717]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-bar: Gender Filter + Sorting + Item Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 text-xs">
        {/* Gender Pills */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-medium">Department:</span>
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                selectedGender === g
                  ? 'text-[#171717] font-semibold underline underline-offset-4'
                  : 'text-[#706B64] hover:text-[#171717]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sorting & Count */}
        <div className="flex items-center gap-4 text-[#706B64]">
          <span className="text-[11px]">
            Showing <strong className="text-[#171717]">{filteredProducts.length}</strong> styles
          </span>

          <div className="flex items-center gap-1.5 border-l border-[#DDD8CE] pl-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#706B64]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#FFFFFF] text-xs uppercase tracking-wider text-[#171717] border border-[#DDD8CE] px-2.5 py-1 focus:outline-none focus:border-[#171717] cursor-pointer"
            >
              <option value="featured">Featured Order</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Grid of Products */}
      {isLoadingProducts ? (
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-6 h-6 text-[#171717] animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#706B64] font-medium">
            Synchronizing Trevori Atelier Catalog...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-24 text-center bg-[#FFFFFF] border border-[#DDD8CE] p-12">
          <p className="font-serif text-2xl text-[#171717] mb-2">No matching items found.</p>
          <p className="text-xs text-[#706B64] max-w-sm mx-auto mb-6">
            Adjust your active category or gender filters to explore the available collection.
          </p>
          <button
            onClick={() => {
              setSelectedCategory('All');
              setSelectedGender('All');
            }}
            className="px-6 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-widest hover:bg-[#333333] transition-colors"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
