import { createRazorpayOrder } from '../../server/razorpay.mjs';

/**
 * POST /api/razorpay/create-order
 * Creates a Razorpay order server-side so the key secret never reaches the browser.
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    const order = await createRazorpayOrder({
      amountINR: body.amountINR,
      currency: 'INR',
      receipt: body.receipt,
      notes: body.notes,
    });

    res.status(200).json(order);
  } catch (err: any) {
    res.status(err?.status || 500).json({ error: err?.message || 'Unable to create Razorpay order.' });
  }
}
