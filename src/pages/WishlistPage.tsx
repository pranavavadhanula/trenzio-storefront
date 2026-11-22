import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Bookmark, ArrowRight, ShoppingBag } from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

export const WishlistPage: React.FC = () => {
  const { wishlist, products } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 bg-[#F4F1EA] text-[#171717] font-sans">
      <div className="mb-10 pb-6 border-b border-[#DDD8CE] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B9AA96] font-semibold">Private Selection</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#171717] tracking-tight mt-1 flex items-center gap-3">
            <Bookmark className="w-7 h-7 sm:w-9 sm:h-9 text-[#B9AA96]" />
            <span>Personal Vault</span>
          </h1>
        </div>
        <Link
          to="/collections"
          className="text-xs uppercase tracking-widest text-[#706B64] hover:text-[#171717] transition-colors font-medium"
        >
          &larr; Browse All Silhouettes
        </Link>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-24 text-center border border-[#DDD8CE] p-8 sm:p-14 bg-[#FFFFFF] max-w-xl mx-auto shadow-sm">
          <Bookmark className="w-10 h-10 mx-auto text-[#B9AA96] stroke-1 mb-4" />
          <h2 className="font-serif text-2xl sm:text-3xl text-[#171717]">
            Your vault is currently empty
          </h2>
          <p className="text-xs text-[#706B64] max-w-md mx-auto font-light leading-relaxed mt-2 mb-6">
            Curate your architectural wardrobe by saving items directly from the catalog into your private vault.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#171717] hover:bg-[#333333] text-white text-xs uppercase tracking-[0.2em] font-medium transition-colors"
          >
            <span>Explore Drops</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
