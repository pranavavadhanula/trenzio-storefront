import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, Sparkles, Plus, Eye, ShoppingBag } from 'lucide-react';
import { HeroEditorialBanner } from '../components/HeroEditorialBanner';
import { ProductCard } from '../components/ProductCard';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const HomePage: React.FC = () => {
  const { products, formatPrice, addToCart } = useShop();

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Lookbook active look
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);

  // Active Category filter for New Arrivals
  const [activeNewArrivalCategory, setActiveNewArrivalCategory] = useState<string>('All');

  // Filter products for New Arrivals and Best Sellers
  const newArrivals = products
    .filter((p) => p.isNewArrival || p.id.includes('TRV-TSH') || p.id.includes('TRV-HD') || p.id.includes('TRV-PNT'))
    .filter((p) => activeNewArrivalCategory === 'All' || p.category === activeNewArrivalCategory)
    .slice(0, 8);

  const bestSellers = products
    .filter((p) => p.isBestSeller || p.stockCount && p.stockCount < 30)
    .slice(0, 4);

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (newsletterEmail.trim()) {
      setNewsletterSuccess(true);
      setNewsletterEmail('');
    }
  };

  // Categories list with 4:5 editorial imagery
  const CATEGORIES_LIST = [
    {
      name: 'Heavyweight Hoodies',
      slug: '/collections/men',
      count: '450 GSM French Terry',
      image: '/images/models/man_streetwear_hoodie.jpg',
    },
    {
      name: 'Oversized T-Shirts',
      slug: '/collections/men',
      count: 'Boxy Drop-Shoulder',
      image: '/images/models/street_tee.jpg',
    },
    {
      name: 'Tailored Pants & Cargos',
      slug: '/collections',
      count: 'Pleated & Wide-Leg',
      image: '/images/runway/men_pants.jpg',
    },
    {
      name: 'Outerwear & Jackets',
      slug: '/collections',
      count: 'Matte Twill & Bombers',
      image: 'https://images.unsplash.com/photo-1551028719-00167b16eac5?auto=format&fit=crop&w=1000&q=85',
    },
    {
      name: 'Sweaters & Knits',
      slug: '/collections',
      count: 'Textured Loops',
      image: 'https://images.unsplash.com/photo-1556905055-8f358a7a47b2?auto=format&fit=crop&w=1000&q=85',
    },
    {
      name: 'Objects & Accessories',
      slug: '/collections',
      count: '925 Solid Silver',
      image: 'https://images.unsplash.com/photo-1599643478518-a784e5dc4c8f?auto=format&fit=crop&w=1000&q=85',
    },
  ];

  // Lookbook curated editorial looks
  const LOOKBOOK_ITEMS = [
    {
      id: 'look-01',
      title: 'Look 01: The Monolith Silhouette',
      setting: 'Concrete Brutalist Pavilion &bull; Milan',
      image: '/images/models/man_streetwear_hoodie.jpg',
      description: 'Heavyweight 450 GSM French Terry Boxy Hoodie paired with Relaxed Pleated Wide-Leg Cargo Pants.',
      items: [
        { name: 'Classic French Terry Boxy Hoodie', priceINR: 2499, category: 'Hoodies' },
        { name: 'Relaxed Pleated Wide-Leg Cargo Pants', priceINR: 1499, category: 'Pants' },
      ],
    },
    {
      id: 'look-02',
      title: 'Look 02: Architectural Contrast',
      setting: 'Warm Studio Chiaroscuro &bull; Tokyo',
      image: '/images/models/street_tee.jpg',
      description: 'Vintage Acid-Wash Monogram Oversized Tee worn with Clean Indigo Tailored Streetwear Denim.',
      items: [
        { name: 'Vintage Acid-Wash Monogram Tee', priceINR: 1699, category: 'Oversized Tees' },
        { name: 'Clean Indigo Tailored Denim', priceINR: 1799, category: 'Pants' },
      ],
    },
    {
      id: 'look-03',
      title: 'Look 03: The Modern Fluidity',
      setting: 'Minimalist Sandstone Gallery &bull; London',
      image: 'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=85',
      description: 'Tailored High-Waist Wide-Leg Drape Trousers paired with Minimalist Supima Cotton Essentials.',
      items: [
        { name: 'Tailored High-Waist Wide-Leg Trousers', priceINR: 1899, category: 'Pants' },
        { name: 'Classic Supima Tailored Shirt', priceINR: 1299, category: 'T-Shirts' },
      ],
    },
    {
      id: 'look-04',
      title: 'Look 04: Tactical Utilitarian',
      setting: 'Architectural Shadowplay &bull; New York',
      image: '/images/models/man_street_standing.jpg',
      description: 'Tactical Utility Zip Bomber Jacket over Boxy Heavyweight Tee and Nappa Leather Chunky Sneakers.',
      items: [
        { name: 'Tactical Utility Zip Bomber Jacket', priceINR: 2799, category: 'Jackets' },
        { name: 'Italian Nappa Leather Chunky Sneaker', priceINR: 2499, category: 'Footwear' },
      ],
    },
  ];

  // Customer Reviews
  const REVIEWS = [
    {
      author: 'Julian V.',
      location: 'London, United Kingdom',
      item: 'Classic French Terry Boxy Hoodie (450 GSM)',
      rating: 5,
      review:
        'The drape is sublime. You can immediately feel the density of the 450 GSM combed cotton. The collar holds its shape effortlessly and the hood doesn’t flop. Truly on par with bespoke Japanese streetwear.',
      verified: true,
    },
    {
      author: 'Aarav M.',
      location: 'Mumbai, India',
      item: 'Relaxed Pleated Wide-Leg Cargo Pants',
      rating: 5,
      review:
        'Under ₹1,500 for this caliber of double-pleated twill is unbelievable. The fit falls straight without bunching awkwardly over sneakers. Trevori has completely redefined Indian contemporary fashion.',
      verified: true,
    },
    {
      author: 'Kenji T.',
      location: 'Tokyo, Japan',
      item: 'Boxy Oversized T-Shirt (350 GSM)',
      rating: 5,
      review:
        'Subtle, understated, architectural. The ribbed collar is 1.25 inches thick and stays razor-sharp after ten washes. No unnecessary loud graphics—pure minimalist proportions.',
      verified: true,
    },
    {
      author: 'Camille R.',
      location: 'Paris, France',
      item: 'Tailored High-Waist Wide-Leg Trousers',
      rating: 5,
      review:
        'The movement in these trousers is poetry. Luxurious crepe twill with deep front knife pleats. Comfortable enough for travel yet sharp enough for fashion week presentations.',
      verified: true,
    },
  ];

  return (
    <div className="bg-[#F4F1EA] text-[#171717] font-sans selection:bg-[#DDD8CE] selection:text-[#171717]">
      {/* ------------------------------------------------------------- */}
      {/* 2. LARGE EDITORIAL HERO BANNER */}
      {/* ------------------------------------------------------------- */}
      <HeroEditorialBanner />

      {/* ------------------------------------------------------------- */}
      {/* 3. SHOP BY CATEGORY */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 border-b border-[#DDD8CE] pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#706B64] font-medium block mb-2">
              Curated Wardrobe Architecture
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#171717]">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/collections"
            className="text-xs uppercase tracking-[0.2em] text-[#171717] hover:text-[#B9AA96] transition-colors mt-4 md:mt-0 font-medium flex items-center gap-2 group"
          >
            <span>View All Categories</span>
            <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
          </Link>
        </div>

        {/* 6 Category 4:5 Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-6 lg:gap-8">
          {CATEGORIES_LIST.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.slug}
              className="group relative flex flex-col bg-[#FFFFFF] border border-[#DDD8CE]/70 overflow-hidden cursor-pointer"
            >
              {/* 4:5 Image Ratio */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#DDD8CE]/40">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Subtle scrim for readability */}
                <div className="absolute inset-0 bg-gradient-to-t from-[#171717]/70 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />

                {/* Bottom Overlay Text */}
                <div className="absolute inset-x-0 bottom-0 p-4 sm:p-6 text-white z-10 flex flex-col justify-end">
                  <span className="text-[10px] tracking-[0.2em] uppercase text-[#DDD8CE] font-light mb-1">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-xl sm:text-2xl lg:text-3xl font-normal text-white group-hover:translate-x-1 transition-transform duration-300">
                    {cat.name}
                  </h3>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 4. NEW ARRIVALS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF] border-y border-[#DDD8CE]/80">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#DDD8CE] pb-6">
            <div>
              <span className="text-[11px] uppercase tracking-[0.25em] text-[#706B64] font-medium block mb-2">
                Seasonal Drop // Edition IV
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#171717]">
                New Arrivals
              </h2>
            </div>

            {/* Category filter pills */}
            <div className="flex flex-wrap items-center gap-2 mt-4 md:mt-0">
              {['All', 'Hoodies', 'Oversized Tees', 'Pants'].map((category) => (
                <button
                  key={category}
                  onClick={() => setActiveNewArrivalCategory(category)}
                  className={`px-3.5 py-1.5 text-xs uppercase tracking-wider transition-all cursor-pointer border ${
                    activeNewArrivalCategory === category
                      ? 'bg-[#171717] text-white border-[#171717]'
                      : 'bg-[#F4F1EA] text-[#706B64] border-[#DDD8CE] hover:text-[#171717] hover:border-[#171717]'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>

          {/* 4:5 Products Grid */}
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
            {newArrivals.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>

          <div className="mt-14 text-center">
            <Link
              to="/collections"
              className="inline-flex items-center gap-2 px-8 py-3.5 border border-[#171717] text-[#171717] hover:bg-[#171717] hover:text-white transition-all text-xs uppercase tracking-[0.2em] font-medium"
            >
              <span>Explore All New Arrivals</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 5. BEST SELLERS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 border-b border-[#DDD8CE] pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#706B64] font-medium block mb-2">
              Hallmark Silhouettes
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#171717]">
              Best Sellers
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#706B64] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Consistently demanded foundation pieces engineered with 100% bio-washed combed cotton, anti-curl collars, and signature boxy proportions.
          </p>
        </div>

        {/* 4:5 Products Grid */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6 lg:gap-8">
          {bestSellers.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. FEATURED COLLECTIONS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 bg-[#DDD8CE]/35 border-y border-[#DDD8CE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#706B64] font-medium block mb-3">
              Editorial Capsules
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#171717]">
              Featured Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#706B64] mt-3 font-light leading-relaxed">
              Three architectural design studies examining weight, tactile materiality, and spatial drape.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Capsule 01 */}
            <div className="group bg-[#FFFFFF] border border-[#DDD8CE] flex flex-col justify-between overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#DDD8CE]">
                <img
                  src="/images/models/man_streetwear_hoodie.jpg"
                  alt="Capsule 01: The Architectural Core"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#171717] text-white text-[9px] uppercase tracking-widest px-2.5 py-1">
                  Capsule 01
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#171717] mb-2">
                    The Architectural Core
                  </h3>
                  <p className="text-xs text-[#706B64] leading-relaxed mb-6 font-light">
                    Brutalist minimalism in heavyweight 450 GSM French Terry. Obsidian black, ecru ivory, and reinforced dropped seams.
                  </p>
                </div>
                <Link
                  to="/collections/men"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#171717] hover:text-[#B9AA96] transition-colors"
                >
                  <span>Explore Capsule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Capsule 02 */}
            <div className="group bg-[#FFFFFF] border border-[#DDD8CE] flex flex-col justify-between overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#DDD8CE]">
                <img
                  src="/images/models/street_tee.jpg"
                  alt="Capsule 02: Raw Concrete & Earth"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#171717] text-white text-[9px] uppercase tracking-widest px-2.5 py-1">
                  Capsule 02
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#171717] mb-2">
                    Raw Concrete & Earth
                  </h3>
                  <p className="text-xs text-[#706B64] leading-relaxed mb-6 font-light">
                    Mineral acid-washed combed jersey, stone-washed heavy cotton twills, and muted earthen pigments.
                  </p>
                </div>
                <Link
                  to="/collections/men"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#171717] hover:text-[#B9AA96] transition-colors"
                >
                  <span>Explore Capsule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>

            {/* Capsule 03 */}
            <div className="group bg-[#FFFFFF] border border-[#DDD8CE] flex flex-col justify-between overflow-hidden">
              <div className="relative aspect-[4/5] overflow-hidden bg-[#DDD8CE]">
                <img
                  src="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=85"
                  alt="Capsule 03: Fluid Tailoring"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                />
                <div className="absolute top-4 left-4 bg-[#171717] text-white text-[9px] uppercase tracking-widest px-2.5 py-1">
                  Capsule 03
                </div>
              </div>
              <div className="p-6 sm:p-8 flex flex-col justify-between flex-1">
                <div>
                  <h3 className="font-serif text-2xl sm:text-3xl font-normal text-[#171717] mb-2">
                    Fluid Tailoring
                  </h3>
                  <p className="text-xs text-[#706B64] leading-relaxed mb-6 font-light">
                    Floor-grazing double-pleated drape trousers and relaxed architectural knitwear with fluid motion.
                  </p>
                </div>
                <Link
                  to="/collections/women"
                  className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-medium text-[#171717] hover:text-[#B9AA96] transition-colors"
                >
                  <span>Explore Capsule</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 7. TREVORI EDITORIAL LOOKBOOK */}
      {/* ------------------------------------------------------------- */}
      <section id="lookbook" className="py-20 sm:py-32 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12 sm:mb-16 border-b border-[#DDD8CE] pb-6">
          <div>
            <span className="text-[11px] uppercase tracking-[0.25em] text-[#706B64] font-medium block mb-2">
              Art Direction // Volume IV
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#171717]">
              TREVORI Lookbook
            </h2>
          </div>
          <p className="text-xs sm:text-sm text-[#706B64] max-w-md mt-4 md:mt-0 font-light leading-relaxed">
            Full-body contemporary streetwear photography set against brutalist concrete and warm studio chiaroscuro. Click any look to inspect pieces.
          </p>
        </div>

        {/* Lookbook Interactive Split Gallery */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          {/* Main Large Editorial Image */}
          <div className="lg:col-span-7 relative aspect-[4/5] bg-[#DDD8CE] border border-[#DDD8CE] overflow-hidden group">
            <img
              src={LOOKBOOK_ITEMS[activeLookIndex].image}
              alt={LOOKBOOK_ITEMS[activeLookIndex].title}
              className="w-full h-full object-cover object-top transition-transform duration-700 group-hover:scale-102"
            />
            {/* Setting badge */}
            <div className="absolute top-4 left-4 bg-[#FFFFFF]/90 backdrop-blur-md px-3 py-1 text-[10px] uppercase tracking-wider text-[#171717] font-medium border border-[#DDD8CE]">
              <span dangerouslySetInnerHTML={{ __html: LOOKBOOK_ITEMS[activeLookIndex].setting }} />
            </div>

            {/* Click to open details */}
            <button
              onClick={() => setLookbookModalOpen(true)}
              className="absolute bottom-4 right-4 bg-[#171717] text-white hover:bg-[#333333] px-4 py-2 text-[10px] uppercase tracking-widest font-medium transition-colors flex items-center gap-1.5 cursor-pointer shadow-sm"
            >
              <Eye className="w-3.5 h-3.5" />
              <span>Inspect Look Details</span>
            </button>
          </div>

          {/* Look Selector and Styled Pieces breakdown */}
          <div className="lg:col-span-5 flex flex-col justify-between space-y-8">
            {/* Look Selector Tabs */}
            <div className="space-y-3">
              <span className="text-[10px] uppercase tracking-[0.25em] text-[#706B64] font-medium block">
                Select Styled Look
              </span>
              <div className="grid grid-cols-2 gap-2">
                {LOOKBOOK_ITEMS.map((look, idx) => (
                  <button
                    key={look.id}
                    onClick={() => setActiveLookIndex(idx)}
                    className={`p-3 text-left border transition-all cursor-pointer ${
                      activeLookIndex === idx
                        ? 'border-[#171717] bg-[#FFFFFF] shadow-sm'
                        : 'border-[#DDD8CE] bg-[#F4F1EA] hover:border-[#171717]/40'
                    }`}
                  >
                    <div className="text-[10px] font-semibold text-[#171717] uppercase tracking-wider">
                      Look 0{idx + 1}
                    </div>
                    <div className="text-xs text-[#706B64] truncate mt-0.5 font-light">
                      {look.title.replace(/Look \d+: /, '')}
                    </div>
                  </button>
                ))}
              </div>
            </div>

            {/* Active Look Narrative */}
            <div className="p-6 bg-[#FFFFFF] border border-[#DDD8CE] space-y-4">
              <div>
                <h3 className="font-serif text-2xl font-normal text-[#171717]">
                  {LOOKBOOK_ITEMS[activeLookIndex].title}
                </h3>
                <p className="text-xs text-[#706B64] font-light mt-2 leading-relaxed">
                  {LOOKBOOK_ITEMS[activeLookIndex].description}
                </p>
              </div>

              {/* Garments featured in this look */}
              <div className="pt-4 border-t border-[#DDD8CE] space-y-3">
                <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-medium block">
                  Garments in this Look:
                </span>
                {LOOKBOOK_ITEMS[activeLookIndex].items.map((item, i) => (
                  <div key={i} className="flex items-center justify-between text-xs py-1 border-b border-[#DDD8CE]/40 last:border-b-0">
                    <div>
                      <div className="font-medium text-[#171717]">{item.name}</div>
                      <div className="text-[10px] text-[#706B64]">{item.category}</div>
                    </div>
                    <div className="font-semibold text-[#171717]">
                      {formatPrice(item.priceINR)}
                    </div>
                  </div>
                ))}
              </div>

              <Link
                to="/collections"
                className="w-full py-3 bg-[#171717] text-white hover:bg-[#333333] text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 transition-colors"
              >
                <ShoppingBag className="w-3.5 h-3.5" />
                <span>Shop Styled Collection</span>
              </Link>
            </div>
          </div>
        </div>

        {/* Lookbook Modal */}
        {lookbookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-fade-in-subtle">
            <div className="bg-[#FFFFFF] border border-[#DDD8CE] max-w-lg w-full p-6 sm:p-8 relative">
              <button
                onClick={() => setLookbookModalOpen(false)}
                className="absolute top-4 right-4 text-[#706B64] hover:text-[#171717] text-sm uppercase tracking-wider"
              >
                Close ✕
              </button>
              <h3 className="font-serif text-2xl text-[#171717] mb-2">
                {LOOKBOOK_ITEMS[activeLookIndex].title}
              </h3>
              <p className="text-xs text-[#706B64] mb-6 leading-relaxed">
                {LOOKBOOK_ITEMS[activeLookIndex].description}
              </p>
              <div className="space-y-3 mb-6">
                {LOOKBOOK_ITEMS[activeLookIndex].items.map((item, i) => (
                  <div key={i} className="flex justify-between items-center p-3 bg-[#F4F1EA] border border-[#DDD8CE] text-xs">
                    <span className="font-medium">{item.name}</span>
                    <span className="font-semibold">{formatPrice(item.priceINR)}</span>
                  </div>
                ))}
              </div>
              <Link
                to="/collections"
                onClick={() => setLookbookModalOpen(false)}
                className="w-full block py-3 text-center bg-[#171717] text-white text-xs uppercase tracking-widest font-medium"
              >
                Browse Full Catalog
              </Link>
            </div>
          </div>
        )}
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 8. BRAND STORY */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-32 bg-[#FFFFFF] border-y border-[#DDD8CE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
            {/* Story Editorial Image: Studio Textile & Silhouette */}
            <div className="lg:col-span-5 relative aspect-[4/5] bg-[#DDD8CE] overflow-hidden border border-[#DDD8CE]">
              <img
                src="/images/models/man_model_fashion.jpg"
                alt="TREVORI Atelier Craftsmanship"
                className="w-full h-full object-cover filter contrast-105"
                loading="lazy"
              />
              <div className="absolute bottom-6 left-6 right-6 p-4 bg-[#FFFFFF]/95 backdrop-blur-md border border-[#DDD8CE] text-xs">
                <span className="text-[9px] uppercase tracking-widest text-[#B9AA96] font-semibold block mb-0.5">
                  ATELIER SPECIFICATION
                </span>
                <span className="text-[#171717] font-serif text-sm">
                  100% Bio-Washed Ring-Spun Cotton • Anti-Torque Weave
                </span>
              </div>
            </div>

            {/* Narrative Typography */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#706B64] font-medium block">
                The Trevori Manifesto
              </span>
              <h2 className="font-serif text-3xl sm:text-5xl lg:text-6xl font-normal tracking-tight text-[#171717] leading-[1.08]">
                Born Between Minimalism & Rebellion.
              </h2>
              <div className="space-y-4 text-xs sm:text-sm text-[#706B64] font-light leading-relaxed">
                <p>
                  TREVORI was founded on an exacting conviction: that contemporary streetwear should possess the structural rigor of high-fashion tailoring and the enduring integrity of historic industrial workwear.
                </p>
                <p>
                  We reject disposable, fleeting hype drops. Every silhouette is calibrated in our atelier using heavyweight 450 GSM organic French Terry, combed cotton jersey, and micro-ribbed collars reinforced to resist distortion across years of wear.
                </p>
                <p>
                  By partnering directly with certified ethical spinning mills and utilizing zero synthetic microplastic fillers, we deliver garments that balance architectural form with everyday tactile comfort.
                </p>
              </div>

              {/* 4 Brand Pillars */}
              <div className="pt-6 border-t border-[#DDD8CE] grid grid-cols-2 gap-6 text-xs">
                <div>
                  <div className="font-serif text-lg text-[#171717] mb-1">Architectural Drape</div>
                  <p className="text-[#706B64] text-[11px] leading-relaxed">Boxy dropped-shoulders calibrated for natural drape without bulk.</p>
                </div>
                <div>
                  <div className="font-serif text-lg text-[#171717] mb-1">Pure Ring-Spun Cotton</div>
                  <p className="text-[#706B64] text-[11px] leading-relaxed">Long-staple fibers bio-washed for extreme softness and longevity.</p>
                </div>
                <div>
                  <div className="font-serif text-lg text-[#171717] mb-1">Ethical Atelier Production</div>
                  <p className="text-[#706B64] text-[11px] leading-relaxed">Fair-wage certified artisan sewing facilities and clean non-toxic dyes.</p>
                </div>
                <div>
                  <div className="font-serif text-lg text-[#171717] mb-1">Zero Synthetic Fillers</div>
                  <p className="text-[#706B64] text-[11px] leading-relaxed">100% natural organic cotton eliminating synthetic polyester shedding.</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 9. MEET THE FOUNDER */}
      {/* ------------------------------------------------------------- */}
      <section id="founder" className="py-20 sm:py-32 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="bg-[#DDD8CE]/35 border border-[#DDD8CE] p-8 sm:p-14 lg:p-16">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
            {/* Founder Portrait (Editorial Warm/Monochrome Studio) */}
            <div className="lg:col-span-5 relative aspect-[4/5] bg-[#DDD8CE] overflow-hidden border border-[#DDD8CE]">
              <img
                src="/images/models/man_portrait.jpg"
                alt="Arjun Trevori, Founder & Creative Director"
                className="w-full h-full object-cover filter contrast-110 brightness-95"
                loading="lazy"
              />
              <div className="absolute top-4 left-4 bg-[#171717] text-white text-[9px] uppercase tracking-widest px-2.5 py-1">
                Creative Direction
              </div>
            </div>

            {/* Founder Quote & Ethos */}
            <div className="lg:col-span-7 space-y-6">
              <span className="text-[11px] uppercase tracking-[0.3em] text-[#706B64] font-medium block">
                Meet the Founder
              </span>

              {/* Editorial Quote in Cormorant Garamond */}
              <blockquote className="font-serif text-2xl sm:text-3xl lg:text-4xl text-[#171717] italic font-normal leading-snug">
                &ldquo;Fashion is not ornamentation; it is the spatial geometry between the human form and the architecture of the modern city.&rdquo;
              </blockquote>

              <p className="text-xs sm:text-sm text-[#706B64] font-light leading-relaxed">
                When I created TREVORI, the global fashion space was inundated with synthetic fast-fashion blends masquerading as luxury streetwear. I wanted to build a sanctuary for purists—garments defined by tactile heft, mathematical proportions, and timeless neutral tones that endure long after ephemeral trends dissipate.
              </p>

              <div className="pt-4 border-t border-[#DDD8CE]">
                <div className="font-serif text-xl text-[#171717]">Arjun Trevori</div>
                <div className="text-[10px] uppercase tracking-[0.2em] text-[#B9AA96] font-medium mt-0.5">
                  Founder & Creative Director &bull; Trevori Studios
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 10. CUSTOMER REVIEWS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF] border-y border-[#DDD8CE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#706B64] font-medium block mb-3">
              Verified Client Impressions
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#171717]">
              Customer Reviews
            </h2>
            <div className="flex items-center justify-center gap-1 mt-3 text-[#B9AA96]">
              {[...Array(5)].map((_, i) => (
                <Star key={i} className="w-4 h-4 fill-current" />
              ))}
              <span className="text-xs text-[#706B64] ml-2 font-medium">4.9 / 5.0 Global Rating</span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {REVIEWS.map((rev, idx) => (
              <div
                key={idx}
                className="bg-[#F4F1EA] border border-[#DDD8CE] p-6 flex flex-col justify-between"
              >
                <div>
                  {/* Stars in taupe accent */}
                  <div className="flex items-center gap-1 text-[#B9AA96] mb-3">
                    {[...Array(rev.rating)].map((_, i) => (
                      <Star key={i} className="w-3 h-3 fill-current" />
                    ))}
                  </div>

                  <p className="text-xs text-[#171717] font-light leading-relaxed mb-6 italic">
                    &ldquo;{rev.review}&rdquo;
                  </p>
                </div>

                <div className="pt-4 border-t border-[#DDD8CE]">
                  <div className="flex items-center justify-between text-[11px] font-semibold text-[#171717]">
                    <span>{rev.author}</span>
                    <span className="flex items-center gap-1 text-[9px] text-[#706B64] font-normal uppercase tracking-wider">
                      <CheckCircle className="w-3 h-3 text-[#B9AA96]" /> Verified
                    </span>
                  </div>
                  <div className="text-[10px] text-[#706B64] font-light">{rev.location}</div>
                  <div className="text-[9px] text-[#B9AA96] mt-1 font-medium truncate">{rev.item}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 11. NEWSLETTER SUBSCRIPTION */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        <div className="bg-[#DDD8CE]/40 border border-[#DDD8CE] p-8 sm:p-14 text-center max-w-3xl mx-auto">
          <span className="text-[10px] uppercase tracking-[0.35em] text-[#706B64] font-medium block mb-3">
            Private Client Access
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#171717] mb-3">
            The Trevori Dispatch
          </h2>
          <p className="text-xs sm:text-sm text-[#706B64] font-light max-w-md mx-auto mb-8 leading-relaxed">
            Receive private invitations to confidential capsule releases, seasonal lookbook previews, and atelier essays. We respect your privacy with zero frivolous messaging.
          </p>

          {newsletterSuccess ? (
            <div className="p-4 bg-[#FFFFFF] border border-[#DDD8CE] text-xs text-[#171717] font-medium max-w-md mx-auto">
              ✓ Welcome to the Trevori Private Client registry. A formal greeting has been dispatched to your inbox.
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2 max-w-md mx-auto">
              <input
                type="email"
                required
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                placeholder="Enter your email address..."
                className="flex-1 px-4 py-3 bg-[#FFFFFF] border border-[#DDD8CE] text-xs text-[#171717] placeholder-[#706B64] focus:outline-none focus:border-[#171717]"
              />
              <button
                type="submit"
                className="px-6 py-3 bg-[#171717] text-white hover:bg-[#333333] transition-colors text-xs uppercase tracking-[0.2em] font-medium cursor-pointer"
              >
                Subscribe
              </button>
            </form>
          )}

          <div className="mt-4 text-[10px] text-[#706B64] font-light">
            You may revoke your subscription at any time with one click.
          </div>
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 12. PREMIUM FOOTER is rendered directly at page/app bottom */}
      {/* ------------------------------------------------------------- */}
    </div>
  );
};
