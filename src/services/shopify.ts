import { Product } from '../types';
import { PRODUCTS as FALLBACK_PRODUCTS } from '../data/products';

export interface ShopifyConfig {
  storeDomain: string;
  storefrontAccessToken: string;
  apiVersion: string;
}

export const SHOPIFY_CONFIG: ShopifyConfig = {
  storeDomain: import.meta.env.VITE_SHOPIFY_STORE_DOMAIN || '0g1xp7-qd.myshopify.com',
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
 * Fetches products from Shopify Storefront API with automatic fallback
 */
export async function fetchShopifyProducts(): Promise<Product[]> {
  const query = `
    query GetCatalogProducts($first: Int!) {
      products(first: $first) {
        edges {
          node {
            id
            title
            handle
            description
            vendor
            productType
            priceRange {
              minVariantPrice {
                amount
                currencyCode
              }
            }
            images(first: 10) {
              edges {
                node {
                  url
                  altText
                }
              }
            }
            variants(first: 100) {
              edges {
                node {
                  id
                  title
                  availableForSale
                  quantityAvailable
                  price {
                    amount
                    currencyCode
                  }
                  selectedOptions {
                    name
                    value
                  }
                }
              }
            }
          }
        }
      }
    }
  `;

  const data = await shopifyFetch<{
    products: {
      edges: Array<{
        node: any;
      }>;
    };
  }>(query, { first: 20 });

  if (!data || !data.products || !data.products.edges.length) {
    // Return verified fallback catalog
    return FALLBACK_PRODUCTS;
  }

  // Transform Shopify GraphQL products to Trenzio Product types
  try {
    const parsedProducts: Product[] = data.products.edges.map(({ node }) => {
      const price = parseFloat(node.priceRange?.minVariantPrice?.amount || '285');
      const imagesList = node.images?.edges?.map((e: any) => e.node.url) || [];
      const primaryImage = imagesList[0] || '/images/products/ash-grey.png';
      const secondaryImage = imagesList[1] || primaryImage;
      const detailImage = imagesList[2] || primaryImage;

      // Extract variants and options
      const variants = node.variants?.edges?.map((v: any) => {
        const vNode = v.node;
        const colorOpt = vNode.selectedOptions?.find((o: any) => o.name.toLowerCase() === 'color')?.value || 'Standard';
        const sizeOpt = vNode.selectedOptions?.find((o: any) => o.name.toLowerCase() === 'size')?.value || 'M';
        return {
          id: vNode.id.replace('gid://shopify/ProductVariant/', ''),
          color: colorOpt,
          size: sizeOpt,
          priceINR: parseFloat(vNode.price?.amount || String(price)),
          available: vNode.availableForSale,
        };
      }) || [];

      // Extract unique colors and sizes
      const uniqueColors = Array.from(new Set(variants.map((v: any) => v.color)));
      const uniqueSizes = Array.from(new Set(variants.map((v: any) => v.size)));

      const COLOR_PALETTE: Record<string, string> = {
        'Ash Grey': '#B4B5B9',
        'Beige': '#D7C5B2',
        'Black': '#1C1C1C',
        'Olive Green': '#4D5D43',
        'Green': '#4D5D43',
        'Navy Blue': '#23344E',
        'Navy': '#23344E',
        'Crimson Red': '#C53B3B',
        'Red': '#C53B3B',
        'Maroon': '#582029',
        'White': '#FFFFFF',
      };

      const colors = (uniqueColors.length ? uniqueColors : ['Ash Grey', 'Black', 'Beige']).map((cName: any) => ({
        name: cName,
        hex: COLOR_PALETTE[cName] || '#333333',
      }));

      const category = node.productType?.toLowerCase().includes('sweatshirt')
        ? 'Sweatshirts'
        : node.productType?.toLowerCase().includes('hoodie')
        ? 'Hoodies'
        : 'Oversized Tees';

      return {
        id: node.id.replace('gid://shopify/Product/', ''),
        name: node.title,
        category: category as any,
        gender: 'Unisex',
        priceINR: price,
        gsm: 350,
        images: {
          primary: primaryImage,
          secondary: secondaryImage,
          detail: detailImage,
        },
        colors,
        sizes: (uniqueSizes.length ? uniqueSizes : ['XS', 'S', 'M', 'L', 'XL', '2XL']) as string[],
        fabric: '100% Combed Cotton (350 GSM Heavyweight) &bull; Printrove Quality',
        fitDescription: 'Drop-shoulder relaxed oversized streetwear silhouette with reinforced ribbed collar.',
        modelMeasurements: 'Chest 40" - 50" (Refer to Printrove Size Guide Table below)',
        isBestSeller: true,
        isNewArrival: true,
        variants,
      };
    });

    return parsedProducts.length ? parsedProducts : FALLBACK_PRODUCTS;
  } catch (err) {
    console.error('[Shopify API] Parsing error, using fallback catalog:', err);
    return FALLBACK_PRODUCTS;
  }
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
  const domain = SHOPIFY_CONFIG.storeDomain || '0g1xp7-qd.myshopify.com';
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
