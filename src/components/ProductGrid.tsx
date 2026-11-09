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
          <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-mono">
            Heavyweight Streetwear &bull; India
          </span>
          <h2 className="font-serif text-3xl sm:text-4xl font-light text-atelier-100 tracking-tight mt-1">
            {selectedCategory === 'All' ? 'Catalog' : selectedCategory}
          </h2>
        </div>

        {/* Category Pills */}
        <div className="flex flex-wrap items-center gap-2">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 text-xs uppercase tracking-wider rounded-none border transition-all cursor-pointer ${
                selectedCategory === cat
                  ? 'border-atelier-gold bg-atelier-gold text-atelier-950 font-bold'
                  : 'border-white/10 text-neutral-300 hover:border-white/30 bg-white/5'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Sub-bar: Gender Filter + Sorting + Item Count */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-6 mb-12 border-b border-white/5 text-xs">
        {/* Gender Pills */}
        <div className="flex items-center gap-2">
          <span className="text-[10px] uppercase tracking-wider text-neutral-500 font-mono">Fit For:</span>
          {GENDERS.map((g) => (
            <button
              key={g}
              onClick={() => setSelectedGender(g)}
              className={`px-2.5 py-1 text-[11px] uppercase tracking-wider transition-colors cursor-pointer ${
                selectedGender === g
                  ? 'text-atelier-gold font-bold underline underline-offset-4'
                  : 'text-neutral-400 hover:text-white'
              }`}
            >
              {g}
            </button>
          ))}
        </div>

        {/* Sorting & Count */}
        <div className="flex items-center gap-4 text-neutral-400">
          <span className="text-[11px] font-mono">
            Showing <strong className="text-atelier-100">{filteredProducts.length}</strong> styles
          </span>

          <div className="flex items-center gap-1.5 border-l border-white/10 pl-4">
            <SlidersHorizontal className="w-3.5 h-3.5 text-neutral-500" />
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="bg-transparent text-xs uppercase tracking-wider text-neutral-300 border-none focus:outline-none cursor-pointer font-mono"
            >
              <option value="featured" className="bg-atelier-950 text-atelier-100">Featured</option>
              <option value="price-asc" className="bg-atelier-950 text-atelier-100">Price: Low to High</option>
              <option value="price-desc" className="bg-atelier-950 text-atelier-100">Price: High to Low</option>
            </select>
          </div>
        </div>
      </div>

      {/* Product Grid or Clean Waiting State */}
      {isLoadingProducts ? (
        <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-atelier-gold animate-spin" />
          <p className="text-xs uppercase tracking-widest text-neutral-400 font-mono">
            Syncing Catalog with Shopify...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-white/10 p-8 sm:p-14 bg-atelier-900/40 space-y-5">
          <div className="w-14 h-14 mx-auto rounded-full bg-atelier-950 border border-atelier-gold/40 flex items-center justify-center text-atelier-gold">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-serif text-2xl sm:text-3xl text-atelier-100 font-light">
            Ready for Your Shopify Products
          </h3>
          <p className="text-xs sm:text-sm text-neutral-300 max-w-md mx-auto font-light leading-relaxed">
            All demo t-shirts have been deleted. You can now add your real products with your photos and prices from your Shopify store (<code className="text-atelier-gold font-mono">0g1xp7-qd.myshopify.com</code>).
          </p>
          <div className="pt-2">
            <a
              href="https://admin.shopify.com/store/0g1xp7-qd/products/new"
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-gradient-to-r from-atelier-gold to-[#b39369] text-atelier-950 text-xs uppercase tracking-widest font-bold hover:brightness-110 shadow-lg shadow-black/40 transition-all cursor-pointer"
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
