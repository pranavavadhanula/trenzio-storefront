/**
 * Razorpay server-side helpers.
 *
 * IMPORTANT: This module must only ever run on the server. The key secret is
 * read from the environment and must never be exposed to the browser.
 */
import crypto from 'node:crypto';

const RAZORPAY_API_BASE = 'https://api.razorpay.com/v1';

// Safety guard: refuse to create orders larger than ₹10,00,000.
const MAX_AMOUNT_PAISE = 100_000_000;
// Razorpay requires at least 100 paise (₹1).
const MIN_AMOUNT_PAISE = 100;

export class RazorpayConfigError extends Error {
  constructor(
    message = 'Razorpay is not configured. Add RAZORPAY_KEY_ID and RAZORPAY_KEY_SECRET to the server environment.'
  ) {
    super(message);
    this.name = 'RazorpayConfigError';
    this.status = 503;
  }
}

export class RazorpayRequestError extends Error {
  constructor(message) {
    super(message);
    this.name = 'RazorpayRequestError';
    this.status = 400;
  }
}

function getCredentials() {
  // VITE_ prefixed keys are supported as a convenience for local dev, but the
  // unprefixed server keys should be preferred in production.
  const keyId = process.env.RAZORPAY_KEY_ID || process.env.VITE_RAZORPAY_KEY_ID;
  const keySecret = process.env.RAZORPAY_KEY_SECRET || process.env.VITE_RAZORPAY_KEY_SECRET;

  if (!keyId || !keySecret) {
    throw new RazorpayConfigError();
  }

  return { keyId, keySecret };
}

export function toAmountPaise(amountINR) {
  const amount = Number(amountINR);

  if (!Number.isFinite(amount) || amount <= 0) {
    throw new RazorpayRequestError('A valid payable amount is required.');
  }

  const paise = Math.round(amount * 100);

  if (!Number.isSafeInteger(paise) || paise < MIN_AMOUNT_PAISE) {
    throw new RazorpayRequestError('Minimum payable amount is ₹1.');
  }

  if (paise > MAX_AMOUNT_PAISE) {
    throw new RazorpayRequestError('Order amount exceeds the allowed limit. Please contact the atelier.');
  }

  return paise;
}

function sanitizeNotes(notes) {
  if (!notes || typeof notes !== 'object') return undefined;

  const clean = {};
  for (const [key, value] of Object.entries(notes)) {
    if (value === null || value === undefined) continue;
    const text = String(value).slice(0, 256);
    if (!text) continue;
    clean[key.slice(0, 64)] = text;
  }

  return Object.keys(clean).length ? clean : undefined;
}

/**
 * Creates a Razorpay order and returns the data the browser needs to open the
 * checkout modal. The key secret stays on the server.
 */
export async function createRazorpayOrder({ amountINR, currency = 'INR', receipt, notes } = {}) {
  const { keyId, keySecret } = getCredentials();
  const amount = toAmountPaise(amountINR);

  const payload = {
    amount,
    currency: currency || 'INR',
    receipt: typeof receipt === 'string' && receipt.trim() ? receipt.trim().slice(0, 40) : undefined,
    notes: sanitizeNotes(notes),
  };

  const authorization = Buffer.from(`${keyId}:${keySecret}`).toString('base64');

  const response = await fetch(`${RAZORPAY_API_BASE}/orders`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Basic ${authorization}`,
    },
    body: JSON.stringify(payload),
  });

  const data = await response.json().catch(() => ({}));

  if (!response.ok) {
    const description =
      data?.error?.description || data?.error?.reason || `Razorpay order creation failed (${response.status}).`;
    const error = new RazorpayRequestError(description);
    error.status = response.status >= 500 ? 502 : 400;
    throw error;
  }

  return {
    orderId: data.id,
    amount: data.amount,
    currency: data.currency,
    keyId,
  };
}

/**
 * Verifies the payment signature returned by the checkout modal.
 * Returns true only when the HMAC matches Razorpay's key secret.
 */
export function verifyRazorpayPaymentSignature({ orderId, paymentId, signature } = {}) {
  const { keySecret } = getCredentials();

  if (!orderId || !paymentId || !signature) {
    return false;
  }

  const expected = crypto
    .createHmac('sha256', keySecret)
    .update(`${orderId}|${paymentId}`)
    .digest('hex');

  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(signature));

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}

/**
 * Verifies a webhook payload signature (X-Razorpay-Signature header).
 */
export function verifyRazorpayWebhookSignature(rawBody, signature) {
  const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET;

  if (!webhookSecret || !signature || !rawBody) {
    return false;
  }

  const expected = crypto.createHmac('sha256', webhookSecret).update(rawBody).digest('hex');
  const expectedBuffer = Buffer.from(expected);
  const receivedBuffer = Buffer.from(String(signature));

  if (expectedBuffer.length !== receivedBuffer.length) {
    return false;
  }

  return crypto.timingSafeEqual(expectedBuffer, receivedBuffer);
}
