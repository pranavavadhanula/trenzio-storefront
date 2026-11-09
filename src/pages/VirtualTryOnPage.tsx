import React, { useState, useRef, useEffect, useMemo } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  Upload,
  Camera,
  RotateCw,
  Sparkles,
  Sliders,
  Download,
  Check,
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
  Eye
} from 'lucide-react';
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

// High-fashion clean model presets for immediate preview
const MODEL_PRESETS = [
  {
    id: 'preset-man-athletic',
    name: 'Men Athletic (5\'11")',
    gender: 'Men',
    url: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=1000&q=85',
    defaultY: 28,
    defaultScale: 1.05,
  },
  {
    id: 'preset-man-street',
    name: 'Men Streetwear (5\'9")',
    gender: 'Men',
    url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=1000&q=85',
    defaultY: 30,
    defaultScale: 1.0,
  },
  {
    id: 'preset-woman-oversized',
    name: 'Women Oversized (5\'7")',
    gender: 'Women',
    url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=1000&q=85',
    defaultY: 32,
    defaultScale: 0.95,
  },
  {
    id: 'preset-mannequin',
    name: 'Atelier Tailor Mannequin',
    gender: 'Neutral',
    url: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85',
    defaultY: 30,
    defaultScale: 1.0,
  },
];

export const VirtualTryOnPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { products, formatPrice, addToCart } = useShop();

  const productIdParam = searchParams.get('product') || '44119548559395';
  const colorParam = searchParams.get('color') || 'Ash Grey';
  const sizeParam = searchParams.get('size') || 'L';

  // Selected Product & Options
  const [selectedProductId, setSelectedProductId] = useState(productIdParam);
  const selectedProduct = useMemo(() => {
    return products.find((p) => p.id === selectedProductId) || products[0];
  }, [products, selectedProductId]);

  const [selectedColor, setSelectedColor] = useState(colorParam);
  const [selectedSize, setSelectedSize] = useState<string>(sizeParam);

  // User Photo & Viewport State
  const [activePhotoUrl, setActivePhotoUrl] = useState<string>(MODEL_PRESETS[0].url);
  const [photoSourceType, setPhotoSourceType] = useState<'preset' | 'upload' | 'camera'>('preset');
  const [isCameraActive, setIsCameraActive] = useState(false);
  const [cameraCountdown, setCameraCountdown] = useState<number | null>(null);

  // 3D Fitting & Simulation Parameters
  const [garmentScale, setGarmentScale] = useState<number>(1.05);
  const [garmentPosY, setGarmentPosY] = useState<number>(30); // percentage offset from top
  const [garmentPosX, setGarmentPosX] = useState<number>(0);
  const [rotationY, setRotationY] = useState<number>(0); // 3D yaw perspective
  const [rotationX, setRotationX] = useState<number>(0); // 3D tilt
  const [blendMode, setBlendMode] = useState<'normal' | 'multiply' | 'hard-light'>('normal');
  const [opacity, setOpacity] = useState<number>(1.0);
  const [showBodyGuide, setShowBodyGuide] = useState<boolean>(true);
  const [compareMode, setCompareMode] = useState<boolean>(false);
  const [compareSlider, setCompareSlider] = useState<number>(50);

  // AI Fit Recommendation State
  const [userHeightCm, setUserHeightCm] = useState<number>(178);
  const [userWeightKg, setUserWeightKg] = useState<number>(74);
  const [fitPreference, setFitPreference] = useState<'oversized' | 'regular'>('oversized');

  // Checkout & Cart Action
  const [isAdded, setIsAdded] = useState(false);
  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [downloading, setDownloading] = useState(false);

  // Refs
  const fileInputRef = useRef<HTMLInputElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);

  // Sync color when product changes
  useEffect(() => {
    if (selectedProduct && !selectedProduct.colors.some((c) => c.name === selectedColor)) {
      setSelectedColor(selectedProduct.colors[0]?.name || 'Ash Grey');
    }
  }, [selectedProduct]);

  // Adjust garment scale based on size selection
  const handleSizeChange = (newSize: string) => {
    setSelectedSize(newSize);
    const sizeScaleMap: Record<string, number> = {
      'XS': 0.90,
      'S': 0.96,
      'M': 1.02,
      'L': 1.08,
      'XL': 1.15,
      '2XL': 1.22,
    };
    setGarmentScale(sizeScaleMap[newSize] || 1.05);
  };

  // AI recommended size calculation
  const recommendedSize = useMemo(() => {
    // Formula calibrated to Printrove 350 GSM chest measurements
    const bmi = userWeightKg / Math.pow(userHeightCm / 100, 2);
    if (bmi < 20) return fitPreference === 'oversized' ? 'M' : 'S';
    if (bmi < 23) return fitPreference === 'oversized' ? 'L' : 'M';
    if (bmi < 27) return fitPreference === 'oversized' ? 'XL' : 'L';
    return fitPreference === 'oversized' ? '2XL' : 'XL';
  }, [userHeightCm, userWeightKg, fitPreference]);

  // Current Garment Mockup Image
  const activeGarmentImage = useMemo(() => {
    if (selectedProduct.id === '44119548559395') {
      return COLOR_IMAGE_MAP[selectedColor] || selectedProduct.images.primary;
    }
    return selectedProduct.images.primary;
  }, [selectedProduct, selectedColor]);

  // Handle User File Upload
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          setActivePhotoUrl(event.target.result as string);
          setPhotoSourceType('upload');
          setShowBodyGuide(true);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  // Handle Camera Stream
  const startCamera = async () => {
    try {
      setIsCameraActive(true);
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
      alert('Unable to access camera. You can upload a photo from your files instead.');
      setIsCameraActive(false);
    }
  };

  const captureCameraPhoto = () => {
    setCameraCountdown(3);
    const interval = setInterval(() => {
      setCameraCountdown((prev) => {
        if (prev === 1) {
          clearInterval(interval);
          snapPhoto();
          return null;
        }
        return prev ? prev - 1 : null;
      });
    }, 1000);
  };

  const snapPhoto = () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
      canvas.width = videoRef.current.videoWidth || 720;
      canvas.height = videoRef.current.videoHeight || 960;
      const ctx = canvas.getContext('2d');
      if (ctx) {
        // Mirror image for front selfie camera
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
        ctx.drawImage(videoRef.current, 0, 0, canvas.width, canvas.height);
        const dataUrl = canvas.toDataURL('image/png');
        setActivePhotoUrl(dataUrl);
        setPhotoSourceType('camera');
      }
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    setIsCameraActive(false);
    setCameraCountdown(null);
  };

  useEffect(() => {
    return () => {
      stopCamera();
    };
  }, []);

  // Reset 3D positioning
  const handleResetControls = () => {
    setGarmentScale(1.05);
    setGarmentPosY(30);
    setGarmentPosX(0);
    setRotationY(0);
    setRotationX(0);
  };

  // Export & Download Composite Look
  const handleDownloadLook = () => {
    setDownloading(true);
    const canvas = document.createElement('canvas');
    canvas.width = 1200;
    canvas.height = 1500;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Load user photo
    const userImg = new Image();
    userImg.crossOrigin = 'anonymous';
    userImg.src = activePhotoUrl;

    userImg.onload = () => {
      // Draw user background
      ctx.fillStyle = '#0a0a0a';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Aspect fill photo
      const hRatio = canvas.width / userImg.width;
      const vRatio = canvas.height / userImg.height;
      const ratio = Math.max(hRatio, vRatio);
      const centerShiftX = (canvas.width - userImg.width * ratio) / 2;
      const centerShiftY = (canvas.height - userImg.height * ratio) / 2;
      ctx.drawImage(userImg, 0, 0, userImg.width, userImg.height, centerShiftX, centerShiftY, userImg.width * ratio, userImg.height * ratio);

      // Load garment
      const garmentImg = new Image();
      garmentImg.crossOrigin = 'anonymous';
      garmentImg.src = activeGarmentImage;

      garmentImg.onload = () => {
        ctx.save();
        const garmentW = canvas.width * 0.72 * garmentScale;
        const garmentH = (garmentW / garmentImg.width) * garmentImg.height;
        const gX = canvas.width / 2 - garmentW / 2 + (garmentPosX * 5);
        const gY = (canvas.height * (garmentPosY / 100)) - garmentH / 4;

        // Shadow under garment
        ctx.shadowColor = 'rgba(0, 0, 0, 0.45)';
        ctx.shadowBlur = 35;
        ctx.shadowOffsetX = 0;
        ctx.shadowOffsetY = 15;

        ctx.drawImage(garmentImg, gX, gY, garmentW, garmentH);
        ctx.restore();

        // Luxury Branded Watermark (Zara Luxury Editorial Standard)
        ctx.fillStyle = 'rgba(10, 10, 10, 0.75)';
        ctx.fillRect(0, canvas.height - 110, canvas.width, 110);

        ctx.fillStyle = '#c5a880';
        ctx.font = '300 36px "Cormorant Garamond", Georgia, serif';
        ctx.letterSpacing = '12px';
        ctx.fillText('T R E N Z I O', 50, canvas.height - 55);

        ctx.fillStyle = '#f5f5f4';
        ctx.font = '400 16px "Plus Jakarta Sans", sans-serif';
        ctx.letterSpacing = '3px';
        ctx.fillText(`${selectedProduct.name.toUpperCase()} &bull; ${selectedColor.toUpperCase()} &bull; SIZE ${selectedSize}`, 50, canvas.height - 25);

        ctx.fillStyle = '#c5a880';
        ctx.font = 'bold 16px "Plus Jakarta Sans", sans-serif';
        ctx.fillText('350 GSM HEAVYWEIGHT DROP &bull; INDIA', canvas.width - 420, canvas.height - 40);

        // Download trigger
        const link = document.createElement('a');
        link.download = `trenzio-virtual-tryon-${selectedColor.toLowerCase().replace(/\s+/g, '-')}.png`;
        link.href = canvas.toDataURL('image/png');
        link.click();
        setDownloading(false);
      };
    };
  };

  // Add Fitted Look to Bag
  const handleAddToBag = () => {
    addToCart(selectedProduct, selectedSize, selectedColor);
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  // Instant Checkout via Shopify
  const handleInstantBuy = async () => {
    setIsCheckingOut(true);
    try {
      const checkoutUrl = await createShopifyCheckout([
        {
          variantId: selectedProduct.id.startsWith('prod_') ? '44119548559395' : selectedProduct.id,
          quantity: 1,
        },
      ], 'IN');
      window.location.href = checkoutUrl;
    } catch (err: any) {
      window.location.href = `https://0g1xp7-qd.myshopify.com/cart/${selectedProduct.id}:1?currency=INR`;
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen py-8 sm:py-14 max-w-7xl mx-auto px-4 sm:px-8 bg-[#F8F5EE] text-[#0B1B3D]">
      {/* Breadcrumb Navigation */}
      <nav className="flex items-center space-x-2 text-xs uppercase tracking-widest text-[#2A3C5E]/70 font-mono mb-6">
        <Link to="/" className="hover:text-atelier-coral transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <Link to="/collections/all" className="hover:text-atelier-coral transition-colors">Collections</Link>
        <ChevronRight className="w-3.5 h-3.5" />
        <span className="text-atelier-coral font-bold">3D Virtual Fitting Studio</span>
      </nav>

      {/* Header */}
      <div className="mb-8 pb-6 border-b border-[#0B1B3D]/10 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-atelier-coral/10 border border-atelier-coral/30 text-atelier-coral text-[10px] uppercase tracking-widest font-mono font-medium mb-2">
            <Sparkles className="w-3.5 h-3.5" />
            <span>Interactive 3D Fit & Try-On Technology</span>
          </div>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#0B1B3D] tracking-tight">
            Virtual Dressing Studio
          </h1>
          <p className="text-xs sm:text-sm text-[#2A3C5E]/80 font-light mt-1">
            Upload your photo or choose a model to see how Trenzio's 350 GSM boxy streetwear cuts drape on your body before buying.
          </p>
        </div>

        {/* Action Controls for Photo Input */}
        <div className="flex flex-wrap items-center gap-2">
          {/* Hidden File Input */}
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept="image/*"
            className="hidden"
          />

          <button
            onClick={() => fileInputRef.current?.click()}
            className="px-4 py-2.5 bg-[#0B1B3D] border border-[#1E3B75] text-[#F8F5EE] hover:bg-atelier-coral hover:border-atelier-coral transition-colors text-xs uppercase tracking-wider font-mono flex items-center gap-2 cursor-pointer shadow-md"
            title="Upload your own full-body or upper-body photo"
          >
            <Upload className="w-4 h-4 text-atelier-coral" />
            <span>Upload Your Photo</span>
          </button>

          <button
            onClick={isCameraActive ? stopCamera : startCamera}
            className="px-4 py-2.5 bg-[#0B1B3D] border border-[#1E3B75] text-[#F8F5EE] hover:bg-atelier-coral hover:border-atelier-coral transition-colors text-xs uppercase tracking-wider font-mono flex items-center gap-2 cursor-pointer shadow-md"
            title="Snap a live selfie using your webcam"
          >
            <Camera className="w-4 h-4 text-emerald-400" />
            <span>{isCameraActive ? 'Cancel Camera' : 'Live Selfie Camera'}</span>
          </button>
        </div>
      </div>

      {/* Main Studio Workspace Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
        {/* Left Column: Interactive 3D Fitting Mirror (7 Cols) */}
        <div className="lg:col-span-7 space-y-4">
          {/* Fitting Canvas Viewport */}
          <div className="relative aspect-[3/4] sm:aspect-[4/5] w-full bg-[#0B1B3D] border-2 border-[#1E3B75] overflow-hidden shadow-2xl flex items-center justify-center select-none">
            {/* Live Camera View Mode */}
            {isCameraActive ? (
              <div className="absolute inset-0 z-20 bg-black flex flex-col items-center justify-center">
                <video
                  ref={videoRef}
                  autoPlay
                  playsInline
                  muted
                  className="w-full h-full object-cover transform scale-x-[-1]"
                />
                <div className="absolute bottom-6 inset-x-0 flex flex-col items-center gap-2">
                  {cameraCountdown ? (
                    <div className="w-16 h-16 rounded-full bg-atelier-coral text-white font-bold text-3xl flex items-center justify-center animate-ping">
                      {cameraCountdown}
                    </div>
                  ) : (
                    <button
                      onClick={captureCameraPhoto}
                      className="px-8 py-3.5 bg-gradient-to-r from-atelier-coral to-[#ff7b6f] text-white font-bold text-xs uppercase tracking-widest hover:brightness-110 shadow-2xl cursor-pointer font-mono"
                    >
                      Snap Photo
                    </button>
                  )}
                </div>
              </div>
            ) : null}

            {/* Background Model / User Photo */}
            <img
              src={activePhotoUrl}
              alt="Fitting model"
              className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95"
            />

            {/* Split Screen Before/After Compare View Slider */}
            {compareMode ? (
              <div
                className="absolute inset-0 overflow-hidden border-r-2 border-atelier-coral z-10 pointer-events-none"
                style={{ width: `${compareSlider}%` }}
              >
                <img
                  src={activePhotoUrl}
                  alt="Original model"
                  className="absolute inset-0 w-full h-full object-cover object-center"
                  style={{ width: '100vw', maxWidth: 'none' }}
                />
              </div>
            ) : null}

            {/* 3D Fitted Garment Layer */}
            {!compareMode || compareSlider < 95 ? (
              <div
                className="absolute inset-0 flex items-center justify-center pointer-events-none transition-transform duration-75"
                style={{
                  perspective: '900px',
                }}
              >
                <div
                  style={{
                    transform: `perspective(900px) rotateY(${rotationY}deg) rotateX(${rotationX}deg) scale(${garmentScale}) translate(${garmentPosX}px, ${garmentPosY - 30}%)`,
                    opacity: opacity,
                    mixBlendMode: blendMode,
                    filter: 'drop-shadow(0px 18px 24px rgba(0,0,0,0.35)) contrast(1.05)',
                  }}
                  className="relative w-[78%] sm:w-[70%] max-w-[420px] transition-transform duration-100 ease-out"
                >
                  <img
                    src={activeGarmentImage}
                    alt={`${selectedProduct.name} in ${selectedColor}`}
                    className="w-full h-auto object-contain"
                  />
                  {/* Subtle 3D Fabric Sheen Overlay */}
                  <div className="absolute inset-0 bg-gradient-to-tr from-black/20 via-transparent to-white/10 pointer-events-none" />
                </div>
              </div>
            ) : null}

            {/* Shoulder & Torso Alignment Guide Overlay */}
            {showBodyGuide && !compareMode && (
              <div className="absolute inset-0 pointer-events-none border border-atelier-coral/30 flex flex-col justify-between p-6">
                <div className="border-t border-dashed border-atelier-coral/40 text-[9px] font-mono text-atelier-coral font-bold pt-1 flex justify-between">
                  <span>SHOULDER LINE &bull; DROP FIT</span>
                  <span>PRINTROVE 350 GSM</span>
                </div>
                <div className="border-t border-dashed border-atelier-coral/30 text-[9px] font-mono text-atelier-coral font-bold pt-1 flex justify-between">
                  <span>CHEST MEASUREMENT ({selectedProduct.sizes.includes(selectedSize) ? selectedSize : 'L'})</span>
                  <span>RELAXED WAIST</span>
                </div>
              </div>
            )}

            {/* Top Right Floating Controls on Mirror */}
            <div className="absolute top-4 right-4 flex flex-col gap-2 z-20">
              <button
                onClick={() => setShowBodyGuide(!showBodyGuide)}
                className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center text-xs transition-colors cursor-pointer shadow-md ${
                  showBodyGuide
                    ? 'bg-atelier-coral text-white border-atelier-coral font-bold'
                    : 'bg-[#0B1B3D] border-[#1E3B75] text-[#F8F5EE] hover:text-atelier-coral hover:border-atelier-coral'
                }`}
                title="Toggle Body Fit Grid Lines"
              >
                <Layers className="w-4 h-4" />
              </button>

              <button
                onClick={() => setCompareMode(!compareMode)}
                className={`w-9 h-9 rounded-full backdrop-blur-md border flex items-center justify-center text-xs transition-colors cursor-pointer shadow-md ${
                  compareMode
                    ? 'bg-atelier-coral text-white border-atelier-coral font-bold'
                    : 'bg-[#0B1B3D] border-[#1E3B75] text-[#F8F5EE] hover:text-atelier-coral hover:border-atelier-coral'
                }`}
                title="Toggle Before/After Split Comparison"
              >
                <Eye className="w-4 h-4" />
              </button>

              <button
                onClick={handleResetControls}
                className="w-9 h-9 rounded-full backdrop-blur-md bg-[#0B1B3D] border border-[#1E3B75] text-[#F8F5EE] hover:text-atelier-coral hover:border-atelier-coral flex items-center justify-center transition-colors cursor-pointer shadow-md"
                title="Reset Fit Alignment"
              >
                <RefreshCw className="w-4 h-4" />
              </button>
            </div>

            {/* Bottom Watermark Tag */}
            <div className="absolute bottom-4 left-4 z-20 pointer-events-none">
              <span className="bg-[#0B1B3D] border border-[#1E3B75] text-[#F8F5EE] text-[9px] uppercase tracking-widest px-2.5 py-1 font-mono font-bold shadow">
                TRENZIO 3D VIRTUAL FIT &bull; {selectedSize}
              </span>
            </div>
          </div>

          {/* Model Presets Quick Bar */}
          <div className="p-4 bg-[#0B1B3D] border border-[#1E3B75] space-y-2 shadow-xl text-[#F8F5EE]">
            <div className="flex items-center justify-between text-[11px] font-mono text-[#E2DCD1]/80">
              <span className="flex items-center gap-1.5">
                <User className="w-3.5 h-3.5 text-atelier-coral" />
                <span>Select Model Preset:</span>
              </span>
              <span className="text-atelier-coral font-bold">
                {photoSourceType === 'upload' ? 'Your Uploaded Photo' : photoSourceType === 'camera' ? 'Your Live Selfie' : 'Preset Model'}
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {MODEL_PRESETS.map((preset) => (
                <button
                  key={preset.id}
                  onClick={() => {
                    setActivePhotoUrl(preset.url);
                    setPhotoSourceType('preset');
                    setGarmentPosY(preset.defaultY);
                    setGarmentScale(preset.defaultScale);
                  }}
                  className={`p-2 border text-left flex items-center gap-2.5 transition-all cursor-pointer ${
                    activePhotoUrl === preset.url
                      ? 'border-atelier-coral bg-atelier-coral text-white font-bold'
                      : 'border-[#1E3B75] text-[#F8F5EE] hover:border-atelier-coral bg-[#10224A]'
                  }`}
                >
                  <img
                    src={preset.url}
                    alt={preset.name}
                    className="w-8 h-8 rounded-full object-cover border border-[#1E3B75]"
                  />
                  <div className="truncate">
                    <div className="text-[10px] font-mono font-bold truncate">{preset.name}</div>
                    <div className="text-[8px] opacity-75 uppercase font-mono">{preset.gender}</div>
                  </div>
                </button>
              ))}
            </div>
          </div>

          {/* 3D Position & Scale Fine-Tuning Controls */}
          <div className="p-4 bg-[#0B1B3D] border border-[#1E3B75] space-y-4 shadow-xl text-[#F8F5EE]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="flex items-center gap-1.5 text-atelier-coral uppercase font-bold text-[10px]">
                <Sliders className="w-3.5 h-3.5" />
                <span>3D Fit & Perspective Calibration</span>
              </span>
              <button
                onClick={handleResetControls}
                className="text-[10px] uppercase text-[#E2DCD1]/70 hover:text-atelier-coral underline cursor-pointer"
              >
                Reset
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs font-mono">
              {/* Scale Slider */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#E2DCD1]/80">
                  <span>Fit Volume:</span>
                  <span className="text-atelier-coral font-bold">{Math.round(garmentScale * 100)}%</span>
                </div>
                <input
                  type="range"
                  min="0.8"
                  max="1.35"
                  step="0.01"
                  value={garmentScale}
                  onChange={(e) => setGarmentScale(parseFloat(e.target.value))}
                  className="w-full accent-atelier-coral cursor-pointer"
                />
              </div>

              {/* 3D Yaw Rotation */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#E2DCD1]/80">
                  <span>3D Body Angle:</span>
                  <span className="text-atelier-coral font-bold">{rotationY}&deg;</span>
                </div>
                <input
                  type="range"
                  min="-30"
                  max="30"
                  step="1"
                  value={rotationY}
                  onChange={(e) => setRotationY(parseInt(e.target.value))}
                  className="w-full accent-atelier-coral cursor-pointer"
                />
              </div>

              {/* Vertical Shoulder Position */}
              <div className="space-y-1">
                <div className="flex justify-between text-[10px] text-[#E2DCD1]/80">
                  <span>Shoulder Height:</span>
                  <span className="text-atelier-coral font-bold">{garmentPosY}%</span>
                </div>
                <input
                  type="range"
                  min="15"
                  max="45"
                  step="1"
                  value={garmentPosY}
                  onChange={(e) => setGarmentPosY(parseInt(e.target.value))}
                  className="w-full accent-atelier-coral cursor-pointer"
                />
              </div>
            </div>

            {/* Compare slider when active */}
            {compareMode && (
              <div className="pt-2 border-t border-[#1E3B75] space-y-1">
                <div className="flex justify-between text-[10px] font-mono text-[#E2DCD1]/80">
                  <span>Split Comparison (Original &larr;&rarr; Fitted):</span>
                  <span className="text-atelier-coral font-bold">{compareSlider}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={compareSlider}
                  onChange={(e) => setCompareSlider(parseInt(e.target.value))}
                  className="w-full accent-atelier-coral cursor-pointer"
                />
              </div>
            )}
          </div>
        </div>

        {/* Right Column: Garment Customizer & Direct Bag (5 Cols) */}
        <div className="lg:col-span-5 flex flex-col justify-between space-y-6">
          <div className="space-y-6">
            {/* Garment Header Card */}
            <div className="p-6 bg-[#0B1B3D] border border-[#1E3B75] space-y-4 shadow-xl text-[#F8F5EE]">
              <div className="flex items-center justify-between text-[10px] uppercase tracking-wider font-mono">
                <span className="bg-[#10224A] border border-[#1E3B75] text-atelier-coral px-2 py-0.5 font-bold">
                  {selectedProduct.gsm} GSM Bio-Washed Cotton
                </span>
                <span className="text-emerald-400 font-medium">
                  Vendor: Printrove &bull; 9,999 in Stock
                </span>
              </div>

              <div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#F8F5EE] font-light">
                  {selectedProduct.name}
                </h2>
                <div className="text-2xl font-mono font-bold text-white tracking-wider mt-1">
                  {formatPrice(selectedProduct.priceINR)}
                </div>
              </div>

              {/* Garment Selector Dropdown / Pills */}
              <div className="pt-2 border-t border-[#1E3B75] space-y-1.5">
                <label className="block text-[10px] uppercase font-mono text-[#E2DCD1]/80">
                  Switch Outfit in 3D:
                </label>
                <div className="grid grid-cols-1 gap-2">
                  {products.map((p) => (
                    <button
                      key={p.id}
                      onClick={() => setSelectedProductId(p.id)}
                      className={`px-3 py-2 border text-left text-xs font-mono flex items-center justify-between transition-all cursor-pointer ${
                        selectedProductId === p.id
                          ? 'border-atelier-coral bg-atelier-coral text-white font-bold'
                          : 'border-[#1E3B75] text-[#F8F5EE] hover:border-atelier-coral bg-[#10224A]'
                      }`}
                    >
                      <span className="truncate">{p.name}</span>
                      <span className="text-atelier-coral font-bold ml-2">{formatPrice(p.priceINR)}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* Colorways Selector with Live Texture Swap */}
              <div className="space-y-2 pt-2 border-t border-[#1E3B75]">
                <div className="flex justify-between text-xs tracking-wider uppercase text-[#E2DCD1]/80 font-mono">
                  <span>Selected Colorway:</span>
                  <span className="text-atelier-coral font-bold">{selectedColor}</span>
                </div>
                <div className="grid grid-cols-7 gap-1.5">
                  {selectedProduct.colors.map((c) => (
                    <button
                      key={c.name}
                      onClick={() => setSelectedColor(c.name)}
                      className={`aspect-square p-1 border-2 transition-all flex items-center justify-center bg-[#10224A] cursor-pointer ${
                        selectedColor === c.name
                          ? 'border-atelier-coral ring-2 ring-atelier-coral/50 scale-105'
                          : 'border-[#1E3B75] opacity-75 hover:opacity-100'
                      }`}
                      title={c.name}
                    >
                      <span
                        className="w-full h-full rounded-none"
                        style={{ backgroundColor: c.hex }}
                      />
                    </button>
                  ))}
                </div>
              </div>

              {/* Size Selector */}
              <div className="space-y-2 pt-2 border-t border-[#1E3B75]">
                <div className="flex justify-between items-center text-xs tracking-wider uppercase text-[#E2DCD1]/80 font-mono">
                  <span>Select Size:</span>
                  <span className="text-atelier-coral font-bold">
                    {selectedSize} (Chest {selectedSize === 'XS' ? '40"' : selectedSize === 'S' ? '42"' : selectedSize === 'M' ? '44"' : selectedSize === 'L' ? '46"' : selectedSize === 'XL' ? '48"' : '50"'})
                  </span>
                </div>
                <div className="grid grid-cols-6 gap-1.5">
                  {selectedProduct.sizes.map((s) => (
                    <button
                      key={s}
                      onClick={() => handleSizeChange(s)}
                      className={`py-2.5 text-xs font-mono font-bold border transition-all cursor-pointer ${
                        selectedSize === s
                          ? 'border-atelier-coral bg-atelier-coral text-white font-bold shadow'
                          : 'border-[#1E3B75] text-[#F8F5EE] hover:bg-atelier-coral hover:border-atelier-coral bg-[#10224A]'
                      }`}
                    >
                      {s}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Smart AI Fit Advisor Card */}
            <div className="p-5 bg-[#0B1B3D] border border-[#1E3B75] space-y-4 shadow-xl text-[#F8F5EE]">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2 text-atelier-coral font-mono uppercase text-[11px] font-bold">
                  <Ruler className="w-4 h-4" />
                  <span>AI Size & Fit Recommendation</span>
                </div>
                <span className="text-[10px] uppercase font-mono px-2 py-0.5 bg-emerald-900 border border-emerald-500 text-emerald-200 font-bold">
                  Best Fit: Size {recommendedSize}
                </span>
              </div>

              <div className="grid grid-cols-2 gap-4 text-xs font-mono">
                <div className="space-y-1">
                  <div className="flex justify-between text-[#E2DCD1]/80 text-[10px]">
                    <span>Height:</span>
                    <span className="text-white font-bold">{userHeightCm} cm</span>
                  </div>
                  <input
                    type="range"
                    min="150"
                    max="205"
                    value={userHeightCm}
                    onChange={(e) => setUserHeightCm(parseInt(e.target.value))}
                    className="w-full accent-atelier-coral cursor-pointer"
                  />
                </div>

                <div className="space-y-1">
                  <div className="flex justify-between text-[#E2DCD1]/80 text-[10px]">
                    <span>Weight:</span>
                    <span className="text-white font-bold">{userWeightKg} kg</span>
                  </div>
                  <input
                    type="range"
                    min="45"
                    max="120"
                    value={userWeightKg}
                    onChange={(e) => setUserWeightKg(parseInt(e.target.value))}
                    className="w-full accent-atelier-coral cursor-pointer"
                  />
                </div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-[#1E3B75] text-[11px] font-mono">
                <span className="text-[#E2DCD1]/80">Streetwear Fit Preference:</span>
                <div className="flex border border-[#1E3B75] bg-[#10224A]">
                  <button
                    onClick={() => setFitPreference('oversized')}
                    className={`px-2.5 py-1 text-[10px] uppercase cursor-pointer font-bold ${
                      fitPreference === 'oversized'
                        ? 'bg-atelier-coral text-white'
                        : 'text-[#E2DCD1]/70'
                    }`}
                  >
                    Oversized Drop
                  </button>
                  <button
                    onClick={() => setFitPreference('regular')}
                    className={`px-2.5 py-1 text-[10px] uppercase cursor-pointer font-bold ${
                      fitPreference === 'regular'
                        ? 'bg-atelier-coral text-white'
                        : 'text-[#E2DCD1]/70'
                    }`}
                  >
                    Fitted
                  </button>
                </div>
              </div>

              <button
                onClick={() => handleSizeChange(recommendedSize)}
                className="w-full py-2.5 border-2 border-atelier-coral text-atelier-coral hover:bg-atelier-coral hover:text-white transition-colors text-[10px] uppercase tracking-wider font-mono font-bold cursor-pointer"
              >
                Apply Recommended Size ({recommendedSize}) to 3D Model
              </button>
            </div>
          </div>

          {/* Action CTAs */}
          <div className="space-y-3 pt-4 border-t border-[#0B1B3D]/10">
            {/* Add to Bag */}
            <button
              onClick={handleAddToBag}
              className={`w-full py-4 uppercase tracking-widest text-xs font-bold transition-all duration-300 flex items-center justify-center gap-2 cursor-pointer shadow-xl font-mono ${
                isAdded
                  ? 'bg-emerald-600 text-white'
                  : 'bg-gradient-to-r from-atelier-coral to-[#ff4736] text-white hover:brightness-110'
              }`}
            >
              {isAdded ? (
                <>
                  <Check className="w-4 h-4" />
                  <span>Look Added to Bag ({selectedSize} &bull; {selectedColor})</span>
                </>
              ) : (
                <span>Add This Look to Bag &bull; {formatPrice(selectedProduct.priceINR)}</span>
              )}
            </button>

            {/* Instant Checkout & Download Look Side-by-Side */}
            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={handleInstantBuy}
                disabled={isCheckingOut}
                className="py-3.5 border-2 border-[#0B1B3D] bg-[#0B1B3D] text-[#F8F5EE] hover:bg-atelier-coral hover:border-atelier-coral text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-md"
              >
                {isCheckingOut ? (
                  <span>Connecting...</span>
                ) : (
                  <>
                    <span>Instant Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <button
                onClick={handleDownloadLook}
                disabled={downloading}
                className="py-3.5 border-2 border-[#0B1B3D] bg-[#EFE8DC] text-[#0B1B3D] hover:border-atelier-coral hover:text-atelier-coral text-xs uppercase tracking-widest font-mono flex items-center justify-center gap-2 transition-all cursor-pointer font-bold shadow-md"
                title="Download High-Res Styled Image for Instagram or WhatsApp"
              >
                <Download className="w-3.5 h-3.5 text-atelier-coral" />
                <span>{downloading ? 'Rendering...' : 'Save Look'}</span>
              </button>
            </div>

            {/* D2C Badges */}
            <div className="grid grid-cols-2 gap-2 text-[10px] text-[#0B1B3D]/80 uppercase tracking-wider pt-2 font-mono font-medium">
              <div className="flex items-center gap-1.5">
                <Truck className="w-3.5 h-3.5 text-atelier-coral" />
                <span>Pan-India Doorstep Dispatch</span>
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
  );
};
