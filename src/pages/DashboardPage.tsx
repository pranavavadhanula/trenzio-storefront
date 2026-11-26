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
  Pencil,
  Palette,
  Layers,
  RefreshCw,
  Sparkles,
} from 'lucide-react';
import { ProductCard } from '../components/ProductCard';

type DashboardTab =
  | 'overview'
  | 'personal'
  | 'orders'
  | 'wishlist'
  | 'addresses'
  | 'returns'
  | 'security'
  | 'printrove';

export const DashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    user,
    isLoggedIn,
    login,
    logout,
    wishlist,
    products,
    formatPrice,
    addToCart,
    isSyncingPrintrove,
    syncPrintrove,
  } = useShop();

  const [activeTab, setActiveTab] = useState<DashboardTab>('overview');
  const [isCopied, setIsCopied] = useState(false);
  const [downloadingInvoice, setDownloadingInvoice] = useState<string | null>(null);

  // Printrove Dropship Studio State
  const [printroveDesigns, setPrintroveDesigns] = useState<any[]>([]);
  const [printroveSyncStatus, setPrintroveSyncStatus] = useState<string | null>(null);

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

  // Editing address state
  const [editingAddressId, setEditingAddressId] = useState<string | null>(null);
  const [editAddressData, setEditAddressData] = useState({
    type: 'Default Shipping',
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

  const handleStartEdit = (addr: any) => {
    setEditingAddressId(addr.id);
    setEditAddressData({
      type: addr.type,
      street: addr.street,
      city: addr.city,
      state: addr.state,
      pincode: addr.pincode,
      phone: addr.phone,
    });
  };

  const handleSaveEditAddress = (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingAddressId) return;
    setAddresses((prev) =>
      prev.map((addr) =>
        addr.id === editingAddressId
          ? {
              ...addr,
              type: editAddressData.type,
              street: editAddressData.street,
              city: editAddressData.city,
              state: editAddressData.state,
              pincode: editAddressData.pincode,
              phone: editAddressData.phone,
            }
          : addr
      )
    );
    setEditingAddressId(null);
  };

  const handleSaveSecurity = (e: React.FormEvent) => {
    e.preventDefault();
    if (passwordForm.newPassword) {
      if (passwordForm.newPassword.length < 6) {
        alert('New password must be at least 6 characters long.');
        return;
      }
      if (passwordForm.newPassword !== passwordForm.confirmPassword) {
        alert('New passwords do not match.');
        return;
      }
      // Update in registered users database
      try {
        const raw = localStorage.getItem('trevori_registered_users');
        if (raw) {
          const accounts = JSON.parse(raw);
          const idx = accounts.findIndex((a: any) => a.email?.toLowerCase() === user?.email?.toLowerCase());
          if (idx !== -1) {
            accounts[idx].password = passwordForm.newPassword;
            localStorage.setItem('trevori_registered_users', JSON.stringify(accounts));
          }
        }
      } catch (err) {
        console.error('Failed to update password in database:', err);
      }
    }
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
      <section className="bg-[#FFFFFF] border-b border-[#DDD8CE] py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#706B64] font-medium block mb-1.5">
              My Account
            </span>
            <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#171717] tracking-tight">
              Welcome, {user.name}
            </h1>
            <p className="text-xs text-[#706B64] font-light mt-1">
              Member since {user.joinedDate || 'November 2026'}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="bg-[#FFFFFF] border border-[#DDD8CE] px-5 py-2.5 text-left sm:text-right shadow-sm">
              <div className="text-[10px] uppercase tracking-wider text-[#706B64]">Store Credits</div>
              <div className="text-base font-semibold text-[#171717]">{formatPrice(user.creditsINR || 1500)}</div>
            </div>
            <button
              onClick={() => {
                logout();
                navigate('/login');
              }}
              className="flex items-center gap-2 bg-[#FFFFFF] border border-[#DDD8CE] px-4 py-3 text-xs uppercase tracking-wider text-[#706B64] hover:text-[#171717] hover:border-[#171717] font-medium transition-colors shadow-sm cursor-pointer"
              title="Sign Out of your account"
            >
              <LogOut className="w-3.5 h-3.5" />
              <span>Sign Out</span>
            </button>
          </div>
        </div>
      </section>

      {/* Main Dashboard Layout */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 mt-8 sm:mt-10">
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
                <span>Overview</span>
                <ArrowRight className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('orders')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'orders'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span>Orders</span>
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
                <span>Wishlist ({wishlist.length})</span>
                <Heart className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('personal')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'personal'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span>Personal Info</span>
                <User className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => setActiveTab('addresses')}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'addresses'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span>Saved Addresses</span>
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
                <span>Returns</span>
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
                <span>Security</span>
                <Lock className="w-3.5 h-3.5 opacity-60" />
              </button>

              <button
                onClick={() => {
                  setActiveTab('printrove');
                  fetch('/api/printrove/designs')
                    .then((r) => r.json())
                    .then((d) => setPrintroveDesigns(d.designs || []))
                    .catch(() => {});
                }}
                className={`w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium flex items-center justify-between transition-colors ${
                  activeTab === 'printrove'
                    ? 'bg-[#171717] text-white'
                    : 'text-[#706B64] hover:bg-[#F4F1EA] hover:text-[#171717]'
                }`}
              >
                <span className="flex items-center gap-2">
                  <span className="w-2 h-2 rounded-full bg-emerald-500 inline-block animate-pulse" />
                  <span>Printrove Studio</span>
                </span>
                <Palette className="w-3.5 h-3.5 opacity-60" />
              </button>

              {/* Log Out Option at Bottom Left */}
              <div className="pt-2 mt-2 border-t border-[#DDD8CE]">
                <button
                  onClick={() => {
                    logout();
                    navigate('/login');
                  }}
                  className="w-full text-left px-4 py-3 text-xs uppercase tracking-wider font-medium text-[#706B64] hover:text-red-700 hover:bg-red-50/60 transition-colors flex items-center justify-between cursor-pointer"
                  title="Log Out of your account"
                >
                  <span className="flex items-center gap-2">
                    <LogOut className="w-3.5 h-3.5" />
                    <span>Log Out</span>
                  </span>
                  <ArrowRight className="w-3.5 h-3.5 opacity-40" />
                </button>
              </div>
            </nav>
          </aside>

          {/* Tab Content Area */}
          <main className="lg:col-span-9 space-y-6">

            {/* TAB 1: OVERVIEW */}
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-fade-in-subtle">
                {/* 3 Clear Action Cards */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  {/* Orders Card */}
                  <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] uppercase tracking-wider text-[#706B64] font-medium">Orders</span>
                        <Package className="w-4 h-4 text-[#706B64]" />
                      </div>
                      <div className="font-serif text-3xl text-[#171717]">
                        {orders.length}
                      </div>
                      <p className="text-xs text-[#706B64] font-light mt-1">
                        {orders.length === 0 ? 'No active orders in progress' : `${orders.length} order being processed`}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('orders')}
                      className="mt-5 text-xs uppercase tracking-wider text-[#171717] hover:text-[#B9AA96] font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Orders</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Wishlist Card */}
                  <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] uppercase tracking-wider text-[#706B64] font-medium">Wishlist</span>
                        <Heart className="w-4 h-4 text-[#706B64]" />
                      </div>
                      <div className="font-serif text-3xl text-[#171717]">
                        {wishlist.length}
                      </div>
                      <p className="text-xs text-[#706B64] font-light mt-1">
                        {wishlist.length === 0 ? 'No saved items yet' : `${wishlist.length} items saved to your list`}
                      </p>
                    </div>
                    <button
                      onClick={() => setActiveTab('wishlist')}
                      className="mt-5 text-xs uppercase tracking-wider text-[#171717] hover:text-[#B9AA96] font-medium flex items-center gap-1.5 transition-colors"
                    >
                      <span>View Wishlist</span>
                      <ArrowRight className="w-3.5 h-3.5" />
                    </button>
                  </div>

                  {/* Member Discount Card */}
                  <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 flex flex-col justify-between">
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="text-[11px] uppercase tracking-wider text-[#706B64] font-medium">15% Discount</span>
                        <span className="px-2 py-0.5 bg-[#F4F1EA] text-[#171717] text-[10px] font-mono tracking-wider border border-[#DDD8CE]">CODE</span>
                      </div>
                      <div className="font-mono text-xl font-bold text-[#171717] tracking-wider">
                        TREVORI15
                      </div>
                      <p className="text-xs text-[#706B64] font-light mt-1">
                        Get 15% off your order at checkout
                      </p>
                    </div>
                    <button
                      onClick={() => handleCopyCode('TREVORI15')}
                      className="mt-5 text-xs uppercase tracking-wider text-[#171717] hover:text-[#B9AA96] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                    >
                      {isCopied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      <span>{isCopied ? 'Code Copied!' : 'Copy Code'}</span>
                    </button>
                  </div>
                </div>

                {/* Recent Orders Section */}
                <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8">
                  <div className="flex items-center justify-between mb-6 border-b border-[#DDD8CE] pb-4">
                    <div>
                      <h2 className="font-serif text-2xl text-[#171717]">Recent Order History</h2>
                      <p className="text-xs text-[#706B64] font-light mt-0.5">
                        Track live courier shipments and view invoices
                      </p>
                    </div>
                    <span className="text-[10px] uppercase tracking-widest px-2.5 py-1 bg-[#F4F1EA] border border-[#DDD8CE] text-[#706B64] font-medium">
                      {orders.length > 0 ? `${orders.length} Active` : '0 Orders'}
                    </span>
                  </div>

                  {orders.length > 0 ? (
                    <div className="p-4 bg-[#F4F1EA] border border-[#DDD8CE] text-xs space-y-2">
                      <div className="flex justify-between">
                        <span className="text-[#706B64]">Order ID:</span>
                        <span className="font-mono font-semibold">{orders[0].id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-[#706B64]">Courier:</span>
                        <span>{orders[0].carrier}</span>
                      </div>
                      <button
                        onClick={() => setActiveTab('orders')}
                        className="mt-4 text-xs uppercase tracking-widest font-semibold text-[#171717] hover:text-[#B9AA96] transition-colors flex items-center gap-1"
                      >
                        <span>View Order Details</span>
                        <ArrowRight className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div className="py-10 text-center">
                      <div className="w-12 h-12 rounded-full bg-[#F4F1EA] border border-[#DDD8CE] flex items-center justify-center mx-auto mb-3">
                        <Package className="w-5 h-5 text-[#706B64]" />
                      </div>
                      <h3 className="font-serif text-lg text-[#171717] mb-1">No orders placed yet</h3>
                      <p className="text-xs text-[#706B64] font-light max-w-sm mx-auto mb-5 leading-relaxed">
                        When you make a purchase, your order status and courier tracking will appear right here.
                      </p>
                      <Link
                        to="/collections"
                        className="inline-flex items-center gap-2 px-5 py-2.5 bg-[#171717] text-white hover:bg-[#333333] text-xs uppercase tracking-wider font-medium transition-all shadow-sm"
                      >
                        <span>Explore Collection</span>
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
                <div className="border-b border-[#DDD8CE] pb-4">
                  <h2 className="font-serif text-2xl text-[#171717] mb-1">Personal Details</h2>
                  <p className="text-xs text-[#706B64] font-light">
                    Update your personal contact details and default shipping address.
                  </p>
                </div>

                {personalSaved && (
                  <div className="p-3.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 font-medium flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Your profile details have been saved successfully.</span>
                  </div>
                )}

                <form onSubmit={handleSavePersonalInfo} className="space-y-5">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="text-[11px] uppercase tracking-wider text-[#706B64] block mb-1.5 font-medium">
                        Full Name
                      </label>
                      <input
                        type="text"
                        value={personalInfo.name}
                        onChange={(e) => setPersonalInfo({ ...personalInfo, name: e.target.value })}
                        className="w-full px-4 py-2.5 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all rounded-sm"
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
                        className="w-full px-4 py-2.5 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all rounded-sm"
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
                        className="w-full px-4 py-2.5 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all rounded-sm"
                      />
                    </div>
                  </div>

                  {/* Primary Delivery Address Section with Direct Edit Option */}
                  <div className="pt-5 border-t border-[#DDD8CE]">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-3">
                      <div>
                        <span className="text-[11px] uppercase tracking-wider text-[#706B64] font-medium block">
                          Default Shipping Address
                        </span>
                        <p className="text-xs text-[#171717] mt-1 font-normal leading-relaxed">
                          {addresses[0] ? (
                            <>
                              {addresses[0].street}, {addresses[0].city}, {addresses[0].state} {addresses[0].pincode}
                            </>
                          ) : (
                            'No default address set.'
                          )}
                        </p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          setActiveTab('addresses');
                          if (addresses[0]) {
                            handleStartEdit(addresses[0]);
                          }
                        }}
                        className="self-start sm:self-auto px-3.5 py-1.5 border border-[#DDD8CE] bg-white hover:bg-[#171717] hover:text-white text-xs uppercase tracking-wider font-medium text-[#171717] transition-all flex items-center gap-1.5 cursor-pointer shadow-sm"
                      >
                        <Pencil className="w-3.5 h-3.5" />
                        <span>Edit Address</span>
                      </button>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-[#DDD8CE] flex justify-end">
                    <button
                      type="submit"
                      className="px-6 py-2.5 bg-[#171717] text-white hover:bg-[#333333] text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer shadow-sm"
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
                  <form onSubmit={handleAddAddress} className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 space-y-4 shadow-sm">
                    <h3 className="font-serif text-lg text-[#171717]">New Delivery Destination</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">Address Label</label>
                        <input
                          type="text"
                          placeholder="e.g. Home, Studio, Office"
                          value={newAddress.type}
                          onChange={(e) => setNewAddress({ ...newAddress, type: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all rounded-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">Contact Phone</label>
                        <input
                          type="text"
                          placeholder="+91..."
                          value={newAddress.phone}
                          onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all rounded-sm"
                        />
                      </div>
                    </div>
                    <div>
                      <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">Street Address</label>
                      <input
                        type="text"
                        placeholder="Apartment, building, street..."
                        value={newAddress.street}
                        onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })}
                        className="w-full px-3.5 py-2.5 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all rounded-sm"
                        required
                      />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">City</label>
                        <input
                          type="text"
                          placeholder="City"
                          value={newAddress.city}
                          onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all rounded-sm"
                          required
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">State</label>
                        <input
                          type="text"
                          placeholder="State"
                          value={newAddress.state}
                          onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all rounded-sm"
                        />
                      </div>
                      <div>
                        <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">Postal PIN Code</label>
                        <input
                          type="text"
                          placeholder="Pincode"
                          value={newAddress.pincode}
                          onChange={(e) => setNewAddress({ ...newAddress, pincode: e.target.value })}
                          className="w-full px-3.5 py-2.5 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] focus:ring-1 focus:ring-[#171717] transition-all rounded-sm"
                        />
                      </div>
                    </div>
                    <div className="flex justify-end pt-2">
                      <button
                        type="submit"
                        className="px-5 py-2 bg-[#171717] text-white hover:bg-[#333333] text-xs uppercase tracking-widest font-medium transition-colors shadow-sm cursor-pointer"
                      >
                        Save Address
                      </button>
                    </div>
                  </form>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {addresses.map((addr) => (
                    <div key={addr.id} className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 relative flex flex-col justify-between shadow-sm">
                      {editingAddressId === addr.id ? (
                        <form onSubmit={handleSaveEditAddress} className="space-y-3">
                          <div className="flex items-center justify-between border-b border-[#DDD8CE] pb-2">
                            <span className="font-serif text-sm text-[#171717] font-medium">Edit Address</span>
                            <span className="text-[10px] uppercase tracking-wider text-[#706B64]">{addr.type}</span>
                          </div>
                          <div>
                            <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">Street Address</label>
                            <input
                              type="text"
                              value={editAddressData.street}
                              onChange={(e) => setEditAddressData({ ...editAddressData, street: e.target.value })}
                              className="w-full px-3 py-2 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] rounded-sm"
                              required
                            />
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">City</label>
                              <input
                                type="text"
                                value={editAddressData.city}
                                onChange={(e) => setEditAddressData({ ...editAddressData, city: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] rounded-sm"
                                required
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">State</label>
                              <input
                                type="text"
                                value={editAddressData.state}
                                onChange={(e) => setEditAddressData({ ...editAddressData, state: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] rounded-sm"
                              />
                            </div>
                          </div>
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">PIN Code</label>
                              <input
                                type="text"
                                value={editAddressData.pincode}
                                onChange={(e) => setEditAddressData({ ...editAddressData, pincode: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] rounded-sm"
                              />
                            </div>
                            <div>
                              <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">Phone</label>
                              <input
                                type="text"
                                value={editAddressData.phone}
                                onChange={(e) => setEditAddressData({ ...editAddressData, phone: e.target.value })}
                                className="w-full px-3 py-2 bg-white border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717] rounded-sm"
                              />
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              type="button"
                              onClick={() => setEditingAddressId(null)}
                              className="px-3 py-1.5 border border-[#DDD8CE] text-xs uppercase tracking-wider text-[#706B64] hover:bg-[#F4F1EA] rounded-sm transition-colors cursor-pointer"
                            >
                              Cancel
                            </button>
                            <button
                              type="submit"
                              className="px-4 py-1.5 bg-[#171717] text-white hover:bg-[#333333] text-xs uppercase tracking-wider font-medium rounded-sm transition-colors cursor-pointer"
                            >
                              Save Changes
                            </button>
                          </div>
                        </form>
                      ) : (
                        <>
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
                            <button
                              onClick={() => handleStartEdit(addr)}
                              className="text-xs uppercase tracking-wider text-[#171717] hover:text-[#B9AA96] font-medium flex items-center gap-1.5 transition-colors cursor-pointer"
                            >
                              <Pencil className="w-3.5 h-3.5" />
                              <span>Edit Address</span>
                            </button>
                            <button
                              onClick={() => handleDeleteAddress(addr.id)}
                              className="text-[#706B64] hover:text-red-600 transition-colors cursor-pointer p-1"
                              title="Remove address"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        </>
                      )}
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

            {/* TAB 8: PRINTROVE STUDIO & DROPSHIP SYNC */}
            {activeTab === 'printrove' && (
              <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-8 animate-fade-in-subtle">
                {/* Header */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-[#DDD8CE]">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-700 border border-emerald-200">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        API Connected
                      </span>
                      <span className="text-[10px] uppercase tracking-widest text-[#B9AA96] font-medium">
                        Merchant ID: 301918
                      </span>
                    </div>
                    <h2 className="font-serif text-2xl sm:text-3xl text-[#171717]">Printrove Design Studio</h2>
                    <p className="text-xs text-[#706B64] font-light mt-1 max-w-xl leading-relaxed">
                      Live Print-On-Demand garment sync. When you keep or upload new designs in your Printrove account, they automatically reflect on the Trevori storefront.
                    </p>
                  </div>

                  <button
                    onClick={async () => {
                      setPrintroveSyncStatus('Syncing live products and designs from Printrove...');
                      const res = await syncPrintrove();
                      if (res) {
                        setPrintroveSyncStatus(`✓ Successfully synced ${res.productsCount} products and ${res.designsCount} designs from Printrove!`);
                        fetch('/api/printrove/designs')
                          .then((r) => r.json())
                          .then((d) => setPrintroveDesigns(d.designs || []))
                          .catch(() => {});
                      } else {
                        setPrintroveSyncStatus('Synced products from cache.');
                      }
                      setTimeout(() => setPrintroveSyncStatus(null), 5000);
                    }}
                    disabled={isSyncingPrintrove}
                    className="inline-flex items-center gap-2 px-5 py-3 bg-[#171717] text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors disabled:opacity-60 cursor-pointer shadow-sm self-start sm:self-auto"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${isSyncingPrintrove ? 'animate-spin' : ''}`} />
                    <span>{isSyncingPrintrove ? 'Syncing...' : 'Sync Designs Now'}</span>
                  </button>
                </div>

                {/* Status Toast */}
                {printroveSyncStatus && (
                  <div className="p-3.5 bg-[#F4F1EA] border border-[#171717] text-xs text-[#171717] font-medium flex items-center justify-between animate-fade-in-subtle">
                    <span>{printroveSyncStatus}</span>
                    <button onClick={() => setPrintroveSyncStatus(null)} className="text-[#706B64] hover:text-black">✕</button>
                  </div>
                )}

                {/* API Account Credentials Card */}
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-xs">
                  <div className="p-4 bg-[#F4F1EA] border border-[#DDD8CE] space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#706B64] block font-semibold">Account Email</span>
                    <div className="font-mono text-[11px] text-[#171717] truncate font-medium">pranav.avadhanula@gmail.com</div>
                    <span className="text-[9px] text-[#706B64] block">Printrove Merchant Master</span>
                  </div>

                  <div className="p-4 bg-[#F4F1EA] border border-[#DDD8CE] space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#706B64] block font-semibold">Token Security</span>
                    <div className="text-[11px] text-emerald-800 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                      <span>Valid until 27/11/2027</span>
                    </div>
                    <span className="text-[9px] text-[#706B64] block">HMAC-SHA256 Encrypted</span>
                  </div>

                  <div className="p-4 bg-[#F4F1EA] border border-[#DDD8CE] space-y-1">
                    <span className="text-[10px] uppercase tracking-wider text-[#706B64] block font-semibold">Auto-Sync Destination</span>
                    <div className="text-[11px] text-[#171717] font-medium">Homepage & Collections</div>
                    <span className="text-[9px] text-[#706B64] block">Real-time apparel mockups</span>
                  </div>
                </div>

                {/* Live Synced Products from Printrove */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD8CE]">
                    <div className="flex items-center gap-2">
                      <Layers className="w-4 h-4 text-[#B9AA96]" />
                      <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#171717]">
                        Live Synced Products ({products.filter((p) => p.id.startsWith('printrove-')).length})
                      </h3>
                    </div>
                    <Link
                      to="/"
                      className="text-[10px] uppercase tracking-wider text-[#706B64] hover:text-[#171717] underline"
                    >
                      View on Homepage →
                    </Link>
                  </div>

                  {products.filter((p) => p.id.startsWith('printrove-')).length > 0 ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {products
                        .filter((p) => p.id.startsWith('printrove-'))
                        .map((prod) => (
                          <div
                            key={prod.id}
                            className="flex gap-4 p-4 border border-[#DDD8CE] bg-white hover:border-[#171717] transition-colors"
                          >
                            <div className="w-24 h-28 bg-[#F4F1EA] border border-[#DDD8CE] overflow-hidden flex-shrink-0">
                              <img
                                src={prod.images.primary}
                                alt={prod.name}
                                className="w-full h-full object-cover"
                              />
                            </div>
                            <div className="flex-1 flex flex-col justify-between text-xs">
                              <div>
                                <span className="text-[9px] uppercase tracking-widest text-[#B9AA96] font-semibold block">
                                  {prod.category} • Printrove Custom
                                </span>
                                <h4 className="font-serif text-base text-[#171717] font-normal mt-0.5">{prod.name}</h4>
                                <div className="font-semibold text-[#171717] mt-1">{formatPrice(prod.priceINR)}</div>
                              </div>

                              <div className="pt-2 text-[10px] text-[#706B64] space-y-1">
                                <div>
                                  <strong>Colors:</strong> {prod.colors.map((c) => c.name).join(', ')}
                                </div>
                                <div>
                                  <strong>Sizes:</strong> {prod.sizes.join(', ')}
                                </div>
                              </div>

                              <div className="pt-2 flex items-center gap-3">
                                <Link
                                  to={`/product/${prod.id}`}
                                  className="text-[10px] uppercase tracking-wider font-semibold text-[#171717] hover:underline flex items-center gap-1"
                                >
                                  <span>Inspect Product</span>
                                  <ExternalLink className="w-3 h-3" />
                                </Link>
                              </div>
                            </div>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="p-8 text-center bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#706B64]">
                      No products synced yet. Click "Sync Designs Now" above to pull your Printrove library!
                    </div>
                  )}
                </div>

                {/* Printrove Uploaded Design Library */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between pb-2 border-b border-[#DDD8CE]">
                    <div className="flex items-center gap-2">
                      <Palette className="w-4 h-4 text-[#B9AA96]" />
                      <h3 className="text-xs uppercase tracking-[0.2em] font-semibold text-[#171717]">
                        Printrove Design Library ({printroveDesigns.length})
                      </h3>
                    </div>
                    <a
                      href="https://printrove.com"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[10px] uppercase tracking-wider text-[#706B64] hover:text-[#171717] flex items-center gap-1"
                    >
                      <span>Upload More on Printrove</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>

                  {printroveDesigns.length > 0 ? (
                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      {printroveDesigns.map((d: any) => (
                        <div key={d.id} className="p-3 border border-[#DDD8CE] bg-white space-y-2">
                          <div className="aspect-square w-full bg-[#F4F1EA] border border-[#DDD8CE] flex items-center justify-center overflow-hidden p-2">
                            <img
                              src={d.thumbnail_url || d.original_url}
                              alt={d.name}
                              className="max-w-full max-h-full object-contain"
                            />
                          </div>
                          <div className="text-xs">
                            <div className="font-semibold text-[#171717] truncate">{d.name}</div>
                            <div className="text-[10px] text-[#706B64]">{d.dimension} • {d.extension}</div>
                          </div>
                          <a
                            href={d.original_url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-[9px] uppercase tracking-wider font-semibold text-[#B9AA96] hover:text-[#171717] inline-block"
                          >
                            View High-Res Artwork ↗
                          </a>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <button
                      onClick={() => {
                        fetch('/api/printrove/designs')
                          .then((r) => r.json())
                          .then((d) => setPrintroveDesigns(d.designs || []))
                          .catch(() => {});
                      }}
                      className="w-full py-4 bg-[#F4F1EA] border border-dashed border-[#DDD8CE] text-xs text-[#706B64] hover:text-[#171717] text-center"
                    >
                      Click to load uploaded designs from your Printrove Design Library
                    </button>
                  )}
                </div>

                {/* How it Works / Instructions */}
                <div className="p-5 bg-[#F4F1EA] border border-[#DDD8CE] space-y-2 text-xs">
                  <div className="font-semibold text-[#171717] uppercase tracking-wider text-[11px] flex items-center gap-1.5">
                    <Sparkles className="w-3.5 h-3.5 text-[#B9AA96]" />
                    <span>How Custom Apparel Drops Work</span>
                  </div>
                  <ol className="list-decimal list-inside space-y-1.5 text-[#706B64] font-light leading-relaxed text-[11px]">
                    <li>
                      <strong>Upload Artwork:</strong> Log in to your <a href="https://printrove.com" target="_blank" rel="noopener noreferrer" className="underline text-[#171717]">Printrove Merchant Panel</a> and add your graphics to the Design Library.
                    </li>
                    <li>
                      <strong>Create Garment:</strong> Apply your design to Oversized Tees, Hoodies, or Sweatshirts, and pick your available colorways.
                    </li>
                    <li>
                      <strong>Auto-Sync:</strong> Your Trevori website syncs with Printrove via API — new designs automatically appear on the <strong>Homepage ("Newest Drops")</strong> and Collections!
                    </li>
                    <li>
                      <strong>Zero Inventory:</strong> When orders occur, Printrove automatically prints, packs, and dispatches directly to the customer.
                    </li>
                  </ol>
                </div>
              </div>
            )}

          </main>
        </div>
      </div>
    </div>
  );
};
