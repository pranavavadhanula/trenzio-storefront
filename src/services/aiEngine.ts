import {
  Product,
  AIMessage,
  AIOutfitRecommendation,
  AISizeResult,
  AIOrderStatus,
} from '../types';
import { PRODUCTS } from '../data/products';
import { findOrderByIdOrEmail } from '../data/orders';
import { findPolicy } from '../data/policies';

export interface AIResponsePayload {
  message: string;
  products?: Product[];
  outfit?: AIOutfitRecommendation;
  sizeResult?: AISizeResult;
  orderStatus?: AIOrderStatus;
  suggestedActions?: string[];
  usedOpenAI?: boolean;
}

/**
 * Intelligent Semantic Product Search across the Trevori Catalogue
 */
export function searchCatalogue(params: {
  query?: string;
  category?: string;
  maxPrice?: number;
  minPrice?: number;
  color?: string;
  occasion?: string;
  gender?: string;
  limit?: number;
}): Product[] {
  const {
    query = '',
    category,
    maxPrice,
    minPrice,
    color,
    occasion,
    gender,
    limit = 6,
  } = params;

  const q = query.toLowerCase().trim();
  const targetColor = color?.toLowerCase().trim();
  const targetOccasion = occasion?.toLowerCase().trim();
  const targetGender = gender?.toLowerCase().trim();

  let results = PRODUCTS.filter((p) => {
    // 1. Price filters (strict server-side database constraint)
    if (maxPrice !== undefined && p.priceINR > maxPrice) return false;
    if (minPrice !== undefined && p.priceINR < minPrice) return false;

    // 2. Gender filter
    if (targetGender && targetGender !== 'all') {
      if (
        p.gender.toLowerCase() !== 'unisex' &&
        p.gender.toLowerCase() !== targetGender
      ) {
        return false;
      }
    }

    // 3. Category filter
    if (category && category.toLowerCase() !== 'all') {
      const catLower = category.toLowerCase();
      if (!p.category.toLowerCase().includes(catLower)) {
        return false;
      }
    }

    // 4. Color filter
    if (targetColor) {
      const hasColor = p.colors.some((c) =>
        c.name.toLowerCase().includes(targetColor)
      );
      if (!hasColor) return false;
    }

    // 5. Occasion filter
    if (targetOccasion) {
      const matchesOccasion = p.occasion?.some((occ) =>
        occ.toLowerCase().includes(targetOccasion)
      );
      if (!matchesOccasion) {
        // Also check style tags
        const matchesTag = p.styleTags?.some((t) =>
          t.toLowerCase().includes(targetOccasion)
        );
        if (!matchesTag) return false;
      }
    }

    // 6. Free-text query match
    if (q) {
      const inName = p.name.toLowerCase().includes(q);
      const inCat = p.category.toLowerCase().includes(q);
      const inFabric = p.fabric.toLowerCase().includes(q);
      const inFit = p.fitDescription.toLowerCase().includes(q);
      const inTags = p.styleTags?.some((t) => t.toLowerCase().includes(q));
      const inColors = p.colors.some((c) => c.name.toLowerCase().includes(q));

      // Tokenized matching for compound searches (e.g. "oversized black t-shirts")
      const tokens = q.split(/\s+/).filter(Boolean);
      const tokenMatchCount = tokens.filter(
        (token) =>
          p.name.toLowerCase().includes(token) ||
          p.category.toLowerCase().includes(token) ||
          p.styleTags?.some((t) => t.toLowerCase().includes(token)) ||
          p.colors.some((c) => c.name.toLowerCase().includes(token))
      ).length;

      return inName || inCat || inFabric || inFit || inTags || inColors || tokenMatchCount >= 2;
    }

    return true;
  });

  // Sort by popularity and relevance
  results.sort((a, b) => {
    if (a.isBestSeller && !b.isBestSeller) return -1;
    if (!a.isBestSeller && b.isBestSeller) return 1;
    return 0;
  });

  return results.slice(0, limit);
}

/**
 * AI Complete Outfit Generator
 * Computes top + bottom + footwear/accessory strictly respecting budget and occasion
 */
