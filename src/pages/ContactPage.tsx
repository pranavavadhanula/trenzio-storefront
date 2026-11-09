import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Check, ArrowRight, ShieldCheck, Truck, RotateCcw } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', orderNumber: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-10 sm:py-20 max-w-5xl mx-auto px-6 sm:px-10">
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] text-atelier-gold font-mono font-medium">
          Client Concierge
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-light text-atelier-100 tracking-tight mt-2 mb-4">
          How May We Assist You?
        </h1>
        <p className="text-xs sm:text-sm text-neutral-300 font-light leading-relaxed">
          Questions regarding size selection, your Printrove doorstep tracking, or effortless size exchanges? Our team is available 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Direct Channels (5 Cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 bg-atelier-900 border border-white/10 space-y-4">
            <h3 className="font-serif text-xl text-atelier-100">Direct Contact</h3>

            <div className="space-y-4 text-xs font-mono">
              <a
                href="mailto:trenzio.shopping1@gmail.com"
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:border-atelier-gold/40 text-neutral-300 hover:text-white transition-colors block"
              >
                <Mail className="w-4 h-4 text-atelier-gold flex-shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] uppercase text-neutral-500">Official Support</div>
                  <div className="text-atelier-gold font-bold">trenzio.shopping1@gmail.com</div>
                </div>
              </a>

              <a
                href="https://wa.me/918247230602"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:border-atelier-gold/40 text-neutral-300 hover:text-white transition-colors block"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase text-neutral-500">WhatsApp Concierge</div>
                  <div className="text-emerald-400 font-bold">+91 82472 30602</div>
                </div>
              </a>

              <a
                href="tel:+918247230602"
                className="flex items-center gap-3 p-3 bg-white/5 border border-white/5 hover:border-atelier-gold/40 text-neutral-300 hover:text-white transition-colors block"
              >
                <Phone className="w-4 h-4 text-atelier-gold flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase text-neutral-500">Direct Telephone</div>
                  <div className="text-atelier-100 font-bold">+91 82472 30602</div>
                </div>
              </a>
            </div>
          </div>

          <div className="p-6 bg-white/[0.02] border border-white/10 space-y-3 text-xs text-neutral-400 font-light">
            <div className="flex items-center gap-2 text-atelier-gold font-mono uppercase text-[10px]">
              <Truck className="w-3.5 h-3.5" />
              <span>Doorstep Delivery SLA</span>
            </div>
            <p>Orders dispatched via Blue Dart, Delhivery, or Xpressbees within 24–48 hours. Tracking SMS & WhatsApp alerts sent automatically.</p>
          </div>
        </div>

        {/* Message Form (7 Cols) */}
        <div className="md:col-span-7 p-8 bg-atelier-900 border border-white/10 shadow-2xl">
          <h2 className="font-serif text-2xl text-atelier-100 font-light mb-6">
            Send an Inquiry
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950 border border-emerald-500/40 flex items-center justify-center text-emerald-400">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-atelier-100">Message Received</h3>
              <p className="text-xs text-neutral-400 max-w-sm mx-auto">
                Thank you for contacting Trenzio. A client concierge will reply to your inquiry within 4 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-mono">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-atelier-100 placeholder:text-neutral-600 focus:outline-none focus:border-atelier-gold"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-mono">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-atelier-100 placeholder:text-neutral-600 focus:outline-none focus:border-atelier-gold"
                    placeholder="e.g. rahul@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-mono">
                  Order Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 px-4 py-3 text-xs text-atelier-100 placeholder:text-neutral-600 focus:outline-none focus:border-atelier-gold font-mono"
                  placeholder="#TRZ-XXXX"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-neutral-400 mb-1.5 font-mono">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/5 border border-white/10 p-4 text-xs text-atelier-100 placeholder:text-neutral-600 focus:outline-none focus:border-atelier-gold"
                  placeholder="How can we assist you with sizing, orders, or exchanges?"
                />
              </div>

              {/* Submit CTA - Pure Luxury Gold, No Stark White */}
              <button
                type="submit"
                className="w-full py-4 bg-gradient-to-r from-atelier-gold to-[#b39369] text-atelier-950 text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-black/40 transition-all flex items-center justify-center gap-2 cursor-pointer font-mono"
              >
                <span>Dispatch Inquiry</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
