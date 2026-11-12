import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useCompare } from '../context/CompareContext';
import { Scale, X, ArrowRight } from 'lucide-react';

export const ComparisonBar = () => {
  const { t } = useTranslation();
  const { compareList, removeFromCompare, clearCompare } = useCompare();

  if (compareList.length === 0) return null;

  return (
    <div className="fixed bottom-0 inset-x-0 z-40 bg-white/95 dark:bg-slate-900/95 backdrop-blur-md border-t border-slate-200 dark:border-slate-800 shadow-2xl py-3 px-4 transition-transform duration-300">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left summary */}
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 rounded-full bg-brand-100 dark:bg-brand-900/60 text-brand-600 dark:text-brand-300 flex items-center justify-center">
            <Scale className="h-4 w-4" />
          </div>
          <div>
            <span className="font-semibold text-sm text-slate-800 dark:text-slate-100">
              {t('compare.title')} ({compareList.length}/5)
            </span>
            <span className="text-xs text-slate-500 dark:text-slate-400 hidden sm:inline ml-2">
              {compareList.length < 2 ? 'Select at least 1 more product' : 'Ready for side-by-side analysis'}
            </span>
          </div>
        </div>

        {/* Thumbnails */}
        <div className="flex items-center gap-2 overflow-x-auto py-1">
          {compareList.map((product) => (
            <div
              key={product._id}
              className="relative flex-shrink-0 group rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-1 flex items-center gap-2 pr-2"
            >
              <img
                src={product.images?.[0] || ''}
                alt={product.title}
                className="h-9 w-9 rounded object-cover"
              />
              <span className="text-xs font-medium max-w-[100px] truncate hidden md:inline">
                {product.title}
              </span>
              <button
                onClick={() => removeFromCompare(product._id)}
                className="text-slate-400 hover:text-rose-500 rounded-full p-0.5"
                aria-label="Remove product"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>
          ))}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center gap-2">
          <button
            onClick={clearCompare}
            className="text-xs font-medium text-slate-500 dark:text-slate-400 hover:text-slate-800 dark:hover:text-slate-200 px-2 py-1.5"
          >
            {t('compare.clearAll')}
          </button>

          <Link
            to="/compare"
            className={`inline-flex items-center gap-1.5 px-4 py-2 rounded-xl text-xs sm:text-sm font-semibold shadow-md transition ${
              compareList.length >= 2
                ? 'bg-brand-600 hover:bg-brand-700 text-white shadow-brand-500/25'
                : 'bg-slate-200 dark:bg-slate-800 text-slate-400 dark:text-slate-500 cursor-not-allowed pointer-events-none'
            }`}
          >
            <span>Compare Now</span>
            <ArrowRight className="h-4 w-4" />
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ComparisonBar;
