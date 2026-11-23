import React, { useState } from 'react';
import { X, Trash2, ShieldCheck, ArrowRight, CheckCircle2, AlertCircle, Tag } from 'lucide-react';
import { useShop } from '../context/ShopContext';
import { createShopifyCheckout } from '../services/shopify';

interface ValidCoupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  description: string;
  minSubtotal?: number;
}

const VALID_COUPONS: Record<string, ValidCoupon> = {
  'TREVORI15': {
    code: 'TREVORI15',
    type: 'percent',
    value: 15,
    description: 'VIP Atelier 15% discount',
  },
  'VIP15': {
    code: 'VIP15',
    type: 'percent',
    value: 15,
    description: 'VIP Member 15% discount',
  },
  'TREVORI-VIP-NOIR': {
    code: 'TREVORI-VIP-NOIR',
    type: 'percent',
    value: 15,
    description: 'VIP Noir 15% privilege discount',
  },
  'TREVORI200': {
    code: 'TREVORI200',
    type: 'flat',
    value: 200,
    description: 'Flat ₹200 drop discount',
    minSubtotal: 1000,
  },
  'WINTER200': {
    code: 'WINTER200',
    type: 'flat',
    value: 200,
    description: 'Flat ₹200 Winterwear discount',
    minSubtotal: 1000,
  },
  'TREVORI500': {
    code: 'TREVORI500',
    type: 'flat',
    value: 500,
    description: 'Flat ₹500 Atelier Winter discount',
    minSubtotal: 2000,
  },
  'WINTER500': {
    code: 'WINTER500',
    type: 'flat',
    value: 500,
    description: 'Flat ₹500 Winterwear discount',
    minSubtotal: 2000,
  },
  'PREPAID100': {
    code: 'PREPAID100',
    type: 'flat',
    value: 100,
    description: 'Flat ₹100 prepaid offer',
    minSubtotal: 1499,
  },
};

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
  const [appliedCoupon, setAppliedCoupon] = useState<ValidCoupon | null>(null);
  const [promoError, setPromoError] = useState<string | null>(null);

  if (!isCartOpen) return null;

  // Free shipping threshold in India (₹2,000)
  const freeShippingThresholdINR = 2000;
  const progressPercent = Math.min(100, Math.round((cartSubtotalINR / freeShippingThresholdINR) * 100));
  const remainingForFreeShipping = Math.max(0, freeShippingThresholdINR - cartSubtotalINR);

  // Discount calculation
  const discountAmount = appliedCoupon
    ? appliedCoupon.type === 'percent'
      ? Math.round((cartSubtotalINR * appliedCoupon.value) / 100)
      : Math.min(cartSubtotalINR, appliedCoupon.value)
    : 0;

  const shippingCost = remainingForFreeShipping === 0 ? 0 : 150;
  const estimatedTotal = Math.max(0, cartSubtotalINR - discountAmount + shippingCost);

  const handleApplyPromo = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    const cleanCode = promoCode.trim().toUpperCase();
    setPromoError(null);

    if (!cleanCode) {
      setPromoError('Please enter a coupon code.');
      setAppliedCoupon(null);
      return;
    }

    const matched = VALID_COUPONS[cleanCode];
    if (!matched) {
      setPromoError(`"${cleanCode}" is invalid. Please enter a valid coupon code (e.g. TREVORI15).`);
      setAppliedCoupon(null);
      return;
    }

    if (matched.minSubtotal && cartSubtotalINR < matched.minSubtotal) {
      setPromoError(`Code ${cleanCode} requires a minimum order of ${formatPrice(matched.minSubtotal)}.`);
      setAppliedCoupon(null);
      return;
    }

    setAppliedCoupon(matched);
  };

  const handleRemovePromo = () => {
    setAppliedCoupon(null);
    setPromoError(null);
    setPromoCode('');
  };

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

      const checkoutUrl = await createShopifyCheckout(lineItems, 'IN', appliedCoupon?.code);
      window.location.href = checkoutUrl;
    } catch (err: any) {
      console.error(err);
      setCheckoutError(
        err?.message || 'Unable to open checkout session. Please try again.'
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 overflow-hidden font-sans">
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-opacity"
        onClick={() => setIsCartOpen(false)}
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-0 sm:pl-10">
        <div className="w-screen max-w-md bg-[#F4F1EA] border-l border-[#DDD8CE] shadow-2xl flex flex-col text-[#171717]">
          {/* Header */}
          <div className="p-6 border-b border-[#DDD8CE] flex items-center justify-between bg-[#FFFFFF]">
            <div>
              <h2 className="font-serif text-2xl text-[#171717] font-normal">Shopping Bag</h2>
              <p className="text-[10px] uppercase tracking-widest text-[#706B64] mt-0.5">
                {cart.length} {cart.length === 1 ? 'Item' : 'Items'} In Bag
              </p>
            </div>
            <button
              onClick={() => setIsCartOpen(false)}
              className="w-8 h-8 rounded-full border border-[#DDD8CE] flex items-center justify-center text-[#171717] hover:bg-[#171717] hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>

          {/* Free Shipping Tracker */}
          <div className="bg-[#FFFFFF] p-4 border-b border-[#DDD8CE]">
            <div className="flex items-center justify-between text-xs tracking-wider mb-1.5">
              <span className="text-[#706B64] text-[11px]">
                {remainingForFreeShipping === 0 ? (
                  <strong className="text-[#171717]">✓ Complimentary Express Shipping Unlocked</strong>
                ) : (
                  <>
                    Add <strong className="text-[#171717]">{formatPrice(remainingForFreeShipping)}</strong> for Complimentary Express Shipping
                  </>
                )}
              </span>
              <span className="text-[10px] text-[#706B64] font-semibold">{progressPercent}%</span>
            </div>
            <div className="w-full bg-[#DDD8CE] h-1">
              <div
                className="bg-[#171717] h-1 transition-all duration-300"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>

          {/* Items List */}
          <div className="flex-1 overflow-y-auto p-6 space-y-4">
            {cart.length === 0 ? (
              <div className="py-20 text-center space-y-4">
                <p className="font-serif text-2xl text-[#171717]">Your shopping bag is empty.</p>
                <p className="text-xs text-[#706B64] max-w-xs mx-auto leading-relaxed">
                  Discover our signature hoodies, shirts, drop-shoulder tees, and streetwear essentials.
                </p>
                <button
                  onClick={() => setIsCartOpen(false)}
                  className="px-6 py-2.5 bg-[#171717] text-white text-xs uppercase tracking-widest font-medium"
                >
                  Explore Collection
                </button>
              </div>
            ) : (
              cart.map((item) => (
                <div
                  key={item.cartItemId}
                  className="flex gap-4 p-4 bg-[#FFFFFF] border border-[#DDD8CE]"
                >
                  {/* Thumbnail */}
                  <div className="w-20 h-24 bg-[#F4F1EA] border border-[#DDD8CE] overflow-hidden flex-shrink-0 flex items-center justify-center p-2">
                    <img
                      src={item.product.images.primary}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>

                  {/* Info */}
                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="flex items-start justify-between gap-2">
                        <h3 className="text-xs font-semibold text-[#171717] line-clamp-1">
                          {item.product.name}
                        </h3>
                        <button
                          onClick={() => removeFromCart(item.cartItemId)}
                          className="text-[#706B64] hover:text-red-600 transition-colors cursor-pointer"
                          title="Remove item"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>

                      <div className="text-[11px] text-[#706B64] mt-1">
                        Size: <strong className="text-[#171717]">{item.selectedSize}</strong> &bull; Color: <strong className="text-[#171717]">{item.selectedColor}</strong>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-2">
                      {/* Quantity Controller */}
                      <div className="flex items-center border border-[#DDD8CE]">
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                          className="px-2 py-0.5 text-xs text-[#706B64] hover:text-[#171717] transition-colors"
                        >
                          -
                        </button>
                        <span className="px-2 py-0.5 text-xs font-semibold text-[#171717]">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                          className="px-2 py-0.5 text-xs text-[#706B64] hover:text-[#171717] transition-colors"
                        >
                          +
                        </button>
                      </div>

                      <div className="text-xs font-semibold text-[#171717]">
                        {formatPrice(item.product.priceINR * item.quantity)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Checkout Footer */}
          {cart.length > 0 && (
            <div className="p-6 bg-[#FFFFFF] border-t border-[#DDD8CE] space-y-4">
              {/* Promo code form */}
              <form onSubmit={handleApplyPromo} className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <input
                      type="text"
                      placeholder="PROMO CODE (e.g. TREVORI15)"
                      value={promoCode}
                      onChange={(e) => {
                        setPromoCode(e.target.value);
                        if (promoError) setPromoError(null);
                      }}
                      className="w-full px-3 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717] uppercase tracking-wider focus:outline-none focus:border-[#171717]"
                    />
                    <Tag className="w-3.5 h-3.5 text-[#706B64] absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" />
                  </div>
                  {appliedCoupon ? (
                    <button
                      type="button"
                      onClick={handleRemovePromo}
                      className="px-3.5 py-2 bg-[#F4F1EA] hover:bg-red-50 text-red-600 border border-red-200 text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
                    >
                      Remove
                    </button>
                  ) : (
                    <button
                      type="submit"
                      className="px-4 py-2 bg-[#171717] hover:bg-[#333333] text-white text-xs uppercase tracking-wider font-medium transition-colors cursor-pointer"
                    >
                      Apply
                    </button>
                  )}
                </div>

                {/* Validation Error: Invalid code or subtotal requirement */}
                {promoError && (
                  <div className="p-2.5 bg-red-50 border border-red-200 text-xs text-red-700 flex items-center gap-1.5 animate-fade-in-subtle">
                    <AlertCircle className="w-3.5 h-3.5 flex-shrink-0 text-red-600" />
                    <span>{promoError}</span>
                  </div>
                )}

                {/* Success: Valid code applied */}
                {appliedCoupon && (
                  <div className="p-2.5 bg-emerald-50 border border-emerald-200 text-xs text-emerald-800 flex items-center justify-between animate-fade-in-subtle">
                    <div className="flex items-center gap-1.5">
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600 flex-shrink-0" />
                      <span>{appliedCoupon.description} applied</span>
                    </div>
                    <span className="font-semibold text-emerald-700">-{formatPrice(discountAmount)}</span>
                  </div>
                )}
              </form>

              {/* Subtotal & Breakdown */}
              <div className="space-y-1.5 text-xs text-[#706B64]">
                <div className="flex justify-between">
                  <span>Subtotal</span>
                  <span className="font-semibold text-[#171717]">{formatPrice(cartSubtotalINR)}</span>
                </div>

                {appliedCoupon && discountAmount > 0 && (
                  <div className="flex justify-between text-emerald-700 font-medium">
                    <span>Discount ({appliedCoupon.code})</span>
                    <span>-{formatPrice(discountAmount)}</span>
                  </div>
                )}

                <div className="flex justify-between">
                  <span>Express Shipping</span>
                  <span className="text-[#171717]">
                    {remainingForFreeShipping === 0 ? 'COMPLIMENTARY' : formatPrice(150)}
                  </span>
                </div>

                <div className="flex justify-between pt-2 border-t border-[#DDD8CE] text-sm text-[#171717] font-semibold">
                  <span>Estimated Total</span>
                  <span className="font-serif text-lg text-[#171717]">
                    {formatPrice(estimatedTotal)}
                  </span>
                </div>
              </div>

              {checkoutError && (
                <div className="p-2.5 bg-[#F4F1EA] border border-red-300 text-red-700 text-xs flex items-center gap-2">
                  <AlertCircle className="w-4 h-4 flex-shrink-0" />
                  <span>{checkoutError}</span>
                </div>
              )}

              {/* Direct Shopify Storefront Checkout Button */}
              <button
                onClick={handleCheckout}
                disabled={isCheckingOut}
                className="w-full py-4 bg-[#171717] text-white hover:bg-[#333333] transition-colors text-xs uppercase tracking-[0.2em] font-medium flex items-center justify-center gap-2 cursor-pointer shadow-sm"
              >
                <span>{isCheckingOut ? 'Opening Shopify Checkout...' : 'Proceed to Shopify Checkout'}</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <div className="flex items-center justify-center gap-1.5 text-[10px] text-[#706B64]">
                <ShieldCheck className="w-3.5 h-3.5 text-[#B9AA96]" />
                <span>Encrypted 256-Bit SSL Shopify Storefront Checkout</span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
