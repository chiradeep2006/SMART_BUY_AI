import React, { useState, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer
} from 'recharts';
import {
  TrendingDown,
  Sparkles,
  ArrowDownRight,
  ShieldCheck,
  Calendar,
  AlertCircle,
  ExternalLink,
  ChevronRight
} from 'lucide-react';

export const PriceInsights = () => {
  const { t } = useTranslation();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');

  const [insights, setInsights] = useState(null);
  const [catalogHighlights, setCatalogHighlights] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPriceData = async () => {
      setLoading(true);
      try {
        if (productId) {
          const res = await api.get(`/insights/prices?productId=${productId}`);
          if (res.data.success) {
            setInsights(res.data);
          }
        } else {
          // Fetch catalog-wide tracked price drops
          const res = await api.get('/insights/prices');
          if (res.data.success) {
            setCatalogHighlights(res.data.highlights || []);
          }
        }
      } catch (err) {
        console.warn('Error loading price insights:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchPriceData();
  }, [productId]);

  // Format historical chart data
  const chartData = insights?.priceHistory?.map((item) => ({
    date: new Date(item.date).toLocaleDateString('en-IN', { month: 'short', day: 'numeric' }),
    price: item.price,
    retailer: item.retailer,
  })) || [];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-emerald-50 dark:bg-emerald-950 text-emerald-600 dark:text-emerald-400 mb-2">
          <TrendingDown className="h-3.5 w-3.5" />
          <span>Real-Time Price Intelligence</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
          {t('insights.title')}
        </h1>
        <p className="text-xs sm:text-sm text-slate-500">
          Track genuine historical price movements across verified retailers. We never simulate artificial price graphs.
        </p>
      </div>

      {loading && (
        <div className="py-16 text-center space-y-3">
          <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin mx-auto" />
          <p className="text-xs text-slate-500">Fetching verified historical price records...</p>
        </div>
      )}

      {/* Case 1: Specific Product Price Insights */}
      {insights && !loading && (
        <div className="space-y-8">
          {/* Product Header Card */}
          <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <span className="text-xs text-brand-600 font-bold uppercase">{insights.product.retailer}</span>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white mt-1">
                {insights.product.title}
              </h2>
            </div>
            <Link
              to={`/product/${insights.product.id}`}
              className="px-4 py-2 rounded-xl bg-brand-50 dark:bg-slate-800 text-brand-600 dark:text-brand-300 font-semibold text-xs hover:bg-brand-100 transition flex items-center gap-1 self-start sm:self-auto"
            >
              <span>View Product Details</span>
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          </div>

          {/* Metric Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="text-xs text-slate-400">{t('insights.currentPrice')}</span>
              <div className="text-xl font-extrabold text-slate-900 dark:text-white">
                ₹{insights.priceMetrics.currentPrice.toLocaleString('en-IN')}
              </div>
              {insights.priceMetrics.isAtLowest && (
                <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.5 rounded">
                  Lowest Price Ever!
                </span>
              )}
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="text-xs text-slate-400">{t('insights.lowestPrice')}</span>
              <div className="text-xl font-extrabold text-emerald-600">
                ₹{insights.priceMetrics.lowestRecorded.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">All-time record low</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="text-xs text-slate-400">{t('insights.highestPrice')}</span>
              <div className="text-xl font-extrabold text-slate-700 dark:text-slate-300">
                ₹{insights.priceMetrics.highestRecorded.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">Peak recorded</span>
            </div>

            <div className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-1">
              <span className="text-xs text-slate-400">{t('insights.savings')}</span>
              <div className="text-xl font-extrabold text-emerald-600">
                ₹{insights.priceMetrics.currentSavingsVsPeak.toLocaleString('en-IN')}
              </div>
              <span className="text-[10px] text-slate-400">Saved vs peak price</span>
            </div>
          </div>

          {/* Genuine Historical Price Chart */}
          {chartData.length > 0 ? (
            <div className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="font-bold text-sm text-slate-900 dark:text-white">
                    {t('insights.priceHistory')}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Verified price logs from {chartData[0].date} to {chartData[chartData.length - 1].date}
                  </p>
                </div>
              </div>

              <div className="h-72 w-full pt-4">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={chartData} margin={{ top: 10, right: 10, left: 0, bottom: 0 }}>
                    <CartesianGrid strokeDasharray="3 3" opacity={0.15} />
                    <XAxis dataKey="date" tick={{ fontSize: 11 }} />
                    <YAxis
                      domain={['auto', 'auto']}
                      tick={{ fontSize: 11 }}
                      tickFormatter={(val) => `₹${val.toLocaleString('en-IN')}`}
                    />
                    <Tooltip
                      formatter={(val) => [`₹${val.toLocaleString('en-IN')}`, 'Price']}
                      contentStyle={{ backgroundColor: '#1e293b', border: 'none', borderRadius: '8px', color: '#fff', fontSize: '12px' }}
                    />
                    <Line
                      type="monotone"
                      dataKey="price"
                      stroke="#4f46e5"
                      strokeWidth={3}
                      dot={{ r: 4, fill: '#4f46e5' }}
                      activeDot={{ r: 6 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </div>
          ) : (
            <div className="p-6 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center text-xs text-slate-500">
              No genuine historical price points logged yet for this specific SKU.
            </div>
          )}
        </div>
      )}

      {/* Case 2: Overall Tracked Catalog Price Drops */}
      {!productId && !loading && (
        <div className="space-y-6">
          <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 text-xs text-emerald-800 dark:text-emerald-200 flex items-center gap-2">
            <ShieldCheck className="h-4 w-4 flex-shrink-0" />
            <span>
              Real-time monitoring verified price reductions across Amazon, Flipkart, Croma, and Myntra.
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {catalogHighlights.map((item) => (
              <div
                key={item.id}
                className="p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex items-center justify-between gap-4 hover:shadow-md transition"
              >
                <div className="flex items-center gap-3 truncate">
                  <img src={item.image} alt="" className="h-12 w-12 rounded-xl object-cover flex-shrink-0" />
                  <div className="truncate">
                    <span className="text-[10px] font-bold text-brand-600 uppercase">{item.retailer}</span>
                    <h4 className="text-xs font-bold text-slate-900 dark:text-white truncate">
                      {item.title}
                    </h4>
                    <div className="flex items-center gap-2 mt-1">
                      <span className="text-sm font-extrabold text-slate-900 dark:text-white">
                        ₹{item.currentPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-xs text-slate-400 line-through">
                        ₹{item.previousPrice.toLocaleString('en-IN')}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-600 bg-emerald-50 px-1 rounded">
                        -{item.dropPercentage}%
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  to={`/price-insights?productId=${item.id}`}
                  className="p-2 rounded-lg bg-slate-100 hover:bg-brand-50 text-slate-600 hover:text-brand-600 transition flex-shrink-0"
                  title="View Price History"
                >
                  <ArrowDownRight className="h-4 w-4" />
                </Link>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default PriceInsights;
