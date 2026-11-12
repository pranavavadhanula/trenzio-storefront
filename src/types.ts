export type ProductCategory =
  | 'Oversized Tees'
  | 'T-Shirts'
  | 'Sweatshirts'
  | 'Hoodies'
  | 'Pants'
  | 'Jackets'
  | 'Traditional'
  | 'Accessories'
  | 'Footwear';

export interface Product {
  id: string;
  name: string;
  category: ProductCategory;
  gender: 'Men' | 'Women' | 'Unisex';
  priceINR: number;
  gsm?: number; // e.g. 240, 280, 350, 400, 450
  images: {
    primary: string;
    secondary: string;
    detail: string;
  };
  colors: {
    name: string;
    hex: string;
  }[];
  sizes: string[]; // ['S', 'M', 'L', 'XL', 'XXL'] or waist sizes
  fabric: string;
  fitDescription: string;
  modelMeasurements: string;
  isBestSeller?: boolean;
  isNewArrival?: boolean;
  inStock?: boolean;
  stockCount?: number;
  occasion?: string[]; // e.g. ['college', 'party', 'date', 'summer', 'wedding', 'streetwear']
  styleTags?: string[];
  variants?: {
    id: string; // Real Variant ID
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
  selectedVariantId?: string;
}

export type CurrencyCode = 'INR' | 'USD' | 'EUR' | 'GBP' | 'AED';

export interface CurrencyConfig {
  code: CurrencyCode;
  symbol: string;
  rateFromINR: number;
  countryName: string;
}

// AI Assistant Types
export type AIMessageRole = 'user' | 'assistant' | 'system';

export interface AIOutfitRecommendation {
  id: string;
  title: string;
  occasion: string;
  totalCostINR: number;
  description: string;
  styleAdvice: string;
  products: Product[];
}

export interface AISizeResult {
  recommendedSize: string;
  category: string;
  fitType: 'Oversized Fit' | 'Regular Tailored' | 'Slim Fit';
  confidenceScore: number;
  notes: string;
  suggestedMeasurements: {
    chest?: string;
    waist?: string;
    length?: string;
  };
}

export interface AIOrderStatus {
  orderId: string;
  customerName: string;
  email: string;
  status: 'Processing' | 'Quality Check' | 'Dispatched' | 'In Transit' | 'Out for Delivery' | 'Delivered' | 'Cancelled';
  carrier: string;
  trackingNumber: string;
  trackingUrl?: string;
  orderDate: string;
  estimatedDelivery: string;
  currentLocation: string;
  items: {
    productId: string;
    productName: string;
    size: string;
    color: string;
    quantity: number;
    priceINR: number;
    image: string;
  }[];
  totalAmountINR: number;
  shippingAddress: string;
}

export interface AIMessage {
  id: string;
  role: AIMessageRole;
  content: string;
  timestamp: number;
  products?: Product[];
  outfit?: AIOutfitRecommendation;
  sizeResult?: AISizeResult;
  orderStatus?: AIOrderStatus;
  imageUrl?: string;
  imageAnalysis?: {
    category: string;
    dominantColors: string[];
    vibe: string;
    stylingTips: string;
  };
  suggestedActions?: string[];
  isLoading?: boolean;
}
