import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useWishlist } from '../context/WishlistContext';
import { useCompare } from '../context/CompareContext';
import ProductCard from '../components/ProductCard';
import {
  Heart,
  Scale,
  ShoppingBag,
  Trash2,
  ExternalLink,
  ArrowRight
} from 'lucide-react';

export const Wishlist = () => {
  const { t } = useTranslation();
  const { wishlist, removeFromWishlist } = useWishlist();
  const { addToCompare, isComparing } = useCompare();

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-rose-50 dark:bg-rose-950 text-rose-600 dark:text-rose-400 mb-2">
            <Heart className="h-3.5 w-3.5 fill-rose-600" />
            <span>Saved Products</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
            {t('nav.wishlist')}
          </h1>
          <p className="text-xs sm:text-sm text-slate-500">
            {wishlist.length} products tracked for price drops and verified availability
          </p>
        </div>

        {wishlist.length > 0 && (
          <Link
            to="/search"
            className="self-start sm:self-auto px-4 py-2 rounded-xl bg-brand-50 text-brand-600 text-xs font-semibold hover:bg-brand-100 transition"
          >
            + Add More Products
          </Link>
        )}
      </div>

      {/* Empty State */}
      {wishlist.length === 0 ? (
        <div className="p-12 rounded-3xl border border-dashed border-slate-300 dark:border-slate-800 bg-white dark:bg-slate-900 text-center space-y-4">
          <div className="h-16 w-16 rounded-full bg-rose-50 dark:bg-rose-950 text-rose-500 flex items-center justify-center mx-auto">
            <Heart className="h-8 w-8" />
          </div>
          <h3 className="text-lg font-bold text-slate-900 dark:text-white">
            Your Wishlist is Empty
          </h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Explore laptops, smartphones, fashion, and home appliances. Tap the heart icon on any card to track price drops!
          </p>
          <Link
            to="/search"
            className="inline-flex items-center gap-2 px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition"
          >
            <span>Explore Products</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {wishlist.map((product) => (
            <ProductCard key={product._id} product={product} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;

