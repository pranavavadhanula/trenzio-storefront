import React, { useState } from 'react';
import { ArrowRight, Check, ShieldCheck, RefreshCw, Sparkles, Globe } from 'lucide-react';
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
    <footer className="bg-[#171717] text-[#DDD8CE] pt-20 pb-12 font-sans border-t border-[#DDD8CE]/20">
      <div className="max-w-7xl mx-auto px-6 sm:px-10 lg:px-12">
        {/* Editorial Trust & Craft Pillars */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-16 border-b border-white/10 text-xs">
          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B9AA96] font-medium block">
              TEXTILE EXCELLENCE
            </span>
            <div className="font-serif text-lg text-white">Combed Pure Cotton</div>
            <p className="text-[#DDD8CE]/70 text-[11px] leading-relaxed">
              Bio-washed luxury French Terry and pure cotton jersey for enduring architectural shape.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B9AA96] font-medium block">
              GLOBAL LOGISTICS
            </span>
            <div className="font-serif text-lg text-white">Express Dispatch</div>
            <p className="text-[#DDD8CE]/70 text-[11px] leading-relaxed">
              Orders packed within 24 hours. Express tracked transit across India and internationally.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B9AA96] font-medium block">
              OUR PROMISE
            </span>
            <div className="font-serif text-lg text-white">7-Day Exchanges</div>
            <p className="text-[#DDD8CE]/70 text-[11px] leading-relaxed">
              Seamless size exchanges and returns arranged directly through your account dashboard.
            </p>
          </div>

          <div className="space-y-1.5">
            <span className="text-[10px] tracking-[0.25em] uppercase text-[#B9AA96] font-medium block">
              SUSTAINABILITY
            </span>
            <div className="font-serif text-lg text-white">Zero Synthetic Fillers</div>
            <p className="text-[#DDD8CE]/70 text-[11px] leading-relaxed">
              100% natural organic cotton fibers, non-toxic dyes, and recyclable compostable packaging.
            </p>
          </div>
        </div>

        {/* Main Footer Directory Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 sm:gap-12 py-16 border-b border-white/10">
          {/* Brand Manifesto & Monogram */}
          <div className="lg:col-span-5 space-y-4">
            <Link to="/" className="inline-block">
              <span className="font-serif text-3xl sm:text-4xl text-white font-normal tracking-[0.25em] block">
                TREVORI
              </span>
            </Link>
            <p className="text-xs text-[#DDD8CE]/80 font-light max-w-sm leading-relaxed">
              Contemporary streetwear and luxury lifestyle fashion. Rooted in architectural brutalism, generous minimalist drape, and tactile garment engineering.
            </p>
            <div className="pt-2 text-xs text-[#B9AA96] space-y-1">
              <div>Customer Support: <a href="mailto:support@trevori.com" className="text-white hover:underline">support@trevori.com</a></div>
              <div>Headquarters: Milan &bull; Mumbai &bull; Tokyo</div>
            </div>
          </div>

          {/* Navigation Columns */}
          <div className="lg:col-span-2 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#B9AA96] font-medium">Collections</div>
            <ul className="space-y-2 text-xs text-[#DDD8CE]/80 font-light">
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">New Arrivals</Link>
              </li>
              <li>
                <Link to="/collections/men" className="hover:text-white transition-colors">Hoodies & Sweatshirts</Link>
              </li>
              <li>
                <Link to="/collections/men" className="hover:text-white transition-colors">Oversized T-Shirts</Link>
              </li>
              <li>
                <Link to="/collections" className="hover:text-white transition-colors">Tailored Pants</Link>
              </li>
              <li>
                <Link to="/collections/women" className="hover:text-white transition-colors">Women's Collection</Link>
              </li>
              <li>
                <a href="/#lookbook" className="hover:text-white transition-colors">Lookbook Volume IV</a>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-2 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#B9AA96] font-medium">About Trevori</div>
            <ul className="space-y-2 text-xs text-[#DDD8CE]/80 font-light">
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Brand Story</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Creative Direction</Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">Fabric Quality</Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">My Account</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Press Inquiries</Link>
              </li>
            </ul>
          </div>

          <div className="lg:col-span-3 space-y-3">
            <div className="text-[10px] uppercase tracking-[0.25em] text-[#B9AA96] font-medium">Customer Care</div>
            <ul className="space-y-2 text-xs text-[#DDD8CE]/80 font-light">
              <li>
                <Link to="/account" className="hover:text-white transition-colors">Order Tracking</Link>
              </li>
              <li>
                <Link to="/account" className="hover:text-white transition-colors">Returns & Exchanges</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Size Guide & Fit Assistance</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Concierge WhatsApp</Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">Store Locator</Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Editorial Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between text-[11px] text-[#DDD8CE]/60 gap-4">
          <div>
            &copy; {new Date().getFullYear()} TREVORI STUDIOS INC. ALL RIGHTS RESERVED.
          </div>
          <div className="flex items-center space-x-6">
            <span className="hover:text-white transition-colors cursor-pointer">Privacy Policy</span>
            <span>&bull;</span>
            <span className="hover:text-white transition-colors cursor-pointer">Terms of Service</span>
            <span>&bull;</span>
            <span className="hover:text-white transition-colors cursor-pointer">Supply Chain Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
