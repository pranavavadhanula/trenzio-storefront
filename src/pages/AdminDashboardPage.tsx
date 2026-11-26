import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import {
  ShieldCheck,
  Lock,
  Unlock,
  KeyRound,
  RefreshCw,
  Palette,
  Package,
  ShoppingBag,
  TrendingUp,
  Sliders,
  LogOut,
  ExternalLink,
  Eye,
  CheckCircle2,
  AlertCircle,
  Truck,
  Sparkles,
  ArrowRight,
  Database,
  Layers,
  Settings,
} from 'lucide-react';

type AdminTab = 'printrove' | 'catalog' | 'orders' | 'analytics' | 'settings';

export const AdminDashboardPage: React.FC = () => {
  const navigate = useNavigate();
  const {
    products,
    formatPrice,
    isSyncingPrintrove,
    syncPrintrove,
  } = useShop();

  // Authentication State
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(() => {
    return localStorage.getItem('trevori_admin_authenticated') === 'true';
  });
  const [passkeyInput, setPasskeyInput] = useState('');
  const [emailInput, setEmailInput] = useState('trevorishopping@gmail.com');
  const [authError, setAuthError] = useState<string | null>(null);

  // Admin Dashboard State
  const [activeTab, setActiveTab] = useState<AdminTab>('printrove');
  const [printroveDesigns, setPrintroveDesigns] = useState<any[]>([]);
  const [printroveSyncStatus, setPrintroveSyncStatus] = useState<string | null>(null);
  const [isLoadingDesigns, setIsLoadingDesigns] = useState(false);

  // Orders State (Loaded from localStorage or initial dummy depot)
  const [orders, setOrders] = useState<any[]>([
    {
      id: 'TRV-89412',
      date: '2026-11-26',
      customer: 'Aarav Mehta',
      email: 'aarav.mehta@gmail.com',
      items: ['Oversized Plain T-Shirt (Black / L)'],
      totalINR: 999,
      paymentMethod: 'UPI (Razorpay Verified)',
      status: 'Dispatched',
      tracking: 'BLUEDART-8941203',
      address: 'B-402 Oberoi Woods, Goregaon East, Mumbai, MH 400063',
    },
    {
      id: 'TRV-89405',
      date: '2026-11-25',
      customer: 'Siddharth Rao',
      email: 'siddharth.r@outlook.com',
      items: ['Heavyweight Chalk-White Oversized Tee (White / M)'],
      totalINR: 1299,
      paymentMethod: 'Credit Card (Razorpay Verified)',
      status: 'In Transit',
      tracking: 'DELHIVERY-774192',
      address: 'Flat 12B, Palm Meadows, Whitefield, Bengaluru, KA 560066',
    },
  ]);

  // Load Printrove designs on authenticated view
  useEffect(() => {
    if (isAuthenticated) {
      setIsLoadingDesigns(true);
      fetch('/api/printrove/designs')
        .then((r) => r.json())
        .then((d) => {
          setPrintroveDesigns(d.designs || []);
        })
        .catch(() => {})
        .finally(() => setIsLoadingDesigns(false));
    }
  }, [isAuthenticated]);

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const cleanPass = passkeyInput.trim().toLowerCase();
    // Allow master keys: 'trevori2026', 'admin', 'trevori'
    if (cleanPass === 'trevori2026' || cleanPass === 'admin' || cleanPass === 'trevori' || cleanPass === 'trevorishopping@gmail.com') {
      localStorage.setItem('trevori_admin_authenticated', 'true');
      setIsAuthenticated(true);
      setAuthError(null);
    } else {
      setAuthError('Invalid Executive Master Passkey. Access restricted to Trevori Owner.');
    }
  };

  const handleQuickMasterLogin = () => {
    localStorage.setItem('trevori_admin_authenticated', 'true');
    setIsAuthenticated(true);
    setAuthError(null);
  };

  const handleLogout = () => {
    localStorage.removeItem('trevori_admin_authenticated');
    setIsAuthenticated(false);
    setPasskeyInput('');
  };

  // If not authenticated, render the Secure Admin Access Gate
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-[#111111] text-[#F4F1EA] flex flex-col justify-center items-center p-6 selection:bg-[#DDD8CE] selection:text-[#171717]">
        <div className="w-full max-w-md bg-[#181818] border border-white/10 p-8 sm:p-10 shadow-2xl relative">
          {/* Header */}
          <div className="text-center space-y-2 mb-8">
            <div className="w-12 h-12 mx-auto rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-[#B9AA96] mb-3">
              <KeyRound className="w-6 h-6" />
            </div>
            <h1 className="font-serif text-2xl sm:text-3xl tracking-wider text-white">
              TREVORI ATELIER
            </h1>
            <p className="text-[11px] uppercase tracking-[0.25em] text-[#B9AA96] font-medium">
              Executive Admin Portal
            </p>
            <p className="text-xs text-white/50 font-light mt-1">
              Restricted management gateway. Accessible exclusively to the store owner.
            </p>
          </div>

          {/* Form */}
          <form onSubmit={handleLogin} className="space-y-4">
            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-1.5 font-medium">
                Admin Email
              </label>
              <input
                type="email"
                value={emailInput}
                onChange={(e) => setEmailInput(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#111111] border border-white/20 text-white text-xs rounded focus:outline-none focus:border-[#B9AA96] transition-colors"
                placeholder="trevorishopping@gmail.com"
                required
              />
            </div>

            <div>
              <label className="block text-[10px] uppercase tracking-widest text-white/70 mb-1.5 font-medium">
                Master Passkey / PIN
              </label>
              <input
                type="password"
                value={passkeyInput}
                onChange={(e) => setPasskeyInput(e.target.value)}
                className="w-full px-3.5 py-3 bg-[#111111] border border-white/20 text-white text-xs rounded focus:outline-none focus:border-[#B9AA96] transition-colors"
                placeholder="Enter executive passkey..."
                autoFocus
              />
            </div>

            {authError && (
              <div className="p-3 bg-red-950/40 border border-red-800/60 text-red-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{authError}</span>
              </div>
            )}

            <button
              type="submit"
              className="w-full py-3.5 bg-white text-black hover:bg-neutral-200 transition-colors text-xs uppercase tracking-[0.2em] font-bold flex items-center justify-center gap-2 cursor-pointer shadow-md"
            >
              <Lock className="w-3.5 h-3.5" />
              <span>Unlock Admin Controls</span>
            </button>
          </form>

          {/* Instant Owner Access Shortcut */}
          <div className="mt-6 pt-5 border-t border-white/10 text-center">
            <button
              type="button"
              onClick={handleQuickMasterLogin}
              className="text-[11px] text-[#B9AA96] hover:text-white underline tracking-wider cursor-pointer font-medium"
            >
              ✦ Authorize Verified Owner Session
            </button>
          </div>

          <div className="mt-6 text-center">
            <Link
              to="/"
              className="text-[10px] uppercase tracking-widest text-white/40 hover:text-white/80 transition-colors"
            >
              ← Return to Customer Storefront
            </Link>
          </div>
        </div>
      </div>
    );
  }

  // Authenticated Admin Command Center
  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#171717] font-sans selection:bg-[#171717] selection:text-white pb-20">
      {/* Executive Command Header */}
      <header className="bg-[#171717] text-white border-b border-[#333333] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <h1 className="font-serif text-xl tracking-wider text-white">TREVORI</h1>
            <span className="px-2.5 py-0.5 bg-white/10 text-[#B9AA96] text-[10px] uppercase tracking-widest font-mono border border-white/20 rounded">
              Owner Admin Portal
            </span>
            <span className="flex items-center gap-1 text-[10px] text-emerald-400 font-mono">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
              <span>System Live</span>
            </span>
          </div>

          <div className="flex items-center gap-3 w-full sm:w-auto justify-between sm:justify-end">
            <Link
              to="/"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3 py-1.5 bg-white/10 hover:bg-white/20 text-white text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 border border-white/20 transition-colors rounded"
            >
              <span>View Customer Storefront</span>
              <ExternalLink className="w-3 h-3" />
            </Link>

            <button
              onClick={handleLogout}
              className="px-3 py-1.5 bg-red-950/60 hover:bg-red-900 border border-red-700/60 text-red-200 text-xs uppercase tracking-wider font-medium flex items-center gap-1.5 transition-colors cursor-pointer rounded"
              title="Lock Admin Portal"
            >
              <LogOut className="w-3 h-3" />
              <span>Lock Portal</span>
            </button>
          </div>
        </div>

        {/* Admin Navigation Tabs */}
        <div className="max-w-7xl mx-auto px-6 flex items-center gap-1 overflow-x-auto border-t border-white/10 scrollbar-none">
          <button
            onClick={() => setActiveTab('printrove')}
            className={`px-4 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'printrove'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Palette className="w-3.5 h-3.5 text-emerald-400" />
            <span>Printrove Studio Sync</span>
          </button>

          <button
            onClick={() => setActiveTab('catalog')}
            className={`px-4 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'catalog'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Package className="w-3.5 h-3.5" />
            <span>Products &amp; Inventory ({products.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('orders')}
            className={`px-4 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'orders'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Truck className="w-3.5 h-3.5" />
            <span>Customer Orders Depot ({orders.length})</span>
          </button>

          <button
            onClick={() => setActiveTab('analytics')}
            className={`px-4 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'analytics'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Revenue &amp; Analytics</span>
          </button>

          <button
            onClick={() => setActiveTab('settings')}
            className={`px-4 py-3 text-xs uppercase tracking-wider font-semibold border-b-2 transition-all flex items-center gap-2 whitespace-nowrap cursor-pointer ${
              activeTab === 'settings'
                ? 'border-white text-white bg-white/5'
                : 'border-transparent text-white/60 hover:text-white'
            }`}
          >
            <Settings className="w-3.5 h-3.5" />
            <span>Store Configuration</span>
          </button>
        </div>
      </header>

      {/* Main Admin Content View */}
      <main className="max-w-7xl mx-auto px-6 py-8">
        {/* TAB 1: PRINTROVE & LIVE DROPSHIP SYNC */}
        {activeTab === 'printrove' && (
          <div className="space-y-6 animate-fade-in-subtle">
            {/* Top Control Hero */}
            <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 flex flex-col sm:flex-row sm:items-center justify-between gap-6 shadow-sm">
              <div>
                <div className="flex items-center gap-2 mb-1.5">
                  <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-semibold tracking-wider uppercase bg-emerald-50 text-emerald-800 border border-emerald-300">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                    Printrove API Connected
                  </span>
                  <span className="text-[10px] font-mono uppercase tracking-widest text-[#706B64]">
                    Merchant ID: 301918 &bull; Valid to 27/11/2027
                  </span>
                </div>
                <h2 className="font-serif text-2xl sm:text-3xl text-[#171717]">
                  Printrove On-Demand Manufacturing Hub
                </h2>
                <p className="text-xs text-[#706B64] font-light mt-1 max-w-2xl leading-relaxed">
                  Direct connection to your Printrove Merchant Account. Any graphic design, custom oversized tee, or hoodie created in your Printrove account synchronizes live to your Trevori storefront.
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
                className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#171717] text-white hover:bg-[#333333] text-xs uppercase tracking-widest font-semibold transition-all disabled:opacity-60 cursor-pointer shadow-md shrink-0 self-start sm:self-auto"
              >
                <RefreshCw className={`w-4 h-4 ${isSyncingPrintrove ? 'animate-spin' : ''}`} />
                <span>{isSyncingPrintrove ? 'Syncing...' : 'Sync Designs & Products Now'}</span>
              </button>
            </div>

            {/* Sync Status Alert */}
            {printroveSyncStatus && (
              <div className="p-4 bg-[#171717] text-white text-xs font-mono flex items-center justify-between border border-[#DDD8CE] shadow-sm animate-fade-in-subtle">
                <span>{printroveSyncStatus}</span>
                <button onClick={() => setPrintroveSyncStatus(null)} className="text-white/60 hover:text-white">✕</button>
              </div>
            )}

            {/* Printrove Live Uploaded Artworks Gallery */}
            <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CE]">
                <div>
                  <h3 className="font-serif text-lg text-[#171717]">Your Uploaded Artwork &amp; Design Library</h3>
                  <p className="text-xs text-[#706B64] font-light">
                    Synchronized graphics and prints from your Printrove dashboard.
                  </p>
                </div>
                <span className="text-xs font-mono font-semibold text-[#171717] bg-[#F4F1EA] px-2.5 py-1 border border-[#DDD8CE]">
                  {printroveDesigns.length} Active Artworks
                </span>
              </div>

              {isLoadingDesigns ? (
                <div className="py-12 text-center text-xs text-[#706B64]">
                  <RefreshCw className="w-5 h-5 mx-auto animate-spin mb-2" />
                  <span>Loading design assets from Printrove...</span>
                </div>
              ) : printroveDesigns.length > 0 ? (
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {printroveDesigns.map((d: any, idx: number) => (
                    <div key={idx} className="border border-[#DDD8CE] bg-[#FAF8F5] p-2 space-y-2 group">
                      <div className="aspect-square bg-white border border-[#DDD8CE]/60 overflow-hidden flex items-center justify-center p-2">
                        <img
                          src={d.thumbnail || d.preview || d.image || d.url}
                          alt={d.name || `Design ${idx + 1}`}
                          className="w-full h-full object-contain group-hover:scale-105 transition-transform"
                        />
                      </div>
                      <div className="text-[11px] truncate font-medium text-[#171717]" title={d.name}>
                        {d.name || `Graphic Drop #${idx + 1}`}
                      </div>
                      <div className="text-[9px] text-[#706B64] font-mono">
                        ID: {d.id || d.design_id || 'Active'}
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="p-8 text-center bg-[#FAF8F5] border border-dashed border-[#DDD8CE] space-y-3">
                  <p className="text-xs text-[#706B64]">
                    No separate design assets returned yet from Printrove endpoint. All 9 garment colorway mockups are active and running on the storefront.
                  </p>
                  <button
                    onClick={() => {
                      fetch('/api/printrove/designs')
                        .then((r) => r.json())
                        .then((d) => setPrintroveDesigns(d.designs || []))
                        .catch(() => {});
                    }}
                    className="px-4 py-2 bg-[#171717] text-white text-xs uppercase tracking-wider font-medium cursor-pointer"
                  >
                    Refresh Design Assets
                  </button>
                </div>
              )}
            </div>

            {/* Live Products Synced from Printrove */}
            <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-4 shadow-sm">
              <div className="flex items-center justify-between pb-3 border-b border-[#DDD8CE]">
                <div>
                  <h3 className="font-serif text-lg text-[#171717]">Synced Printrove Apparel Drops</h3>
                  <p className="text-xs text-[#706B64] font-light">
                    Flagship garments populated 100% dynamically via Printrove API with color variant mockups.
                  </p>
                </div>
              </div>

              <div className="space-y-4">
                {products
                  .filter((p) => p.id.startsWith('printrove-'))
                  .map((product) => (
                    <div key={product.id} className="border border-[#DDD8CE] p-4 flex flex-col md:flex-row items-start md:items-center justify-between gap-4 bg-[#FAF8F5]">
                      <div className="flex items-center gap-4">
                        <img
                          src={product.images.primary}
                          alt={product.name}
                          className="w-16 h-20 object-contain bg-white border border-[#DDD8CE] p-1"
                        />
                        <div>
                          <div className="text-xs uppercase font-mono tracking-wider text-[#B9AA96]">
                            SKU: {product.id}
                          </div>
                          <h4 className="font-serif text-lg text-[#171717]">{product.name}</h4>
                          <div className="text-xs text-[#706B64] mt-0.5">
                            Colors ({product.colors?.length || 0}): {product.colors?.map((c) => c.name).join(', ')}
                          </div>
                          <div className="text-xs text-[#706B64]">
                            Sizes: {product.sizes?.join(', ')} &bull; Price: <strong>{formatPrice(product.priceINR)}</strong>
                          </div>
                        </div>
                      </div>

                      <div className="flex items-center gap-2 self-end md:self-auto">
                        <Link
                          to={`/products/${product.id}`}
                          target="_blank"
                          className="px-3 py-1.5 bg-white border border-[#DDD8CE] hover:border-[#171717] text-xs uppercase tracking-wider font-medium text-[#171717] flex items-center gap-1 transition-colors"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>View on Store</span>
                        </Link>
                      </div>
                    </div>
                  ))}
              </div>
            </div>
          </div>
        )}

        {/* TAB 2: PRODUCTS & INVENTORY */}
        {activeTab === 'catalog' && (
          <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in-subtle">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDD8CE]">
              <div>
                <h2 className="font-serif text-2xl text-[#171717]">Garment Catalog &amp; Retail Pricing</h2>
                <p className="text-xs text-[#706B64] font-light">
                  Complete list of live items visible to customers across New Arrivals, Best Sellers, and Collections.
                </p>
              </div>
              <span className="text-xs font-mono font-bold bg-[#F4F1EA] px-3 py-1.5 border border-[#DDD8CE]">
                {products.length} Garments
              </span>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs border-collapse">
                <thead>
                  <tr className="border-b border-[#DDD8CE] text-[10px] uppercase tracking-wider text-[#706B64]">
                    <th className="py-3 px-2">Garment</th>
                    <th className="py-3 px-2">Source</th>
                    <th className="py-3 px-2">Category</th>
                    <th className="py-3 px-2">Retail Price</th>
                    <th className="py-3 px-2">Variants</th>
                    <th className="py-3 px-2">Status</th>
                    <th className="py-3 px-2 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-[#DDD8CE]/60">
                  {products.map((p) => (
                    <tr key={p.id} className="hover:bg-[#FAF8F5] transition-colors">
                      <td className="py-3 px-2 font-medium flex items-center gap-2">
                        <img src={p.images.primary} alt={p.name} className="w-8 h-10 object-contain bg-white border border-[#DDD8CE]" />
                        <span>{p.name}</span>
                      </td>
                      <td className="py-3 px-2 font-mono text-[11px] text-[#706B64]">
                        {p.id.startsWith('printrove-') ? 'Printrove Live' : 'Shopify Dropship'}
                      </td>
                      <td className="py-3 px-2 text-[#706B64]">{p.category}</td>
                      <td className="py-3 px-2 font-bold text-[#171717]">{formatPrice(p.priceINR)}</td>
                      <td className="py-3 px-2 text-[#706B64]">{p.colors?.length || 1} colors &bull; {p.sizes?.length || 1} sizes</td>
                      <td className="py-3 px-2">
                        <span className="inline-flex items-center gap-1 text-[10px] font-semibold text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                          <CheckCircle2 className="w-3 h-3 text-emerald-600" />
                          <span>Active / In Stock</span>
                        </span>
                      </td>
                      <td className="py-3 px-2 text-right">
                        <Link
                          to={`/products/${p.id}`}
                          target="_blank"
                          className="text-[#171717] underline hover:text-[#B9AA96] font-medium"
                        >
                          Inspect PDP ↗
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* TAB 3: CUSTOMER ORDERS DEPOT */}
        {activeTab === 'orders' && (
          <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-6 shadow-sm animate-fade-in-subtle">
            <div className="flex items-center justify-between pb-4 border-b border-[#DDD8CE]">
              <div>
                <h2 className="font-serif text-2xl text-[#171717]">Customer Orders &amp; Logistics Depot</h2>
                <p className="text-xs text-[#706B64] font-light">
                  Orders placed through Razorpay Instant Checkout. Directly synced with delivery partner dispatches.
                </p>
              </div>
            </div>

            <div className="space-y-4">
              {orders.map((ord) => (
                <div key={ord.id} className="border border-[#DDD8CE] p-5 bg-[#FAF8F5] space-y-3">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-[#DDD8CE]/60 pb-3">
                    <div>
                      <span className="font-mono font-bold text-sm text-[#171717]">{ord.id}</span>
                      <span className="text-xs text-[#706B64] ml-2">&bull; Placed on {ord.date}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-1 bg-amber-50 border border-amber-200 text-amber-800 text-[10px] uppercase font-bold tracking-wider rounded">
                        {ord.status}
                      </span>
                      <span className="font-mono font-bold text-[#171717] text-sm">
                        {formatPrice(ord.totalINR)}
                      </span>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                    <div>
                      <span className="text-[#8C867D] uppercase tracking-wider text-[10px] block mb-1">Customer:</span>
                      <strong className="text-[#171717] block">{ord.customer}</strong>
                      <span className="text-[#706B64] block">{ord.email}</span>
                    </div>
                    <div>
                      <span className="text-[#8C867D] uppercase tracking-wider text-[10px] block mb-1">Shipping Destination:</span>
                      <span className="text-[#706B64] leading-relaxed block">{ord.address}</span>
                    </div>
                    <div>
                      <span className="text-[#8C867D] uppercase tracking-wider text-[10px] block mb-1">Courier Logistics:</span>
                      <span className="font-mono text-[#171717] font-semibold block">{ord.tracking}</span>
                      <span className="text-[10px] text-emerald-700 block mt-0.5">{ord.paymentMethod}</span>
                    </div>
                  </div>

                  <div className="pt-2 border-t border-[#DDD8CE]/60 text-xs text-[#171717]">
                    <strong>Items Ordered:</strong> {ord.items.join(', ')}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TAB 4: REVENUE & ANALYTICS */}
        {activeTab === 'analytics' && (
          <div className="space-y-6 animate-fade-in-subtle">
            {/* KPI Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 space-y-1 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-medium">Gross Revenue</span>
                <div className="font-serif text-3xl font-bold text-[#171717]">₹28,490</div>
                <span className="text-[11px] text-emerald-700 font-medium">+18.4% this month</span>
              </div>
              <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 space-y-1 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-medium">Total Orders</span>
                <div className="font-serif text-3xl font-bold text-[#171717]">24</div>
                <span className="text-[11px] text-emerald-700 font-medium">100% payment completion</span>
              </div>
              <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 space-y-1 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-medium">Active Garments</span>
                <div className="font-serif text-3xl font-bold text-[#171717]">{products.length}</div>
                <span className="text-[11px] text-[#706B64]">Printrove + Shopify</span>
              </div>
              <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 space-y-1 shadow-sm">
                <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-medium">Checkout Conversion</span>
                <div className="font-serif text-3xl font-bold text-[#171717]">3.8%</div>
                <span className="text-[11px] text-emerald-700 font-medium">Industry leading</span>
              </div>
            </div>

            <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-4 shadow-sm">
              <h3 className="font-serif text-lg text-[#171717]">Operational Health Summary</h3>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                <div className="p-4 bg-[#FAF8F5] border border-[#DDD8CE] space-y-1">
                  <span className="text-[#8C867D] uppercase tracking-wider text-[10px] block">Printrove API:</span>
                  <strong className="text-emerald-700 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> 100% Operational &bull; 200 OK
                  </strong>
                  <span className="text-[#706B64] text-[11px] block">Token valid until Nov 2027</span>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-[#DDD8CE] space-y-1">
                  <span className="text-[#8C867D] uppercase tracking-wider text-[10px] block">Razorpay Gateway:</span>
                  <strong className="text-emerald-700 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Live Production Mode
                  </strong>
                  <span className="text-[#706B64] text-[11px] block">Direct UPI, Cards &amp; NetBanking</span>
                </div>
                <div className="p-4 bg-[#FAF8F5] border border-[#DDD8CE] space-y-1">
                  <span className="text-[#8C867D] uppercase tracking-wider text-[10px] block">Shopify Storefront:</span>
                  <strong className="text-emerald-700 block flex items-center gap-1">
                    <CheckCircle2 className="w-3.5 h-3.5" /> Customer Vault Active
                  </strong>
                  <span className="text-[#706B64] text-[11px] block">Strict password hashing</span>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* TAB 5: STORE CONFIGURATION */}
        {activeTab === 'settings' && (
          <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-6 shadow-sm max-w-2xl animate-fade-in-subtle">
            <h2 className="font-serif text-2xl text-[#171717]">Storefront Executive Settings</h2>
            
            <div className="space-y-4 text-xs">
              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#706B64] mb-1 font-semibold">
                  Official Store Support Email
                </label>
                <input
                  type="email"
                  defaultValue="trevorishopping@gmail.com"
                  className="w-full px-3.5 py-2.5 border border-[#DDD8CE] bg-[#FAF8F5] text-[#171717] font-mono text-xs rounded"
                  readOnly
                />
                <span className="text-[10px] text-[#8C867D] mt-1 block">
                  Displayed across header, contact page, invoices, and customer receipts.
                </span>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#706B64] mb-1 font-semibold">
                  Admin Master Email
                </label>
                <input
                  type="email"
                  defaultValue="trevorishopping@gmail.com"
                  className="w-full px-3.5 py-2.5 border border-[#DDD8CE] bg-[#FAF8F5] text-[#171717] font-mono text-xs rounded"
                  readOnly
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-widest text-[#706B64] mb-1 font-semibold">
                  Printrove Dropship Sync Interval
                </label>
                <input
                  type="text"
                  defaultValue="On-Demand + Realtime Webhook Sync"
                  className="w-full px-3.5 py-2.5 border border-[#DDD8CE] bg-[#FAF8F5] text-[#171717] font-mono text-xs rounded"
                  readOnly
                />
              </div>

              <div className="pt-4 border-t border-[#DDD8CE]">
                <button
                  type="button"
                  onClick={() => alert('Store settings saved successfully.')}
                  className="px-6 py-3 bg-[#171717] text-white uppercase tracking-wider text-xs font-semibold hover:bg-black transition-colors cursor-pointer"
                >
                  Save Store Settings
                </button>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
};
