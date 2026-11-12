import React from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
import { Product } from '../types';

export const WishlistPage: React.FC = () => {
  const { wishlist, products, toggleWishlist, addToCart, formatPrice } = useShop();

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  const handleMoveToBag = (product: Product) => {
    addToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Black');
    toggleWishlist(product.id);
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 bg-[#EBF3FA] text-[#FFFFFF]">
      <div className="mb-10 pb-6 border-b border-[#3B82F6]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-[#2563EB] fill-[#2563EB]" />
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#2563EB] font-mono font-bold">Saved Items</span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#FFFFFF] tracking-tight mt-1">
              Your Wishlist
            </h1>
          </div>
        </div>
        <Link
          to="/collections/all"
          className="text-xs uppercase tracking-wider text-[#3B82F6] hover:text-[#2563EB] font-mono font-medium"
        >
          &larr; Browse Catalog
        </Link>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-24 text-center border border-[#3B82F6]/25 p-8 sm:p-14 bg-white text-[#FFFFFF] space-y-4 max-w-xl mx-auto shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.04] border border-[#2563EB]/40 flex items-center justify-center text-[#2563EB]">
            <Heart className="w-6 h-6 text-[#2563EB]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-[#3B82F6] max-w-md mx-auto font-light leading-relaxed">
            Click the heart icon on any heavyweight oversized tee or luxury sweatshirt to bookmark it here.
          </p>
          <div className="pt-4">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs uppercase tracking-widest font-black shadow-[0_4px_16px_rgba(248,131,121,0.4)] transition-all cursor-pointer font-mono"
            >
              <span>Explore Collection</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {wishlistedProducts.map((product) => (
            <div
              key={product.id}
              className="group p-4 bg-white border border-[#3B82F6]/20 flex flex-col justify-between space-y-4 hover:border-[#2563EB] transition-all shadow-xl text-[#FFFFFF]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-white/[0.05] to-[#3B82F6]/[0.03] p-4 flex items-center justify-center border border-[#3B82F6]/20">
                <img
                  src={product.images.primary}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-white border border-[#3B82F6]/30 flex items-center justify-center text-[#FFFFFF] hover:text-[#2563EB] cursor-pointer shadow-md"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#2563EB] font-bold">{product.gsm} GSM</span>
                <Link
                  to={`/products/${product.id}`}
                  className="font-serif text-lg text-[#FFFFFF] hover:text-[#2563EB] transition-colors block line-clamp-1 font-normal"
                >
                  {product.name}
                </Link>
                <div className="font-mono text-sm font-bold text-[#2563EB]">
                  {formatPrice(product.priceINR)}
                </div>
              </div>

              {/* Move to bag CTA */}
              <button
                onClick={() => handleMoveToBag(product)}
                className="w-full py-3 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs font-black uppercase tracking-wider shadow-[0_4px_16px_rgba(248,131,121,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Move to Bag</span>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