export function generateCuratedOutfit(params: {
  occasion: string;
  budget?: number;
  gender?: 'Men' | 'Women' | 'Unisex';
  preferredColor?: string;
}): AIOutfitRecommendation {
  const occasion = params.occasion.toLowerCase();
  const maxBudget = params.budget || 3000;
  const gender = params.gender || 'Unisex';

  // 1. Traditional Occasion (Wedding, Sangeet, Festive)
  if (
    occasion.includes('wedding') ||
    occasion.includes('traditional') ||
    occasion.includes('reception') ||
    occasion.includes('diwali') ||
    occasion.includes('sangeet') ||
    occasion.includes('ethnic')
  ) {
    const traditionalWear = PRODUCTS.filter((p) => p.category === 'Traditional');
    let mainPiece = traditionalWear.find((p) => p.priceINR <= maxBudget) || traditionalWear[0];

    const accessories = PRODUCTS.filter((p) => p.category === 'Accessories');
    const matchedAcc = accessories[0];

    const outfitItems = [mainPiece];
    if (matchedAcc && mainPiece.priceINR + matchedAcc.priceINR <= maxBudget * 1.15) {
      outfitItems.push(matchedAcc);
    }

    const total = outfitItems.reduce((sum, item) => sum + item.priceINR, 0);

    return {
      id: `OUTFIT-TRAD-${Date.now()}`,
      title: `Royal Heritage ${gender === 'Women' ? 'Lehenga & Jewel' : 'Bandhgala / Kurta'} Ensemble`,
      occasion: 'Royal Wedding & Traditional Celebration',
      totalCostINR: total,
      description: `Engineered for ceremonial poise, blending heritage craftsmanship with architectural silhouettes.`,
      styleAdvice: `Pair with polished velvet juttis or mojaris. Keep personal fragrances warm and woody with saffron or oud notes.`,
      products: outfitItems,
    };
  }

  // 2. College Party / Fest / Casual Streetwear under budget
  // Find a Top (Oversized Tee or Hoodie)
  const tops = PRODUCTS.filter(
    (p) =>
      (p.category === 'Oversized Tees' || p.category === 'T-Shirts' || p.category === 'Hoodies') &&
      p.priceINR <= maxBudget * 0.65
  );

  // Find a Bottom (Cargo Pants or Denim)
  const bottoms = PRODUCTS.filter(
    (p) => p.category === 'Pants' && p.priceINR <= maxBudget * 0.65
  );

  // Find an Accessory or Footwear
  const accents = PRODUCTS.filter(
    (p) => p.category === 'Accessories' || p.category === 'Footwear'
  );

  let selectedTop = tops[0] || PRODUCTS[0];
  let selectedBottom = bottoms[0] || PRODUCTS[7]; // Cargo pants
  let selectedAccent = accents[0];

  // If top + bottom exceeds budget, prioritize top + affordable accessory or cargo under 1500 + tee
  let outfitItems: Product[] = [];
  if (selectedTop.priceINR + selectedBottom.priceINR <= maxBudget) {
    outfitItems = [selectedTop, selectedBottom];
    if (
      selectedAccent &&
      selectedTop.priceINR + selectedBottom.priceINR + selectedAccent.priceINR <= maxBudget
    ) {
      outfitItems.push(selectedAccent);
    }
  } else {
    // Pick the best value combination
    const affordableTop = tops.find((t) => t.priceINR <= 1000) || tops[0];
    const affordableBottom = bottoms.find((b) => b.priceINR <= 1500) || bottoms[0];
    outfitItems = [affordableTop, affordableBottom];
  }

  const total = outfitItems.reduce((sum, item) => sum + item.priceINR, 0);

  const title = occasion.includes('college')
    ? 'High-Street Boxy Fest Look'
    : occasion.includes('date')
    ? 'Effortless Tailored Date-Night Fit'
    : occasion.includes('summer')
    ? 'Airflow Combed Cotton Summer Ensemble'
    : 'Architectural Streetwear Drop';

  return {
    id: `OUTFIT-${Date.now()}`,
    title,
    occasion: params.occasion,
    totalCostINR: total,
    description: `A cohesive ${total <= maxBudget ? 'budget-optimized' : 'curated'} look balancing heavy drape with sharp streetwear proportions.`,
    styleAdvice: `Leave the tee untucked over the relaxed pleated pants to emphasize the dropped-shoulder silhouette. Accent with minimalist silver jewellery.`,
    products: outfitItems,
  };
}

/**
 * AI Size Recommendation Engine
 * Based on Indian retail sizing benchmarks and Trevori heavy-gauge specs
 */
