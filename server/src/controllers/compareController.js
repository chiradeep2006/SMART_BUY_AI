import Product from '../models/Product.js';
import { rankAndBadgeProducts } from '../utils/scoringEngine.js';
import { getGeminiModel } from '../config/gemini.js';

export const compareProducts = async (req, res, next) => {
  try {
    const { productIds } = req.body;

    if (!productIds || !Array.isArray(productIds) || productIds.length < 2) {
      return res.status(400).json({
        success: false,
        message: 'Please provide at least 2 product IDs to compare (up to 5).',
      });
    }

    if (productIds.length > 5) {
      return res.status(400).json({
        success: false,
        message: 'Comparison is supported for up to 5 products at a time.',
      });
    }

    const products = await Product.find({ _id: { $in: productIds } });

    if (products.length < 2) {
      return res.status(404).json({
        success: false,
        message: 'Could not find sufficient matching products for comparison.',
      });
    }

    // Rank and score products deterministically
    const scoredProducts = rankAndBadgeProducts(products);

    // Identify winners
    const bestOverall = scoredProducts.find((p) => p.aiScore.badge === 'Best Overall') || scoredProducts[0];
    const bestBudget = scoredProducts.find((p) => p.aiScore.badge === 'Best Budget') || [...scoredProducts].sort((a, b) => a.price - b.price)[0];
    const bestPremium = scoredProducts.find((p) => p.aiScore.badge === 'Best Premium') || [...scoredProducts].sort((a, b) => b.price - a.price)[0];
    const bestValue = scoredProducts.find((p) => p.aiScore.badge === 'Best Value') || scoredProducts[0];

    // Extract all unique specification keys across compared products
    const specKeysSet = new Set();
    scoredProducts.forEach((p) => {
      const specs = p.specifications || {};
      const keys = specs instanceof Map ? Array.from(specs.keys()) : Object.keys(specs);
      keys.forEach((k) => specKeysSet.add(k));
    });
    const specificationFields = Array.from(specKeysSet);

    // Generate AI comparison narrative
    let aiSummary = {
      verdict: `${bestOverall.title} is our Top Pick with an overall suitability score of ${bestOverall.aiScore.overall}/100. It offers the strongest balance of specifications, user feedback (${bestOverall.rating}★), and build quality.`,
      budgetPick: `${bestBudget.title} is the Best Budget option at ₹${bestBudget.price.toLocaleString('en-IN')}, saving you significantly without critical trade-offs.`,
      premiumPick: `${bestPremium.title} stands out for premium performance and high-end build at ₹${bestPremium.price.toLocaleString('en-IN')}.`,
      valuePick: `${bestValue.title} offers the highest value-for-money index (${bestValue.aiScore.valueForMoney}/100).`,
    };

    // If Gemini model is active, get enhanced qualitative comparison
    const gemini = getGeminiModel();
    if (gemini) {
      try {
        const prompt = `
You are the SmartBuy AI Shopping Comparison Expert.
Compare these products accurately using only the given data:
${scoredProducts.map((p, i) => `${i + 1}. ${p.title} (Price: ₹${p.price}, Rating: ${p.rating}★, Retailer: ${p.retailer})`).join('\n')}

Scores computed:
- Best Overall: ${bestOverall.title} (${bestOverall.aiScore.overall}/100)
- Best Budget: ${bestBudget.title} (₹${bestBudget.price})
- Best Premium: ${bestPremium.title} (₹${bestPremium.price})

Provide a concise 3-4 sentence professional comparison summary explaining who each product is suited for. Never invent non-existent specifications or prices.
`;
        const aiResponse = await gemini.generateContent(prompt);
        aiSummary.verdict = aiResponse.response.text().trim();
      } catch (err) {
        // Safe deterministic fallback already populated
      }
    }

    res.json({
      success: true,
      comparison: {
        products: scoredProducts,
        specificationFields,
        aiSummary,
        bestOverallId: bestOverall._id,
        bestBudgetId: bestBudget._id,
        bestPremiumId: bestPremium._id,
        bestValueId: bestValue._id,
      },
    });
  } catch (error) {
    next(error);
  }
};
