import React, { useState } from 'react';
import { ArrowRight, Check, Truck, RotateCcw, ShieldCheck } from 'lucide-react';
import { Link } from 'react-router-dom';

export const Footer: React.FC = () => {
  const [email, setEmail] = useState('');
  const [subscribed, setSubscribed] = useState(false);

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (email) {
      setSubscribed(true);
      setEmail('');
    }
  };

  return (
    <footer className="bg-[#060C1A] text-white border-t border-[#1E293B] pt-16 pb-12">
      <div className="max-w-7xl mx-auto px-6 sm:px-10">
        {/* Top 3 Trust Columns for Indian D2C Buyers */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 pb-14 border-b border-[#1E293B] text-xs">
          <div className="flex items-center gap-3 p-4 bg-[#0D1B3A]/60 border border-[#2563EB]/20 backdrop-blur-md">
            <Truck className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">Free Pan-India Delivery</div>
              <div className="text-[#94A3B8] text-[11px] mt-0.5">Dispatched within 24 hours &bull; Delivered in 3-5 days</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#0D1B3A]/60 border border-[#2563EB]/20 backdrop-blur-md">
            <RotateCcw className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">Easy 7-Day Size Exchanges</div>
              <div className="text-[#94A3B8] text-[11px] mt-0.5">Hassle-free doorstep pickup across 19,000+ pin codes</div>
            </div>
          </div>

          <div className="flex items-center gap-3 p-4 bg-[#0D1B3A]/60 border border-[#2563EB]/20 backdrop-blur-md">
            <ShieldCheck className="w-5 h-5 text-[#3B82F6] flex-shrink-0" />
            <div>
              <div className="font-bold text-white uppercase tracking-wider text-[11px]">UPI & Cash on Delivery</div>
              <div className="text-[#94A3B8] text-[11px] mt-0.5">Pay securely via GPay, PhonePe, Cards or COD</div>
            </div>
          </div>
        </div>

        {/* Brand & Links Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 py-12 border-b border-[#1E293B]">
          {/* Brand info */}
          <div className="lg:col-span-5 space-y-3">
            <Link to="/" className="inline-block">
              <h2 className="font-serif text-3xl text-white font-light tracking-[0.3em] hover:text-[#3B82F6] transition-colors">
                TRENZIO
              </h2>
            </Link>
            <p className="text-xs text-[#94A3B8] font-light max-w-sm leading-relaxed">
              India's premium heavyweight streetwear brand. Crafting 240–350 GSM oversized tees and 400 GSM French Terry sweatshirts for men and women. Designed and crafted in India.
            </p>
            <div className="text-xs text-[#3B82F6] pt-2 font-mono flex flex-wrap gap-x-4 gap-y-1">
              <span>
                Email: <a href="mailto:trenzio.shopping1@gmail.com" className="underline hover:text-white transition-colors">trenzio.shopping1@gmail.com</a>
              </span>
              <span>&bull;</span>
              <span>
                WhatsApp: <a href="https://wa.me/918247230602" target="_blank" rel="noopener noreferrer" className="underline hover:text-white transition-colors">+91 82472 30602</a>
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="lg:col-span-2 space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-[#3B82F6] font-mono font-bold">Collections</div>
            <ul className="space-y-1.5 text-xs text-[#94A3B8]">
              <li>
                <Link to="/collections/oversized-tees" className="hover:text-[#3B82F6] transition-colors">Oversized Tees</Link>
              </li>
              <li>
                <Link to="/collections/sweatshirts" className="hover:text-[#3B82F6] transition-colors">Sweatshirts</Link>
              </li>
              <li>
                <Link to="/collections/classic-tees" className="hover:text-[#3B82F6] transition-colors">Classic Tees</Link>
              </li>
              <li>
                <Link to="/collections/men" className="hover:text-[#3B82F6] transition-colors">Men's Fit</Link>
              </li>
              <li>
                <Link to="/collections/women" className="hover:text-[#3B82F6] transition-colors">Women's Fit</Link>
              </li>
              <li>
                <Link to="/collections/all" className="hover:text-[#3B82F6] transition-colors">View All Drops</Link>
              </li>
            </ul>
          </div>

          {/* Company Links */}
          <div className="lg:col-span-2 space-y-2">
            <div className="text-[10px] uppercase tracking-widest text-[#3B82F6] font-mono font-bold">Trenzio</div>
            <ul className="space-y-1.5 text-xs text-[#94A3B8]">
              <li>
                <Link to="/about" className="hover:text-[#3B82F6] transition-colors">About Our Craft</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-[#3B82F6] transition-colors">Contact & Support</Link>
              </li>
              <li>
                <Link to="/cart" className="hover:text-[#3B82F6] transition-colors">Shopping Bag</Link>
              </li>
              <li>
                <Link to="/wishlist" className="hover:text-[#3B82F6] transition-colors">Saved Wishlist</Link>
              </li>
              <li>
                <a
                  href="https://0g1xp7-qd.myshopify.com"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white transition-colors text-[#3B82F6] font-bold"
                >
                  Official Shopify Store &rarr;
                </a>
              </li>
            </ul>
          </div>

          {/* Newsletter Box */}
          <div className="lg:col-span-3 flex flex-col justify-center">
            <span className="text-[10px] uppercase tracking-[0.25em] text-[#3B82F6] font-mono font-bold">
              Join The Club
            </span>
            <h3 className="font-serif text-lg text-white font-light mt-1 mb-2">
              Get ₹200 Off on First Order
            </h3>

            {subscribed ? (
              <div className="flex items-center gap-2 p-3 bg-white/5 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                <Check className="w-4 h-4" />
                <span>Code "TRENZIO200" activated!</span>
              </div>
            ) : (
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter email..."
                  required
                  className="flex-1 bg-white/[0.04] border border-[#2563EB]/25 px-3 py-2.5 text-xs text-white placeholder:text-[#94A3B8]/40 focus:outline-none focus:border-[#3B82F6] font-mono"
                />
                <button
                  type="submit"
                  className="px-4 py-2.5 bg-gradient-to-r from-[#2563EB] to-[#1D4ED8] hover:from-[#3B82F6] hover:to-[#2563EB] text-white text-xs uppercase tracking-wider font-black shadow-[0_0_15px_rgba(37,99,235,0.4)] transition-all flex items-center gap-1 cursor-pointer font-mono"
                >
                  <span>Claim</span>
                  <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </form>
            )}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] font-mono text-[#64748B] gap-3">
          <div>
            &copy; {new Date().getFullYear()} TRENZIO LUXURY APPAREL. All rights reserved.
          </div>
          <div className="flex items-center gap-4">
            <Link to="/about" className="hover:text-[#3B82F6]">Made in India</Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-[#3B82F6]">Privacy Policy</Link>
            <span>&bull;</span>
            <Link to="/contact" className="hover:text-[#3B82F6]">Terms of Service</Link>
          </div>
        </div>
      </div>
    </footer>
  );
};