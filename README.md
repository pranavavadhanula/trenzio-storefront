# TRENZIO Atelier — Ultra-Luxury Fashion Storefront

An ultra-premium, runway-inspired headless e-commerce storefront designed for international direct-to-consumer (DTC) clothing brands.

---

## Key Features

1. **Haute Couture Aesthetic**:
   - Editorial high-fashion typography (`Cormorant Garamond` & `Plus Jakarta Sans`).
   - Muted obsidian & gold palette with fluid micro-interactions.
   - Dual-image hover transitions (lifestyle editorial to close-up fabric weave).

2. **International Commerce Ready**:
   - **Multi-Currency Engine**: Instant live switching across **USD ($), EUR (€), GBP (£), JPY (¥), CAD (CA$), AUD (AU$)**.
   - **Free Shipping Threshold Bar**: Real-time calculation showing how much is left to unlock complimentary express courier shipping.
   - **Pre-Calculated Duties & Taxes (DDP)** indicators for overseas shoppers.

3. **Interactive Editorial Features**:
   - **Runway Digital Lookbook**: Interactive slide-out showcasing styled looks and allowing customers to inspect each individual piece in that look.
   - **Interactive Sizing & Dimension Guide**: Instant toggle between **Centimeters (cm)** and **Inches (in)**, with international size conversion charts (US, UK, EU, JP).
   - **Glassmorphism Bag Drawer**: Frosted blur cart drawer with quantity steppers and promo code application.

4. **Shopify + Razorpay Integration**:
   - Production-ready GraphQL client for catalog & customer data in `src/services/shopify.ts`.
   - On-site Razorpay checkout (`src/services/razorpay.ts`) with server-side order creation and HMAC signature verification — customers never leave the site.

---

## Quickstart

### 1. Run Locally
```bash
npm install
npm run dev
```
Open [http://localhost:5173](http://localhost:5173) in your browser.

### 2. Connect Your Real Shopify Store
Create a `.env` file in the project root:
```env
VITE_SHOPIFY_STORE_DOMAIN="your-store-name.myshopify.com"
VITE_SHOPIFY_STOREFRONT_TOKEN="your_storefront_access_token_here"
```

To get your Storefront token in Shopify:
1. Go to **Shopify Admin > Settings > Apps and sales channels > Develop apps**.
2. Click **Create an app** -> Name it "Custom Headless Storefront".
3. Under **Configuration > Storefront API integration**, grant `read_products`, `write_checkouts`, and `read_product_listings`.
4. Install the app and copy your **Storefront API access token**.

### 3. Connect Razorpay (direct, on-site checkout)

Payments run through Razorpay directly on the site — no redirect to Shopify checkout.

1. In the [Razorpay Dashboard](https://dashboard.razorpay.com) go to **Settings → API Keys** and generate a key pair.
2. Add the keys to your local `.env` (never commit them):
   ```env
   RAZORPAY_KEY_ID="rzp_live_xxxxxxxx"
   RAZORPAY_KEY_SECRET="your_key_secret"
   ```
3. Make sure **Payment Capture** is set to **Automatic** in Razorpay settings (we do not capture manually).
4. In the Razorpay Dashboard, add your production domain under **Settings → Payment Methods / Website**.

How it works:
- `POST /api/razorpay/create-order` creates the order server-side (amount in paise) and returns only the public `keyId`.
- The browser opens Razorpay Checkout (`checkout.js`) with that order.
- `POST /api/razorpay/verify` validates the returned `razorpay_signature` with HMAC-SHA256 using the key secret.
- On success the bag is cleared and the customer lands on `/order-confirmed`.

Endpoints live in `server/razorpay.mjs` and are exposed through:
- the Vite dev/preview middleware (`server/vitePluginApi.ts`),
- the standalone Node server (`server/index.mjs`, `npm start`),
- Vercel Serverless Functions (`api/razorpay/*`) for production deploys.

`RAZORPAY_KEY_SECRET` is server-only. Never prefix it with `VITE_` — that would ship it to the browser.

> **Security note:** the cart lives client-side, so the order amount is calculated in the browser before `/api/razorpay/create-order`. The server enforces sane limits but cannot prove the amount matches the catalog. Before scaling, recompute prices from Shopify's Storefront/Admin API on the server (and move coupon/shipping rules server-side) so a tampered client cannot lower the payable amount.

---

## Deploying to Production Internationally

You can deploy this site in 2 minutes:
1. Push this project to GitHub.
2. Import the repository into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Connect your custom `.com` domain.
