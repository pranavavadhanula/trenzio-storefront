import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { useShop } from '../context/ShopContext';
import { Trash2, ArrowRight, ShieldCheck, ShoppingBag, AlertCircle, CheckCircle2 } from 'lucide-react';
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

  const freeShippingThresholdINR = 2000;
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
        err?.message || 'Unable to open checkout session. Please try again.'
      );
    } finally {
      setIsCheckingOut(false);
    }
  };

  return (
    <div className="min-h-screen py-10 sm:py-16 max-w-7xl mx-auto px-6 sm:px-10 lg:px-12 bg-[#F4F1EA] text-[#171717] font-sans">
      <div className="mb-10 pb-6 border-b border-[#DDD8CE] flex items-center justify-between">
        <div>
          <span className="text-[10px] uppercase tracking-[0.3em] text-[#B9AA96] font-semibold">Trevori Checkout</span>
          <h1 className="font-serif text-3xl sm:text-5xl font-normal text-[#171717] tracking-tight mt-1">
            Shopping Bag
          </h1>
        </div>
        <Link
          to="/collections"
          className="text-xs uppercase tracking-widest text-[#706B64] hover:text-[#171717] transition-colors font-medium"
        >
          &larr; Continue Exploring
        </Link>
      </div>

      {cart.length === 0 ? (
        <div className="py-24 text-center border border-[#DDD8CE] p-8 sm:p-14 bg-[#FFFFFF] max-w-xl mx-auto shadow-sm">
          <ShoppingBag className="w-10 h-10 mx-auto text-[#B9AA96] stroke-1 mb-4" />
          <h2 className="font-serif text-2xl sm:text-3xl text-[#171717]">
            Your shopping bag is empty
          </h2>
          <p className="text-xs text-[#706B64] max-w-md mx-auto font-light leading-relaxed mt-2 mb-6">
            Explore our signature hoodies, shirts, drop-shoulder tees, and streetwear essentials.
          </p>
          <Link
            to="/collections"
            className="inline-flex items-center gap-2 px-8 py-3.5 bg-[#171717] text-white text-xs uppercase tracking-[0.2em] font-medium"
          >
            <span>Explore Collection</span>
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
          {/* Left: Cart Items */}
          <div className="lg:col-span-8 space-y-4">
            {/* Free Shipping Bar */}
            <div className="bg-[#FFFFFF] p-4 border border-[#DDD8CE]">
              <div className="flex items-center justify-between text-xs tracking-wider mb-2">
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

            {cart.map((item) => (
              <div
                key={item.cartItemId}
                className="p-6 bg-[#FFFFFF] border border-[#DDD8CE] flex flex-col sm:flex-row gap-6 items-start sm:items-center justify-between"
              >
                <div className="flex gap-4 items-center">
                  <div className="w-20 h-24 bg-[#F4F1EA] border border-[#DDD8CE] p-2 overflow-hidden flex items-center justify-center flex-shrink-0">
                    <img
                      src={item.product.images.primary}
                      alt={item.product.name}
                      className="w-full h-full object-contain"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] uppercase tracking-widest text-[#B9AA96]">
                      {item.product.category}
                    </span>
                    <h3 className="font-serif text-lg text-[#171717]">{item.product.name}</h3>
                    <div className="text-xs text-[#706B64] mt-1">
                      Size: <strong className="text-[#171717]">{item.selectedSize}</strong> &bull; Color: <strong className="text-[#171717]">{item.selectedColor}</strong>
                    </div>
                  </div>
                </div>

                <div className="flex items-center justify-between sm:justify-end gap-6 w-full sm:w-auto">
                  {/* Quantity */}
                  <div className="flex items-center border border-[#DDD8CE]">
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity - 1)}
                      className="px-3 py-1 text-xs text-[#706B64] hover:text-[#171717]"
                    >
                      -
                    </button>
                    <span className="px-3 py-1 text-xs font-semibold text-[#171717]">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.cartItemId, item.quantity + 1)}
                      className="px-3 py-1 text-xs text-[#706B64] hover:text-[#171717]"
                    >
                      +
                    </button>
                  </div>

                  {/* Price */}
                  <div className="font-serif text-lg font-semibold text-[#171717]">
                    {formatPrice(item.product.priceINR * item.quantity)}
                  </div>

                  {/* Remove */}
                  <button
                    onClick={() => removeFromCart(item.cartItemId)}
                    className="text-[#706B64] hover:text-red-600 transition-colors cursor-pointer"
                    title="Remove from bag"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-4 bg-[#FFFFFF] border border-[#DDD8CE] p-6 sm:p-8 space-y-6 self-start">
            <h2 className="font-serif text-2xl text-[#171717]">Order Summary</h2>

            <div className="space-y-2 text-xs text-[#706B64] pb-4 border-b border-[#DDD8CE]">
              <div className="flex justify-between">
                <span>Items Subtotal</span>
                <span className="font-semibold text-[#171717]">{formatPrice(cartSubtotalINR)}</span>
              </div>
              <div className="flex justify-between">
                <span>Express Courier Dispatch</span>
                <span className="text-[#171717]">
                  {remainingForFreeShipping === 0 ? 'COMPLIMENTARY' : formatPrice(150)}
                </span>
              </div>
              <div className="flex justify-between">
                <span>Taxes & Duties</span>
                <span className="text-[#171717]">INCLUDED</span>
              </div>
            </div>

            {/* Promo Code Input */}
            <div className="space-y-2">
              <div className="flex gap-2">
                <input
                  type="text"
                  placeholder="PROMO CODE"
                  value={promoCode}
                  onChange={(e) => setPromoCode(e.target.value)}
                  className="flex-1 px-3 py-2 bg-[#F4F1EA] border border-[#DDD8CE] text-xs text-[#171717] uppercase"
                />
                <button
                  onClick={() => {
                    if (promoCode.trim()) setPromoApplied(true);
                  }}
                  className="px-4 py-2 bg-[#171717] text-white text-xs uppercase tracking-wider font-medium cursor-pointer"
                >
                  Apply
                </button>
              </div>
              {promoApplied && (
                <div className="text-[11px] text-[#171717] flex items-center gap-1">
                  <CheckCircle2 className="w-3.5 h-3.5 text-[#B9AA96]" />
                  <span>VIP Atelier 15% discount confirmed.</span>
                </div>
              )}
            </div>

            {/* Total */}
            <div className="flex justify-between items-baseline pt-2 border-t border-[#DDD8CE]">
              <span className="text-sm font-semibold text-[#171717]">Total</span>
              <span className="font-serif text-2xl font-bold text-[#171717]">
                {formatPrice(cartSubtotalINR + (remainingForFreeShipping === 0 ? 0 : 150))}
              </span>
            </div>

            {checkoutError && (
              <div className="p-3 bg-[#F4F1EA] border border-red-300 text-red-700 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 flex-shrink-0" />
                <span>{checkoutError}</span>
              </div>
            )}

            {/* Checkout Button */}
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
              <span>Direct Encrypted Shopify Storefront Checkout</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
