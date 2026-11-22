import React from 'react';
import { Search, X, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

export const SearchModal: React.FC = () => {
  const { products, isSearchOpen, setIsSearchOpen, formatPrice, searchQuery, setSearchQuery } = useShop();

  if (!isSearchOpen) return null;

  const trendingQueries = ['Hoodies', 'Oversized Tees', 'Cargos', 'Jackets', 'Pants', 'Shirts', 'Accessories'];

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
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      {/* Editorial Backdrop */}
      <div
        className="fixed inset-0 bg-[#F4F1EA]/95 backdrop-blur-md transition-opacity"
        onClick={() => setIsSearchOpen(false)}
      />

      <div className="relative max-w-4xl mx-auto px-6 pt-20 pb-16 z-10 text-[#171717]">
        {/* Top search input box */}
        <div className="relative border-b border-[#DDD8CE] pb-4 flex items-center gap-4">
          <Search className="w-6 h-6 text-[#171717] flex-shrink-0" />
          <input
            type="text"
            autoFocus
            placeholder="Search hoodies, oversized tees, wide-leg cargos, jackets..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-transparent font-serif text-2xl sm:text-4xl text-[#171717] placeholder:text-[#706B64]/50 focus:outline-none"
          />
          <button
            onClick={() => setIsSearchOpen(false)}
            className="w-9 h-9 rounded-full border border-[#DDD8CE] flex items-center justify-center text-[#171717] hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Trending Tags */}
        <div className="mt-6 flex flex-wrap items-center gap-2">
          <span className="text-[10px] uppercase tracking-widest text-[#706B64] mr-2 font-medium">
            Trending Searches:
          </span>
          {trendingQueries.map((tag) => (
            <button
              key={tag}
              onClick={() => setSearchQuery(tag)}
              className="px-3 py-1 bg-[#FFFFFF] border border-[#DDD8CE] hover:border-[#171717] text-xs text-[#706B64] hover:text-[#171717] transition-colors cursor-pointer"
            >
              {tag}
            </button>
          ))}
        </div>

        {/* Search Results */}
        <div className="mt-10">
          {searchQuery.trim() !== '' && (
            <div className="text-[11px] uppercase tracking-widest text-[#706B64] mb-6 font-medium">
              Found {results.length} {results.length === 1 ? 'silhouette' : 'silhouettes'} for "{searchQuery}"
            </div>
          )}

          {results.length > 0 ? (
            <div className="grid grid-cols-2 md:grid-cols-3 gap-6">
              {results.map((product) => (
                <Link
                  key={product.id}
                  to={`/products/${product.id}`}
                  onClick={() => setIsSearchOpen(false)}
                  className="group p-3 bg-[#FFFFFF] border border-[#DDD8CE] hover:border-[#171717] transition-all flex flex-col justify-between"
                >
                  <div className="aspect-[4/5] w-full overflow-hidden bg-[#FFFFFF] mb-3 p-3 flex items-center justify-center border border-[#DDD8CE]/40">
                    <img
                      src={product.images.primary}
                      alt={product.name}
                      className="max-h-full max-w-full object-contain group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <div>
                    <span className="text-[9px] uppercase tracking-widest text-[#B9AA96] font-medium">
                      {product.category} &bull; {product.gender}
                    </span>
                    <h4 className="text-xs font-semibold text-[#171717] group-hover:text-[#B9AA96] transition-colors line-clamp-1 mt-0.5">
                      {product.name}
                    </h4>
                    <div className="text-xs font-semibold text-[#171717] mt-1">
                      {formatPrice(product.priceINR)}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          ) : searchQuery.trim() !== '' ? (
            <div className="text-center py-16 text-[#706B64] text-xs">
              No matching silhouettes located. Try searching for "hoodies", "cargos", or "tees".
            </div>
          ) : null}
        </div>
      </div>
    </div>
  );
};
