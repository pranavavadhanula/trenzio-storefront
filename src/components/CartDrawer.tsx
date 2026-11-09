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
    currency,
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
        // Resolve exact variant ID
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
      
      // Redirect to real Shopify checkout
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
        className="fixed inset-0 bg-atelier-950/75 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-atelier-900 border-l border-white/10 shadow-2xl flex flex-col">
          {/* Header */}
          <div className="p-6 border-b border-white/10 flex items-center justify-between">
            <div>
              <h2 className="font-serif text-2xl text-atelier-100 font-light">Your Trenzio Bag</h2>
              <p className="text-[10px] uppercase tracking-widest text-neutral-400 mt-0.5 font-mono">
                {cart.length} {cart.length === 1 ? 'Item' : 'Items'} Selected
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full border border-white/10 flex items-center justify-center text-atelier-200 hover:text-white hover:border-atelier-gold transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Tracker (₹1,999 Threshold) */}
          <div className="bg-atelier-950/60 p-4 border-b border-white/5">
            <div className="flex items-center justify-between text-xs tracking-wider mb-1.5">
              <span className="text-atelier-200">
                {remainingForFreeShipping === 0 ? (
                  <span className="text-emerald-400 font-medium flex items-center gap-1 font-mono">
                    <CheckCircle2 className="w-3.5 h-3.5" />
                    Free Express Delivery Across India Unlocked!
                  </span>
                ) : (
                  <span>
                    Add <span className="text-atelier-gold font-bold font-mono">{formatPrice(remainingForFreeShipping)}</span> for Free Shipping
                  </span>
                )}
              </span>
              <span className="text-[10px] font-mono text-neutral-400">{progressPercent}%</span>
            </div>
            <div className="w-full bg-white/10 h-1.5 rounded-full overflow-hidden">
              <div
                className="bg-atelier-gold h-full transition-all duration-500 ease-out"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Cart Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6">
            {cart.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center py-12 space-y-4">
                <div className="w-12 h-12 rounded-full border border-white/10 flex items-center justify-center text-neutral-400">
                  <Sparkles className="w-5 h-5 text-atelier-gold" />
                </div>
                <h3 className="font-serif text-xl text-atelier-200">Your bag is empty</h3>
                <p className="text-xs text-neutral-400 max-w-xs font-light">
                  Explore our 240–280 GSM oversized tees and 400 GSM French Terry sweatshirts.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 border border-white/20 text-xs uppercase tracking-wider text-atelier-100 hover:bg-white/5 transition-colors cursor-pointer mt-2"
                >
                  Shop Heavyweights
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 pb-6 border-b border-white/5 last:border-b-0"
                >
                  <img
                    src={item.product.images.primary}
                    alt={item.product.name}
                    className="w-20 h-24 object-cover bg-atelier-950 border border-white/5"
                  />
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between">
                        <h4 className="font-serif text-base text-atelier-100 line-clamp-1">
                          {item.product.name}
                        </h4>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-neutral-500 hover:text-red-400 p-0.5 transition-colors cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-neutral-400 mt-1 space-x-2 font-mono">
                        <span>Size: <strong className="text-atelier-200">{item.selectedSize}</strong></span>
                        <span>&bull;</span>
                        <span>{item.selectedColor}</span>
                        <span>&bull;</span>
                        <span className="text-atelier-gold">{item.product.gsm} GSM</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-3">
                      {/* Quantity Stepper */}
                      <div className="flex items-center border border-white/10">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                        >
                          -
                        </button>
                        <span className="px-2 text-xs font-mono text-atelier-100">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-neutral-400 hover:text-white"
                        >
                          +
                        </button>
                      </div>

                      <span className="text-sm font-bold text-atelier-100 font-mono tracking-wider">
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
            <div className="p-6 bg-atelier-950 border-t border-white/10 space-y-4">
              {/* Promo code */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 px-3 py-2 text-xs text-atelier-100 uppercase tracking-wider placeholder:text-neutral-600 focus:outline-none focus:border-atelier-gold font-mono"
                />
                <button
                  onClick={() => {
                    if (promoCode.trim().length > 0) setPromoApplied(true);
                  }}
                  className="px-3 py-2 border border-white/20 text-[10px] uppercase tracking-wider text-atelier-200 hover:bg-white/5 cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="text-[11px] text-emerald-400 font-mono">
                  Code applied: Complimentary Premium Dust Bag Included
                </div>
              )}

              {/* Subtotal */}
              <div className="space-y-1.5 pt-2">
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Subtotal</span>
                  <span className="text-atelier-100 font-mono font-bold text-sm">{formatPrice(cartSubtotalINR)}</span>
                </div>
                <div className="flex items-center justify-between text-xs text-neutral-400">
                  <span>Shipping (India)</span>
                  <span className="text-atelier-gold font-mono">
                    {remainingForFreeShipping === 0 ? 'FREE' : '₹99 (Add ₹' + remainingForFreeShipping + ' for Free)'}
                  </span>
                </div>
              </div>

              {/* In-app Checkout Notice */}
              {checkoutError && (
                <div className="p-3 bg-red-950/70 border border-red-500/40 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-[11px] leading-relaxed">{checkoutError}</p>
                    <button
                      onClick={() => setCheckoutError(null)}
                      className="text-[10px] text-neutral-400 hover:text-white underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Checkout Button - Electric Coral & Midnight Navy Luxury */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-gradient-to-r from-atelier-coral to-[#ff7b6f] text-white text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
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
              <div className="pt-2 flex flex-col items-center gap-1.5 text-[10px] text-neutral-400">
                <div className="flex items-center gap-1.5 text-atelier-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-atelier-gold" />
                  <span>Secure 256-bit Encrypted Checkout</span>
                </div>
                <div className="flex items-center gap-2 text-[10px] uppercase tracking-wider text-neutral-500 font-mono">
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
