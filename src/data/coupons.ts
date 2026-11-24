export interface ValidCoupon {
  code: string;
  type: 'percent' | 'flat';
  value: number;
  description: string;
  minSubtotal?: number;
}

export const FREE_SHIPPING_THRESHOLD_INR = 2000;
export const SHIPPING_FEE_INR = 150;

export const VALID_COUPONS: Record<string, ValidCoupon> = {
  TREVORI15: {
    code: 'TREVORI15',
    type: 'percent',
    value: 15,
    description: 'VIP Atelier 15% discount',
  },
  VIP15: {
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
  TREVORI200: {
    code: 'TREVORI200',
    type: 'flat',
    value: 200,
    description: 'Flat ₹200 drop discount',
    minSubtotal: 1000,
  },
  WINTER200: {
    code: 'WINTER200',
    type: 'flat',
    value: 200,
    description: 'Flat ₹200 Winterwear discount',
    minSubtotal: 1000,
  },
  TREVORI500: {
    code: 'TREVORI500',
    type: 'flat',
    value: 500,
    description: 'Flat ₹500 Atelier Winter discount',
    minSubtotal: 2000,
  },
  WINTER500: {
    code: 'WINTER500',
    type: 'flat',
    value: 500,
    description: 'Flat ₹500 Winterwear discount',
    minSubtotal: 2000,
  },
  PREPAID100: {
    code: 'PREPAID100',
    type: 'flat',
    value: 100,
    description: 'Flat ₹100 prepaid offer',
    minSubtotal: 1499,
  },
};

/** Returns the coupon only when it exists and its minimum order value is met. */
export function findCoupon(code?: string | null, subtotalINR = 0): ValidCoupon | null {
  if (!code) return null;

  const coupon = VALID_COUPONS[code.trim().toUpperCase()];
  if (!coupon) return null;

  if (coupon.minSubtotal && subtotalINR < coupon.minSubtotal) {
    return null;
  }

  return coupon;
}

export function computeDiscountINR(subtotalINR: number, coupon: ValidCoupon | null): number {
  if (!coupon || subtotalINR <= 0) return 0;

  if (coupon.type === 'percent') {
    return Math.round((subtotalINR * coupon.value) / 100);
  }

  return Math.min(subtotalINR, coupon.value);
}

export interface OrderTotals {
  subtotalINR: number;
  discountINR: number;
  shippingINR: number;
  totalINR: number;
}

/**
 * Single source of truth for the amount that gets charged and displayed.
 * Shipping is free once the pre-discount subtotal crosses the threshold.
 */
export function computeOrderTotals(subtotalINR: number, coupon: ValidCoupon | null): OrderTotals {
  const safeSubtotal = Math.max(0, subtotalINR);
  const discountINR = computeDiscountINR(safeSubtotal, coupon);
  const shippingINR = safeSubtotal >= FREE_SHIPPING_THRESHOLD_INR ? 0 : SHIPPING_FEE_INR;
  const totalINR = Math.max(0, safeSubtotal - discountINR + shippingINR);

  return { subtotalINR: safeSubtotal, discountINR, shippingINR, totalINR };
}
