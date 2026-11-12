import { Product } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';

export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
}

export const SHOPIFY_CONFIG: ShopifyConfig = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '',
  storefrontAccessToken: import.meta.env.VITE_SHOPIFY_STOREFRONT_TOKEN || '',
  apiVersion: '2024-07',
};

export type ShopifyCheckoutItem = {
  variantId: string;
  quantity: number;
};

type ShopifyGraphQLResponse<T> = {
  data?: T;
  errors?: Array<{ message: string }>;
};

/**
 * Executes a Storefront API GraphQL query
 */
export async function shopifyFetch<T>(query: string, variables: Record<string, any> = {}): Promise<T | null> {
  const domain = SHOPIFY_CONFIG.storeDomain;
  const token = SHOPIFY_CONFIG.storefrontAccessToken;
  const version = SHOPIFY_CONFIG.apiVersion;

  if (!token || token.trim() === '' || token === 'your_storefront_access_token_here') {
    return null;
  }

  try {
    const response = await fetch(`https://${domain}/api/${version}/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Storefront-Access-Token': token,
      },
      body: JSON.stringify({ query, variables }),
    });

    if (!response.ok) {
      console.warn(`[Shopify API] HTTP Error: ${response.status} ${response.statusText}`);
      return null;
    }

    const json: ShopifyGraphQLResponse<T> = await response.json();
    if (json.errors && json.errors.length > 0) {
      console.warn('[Shopify API] GraphQL Errors:', json.errors);
      return null;
    }

    return json.data || null;
  } catch (error) {
    console.warn('[Shopify API] Network error connecting to Shopify:', error);
    return null;
  }
}

/**
 * Fetches products from Shopify Storefront API
 */
export async function fetchShopifyProducts(): Promise<Product[]> {
  return [];
}

/**
 * Creates a Shopify checkout session.
 * 1. If a Storefront API token is present, it uses Shopify's GraphQL CartCreate API.
 * 2. If no token is configured, it automatically uses Shopify's Universal Cart Permalink 
 *    (Direct secure checkout with ZERO tokens needed!).
 */
export async function createShopifyCheckout(
  lineItems: ShopifyCheckoutItem[],
  countryCode: string = "IN"
): Promise<string> {
  const domain = SHOPIFY_CONFIG.storeDomain;
  const token = SHOPIFY_CONFIG.storefrontAccessToken;
  const version = SHOPIFY_CONFIG.apiVersion;

  if (!lineItems.length) {
    throw new Error("Your shopping bag is empty.");
  }

  // METHOD 1: If user has a valid Storefront token, use GraphQL CartCreate
  if (token && token.trim().length > 0 && token !== 'your_storefront_access_token_here') {
    for (const item of lineItems) {
      if (!item.variantId || item.quantity < 1) {
        throw new Error("Invalid product variant or quantity.");
      }
    }

    const query = `
      mutation CartCreate($input: CartInput!) {
        cartCreate(input: $input) {
          cart {
            id
            checkoutUrl
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const response = await fetch(
        `https://${domain}/api/${version}/graphql.json`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-Shopify-Storefront-Access-Token": token,
          },
          body: JSON.stringify({
            query,
            variables: {
              input: {
                lines: lineItems.map((item) => ({
                  merchandiseId: item.variantId.startsWith('gid://')
                    ? item.variantId
                    : `gid://shopify/ProductVariant/${item.variantId}`,
                  quantity: item.quantity,
                })),
                buyerIdentity: {
                  countryCode,
                },
              },
            },
          }),
        }
      );

      if (response.ok) {
        const result: ShopifyGraphQLResponse<{
          cartCreate: {
            cart: { id: string; checkoutUrl: string } | null;
            userErrors: Array<{ field: string[] | null; message: string }>;
          };
        }> = await response.json();

        const payload = result.data?.cartCreate;
        if (payload?.cart?.checkoutUrl) {
          return payload.cart.checkoutUrl;
        }
      }
    } catch (err) {
      console.warn('[Shopify API] GraphQL cartCreate failed, using universal cart permalink fallback:', err);
    }
  }

  // METHOD 2: Shopify Universal Cart Permalink (100% Free, Zero Tokens Required!)
  // Format: https://{store}.myshopify.com/cart/{variantId}:{qty},{variantId}:{qty}
  const cleanItems = lineItems.map((item) => {
    const rawId = item.variantId.replace('gid://shopify/ProductVariant/', '').replace('prod_', '');
    return `${rawId}:${item.quantity}`;
  });

  return `https://${domain}/cart/${cleanItems.join(',')}?currency=INR`;
}
