import React, { useState } from 'react';
import { Mail, Phone, MessageSquare, Check, Truck } from 'lucide-react';

export const ContactPage: React.FC = () => {
  const [submitted, setSubmitted] = useState(false);
  const [formData, setFormData] = useState({ name: '', email: '', orderNumber: '', message: '' });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div className="min-h-screen py-12 sm:py-20 max-w-5xl mx-auto px-6 sm:px-10 lg:px-12 bg-[#F4F1EA] text-[#171717] font-sans">
      <div className="text-center max-w-xl mx-auto mb-16">
        <span className="text-[10px] uppercase tracking-[0.3em] text-[#B9AA96] font-semibold block mb-2">
          Customer Support
        </span>
        <h1 className="font-serif text-4xl sm:text-5xl font-normal text-[#171717] tracking-tight mb-4">
          How Can We Help?
        </h1>
        <p className="text-xs sm:text-sm text-[#706B64] font-light leading-relaxed">
          Questions regarding sizing, orders, shipping, or 7-day doorstep size exchanges? Our team is here to assist you.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-12 gap-10">
        {/* Direct Channels (5 Cols) */}
        <div className="md:col-span-5 space-y-6">
          <div className="p-6 bg-[#FFFFFF] border border-[#DDD8CE] space-y-4">
            <h3 className="font-serif text-xl font-normal text-[#171717]">Contact Us Directly</h3>

            <div className="space-y-3 text-xs">
              <a
                href="mailto:concierge@trevori.com"
                className="flex items-center gap-3 p-3 bg-[#F4F1EA] border border-[#DDD8CE] hover:border-[#171717] text-[#171717] transition-colors block"
              >
                <Mail className="w-4 h-4 text-[#B9AA96] flex-shrink-0" />
                <div className="truncate">
                  <div className="text-[10px] uppercase text-[#706B64] font-medium">Email Desk</div>
                  <div className="font-semibold text-[#171717]">concierge@trevori.com</div>
                </div>
              </a>

              <a
                href="https://wa.me/918247230602"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-3 p-3 bg-[#F4F1EA] border border-[#DDD8CE] hover:border-[#171717] text-[#171717] transition-colors block"
              >
                <MessageSquare className="w-4 h-4 text-[#B9AA96] flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase text-[#706B64] font-medium">WhatsApp Priority</div>
                  <div className="font-semibold text-[#171717]">+91 82472 30602</div>
                </div>
              </a>

              <a
                href="tel:+918247230602"
                className="flex items-center gap-3 p-3 bg-[#F4F1EA] border border-[#DDD8CE] hover:border-[#171717] text-[#171717] transition-colors block"
              >
                <Phone className="w-4 h-4 text-[#B9AA96] flex-shrink-0" />
                <div>
                  <div className="text-[10px] uppercase text-[#706B64] font-medium">Telephone Direct</div>
                  <div className="font-semibold text-[#171717]">+91 82472 30602</div>
                </div>
              </a>
            </div>
          </div>

          <div className="p-6 bg-[#FFFFFF] border border-[#DDD8CE] space-y-2 text-xs text-[#706B64] font-light">
            <div className="flex items-center gap-2 text-[#171717] uppercase text-[10px] font-semibold">
              <Truck className="w-3.5 h-3.5 text-[#B9AA96]" />
              <span>Dispatch SLA</span>
            </div>
            <p>Orders packed within 24 hours. Express air courier transit with live tracking alerts sent via SMS and WhatsApp.</p>
          </div>
        </div>

        {/* Message Form (7 Cols) */}
        <div className="md:col-span-7 p-8 bg-[#FFFFFF] border border-[#DDD8CE]">
          <h2 className="font-serif text-2xl text-[#171717] font-normal mb-6">
            Send Us a Message
          </h2>

          {submitted ? (
            <div className="py-12 text-center space-y-3">
              <div className="w-12 h-12 mx-auto rounded-full bg-[#F4F1EA] border border-[#DDD8CE] flex items-center justify-center text-[#171717]">
                <Check className="w-6 h-6" />
              </div>
              <h3 className="font-serif text-xl text-[#171717]">Message Sent</h3>
              <p className="text-xs text-[#706B64] max-w-sm mx-auto font-light leading-relaxed">
                Thank you for contacting TREVORI. Our customer care team will respond within 4 business hours.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">
                    Your Name
                  </label>
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>
                <div>
                  <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full px-3 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                  />
                </div>
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">
                  Order Number (Optional)
                </label>
                <input
                  type="text"
                  placeholder="e.g. TRV-2026-8942"
                  value={formData.orderNumber}
                  onChange={(e) => setFormData({ ...formData, orderNumber: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
              </div>

              <div>
                <label className="text-[10px] uppercase tracking-wider text-[#706B64] block mb-1 font-medium">
                  Message
                </label>
                <textarea
                  rows={5}
                  required
                  placeholder="How can our atelier assist you?"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  className="w-full px-3 py-2.5 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717] focus:outline-none focus:border-[#171717]"
                />
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-[#171717] text-white hover:bg-[#333333] transition-colors text-xs uppercase tracking-[0.2em] font-medium cursor-pointer"
              >
                Send Message
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
};
