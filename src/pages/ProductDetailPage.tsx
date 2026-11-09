import React, { useState, useMemo } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Ruler, Truck, ShieldCheck, Check, Heart, ExternalLink, ArrowRight, ChevronRight, RotateCcw, Sparkles } from 'lucide-react';
import { createShopifyCheckout } from '../services/shopify';

const COLOR_IMAGE_MAP: Record<string, string> = {
  'Ash Grey': '/images/products/ash-grey.png',
  'Beige': '/images/products/beige.png',
  'Black': '/images/products/black.png',
  'Olive Green': '/images/products/green.png',
  'Navy Blue': '/images/products/navy.png',
  'Crimson Red': '/images/products/red.png',
  'Maroon': '/images/products/maroon.png',
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, formatPrice, addToCart, isWishlisted, toggleWishlist, setIsSizeGuideOpen } = useShop();

  const product = useMemo(() => {
    return products.find(
      (p) => p.id === id || p.name.toLowerCase().replace(/\s+/g, '-') === id?.toLowerCase()
    ) || products[0];
  }, [products, id]);

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || 'Ash Grey');
  const [selectedSize, setSelectedSize] = useState<string>(product?.sizes[0] || 'M');
  const [isAdded, setIsAdded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!product) {
    return (
      <div className="py-32 text-center max-w-xl mx-auto px-6">
        <h2 className="font-serif text-3xl text-[#0B1B3D]">Product Not Found</h2>
        <p className="text-xs text-[#2A3C5E]/70 mt-2">The requested piece may have been updated.</p>
        <Link to="/collections/all" className="inline-block mt-6 px-6 py-3 bg-gradient-to-r from-atelier-coral to-[#ff7b6f] text-white font-bold uppercase text-xs shadow-md">
          Browse Catalog
        </Link>
      </div>
    );
  }

  const isSaved = isWishlisted(product.id);
  const activeImage = COLOR_IMAGE_MAP[selectedColor] || product.images.primary;

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    setIsCheckingOut(true);
    try {
      const checkoutUrl = await createShopifyCheckout([
        {
          variantId: product.id.startsWith('prod_') ? '44119548559395' : product.id,
          quantity: 1,
        },
      ], 'IN');
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error(err);
      // Fallback redirect
      window.location.href = `https://0g1xp7-qd.myshopify.com/cart/${product.id}:1?currency=INR`;
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-14 max-w-7xl mx-auto px-6 sm:px-10">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#2A3C5E]/70 font-mono mb-8">
        <Link to="/" className="hover:text-atelier-coral transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/collections/all" className="hover:text-atelier-coral transition-colors">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link
          to={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="hover:text-atelier-coral transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-atelier-coral font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[3/4] w-full bg-[#EFE8DC] border-2 border-[#0B1B3D]/15 flex items-center justify-center p-8 relative overflow-hidden shadow-md">
            <img
              src={activeImage}
              alt={`${product.name} in ${selectedColor}`}
              className="max-h-full max-w-full object-contain object-center transition-all duration-300"
            />
            {/* Top-Right Wishlist Floating Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center transition-colors cursor-pointer shadow-md ${
                isSaved
                  ? 'bg-atelier-coral border-atelier-coral text-white'
                  : 'bg-[#0B1B3D] border-[#1E3B75] text-[#F8F5EE] hover:text-atelier-coral'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-white' : ''}`} />
            </button>
          </div>

          {/* Color Mockup Thumbnails */}
          <div className="grid grid-cols-7 gap-2">
            {product.colors.map((c) => {
              const img = COLOR_IMAGE_MAP[c.name];
              const isSelected = selectedColor === c.name;
              return (
                <button
                  key={c.name}
                  onClick={() => setSelectedColor(c.name)}
                  className={`aspect-square p-1.5 border-2 transition-all flex flex-col items-center justify-center bg-[#EFE8DC] cursor-pointer ${
                    isSelected
                      ? 'border-atelier-coral ring-2 ring-atelier-coral/50'
                      : 'border-[#0B1B3D]/15 opacity-80 hover:opacity-100 hover:border-atelier-coral'
                  }`}
                  title={`Color: ${c.name}`}
                >
                  {img ? (
                    <img src={img} alt={c.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }} />
                  )}
                  <span className="text-[8px] font-mono mt-1 truncate max-w-full text-[#0B1B3D] font-bold">
                    {c.name.split(' ')[0]}
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Info & Purchasing Panel (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
          <div className="space-y-6">
            {/* Badges */}
            <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider font-mono">
              <span className="bg-[#0B1B3D] text-[#F8F5EE] px-2.5 py-0.5 font-bold shadow-sm">
                {product.gsm} GSM Combed Cotton
              </span>
              <span className="bg-atelier-coral text-white border border-atelier-coral px-2 py-0.5 font-bold">
                Vendor: Printrove &bull; In Stock
              </span>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#0B1B3D] font-light leading-tight">
                {product.name}
              </h1>
              <div className="text-3xl font-mono font-bold text-[#0B1B3D] tracking-wider mt-3">
                {formatPrice(product.priceINR)}
              </div>
              <p className="text-[11px] text-[#0B1B3D]/80 font-mono mt-1">
                Inclusive of all taxes &bull; Free express delivery across India
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <div className="flex justify-between text-xs tracking-wider uppercase text-[#0B1B3D] mb-2.5 font-mono">
                <span>Selected Colorway:</span>
                <span className="text-atelier-coral font-bold">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-2 border-2 text-xs transition-all cursor-pointer font-mono ${
                      selectedColor === c.name
                        ? 'border-atelier-coral bg-atelier-coral text-white font-bold shadow'
                        : 'border-[#0B1B3D]/20 text-[#0B1B3D] hover:border-atelier-coral bg-[#EFE8DC]'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-[#0B1B3D]/30" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center text-xs tracking-wider uppercase text-[#0B1B3D] mb-2.5 font-mono">
                <span>Select Size:</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-atelier-coral hover:underline cursor-pointer lowercase font-bold"
                >
                  <Ruler className="w-3.5 h-3.5" />
                  <span>Printrove Chest Measurements</span>
                </button>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {product.sizes.map((s) => (
                  <button
                    key={s}
                    onClick={() => setSelectedSize(s)}
                    className={`py-3 text-xs font-mono font-bold border-2 transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'border-atelier-coral bg-atelier-coral text-white font-bold shadow-md'
                        : 'border-[#0B1B3D] bg-[#0B1B3D] text-[#F8F5EE] hover:bg-atelier-coral hover:border-atelier-coral'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric & Fit Details */}
            <div className="p-5 bg-[#0B1B3D] text-[#F8F5EE] border border-[#1E3B75] space-y-2 text-xs font-light leading-relaxed shadow-xl">
              <div className="flex items-center gap-2 text-atelier-coral font-mono uppercase text-[10px] font-bold">
                <span>Specifications</span>
              </div>
              <p className="text-[#E2DCD1]">{product.fabric}</p>
              <p className="border-t border-[#1E3B75] pt-2 text-[11px] text-[#E2DCD1]/80 font-mono">
                {product.fitDescription} &bull; {product.modelMeasurements}
              </p>
            </div>
          </div>

          {/* Action CTAs - Pure Luxury Satin Gold, No White Buttons */}
          <div className="space-y-3 pt-6 border-t border-white/10">
            {/* 3D Virtual Try-On Studio Trigger */}
            <Link
              to={`/try-on?product=${product.id}&color=${encodeURIComponent(selectedColor)}&size=${selectedSize}`}
              className="w-full py-3.5 bg-[#0B1B3D] border border-atelier-coral text-atelier-coral hover:bg-atelier-coral hover:text-white transition-all duration-300 text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Sparkles className="w-4 h-4 text-atelier-coral group-hover:text-white" />
              <span>⚡ Try On Yourself in 3D Fitting Studio</span>
            </Link>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add to Bag */}
              <button
                onClick={handleAdd}
                className={`flex-1 py-4 uppercase tracking-widest text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
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
                  <span>Add to Bag &bull; {formatPrice(product.priceINR)}</span>
                )}
              </button>

              {/* Instant Buy with Shopify */}
              <button
                onClick={handleBuyNow}
                disabled={isCheckingOut}
                className="px-6 py-4 bg-[#0B1B3D] border border-[#0B1B3D] text-white hover:bg-atelier-coral hover:border-atelier-coral text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-md"
                title="Instant Checkout via Shopify"
              >
                {isCheckingOut ? (
                  <span>Connecting...</span>
                ) : (
                  <>
                    <span>Buy Now</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </>
                )}
              </button>
            </div>

            {/* Direct Official Shopify Link */}
            <div className="pt-2 flex justify-between items-center text-[11px] font-mono text-[#2A3C5E]/80 border-t border-[#0B1B3D]/10">
              <span>View live on official store:</span>
              <a
                href="https://0g1xp7-qd.myshopify.com/products/overshized-plain-t-shirt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-atelier-coral hover:underline flex items-center gap-1 font-bold"
              >
                <span>0g1xp7-qd.myshopify.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* D2C Guarantees */}
            <div className="grid grid-cols-2 gap-3 text-[10px] text-[#2A3C5E]/80 uppercase tracking-wider pt-3 font-mono border-t border-[#0B1B3D]/10">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-atelier-coral" />
                <span>Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-atelier-coral" />
                <span>7-Day Size Exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-atelier-coral" />
                <span>UPI & COD Accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-atelier-coral" />
                <span>Zero Shrinkage Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
