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
    { label: 'NEW IN', path: '/collections/all' },
    { label: 'OVERSIZED TEES', path: '/collections/oversized-tees' },
    { label: 'SWEATSHIRTS', path: '/collections/sweatshirts' },
    { label: 'CLASSIC TEES', path: '/collections/classic-tees' },
    { label: 'MEN', path: '/collections/men' },
    { label: 'WOMEN', path: '/collections/women' },
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
          ? 'bg-atelier-950/98 backdrop-blur-md border-b border-white/10 shadow-2xl'
          : 'bg-atelier-950/90 backdrop-blur-sm border-b border-white/5'
      }`}
    >
      {/* Top Main Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-white/5">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-neutral-300 p-1 cursor-pointer"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-neutral-400 hover:text-atelier-gold transition-colors p-1 cursor-pointer font-mono"
            title="Search Catalog"
          >
            <Search className="w-4 h-4" />
            <span className="hidden sm:inline text-[11px]">SEARCH</span>
          </button>
        </div>

        {/* Center: Brand Name (Zara Grand Spacing) */}
        <Link
          to="/"
          className="text-center group block cursor-pointer"
          title="Trenzio Home"
        >
          <h1 className="font-serif text-2xl sm:text-4xl tracking-[0.45em] text-atelier-100 font-light group-hover:text-atelier-gold transition-colors pl-[0.45em]">
            TRENZIO
          </h1>
          <p className="text-[8px] uppercase tracking-[0.35em] text-neutral-400 -mt-1 font-light">
            Luxury Heavyweight Apparel &bull; India
          </p>
        </Link>

        {/* Right: Actions (Currency, Wishlist, Bag) */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Currency Switcher */}
          <div className="relative">
            <button
              onClick={() => setIsCurrencyDropdownOpen(!isCurrencyDropdownOpen)}
              className="flex items-center space-x-1 text-xs tracking-wider text-atelier-100 hover:text-atelier-gold py-1 px-2.5 rounded border border-white/10 bg-white/5 transition-all cursor-pointer font-mono text-[11px]"
            >
              <span>{currency} ({CURRENCIES[currency].symbol.trim()})</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>

            {isCurrencyDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-atelier-900 border border-white/10 shadow-2xl py-2 z-50 backdrop-blur-xl">
                <div className="px-3 py-1 text-[9px] uppercase tracking-widest text-neutral-400 border-b border-white/5">
                  Select Currency
                </div>
                {(Object.keys(CURRENCIES) as CurrencyCode[]).map((code) => (
                  <button
                    key={code}
                    onClick={() => {
                      setCurrency(code);
                      setIsCurrencyDropdownOpen(false);
                    }}
                    className={`w-full text-left px-3 py-2 text-xs flex items-center justify-between transition-colors cursor-pointer ${
                      currency === code
                        ? 'bg-white/10 text-atelier-gold font-medium'
                        : 'text-neutral-300 hover:bg-white/5'
                    }`}
                  >
                    <span>{CURRENCIES[code].countryName}</span>
                    <span className="font-mono text-atelier-gold">{CURRENCIES[code].symbol}</span>
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
            className="relative flex items-center gap-1.5 text-neutral-400 hover:text-rose-400 transition-colors p-1 cursor-pointer font-mono text-[11px]"
            title="Wishlist (Right click to open in new tab)"
          >
            <Heart className="w-4 h-4" />
            <span className="hidden sm:inline">WISHLIST</span>
            {wishlist.length > 0 && (
              <span className="text-atelier-gold font-bold text-[10px]">
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
            className="relative flex items-center gap-1.5 text-neutral-200 hover:text-atelier-gold transition-colors cursor-pointer font-mono text-[11px]"
            title="Shopping Bag (Right click to open in new tab)"
          >
            <ShoppingBag className="w-4 h-4 text-atelier-gold" />
            <span className="hidden sm:inline">BAG</span>
            <span className="text-atelier-gold font-bold text-[10px]">
              ({cartCount})
            </span>
          </Link>
        </div>
      </div>

      {/* Zara-Style Sticky Horizontal Tab Bar */}
      <nav className="max-w-7xl mx-auto px-4 sm:px-8 overflow-x-auto scrollbar-none flex items-center justify-start sm:justify-center space-x-6 sm:space-x-8 text-[11px] uppercase tracking-[0.22em] font-mono py-2.5 sm:py-3">
        {NAV_TABS.map((tab) => {
          const active = isTabActive(tab.path);
          return (
            <Link
              key={tab.path}
              to={tab.path}
              className={`whitespace-nowrap pb-1 border-b-2 transition-all duration-300 cursor-pointer ${
                active
                  ? 'border-atelier-gold text-atelier-gold font-bold'
                  : 'border-transparent text-neutral-400 hover:text-atelier-100 hover:border-white/20'
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
        <div className="md:hidden bg-atelier-950 border-b border-white/10 px-6 py-6 space-y-4 animate-fadeIn">
          <div className="text-[10px] uppercase tracking-widest text-neutral-500 font-mono">
            Navigation Tabs
          </div>
          <div className="flex flex-col space-y-3">
            {NAV_TABS.map((tab) => (
              <Link
                key={tab.path}
                to={tab.path}
                className="text-sm uppercase tracking-wider text-atelier-100 hover:text-atelier-gold py-1"
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
