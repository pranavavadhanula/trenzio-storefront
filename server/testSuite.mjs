import {
  searchCatalogue,
  generateCuratedOutfit,
  calculateClothingSize,
  processStylistQuery,
} from '../src/services/aiEngine.js';
import { findOrderByIdOrEmail } from '../src/data/orders.js';
import { findPolicy } from '../src/data/policies.js';

console.log('--- RUNNING TREVORI AI VERIFICATION TEST SUITE ---');

let passed = 0;
let failed = 0;

function assert(condition, testName) {
  if (condition) {
    console.log(`✅ [PASS] ${testName}`);
    passed++;
  } else {
    console.error(`❌ [FAIL] ${testName}`);
    failed++;
  }
}

async function runTests() {
  // 1. Oversized black T-shirts
  const blackTees = searchCatalogue({ query: 'oversized black t-shirts', color: 'black' });
  assert(
    blackTees.length > 0 && blackTees.some((p) => p.colors.some((c) => c.name.toLowerCase().includes('black'))),
    'Natural Language Search: "Find oversized black T-shirts"'
  );

  // 2. Traditional Indian clothing
  const traditional = searchCatalogue({ category: 'Traditional' });
  assert(
    traditional.length >= 3 && traditional.some((p) => p.name.includes('Bandhgala') || p.name.includes('Lehenga') || p.name.includes('Kurta')),
    'Natural Language Search: "Show traditional Indian clothing"'
  );

  // 3. Cargo pants under ₹1,500
  const cargosUnder1500 = searchCatalogue({ category: 'Pants', maxPrice: 1500 });
  assert(
    cargosUnder1500.length > 0 && cargosUnder1500.every((p) => p.priceINR <= 1500),
    'Budget Filter: "Find cargo pants under ₹1,500" (Exact verified price)'
  );

  // 4. White shirts
  const whiteShirts = searchCatalogue({ query: 'white shirt' });
  assert(
    whiteShirts.length > 0 && whiteShirts.some((p) => p.colors.some((c) => c.name.toLowerCase().includes('white'))),
    'Natural Language Search: "Show white shirts"'
  );

  // 5. College fest outfit under ₹2,500
  const collegeOutfit = generateCuratedOutfit({ occasion: 'college fest', budget: 2500 });
  assert(
    collegeOutfit && collegeOutfit.totalCostINR <= 2500 && collegeOutfit.products.length >= 2,
    `AI Outfit Generator: College fest under ₹2,500 (Total: ₹${collegeOutfit?.totalCostINR})`
  );

  // 6. Wedding outfit generator
  const weddingOutfit = generateCuratedOutfit({ occasion: 'wedding reception', budget: 10000 });
  assert(
    weddingOutfit && weddingOutfit.products.some((p) => p.category === 'Traditional'),
    'AI Outfit Generator: Wedding / Festive Traditional Couture'
  );

  // 7. Size Calculator
  const sizeResult = calculateClothingSize({ heightCm: 182, weightKg: 80, chestInches: 42 });
  assert(
    sizeResult && (sizeResult.recommendedSize === 'L' || sizeResult.recommendedSize === 'XL'),
    `AI Size Assistant: Chest 42", 182cm -> Recommended Size: ${sizeResult?.recommendedSize}`
  );

  // 8. Order Tracking
  const order = findOrderByIdOrEmail('TRV-89421');
  assert(
    order && order.status === 'In Transit' && order.carrier.includes('Blue Dart'),
    `Order Tracking: Order #TRV-89421 found with carrier ${order?.carrier}`
  );

  // 9. Brand Policies
  const shippingPolicy = findPolicy('What is your shipping policy and delivery time?');
  assert(
    shippingPolicy && shippingPolicy.summary.includes('Free express shipping'),
    'Brand Policies: Shipping & Delivery accuracy'
  );

  const returnPolicy = findPolicy('How do returns and refunds work?');
  assert(
    returnPolicy && returnPolicy.summary.includes('7-day'),
    'Brand Policies: 7-Day Returns & Exchanges accuracy'
  );

  // 10. End-to-end processStylistQuery
  const queryResult = await processStylistQuery('I am attending a college fest. Suggest an outfit under ₹2,500.');
  assert(
    queryResult && queryResult.outfit && queryResult.products && queryResult.products.length > 0,
    'End-to-End NLU Stylist Query: Occasion + Budget Outfit'
  );

  console.log(`\nTEST RESULTS: ${passed} Passed, ${failed} Failed.`);
  if (failed > 0) process.exit(1);
}

runTests();
