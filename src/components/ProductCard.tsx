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
        className="relative aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-white/[0.05] to-[#2563EB]/[0.04] backdrop-blur-md border border-[#2563EB]/20 hover:border-[#3B82F6] transition-all duration-300 flex items-center justify-center p-4 block cursor-pointer shadow-lg"
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
          <span className="bg-[#060C1A]/90 border border-[#2563EB]/30 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-mono font-bold shadow-md">
            {product.gsm} GSM
          </span>
          <span className="bg-[#2563EB] text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-mono font-extrabold shadow-[0_0_12px_rgba(37,99,235,0.4)]">
            In Stock &bull; Printrove
          </span>
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleToggleHeart}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shadow-md cursor-pointer ${
              isSaved
                ? 'bg-[#2563EB] border-[#2563EB] text-white shadow-[0_0_12px_rgba(37,99,235,0.45)]'
                : 'bg-[#0D1B3A]/80 border-[#2563EB]/25 text-white hover:text-[#3B82F6] hover:border-[#3B82F6]'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Quick Size Selector Drawer */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-[#0D1B3A]/95 backdrop-blur-xl border-t border-[#2563EB]/25 transition-all duration-300 z-10 ${
            showQuickSizes
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] uppercase tracking-wider text-[#94A3B8] mb-2 flex justify-between font-mono">
            <span>Size for {selectedColor}:</span>
            <span className="text-[#3B82F6] font-bold">{formatPrice(product.priceINR)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => handleQuickAdd(size, e)}
                className="flex-1 min-w-[34px] py-1 text-[11px] font-mono border border-[#2563EB]/25 text-white hover:border-[#3B82F6] hover:bg-[#2563EB] hover:text-white transition-colors uppercase cursor-pointer"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Add CTA Bar - Royal Blue Gradient */}
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
              className="w-full py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-white font-black text-[11px] uppercase tracking-wider shadow-[0_0_20px_rgba(37,99,235,0.45)] flex items-center justify-center gap-1.5 cursor-pointer font-mono transition-all"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Select Size & Add &bull; {formatPrice(product.priceINR)}</span>
            </button>
          </div>
        )}
      </Link>

      {/* Product Details with Link */}
      <div className="pt-3.5 pb-2 space-y-1">
        <div className="flex items-center justify-between text-[11px] text-[#94A3B8]">
          <Link
            to={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
            className="text-[#3B82F6] hover:underline uppercase tracking-wider text-[10px] font-mono font-bold"
          >
            {product.category}
          </Link>
          <span className="font-mono text-[#94A3B8] text-[10px]">Color: {selectedColor}</span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="font-serif text-base text-white hover:text-[#3B82F6] transition-colors line-clamp-1 block font-normal"
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
                    ? 'border-[#3B82F6] ring-2 ring-[#3B82F6]/50 scale-110'
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
          <span className="text-sm font-bold text-white">
            {formatPrice(product.priceINR)}
          </span>
          <span className="text-[10px] text-[#38BDF8] font-bold">
            Tax Incl.
          </span>
        </div>
      </div>
    </div>
  );
};