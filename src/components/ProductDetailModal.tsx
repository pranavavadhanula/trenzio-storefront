import React, { useState } from 'react';
import { X, Check, Truck, ShieldCheck, Ruler, ExternalLink, Heart } from 'lucide-react';
import { useShop } from '../context/ShopContext';
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

  if (!selectedProduct) return null;

  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0]?.name || 'Ash Grey');
  const [selectedSize, setSelectedSize] = useState(selectedProduct.sizes[1] || 'M');
  const [isAdded, setIsAdded] = useState(false);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const isSaved = isWishlisted(selectedProduct.id);
  const activeImage = COLOR_IMAGE_MAP[selectedColor] || selectedProduct.images.primary;

  const handleAdd = () => {
    addToCart(selectedProduct, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => {
      setIsAdded(false);
      setSelectedProduct(null);
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark frosted backdrop */}
      <div
        className="fixed inset-0 bg-[#060C1A]/85 backdrop-blur-xl transition-opacity"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#0D1B3A] border border-white/15 shadow-2xl overflow-hidden z-10 my-8 text-[#FFFFFF]">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(selectedProduct.id)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-all cursor-pointer ${
              isSaved
                ? 'bg-[#2563EB] border-[#2563EB] text-black shadow-[0_0_12px_rgba(212,255,0,0.4)]'
                : 'bg-white/[0.05] border-white/15 text-[#FFFFFF] hover:text-[#2563EB] hover:border-[#2563EB]'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-black' : ''}`} />
          </button>

          <button
            onClick={() => setSelectedProduct(null)}
            className="w-9 h-9 rounded-full bg-white/[0.05] border border-white/15 flex items-center justify-center text-[#FFFFFF] hover:text-[#2563EB] hover:border-[#2563EB] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Real Mockup Image Gallery */}
          <div className="p-6 flex flex-col justify-between bg-black/40">
            <div className="aspect-[3/4] w-full overflow-hidden bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/12 mb-4 flex items-center justify-center p-6 shadow-inner">
              <img
                src={activeImage}
                alt={`${selectedProduct.name} in ${selectedColor}`}
                className="w-full h-full object-contain object-center transition-all duration-300"
              />
            </div>

            {/* Color Swatch Thumbnails */}
            <div className="grid grid-cols-7 gap-1.5">
              {selectedProduct.colors.map((c) => {
                const img = COLOR_IMAGE_MAP[c.name];
                return (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`aspect-square p-1 overflow-hidden border transition-all flex items-center justify-center bg-white/[0.04] ${
                      selectedColor === c.name
                        ? 'border-[#2563EB] ring-2 ring-[#2563EB]/50'
                        : 'border-white/15 opacity-75 hover:opacity-100 hover:border-[#2563EB]'
                    }`}
                    title={c.name}
                  >
                    {img ? (
                      <img src={img} alt={c.name} className="w-full h-full object-contain" />
                    ) : (
                      <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }} />
                    )}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right: Info & Sizes */}
          <div className="p-6 sm:p-8 flex flex-col justify-between space-y-6">
            <div>
              <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider mb-2 font-mono">
                <span className="bg-[#10224A] border border-white/15 text-[#FFFFFF] px-2 py-0.5 font-bold">
                  {selectedProduct.gsm} GSM
                </span>
                <span className="text-[#F88379] font-medium">
                  Trevori Atelier &bull; In Stock
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#FFFFFF] font-light leading-snug">
                {selectedProduct.name}
              </h2>

              <div className="text-3xl font-mono font-bold text-[#F88379] tracking-wider mt-2">
                {formatPrice(selectedProduct.priceINR)}
              </div>

              {/* Color Select */}
              <div className="mt-6">
                <div className="flex justify-between text-xs tracking-wider uppercase text-[#94A3B8] mb-2 font-mono">
                  <span>Selected Colorway:</span>
                  <span className="text-[#F88379] font-bold">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-xs transition-all cursor-pointer font-mono ${
                        selectedColor === c.name
                          ? 'border-[#F88379] bg-[#F88379] text-white font-extrabold shadow-[0_0_10px_rgba(248,131,121,0.3)]'
                          : 'border-white/15 text-[#FFFFFF] hover:border-[#F88379] bg-white/[0.04]'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/20" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Select */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase text-[#94A3B8] mb-2 font-mono">
                  <span>Select Size:</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-[#F88379] hover:underline text-xs cursor-pointer lowercase font-bold"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>View Chest Measurements</span>
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {selectedProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs font-mono font-bold border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-[#F88379] bg-[#F88379] text-white font-extrabold shadow-[0_0_10px_rgba(248,131,121,0.3)]'
                          : 'border-white/15 text-[#FFFFFF] hover:bg-[#F88379] hover:text-white hover:border-[#F88379] bg-white/[0.04]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit Description */}
              <div className="mt-4 text-[11px] text-[#94A3B8] font-light border-l-2 border-[#F88379] pl-3 py-0.5">
                {selectedProduct.fitDescription} &bull; {selectedProduct.modelMeasurements}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-white/10">
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className={`w-full py-4 uppercase tracking-widest text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 shadow-xl cursor-pointer font-mono ${
                    isAdded
                      ? 'bg-emerald-500 text-black'
                      : 'bg-[#F88379] hover:bg-[#FA958D] text-white shadow-[0_4px_20px_rgba(248,131,121,0.45)]'
                  }`}
                >
                  {isAdded ? (
                    <>
                      <Check className="w-4 h-4" />
                      <span>Added to Bag</span>
                    </>
                  ) : (
                    <span>Add to Bag &bull; {formatPrice(selectedProduct.priceINR)}</span>
                  )}
                </button>
              </div>

              {/* Domestic Shipping badges */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#94A3B8] uppercase tracking-wider pt-1 font-mono">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#F88379]" />
                  <span>Doorstep Delivery (Express)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#F88379]" />
                  <span>UPI, Cards & COD Accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {isSizeGuideOpen && (
        <SizingModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
      )}
    </div>
  );
};
