import React, { useState, useEffect, useMemo, useRef } from 'react';
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
  Camera,
  Sparkles,
  ZoomIn,
  ZoomOut,
  Maximize2,
  X,
  Move,
  Info,
  CheckCircle2,
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

const SIZE_ORDER = ['XS', 'S', 'M', 'L', 'XL', '2XL', 'XXL', '3XL', '4XL'];

const SIZE_DETAILS: Record<string, { chest: string; length: string; fit: string; stock: string }> = {
  'XS': { chest: '40"', length: '27"', fit: 'Slim/Fitted silhouette', stock: 'Low Stock — 3 left' },
  'S': { chest: '42"', length: '28"', fit: 'Trim streetwear fit', stock: 'In Stock' },
  'M': { chest: '44"', length: '29"', fit: 'Signature slouchy relaxed fit', stock: 'In Stock · Ready to Dispatch' },
  'L': { chest: '46"', length: '30"', fit: 'Authentic oversized boxy drape', stock: 'In Stock · Ready to Dispatch' },
  'XL': { chest: '48"', length: '31"', fit: 'Generous oversized volume', stock: 'In Stock' },
  '2XL': { chest: '50"', length: '32"', fit: 'Extended slouch silhouette', stock: 'In Stock' },
  'XXL': { chest: '50"', length: '32"', fit: 'Extended slouch silhouette', stock: 'In Stock' },
  '3XL': { chest: '52"', length: '33"', fit: 'Maximum statement drape', stock: 'Limited Edition' },
};

