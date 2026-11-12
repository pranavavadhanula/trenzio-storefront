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
      className={`sticky top-0 z-40 transition-all duration-300 relative bg-gradient-to-b from-[#E76F51] via-[#DF6548] to-[#D5573C] text-white font-sans ${
        isScrolled
          ? 'shadow-[0_12px_35px_rgba(213,87,60,0.45),inset_0_1px_0_0_rgba(255,255,255,0.4)] border-b border-[#B8442E]'
          : 'shadow-[0_8px_25px_rgba(213,87,60,0.3),inset_0_1px_0_0_rgba(255,255,255,0.35)] border-b border-[#C8523B]'
      }`}
    >
      {/* Glossy Coral Peach Specular Reflections */}
      <div className="pointer-events-none absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/[0.22] via-white/[0.06] to-transparent" />
      <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_75%_60%_at_50%_0%,rgba(255,255,255,0.22),transparent_70%)]" />
      <div className="pointer-events-none absolute top-0 inset-x-0 h-[1px] bg-gradient-to-r from-transparent via-white/60 to-transparent" />

      {/* Top Main Brand Header (Coral Peach Luxe) */}
      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 py-4 sm:py-5 flex items-center justify-between border-b border-white/20">
        {/* Left: Mobile Menu & Search */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden text-white hover:text-[#FFEBE4] p-1 cursor-pointer transition-colors"
            aria-label="Toggle Menu"
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>

          <button
            onClick={() => setIsSearchOpen(true)}
            className="flex items-center gap-2 text-xs uppercase tracking-wider text-white/95 hover:text-white transition-all px-2.5 py-1.5 rounded-sm hover:bg-white/15 cursor-pointer font-sans font-semibold"
            title="Search Catalog"
          >
            <Search className="w-4 h-4 text-white" />
            <span className="hidden sm:inline text-xs font-semibold">SEARCH</span>
          </button>
        </div>

        {/* Center: Brand Name (Coral Peach Luxe Typography) */}
        <Link
          to="/"
          className="text-center group block cursor-pointer"
          title="Trenzio Home"
        >
          <h1 className="font-serif text-2xl sm:text-4xl tracking-[0.4em] text-white font-bold group-hover:text-[#FFF0EB] transition-all pl-[0.4em] drop-shadow-[0_2px_14px_rgba(0,0,0,0.25)]">
            TRENZIO
          </h1>
          <p className="text-[9px] uppercase tracking-[0.28em] text-[#FFE8DF] mt-0.5 font-sans font-medium group-hover:text-white transition-colors">
            Luxury Heavyweight Apparel &bull; India
          </p>
        </Link>

        {/* Right: Actions (Fixed INR Badge, Wishlist, Bag) */}
        <div className="flex items-center space-x-3 sm:space-x-5">
          {/* Fixed INR Only Indicator - Glossy White Pill on Coral Peach */}
          <div
            className="flex items-center space-x-1 py-1 px-3 rounded-none border border-white/40 bg-white/15 text-white font-sans text-xs font-bold tracking-wider select-none shadow-[inset_0_1px_0_0_rgba(255,255,255,0.4),0_2px_6px_rgba(0,0,0,0.15)] backdrop-blur-sm"
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
            className="relative flex items-center gap-1.5 text-white/95 hover:text-white transition-all px-2.5 py-1.5 rounded-sm hover:bg-white/15 cursor-pointer font-sans text-xs font-semibold tracking-wider"
            title="Wishlist (Right click to open in new tab)"
          >
            <Heart className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">WISHLIST</span>
            {wishlist.length > 0 && (
              <span className="text-white font-bold text-xs bg-white/25 px-1 rounded-full">
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
            className="relative flex items-center gap-1.5 text-white hover:text-[#FFF0EB] transition-all px-2.5 py-1.5 rounded-sm hover:bg-white/15 cursor-pointer font-sans text-xs font-semibold tracking-wider"
            title="Shopping Bag (Right click to open in new tab)"
          >
            <ShoppingBag className="w-4 h-4 text-white" />
            <span className="hidden sm:inline">BAG</span>
            <span className="px-1.5 py-0.2 rounded-full bg-white text-[#D5573C] font-black text-[11px] font-sans shadow-[0_2px_8px_rgba(0,0,0,0.2)]">
              {cartCount}
            </span>
          </Link>
        </div>
      </div>

      {/* Secondary Nav Bar: Coral Peach with Crisp White Navigation */}
      <nav className="relative z-10 max-w-7xl mx-auto px-4 sm:px-8 flex items-center justify-center space-x-6 sm:space-x-12 text-[13px] uppercase tracking-[0.14em] font-sans font-semibold py-3.5 border-t border-white/15">
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
                ? 'border-white text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                : 'border-transparent text-white/90 hover:text-white hover:border-white/50'
            }`}
          >
            <Link to="/collections/men" className="hover:text-white">
              MEN'S WEAR
            </Link>
            <ChevronDown
              className={`w-3.5 h-3.5 text-white/80 transition-transform duration-300 ${
                openDropdown === 'men' ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {openDropdown === 'men' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-[#B9432D]/98 backdrop-blur-2xl border border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_25px_60px_rgba(0,0,0,0.6)] py-2.5 z-50 text-white animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('men')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-[#FFE8DF] font-bold border-b border-white/15 bg-[#A33925] flex items-center justify-between">
                <span>Men's Heavyweight Fits</span>
                <span className="text-[10px] text-white/80 font-medium">240–400 GSM</span>
              </div>
              <div className="py-1">
                {MEN_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-white/15 transition-colors group cursor-pointer"
                  >
                    <div className="text-[13px] font-bold text-white group-hover:text-[#FFEBE4] tracking-wide">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#FFE0D4] font-normal leading-normal mt-0.5">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 pt-2.5 pb-1.5 border-t border-white/15 bg-[#A33925]">
                <Link
                  to="/collections/men"
                  onClick={() => setOpenDropdown(null)}
                  className="text-xs uppercase tracking-wider text-white hover:underline font-bold flex items-center justify-between"
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
                ? 'border-white text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                : 'border-transparent text-white/90 hover:text-white hover:border-white/50'
            }`}
          >
            <Link to="/collections/women" className="hover:text-white">
              WOMEN'S WEAR
            </Link>
            <ChevronDown
              className={`w-3.5 h-3.5 text-white/80 transition-transform duration-300 ${
                openDropdown === 'women' ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {openDropdown === 'women' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-[#B9432D]/98 backdrop-blur-2xl border border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_25px_60px_rgba(0,0,0,0.6)] py-2.5 z-50 text-white animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('women')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-[#FFE8DF] font-bold border-b border-white/15 bg-[#A33925] flex items-center justify-between">
                <span>Women's Oversized Cuts</span>
                <span className="text-[10px] text-white/80 font-medium">French Terry</span>
              </div>
              <div className="py-1">
                {WOMEN_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-white/15 transition-colors group cursor-pointer"
                  >
                    <div className="text-[13px] font-bold text-white group-hover:text-[#FFEBE4] tracking-wide">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#FFE0D4] font-normal leading-normal mt-0.5">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
              <div className="px-4 pt-2.5 pb-1.5 border-t border-white/15 bg-[#A33925]">
                <Link
                  to="/collections/women"
                  onClick={() => setOpenDropdown(null)}
                  className="text-xs uppercase tracking-wider text-white hover:underline font-bold flex items-center justify-between"
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
              ? 'border-white text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]'
              : 'border-transparent text-white/90 hover:text-white hover:border-white/50'
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
                ? 'border-white text-white font-bold drop-shadow-[0_0_8px_rgba(255,255,255,0.7)]'
                : 'border-transparent text-white/90 hover:text-white hover:border-white/50'
            }`}
          >
            <span>TRADITIONAL WEAR</span>
            <ChevronDown
              className={`w-3.5 h-3.5 text-white/80 transition-transform duration-300 ${
                openDropdown === 'traditional' ? 'rotate-180 text-white' : ''
              }`}
            />
          </button>

          {openDropdown === 'traditional' && (
            <div
              className="absolute left-1/2 -translate-x-1/2 mt-2 w-80 bg-[#B9432D]/98 backdrop-blur-2xl border border-white/25 shadow-[inset_0_1px_0_0_rgba(255,255,255,0.35),0_25px_60px_rgba(0,0,0,0.6)] py-2.5 z-50 text-white animate-fadeIn"
              onMouseEnter={() => handleMouseEnter('traditional')}
              onMouseLeave={handleMouseLeave}
            >
              <div className="px-4 py-2.5 text-[11px] uppercase tracking-wider text-[#FFE8DF] font-bold border-b border-white/15 bg-[#A33925] flex items-center justify-between">
                <span>Traditional & Ethnic Wear</span>
                <span className="text-[10px] text-white/80 font-medium">Premium</span>
              </div>
              <div className="py-1">
                {TRADITIONAL_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.label}
                    to={item.path}
                    onClick={() => setOpenDropdown(null)}
                    className="block px-4 py-2.5 hover:bg-white/15 transition-colors group cursor-pointer"
                  >
                    <div className="text-[13px] font-bold text-white group-hover:text-[#FFEBE4] tracking-wide">
                      {item.label}
                    </div>
                    <div className="text-[11px] text-[#FFE0D4] font-normal leading-normal mt-0.5">
                      {item.sub}
                    </div>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>
      </nav>

      {/* Mobile Drawer - Coral Peach Theme */}
      {mobileMenuOpen && (
        <div className="md:hidden bg-[#C8523B] border-b border-[#B0432E] px-6 py-6 space-y-5 animate-fadeIn text-white shadow-2xl relative z-20 font-sans">
          <div className="space-y-2 border-b border-white/20 pb-4">
            <Link
              to="/collections/men"
              className="text-xs uppercase tracking-wider text-white font-bold block"
            >
              MEN'S WEAR
            </Link>
            <div className="pl-3 space-y-2">
              {MEN_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-xs uppercase tracking-wider text-[#FFEBE4] hover:text-white font-medium"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-b border-white/20 pb-4">
            <Link
              to="/collections/women"
              className="text-xs uppercase tracking-wider text-white font-bold block"
            >
              WOMEN'S WEAR
            </Link>
            <div className="pl-3 space-y-2">
              {WOMEN_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-xs uppercase tracking-wider text-[#FFEBE4] hover:text-white font-medium"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="space-y-2 border-b border-white/20 pb-4">
            <Link
              to="/collections/accessories"
              className="text-xs uppercase tracking-wider text-white font-bold block"
            >
              ACCESSORIES
            </Link>
          </div>

          <div className="space-y-2 border-b border-white/20 pb-4">
            <span className="text-xs uppercase tracking-wider text-white font-bold block">
              TRADITIONAL WEAR
            </span>
            <div className="pl-3 space-y-2">
              {TRADITIONAL_SUB_ITEMS.map((item) => (
                <Link
                  key={item.label}
                  to={item.path}
                  className="block text-xs uppercase tracking-wider text-[#FFEBE4] hover:text-white font-medium"
                >
                  &bull; {item.label}
                </Link>
              ))}
            </div>
          </div>

          <div className="pt-2 flex items-center justify-between text-xs font-medium text-[#FFE0D4]">
            <span>Exclusively Launching in India</span>
            <span className="font-bold text-white">Billed in INR (₹)</span>
          </div>
        </div>
      )}
    </header>
  );
};
