import React, { useState } from 'react';
import { ProductCard } from './ProductCard';
import { SlidersHorizontal, Sparkles, Plus, ExternalLink, Loader2 } from 'lucide-react';
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
    <section id="collection-section" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-10">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-coral font-mono font-bold">
            Heavyweight Streetwear &bull; India
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#0B1B3D] tracking-tight mt-1">
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
                  ? 'border-atelier-coral bg-atelier-coral text-white font-bold'
                  : 'border-[#1E3B75] text-[#F8F5EE] hover:border-atelier-coral bg-[#0B1B3D]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-bar: Gender Filter + Sorting + Item Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-[#0B1B3D]/10 text-xs">
        {/* Gender Pills */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[#2A3C5E]/70 font-mono">Fit For:</span>
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer font-mono ${
                selectedGender === g
                  ? 'text-atelier-coral font-bold underline underline-offset-4'
                  : 'text-[#0B1B3D]/70 hover:text-atelier-coral'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sorting & Count */}
        <div className="flex items-center gap-4 text-[#2A3C5E]/80">
          <span className="text-[11px] font-mono">
            Showing <strong className="text-[#0B1B3D]">{filteredProducts.length}</strong> styles
          </span>

          <div className="flex items-center gap-1.5 border-l border-[#0B1B3D]/10 pl-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#2A3C5E]/60" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#0B1B3D] text-xs uppercase tracking-wider text-[#F8F5EE] border border-[#1E3B75] px-2 py-1 focus:outline-none cursor-pointer font-mono"
            >
              <option value="featured">Featured</option>
              <option value="price-asc">Price: Low to High</option>
              <option value="price-desc">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid or Clean Waiting State */}
      {isLoadingProducts ? (
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-atelier-coral animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#2A3C5E]/70 font-mono">
            Syncing Catalog with Shopify...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-[#1E3B75] p-8 sm:p-14 bg-[#0B1B3D] text-[#F8F5EE] space-y-5 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F8F5EE] border border-atelier-coral/40 flex items-center justify-center text-atelier-coral">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#0B1B3D] font-light">
            Ready for Your Shopify Products
          </h3>
          <p className="text-xs sm:text-sm text-[#2A3C5E]/80 max-w-md mx-auto font-light leading-relaxed">
            All demo t-shirts have been deleted. You can now add your real products with your photos and prices from your Shopify store (<code className="text-atelier-coral font-mono">0g1xp7-qd.myshopify.com</code>).
          </p>
          <div className="pt-2">
            <a
              href="https://admin.shopify.com/store/0g1xp7-qd/products/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-atelier-coral to-[#ff7b6f] text-white text-xs uppercase tracking-widest font-bold hover:brightness-110 shadow-lg transition-all cursor-pointer font-mono"
            >
              <Plus className="w-4 h-4" />
              <span>Add Your First Product in Shopify</span>
              <ExternalLink className="w-3.5 h-3.5 ml-1" />
            </a>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </section>
  );
};
