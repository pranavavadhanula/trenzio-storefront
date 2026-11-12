import React, { useState, useEffect } from 'react';
import { ShoppingBag, ChevronDown, Menu, X, Search, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { CURRENCIES } from '../data/products';
import { CurrencyCode } from '../types';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    currency,
    setCurrency,
    wishlist,
    setIsWishlistOpen,
    setIsSearchOpen,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [isCurrencyDropdownOpen, setIsCurrencyDropdownOpen] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer on route change
  useEffect(() => {
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const currentPath = location.pathname;

  // Zara-style Main Navigation Tabs
  const NAV_TABS = [
    { label: "MEN'S WEAR", path: '/collections/men' },
    { label: "WOMEN'S WEAR", path: '/collections/women' },
    { label: 'OVERSIZED TEES', path: '/collections/oversized-tees' },
    { label: 'SWEATSHIRTS', path: '/collections/sweatshirts' },
    { label: 'ALL DROPS', path: '/collections/all' },
    { label: '⚡ 3D TRY-ON', path: '/try-on' },
    { label: 'THE CRAFT', path: '/about' },
    { label: 'CONCIERGE', path: '/contact' },
  ];

  const isTabActive = (tabPath: string) => {
    if (tabPath === '/collections/all') {
      return currentPath === '/collections/all' || currentPath === '/collections';
    }
    return currentPath === tabPath;
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0B0512]/92 backdrop-blur-2xl border-b border-[#BA55D3]/25 shadow-[0_4px_30px_rgba(0,0,0,0.8)]'
          : 'bg-[#0B0512]/85 backdrop-blur-xl border-b border-[#BA55D3]/20'
      } text-[#FAF5FF]`}
    >
      {/* Top Main Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-[#BA55D3]/15">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#FAF5FF] hover:text-[#DA70D6] p-1 cursor-pointer transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D8B4FE] hover:text-[#DA70D6] transition-colors p-1 cursor-pointer font-mono"
            title="Search Catalog"
          >
            <Search className="w-4 h-4 text-[#DA70D6]" />
            <span className="hidden sm:inline text-[11px] font-bold">SEARCH</span>
          </button>
        </div>

        {/* Center: Brand Name (Zara Grand Spacing) */}
        <Link
          to="/"
          className="text-center group block cursor-pointer"
          title="Trenzio Home"
        >
          <h1 className="font-serif text-2xl sm:text-4xl tracking-[0.45em] text-[#FAF5FF] font-light group-hover:text-[#DA70D6] transition-colors pl-[0.45em]">
            TRENZIO
          </h1>
          <p className="text-[8px] uppercase tracking-[0.35em] text-[#D8B4FE] -mt-1 font-mono font-medium">
            Luxury Heavyweight Apparel &bull; India
          </p>
        </Link>

        {/* Right: Actions (Currency, Wishlist, Bag) */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center space-x-1 text-xs tracking-wider text-[#FAF5FF] hover:text-[#DA70D6] py-1 px-2.5 rounded-none border border-[#BA55D3]/25 bg-white/[0.04] backdrop-blur-md transition-all cursor-pointer font-mono text-[11px]"
            >
              <span>{currency} ({CURRENCIES[currency].symbol.trim()})</span>
              <ChevronDown className="w-3 h-3 opacity-70" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-[#140A21]/95 backdrop-blur-2xl border border-[#BA55D3]/30 shadow-2xl py-2 z-50 text-[#FAF5FF]">
                <div className="px-3 py-1 text-[9px] uppercase tracking-widest text-[#D8B4FE]/80 border-b border-[#BA55D3]/20 font-mono">
                  Select Currency
                </div>
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setCurrency(code);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer font-mono ${
                      currency === code
                        ? 'bg-[#DA70D6]/20 text-[#DA70D6] font-bold'
                        : 'text-[#FAF5FF] hover:bg-white/[0.08]'
                    }`}
                  >
                    <span>{CURRENCIES[code].countryName}</span>
                    <span className="font-mono text-[#DA70D6] font-bold">{CURRENCIES[code].symbol}</span>
                  </button>
                ))}
              </div>
            )}
          </div>

          {/* Wishlist */}
          <Link
            to="/wishlist"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                setIsWishlistOpen(true);
              }
            }}
            className="relative flex items-center gap-1.5 text-[#D8B4FE] hover:text-[#DA70D6] transition-colors p-1 cursor-pointer font-mono text-[11px]"
            title="Wishlist (Right click to open in new tab)"
          >
            <Heart className="w-4 h-4 text-[#DA70D6]" />
            <span className="hidden sm:inline font-bold">WISHLIST</span>
            {wishlist.length > 0 && (
              <span className="text-[#DA70D6] font-bold text-[10px]">
                ({wishlist.length})
              </span>
            )}
          </Link>

          {/* Cart Bag */}
          <Link
            to="/cart"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                setIsCartOpen(true);
              }
            }}
            className="relative flex items-center gap-1.5 text-[#FAF5FF] hover:text-[#DA70D6] transition-colors cursor-pointer font-mono text-[11px]"
            title="Shopping Bag (Right click to open in new tab)"
          >
            <ShoppingBag className="w-4 h-4 text-[#DA70D6]" />
            <span className="hidden sm:inline font-bold">BAG</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#DA70D6] text-black font-black text-[10px] font-mono shadow-[0_0_12px_rgba(218,112,214,0.6)]">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Zara-Style Sticky Horizontal Tab Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center space-x-6 sm:space-x-8 text-[11px] uppercase tracking-[0.22em] font-mono py-2.5 sm:py-3 border-t border-[#BA55D3]/15">
        {NAV_TABS.map((tab) => {
          const active = isTabActive(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`whitespace-nowrap pb-1 border-b-2 transition-all duration-300 cursor-pointer ${
                active
                  ? 'border-[#DA70D6] text-[#DA70D6] font-bold shadow-[0_2px_14px_rgba(218,112,214,0.4)]'
                  : 'border-transparent text-[#D8B4FE] hover:text-[#DA70D6] hover:border-[#DA70D6]/40'
              }`}
              title={`Open ${tab.label} (Right click to open in new tab)`}
            >
              {tab.label}
            </Link>
          );
        })}
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#140A21]/95 backdrop-blur-2xl border-b border-[#BA55D3]/30 px-6 py-6 space-y-4 animate-fadeIn text-[#FAF5FF]">
          <div className="text-[10px] uppercase tracking-widest text-[#DA70D6] font-mono font-bold">
            Navigation Tabs
          </div>
          <div className="flex flex-col space-y-3 font-mono">
            {NAV_TABS.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className="text-sm uppercase tracking-wider text-[#D8B4FE] hover:text-[#DA70D6] py-1 font-medium"
              >
                {tab.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};
