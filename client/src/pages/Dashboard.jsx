import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useWishlist } from '../context/WishlistContext';
import api from '../services/api';
import ProductCard from '../components/ProductCard';
import {
  Search,
  Heart,
  History,
  TrendingDown,
  Sparkles,
  ArrowRight,
  ArrowUpRight,
  ShoppingBag,
  Layers,
  ChevronRight,
  RefreshCw
} from 'lucide-react';
import { UNIVERSAL_CATEGORIES } from '../../../server/src/data/categoriesData';

export const Dashboard = () => {
  const { t } = useTranslation();
  const { user } = useAuth();
  const { wishlist } = useWishlist();
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState('');
  const [insightsData, setInsightsData] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchDashboardData = async () => {
    setLoading(true);
    try {
      const res = await api.get('/insights/dashboard');
      if (res.data.success) {
        setInsightsData(res.data);
      }
    } catch (err) {
      console.warn('[Dashboard] Error fetching insights:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* 1. Header & Welcome */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 p-6 sm:p-8 rounded-2xl bg-gradient-to-r from-brand-600 via-indigo-600 to-purple-600 text-white shadow-xl">
        <div className="space-y-1">
          <span className="text-xs uppercase font-bold tracking-widest text-brand-200">
            {t('dashboard.overview')}
          </span>
          <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight">
            {t('dashboard.welcome')}, {user?.name || 'Shopper'}!
          </h1>
          <p className="text-sm text-brand-100 max-w-xl">
            Track real-time price drops, compare tech specs across verified retailers, and discover algorithmic recommendations.
          </p>
        </div>

        {/* Quick Stats Pill */}
        <div className="flex items-center gap-3">
          <Link
            to="/wishlist"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition flex items-center gap-2 border border-white/20 text-xs sm:text-sm font-semibold"
          >
            <Heart className="h-4 w-4 text-rose-300" />
            <span>{wishlist.length} Saved Items</span>
          </Link>
          <Link
            to="/history"
            className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 backdrop-blur-md transition flex items-center gap-2 border border-white/20 text-xs sm:text-sm font-semibold"
          >
            <History className="h-4 w-4 text-brand-200" />
            <span>Search History</span>
          </Link>
        </div>
      </div>

      {/* 2. AI Search Input in Dashboard */}
      <div className="max-w-3xl mx-auto">
        <form onSubmit={handleSearchSubmit} className="relative flex items-center">
          <Search className="absolute left-4 h-5 w-5 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search e.g. 'Laptop under ₹50,000' or 'Running shoes'..."
            className="w-full pl-12 pr-36 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm shadow-md focus:outline-none focus:border-brand-500 transition"
          />
          <button
            type="submit"
            className="absolute right-2 px-5 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition"
          >
            {t('hero.searchButton')}
          </button>
        </form>
      </div>

      {/* 3. Recent Searches Grid */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="h-5 w-5 text-brand-600" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('dashboard.recentSearches')}
            </h2>
          </div>
          <Link to="/history" className="text-xs font-semibold text-brand-600 hover:underline">
            View All History →
          </Link>
        </div>

        {insightsData?.recentSearches && insightsData.recentSearches.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {insightsData.recentSearches.map((item) => (
              <button
                key={item._id}
                onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
                className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-400 hover:shadow-sm text-left transition group"
              >
                <div className="flex items-center justify-between text-xs text-slate-400 mb-1">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <ArrowUpRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-600 transition" />
                </div>
                <div className="font-semibold text-sm text-slate-800 dark:text-slate-100 truncate">
                  {item.query}
                </div>
                <div className="text-[11px] text-brand-600 dark:text-brand-400 mt-1">
                  {item.category || 'All Categories'}
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500">
            {t('dashboard.emptySearches')}
          </div>
        )}
      </div>

      {/* 4. Curated Recommendations for You */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-amber-500" />
            <h2 className="text-lg font-bold text-slate-900 dark:text-white">
              {t('dashboard.recommendations')}
            </h2>
          </div>
          <Link to="/search" className="text-xs font-semibold text-brand-600 hover:underline">
            Explore All Products →
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {insightsData?.recommendations?.map((prod) => (
            <ProductCard key={prod._id} product={prod} />
          ))}
        </div>
      </div>

      {/* 5. Top Verified Price Drops */}
      {insightsData?.topDeals && insightsData.topDeals.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <TrendingDown className="h-5 w-5 text-emerald-600" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('dashboard.topDeals')}
              </h2>
            </div>
            <Link to="/price-insights" className="text-xs font-semibold text-brand-600 hover:underline">
              {t('nav.priceInsights')} →
            </Link>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {insightsData.topDeals.map((prod) => (
              <ProductCard key={prod._id} product={prod} />
            ))}
          </div>
        </div>
      )}

      {/* 6. Quick Category Navigation Grid */}
      <div className="space-y-4 pt-4">
        <h2 className="text-lg font-bold text-slate-900 dark:text-white">
          Explore All 20 Universal Shopping Categories
        </h2>
        <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-5 gap-3">
          {UNIVERSAL_CATEGORIES.slice(0, 10).map((cat) => (
            <Link
              key={cat.id}
              to={`/search?category=${encodeURIComponent(cat.name)}`}
              className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-500 hover:shadow-xs transition flex items-center justify-between text-xs font-semibold text-slate-800 dark:text-slate-200"
            >
              <span>{cat.name}</span>
              <ChevronRight className="h-3.5 w-3.5 text-slate-400" />
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

