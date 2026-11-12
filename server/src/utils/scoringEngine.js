/**
 * SmartBuy AI Deterministic Scoring Engine
 * Weights:
 * - Price suitability: 35%
 * - Specification suitability: 30%
 * - Review quality: 20%
 * - Value for money: 15%
 */

export const calculateProductScores = (product, userBudget = null, targetSpecs = []) => {
  // 1. Price Suitability (35%)
  let priceSuitability = 70;
  if (userBudget && userBudget > 0) {
    if (product.price <= userBudget) {
      // Under budget: the closer to the sweet spot without being suspiciously cheap
      const ratio = product.price / userBudget;
      if (ratio >= 0.75) {
        priceSuitability = 95; // perfectly utilizes budget
      } else if (ratio >= 0.5) {
        priceSuitability = 88;
      } else {
        priceSuitability = 80;
      }
    } else {
      // Over budget: penalty proportional to excess
      const excess = (product.price - userBudget) / userBudget;
      priceSuitability = Math.max(10, Math.round(70 - excess * 100));
    }
  } else {
    // If no budget specified, assess discount and price competitiveness
    const discount = product.discountPercentage || 0;
    priceSuitability = Math.min(95, 75 + Math.round(discount * 0.4));
  }

  // 2. Specification Suitability (30%)
  let specSuitability = 65;
  const specs = product.specifications || {};
  const specKeys = specs instanceof Map ? Array.from(specs.keys()) : Object.keys(specs);
  const dataCompleteness = Math.min(100, (specKeys.length / 6) * 100);

  if (targetSpecs && targetSpecs.length > 0) {
    let matchedCount = 0;
    const specString = JSON.stringify(specs).toLowerCase();
    targetSpecs.forEach((spec) => {
      if (specString.includes(spec.toLowerCase())) {
        matchedCount++;
      }
    });
    const matchRatio = matchedCount / targetSpecs.length;
    specSuitability = Math.round(50 + matchRatio * 45);
  } else {
    // Base score relies on specification completeness & quality indicators
    specSuitability = Math.round(60 + (dataCompleteness * 0.35));
  }

  // 3. Review Quality (20%)
  let reviewQuality = 50;
  const rating = product.rating || 0;
  const reviewCount = product.reviewCount || 0;
  
  if (rating > 0) {
    // Base rating score (0 - 5 stars scaled to 0 - 80)
    const ratingComponent = (rating / 5) * 75;
    // Credibility from volume of reviews (up to 20 points)
    const countComponent = Math.min(20, Math.log10(reviewCount + 1) * 6.5);
    // Sentiment verification
    const verifiedBonus = product.reviews && product.reviews.length > 0 ? 5 : 0;
    reviewQuality = Math.min(99, Math.round(ratingComponent + countComponent + verifiedBonus));
  }

  // 4. Value for Money (15%)
  // Derived from rating / price ratio normalized, plus discount
  const discountBonus = Math.min(25, (product.discountPercentage || 0) * 0.5);
  const ratingBonus = (rating / 5) * 60;
  const valueForMoney = Math.min(98, Math.round(ratingBonus + discountBonus + 15));

  // Weighted Total
  const overall = Math.round(
    priceSuitability * 0.35 +
    specSuitability * 0.30 +
    reviewQuality * 0.20 +
    valueForMoney * 0.15
  );

  return {
    overall,
    priceSuitability,
    specSuitability,
    reviewQuality,
    valueForMoney,
    dataCompleteness: Math.round(dataCompleteness),
  };
};

/**
 * Assign comparison badges across a list of evaluated products
 */
export const rankAndBadgeProducts = (products, userBudget = null) => {
  if (!products || products.length === 0) return [];

  const scoredProducts = products.map((prod) => {
    const rawProd = prod.toObject ? prod.toObject() : { ...prod };
    const scores = calculateProductScores(rawProd, userBudget);
    return {
      ...rawProd,
      aiScore: {
        ...scores,
        badge: null,
      },
    };
  });

  // Sort by overall descending
  scoredProducts.sort((a, b) => b.aiScore.overall - a.aiScore.overall);

  // Best Overall: highest overall score
  if (scoredProducts.length > 0) {
    scoredProducts[0].aiScore.badge = 'Best Overall';
  }

  // Best Budget: lowest price among decent products (overall >= 70)
  const budgetCandidates = scoredProducts.filter((p) => p.aiScore.overall >= 65);
  if (budgetCandidates.length > 1) {
    const sortedByPrice = [...budgetCandidates].sort((a, b) => a.price - b.price);
    if (sortedByPrice[0]._id !== scoredProducts[0]._id) {
      const idx = scoredProducts.findIndex((p) => String(p._id) === String(sortedByPrice[0]._id));
      if (idx !== -1) scoredProducts[idx].aiScore.badge = 'Best Budget';
    }
  }

  // Best Premium: highest price with high overall score (>= 80)
  const premiumCandidates = scoredProducts.filter((p) => p.aiScore.overall >= 80);
  if (premiumCandidates.length > 1) {
    const sortedDescPrice = [...premiumCandidates].sort((a, b) => b.price - a.price);
    if (sortedDescPrice[0]._id !== scoredProducts[0]._id && !sortedDescPrice[0].aiScore.badge) {
      const idx = scoredProducts.findIndex((p) => String(p._id) === String(sortedDescPrice[0]._id));
      if (idx !== -1 && !scoredProducts[idx].aiScore.badge) scoredProducts[idx].aiScore.badge = 'Best Premium';
    }
  }

  // Best Value: highest value for money score
  const remaining = scoredProducts.filter((p) => !p.aiScore.badge);
  if (remaining.length > 0) {
    remaining.sort((a, b) => b.aiScore.valueForMoney - a.aiScore.valueForMoney);
    const topValue = remaining[0];
    const idx = scoredProducts.findIndex((p) => String(p._id) === String(topValue._id));
    if (idx !== -1) scoredProducts[idx].aiScore.badge = 'Best Value';
  }

  return scoredProducts;
};
