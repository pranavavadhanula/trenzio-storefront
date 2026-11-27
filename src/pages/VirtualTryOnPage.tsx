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
  contrastTarget: 'light-clothes' | 'dark-clothes' | 'earth-clothes' | 'vibrant-clothes' | 'universal';
  recommendedFor: string;
  badge: string;
  contrastReason: string;
  overlayGradient?: string;
}

export const STUDIO_BACKDROPS: StudioBackdrop[] = [
  {
    id: 'tokyo-brutalist',
    name: 'Tokyo Dark Brutalist Concrete Loft',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Chiaroscuro Studio Keylight & Deep Charcoal Shadows',
    themeColor: '#121212',
    contrastTarget: 'light-clothes',
    recommendedFor: 'White, Ivory, Beige & Ash Grey Garments',
    badge: 'High-Contrast for Ivory & White',
    contrastReason: 'Dark architectural concrete creates striking chiaroscuro contrast against light cotton, sculpting the drop-shoulder drape.',
    overlayGradient: 'radial-gradient(circle at 50% 40%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.65) 100%)',
  },
  {
    id: 'sandstone-terrace',
    name: 'Sunlit Warm Sandstone Colonnade',
    url: 'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Golden Hour Sunbeams & Luminous Alabaster Stone',
    themeColor: '#EBE7DF',
    contrastTarget: 'dark-clothes',
    recommendedFor: 'Obsidian Black, Charcoal, Navy & Dark Drops',
    badge: 'High-Contrast for Black & Navy',
    contrastReason: 'Bright warm sandstone carves out deep black silhouettes, accentuating the boxy streetwear posture and fabric density.',
    overlayGradient: 'linear-gradient(180deg, rgba(244,241,234,0.1) 0%, rgba(0,0,0,0.3) 100%)',
  },
  {
    id: 'london-night',
    name: 'Metropolitan London Midnight',
    url: 'https://images.unsplash.com/photo-1519501025264-65ba15a82390?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Cinematic City Bokeh & Cool Cyan Edge Rim Light',
    themeColor: '#0A0F1D',
    contrastTarget: 'light-clothes',
    recommendedFor: 'Ivory Streetwear, Outerwear & Ash Grey',
    badge: 'Cinematic Night Contrast',
    contrastReason: 'Nocturnal skyline bokeh casts subtle neon rim light that highlights the garment borders and user posture.',
    overlayGradient: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.2) 0%, rgba(10,15,29,0.8) 100%)',
  },
  {
    id: 'milan-runway',
    name: 'Milan Fashion Atelier Spotlight',
    url: 'https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Directional Runway Keylight & Deep Crimson Flare',
    themeColor: '#4A0E17',
    contrastTarget: 'light-clothes',
    recommendedFor: 'Ivory, White, Ash Grey & Streetwear Drops',
    badge: 'Editorial Catwalk Contrast',
    contrastReason: 'Dramatic catwalk spotlights draw immediate focus to the chest drape and heavyweight 240 GSM collar.',
    overlayGradient: 'radial-gradient(circle at 50% 45%, rgba(0,0,0,0.1) 0%, rgba(0,0,0,0.7) 100%)',
  },
  {
    id: 'kyoto-zen',
    name: 'Kyoto Warm Hinoki Cedar Garden',
    url: 'https://images.unsplash.com/photo-1503899036084-c55cdd92da26?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Overcast Organic Warmth & Natural Wood Tones',
    themeColor: '#2B2621',
    contrastTarget: 'earth-clothes',
    recommendedFor: 'Forest Green, Olive, Navy Blue & Earth Tones',
    badge: 'Organic Earth Contrast',
    contrastReason: 'Warm natural cedar wood and tranquil stone create a sophisticated earthy contrast that elevates green and muted tones.',
    overlayGradient: 'radial-gradient(circle at 50% 50%, rgba(0,0,0,0.15) 0%, rgba(0,0,0,0.6) 100%)',
  },
  {
    id: 'nordic-winter',
    name: 'Nordic Crisp Gallery Studio',
    url: 'https://images.unsplash.com/photo-1517299321909-504289274659?auto=format&fit=crop&w=1600&q=85',
    lightingAmbiance: 'Soft Diffuse Natural Skylight & Cool Mist',
    themeColor: '#1E293B',
    contrastTarget: 'vibrant-clothes',
    recommendedFor: 'Brick Red, Crimson, Maroon & Vibrant Drops',
    badge: 'Cool Contrast for Red & Warm',
    contrastReason: 'Cool overcast slate grey tones create vivid complementary contrast with warm red, making the color pop intensely.',
    overlayGradient: 'linear-gradient(180deg, rgba(0,0,0,0.2) 0%, rgba(15,23,42,0.7) 100%)',
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

  // STUDIO ENVIRONMENT STATE: Adaptive High-Contrast Background
  const [activeBackdropId, setActiveBackdropId] = useState<string>('auto');
  const [is3DVolumetricMode, setIs3DVolumetricMode] = useState<boolean>(false);

  // Dynamic High-Contrast Studio Intelligence:
  // Automatically computes the ideal high-contrast backdrop based on garment color luminance & style
  const recommendedContrastBackdrop = useMemo(() => {
    const c = (selectedColor || '').toLowerCase();
    const cat = (selectedProduct.category || '').toLowerCase();
    const name = (selectedProduct.name || '').toLowerCase();

    // 1. Light garments (White, Ivory, Beige, Cream, Ash Grey, Ecru)
    // Contrast: High-end dark chiaroscuro backdrop so the light garment pops!
    if (
      c.includes('white') ||
      c.includes('ivory') ||
      c.includes('beige') ||
      c.includes('cream') ||
      c.includes('ash') ||
      c.includes('taupe')
    ) {
      return STUDIO_BACKDROPS[0]; // Tokyo Dark Brutalist Concrete Loft (#121212)
    }

    // 2. Dark garments (Black, Obsidian, Charcoal, Noir)
    // Contrast: Luminous warm sandstone colonnade so the dark silhouette is sculpted!
    if (
      c.includes('black') ||
      c.includes('noir') ||
      c.includes('charcoal') ||
      c.includes('obsidian')
    ) {
      return STUDIO_BACKDROPS[1]; // Sunlit Warm Sandstone Colonnade (#EBE7DF)
    }

    // 3. Dark Navy / Blue
    if (c.includes('navy') || c.includes('blue')) {
      return STUDIO_BACKDROPS[1]; // Sunlit Sandstone Colonnade (High-contrast against deep navy)
    }

    // 4. Vibrant & Warm garments (Brick Red, Crimson, Maroon)
    // Contrast: Cool gallery slate makes the warm red vibrant and commanding!
    if (c.includes('red') || c.includes('brick') || c.includes('maroon') || c.includes('crimson') || c.includes('burgundy')) {
      return STUDIO_BACKDROPS[5]; // Nordic Crisp Gallery Studio
    }

    // 5. Earth tones (Forest Green, Olive, Sage, Khaki)
    // Contrast: Kyoto Hinoki cedar provides warm organic harmony!
    if (c.includes('green') || c.includes('olive') || c.includes('forest') || c.includes('sage') || c.includes('khaki')) {
      return STUDIO_BACKDROPS[4]; // Kyoto Warm Hinoki Cedar Garden
    }

    // Jackets & Outerwear
    if (cat.includes('jacket') || name.includes('jacket') || name.includes('bomber') || name.includes('coat')) {
      return STUDIO_BACKDROPS[2]; // Metropolitan London Midnight
    }

    return STUDIO_BACKDROPS[0];
  }, [selectedProduct, selectedColor]);

  const currentBackdrop = useMemo(() => {
    if (activeBackdropId !== 'auto') {
      const found = STUDIO_BACKDROPS.find((b) => b.id === activeBackdropId);
      if (found) return found;
    }
    return recommendedContrastBackdrop;
  }, [activeBackdropId, recommendedContrastBackdrop]);

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
                      transform: `perspective(1000px) rotateY(${rotationY}deg) rotateX(${rotationX}deg) scale(${garmentScale}) translate(${garmentPosX}px, ${garmentPosY - 56}%)`,
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
                      className="absolute inset-0 pointer-events-none mix-blend-multiply opacity-65"
                      style={{
                        background:
                          'linear-gradient(90deg, rgba(0,0,0,0.25) 0%, rgba(0,0,0,0.02) 20%, rgba(255,255,255,0.08) 50%, rgba(0,0,0,0.02) 80%, rgba(0,0,0,0.28) 100%)',
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

          {/* Intelligent High-Contrast Studio Background Engine */}
          <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-4 space-y-3 shadow-xs">
            {/* Header Status & Contrast Target */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs pb-2 border-b border-[#DDD8CE]">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse shrink-0" />
                <span className="font-semibold text-[#171717] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                  <Palette className="w-3.5 h-3.5 text-[#C8411F]" />
                  <span>High-Contrast Backdrop:</span>
                </span>
                <span className="text-[#171717] font-semibold">
                  {currentBackdrop.name}
                </span>
              </div>
              <span className="text-[10px] uppercase font-mono tracking-wider text-[#171717] bg-[#F4F1EA] px-2.5 py-1 border border-[#DDD8CE] rounded self-start sm:self-auto font-semibold">
                {currentBackdrop.badge}
              </span>
            </div>

            {/* Contrast Marketing & Visual Appeal Note */}
            <div className="text-[11px] text-[#706B64] font-light leading-relaxed bg-[#F4F1EA]/60 p-2.5 border-l-2 border-[#171717]">
              <p>
                <strong className="text-[#171717] font-medium">Visual Contrast Optimization: </strong>
                {currentBackdrop.contrastReason}
              </p>
            </div>

            {/* Backdrop Switcher Options with Direct Previews */}
            <div className="pt-1">
              <div className="text-[10px] uppercase font-mono tracking-wider text-[#706B64] mb-2 font-medium">
                Choose Contrast Environment:
              </div>
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  onClick={() => setActiveBackdropId('auto')}
                  className={`px-3 py-1.5 text-xs uppercase tracking-wider font-semibold border transition-all cursor-pointer ${
                    activeBackdropId === 'auto'
                      ? 'border-[#171717] bg-[#171717] text-white shadow-sm'
                      : 'border-[#DDD8CE] bg-white text-[#706B64] hover:border-[#171717]'
                  }`}
                  title="Automatically pairs with the ideal contrast backdrop whenever you select a new color"
                >
                  ✦ Auto High-Contrast ({recommendedContrastBackdrop.name.split(' ')[0]})
                </button>

                {STUDIO_BACKDROPS.map((backdrop) => (
                  <button
                    key={backdrop.id}
                    type="button"
                    onClick={() => setActiveBackdropId(backdrop.id)}
                    className={`px-3 py-1.5 text-xs uppercase tracking-wider font-medium border transition-all cursor-pointer flex items-center gap-1.5 ${
                      activeBackdropId === backdrop.id
                        ? 'border-[#171717] bg-[#171717] text-white shadow-sm'
                        : 'border-[#DDD8CE] bg-white text-[#706B64] hover:border-[#171717]'
                    }`}
                  >
                    <span>{backdrop.name.split(' ')[0]} {backdrop.name.split(' ')[1]}</span>
                  </button>
                ))}
              </div>
            </div>
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
