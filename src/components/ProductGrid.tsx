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
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#7BB8E8] font-mono font-bold">
            Heavyweight Streetwear &bull; India
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#2A1810] tracking-tight mt-1">
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
                  ? 'border-[#7BB8E8] bg-[#7BB8E8] text-[#2A1810] font-bold'
                  : 'border-[#4E3022] text-[#FAF6EE] hover:border-[#7BB8E8] bg-[#2A1810]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-bar: Gender Filter + Sorting + Item Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-[#2A1810]/15 text-xs">
        {/* Gender Pills */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[#6E4733] font-mono">Fit For:</span>
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer font-mono ${
                selectedGender === g
                  ? 'text-[#7BB8E8] font-bold underline underline-offset-4'
                  : 'text-[#2A1810]/70 hover:text-[#7BB8E8]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sorting & Count */}
        <div className="flex items-center gap-4 text-[#6E4733]">
          <span className="text-[11px] font-mono">
            Showing <strong className="text-[#2A1810]">{filteredProducts.length}</strong> styles
          </span>

          <div className="flex items-center gap-1.5 border-l border-[#2A1810]/15 pl-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#6E4733]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#2A1810] text-xs uppercase tracking-wider text-[#FAF6EE] border border-[#4E3022] px-2 py-1 focus:outline-none focus:border-[#7BB8E8] cursor-pointer font-mono"
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
          <Loader2 className="w-8 h-8 text-[#7BB8E8] animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#6E4733] font-mono">
            Syncing Catalog with Shopify...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-[#4E3022] p-8 sm:p-14 bg-[#2A1810] text-[#FAF6EE] space-y-5 shadow-2xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#362016] border border-[#7BB8E8]/40 flex items-center justify-center text-[#7BB8E8]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF6EE] font-light">
            Ready for Your Shopify Products
          </h3>
          <p className="text-xs sm:text-sm text-[#EAE2D2] max-w-md mx-auto font-light leading-relaxed">
            All demo t-shirts have been deleted. You can now add your real products with your photos and prices from your Shopify store (<code className="text-[#7BB8E8] font-mono">0g1xp7-qd.myshopify.com</code>).
          </p>
          <div className="pt-2">
            <a
              href="https://admin.shopify.com/store/0g1xp7-qd/products/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#7BB8E8] to-[#5E9ED5] text-[#2A1810] text-xs uppercase tracking-widest font-bold hover:brightness-105 shadow-lg transition-all cursor-pointer font-mono"
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
