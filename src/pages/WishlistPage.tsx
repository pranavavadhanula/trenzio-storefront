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
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 bg-[#0A160F] text-[#F4ECE1]">
      <div className="mb-10 pb-6 border-b border-[#D4C3A3]/20 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Heart className="w-6 h-6 text-[#E6D7C3] fill-[#E6D7C3]" />
          <div>
            <span className="text-[10px] uppercase tracking-widest text-[#E6D7C3] font-mono font-bold">Saved Items</span>
            <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#F4ECE1] tracking-tight mt-1">
              Your Wishlist
            </h1>
          </div>
        </div>
        <Link
          to="/collections/all"
          className="text-xs uppercase tracking-wider text-[#D4C3A3] hover:text-[#E6D7C3] font-mono font-medium"
        >
          &larr; Browse Catalog
        </Link>
      </div>

      {wishlistedProducts.length === 0 ? (
        <div className="py-24 text-center border border-[#D4C3A3]/25 p-8 sm:p-14 bg-[#112319] text-[#F4ECE1] space-y-4 max-w-xl mx-auto shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.04] border border-[#E6D7C3]/40 flex items-center justify-center text-[#E6D7C3]">
            <Heart className="w-6 h-6 text-[#E6D7C3]" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
            Your wishlist is empty
          </h2>
          <p className="text-xs text-[#D4C3A3] max-w-md mx-auto font-light leading-relaxed">
            Click the heart icon on any heavyweight oversized tee or luxury sweatshirt to bookmark it here.
          </p>
          <div className="pt-4">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#E6D7C3] to-[#D4C3A3] hover:from-[#F4ECE1] hover:to-[#E6D7C3] text-black text-xs uppercase tracking-widest font-black shadow-[0_0_20px_rgba(212,195,163,0.45)] transition-all cursor-pointer font-mono"
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
              className="group p-4 bg-[#112319] border border-[#D4C3A3]/20 flex flex-col justify-between space-y-4 hover:border-[#E6D7C3] transition-all shadow-xl text-[#F4ECE1]"
            >
              <div className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-white/[0.05] to-[#D4C3A3]/[0.03] p-4 flex items-center justify-center border border-[#D4C3A3]/20">
                <img
                  src={product.images.primary}
                  alt={product.name}
                  className="w-full h-full object-contain group-hover:scale-105 transition-transform duration-300"
                />
                <button
                  onClick={() => toggleWishlist(product.id)}
                  className="absolute top-2 right-2 w-8 h-8 rounded-full bg-[#112319] border border-[#D4C3A3]/30 flex items-center justify-center text-[#F4ECE1] hover:text-[#E6D7C3] cursor-pointer shadow-md"
                  title="Remove from wishlist"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>

              <div className="space-y-1">
                <span className="text-[10px] uppercase font-mono text-[#E6D7C3] font-bold">{product.gsm} GSM</span>
                <Link
                  to={`/products/${product.id}`}
                  className="font-serif text-lg text-[#F4ECE1] hover:text-[#E6D7C3] transition-colors block line-clamp-1 font-normal"
                >
                  {product.name}
                </Link>
                <div className="font-mono text-sm font-bold text-[#E6D7C3]">
                  {formatPrice(product.priceINR)}
                </div>
              </div>

              {/* Move to bag CTA */}
              <button
                onClick={() => handleMoveToBag(product)}
                className="w-full py-3 bg-gradient-to-r from-[#E6D7C3] to-[#D4C3A3] hover:from-[#F4ECE1] hover:to-[#E6D7C3] text-black text-xs font-black uppercase tracking-wider shadow-[0_0_15px_rgba(212,195,163,0.4)] transition-all flex items-center justify-center gap-1.5 cursor-pointer font-mono"
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
