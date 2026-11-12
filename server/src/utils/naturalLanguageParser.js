import { getGeminiModel } from '../config/gemini.js';
import { UNIVERSAL_CATEGORIES } from '../data/categoriesData.js';

/**
 * Deterministic Regex + Token NLP Parser (Works offline & without API keys)
 */
export const parseQueryLocally = (query) => {
  const clean = query.trim().toLowerCase();
  
  // 1. Budget & Currency extraction
  // Handles formats: under 60000, under ₹60,000, below 25k, < 3000, 50k budget, Rs 10000, 10000 rupaye
  let budget = null;
  let currency = 'INR';

  const budgetRegex = /(?:under|below|less than|within|upto|budget of|<|max|rs\.?|inr|₹)\s*(\d+(?:,\d+)*(?:\.\d+)?)\s*(k|lakh|thousand)?/i;
  const kBudgetRegex = /(\d+(?:\.\d+)?)\s*k\s*(?:budget|rupees|rs|inr)?/i;

  const matchBudget = clean.match(budgetRegex);
  if (matchBudget) {
    let num = parseFloat(matchBudget[1].replace(/,/g, ''));
    const multiplier = matchBudget[2]?.toLowerCase();
    if (multiplier === 'k' || multiplier === 'thousand') num *= 1000;
    if (multiplier === 'lakh') num *= 100000;
    budget = num;
  } else {
    const kMatch = clean.match(kBudgetRegex);
    if (kMatch) {
      budget = parseFloat(kMatch[1]) * 1000;
    }
  }

  // 2. Category matching
  let category = 'All';
  let subcategory = null;

  const categoryMap = {
    laptops: ['laptop', 'notebook', 'macbook', 'ultrabook', 'computer', 'pc', 'gaming rig'],
    smartphones: ['phone', 'smartphone', 'mobile', 'iphone', 'android', 'galaxy', 'redmi', 'oneplus'],
    shoes: ['shoe', 'shoes', 'sneaker', 'sneakers', 'footwear', 'boots', 'sandals', 'running shoe'],
    fashion: ['cloth', 'clothes', 'clothing', 'shirt', 'tshirt', 'jeans', 'dress', 'kurta', 'jacket'],
    watches: ['watch', 'smartwatch', 'watches', 'analog watch'],
    beauty: ['skincare', 'serum', 'moisturizer', 'sunscreen', 'cream', 'lotion', 'makeup', 'face wash'],
    home: ['chair', 'desk', 'table', 'sofa', 'furniture', 'bed', 'mattress', 'refrigerator', 'fridge'],
    kitchen: ['air fryer', 'microwave', 'blender', 'mixer', 'cookware', 'toaster', 'kettle'],
    grocery: ['grocery', 'food', 'dry fruits', 'almonds', 'oil', 'tea', 'coffee', 'nuts'],
    fitness: ['gym', 'fitness', 'dumbbells', 'yoga', 'yoga mat', 'protein', 'treadmill'],
    gaming: ['gaming', 'rtx', 'ps5', 'playstation', 'xbox', 'console', 'gpu'],
    electronics: ['headphone', 'earphone', 'earbuds', 'speaker', 'camera', 'soundbar', 'charger'],
    automotive: ['dashcam', 'car', 'tire inflator', 'car mount'],
    books: ['book', 'novel', 'stationery', 'guide'],
    jewellery: ['jewellery', 'jewelry', 'ring', 'necklace', 'earring', 'chain'],
    pets: ['dog food', 'cat food', 'pet'],
    travel: ['luggage', 'suitcase', 'travel backpack', 'trolley'],
  };

  for (const [catKey, keywords] of Object.entries(categoryMap)) {
    if (keywords.some((kw) => clean.includes(kw))) {
      const found = UNIVERSAL_CATEGORIES.find((c) => c.id === catKey);
      if (found) {
        category = found.name;
        // check subcategory
        found.subcategories.forEach((sub) => {
          if (clean.includes(sub.toLowerCase())) {
            subcategory = sub;
          }
        });
        break;
      }
    }
  }

  // 3. Known Brands
  const popularBrands = [
    'Apple', 'Samsung', 'Sony', 'Dell', 'HP', 'Lenovo', 'Asus', 'Acer',
    'Nike', 'Adidas', 'Puma', 'Boat', 'OnePlus', 'Xiaomi', 'Realme',
    'Nothing', 'Noise', 'Fire-Boltt', 'LG', 'Whirlpool', 'IKEA', 'Godrej',
    'Mamaearth', 'Minimalist', 'Neutrogena', 'L\'Oreal', 'Nivea', 'Green Soul',
    'Fastrack', 'Titan', 'Casio', 'Philips', 'Prestige', 'Sleepyhead'
  ];
  let brandPreference = null;
  popularBrands.forEach((b) => {
    if (clean.includes(b.toLowerCase())) {
      brandPreference = b;
    }
  });

  // 4. Intended Use & Priorities
  const useCases = [];
  if (clean.includes('programming') || clean.includes('coding') || clean.includes('developer')) useCases.push('Programming');
  if (clean.includes('gaming') || clean.includes('rtx') || clean.includes('graphics')) useCases.push('Gaming');
  if (clean.includes('camera') || clean.includes('photography')) useCases.push('Camera & Photography');
  if (clean.includes('student') || clean.includes('college') || clean.includes('study')) useCases.push('Student / Education');
  if (clean.includes('running') || clean.includes('marathon')) useCases.push('Running / Sports');
  if (clean.includes('office') || clean.includes('work from home') || clean.includes('wfh')) useCases.push('Office / Ergonomics');
  if (clean.includes('family')) useCases.push('Family Use');

  // 5. Specs & Hardware mentions
  const requiredSpecs = [];
  if (clean.includes('rtx')) requiredSpecs.push('RTX Graphics');
  if (clean.includes('ssd')) requiredSpecs.push('SSD');
  if (clean.includes('16gb') || clean.includes('16 gb')) requiredSpecs.push('16GB RAM');
  if (clean.includes('8gb') || clean.includes('8 gb')) requiredSpecs.push('8GB RAM');
  if (clean.includes('oled') || clean.includes('amoled')) requiredSpecs.push('AMOLED Display');
  if (clean.includes('5g')) requiredSpecs.push('5G');
  if (clean.includes('anc') || clean.includes('noise cancel')) requiredSpecs.push('Active Noise Cancellation');

  return {
    rawQuery: query,
    category,
    subcategory,
    budget,
    currency,
    brandPreference,
    requiredSpecs,
    intendedUse: useCases.length > 0 ? useCases[0] : null,
    priorities: useCases,
    detectedLanguage: 'en',
    engine: 'Rule-based Local NLP',
  };
};

