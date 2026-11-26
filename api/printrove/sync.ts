import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchPrintroveStoreProducts, fetchPrintroveDesigns } from '../../server/printrove.mjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const products = await fetchPrintroveStoreProducts(undefined, true);
    const designs = await fetchPrintroveDesigns();
    return res.status(200).json({
      status: 'success',
      syncedAt: new Date().toISOString(),
      productsCount: products.length,
      designsCount: designs.length,
      products,
      designs
    });
  } catch (error: any) {
    console.error('[Vercel Printrove Sync Error]', error);
    return res.status(500).json({ error: 'Failed to sync with Printrove', details: error?.message });
  }
}
