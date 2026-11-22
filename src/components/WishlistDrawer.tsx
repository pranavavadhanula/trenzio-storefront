import React from 'react';
import { X, Heart, Trash2, ShoppingBag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const WishlistDrawer: React.FC = () => {
  const {
    products,
    wishlist,
    toggleWishlist,
    isWishlistOpen,
    setIsWishlistOpen,
    formatPrice,
    addToCart,
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));
  const totalWishlistValueINR = wishlistedProducts.reduce((sum, p) => sum + p.priceINR, 0);

  const handleMoveToBag = (product: Product) => {
    addToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Default');
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#F4F1EA] border-l border-[#DDD8CE] shadow-2xl flex flex-col text-[#171717]">
          {/* Header */}
          <div className="p-6 border-b border-[#DDD8CE] flex items-center justify-between bg-[#FFFFFF]">
            <div>
              <h2 className="font-serif text-2xl text-[#171717] font-normal">Personal Wishlist</h2>
              <p className="text-[10px] uppercase tracking-widest text-[#706B64] mt-0.5">
                {wishlistedProducts.length} {wishlistedProducts.length === 1 ? 'Silhouette' : 'Silhouettes'} Saved
              </p>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-8 h-8 rounded-full border border-[#DDD8CE] flex items-center justify-center text-[#171717] hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Value Summary */}
          {wishlistedProducts.length > 0 && (
            <div className="bg-[#FFFFFF] p-4 border-b border-[#DDD8CE] flex items-center justify-between text-xs">
              <span className="text-[#706B64] uppercase tracking-wider text-[10px]">
                Curated Selection Total:
              </span>
              <span className="text-[#171717] font-semibold">
                {formatPrice(totalWishlistValueINR)}
              </span>
            </div>
          )}

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-20 space-y-4">
                <Heart className="w-8 h-8 text-[#B9AA96] stroke-1" />
                <h3 className="font-serif text-xl text-[#171717]">Your wishlist is empty</h3>
                <p className="text-xs text-[#706B64] max-w-xs font-light leading-relaxed">
                  Save your preferred oversized tees, hoodies, and tailored cargos for private consideration.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-6 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-widest font-medium"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="p-4 bg-[#FFFFFF] border border-[#DDD8CE] flex gap-4"
                >
                  <div className="w-20 h-24 bg-[#F4F1EA] border border-[#DDD8CE] overflow-hidden flex items-center justify-center p-2 flex-shrink-0">
                    <img
                      src={product.images.primary}
                      alt={product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[10px] uppercase tracking-widest text-[#B9AA96]">
                          {product.category}
                        </span>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-[#706B64] hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                      <h4 className="text-xs font-semibold text-[#171717] line-clamp-1 mt-0.5">
                        {product.name}
                      </h4>
                      <div className="text-xs font-semibold text-[#171717] mt-1">
                        {formatPrice(product.priceINR)}
                      </div>
                    </div>

                    <button
                      onClick={() => handleMoveToBag(product)}
                      className="w-full py-2 bg-[#171717] text-white hover:bg-[#333333] transition-colors text-[10px] uppercase tracking-widest font-medium flex items-center justify-center gap-1.5 cursor-pointer mt-2"
                    >
                      <ShoppingBag className="w-3 h-3" />
                      <span>Move to Bag</span>
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
