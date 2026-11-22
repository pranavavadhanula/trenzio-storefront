export interface BrandPolicy {
  topic: string;
  title: string;
  summary: string;
  details: string[];
}

export const BRAND_POLICIES: Record<string, BrandPolicy> = {
  shipping: {
    topic: 'shipping',
    title: 'Shipping & Delivery Policy',
    summary: 'Free express shipping across all pin codes in India on orders above ₹999. Standard delivery takes 2 to 4 business days.',
    details: [
      'Orders are dispatched within 24 hours from our Mumbai & Bengaluru fulfilment centers.',
      'Metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata): 2-3 business days.',
      'Rest of India: 3-5 business days.',
      'Express Courier partners: Blue Dart Express, Delhivery Surface Pro, and DTDC Priority.',
      'Real-time SMS and WhatsApp tracking links are dispatched immediately upon shipment.',
    ],
  },
  returns: {
    topic: 'returns',
    title: '7-Day Hassle-Free Returns & Exchanges',
    summary: 'We offer an unconditional 7-day return and exchange policy on all unworn items with original tags intact.',
    details: [
      'Initiate a return directly from your Account Dashboard or message our AI Stylist / WhatsApp Concierge.',
      'Free reverse doorstep pickup will be arranged within 24-48 hours of your request.',
      'Items must be unworn, unwashed, and returned in their original Trevori luxury packaging with tags attached.',
      'Instant size exchanges are free of cost. If your preferred size is out of stock, full store credit or source refund is issued.',
    ],
  },
  refunds: {
    topic: 'refunds',
    title: 'Instant Refunds & Store Credits',
    summary: 'Refunds are initiated immediately upon quality inspection at our depot.',
    details: [
      'Prepaid Orders (UPI, NetBanking, Cards): Refund reflects in your original payment account within 3–5 business days.',
      'Cash on Delivery (COD) Orders: Refund transferred directly via instant UPI (Google Pay, PhonePe, Paytm) or NEFT.',
      'Trevori VIP Store Credit Option: Receive an extra 5% bonus credit instantly in your wallet with lifetime validity.',
    ],
  },
  payments: {
    topic: 'payments',
    title: 'Payment Methods & Security',
    summary: '100% encrypted 256-bit SSL secure checkout powered by Razorpay & Cashfree.',
    details: [
      'UPI: Google Pay, PhonePe, Paytm, BHIM, CRED UPI (instant 0% transaction fee).',
      'Cards: Visa, Mastercard, RuPay, American Express credit and debit cards.',
      'NetBanking: Supported across 50+ major Indian banks.',
      'Cash on Delivery (COD): Available for all serviceable Indian pin codes for orders up to ₹5,000.',
    ],
  },
  fabric: {
    topic: 'fabric',
    title: 'Premium Cotton & French Terry Fabric Care',
    summary: 'Our garments are woven with pure combed cotton and French Terry, engineered to outlast standard retail wear.',
    details: [
      'Wash cold inside-out (30°C or below) with mild liquid detergent.',
      'Do not bleach or dry clean unless specified on traditional silk couture garments.',
      'Dry in shade away from direct intense sunlight to preserve deep dye luster.',
      'Warm iron on reverse side; never iron directly over rubberized monograms or 3D high-density prints.',
    ],
  },
};

export function findPolicy(query: string): BrandPolicy | null {
  const q = query.toLowerCase();
  if (q.includes('ship') || q.includes('deliver') || q.includes('time') || q.includes('when')) {
    return BRAND_POLICIES.shipping;
  }
  if (q.includes('return') || q.includes('exchange') || q.includes('replace')) {
    return BRAND_POLICIES.returns;
  }
  if (q.includes('refund') || q.includes('money back') || q.includes('cancel')) {
    return BRAND_POLICIES.refunds;
  }
  if (q.includes('pay') || q.includes('upi') || q.includes('cod') || q.includes('card')) {
    return BRAND_POLICIES.payments;
  }
  if (q.includes('fabric') || q.includes('gsm') || q.includes('wash') || q.includes('cotton') || q.includes('care')) {
    return BRAND_POLICIES.fabric;
  }
  return null;
}
