import React from 'react';
import { Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { ShoppingBag, ShieldCheck, Cpu, Globe2, Sparkles, Heart } from 'lucide-react';
import LanguageSelector from './LanguageSelector';

export const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900/60 transition-colors">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Info */}
          <div className="lg:col-span-2 space-y-4">
            <Link to="/" className="flex items-center gap-2">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-500 flex items-center justify-center text-white shadow-md">
                <ShoppingBag className="h-5 w-5" />
              </div>
              <span className="font-extrabold text-xl text-slate-900 dark:text-white">
                SmartBuy <span className="text-brand-600 dark:text-brand-400">AI</span>
              </span>
            </Link>
            <p className="text-sm text-slate-600 dark:text-slate-400 max-w-sm leading-relaxed">
              Empowering consumers with objective, AI-driven cross-retailer shopping research. We eliminate biased sponsored ads and analyze genuine specifications, verified reviews, and price movements.
            </p>
            <div className="flex items-center gap-4 text-xs text-slate-500 dark:text-slate-400 pt-2">
              <span className="inline-flex items-center gap-1.5">
                <ShieldCheck className="h-4 w-4 text-emerald-600" />
                Verified Data
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Cpu className="h-4 w-4 text-brand-600" />
                Gemini AI Engine
              </span>
              <span className="inline-flex items-center gap-1.5">
                <Globe2 className="h-4 w-4 text-indigo-600" />
                11 Indian Languages
              </span>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Research Tools
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/search" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  {t('nav.search')}
                </Link>
              </li>
              <li>
                <Link to="/compare" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  {t('nav.compare')}
                </Link>
              </li>
              <li>
                <Link to="/assistant" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  {t('nav.assistant')}
                </Link>
              </li>
              <li>
                <Link to="/price-insights" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  {t('nav.priceInsights')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Categories */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Popular Categories
            </h4>
            <ul className="space-y-2 text-sm text-slate-600 dark:text-slate-400">
              <li>
                <Link to="/search?category=Laptops%20and%20computers" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  {t('categories.laptops')}
                </Link>
              </li>
              <li>
                <Link to="/search?category=Smartphones" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  {t('categories.smartphones')}
                </Link>
              </li>
              <li>
                <Link to="/search?category=Electronics" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  {t('categories.electronics')}
                </Link>
              </li>
              <li>
                <Link to="/search?category=Shoes%20and%20footwear" className="hover:text-brand-600 dark:hover:text-brand-400 transition">
                  {t('categories.shoes')}
                </Link>
              </li>
            </ul>
          </div>

          {/* Regional Settings */}
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-900 dark:text-slate-100 mb-3">
              Localization
            </h4>
            <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
              Select your preferred Indian language or script:
            </p>
            <LanguageSelector />
          </div>
        </div>

        {/* Bottom bar */}
        <div className="pt-8 mt-8 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 dark:text-slate-400 gap-4">
          <p>© {new Date().getFullYear()} SmartBuy AI. All rights reserved. Built for intelligent shopping research.</p>
          <div className="flex items-center gap-6">
            <Link to="/settings" className="hover:underline">Settings</Link>
            <span>•</span>
            <Link to="/search" className="hover:underline">Catalog</Link>
            <span>•</span>
            <span className="inline-flex items-center gap-1 text-slate-400">
              Made with <Heart className="h-3 w-3 text-rose-500 fill-rose-500" /> for India
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

