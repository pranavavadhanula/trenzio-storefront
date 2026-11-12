import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ChevronDown, Menu, X, Search, Heart } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

interface SubCategoryItem {
  label: string;
  path: string;
  sub: string;
}

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    setIsSearchOpen,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'men' | 'women' | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close mobile drawer and dropdowns on route change
  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const handleMouseEnter = (menu: 'men' | 'women') => {
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

  const currentPath = location.pathname;

  const MEN_SUB_ITEMS: SubCategoryItem[] = [
    { label: "All Men's Wear", path: '/collections/men', sub: 'Complete 240–400 GSM catalog' },
    { label: 'Oversized T-Shirts', path: '/collections/oversized-tees', sub: 'Structured boxy dropped shoulders' },
    { label: 'Sweatshirts & Hoodies', path: '/collections/sweatshirts', sub: '400 GSM diagonal loop Terry' },
    { label: 'Classic Tees', path: '/collections/classic-tees', sub: 'Tailored everyday luxury' },
  ];

  const WOMEN_SUB_ITEMS: SubCategoryItem[] = [
    { label: "All Women's Wear", path: '/collections/women', sub: 'Complete oversized silhouettes' },
    { label: 'Oversized T-Shirts', path: '/collections/oversized-tees', sub: 'Draped dropped-shoulder tees' },
    { label: 'Sweatshirts & Hoodies', path: '/collections/sweatshirts', sub: '400 GSM luxury French Terry' },
    { label: 'Classic Tees', path: '/collections/classic-tees', sub: 'Minimalist heavyweight basics' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 ${
        isScrolled
          ? 'bg-[#0A160F]/95 backdrop-blur-2xl border-b border-[#D4C3A3]/25 shadow-[0_4px_30px_rgba(0,0,0,0.85)]'
          : 'bg-[#0A160F]/90 backdrop-blur-xl border-b border-[#D4C3A3]/20'
      } text-[#F4ECE1]`}
    >
      {/* Top Main Brand Header */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-[#D4C3A3]/15">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-[#F4ECE1] hover:text-[#E6D7C3] p-1 cursor-pointer transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#D4C3A3] hover:text-[#F4ECE1] transition-colors p-1 cursor-pointer font-mono"
            title="Search Catalog"
          >
            <Search className="w-4 h-4 text-[#D4C3A3]" />
            <span className="hidden sm:inline text-[11px] font-bold">SEARCH</span>
          </button>
        </div>

        {/* Center: Brand Name (Luxury Haute Typography) */}
        <Link
          to="/"
          className="text-center group block cursor-pointer"
          title="Trenzio Home"
        >
          <h1 className="font-serif text-2xl sm:text-4xl tracking-[0.45em] text-[#F4ECE1] font-light group-hover:text-[#E6D7C3] transition-colors pl-[0.45em]">
            TRENZIO
          </h1>
          <p className="text-[8px] uppercase tracking-[0.35em] text-[#D4C3A3] -mt-1 font-mono font-medium">
            Luxury Heavyweight Apparel &bull; India
          </p>
        </Link>

        {/* Right: Actions (Fixed INR Badge, Wishlist, Bag) */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Fixed INR Only Indicator - Strict India Launch (No Currency Dropdown) */}
          <div
            className="flex items-center space-x-1 py-1 px-2.5 rounded-none border border-[#D4C3A3]/25 bg-white/[0.04] text-[#E6D7C3] font-mono text-[11px] font-bold tracking-wider select-none"
            title="Exclusively Launching in India — Billed strictly in INR (₹)"
          >
            <span>INR (₹)</span>
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
            className="relative flex items-center gap-1.5 text-[#D4C3A3] hover:text-[#F4ECE1] transition-colors p-1 cursor-pointer font-mono text-[11px]"
            title="Wishlist (Right click to open in new tab)"
          >
            <Heart className="w-4 h-4 text-[#D4C3A3]" />
            <span className="hidden sm:inline font-bold">WISHLIST</span>
            {wishlist.length > 0 && (
              <span className="text-[#E6D7C3] font-bold text-[10px]">
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
            className="relative flex items-center gap-1.5 text-[#F4ECE1] hover:text-[#E6D7C3] transition-colors cursor-pointer font-mono text-[11px]"
            title="Shopping Bag (Right click to open in new tab)"
          >
            <ShoppingBag className="w-4 h-4 text-[#D4C3A3]" />
            <span className="hidden sm:inline font-bold">BAG</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#E6D7C3] text-[#0A160F] font-black text-[10px] font-mono shadow-[0_0_12px_rgba(212,195,163,0.4)]">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Secondary Bar Below Search: Strictly Men's Wear & Women's Wear With Interactive Dropdown Lists */}
      <nav className="relative max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-center space-x-10 sm:space-x-16 text-[12px] uppercase tracking-[0.25em] font-mono py-3 border-t border-[#D4C3A3]/15">
        {/* Item 1: MEN'S WEAR with Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('men')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setOpenDropdown(openDropdown === 'men' ? null : 'men')}
            className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all duration-300 cursor-pointer font-mono ${
              currentPath.startsWith('/collections/men') || openDropdown === 'men'
                ? 'border-[#E6D7C3] text-[#E6D7C3] font-bold shadow-[0_2px_14px_rgba(212,195,163,0.35)]'
                : 'border-transparent text-[#D4C3A3] hover:text-[#F4ECE1] hover:border-[#D4C3A3]/40'
            }`}
          >
            <Link to="/collections/men" className="hover:text-[#F4ECE1]">
              MEN'S WEAR
            </Link>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#D4C3A3] transition-transform duration-300 ${
                openDropdown === 'men' ? 'rotate-180 text-[#E6D7C3]' : ''
              }`}
            />
          </button>

          {/* Men's Wear Dropdown List */}
          {openDropdown === 'men' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#112319]/98 backdrop-blur-2xl border border-[#D4C3A3]/30 shadow-[0_15px_45px_rgba(0,0,0,0.85)] py-2 z-50 text-[#F4ECE1] animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('men')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-[#D4C3A3] font-bold border-b border-[#D4C3A3]/20 flex items-center justify-between">
                <span>Men's Heavyweight Fits</span>
                <span className="text-[8px] text-[#A39277]">240–400 GSM</span>
              </div>
              <div className="py-1">
                {MEN_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-[#162E21] transition-colors group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-[#F4ECE1] group-hover:text-[#E6D7C3] tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-[9px] text-[#A39277] font-sans normal-case tracking-normal">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 pt-2 pb-1 border-t border-[#D4C3A3]/20 bg-[#0A160F]/60">
                <Link
                  to="/collections/men"
                  onClick={() => setOpenDropdown(null)}
                  className="text-[9px] uppercase tracking-widest text-[#E6D7C3] hover:underline font-bold flex items-center justify-between"
                >
                  <span>Explore Complete Men's Line &rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Item 2: WOMEN'S WEAR with Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('women')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setOpenDropdown(openDropdown === 'women' ? null : 'women')}
            className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all duration-300 cursor-pointer font-mono ${
              currentPath.startsWith('/collections/women') || openDropdown === 'women'
                ? 'border-[#E6D7C3] text-[#E6D7C3] font-bold shadow-[0_2px_14px_rgba(212,195,163,0.35)]'
                : 'border-transparent text-[#D4C3A3] hover:text-[#F4ECE1] hover:border-[#D4C3A3]/40'
            }`}
          >
            <Link to="/collections/women" className="hover:text-[#F4ECE1]">
              WOMEN'S WEAR
            </Link>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#D4C3A3] transition-transform duration-300 ${
                openDropdown === 'women' ? 'rotate-180 text-[#E6D7C3]' : ''
              }`}
            />
          </button>

          {/* Women's Wear Dropdown List */}
          {openDropdown === 'women' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-[#112319]/98 backdrop-blur-2xl border border-[#D4C3A3]/30 shadow-[0_15px_45px_rgba(0,0,0,0.85)] py-2 z-50 text-[#F4ECE1] animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('women')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-[#D4C3A3] font-bold border-b border-[#D4C3A3]/20 flex items-center justify-between">
                <span>Women's Oversized Cuts</span>
                <span className="text-[8px] text-[#A39277]">French Terry</span>
              </div>
              <div className="py-1">
                {WOMEN_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-[#162E21] transition-colors group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-[#F4ECE1] group-hover:text-[#E6D7C3] tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-[9px] text-[#A39277] font-sans normal-case tracking-normal">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 pt-2 pb-1 border-t border-[#D4C3A3]/20 bg-[#0A160F]/60">
                <Link
                  to="/collections/women"
                  onClick={() => setOpenDropdown(null)}
                  className="text-[9px] uppercase tracking-widest text-[#E6D7C3] hover:underline font-bold flex items-center justify-between"
                >
                  <span>Explore Complete Women's Line &rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#112319]/98 backdrop-blur-2xl border-b border-[#D4C3A3]/30 px-6 py-6 space-y-5 animate-fadeIn text-[#F4ECE1]">
          {/* Men's Wear Accordion */}
          <div className="space-y-2 border-b border-[#D4C3A3]/20 pb-4">
            <Link
              to="/collections/men"
              className="text-xs uppercase tracking-widest text-[#E6D7C3] font-bold font-mono block"
            >
              MEN'S WEAR
            </Link>
            <div className="pl-3 space-y-2 font-mono">
              {MEN_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-[11px] uppercase tracking-wider text-[#D4C3A3] hover:text-[#F4ECE1]"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          {/* Women's Wear Accordion */}
          <div className="space-y-2 border-b border-[#D4C3A3]/20 pb-4">
            <Link
              to="/collections/women"
              className="text-xs uppercase tracking-widest text-[#E6D7C3] font-bold font-mono block"
            >
              WOMEN'S WEAR
            </Link>
            <div className="pl-3 space-y-2 font-mono">
              {WOMEN_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-[11px] uppercase tracking-wider text-[#D4C3A3] hover:text-[#F4ECE1]"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#D4C3A3]">
            <span>Exclusively Launching in India</span>
            <span className="font-bold text-[#E6D7C3]">Billed in INR (₹)</span>
          </div>
        </div>
      )}
    </header>
  );
};