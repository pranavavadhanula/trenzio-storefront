import { Product, CurrencyConfig } from '../types';

export const CURRENCIES: Record<string, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rateFromINR: 1.0, countryName: 'India (Default)' },
  USD: { code: 'USD', symbol: '$', rateFromINR: 0.012, countryName: 'United States' },
  EUR: { code: 'EUR', symbol: '€', rateFromINR: 0.011, countryName: 'Europe' },
  GBP: { code: 'GBP', symbol: '£', rateFromINR: 0.0095, countryName: 'United Kingdom' },
  AED: { code: 'AED', symbol: 'AED ', rateFromINR: 0.044, countryName: 'United Arab Emirates' },
};

/**
 * TREVORI CATALOG
 * Shopify sync disconnected. No stock currently active.
 */
export const PRODUCTS: Product[] = [];
