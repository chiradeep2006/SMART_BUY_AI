import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import {
  Search,
  Sparkles,
  ArrowRight,
  ShieldCheck,
  Scale,
  Bot,
  TrendingDown,
  Layers,
  CheckCircle2,
  ExternalLink,
  Percent,
  Sliders,
  Cpu,
  Star
} from 'lucide-react';
import { UNIVERSAL_CATEGORIES } from '../../../server/src/data/categoriesData';
import { RETAILER_PLATFORMS } from '../../../server/src/data/retailersData';

export const Home = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/search?q=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  const sampleQueries = [
    'Best laptop under ₹60,000 for programming',
    'Best smartphone under ₹25,000 with a good camera',
    'Running shoes under ₹3,000',
    'Best refrigerator for a family',
    'Best skincare products under ₹1,000',
  ];

  return (
    <div className="space-y-20 pb-16">
      {/* 1. Hero Section */}
      <section className="relative overflow-hidden pt-12 pb-20 md:pt-20 md:pb-28">
        {/* Background gradient decorative glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-gradient-to-tr from-brand-400/20 via-indigo-500/20 to-purple-500/10 blur-[100px] rounded-full pointer-events-none" />

        <div className="relative max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8">
          {/* Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-brand-200 dark:border-brand-800 bg-brand-50/80 dark:bg-brand-950/60 text-brand-700 dark:text-brand-300 text-xs font-semibold shadow-xs">
            <Sparkles className="h-3.5 w-3.5" />
            <span>{t('hero.badge')}</span>
          </div>

          {/* Heading */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold tracking-tight text-slate-900 dark:text-white leading-[1.15]">
            {t('hero.title')}
          </h1>

          {/* Subtitle */}
          <p className="max-w-2xl mx-auto text-base sm:text-lg text-slate-600 dark:text-slate-300 leading-relaxed">
            {t('hero.subtitle')}
          </p>

          {/* AI Search Bar */}
          <div className="max-w-3xl mx-auto">
            <form onSubmit={handleSearchSubmit} className="relative flex items-center">
              <div className="absolute left-4 pointer-events-none text-slate-400">
                <Search className="h-5 w-5" />
              </div>
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder={t('hero.searchPlaceholder')}
                className="w-full pl-12 pr-36 sm:pr-40 py-4 sm:py-5 rounded-2xl border-2 border-brand-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm sm:text-base shadow-xl shadow-brand-500/5 focus:outline-none focus:border-brand-500 transition placeholder:text-slate-400"
              />
              <button
                type="submit"
                className="absolute right-2.5 sm:right-3 px-4 sm:px-6 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-brand-600 to-indigo-600 hover:from-brand-700 hover:to-indigo-700 text-white text-xs sm:text-sm font-semibold shadow-md shadow-brand-500/25 transition flex items-center gap-1.5"
              >
                <span>{t('hero.searchButton')}</span>
                <ArrowRight className="h-4 w-4" />
              </button>
            </form>

            {/* Suggested Searches */}
            <div className="mt-4 flex flex-wrap items-center justify-center gap-2 text-xs">
              <span className="text-slate-500 dark:text-slate-400 font-medium">{t('hero.popular')}</span>
              {sampleQueries.slice(0, 3).map((query, i) => (
                <button
                  key={i}
                  type="button"
                  onClick={() => {
                    setSearchQuery(query);
                    navigate(`/search?q=${encodeURIComponent(query)}`);
                  }}
                  className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-slate-700 px-3 py-1 transition border border-slate-200 dark:border-slate-700/60"
                >
                  {query}
                </button>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* 2. Popular Universal Shopping Categories */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t('categories.title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t('categories.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-3 sm:gap-4">
          {UNIVERSAL_CATEGORIES.map((cat) => (
            <Link
              key={cat.id}
              to={`/search?category=${encodeURIComponent(cat.name)}`}
              className="group flex flex-col p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-300 dark:hover:border-brand-700 hover:shadow-md transition text-left"
            >
              <div className="h-10 w-10 rounded-lg bg-brand-50 dark:bg-brand-950/60 text-brand-600 dark:text-brand-400 flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                <Layers className="h-5 w-5" />
              </div>
              <h3 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 dark:group-hover:text-brand-400 transition">
                {cat.name}
              </h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-1 mt-1">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 3. Featured Shopping Platforms & Transparent Integration Status */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center space-y-2 mb-10">
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
            {t('platforms.title')}
          </h2>
          <p className="text-sm text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
            {t('platforms.subtitle')}
          </p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {RETAILER_PLATFORMS.slice(0, 12).map((retailer) => {
            const isLive = retailer.status === 'Live integration';
            const isDemo = retailer.status === 'Demo data';
            return (
              <div
                key={retailer.id}
                className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 flex flex-col justify-between"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-bold text-slate-900 dark:text-white text-base">
                      {retailer.name}
                    </span>
                    <span
                      className={`inline-flex items-center px-2 py-0.5 rounded text-[10px] font-semibold uppercase tracking-wider ${
                        isLive
                          ? 'bg-emerald-50 text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300'
                          : isDemo
                          ? 'bg-blue-50 text-blue-700 dark:bg-blue-950/60 dark:text-blue-300'
                          : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'
                      }`}
                    >
                      {retailer.status}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 dark:text-slate-400 line-clamp-2 mb-3">
                    {retailer.description}
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-100 dark:border-slate-800 text-slate-400">
                  <span>Region: {retailer.region}</span>
                  <a
                    href={retailer.website}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-brand-600 dark:text-brand-400 font-medium hover:underline"
                  >
                    <span>Visit</span>
                    <ExternalLink className="h-3 w-3" />
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* 4. How It Works (4 Steps) */}
      <section className="bg-slate-100/60 dark:bg-slate-900/40 py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center space-y-2 mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white">
              How SmartBuy AI Works
            </h2>
            <p className="text-sm text-slate-600 dark:text-slate-400">
              An engineering approach to transparent, unbiased shopping discovery
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center">
                1
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Natural Language Parsing
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Our Gemini-powered NLP extracts budget, category, hardware specifications, and intended usage from queries in English and 10 Indian regional languages.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center">
                2
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Cross-Retailer Gathering
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Searches Amazon, Flipkart, Croma, Myntra, and global retailers in parallel with dedicated timeouts to locate verified pricing and stock availability.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center">
                3
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Deterministic Scoring
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Applies a transparent mathematical formula (Price 35%, Specs 30%, Reviews 20%, Value 15%) to score candidates strictly on verified facts.
              </p>
            </div>

            <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-3">
              <div className="h-10 w-10 rounded-xl bg-brand-600 text-white font-extrabold flex items-center justify-center">
                4
              </div>
              <h3 className="font-bold text-slate-900 dark:text-white text-base">
                Unbiased Verdict
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Highlights the Best Overall, Best Budget, and Best Premium picks with genuine historical price movements and review sentiment analysis.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 5. Deterministic AI Recommendation Explanation */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="p-8 sm:p-12 rounded-3xl border border-brand-200 dark:border-brand-900/60 bg-gradient-to-br from-brand-50/50 via-white to-indigo-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-brand-950/20 shadow-lg">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-center">
            <div className="space-y-4">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-100 dark:bg-brand-950 text-brand-700 dark:text-brand-300">
                <Cpu className="h-3.5 w-3.5" />
                <span>Deterministic Scoring Architecture</span>
              </div>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                No Sponsored Bias. Strictly Algorithmic.
              </h2>
              <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed">
                Traditional shopping sites rank products based on who paid the highest advertising fee. SmartBuy AI ranks products using a verified weighted formula calculated from actual data:
              </p>
              <div className="grid grid-cols-2 gap-3 pt-2">
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Budget Match</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">35% Weight</div>
                  <p className="text-[11px] text-slate-400">Proximity to target price</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Specification Fit</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">30% Weight</div>
                  <p className="text-[11px] text-slate-400">Hardware & performance</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Review Quality</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">20% Weight</div>
                  <p className="text-[11px] text-slate-400">Verified buyer sentiment</p>
                </div>
                <div className="p-3 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700">
                  <span className="text-xs text-slate-500 dark:text-slate-400">Value for Money</span>
                  <div className="text-xl font-bold text-slate-900 dark:text-white">15% Weight</div>
                  <p className="text-[11px] text-slate-400">Price-to-feature ratio</p>
                </div>
              </div>
            </div>

            <div className="space-y-4">
              <div className="p-6 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                <h4 className="font-bold text-sm text-slate-900 dark:text-white flex items-center gap-2">
                  <ShieldCheck className="h-4 w-4 text-emerald-500" />
                  Our Core Commitments
                </h4>
                <ul className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Never invent prices:</strong> Missing data receives a completeness penalty rather than a fabricated figure.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Transparent Data Sources:</strong> Every product and retailer card explicitly states whether data is live or demo.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>Genuine Review Analysis:</strong> Review themes are synthesized strictly from authentic verified buyer feedback.</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500 flex-shrink-0 mt-0.5" />
                    <span><strong>True 11-Language Multilingual:</strong> Native scripts and accurate currency formatting without altering budgets during translation.</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 6. Call to Action */}
      <section className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
        <h2 className="text-3xl sm:text-4xl font-extrabold text-slate-900 dark:text-white">
          Ready to experience unbiased shopping research?
        </h2>
        <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400 max-w-xl mx-auto">
          Start exploring today. Compare laptops, smartphones, fashion, and home appliances with real-time price insights.
        </p>
        <div className="flex flex-wrap items-center justify-center gap-4">
          <Link
            to="/search"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-sm shadow-md shadow-brand-500/25 transition"
          >
            Start Exploring Catalog
          </Link>
          <Link
            to="/assistant"
            className="px-6 py-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-700 dark:text-slate-200 hover:bg-slate-50 dark:hover:bg-slate-800 font-semibold text-sm transition"
          >
            Chat with Shopping Assistant
          </Link>
        </div>
      </section>
    </div>
  );
};

export default Home;