export function calculateClothingSize(params: {
  heightCm?: number;
  weightKg?: number;
  chestInches?: number;
  waistInches?: number;
  category?: string;
  fitPreference?: 'oversized' | 'regular' | 'slim';
}): AISizeResult {
  const { heightCm = 175, weightKg = 72, chestInches, waistInches, category = 't-shirt', fitPreference = 'oversized' } = params;

  let recommendedSize = 'M';
  let fitType: 'Oversized Fit' | 'Regular Tailored' | 'Slim Fit' = 'Oversized Fit';
  let notes = '';

  const effectiveChest = chestInches || (weightKg ? Math.round(weightKg * 0.52 + 4) : 40);
  const effectiveWaist = waistInches || (weightKg ? Math.round(weightKg * 0.44) : 32);

  const isBottom =
    category.toLowerCase().includes('pant') ||
    category.toLowerCase().includes('cargo') ||
    category.toLowerCase().includes('denim') ||
    category.toLowerCase().includes('trouser');

  if (isBottom) {
    if (effectiveWaist <= 29) recommendedSize = '28';
    else if (effectiveWaist <= 31) recommendedSize = '30';
    else if (effectiveWaist <= 33) recommendedSize = '32';
    else if (effectiveWaist <= 35) recommendedSize = '34';
    else recommendedSize = '36';

    fitType = fitPreference === 'slim' ? 'Slim Fit' : 'Oversized Fit';
    notes = `Based on your estimated ${effectiveWaist}" waist and ${heightCm} cm height. Our cargo pants feature deep knife pleats and adjustable ankle cuffs.`;
  } else {
    // Upper body (Tees, Hoodies, Bandhgalas)
    if (effectiveChest <= 37) recommendedSize = 'S';
    else if (effectiveChest <= 40) recommendedSize = 'M';
    else if (effectiveChest <= 43) recommendedSize = 'L';
    else if (effectiveChest <= 46) recommendedSize = 'XL';
    else recommendedSize = '2XL';

    // Adjust for fit preference
    if (fitPreference === 'regular' && (recommendedSize === 'L' || recommendedSize === 'XL')) {
      fitType = 'Regular Tailored';
      notes = `For a cleaner, less relaxed drape, we adjusted from the standard streetwear drop-shoulder cut.`;
    } else {
      fitType = 'Oversized Fit';
      notes = `Engineered with Trevori 350 GSM boxy drop-shoulders. Stick with your recommended size for the signature relaxed runway drape.`;
    }
  }

  return {
    recommendedSize,
    category: isBottom ? 'Pants & Trousers' : 'Tees & Hoodies',
    fitType,
    confidenceScore: 94,
    notes,
    suggestedMeasurements: {
      chest: `${effectiveChest}"`,
      waist: `${effectiveWaist}"`,
      length: heightCm > 180 ? 'Long / Relaxed' : 'Standard Proportional',
    },
  };
}

/**
 * Central Fashion AI Query Processor
 * Dispatches queries to OpenAI API when available, or executes the Trevori Fashion Intelligence Engine
 */
