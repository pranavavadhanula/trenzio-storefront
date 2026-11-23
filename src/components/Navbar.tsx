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
    setIsSearchOpen,
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
      {/* Plain Sticky Navigation Bar with Centered TREVORI Logo */}
      <div className="max-w-7xl mx-auto px-4 sm:px-8">
        <div className="relative h-16 sm:h-20 flex items-center justify-between gap-3 sm:gap-6">
          
          {/* Left: Mobile Menu Trigger */}
          <div className="flex items-center gap-3 z-10">
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-[#171717] hover:text-[#B9AA96] transition-colors cursor-pointer"
              aria-label="Open navigation menu"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" strokeWidth={1.75} /> : <Menu className="w-6 h-6" strokeWidth={1.75} />}
            </button>
          </div>

          {/* TREVORI Brand Logo: Centered on mobile, shifted slightly left on desktop to balance search bar with breathing room */}
          <div className="absolute left-1/2 lg:left-[34%] xl:left-[35%] -translate-x-1/2 flex flex-col items-center justify-center text-center pointer-events-auto z-10 transition-all duration-300">
            <Link to="/" className="group cursor-pointer flex flex-col items-center justify-center text-center" title="TREVORI Contemporary Streetwear">
              <span className="font-serif text-xl sm:text-3xl lg:text-[32px] tracking-[0.22em] sm:tracking-[0.28em] text-[#171717] font-semibold group-hover:text-[#706B64] transition-colors whitespace-nowrap">
                TREVORI
              </span>
              <span className="hidden sm:block text-[8px] uppercase tracking-[0.25em] text-[#706B64] font-medium -mt-0.5">
                Wear Your Perspective
              </span>
            </Link>
          </div>

          {/* Right: Search Bar & Larger Clean Icons (Vault, Bag, Account) */}
          <div className="flex items-center justify-end gap-1 sm:gap-3 shrink-0 ml-auto z-10">
            {/* Desktop Search Bar on Right: Wide & Uncongested */}
            <div className="w-64 lg:w-72 xl:w-80 hidden lg:block">
              <form onSubmit={handleSearchSubmit} className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search shirts, hoodies, cargos..."
                  className="w-full bg-[#FFFFFF] text-[#171717] placeholder-[#706B64]/80 text-xs sm:text-sm pl-9 pr-20 py-2 border border-[#DDD8CE] focus:border-[#171717] focus:outline-none transition-all shadow-none"
                />
                <Search className="w-4 h-4 text-[#706B64] absolute left-3 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-16 top-1/2 -translate-y-1/2 text-[9px] text-[#706B64] hover:text-[#171717] uppercase tracking-wider px-1"
                  >
                    Clear
                  </button>
                )}
                <button
                  type="submit"
                  className="absolute right-1.5 top-1/2 -translate-y-1/2 px-3 py-1 bg-[#171717] hover:bg-[#333333] text-white text-[9px] uppercase tracking-widest font-medium transition-colors cursor-pointer"
                >
                  Search
                </button>
              </form>
            </div>

            {/* Tablet Search Icon (Screen >= 640px and < 1024px; on small mobile, search bar is directly below header) */}
            <button
              onClick={() => setIsSearchOpen(true)}
              className="hidden sm:flex lg:hidden relative p-1.5 sm:p-2 text-[#171717] hover:text-[#B9AA96] transition-colors cursor-pointer items-center justify-center"
              aria-label="Search Collection"
              title="Search Collection"
            >
              <Search className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
            </button>

            {/* Vault Icon (Wishlist) */}
            <button
              onClick={() => setIsWishlistOpen(true)}
              className="relative p-1.5 sm:p-2 text-[#171717] hover:text-[#B9AA96] transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Personal Vault"
              title="Personal Vault"
            >
              <Bookmark className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
              {wishlist.length > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#171717] text-white text-[9px] font-medium flex items-center justify-center">
                  {wishlist.length}
                </span>
              )}
            </button>

            {/* Shopping Bag Icon */}
            <button
              onClick={() => setIsCartOpen(true)}
              className="relative p-1.5 sm:p-2 text-[#171717] hover:text-[#B9AA96] transition-colors cursor-pointer flex items-center justify-center"
              aria-label="Shopping Bag"
              title="Shopping Bag"
            >
              <ShoppingBag className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
              {cartCount > 0 && (
                <span className="absolute top-0.5 right-0.5 w-4 h-4 rounded-full bg-[#171717] text-white text-[9px] font-medium flex items-center justify-center">
                  {cartCount}
                </span>
              )}
            </button>

            {/* User Account / Login Icon */}
            <Link
              to={isLoggedIn ? '/account' : '/login'}
              className="relative p-1.5 sm:p-2 text-[#171717] hover:text-[#B9AA96] transition-colors cursor-pointer flex items-center justify-center"
              aria-label={isLoggedIn ? 'Account Dashboard' : 'Member Log In'}
              title={isLoggedIn ? `Account (${user?.name || 'Member'})` : 'Member Log In'}
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6" strokeWidth={1.75} />
              {isLoggedIn && (
                <span className="absolute bottom-1 right-1 w-2 h-2 rounded-full bg-emerald-600 ring-2 ring-[#F4F1EA]" title="Logged In" />
              )}
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

        {/* Desktop Secondary Editorial Menu Bar: Only New Arrivals, Men, and Women */}
        <div className="hidden lg:flex items-center justify-center space-x-14 py-3 border-t border-[#DDD8CE]/60 text-xs font-medium tracking-[0.22em] uppercase text-[#171717]">
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
        </div>
      </div>

      {/* Mobile Slide-Out Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden bg-[#F4F1EA] border-b border-[#DDD8CE] px-6 py-6 space-y-4 animate-fade-in-subtle">
          <nav className="space-y-3 text-xs uppercase tracking-widest font-medium">
            <Link to="/collections" className="block py-2.5 text-[#171717] border-b border-[#DDD8CE]/80 flex items-center justify-between">
              <span>New Arrivals</span>
              <span className="text-[10px] text-[#B9AA96] font-mono">Vol. IV</span>
            </Link>
            <Link to="/collections/men" className="block py-2.5 text-[#171717] border-b border-[#DDD8CE]/80 flex items-center justify-between">
              <span>Men's Apparel</span>
              <span className="text-[10px] text-[#706B64] font-normal lowercase tracking-normal">tees & hoodies</span>
            </Link>
            <Link to="/collections/women" className="block py-2.5 text-[#171717] border-b border-[#DDD8CE]/80 flex items-center justify-between">
              <span>Women's Apparel</span>
              <span className="text-[10px] text-[#706B64] font-normal lowercase tracking-normal">drapes & knits</span>
            </Link>
            <a href="/#lookbook" onClick={() => setMobileMenuOpen(false)} className="block py-2.5 text-[#171717] border-b border-[#DDD8CE]/80">
              Lookbook Volume IV
            </a>
            <Link to={isLoggedIn ? '/account' : '/login'} className="block py-2.5 text-[#171717] border-b border-[#DDD8CE]/80 flex items-center justify-between">
              <span>{isLoggedIn ? 'My Account (Dashboard)' : 'Member Sign In'}</span>
              {isLoggedIn && <span className="w-2 h-2 rounded-full bg-emerald-600" />}
            </Link>
            <button
              type="button"
              onClick={() => {
                setMobileMenuOpen(false);
                setIsWishlistOpen(true);
              }}
              className="w-full text-left py-2.5 text-[#171717] flex items-center justify-between uppercase tracking-widest cursor-pointer"
            >
              <span>Personal Vault</span>
              <span className="text-[10px] text-[#706B64] font-mono">({wishlist.length})</span>
            </button>
          </nav>
        </div>
      )}
    </header>
  );
};
