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
        className="fixed inset-0 bg-[#0B1B3D]/70 backdrop-blur-md transition-opacity"
        onClick={() => setSelectedProduct(null)}
      />

      {/* Modal Dialog */}
      <div className="relative w-full max-w-4xl bg-[#F8F5EE] border border-[#0B1B3D]/15 shadow-2xl overflow-hidden z-10 my-8 text-[#0B1B3D]">
        {/* Controls */}
        <div className="absolute top-4 right-4 z-20 flex items-center gap-2">
          <button
            onClick={() => toggleWishlist(selectedProduct.id)}
            className={`w-9 h-9 rounded-full border flex items-center justify-center transition-colors cursor-pointer ${
              isSaved
                ? 'bg-rose-50 border-rose-400 text-rose-500'
                : 'bg-white border-[#0B1B3D]/15 text-[#0B1B3D] hover:text-rose-500 hover:border-rose-400'
            }`}
            title="Wishlist"
          >
            <Heart className={`w-4 h-4 ${isSaved ? 'fill-rose-500' : ''}`} />
          </button>

          <button
            onClick={() => setSelectedProduct(null)}
            className="w-9 h-9 rounded-full bg-white border border-[#0B1B3D]/15 flex items-center justify-center text-[#0B1B3D] hover:text-atelier-coral hover:border-atelier-coral transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 max-h-[85vh] overflow-y-auto">
          {/* Left: Real Mockup Image Gallery */}
          <div className="p-6 flex flex-col justify-between bg-white">
            <div className="aspect-[3/4] w-full overflow-hidden bg-[#F8F5EE] border border-[#0B1B3D]/10 mb-4 flex items-center justify-center p-6">
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
                    className={`aspect-square p-1 overflow-hidden border transition-all flex items-center justify-center bg-white ${
                      selectedColor === c.name
                        ? 'border-atelier-coral ring-2 ring-atelier-coral/40'
                        : 'border-[#0B1B3D]/15 opacity-70 hover:opacity-100'
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
                <span className="bg-[#0B1B3D] text-[#F8F5EE] px-2 py-0.5 font-bold">
                  {selectedProduct.gsm} GSM
                </span>
                <span className="text-emerald-700 font-medium">
                  Vendor: Printrove &bull; 9,999 in Stock
                </span>
              </div>

              <h2 className="font-serif text-2xl sm:text-3xl text-[#0B1B3D] font-light leading-snug">
                {selectedProduct.name}
              </h2>

              <div className="text-3xl font-mono font-bold text-[#0B1B3D] tracking-wider mt-2">
                {formatPrice(selectedProduct.priceINR)}
              </div>

              {/* Color Select */}
              <div className="mt-6">
                <div className="flex justify-between text-xs tracking-wider uppercase text-[#2A3C5E]/70 mb-2 font-mono">
                  <span>Selected Colorway:</span>
                  <span className="text-atelier-coral font-bold">{selectedColor}</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`flex items-center gap-1.5 px-2.5 py-1.5 border text-xs transition-all cursor-pointer font-mono ${
                        selectedColor === c.name
                          ? 'border-atelier-coral bg-atelier-coral/10 text-atelier-coral font-bold'
                          : 'border-[#0B1B3D]/15 text-[#0B1B3D] hover:border-[#0B1B3D]/40 bg-white'
                      }`}
                    >
                      <span className="w-3 h-3 rounded-full border border-black/10" style={{ backgroundColor: c.hex }} />
                      <span>{c.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Select */}
              <div className="mt-6">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase text-[#2A3C5E]/70 mb-2 font-mono">
                  <span>Select Size:</span>
                  <button
                    onClick={() => setIsSizeGuideOpen(true)}
                    className="flex items-center gap-1 text-atelier-coral hover:underline text-xs cursor-pointer lowercase"
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
                          ? 'border-atelier-coral bg-atelier-coral text-white font-bold shadow'
                          : 'border-[#0B1B3D]/20 text-[#0B1B3D] hover:border-[#0B1B3D]/50 bg-white'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>

              {/* Fit Description */}
              <div className="mt-4 text-[11px] text-[#2A3C5E]/80 font-light border-l-2 border-atelier-coral pl-3 py-0.5">
                {selectedProduct.fitDescription} &bull; {selectedProduct.modelMeasurements}
              </div>
            </div>

            {/* Actions */}
            <div className="space-y-4 pt-4 border-t border-[#0B1B3D]/10">
              <div className="flex gap-2">
                <button
                  onClick={handleAdd}
                  className={`flex-1 py-4 uppercase tracking-widest text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 shadow-lg cursor-pointer font-mono ${
                    isAdded
                      ? 'bg-emerald-600 text-white'
                      : 'bg-gradient-to-r from-atelier-coral to-[#ff7b6f] text-white hover:brightness-110'
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
                  className="px-4 py-4 border border-[#0B1B3D]/20 text-[#0B1B3D] hover:text-atelier-coral hover:border-atelier-coral text-xs uppercase tracking-wider font-mono flex items-center justify-center gap-1.5 transition-colors bg-white"
                  title="Open Official Shopify Store Listing"
                >
                  <ExternalLink className="w-4 h-4 text-atelier-coral" />
                  <span className="hidden sm:inline text-[11px]">Shopify</span>
                </a>
              </div>

              {/* Domestic Shipping badges */}
              <div className="grid grid-cols-2 gap-2 text-[10px] text-[#2A3C5E]/70 uppercase tracking-wider pt-1 font-mono">
                <div className="flex items-center gap-1.5">
                  <Truck className="w-3.5 h-3.5 text-atelier-coral" />
                  <span>Doorstep Delivery (Printrove)</span>
                </div>
                <div className="flex items-center gap-1.5">
                  <ShieldCheck className="w-3.5 h-3.5 text-atelier-coral" />
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
