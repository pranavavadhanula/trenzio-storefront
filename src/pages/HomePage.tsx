import React, { useState, useMemo, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, Star, CheckCircle, Sparkles, Plus, Eye, ShoppingBag } from 'lucide-react';
import { HeroEditorialBanner } from '../components/HeroEditorialBanner';
import { TrevoriOfferTicketBanner } from '../components/TrevoriOfferTicketBanner';
import { EditorialLooksScroll } from '../components/home/EditorialLooksScroll';
import { ProductCard } from '../components/ProductCard';
import { Glossy3DCard } from '../components/Glossy3DCard';
import { Lookbook3DCard } from '../components/Lookbook3DCard';
import { useShop } from '../context/ShopContext';
import { Product } from '../types';

export const HomePage: React.FC<{ scrollTo?: string }> = ({ scrollTo }) => {
  const { products, formatPrice, addToCart } = useShop();

  // Scroll to lookbook if requested or if hash matches
  useEffect(() => {
    if (scrollTo === 'lookbook' || window.location.hash === '#lookbook') {
      const el = document.getElementById('lookbook');
      if (el) {
        setTimeout(() => {
          el.scrollIntoView({ behavior: 'smooth' });
        }, 150);
      }
    }
  }, [scrollTo]);

  // Newsletter state
  const [newsletterEmail, setNewsletterEmail] = useState('');
  const [newsletterSuccess, setNewsletterSuccess] = useState(false);

  // Lookbook active look
  const [activeLookIndex, setActiveLookIndex] = useState(0);
  const [lookbookModalOpen, setLookbookModalOpen] = useState(false);

  // Active Category filter for New Arrivals
  const [activeNewArrivalCategory, setActiveNewArrivalCategory] = useState<string>('All');

  // Dynamic categories strictly based on active Shopify products
  const availableCategories: string[] = useMemo<string[]>(() => {
    const cats = Array.from(new Set(products.map((p: Product) => p.category).filter(Boolean)));
    return ['All', ...cats];
  }, [products]);

  // Filter products for New Arrivals and Best Sellers (only live Shopify products)
  const newArrivals: Product[] = useMemo<Product[]>(() => {
    return products
      .filter((p: Product) => activeNewArrivalCategory === 'All' || p.category === activeNewArrivalCategory)
      .slice(0, 8);
  }, [products, activeNewArrivalCategory]);

  const bestSellers: Product[] = useMemo<Product[]>(() => {
    return products.slice(0, 4);
  }, [products]);

  const lookbookFeaturedItems: Array<{ name: string; priceINR: number; category: string }> = useMemo(() => {
    return products.slice(0, 2).map((p: Product) => ({
      name: p.name,
      priceINR: p.priceINR,
      category: p.category,
    }));
  }, [products]);

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
      name: 'Hoodies & Sweatshirts',
      slug: '/collections/men',
      count: 'French Terry Cotton',
      image: '/images/models/man_streetwear_hoodie.jpg',
    },
    {
      name: 'Oversized T-Shirts',
      slug: '/collections/men',
      count: 'Boxy Drop-Shoulder',
      image: '/images/models/trevori_oversized_tee_4k.jpg',
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
      title: 'Look 01: Wear Your Story',
      setting: 'Trevori Studio · Milan',
      image: '/images/models/trevori_lookbook_volume_iv_4k.jpg',
      aspectRatio: '976 / 1024',
      description: 'French Terry Cotton Crewneck with Embroidered Chest Signature, paired with relaxed atelier drape trousers. Premium Cotton Blend, Timeless Design, Effortless Style.',
      items: [
        { name: 'Embroidered French Terry Crewneck', priceINR: 2499, category: 'Sweatshirts' },
        { name: 'Relaxed Pleated Wide-Leg Cargo Pants', priceINR: 1499, category: 'Pants' },
      ],
    },
    {
      id: 'look-02',
      title: 'Look 02: Architectural Contrast',
      setting: 'Milan Fashion Pavilion',
      image: '/images/models/trevori_editorial_sitting.jpg',
      aspectRatio: '4 / 5',
      description: 'Textured Knit Summer Polo worn with Relaxed Pleated Cargo Pants.',
      items: [
        { name: 'Textured Knit Summer Polo', priceINR: 1699, category: 'Shirts' },
        { name: 'Relaxed Pleated Cargo Pants', priceINR: 1799, category: 'Pants' },
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
      description: 'Tactical Utility Zip Bomber Jacket over Boxy Oversized Tee and Nappa Leather Chunky Sneakers.',
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
      item: 'Classic French Terry Boxy Hoodie ',
      rating: 5,
      review:
        'The drape is sublime. You can immediately feel the density of the combed cotton. The collar holds its shape effortlessly and the hood doesn’t flop. Truly on par with bespoke Japanese streetwear.',
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
      item: 'Boxy Oversized T-Shirt ',
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
      {/* 2.2 TREVORI PRIVILEGE VOUCHER TICKET (EXCLUSIVE OFFER WITH GLOW) */}
      {/* ------------------------------------------------------------- */}
      <TrevoriOfferTicketBanner />

      {/* ------------------------------------------------------------- */}
      {/* 2.5 EDITORIAL LOOKS 3D SCROLL REEL */}
      {/* ------------------------------------------------------------- */}
      <EditorialLooksScroll />

      {/* ------------------------------------------------------------- */}
      {/* 3. SHOP BY CATEGORY */}
      {/* ------------------------------------------------------------- */}
      <section className="pt-4 sm:pt-6 pb-12 sm:pb-16 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header with Eyebrow, Title, Divider and Right-Aligned Link */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between mb-6 sm:mb-8 border-b border-[#DDD8CE] pb-4 sm:pb-5">
          <div>
            <span className="text-[10px] sm:text-[11px] uppercase tracking-[0.25em] text-[#706B64] font-medium block mb-1.5">
              CURATED WARDROBE ARCHITECTURE
            </span>
            <h2 className="font-serif text-3xl sm:text-4xl lg:text-5xl font-normal tracking-tight text-[#171717]">
              Shop by Category
            </h2>
          </div>
          <Link
            to="/collections"
            className="text-xs uppercase tracking-[0.2em] text-[#171717] hover:text-[#B9AA96] transition-colors mt-3 sm:mt-0 font-medium inline-flex items-center gap-1.5 group"
          >
            <span>VIEW ALL CATEGORIES</span>
            <span className="inline-block transition-transform duration-300 group-hover:translate-x-1">→</span>
          </Link>
        </div>

        {/* 3-Column x 2-Row Category Image Grid (2-Column on Mobile/Tablet) */}
        <div className="grid grid-cols-2 lg:grid-cols-3 gap-3.5 sm:gap-5 lg:gap-6">
          {CATEGORIES_LIST.map((cat, idx) => (
            <Link
              key={idx}
              to={cat.slug}
              className="group relative flex flex-col bg-[#FFFFFF] border border-[#DDD8CE]/60 overflow-hidden cursor-pointer shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              {/* 4:5 Consistent Image Ratio */}
              <div className="relative aspect-[4/5] w-full overflow-hidden bg-[#DDD8CE]/30">
                <img
                  src={cat.image}
                  alt={cat.name}
                  className="w-full h-full object-cover object-center filter contrast-105 group-hover:scale-105 transition-transform duration-700 ease-out"
                  loading="lazy"
                />
                {/* Subtle dark gradient overlay so white text remains readable */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/25 to-transparent transition-opacity duration-300 group-hover:from-black/85" />

                {/* Bottom Overlay Text: Descriptive Label + Category Name */}
                <div className="absolute inset-x-0 bottom-0 p-3.5 sm:p-5 lg:p-6 text-white z-10 flex flex-col justify-end">
                  <span className="text-[9px] sm:text-[10px] tracking-[0.2em] uppercase text-[#DDD8CE] font-light mb-1 block">
                    {cat.count}
                  </span>
                  <h3 className="font-serif text-base sm:text-xl lg:text-2xl font-normal text-white group-hover:translate-x-1 transition-transform duration-300 leading-snug">
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
              {availableCategories.map((category) => (
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
            {newArrivals.length === 0 ? (
              <div className="col-span-full py-16 text-center text-[#706B64] font-serif text-lg">
                No designs currently found in this category.
              </div>
            ) : (
              newArrivals.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            )}
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
          {bestSellers.length === 0 ? (
            <div className="col-span-full py-16 text-center text-[#706B64] font-serif text-lg">
              New atelier creations arriving soon.
            </div>
          ) : (
            bestSellers.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))
          )}
        </div>
      </section>

      {/* ------------------------------------------------------------- */}
      {/* 6. FEATURED COLLECTIONS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 bg-[#DDD8CE]/35 border-y border-[#DDD8CE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#706B64] font-medium block mb-3">
              Design Studies
            </span>
            <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#171717]">
              Featured Collections
            </h2>
            <p className="text-xs sm:text-sm text-[#706B64] mt-3 font-light leading-relaxed">
              Three architectural design studies examining weight, tactile materiality, and spatial drape.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            <Glossy3DCard
              image="/images/models/trevori_green_sweatshirt.png"
              title="The Architectural Core"
              description="Brutalist minimalism in contemporary French Terry Cotton. Obsidian black, forest green, and reinforced seams."
              linkTo="/collections/men"
            />

            <Glossy3DCard
              image="/images/models/trevori_editorial_sitting.jpg"
              title="Raw Concrete & Earth"
              description="Mineral acid-washed combed jersey, relaxed cargo drape, and architectural summer knitwear."
              linkTo="/collections/men"
            />

            <Glossy3DCard
              image="https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=90"
              title="Fluid Tailoring"
              description="Floor-grazing double-pleated drape trousers and relaxed architectural knitwear with fluid motion."
              linkTo="/collections/women"
            />
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
          {/* Main Large Editorial 3D Glossy Image */}
          <div className="lg:col-span-7">
            <Lookbook3DCard
              image={LOOKBOOK_ITEMS[activeLookIndex].image}
              title={LOOKBOOK_ITEMS[activeLookIndex].title}
              aspectRatio={LOOKBOOK_ITEMS[activeLookIndex].aspectRatio || '4 / 5'}
              onOpenModal={() => setLookbookModalOpen(true)}
            />
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
              {lookbookFeaturedItems.length > 0 && (
                <div className="pt-4 border-t border-[#DDD8CE] space-y-3">
                  <span className="text-[10px] uppercase tracking-widest text-[#706B64] font-medium block">
                    Featured Designs in this Look:
                  </span>
                  {lookbookFeaturedItems.map((item, i) => (
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
              )}

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

        {/* Lookbook Modal with 4K Inspection */}
        {lookbookModalOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 sm:p-6 bg-black/75 backdrop-blur-md animate-fade-in-subtle">
            <div className="bg-[#FFFFFF] border border-[#DDD8CE] max-w-4xl w-full p-6 sm:p-8 relative max-h-[90vh] overflow-y-auto shadow-2xl">
              <button
                onClick={() => setLookbookModalOpen(false)}
                className="absolute top-4 right-4 z-10 text-[#706B64] hover:text-[#171717] text-xs uppercase tracking-widest font-semibold p-2 cursor-pointer transition-colors"
              >
                Close ✕
              </button>

              <div className="grid grid-cols-1 md:grid-cols-12 gap-6 sm:gap-8 items-center">
                {/* 4K Image Inspection Frame */}
                <div className="md:col-span-6 relative aspect-[976/1024] bg-[#F4F1EA] border border-[#DDD8CE] overflow-hidden group">
                  <img
                    src={LOOKBOOK_ITEMS[activeLookIndex].image}
                    alt={LOOKBOOK_ITEMS[activeLookIndex].title}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute top-3 left-3 bg-[#171717]/90 text-white text-[9px] uppercase px-2.5 py-1 tracking-widest font-semibold backdrop-blur-sm border border-white/20">
                    4K Editorial Master
                  </div>
                  <div className="absolute bottom-3 right-3 bg-white/90 text-[#171717] text-[9px] uppercase px-2 py-0.5 tracking-wider font-semibold backdrop-blur-sm border border-[#DDD8CE]">
                    3904 × 4096 UHD
                  </div>
                </div>

                {/* Look Information & Styled Pieces */}
                <div className="md:col-span-6 space-y-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.25em] text-[#B9AA96] font-semibold block mb-1">
                      {LOOKBOOK_ITEMS[activeLookIndex].setting || 'Trevori Studio · Milan'}
                    </span>
                    <h3 className="font-serif text-2xl sm:text-3xl text-[#171717] font-normal">
                      {LOOKBOOK_ITEMS[activeLookIndex].title}
                    </h3>
                  </div>

                  <p className="text-xs text-[#706B64] font-light leading-relaxed">
                    {LOOKBOOK_ITEMS[activeLookIndex].description}
                  </p>

                  <div className="space-y-2 pt-2 border-t border-[#DDD8CE]">
                    <span className="text-[10px] uppercase tracking-wider text-[#171717] font-semibold block">
                      Styled Items in this Editorial
                    </span>
                    {LOOKBOOK_ITEMS[activeLookIndex].items.map((item, i) => (
                      <div key={i} className="flex justify-between items-center p-3 bg-[#F4F1EA] border border-[#DDD8CE] text-xs">
                        <span className="font-medium text-[#171717]">{item.name}</span>
                        <span className="font-semibold text-[#171717]">{formatPrice(item.priceINR)}</span>
                      </div>
                    ))}
                  </div>

                  <div className="pt-2 flex flex-col gap-2">
                    <Link
                      to="/collections"
                      onClick={() => setLookbookModalOpen(false)}
                      className="w-full block py-3 text-center bg-[#171717] text-white text-xs uppercase tracking-widest font-medium hover:bg-black transition-colors"
                    >
                      Shop Featured Collection
                    </Link>
                    <a
                      href={LOOKBOOK_ITEMS[activeLookIndex].image}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-full block py-2.5 text-center border border-[#DDD8CE] text-[#171717] text-[10px] uppercase tracking-widest font-medium hover:bg-[#F4F1EA] transition-colors"
                    >
                      Inspect Master 4K Resolution ↗
                    </a>
                  </div>
                </div>
              </div>
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
                  We reject disposable, fleeting hype drops. Every silhouette is calibrated in our atelier using French Terry organic French Terry, combed cotton jersey, and micro-ribbed collars reinforced to resist distortion across years of wear.
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
      {/* 10. CUSTOMER REVIEWS */}
      {/* ------------------------------------------------------------- */}
      <section className="py-20 sm:py-28 bg-[#FFFFFF] border-y border-[#DDD8CE]">
        <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
          <div className="text-center max-w-2xl mx-auto mb-16">
            <span className="text-[11px] uppercase tracking-[0.3em] text-[#706B64] font-medium block mb-3">
              Verified Customer Reviews
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
            Member Access
          </span>
          <h2 className="font-serif text-3xl sm:text-5xl font-normal tracking-tight text-[#171717] mb-3">
            The Trevori Newsletter
          </h2>
          <p className="text-xs sm:text-sm text-[#706B64] font-light max-w-md mx-auto mb-8 leading-relaxed">
            Be the first to know about new collection drops, exclusive member sales, and seasonal lookbooks. No spam, ever.
          </p>

          {newsletterSuccess ? (
            <div className="p-4 bg-[#FFFFFF] border border-[#DDD8CE] text-xs text-[#171717] font-medium max-w-md mx-auto">
              ✓ Welcome to TREVORI! Check your inbox for your 15% welcome code.
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
