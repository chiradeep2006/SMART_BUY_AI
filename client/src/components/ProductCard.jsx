import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { Heart, Scale, ExternalLink, Sparkles, Check, ArrowRight } from 'lucide-react';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import RatingStars from './RatingStars';

export const ProductCard = ({ product }) => {
  const { t } = useTranslation();
  const { isInWishlist, toggleWishlist } = useWishlist();
  const { isComparing, addToCompare, removeFromCompare } = useCompare();

  if (!product) return null;

  const inWishlist = isInWishlist(product._id);
  const comparing = isComparing(product._id);
  const badge = product.aiScore?.badge;

  const handleCompareClick = (e) => {
    e.preventDefault();
    if (comparing) {
      removeFromCompare(product._id);
    } else {
      addToCompare(product);
    }
  };

  const handleWishlistClick = (e) => {
    e.preventDefault();
    toggleWishlist(product);
  };

  return (
    <div className="group relative flex flex-col rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm hover:shadow-xl transition-all duration-200 overflow-hidden">
      {/* AI Score Badge if present */}
      {badge && (
        <div className="absolute top-3 left-3 z-10">
          <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm text-white ${
            badge === 'Best Overall'
              ? 'bg-gradient-to-r from-amber-500 to-amber-600'
              : badge === 'Best Budget'
              ? 'bg-gradient-to-r from-emerald-500 to-emerald-600'
              : badge === 'Best Premium'
              ? 'bg-gradient-to-r from-purple-500 to-purple-600'
              : 'bg-gradient-to-r from-blue-500 to-blue-600'
          }`}>
            <Sparkles className="h-3 w-3" />
            {badge}
          </span>
        </div>
      )}

      {/* Floating Action Buttons */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button
          onClick={handleWishlistClick}
          aria-label={inWishlist ? t('product.removeFromWishlist') : t('product.addToWishlist')}
          className={`h-9 w-9 rounded-full flex items-center justify-center shadow-md transition ${
            inWishlist
              ? 'bg-rose-50 text-rose-600 border border-rose-200 dark:bg-rose-950/80 dark:border-rose-800'
              : 'bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-rose-600 hover:scale-105 backdrop-blur-sm'
          }`}
        >
          <Heart className={`h-4 w-4 ${inWishlist ? 'fill-rose-600 text-rose-600' : ''}`} />
        </button>

        <button
          onClick={handleCompareClick}
          title={comparing ? t('compare.remove') : t('product.addToCompare')}
          className={`h-9 w-9 rounded-full flex items-center justify-center shadow-md transition ${
            comparing
              ? 'bg-brand-600 text-white shadow-brand-500/20'
              : 'bg-white/90 dark:bg-slate-800/90 text-slate-500 hover:text-brand-600 hover:scale-105 backdrop-blur-sm'
          }`}
        >
          {comparing ? <Check className="h-4 w-4" /> : <Scale className="h-4 w-4" />}
        </button>
      </div>

      {/* Product Image */}
      <Link to={`/product/${product._id}`} className="relative aspect-[4/3] w-full overflow-hidden bg-slate-100 dark:bg-slate-800">
        <img
          src={product.images?.[0] || 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80'}
          alt={product.title}
          loading="lazy"
          className="h-full w-full object-cover object-center group-hover:scale-105 transition-transform duration-300"
          onError={(e) => {
            e.target.src = 'https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=600&auto=format&fit=crop&q=80';
          }}
        />

        {/* Data Source tag: transparent reporting */}
        <span className="absolute bottom-2 left-2 px-2 py-0.5 rounded text-[10px] font-medium tracking-wide uppercase bg-slate-900/70 text-slate-200 backdrop-blur-xs">
          {product.dataSource || 'Demo data'}
        </span>
      </Link>

      {/* Product Details Body */}
      <div className="flex flex-1 flex-col p-4">
        {/* Retailer & Brand bar */}
        <div className="flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 mb-1.5">
          <span className="font-semibold uppercase tracking-wider text-brand-600 dark:text-brand-400">
            {product.brand}
          </span>
          <span className="inline-flex items-center gap-1 font-medium bg-slate-100 dark:bg-slate-800 px-2 py-0.5 rounded-full">
            {product.retailer}
          </span>
        </div>

        {/* Title */}
        <Link to={`/product/${product._id}`} className="hover:text-brand-600 dark:hover:text-brand-400 transition">
          <h3 className="font-semibold text-slate-900 dark:text-slate-100 text-sm line-clamp-2 leading-snug mb-2">
            {product.title}
          </h3>
        </Link>

        {/* Rating */}
        <div className="mb-3">
          <RatingStars rating={product.rating || 4.0} count={product.reviewCount || 0} />
        </div>

        {/* Price & Discounts */}
        <div className="mt-auto pt-2 border-t border-slate-100 dark:border-slate-800">
          <div className="flex items-baseline gap-2 mb-1">
            <span className="text-xl font-bold text-slate-900 dark:text-slate-50">
              ₹{(product.price || 0).toLocaleString('en-IN')}
            </span>
            {product.originalPrice && product.originalPrice > product.price && (
              <span className="text-xs text-slate-400 line-through">
                ₹{product.originalPrice.toLocaleString('en-IN')}
              </span>
            )}
            {product.discountPercentage > 0 && (
              <span className="text-xs font-semibold text-emerald-600 dark:text-emerald-400 bg-emerald-50 dark:bg-emerald-950/60 px-1.5 py-0.5 rounded">
                {product.discountPercentage}% {t('product.off')}
              </span>
            )}
          </div>

          {/* Other Retailer offers note */}
          {product.otherOffers && product.otherOffers.length > 0 && (
            <p className="text-[11px] text-slate-500 dark:text-slate-400">
              +{product.otherOffers.length} more stores from ₹{Math.min(product.price, ...product.otherOffers.map(o => o.price)).toLocaleString('en-IN')}
            </p>
          )}

          {/* Card footer CTA */}
          <div className="mt-3 flex items-center justify-between gap-2">
            <Link
              to={`/product/${product._id}`}
              className="flex-1 inline-flex items-center justify-center gap-1.5 py-2 px-3 rounded-lg text-xs font-semibold bg-brand-50 hover:bg-brand-100 text-brand-700 dark:bg-slate-800 dark:text-brand-300 dark:hover:bg-slate-700 transition"
            >
              <span>{t('product.viewDetails')}</span>
              <ArrowRight className="h-3 w-3" />
            </Link>

            <a
              href={product.productUrl || '#'}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={t('platforms.visitRetailer')}
              className="p-2 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-500 hover:text-brand-600 hover:border-brand-300 dark:hover:border-brand-600 transition"
            >
              <ExternalLink className="h-4 w-4" />
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductCard;
