import type { VercelRequest, VercelResponse } from '@vercel/node';
import { fetchPrintroveStoreProducts, fetchPrintroveDesigns } from '../../server/printrove.mjs';

export default async function handler(req: VercelRequest, res: VercelResponse) {
  res.setHeader('Content-Type', 'application/json');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  try {
    const force = req.query.refresh === 'true';
    const products = await fetchPrintroveStoreProducts(undefined, force);
    return res.status(200).json({ status: 'success', products, count: products.length });
  } catch (error: any) {
    console.error('[Vercel Printrove Error]', error);
    return res.status(500).json({ error: 'Failed to fetch Printrove products', details: error?.message });
  }
}
