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
    <section id="collection-section" className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-10 text-[#FAF5FF]">
      {/* Top Filter Bar */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-12">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FF7A00]/15 border border-[#FF7A00]/40 text-[#FF8A3D] text-[10px] uppercase tracking-[0.3em] font-mono font-bold shadow-[0_0_15px_rgba(255,122,0,0.25)] mb-2">
            <span className="w-1.5 h-1.5 rounded-full bg-[#FF7A00] animate-pulse" />
            <span>Heavyweight Streetwear &bull; India</span>
          </div>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-[#FAF5FF] tracking-tight mt-1">
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
                  ? 'border-[#00E5FF] bg-gradient-to-r from-[#00E5FF] to-[#00C2FF] text-black font-black shadow-[0_0_20px_rgba(0,229,255,0.6),0_0_8px_rgba(255,122,0,0.3)] scale-[1.02]'
                  : 'border-white/15 bg-white/[0.04] text-[#FAF5FF] hover:border-[#00E5FF] hover:text-[#00E5FF]'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-bar: Gender Filter + Sorting + Item Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-[#00E5FF]/20 text-xs">
        {/* Gender Pills */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-[#D8B4FE] font-mono">Fit For:</span>
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer font-mono ${
                selectedGender === g
                  ? 'text-[#00E5FF] font-bold underline underline-offset-4'
                  : 'text-[#D8B4FE] hover:text-[#00E5FF]'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sorting & Count */}
        <div className="flex items-center gap-4 text-[#D8B4FE]">
          <span className="text-[11px] font-mono">
            Showing <strong className="text-[#00E5FF]">{filteredProducts.length}</strong> styles
          </span>

          <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-[#FF7A00]" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-[#140A21] text-xs uppercase tracking-wider text-[#FAF5FF] border border-white/15 px-2 py-1 focus:outline-none focus:border-[#00E5FF] cursor-pointer font-mono"
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
          <Loader2 className="w-8 h-8 text-[#00E5FF] animate-spin" />
          <p className="text-xs uppercase tracking-widest text-[#D8B4FE] font-mono">
            Syncing Catalog with Shopify...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-[#BA55D3]/20 p-8 sm:p-14 bg-[#140A21] text-[#FAF5FF] space-y-5 shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.04] border border-[#DA70D6]/40 flex items-center justify-center text-[#DA70D6]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-[#FAF5FF] font-light">
            Ready for Your Shopify Products
          </h3>
          <p className="text-xs sm:text-sm text-[#D8B4FE] max-w-md mx-auto font-light leading-relaxed">
            All demo t-shirts have been deleted. You can now add your real products with your photos and prices from your Shopify store (<code className="text-[#00E5FF] font-mono">0g1xp7-qd.myshopify.com</code>).
          </p>
          <div className="pt-2">
            <a
              href="https://admin.shopify.com/store/0g1xp7-qd/products/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-[#DA70D6] to-[#BA55D3] hover:from-[#E056FD] hover:to-[#DA70D6] text-black text-xs uppercase tracking-widest font-black shadow-[0_0_20px_rgba(218,112,214,0.4)] transition-all cursor-pointer font-mono"
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