export const ProductDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { products, addToCart, formatPrice, isWishlisted, toggleWishlist, setIsCartOpen, user } = useShop();

  const product = products.find((p) => p.id === id) || products[0];

  // Pick signature initial colorway (Black, Ivory, or first color)
  const initialColor = useMemo(() => {
    if (!product?.colors || product.colors.length === 0) return 'Default';
    const preferredPriority = ['black', 'ivory', 'forest green', 'navy blue', 'ash grey'];
    for (const p of preferredPriority) {
      const match = product.colors.find((c) => c.name.toLowerCase() === p);
      if (match) return match.name;
    }
    return product.colors[0].name;
  }, [product?.colors]);

  const [selectedColor, setSelectedColor] = useState(initialColor);
  const [hoveredColor, setHoveredColor] = useState<string | null>(null);

  // Sorted sizes in standard logical order (XS, S, M, L, XL, 2XL, XXL, 3XL)
  const sortedSizes = useMemo(() => {
    if (!product?.sizes || product.sizes.length === 0) return ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
    return [...product.sizes].sort((a, b) => {
      const idxA = SIZE_ORDER.indexOf(a.toUpperCase());
      const idxB = SIZE_ORDER.indexOf(b.toUpperCase());
      if (idxA !== -1 && idxB !== -1) return idxA - idxB;
      if (idxA !== -1) return -1;
      if (idxB !== -1) return 1;
      return a.localeCompare(b);
    });
  }, [product?.sizes]);

  const [selectedSize, setSelectedSize] = useState(() => {
    if (product?.sizes && product.sizes.length > 0) {
      return product.sizes.find((s: string) => s.toUpperCase() === 'M') || product.sizes[0];
    }
    return 'M';
  });

  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);
  const [isAdded, setIsAdded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [activeGalleryIndex, setActiveGalleryIndex] = useState(0);

  // Interactive Zoom State
  const [zoomLevel, setZoomLevel] = useState(100); // 100% to 350%
  const [mousePos, setMousePos] = useState({ x: 50, y: 50 });
  const [isHoveringImage, setIsHoveringImage] = useState(false);
  const [isLightboxOpen, setIsLightboxOpen] = useState(false);
  const [lightboxZoom, setLightboxZoom] = useState(130);
  const [lightboxPos, setLightboxPos] = useState({ x: 50, y: 50 });
  const imageContainerRef = useRef<HTMLDivElement>(null);

  // Reset zoom level whenever gallery image or color changes
  useEffect(() => {
    setZoomLevel(100);
  }, [activeGalleryIndex, selectedColor, hoveredColor]);

  // Keyboard shortcut listener for Lightbox
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape' && isLightboxOpen) {
        setIsLightboxOpen(false);
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isLightboxOpen]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
    const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
    setMousePos({ x, y });
  };

  const handleWheel = (e: React.WheelEvent<HTMLDivElement>) => {
    // Only capture wheel zoom when hovered over image
    e.preventDefault();
    const delta = e.deltaY < 0 ? 20 : -20;
    setZoomLevel((prev) => Math.min(350, Math.max(100, prev + delta)));
  };

  const handleDoubleClick = () => {
    setZoomLevel((prev) => (prev > 100 ? 100 : 200));
  };

  // Sync initial color if product changes
  useEffect(() => {
    setSelectedColor(initialColor);
  }, [initialColor]);

  // Preload all color variants into browser cache
  useEffect(() => {
    if (product?.variants && Array.isArray(product.variants)) {
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
  }, [product?.variants]);

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

  // Active color: hovered color takes precedence for instant live preview
  const activeColor = hoveredColor || selectedColor;

  // Dynamic variant mockups for Printrove & custom garments
  const variantForColor = product.variants?.find(
    (v: any) => v.color?.toLowerCase() === activeColor.toLowerCase() && (v.mockupFront || v.mockupBack)
  );
  const colorMockupFront = (variantForColor as any)?.mockupFront;
  const colorMockupBack = (variantForColor as any)?.mockupBack;

  const colorMappedImage =
    colorMockupFront ||
    (product.id.startsWith('printrove-')
      ? product.images.primary
      : COLOR_IMAGE_MAP[activeColor] || product.images.primary);

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
          {/* Main 4:5 Product Surface Box with Pure Atelier Studio Lighting & Interactive Zoom */}
          <div
            ref={imageContainerRef}
            onMouseMove={handleMouseMove}
            onMouseEnter={() => setIsHoveringImage(true)}
            onMouseLeave={() => {
              setIsHoveringImage(false);
              setMousePos({ x: 50, y: 50 });
            }}
            onWheel={handleWheel}
            onDoubleClick={handleDoubleClick}
            className="relative aspect-[4/5] w-full bg-[#FFFFFF] border border-[#DDD8CE] overflow-hidden flex items-center justify-center p-6 sm:p-10 shadow-sm select-none group"
            style={{
              cursor: zoomLevel > 100 ? 'crosshair' : 'zoom-in',
            }}
          >
            {/* Main Product Image with Interactive Scale & Dynamic Pan */}
            <div
              className="w-full h-full flex items-center justify-center transition-transform duration-150 ease-out"
              style={{
                transformOrigin: `${mousePos.x}% ${mousePos.y}%`,
                transform: `scale(${zoomLevel > 100 ? (zoomLevel / 100) * 1.15 : 1.15})`,
              }}
            >
              <img
                key={displayedImage}
                src={displayedImage}
                alt={`${product.name} in ${activeColor}`}
                className="w-full h-full object-contain pointer-events-none select-none transition-transform duration-500 ease-out"
                draggable={false}
              />
            </div>

            {/* Quick Status / Zoom Helper Badge */}
            <div className="absolute top-4 left-4 z-10 pointer-events-none">
              <span className="px-2.5 py-1 text-[10px] uppercase font-mono tracking-widest bg-white/90 backdrop-blur-sm border border-[#DDD8CE] text-[#171717] rounded shadow-xs">
                {zoomLevel > 100 ? `Zoom: ${zoomLevel}% · Double-click to reset` : 'Hover / Scroll to Zoom'}
              </span>
            </div>

            {/* Wishlist Button */}
            <button
              onClick={() => toggleWishlist(product.id)}
              className={`absolute top-4 right-4 z-10 w-9 h-9 rounded-full flex items-center justify-center transition-all cursor-pointer ${
                isSaved
                  ? 'bg-[#171717] text-white shadow-sm'
                  : 'bg-[#FFFFFF] text-[#171717] hover:bg-[#171717] hover:text-white border border-[#DDD8CE]'
              }`}
              title={isSaved ? "Saved in Wishlist" : "Save to Wishlist"}
            >
              <Heart className={`w-4 h-4 ${isSaved ? 'fill-current' : ''}`} />
            </button>

            {/* Floating Luxury Interactive Zoom Controls Toolbar */}
            <div
              className="absolute bottom-4 left-1/2 -translate-x-1/2 z-20 bg-white/95 backdrop-blur-md border border-[#DDD8CE] shadow-lg rounded-full px-3 py-1.5 flex items-center gap-2 sm:gap-2.5 transition-all opacity-95 group-hover:opacity-100"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.max(100, prev - 25))}
                disabled={zoomLevel <= 100}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#F4F1EA] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                title="Zoom Out (-25%)"
              >
                <ZoomOut className="w-3.5 h-3.5" />
              </button>

              {/* Interactive Zoom Slider */}
              <div className="flex items-center gap-2">
                <input
                  type="range"
                  min={100}
                  max={350}
                  step={10}
                  value={zoomLevel}
                  onChange={(e) => setZoomLevel(Number(e.target.value))}
                  className="w-20 sm:w-28 h-1.5 bg-[#DDD8CE] rounded-lg appearance-none cursor-pointer accent-[#171717]"
                  title="Adjust zoom level according to your will"
                />
                <span className="text-[11px] font-mono font-semibold text-[#171717] min-w-[36px] text-right">
                  {zoomLevel}%
                </span>
              </div>

              <button
                type="button"
                onClick={() => setZoomLevel((prev) => Math.min(350, prev + 25))}
                disabled={zoomLevel >= 350}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#F4F1EA] disabled:opacity-30 disabled:hover:bg-transparent transition-all cursor-pointer"
                title="Zoom In (+25%)"
              >
                <ZoomIn className="w-3.5 h-3.5" />
              </button>

              {zoomLevel > 100 && (
                <button
                  type="button"
                  onClick={() => setZoomLevel(100)}
                  className="px-2 py-0.5 text-[10px] uppercase font-bold tracking-wider bg-[#171717] text-white rounded-full hover:bg-[#333333] transition-all cursor-pointer"
                  title="Reset to 100%"
                >
                  1x
                </button>
              )}

              <div className="w-[1px] h-4 bg-[#DDD8CE]" />

              <button
                type="button"
                onClick={() => {
                  setLightboxZoom(Math.max(140, zoomLevel));
                  setIsLightboxOpen(true);
                }}
                className="w-7 h-7 rounded-full flex items-center justify-center text-[#171717] hover:bg-[#F4F1EA] transition-all cursor-pointer"
                title="Full-Screen High Definition Inspection"
              >
                <Maximize2 className="w-3.5 h-3.5" />
              </button>
            </div>
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
                  <img src={img} alt="thumbnail" className="w-full h-full object-contain scale-110" />
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

          {/* Color Selector with Instant Live Preview on Hover */}
          <div className="pt-4 border-t border-[#DDD8CE] space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="uppercase tracking-wider text-[#706B64] font-medium">Colorway:</span>
              <span className="font-semibold text-[#171717]">
                {activeColor}{' '}
                {hoveredColor && (
                  <span className="text-[#B9AA96] text-[10px] uppercase font-normal tracking-wider ml-1">
                    (Hover Preview)
                  </span>
                )}
              </span>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              {product.colors.map((color) => {
                const isSelected = selectedColor === color.name;
                const isHovered = hoveredColor === color.name;
                return (
                  <button
                    key={color.name}
                    onMouseEnter={() => {
                      setHoveredColor(color.name);
                      setActiveGalleryIndex(0);
                    }}
                    onMouseLeave={() => setHoveredColor(null)}
                    onClick={() => {
                      setSelectedColor(color.name);
                      setHoveredColor(null);
                      setActiveGalleryIndex(0);
                    }}
                    className={`w-7 h-7 rounded-full border transition-all cursor-pointer relative ${
                      isSelected
                        ? 'border-[#171717] scale-110 ring-2 ring-[#171717] ring-offset-2 z-10'
                        : isHovered
                        ? 'border-[#171717] scale-110 ring-1 ring-[#171717]'
                        : 'border-[#DDD8CE] hover:scale-105 opacity-80 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: color.hex }}
                    title={`${color.name} (hover to preview)`}
                  />
                );
              })}
            </div>
          </div>

          {/* Size Selector with Logical Ordering & Real-time Fit Specifications */}
          <div className="pt-4 border-t border-[#DDD8CE] space-y-3">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-1.5">
                <span className="uppercase tracking-wider text-[#706B64] font-medium">Select Size:</span>
                <span className="font-bold text-[#171717] font-mono">{selectedSize}</span>
              </div>
              <button
                onClick={() => setIsSizeGuideOpen(true)}
                className="text-xs uppercase tracking-wider text-[#171717] hover:text-[#B9AA96] transition-colors flex items-center gap-1 font-medium underline cursor-pointer"
              >
                <Ruler className="w-3.5 h-3.5" />
                <span>Size Guide</span>
              </button>
            </div>

            {/* Sorted Size Options Buttons */}
            <div className="grid grid-cols-3 sm:grid-cols-6 gap-2">
              {sortedSizes.map((size) => {
                const isSelected = selectedSize.toUpperCase() === size.toUpperCase();
                const detail = SIZE_DETAILS[size.toUpperCase()];
                return (
                  <button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    className={`py-2.5 px-3 text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer flex flex-col items-center justify-center relative ${
                      isSelected
                        ? 'bg-[#171717] text-white border-[#171717] ring-2 ring-[#171717] ring-offset-1 shadow-sm'
                        : 'bg-[#FFFFFF] text-[#171717] border-[#DDD8CE] hover:border-[#171717] hover:bg-[#FAF8F5]'
                    }`}
                  >
                    <span>{size}</span>
                    {detail && (
                      <span className={`text-[9px] font-normal tracking-tight mt-0.5 ${isSelected ? 'text-[#DDD8CE]' : 'text-[#8C867D]'}`}>
                        {detail.chest}
                      </span>
                    )}
                  </button>
                );
              })}
            </div>

            {/* Live Size & Fit Context Card */}
            {selectedSize && (
              <div className="p-3 bg-[#FAF8F5] border border-[#DDD8CE] rounded space-y-1.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-[#171717]">
                    Size {selectedSize}:{' '}
                    <span className="font-normal text-[#706B64]">
                      {SIZE_DETAILS[selectedSize.toUpperCase()]?.fit || 'Calibrated Streetwear Fit'}
                    </span>
                  </span>
                  <span className="inline-flex items-center gap-1 text-[11px] text-emerald-800 font-medium">
                    <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                    <span>{SIZE_DETAILS[selectedSize.toUpperCase()]?.stock || 'In Stock'}</span>
                  </span>
                </div>
                <div className="text-[11px] text-[#706B64] flex items-center justify-between border-t border-[#DDD8CE]/60 pt-1.5">
                  <span>
                    Chest: <strong>{SIZE_DETAILS[selectedSize.toUpperCase()]?.chest || '44"'}</strong> &bull; Length: <strong>{SIZE_DETAILS[selectedSize.toUpperCase()]?.length || '29"'}</strong>
                  </span>
                  <span className="text-[#8C867D]">Ready for 24h dispatch</span>
                </div>
              </div>
            )}

            {/* Fit Preference Presets (Change size according to wish) */}
            <div className="pt-1">
              <span className="text-[10px] uppercase tracking-wider text-[#8C867D] font-medium block mb-1.5">
                Fit Preference:
              </span>
              <div className="grid grid-cols-3 gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const currIdx = sortedSizes.findIndex((s) => s.toUpperCase() === selectedSize.toUpperCase());
                    if (currIdx > 0) setSelectedSize(sortedSizes[currIdx - 1]);
                  }}
                  className="py-1.5 px-2 text-[10px] text-center border border-[#DDD8CE] hover:border-[#171717] bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#171717] font-medium transition-all cursor-pointer rounded"
                  title="Choose 1 size smaller for a tailored fit"
                >
                  Fitted / Tailored (Down 1)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const defaultSize = sortedSizes.find((s) => s.toUpperCase() === 'M') || sortedSizes[0];
                    setSelectedSize(defaultSize);
                  }}
                  className="py-1.5 px-2 text-[10px] text-center border border-[#171717] bg-[#171717] text-white font-medium transition-all cursor-pointer rounded shadow-xs"
                  title="True-to-size slouchy oversized streetwear"
                >
                  Standard Slouch (True Size)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    const currIdx = sortedSizes.findIndex((s) => s.toUpperCase() === selectedSize.toUpperCase());
                    if (currIdx < sortedSizes.length - 1 && currIdx !== -1) {
                      setSelectedSize(sortedSizes[currIdx + 1]);
                    }
                  }}
                  className="py-1.5 px-2 text-[10px] text-center border border-[#DDD8CE] hover:border-[#171717] bg-[#FFFFFF] hover:bg-[#FAF8F5] text-[#171717] font-medium transition-all cursor-pointer rounded"
                  title="Choose 1 size larger for extreme oversized slouch"
                >
                  Baggy Volume (Up 1)
                </button>
              </div>
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

            {/* 3D Trying Studio Button */}
            <Link
              to={`/try-on?product=${product.id}&color=${encodeURIComponent(selectedColor)}&size=${selectedSize}`}
              className="w-full py-3.5 bg-gradient-to-r from-[#171717] via-[#2A2A2A] to-[#171717] text-white hover:opacity-95 transition-all text-xs uppercase tracking-[0.18em] font-bold flex items-center justify-center gap-2 shadow-md border border-[#333333] cursor-pointer"
            >
              <Camera className="w-4 h-4 text-[#C8411F]" />
              <span>3D Trying Studio — Wear Live with Camera</span>
              <Sparkles className="w-3.5 h-3.5 text-[#B9AA96]" />
            </Link>

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

      {/* Full-Screen Atelier Inspection Lightbox */}
      {isLightboxOpen && (
        <div
          className="fixed inset-0 z-50 bg-[#0A0A0A]/95 backdrop-blur-2xl flex flex-col justify-between p-4 sm:p-6 text-white select-none animate-in fade-in duration-200"
        >
          {/* Top Bar */}
          <div className="flex items-center justify-between border-b border-white/10 pb-4">
            <div>
              <h2 className="font-serif text-lg sm:text-xl text-white font-normal">
                {product.name}
              </h2>
              <p className="text-xs text-[#B9AA96] uppercase tracking-widest mt-0.5">
                4K Fabric &amp; Detail Inspection &bull; Colorway: {activeColor}
              </p>
            </div>
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline-block text-[11px] text-white/50 font-mono">
                Press ESC to close &bull; Scroll to Zoom
              </span>
              <button
                type="button"
                onClick={() => setIsLightboxOpen(false)}
                className="w-9 h-9 rounded-full border border-white/20 flex items-center justify-center text-white hover:bg-white hover:text-black transition-colors cursor-pointer"
                title="Close Lightbox (Esc)"
              >
                <X className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Center Zoom Canvas */}
          <div
            className="flex-1 overflow-hidden relative flex items-center justify-center p-4 my-2"
            onMouseMove={(e) => {
              const rect = e.currentTarget.getBoundingClientRect();
              const x = Math.max(0, Math.min(100, ((e.clientX - rect.left) / rect.width) * 100));
              const y = Math.max(0, Math.min(100, ((e.clientY - rect.top) / rect.height) * 100));
              setLightboxPos({ x, y });
            }}
            onWheel={(e) => {
              e.preventDefault();
              const delta = e.deltaY < 0 ? 25 : -25;
              setLightboxZoom((prev) => Math.min(400, Math.max(100, prev + delta)));
            }}
            onDoubleClick={() => setLightboxZoom((prev) => (prev > 100 ? 100 : 220))}
            style={{
              cursor: lightboxZoom > 100 ? 'crosshair' : 'zoom-in',
            }}
          >
            <div
              className="max-w-4xl max-h-full flex items-center justify-center transition-transform duration-150 ease-out"
              style={{
                transformOrigin: `${lightboxPos.x}% ${lightboxPos.y}%`,
                transform: `scale(${lightboxZoom / 100})`,
              }}
            >
              <img
                src={displayedImage}
                alt={`${product.name} in ${activeColor}`}
                className="max-h-[68vh] sm:max-h-[74vh] w-auto object-contain pointer-events-none select-none drop-shadow-2xl"
                draggable={false}
              />
            </div>
          </div>

          {/* Bottom Control Bar */}
          <div className="border-t border-white/10 pt-4 flex flex-col sm:flex-row items-center justify-between gap-4">
            {/* Color Swatches */}
            <div className="flex items-center gap-2">
              <span className="text-xs uppercase tracking-wider text-white/60">Color:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {product.colors.map((c) => (
                  <button
                    key={c.name}
                    onClick={() => {
                      setSelectedColor(c.name);
                      setHoveredColor(null);
                    }}
                    className={`w-6 h-6 rounded-full border transition-all cursor-pointer ${
                      activeColor.toLowerCase() === c.name.toLowerCase()
                        ? 'border-white scale-110 ring-2 ring-white ring-offset-2 ring-offset-black'
                        : 'border-white/30 hover:scale-105 opacity-70 hover:opacity-100'
                    }`}
                    style={{ backgroundColor: c.hex }}
                    title={c.name}
                  />
                ))}
              </div>
            </div>

            {/* Interactive Zoom Slider & Buttons */}
            <div className="bg-white/10 backdrop-blur-md border border-white/20 rounded-full px-4 py-2 flex items-center gap-3">
              <button
                type="button"
                onClick={() => setLightboxZoom((prev) => Math.max(100, prev - 25))}
                disabled={lightboxZoom <= 100}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 transition-all cursor-pointer"
                title="Zoom Out (-25%)"
              >
                <ZoomOut className="w-4 h-4" />
              </button>

              <input
                type="range"
                min={100}
                max={400}
                step={10}
                value={lightboxZoom}
                onChange={(e) => setLightboxZoom(Number(e.target.value))}
                className="w-28 sm:w-36 h-1.5 bg-white/20 rounded-lg appearance-none cursor-pointer accent-white"
                title="Zoom according to your will"
              />

              <span className="text-xs font-mono font-semibold text-white min-w-[40px] text-right">
                {lightboxZoom}%
              </span>

              <button
                type="button"
                onClick={() => setLightboxZoom((prev) => Math.min(400, prev + 25))}
                disabled={lightboxZoom >= 400}
                className="w-7 h-7 rounded-full flex items-center justify-center text-white hover:bg-white/20 disabled:opacity-30 transition-all cursor-pointer"
                title="Zoom In (+25%)"
              >
                <ZoomIn className="w-4 h-4" />
              </button>

              {lightboxZoom > 100 && (
                <button
                  type="button"
                  onClick={() => setLightboxZoom(100)}
                  className="px-2.5 py-1 text-[10px] uppercase font-bold tracking-wider bg-white text-black rounded-full hover:bg-white/90 transition-all cursor-pointer"
                  title="Reset Zoom to 100%"
                >
                  Reset
                </button>
              )}
            </div>

            {/* Gallery Thumbnails */}
            {galleryImages.length > 1 && (
              <div className="flex items-center gap-2">
                {galleryImages.map((img, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveGalleryIndex(idx)}
                    className={`w-12 h-14 bg-white/5 border rounded overflow-hidden cursor-pointer ${
                      activeGalleryIndex === idx
                        ? 'border-white ring-1 ring-white'
                        : 'border-white/20 opacity-60 hover:opacity-100'
                    }`}
                  >
                    <img src={img} alt="thumb" className="w-full h-full object-contain" />
                  </button>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      <SizingModal isOpen={isSizeGuideOpen} onClose={() => setIsSizeGuideOpen(false)} />
    </div>
  );
};
