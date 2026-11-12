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
    { label: 'Oversized T-Shirts', path: '/collections/men-oversized-tees', sub: 'Structured boxy dropped shoulders' },
    { label: 'Sweatshirts & Hoodies', path: '/collections/men-sweatshirts', sub: '400 GSM diagonal loop French Terry' },
    { label: 'Classic Tees', path: '/collections/men-classic-tees', sub: 'Tailored everyday luxury' },
  ];

  const WOMEN_SUB_ITEMS: SubCategoryItem[] = [
    { label: "All Women's Wear", path: '/collections/women', sub: 'Complete oversized silhouettes' },
    { label: 'Oversized T-Shirts', path: '/collections/women-oversized-tees', sub: 'Draped dropped-shoulder tees' },
    { label: 'Sweatshirts & Hoodies', path: '/collections/women-sweatshirts', sub: '400 GSM luxury French Terry' },
    { label: 'Classic Tees', path: '/collections/women-classic-tees', sub: 'Minimalist heavyweight basics' },
  ];

  const TRADITIONAL_SUB_ITEMS: SubCategoryItem[] = [
    { label: "Men's Traditional Wear", path: '/collections/traditional-men', sub: 'Kurtas, sherwanis & ethnic wear' },
    { label: "Women's Traditional Wear", path: '/collections/traditional-women', sub: 'Sarees, lehengas & ethnic drapes' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 relative bg-gradient-to-b from-[#0F2444] via-[#0C1D38] to-[#0A172D] text-white font-sans ${
        isScrolled
          ? 'shadow-[0_12px_35px_rgba(7,19,36,0.6),inset_0_1px_0_0_rgba(255,255,255,0.18)] border-b border-[#1A3050]'
          : 'shadow-[0_8px_25px_rgba(7,19,36,0.4),inset_0_1px_0_0_rgba(255,255,255,0.14)] border-b border-[#1A3050]/80'
      }`}
    >
      {/* High-Gloss Specular Reflections (Navy Obsidian Finish) */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.12] via-white/[0.02] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_65%_at_50%_0%,rgba(248,131,121,0.12),transparent_75%)]" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-[#F88379]/40 to-transparent" />

      {/* Top Main Brand Header (Navy Blue Glossy) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-[#1E3A66]/50">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-[#F88379] p-1 cursor-pointer transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-[#CBD5E1] hover:text-[#F88379] transition-all px-2.5 py-1.5 rounded-sm hover:bg-white/[0.06] cursor-pointer font-sans font-semibold"
            title="Search Catalog"
          >
            <Search className="w-4 h-4 text-[#F88379]" />
            <span className="hidden sm:inline text-xs font-bold">SEARCH</span>
          </button>
        </div>

        {/* Center: Brand Name (Luxe Haute Navy Typography) */}
        <Link
          to="/"
          className="text-center group block cursor-pointer"
          title="Trevori Home"
        >
          <h1 className="font-serif text-2xl sm:text-4xl tracking-[0.4em] text-white font-bold group-hover:text-[#F88379] transition-all pl-[0.4em] drop-shadow-[0_2px_14px_rgba(248,131,121,0.2)]">
            TREVORI
          </h1>
          <p className="text-[9px] uppercase tracking-[0.28em] text-[#94A3B8] mt-0.5 font-sans font-medium group-hover:text-white transition-colors">
            Luxury Heavyweight Apparel &bull; India
          </p>
        </Link>

        {/* Right: Actions (Fixed INR Badge, Wishlist, Bag) */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Fixed INR Only Indicator - Navy Pill with Coral Pink Key Accent */}
          <div
            className="flex items-center space-x-1 py-1 px-3 rounded-none border border-[#F88379]/40 bg-[#0B1A30] text-[#F88379] font-sans text-xs font-bold tracking-wider select-none shadow-[inset_0_1px_0_0_rgba(248,131,121,0.25),0_2px_8px_rgba(0,0,0,0.3)] backdrop-blur-md"
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
            className="relative flex items-center gap-1.5 text-[#CBD5E1] hover:text-[#F88379] transition-all px-2.5 py-1.5 rounded-sm hover:bg-white/[0.06] cursor-pointer font-sans text-xs font-bold tracking-wider"
            title="Wishlist (Right click to open in new tab)"
          >
            <Heart className="w-4 h-4 text-[#F88379]" />
            <span className="hidden sm:inline">WISHLIST</span>
            {wishlist.length > 0 && (
              <span className="text-white font-bold text-xs bg-[#F88379] px-1.5 py-0.2 rounded-full shadow-[0_0_10px_rgba(248,131,121,0.5)]">
                ({wishlist.length})
              </span>
            )}
          </Link>

          {/* Cart Bag with Coral Pink Pill */}
          <Link
            to="/cart"
            onClick={(e) => {
              if (!e.metaKey && !e.ctrlKey) {
                e.preventDefault();
                setIsCartOpen(true);
              }
            }}
            className="relative flex items-center gap-1.5 text-white hover:text-[#F88379] transition-all px-2.5 py-1.5 rounded-sm hover:bg-white/[0.06] cursor-pointer font-sans text-xs font-bold tracking-wider"
            title="Shopping Bag (Right click to open in new tab)"
          >
            <ShoppingBag className="w-4 h-4 text-[#F88379]" />
            <span className="hidden sm:inline">BAG</span>
            <span className="px-1.5 py-0.2 rounded-full bg-[#F88379] text-white font-black text-[11px] font-sans shadow-[0_0_12px_rgba(248,131,121,0.5)]">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Secondary Nav Bar: Navy Blue with Coral Pink Active Accents */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-center space-x-6 sm:space-x-12 text-[13px] uppercase tracking-[0.14em] font-sans font-bold py-3.5 border-t border-[#1E3A66]/30">
        {/* Item 1: MEN'S WEAR with Dropdown */}
        <div
          className="relative"
          onMouseEnter={() => handleMouseEnter('men')}
          onMouseLeave={handleMouseLeave}
        >
          <button
            onClick={() => setOpenDropdown(openDropdown === 'men' ? null : 'men')}
            className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all duration-300 cursor-pointer ${
              currentPath.startsWith('/collections/men') || openDropdown === 'men'
                ? 'border-[#F88379] text-[#F88379] font-black drop-shadow-[0_0_10px_rgba(248,131,121,0.6)]'
                : 'border-transparent text-[#CBD5E1] hover:text-white hover:border-[#F88379]/50'
            }`}
          >
            <Link to="/collections/men" className="hover:text-white">
              MEN'S WEAR
            </Link>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-300 ${
                openDropdown === 'men' ? 'rotate-180 text-[#F88379]' : ''
              }`}
            />
          </button>

          {openDropdown === 'men' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-[#09172B]/98 backdrop-blur-2xl border border-[#1E3A66] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_25px_60px_rgba(0,0,0,0.8)] py-2.5 z-50 text-white animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('men')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-[#F88379] font-bold border-b border-[#1E3A66] bg-[#071324] flex items-center justify-between">
                <span>Men's Heavyweight Fits</span>
                <span className="text-[10px] text-[#94A3B8] font-bold">240–400 GSM</span>
              </div>
              <div className="py-1">
                {MEN_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-[#122846] transition-colors group cursor-pointer"
                  >
                    <div className="text-[13px] font-bold text-white group-hover:text-[#F88379] tracking-wide">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#94A3B8] font-medium leading-normal mt-0.5">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 pt-2.5 pb-1.5 border-t border-[#1E3A66] bg-[#071324]">
                <Link
                  to="/collections/men"
                  onClick={() => setOpenDropdown(null)}
                  className="text-xs uppercase tracking-wider text-[#F88379] hover:underline font-bold flex items-center justify-between"
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
            className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all duration-300 cursor-pointer ${
              currentPath.startsWith('/collections/women') || openDropdown === 'women'
                ? 'border-[#F88379] text-[#F88379] font-black drop-shadow-[0_0_10px_rgba(248,131,121,0.6)]'
                : 'border-transparent text-[#CBD5E1] hover:text-white hover:border-[#F88379]/50'
            }`}
          >
            <Link to="/collections/women" className="hover:text-white">
              WOMEN'S WEAR
            </Link>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-300 ${
                openDropdown === 'women' ? 'rotate-180 text-[#F88379]' : ''
              }`}
            />
          </button>

          {openDropdown === 'women' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-[#09172B]/98 backdrop-blur-2xl border border-[#1E3A66] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_25px_60px_rgba(0,0,0,0.8)] py-2.5 z-50 text-white animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('women')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-[#F88379] font-bold border-b border-[#1E3A66] bg-[#071324] flex items-center justify-between">
                <span>Women's Oversized Cuts</span>
                <span className="text-[10px] text-[#94A3B8] font-bold">French Terry</span>
              </div>
              <div className="py-1">
                {WOMEN_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-[#122846] transition-colors group cursor-pointer"
                  >
                    <div className="text-[13px] font-bold text-white group-hover:text-[#F88379] tracking-wide">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#94A3B8] font-medium leading-normal mt-0.5">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 pt-2.5 pb-1.5 border-t border-[#1E3A66] bg-[#071324]">
                <Link
                  to="/collections/women"
                  onClick={() => setOpenDropdown(null)}
                  className="text-xs uppercase tracking-wider text-[#F88379] hover:underline font-bold flex items-center justify-between"
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
          className={`pb-1 border-b-2 transition-all duration-300 ${
            currentPath.startsWith('/collections/accessories')
              ? 'border-[#F88379] text-[#F88379] font-black drop-shadow-[0_0_10px_rgba(248,131,121,0.6)]'
              : 'border-transparent text-[#CBD5E1] hover:text-white hover:border-[#F88379]/50'
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
            className={`flex items-center gap-1.5 pb-1 border-b-2 transition-all duration-300 cursor-pointer ${
              currentPath.startsWith('/collections/traditional') || openDropdown === 'traditional'
                ? 'border-[#F88379] text-[#F88379] font-black drop-shadow-[0_0_10px_rgba(248,131,121,0.6)]'
                : 'border-transparent text-[#CBD5E1] hover:text-white hover:border-[#F88379]/50'
            }`}
          >
            <span>TRADITIONAL WEAR</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-[#94A3B8] transition-transform duration-300 ${
                openDropdown === 'traditional' ? 'rotate-180 text-[#F88379]' : ''
              }`}
            />
          </button>

          {openDropdown === 'traditional' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-[#09172B]/98 backdrop-blur-2xl border border-[#1E3A66] shadow-[inset_0_1px_0_0_rgba(255,255,255,0.1),0_25px_60px_rgba(0,0,0,0.8)] py-2.5 z-50 text-white animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('traditional')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-[#F88379] font-bold border-b border-[#1E3A66] bg-[#071324] flex items-center justify-between">
                <span>Traditional & Ethnic Wear</span>
                <span className="text-[10px] text-[#94A3B8] font-bold">Premium</span>
              </div>
              <div className="py-1">
                {TRADITIONAL_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-[#122846] transition-colors group cursor-pointer"
                  >
                    <div className="text-[13px] font-bold text-white group-hover:text-[#F88379] tracking-wide">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#94A3B8] font-medium leading-normal mt-0.5">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer - Navy Theme with Coral Pink */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#0A172D] border-b border-[#1E3A66] px-6 py-6 space-y-5 animate-fadeIn text-white shadow-2xl relative z-20 font-sans">
          <div className="space-y-2 border-b border-[#1E3A66] pb-4">
            <Link
              to="/collections/men"
              className="text-xs uppercase tracking-wider text-[#F88379] font-bold block"
            >
              MEN'S WEAR
            </Link>
            <div className="pl-3 space-y-2">
              {MEN_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-xs uppercase tracking-wider text-[#CBD5E1] hover:text-white font-semibold"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-b border-[#1E3A66] pb-4">
            <Link
              to="/collections/women"
              className="text-xs uppercase tracking-wider text-[#F88379] font-bold block"
            >
              WOMEN'S WEAR
            </Link>
            <div className="pl-3 space-y-2">
              {WOMEN_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-xs uppercase tracking-wider text-[#CBD5E1] hover:text-white font-semibold"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-b border-[#1E3A66] pb-4">
            <Link
              to="/collections/accessories"
              className="text-xs uppercase tracking-wider text-[#F88379] font-bold block"
            >
              ACCESSORIES
            </Link>
          </div>

          <div className="space-y-2 border-b border-[#1E3A66] pb-4">
            <span className="text-xs uppercase tracking-wider text-[#F88379] font-bold block">
              TRADITIONAL WEAR
            </span>
            <div className="pl-3 space-y-2">
              {TRADITIONAL_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-xs uppercase tracking-wider text-[#CBD5E1] hover:text-white font-semibold"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-bold text-[#94A3B8]">
            <span>Exclusively Launching in India</span>
            <span className="font-extrabold text-[#F88379]">Billed in INR (₹)</span>
          </div>
        </div>
      )}
    </header>
  );
};
