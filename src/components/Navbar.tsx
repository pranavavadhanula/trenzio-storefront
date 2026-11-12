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
  const [openDropdown, setOpenDropdown] = useState<'men' | 'women' | 'traditional' | null>(null);
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
  }, [location.pathname]);

  const handleMouseEnter = (menu: 'men' | 'women' | 'traditional') => {
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
    { label: 'Sweatshirts & Hoodies', path: '/collections/sweatshirts', sub: '400 GSM diagonal loop French Terry' },
    { label: 'Classic Tees', path: '/collections/classic-tees', sub: 'Tailored everyday luxury' },
  ];

  const WOMEN_SUB_ITEMS: SubCategoryItem[] = [
    { label: "All Women's Wear", path: '/collections/women', sub: 'Complete oversized silhouettes' },
    { label: 'Oversized T-Shirts', path: '/collections/oversized-tees', sub: 'Draped dropped-shoulder tees' },
    { label: 'Sweatshirts & Hoodies', path: '/collections/sweatshirts', sub: '400 GSM luxury French Terry' },
    { label: 'Classic Tees', path: '/collections/classic-tees', sub: 'Minimalist heavyweight basics' },
  ];

  const TRADITIONAL_SUB_ITEMS: SubCategoryItem[] = [
    { label: "Men's Traditional Wear", path: '/collections/traditional-men', sub: 'Kurtas, sherwanis & ethnic wear' },
    { label: "Women's Traditional Wear", path: '/collections/traditional-women', sub: 'Sarees, lehengas & ethnic drapes' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 relative bg-black/95 backdrop-blur-2xl border-b border-white/15 text-white ${
        isScrolled
          ? 'shadow-[0_12px_40px_rgba(0,0,0,0.98),inset_0_1px_0_0_rgba(255,255,255,0.22)]'
          : 'shadow-[0_8px_30px_rgba(0,0,0,0.9),inset_0_1px_0_0_rgba(255,255,255,0.18)]'
      }`}
    >
      {/* Glossy Glass Highlights & Reflections (Obsidian Glass Finish) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.10] via-white/[0.02] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_0%,rgba(255,255,255,0.13),transparent_70%)]" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/40 to-transparent" />

      {/* Top Main Brand Header (Pure Black Glossy) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-white/10">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-[#EDE0CC] p-1 cursor-pointer transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] text-[#d4d4d4] hover:text-white transition-all p-1.5 rounded-sm hover:bg-white/[0.06] cursor-pointer font-mono"
            title="Search Catalog"
          >
            <Search className="w-4 h-4 text-[#e5e5e5]" />
            <span className="hidden sm:inline text-[11px] font-bold">SEARCH</span>
          </button>
        </div>

        {/* Center: Brand Name (Glossy Luxe Haute Typography) */}
        <Link
          to="/"
          className="text-center group block cursor-pointer"
          title="Trenzio Home"
        >
          <h1 className="font-serif text-2xl sm:text-4xl tracking-[0.45em] text-white font-light group-hover:text-[#EDE0CC] transition-all pl-[0.45em] drop-shadow-[0_2px_16px_rgba(255,255,255,0.22)]">
            TRENZIO
          </h1>
          <p className="text-[8px] uppercase tracking-[0.35em] text-[#a3a3a3] -mt-1 font-mono font-medium group-hover:text-[#d4d4d4] transition-colors">
            Luxury Heavyweight Apparel &bull; India
          </p>
        </Link>

        {/* Right: Actions (Fixed INR Badge, Wishlist, Bag) */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Fixed INR Only Indicator - Glossy Pure Black Pill */}
          <div
            className="flex items-center space-x-1 py-1 px-2.5 rounded-none border border-white/25 bg-black/90 text-[#EDE0CC] font-mono text-[11px] font-bold tracking-wider select-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.28),0_2px_8px_rgba(0,0,0,0.8)]"
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
            className="relative flex items-center gap-1.5 text-[#d4d4d4] hover:text-white transition-all p-1.5 rounded-sm hover:bg-white/[0.06] cursor-pointer font-mono text-[11px]"
            title="Wishlist (Right click to open in new tab)"
          >
            <Heart className="w-4 h-4 text-[#e5e5e5]" />
            <span className="hidden sm:inline font-bold">WISHLIST</span>
            {wishlist.length > 0 && (
              <span className="text-[#EDE0CC] font-bold text-[10px]">
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
            className="relative flex items-center gap-1.5 text-white hover:text-[#EDE0CC] transition-all p-1.5 rounded-sm hover:bg-white/[0.06] cursor-pointer font-mono text-[11px]"
            title="Shopping Bag (Right click to open in new tab)"
          >
            <ShoppingBag className="w-4 h-4 text-[#e5e5e5]" />
            <span className="hidden sm:inline font-bold">BAG</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#EDE0CC] text-black font-black text-[10px] font-mono shadow-[0_0_12px_rgba(237,224,204,0.5)]">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Secondary Nav Bar: Glossy Pure Black */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-center space-x-6 sm:space-x-12 text-[12px] uppercase tracking-[0.25em] font-mono py-3 border-t border-white/[0.08]">
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
                ? 'border-[#EDE0CC] text-[#EDE0CC] font-bold drop-shadow-[0_0_10px_rgba(237,224,204,0.4)]'
                : 'border-transparent text-[#b5b5b5] hover:text-white hover:border-white/30'
            }`}
          >
            <Link to="/collections/men" className="hover:text-white">
              MEN'S WEAR
            </Link>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#888] transition-transform duration-300 ${
                openDropdown === 'men' ? 'rotate-180 text-[#EDE0CC]' : ''
              }`}
            />
          </button>

          {openDropdown === 'men' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-black/98 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_25px_60px_rgba(0,0,0,0.98)] py-2 z-50 text-white animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('men')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-[#EDE0CC] font-bold border-b border-white/10 bg-black/95 flex items-center justify-between">
                <span>Men's Heavyweight Fits</span>
                <span className="text-[8px] text-[#888]">240–400 GSM</span>
              </div>
              <div className="py-1">
                {MEN_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-white/[0.08] transition-colors group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-[#EDE0CC] tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-[9px] text-[#888] font-sans normal-case tracking-normal">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 pt-2 pb-1 border-t border-white/10 bg-black/95">
                <Link
                  to="/collections/men"
                  onClick={() => setOpenDropdown(null)}
                  className="text-[9px] uppercase tracking-widest text-[#EDE0CC] hover:underline font-bold flex items-center justify-between"
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
                ? 'border-[#EDE0CC] text-[#EDE0CC] font-bold drop-shadow-[0_0_10px_rgba(237,224,204,0.4)]'
                : 'border-transparent text-[#b5b5b5] hover:text-white hover:border-white/30'
            }`}
          >
            <Link to="/collections/women" className="hover:text-white">
              WOMEN'S WEAR
            </Link>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#888] transition-transform duration-300 ${
                openDropdown === 'women' ? 'rotate-180 text-[#EDE0CC]' : ''
              }`}
            />
          </button>

          {openDropdown === 'women' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-black/98 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_25px_60px_rgba(0,0,0,0.98)] py-2 z-50 text-white animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('women')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-[#EDE0CC] font-bold border-b border-white/10 bg-black/95 flex items-center justify-between">
                <span>Women's Oversized Cuts</span>
                <span className="text-[8px] text-[#888]">French Terry</span>
              </div>
              <div className="py-1">
                {WOMEN_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-white/[0.08] transition-colors group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-[#EDE0CC] tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-[9px] text-[#888] font-sans normal-case tracking-normal">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 pt-2 pb-1 border-t border-white/10 bg-black/95">
                <Link
                  to="/collections/women"
                  onClick={() => setOpenDropdown(null)}
                  className="text-[9px] uppercase tracking-widest text-[#EDE0CC] hover:underline font-bold flex items-center justify-between"
                >
                  <span>Explore Complete Women's Line &rarr;</span>
                </Link>
              </div>
            </div>
          )}
        </div>

        {/* Item 3: ACCESSORIES */}
        <Link
          to="/collections/accessories"
          className={`pb-1 border-b-2 transition-all duration-300 font-mono ${
            currentPath.startsWith('/collections/accessories')
              ? 'border-[#EDE0CC] text-[#EDE0CC] font-bold drop-shadow-[0_0_10px_rgba(237,224,204,0.4)]'
              : 'border-transparent text-[#b5b5b5] hover:text-white hover:border-white/30'
          }`}
        >
          ACCESSORIES
        </Link>

        {/* Item 4: TRADITIONAL WEAR with Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('traditional')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setOpenDropdown(openDropdown === 'traditional' ? null : 'traditional')}
            className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all duration-300 cursor-pointer font-mono ${
              currentPath.startsWith('/collections/traditional') || openDropdown === 'traditional'
                ? 'border-[#EDE0CC] text-[#EDE0CC] font-bold drop-shadow-[0_0_10px_rgba(237,224,204,0.4)]'
                : 'border-transparent text-[#b5b5b5] hover:text-white hover:border-white/30'
            }`}
          >
            <span>TRADITIONAL WEAR</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#888] transition-transform duration-300 ${
                openDropdown === 'traditional' ? 'rotate-180 text-[#EDE0CC]' : ''
              }`}
            />
          </button>

          {openDropdown === 'traditional' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-72 bg-black/98 backdrop-blur-2xl border border-white/20 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.25),0_25px_60px_rgba(0,0,0,0.98)] py-2 z-50 text-white animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('traditional')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2 text-[9px] uppercase tracking-[0.3em] text-[#EDE0CC] font-bold border-b border-white/10 bg-black/95 flex items-center justify-between">
                <span>Traditional & Ethnic Wear</span>
                <span className="text-[8px] text-[#888]">Premium</span>
              </div>
              <div className="py-1">
                {TRADITIONAL_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-white/[0.08] transition-colors group cursor-pointer"
                  >
                    <div className="text-[11px] font-bold text-white group-hover:text-[#EDE0CC] tracking-wider">
                      {item.label}
                    </div>
                    <div className="text-[9px] text-[#888] font-sans normal-case tracking-normal">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer - Glossy Pure Black Theme */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-black border-b border-white/15 px-6 py-6 space-y-5 animate-fadeIn text-white shadow-2xl relative z-20">
          <div className="space-y-2 border-b border-white/10 pb-4">
            <Link
              to="/collections/men"
              className="text-xs uppercase tracking-widest text-[#EDE0CC] font-bold font-mono block"
            >
              MEN'S WEAR
            </Link>
            <div className="pl-3 space-y-2 font-mono">
              {MEN_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-[11px] uppercase tracking-wider text-[#a3a3a3] hover:text-white"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-b border-white/10 pb-4">
            <Link
              to="/collections/women"
              className="text-xs uppercase tracking-widest text-[#EDE0CC] font-bold font-mono block"
            >
              WOMEN'S WEAR
            </Link>
            <div className="pl-3 space-y-2 font-mono">
              {WOMEN_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-[11px] uppercase tracking-wider text-[#a3a3a3] hover:text-white"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-b border-white/10 pb-4">
            <Link
              to="/collections/accessories"
              className="text-xs uppercase tracking-widest text-[#EDE0CC] font-bold font-mono block"
            >
              ACCESSORIES
            </Link>
          </div>

          <div className="space-y-2 border-b border-white/10 pb-4">
            <span className="text-xs uppercase tracking-widest text-[#EDE0CC] font-bold font-mono block">
              TRADITIONAL WEAR
            </span>
            <div className="pl-3 space-y-2 font-mono">
              {TRADITIONAL_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-[11px] uppercase tracking-wider text-[#a3a3a3] hover:text-white"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-[10px] font-mono text-[#888]">
            <span>Exclusively Launching in India</span>
            <span className="font-bold text-[#EDE0CC]">Billed in INR (₹)</span>
          </div>
        </div>
      )}
    </header>
  );
};
