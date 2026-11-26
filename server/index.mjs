/**
 * TREVORI AI — Standalone Production HTTP Server
 * Serves static build files from dist/ and handles secure backend API endpoints
 */
import http from 'node:http';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { processStylistQuery, analyzeFashionImage } from '../src/services/aiEngine.js';
import { findOrderByIdOrEmail } from '../src/data/orders.js';
import { PRODUCTS } from '../src/data/products.js';
import {
  createRazorpayOrder,
  verifyRazorpayPaymentSignature,
} from './razorpay.mjs';
import {
  fetchPrintroveStoreProducts,
  fetchPrintroveDesigns,
} from './printrove.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DIST_DIR = path.resolve(__dirname, '../dist');
const PORT = process.env.PORT || 5173;

const MIME_TYPES = {
  '.html': 'text/html',
  '.js': 'text/javascript',
  '.css': 'text/css',
  '.json': 'application/json',
  '.png': 'image/png',
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.svg': 'image/svg+xml',
  '.webp': 'image/webp',
  '.ico': 'image/x-icon',
};

function parseJsonBody(req) {
  return new Promise((resolve, reject) => {
    let body = '';
    req.on('data', (chunk) => {
      body += chunk;
      if (body.length > 10 * 1024 * 1024) reject(new Error('Payload too large'));
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

const server = http.createServer(async (req, res) => {
  const url = req.url?.split('?')[0];

  // API ROUTES
  if (url?.startsWith('/api/')) {
    res.setHeader('Content-Type', 'application/json');

    try {
      if (url === '/api/ai/chat' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { message, history } = body;
        const result = await processStylistQuery(message, history || [], process.env.OPENAI_API_KEY);
        res.writeHead(200);
        res.end(JSON.stringify(result));
        return;
      }

      if (url === '/api/ai/vision' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const { image } = body;
        const result = await analyzeFashionImage(image, process.env.OPENAI_API_KEY);
        res.writeHead(200);
        res.end(JSON.stringify(result));
        return;
      }

      if (url === '/api/orders' && req.method === 'GET') {
        const fullUrl = new URL(req.url, `http://${req.headers.host}`);
        const q = fullUrl.searchParams.get('q');
        const order = findOrderByIdOrEmail(q || '');
        if (!order) {
          res.writeHead(404);
          res.end(JSON.stringify({ error: 'Order not found' }));
          return;
        }
        res.writeHead(200);
        res.end(JSON.stringify(order));
        return;
      }

      if (url === '/api/cart/verify' && req.method === 'POST') {
        const body = await parseJsonBody(req);
        const verifiedItems = (body.items || []).map((clientItem) => {
          const serverProduct = PRODUCTS.find((p) => p.id === clientItem.productId);
          return {
            ...clientItem,
            valid: Boolean(serverProduct),
            verifiedPriceINR: serverProduct?.priceINR || 0,
            inStock: serverProduct?.inStock ?? false,
          };
        });
        res.writeHead(200);
        res.end(JSON.stringify({ verifiedItems, verifiedAt: new Date().toISOString() }));
        return;
      }

      if (url === '/api/razorpay/create-order' && req.method === 'POST') {
        const body = await parseJsonBody(req);

        try {
          const order = await createRazorpayOrder({
            amountINR: body.amountINR,
            currency: 'INR',
            receipt: body.receipt,
            notes: body.notes,
          });
          res.writeHead(200);
          res.end(JSON.stringify(order));
        } catch (err) {
          res.writeHead(err?.status || 500);
          res.end(JSON.stringify({ error: err?.message || 'Unable to create Razorpay order.' }));
        }
        return;
      }

      if (url === '/api/razorpay/verify' && req.method === 'POST') {
        const body = await parseJsonBody(req);

        try {
          const verified = verifyRazorpayPaymentSignature({
            orderId: body.razorpay_order_id,
            paymentId: body.razorpay_payment_id,
            signature: body.razorpay_signature,
          });

          if (!verified) {
            res.writeHead(422);
            res.end(JSON.stringify({ verified: false, error: 'Payment signature verification failed.' }));
            return;
          }

          res.writeHead(200);
          res.end(
            JSON.stringify({
              verified: true,
              orderId: body.razorpay_order_id,
              paymentId: body.razorpay_payment_id,
            })
          );
        } catch (err) {
          res.writeHead(err?.status || 500);
          res.end(JSON.stringify({ verified: false, error: err?.message || 'Payment verification failed.' }));
        }
        return;
      }

      if (url === '/api/printrove/products' && req.method === 'GET') {
        const fullUrl = new URL(req.url, `http://${req.headers.host}`);
        const force = fullUrl.searchParams.get('refresh') === 'true';
        const products = await fetchPrintroveStoreProducts(undefined, force);
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'success', products, count: products.length }));
        return;
      }

      if (url === '/api/printrove/designs' && req.method === 'GET') {
        const designs = await fetchPrintroveDesigns();
        res.writeHead(200);
        res.end(JSON.stringify({ status: 'success', designs, count: designs.length }));
        return;
      }

      if (url === '/api/printrove/sync' && (req.method === 'POST' || req.method === 'GET')) {
        const products = await fetchPrintroveStoreProducts(undefined, true);
        const designs = await fetchPrintroveDesigns();
        res.writeHead(200);
        res.end(JSON.stringify({
          status: 'success',
          syncedAt: new Date().toISOString(),
          productsCount: products.length,
          designsCount: designs.length,
          products,
          designs
        }));
        return;
      }

      res.writeHead(404);
      res.end(JSON.stringify({ error: 'Endpoint not found' }));
      return;
    } catch (err) {
      res.writeHead(500);
      res.end(JSON.stringify({ error: 'Internal Server Error', message: err.message }));
      return;
    }
  }

  // STATIC FILE SERVING
  let filePath = path.join(DIST_DIR, url === '/' ? 'index.html' : url);
  if (!fs.existsSync(filePath)) {
    filePath = path.join(DIST_DIR, 'index.html'); // SPA fallback
  }

  const ext = path.extname(filePath).toLowerCase();
  const contentType = MIME_TYPES[ext] || 'application/octet-stream';

  fs.readFile(filePath, (err, content) => {
    if (err) {
      res.writeHead(500);
      res.end('Server Error');
    } else {
      res.writeHead(200, { 'Content-Type': contentType });
      res.end(content, 'utf-8');
    }
  });
});

server.listen(PORT, () => {
  console.log(`TREVORI AI Production Server listening on http://localhost:${PORT}`);
});
