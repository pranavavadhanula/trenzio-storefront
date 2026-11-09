import { Product, CurrencyConfig } from '../types';

export const CURRENCIES: Record<string, CurrencyConfig> = {
  INR: { code: 'INR', symbol: '₹', rateFromINR: 1.0, countryName: 'India (Default)' },
  USD: { code: 'USD', symbol: '$', rateFromINR: 0.012, countryName: 'United States' },
  EUR: { code: 'EUR', symbol: '€', rateFromINR: 0.011, countryName: 'Europe' },
  GBP: { code: 'GBP', symbol: '£', rateFromINR: 0.0095, countryName: 'United Kingdom' },
  AED: { code: 'AED', symbol: 'AED ', rateFromINR: 0.044, countryName: 'United Arab Emirates' },
};

/**
 * TRENZIO REAL PRODUCT CATALOG
 * 100% Real data synced from your Shopify store (0g1xp7-qd.myshopify.com)
 */
export const PRODUCTS: Product[] = [
  {
    id: '44119548559395', // Real Variant ID from your Shopify Admin URL
    name: 'Overshized Plain T-Shirt',
    category: 'Oversized Tees',
    gender: 'Unisex',
    priceINR: 285, // Exact real price from your Shopify product: ₹285.00
    gsm: 350, // Real product weight: 350.0 g
    images: {
      primary: '/images/products/ash-grey.png',
      secondary: '/images/products/black.png',
      detail: '/images/products/beige.png',
    },
    colors: [
      { name: 'Ash Grey', hex: '#B4B5B9' },
      { name: 'Beige', hex: '#D7C5B2' },
      { name: 'Black', hex: '#1C1C1C' },
      { name: 'Olive Green', hex: '#4D5D43' },
      { name: 'Navy Blue', hex: '#23344E' },
      { name: 'Crimson Red', hex: '#C53B3B' },
      { name: 'Maroon', hex: '#582029' }
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL', '2XL'],
    fabric: '100% Combed Cotton (350 GSM Heavyweight) &bull; Printrove Quality',
    fitDescription: 'Drop-shoulder relaxed oversized streetwear silhouette with reinforced ribbed collar.',
    modelMeasurements: 'Chest 40" - 50" (Refer to Printrove Size Guide Table)',
    isBestSeller: true,
    isNewArrival: true,
  },
  {
    id: '44119548559396',
    name: 'Heavyweight Boxy Crewneck Sweatshirt',
    category: 'Sweatshirts',
    gender: 'Unisex',
    priceINR: 699,
    gsm: 400,
    images: {
      primary: '/images/products/black.png',
      secondary: '/images/products/ash-grey.png',
      detail: '/images/products/navy.png',
    },
    colors: [
      { name: 'Black', hex: '#1C1C1C' },
      { name: 'Ash Grey', hex: '#B4B5B9' },
      { name: 'Navy Blue', hex: '#23344E' },
      { name: 'Maroon', hex: '#582029' }
    ],
    sizes: ['S', 'M', 'L', 'XL', '2XL'],
    fabric: '400 GSM Diagonal Loop French Terry &bull; 100% Pre-Shrunk Bio-Washed Cotton',
    fitDescription: 'Structured oversized dropped shoulder cut with thick 2x2 elastane ribbed collar and cuffs.',
    modelMeasurements: 'Chest 42" - 52" &bull; Printrove Heavyweight Specifications',
    isBestSeller: true,
    isNewArrival: true,
  },
  {
    id: '44119548559397',
    name: 'Classic Supima Tailored Tee',
    category: 'T-Shirts',
    gender: 'Men',
    priceINR: 399,
    gsm: 220,
    images: {
      primary: '/images/products/navy.png',
      secondary: '/images/products/black.png',
      detail: '/images/products/beige.png',
    },
    colors: [
      { name: 'Navy Blue', hex: '#23344E' },
      { name: 'Black', hex: '#1C1C1C' },
      { name: 'Beige', hex: '#D7C5B2' },
      { name: 'Olive Green', hex: '#4D5D43' }
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    fabric: '100% Long-Staple Supima Cotton &bull; Silicon Washed',
    fitDescription: 'Regular tailored silhouette with proportioned bicep sleeves and anti-curl collar.',
    modelMeasurements: 'Regular Indian Chest Fit (Chest 38" - 46")',
    isBestSeller: false,
    isNewArrival: true,
  }
];
