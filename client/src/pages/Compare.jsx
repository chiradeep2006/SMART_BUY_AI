import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useCompare } from '../context/CompareContext';
import RatingStars from '../components/RatingStars';
import {
  Scale,
  Sparkles,
  CheckCircle2,
  X,
  ExternalLink,
  Plus,
  ArrowRight,
  TrendingUp,
  AlertCircle
} from 'lucide-react';

export const Compare = () => {
  const { t } = useTranslation();
  const { compareList, removeFromCompare, clearCompare, addToCompare } = useCompare();

  const [comparisonData, setComparisonData] = useState(null);
  const [catalogSuggestions, setCatalogSuggestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch comparison analysis from backend
  const runComparison = async () => {
    if (compareList.length < 2) return;

    setLoading(true);
    setError('');

    try {
      const productIds = compareList.map((p) => p._id);
      const res = await api.post('/compare/compare', { productIds });
      if (res.data.success) {
        setComparisonData(res.data.comparison);
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to compare products.');
    } finally {
      setLoading(false);
    }
  };

  // If user has fewer than 2 items, fetch recommended catalog products so they can quickly add
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.get('/products?limit=8');
        if (res.data.success) {
          setCatalogSuggestions(res.data.products);
        }
      } catch (e) {
        // quiet fallback
      }
    };
    fetchCatalog();
  }, []);

  useEffect(() => {
    if (compareList.length >= 2) {
      runComparison();
    } else {
      setComparisonData(null);
    }
  }, [compareList]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 dark:bg-brand-950 text-brand-600 dark:text-brand-400 mb-2">
            <Scale className="h-3.5 w-3.5" />
            <span>Deterministic Head-to-Head Engine</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('compare.title')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            Compare 2 to 5 products side-by-side with verified specifications and mathematical scoring.
          </p>
        </div>

        {compareList.length > 0 && (
          <button
            onClick={clearCompare}
            className="self-start sm:self-auto text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline"
          >
            {t('compare.clearAll')} ({compareList.length})
          </button>
        )}
      </div>

      {/* State A: Fewer than 2 products selected */}
      {compareList.length < 2 && (
        <div className="p-8 sm:p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4">
          <div className="h-12 w-12 rounded-2xl bg-brand-50 dark:bg-brand-950 text-brand-600 flex items-center justify-center mx-auto">
            <Scale className="h-6 w-6" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Select at least 2 products to compare
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            You currently have {compareList.length} product selected. Browse our verified catalog and tap the scale icon on any product to compare.
          </p>

          {/* Quick Add Suggestions */}
          {catalogSuggestions.length > 0 && (
            <div className="pt-6 text-left space-y-3">
              <span className="text-xs font-bold text-slate-400 uppercase tracking-wider block text-center">
                Quick-Add Trending Products
              </span>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                {catalogSuggestions.slice(0, 4).map((p) => (
                  <div
                    key={p._id}
                    className="p-3 rounded-xl border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800/40 flex items-center justify-between gap-3 text-xs"
                  >
                    <div className="flex items-center gap-2 truncate">
                      <img src={p.images?.[0]} alt="" className="h-8 w-8 rounded object-cover" />
                      <div className="truncate">
                        <p className="font-semibold text-slate-800 dark:text-slate-100 truncate">{p.title}</p>
                        <p className="text-slate-500">₹{p.price.toLocaleString('en-IN')}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => addToCompare(p)}
                      className="px-2.5 py-1 rounded-lg bg-brand-600 text-white font-semibold flex items-center gap-1 text-[11px] flex-shrink-0"
                    >
                      <Plus className="h-3 w-3" />
                      <span>Add</span>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* State B: Comparison Active */}
      {loading && (
        <div className="py-12 text-center space-y-3">
          <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Calculating deterministic suitability scores...</p>
        </div>
      )}

      {comparisonData && !loading && (
        <div className="space-y-8">
          {/* AI Comparison Verdict Highlights */}
          <div className="p-6 sm:p-8 rounded-3xl border border-brand-200 dark:border-brand-900 bg-gradient-to-br from-brand-50/70 via-white to-indigo-50/50 dark:from-slate-900 dark:to-brand-950/30 space-y-4 shadow-sm">
            <div className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-amber-500" />
              <h2 className="text-lg font-bold text-slate-900 dark:text-white">
                {t('compare.verdict')}
              </h2>
            </div>
            <p className="text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {comparisonData.aiSummary.verdict}
            </p>

            {/* Quick recommendation cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-3 pt-2">
              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-amber-600 uppercase tracking-wider block mb-1">
                  ★ Best Overall Choice
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {comparisonData.aiSummary.verdict.split('.')[0]}.
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-emerald-600 uppercase tracking-wider block mb-1">
                  💰 Best Budget Option
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {comparisonData.aiSummary.budgetPick}
                </p>
              </div>

              <div className="p-3.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-xs">
                <span className="font-bold text-purple-600 uppercase tracking-wider block mb-1">
                  ⚡ Best Premium Performance
                </span>
                <p className="text-slate-600 dark:text-slate-300">
                  {comparisonData.aiSummary.premiumPick}
                </p>
              </div>
            </div>
          </div>

          {/* Side-by-Side Comparison Matrix */}
          <div className="overflow-x-auto rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <table className="w-full border-collapse text-left text-xs">
              <thead>
                <tr className="border-b border-slate-200 dark:border-slate-800">
                  <th className="p-4 w-48 bg-slate-50 dark:bg-slate-800/60 font-bold uppercase tracking-wider text-slate-500">
                    Product
                  </th>
                  {comparisonData.products.map((prod) => (
                    <th key={prod._id} className="p-4 min-w-[220px] max-w-[280px] align-top relative">
                      <button
                        onClick={() => removeFromCompare(prod._id)}
                        className="absolute top-3 right-3 text-slate-400 hover:text-rose-500 p-1"
                        title="Remove from comparison"
                      >
                        <X className="h-4 w-4" />
                      </button>

                      <div className="space-y-2 pr-6">
                        <img
                          src={prod.images?.[0]}
                          alt={prod.title}
                          className="h-28 w-full object-cover rounded-xl"
                        />
                        {prod.aiScore?.badge && (
                          <span className="inline-block px-2 py-0.5 rounded text-[10px] font-bold text-white bg-amber-500">
                            {prod.aiScore.badge}
                          </span>
                        )}
                        <h4 className="font-bold text-sm text-slate-900 dark:text-white line-clamp-2">
                          {prod.title}
                        </h4>
                        <div className="text-lg font-extrabold text-slate-900 dark:text-white">
                          ₹{prod.price.toLocaleString('en-IN')}
                        </div>
                        <a
                          href={prod.productUrl}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-xs text-brand-600 hover:underline font-semibold"
                        >
                          <span>{prod.retailer}</span>
                          <ExternalLink className="h-3 w-3" />
                        </a>
                      </div>
                    </th>
                  ))}
                </tr>
              </thead>

              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* AI Overall Score Row */}
                <tr className="bg-brand-50/20 dark:bg-brand-950/20">
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                    Overall AI Score
                  </td>
                  {comparisonData.products.map((prod) => (
                    <td key={prod._id} className="p-4 font-extrabold text-base text-brand-600 dark:text-brand-400">
                      {prod.aiScore.overall}/100
                    </td>
                  ))}
                </tr>

                {/* Rating Row */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                    Rating & Reviews
                  </td>
                  {comparisonData.products.map((prod) => (
                    <td key={prod._id} className="p-4">
                      <RatingStars rating={prod.rating} count={prod.reviewCount} />
                    </td>
                  ))}
                </tr>

                {/* Value for Money Score */}
                <tr>
                  <td className="p-4 font-bold text-slate-700 dark:text-slate-300">
                    Value for Money Score
                  </td>
                  {comparisonData.products.map((prod) => (
                    <td key={prod._id} className="p-4 font-semibold text-slate-800 dark:text-slate-200">
                      {prod.aiScore.valueForMoney}/100
                    </td>
                  ))}
                </tr>

                {/* Specifications Rows */}
                {comparisonData.specificationFields.map((field) => (
                  <tr key={field} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="p-4 font-semibold text-slate-600 dark:text-slate-400">
                      {field}
                    </td>
                    {comparisonData.products.map((prod) => {
                      const specMap = prod.specifications instanceof Map
                        ? Object.fromEntries(prod.specifications)
                        : (prod.specifications || {});
                      const val = specMap[field];
                      return (
                        <td key={prod._id} className="p-4 text-slate-800 dark:text-slate-200">
                          {val ? String(val) : <span className="text-slate-300 dark:text-slate-600">—</span>}
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default Compare;
