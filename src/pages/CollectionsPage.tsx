import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import { SlidersHorizontal, Sparkles, Loader2, ChevronRight, ChevronDown } from 'lucide-react';

const CATEGORY_MAP: Record<string, { label: string; catFilter?: string; genderFilter?: string; desc: string; dept: 'men' | 'women' }> = {
  // Men's Section
  'men': {
    label: "Men's Wear",
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Heavyweight street fits engineered for men with masculine boxy drape and reinforced ribbed collars.',
  },
  'men-sweatshirts': {
    label: "Men's Sweatshirts & Hoodies",
    catFilter: 'Sweatshirts',
    genderFilter: 'Men',
    dept: 'men',
    desc: '400 GSM diagonal loop French Terry hoodies and relaxed luxury sweatshirts engineered for men.',
  },
  'men-oversized-tees': {
    label: "Men's Oversized T-Shirts",
    catFilter: 'Oversized Tees',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Super-combed 240–350 GSM cotton with structured dropped shoulders and boxy silhouette for men.',
  },
  'men-classic-tees': {
    label: "Men's Classic Tees",
    catFilter: 'T-Shirts',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Everyday refined luxury cut with tailored sleeves and reinforced ribbed collar for men.',
  },
  'traditional-men': {
    label: "Men's Traditional Wear",
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Premium kurtas, sherwanis and ethnic wear crafted with the finest fabrics for men.',
  },

  // Women's Section
  'women': {
    label: "Women's Wear",
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Relaxed oversized streetwear silhouettes and tailored drape for effortless everyday styling.',
  },
  'women-sweatshirts': {
    label: "Women's Sweatshirts & Hoodies",
    catFilter: 'Sweatshirts',
    genderFilter: 'Women',
    dept: 'women',
    desc: '400 GSM French Terry hoodies and relaxed luxury sweatshirts tailored for women.',
  },
  'women-oversized-tees': {
    label: "Women's Oversized T-Shirts",
    catFilter: 'Oversized Tees',
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Draped dropped-shoulder tees in 240–350 GSM bio-washed combed cotton tailored for women.',
  },
  'women-classic-tees': {
    label: "Women's Classic Tees",
    catFilter: 'T-Shirts',
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Tailored everyday luxury cuts and minimalist heavyweight basics for women.',
  },
  'traditional-women': {
    label: "Women's Traditional Wear",
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Elegant sarees, lehengas and ethnic drapes designed for the modern Indian woman.',
  },

  // Fallbacks & legacy routes
  'sweatshirts': {
    label: "Men's Sweatshirts & Hoodies",
    catFilter: 'Sweatshirts',
    genderFilter: 'Men',
    dept: 'men',
    desc: '400 GSM diagonal loop French Terry engineered for cold evenings and relaxed luxury.',
  },
  'oversized-tees': {
    label: "Men's Oversized T-Shirts",
    catFilter: 'Oversized Tees',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Super-combed 240–350 GSM cotton with structured dropped shoulders and boxy silhouette.',
  },
  'classic-tees': {
    label: "Men's Classic Tees",
    catFilter: 'T-Shirts',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Everyday refined luxury cut with tailored sleeves and reinforced ribbed collar.',
  },
  'all': {
    label: "Men's Wear",
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Browse our complete catalog of 240–400 GSM heavyweight tees and luxury sweatshirts.',
  },
};

