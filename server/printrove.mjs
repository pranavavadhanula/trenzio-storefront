/**
 * Printrove API Integration Service
 * Manages fetching products, mockups, designs, and orders from Printrove API
 */

const DEFAULT_PRINTROVE_TOKEN = process.env.PRINTROVE_API_TOKEN || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6MTAwMTAwMTk0MCwiZW1haWwiOiJwcmFuYXYuYXZhZGhhbnVsYUBnbWFpbC5jb20iLCJyb2xlIjoibWVyY2hhbnQiLCJ0eXBlIjoibWVyY2hhbnQiLCJtZXJjaGFudElkIjozMDE5MTgsInBhbmVsIjoibWVyY2hhbnQiLCJpc1ByaW1hcnkiOnRydWUsInBlcm1pc3Npb25zIjpbXSwiaWF0IjoxNzk1NzMwNTY0LCJleHAiOjE4MjcyNjY1NjR9.J856s5tWIQG1GDERdTAfCcuf-oag6dlHMgb2NaGjg7s';
const PRINTROVE_BASE_URL = 'https://api.printrove.com/api/external';

let cachedProducts = null;
let lastFetchTime = 0;
const CACHE_TTL_MS = 30 * 1000; // 30 seconds in-memory cache

/**
 * Maps Printrove Category / Product type to Trevori Category
 */
function mapPrintroveCategory(categoryName, productName) {
  const text = `${categoryName || ''} ${productName || ''}`.toLowerCase();
  if (text.includes('oversized') || text.includes('overshized')) return 'Oversized Tees';
  if (text.includes('hoodie')) return 'Hoodies';
  if (text.includes('sweatshirt') || text.includes('fleece')) return 'Sweatshirts';
  if (text.includes('pant') || text.includes('cargo') || text.includes('trouser')) return 'Pants';
  if (text.includes('jacket') || text.includes('bomber')) return 'Jackets';
  if (text.includes('case') || text.includes('cover') || text.includes('mug') || text.includes('bottle')) return 'Accessories';
  return 'Oversized Tees';
}

/**
 * Determines Gender from category
 */
function mapPrintroveGender(categoryName) {
  const cat = (categoryName || '').toLowerCase();
  if (cat.includes("women's")) return 'Women';
  if (cat.includes("men's")) return 'Men';
  return 'Unisex';
}

/**
 * Fetches all products and their full variant mockups from Printrove
 */
