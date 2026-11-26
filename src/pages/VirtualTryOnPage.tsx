import React, { useState, useRef, useEffect, useMemo, useCallback } from 'react';
import { useSearchParams, useNavigate, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  Camera,
  RotateCw,
  Sparkles,
  Download,
  ShoppingBag,
  ArrowRight,
  Ruler,
  Maximize2,
  RefreshCw,
  User,
  Layers,
  ChevronRight,
  ShieldCheck,
  Truck,
  Eye,
  AlertCircle,
  Video,
  VideoOff,
  Sun,
  Palette,
  CheckCircle2,
  Lock,
} from 'lucide-react';
import { startRazorpayCheckout } from '../services/razorpay';
import { Product } from '../types';
import { RealisticClothEngine } from '../components/studio/RealisticClothEngine';

const COLOR_TRANSPARENT_MAP: Record<string, string> = {
  'Ash Grey': '/images/cutouts/ash-grey.png',
  'White': '/images/cutouts/white.png',
  'Black': '/images/cutouts/black.png',
  'Obsidian Black': '/images/cutouts/black.png',
  'Ivory': '/images/cutouts/ivory.png',
  'Forest Green': '/images/cutouts/forest-green.png',
  'Olive Green': '/images/cutouts/forest-green.png',
  'Navy Blue': '/images/cutouts/navy-blue.png',
  'Navy': '/images/cutouts/navy-blue.png',
  'Brick Red': '/images/cutouts/brick-red.png',
  'Red': '/images/cutouts/red.png',
  'Crimson Red': '/images/cutouts/red.png',
  'Maroon': '/images/cutouts/brick-red.png',
  'Beige': '/images/cutouts/beige.png',
  'Ecru White': '/images/cutouts/white.png',
  'Warm Taupe': '/images/cutouts/beige.png',
  'Classic': '/images/cutouts/black.png',
};

export interface StudioBackdrop {
  id: string;
  name: string;
  url: string;
  lightingAmbiance: string;
  themeColor: string;
  recommendedFor: string;
  badge: string;
  overlayGradient?: string;
}

export const STUDIO_BACKDROPS: StudioBackdrop[] = [
  {
    id: 'sandstone-terrace',
    name: 'Sunlit Sandstone Terrace',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Warm Golden Hour Sunbeams & Dappled Light',
    themeColor: '#F4F1EA',
    recommendedFor: 'White, Ivory & Light Cotton Drapes',
    badge: 'Best for Ivory / White Tees',
  },
  {
    id: 'tokyo-brutalist',
    name: 'Tokyo Brutalist Concrete Loft',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Chiaroscuro Studio Keylight & High Contrast',
    themeColor: '#171717',
    recommendedFor: 'Obsidian Black, Charcoal & Noir Drops',
    badge: 'Best for Black & Dark Drops',
  },
  {
    id: 'london-night',
    name: 'Metropolitan London Night',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Cinematic Neon City Bokeh & Edge Rim Light',
    themeColor: '#0F172A',
    recommendedFor: 'Outerwear, Bombers & Utilitarian Jackets',
    badge: 'Best for Jackets & Outerwear',
  },
  {
    id: 'nordic-winter',
    name: 'Nordic Winter Atelier Courtyard',
    url: 'https://images.unsplash.com/photo-1517299321909-504289274659?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Soft Diffuse Studio Atmosphere & Fine Snow Aura',
    themeColor: '#334155',
    recommendedFor: 'Heavyweight Loopback Hoodies & Knits',
    badge: 'Best for Winter Hoodies',
  },
  {
    id: 'milan-runway',
    name: 'Milan Fashion Week Catwalk',
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Editorial Spotlight & Runway Dramatic Flare',
    themeColor: '#881337',
    recommendedFor: 'Crimson, Burgundy & Bold Runway Pieces',
    badge: 'Best for Red & Bold Colors',
  },
  {
    id: 'kyoto-zen',
    name: 'Kyoto Brutalist Slate Garden',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Overcast Organic Slate & Natural Earth Tone',
    themeColor: '#2D3748',
    recommendedFor: 'Vintage Olive, Khaki & Earth Tones',
    badge: 'Best for Olive & Earth Tones',
  },
];

// High-fashion clean model presets for 3D simulation
const MODEL_PRESETS = [
  {
    id: 'preset-man-athletic',
    name: "Men's Studio Torso (5'11\")",
    gender: 'Men',
    url: '/images/runway/men_tank_top.jpg',
    defaultY: 5,
    defaultScale: 1.05,
  },
  {
    id: 'preset-woman-oversized',
    name: "Women's Studio Torso (5'7\")",
    gender: 'Women',
    url: '/images/runway/women_tank_top.jpg',
    defaultY: 5,
    defaultScale: 0.95,
  },
  {
    id: 'preset-man-street',
    name: "Streetwear Standing Model",
    gender: 'Men',
    url: '/images/models/man_street_standing.jpg',
    defaultY: -5,
    defaultScale: 0.85,
  },
  {
    id: 'preset-mannequin',
    name: '3D Studio Mannequin Stand',
    gender: 'Neutral',
    url: '',
    defaultY: 0,
    defaultScale: 1.0,
  },
];

