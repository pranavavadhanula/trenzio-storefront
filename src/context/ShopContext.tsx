import React, { createContext, useContext, useState, useEffect, useMemo } from 'react';
import { Product, CartItem, CurrencyCode } from '../types';
import { CURRENCIES, PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';
import { fetchShopifyProducts } from '../services/shopify';

interface ShopContextType {
  products: Product[];
  isLoadingProducts: boolean;
  refreshProducts: () => Promise<void>;
  cart: CartItem[];
  isCartOpen: boolean;
  setIsCartOpen: (open: boolean) => void;
  currency: CurrencyCode;
  setCurrency: (code: CurrencyCode) => void;
  formatPrice: (priceINR: number) => string;
  addToCart: (
    product: Product,
    selectedSize: string,
    selectedColor: string,
    quantity?: number,
    explicitVariantId?: string
  ) => void;
  removeFromCart: (cartItemId: string) => void;
  updateQuantity: (cartItemId: string, newQty: number) => void;
  cartSubtotalINR: number;
  cartCount: number;
  selectedProduct: Product | null;
  setSelectedProduct: (product: Product | null) => void;
  isSizeGuideOpen: boolean;
  setIsSizeGuideOpen: (open: boolean) => void;
  
  // Wishlist
  wishlist: string[];
  toggleWishlist: (productId: string) => void;
  isWishlisted: (productId: string) => boolean;
  isWishlistOpen: boolean;
  setIsWishlistOpen: (open: boolean) => void;

  // Search
  isSearchOpen: boolean;
  setIsSearchOpen: (open: boolean) => void;

  // Selected Category & Gender Filter
  selectedCategory: string;
  setSelectedCategory: (cat: string) => void;
  selectedGender: string;
  setSelectedGender: (gender: string) => void;

  // Customer Account & Authentication
  user: UserProfile | null;
  isLoggedIn: boolean;
  login: (data?: Partial<UserProfile>) => void;
  logout: () => void;
}

export interface UserProfile {
  name: string;
  email: string;
  phone?: string;
  tier: string;
  points: number;
  creditsINR: number;
  joinedDate: string;
  picture?: string;
  authProvider?: 'google' | 'apple' | 'email' | 'phone';
}

const ShopContext = createContext<ShopContextType | undefined>(undefined);

export const ShopProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [products, setProducts] = useState<Product[]>(FALLBACK_PRODUCTS);
  const [isLoadingProducts, setIsLoadingProducts] = useState(false);

  const [cart, setCart] = useState<CartItem[]>(() => {
    const saved = localStorage.getItem('trevori_cart') || localStorage.getItem('trenzio_cart');
    return saved ? JSON.parse(saved) : [];
  });

  const [wishlist, setWishlist] = useState<string[]>(() => {
    const saved = localStorage.getItem('trevori_wishlist') || localStorage.getItem('trenzio_wishlist');
    return saved ? JSON.parse(saved) : [];
  });

  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [currency, setCurrency] = useState<CurrencyCode>('INR'); // Default India
  const [selectedProduct, setSelectedProduct] = useState<Product | null>(null);
  const [isSizeGuideOpen, setIsSizeGuideOpen] = useState(false);

  const [selectedCategory, setSelectedCategory] = useState<string>('All');
  const [selectedGender, setSelectedGender] = useState<string>('All');

  // Customer authentication state
  const [user, setUser] = useState<UserProfile | null>(() => {
    const saved = localStorage.getItem('trevori_user');
    return saved ? JSON.parse(saved) : null;
  });

  const login = (data?: Partial<UserProfile>) => {
    const newUser: UserProfile = {
      name: data?.name || (data?.email ? data.email.split('@')[0].toUpperCase() : 'VIP Member'),
      email: data?.email || 'member@trevori.com',
      phone: data?.phone || '+91 98765 43210',
      tier: data?.tier || 'VIP Noir Member',
      points: data?.points ?? 4200,
      creditsINR: data?.creditsINR ?? 1200,
      joinedDate: data?.joinedDate || 'November 2026',
      picture: data?.picture,
      authProvider: data?.authProvider || (data?.email?.includes('@gmail.com') ? 'google' : 'email'),
    };
    setUser(newUser);
    localStorage.setItem('trevori_user', JSON.stringify(newUser));
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('trevori_user');
  };

  const refreshProducts = async () => {
    setIsLoadingProducts(true);
    try {
      const live = await fetchShopifyProducts();
      if (live && live.length > 0) {
        setProducts(live);
      } else {
        setProducts(FALLBACK_PRODUCTS);
      }
    } catch {
      setProducts(FALLBACK_PRODUCTS);
    } finally {
      setIsLoadingProducts(false);
    }
  };

  useEffect(() => {
    setProducts(FALLBACK_PRODUCTS);
  }, []);

  useEffect(() => {
    localStorage.setItem('trevori_cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {
    localStorage.setItem('trevori_wishlist', JSON.stringify(wishlist));
  }, [wishlist]);

  const toggleWishlist = (productId: string) => {
    setWishlist((prev) =>
      prev.includes(productId) ? prev.filter((id) => id !== productId) : [...prev, productId]
    );
  };

  const isWishlisted = (productId: string) => wishlist.includes(productId);

  const formatPrice = (priceINR: number): string => {
    const config = CURRENCIES[currency] || CURRENCIES.INR;
    
    if (currency === 'INR') {
      return `₹${priceINR.toLocaleString('en-IN')}`;
    }

    const converted = priceINR * config.rateFromINR;
    return `${config.symbol}${converted.toLocaleString(undefined, {
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    })}`;
  };

  const addToCart = (
    product: Product,
    selectedSize: string,
    selectedColor: string,
    quantity = 1,
    explicitVariantId?: string
  ) => {
    // Find matching variant ID from product.variants
    const matchedVariant = product.variants?.find(
      (v) =>
        v.size.toLowerCase() === selectedSize.toLowerCase() &&
        v.color.toLowerCase() === selectedColor.toLowerCase()
    );
    const selectedVariantId = explicitVariantId || matchedVariant?.id || product.id;

    const cartItemId = `${product.id}-${selectedSize}-${selectedColor}`;
    
    setCart((prev) => {
      const existing = prev.find((item) => item.cartItemId === cartItemId);
      if (existing) {
        return prev.map((item) =>
          item.cartItemId === cartItemId
            ? { ...item, quantity: item.quantity + quantity, selectedVariantId }
            : item
        );
      }
      return [
        ...prev,
        { cartItemId, product, selectedSize, selectedColor, quantity, selectedVariantId },
      ];
    });
    
    setIsCartOpen(true);
  };

  const removeFromCart = (cartItemId: string) => {
    setCart((prev) => prev.filter((item) => item.cartItemId !== cartItemId));
  };

  const updateQuantity = (cartItemId: string, newQty: number) => {
    if (newQty <= 0) {
      removeFromCart(cartItemId);
      return;
    }
    setCart((prev) =>
      prev.map((item) =>
        item.cartItemId === cartItemId ? { ...item, quantity: newQty } : item
      )
    );
  };

  const cartSubtotalINR = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.product.priceINR * item.quantity, 0);
  }, [cart]);

  const cartCount = useMemo(() => {
    return cart.reduce((count, item) => count + item.quantity, 0);
  }, [cart]);

  return (
    <ShopContext.Provider
      value={{
        products,
        isLoadingProducts,
        refreshProducts,
        cart,
        isCartOpen,
        setIsCartOpen,
        currency,
        setCurrency,
        formatPrice,
        addToCart,
        removeFromCart,
        updateQuantity,
        cartSubtotalINR,
        cartCount,
        selectedProduct,
        setSelectedProduct,
        isSizeGuideOpen,
        setIsSizeGuideOpen,
        wishlist,
        toggleWishlist,
        isWishlisted,
        isWishlistOpen,
        setIsWishlistOpen,
        isSearchOpen,
        setIsSearchOpen,
        selectedCategory,
        setSelectedCategory,
        selectedGender,
        setSelectedGender,
        user,
        isLoggedIn: !!user,
        login,
        logout,
      }}
    >
      {children}
    </ShopContext.Provider>
  );
};

export const useShop = () => {
  const context = useContext(ShopContext);
  if (!context) {
    throw new Error('useShop must be used within a ShopProvider');
  }
  return context;
};
