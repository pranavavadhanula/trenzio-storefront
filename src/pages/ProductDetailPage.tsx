import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  Heart,
  Check,
  ChevronRight,
  Ruler,
  Truck,
  RotateCcw,
  ShieldCheck,
  Sparkles,
  ArrowRight,
  ExternalLink,
} from 'lucide-react';
import { SizingModal } from '../components/SizingModal';
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
  const { products, addToCart, formatPrice, isWishlisted, toggleWishlist } = useShop();

  const product = products.find((p) => p.id === id) || products[0];

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || 'Ash Grey');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[1] || 'M');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#0A160F] text-[#F4ECE1]">
        <h2 className="font-serif text-3xl mb-4">Product Not Found</h2>
        <Link
          to="/collections/all"
          className="px-6 py-3 bg-[#E6D7C3] text-[#0A160F] font-black uppercase tracking-wider text-xs font-mono shadow-[0_0_15px_rgba(212,195,163,0.3)]"
        >
          Return to Collections
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
    } catch {
      window.location.href = `https://0g1xp7-qd.myshopify.com/cart/${product.id}:1?currency=INR`;
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-14 max-w-7xl mx-auto px-6 sm:px-10 bg-[#0A160F] text-[#F4ECE1]">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#D4C3A3] font-mono mb-8">
        <Link to="/" className="hover:text-[#F4ECE1] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D4C3A3]/60" />
        <Link to="/collections/all" className="hover:text-[#F4ECE1] transition-colors">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D4C3A3]/60" />
        <Link
          to={`/collections/${product.category.toLowerCase().replace(/\s+/g, '-')}`}
          className="hover:text-[#F4ECE1] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#D4C3A3]/60" />
        <span className="text-[#E6D7C3] font-bold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main PDP Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        {/* Left Gallery (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="aspect-[3/4] w-full bg-gradient-to-b from-white/[0.04] to-[#162E21]/50 backdrop-blur-md border border-[#D4C3A3]/20 flex items-center justify-center p-8 relative overflow-hidden shadow-2xl">
            <img
              src={activeImage}
              alt={`${product.name} in ${selectedColor}`}
              className="max-h-full max-w-full object-contain object-center transition-all duration-300"
            />
            {/* Top-Right Wishlist Floating Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 w-10 h-10 rounded-full border flex items-center justify-center transition-all cursor-pointer shadow-md ${
                isSaved
                  ? 'bg-[#E6D7C3] border-[#E6D7C3] text-[#0A160F] shadow-[0_0_15px_rgba(212,195,163,0.4)]'
                  : 'bg-[#112319]/80 border-[#D4C3A3]/25 text-[#F4ECE1] hover:text-[#E6D7C3] hover:border-[#E6D7C3]'
              }`}
              title="Save to Wishlist"
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-[#0A160F]' : ''}`} />
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
                  className={`aspect-square p-1.5 border transition-all flex flex-col items-center justify-center bg-white/[0.03] backdrop-blur-sm cursor-pointer ${
                    isSelected
                      ? 'border-[#E6D7C3] ring-2 ring-[#E6D7C3]/50'
                      : 'border-[#D4C3A3]/20 opacity-70 hover:opacity-100 hover:border-[#E6D7C3]'
                  }`}
                  title={`Color: ${c.name}`}
                >
                  {img ? (
                    <img src={img} alt={c.name} className="w-full h-full object-contain" />
                  ) : (
                    <span className="w-4 h-4 rounded-full" style={{ backgroundColor: c.hex }} />
                  )}
                  <span className="text-[8px] font-mono mt-1 truncate max-w-full text-[#F4ECE1] font-bold">
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
              <span className="bg-[#112319] border border-[#D4C3A3]/30 text-[#F4ECE1] px-2.5 py-0.5 font-bold shadow-sm">
                {product.gsm} GSM Combed Cotton
              </span>
              <span className="bg-[#E6D7C3] text-[#0A160F] px-2 py-0.5 font-extrabold shadow-[0_0_12px_rgba(212,195,163,0.35)]">
                Vendor: Printrove &bull; In Stock
              </span>
            </div>

            {/* Title & Price */}
            <div>
              <h1 className="font-serif text-3xl sm:text-4xl text-[#F4ECE1] font-light leading-tight">
                {product.name}
              </h1>
              <div className="text-3xl font-mono font-bold text-[#E6D7C3] tracking-wider mt-3">
                {formatPrice(product.priceINR)}
              </div>
              <p className="text-[11px] text-[#D4C3A3] font-mono mt-1">
                Inclusive of all taxes &bull; Free express delivery across India
              </p>
            </div>

            {/* Color Selection */}
            <div>
              <div className="flex justify-between text-xs tracking-wider uppercase text-[#F4ECE1] mb-2.5 font-mono">
                <span>Selected Colorway:</span>
                <span className="text-[#E6D7C3] font-bold">{selectedColor}</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => setSelectedColor(c.name)}
                    className={`flex items-center gap-2 px-3 py-2 border text-xs transition-all cursor-pointer font-mono ${
                      selectedColor === c.name
                        ? 'border-[#E6D7C3] bg-[#E6D7C3] text-[#0A160F] font-extrabold shadow-[0_0_12px_rgba(212,195,163,0.35)]'
                        : 'border-[#D4C3A3]/25 bg-white/[0.04] text-[#F4ECE1] hover:border-[#E6D7C3]'
                    }`}
                  >
                    <span className="w-3 h-3 rounded-full border border-white/20" style={{ backgroundColor: c.hex }} />
                    <span>{c.name}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Size Selection */}
            <div>
              <div className="flex justify-between items-center text-xs tracking-wider uppercase text-[#F4ECE1] mb-2.5 font-mono">
                <span>Select Size:</span>
                <button
                  onClick={() => setIsSizeGuideOpen(true)}
                  className="flex items-center gap-1 text-[#E6D7C3] hover:underline cursor-pointer lowercase font-bold"
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
                    className={`py-3 text-xs font-mono font-bold border transition-all cursor-pointer ${
                      selectedSize === s
                        ? 'border-[#E6D7C3] bg-[#E6D7C3] text-[#0A160F] font-extrabold shadow-[0_0_12px_rgba(212,195,163,0.35)]'
                        : 'border-[#D4C3A3]/25 bg-white/[0.04] text-[#F4ECE1] hover:border-[#E6D7C3] hover:text-[#E6D7C3]'
                    }`}
                  >
                    {s}
                  </button>
                ))}
              </div>
            </div>

            {/* Fabric & Fit Details */}
            <div className="p-5 bg-white/[0.03] backdrop-blur-md text-[#F4ECE1] border border-[#D4C3A3]/20 space-y-2 text-xs font-light leading-relaxed shadow-xl">
              <div className="flex items-center gap-2 text-[#E6D7C3] font-mono uppercase text-[10px] font-bold">
                <span>Specifications</span>
              </div>
              <p className="text-[#F4ECE1]">{product.fabric}</p>
              <p className="border-t border-[#D4C3A3]/20 pt-2 text-[11px] text-[#D4C3A3] font-mono">
                {product.fitDescription} &bull; {product.modelMeasurements}
              </p>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-6 border-t border-[#D4C3A3]/20">
            {/* 3D Virtual Try-On Studio Trigger */}
            <Link
              to={`/try-on?product=${product.id}&color=${encodeURIComponent(selectedColor)}&size=${selectedSize}`}
              className="w-full py-3.5 bg-[#162E21] border border-[#D4C3A3] text-[#E6D7C3] hover:bg-[#E6D7C3] hover:text-[#0A160F] transition-all duration-300 text-xs font-mono uppercase tracking-widest font-bold flex items-center justify-center gap-2 cursor-pointer shadow-[0_0_15px_rgba(212,195,163,0.2)]"
            >
              <Sparkles className="w-4 h-4 text-[#E6D7C3]" />
              <span>⚡ Try On Yourself in 3D Fitting Studio</span>
            </Link>

            <div className="flex flex-col sm:flex-row gap-3">
              {/* Add to Bag */}
              <button
                onClick={handleAdd}
                className={`flex-1 py-4 uppercase tracking-widest text-xs font-black transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-lg ${
                  isAdded
                    ? 'bg-emerald-500 text-[#0A160F]'
                    : 'bg-gradient-to-r from-[#E6D7C3] to-[#D4C3A3] hover:from-[#F4ECE1] hover:to-[#E6D7C3] text-[#0A160F] shadow-[0_0_25px_rgba(212,195,163,0.4)]'
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
                className="px-6 py-4 bg-white/[0.05] border border-[#D4C3A3]/25 text-[#F4ECE1] hover:border-[#E6D7C3] hover:text-[#E6D7C3] text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-md"
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
            <div className="pt-2 flex justify-between items-center text-[11px] font-mono text-[#D4C3A3] border-t border-[#D4C3A3]/20">
              <span>View live on official store:</span>
              <a
                href="https://0g1xp7-qd.myshopify.com/products/overshized-plain-t-shirt"
                target="_blank"
                rel="noopener noreferrer"
                className="text-[#E6D7C3] hover:underline flex items-center gap-1 font-bold"
              >
                <span>0g1xp7-qd.myshopify.com</span>
                <ExternalLink className="w-3 h-3" />
              </a>
            </div>

            {/* D2C Guarantees */}
            <div className="grid grid-cols-2 gap-3 text-[10px] text-[#D4C3A3] uppercase tracking-wider pt-3 font-mono border-t border-[#D4C3A3]/20">
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#E6D7C3]" />
                <span>Pan-India Delivery</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCcw className="w-3.5 h-3.5 text-[#E6D7C3]" />
                <span>7-Day Size Exchanges</span>
              </div>
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-[#E6D7C3]" />
                <span>UPI & COD Accepted</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="w-3.5 h-3.5 text-[#E6D7C3]" />
                <span>Zero Shrinkage Guarantee</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Sizing Modal */}
      {isSizeGuideOpen && <SizingModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />}
    </div>
  );
};