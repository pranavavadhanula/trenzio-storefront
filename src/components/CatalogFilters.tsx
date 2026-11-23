import React, { useState } from 'react';
import { ChevronDown, ChevronUp, X, Check } from 'lucide-react';

export interface FilterState {
  genders: string[];
  categories: string[];
  sizes: string[];
  brands: string[];
  colors: string[];
  patterns: string[];
  priceRanges: string[];
  discounts: string[];
}

export const INITIAL_FILTER_STATE: FilterState = {
  genders: [],
  categories: [],
  sizes: [],
  brands: [],
  colors: [],
  patterns: [],
  priceRanges: [],
  discounts: [],
};

export const COLOR_OPTIONS: { name: string; hex: string; border?: boolean }[] = [
  { name: 'Obsidian Black', hex: '#171717' },
  { name: 'Ecru White', hex: '#F4F1EA', border: true },
  { name: 'Warm Taupe', hex: '#B9AA96' },
  { name: 'Charcoal Grey', hex: '#4A4A4A' },
  { name: 'Vintage Olive', hex: '#4B5320' },
  { name: 'Burgundy Maroon', hex: '#5B2C36' },
  { name: 'Midnight Navy', hex: '#1C2833' },
  { name: 'Terracotta Rust', hex: '#C84B31' },
];

export const SIZE_OPTIONS = ['S', 'M', 'L', 'XL', '2XL', '3XL', '30', '32', '34', '36'];

export const CATEGORY_OPTIONS = [
  'Hoodies',
  'Oversized Tees',
  'T-Shirts',
  'Sweatshirts',
  'Pants & Cargos',
  'Jackets & Outerwear',
  'Sweaters & Knits',
  'Accessories',
];

export const BRAND_OPTIONS = ['TREVORI', 'TREVORI Atelier', 'TREVORI Noir'];

export const PATTERN_OPTIONS = [
  'Solid / Plain',
  'Graphic / Chest Print',
  'Embroidered Insignia',
  'Textured / Ribbed',
  'Minimalist Typography',
];

export const PRICE_OPTIONS = [
  { id: 'under-1500', label: 'Under ₹1,500' },
  { id: '1500-2500', label: '₹1,500 - ₹2,500' },
  { id: 'above-2500', label: 'Above ₹2,500' },
];

export const DISCOUNT_OPTIONS = [
  { id: 'vip-15', label: '15% OFF (VIP Code: TREVORI15)' },
  { id: 'flat-200', label: 'Flat ₹200 OFF (Code: TREVORI200)' },
  { id: 'flat-500', label: 'Flat ₹500 OFF (Code: TREVORI500)' },
];

interface CatalogFiltersProps {
  filters: FilterState;
  onChange: (newFilters: FilterState) => void;
  onClearAll: () => void;
  counts: {
    genders: Record<string, number>;
    categories: Record<string, number>;
    sizes: Record<string, number>;
    brands: Record<string, number>;
    colors: Record<string, number>;
    patterns: Record<string, number>;
  };
  totalProductsCount: number;
}

