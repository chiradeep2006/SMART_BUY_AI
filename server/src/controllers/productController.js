import Product from '../models/Product.js';
import SearchHistory from '../models/SearchHistory.js';
import { UNIVERSAL_CATEGORIES } from '../data/categoriesData.js';
import { RETAILER_PLATFORMS } from '../data/retailersData.js';
import { parseQueryLocally } from '../utils/naturalLanguageParser.js';
import { rankAndBadgeProducts } from '../utils/scoringEngine.js';

export const getProducts = async (req, res, next) => {
  try {
    const {
      q,
      category,
      subcategory,
      minPrice,
      maxPrice,
      brand,
      retailer,
      rating,
      sort = 'relevance',
      page = 1,
      limit = 12,
    } = req.query;

    let targetBudget = maxPrice ? Number(maxPrice) : null;
    let targetCategory = category;
    let targetBrand = brand;

    // Run Natural Language Parser on search query
    let parsedNLP = null;
    if (q && q.trim()) {
      parsedNLP = parseQueryLocally(q);
      if (parsedNLP.budget && !targetBudget) {
        targetBudget = parsedNLP.budget;
      }
      if (parsedNLP.category && parsedNLP.category !== 'All' && (!targetCategory || targetCategory === 'All')) {
        targetCategory = parsedNLP.category;
      }
      if (parsedNLP.brandPreference && (!targetBrand || targetBrand === 'All')) {
        targetBrand = parsedNLP.brandPreference;
      }

      // Save to logged-in user search history
      if (req.user && req.user.preferences?.saveSearchHistory !== false) {
        await SearchHistory.create({
          user: req.user._id,
          query: q.trim(),
          category: targetCategory || 'All',
          filters: { minPrice, maxPrice: targetBudget, brand: targetBrand, retailer },
        }).catch((err) => console.warn('[SearchHistory] Save failed:', err.message));
      }
    }

    // Build filter
    const filter = {};

    if (targetCategory && targetCategory !== 'All') {
      filter.category = new RegExp(`^${targetCategory}$`, 'i');
    }

    if (subcategory && subcategory !== 'All') {
      filter.subcategory = new RegExp(subcategory, 'i');
    }

    if (targetBrand && targetBrand !== 'All') {
      filter.brand = new RegExp(targetBrand, 'i');
    }

    if (retailer && retailer !== 'All') {
      filter.retailer = new RegExp(retailer, 'i');
    }

    if (rating && Number(rating) > 0) {
      filter.rating = { $gte: Number(rating) };
    }

    if (minPrice || targetBudget) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (targetBudget) filter.price.$lte = Number(targetBudget);
    }

    if (q && q.trim()) {
      const searchTerms = q.trim().split(/\s+/).filter(Boolean);
      filter.$or = [
        { title: { $regex: q.trim(), $options: 'i' } },
        { brand: { $regex: q.trim(), $options: 'i' } },
        { category: { $regex: q.trim(), $options: 'i' } },
        { description: { $regex: q.trim(), $options: 'i' } },
        ...searchTerms.map((term) => ({ title: { $regex: term, $options: 'i' } })),
      ];
    }

    // Sorting
    let sortOptions = {};
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating_desc') sortOptions = { rating: -1 };
    else sortOptions = { rating: -1, reviewCount: -1 };

    const skip = (Number(page) - 1) * Number(limit);
    const totalCount = await Product.countDocuments(filter);
    const rawProducts = await Product.find(filter)
      .sort(sortOptions)
      .skip(skip)
      .limit(Number(limit));

    // Rank and assign AI badges
    const rankedProducts = rankAndBadgeProducts(rawProducts, targetBudget);

    res.json({
      success: true,
      count: rankedProducts.length,
      total: totalCount,
      totalPages: Math.ceil(totalCount / Number(limit)) || 1,
      currentPage: Number(page),
      parsedNLP,
      products: rankedProducts,
      providers: RETAILER_PLATFORMS.map((r) => ({
        id: r.id,
        name: r.name,
        status: r.status,
        region: r.region,
      })),
    });
  } catch (error) {
    next(error);
  }
};

export const getProductById = async (req, res, next) => {
  try {
    const product = await Product.findById(req.params.id);
    if (!product) {
      return res.status(404).json({ success: false, message: 'Product not found' });
    }

    // Ensure AI scores are calculated
    const ranked = rankAndBadgeProducts([product]);

    res.json({
      success: true,
      product: ranked[0] || product,
    });
  } catch (error) {
    next(error);
  }
};

export const getCategories = async (req, res) => {
  res.json({
    success: true,
    count: UNIVERSAL_CATEGORIES.length,
    categories: UNIVERSAL_CATEGORIES,
  });
};

export const getRetailers = async (req, res) => {
  res.json({
    success: true,
    count: RETAILER_PLATFORMS.length,
    retailers: RETAILER_PLATFORMS,
  });
};

