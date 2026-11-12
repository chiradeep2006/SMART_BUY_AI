import { RETAILER_PLATFORMS } from '../data/retailersData.js';
import Product from '../models/Product.js';

class ProviderManager {
  constructor() {
    this.providers = new Map();
    this.initProviders();
  }

  initProviders() {
    RETAILER_PLATFORMS.forEach((platform) => {
      this.providers.set(platform.name, {
        id: platform.id,
        name: platform.name,
        category: platform.category,
        region: platform.region,
        status: platform.status,
        website: platform.website,
        affiliateConfigured: platform.affiliateConfigured,
      });
    });
  }

  getPlatformStatuses() {
    return Array.from(this.providers.values());
  }

  getPlatformByName(name) {
    return this.providers.get(name) || {
      id: name.toLowerCase().replace(/\s+/g, '_'),
      name,
      status: 'Demo data',
      affiliateConfigured: false,
    };
  }

  /**
   * Search across database and providers in parallel with timeouts
   */
  async searchAllProviders({ query, category, minPrice, maxPrice, brand, retailer, limit = 20, sort = 'relevance' }) {
    // 1. Build DB Query
    const filter = {};

    if (category && category !== 'All') {
      filter.category = new RegExp(category, 'i');
    }

    if (brand && brand !== 'All') {
      filter.brand = new RegExp(brand, 'i');
    }

    if (retailer && retailer !== 'All') {
      filter.retailer = new RegExp(retailer, 'i');
    }

    if (minPrice || maxPrice) {
      filter.price = {};
      if (minPrice) filter.price.$gte = Number(minPrice);
      if (maxPrice) filter.price.$lte = Number(maxPrice);
    }

    if (query && query.trim() !== '') {
      filter.$or = [
        { title: { $regex: query, $options: 'i' } },
        { brand: { $regex: query, $options: 'i' } },
        { description: { $regex: query, $options: 'i' } },
        { category: { $regex: query, $options: 'i' } },
        { subcategory: { $regex: query, $options: 'i' } },
      ];
    }

    // 2. Determine sort order
    let sortOptions = {};
    if (sort === 'price_asc') sortOptions = { price: 1 };
    else if (sort === 'price_desc') sortOptions = { price: -1 };
    else if (sort === 'rating_desc') sortOptions = { rating: -1 };
    else sortOptions = { rating: -1, 'aiScore.overall': -1 };

    // 3. Query local database with timeout
    try {
      const timeoutPromise = new Promise((_, reject) =>
        setTimeout(() => reject(new Error('Provider search timeout')), 4000)
      );

      const dbSearchPromise = Product.find(filter)
        .sort(sortOptions)
        .limit(Number(limit))
        .lean();

      const products = await Promise.race([dbSearchPromise, timeoutPromise]);

      return {
        products: products || [],
        total: products ? products.length : 0,
        providerStatuses: this.getPlatformStatuses(),
      };
    } catch (error) {
      console.error('[ProviderManager] Error querying providers:', error.message);
      return {
        products: [],
        total: 0,
        providerStatuses: this.getPlatformStatuses(),
        error: error.message,
      };
    }
  }
}

export default new ProviderManager();
