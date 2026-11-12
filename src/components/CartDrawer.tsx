import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, ArrowRight, Sparkles, CheckCircle2, AlertCircle } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createShopifyCheckout } from '../services/shopify';

export const CartDrawer: React.FC = () => {
  const {
    cart,
    isCartOpen,
    setIsCartOpen,
    removeFromCart,
    updateQuantity,
    cartSubtotalINR,
    formatPrice,
  } = useShop();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

  if (!isCartOpen) return null;

  // Free shipping threshold in India (₹1,999)
  const freeShippingThresholdINR = 1999;
  const progressPercent = Math.min(100, Math.round((cartSubtotalINR / freeShippingThresholdINR) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThresholdINR - cartSubtotalINR);

  const handleCheckout = async () => {
    setIsCheckingOut(true);
    setCheckoutError(null);
    try {
      const lineItems = cart.map((item) => {
        const matchedVariant = item.product.variants?.find(
          (v) =>
            v.size.toLowerCase() === item.selectedSize.toLowerCase() &&
            v.color.toLowerCase() === item.selectedColor.toLowerCase()
        );
        const resolvedId =
          item.selectedVariantId ||
          matchedVariant?.id ||
          (item.product.id.startsWith('prod_') ? '44119548559395' : item.product.id);

        return {
          variantId: resolvedId,
          quantity: item.quantity,
        };
      });

      const checkoutUrl = await createShopifyCheckout(lineItems, 'IN');
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error(err);
      setCheckoutError(
        err?.message || 'Unable to open Shopify checkout. Please check that your store checkout is unlocked.'
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-[#08080A]/80 backdrop-blur-md transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-[#0E0F14] border-l border-white/15 shadow-2xl flex flex-col text-[#F3F4F8]">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-[#F3F4F8] font-light">Your Trenzio Bag</h2>
              <p className="text-[10px] uppercase tracking-widest text-[#A0AAB8] mt-0.5 font-mono">
                {cart.length} {cart.length === 1 ? 'Item' : 'Items'} Selected
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full border border-white/15 flex items-center justify-center text-[#F3F4F8] hover:text-[#D4FF00] hover:border-[#D4FF00] transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Tracker (₹1,999 Threshold) */}
          <div className="bg-white/[0.02] p-4 border-b border-white/10">
            <div className="flex items-center justify-between text-xs tracking-wider mb-1.5">
              <span className="text-[#F3F4F8]">
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Free Express Delivery Across India Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <span className="text-[#D4FF00] font-bold font-mono">{formatPrice(remainingForFreeShipping)}</span> for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-[10px] font-mono text-[#A0AAB8]">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#111216] h-1.5 rounded-full overflow-hidden border border-white/10">
              <div
                className="bg-[#D4FF00] h-full transition-all duration-500 ease-out shadow-[0_0_8px_rgba(212,255,0,0.5)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full border border-white/15 flex items-center justify-center text-[#A0AAB8]">
                  <Sparkles className="w-5 h-5 text-[#D4FF00]" />
                </div>
                <h3 className="font-serif text-xl text-[#F3F4F8]">Your bag is empty</h3>
                <p className="text-xs text-[#A0AAB8] max-w-xs font-light">
                  Explore our 240–350 GSM oversized tees and luxury heavyweight streetwear.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 border border-[#D4FF00] text-xs uppercase tracking-wider text-[#D4FF00] hover:bg-[#D4FF00] hover:text-black transition-colors cursor-pointer mt-2 font-mono font-bold"
                >
                  Shop Heavyweights
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 pb-6 border-b border-white/10 last:border-b-0"
                >
                  <img
                    src={item.product.images.primary}
                    alt={item.product.name}
                    className="w-20 h-24 object-contain bg-gradient-to-b from-white/[0.06] to-white/[0.02] border border-white/15"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-base text-[#F3F4F8] line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-[#A0AAB8] hover:text-[#D4FF00] p-0.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#A0AAB8] mt-1 space-x-2 font-mono">
                        <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                        <span>&bull;</span>
                        <span>{item.selectedColor}</span>
                        <span>&bull;</span>
                        <span className="text-[#D4FF00] font-bold">{item.product.gsm} GSM</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-white/15 bg-white/[0.03]">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#A0AAB8] hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono text-[#F3F4F8] font-bold">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#A0AAB8] hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-[#D4FF00] font-mono tracking-wider">
                        {formatPrice(item.product.priceINR * item.quantity)}
                      </span>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer & Checkout */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#0E0F14] border-t border-white/10 space-y-4">
              {/* Promo code */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white/[0.04] border border-white/15 px-3 py-2 text-xs text-[#F3F4F8] uppercase tracking-wider placeholder:text-[#A0AAB8]/40 focus:outline-none focus:border-[#D4FF00] font-mono"
                />
                <button
                  onClick={() => {
                    if (promoCode.trim().length > 0) setPromoApplied(true);
                  }}
                  className="px-3 py-2 border border-white/15 text-[10px] uppercase tracking-wider text-[#F3F4F8] hover:bg-[#D4FF00] hover:text-black hover:border-[#D4FF00] transition-colors cursor-pointer font-mono font-bold"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="text-[11px] text-emerald-400 font-mono font-medium">
                  Code applied: Complimentary Premium Dust Bag Included
                </div>
              )}

              {/* Subtotal */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-[#A0AAB8]">
                  <span>Subtotal</span>
                  <span className="text-[#F3F4F8] font-mono font-bold text-sm">{formatPrice(cartSubtotalINR)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-[#A0AAB8]">
                  <span>Shipping (India)</span>
                  <span className="text-[#D4FF00] font-mono font-bold">
                    {remainingForFreeShipping === 0 ? 'FREE' : '₹99 (Add ₹' + remainingForFreeShipping + ' for Free)'}
                  </span>
                </div>
              </div>

              {/* In-app Checkout Notice */}
              {checkoutError && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-[11px] leading-relaxed">{checkoutError}</p>
                    <button
                      onClick={() => setCheckoutError(null)}
                      className="text-[10px] text-red-300 hover:text-white underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Checkout Button - Electric Lime & Ink Black */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-[#D4FF00] hover:bg-[#C2F000] text-black text-xs font-black uppercase tracking-widest shadow-[0_0_25px_rgba(212,255,0,0.4)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-mono"
              >
                {isCheckingOut ? (
                  <span>Opening Secure Checkout...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              {/* Trust Badges for India */}
              <div className="pt-2 flex flex-col items-center gap-1.5 text-[10px] text-[#A0AAB8] font-mono">
                <div className="flex items-center gap-1.5 text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#D4FF00]" />
                  <span>Secure 256-bit Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-[#A0AAB8] font-mono">
                  <span>UPI / GPay</span>
                  <span>&bull;</span>
                  <span>Paytm</span>
                  <span>&bull;</span>
                  <span>Credit/Debit</span>
                  <span>&bull;</span>
                  <span>Cash on Delivery</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
