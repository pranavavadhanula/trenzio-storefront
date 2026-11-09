import React, { useState } from 'react';
import { Plus, Heart, ExternalLink } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Product } from '../types';
import { useShop } from '../context/ShopContext';

interface ProductCardProps {
  product: Product;
}

const COLOR_IMAGE_MAP: Record<string, string> = {
  'Ash Grey': '/images/products/ash-grey.png',
  'Beige': '/images/products/beige.png',
  'Black': '/images/products/black.png',
  'Olive Green': '/images/products/green.png',
  'Navy Blue': '/images/products/navy.png',
  'Crimson Red': '/images/products/red.png',
  'Maroon': '/images/products/maroon.png',
};

export const ProductCard: React.FC<ProductCardProps> = ({ product }) => {
  const { formatPrice, addToCart, setSelectedProduct, isWishlisted, toggleWishlist } = useShop();
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Ash Grey');
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickSizes, setShowQuickSizes] = useState(false);

  const isSaved = isWishlisted(product.id);

  // Dynamic image based on selected color
  const displayedImage = COLOR_IMAGE_MAP[selectedColor] || product.images.primary;

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, selectedColor);
    setShowQuickSizes(false);
  };

  const handleToggleHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  return (
    <div
      className="group relative flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
    >
      {/* Product Image Box with clickable Link to dedicated product page */}
      <Link
        to={`/products/${product.id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-atelier-900 border border-white/5 flex items-center justify-center p-4 block cursor-pointer"
        title={`View ${product.name} (Right click to open in new tab)`}
      >
        {/* Dynamic Real Mockup */}
        <img
          src={displayedImage}
          alt={`${product.name} in ${selectedColor}`}
          className="h-full w-full object-contain object-center transition-transform duration-300 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top-Left Badges: GSM & Stock */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <span className="bg-atelier-950/90 backdrop-blur-md border border-white/10 text-atelier-gold text-[9px] uppercase tracking-wider px-2 py-0.5 font-mono font-bold">
            {product.gsm} GSM
          </span>
          <span className="bg-emerald-950/80 border border-emerald-500/30 text-emerald-400 text-[9px] uppercase tracking-wider px-2 py-0.5 font-mono">
            In Stock &bull; Printrove
          </span>
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleToggleHeart}
            className={`w-8 h-8 rounded-full backdrop-blur-md border flex items-center justify-center transition-colors shadow-lg cursor-pointer ${
              isSaved
                ? 'bg-rose-950/80 border-rose-500/50 text-rose-400'
                : 'bg-atelier-950/80 border-white/20 text-atelier-200 hover:text-white hover:border-atelier-gold'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-rose-400' : ''}`} />
          </button>
        </div>

        {/* Quick Size Selector Drawer */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-atelier-950/95 backdrop-blur-md border-t border-white/10 transition-all duration-300 z-10 ${
            showQuickSizes
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] uppercase tracking-wider text-neutral-400 mb-2 flex justify-between font-mono">
            <span>Size for {selectedColor}:</span>
            <span className="text-atelier-gold font-bold">{formatPrice(product.priceINR)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => handleQuickAdd(size, e)}
                className="flex-1 min-w-[34px] py-1 text-[11px] font-mono border border-white/20 text-atelier-100 hover:border-atelier-gold hover:bg-atelier-gold hover:text-atelier-950 transition-colors uppercase cursor-pointer"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Add CTA Bar - Pure Gold, No Stark White */}
        {!showQuickSizes && (
          <div
            className={`absolute bottom-0 inset-x-0 transition-all duration-300 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickSizes(true);
              }}
              className="w-full py-2.5 bg-gradient-to-r from-atelier-gold to-[#b39369] text-atelier-950 font-bold text-[11px] uppercase tracking-wider hover:brightness-110 shadow-lg shadow-black/40 flex items-center justify-center gap-1.5 cursor-pointer font-mono transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Select Size & Add &bull; {formatPrice(product.priceINR)}</span>
            </button>
          </div>
        )}
      </Link>

      {/* Product Details with Link */}
      <div className="pt-3.5 pb-2 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-neutral-400">
          <Link
            to={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-atelier-gold hover:underline uppercase tracking-wider text-[10px] font-mono font-medium"
          >
            {product.category}
          </Link>
          <span className="font-mono text-emerald-400 text-[10px]">Color: {selectedColor}</span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="font-serif text-base text-atelier-100 hover:text-atelier-gold transition-colors line-clamp-1 block"
        >
          {product.name}
        </Link>

        <div className="flex items-center justify-between pt-1">
          <div className="font-mono text-base font-bold text-atelier-100 tracking-wider">
            {formatPrice(product.priceINR)}
          </div>

          {/* Color swatches */}
          <div className="flex items-center space-x-1.5" onClick={(e) => e.stopPropagation()}>
            {product.colors.map((c) => (
              <button
                key={c.name}
                onClick={(e) => {
                  e.preventDefault();
                  e.stopPropagation();
                  setSelectedColor(c.name);
                }}
                style={{ backgroundColor: c.hex }}
                className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                  selectedColor === c.name
                    ? 'border-atelier-gold scale-125 ring-2 ring-atelier-gold/40'
                    : 'border-white/20 hover:scale-110'
                }`}
                title={`Switch to ${c.name}`}
              />
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