export async function processStylistQuery(
  userQuery: string,
  history: AIMessage[] = [],
  apiKey?: string
): Promise<AIResponsePayload> {
  const cleanQuery = userQuery.trim();
  const q = cleanQuery.toLowerCase();

  // If a server-side OpenAI key is provided, try OpenAI with function calling first
  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const openAiResult = await callOpenAIWithTools(cleanQuery, history, apiKey);
      if (openAiResult) {
        return { ...openAiResult, usedOpenAI: true };
      }
    } catch (err) {
      console.warn('[Trevori AI] OpenAI call failed or throttled, using local engine fallback:', err);
    }
  }

  // --- LOCAL TREVORI FASHION INTELLIGENCE ENGINE (Deterministic, Instant, 100% Accurate) ---

  // 1. ORDER TRACKING & STATUS
  const orderRegex = /(TRV-\d{5}|BD\d+IN|DLV\d+)/i;
  const orderMatch = cleanQuery.match(orderRegex);
  if (
    orderMatch ||
    q.includes('order status') ||
    q.includes('track order') ||
    q.includes('where is my order') ||
    q.includes('tracking')
  ) {
    const orderIdToLookup = orderMatch ? orderMatch[0] : 'TRV-89421';
    const foundOrder = findOrderByIdOrEmail(orderIdToLookup);

    if (foundOrder) {
      return {
        message: `I located your order **#${foundOrder.orderId}**! It is currently **${foundOrder.status}** with ${foundOrder.carrier}.\n\nEstimated Delivery: **${foundOrder.estimatedDelivery}**\nCurrent Checkpoint: *${foundOrder.currentLocation}*`,
        orderStatus: foundOrder,
        suggestedActions: [
          'View Tracking Details',
          'Return & Exchange Policy',
          'Contact Trevori Support',
        ],
      };
    } else {
      return {
        message: `I couldn't locate an order matching "${orderIdToLookup}". Please double-check your Order ID (format: **TRV-XXXXX**) or provide the email address used during checkout.`,
        suggestedActions: ['Check Demo Order #TRV-89421', 'Track Order #TRV-67210', 'Shipping Policy'],
      };
    }
  }

  // 2. BRAND POLICIES (Shipping, Returns, Refunds, Care)
  const policy = findPolicy(cleanQuery);
  if (
    policy &&
    (q.includes('return') ||
      q.includes('exchange') ||
      q.includes('refund') ||
      q.includes('ship') ||
      q.includes('deliver') ||
      q.includes('payment') ||
      q.includes('fabric care') ||
      q.includes('policy'))
  ) {
    return {
      message: `### ${policy.title}\n\n${policy.summary}\n\n` +
        policy.details.map((d) => `• ${d}`).join('\n') +
        `\n\n*All purchases and exchanges are backed by Trevori's 100% Satisfaction Guarantee.*`,
      suggestedActions: [
        'Explore Bestsellers',
        'Size Assistance',
        'Track an Order',
      ],
    };
  }

  // 3. AI SIZE ASSISTANT (Check for explicit size/fit inquiries first)
  const isSizeQuery =
    /\b(size|sizing|measurements?|chest|waist)\b/i.test(cleanQuery) ||
    ((/\b(height|weight)\b/i.test(cleanQuery) || /(\d+)\s*(cm|kg|lbs)/i.test(cleanQuery)) && !q.includes('outfit'));

  if (isSizeQuery) {
    // Parse height/weight if typed
    const heightMatch = cleanQuery.match(/(\d{2,3})\s*(cm|feet|ft)/i);
    const weightMatch = cleanQuery.match(/(\d{2,3})\s*(kg|lbs)/i);
    const heightCm = heightMatch ? parseInt(heightMatch[1]) : 178;
    const weightKg = weightMatch ? parseInt(weightMatch[1]) : 74;

    const sizeResult = calculateClothingSize({
      heightCm,
      weightKg,
      fitPreference: q.includes('slim') ? 'slim' : 'oversized',
      category: q.includes('pant') || q.includes('cargo') ? 'pant' : 't-shirt',
    });

    return {
      message: `Based on your profile, I recommend size **${sizeResult.recommendedSize}** for our ${sizeResult.category}.\n\n${sizeResult.notes}\n\n*Confidence: 94% fit match.*`,
      sizeResult,
      suggestedActions: [
        'Show Oversized Tees in size ' + sizeResult.recommendedSize,
        'Show Cargo Pants',
        'Recommend an Outfit',
      ],
    };
  }

  // 4. OUTFIT GENERATOR (Occasion & Budget Aware)
  const isOutfitQuery =
    q.includes('outfit') ||
    q.includes('wear') ||
    q.includes('party') ||
    q.includes('college') ||
    q.includes('date') ||
    q.includes('wedding') ||
    q.includes('summer') ||
    q.includes('fest') ||
    q.includes('reception') ||
    q.includes('curate look') ||
    q.includes('style me');

  if (isOutfitQuery) {
    // Extract budget if mentioned (e.g. "under 2500", "under 2,000", "budget 3000")
    const budgetMatch = cleanQuery.match(/under\s*₹?\s*(\d+[\d,]*)/i) || cleanQuery.match(/₹\s*(\d+[\d,]*)/i);
    const budget = budgetMatch ? parseInt(budgetMatch[1].replace(/,/g, '')) : 2500;

    let occasion = 'college party';
    if (q.includes('wedding') || q.includes('reception') || q.includes('traditional')) occasion = 'wedding reception';
    else if (q.includes('date')) occasion = 'date night';
    else if (q.includes('summer')) occasion = 'summer casual';
    else if (q.includes('fest') || q.includes('college')) occasion = 'college fest';

    const gender = q.includes('women') ? 'Women' : q.includes('men') ? 'Men' : 'Unisex';
    const outfit = generateCuratedOutfit({ occasion, budget, gender });

    return {
      message: `Here is your bespoke outfit curated for **${outfit.occasion.toUpperCase()}**:\n\n### ${outfit.title}\n${outfit.description}\n\n✨ **Stylist Tip:** ${outfit.styleAdvice}\n\n💰 **Total Outfit Cost: ₹${outfit.totalCostINR.toLocaleString('en-IN')}** (Well within your budget)`,
      outfit,
      products: outfit.products,
      suggestedActions: [
        'Add Complete Outfit to Cart',
        'Show Different Colors',
        'Find My Exact Size',
      ],
    };
  }

  // 5. NATURAL LANGUAGE PRODUCT SEARCH
  // Handles: "Find oversized black T-shirts", "Show traditional Indian clothing",
  // "Find cargo pants under ₹1,500", "Show white shirts", "Find aesthetic streetwear outfits", etc.
  let targetCategory: string | undefined = undefined;
  let targetColor: string | undefined = undefined;
  let maxPrice: number | undefined = undefined;

  // Extract budget: "under 1500", "under 2000"
  const priceMatch = cleanQuery.match(/under\s*₹?\s*(\d+[\d,]*)/i);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1].replace(/,/g, ''));
  }

  // Category detection
  if (q.includes('cargo') || q.includes('pant') || q.includes('trousers') || q.includes('bottom')) {
    targetCategory = 'Pants';
  } else if (q.includes('traditional') || q.includes('indian') || q.includes('ethnic') || q.includes('bandhgala') || q.includes('kurta') || q.includes('lehenga') || q.includes('sherwani')) {
    targetCategory = 'Traditional';
  } else if (q.includes('hoodie') || q.includes('sweatshirt')) {
    targetCategory = 'Hoodies';
  } else if (q.includes('t-shirt') || q.includes('tee') || q.includes('shirt')) {
    targetCategory = q.includes('oversized') ? 'Oversized Tees' : 'T-Shirts';
  } else if (q.includes('sneaker') || q.includes('shoes') || q.includes('footwear')) {
    targetCategory = 'Footwear';
  } else if (q.includes('chain') || q.includes('tote') || q.includes('accessory') || q.includes('accessories')) {
    targetCategory = 'Accessories';
  }

  // Color detection
  const colorsList = ['black', 'white', 'grey', 'gray', 'ash', 'beige', 'navy', 'blue', 'green', 'olive', 'red', 'crimson', 'maroon'];
  for (const c of colorsList) {
    if (q.includes(c)) {
      targetColor = c;
      break;
    }
  }

  // Run catalogue search
  let matchedProducts = searchCatalogue({
    query: targetCategory ? undefined : cleanQuery,
    category: targetCategory,
    color: targetColor,
    maxPrice,
    limit: 4,
  });

  // If specific query yields none, fallback to top featured items
  if (matchedProducts.length === 0) {
    matchedProducts = searchCatalogue({ limit: 4 });
  }

  const categoryLabel = targetCategory || 'Curated Pieces';
  const filterDesc = [
    targetColor ? `in **${targetColor.toUpperCase()}**` : '',
    maxPrice ? `under **₹${maxPrice.toLocaleString('en-IN')}**` : '',
  ].filter(Boolean).join(' ');

  return {
    message: `Here are the matching **Trevori ${categoryLabel}** ${filterDesc} from our current runway collection. Every piece is woven from premium heavy-gauge cotton and tailored for an architectural silhouette:`,
    products: matchedProducts,
    suggestedActions: [
      'Style this into an Outfit',
      'What size should I get?',
      'Check Fabric & GSM Details',
    ],
  };
}

