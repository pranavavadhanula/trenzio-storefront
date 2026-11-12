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
} from 'lucide-react';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, logout, wishlist } = useShop();

  // Outfit selector for the animated avatar
  const [activeLook, setActiveLook] = useState<'street' | 'traditional' | 'hoodie'>('street');

  // Interactive Tab
  const [activeTab, setActiveTab] = useState<'orders' | 'profile' | 'perks'>('orders');

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

  // If user isn't logged in, show elegant login prompt
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[85vh] flex items-center justify-center px-4 bg-[#07111E] text-white font-sans">
        <div className="max-w-md w-full bg-[#0A1728] border border-[#1E3A66] p-8 text-center rounded-2xl shadow-2xl">
          <div className="w-16 h-16 rounded-full bg-[#162B4D] border border-[#F88379]/40 flex items-center justify-center mx-auto mb-4">
            <Sparkles className="w-8 h-8 text-[#F88379]" />
          </div>
          <h2 className="text-2xl font-black uppercase tracking-wider mb-2">Customer Portal</h2>
          <p className="text-slate-300 text-sm mb-6 leading-relaxed">
            Please log in to access your animated Trevori Perspective Passport, live order tracking, and store credits.
          </p>
          <button
            onClick={() => navigate('/login')}
            className="w-full py-4 bg-[#F88379] hover:bg-[#FA958D] text-white font-black text-xs uppercase tracking-[0.2em] transition-all cursor-pointer shadow-lg"
          >
            Log In or Register
          </button>
        </div>
      </div>
    );
  }

  // Look images for animated switcher
  const LOOK_IMAGES = {
    street: '/images/auth/dashboard_animated_muse.jpg',
    traditional: '/images/traditional_couture_banner.jpg',
    hoodie: '/images/hero_banner.jpg',
  };

  return (
    <div className="min-h-screen bg-[#07111E] text-white font-sans py-10 px-4 sm:px-8 lg:px-14 max-w-[1480px] mx-auto select-none">
      
      {/* Top Welcome & Navigation Bar */}
      <div className="flex flex-wrap items-center justify-between pb-8 mb-8 border-b border-[#1E3A66]/40 gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1.5">
            <span className="px-2.5 py-0.5 bg-[#F88379]/15 border border-[#F88379]/40 text-[#F88379] text-[10px] font-black uppercase tracking-widest rounded-full">
              {user.tier}
            </span>
            <span className="text-xs text-[#64748B] font-medium">Member since {user.joinedDate}</span>
          </div>
          <h1 className="text-2xl sm:text-4xl font-black uppercase tracking-[0.06em] text-white">
            WELCOME, {user.name}
          </h1>
        </div>

        {/* Top Right Quick Actions */}
        <div className="flex items-center gap-3">
          <Link
            to="/collections"
            className="px-5 py-2.5 bg-[#0F2444] hover:bg-[#16335C] border border-[#1E3A66] text-xs font-bold uppercase tracking-wider transition-colors"
          >
            Shop New Drops
          </Link>
          <button
            onClick={() => {
              logout();
              navigate('/login');
            }}
            className="px-4 py-2.5 bg-red-950/40 hover:bg-red-900/60 border border-red-800/40 text-red-200 text-xs font-bold uppercase tracking-wider flex items-center gap-1.5 transition-colors cursor-pointer"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Sign Out</span>
          </button>
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
              className="relative z-10 w-full min-h-[540px] sm:min-h-[580px] rounded-2xl overflow-hidden border-2 border-[#1E3A66] hover:border-[#F88379] transition-all duration-300 animate-float-subtle will-change-transform shadow-[0_25px_60px_rgba(0,0,0,0.8)] bg-[#071324]"
              style={{
                transform: `rotateX(${tilt.rotateX}deg) rotateY(${tilt.rotateY}deg) scale3d(${tilt.isHovered ? 1.02 : 1}, ${tilt.isHovered ? 1.02 : 1}, 1)`,
                transformStyle: 'preserve-3d',
              }}
            >
              {/* Animated Photo Image */}
              <img
                src={LOOK_IMAGES[activeLook]}
                alt="Trevori Animated Lookbook Muse"
                className="absolute inset-0 w-full h-full object-cover object-center filter brightness-95 contrast-105 transition-all duration-700"
              />

              {/* Holographic Shimmer Sweep Overlay */}
              <div className="pointer-events-none absolute inset-0 overflow-hidden z-20">
                <div className="w-1/2 h-full bg-gradient-to-r from-transparent via-white/20 to-transparent skew-x-[-25deg] animate-shimmer-sweep" />
              </div>

              {/* Shading Vignette */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-[#07111E] via-transparent to-[#07111E]/40 z-10" />

              {/* Top Passport Chip Overlay */}
              <div className="absolute top-4 inset-x-4 z-30 flex items-center justify-between pointer-events-none">
                <div className="px-3 py-1 bg-black/75 backdrop-blur-md border border-white/20 rounded-full flex items-center gap-1.5 shadow-lg">
                  <div className="w-2 h-2 rounded-full bg-[#10B981] animate-ping" />
                  <span className="text-[10px] font-black tracking-widest uppercase text-white">
                    LIVE FIT PROFILE
                  </span>
                </div>
                <div className="px-2.5 py-1 bg-[#F88379]/85 backdrop-blur-md rounded text-black text-[9px] font-black tracking-widest uppercase">
                  VERIFIED
                </div>
              </div>

              {/* Bottom Card Identity & Spec */}
              <div className="absolute bottom-5 inset-x-5 z-30">
                <div className="bg-[#07111E]/85 backdrop-blur-md border border-[#1E3A66] p-4 rounded-xl shadow-xl">
                  <div className="flex items-center justify-between text-xs mb-1">
                    <span className="text-[#94A3B8] font-bold uppercase tracking-wider text-[10px]">
                      PERSPECTIVE PASSPORT
                    </span>
                    <span className="text-[#F88379] font-mono font-bold text-[11px]">
                      ID: TRV-8942-NOIR
                    </span>
                  </div>
                  <h4 className="text-base font-black uppercase text-white tracking-wide">
                    {activeLook === 'street'
                      ? 'Monogram Street Bomber'
                      : activeLook === 'traditional'
                      ? 'Royal Velvet Bandhgala'
                      : 'Heavyweight French Terry'}
                  </h4>
                  <div className="flex items-center justify-between text-[11px] text-[#CBD5E1] mt-2 pt-2 border-t border-[#1E3A66]/60">
                    <span>Chest: 42" • Relaxed Boxy Fit</span>
                    <span className="text-[#10B981] font-bold">100% In-Stock</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Lookbook Switcher Controls */}
          <div className="mt-5 flex items-center gap-2 w-full max-w-md justify-center">
            <span className="text-[10px] font-bold uppercase tracking-wider text-[#94A3B8] mr-1">
              Switch Look:
            </span>
            <button
              onClick={() => setActiveLook('street')}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded border transition-all cursor-pointer ${
                activeLook === 'street'
                  ? 'bg-[#F88379] text-white border-[#F88379]'
                  : 'bg-[#0A1728] text-slate-300 border-[#1E3A66] hover:border-white'
              }`}
            >
              Streetwear
            </button>
            <button
              onClick={() => setActiveLook('traditional')}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded border transition-all cursor-pointer ${
                activeLook === 'traditional'
                  ? 'bg-[#F88379] text-white border-[#F88379]'
                  : 'bg-[#0A1728] text-slate-300 border-[#1E3A66] hover:border-white'
              }`}
            >
              Traditional
            </button>
            <button
              onClick={() => setActiveLook('hoodie')}
              className={`px-3 py-1.5 text-[11px] font-bold uppercase tracking-wider rounded border transition-all cursor-pointer ${
                activeLook === 'hoodie'
                  ? 'bg-[#F88379] text-white border-[#F88379]'
                  : 'bg-[#0A1728] text-slate-300 border-[#1E3A66] hover:border-white'
              }`}
            >
              Hoodie
            </button>
          </div>
        </div>

        {/* RIGHT COLUMN: DASHBOARD STATS, ORDERS & PROFILE */}
        <div className="lg:col-span-7 xl:col-span-8 space-y-6">

          {/* Quick Metrics Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {/* Metric 1: Store Credits */}
            <div className="bg-[#0A1728] border border-[#1E3A66] p-4 rounded-xl">
              <div className="flex items-center justify-between text-[#F88379] mb-2">
                <CreditCard className="w-4 h-4" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">CREDIT</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">₹{user.creditsINR}</div>
              <div className="text-[10px] text-slate-400 mt-1">Available to redeem</div>
            </div>

            {/* Metric 2: Loyalty Points */}
            <div className="bg-[#0A1728] border border-[#1E3A66] p-4 rounded-xl">
              <div className="flex items-center justify-between text-[#F88379] mb-2">
                <Sparkles className="w-4 h-4" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">POINTS</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">{user.points}</div>
              <div className="text-[10px] text-slate-400 mt-1">Tier Noir status</div>
            </div>

            {/* Metric 3: Active Orders */}
            <div className="bg-[#0A1728] border border-[#1E3A66] p-4 rounded-xl">
              <div className="flex items-center justify-between text-[#F88379] mb-2">
                <Package className="w-4 h-4" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">ORDERS</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white">1 Active</div>
              <div className="text-[10px] text-[#10B981] font-bold mt-1">On the way</div>
            </div>

            {/* Metric 4: Saved Wishlist */}
            <Link
              to="/wishlist"
              className="bg-[#0A1728] border border-[#1E3A66] hover:border-[#F88379] p-4 rounded-xl transition-colors block group cursor-pointer"
            >
              <div className="flex items-center justify-between text-[#F88379] mb-2">
                <Heart className="w-4 h-4" />
                <span className="text-[9px] uppercase font-bold tracking-wider text-slate-400">SAVED</span>
              </div>
              <div className="text-xl sm:text-2xl font-black text-white group-hover:text-[#F88379] transition-colors">
                {wishlist.length} Items
              </div>
              <div className="text-[10px] text-slate-400 mt-1 flex items-center gap-1">
                <span>View Wishlist</span>
                <ChevronRight className="w-3 h-3" />
              </div>
            </Link>
          </div>

          {/* Interactive Tab Navigation */}
          <div className="flex items-center border-b border-[#1E3A66] space-x-6">
            <button
              onClick={() => setActiveTab('orders')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'orders'
                  ? 'text-[#F88379] border-b-2 border-[#F88379]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              Active Orders & Tracking
            </button>
            <button
              onClick={() => setActiveTab('profile')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'profile'
                  ? 'text-[#F88379] border-b-2 border-[#F88379]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              3D Fit Profile
            </button>
            <button
              onClick={() => setActiveTab('perks')}
              className={`pb-3 text-xs font-bold uppercase tracking-wider transition-all cursor-pointer ${
                activeTab === 'perks'
                  ? 'text-[#F88379] border-b-2 border-[#F88379]'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              VIP Drop Perks
            </button>
          </div>

          {/* TAB 1: ACTIVE ORDER TRACKING */}
          {activeTab === 'orders' && (
            <div className="space-y-4">
              <div className="bg-[#0A1728] border border-[#1E3A66] p-6 rounded-2xl">
                <div className="flex flex-wrap items-center justify-between pb-4 border-b border-[#1E3A66] gap-2">
                  <div>
                    <span className="text-xs text-slate-400 font-mono">ORDER #TRV-894291</span>
                    <h3 className="text-base font-black uppercase text-white mt-0.5">
                      Trevori 400 GSM Heavyweight French Terry Hoodie
                    </h3>
                  </div>
                  <div className="px-3 py-1 bg-[#10B981]/15 border border-[#10B981]/40 text-[#10B981] text-xs font-bold uppercase tracking-wider rounded-full flex items-center gap-1.5">
                    <Truck className="w-3.5 h-3.5" />
                    <span>In Transit • BlueDart Air</span>
                  </div>
                </div>

                {/* Tracking Progress Timeline */}
                <div className="py-6">
                  <div className="relative flex items-center justify-between">
                    <div className="absolute top-1/2 inset-x-0 h-1 bg-[#1E3A66] -translate-y-1/2 z-0" />
                    <div className="absolute top-1/2 left-0 w-3/4 h-1 bg-[#F88379] -translate-y-1/2 z-0" />

                    {/* Step 1 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#F88379] text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-white uppercase mt-2">Ordered</span>
                    </div>

                    {/* Step 2 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#F88379] text-white flex items-center justify-center text-xs font-bold">
                        ✓
                      </div>
                      <span className="text-[10px] font-bold text-white uppercase mt-2">Tailored</span>
                    </div>

                    {/* Step 3 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#F88379] text-white flex items-center justify-center text-xs font-bold shadow-[0_0_12px_#F88379]">
                        <Truck className="w-4 h-4" />
                      </div>
                      <span className="text-[10px] font-bold text-[#F88379] uppercase mt-2">Out for Delivery</span>
                    </div>

                    {/* Step 4 */}
                    <div className="relative z-10 flex flex-col items-center">
                      <div className="w-8 h-8 rounded-full bg-[#162B4D] border border-slate-600 text-slate-400 flex items-center justify-center text-xs">
                        ○
                      </div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase mt-2">Delivered</span>
                    </div>
                  </div>
                </div>

                <div className="flex flex-wrap items-center justify-between text-xs text-slate-300 pt-3 border-t border-[#1E3A66]/60 gap-3">
                  <div>
                    <span className="text-slate-400">Estimated Delivery:</span>{' '}
                    <strong className="text-white">Tomorrow by 4:00 PM</strong>
                  </div>
                  <div>
                    <span className="text-slate-400">Delivery Address:</span>{' '}
                    <span className="text-white">Indiranagar, Bangalore, KA 560038</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: 3D BESPOKE FIT PROFILE */}
          {activeTab === 'profile' && (
            <div className="bg-[#0A1728] border border-[#1E3A66] p-6 rounded-2xl space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-[#1E3A66]">
                <div>
                  <h3 className="text-base font-black uppercase text-white">Your Saved Tailor Specifications</h3>
                  <p className="text-xs text-slate-400 mt-0.5">
                    Synced automatically with your 3D Mannequin fitting room.
                  </p>
                </div>
                <Link
                  to="/try-on"
                  className="px-4 py-2 bg-[#F88379] text-white text-xs font-bold uppercase tracking-wider flex items-center gap-1.5"
                >
                  <Sliders className="w-3.5 h-3.5" />
                  <span>Open 3D Studio</span>
                </Link>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-center">
                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl">
                  <span className="text-[10px] font-bold text-[#F88379] uppercase tracking-wider">CHEST</span>
                  <div className="text-2xl font-black text-white mt-1">42 IN</div>
                  <span className="text-[10px] text-slate-400">Size L Recommended</span>
                </div>
                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl">
                  <span className="text-[10px] font-bold text-[#F88379] uppercase tracking-wider">HEIGHT</span>
                  <div className="text-2xl font-black text-white mt-1">6' 1"</div>
                  <span className="text-[10px] text-slate-400">185 CM • Ideal Drape</span>
                </div>
                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl">
                  <span className="text-[10px] font-bold text-[#F88379] uppercase tracking-wider">SILHOUETTE</span>
                  <div className="text-2xl font-black text-white mt-1">BOXY</div>
                  <span className="text-[10px] text-slate-400">Dropped Shoulders</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: VIP PERKS */}
          {activeTab === 'perks' && (
            <div className="bg-[#0A1728] border border-[#1E3A66] p-6 rounded-2xl space-y-4">
              <h3 className="text-base font-black uppercase text-white pb-3 border-b border-[#1E3A66]">
                Perspective Club Privileges
              </h3>
              <div className="space-y-3">
                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#F88379] uppercase">EXCLUSIVE DISCOUNT APPLIED</span>
                    <div className="text-sm font-black text-white mt-0.5">₹200 Off First Order (TREVORI200)</div>
                  </div>
                  <span className="px-2.5 py-1 bg-[#10B981]/20 text-[#10B981] text-xs font-bold rounded">Active</span>
                </div>
                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#F88379] uppercase">EARLY DROP ACCESS</span>
                    <div className="text-sm font-black text-white mt-0.5">Royal Traditional Drop Early Pass</div>
                  </div>
                  <span className="px-2.5 py-1 bg-[#F88379]/20 text-[#F88379] text-xs font-bold rounded">VIP Only</span>
                </div>
                <div className="p-4 bg-[#071324] border border-[#1E3A66] rounded-xl flex items-center justify-between">
                  <div>
                    <span className="text-xs font-bold text-[#F88379] uppercase">PAN-INDIA CONCIERGE</span>
                    <div className="text-sm font-black text-white mt-0.5">Complimentary 7-Day Size Exchanges</div>
                  </div>
                  <span className="text-xs text-slate-400">Always Included</span>
                </div>
              </div>
            </div>
          )}

        </div>
      </div>
    </div>
  );
};
