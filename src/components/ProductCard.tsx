import React, { useState } from 'react';
import { Plus, Heart } from 'lucide-react';
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
  const { formatPrice, addToCart, isWishlisted, toggleWishlist } = useShop();
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
        className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-white/[0.04] to-[#162E21]/40 backdrop-blur-md border border-[#D4C3A3]/20 hover:border-[#E6D7C3] transition-all duration-300 flex items-center justify-center p-4 block cursor-pointer shadow-lg"
        title={`View ${product.name} (Right click to open in new tab)`}
      >
        {/* Dynamic Real Mockup */}
        <img
          src={displayedImage}
          alt={`${product.name} in ${selectedColor}`}
          className="h-full w-full object-contain object-center transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
        />

        {/* Top-Left Badges: GSM & Stock */}
        <div className="absolute top-3 left-3 flex flex-col gap-1.5 z-10 pointer-events-none">
          <span className="bg-[#0A160F]/90 border border-[#D4C3A3]/30 text-[#F4ECE1] text-[9px] uppercase tracking-wider px-2 py-0.5 font-mono font-bold shadow-md">
            {product.gsm} GSM
          </span>
          <span className="bg-[#E6D7C3] text-[#0A160F] text-[9px] uppercase tracking-wider px-2 py-0.5 font-mono font-extrabold shadow-[0_0_12px_rgba(212,195,163,0.35)]">
            In Stock &bull; Printrove
          </span>
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleToggleHeart}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shadow-md cursor-pointer ${
              isSaved
                ? 'bg-[#E6D7C3] border-[#E6D7C3] text-[#0A160F] shadow-[0_0_12px_rgba(212,195,163,0.4)]'
                : 'bg-[#112319]/80 border-[#D4C3A3]/25 text-[#F4ECE1] hover:text-[#E6D7C3] hover:border-[#E6D7C3]'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-[#0A160F]' : ''}`} />
          </button>
        </div>

        {/* Quick Size Selector Drawer */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-[#112319]/95 backdrop-blur-xl border-t border-[#D4C3A3]/25 transition-all duration-300 z-10 ${
            showQuickSizes
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] uppercase tracking-wider text-[#D4C3A3] mb-2 flex justify-between font-mono">
            <span>Size for {selectedColor}:</span>
            <span className="text-[#E6D7C3] font-bold">{formatPrice(product.priceINR)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => handleQuickAdd(size, e)}
                className="flex-1 min-w-[34px] py-1 text-[11px] font-mono border border-[#D4C3A3]/25 text-[#F4ECE1] hover:border-[#E6D7C3] hover:bg-[#E6D7C3] hover:text-[#0A160F] transition-colors uppercase cursor-pointer"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Add CTA Bar - Sand Beige Fill with Forest Green Text */}
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
              className="w-full py-2.5 bg-gradient-to-r from-[#E6D7C3] to-[#D4C3A3] hover:from-[#F4ECE1] hover:to-[#E6D7C3] text-[#0A160F] font-black text-[11px] uppercase tracking-wider shadow-[0_0_20px_rgba(212,195,163,0.35)] flex items-center justify-center gap-1.5 cursor-pointer font-mono transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Select Size & Add &bull; {formatPrice(product.priceINR)}</span>
            </button>
          </div>
        )}
      </Link>

      {/* Product Details with Link */}
      <div className="pt-3.5 pb-2 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-[#D4C3A3]">
          <Link
            to={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-[#E6D7C3] hover:underline uppercase tracking-wider text-[10px] font-mono font-bold"
          >
            {product.category}
          </Link>
          <span className="font-mono text-[#D4C3A3] text-[10px]">Color: {selectedColor}</span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="font-serif text-base text-[#F4ECE1] hover:text-[#E6D7C3] transition-colors line-clamp-1 block font-normal"
        >
          {product.name}
        </Link>

        {/* Color Swatch Thumbnails */}
        <div className="flex items-center gap-1.5 pt-1">
          {product.colors.map((color) => {
            const isSelected = selectedColor === color.name;
            return (
              <button
                key={color.name}
                onClick={(e) => {
                  e.preventDefault();
                  setSelectedColor(color.name);
                }}
                className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-[#E6D7C3] ring-2 ring-[#E6D7C3]/50 scale-110'
                    : 'border-white/20 hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            );
          })}
        </div>

        {/* Pricing in INR */}
        <div className="flex items-baseline space-x-2 pt-1 font-mono">
          <span className="text-sm font-bold text-[#F4ECE1]">
            {formatPrice(product.priceINR)}
          </span>
          <span className="text-[10px] text-[#2D6E49] font-bold">
            Tax Incl.
          </span>
        </div>
      </div>
    </div>
  );
};