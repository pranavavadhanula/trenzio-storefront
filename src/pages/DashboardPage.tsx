import React, { useState, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  Package,
  Sparkles,
  CreditCard,
  Heart,
  LogOut,
  Shirt,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  ChevronRight,
  Sliders,
  MapPin,
  Copy,
  Check,
  Download,
  RefreshCw,
  PhoneCall,
  ExternalLink,
  User,
  Settings,
  Bell,
  Star,
  Eye,
  ShoppingBag,
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, login, logout, wishlist } = useShop();

  // Outfit selector for the animated avatar
  const [activeLook, setActiveLook] = useState<'street' | 'hoodie' | 'traditional' | 'editorial'>('street');

  // Interactive Tab: orders | measurements | perks | addresses
  const [activeTab, setActiveTab] = useState<'orders' | 'measurements' | 'perks' | 'addresses'>('orders');

  // Copy promo code feedback
  const [isCopied, setIsCopied] = useState(false);
  const [invoiceDownloading, setInvoiceDownloading] = useState(false);

  // 3D Tilt on the animated photo card
  const cardRef = useRef<HTMLDivElement>(null);
  const [tilt, setTilt] = useState({ rotateX: 0, rotateY: 0, isHovered: false });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - 0.5;
    const y = (e.clientY - rect.top) / rect.height - 0.5;
    setTilt({
      rotateX: -y * 12,
      rotateY: x * 12,
      isHovered: true,
    });
  };

  const handleMouseLeave = () => {
    setTilt({ rotateX: 0, rotateY: 0, isHovered: false });
  };

  const copyPromoCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const simulateInvoiceDownload = () => {
    setInvoiceDownloading(true);
    setTimeout(() => {
      setInvoiceDownloading(false);
      alert('Trevori Official Tax Invoice #TRV-894291-GST downloaded successfully.');
    }, 1200);
  };

  // If user isn't logged in, offer quick 1-click VIP login or redirect
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#07111E] text-white font-sans py-12">
        <div className="max-w-md w-full bg-[#0A1728] border border-[#1E3A66] p-8 sm:p-10 text-center rounded-2xl shadow-2xl relative overflow-hidden">
          {/* Subtle glow background */}
          <div className="absolute -top-20 -right-20 w-44 h-44 bg-[#F88379]/15 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute -bottom-20 -left-20 w-44 h-44 bg-[#1E3A66]/40 rounded-full blur-3xl pointer-events-none" />

          <div className="w-16 h-16 rounded-full bg-[#162B4D] border border-[#F88379]/40 flex items-center justify-center mx-auto mb-5 shadow-lg">
            <Sparkles className="w-8 h-8 text-[#F88379]" />
          </div>

          <span className="text-[10px] font-black uppercase tracking-[0.3em] text-[#F88379]">
            PRIVATE CLIENT PORTAL
          </span>
          <h2 className="text-2xl sm:text-3xl font-black uppercase tracking-wider mt-1 mb-3 text-white">
            TREVORI PASSPORT
          </h2>
          <p className="text-slate-300 text-xs sm:text-sm mb-8 leading-relaxed">
            Sign in to access your animated 3D fit passport, live BlueDart order tracking, store credits, and private VIP drop privileges.
          </p>

          <div className="space-y-3">
            <button
              onClick={() => login({ name: 'JULIAN THORNE', email: 'vip.client@trevori.com', tier: 'VIP Noir Member' })}
              className="w-full py-4 bg-[#F88379] hover:bg-[#FA958D] text-white font-extrabold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg flex items-center justify-center gap-2 group"
            >
              <span>Explore VIP Demo Dashboard</span>
              <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
            </button>
            <button
              onClick={() => navigate('/login')}
              className="w-full py-3.5 bg-[#0F2444] hover:bg-[#16335C] border border-[#1E3A66] text-slate-200 font-bold text-xs uppercase tracking-[0.2em] transition-all cursor-pointer"
            >
              Customer Log In / Register
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Look images for animated switcher
  const LOOK_CONFIG = {
    street: {
      image: '/images/auth/dashboard_animated_muse.jpg',
      title: 'Monogram Street Bomber',
      subtitle: 'Trevori Signature 420 GSM Satin Shell',
      specs: 'Chest: 42" • Boxy Drop-Shoulder • In-Stock',
    },
    hoodie: {
      image: '/images/models/man_streetwear_hoodie.jpg',
      title: 'Heavyweight French Terry Hoodie',
      subtitle: '400 GSM 100% Combed Organic Cotton',
      specs: 'Chest: 42" • Relaxed Streetwear Drape • In-Stock',
    },
    traditional: {
      image: '/images/traditional_couture_banner.jpg',
      title: 'Royal Navy Bandhgala',
      subtitle: 'Bespoke Handcrafted Velvet & Antique Zardozi',
      specs: 'Chest: 42" • Tailored Regal Silhouette • Made-to-Measure',
    },
    editorial: {
      image: '/images/models/man_model_fashion.jpg',
      title: 'Signature Monochrome Editorial',
      subtitle: 'Perspective 2026 Haute Atelier Drop',
      specs: 'Chest: 42" • Minimalist Tailored Cut • Reserved VIP',
    },
  };

  return (
    <div className="min-h-screen bg-[#07111E] text-white font-sans py-8 sm:py-12 px-4 sm:px-8 lg:px-14 max-w-[1520px] mx-auto select-none">
      
      {/* Top Executive Header */}
      <div className="bg-[#0A1728] border border-[#1E3A66] rounded-2xl p-6 sm:p-8 mb-8 shadow-xl relative overflow-hidden">
        {/* Decorative corner ambient glow */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-[#F88379]/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col lg:flex-row lg:items-center lg:justify-between gap-6">
          <div className="flex items-start sm:items-center gap-4 sm:gap-5">
            {/* VIP Monogram Avatar */}
            <div className="w-16 h-16 sm:w-20 sm:h-20 rounded-2xl bg-gradient-to-br from-[#1E3A66] via-[#0F2444] to-[#07111E] border-2 border-[#F88379] p-0.5 shadow-lg flex items-center justify-center shrink-0">
              <span className="text-2xl sm:text-3xl font-black text-[#F88379] tracking-tighter">
                {user.name.slice(0, 2).toUpperCase()}
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2 mb-1.5">
                <span className="px-3 py-0.5 bg-[#F88379]/20 border border-[#F88379]/50 text-[#F88379] text-[10px] font-black uppercase tracking-[0.2em] rounded-full shadow-sm flex items-center gap-1">
                  <Star className="w-3 h-3 fill-current" />
                  <span>{user.tier}</span>
                </span>
                <span className="text-xs text-slate-400 font-mono">
                  PASSPORT ID: <strong className="text-slate-200">#TRV-89420-VIP</strong>
                </span>
                <span className="text-xs text-slate-500">•</span>
                <span className="text-xs text-slate-400">Member since {user.joinedDate}</span>
              </div>

              <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-[0.05em] text-white">
                WELCOME, {user.name}
              </h1>

              {/* Tier Progress Bar */}
              <div className="mt-2.5 max-w-md">
                <div className="flex items-center justify-between text-[11px] mb-1">
                  <span className="text-slate-400 font-medium">Noir Progress</span>
                  <span className="text-[#F88379] font-bold font-mono">4,200 / 5,000 Pts (Diamond Next)</span>
                </div>
                <div className="w-full h-1.5 bg-[#07111E] rounded-full overflow-hidden border border-[#1E3A66]">
                  <div className="h-full bg-gradient-to-r from-[#F88379] to-[#FA958D] rounded-full w-[84%]" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Header Actions */}
          <div className="flex flex-wrap items-center gap-3 shrink-0">
            <Link
              to="/collections"
              className="px-5 py-3 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs font-black uppercase tracking-[0.18em] transition-all shadow-md flex items-center gap-2 group cursor-pointer"
            >
              <ShoppingBag className="w-3.5 h-3.5" />
              <span>Shop Private Drop</span>
            </Link>

            <a
              href="https://wa.me/919876543210?text=Hello%20Trevori%20VIP%20Concierge"
              target="_blank"
              rel="noopener noreferrer"
              className="px-4 py-3 bg-[#0F2444] hover:bg-[#16335C] border border-[#1E3A66] text-slate-200 text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-colors cursor-pointer"
            >
              <PhoneCall className="w-3.5 h-3.5 text-[#10B981]" />
              <span className="hidden sm:inline">VIP Concierge</span>
            </a>

            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="px-4 py-3 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
              title="Sign Out"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Sign Out</span>
            </button>
          </div>
        </div>
      </div>

      {/* Main Grid: Left Animated Photo Card, Right Dashboard Modules */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">

        {/* LEFT COLUMN: ANIMATED MODEL PHOTO SHOWCASE */}
        <div className="lg:col-span-5 xl:col-span-4 flex flex-col items-center">
          
          {/* Animated Card Container */}
          <div className="relative w-full max-w-md" style={{ perspective: '1200px' }}>
            
            {/* Ambient Pulsing Glow Aura */}
            <div className="pointer-events-none absolute -inset-3 bg-gradient-to-r from-[#F88379]/30 via-[#1D4ED8]/25 to-[#F88379]/30 rounded-3xl blur-2xl animate-pulse-aura z-0" />

            {/* 3D Floating Interactive Card */}
            <div
              ref={cardRef}
              onMouseMove={handleMouseMove}
              onMouseLeave={handleMouseLeave}
              className="relative z-10 w-full min-h-[560px] sm:min-h-[600px] rounded-2xl overflow-hidden border-2 border-[#1E3A66] hover:border-[#F88379] transition-all duration-300 animate-float-subtle will-change-transform shadow-[0_25px_60px_rgba(0,0,0,0.85)] bg-[#071324]"
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.isHovered ? 1.02 : 1}, ${tilt.isHovered ? 1.02 : 1}, 1)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Animated Photo Image */}
              <img
                src={LOOK_CONFIG[activeLook].image}
                alt={LOOK_CONFIG[activeLook].title}
                className="absolute inset-0 w-full h-full object-cover object-top filter brightness-95 contrast-105 transition-all duration-700"
              />

              {/* Holographic Shimmer Sweep Overlay */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] animate-shimmer-sweep" />
              </div>

              {/* Shading Vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111E] via-transparent to-[#07111E]/40 z-10" />

              {/* Top Passport Chip Overlay */}
              <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1 bg-black/80 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-1.5 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-white">
                    LIVE FIT AVATAR
                  </span>
                </div>
                <div className="px-2.5 py-1 bg-[#F88379] rounded text-black text-[9px] font-black tracking-widest uppercase shadow-md">
                  VERIFIED NOIR
                </div>
              </div>

              {/* Bottom Card Identity & Spec */}
              <div className="absolute bottom-5 inset-x-5 z-30">
                <div className="bg-[#07111E]/90 backdrop-blur-md border border-[#1E3A66] p-4 rounded-xl shadow-2xl">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">
                      PERSPECTIVE LOOKBOOK
                    </span>
                    <span className="text-[#F88379] font-mono font-bold text-[11px]">
                      ID: TRV-NOIR-LOOK
                    </span>
                  </div>
                  <h4 className="text-base font-black uppercase text-white tracking-wide">
                    {LOOK_CONFIG[activeLook].title}
                  </h4>
                  <p className="text-[11px] text-slate-300 mt-0.5">
                    {LOOK_CONFIG[activeLook].subtitle}
                  </p>
                  <div className="flex items-center justify-between text-[11px] text-[#CBD5E1] mt-2.5 pt-2 border-t border-[#1E3A66]/60">
                    <span className="text-slate-300">{LOOK_CONFIG[activeLook].specs}</span>
                    <span className="text-[#10B981] font-bold">100% In-Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lookbook Switcher Controls */}
          <div className="mt-5 w-full max-w-md">
            <div className="flex items-center justify-between mb-2">
              <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#94A3B8]">
                Curated Avatar Looks
              </span>
              <span className="text-[10px] font-bold uppercase tracking-wider text-[#F88379]">
                Live 3D Drape
              </span>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              <button
                onClick={() => setActiveLook('street')}
                className={`py-2 px-2 text-[10px] font-extrabold uppercase tracking-wider rounded border transition-all cursor-pointer ${
                  activeLook === 'street'
                    ? 'bg-[#F88379] text-white border-[#F88379] shadow-md'
                    : 'bg-[#0A1728] text-slate-300 border-[#1E3A66] hover:border-white'
                }`}
              >
                Streetwear
              </button>
              <button
                onClick={() => setActiveLook('hoodie')}
                className={`py-2 px-2 text-[10px] font-extrabold uppercase tracking-wider rounded border transition-all cursor-pointer ${
                  activeLook === 'hoodie'
                    ? 'bg-[#F88379] text-white border-[#F88379] shadow-md'
                    : 'bg-[#0A1728] text-slate-300 border-[#1E3A66] hover:border-white'
                }`}
              >
                400 GSM
              </button>
              <button
                onClick={() => setActiveLook('traditional')}
                className={`py-2 px-2 text-[10px] font-extrabold uppercase tracking-wider rounded border transition-all cursor-pointer ${
                  activeLook === 'traditional'
                    ? 'bg-[#F88379] text-white border-[#F88379] shadow-md'
                    : 'bg-[#0A1728] text-slate-300 border-[#1E3A66] hover:border-white'
                }`}
              >
                Royal Velvet
              </button>
              <button
                onClick={() => setActiveLook('editorial')}
                className={`py-2 px-2 text-[10px] font-extrabold uppercase tracking-wider rounded border transition-all cursor-pointer ${
                  activeLook === 'editorial'
                    ? 'bg-[#F88379] text-white border-[#F88379] shadow-md'
                    : 'bg-[#0A1728] text-slate-300 border-[#1E3A66] hover:border-white'
                }`}
              >
                Editorial
              </button>
            </div>

            {/* Launch 3D Try-On Studio Button */}
            <Link
              to="/try-on"
              className="mt-3 w-full py-3 bg-[#0F2444] hover:bg-[#16335C] border border-[#1E3A66] hover:border-[#F88379] text-white font-bold text-xs uppercase tracking-[0.18em] transition-all flex items-center justify-center gap-2 group shadow-lg"
            >
              <Sliders className="w-3.5 h-3.5 text-[#F88379] group-hover:rotate-45 transition-transform" />
              <span>Launch 3D Virtual Try-On Studio</span>
            </Link>
          </div>
        </div>

        {/* RIGHT COLUMN: DASHBOARD STATS, ORDERS, SPECS & PERKS */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">

          {/* Quick Metrics Bar (4 Key Tiles) */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Metric 1: Store Credits */}
            <div className="bg-[#0A1728] border border-[#1E3A66] p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between text-[#F88379] mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">CREDIT</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">₹{user.creditsINR}</div>
              <div className="text-[10px] text-emerald-400 font-bold mt-1">● Ready at checkout</div>
            </div>

            {/* Metric 2: Loyalty Points */}
            <div className="bg-[#0A1728] border border-[#1E3A66] p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between text-[#F88379] mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">POINTS</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{user.points}</div>
              <div className="text-[10px] text-slate-400 mt-1">Noir VIP Standing</div>
            </div>

            {/* Metric 3: Active Orders */}
            <div className="bg-[#0A1728] border border-[#1E3A66] p-4 rounded-xl shadow-md">
              <div className="flex items-center justify-between text-[#F88379] mb-2">
                <Truck className="w-4 h-4 text-[#10B981]" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">ACTIVE</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">1 Order</div>
              <div className="text-[10px] text-[#10B981] font-bold mt-1">● BlueDart Air Transit</div>
            </div>

            {/* Metric 4: Saved Wishlist */}
            <Link
              to="/wishlist"
              className="bg-[#0A1728] border border-[#1E3A66] hover:border-[#F88379] p-4 rounded-xl transition-all block group cursor-pointer shadow-md"
            >
              <div className="flex items-center justify-between text-[#F88379] mb-2">
                <Heart className="w-4 h-4 fill-current" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">SAVED</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white group-hover:text-[#F88379] transition-colors">
                {wishlist.length} Items
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1 group-hover:text-white transition-colors">
                <span>View Vault</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          </div>

          {/* Interactive Tab Navigation */}
          <div className="flex items-center border-b border-[#1E3A66] space-x-4 sm:space-x-8 overflow-x-auto pb-px">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'orders'
                  ? 'text-[#F88379] border-b-2 border-[#F88379]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Package className="w-3.5 h-3.5" />
              <span>Orders & Live Tracking</span>
            </button>

            <button
              onClick={() => setActiveTab('measurements')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'measurements'
                  ? 'text-[#F88379] border-b-2 border-[#F88379]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Shirt className="w-3.5 h-3.5" />
              <span>3D Bespoke Fit Specs</span>
            </button>

            <button
              onClick={() => setActiveTab('perks')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'perks'
                  ? 'text-[#F88379] border-b-2 border-[#F88379]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span>VIP Noir Perks</span>
            </button>

            <button
              onClick={() => setActiveTab('addresses')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap flex items-center gap-2 ${
                activeTab === 'addresses'
                  ? 'text-[#F88379] border-b-2 border-[#F88379]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              <MapPin className="w-3.5 h-3.5" />
              <span>Addresses & Concierge</span>
            </button>
          </div>

          {/* TAB 1: ACTIVE ORDER TRACKING & ORDER HISTORY */}
          {activeTab === 'orders' && (
            <div className="space-y-6">
              {/* Active In-Transit Shipment */}
              <div className="bg-[#0A1728] border border-[#1E3A66] p-6 rounded-2xl shadow-xl">
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E3A66] gap-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs text-slate-400 font-mono">ORDER #TRV-894291</span>
                      <span className="px-2 py-0.5 bg-[#F88379]/15 text-[#F88379] text-[9px] font-bold uppercase rounded">
                        EXPRESS AIR
                      </span>
                    </div>
                    <h3 className="text-base sm:text-lg font-black uppercase text-white mt-1">
                      Trevori 400 GSM Heavyweight French Terry Hoodie
                    </h3>
                    <p className="text-xs text-slate-400">
                      Color: Jet Black • Size: Large (L) • Qty: 1 • ₹2,499
                    </p>
                  </div>
                  <div className="px-3.5 py-1.5 bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-black uppercase tracking-wider rounded-full flex items-center gap-1.5 shadow-sm">
                    <Truck className="w-4 h-4 animate-bounce" />
                    <span>In Transit • BlueDart Express</span>
                  </div>
                </div>

                {/* Tracking Progress Timeline */}
                <div className="py-8">
                  <div className="relative flex items-center justify-between max-w-xl mx-auto">
                    {/* Background Bar */}
                    <div className="absolute top-1/2 inset-x-0 h-1 bg-[#1E3A66] -translate-y-1/2 z-0" />
                    {/* Active Progress Bar (75%) */}
                    <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-gradient-to-r from-[#10B981] to-[#F88379] -translate-y-1/2 z-0" />

                    {/* Step 1: Confirmed */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#10B981] text-black flex items-center justify-center text-xs font-black shadow-md">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-white uppercase mt-2">Placed</span>
                      <span className="text-[9px] text-slate-400">2:45 PM</span>
                    </div>

                    {/* Step 2: Tailored & QC */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#10B981] text-black flex items-center justify-center text-xs font-black shadow-md">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-white uppercase mt-2">QC Passed</span>
                      <span className="text-[9px] text-slate-400">4:10 PM</span>
                    </div>

                    {/* Step 3: Out for Delivery */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#F88379] text-white flex items-center justify-center text-xs font-black shadow-[0_0_15px_#F88379]">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-black text-[#F88379] uppercase mt-2">Air Transit</span>
                      <span className="text-[9px] text-[#F88379] font-bold">Bangalore Hub</span>
                    </div>

                    {/* Step 4: Delivered */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#162B4D] border border-slate-600 text-slate-400 flex items-center justify-center text-xs">
                        ○
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">Delivered</span>
                      <span className="text-[9px] text-slate-400">Tomorrow 4 PM</span>
                    </div>
                  </div>
                </div>

                {/* Shipment Details & Actions */}
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 pt-4 border-t border-[#1E3A66]/60 text-xs text-slate-300">
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Estimated Delivery:</span>
                    <strong className="text-white text-sm">Tomorrow by 4:00 PM</strong>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Tracking AWB:</span>
                    <span className="font-mono text-slate-200">BLR-8942-EXP99</span>
                  </div>
                  <div>
                    <span className="text-slate-400 block text-[10px] uppercase font-bold">Destination:</span>
                    <span className="text-white truncate block">Indiranagar 100ft Rd, Bangalore</span>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex flex-wrap items-center gap-3 mt-5 pt-4 border-t border-[#1E3A66]/40">
                  <button
                    onClick={simulateInvoiceDownload}
                    disabled={invoiceDownloading}
                    className="py-2.5 px-4 bg-[#0F2444] hover:bg-[#16335C] border border-[#1E3A66] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <Download className="w-3.5 h-3.5 text-[#F88379]" />
                    <span>{invoiceDownloading ? 'Generating PDF...' : 'Download Tax Invoice'}</span>
                  </button>

                  <a
                    href="https://www.bluedart.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="py-2.5 px-4 bg-[#071324] hover:bg-[#0F2444] border border-[#1E3A66] text-slate-300 hover:text-white text-xs font-bold uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer"
                  >
                    <ExternalLink className="w-3.5 h-3.5" />
                    <span>Track on BlueDart Portal</span>
                  </a>
                </div>
              </div>

              {/* Past Order History */}
              <div className="bg-[#0A1728] border border-[#1E3A66] p-6 rounded-2xl shadow-md">
                <h4 className="text-xs font-black uppercase tracking-[0.2em] text-[#94A3B8] mb-4">
                  Delivered Order History
                </h4>

                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl flex flex-wrap items-center justify-between gap-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-14 bg-[#0A1728] border border-[#1E3A66] rounded overflow-hidden shrink-0">
                      <img
                        src="/images/traditional_couture_banner.jpg"
                        alt="Royal Velvet Bandhgala"
                        className="w-full h-full object-cover"
                      />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono text-slate-400">#TRV-781102</span>
                        <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          <span>Delivered Nov 5, 2026</span>
                        </span>
                      </div>
                      <h5 className="text-sm font-black uppercase text-white mt-0.5">
                        Royal Heritage Velvet Bandhgala
                      </h5>
                      <p className="text-xs text-slate-400">Size: 42 Regular • ₹8,999</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to="/product/traditional-bandhgala"
                      className="px-4 py-2 bg-[#0F2444] hover:bg-[#16335C] border border-[#1E3A66] text-xs font-bold uppercase tracking-wider text-slate-200 transition-colors"
                    >
                      Order Again
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 3D BESPOKE FIT SPECIFICATIONS */}
          {activeTab === 'measurements' && (
            <div className="bg-[#0A1728] border border-[#1E3A66] p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
              <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E3A66] gap-3">
                <div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-white">
                    Saved Bespoke Tailor Profile
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Real-time biometric data synced directly with our virtual 3D fitting mannequin.
                  </p>
                </div>
                <Link
                  to="/try-on"
                  className="px-5 py-2.5 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 transition-all shadow-md cursor-pointer"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Recalibrate in 3D Fitting Room</span>
                </Link>
              </div>

              {/* Metric Spec Tiles */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-center">
                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl">
                  <span className="text-[10px] font-bold text-[#F88379] uppercase tracking-wider">CHEST</span>
                  <div className="text-2xl font-black text-white mt-1">42 IN</div>
                  <span className="text-[10px] text-slate-400">106 CM • Size L</span>
                </div>
                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl">
                  <span className="text-[10px] font-bold text-[#F88379] uppercase tracking-wider">SHOULDERS</span>
                  <div className="text-2xl font-black text-white mt-1">19.5 IN</div>
                  <span className="text-[10px] text-slate-400">Drop-Shoulder Fit</span>
                </div>
                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl">
                  <span className="text-[10px] font-bold text-[#F88379] uppercase tracking-wider">WAIST</span>
                  <div className="text-2xl font-black text-white mt-1">32 IN</div>
                  <span className="text-[10px] text-slate-400">Baggy Denim Match</span>
                </div>
                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl">
                  <span className="text-[10px] font-bold text-[#F88379] uppercase tracking-wider">HEIGHT</span>
                  <div className="text-2xl font-black text-white mt-1">6' 1"</div>
                  <span className="text-[10px] text-slate-400">185 CM • Ideal Drape</span>
                </div>
              </div>

              {/* Sizing Recommendations Banner */}
              <div className="p-5 bg-[#0F2444]/60 border border-[#1E3A66] rounded-xl">
                <div className="flex items-start gap-3">
                  <ShieldCheck className="w-5 h-5 text-[#F88379] shrink-0 mt-0.5" />
                  <div>
                    <h5 className="text-sm font-black uppercase text-white">
                      Guaranteed First-Time Fit Algorithm
                    </h5>
                    <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                      Based on your stored biometric proportions, your optimal size is <strong>Large (L)</strong> for Streetwear Drops (providing a boxy 400 GSM drape) and <strong>42 Regular</strong> for Royal Heritage Bandhgalas. If an exchange is ever needed, Trevori provides free doorstep size swaps within 7 days.
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIP NOIR PERKS & PROMOS */}
          {activeTab === 'perks' && (
            <div className="bg-[#0A1728] border border-[#1E3A66] p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E3A66]">
                <div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-white">
                    Trevori Perspective Noir Privileges
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Active VIP benefits tied to your customer ID #TRV-8942.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {/* Perk 1: First Order ₹200 Promo */}
                <div className="p-5 bg-[#071324] border border-[#1E3A66] hover:border-[#F88379] rounded-xl flex flex-wrap items-center justify-between gap-4 transition-colors">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F88379]">
                      EXCLUSIVE PROMO CODE
                    </span>
                    <h4 className="text-base font-black uppercase text-white mt-0.5">
                      ₹200 Instant Discount On Any Order
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Code: <strong className="font-mono text-white text-sm">TREVORI200</strong> • No minimum spend required
                    </p>
                  </div>

                  <button
                    onClick={() => copyPromoCode('TREVORI200')}
                    className="px-4 py-2.5 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs font-black uppercase tracking-wider flex items-center gap-2 rounded transition-all cursor-pointer"
                  >
                    {isCopied ? (
                      <>
                        <Check className="w-3.5 h-3.5" />
                        <span>Code Copied!</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span>Copy Code</span>
                      </>
                    )}
                  </button>
                </div>

                {/* Perk 2: Early Drop Access */}
                <div className="p-5 bg-[#071324] border border-[#1E3A66] rounded-xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-emerald-400">
                      VIP DROP ACCESS
                    </span>
                    <h4 className="text-base font-black uppercase text-white mt-0.5">
                      24-Hour Advance Drop Window
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      Access limited-batch 400 GSM collections 24 hours before public release.
                    </p>
                  </div>
                  <span className="px-3 py-1 bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 text-xs font-black uppercase rounded-full">
                    Active
                  </span>
                </div>

                {/* Perk 3: Pan-India Express Delivery */}
                <div className="p-5 bg-[#071324] border border-[#1E3A66] rounded-xl flex flex-wrap items-center justify-between gap-4">
                  <div>
                    <span className="text-[10px] font-black uppercase tracking-[0.2em] text-[#F88379]">
                      LOGISTICS UPGRADE
                    </span>
                    <h4 className="text-base font-black uppercase text-white mt-0.5">
                      Complimentary BlueDart Air Delivery & Doorstep Exchanges
                    </h4>
                    <p className="text-xs text-slate-300 mt-1">
                      All orders automatically routed via high-priority air express with tamper-evident seal.
                    </p>
                  </div>
                  <span className="text-xs text-slate-400 font-bold uppercase">Always Included</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 4: ADDRESSES & CONCIERGE */}
          {activeTab === 'addresses' && (
            <div className="bg-[#0A1728] border border-[#1E3A66] p-6 sm:p-8 rounded-2xl space-y-6 shadow-xl">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E3A66]">
                <div>
                  <h3 className="text-base sm:text-lg font-black uppercase text-white">
                    Delivery Addresses & VIP Concierge
                  </h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Manage your delivery locations and direct atelier contact options.
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Address 1: Primary Home */}
                <div className="p-5 bg-[#071324] border-2 border-[#F88379] rounded-xl relative">
                  <div className="flex items-center justify-between mb-2">
                    <span className="px-2 py-0.5 bg-[#F88379] text-black text-[9px] font-black uppercase tracking-wider rounded">
                      DEFAULT RESIDENCE
                    </span>
                    <span className="text-xs text-slate-400">Home</span>
                  </div>
                  <h5 className="text-sm font-black uppercase text-white">{user.name}</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    #402, Perspective Heights, 100ft Road, Indiranagar, Bangalore, Karnataka — 560038
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-mono">{user.phone || '+91 98765 43210'}</p>
                </div>

                {/* Address 2: Atelier Office */}
                <div className="p-5 bg-[#071324] border border-[#1E3A66] rounded-xl">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      SECONDARY
                    </span>
                    <span className="text-xs text-slate-400">Office</span>
                  </div>
                  <h5 className="text-sm font-black uppercase text-white">{user.name}</h5>
                  <p className="text-xs text-slate-300 mt-1 leading-relaxed">
                    Level 14, UB City Tower, Vittal Mallya Road, Bangalore, Karnataka — 560001
                  </p>
                  <p className="text-xs text-slate-400 mt-2 font-mono">+91 98765 43211</p>
                </div>
              </div>

              {/* Direct Concierge Contact Card */}
              <div className="p-5 bg-[#0F2444]/60 border border-[#1E3A66] rounded-xl flex flex-wrap items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#10B981]/20 border border-[#10B981]/40 flex items-center justify-center text-[#10B981]">
                    <PhoneCall className="w-5 h-5" />
                  </div>
                  <div>
                    <h5 className="text-sm font-black uppercase text-white">Need Personal Tailoring Assistance?</h5>
                    <p className="text-xs text-slate-300 mt-0.5">
                      Our personal styling concierge is available 10 AM – 8 PM IST for measurements and custom sizing.
                    </p>
                  </div>
                </div>

                <a
                  href="https://wa.me/919876543210?text=Hello%20Trevori%20Concierge"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="px-4 py-2.5 bg-[#10B981] hover:bg-[#059669] text-black font-extrabold text-xs uppercase tracking-wider rounded transition-all cursor-pointer shadow-md"
                >
                  WhatsApp Concierge
                </a>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
