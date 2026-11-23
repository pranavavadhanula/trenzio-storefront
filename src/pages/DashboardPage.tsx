import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  Package,
  Heart,
  LogOut,
  CheckCircle2,
  Clock,
  Truck,
  ArrowRight,
  ShieldCheck,
  MapPin,
  Copy,
  Check,
  Download,
  RotateCcw,
  User,
  Settings,
  Lock,
  Plus,
  Trash2,
  ShoppingBag,
  ExternalLink,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

type DashboardTab =
  | 'overview'
  | 'personal'
  | 'orders'
  | 'wishlist'
  | 'addresses'
  | 'returns'
  | 'security';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const { user, isLoggedIn, login, logout, wishlist, products, formatPrice, addToCart } = useShop();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isCopied, setIsCopied] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  // Personal Info Form State
  const [personalInfo, setPersonalInfo] = useState({
    name: user?.name || 'VIP Member',
    email: user?.email || 'member@trevori.com',
    phone: user?.phone || '+91 98765 43210',
    preferredSize: 'L',
    birthday: '1998-05-14',
  });
  const [personalSaved, setPersonalSaved] = useState(false);

  // Saved Addresses State
  const [addresses, setAddresses] = useState([
    {
      id: 'addr-1',
      name: user?.name || 'Member',
      type: 'Default Shipping',
      street: 'Flat 402, Skyline Residency, Bandra West',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400050',
      country: 'India',
      phone: '+91 98765 43210',
      isDefault: true,
    },
    {
      id: 'addr-2',
      name: user?.name || 'Member',
      type: 'Atelier / Studio',
      street: '14/B, Nariman Point Commercial Hub',
      city: 'Mumbai',
      state: 'Maharashtra',
      pincode: '400021',
      country: 'India',
      phone: '+91 98765 43210',
      isDefault: false,
    },
  ]);
  const [showAddressForm, setShowAddressForm] = useState(false);
  const [newAddress, setNewAddress] = useState({
    type: 'Home',
    street: '',
    city: '',
    state: '',
    pincode: '',
    phone: '',
  });

  // Returns / Exchange Wizard State
  const [returnSelectedOrder, setReturnSelectedOrder] = useState('TRV-2026-8942');
  const [returnReason, setReturnReason] = useState('Need a size smaller');
  const [returnItem, setReturnItem] = useState('Classic French Terry Boxy Hoodie');
  const [returnSubmitted, setReturnSubmitted] = useState(false);

  // Security Form State
  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);
  const [securitySaved, setSecuritySaved] = useState(false);

  // Wishlisted product objects
  const wishlistedProducts = products.filter((p) => wishlist.includes(p.id));

  interface OrderItem {
    name: string;
    size: string;
    color: string;
    priceINR: number;
    image: string;
  }
  interface Order {
    id: string;
    date: string;
    totalINR: number;
    status: string;
    carrier: string;
    trackingNumber: string;
    estimatedDelivery: string;
    currentStep: number;
    items: OrderItem[];
  }
  const orders: Order[] = [];

  const handleCopyCode = (code: string) => {
    navigator.clipboard.writeText(code);
    setIsCopied(true);
    setTimeout(() => setIsCopied(false), 2000);
  };

  const handleDownloadInvoice = (orderId: string) => {
    setDownloadingInvoice(orderId);
    setTimeout(() => {
      setDownloadingInvoice(null);
      alert(`TREVORI Tax Invoice #${orderId}-GST downloaded.`);
    }, 1200);
  };

  const handleSavePersonalInfo = (e: React.FormEvent) => {
    e.preventDefault();
    login({
      name: personalInfo.name,
      email: personalInfo.email,
      phone: personalInfo.phone,
    });
    setPersonalSaved(true);
    setTimeout(() => setPersonalSaved(false), 2500);
  };

  const handleAddAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAddress.street || !newAddress.city) return;
    setAddresses([
      ...addresses,
      {
        id: `addr-${Date.now()}`,
        name: personalInfo.name,
        type: newAddress.type,
        street: newAddress.street,
        city: newAddress.city,
        state: newAddress.state || 'Maharashtra',
        pincode: newAddress.pincode || '400001',
        country: 'India',
        phone: newAddress.phone || personalInfo.phone,
        isDefault: false,
      },
    ]);
    setShowAddressForm(false);
    setNewAddress({ type: 'Home', street: '', city: '', state: '', pincode: '', phone: '' });
  };

  const handleDeleteAddress = (id: string) => {
    setAddresses(addresses.filter((a) => a.id !== id));
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    setSecuritySaved(true);
    setPasswordForm({ currentPassword: '', newPassword: '', confirmPassword: '' });
    setTimeout(() => setSecuritySaved(false), 2500);
  };

  // If not logged in, show elegant login prompt
  if (!isLoggedIn || !user) {
    return (
      <div className="min-h-[80vh] flex items-center justify-center px-4 bg-[#F4F1EA] text-[#171717] font-sans py-16">
        <div className="max-w-md w-full bg-[#FFFFFF] border border-[#DDD8CE] p-8 sm:p-10 text-center shadow-sm">
          <span className="text-[10px] font-medium uppercase tracking-[0.3em] text-[#706B64] block mb-2">
            Member Account
          </span>
          <h2 className="font-serif text-3xl font-normal text-[#171717] mb-3">
            My Account
          </h2>
          <p className="text-xs text-[#706B64] font-light mb-8 leading-relaxed">
            Please sign in to track orders, manage your profile, saved addresses, and member benefits.
          </p>

          <div className="space-y-3">
            <Link
              to="/login"
              className="w-full block py-3.5 bg-[#171717] text-white hover:bg-[#333333] transition-colors text-xs uppercase tracking-[0.2em] font-medium"
            >
              Sign In to Your Account
            </Link>

            <button
              onClick={() => {
                login({
                  name: 'PRANAV AVADHANULA',
                  email: 'pranav@trevori.com',
                  tier: 'Noir Member',
                  creditsINR: 1500,
                  points: 4800,
                });
              }}
              className="w-full py-3 bg-[#F4F1EA] text-[#171717] border border-[#DDD8CE] hover:border-[#171717] text-xs uppercase tracking-[0.15em] font-medium transition-colors cursor-pointer"
            >
              1-Click Instant Demo Access
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#171717] font-sans pb-24">
      {/* Account Header Banner */}
      <section className="bg-[#FFFFFF] border-b border-[#DDD8CE] py-8 sm:py-14">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="flex items-center gap-2 mb-2">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#B9AA96] font-semibold">
                TREVORI MEMBERSHIP
              </span>
              <span className="text-xs text-[#DDD8CE]">&bull;</span>
              <span className="bg-[#F4F1EA] text-[#171717] text-[10px] tracking-widest uppercase px-2.5 py-0.5 border border-[#DDD8CE] font-medium">
                {user.tier || 'Noir Member'}
              </span>
            </div>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#171717] tracking-tight">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-[#706B64] font-light mt-1">
              Member ID: TRV-8942-IN &bull; Member since {user.joinedDate || 'November 2026'}
            </p>
          </div>

          <div className="flex items-center gap-4">
            <div className="bg-[#F4F1EA] border border-[#DDD8CE] px-4 py-2.5 text-left sm:text-right w-full sm:w-auto">
              <div className="text-[10px] uppercase tracking-wider text-[#706B64]">Store Credits</div>
              <div className="text-base font-semibold text-[#171717]">{formatPrice(user.creditsINR || 1500)}</div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Dashboard Layout with 7 Tabs */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-8 sm:mt-12">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10">
          
          {/* Navigation Sidebar */}
          <aside className="lg:col-span-3">
            <nav className="bg-[#FFFFFF] border border-[#DDD8CE] p-2 space-y-1">
              <button
                onClick={() => setActiveTab('overview')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'overview'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span>1. Overview</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'personal'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span>2. Personal Info</span>
                <User className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span>3. Order Tracking</span>
                <Package className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('wishlist')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'wishlist'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span>4. Wishlist ({wishlist.length})</span>
                <Heart className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span>5. Saved Addresses</span>
                <MapPin className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('returns')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'returns'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span>6. Returns & Exchanges</span>
                <RotateCcw className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('security')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'security'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span>7. Account Security</span>
                <Lock className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Bottom Left Sign Out Button */}
              <div className="pt-2 border-t border-[#DDD8CE]/70 mt-2">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium text-rose-600 hover:bg-rose-50 hover:text-rose-700 transition-colors flex items-center justify-between cursor-pointer border border-transparent hover:border-rose-200"
                  title="Sign out to Login Dashboard"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-4 h-4" />
                    <span>Sign Out</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-60" />
                </button>
              </div>
            </nav>
          </aside>

          {/* Tab Content Area */}
          <main className="lg:col-span-9 space-y-6">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in-subtle">
                {/* Status Snapshot Banner */}
                <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8">
                  <h2 className="font-serif text-2xl text-[#171717] mb-2">Account Overview</h2>
                  <p className="text-xs text-[#706B64] font-light leading-relaxed mb-6">
                    Track your orders, view member benefits, and update your sizing in one place.
                  </p>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div className="p-4 bg-[#F4F1EA] border border-[#DDD8CE]">
                      <span className="text-[10px] uppercase tracking-wider text-[#706B64]">Active Orders</span>
                      <div className="font-serif text-2xl text-[#171717] mt-1">{orders.length} In Progress</div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="text-[10px] uppercase tracking-wider text-[#171717] font-semibold mt-2 underline"
                      >
                        Track Status &rarr;
                      </button>
                    </div>

                    <div className="p-4 bg-[#F4F1EA] border border-[#DDD8CE]">
                      <span className="text-[10px] uppercase tracking-wider text-[#706B64]">Saved Wishlist</span>
                      <div className="font-serif text-2xl text-[#171717] mt-1">{wishlist.length} Items</div>
                      <button
                        onClick={() => setActiveTab('wishlist')}
                        className="text-[10px] uppercase tracking-wider text-[#171717] font-semibold mt-2 underline"
                      >
                        View Items &rarr;
                      </button>
                    </div>

                    <div className="p-4 bg-[#F4F1EA] border border-[#DDD8CE]">
                      <span className="text-[10px] uppercase tracking-wider text-[#706B64]">Member Discount Code</span>
                      <div className="font-mono text-sm font-bold text-[#171717] mt-1">TREVORI-VIP-NOIR</div>
                      <button
                        onClick={() => handleCopyCode('TREVORI-VIP-NOIR')}
                        className="text-[10px] uppercase tracking-wider text-[#171717] font-semibold mt-2 flex items-center gap-1"
                      >
                        {isCopied ? <Check className="w-3 h-3 text-[#171717]" /> : <Copy className="w-3 h-3" />}
                        <span>{isCopied ? 'Copied' : 'Copy 15% VIP Code'}</span>
                      </button>
                    </div>
                  </div>
                </div>

                {/* Latest Shipment Teaser */}
                <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="font-serif text-xl text-[#171717]">Recent Order</h3>
                    <span className="bg-[#DDD8CE] text-[#171717] text-[10px] uppercase tracking-widest px-2.5 py-1">
                      {orders.length > 0 ? "In Transit" : "No Active Orders"}
                    </span>
                  </div>

                  {orders.length > 0 ? (
                    <div className="p-4 bg-[#F4F1EA] border border-[#DDD8CE] text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#706B64]">Order Reference:</span>
                        <span className="font-mono font-semibold">{orders[0].id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#706B64]">Courier Carrier:</span>
                        <span>{orders[0].carrier}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="mt-4 text-xs uppercase tracking-widest font-semibold text-[#171717] hover:text-[#B9AA96] transition-colors flex items-center gap-1"
                      >
                        <span>View Full Live Timeline</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="p-5 bg-[#F4F1EA] border border-[#DDD8CE] text-center">
                      <p className="text-xs text-[#706B64] font-light mb-3">
                        You have no active orders yet. When you place an order, it will appear here.
                      </p>
                      <Link
                        to="/collections"
                        className="inline-flex items-center gap-1.5 text-xs uppercase tracking-widest font-medium text-[#171717] hover:text-[#B9AA96] transition-colors"
                      >
                        <span>Start Shopping</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            )}

            {/* TAB 2: PERSONAL INFORMATION */}
            {activeTab === 'personal' && (
              <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-6 animate-fade-in-subtle">
                <div>
                  <h2 className="font-serif text-2xl text-[#171717] mb-1">Personal Information</h2>
                  <p className="text-xs text-[#706B64] font-light">
                    Update your personal details, contact info, and size preferences.
                  </p>
                </div>

                {personalSaved && (
                  <div className="p-3 bg-[#F4F1EA] border border-[#171717] text-xs text-[#171717] font-medium">
                    ✓ Your profile preferences have been successfully updated.
                  </div>
                )}

                <form onSubmit={handleSavePersonalInfo} className="space-y-4">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#706B64] block mb-1.5 font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#706B64] block mb-1.5 font-medium">
                        Email Address
                      </label>
                      <input
                        type="email"
                        value={personalInfo.email}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, email: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#706B64] block mb-1.5 font-medium">
                        Phone Number
                      </label>
                      <input
                        type="text"
                        value={personalInfo.phone}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, phone: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                      />
                    </div>

                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#706B64] block mb-1.5 font-medium">
                        Preferred Streetwear Size
                      </label>
                      <select
                        value={personalInfo.preferredSize}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, preferredSize: e.target.value })}
                        className="w-full px-4 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                      >
                        <option value="XS">XS — Extra Small</option>
                        <option value="S">S — Small (Boxy Drape)</option>
                        <option value="M">M — Medium</option>
                        <option value="L">L — Large (Standard Oversized)</option>
                        <option value="XL">XL — Extra Large</option>
                        <option value="2XL">2XL — Voluminous Cut</option>
                      </select>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#DDD8CE] flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] text-white hover:bg-[#333333] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                    >
                      Save Profile Changes
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* TAB 3: ORDER TRACKING */}
            {activeTab === 'orders' && (
              <div className="space-y-6 animate-fade-in-subtle">
                <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8">
                  <h2 className="font-serif text-2xl text-[#171717] mb-1">Order Tracking & History</h2>
                  <p className="text-xs text-[#706B64] font-light">
                    Real-time status updates powered directly by Shopify Storefront API and courier webhooks.
                  </p>
                </div>

                {orders.length === 0 ? (
                  <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-12 sm:p-16 text-center space-y-3">
                    <Package className="w-10 h-10 text-[#706B64] mx-auto opacity-60" />
                    <p className="font-serif text-2xl text-[#171717]">No active orders found.</p>
                    <p className="text-xs text-[#706B64] max-w-md mx-auto font-light leading-relaxed">
                      Orders have been cleared from the database pending Shopify storefront integration and catalog upload. When an order is completed, live Blue Dart tracking milestones and PDF invoices will appear here.
                    </p>
                    <div className="pt-3">
                      <Link
                        to="/collections"
                        className="inline-block px-6 py-2.5 bg-[#171717] hover:bg-[#333333] text-white text-xs uppercase tracking-widest font-medium transition-colors"
                      >
                        Explore Current Drop
                      </Link>
                    </div>
                  </div>
                ) : (
                  orders.map((order) => (
                  <div key={order.id} className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-6">
                    {/* Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-[#DDD8CE]">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm font-bold text-[#171717]">{order.id}</span>
                          <span className="text-xs text-[#DDD8CE]">&bull;</span>
                          <span className="text-xs text-[#706B64]">{order.date}</span>
                        </div>
                        <div className="text-[11px] text-[#706B64] mt-0.5">
                          Carrier: <strong className="text-[#171717]">{order.carrier}</strong> &bull; Tracking ID: {order.trackingNumber}
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => handleDownloadInvoice(order.id)}
                          className="px-3 py-1.5 border border-[#DDD8CE] hover:border-[#171717] text-[10px] uppercase tracking-wider text-[#706B64] hover:text-[#171717] flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Download className="w-3 h-3" />
                          <span>{downloadingInvoice === order.id ? 'Generating...' : 'Invoice (PDF)'}</span>
                        </button>

                        <span className={`px-2.5 py-1 text-[10px] uppercase tracking-widest font-medium ${
                          order.status === 'Delivered'
                            ? 'bg-[#DDD8CE] text-[#171717]'
                            : 'bg-[#171717] text-white'
                        }`}>
                          {order.status}
                        </span>
                      </div>
                    </div>

                    {/* Progress Stepper */}
                    <div className="py-2">
                      <div className="grid grid-cols-4 gap-2 text-center text-xs">
                        {['Confirmed', 'Sourced & Cut', 'In Transit', 'Delivered'].map((step, idx) => {
                          const isDone = idx + 1 <= order.currentStep;
                          const isCurrent = idx + 1 === order.currentStep;
                          return (
                            <div key={step} className="flex flex-col items-center">
                              <div
                                className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] mb-1 font-semibold ${
                                  isDone
                                    ? 'bg-[#171717] text-white'
                                    : 'bg-[#F4F1EA] text-[#706B64] border border-[#DDD8CE]'
                                }`}
                              >
                                {isDone ? '✓' : idx + 1}
                              </div>
                              <span className={`text-[10px] uppercase tracking-wider ${isCurrent ? 'font-bold text-[#171717]' : 'text-[#706B64]'}`}>
                                {step}
                              </span>
                            </div>
                          );
                        })}
                      </div>
                      <div className="w-full bg-[#DDD8CE] h-1 mt-3 relative">
                        <div
                          className="bg-[#171717] h-1 transition-all duration-500"
                          style={{ width: `${(order.currentStep / 4) * 100}%` }}
                        />
                      </div>
                    </div>

                    {/* Items in this order */}
                    <div className="space-y-3 pt-2">
                      <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-medium block">
                        Order Contents ({order.items.length})
                      </span>
                      {order.items.map((item, idx) => (
                        <div key={idx} className="flex items-center justify-between p-3 bg-[#F4F1EA] border border-[#DDD8CE]">
                          <div className="flex items-center gap-3">
                            <div className="w-12 h-15 bg-[#FFFFFF] border border-[#DDD8CE] overflow-hidden">
                              <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                            </div>
                            <div>
                              <div className="text-xs font-semibold text-[#171717]">{item.name}</div>
                              <div className="text-[10px] text-[#706B64]">Size: {item.size} &bull; Color: {item.color}</div>
                            </div>
                          </div>
                          <div className="text-xs font-bold text-[#171717]">
                            {formatPrice(item.priceINR)}
                          </div>
                        </div>
                      ))}
                    </div>

                    <div className="flex justify-between items-center pt-2 text-xs border-t border-[#DDD8CE]">
                      <span className="text-[#706B64]">Total Paid (Incl. Express Dispatch & Tax):</span>
                      <span className="font-serif text-lg font-bold text-[#171717]">{formatPrice(order.totalINR)}</span>
                    </div>
                  </div>
                  ))
                )}
              </div>
            )}

            {/* TAB 4: WISHLIST */}
            {activeTab === 'wishlist' && (
              <div className="space-y-6 animate-fade-in-subtle">
                <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-[#171717] mb-1">Your Wishlist</h2>
                    <p className="text-xs text-[#706B64] font-light">
                      Items saved to your wishlist.
                    </p>
                  </div>
                  <span className="text-xs text-[#706B64] font-medium">{wishlist.length} Items</span>
                </div>

                {wishlistedProducts.length === 0 ? (
                  <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-12 text-center">
                    <p className="font-serif text-2xl text-[#171717] mb-2">Your wishlist is empty.</p>
                    <p className="text-xs text-[#706B64] mb-6">
                      Explore our collection and click the heart icon on any item to save it for later.
                    </p>
                    <Link
                      to="/collections"
                      className="inline-block px-6 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-widest font-medium"
                    >
                      Browse Catalog
                    </Link>
                  </div>
                ) : (
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 sm:gap-6">
                    {wishlistedProducts.map((p) => (
                      <ProductCard key={p.id} product={p} />
                    ))}
                  </div>
                )}
              </div>
            )}

            {/* TAB 5: SAVED ADDRESSES */}
            {activeTab === 'addresses' && (
              <div className="space-y-6 animate-fade-in-subtle">
                <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 flex items-center justify-between">
                  <div>
                    <h2 className="font-serif text-2xl text-[#171717] mb-1">Saved Addresses</h2>
                    <p className="text-xs text-[#706B64] font-light">
                      Manage your delivery addresses for quick and easy checkout.
                    </p>
                  </div>
                  <button
                    onClick={() => setShowAddressForm(!showAddressForm)}
                    className="px-4 py-2 bg-[#171717] text-white hover:bg-[#333333] text-xs uppercase tracking-widest font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>{showAddressForm ? 'Cancel' : 'Add New'}</span>
                  </button>
                </div>

                {showAddressForm && (
                  <form onSubmit={handleAddAddress} className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 space-y-4">
                    <h3 className="font-serif text-lg text-[#171717]">New Delivery Destination</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1">Address Label</label>
                        <input
                          type="text"
                          placeholder="e.g. Home, Studio, Office"
                          value={newAddress.type}
                          onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1">Contact Phone</label>
                        <input
                          type="text"
                          placeholder="+91..."
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1">Street Address</label>
                      <input
                        type="text"
                        placeholder="Apartment, building, street..."
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-3 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1">City</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1">State</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1">Postal PIN Code</label>
                        <input
                          type="text"
                          placeholder="Pincode"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          className="w-full px-3 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#171717] text-white text-xs uppercase tracking-widest font-medium"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 relative flex flex-col justify-between">
                      <div>
                        <div className="flex items-center justify-between mb-2">
                          <span className="font-semibold text-xs text-[#171717] uppercase tracking-wider">{addr.type}</span>
                          {addr.isDefault && (
                            <span className="text-[9px] bg-[#DDD8CE] text-[#171717] px-2 py-0.5 uppercase tracking-widest font-medium">
                              Default
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-[#171717] font-medium">{addr.name}</p>
                        <p className="text-xs text-[#706B64] font-light mt-1 leading-relaxed">
                          {addr.street}<br />
                          {addr.city}, {addr.state} {addr.pincode}<br />
                          {addr.country}
                        </p>
                        <p className="text-xs text-[#706B64] mt-2 font-light">Tel: {addr.phone}</p>
                      </div>

                      <div className="pt-4 mt-4 border-t border-[#DDD8CE] flex justify-between items-center text-xs">
                        <span className="text-[#B9AA96] text-[10px] uppercase tracking-wider">Saved Address</span>
                        <button
                          onClick={() => handleDeleteAddress(addr.id)}
                          className="text-[#706B64] hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* TAB 6: RETURNS AND EXCHANGES */}
            {activeTab === 'returns' && (
              <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-6 animate-fade-in-subtle">
                <div>
                  <h2 className="font-serif text-2xl text-[#171717] mb-1">Returns & Exchanges</h2>
                  <p className="text-xs text-[#706B64] font-light">
                    Complimentary 7-day doorstep size exchange and returns for all Trevori garments.
                  </p>
                </div>

                {returnSubmitted ? (
                  <div className="p-6 bg-[#F4F1EA] border border-[#DDD8CE] text-center space-y-3">
                    <CheckCircle2 className="w-8 h-8 text-[#171717] mx-auto" />
                    <h3 className="font-serif text-xl text-[#171717]">Exchange Request #EX-9921 Initiated</h3>
                    <p className="text-xs text-[#706B64] max-w-md mx-auto leading-relaxed">
                      Our courier partner will arrive at your default address within 48 hours to collect the piece in original tags. Your replacement item is pre-reserved in our atelier.
                    </p>
                    <button
                      onClick={() => setReturnSubmitted(false)}
                      className="px-6 py-2 bg-[#171717] text-white text-xs uppercase tracking-widest font-medium"
                    >
                      File Another Request
                    </button>
                  </div>
                ) : (
                  <form
                    onSubmit={(e) => {
                      e.preventDefault();
                      setReturnSubmitted(true);
                    }}
                    className="space-y-4"
                  >
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">
                        Select Order for Exchange / Return
                      </label>
                      <select
                        value={returnSelectedOrder}
                        onChange={(e) => setReturnSelectedOrder(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                      >
                        <option value="TRV-2026-8942">Order #TRV-2026-8942 (20 Nov 2026) — 2 items</option>
                        <option value="TRV-2026-7731">Order #TRV-2026-7731 (04 Oct 2026) — 1 item</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">
                        Select Garment
                      </label>
                      <select
                        value={returnItem}
                        onChange={(e) => setReturnItem(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                      >
                        <option value="Classic French Terry Boxy Hoodie">Classic French Terry Boxy Hoodie (Size L)</option>
                        <option value="Relaxed Pleated Wide-Leg Cargo Pants">Relaxed Pleated Wide-Leg Cargo Pants (Size 32)</option>
                      </select>
                    </div>

                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">
                        Reason for Exchange
                      </label>
                      <select
                        value={returnReason}
                        onChange={(e) => setReturnReason(e.target.value)}
                        className="w-full px-4 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                      >
                        <option value="Need a size smaller">Need a size smaller (Swap for Medium)</option>
                        <option value="Need a size larger">Need a size larger (Swap for XL)</option>
                        <option value="Color swap">Prefer another colorway</option>
                        <option value="Store credit return">Return for Store Credit</option>
                      </select>
                    </div>

                    <div className="p-4 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#706B64] space-y-1">
                      <div className="font-semibold text-[#171717]">Trevori Guarantee:</div>
                      <div>&bull; Doorstep pickup with zero courier fees.</div>
                      <div>&bull; Replacement dispatched immediately upon pickup scan.</div>
                    </div>

                    <div className="pt-2 flex justify-end">
                      <button
                        type="submit"
                        className="px-6 py-2.5 bg-[#171717] text-white hover:bg-[#333333] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                      >
                        Submit Exchange Request
                      </button>
                    </div>
                  </form>
                )}
              </div>
            )}

            {/* TAB 7: ACCOUNT SECURITY */}
            {activeTab === 'security' && (
              <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-6 animate-fade-in-subtle">
                <div>
                  <h2 className="font-serif text-2xl text-[#171717] mb-1">Account Security</h2>
                  <p className="text-xs text-[#706B64] font-light">
                    Manage authentication credentials, two-factor authentication, and Shopify token security.
                  </p>
                </div>

                {securitySaved && (
                  <div className="p-3 bg-[#F4F1EA] border border-[#171717] text-xs text-[#171717] font-medium">
                    ✓ Security settings updated successfully.
                  </div>
                )}

                <form onSubmit={handleSaveSecurity} className="space-y-4">
                  <div>
                    <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">
                      Current Password
                    </label>
                    <input
                      type="password"
                      value={passwordForm.currentPassword}
                      onChange={(e) => setPasswordForm({ ...passwordForm, currentPassword: e.target.value })}
                      placeholder="••••••••••••"
                      className="w-full px-4 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">
                        New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.newPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, newPassword: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                      />
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">
                        Confirm New Password
                      </label>
                      <input
                        type="password"
                        value={passwordForm.confirmPassword}
                        onChange={(e) => setPasswordForm({ ...passwordForm, confirmPassword: e.target.value })}
                        placeholder="••••••••••••"
                        className="w-full px-4 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717]"
                      />
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#DDD8CE] flex items-center justify-between">
                    <div>
                      <div className="text-xs font-semibold text-[#171717]">Two-Factor Authentication (2FA)</div>
                      <div className="text-[11px] text-[#706B64]">Authenticate via SMS or Authenticator App on new devices.</div>
                    </div>
                    <button
                      type="button"
                      onClick={() => setTwoFactorEnabled(!twoFactorEnabled)}
                      className={`px-3 py-1 text-xs uppercase tracking-wider font-semibold border ${
                        twoFactorEnabled
                          ? 'bg-[#171717] text-white border-[#171717]'
                          : 'bg-[#FFFFFF] text-[#706B64] border-[#DDD8CE]'
                      }`}
                    >
                      {twoFactorEnabled ? 'Enabled' : 'Disabled'}
                    </button>
                  </div>

                  <div className="pt-2 flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] text-white hover:bg-[#333333] text-xs uppercase tracking-[0.2em] font-medium transition-colors cursor-pointer"
                    >
                      Update Security
                    </button>
                  </div>
                </form>

                {/* Shopify API Authentication Status */}
                <div className="pt-4 border-t border-[#DDD8CE] text-xs space-y-1">
                  <div className="font-semibold text-[#171717] flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#B9AA96]" />
                    <span>Shopify Customer Account Architecture Active</span>
                  </div>
                  <p className="text-[#706B64] text-[11px] leading-relaxed">
                    Customer records, cart checkouts, and address records are cryptographically secured and synchronized with Shopify Storefront API Customer protocols.
                  </p>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};
