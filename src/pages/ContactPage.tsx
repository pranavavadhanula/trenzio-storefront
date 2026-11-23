import React, { useState, useMemo } from 'react';
import { Search, ChevronDown, ChevronUp, ChevronRight, MessageSquare, Bot, Sparkles, Truck, RefreshCw, ShieldCheck, ArrowRight, Check } from 'lucide-react';
import { Link } from 'react-router-dom';

interface FAQItem {
  id: string;
  category: string;
  question: string;
  answer: string;
  actionText?: string;
  actionLink?: string;
  isPopular?: boolean;
}

export const ContactPage: React.FC = () => {
  const [activeCategory, setActiveCategory] = useState<string>('orders');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [expandedId, setExpandedId] = useState<string | null>('ord-1');

  const FAQ_DATA: FAQItem[] = [
    // Orders, Delivery & Payment
    {
      id: 'ord-1',
      category: 'orders',
      question: 'How do I check the status of my order?',
      answer:
        'You can check the live tracking status of your order anytime through your Trevori Account Dashboard under the "Order Tracking" section. In addition, automated live tracking alerts with courier dispatch links are sent directly via SMS and WhatsApp as soon as your garment is packed.',
      actionText: 'Go to Order Tracking',
      actionLink: '/account',
      isPopular: true,
    },
    {
      id: 'ord-2',
      category: 'orders',
      question: 'What are the delivery timelines across India?',
      answer:
        'All orders are tailored and dispatched within 24 business hours from our fulfillment hub. Metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai) receive delivery within 2–3 business days. Rest of India delivers within 3–5 business days. Express air shipping is complimentary on all prepaid orders.',
      isPopular: false,
    },
    {
      id: 'ord-3',
      category: 'orders',
      question: 'Which payment methods does TREVORI accept?',
      answer:
        'We support all major payment options via secure 256-bit encrypted gateways: UPI (Google Pay, PhonePe, Paytm, CRED), Credit & Debit Cards (Visa, Mastercard, RuPay, American Express), Net Banking across 50+ banks, and Cash on Delivery (COD) for eligible pin codes.',
      isPopular: false,
    },

    // Cancellations
    {
      id: 'can-1',
      category: 'cancellations',
      question: 'Can I cancel or modify my order after placing it?',
      answer:
        'Yes. You can cancel or modify your order within 3 hours of placement before it enters our automated packaging and air courier dispatch stream. To cancel, visit your Account Dashboard or message our Concierge on WhatsApp with your Order ID.',
      actionText: 'View Active Orders',
      actionLink: '/account',
      isPopular: true,
    },
    {
      id: 'can-2',
      category: 'cancellations',
      question: 'Can I change my delivery address or phone number?',
      answer:
        'If your order has not yet been collected by the courier, our Concierge desk can instantly update your shipping address and contact number. Please connect with our WhatsApp team for immediate assistance.',
      isPopular: false,
    },

    // Refunds & Returns
    {
      id: 'ref-1',
      category: 'refunds',
      question: 'What is TREVORI’s 7-Day Doorstep Exchange Policy?',
      answer:
        'We offer a seamless 7-day complimentary doorstep size exchange on all garments. If the drape, shoulder drop, or chest fit is not perfect, we arrange reverse pickup from your address at zero extra fee and dispatch your replacement size.',
      actionText: 'Request Size Exchange',
      actionLink: '/account',
      isPopular: true,
    },
    {
      id: 'ref-2',
      category: 'refunds',
      question: 'How long do refunds take to reflect in my bank account?',
      answer:
        'For prepaid orders, refunds are credited back to your original source of payment within 48 to 72 business hours after reverse pickup inspection. If you choose instant Store Credit in your Personal Vault, you also receive an additional 5% bonus credit.',
      isPopular: false,
    },

    // Personal Vault & Credits
    {
      id: 'vault-1',
      category: 'vault',
      question: 'What is the Personal Vault and how do Store Credits work?',
      answer:
        'Your Personal Vault stores your curated wishlist pieces and member store credits. During checkout, available store credits can be redeemed with a single tap to instantly offset your order total.',
      actionText: 'Open Personal Vault',
      actionLink: '/wishlist',
      isPopular: true,
    },
    {
      id: 'vault-2',
      category: 'vault',
      question: 'Do TREVORI store credits have an expiration date?',
      answer:
        'No, Trevori store credits never expire. They remain safely stored in your account and can be utilized across any future collection drop or runway release.',
      isPopular: false,
    },

    // My Account & Sizing
    {
      id: 'acc-1',
      category: 'account',
      question: 'How do I find my perfect TREVORI silhouette and size?',
      answer:
        'Our contemporary menswear and womenswear feature generous boxy, drop-shoulder tailoring. You can consult our interactive Size Guide Modal on any product page, experience our 3D Virtual Try-On studio, or ask our 24/7 AI Stylist for bespoke fit advice based on your height and weight.',
      actionText: 'Explore 3D Virtual Try-On',
      actionLink: '/try-on',
      isPopular: true,
    },
    {
      id: 'acc-2',
      category: 'account',
      question: 'How do I access my account without remembering a password?',
      answer:
        'You can sign in with one tap using Google OAuth on our Login Page. You will be authenticated immediately without needing a password.',
      actionText: 'Go to Member Login',
      actionLink: '/login',
      isPopular: false,
    },

    // Offers and Combos
    {
      id: 'offers-1',
      category: 'offers',
      question: 'What offers and coupon codes are currently active?',
      answer:
        'Use code PREPAID100 for Flat ₹100 OFF on all prepaid/UPI orders above ₹1,499. You can also use code TREVORI200 for ₹200 OFF on eligible orders. Noir VIP members enjoy an automatic 15% privilege discount on all capsules.',
      isPopular: true,
    },

    // Noir VIP Membership
    {
      id: 'member-1',
      category: 'membership',
      question: 'What privileges are included in TREVORI Noir Membership?',
      answer:
        'Noir Members enjoy 15% off all collections, complimentary priority express air shipping on every order, early 24-hour access to limited runway releases, and 1-on-1 private styling via WhatsApp.',
      actionText: 'View Member Dashboard',
      actionLink: '/account',
      isPopular: true,
    },
  ];

  // Filter FAQs based on search or category
  const filteredFAQs = useMemo(() => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      return FAQ_DATA.filter(
        (item) => item.question.toLowerCase().includes(q) || item.answer.toLowerCase().includes(q)
      );
    }
    return FAQ_DATA.filter((item) => item.category === activeCategory);
  }, [searchQuery, activeCategory]);

  const toggleAccordion = (id: string) => {
    setExpandedId((prev) => (prev === id ? null : id));
  };

  const handleOpenAIWidget = () => {
    // Trigger floating concierge widget button or scroll to it
    const widgetBtn = document.querySelector('[aria-label="Open Trevori Concierge"]') as HTMLElement;
    if (widgetBtn) {
      widgetBtn.click();
    } else {
      window.location.href = '/ai-stylist';
    }
  };

  return (
    <div className="min-h-screen bg-[#F4F1EA] text-[#171717] font-sans selection:bg-[#DDD8CE] selection:text-[#171717] py-8 sm:py-14 px-4 sm:px-6 lg:px-8">
      <div className="max-w-5xl mx-auto space-y-8 sm:space-y-12">
        
        {/* ========================================================= */}
        {/* TOP HERO HELP & QUICK CONTACT BANNER (TREVORI STYLE)     */}
        {/* ========================================================= */}
        <div className="relative bg-[#FFFFFF] rounded-2xl sm:rounded-3xl border border-[#DDD8CE] p-6 sm:p-10 shadow-sm overflow-hidden">
          
          {/* Subtle luxury mesh & decorative background watermark */}
          <div className="absolute inset-0 bg-[radial-gradient(ellipse_at_top_right,rgba(212,175,55,0.06),transparent_65%)] pointer-events-none" />

          {/* Paper Airplane In Flight Vector Graphic (Luxury Origami Style) */}
          <div className="absolute right-4 sm:right-10 top-4 sm:top-6 pointer-events-none hidden md:block">
            <svg width="240" height="130" viewBox="0 0 240 130" fill="none" xmlns="http://www.w3.org/2000/svg" className="opacity-90">
              {/* Dotted Trajectory Curve */}
              <path
                d="M10 115 C 60 115, 80 85, 120 90 C 150 95, 160 55, 195 40"
                stroke="#C5A880"
                strokeWidth="1.75"
                strokeDasharray="4 5"
                strokeLinecap="round"
                className="opacity-75"
              />
              {/* Airplane Shadow */}
              <ellipse cx="205" cy="110" rx="16" ry="4" fill="#171717" fillOpacity="0.08" />
              {/* Origami Paper Airplane */}
              <g transform="translate(170, 15) rotate(5)">
                {/* Main wing body */}
                <polygon points="50,15 0,38 20,44" fill="#D4AF37" />
                <polygon points="50,15 20,44 26,56" fill="#F59E0B" />
                <polygon points="50,15 26,56 42,48" fill="#EAB308" />
                {/* Fold crease */}
                <path d="M50 15 L20 44" stroke="#B45309" strokeWidth="1" />
                {/* Shading wing underside */}
                <polygon points="20,44 26,56 22,50" fill="#B45309" />
              </g>
            </svg>
          </div>

          <div className="relative z-10 max-w-2xl">
            {/* Subtitle */}
            <span className="text-[11px] uppercase tracking-[0.22em] text-[#706B64] font-medium block mb-1.5">
              Hello there! • Trevori Atelier Care
            </span>

            {/* Headline */}
            <h1 className="font-serif text-3xl sm:text-4xl lg:text-[42px] font-normal text-[#171717] tracking-tight mb-6">
              Need help? Talk to us!
            </h1>

            {/* Two Quick Action Contact Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 sm:gap-4 mb-8">
              
              {/* 1. WhatsApp Atelier Card */}
              <a
                href="https://wa.me/918247230602"
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-[#25D366]/40 hover:border-[#25D366] hover:bg-emerald-50/30 transition-all duration-200 shadow-sm cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#25D366]/15 flex items-center justify-center text-[#25D366] shrink-0 group-hover:scale-105 transition-transform">
                    <MessageSquare className="w-5 h-5 fill-[#25D366]" />
                  </div>
                  <div className="text-left">
                    <div className="text-sm font-semibold text-[#171717] group-hover:text-[#25D366] transition-colors leading-snug">
                      WhatsApp Us
                    </div>
                    <div className="text-[11px] text-[#706B64] font-normal">
                      We're here 24/7 • Instant help
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#706B64] group-hover:text-[#25D366] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </a>

              {/* 2. Smart AI Stylist Assistant Card */}
              <button
                type="button"
                onClick={handleOpenAIWidget}
                className="group flex items-center justify-between p-3.5 sm:p-4 rounded-xl bg-white border border-[#EAB308]/50 hover:border-[#D4AF37] hover:bg-amber-50/30 transition-all duration-200 shadow-sm cursor-pointer text-left"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-full bg-[#F59E0B]/20 flex items-center justify-center text-[#D97706] shrink-0 group-hover:scale-105 transition-transform">
                    <Bot className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="text-sm font-semibold text-[#171717] group-hover:text-[#D97706] transition-colors leading-snug flex items-center gap-1.5">
                      <span>Smart Assistant</span>
                      <span className="text-[9px] uppercase px-1.5 py-0.2 bg-[#F59E0B]/15 text-[#B45309] font-mono rounded">AI</span>
                    </div>
                    <div className="text-[11px] text-[#706B64] font-normal">
                      Instant sizing & styling 24/7
                    </div>
                  </div>
                </div>
                <ChevronRight className="w-4 h-4 text-[#706B64] group-hover:text-[#D97706] group-hover:translate-x-0.5 transition-all shrink-0 ml-2" />
              </button>

            </div>

            {/* Frequently Asked Questions Search Header */}
            <div>
              <div className="text-sm sm:text-base font-semibold text-[#171717] mb-2.5">
                Frequently Asked Questions!
              </div>

              {/* Interactive Search Bar */}
              <div className="relative w-full">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search FAQ's, tracking, sizing, returns..."
                  className="w-full bg-[#FFFFFF] text-[#171717] placeholder-[#706B64]/70 text-xs sm:text-sm pl-10 pr-20 py-2.5 sm:py-3 rounded-lg border border-[#DDD8CE] focus:border-[#171717] focus:outline-none transition-all shadow-none"
                />
                <Search className="w-4 h-4 text-[#706B64] absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                {searchQuery && (
                  <button
                    type="button"
                    onClick={() => setSearchQuery('')}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[10px] text-[#706B64] hover:text-[#171717] uppercase tracking-wider px-1.5 py-0.5 font-medium"
                  >
                    Clear
                  </button>
                )}
              </div>
            </div>

          </div>
        </div>

        {/* ========================================================= */}
        {/* BOTTOM SECTION: CATEGORY SIDEBAR & FAQ ACCORDION          */}
        {/* ========================================================= */}
        <div className="grid grid-cols-1 md:grid-cols-12 gap-8 lg:gap-12 pt-2">
          
          {/* LEFT SIDEBAR: CATEGORY NAVIGATION (5 Cols) */}
          <div className="md:col-span-5 space-y-6">
            
            {/* Group 1: Orders, Delivery & Payments */}
            <div className="space-y-2">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-[#F59E0B] rounded-full" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#171717]">
                  Orders, Delivery & Payments
                </h3>
              </div>

              <div className="space-y-1 pl-3 text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('orders');
                    setSearchQuery('');
                  }}
                  className={`w-full text-left py-2 px-3 rounded-md transition-all cursor-pointer font-medium ${
                    activeCategory === 'orders' && !searchQuery
                      ? 'text-[#2563EB] bg-blue-50/50 font-semibold'
                      : 'text-[#706B64] hover:text-[#171717] hover:bg-white/60'
                  }`}
                >
                  Orders, Delivery & Payment
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('cancellations');
                    setSearchQuery('');
                  }}
                  className={`w-full text-left py-2 px-3 rounded-md transition-all cursor-pointer font-medium ${
                    activeCategory === 'cancellations' && !searchQuery
                      ? 'text-[#2563EB] bg-blue-50/50 font-semibold'
                      : 'text-[#706B64] hover:text-[#171717] hover:bg-white/60'
                  }`}
                >
                  Cancellations & Modifications
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('refunds');
                    setSearchQuery('');
                  }}
                  className={`w-full text-left py-2 px-3 rounded-md transition-all cursor-pointer font-medium ${
                    activeCategory === 'refunds' && !searchQuery
                      ? 'text-[#2563EB] bg-blue-50/50 font-semibold'
                      : 'text-[#706B64] hover:text-[#171717] hover:bg-white/60'
                  }`}
                >
                  Refunds & 7-Day Exchanges
                </button>
              </div>
            </div>

            {/* Group 2: More Queries related to */}
            <div className="space-y-2 pt-4 border-t border-[#DDD8CE]/60">
              <div className="flex items-center gap-2 mb-3">
                <div className="w-1 h-4 bg-[#F59E0B] rounded-full" />
                <h3 className="text-xs uppercase tracking-[0.2em] font-bold text-[#171717]">
                  More Queries related to
                </h3>
              </div>

              <div className="space-y-1 pl-3 text-xs sm:text-sm">
                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('vault');
                    setSearchQuery('');
                  }}
                  className={`w-full text-left py-2 px-3 rounded-md transition-all cursor-pointer font-medium ${
                    activeCategory === 'vault' && !searchQuery
                      ? 'text-[#2563EB] bg-blue-50/50 font-semibold'
                      : 'text-[#706B64] hover:text-[#171717] hover:bg-white/60'
                  }`}
                >
                  My Trevori Vault & Credits
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('account');
                    setSearchQuery('');
                  }}
                  className={`w-full text-left py-2 px-3 rounded-md transition-all cursor-pointer font-medium ${
                    activeCategory === 'account' && !searchQuery
                      ? 'text-[#2563EB] bg-blue-50/50 font-semibold'
                      : 'text-[#706B64] hover:text-[#171717] hover:bg-white/60'
                  }`}
                >
                  My Account & Sizing Guidance
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('offers');
                    setSearchQuery('');
                  }}
                  className={`w-full text-left py-2 px-3 rounded-md transition-all cursor-pointer font-medium ${
                    activeCategory === 'offers' && !searchQuery
                      ? 'text-[#2563EB] bg-blue-50/50 font-semibold'
                      : 'text-[#706B64] hover:text-[#171717] hover:bg-white/60'
                  }`}
                >
                  Offers, Coupons & Vouchers
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setActiveCategory('membership');
                    setSearchQuery('');
                  }}
                  className={`w-full text-left py-2 px-3 rounded-md transition-all cursor-pointer font-medium ${
                    activeCategory === 'membership' && !searchQuery
                      ? 'text-[#2563EB] bg-blue-50/50 font-semibold'
                      : 'text-[#706B64] hover:text-[#171717] hover:bg-white/60'
                  }`}
                >
                  Noir VIP Membership Privileges
                </button>
              </div>
            </div>

            {/* Direct Atelier Concierge SLA Card */}
            <div className="p-5 rounded-xl bg-white border border-[#DDD8CE] space-y-2.5 text-xs">
              <div className="flex items-center gap-2 text-[#171717] font-semibold text-[11px] uppercase tracking-wider">
                <ShieldCheck className="w-4 h-4 text-[#D4AF37]" />
                <span>Atelier Concierge Promise</span>
              </div>
              <p className="text-[#706B64] leading-relaxed font-light">
                Every inquiry is handled by our dedicated client styling desk. Response time is under 15 minutes during active atelier hours.
              </p>
              <div className="text-[11px] text-[#171717] font-medium pt-1">
                Direct Email: <a href="mailto:concierge@trevori.com" className="underline hover:text-[#B9AA96]">concierge@trevori.com</a>
              </div>
            </div>

          </div>

          {/* RIGHT COLUMN: ACCORDION QUERIES & ANSWERS (7 Cols) */}
          <div className="md:col-span-7 space-y-6">
            
            {/* Header label for Right Section */}
            <div className="flex items-center justify-between border-b border-[#DDD8CE] pb-3">
              <h2 className="text-sm uppercase tracking-[0.2em] font-bold text-[#171717]">
                {searchQuery ? `Search Results for "${searchQuery}"` : 'Frequently Asked Questions'}
              </h2>
              <span className="text-[11px] text-[#706B64] font-mono">
                {filteredFAQs.length} {filteredFAQs.length === 1 ? 'Question' : 'Questions'}
              </span>
            </div>

            {/* Popular/Key Query (Clean Question Row with Arrow like in reference) */}
            {!searchQuery && filteredFAQs.find((f) => f.isPopular) && (
              <div className="bg-white rounded-xl border border-[#DDD8CE] overflow-hidden shadow-xs">
                {(() => {
                  const pop = filteredFAQs.find((f) => f.isPopular)!;
                  const isExp = expandedId === pop.id;
                  return (
                    <div className="divide-y divide-[#DDD8CE]/60">
                      <button
                        type="button"
                        onClick={() => toggleAccordion(pop.id)}
                        className="w-full flex items-center justify-between p-4 sm:p-5 text-left hover:bg-[#F4F1EA]/50 transition-colors cursor-pointer"
                      >
                        <span className="text-sm sm:text-base font-medium text-[#171717] pr-4">
                          {pop.question}
                        </span>
                        <ChevronRight
                          className={`w-4 h-4 text-[#706B64] shrink-0 transition-transform duration-200 ${
                            isExp ? 'rotate-90 text-[#171717]' : ''
                          }`}
                        />
                      </button>

                      {isExp && (
                        <div className="p-4 sm:p-5 bg-[#F4F1EA]/40 text-xs sm:text-sm text-[#706B64] leading-relaxed space-y-3">
                          <p>{pop.answer}</p>
                          {pop.actionText && pop.actionLink && (
                            <Link
                              to={pop.actionLink}
                              className="inline-flex items-center gap-1.5 text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#B9AA96] transition-colors"
                            >
                              <span>{pop.actionText}</span>
                              <ArrowRight className="w-3.5 h-3.5" />
                            </Link>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>
            )}

            {/* "More queries related to" Label */}
            <div className="pt-2">
              <div className="text-xs uppercase tracking-[0.2em] font-bold text-[#171717] mb-3">
                {searchQuery ? 'Matching Inquiries' : 'More queries related to this topic'}
              </div>

              {/* Accordion List */}
              <div className="space-y-2.5">
                {filteredFAQs.map((faq) => {
                  const isExpanded = expandedId === faq.id;
                  return (
                    <div
                      key={faq.id}
                      className="bg-white rounded-xl border border-[#DDD8CE] overflow-hidden transition-all duration-200 shadow-2xs hover:border-[#B9AA96]/60"
                    >
                      <button
                        type="button"
                        onClick={() => toggleAccordion(faq.id)}
                        className="w-full flex items-center justify-between p-4 sm:p-4.5 text-left cursor-pointer hover:bg-[#F4F1EA]/30 transition-colors"
                      >
                        <span className="text-xs sm:text-sm font-medium text-[#171717] pr-3">
                          {faq.question}
                        </span>
                        <span className="shrink-0 text-[#706B64]">
                          {isExpanded ? (
                            <ChevronUp className="w-4 h-4 text-[#171717]" />
                          ) : (
                            <ChevronDown className="w-4 h-4" />
                          )}
                        </span>
                      </button>

                      {isExpanded && (
                        <div className="px-4 pb-4.5 pt-1 text-xs sm:text-[13px] text-[#706B64] leading-relaxed border-t border-[#DDD8CE]/50 space-y-3 bg-[#F4F1EA]/25">
                          <p>{faq.answer}</p>
                          {faq.actionText && faq.actionLink && (
                            <div className="pt-1">
                              <Link
                                to={faq.actionLink}
                                className="inline-flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-[#171717] hover:text-[#B9AA96] transition-colors"
                              >
                                <span>{faq.actionText}</span>
                                <ArrowRight className="w-3.5 h-3.5" />
                              </Link>
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}

                {filteredFAQs.length === 0 && (
                  <div className="p-8 text-center bg-white rounded-xl border border-[#DDD8CE] space-y-3">
                    <p className="text-xs text-[#706B64]">
                      No specific queries matched "{searchQuery}".
                    </p>
                    <button
                      type="button"
                      onClick={() => setSearchQuery('')}
                      className="px-4 py-2 bg-[#171717] text-white text-xs uppercase tracking-wider font-medium rounded cursor-pointer"
                    >
                      Clear Search
                    </button>
                  </div>
                )}
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
};
