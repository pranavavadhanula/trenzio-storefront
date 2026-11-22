import React, { useState } from 'react';
import { Product } from '../../types';
import { useShop } from '../../context/ShopContext';
import { ShoppingBag, Eye, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

interface TrevoriProductCardProps {
  product: Product;
  compact?: boolean;
  onViewProduct?: (product: Product) => void;
}

export const TrevoriProductCard: React.FC<TrevoriProductCardProps> = ({
  product,
  compact = false,
  onViewProduct,
}) => {
  const { addToCart, setIsCartOpen, formatPrice } = useShop();

  const [selectedSize, setSelectedSize] = useState<string>(product.sizes[0] || 'M');
  const [selectedColor, setSelectedColor] = useState<string>(
    product.colors[0]?.name || 'Black'
  );
  const [isAdded, setIsAdded] = useState(false);

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();

    addToCart(product, selectedSize, selectedColor, 1);
    setIsAdded(true);

    setTimeout(() => {
      setIsAdded(false);
      setIsCartOpen(true);
    }, 600);
  };

  const isLowStock = product.stockCount !== undefined && product.stockCount <= 10;

  return (
    <div
      className={`group relative bg-white border border-slate-200/90 rounded-2xl overflow-hidden transition-all duration-300 hover:shadow-[0_12px_30px_rgba(37,99,235,0.12)] hover:border-[#2563EB]/40 flex flex-col ${
        compact ? 'w-56 shrink-0' : 'w-full'
      }`}
    >
      {/* Product Image & Badges */}
      <div className="relative aspect-[4/5] bg-slate-100 overflow-hidden">
        <img
          src={product.images.primary}
          alt={product.name}
          className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-105"
          loading="lazy"
          onError={(e) => {
            // Graceful fallback to secondary or fallback image
            const target = e.target as HTMLImageElement;
            if (target.src !== product.images.secondary && product.images.secondary) {
              target.src = product.images.secondary;
            }
          }}
        />

        {/* Top Badges */}
        <div className="absolute top-2.5 left-2.5 flex flex-col gap-1 z-10">
          {product.gsm && (
            <span className="px-2 py-0.5 rounded-full bg-[#0A172D]/90 backdrop-blur-md text-[10px] font-mono font-bold tracking-wider text-white shadow-sm">
              {product.category}
            </span>
          )}
          {product.isBestSeller && (
            <span className="px-2 py-0.5 rounded-full bg-[#2563EB] text-[9px] font-sans font-extrabold uppercase tracking-wider text-white shadow-sm flex items-center gap-1">
              <Sparkles className="w-2.5 h-2.5" /> Bestseller
            </span>
          )}
        </div>

        {/* Stock Status Pill */}
        <div className="absolute top-2.5 right-2.5 z-10">
          {product.inStock === false ? (
            <span className="px-2 py-0.5 rounded-full bg-rose-600 text-white text-[9px] font-bold uppercase tracking-wider">
              Out of Stock
            </span>
          ) : isLowStock ? (
            <span className="px-2 py-0.5 rounded-full bg-amber-500 text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
              Only {product.stockCount} Left
            </span>
          ) : (
            <span className="px-2 py-0.5 rounded-full bg-emerald-600/90 backdrop-blur-sm text-white text-[9px] font-bold uppercase tracking-wider shadow-sm">
              In Stock
            </span>
          )}
        </div>

        {/* Quick View Button Hover Overlay */}
        <div className="absolute inset-0 bg-slate-900/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-3">
          <Link
            to={`/products/${product.id}`}
            onClick={() => onViewProduct?.(product)}
            className="px-3.5 py-2 bg-white/95 backdrop-blur-md text-[#0A172D] rounded-xl text-xs font-bold tracking-wide shadow-lg hover:bg-white hover:text-[#2563EB] transition-colors flex items-center gap-1.5 cursor-pointer transform translate-y-2 group-hover:translate-y-0 transition-transform duration-300"
          >
            <Eye className="w-3.5 h-3.5 text-[#2563EB]" />
            <span>View Product</span>
          </Link>
        </div>
      </div>

      {/* Product Details Section */}
      <div className="p-3.5 flex flex-col flex-1 justify-between bg-white">
        <div>
          {/* Category & Gender */}
          <div className="flex items-center justify-between text-[10px] uppercase tracking-wider text-slate-400 font-mono font-medium mb-1">
            <span>{product.category}</span>
            <span>{product.gender}</span>
          </div>

          {/* Product Name */}
          <Link
            to={`/products/${product.id}`}
            onClick={() => onViewProduct?.(product)}
            className="block text-[13px] font-sans font-bold text-[#0A172D] hover:text-[#2563EB] transition-colors line-clamp-1 leading-snug"
            title={product.name}
          >
            {product.name}
          </Link>

          {/* Price */}
          <div className="mt-1 flex items-baseline gap-2">
            <span className="text-base font-extrabold text-[#0A172D] font-sans tracking-tight">
              {formatPrice(product.priceINR)}
            </span>
            <span className="text-[10px] text-slate-400 uppercase tracking-wider font-sans">
              Taxes Included
            </span>
          </div>

          {/* Color Swatches */}
          {product.colors && product.colors.length > 0 && (
            <div className="mt-2.5">
              <div className="flex items-center gap-1.5 overflow-x-auto py-0.5">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedColor(c.name);
                    }}
                    title={`${c.name} (${selectedColor === c.name ? 'Selected' : 'Click to select'})`}
                    className={`w-4 h-4 rounded-full border transition-all cursor-pointer shrink-0 ${
                      selectedColor === c.name
                        ? 'ring-2 ring-[#2563EB] ring-offset-1 scale-110'
                        : 'border-slate-300 hover:scale-105'
                    }`}
                    style={{ backgroundColor: c.hex }}
                  />
                ))}
                <span className="text-[10px] text-slate-500 ml-1 font-mono">
                  {selectedColor}
                </span>
              </div>
            </div>
          )}

          {/* Size Selector Pills */}
          {product.sizes && product.sizes.length > 0 && (
            <div className="mt-2.5 flex items-center gap-1 overflow-x-auto py-0.5">
              {product.sizes.slice(0, 5).map((s) => (
                <button
                  key={s}
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation();
                    setSelectedSize(s);
                  }}
                  className={`px-2 py-0.5 text-[10px] font-mono font-semibold rounded-md transition-all cursor-pointer ${
                    selectedSize === s
                      ? 'bg-[#0A172D] text-white shadow-sm'
                      : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                  }`}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="mt-3.5 pt-2.5 border-t border-slate-100 flex items-center gap-2">
          <button
            type="button"
            onClick={handleAddToCart}
            disabled={product.inStock === false}
            className={`flex-1 py-2 px-3 rounded-xl text-xs font-bold tracking-wide transition-all flex items-center justify-center gap-1.5 cursor-pointer shadow-sm ${
              product.inStock === false
                ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                : isAdded
                ? 'bg-emerald-600 text-white'
                : 'bg-[#2563EB] hover:bg-[#1D4ED8] text-white hover:shadow-[0_4px_14px_rgba(37,99,235,0.35)] active:scale-[0.98]'
            }`}
          >
            {isAdded ? (
              <>
                <Check className="w-3.5 h-3.5" />
                <span>Added!</span>
              </>
            ) : (
              <>
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Add to Bag</span>
              </>
            )}
          </button>

          <Link
            to={`/products/${product.id}`}
            onClick={() => onViewProduct?.(product)}
            className="p-2 rounded-xl border border-slate-200 text-slate-600 hover:text-[#2563EB] hover:border-[#2563EB] transition-colors"
            title="View Details"
          >
            <Eye className="w-3.5 h-3.5" />
          </Link>
        </div>
      </div>
    </div>
  );
};
