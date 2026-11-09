import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, Sparkles, AlertCircle } from 'lucide-react';
import { createShopifyCheckout } from '../services/shopify';

export const CartPage: React.FC = () => {
  const {
    cart,
    removeFromCart,
    updateQuantity,
    cartSubtotalINR,
    formatPrice,
  } = useShop();

  const [isCheckingOut, setIsCheckingOut] = useState(false);
  const [checkoutError, setCheckoutError] = useState<string | null>(null);
  const [promoCode, setPromoCode] = useState('');
  const [promoApplied, setPromoApplied] = useState(false);

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
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10">
      <div className="mb-10 pb-6 border-b border-white/10 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-atelier-gold font-mono">Shopping Bag</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-atelier-100 tracking-tight mt-1">
            Your Selected Pieces
          </h1>
        </div>
        <Link
          to="/collections/all"
          className="text-xs uppercase tracking-wider text-neutral-400 hover:text-atelier-gold font-mono"
        >
          &larr; Continue Shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="py-24 text-center border border-white/10 p-8 sm:p-14 bg-atelier-900/40 space-y-4 max-w-xl mx-auto">
          <div className="w-14 h-14 mx-auto rounded-full bg-atelier-950 border border-white/10 flex items-center justify-center text-neutral-400">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-atelier-100 font-light">
            Your shopping bag is empty
          </h2>
          <p className="text-xs text-neutral-400 max-w-md mx-auto font-light leading-relaxed">
            Explore our 240–350 GSM heavyweight oversized streetwear tees and 400 GSM French Terry sweatshirts.
          </p>
          <div className="pt-4">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-atelier-gold to-[#b39369] text-atelier-950 text-xs uppercase tracking-widest font-bold hover:brightness-110 shadow-lg shadow-black/40 transition-all cursor-pointer"
            >
              <span>Explore Heavyweight Catalog</span>
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Cart Items (8 Cols) */}
          <div className="lg:col-span-8 space-y-6">
            {/* Free shipping progress */}
            <div className="bg-atelier-900/60 p-4 border border-white/10">
              <div className="flex justify-between text-xs text-neutral-300 mb-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-atelier-gold" />
                  {remainingForFreeShipping === 0 ? (
                    <strong className="text-emerald-400 font-normal">Congratulations! You qualify for Free Pan-India Delivery</strong>
                  ) : (
                    <>Add <strong>₹{remainingForFreeShipping}</strong> more for Free Delivery</>
                  )}
                </span>
                <span className="text-atelier-gold font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-white/5 h-1.5 overflow-hidden">
                <div
                  className="bg-gradient-to-r from-atelier-gold to-emerald-400 h-full transition-all duration-500"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* List */}
            <div className="border border-white/10 divide-y divide-white/10 bg-atelier-900/30">
              {cart.map((item) => (
                <div key={item.cartItemId} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.product.images.primary}
                      alt={item.product.name}
                      className="w-20 h-24 object-contain bg-atelier-950 border border-white/10 p-2"
                    />
                    <div>
                      <Link
                        to={`/products/${item.product.id}`}
                        className="font-serif text-lg text-atelier-100 hover:text-atelier-gold transition-colors block"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-xs text-neutral-400 mt-1 font-mono space-x-2">
                        <span>Size: <strong className="text-atelier-200">{item.selectedSize}</strong></span>
                        <span>&bull;</span>
                        <span>Color: <strong className="text-atelier-200">{item.selectedColor}</strong></span>
                        <span>&bull;</span>
                        <span className="text-atelier-gold">{item.product.gsm} GSM</span>
                      </div>
                      <div className="font-mono text-sm font-bold text-atelier-100 mt-2 sm:hidden">
                        {formatPrice(item.product.priceINR * item.quantity)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Stepper */}
                    <div className="flex items-center border border-white/20">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:bg-white/10 cursor-pointer font-mono"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-atelier-100">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-neutral-300 hover:bg-white/10 cursor-pointer font-mono"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="font-mono text-base font-bold text-atelier-100 min-w-[80px] text-right hidden sm:block">
                      {formatPrice(item.product.priceINR * item.quantity)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-neutral-500 hover:text-rose-400 p-1 transition-colors cursor-pointer"
                      title="Remove from bag"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Summary (4 Cols) */}
          <div className="lg:col-span-4 space-y-6">
            <div className="p-6 bg-atelier-900 border border-white/10 shadow-2xl space-y-6">
              <h2 className="font-serif text-2xl text-atelier-100 font-light border-b border-white/10 pb-4">
                Order Summary
              </h2>

              {/* Promo code */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white/5 border border-white/10 px-3 py-2.5 text-xs text-atelier-100 uppercase tracking-wider placeholder:text-neutral-600 focus:outline-none focus:border-atelier-gold font-mono"
                />
                <button
                  onClick={() => {
                    if (promoCode.trim().length > 0) setPromoApplied(true);
                  }}
                  className="px-4 py-2.5 border border-atelier-gold/40 text-[11px] uppercase tracking-wider text-atelier-gold hover:bg-atelier-gold hover:text-atelier-950 transition-colors cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="text-[11px] text-emerald-400 font-mono">
                  Code applied: Complimentary Premium Dust Bag Included
                </div>
              )}

              {/* Price rows */}
              <div className="space-y-3 border-t border-white/10 pt-4 text-xs font-mono">
                <div className="flex justify-between text-neutral-300">
                  <span>Subtotal</span>
                  <span className="font-bold text-atelier-100 text-sm">{formatPrice(cartSubtotalINR)}</span>
                </div>
                <div className="flex justify-between text-neutral-300">
                  <span>Shipping (India)</span>
                  <span className="text-atelier-gold">
                    {remainingForFreeShipping === 0 ? 'FREE' : '₹99 (Add ₹' + remainingForFreeShipping + ' for Free)'}
                  </span>
                </div>
                <div className="flex justify-between text-neutral-300 border-t border-white/10 pt-3 text-sm">
                  <span className="font-bold text-atelier-100 uppercase">Estimated Total</span>
                  <span className="font-bold text-atelier-gold text-lg">{formatPrice(cartSubtotalINR)}</span>
                </div>
              </div>

              {/* Error Notice */}
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

              {/* Checkout CTA - Pure Luxury Gold, No Stark White */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-gradient-to-r from-atelier-gold via-[#d4b38a] to-atelier-gold text-atelier-950 text-xs font-bold uppercase tracking-widest hover:brightness-110 shadow-lg shadow-black/40 transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50"
              >
                {isCheckingOut ? (
                  <span>Opening Shopify Checkout...</span>
                ) : (
                  <>
                    <span>Proceed to Checkout</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>

              <div className="pt-2 flex flex-col items-center gap-1.5 text-[10px] text-neutral-400 font-mono text-center">
                <div className="flex items-center gap-1.5 text-atelier-300">
                  <ShieldCheck className="w-3.5 h-3.5 text-atelier-gold" />
                  <span>Encrypted 256-Bit Shopify Checkout</span>
                </div>
                <span>UPI &bull; Credit & Debit Cards &bull; Cash on Delivery</span>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