export const CatalogFilters: React.FC<CatalogFiltersProps> = ({
  filters,
  onChange,
  onClearAll,
  counts,
}) => {
  const [openSections, setOpenSections] = useState<Record<string, boolean>>({
    gender: true,
    category: true,
    sizes: true,
    brand: true,
    color: true,
    pattern: false,
    price: false,
    discount: false,
  });

  const toggleSection = (section: string) => {
    setOpenSections((prev) => ({ ...prev, [section]: !prev[section] }));
  };

  const activeCount =
    filters.genders.length +
    filters.categories.length +
    filters.sizes.length +
    filters.brands.length +
    filters.colors.length +
    filters.patterns.length +
    filters.priceRanges.length +
    filters.discounts.length;

  const toggleFilterItem = (key: keyof FilterState, value: string) => {
    const current = filters[key] as string[];
    const updated = current.includes(value)
      ? current.filter((item) => item !== value)
      : [...current, value];
    onChange({ ...filters, [key]: updated });
  };

  return (
    <aside className="w-full bg-[#FFFFFF] border border-[#DDD8CE] p-4 text-[#171717] font-sans">
      {/* Filters Header */}
      <div className="flex items-center justify-between pb-3.5 mb-3.5 border-b border-[#DDD8CE]">
        <h3 className="text-sm font-semibold uppercase tracking-wider text-[#171717]">
          Filters {activeCount > 0 && <span className="text-xs font-bold text-[#C8411F]">({activeCount})</span>}
        </h3>
        {activeCount > 0 && (
          <button
            onClick={onClearAll}
            className="text-xs uppercase tracking-wider text-[#C8411F] hover:text-[#9E2A0E] font-medium transition-colors cursor-pointer"
          >
            Clear All
          </button>
        )}
      </div>

      <div className="space-y-4">
        {/* 1. Gender */}
        <div className="border-b border-[#DDD8CE]/60 pb-3.5">
          <button
            type="button"
            onClick={() => toggleSection('gender')}
            className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#706B64] transition-colors py-1 cursor-pointer"
          >
            <span>Gender</span>
            {openSections.gender ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.gender && (
            <div className="mt-2.5 space-y-2">
              {['Men', 'Women', 'Unisex'].map((g) => {
                const checked = filters.genders.includes(g);
                const count = counts.genders[g] || 0;
                return (
                  <label
                    key={g}
                    className="flex items-center justify-between text-xs text-[#403D39] hover:text-[#171717] cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilterItem('genders', g)}
                        className="w-3.5 h-3.5 rounded-none border-[#DDD8CE] text-[#171717] focus:ring-0 cursor-pointer accent-[#171717]"
                      />
                      <span className={checked ? 'font-semibold text-[#171717]' : ''}>{g}</span>
                    </div>
                    <span className="text-[11px] text-[#A09B93]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 2. Category */}
        <div className="border-b border-[#DDD8CE]/60 pb-3.5">
          <button
            type="button"
            onClick={() => toggleSection('category')}
            className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#706B64] transition-colors py-1 cursor-pointer"
          >
            <span>Category</span>
            {openSections.category ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.category && (
            <div className="mt-2.5 space-y-2 max-h-48 overflow-y-auto pr-1">
              {CATEGORY_OPTIONS.map((cat) => {
                const checked = filters.categories.includes(cat);
                const count = counts.categories[cat] || 0;
                return (
                  <label
                    key={cat}
                    className="flex items-center justify-between text-xs text-[#403D39] hover:text-[#171717] cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilterItem('categories', cat)}
                        className="w-3.5 h-3.5 rounded-none border-[#DDD8CE] text-[#171717] focus:ring-0 cursor-pointer accent-[#171717]"
                      />
                      <span className={checked ? 'font-semibold text-[#171717]' : ''}>{cat}</span>
                    </div>
                    <span className="text-[11px] text-[#A09B93]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 3. Sizes */}
        <div className="border-b border-[#DDD8CE]/60 pb-3.5">
          <button
            type="button"
            onClick={() => toggleSection('sizes')}
            className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#706B64] transition-colors py-1 cursor-pointer"
          >
            <span>Sizes</span>
            {openSections.sizes ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.sizes && (
            <div className="mt-2.5 space-y-2">
              <div className="grid grid-cols-2 gap-2">
                {SIZE_OPTIONS.map((sz) => {
                  const checked = filters.sizes.includes(sz);
                  const count = counts.sizes[sz] || 0;
                  return (
                    <label
                      key={sz}
                      className={`flex items-center justify-between px-2 py-1.5 border text-xs cursor-pointer select-none transition-colors ${
                        checked
                          ? 'border-[#171717] bg-[#171717] text-white font-medium'
                          : 'border-[#DDD8CE] bg-white text-[#403D39] hover:border-[#171717]'
                      }`}
                    >
                      <div className="flex items-center space-x-1.5">
                        <input
                          type="checkbox"
                          checked={checked}
                          onChange={() => toggleFilterItem('sizes', sz)}
                          className="sr-only"
                        />
                        <span>{sz}</span>
                      </div>
                      <span className={`text-[10px] ${checked ? 'text-white/80' : 'text-[#A09B93]'}`}>
                        ({count})
                      </span>
                    </label>
                  );
                })}
              </div>
            </div>
          )}
        </div>

        {/* 4. Brand */}
        <div className="border-b border-[#DDD8CE]/60 pb-3.5">
          <button
            type="button"
            onClick={() => toggleSection('brand')}
            className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#706B64] transition-colors py-1 cursor-pointer"
          >
            <span>Brand</span>
            {openSections.brand ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.brand && (
            <div className="mt-2.5 space-y-2">
              {BRAND_OPTIONS.map((br) => {
                const checked = filters.brands.includes(br);
                const count = counts.brands[br] || 0;
                return (
                  <label
                    key={br}
                    className="flex items-center justify-between text-xs text-[#403D39] hover:text-[#171717] cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilterItem('brands', br)}
                        className="w-3.5 h-3.5 rounded-none border-[#DDD8CE] text-[#171717] focus:ring-0 cursor-pointer accent-[#171717]"
                      />
                      <span className={checked ? 'font-semibold text-[#171717]' : ''}>{br}</span>
                    </div>
                    <span className="text-[11px] text-[#A09B93]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 5. Color */}
        <div className="border-b border-[#DDD8CE]/60 pb-3.5">
          <button
            type="button"
            onClick={() => toggleSection('color')}
            className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#706B64] transition-colors py-1 cursor-pointer"
          >
            <span>Color</span>
            {openSections.color ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.color && (
            <div className="mt-2.5 space-y-2 max-h-48 overflow-y-auto pr-1">
              {COLOR_OPTIONS.map((c) => {
                const checked = filters.colors.includes(c.name);
                const count = counts.colors[c.name] || 0;
                return (
                  <label
                    key={c.name}
                    className="flex items-center justify-between text-xs text-[#403D39] hover:text-[#171717] cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilterItem('colors', c.name)}
                        className="w-3.5 h-3.5 rounded-none border-[#DDD8CE] text-[#171717] focus:ring-0 cursor-pointer accent-[#171717]"
                      />
                      <span
                        className="w-3 h-3 rounded-full shrink-0 border"
                        style={{
                          backgroundColor: c.hex,
                          borderColor: c.border ? '#DDD8CE' : c.hex,
                        }}
                      />
                      <span className={checked ? 'font-semibold text-[#171717]' : ''}>{c.name}</span>
                    </div>
                    <span className="text-[11px] text-[#A09B93]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 6. Pattern */}
        <div className="border-b border-[#DDD8CE]/60 pb-3.5">
          <button
            type="button"
            onClick={() => toggleSection('pattern')}
            className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#706B64] transition-colors py-1 cursor-pointer"
          >
            <span>Pattern</span>
            {openSections.pattern ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.pattern && (
            <div className="mt-2.5 space-y-2">
              {PATTERN_OPTIONS.map((pat) => {
                const checked = filters.patterns.includes(pat);
                const count = counts.patterns[pat] || 0;
                return (
                  <label
                    key={pat}
                    className="flex items-center justify-between text-xs text-[#403D39] hover:text-[#171717] cursor-pointer select-none"
                  >
                    <div className="flex items-center space-x-2.5">
                      <input
                        type="checkbox"
                        checked={checked}
                        onChange={() => toggleFilterItem('patterns', pat)}
                        className="w-3.5 h-3.5 rounded-none border-[#DDD8CE] text-[#171717] focus:ring-0 cursor-pointer accent-[#171717]"
                      />
                      <span className={checked ? 'font-semibold text-[#171717]' : ''}>{pat}</span>
                    </div>
                    <span className="text-[11px] text-[#A09B93]">({count})</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 7. Price Range */}
        <div className="border-b border-[#DDD8CE]/60 pb-3.5">
          <button
            type="button"
            onClick={() => toggleSection('price')}
            className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#706B64] transition-colors py-1 cursor-pointer"
          >
            <span>Price</span>
            {openSections.price ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.price && (
            <div className="mt-2.5 space-y-2">
              {PRICE_OPTIONS.map((pr) => {
                const checked = filters.priceRanges.includes(pr.id);
                return (
                  <label
                    key={pr.id}
                    className="flex items-center space-x-2.5 text-xs text-[#403D39] hover:text-[#171717] cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFilterItem('priceRanges', pr.id)}
                      className="w-3.5 h-3.5 rounded-none border-[#DDD8CE] text-[#171717] focus:ring-0 cursor-pointer accent-[#171717]"
                    />
                    <span className={checked ? 'font-semibold text-[#171717]' : ''}>{pr.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>

        {/* 8. Discount */}
        <div>
          <button
            type="button"
            onClick={() => toggleSection('discount')}
            className="flex items-center justify-between w-full text-xs font-bold uppercase tracking-wider text-[#171717] hover:text-[#706B64] transition-colors py-1 cursor-pointer"
          >
            <span>Discount & Offers</span>
            {openSections.discount ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
          </button>
          {openSections.discount && (
            <div className="mt-2.5 space-y-2">
              {DISCOUNT_OPTIONS.map((disc) => {
                const checked = filters.discounts.includes(disc.id);
                return (
                  <label
                    key={disc.id}
                    className="flex items-center space-x-2.5 text-xs text-[#403D39] hover:text-[#171717] cursor-pointer select-none"
                  >
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() => toggleFilterItem('discounts', disc.id)}
                      className="w-3.5 h-3.5 rounded-none border-[#DDD8CE] text-[#171717] focus:ring-0 cursor-pointer accent-[#171717]"
                    />
                    <span className={checked ? 'font-semibold text-[#171717]' : ''}>{disc.label}</span>
                  </label>
                );
              })}
            </div>
          )}
        </div>
      </div>
    </aside>
  );
};
