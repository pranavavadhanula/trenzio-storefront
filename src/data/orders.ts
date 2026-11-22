import { AIOrderStatus } from '../types';

/**
 * All mock orders have been cleared from the database pending Shopify integration
 * and catalog upload. When live orders are placed, real-time Blue Dart checkpoints
 * and invoices will populate automatically.
 */
export const MOCK_ORDERS: AIOrderStatus[] = [];

export function findOrderByIdOrEmail(query: string): AIOrderStatus | null {
  if (!query || MOCK_ORDERS.length === 0) return null;
  const clean = query.trim().toUpperCase();
  const found = MOCK_ORDERS.find(
    (o) =>
      o.orderId.toUpperCase() === clean ||
      o.trackingNumber.toUpperCase() === clean ||
      o.email.toLowerCase() === query.trim().toLowerCase()
  );
  return found || null;
}
