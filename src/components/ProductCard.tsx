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
      className="group relative flex flex-col font-sans"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
    >
      {/* Product Image Box with clickable Link to dedicated product page */}
      <Link
        to={`/products/${product.id}`}
        className="relative aspect-[3/4] w-full overflow-hidden bg-[#0B1A30]/80 border border-[#1E3A66]/60 hover:border-[#F88379] transition-all duration-300 flex items-center justify-center p-4 block cursor-pointer shadow-lg hover:shadow-[0_10px_30px_rgba(248,131,121,0.25)]"
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
          <span className="bg-[#07111E]/90 text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold shadow-sm border border-[#1E3A66]">
            {product.gsm} GSM
          </span>
          <span className="bg-[#F88379] text-white text-[9px] uppercase tracking-wider px-2 py-0.5 font-bold shadow-sm">
            In Stock &bull; Printrove
          </span>
        </div>

        {/* Wishlist Button */}
        <div className="absolute top-3 right-3 z-10">
          <button
            onClick={handleToggleHeart}
            className={`w-8 h-8 rounded-full border flex items-center justify-center transition-all shadow-sm cursor-pointer ${
              isSaved
                ? 'bg-[#F88379] border-[#F88379] text-white shadow-[0_2px_10px_rgba(248,131,121,0.5)]'
                : 'bg-[#07111E]/80 border-[#1E3A66] text-white hover:text-[#F88379] hover:border-[#F88379]'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-white' : ''}`} />
          </button>
        </div>

        {/* Quick Size Selector Drawer */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-[#09172B]/95 backdrop-blur-xl border-t border-[#1E3A66] transition-all duration-300 z-10 shadow-lg ${
            showQuickSizes
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[10px] uppercase tracking-wider text-[#94A3B8] mb-2 flex justify-between font-bold">
            <span>Size for {selectedColor}:</span>
            <span className="text-[#F88379] font-bold">{formatPrice(product.priceINR)}</span>
          </div>
          <div className="flex flex-wrap gap-1.5">
            {product.sizes.map((size) => (
              <button
                key={size}
                onClick={(e) => handleQuickAdd(size, e)}
                className="flex-1 min-w-[34px] py-1 text-[11px] font-bold border border-[#1E3A66] text-white hover:border-[#F88379] hover:bg-[#F88379] hover:text-white transition-colors uppercase cursor-pointer"
              >
                {size}
              </button>
            ))}
          </div>
        </div>

        {/* Quick Add CTA Bar - Coral Pink Button */}
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
              className="w-full py-2.5 bg-[#F88379] hover:bg-[#FA958D] text-white font-bold text-[11px] uppercase tracking-wider shadow-[0_4px_16px_rgba(248,131,121,0.4)] flex items-center justify-center gap-1.5 cursor-pointer font-sans transition-all"
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
            className="text-[#F88379] hover:underline uppercase tracking-wider text-[10px] font-bold"
          >
            {product.category}
          </Link>
          <span className="text-[#94A3B8] text-[10px]">Color: {selectedColor}</span>
        </div>

        <Link
          to={`/products/${product.id}`}
          className="text-base text-white hover:text-[#F88379] transition-colors line-clamp-1 block font-bold"
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
                    ? 'border-[#F88379] ring-2 ring-[#F88379]/50 scale-110'
                    : 'border-white/20 hover:scale-105 opacity-80 hover:opacity-100'
                }`}
                style={{ backgroundColor: color.hex }}
                title={color.name}
              />
            );
          })}
        </div>

        {/* Pricing in INR */}
        <div className="flex items-baseline space-x-2 pt-1 font-sans">
          <span className="text-sm font-bold text-white">
            {formatPrice(product.priceINR)}
          </span>
          <span className="text-[10px] text-[#94A3B8] font-medium">
            Tax Incl.
          </span>
        </div>
      </div>
    </div>
  );
};