/**
 * Natural Language Query Parser with Gemini AI (fallback to rule-based)
 */
export const parseShoppingQuery = async (query) => {
  const localResult = parseQueryLocally(query);
  const gemini = getGeminiModel();

  if (!gemini) {
    return localResult;
  }

  try {
    const prompt = `
You are an expert AI shopping researcher parser.
Analyze this user shopping query: "${query}"
Extract the following structured details in valid JSON:
{
  "category": "one of the standard e-commerce categories or All",
  "subcategory": "specific product subcategory or null",
  "budget": number or null,
  "currency": "INR or USD or other currency code",
  "brandPreference": "brand name or null",
  "requiredSpecs": ["list of hardware or design specifications"],
  "intendedUse": "primary purpose or null",
  "priorities": ["list of user priorities like battery, camera, portability"],
  "detectedLanguage": "ISO language code (en, hi, ta, te, etc.)"
}
Output strictly valid JSON only. No markdown formatting.
`;
    const response = await gemini.generateContent(prompt);
    const text = response.response.text().trim();
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (jsonMatch) {
      const parsed = JSON.parse(jsonMatch[0]);
      return {
        rawQuery: query,
        ...localResult,
        ...parsed,
        engine: 'Gemini AI + Rule-based NLP',
      };
    }
  } catch (error) {
    console.warn('[Gemini AI] Query parsing failed, fallback to local NLP:', error.message);
  }

  return localResult;
};
