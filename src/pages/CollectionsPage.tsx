import React, { useState, useMemo, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { ProductCard } from '../components/ProductCard';
import {
  SlidersHorizontal,
  Loader2,
  ChevronRight,
  X,
  ExternalLink,
} from 'lucide-react';
import { Women3DBanner } from '../components/Women3DBanner';
import { TrevoriMenWinterBanner } from '../components/TrevoriMenWinterBanner';
import {
  CatalogFilters,
  FilterState,
  INITIAL_FILTER_STATE,
  PRICE_OPTIONS,
  DISCOUNT_OPTIONS,
  SIZE_OPTIONS,
  COLOR_OPTIONS,
  CATEGORY_OPTIONS,
  BRAND_OPTIONS,
  PATTERN_OPTIONS,
} from '../components/CatalogFilters';

const CATEGORY_MAP: Record<
  string,
  {
    label: string;
    catFilter?: string;
    genderFilter?: string;
    desc: string;
    dept: 'men' | 'women' | 'all';
  }
> = {
  // Men's Section
  men: {
    label: "Men's Contemporary Wear",
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Contemporary box cuts, bio-washed combed cotton tees, dropped-shoulder hoodies, and tailored utilitarian trousers.',
  },
  'men-sweatshirts': {
    label: "Men's Sweatshirts & Hoodies",
    catFilter: 'Hoodies',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Luxury brushed loopback French Terry hoodies engineered with double-layered hood structure and reinforced cuffs.',
  },
  'men-oversized-tees': {
    label: "Men's Oversized T-Shirts",
    catFilter: 'Oversized Tees',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Bio-washed combed cotton jersey with architectural dropped shoulders and reinforced 1.25" ribbed collars.',
  },
  'men-classic-tees': {
    label: "Men's Classic & Tailored Shirts",
    catFilter: 'T-Shirts',
    genderFilter: 'Men',
    dept: 'men',
    desc: 'Everyday refined luxury cuts in long-staple Supima cotton for effortless minimalist layering.',
  },

  // Women's Section
  women: {
    label: "Women's Collection",
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Relaxed fluid drapes, wide-leg knife-pleated trousers, and structured oversized cotton foundations.',
  },
  'women-sweatshirts': {
    label: "Women's Sweatshirts & Hoodies",
    catFilter: 'Sweatshirts',
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Soft French Terry cotton crewnecks and boxy cropped fleece layers.',
  },
  'women-oversized-tees': {
    label: "Women's Oversized T-Shirts",
    catFilter: 'Oversized Tees',
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Generously proportioned dropped-shoulder cuts in breathable ring-spun organic cotton.',
  },
  'women-classic-tees': {
    label: "Women's Classic Basics",
    catFilter: 'T-Shirts',
    genderFilter: 'Women',
    dept: 'women',
    desc: 'Clean essential cotton tanks and structured tailored basics.',
  },

  // Accessories Section
  accessories: {
    label: 'Atelier Accessories & Lifestyle',
    catFilter: 'Accessories',
    dept: 'all',
    desc: 'Everyday design objects: impact-resistant phone covers, artisanal stoneware ceramic cups, double-wall thermal bottles, and minimalist leather essentials.',
  },
  'accessories-phone-covers': {
    label: 'Phone Covers & Cases',
    catFilter: 'Accessories',
    dept: 'all',
    desc: 'Matte architectural phone cases engineered with drop-tested shock absorption and Trevori signature branding.',
  },
  'accessories-cups': {
    label: 'Ceramic Cups & Coffee Mugs',
    catFilter: 'Accessories',
    dept: 'all',
    desc: 'Handcrafted matte stoneware ceramic mugs and artisanal espresso cups with debossed Trevori crest.',
  },
  'accessories-bottles': {
    label: 'Thermal Bottles & Flasks',
    catFilter: 'Accessories',
    dept: 'all',
    desc: 'Double-wall vacuum-insulated stainless steel thermal bottles keeping drinks chilled for 24h or hot for 12h.',
  },
  'accessories-wallets': {
    label: 'Wallets & Cardholders',
    catFilter: 'Accessories',
    dept: 'all',
    desc: 'Full-grain architectural leather cardholders and bi-fold wallets with RFID shielding.',
  },
  'accessories-bags': {
    label: 'Tote Bags & Backpacks',
    catFilter: 'Accessories',
    dept: 'all',
    desc: 'Heavyweight 16oz organic canvas daily carryalls and utilitarian daypacks.',
  },
  'accessories-caps': {
    label: 'Caps & Beanies',
    catFilter: 'Accessories',
    dept: 'all',
    desc: 'Heavyweight cotton twill dad caps and ribbed merino wool beanies with micro-embroidered insignia.',
  },

  // Generic / Default
  all: {
    label: 'Complete Atelier Collection',
    dept: 'all',
    desc: 'Explore the full contemporary streetwear catalog engineered with 100% bio-washed combed cotton.',
  },
};

const MEN_COLLECTIONS = [
  { slug: 'men', label: "All Men's Wear" },
  { slug: 'men-oversized-tees', label: 'Oversized Tees' },
  { slug: 'men-sweatshirts', label: 'Hoodies & Fleece' },
  { slug: 'men-classic-tees', label: 'Classic Shirts' },
];

const WOMEN_COLLECTIONS = [
  { slug: 'women', label: "All Women's Wear" },
  { slug: 'women-oversized-tees', label: 'Oversized Tees' },
  { slug: 'women-sweatshirts', label: 'Sweatshirts' },
  { slug: 'women-classic-tees', label: 'Classic Basics' },
];

const ACCESSORIES_COLLECTIONS = [
  { slug: 'accessories', label: 'All Accessories' },
  { slug: 'accessories-phone-covers', label: 'Phone Covers' },
  { slug: 'accessories-cups', label: 'Cups & Mugs' },
  { slug: 'accessories-bottles', label: 'Bottles & Flasks' },
  { slug: 'accessories-wallets', label: 'Wallets' },
  { slug: 'accessories-bags', label: 'Tote Bags' },
  { slug: 'accessories-caps', label: 'Caps & Beanies' },
];

export const CollectionsPage: React.FC = () => {
  const { category: rawCategory = 'all' } = useParams<{ category?: string }>();
  const currentCategory = rawCategory.toLowerCase();
  const config = CATEGORY_MAP[currentCategory] || CATEGORY_MAP['all'];

  const isInitialWomen =
    currentCategory.startsWith('women') || currentCategory === 'traditional-women';
  const isAccessories = currentCategory.startsWith('accessories');

  const [selectedDept, setSelectedDept] = useState<'men' | 'women' | 'accessories' | 'all'>(
    isAccessories ? 'accessories' : isInitialWomen ? 'women' : 'men'
  );

  const [bannerModalOpen, setBannerModalOpen] = useState(false);
  const [isMobileFilterOpen, setIsMobileFilterOpen] = useState(false);
  const [filters, setFilters] = useState<FilterState>(INITIAL_FILTER_STATE);

  useEffect(() => {
    if (currentCategory.startsWith('accessories')) {
      setSelectedDept('accessories');
    } else if (
      currentCategory.startsWith('women') ||
      currentCategory === 'traditional-women'
    ) {
      setSelectedDept('women');
    } else if (currentCategory === 'all') {
      setSelectedDept('all');
    } else {
      setSelectedDept('men');
    }
  }, [currentCategory]);

  const { products, isLoadingProducts } = useShop();
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc'>('featured');

  // Compute base products scoped to current route department if applicable
  const baseDepartmentProducts = useMemo(() => {
    return products.filter((p) => {
      if (config.genderFilter && p.gender !== config.genderFilter && p.gender !== 'Unisex') {
        return false;
      }
      return true;
    });
  }, [products, config]);

  // Compute dynamic counts for all filter options
  const filterCounts = useMemo(() => {
    const listToCount = baseDepartmentProducts.length > 0 ? baseDepartmentProducts : products;

    const genderCounts: Record<string, number> = { Men: 0, Women: 0, Unisex: 0 };
    const catCounts: Record<string, number> = {};
    const sizeCounts: Record<string, number> = {};
    const brandCounts: Record<string, number> = {};
    const colorCounts: Record<string, number> = {};
    const patternCounts: Record<string, number> = {};

    CATEGORY_OPTIONS.forEach((c) => (catCounts[c] = 0));
    SIZE_OPTIONS.forEach((s) => (sizeCounts[s] = 0));
    BRAND_OPTIONS.forEach((b) => (brandCounts[b] = 0));
    COLOR_OPTIONS.forEach((c) => (colorCounts[c.name] = 0));
    PATTERN_OPTIONS.forEach((p) => (patternCounts[p] = 0));

    listToCount.forEach((p) => {
      // Gender count
      if (p.gender === 'Men') genderCounts.Men = (genderCounts.Men || 0) + 1;
      else if (p.gender === 'Women') genderCounts.Women = (genderCounts.Women || 0) + 1;
      else if (p.gender === 'Unisex') {
        genderCounts.Unisex = (genderCounts.Unisex || 0) + 1;
        genderCounts.Men = (genderCounts.Men || 0) + 1;
        genderCounts.Women = (genderCounts.Women || 0) + 1;
      }

      // Category count
      const pCat = p.category || '';
      const pNameLower = p.name.toLowerCase();
      CATEGORY_OPTIONS.forEach((cat) => {
        if (cat === 'Hoodies' && (pCat === 'Hoodies' || pCat === 'Sweatshirts' || pNameLower.includes('hoodie'))) {
          catCounts[cat]++;
        } else if (cat === 'Oversized Tees' && (pCat === 'Oversized Tees' || pNameLower.includes('oversized') || pNameLower.includes('t-shirt') || pNameLower.includes('tee'))) {
          catCounts[cat]++;
        } else if (cat === 'T-Shirts' && (pCat === 'T-Shirts' || pNameLower.includes('tee') || pNameLower.includes('t-shirt') || pNameLower.includes('shirt'))) {
          catCounts[cat]++;
        } else if (cat === 'Sweatshirts' && (pCat === 'Sweatshirts' || pCat === 'Hoodies' || pNameLower.includes('sweatshirt'))) {
          catCounts[cat]++;
        } else if (cat === 'Pants & Cargos' && (pCat === 'Pants' || pNameLower.includes('pant') || pNameLower.includes('cargo') || pNameLower.includes('trouser'))) {
          catCounts[cat]++;
        } else if (cat === 'Jackets & Outerwear' && (pCat === 'Jackets' || pNameLower.includes('jacket') || pNameLower.includes('coat') || pNameLower.includes('outerwear'))) {
          catCounts[cat]++;
        } else if (cat === 'Sweaters & Knits' && ((pCat as string) === 'Sweaters' || pNameLower.includes('sweater') || pNameLower.includes('knit'))) {
          catCounts[cat]++;
        } else if (cat === 'Accessories' && (pCat === 'Accessories' || pNameLower.includes('cover') || pNameLower.includes('mug') || pNameLower.includes('bottle') || pNameLower.includes('wallet') || pNameLower.includes('cap'))) {
          catCounts[cat]++;
        }
      });

      // Sizes count
      (p.sizes || ['S', 'M', 'L', 'XL']).forEach((sz) => {
        if (sizeCounts[sz] !== undefined) {
          sizeCounts[sz]++;
        }
      });

      // Brand count
      brandCounts['TREVORI'] = (brandCounts['TREVORI'] || 0) + 1;
      brandCounts['TREVORI Atelier'] = (brandCounts['TREVORI Atelier'] || 0) + 1;
      if (p.colors?.some((c) => c.name.toLowerCase().includes('black')) || pNameLower.includes('noir')) {
        brandCounts['TREVORI Noir'] = (brandCounts['TREVORI Noir'] || 0) + 1;
      }

      // Color count
      COLOR_OPTIONS.forEach((cOpt) => {
        const matches = (p.colors || []).some((pc) => {
          const words = cOpt.name.toLowerCase().split(' ');
          const pcName = pc.name.toLowerCase();
          return words.some((w) => w.length > 2 && pcName.includes(w));
        });
        if (matches) colorCounts[cOpt.name]++;
      });

      // Pattern count
      const text = `${p.name} ${p.fitDescription || ''} ${p.fabric || ''}`.toLowerCase();
      if (!text.includes('graphic') && !text.includes('print')) patternCounts['Solid / Plain']++;
      if (text.includes('graphic') || text.includes('print')) patternCounts['Graphic / Chest Print']++;
      if (text.includes('embroidered') || text.includes('insignia')) patternCounts['Embroidered Insignia']++;
      if (text.includes('ribbed') || text.includes('textured') || text.includes('terry') || text.includes('knit')) {
        patternCounts['Textured / Ribbed']++;
      }
      if (text.includes('minimalist') || text.includes('typography') || text.includes('clean')) {
        patternCounts['Minimalist Typography']++;
      }
    });

    return {
      genders: genderCounts,
      categories: catCounts,
      sizes: sizeCounts,
      brands: brandCounts,
      colors: colorCounts,
      patterns: patternCounts,
    };
  }, [baseDepartmentProducts, products]);

  // Main Filter Logic applied across all sections
  const filteredProducts = useMemo(() => {
    const list = products.filter((p) => {
      // Route level category filter (if user hasn't explicitly selected custom category checkboxes)
      if (filters.categories.length === 0 && config.catFilter) {
        if (p.category !== config.catFilter) {
          // If accessories page and no items tagged Accessories yet, keep visible
          if (!isAccessories) return false;
        }
      }

      // Route level gender filter (if user hasn't explicitly selected custom gender checkboxes)
      if (filters.genders.length === 0 && config.genderFilter) {
        if (p.gender !== config.genderFilter && p.gender !== 'Unisex') {
          return false;
        }
      }

      // 1. Gender filter
      if (filters.genders.length > 0) {
        const matchesGender = filters.genders.some((g) => {
          if (p.gender === 'Unisex') return true;
          return p.gender === g;
        });
        if (!matchesGender) return false;
      }

      // 2. Category filter
      if (filters.categories.length > 0) {
        const pCat = p.category || '';
        const pNameLower = p.name.toLowerCase();
        const matchesCat = filters.categories.some((cat) => {
          if (cat === 'Hoodies' && (pCat === 'Hoodies' || pCat === 'Sweatshirts' || pNameLower.includes('hoodie'))) return true;
          if (cat === 'Oversized Tees' && (pCat === 'Oversized Tees' || pNameLower.includes('oversized') || pNameLower.includes('t-shirt') || pNameLower.includes('tee'))) return true;
          if (cat === 'T-Shirts' && (pCat === 'T-Shirts' || pNameLower.includes('tee') || pNameLower.includes('t-shirt') || pNameLower.includes('shirt'))) return true;
          if (cat === 'Sweatshirts' && (pCat === 'Sweatshirts' || pCat === 'Hoodies' || pNameLower.includes('sweatshirt'))) return true;
          if (cat === 'Pants & Cargos' && (pCat === 'Pants' || pNameLower.includes('pant') || pNameLower.includes('cargo') || pNameLower.includes('trouser'))) return true;
          if (cat === 'Jackets & Outerwear' && (pCat === 'Jackets' || pNameLower.includes('jacket') || pNameLower.includes('coat') || pNameLower.includes('outerwear'))) return true;
          if (cat === 'Sweaters & Knits' && ((pCat as string) === 'Sweaters' || pNameLower.includes('sweater') || pNameLower.includes('knit'))) return true;
          if (cat === 'Accessories' && (pCat === 'Accessories' || pNameLower.includes('cover') || pNameLower.includes('cup') || pNameLower.includes('mug') || pNameLower.includes('bottle') || pNameLower.includes('wallet') || pNameLower.includes('cap'))) return true;
          return pCat === cat;
        });
        if (!matchesCat) return false;
      }

      // 3. Sizes filter
      if (filters.sizes.length > 0) {
        const prodSizes = p.sizes || ['S', 'M', 'L', 'XL'];
        const hasSize = filters.sizes.some((sz) => prodSizes.includes(sz));
        if (!hasSize) return false;
      }

      // 4. Brands filter
      if (filters.brands.length > 0) {
        const matchesBrand = filters.brands.some((br) => {
          if (br === 'TREVORI') return true;
          if (br === 'TREVORI Atelier') return true;
          if (br === 'TREVORI Noir') {
            return (
              p.name.toLowerCase().includes('noir') ||
              p.colors?.some((c) => c.name.toLowerCase().includes('black'))
            );
          }
          return false;
        });
        if (!matchesBrand) return false;
      }

      // 5. Colors filter
      if (filters.colors.length > 0) {
        const prodColors = p.colors || [];
        const hasColor = filters.colors.some((fc) => {
          const words = fc.toLowerCase().split(' ');
          return prodColors.some((pc) => {
            const pcName = pc.name.toLowerCase();
            return words.some((w) => w.length > 2 && pcName.includes(w));
          });
        });
        if (!hasColor) return false;
      }

      // 6. Patterns filter
      if (filters.patterns.length > 0) {
        const text = `${p.name} ${p.fitDescription || ''} ${p.fabric || ''}`.toLowerCase();
        const hasPattern = filters.patterns.some((pat) => {
          if (pat.includes('Solid')) return !text.includes('graphic') && !text.includes('print');
          if (pat.includes('Graphic')) return text.includes('graphic') || text.includes('print');
          if (pat.includes('Embroidered')) return text.includes('embroidered') || text.includes('insignia');
          if (pat.includes('Textured')) return text.includes('ribbed') || text.includes('terry') || text.includes('knit');
          if (pat.includes('Typography')) return text.includes('minimalist') || text.includes('typography');
          return true;
        });
        if (!hasPattern) return false;
      }

      // 7. Price Ranges filter
      if (filters.priceRanges.length > 0) {
        const matchesPrice = filters.priceRanges.some((range) => {
          if (range === 'under-1500') return p.priceINR < 1500;
          if (range === '1500-2500') return p.priceINR >= 1500 && p.priceINR <= 2500;
          if (range === 'above-2500') return p.priceINR > 2500;
          return true;
        });
        if (!matchesPrice) return false;
      }

      // 8. Discounts filter
      if (filters.discounts.length > 0) {
        const matchesDisc = filters.discounts.some((disc) => {
          if (disc === 'vip-15') return true;
          if (disc === 'flat-200') return p.priceINR >= 1000;
          if (disc === 'flat-500') return p.priceINR >= 2000;
          return true;
        });
        if (!matchesDisc) return false;
      }

      return true;
    });

    const finalList = list.length > 0 ? list : isAccessories && filters.categories.length === 0 ? products : list;

    return [...finalList].sort((a, b) => {
      if (sortBy === 'price-asc') return a.priceINR - b.priceINR;
      if (sortBy === 'price-desc') return b.priceINR - a.priceINR;
      return 0;
    });
  }, [products, config, sortBy, isAccessories, filters]);

  // Active filter pills
  const activePills = useMemo(() => {
    const pills: { key: keyof FilterState; value: string; label: string }[] = [];
    filters.genders.forEach((v) => pills.push({ key: 'genders', value: v, label: v }));
    filters.categories.forEach((v) => pills.push({ key: 'categories', value: v, label: v }));
    filters.sizes.forEach((v) => pills.push({ key: 'sizes', value: v, label: `Size: ${v}` }));
    filters.brands.forEach((v) => pills.push({ key: 'brands', value: v, label: v }));
    filters.colors.forEach((v) => pills.push({ key: 'colors', value: v, label: v }));
    filters.patterns.forEach((v) => pills.push({ key: 'patterns', value: v, label: v }));
    filters.priceRanges.forEach((v) => {
      const opt = PRICE_OPTIONS.find((p) => p.id === v);
      pills.push({ key: 'priceRanges', value: v, label: opt ? opt.label : v });
    });
    filters.discounts.forEach((v) => {
      const opt = DISCOUNT_OPTIONS.find((d) => d.id === v);
      pills.push({ key: 'discounts', value: v, label: opt ? opt.label : v });
    });
    return pills;
  }, [filters]);

  const removeFilterPill = (key: keyof FilterState, value: string) => {
    setFilters((prev) => ({
      ...prev,
      [key]: (prev[key] as string[]).filter((item) => item !== value),
    }));
  };

  const clearAllFilters = () => setFilters(INITIAL_FILTER_STATE);

  // CONSTRAINT: Promotional banner in Men's section ONLY
  const isMenSection =
    (selectedDept === 'men' || currentCategory.startsWith('men')) &&
    !isInitialWomen &&
    !isAccessories;

  return (
    <div className="min-h-screen py-8 sm:py-12 max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 bg-[#F4F1EA] text-[#171717] font-sans">
      {/* Editorial Breadcrumbs */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <nav className="flex items-center space-x-2 text-xs uppercase tracking-wider text-[#706B64] font-medium">
          <Link to="/" className="hover:text-[#171717] transition-colors">
            Home
          </Link>
          <ChevronRight className="w-3.5 h-3.5 text-[#B9AA96]" />
          <Link
            to={
              selectedDept === 'accessories'
                ? '/collections/accessories'
                : selectedDept === 'women'
                ? '/collections/women'
                : '/collections/men'
            }
            className="hover:text-[#171717] transition-colors text-[#171717]"
          >
            {selectedDept === 'accessories'
              ? 'Accessories Edit'
              : selectedDept === 'women'
              ? "Women's Edit"
              : "Men's Edit"}
          </Link>
          {currentCategory !== 'men' &&
            currentCategory !== 'women' &&
            currentCategory !== 'accessories' &&
            currentCategory !== 'all' && (
              <>
                <ChevronRight className="w-3.5 h-3.5 text-[#B9AA96]" />
                <span className="text-[#171717] font-semibold">{config.label}</span>
              </>
            )}
        </nav>

        {/* Department Switcher */}
        <div className="flex items-center gap-2">
          <Link
            to={selectedDept === 'accessories' ? '/collections/men' : '/collections/accessories'}
            className="text-xs uppercase tracking-[0.2em] px-4 py-2 border border-[#DDD8CE] bg-[#FFFFFF] text-[#706B64] hover:text-[#171717] hover:border-[#171717] transition-colors font-medium shadow-sm"
          >
            {selectedDept === 'accessories' ? '← View Apparel' : 'Explore Accessories →'}
          </Link>
        </div>
      </div>

      {/* Interactive Women's 3D Parallax Banner (Women's section only) */}
      {(selectedDept === 'women' || currentCategory.startsWith('women')) && (
        <Women3DBanner onOpenModal={() => setBannerModalOpen(true)} />
      )}

      {/* Editorial Category Header */}
      <div className="mb-6 pb-6 border-b border-[#DDD8CE]">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B9AA96] font-semibold block mb-2">
          {selectedDept === 'accessories'
            ? 'Atelier Objects & Accessories // Volume IV'
            : selectedDept === 'women'
            ? "Women's Collection // Volume IV"
            : "Men's Collection // Volume IV"}
        </span>
        <h1 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal text-[#171717] tracking-tight mb-2">
          {config.label}
        </h1>
        <p className="text-xs sm:text-sm text-[#706B64] max-w-2xl font-light leading-relaxed">
          {config.desc}
        </p>
      </div>

      {/* Subcategory Pills */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {(selectedDept === 'accessories'
          ? ACCESSORIES_COLLECTIONS
          : selectedDept === 'women'
          ? WOMEN_COLLECTIONS
          : MEN_COLLECTIONS
        ).map((item) => {
          const isActive = currentCategory === item.slug;
          return (
            <Link
              key={item.slug}
              to={`/collections/${item.slug}`}
              className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-colors border ${
                isActive
                  ? 'border-[#171717] bg-[#171717] text-white font-medium'
                  : 'border-[#DDD8CE] bg-[#FFFFFF] text-[#706B64] hover:border-[#171717] hover:text-[#171717]'
              }`}
            >
              {item.label}
            </Link>
          );
        })}
      </div>

      {/* Top Controls Bar: Mobile Filter Button, Count, and Sort Dropdown */}
      <div className="flex flex-wrap items-center justify-between gap-4 pb-4 mb-6 border-b border-[#DDD8CE] text-xs">
        <div className="flex items-center gap-4">
          {/* Mobile Filter Toggle */}
          <button
            onClick={() => setIsMobileFilterOpen(true)}
            className="lg:hidden flex items-center gap-2 px-3 py-1.5 bg-[#FFFFFF] border border-[#DDD8CE] text-xs font-semibold uppercase tracking-wider text-[#171717] shadow-sm hover:border-[#171717] transition-colors cursor-pointer"
          >
            <SlidersHorizontal className="w-3.5 h-3.5" />
            <span>Filters {activePills.length > 0 && `(${activePills.length})`}</span>
          </button>

          <div className="text-[#706B64]">
            Showing <strong className="text-[#171717]">{filteredProducts.length}</strong> styles
          </div>
        </div>

        {/* Sort by Dropdown (matching Bewakoof style) */}
        <div className="flex items-center gap-2">
          <span className="text-[#706B64] uppercase tracking-wider text-[11px] font-medium hidden sm:inline">
            Sort by:
          </span>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="bg-[#FFFFFF] border border-[#DDD8CE] px-3 py-1.5 text-xs text-[#171717] focus:outline-none focus:border-[#171717] uppercase tracking-wider cursor-pointer font-medium"
          >
            <option value="featured">Popularity</option>
            <option value="price-asc">Price: Low to High</option>
            <option value="price-desc">Price: High to Low</option>
          </select>
        </div>
      </div>

      {/* Horizontal Active Filter Pills (matching Bewakoof style) */}
      {activePills.length > 0 && (
        <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-[#FFFFFF] border border-[#DDD8CE]">
          <span className="text-[11px] uppercase tracking-wider font-semibold text-[#706B64] mr-1">
            Active Filters:
          </span>
          {activePills.map((pill) => (
            <button
              key={`${pill.key}-${pill.value}`}
              onClick={() => removeFilterPill(pill.key, pill.value)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[#F4F1EA] hover:bg-[#EAE5DB] border border-[#DDD8CE] text-xs text-[#171717] font-medium uppercase tracking-wider transition-colors cursor-pointer"
            >
              <span>{pill.label}</span>
              <X className="w-3 h-3 text-[#706B64] hover:text-[#171717]" />
            </button>
          ))}
          <button
            onClick={clearAllFilters}
            className="text-xs uppercase tracking-wider font-semibold text-[#C8411F] hover:text-[#9E2A0E] ml-auto transition-colors cursor-pointer underline"
          >
            Clear All
          </button>
        </div>
      )}

      {/* Main Two-Column Layout: Left Filters Sidebar + Right Product Grid & Banner */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Left Filters Sidebar (Desktop) */}
        <div className="hidden lg:block w-64 xl:w-72 shrink-0 sticky top-24">
          <CatalogFilters
            filters={filters}
            onChange={setFilters}
            onClearAll={clearAllFilters}
            counts={filterCounts}
            totalProductsCount={products.length}
          />
        </div>

        {/* Right Main Content */}
        <div className="flex-1 w-full min-w-0">
          {/* Promotional Banner: IN MEN'S SECTION ONLY */}
          {isMenSection && <TrevoriMenWinterBanner />}

          {/* Product Grid */}
          {isLoadingProducts ? (
            <div className="py-24 text-center flex flex-col items-center justify-center space-y-4">
              <Loader2 className="w-6 h-6 text-[#171717] animate-spin" />
              <p className="text-xs uppercase tracking-widest text-[#706B64]">
                Loading Atelier Collection...
              </p>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="bg-[#FFFFFF] border border-[#DDD8CE] p-12 text-center">
              <p className="font-serif text-2xl text-[#171717] mb-2">No matching styles found.</p>
              <p className="text-xs text-[#706B64] mb-6">
                Try selecting different sizes, colors, or resetting your filter options.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-[#171717] hover:bg-black text-white text-xs uppercase tracking-widest font-medium transition-colors cursor-pointer"
              >
                Clear All Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 sm:gap-6">
              {filteredProducts.map((p) => (
                <ProductCard key={p.id} product={p} />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Mobile Filters Slide-Over Drawer */}
      {isMobileFilterOpen && (
        <div className="fixed inset-0 z-50 flex lg:hidden">
          {/* Backdrop */}
          <div
            className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
            onClick={() => setIsMobileFilterOpen(false)}
          />

          {/* Drawer content */}
          <div className="relative w-full max-w-xs bg-[#FFFFFF] h-full shadow-2xl flex flex-col z-10 animate-slide-right">
            <div className="flex items-center justify-between p-4 border-b border-[#DDD8CE]">
              <h3 className="font-semibold text-sm uppercase tracking-wider text-[#171717]">
                Filters ({activePills.length})
              </h3>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="p-1 text-[#706B64] hover:text-[#171717] transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4">
              <CatalogFilters
                filters={filters}
                onChange={setFilters}
                onClearAll={clearAllFilters}
                counts={filterCounts}
                totalProductsCount={products.length}
              />
            </div>

            <div className="p-4 border-t border-[#DDD8CE] bg-[#F4F1EA] flex gap-3">
              <button
                onClick={clearAllFilters}
                className="w-1/3 py-2.5 border border-[#DDD8CE] bg-white text-xs uppercase tracking-wider font-semibold text-[#706B64] hover:text-[#171717]"
              >
                Clear
              </button>
              <button
                onClick={() => setIsMobileFilterOpen(false)}
                className="flex-1 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-widest font-semibold hover:bg-black"
              >
                Apply ({filteredProducts.length})
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 4K Master Banner Inspection Modal (Women's section) */}
      {bannerModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/80 backdrop-blur-md animate-fade-in-subtle">
          <div className="bg-[#FFFFFF] border border-[#DDD8CE] max-w-5xl w-full p-6 sm:p-8 relative max-h-[92vh] overflow-y-auto shadow-2xl">
            <button
              onClick={() => setBannerModalOpen(false)}
              className="absolute top-4 right-4 z-10 text-[#706B64] hover:text-[#171717] text-xs uppercase tracking-widest font-semibold p-2 cursor-pointer transition-colors"
            >
              Close ✕
            </button>

            <div className="space-y-6">
              {/* Image Frame */}
              <div className="relative aspect-[16/9] w-full overflow-hidden bg-[#171717] border border-[#DDD8CE]">
                <img
                  src="/images/banners/trevori_women_editorial_banner_4k.jpg"
                  alt="TREVORI Women's Streetwear Drop Atelier Master"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-4 left-4 bg-[#171717]/90 text-white text-[9px] uppercase px-3 py-1.5 tracking-widest font-semibold backdrop-blur-sm border border-white/20">
                  Editorial Master View
                </div>
                <div className="absolute bottom-4 right-4 bg-white/95 text-[#171717] text-[9px] uppercase px-2.5 py-1 tracking-wider font-semibold backdrop-blur-sm border border-[#DDD8CE]">
                  3440 × 1920 UHD
                </div>
              </div>

              {/* Editorial Details */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-2">
                <div>
                  <span className="text-[10px] uppercase tracking-[0.25em] text-[#B9AA96] font-semibold block mb-1">
                    NEWEST DROPS // VOLUME IV
                  </span>
                  <h3 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal mb-2">
                    The Femme Lineup
                  </h3>
                  <p className="text-xs text-[#706B64] font-light leading-relaxed">
                    Captured on 85mm medium format in brutalist chiaroscuro sunlight. Features our signature dropped-shoulder oversized tees in heavyweight combed bio-washed cotton, paired with fluid pleated drape cargo trousers.
                  </p>
                </div>

                <div className="flex flex-col justify-between space-y-4">
                  <div className="p-4 bg-[#F4F1EA] border border-[#DDD8CE] text-xs space-y-2">
                    <div className="font-semibold text-[#171717] uppercase tracking-wider text-[11px]">
                      Featured Designs in this Editorial:
                    </div>
                    <div className="flex justify-between text-[#706B64]">
                      <span>Heavyweight Chalk-White Oversized Tee</span>
                      <strong className="text-[#171717]">₹1,299</strong>
                    </div>
                    <div className="flex justify-between text-[#706B64]">
                      <span>Charcoal Boxy Atelier Graphic Tee</span>
                      <strong className="text-[#171717]">₹1,499</strong>
                    </div>
                    <div className="flex justify-between text-[#706B64]">
                      <span>Tailored Pleated Drape Cargo Pants</span>
                      <strong className="text-[#171717]">₹1,799</strong>
                    </div>
                  </div>

                  <div className="flex items-center gap-3">
                    <Link
                      to="/collections/women"
                      onClick={() => setBannerModalOpen(false)}
                      className="flex-1 py-3 text-center bg-[#171717] text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors"
                    >
                      Shop Women's Collection
                    </Link>
                    <a
                      href="/images/banners/trevori_women_editorial_banner_4k.jpg"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-4 py-3 border border-[#DDD8CE] text-[#171717] text-[10px] uppercase tracking-widest font-medium hover:bg-[#F4F1EA] transition-colors flex items-center gap-1.5"
                    >
                      <span>Full Resolution</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
