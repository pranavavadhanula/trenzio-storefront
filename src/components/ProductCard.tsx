import React, { useState } from 'react';
import { Plus, Heart, Check } from 'lucide-react';
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
  const [selectedColor, setSelectedColor] = useState(product.colors[0]?.name || 'Default');
  const [isHovered, setIsHovered] = useState(false);
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  const isSaved = isWishlisted(product.id);

  // Dynamic image based on selected color or fallback
  const basePrimary = COLOR_IMAGE_MAP[selectedColor] || product.images.primary;
  const secondaryImage = product.images.secondary && product.images.secondary !== product.images.primary
    ? product.images.secondary
    : product.images.detail || basePrimary;

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, selectedColor);
    setAddedSize(size);
    setTimeout(() => {
      setAddedSize(null);
      setShowQuickSizes(false);
    }, 900);
  };

  const handleToggleHeart = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleWishlist(product.id);
  };

  // Stock status text
  const stockLabel = product.stockCount && product.stockCount < 10
    ? `Only ${product.stockCount} Left`
    : product.inStock
    ? 'In Stock'
    : 'Back Soon';

  return (
    <div
      className="group relative flex flex-col font-sans bg-[#FFFFFF] border border-[#DDD8CE]/60 hover:border-[#171717]/30 transition-all duration-300"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => {
        setIsHovered(false);
        setShowQuickSizes(false);
      }}
    >
      {/* 4:5 Product Surface Photography Box */}
      <Link
        to={`/products/${product.id}`}
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#FFFFFF] flex items-center justify-center p-3 sm:p-5 block cursor-pointer"
        title={`View ${product.name}`}
      >
        {/* Primary Image */}
        <img
          src={basePrimary}
          alt={`${product.name} in ${selectedColor}`}
          className={`absolute inset-0 h-full w-full object-contain object-center transition-all duration-700 p-4 ${
            isHovered && secondaryImage ? 'opacity-0 scale-102' : 'opacity-100 scale-100'
          }`}
          loading="lazy"
        />

        {/* Hover Secondary Transition Image */}
        {secondaryImage && (
          <img
            src={secondaryImage}
            alt={`${product.name} alternate view`}
            className={`absolute inset-0 h-full w-full object-contain object-center transition-all duration-700 p-4 ${
              isHovered ? 'opacity-100 scale-105' : 'opacity-0 scale-100 pointer-events-none'
            }`}
            loading="lazy"
          />
        )}

        {/* Top-Left Minimalist Badges: Category & Availability */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          <span className="bg-[#F4F1EA]/95 text-[#171717] text-[10px] tracking-wider uppercase px-2 py-0.5 font-medium border border-[#DDD8CE]">
            {product.category}
          </span>
          <span className="bg-[#FFFFFF]/90 text-[#706B64] text-[9px] tracking-widest uppercase px-2 py-0.5 font-medium border border-[#DDD8CE]/80">
            {stockLabel}
          </span>
        </div>

        {/* Top-Right Wishlist Button */}
        <button
          onClick={handleToggleHeart}
          className={`absolute top-3 right-3 z-10 w-8 h-8 rounded-full flex items-center justify-center transition-all duration-200 cursor-pointer ${
            isSaved
              ? 'bg-[#171717] text-white shadow-sm'
              : 'bg-[#FFFFFF]/90 text-[#171717] hover:bg-[#171717] hover:text-white border border-[#DDD8CE]'
          }`}
          title={isSaved ? "Remove from Wishlist" : "Add to Wishlist"}
          aria-label={isSaved ? "Saved" : "Save"}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Size Selector Slide-Up Overlay */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#DDD8CE] transition-all duration-300 z-20 ${
            showQuickSizes
              ? 'translate-y-0 opacity-100'
              : 'translate-y-full opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#706B64] mb-2 font-medium">
            <span>Select Size ({selectedColor})</span>
            <span className="font-semibold text-[#171717]">{formatPrice(product.priceINR)}</span>
          </div>
          <div className="flex flex-wrap gap-1">
            {product.sizes.map((size) => {
              const justAdded = addedSize === size;
              return (
                <button
                  key={size}
                  onClick={(e) => handleQuickAdd(size, e)}
                  disabled={justAdded}
                  className={`flex-1 min-w-[32px] py-1.5 text-[11px] font-medium tracking-wide uppercase transition-colors cursor-pointer border ${
                    justAdded
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'border-[#DDD8CE] text-[#171717] hover:bg-[#171717] hover:text-white hover:border-[#171717]'
                  }`}
                >
                  {justAdded ? <Check className="w-3 h-3 mx-auto" /> : size}
                </button>
              );
            })}
          </div>
        </div>

        {/* Quick Add To Bag Hover Bar */}
        {!showQuickSizes && (
          <div
            className={`absolute bottom-0 inset-x-0 transition-all duration-300 z-10 ${
              isHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickSizes(true);
              }}
              className="w-full py-2.5 bg-[#171717] text-white hover:bg-[#333333] font-medium text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-colors"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add &bull; {formatPrice(product.priceINR)}</span>
            </button>
          </div>
        )}
      </Link>

      {/* Refined Product Information Section */}
      <div className="p-3.5 sm:p-4 bg-[#FFFFFF] border-t border-[#DDD8CE]/40 flex flex-col justify-between flex-1">
        <div>
          {/* Category & Availability */}
          <div className="flex items-center justify-between text-[10px] tracking-widest uppercase text-[#706B64] mb-1">
            <span>{product.category}</span>
            <span className="text-[#B9AA96] font-medium">{product.gender}</span>
          </div>

          {/* Product Name */}
          <Link
            to={`/products/${product.id}`}
            className="text-sm font-medium text-[#171717] hover:text-[#B9AA96] transition-colors line-clamp-1 block tracking-tight"
          >
            {product.name}
          </Link>
        </div>

        <div className="pt-2.5 flex items-center justify-between">
          {/* Price */}
          <div className="flex items-baseline gap-1.5">
            <span className="text-sm font-semibold text-[#171717]">
              {formatPrice(product.priceINR)}
            </span>
            <span className="text-[10px] text-[#706B64]">
              Incl. VAT
            </span>
          </div>

          {/* Colour Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1">
              {product.colors.slice(0, 4).map((color) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={(e) => {
                      e.preventDefault();
                      setSelectedColor(color.name);
                    }}
                    className={`w-3 h-3 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#171717] scale-125 ring-1 ring-[#171717]'
                        : 'border-[#DDD8CE] hover:scale-110'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                    aria-label={color.name}
                  />
                );
              })}
              {product.colors.length > 4 && (
                <span className="text-[9px] text-[#706B64] font-medium ml-0.5">
                  +{product.colors.length - 4}
                </span>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
