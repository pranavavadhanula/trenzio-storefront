import { computeOrderTotals, findCoupon } from '../data/coupons';

const RAZORPAY_SCRIPT_URL = 'https://checkout.razorpay.com/v1/checkout.js';

export interface RazorpayLineItem {
  productId: string;
  name: string;
  size: string;
  color: string;
  quantity: number;
  unitPriceINR: number;
}

export interface RazorpayCustomer {
  name?: string;
  email?: string;
  phone?: string;
}

export interface RazorpayCheckoutOptions {
  items: RazorpayLineItem[];
  couponCode?: string;
  customer?: RazorpayCustomer;
  notes?: Record<string, string>;
}

export interface RazorpayPaymentResult {
  orderId: string;
  paymentId: string;
  amountINR: number;
}

export type RazorpayErrorCode = 'PAYMENT_CANCELLED' | 'SCRIPT_LOAD_FAILED' | 'NOT_CONFIGURED' | 'VERIFICATION_FAILED';

export class RazorpayCheckoutError extends Error {
  code?: RazorpayErrorCode;
  status?: number;

  constructor(message: string, code?: RazorpayErrorCode, status?: number) {
    super(message);
    this.name = 'RazorpayCheckoutError';
    this.code = code;
    this.status = status;
  }
}

/** Injects Razorpay's checkout script once and resolves when window.Razorpay exists. */
function loadRazorpayScript(): Promise<void> {
  if (typeof window === 'undefined') {
    return Promise.reject(new RazorpayCheckoutError('Razorpay can only be opened in a browser.'));
  }

  if (window.Razorpay) return Promise.resolve();

  return new Promise((resolve, reject) => {
    const existing = document.querySelector<HTMLScriptElement>(`script[src="${RAZORPAY_SCRIPT_URL}"]`);

    const handleLoad = () => {
      if (window.Razorpay) resolve();
      else reject(new RazorpayCheckoutError('Razorpay checkout failed to initialise.', 'SCRIPT_LOAD_FAILED'));
    };

    if (existing) {
      existing.addEventListener('load', handleLoad, { once: true });
      existing.addEventListener('error', () => {
        reject(new RazorpayCheckoutError('Unable to load Razorpay checkout.', 'SCRIPT_LOAD_FAILED'));
      }, { once: true });
      return;
    }

    const script = document.createElement('script');
    script.src = RAZORPAY_SCRIPT_URL;
    script.async = true;
    script.onload = handleLoad;
    script.onerror = () => {
      reject(new RazorpayCheckoutError('Unable to load Razorpay checkout. Check your connection.', 'SCRIPT_LOAD_FAILED'));
    };
    document.body.appendChild(script);
  });
}

async function postJson<T>(url: string, body: unknown): Promise<T> {
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const message = (data as { error?: string })?.error || 'Payment service is unavailable. Please try again.';
    const code = response.status === 503 ? 'NOT_CONFIGURED' : undefined;
    throw new RazorpayCheckoutError(message, code, response.status);
  }

  return data as T;
}

function buildReceipt(): string {
  return `trevori_${Date.now()}`.slice(0, 40);
}

/**
 * Full on-site Razorpay flow:
 *  1. Create a Razorpay order on our server (amount computed from the bag).
 *  2. Open the Razorpay checkout modal.
 *  3. Verify the returned payment signature on the server.
 */
export async function startRazorpayCheckout({
  items,
  couponCode,
  customer,
  notes,
}: RazorpayCheckoutOptions): Promise<RazorpayPaymentResult> {
  if (!items.length) {
    throw new RazorpayCheckoutError('Your shopping bag is empty.');
  }

  const subtotalINR = items.reduce((sum, item) => sum + item.unitPriceINR * item.quantity, 0);
  const coupon = findCoupon(couponCode, subtotalINR);
  const totals = computeOrderTotals(subtotalINR, coupon);

  if (totals.totalINR <= 0) {
    throw new RazorpayCheckoutError('Your order total is not payable. Please review your bag.');
  }

  const order = await postJson<{ orderId: string; amount: number; currency: string; keyId: string }>(
    '/api/razorpay/create-order',
    {
      amountINR: totals.totalINR,
      currency: 'INR',
      receipt: buildReceipt(),
      notes: {
        ...notes,
        coupon: coupon?.code || '',
        itemCount: String(items.reduce((count, item) => count + item.quantity, 0)),
        subtotalINR: String(totals.subtotalINR),
        shippingINR: String(totals.shippingINR),
      },
    }
  );

  await loadRazorpayScript();

  const RazorpayConstructor = window.Razorpay;

  if (!RazorpayConstructor) {
    throw new RazorpayCheckoutError('Razorpay checkout failed to initialise.', 'SCRIPT_LOAD_FAILED');
  }

  return new Promise<RazorpayPaymentResult>((resolve, reject) => {
    let settled = false;

    const fail = (error: RazorpayCheckoutError) => {
      if (settled) return;
      settled = true;
      reject(error);
    };

    const succeed = (result: RazorpayPaymentResult) => {
      if (settled) return;
      settled = true;
      resolve(result);
    };

    const rzp = new RazorpayConstructor({
      key: order.keyId,
      amount: order.amount,
      currency: order.currency,
      order_id: order.orderId,
      name: 'TREVORI',
      description: `${items.reduce((count, item) => count + item.quantity, 0)} item(s) · Charged in INR`,
      image: '/images/trevori_logo.jpg',
      prefill: {
        name: customer?.name || '',
        email: customer?.email || '',
        contact: customer?.phone || '',
      },
      notes: {
        coupon: coupon?.code || '',
      },
      theme: {
        color: '#171717',
      },
      modal: {
        escape: true,
        confirm_close: true,
        ondismiss: () => {
          fail(new RazorpayCheckoutError('Payment was cancelled. Your bag is still saved.', 'PAYMENT_CANCELLED'));
        },
      },
      handler: async (response: {
        razorpay_order_id: string;
        razorpay_payment_id: string;
        razorpay_signature: string;
      }) => {
        try {
          const verification = await postJson<{ verified: boolean; orderId: string; paymentId: string }>(
            '/api/razorpay/verify',
            {
              razorpay_order_id: response.razorpay_order_id,
              razorpay_payment_id: response.razorpay_payment_id,
              razorpay_signature: response.razorpay_signature,
            }
          );

          if (!verification.verified) {
            throw new RazorpayCheckoutError(
              'Payment could not be verified. If money was deducted, our team will reconcile it — please contact support.',
              'VERIFICATION_FAILED'
            );
          }

          succeed({
            orderId: verification.orderId,
            paymentId: verification.paymentId,
            amountINR: order.amount / 100,
          });
        } catch (err) {
          fail(
            err instanceof RazorpayCheckoutError
              ? err
              : new RazorpayCheckoutError(
                  'Payment could not be verified. If money was deducted, please contact support.',
                  'VERIFICATION_FAILED'
                )
          );
        }
      },
    });

    rzp.on?.('payment.failed', (response: { error?: { description?: string } }) => {
      fail(new RazorpayCheckoutError(response?.error?.description || 'Payment failed. Please try again.'));
    });

    rzp.open();
  });
}
