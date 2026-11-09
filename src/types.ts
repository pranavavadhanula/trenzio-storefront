export interface Product {
  id: string;
  name: string;
  category: 'Oversized Tees' | 'T-Shirts' | 'Sweatshirts' | 'Hoodies';
  gender: 'Men' | 'Women' | 'Unisex';
  priceINR: number;
  gsm: number; // e.g. 240, 280, 400, 450
  images: {
    primary: string;
    secondary: string;
    detail: string;
  };
  colors: {
    name: string;
    hex: string;
  }[];
  sizes: string[]; // ['S', 'M', 'L', 'XL', 'XXL']
  fabric: string;
  fitDescription: string;
  modelMeasurements: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  variants?: {
    id: string; // Real Shopify Variant ID (e.g. "44119548559395")
    color: string;
    size: string;
    priceINR?: number;
    available?: boolean;
  }[];
}

export interface CartItem {
  cartItemId: string;
  product: Product;
  selectedSize: string;
  selectedColor: string;
  quantity: number;
  selectedVariantId?: string; // Real Shopify Variant ID
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromINR: number;
  countryName: string;
}