const FALLBACK_PRODUCT: Product = {
  id: 'printrove-1001005158',
  name: 'Oversized Plain T-Shirt',
  category: 'Oversized Tees',
  gender: 'Men',
  priceINR: 999,
  images: {
    primary:
      'https://cdn.printrove.com/merchants/301918/templates/1001005158/store-mockups/ivory/mockups/2b892250-b024-41c3-8437-37ce5f6ddafe-mockup-1440-734-ivory-1793564504489.webp',
    secondary: '',
    detail: '',
  },
  colors: [
    { name: 'Ivory', hex: '#fffff0' },
    { name: 'Black', hex: '#202020' },
    { name: 'Ash Grey', hex: '#c9c9c9' },
  ],
  sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
  fabric: '100% Super-Combed Bio-Washed Cotton (Printrove Atelier)',
  fitDescription: 'Generous oversized drop-shoulder drape engineered for enduring streetwear posture.',
  modelMeasurements: 'Model is 6\'1" wearing size L.',
  inStock: true,
};

export const VirtualTryOnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();
  const { products, formatPrice, addToCart, user } = useShop();

  const productIdParam = searchParams.get('product') || '';
  const colorParam = searchParams.get('color') || '';
  const sizeParam = searchParams.get('size') || 'L';

  // Selected Product & Options
  const [selectedProductId, setSelectedProductId] = useState<string>(productIdParam);
  const selectedProduct: Product = useMemo(() => {
    if (selectedProductId && products?.length) {
      const found = products.find((p) => p.id === selectedProductId);
      if (found) return found;
    }
    if (products && products.length > 0) return products[0];
    return FALLBACK_PRODUCT;
  }, [products, selectedProductId]);

  const [selectedColor, setSelectedColor] = useState<string>(
    colorParam || selectedProduct?.colors?.[0]?.name || 'Ash Grey'
  );
  const [selectedSize, setSelectedSize] = useState<string>(sizeParam);

  // STUDIO ENVIRONMENT STATE: Adaptive Background (Automatically configured according to garment & color)
  const [is3DVolumetricMode, setIs3DVolumetricMode] = useState<boolean>(false);

  // Automatic Background Intelligence: Dynamically sets studio ambiance based on the exact garment & color
  const currentBackdrop = useMemo(() => {
    const cat = (selectedProduct.category || '').toLowerCase();
    const name = (selectedProduct.name || '').toLowerCase();
    const c = (selectedColor || '').toLowerCase();

    // Jackets & Outerwear
    if (cat.includes('jacket') || name.includes('jacket') || name.includes('bomber') || name.includes('coat')) {
      return STUDIO_BACKDROPS[2]; // Metropolitan London Night
    }
    // Hoodies & Winterwear
    if (
      cat.includes('hoodie') ||
      cat.includes('sweatshirt') ||
      name.includes('hoodie') ||
      name.includes('sweatshirt') ||
      name.includes('fleece')
    ) {
      return STUDIO_BACKDROPS[3]; // Nordic Winter Atelier
    }
    // Color-based matching for T-shirts and tops
    if (c.includes('black') || c.includes('noir') || c.includes('charcoal')) {
      return STUDIO_BACKDROPS[1]; // Tokyo Brutalist Concrete (Contrast studio keylight)
    }
    if (
      c.includes('white') ||
      c.includes('ivory') ||
      c.includes('beige') ||
      c.includes('cream') ||
      c.includes('taupe')
    ) {
      return STUDIO_BACKDROPS[0]; // Sunlit Sandstone Terrace (Golden hour sunbeams)
    }
    if (c.includes('navy') || c.includes('blue')) {
      return STUDIO_BACKDROPS[2]; // Metropolitan London Night (Cinematic edge rim light)
    }
    if (c.includes('olive') || c.includes('green') || c.includes('forest') || c.includes('sage') || c.includes('khaki')) {
      return STUDIO_BACKDROPS[5]; // Kyoto Brutalist Garden (Organic slate & natural earth tone)
    }
    if (c.includes('red') || c.includes('brick') || c.includes('maroon') || c.includes('crimson') || c.includes('burgundy')) {
      return STUDIO_BACKDROPS[4]; // Milan Runway (Dramatic spotlight depth)
    }
    if (c.includes('grey') || c.includes('ash') || c.includes('gray')) {
      return STUDIO_BACKDROPS[1]; // Tokyo Brutalist Concrete (High contrast)
    }
    return STUDIO_BACKDROPS[0];
  }, [selectedProduct, selectedColor]);

  // LIVE CAMERA STATE
  const [isLiveCameraActive, setIsLiveCameraActive] = useState(false);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);
  const [capturedPhoto, setCapturedPhoto] = useState<string | null>(null);

  // 3D MODEL & CAMERA CONTROLS
  const [modelPresetIndex, setModelPresetIndex] = useState(0);
  const [turntableRotating, setTurntableRotating] = useState(false);
  const [rotationY, setRotationY] = useState<number>(0); // 360 orbit yaw
  const [rotationX, setRotationX] = useState<number>(0); // tilt
  const [garmentScale, setGarmentScale] = useState<number>(1.05);
  const [garmentPosY, setGarmentPosY] = useState<number>(40); // percentage offset - placed at natural torso/shoulder line
  const [garmentPosX, setGarmentPosX] = useState<number>(0);
  const [showBodyGuide, setShowBodyGuide] = useState<boolean>(true);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareSlider, setCompareSlider] = useState<number>(50);

  // AI Fit Recommendation State
  const [userHeightCm, setUserHeightCm] = useState<number>(178);
  const [userWeightKg, setUserWeightKg] = useState<number>(74);

  // Checkout & Cart Action
  const [isAdded, setIsAdded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [downloading, setDownloading] = useState(false);

  // Refs
  const videoRef = useRef<HTMLVideoElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const studioCanvasRef = useRef<HTMLDivElement>(null);
  const isDraggingRef = useRef(false);
  const lastMousePosRef = useRef({ x: 0, y: 0 });

  // Sync color when product changes
  useEffect(() => {
    if (selectedProduct && !selectedProduct.colors.some((c) => c.name === selectedColor)) {
      setSelectedColor(selectedProduct.colors[0]?.name || 'Ivory');
    }
  }, [selectedProduct]);

  // Dynamic garment image based on selected color (prioritizes clean transparent PNG cutouts)
  const activeGarmentImage = useMemo(() => {
    if (COLOR_TRANSPARENT_MAP[selectedColor]) {
      return COLOR_TRANSPARENT_MAP[selectedColor];
    }
    const variantMatch = selectedProduct?.variants?.find(
      (v: any) =>
        v.color?.toLowerCase() === selectedColor.toLowerCase() && (v.mockupFront || v.mockupBack)
    );
    if ((variantMatch as any)?.mockupFront) {
      return (variantMatch as any).mockupFront;
    }
    return selectedProduct?.images?.primary || '/images/products/ash-grey.png';
  }, [selectedProduct, selectedColor]);

  // Size scale adaptation
  const handleSizeChange = (newSize: string) => {
    setSelectedSize(newSize);
    const sizeScaleMap: Record<string, number> = {
      XS: 0.9,
      S: 0.96,
      M: 1.02,
      L: 1.08,
      XL: 1.15,
      '2XL': 1.22,
    };
    setGarmentScale(sizeScaleMap[newSize] || 1.05);
  };

  // Start Live Camera
  const startLiveCamera = async () => {
    try {
      setIsLiveCameraActive(true);
      setCapturedPhoto(null);
      const stream = await navigator.mediaDevices.getUserMedia({
        video: { facingMode: 'user', width: { ideal: 1280 }, height: { ideal: 720 } },
      });
      mediaStreamRef.current = stream;
      if (videoRef.current) {
        videoRef.current.srcObject = stream;
        videoRef.current.play();
      }
    } catch (err) {
      console.error('Camera access denied or unavailable:', err);
      alert('Unable to access live camera. Please ensure camera permissions are allowed in your browser.');
      setIsLiveCameraActive(false);
    }
  };

  // Stop Live Camera
  const stopLiveCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsLiveCameraActive(false);
    setCameraCountdown(null);
  };

  useEffect(() => {
    return () => {
      stopLiveCamera();
    };
  }, []);

  // Snap photo from live camera
  const captureCameraSnapshot = () => {
    setCameraCountdown(3);
    const interval = setInterval(() => {
      setCameraCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          performSnapshot();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const performSnapshot = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 1280;
      canvas.height = videoRef.current.videoHeight || 720;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setCapturedPhoto(dataUrl);
      }
      stopLiveCamera();
    }
  };

  // 360 Turntable Continuous Animation
  useEffect(() => {
    let animId: number;
    if (turntableRotating && !isLiveCameraActive) {
      const rotate = () => {
        setRotationY((prev) => (prev + 0.75) % 360);
        animId = requestAnimationFrame(rotate);
      };
      animId = requestAnimationFrame(rotate);
    }
    return () => cancelAnimationFrame(animId);
  }, [turntableRotating, isLiveCameraActive]);

  // Interactive Drag to Rotate 3D Model
  const handleMouseDown = (e: React.MouseEvent) => {
    if (isLiveCameraActive) return;
    isDraggingRef.current = true;
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDraggingRef.current || isLiveCameraActive) return;
    const deltaX = e.clientX - lastMousePosRef.current.x;
    const deltaY = e.clientY - lastMousePosRef.current.y;
    setRotationY((prev) => prev + deltaX * 0.6);
    setRotationX((prev) => Math.max(-15, Math.min(15, prev - deltaY * 0.3)));
    lastMousePosRef.current = { x: e.clientX, y: e.clientY };
  };

  const handleMouseUp = () => {
    isDraggingRef.current = false;
  };

  // Download Look with High-Fashion Branding
  const handleDownloadLook = () => {
    setDownloading(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const bgImg = new Image();
    bgImg.crossOrigin = 'anonymous';
    bgImg.src = capturedPhoto || currentBackdrop.url;

    bgImg.onload = () => {
      ctx.fillStyle = '#171717';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      const hRatio = canvas.width / bgImg.width;
      const vRatio = canvas.height / bgImg.height;
      const ratio = Math.max(hRatio, vRatio);
      const shiftX = (canvas.width - bgImg.width * ratio) / 2;
      const shiftY = (canvas.height - bgImg.height * ratio) / 2;
      ctx.drawImage(bgImg, 0, 0, bgImg.width, bgImg.height, shiftX, shiftY, bgImg.width * ratio, bgImg.height * ratio);

      // Studio Vignette
      const vignette = ctx.createRadialGradient(
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.25,
        canvas.width / 2,
        canvas.height / 2,
        canvas.width * 0.8
      );
      vignette.addColorStop(0, 'rgba(0,0,0,0)');
      vignette.addColorStop(1, 'rgba(0,0,0,0.55)');
      ctx.fillStyle = vignette;
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw Garment
      const gImg = new Image();
      gImg.crossOrigin = 'anonymous';
      gImg.src = activeGarmentImage;

      gImg.onload = () => {
        ctx.save();
        const gW = canvas.width * 0.72 * garmentScale;
        const gH = (gW / gImg.width) * gImg.height;
        const gX = canvas.width / 2 - gW / 2 + garmentPosX * 5;
        const gY = canvas.height * (garmentPosY / 100) - gH / 4;

        ctx.shadowColor = 'rgba(0, 0, 0, 0.55)';
        ctx.shadowBlur = 40;
        ctx.shadowOffsetY = 20;

        ctx.drawImage(gImg, gX, gY, gW, gH);
        ctx.restore();

        // Luxury Editorial Footer Card
        ctx.fillStyle = 'rgba(23, 23, 23, 0.88)';
        ctx.fillRect(0, canvas.height - 120, canvas.width, 120);

        ctx.fillStyle = '#F4F1EA';
        ctx.font = '300 32px "Playfair Display", Georgia, serif';
        ctx.fillText('TREVORI ATELIER', 50, canvas.height - 65);

        ctx.fillStyle = '#B9AA96';
        ctx.font = '600 13px sans-serif';
        ctx.fillText(
          `${selectedProduct.name.toUpperCase()} • ${selectedColor.toUpperCase()} • SIZE ${selectedSize}`,
          50,
          canvas.height - 35
        );

        ctx.fillStyle = '#FFFFFF';
        ctx.font = '500 13px sans-serif';
        ctx.fillText('3D VIRTUAL TRYING STUDIO • VERIFIED FIT', canvas.width - 380, canvas.height - 45);

        const link = document.createElement('a');
        link.download = `trevori-3d-look-${selectedColor.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setDownloading(false);
      };
    };
  };

  // Add to Shopping Bag
  const handleAddToBag = () => {
    addToCart(selectedProduct, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // SECURE CHECKOUT HANDLER
  const handleSecureCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const result = await startRazorpayCheckout({
        items: [
          {
            productId: selectedProduct.id,
            name: selectedProduct.name,
            size: selectedSize,
            color: selectedColor,
            quantity: 1,
            unitPriceINR: selectedProduct.priceINR,
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
      setCheckoutError(err?.message || 'Unable to complete secure checkout. Please try again.');
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 bg-[#F4F1EA] text-[#171717] font-sans">
      {/* Editorial Breadcrumbs */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#706B64] font-medium mb-6">
        <Link to="/" className="hover:text-[#171717] transition-colors">
          Home
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B9AA96]" />
        <Link to="/collections" className="hover:text-[#171717] transition-colors">
          Collections
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#B9AA96]" />
        <span className="text-[#171717] font-semibold">3D Trying Studio</span>
      </nav>

      {/* Studio Header */}
      <div className="mb-8 pb-6 border-b border-[#DDD8CE] flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-[#FFFFFF] border border-[#DDD8CE] text-[#171717] text-[10px] uppercase tracking-widest font-semibold mb-2 shadow-sm">
            <Sparkles className="w-3.5 h-3.5 text-[#C8411F]" />
            <span>Interactive 3D Trying Studio & Live Camera Fitting</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#171717] tracking-tight">
            Virtual 3D Trying Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#706B64] font-light mt-1 max-w-2xl">
            Experience our boxy architectural drape live. Turn on your camera to wear the clothes in real-time, or rotate our 3D model with adaptive studio backdrops tailored to each garment.
          </p>
        </div>

        {/* Studio Mode Switcher */}
        <div className="flex items-center gap-2 sm:gap-3 flex-wrap">
          <button
            onClick={() => {
              if (isLiveCameraActive) stopLiveCamera();
              setIs3DVolumetricMode(false);
            }}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
              !isLiveCameraActive && !is3DVolumetricMode
                ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                : 'bg-white text-[#706B64] border-[#DDD8CE] hover:text-[#171717]'
            }`}
          >
            <span>Runway Model Fit</span>
          </button>

          <button
            onClick={() => {
              if (isLiveCameraActive) stopLiveCamera();
              setIs3DVolumetricMode(true);
            }}
            className={`px-4 py-2.5 text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer flex items-center gap-1.5 ${
              is3DVolumetricMode && !isLiveCameraActive
                ? 'bg-[#171717] text-white border-[#171717] shadow-sm'
                : 'bg-white text-[#706B64] border-[#DDD8CE] hover:text-[#171717]'
            }`}
          >
            <Sparkles className="w-3.5 h-3.5 text-[#B9AA96]" />
            <span>3D Volumetric Studio</span>
          </button>

          <button
            onClick={() => {
              if (isLiveCameraActive) {
                stopLiveCamera();
              } else {
                setIs3DVolumetricMode(false);
                startLiveCamera();
              }
            }}
            className={`px-5 py-2.5 text-xs uppercase tracking-wider font-semibold flex items-center gap-2 transition-all cursor-pointer shadow-md border ${
              isLiveCameraActive
                ? 'bg-red-600 hover:bg-red-700 text-white border-red-700'
                : 'bg-[#C8411F] hover:bg-[#a83416] text-white border-[#C8411F]'
            }`}
          >
            {isLiveCameraActive ? (
              <>
                <VideoOff className="w-4 h-4" />
                <span>Stop Camera</span>
              </>
            ) : (
              <>
                <Video className="w-4 h-4" />
                <span>Wear Live with AI Camera</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Studio Viewport & Controls Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start">
        {/* Left Column: 3D Camera / Live Viewport (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div
            ref={studioCanvasRef}
            onMouseDown={handleMouseDown}
            onMouseMove={handleMouseMove}
            onMouseUp={handleMouseUp}
            className="relative aspect-[3/4] sm:aspect-[4/5] w-full rounded-sm overflow-hidden shadow-2xl flex items-center justify-center select-none border border-[#DDD8CE] cursor-grab active:cursor-grabbing"
            style={{
              backgroundColor: currentBackdrop.themeColor,
            }}
          >
            {/* Atmospheric Backdrop Background Image */}
            <img
              src={currentBackdrop.url}
              alt={currentBackdrop.name}
              className="absolute inset-0 w-full h-full object-cover filter brightness-90 contrast-105"
            />

            {/* Backdrop Lighting Ambiance Tint */}
            <div
              className="absolute inset-0 pointer-events-none transition-all duration-700"
              style={{
                background: currentBackdrop.overlayGradient || 'rgba(0,0,0,0.4)',
              }}
            />

            {/* LIVE CAMERA MODE: Direct Video Stream */}
            {isLiveCameraActive ? (
              <div className="absolute inset-0 z-20 overflow-hidden flex items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                {/* Live Camera Badge */}
                <div className="absolute top-4 left-4 z-30 flex items-center gap-2 px-3 py-1 bg-black/80 text-white text-[10px] uppercase tracking-widest font-semibold backdrop-blur-md border border-white/20">
                  <span className="w-2 h-2 rounded-full bg-red-500 animate-ping inline-block" />
                  <span>Live Trying Camera</span>
                </div>

                {/* Countdown overlay if capturing snapshot */}
                {cameraCountdown && (
                  <div className="absolute inset-0 z-40 bg-black/60 flex items-center justify-center">
                    <span className="text-7xl font-serif text-white animate-bounce font-bold">
                      {cameraCountdown}
                    </span>
                  </div>
                )}
              </div>
            ) : capturedPhoto ? (
              /* Captured user photo */
              <img
                src={capturedPhoto}
                alt="Your fitting photo"
                className="absolute inset-0 z-10 w-full h-full object-cover"
              />
            ) : MODEL_PRESETS[modelPresetIndex].id === 'preset-mannequin' ? (
              /* 3D Atelier Studio Pedestal: Adaptive Backdrop is 100% visible */
              <div className="absolute inset-0 z-10 flex flex-col items-center justify-end pointer-events-none pb-10">
                <div className="w-56 h-8 rounded-full bg-black/50 backdrop-blur-md shadow-2xl border border-white/20" />
              </div>
            ) : (
              /* 3D Runway Model Preset with Studio Lighting Blend */
              <div className="absolute inset-0 z-10 overflow-hidden">
                <img
                  src={MODEL_PRESETS[modelPresetIndex].url}
                  alt={MODEL_PRESETS[modelPresetIndex].name}
                  className="w-full h-full object-cover object-center opacity-85 filter contrast-110"
                  style={{
                    maskImage: 'radial-gradient(circle at 50% 45%, black 60%, transparent 95%)',
                    WebkitMaskImage: 'radial-gradient(circle at 50% 45%, black 60%, transparent 95%)',
                  }}
                />
              </div>
            )}

            {/* Split Screen Before/After Compare View Slider */}
            {compareMode && !isLiveCameraActive && (
              <div
                className="absolute inset-0 z-25 overflow-hidden border-r-2 border-white shadow-2xl pointer-events-none"
                style={{ width: `${compareSlider}%` }}
              >
                <img
                  src={capturedPhoto || MODEL_PRESETS[modelPresetIndex].url}
                  alt="Original base"
                  className="absolute inset-0 w-full h-full object-cover"
                  style={{ width: '100vw', maxWidth: 'none' }}
                />
              </div>
            )}

            {/* 3D Fitted Garment Layer with Real-Time Scaling & Orbit */}
            {(!compareMode || compareSlider < 95) && (
              isLiveCameraActive ? (
                <RealisticClothEngine
                  videoRef={videoRef}
                  isActive={isLiveCameraActive}
                  garmentImage={activeGarmentImage}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  garmentScale={garmentScale}
                  manualOffsetY={garmentPosY}
                  manualOffsetX={garmentPosX}
                  lightingAmbiance={currentBackdrop.lightingAmbiance}
                  is3DVolumetricMode={false}
                />
              ) : is3DVolumetricMode ? (
                <RealisticClothEngine
                  videoRef={videoRef}
                  isActive={false}
                  garmentImage={activeGarmentImage}
                  selectedColor={selectedColor}
                  selectedSize={selectedSize}
                  garmentScale={garmentScale}
                  manualOffsetY={garmentPosY}
                  manualOffsetX={garmentPosX}
                  lightingAmbiance={currentBackdrop.lightingAmbiance}
                  is3DVolumetricMode={true}
                />
              ) : (
                <div
                  className="absolute inset-0 z-30 flex items-center justify-center pointer-events-none"
                  style={{ perspective: '1000px' }}
                >
                  <div
                    style={{
                      transform: `perspective(1000px) rotateY(${rotationY}deg) rotateX(${rotationX}deg) scale(${garmentScale}) translate(${garmentPosX}px, ${garmentPosY - 38}%)`,
                      filter: 'drop-shadow(0px 20px 30px rgba(0,0,0,0.5))',
                    }}
                    className="relative w-[78%] sm:w-[70%] max-w-[420px] transition-transform duration-75 ease-out"
                  >
                    <img
                      src={activeGarmentImage}
                      alt={`${selectedProduct.name} in ${selectedColor}`}
                      className="w-full h-auto object-contain"
                    />

                    {/* Volumetric Body Curvature Overlay (Masked strictly to Garment Silhouette) */}
                    <div
                      className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-70"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(0,0,0,0.28) 0%, rgba(0,0,0,0.02) 20%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.02) 80%, rgba(0,0,0,0.32) 100%)',
                        maskImage: `url(${activeGarmentImage})`,
                        WebkitMaskImage: `url(${activeGarmentImage})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                      }}
                    />

                    {/* Collar Scoop Neck Shadow (Masked strictly to Garment Silhouette) */}
                    <div
                      className="absolute top-[6%] left-[32%] w-[36%] h-[16%] rounded-full pointer-events-none opacity-60"
                      style={{
                        background: 'radial-gradient(ellipse at 50% 30%, rgba(0,0,0,0.45) 0%, transparent 75%)',
                        maskImage: `url(${activeGarmentImage})`,
                        WebkitMaskImage: `url(${activeGarmentImage})`,
                        maskSize: 'contain',
                        WebkitMaskSize: 'contain',
                        maskRepeat: 'no-repeat',
                        WebkitMaskRepeat: 'no-repeat',
                        maskPosition: 'center',
                        WebkitMaskPosition: 'center',
                      }}
                    />
                  </div>
                </div>
              )
            )}

            {/* Shoulder & Torso Alignment Guide Grid */}
            {showBodyGuide && (
              <div className="absolute inset-0 z-35 pointer-events-none border border-white/20 flex flex-col justify-between p-6 select-none">
                <div className="border-t border-dashed border-white/50 text-[9px] font-mono text-white/90 font-bold pt-1 flex justify-between drop-shadow-sm">
                  <span>✦ DROP-SHOULDER ALIGNMENT</span>
                  <span>TREVORI ARCHITECTURAL CUT</span>
                </div>
                <div className="border-t border-dashed border-white/40 text-[9px] font-mono text-white/90 font-bold pt-1 flex justify-between drop-shadow-sm">
                  <span>CHEST FIT ({selectedSize})</span>
                  <span>RELAXED WAIST</span>
                </div>
              </div>
            )}

            {/* Top Right Floating Toolbar */}
            <div className="absolute top-4 right-4 z-40 flex flex-col gap-2">
              <button
                onClick={() => setShowBodyGuide(!showBodyGuide)}
                className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center text-xs transition-colors cursor-pointer shadow-md ${
                  showBodyGuide
                    ? 'bg-[#171717] text-white border-[#171717]'
                    : 'bg-white/80 border-white/40 text-[#171717] hover:bg-white'
                }`}
                title="Toggle Body Fit Alignment Grid"
              >
                <Layers className="w-4 h-4" />
              </button>

              {!isLiveCameraActive && (
                <button
                  onClick={() => setTurntableRotating(!turntableRotating)}
                  className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center text-xs transition-colors cursor-pointer shadow-md ${
                    turntableRotating
                      ? 'bg-[#C8411F] text-white border-[#C8411F]'
                      : 'bg-white/80 border-white/40 text-[#171717] hover:bg-white'
                  }`}
                  title="Toggle 360 Turntable Orbit"
                >
                  <RotateCw className={`w-4 h-4 ${turntableRotating ? 'animate-spin' : ''}`} />
                </button>
              )}

              <button
                onClick={handleDownloadLook}
                disabled={downloading}
                className="w-9 h-9 rounded-full bg-white/80 hover:bg-white border border-white/40 text-[#171717] flex items-center justify-center text-xs shadow-md transition-colors cursor-pointer"
                title="Download Fitted Look Snapshot"
              >
                <Download className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Floating Environment Indicator */}
            <div className="absolute bottom-4 left-4 z-30 bg-black/80 backdrop-blur-md px-3.5 py-1.5 border border-white/20 text-white rounded-none flex items-center gap-2">
              <Sun className="w-3.5 h-3.5 text-[#C8411F]" />
              <div className="text-left">
                <div className="text-[10px] font-bold uppercase tracking-wider">{currentBackdrop.name}</div>
                <div className="text-[9px] text-white/70">{currentBackdrop.lightingAmbiance}</div>
              </div>
            </div>

            {/* Live Camera Snapshot Button at Bottom Center */}
            {isLiveCameraActive && (
              <div className="absolute bottom-4 inset-x-0 z-40 flex justify-center">
                <button
                  onClick={captureCameraSnapshot}
                  className="px-6 py-2.5 bg-[#171717] hover:bg-black text-white text-xs uppercase tracking-widest font-semibold border border-white/30 shadow-xl flex items-center gap-2 cursor-pointer"
                >
                  <Camera className="w-4 h-4 text-[#C8411F]" />
                  <span>Snap Photo Look</span>
                </button>
              </div>
            )}
          </div>

          {/* Intelligent Studio Lighting & Background Status (Auto-configured to Garment) */}
          <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-3.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs shadow-xs">
            <div className="flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse shrink-0" />
              <span className="font-semibold text-[#171717] uppercase tracking-wider text-[11px]">
                Adaptive Backdrop:
              </span>
              <span className="text-[#706B64]">
                Auto-matched to <strong className="text-[#171717] capitalize">{selectedColor}</strong> ({currentBackdrop.name})
              </span>
            </div>
            <span className="text-[10px] uppercase font-mono tracking-wider text-[#B9AA96] bg-[#F4F1EA] px-2.5 py-1 border border-[#DDD8CE] rounded self-start sm:self-auto">
              {currentBackdrop.lightingAmbiance.split('&')[0]}
            </span>
          </div>
        </div>

        {/* Right Column: Studio Controls & SECURE CHECKOUT Dock (5 Cols) */}
        <div className="lg:col-span-5 space-y-6">
          {/* Main Product Card in Studio */}
          <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 shadow-sm">
            <div className="flex items-center justify-between text-[11px] uppercase tracking-widest text-[#706B64] mb-1">
              <span>{selectedProduct.category}</span>
              <span className="text-[#C8411F] font-semibold">{selectedProduct.gender}'s Collection</span>
            </div>

            <h2 className="font-serif text-2xl sm:text-3xl font-normal text-[#171717] tracking-tight">
              {selectedProduct.name}
            </h2>

            {/* Price Display */}
            <div className="mt-3 flex items-baseline gap-2 pb-4 border-b border-[#DDD8CE]">
              <span className="font-serif text-2xl font-bold text-[#171717]">
                {formatPrice(selectedProduct.priceINR)}
              </span>
              <span className="text-xs text-[#706B64]">
                Inclusive of express delivery & taxes
              </span>
            </div>

            {/* Colorway Selection with Instant Live Fit Update */}
            <div className="pt-4 space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider text-[#706B64] font-medium">Colorway:</span>
                <span className="font-bold text-[#171717]">{selectedColor}</span>
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                {selectedProduct.colors.map((color) => {
                  const isSelected = selectedColor === color.name;
                  return (
                    <button
                      key={color.name}
                      onClick={() => setSelectedColor(color.name)}
                      className={`w-7 h-7 rounded-full border transition-all cursor-pointer ${
                        isSelected
                          ? 'border-[#171717] scale-110 ring-2 ring-[#171717] ring-offset-2'
                          : 'border-[#DDD8CE] hover:scale-105'
                      }`}
                      style={{ backgroundColor: color.hex }}
                      title={color.name}
                    />
                  );
                })}
              </div>
            </div>

            {/* Garment Size Selection */}
            <div className="pt-4 border-t border-[#DDD8CE] space-y-2">
              <div className="flex items-center justify-between text-xs">
                <span className="uppercase tracking-wider text-[#706B64] font-medium">
                  Select Size (Adjusts 3D Drape):
                </span>
                <span className="text-[11px] uppercase tracking-wider text-[#C8411F] font-semibold">
                  Scale: {Math.round(garmentScale * 100)}%
                </span>
              </div>
              <div className="grid grid-cols-6 gap-2">
                {selectedProduct.sizes.map((size) => {
                  const isSelected = selectedSize === size;
                  return (
                    <button
                      key={size}
                      onClick={() => handleSizeChange(size)}
                      className={`py-2 text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
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

            {/* Fine 3D Positioning Controls */}
            <div className="pt-4 border-t border-[#DDD8CE] space-y-3">
              <div className="flex items-center justify-between text-xs font-semibold uppercase tracking-wider text-[#706B64]">
                <span>Fine Drape Alignment</span>
                <button
                  onClick={() => {
                    setGarmentScale(1.05);
                    setGarmentPosY(40);
                    setGarmentPosX(0);
                    setRotationY(0);
                  }}
                  className="text-[11px] text-[#C8411F] hover:underline"
                >
                  Reset Position
                </button>
              </div>

              <div className="space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-[#706B64]">Torso Height / Vertical:</span>
                  <input
                    type="range"
                    min="15"
                    max="50"
                    value={garmentPosY}
                    onChange={(e) => setGarmentPosY(Number(e.target.value))}
                    className="w-36 accent-[#171717] cursor-pointer"
                  />
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-[#706B64]">3D Rotation Angle:</span>
                  <input
                    type="range"
                    min="-45"
                    max="45"
                    value={rotationY}
                    onChange={(e) => setRotationY(Number(e.target.value))}
                    className="w-36 accent-[#171717] cursor-pointer"
                  />
                </div>
              </div>
            </div>

            {/* Model Presets (when camera is not active) */}
            {!isLiveCameraActive && (
              <div className="pt-4 border-t border-[#DDD8CE] space-y-2">
                <span className="text-xs uppercase tracking-wider font-medium text-[#706B64] block">
                  Runway Model Silhouette:
                </span>
                <div className="grid grid-cols-2 gap-2">
                  {MODEL_PRESETS.map((preset, idx) => (
                    <button
                      key={preset.id}
                      onClick={() => {
                        setModelPresetIndex(idx);
                        setCapturedPhoto(null);
                      }}
                      className={`px-2.5 py-2 text-[11px] text-left uppercase tracking-wider font-medium border transition-colors cursor-pointer ${
                        modelPresetIndex === idx && !capturedPhoto
                          ? 'border-[#171717] bg-[#171717] text-white'
                          : 'border-[#DDD8CE] bg-white text-[#403D39] hover:border-[#171717]'
                      }`}
                    >
                      {preset.name}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* SECURE CHECKOUT BUTTON DOCK */}
            <div className="pt-6 border-t border-[#DDD8CE] space-y-3">
              {/* PRIMARY ACTION: SECURE CHECKOUT */}
              <button
                onClick={handleSecureCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-[#171717] hover:bg-black text-white text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 shadow-lg transition-all cursor-pointer hover:scale-[1.01] active:scale-[0.99]"
              >
                <Lock className="w-4 h-4 text-emerald-400" />
                <span>
                  {isCheckingOut
                    ? 'Opening Secure Payment...'
                    : `Secure Checkout • ${formatPrice(selectedProduct.priceINR)}`}
                </span>
                <ArrowRight className="w-4 h-4 ml-1" />
              </button>

              {/* SECONDARY ACTION: ADD TO SHOPPING BAG */}
              <button
                onClick={handleAddToBag}
                className="w-full py-3 bg-[#FFFFFF] border border-[#171717] hover:bg-[#F4F1EA] text-[#171717] text-xs uppercase tracking-[0.18em] font-semibold flex items-center justify-center gap-2 transition-colors cursor-pointer"
              >
                <ShoppingBag className="w-4 h-4" />
                <span>{isAdded ? 'Fitted Look Added to Bag ✓' : 'Add to Shopping Bag'}</span>
              </button>

              {checkoutError && (
                <div className="p-3 bg-red-50 border border-red-200 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}
            </div>

            {/* Guarantees & Features */}
            <div className="pt-5 mt-4 border-t border-[#DDD8CE]/60 grid grid-cols-2 gap-3 text-[10px] text-[#706B64]">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Encrypted Razorpay Checkout</span>
              </div>
              <div className="flex items-center gap-2">
                <Truck className="w-3.5 h-3.5 text-[#171717]" />
                <span>Complimentary Express Shipping</span>
              </div>
              <div className="flex items-center gap-2">
                <CheckCircle2 className="w-3.5 h-3.5 text-[#171717]" />
                <span>100% Bio-Washed French Terry</span>
              </div>
              <div className="flex items-center gap-2">
                <RotateCw className="w-3.5 h-3.5 text-[#171717]" />
                <span>7-Day Hassle-Free Size Exchange</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
