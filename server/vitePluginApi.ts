import type { Plugin, ViteDevServer, PreviewServer } from 'vite';
import { processStylistQuery, analyzeFashionImage } from '../src/services/aiEngine';
import { findOrderByIdOrEmail } from '../src/data/orders';
import { PRODUCTS } from '../src/data/products';

// Simple in-memory token bucket rate limiter
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 30;
const ipRequestMap = new Map<string, { count: number; resetAt: number }>();

function checkRateLimit(ip: string): boolean {
  const now = Date.now();
  const record = ipRequestMap.get(ip);

  if (!record || now > record.resetAt) {
    ipRequestMap.set(ip, { count: 1, resetAt: now + RATE_LIMIT_WINDOW_MS });
    return true;
  }

  if (record.count >= MAX_REQUESTS_PER_WINDOW) {
    return false;
  }

  record.count += 1;
  return true;
}

function parseJsonBody(req: any): Promise<any> {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk: any) => {
      body += chunk;
      // Protect against oversized payloads (max 10MB for base64 images)
      if (body.length > 10 * 1024 * 1024) {
        reject(new Error('Payload too large'));
      }
    });
    req.on('end', () => {
      try {
        resolve(body ? JSON.parse(body) : {});
      } catch (e) {
        reject(e);
      }
    });
    req.on('error', reject);
  });
}

export function trevoriApiPlugin(apiKey?: string): Plugin {
  const handleApiRequest = async (req: any, res: any, next: any) => {
    const url = req.url?.split('?')[0];

    if (!url?.startsWith('/api/')) {
      return next();
    }

    const clientIp = req.headers['x-forwarded-for'] || req.socket.remoteAddress || 'unknown';
    if (!checkRateLimit(String(clientIp))) {
      res.statusCode = 429;
      res.setHeader('Content-Type', 'application/json');
      res.end(JSON.stringify({ error: 'Too many requests. Please wait a moment.' }));
      return;
    }

    res.setHeader('Content-Type', 'application/json');

    try {
      // 1. /api/ai/chat
      if (url === '/api/ai/chat' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { message, history } = body;

        if (!message || typeof message !== 'string') {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Message is required' }));
          return;
        }

        const effectiveKey = apiKey || process.env.OPENAI_API_KEY;
        const result = await processStylistQuery(message, history || [], effectiveKey);
        res.statusCode = 200;
        res.end(JSON.stringify(result));
        return;
      }

      // 2. /api/ai/vision
      if (url === '/api/ai/vision' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { image } = body;

        if (!image || typeof image !== 'string') {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Image data URL is required' }));
          return;
        }

        const effectiveKey = apiKey || process.env.OPENAI_API_KEY;
        const result = await analyzeFashionImage(image, effectiveKey);
        res.statusCode = 200;
        res.end(JSON.stringify(result));
        return;
      }

      // 3. /api/orders
      if (url === '/api/orders' && req.method === 'GET') {
        const fullUrl = new URL(req.url, 'http://localhost');
        const q = fullUrl.searchParams.get('q');
        if (!q) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Order query required' }));
          return;
        }

        const order = findOrderByIdOrEmail(q);
        if (!order) {
          res.statusCode = 404;
          res.end(JSON.stringify({ error: 'Order not found' }));
          return;
        }

        res.statusCode = 200;
        res.end(JSON.stringify(order));
        return;
      }

      // 4. /api/cart/verify (Server-side price and inventory check)
      if (url === '/api/cart/verify' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { items } = body;

        if (!Array.isArray(items)) {
          res.statusCode = 400;
          res.end(JSON.stringify({ error: 'Invalid items array' }));
          return;
        }

        // Verify each item against real server products
        const verifiedItems = items.map((clientItem: any) => {
          const serverProduct = PRODUCTS.find((p) => p.id === clientItem.productId);
          if (!serverProduct) {
            return {
              ...clientItem,
              valid: false,
              reason: 'Product no longer in catalogue',
            };
          }

          return {
            ...clientItem,
            valid: true,
            verifiedPriceINR: serverProduct.priceINR,
            inStock: serverProduct.inStock ?? true,
            stockCount: serverProduct.stockCount ?? 10,
          };
        });

        res.statusCode = 200;
        res.end(JSON.stringify({ verifiedItems, verifiedAt: new Date().toISOString() }));
        return;
      }

      // Unmatched /api route
      res.statusCode = 404;
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
    } catch (err: any) {
      console.error('[API Server Error]', err);
      res.statusCode = 500;
      res.end(JSON.stringify({ error: 'Internal Server Error', details: err?.message }));
    }
  };

  return {
    name: 'trevori-api-middleware',
    configureServer(server: ViteDevServer) {
      server.middlewares.use(handleApiRequest);
    },
    configurePreviewServer(server: PreviewServer) {
      server.middlewares.use(handleApiRequest);
    },
  };
}
