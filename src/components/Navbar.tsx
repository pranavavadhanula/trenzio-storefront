import React, { useState, useEffect, useRef } from 'react';
import { ShoppingBag, ChevronDown, Menu, X, Search, Bookmark, User } from 'lucide-react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useShop } from '../context/ShopContext';

interface SubCategoryItem {
  label: string;
  path: string;
  sub?: string;
}

export const Navbar: React.FC = () => {
  const {
    cartCount,
    setIsCartOpen,
    wishlist,
    setIsWishlistOpen,
    searchQuery,
    setSearchQuery,
    isLoggedIn,
    user,
  } = useShop();

  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [openDropdown, setOpenDropdown] = useState<'men' | 'women' | 'traditional' | 'collections' | null>(null);
  const dropdownTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const location = useLocation();
  const navigate = useNavigate();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 15);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMobileMenuOpen(false);
    setOpenDropdown(null);
  }, [location.pathname]);

  const handleMouseEnter = (menu: 'men' | 'women' | 'traditional' | 'collections') => {
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

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (location.pathname !== '/collections') {
      navigate('/collections');
    }
  };

  const MEN_SUB_ITEMS: SubCategoryItem[] = [
    { label: "All Men's Apparel", path: '/collections/men', sub: 'Complete contemporary menswear' },
    { label: 'Oversized Shirts & Tees', path: '/collections/men-oversized-tees', sub: 'Relaxed boxy dropped shoulders' },
    { label: 'Hoodies & Sweatshirts', path: '/collections/men-sweatshirts', sub: 'Bio-washed French Terry' },
    { label: 'Tailored Cargo Pants', path: '/collections', sub: 'Pleated wide-leg utilitarian trousers' },
  ];

  const WOMEN_SUB_ITEMS: SubCategoryItem[] = [
    { label: "All Women's Apparel", path: '/collections/women', sub: 'Contemporary luxury apparel' },
    { label: 'Draped Shirts & Tees', path: '/collections/women-oversized-tees', sub: 'Boxy drop-shoulder t-shirts' },
    { label: 'Hoodies & Sweaters', path: '/collections/women-sweatshirts', sub: 'Luxury French Terry & knits' },
    { label: 'Drape Wide-Leg Trousers', path: '/collections', sub: 'Architectural tailored trousers' },
  ];

  const TRADITIONAL_SUB_ITEMS: SubCategoryItem[] = [
    { label: "Men's Heritage Atelier", path: '/collections/traditional-men', sub: 'Kurtas, bandhgalas & ethnic couture' },
    { label: "Women's Royal Collection", path: '/collections/traditional-women', sub: 'Sarees, chanderi lehengas & drapes' },
  ];

  return (
    <header
      className={`sticky top-0 z-40 transition-all duration-300 font-sans ${
        isScrolled
          ? 'bg-[#F4F1EA]/95 backdrop-blur-md border-b border-[#DDD8CE] shadow-sm'
          : 'bg-[#F4F1EA] border-b border-[#DDD8CE]/70'
      }`}
    >
      {/* Plain Sticky Navigation Bar (No Top Ticker, No INR, No AI Button) */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Mobile Menu Toggle & Brand Logo */}
          <div className="flex items-center gap-3 sm:gap-4 shrink-0">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-1.5 text-[#171717] hover:text-[#B9AA96] transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>

            <Link to="/" className="group cursor-pointer flex-shrink-0" title="TREVORI Contemporary Streetwear">
              <span className="font-serif text-2xl sm:text-3xl tracking-[0.28em] text-[#171717] font-semibold group-hover:text-[#706B64] transition-colors">
                TREVORI
              </span>
              <span className="hidden sm:block text-[8px] uppercase tracking-[0.25em] text-[#706B64] font-medium -mt-0.5">
                Wear Your Perspective
              </span>
            </Link>
          </div>

          {/* Center: Amazon-Style Search Bar */}
          <div className="flex-1 max-w-xl mx-2 sm:mx-4 hidden md:block">
            <form onSubmit={handleSearchSubmit} className="relative w-full">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search shirts, hoodies, cargo pants, traditional wear..."
                className="w-full bg-[#FFFFFF] text-[#171717] placeholder-[#706B64]/70 text-xs sm:text-sm pl-10 pr-24 py-2.5 rounded-none border border-[#DDD8CE] focus:border-[#171717] focus:outline-none transition-all shadow-none"
              />
              <Search className="w-4 h-4 text-[#706B64] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="absolute right-14 top-1/2 -translate-y-1/2 text-[10px] text-[#706B64] hover:text-[#171717] uppercase tracking-wider px-1.5 py-0.5"
                >
                  Clear
                </button>
              )}
              <button
                type="submit"
                className="absolute right-1 top-1/2 -translate-y-1/2 px-3 py-1.5 bg-[#171717] hover:bg-[#333333] text-white text-[10px] uppercase tracking-widest font-medium transition-colors cursor-pointer"
              >
                Search
              </button>
            </form>
          </div>

          {/* Right: Vault, Bag, and Right-Most Login */}
          <div className="flex items-center gap-2 sm:gap-4 shrink-0">
            {/* Vault (Renamed Wishlist) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-2 text-[#171717] hover:text-[#B9AA96] transition-colors flex items-center gap-1.5 cursor-pointer"
              aria-label="Open Personal Vault"
              title="Personal Vault"
            >
              <Bookmark className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xl:inline text-xs uppercase tracking-wider font-medium">Vault</span>
              {wishlist.length > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#171717] text-white text-[9px] font-medium flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-2 text-[#171717] hover:text-[#B9AA96] transition-colors flex items-center gap-1.5 cursor-pointer"
              aria-label="Open Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5" />
              <span className="hidden xl:inline text-xs uppercase tracking-wider font-medium">Bag</span>
              {cartCount > 0 && (
                <span className="w-4 h-4 rounded-full bg-[#171717] text-white text-[9px] font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* Right-Most: User Login / Account */}
            <Link
              to={isLoggedIn ? '/account' : '/login'}
              className="p-1.5 sm:px-3 sm:py-2 border border-[#DDD8CE] hover:border-[#171717] bg-[#FFFFFF] text-[#171717] text-xs font-medium uppercase tracking-wider flex items-center gap-2 transition-all cursor-pointer shadow-none"
              title={isLoggedIn ? 'Account Dashboard' : 'Member Log In'}
            >
              <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#171717]" />
              <span className="hidden sm:inline">
                {isLoggedIn ? (user?.name?.split(' ')[0] || 'Account') : 'Log In'}
              </span>
            </Link>
          </div>
        </div>

        {/* Mobile Search Bar (Directly below main header bar) */}
        <div className="md:hidden pb-3">
          <form onSubmit={handleSearchSubmit} className="relative w-full">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search shirts, hoodies, cargo pants..."
              className="w-full bg-[#FFFFFF] text-[#171717] placeholder-[#706B64]/70 text-xs pl-9 pr-16 py-2 border border-[#DDD8CE] focus:border-[#171717] focus:outline-none"
            />
            <Search className="w-3.5 h-3.5 text-[#706B64] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
            <button
              type="submit"
              className="absolute right-1 top-1/2 -translate-y-1/2 px-2.5 py-1 bg-[#171717] text-white text-[9px] uppercase tracking-wider font-medium"
            >
              Go
            </button>
          </form>
        </div>

        {/* Desktop Secondary Editorial Menu Bar */}
        <div className="hidden lg:flex items-center justify-center space-x-9 py-2.5 border-t border-[#DDD8CE]/60 text-xs font-medium tracking-[0.18em] uppercase text-[#171717]">
          {/* New Arrivals */}
          <Link to="/collections" className="hover:text-[#B9AA96] transition-colors py-1">
            New Arrivals
          </Link>

          {/* Men's Apparel Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('men')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 hover:text-[#B9AA96] transition-colors py-1 cursor-pointer">
              <span>Men</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openDropdown === 'men' && (
              <div className="absolute top-full left-0 w-64 bg-[#FFFFFF] border border-[#DDD8CE] shadow-lg py-3 z-50">
                {MEN_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-5 py-2 hover:bg-[#F4F1EA] transition-colors text-left"
                  >
                    <div className="text-xs font-medium text-[#171717]">{item.label}</div>
                    {item.sub && <div className="text-[10px] text-[#706B64] normal-case tracking-normal">{item.sub}</div>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Women's Apparel Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('women')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 hover:text-[#B9AA96] transition-colors py-1 cursor-pointer">
              <span>Women</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openDropdown === 'women' && (
              <div className="absolute top-full left-0 w-64 bg-[#FFFFFF] border border-[#DDD8CE] shadow-lg py-3 z-50">
                {WOMEN_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-5 py-2 hover:bg-[#F4F1EA] transition-colors text-left"
                  >
                    <div className="text-xs font-medium text-[#171717]">{item.label}</div>
                    {item.sub && <div className="text-[10px] text-[#706B64] normal-case tracking-normal">{item.sub}</div>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Traditional Couture Dropdown */}
          <div
            className="relative"
            onMouseEnter={() => handleMouseEnter('traditional')}
            onMouseLeave={handleMouseLeave}
          >
            <button className="flex items-center gap-1 hover:text-[#B9AA96] transition-colors py-1 cursor-pointer">
              <span>Heritage & Traditional</span>
              <ChevronDown className="w-3 h-3 opacity-60" />
            </button>
            {openDropdown === 'traditional' && (
              <div className="absolute top-full left-0 w-72 bg-[#FFFFFF] border border-[#DDD8CE] shadow-lg py-3 z-50">
                {TRADITIONAL_SUB_ITEMS.map((item) => (
                  <Link
                    key={item.path}
                    to={item.path}
                    className="block px-5 py-2 hover:bg-[#F4F1EA] transition-colors text-left"
                  >
                    <div className="text-xs font-medium text-[#171717]">{item.label}</div>
                    {item.sub && <div className="text-[10px] text-[#706B64] normal-case tracking-normal">{item.sub}</div>}
                  </Link>
                ))}
              </div>
            )}
          </div>

          {/* Editorial Lookbook */}
          <a href="/#lookbook" className="hover:text-[#B9AA96] transition-colors py-1">
            Lookbook
          </a>

          {/* Brand Philosophy */}
          <Link to="/about" className="hover:text-[#B9AA96] transition-colors py-1">
            Atelier Story
          </Link>

          {/* 3D Virtual Try-On */}
          <Link to="/virtual-tryon" className="hover:text-[#B9AA96] transition-colors py-1">
            Virtual Try-On
          </Link>
        </div>
      </div>

      {/* Mobile Slide-Out Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F4F1EA] border-b border-[#DDD8CE] px-6 py-6 space-y-4">
          <nav className="space-y-3 text-xs uppercase tracking-widest font-medium">
            <Link to="/collections" className="block py-2 text-[#171717] border-b border-[#DDD8CE]">
              New Arrivals
            </Link>
            <Link to="/collections/men" className="block py-2 text-[#171717] border-b border-[#DDD8CE]">
              Men's Apparel
            </Link>
            <Link to="/collections/women" className="block py-2 text-[#171717] border-b border-[#DDD8CE]">
              Women's Apparel
            </Link>
            <Link to="/collections/traditional-men" className="block py-2 text-[#171717] border-b border-[#DDD8CE]">
              Heritage Traditional Wear
            </Link>
            <a href="/#lookbook" className="block py-2 text-[#171717] border-b border-[#DDD8CE]">
              Editorial Lookbook
            </a>
            <Link to="/about" className="block py-2 text-[#171717] border-b border-[#DDD8CE]">
              Atelier Story
            </Link>
            <Link to="/virtual-tryon" className="block py-2 text-[#171717]">
              Virtual Try-On 3D
            </Link>
          </nav>
        </div>
      )}
    </header>
  );
};