export async function fetchPrintroveStoreProducts(token = DEFAULT_PRINTROVE_TOKEN, forceRefresh = false) {
  const now = Date.now();
  if (!forceRefresh && cachedProducts && (now - lastFetchTime < CACHE_TTL_MS)) {
    return cachedProducts;
  }

  const effectiveToken = token || DEFAULT_PRINTROVE_TOKEN;
  if (!effectiveToken) {
    return [];
  }

  try {
    let allRawProducts = [];
    let page = 1;
    let lastPage = 1;

    // Fetch page 1 (per_page max is 20)
    const listResp = await fetch(`${PRINTROVE_BASE_URL}/products?page=${page}&per_page=20`, {
      headers: {
        'Authorization': `Bearer ${effectiveToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TrevoriStorefront/1.0'
      }
    });

    if (!listResp.ok) {
      console.warn(`[Printrove API] Products list returned status ${listResp.status}`);
      return cachedProducts || [];
    }

    const listData = await listResp.json();
    allRawProducts = listData.products || [];
    lastPage = listData.meta?.last_page || 1;

    // Fetch subsequent pages if any
    while (page < lastPage && page < 5) {
      page++;
      try {
        const nextResp = await fetch(`${PRINTROVE_BASE_URL}/products?page=${page}&per_page=20`, {
          headers: {
            'Authorization': `Bearer ${effectiveToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'TrevoriStorefront/1.0'
          }
        });
        if (nextResp.ok) {
          const nextData = await nextResp.json();
          allRawProducts = allRawProducts.concat(nextData.products || []);
        }
      } catch (e) {
        break;
      }
    }

    const mappedProducts = [];

    for (const item of allRawProducts) {
      try {
        // Fetch detailed product with all color variants and mockups
        const detailResp = await fetch(`${PRINTROVE_BASE_URL}/products/${item.id}`, {
          headers: {
            'Authorization': `Bearer ${effectiveToken}`,
            'Content-Type': 'application/json',
            'User-Agent': 'TrevoriStorefront/1.0'
          }
        });

        if (!detailResp.ok) continue;

        const detailData = await detailResp.json();
        const fullProd = detailData.product || item;

        // Extract primary and secondary mockups
        let primaryImg = fullProd.mockup?.front_mockup || item.mockup?.front_mockup;
        let secondaryImg = fullProd.mockup?.back_mockup || item.mockup?.back_mockup;

        // Process variants, colors, and sizes
        const colorMap = new Map();
        const sizeSet = new Set();
        const formattedVariants = [];

        if (Array.isArray(fullProd.variants)) {
          for (const v of fullProd.variants) {
            if (v.is_active === false) continue;

            const colorName = v.color_normalized?.name || v.product?.color || 'Classic';
            const colorHex = v.color_normalized?.hex || '#171717';
            const sizeName = v.size_normalized || v.product?.size || 'L';

            if (!colorMap.has(colorName)) {
              colorMap.set(colorName, { name: colorName, hex: colorHex });
            }
            sizeSet.add(sizeName);

            if (!primaryImg && v.mockup?.front_mockup) {
              primaryImg = v.mockup.front_mockup;
            }
            if (!secondaryImg && v.mockup?.back_mockup) {
              secondaryImg = v.mockup.back_mockup;
            }

            formattedVariants.push({
              id: String(v.id),
              color: colorName,
              size: sizeName,
              priceINR: parseFloat(v.selling_price || fullProd.total_price || '999'),
              available: v.is_active !== false,
              mockupFront: v.mockup?.front_mockup,
              mockupBack: v.mockup?.back_mockup,
              sku: v.sku
            });
          }
        }

        // Default colors and sizes if empty
        const colors = colorMap.size > 0 
          ? Array.from(colorMap.values())
          : [{ name: 'Ivory', hex: '#fffff0' }, { name: 'Black', hex: '#202020' }, { name: 'Ash Grey', hex: '#c9c9c9' }];
        
        const sizes = sizeSet.size > 0 
          ? Array.from(sizeSet) 
          : ['XS', 'S', 'M', 'L', 'XL', 'XXL'];

        // Retail pricing: Use selling price or apply standard luxury streetwear markup
        const rawBase = parseFloat(fullProd.total_price || fullProd.base_price || '320');
        const retailPriceINR = Math.max(999, Math.round(rawBase * 2.5 / 100) * 100 - 1); // e.g. ₹999 / ₹1,299

        // Fix typos like 'Overshized' -> 'Oversized'
        let cleanName = (fullProd.name || 'Custom Atelier Graphic Tee')
          .replace(/overshized/gi, 'Oversized')
          .trim();

        const trevoriProduct = {
          id: `printrove-${fullProd.id}`,
          name: cleanName,
          category: mapPrintroveCategory(fullProd.product?.category, cleanName),
          gender: mapPrintroveGender(fullProd.product?.category),
          priceINR: retailPriceINR,
          gsm: 240,
          images: {
            primary: primaryImg || 'https://cdn.printrove.com/catalog/products/1440/dielines/956/9cc9ad60-9102-4308-808f-32dcfc921c4e-T1440_Front.png',
            secondary: secondaryImg || primaryImg,
            detail: primaryImg
          },
          colors: colors,
          sizes: sizes,
          fabric: '100% Super-Combed Bio-Washed Cotton (Printrove Atelier)',
          fitDescription: 'Generous oversized drop-shoulder drape engineered for enduring architectural streetwear posture.',
          modelMeasurements: 'Model is 6\'1" wearing size L for signature slouch silhouette.',
          isNewArrival: true,
          isBestSeller: true,
          inStock: true,
          stockCount: 50,
          occasion: ['streetwear', 'casual', 'editorial', 'daily'],
          styleTags: ['Printrove Drop', 'Custom Atelier', 'Heavyweight', 'Graphic Tee'],
          variants: formattedVariants
        };

        mappedProducts.push(trevoriProduct);
      } catch (err) {
        console.error(`[Printrove API] Error mapping product ${item.id}:`, err);
      }
    }

    cachedProducts = mappedProducts;
    lastFetchTime = now;
    return mappedProducts;
  } catch (err) {
    console.error('[Printrove API] Network exception fetching products:', err);
    return cachedProducts || [];
  }
}

/**
 * Fetches designs from Printrove Design Library
 */
export async function fetchPrintroveDesigns(token = DEFAULT_PRINTROVE_TOKEN) {
  const effectiveToken = token || DEFAULT_PRINTROVE_TOKEN;
  try {
    const resp = await fetch(`${PRINTROVE_BASE_URL}/designs?page=1&per_page=20`, {
      headers: {
        'Authorization': `Bearer ${effectiveToken}`,
        'Content-Type': 'application/json',
        'User-Agent': 'TrevoriStorefront/1.0'
      }
    });

    if (!resp.ok) return [];
    const data = await resp.json();
    return data.designs || [];
  } catch (err) {
    console.error('[Printrove API] Error fetching designs:', err);
    return [];
  }
}
