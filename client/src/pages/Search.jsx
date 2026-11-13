import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import {
  Search as SearchIcon,
  Filter,
  SlidersHorizontal,
  Sparkles,
  RefreshCw,
  X,
  ChevronLeft,
  ChevronRight,
  Info,
  Check
} from 'lucide-react';
import { UNIVERSAL_CATEGORIES } from '../../../server/src/data/categoriesData';
import { RETAILER_PLATFORMS } from '../../../server/src/data/retailersData';

export const Search = () => {
  const { t } = useTranslation();
  const [searchParams, setSearchParams] = useSearchParams();

  const queryParam = searchParams.get('q') || '';
  const categoryParam = searchParams.get('category') || 'All';
  const brandParam = searchParams.get('brand') || 'All';
  const retailerParam = searchParams.get('retailer') || 'All';
  const minPriceParam = searchParams.get('minPrice') || '';
  const maxPriceParam = searchParams.get('maxPrice') || '';
  const ratingParam = searchParams.get('rating') || '';
  const sortParam = searchParams.get('sort') || 'relevance';
  const pageParam = parseInt(searchParams.get('page') || '1', 10);

  const [inputQuery, setInputQuery] = useState(queryParam);
  const [products, setProducts] = useState([]);
  const [parsedNLP, setParsedNLP] = useState(null);
  const [totalPages, setTotalPages] = useState(1);
  const [totalCount, setTotalCount] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [showMobileFilters, setShowMobileFilters] = useState(false);

  // Fetch search results from backend
  const fetchProducts = async () => {
    setLoading(true);
    setError('');

    try {
      const params = {
        q: queryParam,
        category: categoryParam !== 'All' ? categoryParam : undefined,
        brand: brandParam !== 'All' ? brandParam : undefined,
        retailer: retailerParam !== 'All' ? retailerParam : undefined,
        minPrice: minPriceParam || undefined,
        maxPrice: maxPriceParam || undefined,
        rating: ratingParam || undefined,
        sort: sortParam,
        page: pageParam,
        limit: 12,
      };

      const res = await api.get('/products', { params });
      if (res.data.success) {
        setProducts(res.data.products);
        setTotalPages(res.data.totalPages);
        setTotalCount(res.data.total);
        setParsedNLP(res.data.parsedNLP);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Error executing search. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setInputQuery(queryParam);
    fetchProducts();
  }, [searchParams]);

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    if (value && value !== 'All') {
      newParams.set(key, value);
    } else {
      newParams.delete(key);
    }
    newParams.set('page', '1'); // reset to page 1 on filter change
    setSearchParams(newParams);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    const newParams = new URLSearchParams(searchParams);
    if (inputQuery.trim()) {
      newParams.set('q', inputQuery.trim());
    } else {
      newParams.delete('q');
    }
    newParams.set('page', '1');
    setSearchParams(newParams);
  };

  const clearAllFilters = () => {
    setSearchParams(new URLSearchParams());
  };

  const popularBrands = [
    'Apple', 'Samsung', 'Sony', 'ASUS', 'Lenovo', 'Nike', 'Puma', 'Titan', 'LG', 'Minimalist', 'Green Soul'
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* 1. Natural Language Search Bar */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <SearchIcon className="absolute left-4 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="e.g. 'Best laptop under ₹60,000 for coding' or 'Running shoes under ₹3,000'..."
            className="w-full pl-12 pr-32 py-3.5 rounded-2xl border-2 border-brand-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm shadow-md focus:outline-none focus:border-brand-500 transition"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition"
          >
            {t('hero.searchButton')}
          </button>
        </form>
      </div>

      {/* 2. Extracted Natural Language NLP tags if available */}
      {parsedNLP && (
        <div className="p-4 rounded-xl border border-brand-100 dark:border-brand-900/40 bg-brand-50/50 dark:bg-brand-950/20 flex flex-wrap items-center gap-2 text-xs">
          <span className="font-bold text-brand-700 dark:text-brand-300 flex items-center gap-1">
            <Sparkles className="h-3.5 w-3.5" />
            AI Query Extraction:
          </span>
          {parsedNLP.category && parsedNLP.category !== 'All' && (
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
              Category: <strong>{parsedNLP.category}</strong>
            </span>
          )}
          {parsedNLP.budget && (
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-emerald-700 dark:text-emerald-300 font-medium border border-slate-200 dark:border-slate-700">
              Budget: <strong>₹{parsedNLP.budget.toLocaleString('en-IN')}</strong>
            </span>
          )}
          {parsedNLP.brandPreference && (
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
              Brand: <strong>{parsedNLP.brandPreference}</strong>
            </span>
          )}
          {parsedNLP.intendedUse && (
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-indigo-700 dark:text-indigo-300 font-medium border border-slate-200 dark:border-slate-700">
              Usage: <strong>{parsedNLP.intendedUse}</strong>
            </span>
          )}
          {parsedNLP.requiredSpecs && parsedNLP.requiredSpecs.length > 0 && (
            <span className="px-2.5 py-1 rounded-full bg-white dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-medium border border-slate-200 dark:border-slate-700">
              Specs: <strong>{parsedNLP.requiredSpecs.join(', ')}</strong>
            </span>
          )}
        </div>
      )}

      {/* 3. Main Content: Filter Sidebar + Products Grid */}
      <div className="flex flex-col lg:flex-row gap-8 items-start">
        {/* Mobile Filter Toggle Button */}
        <div className="w-full lg:hidden flex items-center justify-between">
          <button
            onClick={() => setShowMobileFilters(!showMobileFilters)}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-sm font-semibold text-slate-700 dark:text-slate-200"
          >
            <SlidersHorizontal className="h-4 w-4" />
            <span>Filters & Categories</span>
          </button>
          <span className="text-xs text-slate-500">{totalCount} products found</span>
        </div>

        {/* Sidebar Filters */}
        <aside className={`w-full lg:w-64 flex-shrink-0 space-y-6 bg-white dark:bg-slate-900 p-5 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-xs ${
          showMobileFilters ? 'block' : 'hidden lg:block'
        }`}>
          <div className="flex items-center justify-between pb-3 border-b border-slate-100 dark:border-slate-800">
            <span className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-1.5">
              <Filter className="h-4 w-4 text-brand-600" />
              Search Filters
            </span>
            {(categoryParam !== 'All' || brandParam !== 'All' || retailerParam !== 'All' || minPriceParam || maxPriceParam || ratingParam) && (
              <button
                onClick={clearAllFilters}
                className="text-xs text-rose-600 hover:underline font-medium"
              >
                Clear all
              </button>
            )}
          </div>

          {/* Category Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Category
            </label>
            <select
              value={categoryParam}
              onChange={(e) => updateParam('category', e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Categories (20)</option>
              {UNIVERSAL_CATEGORIES.map((c) => (
                <option key={c.id} value={c.name}>{c.name}</option>
              ))}
            </select>
          </div>

          {/* Retailer Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Retailer Platform
            </label>
            <select
              value={retailerParam}
              onChange={(e) => updateParam('retailer', e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Retailers</option>
              {RETAILER_PLATFORMS.map((r) => (
                <option key={r.id} value={r.name}>{r.name} ({r.status})</option>
              ))}
            </select>
          </div>

          {/* Brand Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Brand
            </label>
            <select
              value={brandParam}
              onChange={(e) => updateParam('brand', e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none focus:ring-1 focus:ring-brand-500"
            >
              <option value="All">All Brands</option>
              {popularBrands.map((b) => (
                <option key={b} value={b}>{b}</option>
              ))}
            </select>
          </div>

          {/* Price Range Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Price Range (₹)
            </label>
            <div className="grid grid-cols-2 gap-2">
              <input
                type="number"
                placeholder="Min"
                value={minPriceParam}
                onChange={(e) => updateParam('minPrice', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
              <input
                type="number"
                placeholder="Max"
                value={maxPriceParam}
                onChange={(e) => updateParam('maxPrice', e.target.value)}
                className="w-full px-2.5 py-1.5 rounded-lg text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
              />
            </div>
          </div>

          {/* Rating Filter */}
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">
              Customer Rating
            </label>
            <select
              value={ratingParam}
              onChange={(e) => updateParam('rating', e.target.value)}
              className="w-full px-3 py-2 rounded-xl text-xs border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:outline-none"
            >
              <option value="">Any Rating</option>
              <option value="4.5">4.5★ and above</option>
              <option value="4.0">4.0★ and above</option>
              <option value="3.5">3.5★ and above</option>
            </select>
          </div>
        </aside>

        {/* Results Column */}
        <main className="flex-1 w-full space-y-6">
          {/* Top Sort and Count Bar */}
          <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
            <span className="text-xs font-semibold text-slate-600 dark:text-slate-300">
              Showing <strong>{products.length}</strong> of <strong>{totalCount}</strong> verified products
            </span>

            <div className="flex items-center gap-2">
              <span className="text-xs text-slate-400">Sort by:</span>
              <select
                value={sortParam}
                onChange={(e) => updateParam('sort', e.target.value)}
                className="px-3 py-1.5 rounded-lg text-xs font-semibold border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 focus:outline-none"
              >
                <option value="relevance">AI Recommendation Score</option>
                <option value="price_asc">Price: Low to High</option>
                <option value="price_desc">Price: High to Low</option>
                <option value="rating_desc">Highest Rated</option>
              </select>
            </div>
          </div>

          {/* Loading Skeletons */}
          {loading && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="rounded-2xl border border-slate-200 dark:border-slate-800 p-4 space-y-4 animate-pulse">
                  <div className="aspect-[4/3] rounded-xl bg-slate-200 dark:bg-slate-800" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-3/4" />
                  <div className="h-4 bg-slate-200 dark:bg-slate-800 rounded w-1/2" />
                </div>
              ))}
            </div>
          )}

          {/* Error Message */}
          {error && !loading && (
            <div className="p-6 rounded-2xl bg-rose-50 dark:bg-rose-950/40 border border-rose-200 dark:border-rose-900 text-center space-y-3">
              <p className="text-sm font-semibold text-rose-700 dark:text-rose-300">{error}</p>
              <button
                onClick={fetchProducts}
                className="px-4 py-2 rounded-xl bg-rose-600 text-white text-xs font-semibold"
              >
                Retry Search
              </button>
            </div>
          )}

          {/* Product Cards Grid */}
          {!loading && !error && products.length > 0 && (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {products.map((product) => (
                <ProductCard key={product._id} product={product} />
              ))}
            </div>
          )}

          {/* Empty State */}
          {!loading && !error && products.length === 0 && (
            <div className="p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-4 bg-white dark:bg-slate-900">
              <div className="h-12 w-12 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-400 flex items-center justify-center mx-auto">
                <SearchIcon className="h-6 w-6" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white">
                No matching verified products found
              </h3>
              <p className="text-xs text-slate-500 max-w-md mx-auto">
                Try widening your budget filter, removing specific brand constraints, or searching by broader keywords.
              </p>
              <button
                onClick={clearAllFilters}
                className="px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold shadow-sm"
              >
                Reset All Filters
              </button>
            </div>
          )}

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="flex items-center justify-center gap-2 pt-6">
              <button
                disabled={pageParam <= 1}
                onClick={() => updateParam('page', String(pageParam - 1))}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30"
              >
                <ChevronLeft className="h-4 w-4" />
              </button>
              <span className="text-xs font-semibold text-slate-600 dark:text-slate-300 px-3">
                Page {pageParam} of {totalPages}
              </span>
              <button
                disabled={pageParam >= totalPages}
                onClick={() => updateParam('page', String(pageParam + 1))}
                className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 disabled:opacity-30"
              >
                <ChevronRight className="h-4 w-4" />
              </button>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default Search;

