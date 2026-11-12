import React, { useState } from 'react';
import { X, Ruler, Truck, ShieldCheck, Check, Heart, ExternalLink } from 'lucide-react';
import { useShop } from '../context/ShopContext';

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
  const {
    selectedProduct,
    setSelectedProduct,
    formatPrice,
    addToCart,
    setIsSizeGuideOpen,
    isWishlisted,
    toggleWishlist,
  } = useShop();

  if (!selectedProduct) return null;

  const [selectedColor, setSelectedColor] = useState(selectedProduct.colors[0]?.name || 'Ash Grey');
  const [selectedSize, setSelectedSize] = useState<string>(selectedProduct.sizes[0] || 'M');
  const [isAdded, setIsAdded] = useState(false);

  const isSaved = isWishlisted(selectedProduct.id);

  // Dynamic image based on active color
  const activeImage = COLOR_IMAGE_MAP[selectedColor] || selectedProduct.images.primary;

  const handleAdd = () => {
    addToCart(selectedProduct, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 overflow-y-auto">
      {/* Dark frosted backdrop */}
      <div
        className="fixed inset-0 bg-[#2A1810]/70 backdrop-blur-md transition-opacity"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#2A1810] border border-[#4E3022] shadow-2xl overflow-hidden z-10 my-8 text-[#FAF6EE]">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(selectedProduct.id)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isSaved
                ? 'bg-[#7BB8E8] border-[#7BB8E8] text-[#2A1810]'
                : 'bg-[#362016] border-[#4E3022] text-[#FAF6EE] hover:text-[#7BB8E8] hover:border-[#7BB8E8]'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#2A1810]' : ''}`} />
          </button>

          <button
            onClick={() => setSelectedProduct(null)}
            className="w-9 h-9 rounded-full bg-[#362016] border border-[#4E3022] flex items-center justify-center text-[#FAF6EE] hover:text-[#7BB8E8] hover:border-[#7BB8E8] transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Real Mockup Image Gallery */}
          <div className="p-6 flex flex-col justify-between bg-[#362016]">
            <div className="aspect-[3/4] w-full overflow-hidden bg-[#EFE9DC] border border-[#4E3022] mb-4 flex items-center justify-center p-6 shadow-inner">
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
                    className={`aspect-square p-1 overflow-hidden border-2 transition-all flex items-center justify-center bg-[#EFE9DC] ${
                      selectedColor === c.name
                        ? 'border-[#7BB8E8] ring-2 ring-[#7BB8E8]/50'
                        : 'border-[#4E3022] opacity-75 hover:opacity-100 hover:border-[#7BB8E8]'
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
                <span className="bg-[#362016] border border-[#4E3022] text-[#7BB8E8] px-2 py-0.5 font-bold">
                  {selectedProduct.gsm} GSM
                </span>
                <span className="text-emerald-400 font-medium">
                  Vendor: Printrove &bull; 9,999 in Stock
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#FAF6EE] font-light leading-snug">
                {selectedProduct.name}
              </h2>

              <div className="text-3xl font-mono font-bold text-white tracking-wider mt-2">
                {formatPrice(selectedProduct.priceINR)}
              </div>

              {/* Color Select */}
              <div className="mt-6">
                <div className="flex justify-between text-xs tracking-wider uppercase text-[#EAE2D2]/80 mb-2 font-mono">
                  <span>Selected Colorway:</span>
                  <span className="text-[#7BB8E8] font-bold">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-xs transition-all cursor-pointer font-mono ${
                        selectedColor === c.name
                          ? 'border-[#7BB8E8] bg-[#7BB8E8] text-[#2A1810] font-bold'
                          : 'border-[#4E3022] text-[#FAF6EE] hover:border-[#7BB8E8] bg-[#362016]'
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
                <div className="flex justify-between items-center text-xs tracking-wider uppercase text-[#EAE2D2]/80 mb-2 font-mono">
                  <span>Select Size:</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-[#7BB8E8] hover:underline text-xs cursor-pointer lowercase font-bold"
                  >
                    <Ruler className="w-3.5 h-3.5" />
                    <span>View Printrove Chest Measurements</span>
                  </button>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {selectedProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => setSelectedSize(s)}
                      className={`py-2 text-xs font-mono font-bold border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-[#7BB8E8] bg-[#7BB8E8] text-[#2A1810] font-bold shadow'
                          : 'border-[#4E3022] text-[#FAF6EE] hover:bg-[#7BB8E8] hover:text-[#2A1810] hover:border-[#7BB8E8] bg-[#362016]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit Description */}
              <div className="mt-4 text-[11px] text-[#EAE2D2] font-light border-l-2 border-[#7BB8E8] pl-3 py-0.5">
                {selectedProduct.fitDescription} &bull; {selectedProduct.modelMeasurements}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-[#4E3022]">
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-4 uppercase tracking-widest text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-xl cursor-pointer font-mono ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-[#7BB8E8] to-[#5E9ED5] text-[#2A1810] hover:brightness-105'
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
                <a
                  href="https://0g1xp7-qd.myshopify.com/products/overshized-plain-t-shirt"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-4 border border-[#4E3022] text-[#FAF6EE] hover:text-[#7BB8E8] hover:border-[#7BB8E8] text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors bg-[#362016]"
                  title="Open Official Shopify Store Listing"
                >
                  <ExternalLink className="w-4 h-4 text-[#7BB8E8]" />
                  <span className="hidden sm:inline text-[11px]">Shopify</span>
                </a>
              </div>

              {/* Domestic Shipping badges */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#EAE2D2]/70 uppercase tracking-wider pt-1 font-mono">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-[#7BB8E8]" />
                  <span>Doorstep Delivery (Printrove)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#7BB8E8]" />
                  <span>UPI, Cards & COD Accepted</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
