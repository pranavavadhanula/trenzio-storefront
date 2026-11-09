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

4. **Shopify Integration Layer**:
   - Production-ready GraphQL client located in `src/services/shopify.ts`.
   - Pass line items and currency directly to Shopify's secure PCI-compliant checkout.

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

---

## Deploying to Production Internationally

You can deploy this site in 2 minutes:
1. Push this project to GitHub.
2. Import the repository into [Vercel](https://vercel.com) or [Netlify](https://netlify.com).
3. Connect your custom `.com` domain.
