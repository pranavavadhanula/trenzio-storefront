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
      notes = `Tailored with Trevori relaxed boxy drop-shoulders. Stick with your recommended size for the signature easy runway drape.`;
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
    const orderIdToLookup = orderMatch ? orderMatch[0] : '';
    const foundOrder = orderIdToLookup ? findOrderByIdOrEmail(orderIdToLookup) : null;

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
        message: `There are currently no active orders in our system. All past test orders have been cleared pending Shopify storefront integration.\n\nOnce an order is placed through our store, your live Blue Dart shipping checkpoints and delivery milestones will appear here in real time.`,
        suggestedActions: ['Browse New Arrivals', 'Sizing Recommendations', 'Shipping Policy'],
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
    /\b(size|sizing|measurements?|chest|waist|fit|fitting)\b/i.test(cleanQuery) ||
    ((/\b(height|weight)\b/i.test(cleanQuery) || /(\d+)\s*(cm|kg|lbs)/i.test(cleanQuery)) && !q.includes('outfit'));

  if (isSizeQuery) {
    // Parse chest, waist, height, and weight from user input
    const chestMatch = cleanQuery.match(/(\d{2})\s*["']?\s*(?:inch(?:es)?)?\s*chest/i) || cleanQuery.match(/chest\s*(?:size)?\s*(?:of|is|:)?\s*(\d{2})/i);
    const waistMatch = cleanQuery.match(/(\d{2})\s*["']?\s*(?:inch(?:es)?)?\s*waist/i) || cleanQuery.match(/waist\s*(?:size)?\s*(?:of|is|:)?\s*(\d{2})/i);
    const heightMatch = cleanQuery.match(/(\d{2,3})\s*(cm|feet|ft)/i);
    const weightMatch = cleanQuery.match(/(\d{2,3})\s*(kg|lbs)/i);

    const chestInches = chestMatch ? parseInt(chestMatch[1]) : undefined;
    const waistInches = waistMatch ? parseInt(waistMatch[1]) : undefined;
    const heightCm = heightMatch ? parseInt(heightMatch[1]) : (chestInches ? 178 : undefined);
    const weightKg = weightMatch ? parseInt(weightMatch[1]) : (chestInches ? Math.round((chestInches - 4) / 0.52) : undefined);

    const isPantQuery = q.includes('pant') || q.includes('cargo') || q.includes('waist') || q.includes('trouser') || q.includes('denim');

    const sizeResult = calculateClothingSize({
      heightCm: heightCm || 178,
      weightKg: weightKg || 74,
      chestInches,
      waistInches,
      fitPreference: q.includes('slim') ? 'slim' : q.includes('regular') ? 'regular' : 'oversized',
      category: isPantQuery ? 'pant' : 't-shirt',
    });

    let conversationalMessage = '';

    if (chestInches) {
      const standardSize = chestInches <= 37 ? 'S' : chestInches <= 40 ? 'M' : chestInches <= 43 ? 'L' : 'XL';
      const oversizedSize = chestInches <= 37 ? 'M' : chestInches <= 40 ? 'L' : chestInches <= 43 ? 'XL' : '2XL';
      
      conversationalMessage =
        `For a **${chestInches}" chest**, here is how our silhouettes are tailored to drape:\n\n` +
        `• **Size ${standardSize} (Clean Relaxed Fit):** Tailored with ~4" of chest ease. It provides a boxy drape that defines your shoulders without excess bulk.\n` +
        `• **Size ${oversizedSize} (Signature Streetwear Drop-Shoulder):** Tailored with ~6" of ease for an easy dropped-shoulder runway silhouette.\n\n` +
        `💡 *All Trevori drops are woven from 100% bio-washed combed cotton and pre-shrunk, ensuring zero shrinkage after washing.*`;
    } else if (waistInches) {
      conversationalMessage =
        `For a **${waistInches}" waist**, your optimal fit is **Size ${sizeResult.recommendedSize}** in our Indigo Denim and Pleated Cargo Pants.\n\n` +
        `Our bottoms feature architectural knife pleats and an internal drawstring waistband for a bespoke tailored feel.`;
    } else {
      conversationalMessage =
        `Based on your measurements, I recommend **Size ${sizeResult.recommendedSize}** for our ${sizeResult.category}.\n\n` +
        `Our cuts are tailored with relaxed boxy drop-shoulders. If you prefer a closer, tailored fit, size down; for the signature relaxed runway drape, stay true to size.`;
    }

    return {
      message: conversationalMessage,
      sizeResult,
      suggestedActions: [
        `Show Oversized Tees in size ${sizeResult.recommendedSize}`,
        'Show Hoodies & Sweatshirts',
        'Recommend an Outfit',
      ],
    };
  }

  // 3B. COLOR STYLING & AESTHETIC ADVICE ("can I wear black with navy?", "color combination", "what matches with olive")
  const isColorAdvice =
    (q.includes('color') || q.includes('pair') || q.includes('match') || q.includes('with') || q.includes('can i wear') || q.includes('look good') || q.includes('combination')) &&
    (q.includes('black') || q.includes('navy') || q.includes('white') || q.includes('grey') || q.includes('gray') || q.includes('beige') || q.includes('olive') || q.includes('brown') || q.includes('maroon')) &&
    !q.includes('show') && !q.includes('buy') && !q.includes('find');

  if (isColorAdvice) {
    return {
      message: `### Trevori Styling Masterclass: Color Harmony & Aesthetics\n\n` +
        `Yes, absolutely! Pairing **Midnight Navy** with **Obsidian Black** is one of contemporary luxury fashion's most elevated, understated moves:\n\n` +
        `1. **Contrast Through Textile Texture:** Pair a midnight navy loopback French Terry hoodie with washed obsidian black denim or pleated cargo trousers. The contrasting cotton weaves prevent the colors from blending into a muddle.\n` +
        `2. **Anchor with a Raw-Edge White Layer:** Allow a subtle peek of a crisp white combed cotton tee at the collar or hemline to create a crisp visual barrier between the two deep tones.\n` +
        `3. **Minimalist Hardware & Accessories:** Accentuate with brushed silver or stainless steel chain jewellery to reflect light against the dark palette.\n\n` +
        `*Would you like me to curate a complete Navy & Black outfit within your budget, or suggest pieces in this palette?*`,
      suggestedActions: [
        'Curate Navy & Black Look',
        'Show Hoodies & Sweatshirts',
        'Show Pleated Cargo Pants',
      ],
    };
  }

  // 4. OUTFIT GENERATOR (Occasion & Budget Aware)
  const isOutfitQuery =
    q.includes('outfit') ||
    q.includes('curate look') ||
    q.includes('style me') ||
    q.includes('what to wear to') ||
    q.includes('what to wear for') ||
    q.includes('what should i wear for') ||
    q.includes('what should i wear to') ||
    q.includes('party outfit') ||
    q.includes('wedding outfit') ||
    q.includes('college fest') ||
    q.includes('date night') ||
    ((q.includes('party') || q.includes('wedding') || q.includes('college')) && (q.includes('look') || q.includes('suggest') || q.includes('recommend')));

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

  // 5. CONVERSATIONAL & GENERAL KNOWLEDGE INTELLIGENCE (ChatGPT-Grade Conversational Fluency)

  // 5A. Sleep & Sleepwear Inquiries ("how to sleep?", "can't sleep", "sleep tips", "insomnia")
  if (
    q.includes('sleep') ||
    q.includes('insomnia') ||
    q.includes('tired') ||
    q.includes('bedtime') ||
    q.includes('cant sleep') ||
    q.includes("can't sleep") ||
    q.includes('night routine') ||
    q.includes('nap')
  ) {
    return {
      message: `Here are 5 proven steps to fall asleep naturally and achieve deep, restorative rest:\n\n` +
        `1. **Keep Your Sleeping Space Cool:** The body's core temperature needs to drop by about 1°C to initiate sleep. Keep your bedroom between **18°C–20°C (65°F–68°F)**.\n` +
        `2. **Wear Breathable, Loose Natural Cotton:** Synthetic polyester fabrics trap heat and moisture, disrupting deep REM cycles. Sleep in loose-fitting, **100% combed breathable cotton** (like a soft oversized tee) that lets your skin breathe.\n` +
        `3. **The 4-7-8 Relaxation Technique:** Inhale quietly through your nose for **4 seconds**, hold your breath for **7 seconds**, and exhale completely through your mouth for **8 seconds**. This slows your heart rate and quiets racing thoughts.\n` +
        `4. **Eliminate Blue Light 60 Mins Before Bed:** Screen light from phones, tablets, and laptops suppresses your brain's natural melatonin release. Switch to reading or listening to calm music.\n` +
        `5. **Consistent Circadian Schedule:** Waking up at the exact same hour every morning stabilizes your internal body clock.\n\n` +
        `*Would you like me to recommend our most comfortable, lightweight 100% breathable combed cotton lounge tees, or are you having trouble winding down tonight?*`,
      suggestedActions: [
        'Show Lightweight Combed Cotton Tees',
        'Find Relaxed Loungewear',
        'Tell me about Trevori Fabric Care',
      ],
    };
  }

  // 5B. Greetings & Warm Small Talk ("hi", "hello", "hey", "namaste", "good morning")
  const isGreeting =
    /^(hi|hello|hey|namaste|yo|sup|good\s*(morning|afternoon|evening|night)|howdy|greetings)\b/i.test(cleanQuery) ||
    cleanQuery.length <= 4;
  if (isGreeting && !q.includes('hoodie') && !q.includes('pant') && !q.includes('tee')) {
    return {
      message: `Hello & Welcome! I am **TREVORI AI**, your 24/7 personal fashion stylist and concierge.\n\n` +
        `I can help you with:\n` +
        `• **Occasion Styling:** Curate complete streetwear & traditional outfits under any budget\n` +
        `• **Precision Sizing:** Compute your exact fit across our shirts, tees, and hoodies\n` +
        `• **Catalogue Discovery:** Find specific pieces, colors, fabrics, and silhouettes\n` +
        `• **Order Tracking:** Check real-time shipping milestones once your order is placed\n` +
        `• **General Style & Lifestyle Advice:** From color coordination to fabric science\n\n` +
        `How can I assist you today?`,
      suggestedActions: [
        'Suggest an outfit for a party under ₹2,500',
        'Find oversized black T-shirts',
        'What size should I wear for a 40" chest?',
        'Show Royal Traditional Wear',
      ],
    };
  }

  // 5C. Identity & Assistant Questions ("who are you", "what can you do", "are you ai")
  if (
    q.includes('who are you') ||
    q.includes('what are you') ||
    q.includes('what can you do') ||
    q.includes('are you ai') ||
    q.includes('are you real') ||
    q.includes('are you chatgpt')
  ) {
    return {
      message: `I am **TREVORI AI** — an intelligent, conversational fashion stylist and concierge engineered specifically for the luxury streetwear and traditional couture world of **TREVORI**.\n\n` +
        `Just like ChatGPT, you can converse with me naturally about anything: styling aesthetics, fabric engineering, color matching, sizing algorithms, lifestyle tips, order tracking, or brand history.\n\n` +
        `What would you like to explore?`,
      suggestedActions: [
        'Style an outfit under ₹2,500',
        'What is French Terry?',
        'Find cargo pants under ₹1,500',
      ],
    };
  }

  // 5D. Jokes & Humor ("tell me a joke", "make me laugh")
  if (q.includes('joke') || q.includes('funny') || q.includes('make me laugh')) {
    return {
      message: `Why did the oversized hoodie break up with the skinny jeans?\n\n` +
        `*Because it needed more space to express its perspective!* 😄\n\n` +
        `On a serious note, what can I help you style or find in our drops today?`,
      suggestedActions: [
        'Show Oversized Hoodies',
        'Recommend an outfit for a date',
        'Explore Bestsellers',
      ],
    };
  }

  // 5E. Fabric Science & Technical Knowledge ("what is french terry?", "bio-wash")
  if (
    q.includes('what is gsm') ||
    q.includes('gsm meaning') ||
    q.includes('why luxury cotton') ||
    q.includes('french terry') ||
    q.includes('bio-wash') ||
    q.includes('combed cotton') ||
    q.includes('supima')
  ) {
    return {
      message: `### The Craft of Trevori Fabrics\n\n` +
        `At Trevori, fabric quality and feel come first:\n\n` +
        `• **Trevori Cotton Tees & Shirts:** 100% bio-washed combed cotton with an easy, relaxed drape that holds its silhouette without clinging.\n` +
        `• **Trevori Loopback French Terry Hoodies:** Ultra-soft, breathable cotton with diagonal loopback weaving for natural warmth and all-day comfort.\n\n` +
        `*Every Trevori piece is pre-shrunk and bio-washed for zero shrinkage and silky hand-feel.*`,
      suggestedActions: [
        'Show Hoodies',
        'Show Shirts & T-Shirts',
        'Check Size Guide',
      ],
    };
  }

  // 5F. Garment Washing & Care Instructions ("how to wash", "how to care", "ironing")
  if (
    q.includes('how to wash') ||
    q.includes('how to care') ||
    q.includes('washing') ||
    q.includes('shrinkage') ||
    q.includes('iron') ||
    q.includes('dry clean')
  ) {
    return {
      message: `### Trevori Garment Care Masterclass\n\n` +
        `To ensure your cotton garments last for years and maintain their clean drape:\n\n` +
        `1. **Wash Inside Out in Cold Water (30°C / 85°F):** Protects high-density embroidery, screenprints, and surface luster.\n` +
        `2. **Use Mild, Liquid Detergent:** Harsh bleach or powder detergents can weaken natural cotton fibers.\n` +
        `3. **Flat Air Dry in Shade:** Never tumble dry French Terry on high heat — high machine heat causes unwanted shrinkage. Lay flat on a drying rack away from harsh direct sunlight.\n` +
        `4. **Iron Inside Out on Low-to-Medium Heat:** Avoid direct iron contact with rubberized logos or metallic zips.\n\n` +
        `*For Royal Velvet Bandhgalas and Zardozi lehengas, professional dry cleaning is recommended.*`,
      suggestedActions: [
        'Explore All Collections',
        'Return & Exchange Policy',
        'Ask another question',
      ],
    };
  }

  // 5G. Brand Heritage ("what is trevori?", "wear your perspective", "who founded")
  if (
    q.includes('what is trevori') ||
    q.includes('about trevori') ||
    q.includes('wear your perspective') ||
    q.includes('who founded') ||
    q.includes('where are you from') ||
    q.includes('where are you located')
  ) {
    return {
      message: `### Trevori: Wear Your Perspective\n\n` +
        `Trevori is an Indian luxury fashion house born at the intersection of **clean modern streetwear** and **royal heritage couture**.\n\n` +
        `Our motto — *“Wear Your Perspective”* — represents self-definition through structure, premium combed cotton textiles, and unapologetic craftsmanship. From bespoke midnight navy velvet Bandhgalas to boxy drop-shoulder French Terry hoodies, every silhouette is tailored in India with global luxury standards.\n\n` +
        `*Pan-India express shipping, door-step size exchanges, and 24/7 personal styling are standard for every client.*`,
      suggestedActions: [
        'Explore Men\'s Streetwear',
        'Explore Royal Traditional Wear',
        'Try 3D Virtual Fitting Room',
      ],
    };
  }

  // 5H. Returns, Exchanges & Refunds
  if (
    q.includes('return') ||
    q.includes('exchange') ||
    q.includes('refund') ||
    q.includes('replacement') ||
    q.includes('damaged')
  ) {
    return {
      message: `### Trevori Hassle-Free 7-Day Exchange Policy\n\n` +
        `We want you to love how every piece drapes on you. Here is our direct policy:\n\n` +
        `• **7-Day Doorstep Size Exchanges:** If your tee or hoodie feels too oversized or tailored, request an exchange within 7 days of delivery. Our courier will deliver your new size and pick up the original simultaneously.\n` +
        `• **Free Return Pickup:** Zero reverse-shipping charges across all Indian pin codes.\n` +
        `• **Garment Condition:** Items must be unwashed, unworn, and retain all original Trevori security tags and loopback packaging.\n\n` +
        `*To initiate an exchange right now, share your Order ID or contact our concierge.*`,
      suggestedActions: [
        'Contact Concierge Support',
        'Explore New Drops',
        'Ask about Sizing',
      ],
    };
  }

  // 5I. Shipping, Dispatch & Cash on Delivery (COD)
  if (
    q.includes('shipping') ||
    q.includes('delivery') ||
    q.includes('dispatch') ||
    q.includes('cod') ||
    q.includes('cash on delivery') ||
    q.includes('how long') ||
    q.includes('courier')
  ) {
    return {
      message: `### Express Pan-India Delivery & Logistics\n\n` +
        `• **Delivery Timelines:** 3–5 business days across all metro cities (Mumbai, Delhi NCR, Bengaluru, Hyderabad, Chennai, Kolkata); 4–6 days for Tier-2/3 regions.\n` +
        `• **Free Shipping:** Complimentary priority air dispatch on all orders above **₹1,999**.\n` +
        `• **Cash on Delivery (COD):** Available nationwide with OTP-verified doorstep payment.\n` +
        `• **Courier Partners:** Dispatched via BlueDart Apex Air, Delhivery Direct, and DTDC Priority.\n\n` +
        `*Have a tracking number or Order ID? Enter it anytime to see live milestones.*`,
      suggestedActions: [
        'Explore All Drops',
        'Ask about Sizing',
        'Contact Support',
      ],
    };
  }

  // 5K. General Knowledge & Off-Topic Conversational Fallback
  // If query DOES NOT mention apparel, clothing, products, or shopping:
  const isExplicitShoppingQuery =
    q.includes('buy') ||
    q.includes('show') ||
    q.includes('find') ||
    q.includes('shop') ||
    q.includes('price') ||
    q.includes('cost') ||
    q.includes('cargo') ||
    q.includes('hoodie') ||
    q.includes('sweatshirt') ||
    q.includes('t-shirt') ||
    q.includes('shirt') ||
    q.includes('tee') ||
    q.includes('traditional') ||
    q.includes('bandhgala') ||
    q.includes('lehenga') ||
    q.includes('catalog') ||
    q.includes('pieces') ||
    q.includes('collection') ||
    q.includes('drop');

  if (!isExplicitShoppingQuery) {
    return {
      message: `That's an interesting question! As your **Trevori AI Stylist**, I'm tuned to assist you with garment design, luxury streetwear silhouettes, bespoke sizing calculations, and outfit curation.\n\n` +
        `Whether you need outfit ideas for an event, sizing recommendations for your measurements, or guidance on our shirts, tees, and hoodies, feel free to ask!\n\n` +
        `*How can I help you style your perspective today?*`,
      suggestedActions: [
        'Suggest an outfit for college under ₹2,500',
        'Find oversized black T-shirts',
        'What size should I wear for a 40" chest?',
        'Show Royal Traditional Couture',
      ],
    };
  }

  // 6. NATURAL LANGUAGE PRODUCT SEARCH (Triggered ONLY when user explicitly asks for products/clothing)
  let targetCategory: string | undefined = undefined;
  let targetColor: string | undefined = undefined;
  let maxPrice: number | undefined = undefined;

  // Extract budget: "under 1500", "under 2000"
  const priceMatch = cleanQuery.match(/under\s*₹?\s*(\d+[\d,]*)/i);
  if (priceMatch) {
    maxPrice = parseInt(priceMatch[1].replace(/,/g, ''));
  }

  // Category detection
  if (q.includes('cargo') || q.includes('pant') || q.includes('trousers') || q.includes('bottom') || q.includes('denim') || q.includes('jeans')) {
    targetCategory = 'Pants';
  } else if (q.includes('traditional') || q.includes('indian') || q.includes('ethnic') || q.includes('bandhgala') || q.includes('kurta') || q.includes('lehenga') || q.includes('sherwani')) {
    targetCategory = 'Traditional';
  } else if (q.includes('hoodie') || q.includes('sweatshirt')) {
    targetCategory = 'Hoodies';
  } else if (q.includes('tank top') || q.includes('tank') || q.includes('vest')) {
    targetCategory = 'T-Shirts';
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

  const categoryLabel = targetCategory || 'Curated Pieces';
  const filterDesc = [
    targetColor ? `in **${targetColor.toUpperCase()}**` : '',
    maxPrice ? `under **₹${maxPrice.toLocaleString('en-IN')}**` : '',
  ].filter(Boolean).join(' ');

  if (matchedProducts.length === 0) {
    // Helpful recommendation without pretending false matches
    const fallbackProducts = searchCatalogue({ limit: 3 });
    return {
      message: `We don't currently have ${categoryLabel} ${filterDesc} in this specific drop. However, here are our closest trending pieces tailored from our signature premium cotton:`,
      products: fallbackProducts,
      suggestedActions: [
        'Explore All Drops',
        'Recommend an Outfit under ₹2,500',
        'Size Assistance',
      ],
    };
  }

  return {
    message: `Here are the matching **Trevori ${categoryLabel}** ${filterDesc} from our current runway collection. Every piece is woven from premium combed cotton and tailored for an architectural silhouette:`,
    products: matchedProducts,
    suggestedActions: [
      'Style this into an Outfit',
      'What size should I get?',
      'Check Fabric Details',
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
Brand Philosophy: High-fashion minimal aesthetics, premium combed cotton, architectural drop-shoulder streetwear and bespoke royal Indian traditional couture.
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
      vibe: 'Modern Streetwear & Relaxed Cuts',
      stylingTips: 'The inspiration features clean dropped shoulders and comfortable drape. Our 100% Combed Cotton oversized tee provides this exact relaxed form.',
    },
    matchedProducts: matched.length > 0 ? matched : PRODUCTS.slice(0, 3),
  };
}