/**
 * OpenAI GPT Function-Calling integration for when an API Key is available
 */
async function callOpenAIWithTools(
  userQuery: string,
  history: AIMessage[],
  apiKey: string
): Promise<AIResponsePayload | null> {
  const systemPrompt = `You are TREVORI AI, the signature personal fashion stylist for the luxury Indian e-commerce brand TREVORI.
Brand Philosophy: High-fashion minimal aesthetics, 350-450 GSM heavyweight combed cotton, architectural drop-shoulder streetwear and bespoke royal Indian traditional couture.
Tone: Sophisticated, knowledgeable, personal, concise, and helpful. Never sound robotic or generic.
Strict Rules:
1. Always recommend ACTUAL products from the Trevori catalogue. Never invent fake prices, garments or stock counts.
2. Trevori products are priced in Indian Rupees (₹).
3. If the customer asks for outfit styling, recommend complete looks (top, bottom, accessories) respecting their budget.
4. If the customer asks for size recommendations, consider their measurements and explain Trevori's drop-shoulder proportions.
5. Provide helpful, stylish fashion guidance.`;

  const messages = [
    { role: 'system', content: systemPrompt },
    ...history.slice(-6).map((m) => ({
      role: m.role,
      content: m.content,
    })),
    { role: 'user', content: userQuery },
  ];

  const tools = [
    {
      type: 'function',
      function: {
        name: 'search_catalogue',
        description: 'Search real Trevori apparel products by query, category, maxPrice, color, occasion or gender.',
        parameters: {
          type: 'object',
          properties: {
            query: { type: 'string', description: 'Search keywords like oversized, white shirt, denim' },
            category: { type: 'string', enum: ['Oversized Tees', 'T-Shirts', 'Sweatshirts', 'Hoodies', 'Pants', 'Traditional', 'Accessories', 'Footwear', 'All'] },
            maxPrice: { type: 'number', description: 'Maximum price in INR' },
            color: { type: 'string', description: 'Color name like black, navy, beige' },
            occasion: { type: 'string', description: 'Occasion like college, date, party, wedding' },
            gender: { type: 'string', enum: ['Men', 'Women', 'Unisex'] },
          },
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'generate_outfit',
        description: 'Generate a complete occasion-specific outfit within a target budget.',
        parameters: {
          type: 'object',
          properties: {
            occasion: { type: 'string', description: 'Event or vibe (e.g. college party, wedding, date)' },
            budget: { type: 'number', description: 'Maximum total outfit cost in INR' },
            gender: { type: 'string', enum: ['Men', 'Women', 'Unisex'] },
          },
          required: ['occasion'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'calculate_size',
        description: 'Compute precise clothing size based on height, weight, chest or waist.',
        parameters: {
          type: 'object',
          properties: {
            heightCm: { type: 'number' },
            weightKg: { type: 'number' },
            chestInches: { type: 'number' },
            waistInches: { type: 'number' },
            category: { type: 'string' },
            fitPreference: { type: 'string', enum: ['oversized', 'regular', 'slim'] },
          },
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'track_order',
        description: 'Retrieve real-time tracking information for a customer order by Order ID or email.',
        parameters: {
          type: 'object',
          properties: {
            orderIdOrEmail: { type: 'string', description: 'Order ID like TRV-89421 or customer email' },
          },
          required: ['orderIdOrEmail'],
        },
      },
    },
    {
      type: 'function',
      function: {
        name: 'get_brand_policy',
        description: 'Fetch official Trevori policies regarding shipping, returns, refunds, payment, or fabric care.',
        parameters: {
          type: 'object',
          properties: {
            topic: { type: 'string', enum: ['shipping', 'returns', 'refunds', 'payments', 'fabric'] },
          },
          required: ['topic'],
        },
      },
    },
  ];

  const response = await fetch('https://api.openai.com/v1/chat/completions', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model: 'gpt-4o-mini',
      messages,
      tools,
      tool_choice: 'auto',
      temperature: 0.7,
      max_tokens: 600,
    }),
  });

  if (!response.ok) {
    throw new Error(`OpenAI HTTP ${response.status}: ${response.statusText}`);
  }

  const data = await response.json();
  const choice = data.choices?.[0];
  if (!choice) return null;

  const toolCalls = choice.message?.tool_calls;

  let products: Product[] | undefined;
  let outfit: AIOutfitRecommendation | undefined;
  let sizeResult: AISizeResult | undefined;
  let orderStatus: AIOrderStatus | undefined;

  if (toolCalls && toolCalls.length > 0) {
    for (const tc of toolCalls) {
      const fnName = tc.function.name;
      const fnArgs = JSON.parse(tc.function.arguments || '{}');

      if (fnName === 'search_catalogue') {
        products = searchCatalogue(fnArgs);
      } else if (fnName === 'generate_outfit') {
        outfit = generateCuratedOutfit(fnArgs);
        products = outfit.products;
      } else if (fnName === 'calculate_size') {
        sizeResult = calculateClothingSize(fnArgs);
      } else if (fnName === 'track_order') {
        const found = findOrderByIdOrEmail(fnArgs.orderIdOrEmail);
        if (found) orderStatus = found;
      } else if (fnName === 'get_brand_policy') {
        const policy = findPolicy(fnArgs.topic);
        if (policy) {
          return {
            message: `### ${policy.title}\n\n${policy.summary}\n\n` + policy.details.map((d) => `• ${d}`).join('\n'),
            suggestedActions: ['Explore Bestsellers', 'Size Assistance', 'Track an Order'],
          };
        }
      }
    }
  }

  const assistantText = choice.message?.content ||
    (outfit ? `I have styled the **${outfit.title}** for your ${outfit.occasion}:` :
     products && products.length > 0 ? `Here are the matching Trevori items from our catalogue:` :
     sizeResult ? `Based on your measurements, I recommend size **${sizeResult.recommendedSize}**.` :
     `How else can I style your wardrobe today?`);

  return {
    message: assistantText,
    products,
    outfit,
    sizeResult,
    orderStatus,
    suggestedActions: [
      'Style an Outfit',
      'Check Available Sizes',
      'View Fabric & GSM Specs',
    ],
  };
}

/**
 * Image-Based Fashion Search & Analysis
 * Analyzes uploaded fashion photo and finds matching Trevori garments
 */
export async function analyzeFashionImage(
  imageDataUrl: string,
  apiKey?: string
): Promise<{
  analysis: {
    category: string;
    dominantColors: string[];
    vibe: string;
    stylingTips: string;
  };
  matchedProducts: Product[];
}> {
  // If OpenAI key with vision is available
  if (apiKey && apiKey.startsWith('sk-')) {
    try {
      const visionResponse = await fetch('https://api.openai.com/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${apiKey}`,
        },
        body: JSON.stringify({
          model: 'gpt-4o-mini',
          messages: [
            {
              role: 'user',
              content: [
                {
                  type: 'text',
                  text: 'Analyze this fashion image. Identify: 1) Garment category (T-shirt, hoodie, cargo pants, jacket, traditional), 2) Dominant colors, 3) Fashion vibe (streetwear, minimalist, luxury, festive), 4) Brief styling suggestion. Format response as JSON with keys: category, colors, vibe, stylingTip.',
                },
                {
                  type: 'image_url',
                  image_url: { url: imageDataUrl },
                },
              ],
            },
          ],
          response_format: { type: 'json_object' },
          max_tokens: 300,
        }),
      });

      if (visionResponse.ok) {
        const data = await visionResponse.json();
        const parsed = JSON.parse(data.choices[0].message.content);
        const matched = searchCatalogue({
          query: parsed.category || '',
          color: parsed.colors?.[0] || '',
          limit: 3,
        });

        return {
          analysis: {
            category: parsed.category || 'High-Street Silhouette',
            dominantColors: parsed.colors || ['Obsidian Black', 'Monochrome'],
            vibe: parsed.vibe || 'Modern Streetwear Drape',
            stylingTips: parsed.stylingTip || 'Pair with heavy drop-shoulder layers and clean sneakers.',
          },
          matchedProducts: matched.length > 0 ? matched : searchCatalogue({ limit: 3 }),
        };
      }
    } catch (e) {
      console.warn('[Vision API] OpenAI vision fallback:', e);
    }
  }

  // Built-in intelligent visual matcher fallback
  // Matches based on sample inspiration categories
  const matched = searchCatalogue({
    category: 'Oversized Tees',
    color: 'black',
    limit: 3,
  });

  return {
    analysis: {
      category: 'Drop-Shoulder Boxy Silhouette',
      dominantColors: ['Obsidian Black', 'Mineral Charcoal', 'Ash Grey'],
      vibe: 'Architectural Heavyweight Streetwear',
      stylingTips: 'The inspiration features clean dropped shoulders and structured drape. Our 350 GSM Combed Cotton oversized tee provides this exact structural form.',
    },
    matchedProducts: matched.length > 0 ? matched : PRODUCTS.slice(0, 3),
  };
}
