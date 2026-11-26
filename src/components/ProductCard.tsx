import React, { useState, useEffect, useMemo } from 'react';
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

  // Pick a striking default colorway (prioritize bold Black or Ivory for editorial luxury)
  const initialColor = useMemo(() => {
    if (!product.colors || product.colors.length === 0) return 'Default';
    const preferredPriority = ['black', 'ivory', 'forest green', 'navy blue', 'ash grey'];
    for (const p of preferredPriority) {
      const match = product.colors.find((c) => c.name.toLowerCase() === p);
      if (match) return match.name;
    }
    return product.colors[0].name;
  }, [product.colors]);

  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);
  const [hasManuallySelected, setHasManuallySelected] = useState(false);
  const [isCardHovered, setIsCardHovered] = useState(false);
  const [isImageHovered, setIsImageHovered] = useState(false);
  const [showAllSwatches, setShowAllSwatches] = useState(false);
  const [showQuickSizes, setShowQuickSizes] = useState(false);
  const [addedSize, setAddedSize] = useState<string | null>(null);

  // Sync initial color if product changes
  useEffect(() => {
    setSelectedColor(initialColor);
  }, [initialColor]);

  // Preload all color variant mockups into browser memory for instant lag-free transitions
  useEffect(() => {
    if (product.variants && Array.isArray(product.variants)) {
      product.variants.forEach((v: any) => {
        if (v.mockupFront) {
          const img = new Image();
          img.src = v.mockupFront;
        }
        if (v.mockupBack) {
          const img = new Image();
          img.src = v.mockupBack;
        }
      });
    }
  }, [product.variants]);

  // Automatically cycle through colors to showcase the full collection when idle
  useEffect(() => {
    if (!product.colors || product.colors.length <= 1) return;
    if (hasManuallySelected || isCardHovered || hoveredColor || showQuickSizes) return;

    const interval = setInterval(() => {
      setSelectedColor((prev) => {
        const idx = product.colors.findIndex((c) => c.name === prev);
        const nextIdx = (idx + 1) % product.colors.length;
        return product.colors[nextIdx].name;
      });
    }, 3800);

    return () => clearInterval(interval);
  }, [product.colors, hasManuallySelected, isCardHovered, hoveredColor, showQuickSizes]);

  // Active color currently displayed (hovered swatch previews immediately, else selected)
  const activeColor = hoveredColor || selectedColor;

  const isSaved = isWishlisted(product.id);

  // Dynamic image resolution based on active color
  const variantForColor = product.variants?.find(
    (v: any) => v.color?.toLowerCase() === activeColor.toLowerCase() && (v.mockupFront || v.mockupBack)
  );
  const colorMockupFront = (variantForColor as any)?.mockupFront;
  const colorMockupBack = (variantForColor as any)?.mockupBack;

  const basePrimary =
    colorMockupFront ||
    (product.id.startsWith('printrove-')
      ? product.images.primary
      : COLOR_IMAGE_MAP[activeColor] || product.images.primary);

  const secondaryImage =
    colorMockupBack ||
    (product.images.secondary && product.images.secondary !== product.images.primary
      ? product.images.secondary
      : product.images.detail || basePrimary);

  const handleQuickAdd = (size: string, e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addToCart(product, size, activeColor);
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
  const stockLabel =
    product.stockCount && product.stockCount < 10
      ? `Only ${product.stockCount} Left`
      : product.inStock
      ? 'In Stock'
      : 'Back Soon';

  const visibleSwatches = showAllSwatches ? product.colors : product.colors.slice(0, 5);
  const remainingCount = product.colors.length - 5;

  return (
    <div
      className="group relative flex flex-col font-sans bg-[#FFFFFF] border border-[#DDD8CE]/60 hover:border-[#171717]/40 shadow-sm hover:shadow-md transition-all duration-300"
      onMouseEnter={() => setIsCardHovered(true)}
      onMouseLeave={() => {
        setIsCardHovered(false);
        setShowQuickSizes(false);
        setHoveredColor(null);
      }}
    >
      {/* 4:5 Product Surface Photography Box */}
      <div
        className="relative aspect-[4/5] w-full overflow-hidden bg-[#FFFFFF] flex items-center justify-center block cursor-pointer select-none group/media"
        onMouseEnter={() => setIsImageHovered(true)}
        onMouseLeave={() => setIsImageHovered(false)}
      >
        {/* Primary Click Link & Image Frame */}
        <Link
          to={`/products/${product.id}`}
          className="absolute inset-0 flex items-center justify-center p-2 sm:p-3 z-0"
          title={`View ${product.name} in ${activeColor}`}
        >
          {/* Front Mockup Image */}
          <img
            key={`front-${activeColor}`}
            src={basePrimary}
            alt={`${product.name} in ${activeColor}`}
            className={`h-full w-full object-contain object-center transition-all duration-500 scale-120 ${
              isImageHovered && secondaryImage ? 'opacity-0 scale-125' : 'opacity-100 scale-120'
            }`}
            loading="eager"
          />

          {/* Alternate View on Image Hover */}
          {secondaryImage && (
            <img
              key={`back-${activeColor}`}
              src={secondaryImage}
              alt={`${product.name} back view in ${activeColor}`}
              className={`absolute inset-0 h-full w-full object-contain object-center transition-all duration-500 p-2 sm:p-3 scale-120 ${
                isImageHovered ? 'opacity-100 scale-125' : 'opacity-0 scale-110 pointer-events-none'
              }`}
              loading="lazy"
            />
          )}
        </Link>

        {/* Top-Left Minimalist Badges: Category & Availability */}
        <div className="absolute top-3 left-3 flex flex-col gap-1 z-10 pointer-events-none">
          <span className="bg-[#FFFFFF]/95 text-[#171717] text-[10px] tracking-wider uppercase px-2 py-0.5 font-medium border border-[#DDD8CE] shadow-xs">
            {product.category}
          </span>
          <span className="bg-[#171717]/90 text-white text-[9px] tracking-widest uppercase px-2 py-0.5 font-medium shadow-xs">
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
          title={isSaved ? 'Remove from Wishlist' : 'Add to Wishlist'}
          aria-label={isSaved ? 'Saved' : 'Save'}
        >
          <Heart className={`w-3.5 h-3.5 transition-colors ${isSaved ? 'fill-current' : ''}`} />
        </button>

        {/* Quick Size Selector Slide-Up Overlay */}
        <div
          className={`absolute bottom-0 inset-x-0 p-3 bg-[#FFFFFF]/95 backdrop-blur-md border-t border-[#DDD8CE] transition-all duration-300 z-20 ${
            showQuickSizes ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
          }`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-[#706B64] mb-2 font-medium">
            <span>
              Select Size &bull; <strong className="text-[#171717]">{activeColor}</strong>
            </span>
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
              isCardHovered ? 'translate-y-0 opacity-100' : 'translate-y-full opacity-0 pointer-events-none'
            }`}
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                setShowQuickSizes(true);
              }}
              className="w-full py-2.5 bg-[#171717] text-white hover:bg-[#333333] font-medium text-[11px] uppercase tracking-widest flex items-center justify-center gap-1.5 cursor-pointer transition-colors shadow-sm"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Quick Add &bull; {formatPrice(product.priceINR)}</span>
            </button>
          </div>
        )}
      </div>

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

        <div className="pt-2.5 flex items-center justify-between gap-2">
          {/* Price */}
          <div className="flex items-baseline gap-1.5 shrink-0">
            <span className="text-sm font-semibold text-[#171717]">{formatPrice(product.priceINR)}</span>
            <span className="text-[10px] text-[#706B64]">Incl. VAT</span>
          </div>

          {/* Interactive Color Swatches with Live Instant Image Auto-Switch */}
          {product.colors && product.colors.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap justify-end">
              {visibleSwatches.map((color) => {
                const isActive = activeColor.toLowerCase() === color.name.toLowerCase();
                return (
                  <button
                    key={color.name}
                    onMouseEnter={() => setHoveredColor(color.name)}
                    onMouseLeave={() => setHoveredColor(null)}
                    onClick={(e) => {
                      e.preventDefault();
                      e.stopPropagation();
                      setSelectedColor(color.name);
                      setHoveredColor(null);
                      setHasManuallySelected(true);
                    }}
                    className={`w-3.5 h-3.5 rounded-full border transition-all cursor-pointer relative ${
                      isActive
                        ? 'border-[#171717] scale-125 ring-2 ring-[#171717] ring-offset-1 z-10'
                        : 'border-[#DDD8CE] hover:scale-115 hover:border-[#171717] opacity-85 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (hover to preview)`}
                    aria-label={color.name}
                  />
                );
              })}

              {remainingCount > 0 && !showAllSwatches && (
                <button
                  onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    setShowAllSwatches(true);
                  }}
                  className="text-[9px] text-[#706B64] hover:text-[#171717] font-medium ml-0.5 cursor-pointer underline"
                  title="View all colorways"
                >
                  +{remainingCount}
                </button>
              )}
            </div>
          )}
        </div>

        {/* Live Active Color Name Subtitle */}
        <div className="mt-1 flex items-center justify-between text-[10px] text-[#8C867D]">
          <span>
            Color:{' '}
            <strong className="text-[#171717] font-medium capitalize">{activeColor}</strong>
          </span>
          {hoveredColor && (
            <span className="text-[9px] text-[#B9AA96] uppercase tracking-wider">Previewing</span>
          )}
        </div>
      </div>
    </div>
  );
};
