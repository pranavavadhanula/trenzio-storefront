import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Check, ArrowRight, Truck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', orderNumber: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-10 sm:py-20 max-w-5xl mx-auto px-6 sm:px-10 bg-[#07111E] text-white font-sans">
      <div className="text-center max-w-xl mx-auto mb-16">
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#F88379]/15 border border-[#F88379]/40 text-[#F88379] text-[10px] uppercase tracking-wider font-bold shadow-sm mb-3">
          <span className="w-1.5 h-1.5 rounded-full bg-[#F88379] animate-pulse" />
          <span>Client Concierge</span>
        </div>
        <h1 className="font-sans text-4xl sm:text-5xl font-extrabold text-white tracking-tight mt-1 mb-4">
          How May We Assist You?
        </h1>
        <p className="text-xs sm:text-sm text-[#94A3B8] font-normal leading-relaxed">
          Questions regarding size selection, your order doorstep tracking, or effortless size exchanges? Our team is available 7 days a week.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Direct Channels (5 Cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 bg-[#0B1A30] border border-[#1E3A66]/60 space-y-4 shadow-xl text-white">
            <h3 className="font-sans text-xl font-bold text-white">Direct Contact</h3>

            <div className="space-y-4 text-xs font-sans">
              <a
                href="mailto:trevori.shopping1@gmail.com"
                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-[#1E3A66] hover:border-[#F88379] text-white transition-colors block"
              >
                <Mail className="w-4 h-4 text-[#F88379] flex-shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] uppercase text-[#94A3B8] font-bold">Official Support</div>
                  <div className="text-[#F88379] font-bold">trevori.shopping1@gmail.com</div>
                </div>
              </a>

              <a
                href="https://wa.me/918247230602"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-[#1E3A66] hover:border-[#F88379] text-white transition-colors block"
              >
                <MessageSquare className="w-4 h-4 text-emerald-400 flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase text-[#94A3B8] font-bold">WhatsApp Concierge</div>
                  <div className="text-emerald-400 font-bold">+91 82472 30602</div>
                </div>
              </a>

              <a
                href="tel:+918247230602"
                className="flex items-center gap-3 p-3 bg-white/[0.03] border border-[#1E3A66] hover:border-[#F88379] text-white transition-colors block"
              >
                <Phone className="w-4 h-4 text-[#F88379] flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase text-[#94A3B8] font-bold">Direct Telephone</div>
                  <div className="text-white font-bold">+91 82472 30602</div>
                </div>
              </a>
            </div>
          </div>

          <div className="p-6 bg-[#0B1A30] border border-[#1E3A66]/60 space-y-3 text-xs text-[#94A3B8] font-normal shadow-xl">
            <div className="flex items-center gap-2 text-[#F88379] font-sans uppercase text-[10px] font-bold">
              <Truck className="w-3.5 h-3.5" />
              <span>Doorstep Delivery SLA</span>
            </div>
            <p>Orders dispatched via Blue Dart, Delhivery, or Xpressbees within 24–48 hours. Tracking SMS & WhatsApp alerts sent automatically.</p>
          </div>
        </div>

        {/* Message Form (7 Cols) */}
        <div className="md:col-span-7 p-8 bg-[#0B1A30] border border-[#1E3A66]/60 shadow-xl text-white">
          <h2 className="font-sans text-2xl text-white font-bold mb-6">
            Send an Inquiry
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-4">
              <div className="w-12 h-12 mx-auto rounded-full bg-emerald-950/80 border border-emerald-500/50 flex items-center justify-center text-emerald-400">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-sans text-xl text-white font-bold">Message Received</h3>
              <p className="text-xs text-[#94A3B8] max-w-sm mx-auto font-normal">
                Thank you for contacting Trevori. A client concierge will reply to your inquiry within 4 hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 font-sans">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#94A3B8] mb-1.5 font-bold">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full bg-white/[0.04] border border-[#1E3A66] px-4 py-3 text-xs text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#F88379] font-medium"
                    placeholder="e.g. Rahul Sharma"
                  />
                </div>
                <div>
                  <label className="block text-[10px] uppercase tracking-wider text-[#94A3B8] mb-1.5 font-bold">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full bg-white/[0.04] border border-[#1E3A66] px-4 py-3 text-xs text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#F88379] font-medium"
                    placeholder="e.g. rahul@example.com"
                  />
                </div>
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#94A3B8] mb-1.5 font-bold">
                  Order Number (Optional)
                </label>
                <input
                  type="text"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  className="w-full bg-white/[0.04] border border-[#1E3A66] px-4 py-3 text-xs text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#F88379]"
                  placeholder="#TRZ-XXXX"
                />
              </div>

              <div>
                <label className="block text-[10px] uppercase tracking-wider text-[#94A3B8] mb-1.5 font-bold">
                  Your Message
                </label>
                <textarea
                  required
                  rows={4}
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full bg-white/[0.04] border border-[#1E3A66] p-4 text-xs text-white placeholder:text-[#64748B] focus:outline-none focus:border-[#F88379]"
                  placeholder="How can we assist you with sizing, orders, or exchanges?"
                />
              </div>

              {/* Submit CTA */}
              <button
                type="submit"
                className="w-full py-4 bg-[#F88379] hover:bg-[#FA958D] text-white text-xs font-bold uppercase tracking-wider shadow-[0_4px_16px_rgba(248,131,121,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer font-sans"
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
