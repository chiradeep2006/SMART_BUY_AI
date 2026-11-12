import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import RatingStars from '../components/RatingStars';
import {
  Sparkles,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  MessageSquare,
  ThumbsUp,
  ThumbsDown,
  ArrowRight
} from 'lucide-react';

export const AIReviewAnalyzer = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const initialProductId = searchParams.get('productId');

  const [products, setProducts] = useState([]);
  const [selectedProductId, setSelectedProductId] = useState(initialProductId || '');
  const [analysis, setAnalysis] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  // Fetch product list for dropdown selector
  useEffect(() => {
    const fetchCatalog = async () => {
      try {
        const res = await api.get('/products?limit=20');
        if (res.data.success && res.data.products.length > 0) {
          setProducts(res.data.products);
          if (!selectedProductId) {
            setSelectedProductId(res.data.products[0]._id);
          }
        }
      } catch (err) {
        console.warn('Error fetching catalog products:', err);
      }
    };

    fetchCatalog();
  }, []);

  // Run analysis when selectedProductId changes
  useEffect(() => {
    if (!selectedProductId) return;

    const runAnalysis = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.post('/ai/analyze-reviews', { productId: selectedProductId });
        if (res.data.success) {
          setAnalysis(res.data);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to analyze reviews.');
      } finally {
        setLoading(false);
      }
    };

    runAnalysis();
  }, [selectedProductId]);

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 mb-2">
          <Sparkles className="h-3.5 w-3.5" />
          <span>Gemini Review Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('reviews.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Synthesizes authentic verified customer feedback. We never generate artificial customer reviews.
        </p>
      </div>

      {/* Product Selector */}
      <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row items-center gap-3">
        <label className="text-xs font-bold text-slate-600 dark:text-slate-300 flex-shrink-0">
          Select Product to Analyze:
        </label>
        <select
          value={selectedProductId}
          onChange={(e) => setSelectedProductId(e.target.value)}
          className="flex-1 w-full px-3 py-2 rounded-xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-xs font-semibold text-slate-900 dark:text-white focus:outline-none"
        >
          {products.map((p) => (
            <option key={p._id} value={p._id}>
              {p.title} ({p.retailer} - ₹{p.price.toLocaleString('en-IN')})
            </option>
          ))}
        </select>
      </div>

      {loading && (
        <div className="py-16 text-center space-y-3">
          <div className="h-10 w-10 border-4 border-indigo-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Extracting themes from verified reviews...</p>
        </div>
      )}

      {error && !loading && (
        <div className="p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
          {error}
        </div>
      )}

      {/* Analysis Presentation */}
      {analysis && !loading && (
        <div className="space-y-6">
          {analysis.available ? (
            <>
              {/* Sentiment Overview Bar */}
              <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  <div>
                    <h3 className="text-base font-bold text-slate-900 dark:text-white">
                      {analysis.product.title}
                    </h3>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars rating={analysis.product.rating} count={analysis.product.reviewCount} />
                      <span className="text-slate-300">•</span>
                      <span className="text-xs font-bold text-brand-600">{analysis.sentiment.overall}</span>
                    </div>
                  </div>

                  <Link
                    to={`/product/${analysis.product.id}`}
                    className="text-xs font-semibold text-brand-600 hover:underline flex items-center gap-1 self-start sm:self-auto"
                  >
                    <span>View Product</span>
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                {/* Sentiment Ratio Bar */}
                <div className="space-y-1 pt-2">
                  <div className="flex justify-between text-xs font-semibold">
                    <span className="text-emerald-600">{analysis.sentiment.positivePercentage}% Positive</span>
                    <span className="text-slate-400">{analysis.sentiment.neutralPercentage}% Neutral</span>
                    <span className="text-rose-600">{analysis.sentiment.negativePercentage}% Critical</span>
                  </div>
                  <div className="h-3 rounded-full bg-slate-100 dark:bg-slate-800 overflow-hidden flex">
                    <div style={{ width: `${analysis.sentiment.positivePercentage}%` }} className="bg-emerald-500 h-full" />
                    <div style={{ width: `${analysis.sentiment.neutralPercentage}%` }} className="bg-slate-400 h-full" />
                    <div style={{ width: `${analysis.sentiment.negativePercentage}%` }} className="bg-rose-500 h-full" />
                  </div>
                </div>
              </div>

              {/* Synthesis Summary */}
              <div className="p-6 rounded-2xl border border-indigo-100 dark:border-indigo-900 bg-indigo-50/40 dark:bg-indigo-950/20 space-y-2">
                <h4 className="text-xs font-bold text-indigo-700 dark:text-indigo-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Sparkles className="h-3.5 w-3.5" />
                  AI Executive Review Summary
                </h4>
                <p className="text-xs sm:text-sm text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
                  {analysis.aiSummary}
                </p>
              </div>

              {/* Strengths & Weaknesses 2-Column Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-5 rounded-2xl border border-emerald-200 dark:border-emerald-900 bg-white dark:bg-slate-900 space-y-3">
                  <h4 className="text-xs font-bold text-emerald-700 dark:text-emerald-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ThumbsUp className="h-4 w-4" />
                    Key Strengths & Praises
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {analysis.positiveThemes?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="p-5 rounded-2xl border border-rose-200 dark:border-rose-900 bg-white dark:bg-slate-900 space-y-3">
                  <h4 className="text-xs font-bold text-rose-700 dark:text-rose-300 uppercase tracking-wider flex items-center gap-1.5">
                    <ThumbsDown className="h-4 w-4" />
                    Caveats & Common Complaints
                  </h4>
                  <ul className="space-y-2 text-xs text-slate-700 dark:text-slate-300">
                    {analysis.negativeThemes?.map((item, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <AlertCircle className="h-4 w-4 text-rose-500 flex-shrink-0 mt-0.5" />
                        <span>{item}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </>
          ) : (
            <div className="p-8 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-2 bg-white dark:bg-slate-900">
              <AlertCircle className="h-8 w-8 text-slate-400 mx-auto" />
              <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
                {analysis.message}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default AIReviewAnalyzer;
