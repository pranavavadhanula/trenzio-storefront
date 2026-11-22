import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ChevronDown, Menu, X, Search, Heart, User, Globe } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { CURRENCIES } from '../data/products';
import { CurrencyCode } from '../types';

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    setIsSearchOpen,
    isLoggedIn,
    user,
    currency,
    setCurrency,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'shop' | 'collections' | null>(null);
  const [currencyMenuOpen, setCurrencyMenuOpen] = useState(false);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
    setCurrencyMenuOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = (menu: 'shop' | 'collections') => {
    if (dropdownTimeoutRef.current) {
      clearTimeout(dropdownTimeoutRef.current);
    }
    setOpenDropdown(menu);
  };

  const handleMouseLeave = () => {
    dropdownTimeoutRef.current = setTimeout(() => {
      setOpenDropdown(null);
    }, 180);
  };

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 font-sans ${
        isScrolled
          ? 'bg-[#F4F1EA]/95 backdrop-blur-md border-b border-[#DDD8CE] shadow-sm'
          : 'bg-[#F4F1EA] border-b border-[#DDD8CE]/60'
      }`}
    >
      {/* Top Editorial Ticker Bar (Minimalist) */}
      <div className="bg-[#171717] text-[#F4F1EA] text-[10px] sm:text-[11px] py-1.5 px-4 tracking-[0.2em] uppercase font-medium">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="hidden sm:block text-[#B9AA96]">TREVORI ATELIER &bull; AUTUMN / WINTER 2026</div>
          <div className="mx-auto sm:mx-0 text-center font-normal">
            COMPLIMENTARY EXPRESS SHIPPING OVER ₹2,000 &bull; HASSLE-FREE 7-DAY EXCHANGES
          </div>
          <div className="hidden sm:flex items-center gap-2">
            <span className="text-[#DDD8CE]">INTERNATIONAL DISPATCH</span>
          </div>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-4">
          
          {/* Left: Mobile Menu Toggle & Desktop Primary Nav */}
          <div className="flex items-center gap-6">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#171717] hover:text-[#B9AA96] transition-colors"
              aria-label="Open menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <nav className="hidden lg:flex items-center space-x-7 text-xs font-medium tracking-[0.15em] uppercase text-[#171717]">
              <Link to="/collections" className="hover:text-[#B9AA96] transition-colors py-2">
                New Arrivals
              </Link>

              {/* Shop Dropdown */}
              <div
                className="relative"
                onMouseEnter={() => handleMouseEnter('shop')}
                onMouseLeave={handleMouseLeave}
              >
                <button className="flex items-center gap-1 hover:text-[#B9AA96] transition-colors py-2 cursor-pointer">
                  <span>Shop</span>
                  <ChevronDown className="w-3 h-3 text-[#706B64]" />
                </button>

                {openDropdown === 'shop' && (
                  <div className="absolute top-full left-0 w-64 bg-[#FFFFFF] border border-[#DDD8CE] shadow-lg py-3 px-2 z-50 animate-fade-in-subtle">
                    <Link
                      to="/collections/men"
                      className="block px-3 py-2 text-xs hover:bg-[#F4F1EA] text-[#171717] transition-colors"
                    >
                      <div className="font-semibold">Men's Streetwear</div>
                      <div className="text-[10px] text-[#706B64] lowercase tracking-normal">Boxy tees, heavy hoodies, pants</div>
                    </Link>
                    <Link
                      to="/collections/women"
                      className="block px-3 py-2 text-xs hover:bg-[#F4F1EA] text-[#171717] transition-colors"
                    >
                      <div className="font-semibold">Women's Silhouettes</div>
                      <div className="text-[10px] text-[#706B64] lowercase tracking-normal">Draped cuts, relaxed trousers</div>
                    </Link>
                    <Link
                      to="/collections"
                      className="block px-3 py-2 text-xs hover:bg-[#F4F1EA] text-[#171717] transition-colors"
                    >
                      <div className="font-semibold">All Categories</div>
                      <div className="text-[10px] text-[#706B64] lowercase tracking-normal">Full contemporary lineup</div>
                    </Link>
                  </div>
                )}
              </div>

              {/* Collections Link */}
              <Link to="/collections" className="hover:text-[#B9AA96] transition-colors py-2">
                Collections
              </Link>

              {/* Lookbook Link */}
              <a href="/#lookbook" className="hover:text-[#B9AA96] transition-colors py-2">
                Lookbook
              </a>

              {/* Brand Story Link */}
              <Link to="/about" className="hover:text-[#B9AA96] transition-colors py-2">
                The Atelier
              </Link>
            </nav>
          </div>

          {/* Center: Brand Logo */}
          <div className="text-center">
            <Link to="/" className="inline-block" title="TREVORI Home">
              <span className="font-serif text-2xl sm:text-3xl lg:text-4xl font-normal tracking-[0.25em] text-[#171717] hover:opacity-85 transition-opacity">
                TREVORI
              </span>
            </Link>
          </div>

          {/* Right: Actions (Currency, Search, Wishlist, Account, Cart) */}
          <div className="flex items-center space-x-3 sm:space-x-5 text-[#171717]">
            {/* Currency Selector (Minimal) */}
            <div className="relative hidden md:block">
              <button
                onClick={() => setCurrencyMenuOpen(!currencyMenuOpen)}
                className="flex items-center gap-1 text-[11px] font-medium tracking-wider uppercase text-[#706B64] hover:text-[#171717] transition-colors py-1 cursor-pointer"
                title="Change currency"
              >
                <span>{currency}</span>
                <ChevronDown className="w-3 h-3 text-[#706B64]" />
              </button>

              {currencyMenuOpen && (
                <div className="absolute right-0 top-full mt-1 w-36 bg-[#FFFFFF] border border-[#DDD8CE] shadow-lg py-1.5 z-50 animate-fade-in-subtle">
                  {Object.keys(CURRENCIES).map((code) => (
                    <button
                      key={code}
                      onClick={() => {
                        setCurrency(code as CurrencyCode);
                        setCurrencyMenuOpen(false);
                      }}
                      className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-[#F4F1EA] transition-colors ${
                        currency === code ? 'font-semibold text-[#171717]' : 'text-[#706B64]'
                      }`}
                    >
                      <span>{code}</span>
                      <span className="text-[10px] text-[#B9AA96]">{CURRENCIES[code].symbol}</span>
                    </button>
                  ))}
                </div>
              )}
            </div>

            {/* Search Trigger */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="p-1.5 hover:text-[#B9AA96] transition-colors cursor-pointer"
              aria-label="Search collection"
              title="Search collection"
            >
              <Search className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </button>

            {/* Wishlist Link / Trigger */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-1.5 hover:text-[#B9AA96] transition-colors cursor-pointer"
              aria-label="Open wishlist"
              title="Saved items"
            >
              <Heart className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {wishlist.length > 0 && (
                <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-[#171717] text-white text-[9px] font-medium flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Account Dashboard Link */}
            <Link
              to={isLoggedIn ? "/account" : "/login"}
              className="p-1.5 hover:text-[#B9AA96] transition-colors"
              aria-label="Customer account"
              title={isLoggedIn ? (user?.name || "Account") : "Sign In"}
            >
              <User className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
            </Link>

            {/* Shopping Cart Drawer Trigger */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 hover:text-[#B9AA96] transition-colors cursor-pointer flex items-center gap-1.5"
              aria-label="Open shopping bag"
              title="Shopping bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-4.5 sm:h-4.5" />
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#171717] text-white text-[9px] font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F4F1EA] border-b border-[#DDD8CE] px-6 py-6 space-y-4 animate-fade-in-subtle">
          <nav className="flex flex-col space-y-3 text-sm font-medium tracking-[0.15em] uppercase text-[#171717]">
            <Link
              to="/collections"
              className="py-1.5 border-b border-[#DDD8CE]/40 hover:text-[#B9AA96]"
            >
              New Arrivals
            </Link>
            <Link
              to="/collections/men"
              className="py-1.5 border-b border-[#DDD8CE]/40 hover:text-[#B9AA96]"
            >
              Men's Streetwear
            </Link>
            <Link
              to="/collections/women"
              className="py-1.5 border-b border-[#DDD8CE]/40 hover:text-[#B9AA96]"
            >
              Women's Wear
            </Link>
            <Link
              to="/collections"
              className="py-1.5 border-b border-[#DDD8CE]/40 hover:text-[#B9AA96]"
            >
              All Collections
            </Link>
            <a
              href="/#lookbook"
              className="py-1.5 border-b border-[#DDD8CE]/40 hover:text-[#B9AA96]"
            >
              Editorial Lookbook
            </a>
            <Link
              to="/about"
              className="py-1.5 border-b border-[#DDD8CE]/40 hover:text-[#B9AA96]"
            >
              The Atelier & Craft
            </Link>
            <Link
              to={isLoggedIn ? "/account" : "/login"}
              className="py-1.5 hover:text-[#B9AA96] flex items-center justify-between"
            >
              <span>{isLoggedIn ? "Client Passport (Dashboard)" : "Member Sign In"}</span>
              <User className="w-4 h-4 text-[#706B64]" />
            </Link>
          </nav>

          {/* Mobile Currency Chooser */}
          <div className="pt-4 border-t border-[#DDD8CE] flex items-center justify-between text-xs text-[#706B64]">
            <span className="uppercase tracking-widest text-[10px]">Select Currency:</span>
            <div className="flex gap-2">
              {(['INR', 'USD', 'EUR', 'GBP'] as CurrencyCode[]).map((c) => (
                <button
                  key={c}
                  onClick={() => setCurrency(c)}
                  className={`px-2 py-1 text-xs border ${
                    currency === c
                      ? 'border-[#171717] bg-[#171717] text-white font-medium'
                      : 'border-[#DDD8CE] text-[#706B64]'
                  }`}
                >
                  {c}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}
    </header>
  );
};
