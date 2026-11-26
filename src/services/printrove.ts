import { Product } from '../types';

export interface PrintroveSyncResponse {
  status: string;
  syncedAt?: string;
  productsCount: number;
  designsCount: number;
  products: Product[];
  designs?: any[];
}

/**
 * Fetches synced products created in Printrove
 */
export async function fetchPrintroveProducts(): Promise<Product[]> {
  try {
    const response = await fetch('/api/printrove/products', {
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      console.warn(`[Printrove Service] HTTP Error ${response.status}`);
      return [];
    }

    const data = await response.json();
    return Array.isArray(data.products) ? data.products : [];
  } catch (error) {
    console.warn('[Printrove Service] Could not reach Printrove endpoint:', error);
    return [];
  }
}

/**
 * Triggers an immediate fresh sync from Printrove API
 */
export async function syncPrintroveCatalog(): Promise<PrintroveSyncResponse | null> {
  try {
    const response = await fetch('/api/printrove/sync', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      return null;
    }

    const data: PrintroveSyncResponse = await response.json();
    return data;
  } catch (error) {
    console.error('[Printrove Service] Sync failed:', error);
    return null;
  }
}
