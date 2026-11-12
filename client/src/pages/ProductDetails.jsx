import React, { useState, useEffect } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import RatingStars from '../components/RatingStars';
import {
  Heart,
  Scale,
  ExternalLink,
  Bot,
  Sparkles,
  ShieldCheck,
  CheckCircle2,
  Clock,
  ArrowRight,
  TrendingDown,
  Layers,
  ChevronRight,
  Check,
  AlertCircle
} from 'lucide-react';

export const ProductDetails = () => {
  const { id } = useParams();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isComparing, addToCompare, removeFromCompare } = useCompare();

  const [product, setProduct] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [reviewAnalysis, setReviewAnalysis] = useState(null);
  const [analyzingReviews, setAnalyzingReviews] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await api.get(`/products/${id}`);
        if (res.data.success) {
          setProduct(res.data.product);
        }
      } catch (err) {
        setError(err.response?.data?.message || 'Could not load product details.');
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  const handleAnalyzeReviews = async () => {
    if (reviewAnalysis) return; // already analyzed
    setAnalyzingReviews(true);
    try {
      const res = await api.post('/ai/analyze-reviews', { productId: id });
      if (res.data.success) {
        setReviewAnalysis(res.data);
      }
    } catch (err) {
      console.warn('Error analyzing reviews:', err);
    } finally {
      setAnalyzingReviews(false);
    }
  };

  if (loading) {
    return (
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16 flex flex-col items-center justify-center space-y-4">
        <div className="h-10 w-10 border-4 border-brand-500 border-t-transparent rounded-full animate-spin" />
        <p className="text-sm text-slate-500">Loading verified product details...</p>
      </div>
    );
  }

  if (error || !product) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertCircle className="h-12 w-12 text-rose-500 mx-auto" />
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">Product Not Found</h2>
        <p className="text-xs text-slate-500">{error || 'This product does not exist in our catalog.'}</p>
        <Link to="/search" className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold">
          Return to Search
        </Link>
      </div>
    );
  }

  const inWishlist = isInWishlist(product._id);
  const comparing = isComparing(product._id);
  const specs = product.specifications instanceof Map ? Object.fromEntries(product.specifications) : (product.specifications || {});

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-1.5 text-xs text-slate-500 dark:text-slate-400">
        <Link to="/" className="hover:text-brand-600">Home</Link>
        <ChevronRight className="h-3 w-3" />
        <Link to={`/search?category=${encodeURIComponent(product.category)}`} className="hover:text-brand-600">
          {product.category}
        </Link>
        <ChevronRight className="h-3 w-3" />
        <span className="truncate max-w-xs text-slate-900 dark:text-slate-200 font-medium">
          {product.title}
        </span>
      </nav>

      {/* Main Grid: Gallery & Buying Box */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Image Gallery (5 cols) */}
        <div className="lg:col-span-5 space-y-4">
          <div className="relative aspect-square w-full rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
            <img
              src={product.images?.[selectedImage] || product.images?.[0]}
              alt={product.title}
              className="h-full w-full object-cover object-center"
            />
            {product.aiScore?.badge && (
              <span className="absolute top-3 left-3 px-3 py-1 rounded-full text-xs font-bold text-white bg-gradient-to-r from-amber-500 to-amber-600 shadow-md">
                ★ {product.aiScore.badge}
              </span>
            )}
          </div>

          {/* Thumbnails */}
          {product.images && product.images.length > 1 && (
            <div className="flex gap-2 overflow-x-auto pb-1">
              {product.images.map((img, i) => (
                <button
                  key={i}
                  onClick={() => setSelectedImage(i)}
                  className={`h-16 w-16 flex-shrink-0 rounded-xl overflow-hidden border-2 transition ${
                    selectedImage === i ? 'border-brand-600 scale-95' : 'border-slate-200 dark:border-slate-800'
                  }`}
                >
                  <img src={img} alt="" className="h-full w-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Right Column: Title, Ratings, Price & Actions (7 cols) */}
        <div className="lg:col-span-7 space-y-6">
          <div className="space-y-2">
            <div className="flex items-center gap-2">
              <span className="text-xs font-bold tracking-widest uppercase text-brand-600 dark:text-brand-400">
                {product.brand}
              </span>
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className="text-xs text-slate-500 dark:text-slate-400">
                Data Source: <strong className="text-slate-700 dark:text-slate-300">{product.dataSource}</strong>
              </span>
            </div>

            <h1 className="text-xl sm:text-2xl lg:text-3xl font-extrabold text-slate-900 dark:text-white leading-snug">
              {product.title}
            </h1>

            <div className="flex items-center gap-3 pt-1">
              <RatingStars rating={product.rating} count={product.reviewCount} size="md" />
              <span className="text-slate-300 dark:text-slate-700">•</span>
              <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${
                product.availability === 'In Stock'
                  ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                  : 'bg-amber-50 text-amber-700 dark:bg-amber-950/60 dark:text-amber-300'
              }`}>
                {product.availability}
              </span>
            </div>
          </div>

          {/* Price Box */}
          <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 space-y-2">
            <div className="flex items-baseline gap-3">
              <span className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
                ₹{product.price.toLocaleString('en-IN')}
              </span>
              {product.originalPrice && product.originalPrice > product.price && (
                <span className="text-sm text-slate-400 line-through">
                  ₹{product.originalPrice.toLocaleString('en-IN')}
                </span>
              )}
              {product.discountPercentage > 0 && (
                <span className="text-xs font-bold text-emerald-600 bg-emerald-50 dark:bg-emerald-950/60 px-2 py-1 rounded">
                  {product.discountPercentage}% OFF
                </span>
              )}
            </div>
            <p className="text-xs text-slate-500">
              Listed on <strong>{product.retailer}</strong> • Inclusive of all taxes
            </p>
          </div>

          {/* Functional Actions Row */}
          <div className="flex flex-wrap items-center gap-3">
            <a
              href={product.productUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 min-w-[200px] py-3.5 px-6 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 transition flex items-center justify-center gap-2"
            >
              <span>{t('platforms.visitRetailer')} ({product.retailer})</span>
              <ExternalLink className="h-4 w-4" />
            </a>

            <button
              onClick={() => toggleWishlist(product)}
              className={`p-3.5 rounded-xl border transition flex items-center justify-center gap-2 text-sm font-semibold ${
                inWishlist
                  ? 'bg-rose-50 border-rose-200 text-rose-600 dark:bg-rose-950/60 dark:border-rose-900'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              <Heart className={`h-4 w-4 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
              <span className="hidden sm:inline">{inWishlist ? 'Saved' : 'Wishlist'}</span>
            </button>

            <button
              onClick={() => (comparing ? removeFromCompare(product._id) : addToCompare(product))}
              className={`p-3.5 rounded-xl border transition flex items-center justify-center gap-2 text-sm font-semibold ${
                comparing
                  ? 'bg-brand-50 border-brand-200 text-brand-600 dark:bg-brand-950/60 dark:border-brand-900'
                  : 'border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800'
              }`}
            >
              {comparing ? <Check className="h-4 w-4 text-brand-600" /> : <Scale className="h-4 w-4" />}
              <span className="hidden sm:inline">{comparing ? 'In Compare' : 'Compare'}</span>
            </button>

            <button
              onClick={() => navigate(`/assistant?productId=${product._id}`)}
              className="p-3.5 rounded-xl border border-indigo-200 dark:border-indigo-900/60 bg-indigo-50 dark:bg-indigo-950/40 text-indigo-700 dark:text-indigo-300 hover:bg-indigo-100 transition flex items-center gap-2 text-sm font-semibold"
            >
              <Bot className="h-4 w-4" />
              <span>Ask AI About This</span>
            </button>
          </div>

          {/* Description */}
          <div className="pt-2">
            <h3 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-2">
              Overview
            </h3>
            <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
              {product.description}
            </p>
          </div>
        </div>
      </div>

      {/* Cross-Retailer Price Comparison Table ("Other retailer offers for this product") */}
      {product.otherOffers && product.otherOffers.length > 0 && (
        <section className="p-6 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
                <TrendingDown className="h-5 w-5 text-emerald-600" />
                Verified Offers on Other Retailers
              </h2>
              <p className="text-xs text-slate-500">
                Compare price, delivery and warranty across verified platforms
              </p>
            </div>
            <Link to={`/price-insights?productId=${product._id}`} className="text-xs font-semibold text-brand-600 hover:underline">
              View Price History →
            </Link>
          </div>

          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 dark:bg-slate-800/60 text-slate-500 font-semibold uppercase tracking-wider border-b border-slate-200 dark:border-slate-800">
                <tr>
                  <th className="py-3 px-4">Retailer</th>
                  <th className="py-3 px-4">Current Price</th>
                  <th className="py-3 px-4">Savings</th>
                  <th className="py-3 px-4">Availability</th>
                  <th className="py-3 px-4 text-right">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100 dark:divide-slate-800">
                {/* Main listed retailer */}
                <tr className="bg-brand-50/20 dark:bg-brand-950/10 font-semibold">
                  <td className="py-3 px-4 flex items-center gap-2">
                    <span>{product.retailer}</span>
                    <span className="text-[10px] bg-brand-100 text-brand-700 px-1.5 py-0.5 rounded">Current</span>
                  </td>
                  <td className="py-3 px-4 text-slate-900 dark:text-white font-bold">
                    ₹{product.price.toLocaleString('en-IN')}
                  </td>
                  <td className="py-3 px-4 text-emerald-600">
                    {product.discountPercentage > 0 ? `${product.discountPercentage}% Off MRP` : 'Standard Price'}
                  </td>
                  <td className="py-3 px-4 text-emerald-600">{product.availability}</td>
                  <td className="py-3 px-4 text-right">
                    <a
                      href={product.productUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="px-3 py-1.5 rounded-lg bg-brand-600 text-white font-medium hover:bg-brand-700 transition"
                    >
                      Visit
                    </a>
                  </td>
                </tr>

                {/* Other verified retailer offers */}
                {product.otherOffers.map((offer, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 dark:hover:bg-slate-800/40 transition">
                    <td className="py-3 px-4 font-medium text-slate-800 dark:text-slate-200">
                      {offer.retailer}
                    </td>
                    <td className="py-3 px-4 font-bold text-slate-900 dark:text-white">
                      ₹{offer.price.toLocaleString('en-IN')}
                    </td>
                    <td className="py-3 px-4 text-emerald-600">
                      {offer.discountPercentage ? `${offer.discountPercentage}% Off MRP` : '—'}
                    </td>
                    <td className="py-3 px-4 text-slate-600 dark:text-slate-300">{offer.availability}</td>
                    <td className="py-3 px-4 text-right">
                      <a
                        href={offer.productUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 hover:border-brand-500 transition font-medium"
                      >
                        Visit
                      </a>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      {/* Specifications Table */}
      <section className="space-y-4">
        <h2 className="text-xl font-bold text-slate-900 dark:text-white">
          Technical Specifications
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {Object.entries(specs).map(([key, val]) => (
            <div
              key={key}
              className="p-3.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex justify-between gap-4 text-xs"
            >
              <span className="font-semibold text-slate-500 dark:text-slate-400">{key}</span>
              <span className="font-medium text-slate-900 dark:text-slate-100 text-right">{String(val)}</span>
            </div>
          ))}
        </div>
      </section>

      {/* AI Review Analyzer Section */}
      <section className="p-6 sm:p-8 rounded-3xl border border-indigo-100 dark:border-indigo-950 bg-gradient-to-br from-indigo-50/40 to-purple-50/30 dark:from-slate-900 dark:to-indigo-950/20 space-y-6">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-indigo-100 dark:bg-indigo-950 text-indigo-700 dark:text-indigo-300 mb-2">
              <Sparkles className="h-3.5 w-3.5" />
              <span>AI Review Synthesis</span>
            </div>
            <h2 className="text-xl sm:text-2xl font-extrabold text-slate-900 dark:text-white">
              Verified Buyer Sentiment Analysis
            </h2>
            <p className="text-xs text-slate-600 dark:text-slate-400">
              Synthesized objectively from {product.reviews?.length || 0} authentic verified buyer reviews.
            </p>
          </div>

          <button
            onClick={handleAnalyzeReviews}
            disabled={analyzingReviews}
            className="px-5 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-semibold shadow-md transition disabled:opacity-50"
          >
            {analyzingReviews ? 'Analyzing with Gemini...' : reviewAnalysis ? 'Re-Analyze Reviews' : 'Analyze Reviews Now'}
          </button>
        </div>

        {/* Display Review Analysis Results if triggered */}
        {reviewAnalysis && reviewAnalysis.available && (
          <div className="space-y-4 pt-4 border-t border-indigo-100 dark:border-indigo-900">
            <div className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-indigo-100 dark:border-indigo-900 text-xs text-slate-800 dark:text-slate-200 leading-relaxed font-medium">
              {reviewAnalysis.aiSummary}
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="p-4 rounded-xl bg-emerald-50/60 dark:bg-emerald-950/40 border border-emerald-200 dark:border-emerald-900 space-y-2">
                <span className="font-bold text-xs text-emerald-800 dark:text-emerald-300">
                  Key Strengths & Praises
                </span>
                <ul className="space-y-1.5 text-xs text-emerald-900 dark:text-emerald-200">
                  {reviewAnalysis.positiveThemes?.map((theme, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <CheckCircle2 className="h-3.5 w-3.5 text-emerald-600 flex-shrink-0 mt-0.5" />
                      <span>{theme}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="p-4 rounded-xl bg-amber-50/60 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-900 space-y-2">
                <span className="font-bold text-xs text-amber-800 dark:text-amber-300">
                  Common Caveats & Considerations
                </span>
                <ul className="space-y-1.5 text-xs text-amber-900 dark:text-amber-200">
                  {reviewAnalysis.negativeThemes?.map((theme, i) => (
                    <li key={i} className="flex items-start gap-1.5">
                      <AlertCircle className="h-3.5 w-3.5 text-amber-600 flex-shrink-0 mt-0.5" />
                      <span>{theme}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        )}

        {/* Verified Customer Reviews List */}
        <div className="space-y-3 pt-4">
          <h3 className="text-sm font-bold text-slate-900 dark:text-white">
            Customer Reviews ({product.reviews?.length || 0})
          </h3>

          {product.reviews && product.reviews.length > 0 ? (
            <div className="space-y-3">
              {product.reviews.map((rev, i) => (
                <div
                  key={i}
                  className="p-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 space-y-2"
                >
                  <div className="flex items-center justify-between text-xs">
                    <span className="font-semibold text-slate-900 dark:text-white">
                      {rev.author}
                    </span>
                    <span className="text-slate-400">
                      {new Date(rev.date).toLocaleDateString()}
                    </span>
                  </div>
                  <RatingStars rating={rev.rating} />
                  {rev.title && (
                    <h4 className="text-xs font-bold text-slate-800 dark:text-slate-200">
                      {rev.title}
                    </h4>
                  )}
                  <p className="text-xs text-slate-600 dark:text-slate-300">
                    {rev.comment}
                  </p>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic">
              No individual customer reviews available for this product on verified retailers.
            </p>
          )}
        </div>
      </section>
    </div>
  );
};

export default ProductDetails;