export const CollectionsPage: React.FC = () => {
  const { category: rawCategory = 'men' } = useParams<{ category?: string }>();
  const navigate = useNavigate();
  const currentCategory = rawCategory.toLowerCase();
  const config = CATEGORY_MAP[currentCategory] || CATEGORY_MAP['men'];

  // Determine active department strictly based on current category or URL
  const isInitialWomen = currentCategory.startsWith('women') || currentCategory === 'traditional-women';
  const [selectedDept, setSelectedDept] = useState<'men' | 'women'>(isInitialWomen ? 'women' : 'men');

  useEffect(() => {
    if (currentCategory.startsWith('women') || currentCategory === 'traditional-women') {
      setSelectedDept('women');
    } else {
      setSelectedDept('men');
    }
  }, [currentCategory]);

  const { products, isLoadingProducts } = useShop();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  const filteredProducts = useMemo(() => {
    return products
      .filter((p) => {
        if (config.catFilter && p.category !== config.catFilter) return false;
        if (config.genderFilter && p.gender !== config.genderFilter && p.gender !== 'Unisex') return false;
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'price-asc') return a.priceINR - b.priceINR;
        if (sortBy === 'price-desc') return b.priceINR - a.priceINR;
        return 0;
      });
  }, [products, config, sortBy]);

  // Handle switching department (Men's <-> Women's)
  const handleDepartmentChange = (dept: 'men' | 'women') => {
    setSelectedDept(dept);
    if (dept === 'women') {
      if (currentCategory.includes('sweatshirts')) navigate('/collections/women-sweatshirts');
      else if (currentCategory.includes('oversized-tees')) navigate('/collections/women-oversized-tees');
      else if (currentCategory.includes('classic-tees')) navigate('/collections/women-classic-tees');
      else if (currentCategory.includes('traditional')) navigate('/collections/traditional-women');
      else navigate('/collections/women');
    } else {
      if (currentCategory.includes('sweatshirts')) navigate('/collections/men-sweatshirts');
      else if (currentCategory.includes('oversized-tees')) navigate('/collections/men-oversized-tees');
      else if (currentCategory.includes('classic-tees')) navigate('/collections/men-classic-tees');
      else if (currentCategory.includes('traditional')) navigate('/collections/traditional-men');
      else navigate('/collections/men');
    }
  };

  // Derive active selection value for Men's category dropdown
  const currentMenValue =
    currentCategory === 'sweatshirts' || currentCategory === 'men-sweatshirts'
      ? 'men-sweatshirts'
      : currentCategory === 'oversized-tees' || currentCategory === 'men-oversized-tees'
      ? 'men-oversized-tees'
      : currentCategory === 'classic-tees' || currentCategory === 'men-classic-tees'
      ? 'men-classic-tees'
      : currentCategory === 'traditional-men'
      ? 'traditional-men'
      : 'men';

  // Derive active selection value for Women's category dropdown
  const currentWomenValue =
    currentCategory === 'women-sweatshirts'
      ? 'women-sweatshirts'
      : currentCategory === 'women-oversized-tees'
      ? 'women-oversized-tees'
      : currentCategory === 'women-classic-tees'
      ? 'women-classic-tees'
      : currentCategory === 'traditional-women'
      ? 'traditional-women'
      : 'women';

  return (
    <div className="relative min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 bg-[#07111E] text-white overflow-hidden font-sans">
      {/* Dark Blue Atmospheric Glow */}
      <div className="pointer-events-none absolute top-4 left-1/4 w-[520px] h-48 bg-gradient-to-r from-[#1D4ED8]/25 via-[#2563EB]/15 to-transparent blur-3xl rounded-full" />

      {/* Breadcrumb Navigation */}
      <nav className="relative z-10 flex items-center space-x-2 text-xs uppercase tracking-wider text-[#94A3B8] font-sans font-medium mb-8">
        <Link to="/" className="hover:text-[#F88379] transition-colors">Home</Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
        <Link
          to={selectedDept === 'women' ? '/collections/women' : '/collections/men'}
          className="hover:text-[#F88379] transition-colors"
        >
          {selectedDept === 'women' ? "Women's Wear" : "Men's Wear"}
        </Link>
        <ChevronRight className="w-3.5 h-3.5 text-[#64748B]" />
        <span className="text-[#F88379] font-bold">{config.label}</span>
      </nav>

      {/* Header */}
      <div className="relative z-10 mb-10 pb-8 border-b border-[#1E3A66]/50">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F88379]/15 border border-[#F88379]/40 text-[#F88379] text-[10px] uppercase tracking-wider font-sans font-bold shadow-sm mb-2">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F88379] animate-pulse" />
          <span>The Heavyweight Catalog</span>
        </div>
        <h1 className="font-sans text-3xl sm:text-5xl font-extrabold text-white tracking-tight mt-1 mb-3">
          {config.label}
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] font-normal max-w-2xl leading-relaxed">
          {config.desc}
        </p>

        {/* Clean Dropdown Selection: Department & Gender-Specific Category */}
        <div className="mt-8 pt-6 border-t border-[#1E3A66]/40 flex flex-col sm:flex-row items-stretch sm:items-center gap-4 sm:gap-6">
          {/* 1. Department Dropdown */}
          <div className="flex-1 sm:flex-initial">
            <label className="block text-[10px] uppercase tracking-widest text-[#94A3B8] font-bold mb-2">
              Select Wear
            </label>
            <div className="relative">
              <select
                value={selectedDept}
                onChange={(e) => handleDepartmentChange(e.target.value as 'men' | 'women')}
                className="w-full sm:w-56 bg-[#0B1A30] text-white border-2 border-[#1E3A66] hover:border-[#F88379] focus:border-[#F88379] px-4 py-3 text-xs uppercase tracking-wider font-bold appearance-none rounded-none cursor-pointer transition-all shadow-lg focus:outline-none focus:ring-1 focus:ring-[#F88379]"
              >
                <option value="men">Men's Wear</option>
                <option value="women">Women's Wear</option>
              </select>
              <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F88379]" />
            </div>
          </div>

          {/* 2. Men's Section Dropdown - ONLY rendered when Men's Wear is selected */}
          {selectedDept === 'men' && (
            <div className="flex-1 sm:flex-initial animate-fadeIn">
              <label className="block text-[10px] uppercase tracking-widest text-[#F88379] font-bold mb-2">
                Men's Section
              </label>
              <div className="relative">
                <select
                  value={currentMenValue}
                  onChange={(e) => navigate(`/collections/${e.target.value}`)}
                  className="w-full sm:w-72 bg-[#0B1A30] text-white border-2 border-[#F88379] px-4 py-3 text-xs uppercase tracking-wider font-bold appearance-none rounded-none cursor-pointer transition-all shadow-[0_4px_20px_rgba(248,131,121,0.25)] focus:outline-none focus:ring-1 focus:ring-[#F88379]"
                >
                  <option value="men">All Men's Wear</option>
                  <option value="men-sweatshirts">Sweatshirts & Hoodies</option>
                  <option value="men-oversized-tees">Oversized T-Shirts</option>
                  <option value="men-classic-tees">Classic Tees</option>
                  <option value="traditional-men">Men's Traditional Wear</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F88379]" />
              </div>
            </div>
          )}

          {/* 3. Women's Section Dropdown - ONLY rendered when Women's Wear is selected */}
          {selectedDept === 'women' && (
            <div className="flex-1 sm:flex-initial animate-fadeIn">
              <label className="block text-[10px] uppercase tracking-widest text-[#F88379] font-bold mb-2">
                Women's Section
              </label>
              <div className="relative">
                <select
                  value={currentWomenValue}
                  onChange={(e) => navigate(`/collections/${e.target.value}`)}
                  className="w-full sm:w-72 bg-[#0B1A30] text-white border-2 border-[#F88379] px-4 py-3 text-xs uppercase tracking-wider font-bold appearance-none rounded-none cursor-pointer transition-all shadow-[0_4px_20px_rgba(248,131,121,0.25)] focus:outline-none focus:ring-1 focus:ring-[#F88379]"
                >
                  <option value="women">All Women's Wear</option>
                  <option value="women-sweatshirts">Sweatshirts & Hoodies</option>
                  <option value="women-oversized-tees">Oversized T-Shirts</option>
                  <option value="women-classic-tees">Classic Tees</option>
                  <option value="traditional-women">Women's Traditional Wear</option>
                </select>
                <ChevronDown className="pointer-events-none absolute right-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#F88379]" />
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Filter and Count Bar */}
      <div className="relative z-10 flex flex-wrap items-center justify-between gap-4 pb-6 mb-10 border-b border-[#1E3A66]/50 text-xs">
        <span className="text-[12px] font-sans text-[#94A3B8] font-medium">
          Showing <strong className="text-white font-bold">{filteredProducts.length}</strong> {filteredProducts.length === 1 ? 'piece' : 'pieces'}
        </span>

        <div className="flex items-center gap-2 text-[#94A3B8]">
          <SlidersHorizontal className="w-3.5 h-3.5 text-[#F88379]" />
          <span className="text-[11px] uppercase font-sans font-bold text-white">Sort:</span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#0B1A30] border border-[#1E3A66] text-xs uppercase tracking-wider text-white px-3 py-1.5 focus:outline-none focus:border-[#F88379] focus:ring-1 focus:ring-[#F88379] font-sans font-semibold cursor-pointer"
          >
            <option value="featured">Featured Drops</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Products Grid */}
      {isLoadingProducts ? (
        <div className="py-28 text-center flex flex-col items-center justify-center space-y-4">
          <Loader2 className="w-8 h-8 text-[#F88379] animate-spin" />
          <p className="text-xs uppercase tracking-wider text-[#94A3B8] font-sans font-bold">
            Loading Trenzio Catalog...
          </p>
        </div>
      ) : filteredProducts.length === 0 ? (
        <div className="py-20 text-center border border-[#1E3A66]/60 p-8 sm:p-14 bg-[#0B1A30] text-white space-y-5 shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-[#F88379]/15 border border-[#F88379]/30 flex items-center justify-center text-[#F88379]">
            <Sparkles className="w-6 h-6" />
          </div>
          <h3 className="font-sans text-2xl sm:text-3xl text-white font-bold">
            Next Drop Coming Soon
          </h3>
          <p className="text-xs sm:text-sm text-[#94A3B8] max-w-md mx-auto font-normal leading-relaxed">
            All previous drop pieces for <strong className="text-[#F88379]">{config.label}</strong> are sold out. We are preparing our next exclusive heavyweight launch.
          </p>
          <div className="pt-2">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-6 py-3.5 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs uppercase tracking-wider font-bold shadow-[0_4px_16px_rgba(248,131,121,0.45)] transition-all cursor-pointer font-sans"
            >
              <span>Explore All Available Drops</span>
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-x-6 gap-y-14">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};
