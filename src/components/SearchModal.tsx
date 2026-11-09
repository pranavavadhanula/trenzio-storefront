import React, { useState } from 'react';
import { Search, X, ArrowRight, Sparkles } from 'lucide-react';
import { useShop } from '../context/ShopContext';

export const SearchModal: React.FC = () => {
  const { products, isSearchOpen, setIsSearchOpen, setSelectedProduct, formatPrice } = useShop();
  const [query, setQuery] = useState('');

  if (!isSearchOpen) return null;

  const trendingQueries = ['Oversized', 'Sweatshirts', '350 GSM', 'Hoodies', 'Men', 'Women'];

  const results = query.trim() === ''
    ? []
    : products.filter((p) => {
        const q = query.toLowerCase();
        return (
          p.name.toLowerCase().includes(q) ||
          p.category.toLowerCase().includes(q) ||
          p.gender.toLowerCase().includes(q) ||
          p.fabric.toLowerCase().includes(q)
        );
      });

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      {/* Dark Navy frosted backdrop */}
      <div
        className="fixed inset-0 bg-[#0B1B3D]/95 backdrop-blur-md"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative max-w-4xl mx-auto px-6 pt-24 pb-16 z-10">
        {/* Top search input box */}
        <div className="relative border-b border-white/20 pb-4 flex items-center gap-4">
          <Search className="w-6 h-6 text-atelier-coral flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search oversized tees, sweatshirts, GSM, fits..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full bg-transparent font-serif text-2xl sm:text-4xl text-[#F8F5EE] placeholder:text-[#F8F5EE]/40 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-[#F8F5EE] hover:text-atelier-coral hover:border-atelier-coral cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trending Tags */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#F8F5EE]/70 mr-2 flex items-center gap-1 font-mono">
            <Sparkles className="w-3 h-3 text-atelier-coral" /> Popular:
          </span>
          {trendingQueries.map((tag) => (
            <button
              key={tag}
              onClick={() => setQuery(tag)}
              className="px-3 py-1 bg-white/10 border border-white/15 text-xs text-[#F8F5EE] hover:border-atelier-coral hover:text-atelier-coral transition-colors font-mono cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="mt-12">
          {query.trim() !== '' && (
            <div className="text-[11px] uppercase tracking-widest text-[#F8F5EE]/70 mb-6 font-mono">
              Found {results.length} {results.length === 1 ? 'item' : 'items'} for "{query}"
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
                  className="group p-3 bg-white/5 border border-white/10 hover:border-atelier-coral/60 transition-all cursor-pointer flex flex-col justify-between"
                >
                  <div className="aspect-[3/4] w-full overflow-hidden bg-[#EFE8DC] mb-3 p-3 flex items-center justify-center border border-[#1E3B75]">
                    <img
                      src={product.images.primary}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-atelier-coral font-mono font-bold">
                      {product.gsm} GSM &bull; {product.gender}
                    </span>
                    <h4 className="font-serif text-sm text-[#F8F5EE] group-hover:text-atelier-coral line-clamp-1 mt-0.5">
                      {product.name}
                    </h4>
                    <div className="flex items-center justify-between mt-2 pt-2 border-t border-white/10">
                      <span className="text-xs font-mono font-bold text-[#F8F5EE]">{formatPrice(product.priceINR)}</span>
                      <span className="text-[10px] uppercase tracking-wider text-atelier-coral flex items-center gap-1 group-hover:translate-x-0.5 transition-transform font-bold font-mono">
                        View <ArrowRight className="w-3 h-3" />
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          ) : query.trim() !== '' ? (
            <div className="text-center py-16 text-[#F8F5EE]/70 font-light">
              <p className="text-sm">No products found matching "{query}".</p>
              <p className="text-xs mt-1 text-[#F8F5EE]/50">Try searching for "Oversized", "Sweatshirt", or "350 GSM".</p>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
