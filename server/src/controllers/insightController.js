import Product from '../models/Product.js';
import Wishlist from '../models/Wishlist.js';
import SearchHistory from '../models/SearchHistory.js';
import { rankAndBadgeProducts } from '../utils/scoringEngine.js';

export const getDashboardInsights = async (req, res, next) => {
  try {
    const userId = req.user ? req.user._id : null;

    let recentSearches = [];
    let savedProductsCount = 0;
    let savedWishlistPreview = [];

    if (userId) {
      recentSearches = await SearchHistory.find({ user: userId })
        .sort({ createdAt: -1 })
        .limit(5);

      const wishlistItems = await Wishlist.find({ user: userId })
        .populate('product')
        .sort({ createdAt: -1 })
        .limit(4);

      savedWishlistPreview = wishlistItems.map((item) => item.product).filter(Boolean);
      savedProductsCount = await Wishlist.countDocuments({ user: userId });
    }

    // Top trending recommended products across catalog
    const allProducts = await Product.find().limit(8);
    const recommended = rankAndBadgeProducts(allProducts).slice(0, 4);

    // Products with best verified discounts
    const topDeals = await Product.find({ discountPercentage: { $gt: 15 } })
      .sort({ discountPercentage: -1 })
      .limit(4);

    res.json({
      success: true,
      userStats: {
        savedProductsCount,
        recentSearchesCount: recentSearches.length,
      },
      recentSearches,
      savedWishlistPreview,
      recommendations: recommended,
      topDeals,
    });
  } catch (error) {
    next(error);
  }
};

export const getPriceInsights = async (req, res, next) => {
  try {
    const { productId } = req.query;

    if (productId) {
      const product = await Product.findById(productId);
      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const history = product.priceHistory || [];
      const prices = history.map((h) => h.price);
      const minPrice = prices.length > 0 ? Math.min(...prices) : product.price;
      const maxPrice = prices.length > 0 ? Math.max(...prices) : product.price;
      const avgPrice = prices.length > 0 ? Math.round(prices.reduce((a, b) => a + b, 0) / prices.length) : product.price;

      const currentSavingsVsPeak = maxPrice > product.price ? maxPrice - product.price : 0;
      const isAtLowest = product.price <= minPrice;

      return res.json({
        success: true,
        product: {
          id: product._id,
          title: product.title,
          retailer: product.retailer,
          currentPrice: product.price,
          originalPrice: product.originalPrice,
          discountPercentage: product.discountPercentage,
        },
        priceMetrics: {
          currentPrice: product.price,
          lowestRecorded: minPrice,
          highestRecorded: maxPrice,
          averageRecorded: avgPrice,
          currentSavingsVsPeak,
          isAtLowest,
          historyDataPoints: history.length,
        },
        priceHistory: history,
        otherRetailerOffers: product.otherOffers || [],
      });
    }

    // Overall catalog price trends
    const trackedProducts = await Product.find({ 'priceHistory.1': { $exists: true } }).limit(10);

    const priceDropHighlights = trackedProducts.map((p) => {
      const hist = p.priceHistory;
      const firstPrice = hist[0]?.price || p.price;
      const currentPrice = p.price;
      const drop = firstPrice > currentPrice ? firstPrice - currentPrice : 0;
      const dropPercentage = firstPrice > 0 ? Math.round((drop / firstPrice) * 100) : 0;

      return {
        id: p._id,
        title: p.title,
        retailer: p.retailer,
        currentPrice,
        previousPrice: firstPrice,
        dropAmount: drop,
        dropPercentage,
        rating: p.rating,
        image: p.images[0],
      };
    });

    res.json({
      success: true,
      highlights: priceDropHighlights.filter((p) => p.dropPercentage > 0),
    });
  } catch (error) {
    next(error);
  }
};
