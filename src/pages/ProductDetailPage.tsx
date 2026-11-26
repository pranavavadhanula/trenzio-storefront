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
  ArrowRight,
  ShoppingBag,
  AlertCircle,
} from 'lucide-react';
import { SizingModal } from '../components/SizingModal';
import { startRazorpayCheckout } from '../services/razorpay';

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
  const { products, addToCart, formatPrice, isWishlisted, toggleWishlist, setIsCartOpen, user } = useShop();

  const product = products.find((p) => p.id === id) || products[0];

  const [selectedColor, setSelectedColor] = useState(product?.colors[0]?.name || 'Default');
  const [selectedSize, setSelectedSize] = useState(product?.sizes[1] || product?.sizes[0] || 'M');
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  if (!product) {
    return (
      <div className="min-h-[70vh] flex flex-col items-center justify-center p-8 text-center bg-[#F4F1EA] text-[#171717]">
        <h2 className="font-serif text-3xl mb-4">Product Not Found</h2>
        <Link
          to="/collections"
          className="px-6 py-3 bg-[#171717] text-white text-xs uppercase tracking-widest font-medium"
        >
          Return to Collections
        </Link>
      </div>
    );
  }

  const isSaved = isWishlisted(product.id);
  
  // Dynamic variant mockups for Printrove & custom garments
  const variantForColor = product.variants?.find(
    (v: any) => v.color?.toLowerCase() === selectedColor.toLowerCase() && (v.mockupFront || v.mockupBack)
  );
  const colorMockupFront = (variantForColor as any)?.mockupFront;
  const colorMockupBack = (variantForColor as any)?.mockupBack;

  const colorMappedImage =
    colorMockupFront ||
    (product.id.startsWith('printrove-')
      ? product.images.primary
      : COLOR_IMAGE_MAP[selectedColor] || product.images.primary);

  const galleryImages = [
    colorMappedImage,
    colorMockupBack || (product.images.secondary !== product.images.primary ? product.images.secondary : null),
    product.images.detail !== product.images.primary && product.images.detail !== colorMappedImage
      ? product.images.detail
      : null,
  ].filter(Boolean) as string[];

  const displayedImage = galleryImages[activeGalleryIndex] || colorMappedImage;

  const handleAdd = () => {
    addToCart(product, selectedSize, selectedColor);
    setIsAdded(true);
    setIsCartOpen(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const result = await startRazorpayCheckout({
        items: [
          {
            productId: product.id,
            name: product.name,
            size: selectedSize,
            color: selectedColor,
            quantity: 1,
            unitPriceINR: product.priceINR,
          },
        ],
        customer: user ? { name: user.name, email: user.email, phone: user.phone } : undefined,
      });

      navigate(
        `/order-confirmed?payment_id=${encodeURIComponent(result.paymentId)}&order_id=${encodeURIComponent(result.orderId)}&amount=${encodeURIComponent(String(result.amountINR))}`
      );
    } catch (err: any) {
      if (err?.code !== 'PAYMENT_CANCELLED') {
        console.error(err);
      }
      setCheckoutError(err?.message || 'Unable to complete payment. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-14 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 bg-[#F4F1EA] text-[#171717] font-sans">
      {/* Editorial Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#706B64] font-medium mb-8">
        <Link to="/" className="hover:text-[#171717] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B9AA96]" />
        <Link to="/collections" className="hover:text-[#171717] transition-colors">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B9AA96]" />
        <Link
          to={`/collections/${product.gender === 'Women' ? 'women' : 'men'}`}
          className="hover:text-[#171717] transition-colors"
        >
          {product.category}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B9AA96]" />
        <span className="text-[#171717] font-semibold truncate max-w-xs">{product.name}</span>
      </nav>

      {/* Main Product Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14">
        
        {/* Left: 4:5 Photography & Gallery */}
        <div className="lg:col-span-7 space-y-4">
          {/* Main 4:5 Product Surface Box */}
          <div className="relative aspect-[4/5] w-full bg-[#FFFFFF] border border-[#DDD8CE] overflow-hidden flex items-center justify-center p-6 sm:p-10 shadow-sm">
            <img
              src={displayedImage}
              alt={product.name}
              className="w-full h-full object-contain transition-transform duration-700 ease-out hover:scale-105"
            />

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#171717] text-white'
                  : 'bg-[#FFFFFF] text-[#171717] hover:bg-[#171717] hover:text-white border border-[#DDD8CE]'
              }`}
              title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>
          </div>

          {/* Thumbnails row if multiple images exist */}
          {galleryImages.length > 1 && (
            <div className="flex items-center gap-3">
              {galleryImages.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setActiveGalleryIndex(idx)}
                  className={`w-20 h-24 bg-[#FFFFFF] border p-2 overflow-hidden transition-all cursor-pointer ${
                    activeGalleryIndex === idx
                      ? 'border-[#171717] ring-1 ring-[#171717]'
                      : 'border-[#DDD8CE] opacity-70 hover:opacity-100'
                  }`}
                >
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right: Product Details & Purchase Controls */}
        <div className="lg:col-span-5 space-y-6">
          <div>
            <div className="flex items-center justify-between text-[11px] uppercase tracking-[0.25em] text-[#706B64] mb-2 font-medium">
              <span>{product.category}</span>
              <span className="text-[#B9AA96]">{product.gender}'s Collection</span>
            </div>
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#171717] tracking-tight leading-tight">
              {product.name}
            </h1>

            {/* Price */}
            <div className="mt-4 flex items-baseline gap-3">
              <span className="font-serif text-2xl sm:text-3xl font-semibold text-[#171717]">
                {formatPrice(product.priceINR)}
              </span>
              <span className="text-xs text-[#706B64]">
                Inclusive of all taxes & express shipping
              </span>
            </div>
          </div>

          {/* Color Selector */}
          <div className="pt-4 border-t border-[#DDD8CE] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider text-[#706B64] font-medium">Colorway:</span>
              <span className="font-semibold text-[#171717]">{selectedColor}</span>
            </div>
            <div className="flex items-center gap-2">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color.name;
                return (
                  <button
                    key={color.name}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setActiveGalleryIndex(0);
                    }}
                    className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                      isSelected
                        ? 'border-[#171717] scale-110 ring-2 ring-[#171717] ring-offset-2'
                        : 'border-[#DDD8CE] hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={color.name}
                  />
                );
              })}
            </div>
          </div>

          {/* Size Selector */}
          <div className="pt-4 border-t border-[#DDD8CE] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider text-[#706B64] font-medium">Select Size:</span>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs uppercase tracking-wider text-[#171717] hover:text-[#B9AA96] transition-colors flex items-center gap-1 font-medium underline"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>
            <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
              {product.sizes.map((size) => {
                const isSelected = selectedSize === size;
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2 text-xs uppercase tracking-wider font-medium border transition-colors cursor-pointer ${
                      isSelected
                        ? 'bg-[#171717] text-white border-[#171717]'
                        : 'bg-[#FFFFFF] text-[#171717] border-[#DDD8CE] hover:border-[#171717]'
                    }`}
                  >
                    {size}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Action Buttons */}
          <div className="pt-4 space-y-3">
            <button
              onClick={handleAdd}
              className="w-full py-4 bg-[#171717] text-white hover:bg-[#333333] transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm"
            >
              <ShoppingBag className="w-4 h-4" />
              <span>{isAdded ? 'Added to Bag ✓' : 'Add to Shopping Bag'}</span>
            </button>

            <button
              onClick={handleBuyNow}
              disabled={isCheckingOut}
              className="w-full py-4 bg-[#FFFFFF] border border-[#171717] text-[#171717] hover:bg-[#F4F1EA] transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 cursor-pointer"
            >
              <span>{isCheckingOut ? 'Opening Secure Payment...' : 'Instant Secure Checkout'}</span>
              <ArrowRight className="w-4 h-4" />
            </button>

            {checkoutError && (
              <p className="flex items-start gap-2 text-[11px] text-red-700 bg-red-50 border border-red-200 px-3 py-2">
                <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 mt-0.5" />
                <span>{checkoutError}</span>
              </p>
            )}
          </div>

          {/* Trust Guarantees */}
          <div className="pt-6 border-t border-[#DDD8CE] space-y-2.5 text-xs text-[#706B64]">
            <div className="flex items-center gap-2.5">
              <Truck className="w-4 h-4 text-[#B9AA96]" />
              <span>Complimentary Pan-India Dispatch within 24 Hours &bull; Delivered in 3-5 Days</span>
            </div>
            <div className="flex items-center gap-2.5">
              <RotateCcw className="w-4 h-4 text-[#B9AA96]" />
              <span>Hassle-Free 7-Day Size Exchanges via your account</span>
            </div>
            <div className="flex items-center gap-2.5">
              <ShieldCheck className="w-4 h-4 text-[#B9AA96]" />
              <span>100% Bio-Washed Combed Cotton &bull; Zero Synthetic Fillers</span>
            </div>
          </div>

          {/* Specifications Accordion / Description */}
          <div className="pt-6 border-t border-[#DDD8CE] space-y-3">
            <h3 className="font-serif text-lg text-[#171717]">Atelier Specifications</h3>
            <p className="text-xs text-[#706B64] font-light leading-relaxed">
              {product.fitDescription}
            </p>
            <div className="p-4 bg-[#FFFFFF] border border-[#DDD8CE] text-xs space-y-1.5 font-light">
              <div><strong className="font-medium text-[#171717]">Fabric:</strong> {product.fabric}</div>
              <div><strong className="font-medium text-[#171717]">Model Drape:</strong> {product.modelMeasurements}</div>
              <div><strong className="font-medium text-[#171717]">Care:</strong> Machine wash cold inside-out, tumble dry low or line dry in shade.</div>
            </div>
          </div>

        </div>
      </div>

      <SizingModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
