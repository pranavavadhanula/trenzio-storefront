import React from 'react';
import { X, Heart, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
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
    setSelectedProduct,
  } = useShop();

  if (!isWishlistOpen) return null;

  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));
  const totalWishlistValueINR = wishlistedProducts.reduce((sum, p) => sum + p.priceINR, 0);

  const handleMoveToBag = (product: Product) => {
    addToCart(product, product.sizes[0] || 'M', product.colors[0]?.name || 'Standard');
    toggleWishlist(product.id);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#2A1810]/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#2A1810] border-l border-[#4E3022] shadow-2xl flex flex-col text-[#FAF6EE]">
          {/* Header */}
          <div className="p-6 border-b border-[#4E3022] flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Heart className="w-5 h-5 text-[#7BB8E8] fill-[#7BB8E8]" />
              <div>
                <h2 className="font-serif text-2xl text-[#FAF6EE] font-light">Saved Wishlist</h2>
                <p className="text-[10px] uppercase tracking-widest text-[#EAE2D2]/70 mt-0.5 font-mono">
                  {wishlistedProducts.length} Saved {wishlistedProducts.length === 1 ? 'Piece' : 'Pieces'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-8 h-8 rounded-full border border-[#4E3022] flex items-center justify-center text-[#FAF6EE] hover:text-[#7BB8E8] hover:border-[#7BB8E8] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Value Summary */}
          {wishlistedProducts.length > 0 && (
            <div className="bg-[#362016] p-4 border-b border-[#4E3022] flex items-center justify-between text-xs">
              <span className="text-[#EAE2D2]/70 uppercase tracking-wider text-[10px] font-mono">
                Total Wishlist Value
              </span>
              <span className="font-mono text-[#7BB8E8] font-bold">
                {formatPrice(totalWishlistValueINR)}
              </span>
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-12 h-12 rounded-full border border-[#4E3022] flex items-center justify-center text-[#EAE2D2]/50">
                  <Heart className="w-5 h-5 text-[#7BB8E8]" />
                </div>
                <h3 className="font-serif text-xl text-[#FAF6EE]">Your wishlist is empty</h3>
                <p className="text-xs text-[#EAE2D2]/80 max-w-xs font-light">
                  Tap the heart icon on any t-shirt or sweatshirt to save it for later.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-6 py-2.5 border border-[#7BB8E8] text-xs uppercase tracking-wider text-[#7BB8E8] hover:bg-[#7BB8E8] hover:text-[#2A1810] transition-colors cursor-pointer mt-2 font-mono font-bold"
                >
                  Explore Catalog
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 pb-6 border-b border-[#4E3022] last:border-b-0"
                >
                  <img
                    src={product.images.primary}
                    alt={product.name}
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsWishlistOpen(false);
                    }}
                    className="w-20 h-24 object-cover bg-[#EFE9DC] border border-[#4E3022] cursor-pointer hover:opacity-80 transition-opacity"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] uppercase tracking-widest text-[#7BB8E8] font-mono font-bold">
                          {product.gsm} GSM &bull; {product.gender}
                        </span>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-[#EAE2D2]/50 hover:text-[#7BB8E8] p-0.5 cursor-pointer transition-colors"
                          title="Remove"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsWishlistOpen(false);
                        }}
                        className="font-serif text-sm text-[#FAF6EE] line-clamp-1 cursor-pointer hover:text-[#7BB8E8] mt-1"
                      >
                        {product.name}
                      </h4>
                      <p className="text-xs font-mono font-bold text-[#FAF6EE] mt-1">
                        {formatPrice(product.priceINR)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleMoveToBag(product)}
                        className="flex-1 py-2 bg-gradient-to-r from-[#7BB8E8] to-[#5E9ED5] text-[#2A1810] text-[10px] font-bold uppercase tracking-wider hover:brightness-105 transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-mono shadow-md"
                      >
                        <ShoppingBag className="w-3 h-3" />
                        <span>Move to Bag</span>
                      </button>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer */}
          {wishlistedProducts.length > 0 && (
            <div className="p-6 bg-[#2A1810] border-t border-[#4E3022]">
              <button
                onClick={() => {
                  wishlistedProducts.forEach((p) => {
                    addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name || 'Standard');
                  });
                  setIsWishlistOpen(false);
                }}
                className="w-full py-4 bg-gradient-to-r from-[#7BB8E8] to-[#5E9ED5] text-[#2A1810] text-xs font-bold uppercase tracking-wider hover:brightness-105 transition-all flex items-center justify-center gap-2 shadow-2xl cursor-pointer font-mono"
              >
                <span>Add All to Bag</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
