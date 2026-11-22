import React, { useState } from 'react';
import { useShop } from '../context/ShopContext';
import { X, Heart, Check, Ruler, Truck, ShieldCheck, ArrowRight } from 'lucide-react';
import { SizingModal } from './SizingModal';

const COLOR_IMAGE_MAP: Record<string, string> = {
  'Ash Grey': '/images/products/ash-grey.png',
  'Beige': '/images/products/beige.png',
  'Black': '/images/products/black.png',
  'Olive Green': '/images/products/green.png',
  'Navy Blue': '/images/products/navy.png',
  'Crimson Red': '/images/products/red.png',
  'Maroon': '/images/products/maroon.png',
};

export const ProductDetailModal: React.FC = () => {
  const { selectedProduct, setSelectedProduct, addToCart, formatPrice, isWishlisted, toggleWishlist } = useShop();

  const [selectedColor, setSelectedColor] = useState<string>('Black');
  const [selectedSize, setSelectedSize] = useState<string>('M');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);

  if (!selectedProduct) return null;

  const isSaved = isWishlisted(selectedProduct.id);
  const activeImage = COLOR_IMAGE_MAP[selectedColor] || selectedProduct.images.primary;

  const handleAdd = () => {
    addToCart(selectedProduct, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setSelectedProduct(null);
    }, 1500);
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto font-sans">
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm"
        onClick={() => setSelectedProduct(null)}
      />

      <div className="flex min-h-screen items-center justify-center p-4">
        <div className="relative w-full max-w-4xl bg-[#FFFFFF] border border-[#DDD8CE] shadow-2xl z-10 grid grid-cols-1 md:grid-cols-2 text-[#171717]">
          {/* Close button */}
          <button
            onClick={() => setSelectedProduct(null)}
            className="absolute top-4 right-4 z-20 w-8 h-8 rounded-full border border-[#DDD8CE] flex items-center justify-center text-[#171717] hover:bg-[#171717] hover:text-white cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Left: Product Image Box */}
          <div className="relative aspect-[4/5] bg-[#FFFFFF] border-r border-[#DDD8CE] p-8 flex items-center justify-center">
            <img
              src={activeImage}
              alt={selectedProduct.name}
              className="max-h-full max-w-full object-contain"
            />
            <button
              onClick={() => toggleWishlist(selectedProduct.id)}
              className={`absolute top-4 left-4 z-10 w-8 h-8 rounded-full border flex items-center justify-center transition-colors ${
                isSaved
                  ? 'bg-[#171717] text-white border-[#171717]'
                  : 'bg-white text-[#171717] border-[#DDD8CE] hover:bg-[#171717] hover:text-white'
              }`}
            >
              <Heart className={`w-3.5 h-3.5 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Right: Details */}
          <div className="p-8 flex flex-col justify-between space-y-6">
            <div>
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B9AA96] font-semibold">
                {selectedProduct.category} &bull; {selectedProduct.gender}
              </span>
              <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#171717] mt-1">
                {selectedProduct.name}
              </h2>

              <div className="text-xl font-serif font-semibold text-[#171717] mt-3">
                {formatPrice(selectedProduct.priceINR)}
              </div>

              {/* Color choices */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs text-[#706B64]">
                  <span>Colorway:</span>
                  <span className="font-semibold text-[#171717]">{selectedColor}</span>
                </div>
                <div className="flex items-center gap-2">
                  {selectedProduct.colors.map((color) => (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                        selectedColor === color.name
                          ? 'border-[#171717] ring-2 ring-[#171717] scale-110'
                          : 'border-[#DDD8CE] hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  ))}
                </div>
              </div>

              {/* Size choices */}
              <div className="mt-6 space-y-2">
                <div className="flex justify-between text-xs text-[#706B64]">
                  <span>Select Size:</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-[#171717] hover:underline"
                  >
                    <Ruler className="w-3 h-3" />
                    <span>Guide</span>
                  </button>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.sizes.map((size) => (
                    <button
                      key={size}
                      onClick={() => setSelectedSize(size)}
                      className={`px-3 py-1.5 text-xs uppercase font-medium border transition-colors cursor-pointer ${
                        selectedSize === size
                          ? 'bg-[#171717] text-white border-[#171717]'
                          : 'bg-[#FFFFFF] text-[#171717] border-[#DDD8CE] hover:border-[#171717]'
                      }`}
                    >
                      {size}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-3 pt-4 border-t border-[#DDD8CE]">
              <button
                onClick={handleAdd}
                className="w-full py-3.5 bg-[#171717] text-white hover:bg-[#333333] transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 cursor-pointer"
              >
                {isAdded ? (
                  <>
                    <Check className="w-4 h-4" />
                    <span>Added to Bag</span>
                  </>
                ) : (
                  <>
                    <span>Add to Shopping Bag</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      <SizingModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
