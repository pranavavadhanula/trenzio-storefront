import React from 'react';
import { X, Heart, Bookmark, Trash2, ArrowRight, ShoppingBag } from 'lucide-react';
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
        className="fixed inset-0 bg-[#060C1A]/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsWishlistOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0D1B3A] border-l border-[#1E3A66] shadow-2xl flex flex-col text-[#FFFFFF]">
          {/* Header */}
          <div className="p-6 border-b border-[#1E3A66]/60 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-full bg-[#F88379]/15 flex items-center justify-center border border-[#F88379]/40">
                <Bookmark className="w-4 h-4 text-[#F88379]" />
              </div>
              <div>
                <h2 className="font-serif text-2xl text-[#FFFFFF] font-bold">Personal Vault</h2>
                <p className="text-[10px] uppercase tracking-widest text-[#94A3B8] mt-0.5 font-mono">
                  {wishlistedProducts.length} Vaulted {wishlistedProducts.length === 1 ? 'Piece' : 'Pieces'}
                </p>
              </div>
            </div>
            <button
              onClick={() => setIsWishlistOpen(false)}
              className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-[#CBD5E1] hover:text-[#F88379] hover:border-[#F88379] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Value Summary */}
          {wishlistedProducts.length > 0 && (
            <div className="bg-white/[0.02] p-4 border-b border-[#1E3A66]/50 flex items-center justify-between text-xs">
              <span className="text-[#94A3B8] uppercase tracking-wider text-[10px] font-mono">
                Total Vault Value
              </span>
              <span className="font-mono text-[#F88379] font-bold">
                {formatPrice(totalWishlistValueINR)}
              </span>
            </div>
          )}

          {/* List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {wishlistedProducts.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-16 space-y-4">
                <div className="w-12 h-12 rounded-full border border-[#1E3A66] flex items-center justify-center text-[#F88379] bg-[#071325]">
                  <Bookmark className="w-5 h-5 text-[#F88379]" />
                </div>
                <h3 className="font-serif text-xl text-[#FFFFFF]">Your Vault is empty</h3>
                <p className="text-xs text-[#94A3B8] max-w-xs font-light">
                  Save your favorite shirts, hoodies, and styles to your personal vault for quick access.
                </p>
                <button
                  onClick={() => setIsWishlistOpen(false)}
                  className="px-6 py-2.5 border border-[#F88379] text-xs uppercase tracking-wider text-[#F88379] hover:bg-[#F88379] hover:text-[#07111E] transition-colors cursor-pointer mt-2 font-mono font-bold rounded-sm"
                >
                  Explore Drops
                </button>
              </div>
            ) : (
              wishlistedProducts.map((product) => (
                <div
                  key={product.id}
                  className="flex gap-4 pb-6 border-b border-[#1E3A66]/50 last:border-b-0"
                >
                  <img
                    src={product.images.primary}
                    alt={product.name}
                    onClick={() => {
                      setSelectedProduct(product);
                      setIsWishlistOpen(false);
                    }}
                    className="w-20 h-24 object-contain bg-gradient-to-b from-[#0F2444] to-[#0A172D] border border-[#1E3A66]/60 cursor-pointer hover:opacity-80 transition-opacity rounded-sm"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <span className="text-[9px] uppercase tracking-widest text-[#F88379] font-mono font-bold">
                          {product.category || 'T-Shirt'} &bull; {product.gender}
                        </span>
                        <button
                          onClick={() => toggleWishlist(product.id)}
                          className="text-[#94A3B8] hover:text-[#F88379] p-0.5 cursor-pointer transition-colors"
                          title="Remove from Vault"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <h4
                        onClick={() => {
                          setSelectedProduct(product);
                          setIsWishlistOpen(false);
                        }}
                        className="font-serif text-sm text-[#FFFFFF] line-clamp-1 cursor-pointer hover:text-[#F88379] mt-1"
                      >
                        {product.name}
                      </h4>
                      <p className="text-xs font-mono font-bold text-[#F88379] mt-1">
                        {formatPrice(product.priceINR)}
                      </p>
                    </div>

                    <div className="flex items-center gap-2 mt-3">
                      <button
                        onClick={() => handleMoveToBag(product)}
                        className="flex-1 py-2 bg-[#F88379] hover:bg-[#FA958D] text-white text-[10px] font-bold uppercase tracking-wider transition-colors flex items-center justify-center gap-1.5 cursor-pointer font-sans shadow-sm"
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
            <div className="p-6 bg-[#0B1A30] border-t border-[#1E3A66]">
              <button
                onClick={() => {
                  wishlistedProducts.forEach((p) => {
                    addToCart(p, p.sizes[0] || 'M', p.colors[0]?.name || 'Standard');
                  });
                  setIsWishlistOpen(false);
                }}
                className="w-full py-4 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs font-bold uppercase tracking-wider shadow-[0_4px_20px_rgba(248,131,121,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
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
