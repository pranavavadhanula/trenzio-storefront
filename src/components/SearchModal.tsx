import React, { useState } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SearchModal: React.FC = () => {
  const { products, isSearchOpen, setIsSearchOpen, setSelectedProduct, formatPrice, searchQuery, setSearchQuery } = useShop();

  if (!isSearchOpen) return null;

  const trendingQueries = ['Oversized', 'Shirts', 'T-Shirts', 'Hoodies', 'Sweatshirts', 'Men', 'Women'];

  const results = searchQuery.trim() === ''
    ? []
    : products.filter((p) => {
        const q = searchQuery.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.gender.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q)
        );
      });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark frosted backdrop */}
      <div
        className="fixed inset-0 bg-[#060C1A]/95 backdrop-blur-2xl"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 z-10 text-[#FFFFFF]">
        {/* Top search input box */}
        <div className="relative border-b border-white/15 pb-4 flex items-center gap-4">
          <Search className="w-6 h-6 text-[#F88379] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search shirts, t-shirts, sweatshirts, hoodies, fits..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent font-serif text-2xl sm:text-4xl text-[#FFFFFF] placeholder:text-[#94A3B8]/60 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="w-9 h-9 rounded-full border border-white/15 flex items-center justify-center text-[#FFFFFF] hover:text-[#F88379] hover:border-[#F88379] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trending Tags */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#94A3B8] mr-2 flex items-center gap-1 font-mono font-semibold">
            <Sparkles className="w-3 h-3 text-[#F88379]" /> Popular:
          </span>
          {trendingQueries.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-3 py-1 bg-white/[0.04] border border-[#1E3A66] hover:border-[#F88379] text-xs text-[#CBD5E1] hover:text-[#F88379] transition-colors font-mono cursor-pointer rounded-sm"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="mt-12">
          {searchQuery.trim() !== '' && (
            <div className="text-[11px] uppercase tracking-widest text-[#94A3B8] mb-6 font-mono font-bold">
              Found {results.length} {results.length === 1 ? 'item' : 'items'} for "{searchQuery}"
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
              {results.map((product) => (
                <div
                  key={product.id}
                  onClick={() => {
                    setSelectedProduct(product);
                    setIsSearchOpen(false);
                  }}
                  className="group p-3 bg-[#0A172D]/80 backdrop-blur-md border border-[#1E3A66]/60 hover:border-[#F88379] transition-all cursor-pointer flex flex-col justify-between rounded-sm shadow-lg hover:shadow-[0_8px_30px_rgba(248,131,121,0.15)]"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-[#0F2444] to-[#0A172D] mb-3 p-3 flex items-center justify-center border border-[#1E3A66]/40 rounded-sm">
                    <img
                      src={product.images.primary}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#F88379] font-mono font-bold">
                      {product.category || 'T-Shirt'} &bull; {product.gender}
                    </span>
                    <h4 className="font-serif text-sm text-[#FFFFFF] group-hover:text-[#F88379] line-clamp-1 mt-0.5">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-[#1E3A66]/50">
                      <span className="text-xs font-mono font-bold text-[#F88379]">{formatPrice(product.priceINR)}</span>
                      <span className="text-[10px] uppercase tracking-wider text-[#CBD5E1] group-hover:text-[#F88379] flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-bold font-mono">
                        View <ArrowRight className="w-3 h-3 text-[#F88379]" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : searchQuery.trim() !== '' ? (
            <div className="text-center py-16 text-[#94A3B8] font-light">
              <p className="text-sm">No products found matching "{searchQuery}".</p>
              <p className="text-xs mt-1 text-[#64748B]">Try searching for "Shirts", "T-Shirts", "Hoodies", or "Oversized".</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
