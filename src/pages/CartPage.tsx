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
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 bg-[#060C1A] text-[#FFFFFF]">
      <div className="mb-10 pb-6 border-b border-[#3B82F6]/20 flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-widest text-[#2563EB] font-mono font-bold">Shopping Bag</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-light text-[#FFFFFF] tracking-tight mt-1">
            Your Selected Pieces
          </h1>
        </div>
        <Link
          to="/collections/all"
          className="text-xs uppercase tracking-wider text-[#3B82F6] hover:text-[#2563EB] font-mono font-medium"
        >
          &larr; Continue Shopping
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="py-24 text-center border border-[#3B82F6]/25 p-8 sm:p-14 bg-[#0D1B3A] text-[#FFFFFF] space-y-4 max-w-xl mx-auto shadow-2xl backdrop-blur-xl">
          <div className="w-14 h-14 mx-auto rounded-full bg-white/[0.04] border border-[#2563EB]/40 flex items-center justify-center text-[#2563EB]">
            <ShoppingBag className="w-6 h-6" />
          </div>
          <h2 className="font-serif text-2xl sm:text-3xl text-white font-light">
            Your shopping bag is empty
          </h2>
          <p className="text-xs text-[#3B82F6] max-w-md mx-auto font-light leading-relaxed">
            Explore our 240–350 GSM heavyweight oversized streetwear tees and 400 GSM French Terry sweatshirts.
          </p>
          <div className="pt-4">
            <Link
              to="/collections/all"
              className="inline-flex items-center gap-2 px-8 py-3.5 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#FFFFFF] hover:to-[#2563EB] text-black text-xs uppercase tracking-widest font-black shadow-[0_0_20px_rgba(37,99,235,0.45)] transition-all cursor-pointer font-mono"
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
            <div className="bg-[#0D1B3A] p-4 border border-[#3B82F6]/20 shadow-xl text-[#FFFFFF]">
              <div className="flex justify-between text-xs text-[#3B82F6] mb-2 font-mono">
                <span className="flex items-center gap-1.5">
                  <Sparkles className="w-3.5 h-3.5 text-[#2563EB]" />
                  {remainingForFreeShipping === 0 ? (
                    <strong className="text-emerald-400 font-bold">Congratulations! You qualify for Free Pan-India Delivery</strong>
                  ) : (
                    <>Add <strong className="text-[#2563EB]">₹{remainingForFreeShipping}</strong> more for Free Delivery</>
                  )}
                </span>
                <span className="text-[#2563EB] font-bold">{progressPercent}%</span>
              </div>
              <div className="w-full bg-white/[0.05] h-1.5 overflow-hidden rounded-full">
                <div
                  className="bg-gradient-to-r from-[#2563EB] to-[#FFFFFF] h-full transition-all duration-500 shadow-[0_0_10px_rgba(37,99,235,0.5)]"
                  style={{ width: `${progressPercent}%` }}
                />
              </div>
            </div>

            {/* List */}
            <div className="border border-[#3B82F6]/20 divide-y divide-[#3B82F6]/15 bg-[#0D1B3A] text-[#FFFFFF] shadow-xl">
              {cart.map((item) => (
                <div key={item.cartItemId} className="p-6 flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between">
                  <div className="flex gap-4 items-center">
                    <img
                      src={item.product.images.primary}
                      alt={item.product.name}
                      className="w-20 h-24 object-contain bg-gradient-to-b from-white/[0.05] to-[#3B82F6]/[0.03] border border-[#3B82F6]/20 p-2"
                    />
                    <div>
                      <Link
                        to={`/products/${item.product.id}`}
                        className="font-serif text-lg text-white hover:text-[#2563EB] transition-colors block font-normal"
                      >
                        {item.product.name}
                      </Link>
                      <div className="text-xs text-[#3B82F6]/80 mt-1 font-mono space-x-2">
                        <span>Size: <strong className="text-white">{item.selectedSize}</strong></span>
                        <span>&bull;</span>
                        <span>Color: <strong className="text-white">{item.selectedColor}</strong></span>
                        <span>&bull;</span>
                        <span className="text-[#2563EB] font-bold">{item.product.gsm} GSM</span>
                      </div>
                      <div className="font-mono text-sm font-bold text-[#2563EB] mt-2 sm:hidden">
                        {formatPrice(item.product.priceINR * item.quantity)}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-6 w-full sm:w-auto justify-between sm:justify-end">
                    {/* Stepper */}
                    <div className="flex items-center border border-[#3B82F6]/25 bg-white/[0.04]">
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#FFFFFF] hover:bg-[#2563EB] hover:text-black cursor-pointer font-mono"
                      >
                        -
                      </button>
                      <span className="w-8 text-center text-xs font-mono font-bold text-white">
                        {item.quantity}
                      </span>
                      <button
                        onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                        className="w-8 h-8 flex items-center justify-center text-[#FFFFFF] hover:bg-[#2563EB] hover:text-black cursor-pointer font-mono"
                      >
                        +
                      </button>
                    </div>

                    {/* Price */}
                    <div className="font-mono text-base font-bold text-[#2563EB] min-w-[80px] text-right hidden sm:block">
                      {formatPrice(item.product.priceINR * item.quantity)}
                    </div>

                    {/* Remove */}
                    <button
                      onClick={() => removeFromCart(item.cartItemId)}
                      className="text-[#3B82F6]/60 hover:text-[#2563EB] p-1 transition-colors cursor-pointer"
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
            <div className="p-6 bg-[#0D1B3A] border border-[#3B82F6]/20 shadow-xl space-y-6 text-[#FFFFFF]">
              <h2 className="font-serif text-2xl text-white font-light border-b border-[#3B82F6]/20 pb-4">
                Order Summary
              </h2>

              {/* Promo code */}
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="Discount Code"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 bg-white/[0.04] border border-[#3B82F6]/25 px-3 py-2.5 text-xs text-[#FFFFFF] uppercase tracking-wider placeholder:text-[#3B82F6]/40 focus:outline-none focus:border-[#2563EB] font-mono"
                />
                <button
                  onClick={() => {
                    if (promoCode.trim().length > 0) setPromoApplied(true);
                  }}
                  className="px-4 py-2.5 border border-[#3B82F6]/25 text-[11px] uppercase tracking-wider text-[#FFFFFF] hover:bg-[#2563EB] hover:text-black hover:border-[#2563EB] transition-colors cursor-pointer font-mono font-bold"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="text-[11px] text-emerald-400 font-mono font-medium">
                  Code applied: Complimentary Premium Dust Bag Included
                </div>
              )}

              {/* Price rows */}
              <div className="space-y-3 border-t border-[#3B82F6]/20 pt-4 text-xs font-mono">
                <div className="flex justify-between text-[#3B82F6]">
                  <span>Subtotal</span>
                  <span className="font-bold text-white text-sm">{formatPrice(cartSubtotalINR)}</span>
                </div>
                <div className="flex justify-between text-[#3B82F6]">
                  <span>Shipping (India)</span>
                  <span className="text-[#2563EB] font-bold">
                    {remainingForFreeShipping === 0 ? 'FREE' : '₹99 (Add ₹' + remainingForFreeShipping + ' for Free)'}
                  </span>
                </div>
                <div className="flex justify-between text-[#3B82F6] border-t border-[#3B82F6]/20 pt-3 text-sm">
                  <span className="font-bold text-white uppercase">Estimated Total</span>
                  <span className="font-bold text-[#2563EB] text-lg">{formatPrice(cartSubtotalINR)}</span>
                </div>
              </div>

              {/* Error Notice */}
              {checkoutError && (
                <div className="p-3 bg-red-950/80 border border-red-500/50 text-red-200 text-xs flex items-start gap-2.5">
                  <AlertCircle className="w-4 h-4 text-rose-400 flex-shrink-0 mt-0.5" />
                  <div className="flex-1 space-y-1">
                    <p className="font-medium text-[11px] leading-relaxed">{checkoutError}</p>
                    <button
                      onClick={() => setCheckoutError(null)}
                      className="text-[10px] text-red-300 hover:underline cursor-pointer"
                    >
                      Dismiss
                    </button>
                  </div>
                </div>
              )}

              {/* Checkout CTA */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-gradient-to-r from-[#2563EB] to-[#3B82F6] hover:from-[#FFFFFF] hover:to-[#2563EB] text-black text-xs font-black uppercase tracking-widest shadow-[0_0_25px_rgba(37,99,235,0.45)] transition-all flex items-center justify-center gap-2 cursor-pointer disabled:opacity-50 font-mono"
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

              <div className="pt-2 flex flex-col items-center gap-1.5 text-[10px] text-[#3B82F6]/70 font-mono text-center">
                <div className="flex items-center gap-1.5 text-white">
                  <ShieldCheck className="w-3.5 h-3.5 text-[#2563EB]" />
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
