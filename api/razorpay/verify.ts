import { verifyRazorpayPaymentSignature } from '../../server/razorpay.mjs';

/**
 * POST /api/razorpay/verify
 * Verifies the payment signature returned by Razorpay checkout.
 */
export default async function handler(req: any, res: any) {
  if (req.method !== 'POST') {
    res.status(405).json({ error: 'Method not allowed' });
    return;
  }

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body || '{}') : req.body || {};

    const verified = verifyRazorpayPaymentSignature({
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
      signature: body.razorpay_signature,
    });

    if (!verified) {
      res.status(422).json({ verified: false, error: 'Payment signature verification failed.' });
      return;
    }

    res.status(200).json({
      verified: true,
      orderId: body.razorpay_order_id,
      paymentId: body.razorpay_payment_id,
    });
  } catch (err: any) {
    res.status(err?.status || 500).json({ verified: false, error: err?.message || 'Payment verification failed.' });
  }
}
