import { AIOrderStatus } from '../types';

export const MOCK_ORDERS: AIOrderStatus[] = [
  {
    orderId: 'TRV-89421',
    customerName: 'Pranav Avadhanula',
    email: 'member@trevori.com',
    status: 'In Transit',
    carrier: 'Blue Dart Express (Air Cargo)',
    trackingNumber: 'BD789234812IN',
    trackingUrl: 'https://www.bluedart.com/tracking',
    orderDate: '10 Nov 2026',
    estimatedDelivery: '14 Nov 2026 by 7:00 PM',
    currentLocation: 'Hub Bangalore — In Transit to Local Delivery Center',
    shippingAddress: '42 Crescent Avenue, Indiranagar, Bengaluru, KA 560038',
    totalAmountINR: 3998,
    items: [
      {
        productId: 'TRV-HD-01',
        productName: 'Classic French Terry Boxy Hoodie',
        size: 'L',
        color: 'Obsidian Black',
        quantity: 1,
        priceINR: 2499,
        image: '/images/models/man_streetwear_hoodie.jpg',
      },
      {
        productId: 'TRV-PNT-01',
        productName: 'Relaxed Pleated Wide-Leg Cargo Pants',
        size: '32',
        color: 'Utility Olive',
        quantity: 1,
        priceINR: 1499,
        image: '/images/runway/men_pants.jpg',
      },
    ],
  },
  {
    orderId: 'TRV-67210',
    customerName: 'Aarav Sharma',
    email: 'aarav.sharma@gmail.com',
    status: 'Out for Delivery',
    carrier: 'Delhivery Surface Pro',
    trackingNumber: 'DLV992104523',
    trackingUrl: 'https://www.delhivery.com/track',
    orderDate: '08 Nov 2026',
    estimatedDelivery: 'Today by 5:30 PM',
    currentLocation: 'With Delivery Executive (Ramesh K. - +91 98450 XXXXX)',
    shippingAddress: 'Flat 402, Skyline Residency, Bandra West, Mumbai, MH 400050',
    totalAmountINR: 1499,
    items: [
      {
        productId: 'TRV-TSH-01',
        productName: 'Boxy Oversized T-Shirt',
        size: 'XL',
        color: 'Ash Grey',
        quantity: 1,
        priceINR: 1499,
        image: '/images/products/ash-grey.png',
      },
    ],
  },
  {
    orderId: 'TRV-54109',
    customerName: 'Ananya Verma',
    email: 'ananya.v@outlook.com',
    status: 'Delivered',
    carrier: 'Blue Dart Express',
    trackingNumber: 'BD541099231IN',
    trackingUrl: 'https://www.bluedart.com/tracking',
    orderDate: '01 Nov 2026',
    estimatedDelivery: '04 Nov 2026 (Delivered)',
    currentLocation: 'Delivered to resident at security reception',
    shippingAddress: 'Tower B, DLF Cyber City, Sector 24, Gurugram, HR 122002',
    totalAmountINR: 8999,
    items: [
      {
        productId: 'TRV-TRD-01',
        productName: 'Royal Midnight-Navy Velvet Bandhgala Suit',
        size: '40',
        color: 'Royal Midnight Navy',
        quantity: 1,
        priceINR: 8999,
        image: '/images/traditional_couture_banner.jpg',
      },
    ],
  },
];

export function findOrderByIdOrEmail(query: string): AIOrderStatus | null {
  const clean = query.trim().toUpperCase();
  const found = MOCK_ORDERS.find(
    (o) =>
      o.orderId.toUpperCase() === clean ||
      o.trackingNumber.toUpperCase() === clean ||
      o.email.toLowerCase() === query.trim().toLowerCase()
  );
  return found || null;
}
