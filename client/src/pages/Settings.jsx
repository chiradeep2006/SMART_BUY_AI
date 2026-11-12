import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { useLanguage } from '../context/LanguageContext';
import { useTheme } from '../context/ThemeContext';
import {
  Settings as SettingsIcon,
  Globe,
  DollarSign,
  Sun,
  Moon,
  Bell,
  Save,
  CheckCircle2,
  Sparkles
} from 'lucide-react';

export const Settings = () => {
  const { t } = useTranslation();
  const { user, updateProfile } = useAuth();
  const { currentLanguage, changeLanguage, supportedLanguages } = useLanguage();
  const { theme, toggleTheme, setTheme } = useTheme();

  const [selectedLang, setSelectedLang] = useState(currentLanguage);
  const [selectedTheme, setSelectedTheme] = useState(theme);
  const [currency, setCurrency] = useState(user?.preferences?.currency || 'INR');
  const [priceAlerts, setPriceAlerts] = useState(user?.preferences?.notifications?.priceAlerts ?? true);
  const [deals, setDeals] = useState(user?.preferences?.notifications?.deals ?? true);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSave = async (e) => {
    e.preventDefault();
    changeLanguage(selectedLang);
    setTheme(selectedTheme);

    if (user) {
      await updateProfile({
        preferences: {
          language: selectedLang,
          theme: selectedTheme,
          currency,
          notifications: {
            priceAlerts,
            deals,
          },
        },
      }).catch((e) => console.warn(e));
    }

    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 3000);
  };

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 mb-2">
          <SettingsIcon className="h-3.5 w-3.5" />
          <span>Application Settings</span>
        </div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
          {t('settings.title')}
        </h1>
        <p className="text-xs text-slate-500">
          {t('settings.subtitle')}
        </p>
      </div>

      {savedSuccess && (
        <div className="p-4 rounded-xl bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-200 text-emerald-800 text-xs flex items-center gap-2">
          <CheckCircle2 className="h-4 w-4 text-emerald-600" />
          <span>{t('settings.savedSuccess')}</span>
        </div>
      )}

      <form onSubmit={handleSave} className="space-y-6">
        {/* Language Selection */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2">
            <Globe className="h-4 w-4 text-brand-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t('settings.language')} (11 Supported Indian Languages)
            </h3>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
            {supportedLanguages.map((lang) => (
              <button
                key={lang.code}
                type="button"
                onClick={() => setSelectedLang(lang.code)}
                className={`p-3 rounded-xl border text-left text-xs transition flex flex-col justify-between ${
                  selectedLang === lang.code
                    ? 'border-brand-600 bg-brand-50/50 dark:bg-brand-950/40 font-bold text-brand-700 dark:text-brand-300'
                    : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 text-slate-700 dark:text-slate-300'
                }`}
              >
                <span className="text-sm font-semibold">{lang.nativeName}</span>
                <span className="text-[11px] text-slate-400 font-normal">{lang.name}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Theme Selection */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-3">
          <div className="flex items-center gap-2">
            <Sun className="h-4 w-4 text-amber-500" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t('settings.theme')}
            </h3>
          </div>
          <div className="grid grid-cols-2 gap-3 max-w-sm">
            <button
              type="button"
              onClick={() => setSelectedTheme('light')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                selectedTheme === 'light'
                  ? 'border-brand-600 bg-brand-50 text-brand-700 dark:bg-brand-950 font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Sun className="h-4 w-4 text-amber-500" />
              <span>Light Mode</span>
            </button>
            <button
              type="button"
              onClick={() => setSelectedTheme('dark')}
              className={`p-3 rounded-xl border text-xs font-semibold flex items-center justify-center gap-2 transition ${
                selectedTheme === 'dark'
                  ? 'border-brand-600 bg-slate-800 text-white font-bold'
                  : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
              }`}
            >
              <Moon className="h-4 w-4 text-indigo-400" />
              <span>Dark Mode</span>
            </button>
          </div>
        </div>

        {/* Notifications */}
        <div className="p-5 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 space-y-4">
          <div className="flex items-center gap-2">
            <Bell className="h-4 w-4 text-brand-600" />
            <h3 className="font-bold text-sm text-slate-900 dark:text-white">
              {t('settings.notifications')}
            </h3>
          </div>
          <div className="space-y-3">
            <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>{t('settings.priceAlerts')}</span>
              <input
                type="checkbox"
                checked={priceAlerts}
                onChange={(e) => setPriceAlerts(e.target.checked)}
                className="h-4 w-4 text-brand-600 rounded"
              />
            </label>
            <label className="flex items-center justify-between text-xs text-slate-700 dark:text-slate-300 cursor-pointer">
              <span>{t('settings.dealUpdates')}</span>
              <input
                type="checkbox"
                checked={deals}
                onChange={(e) => setDeals(e.target.checked)}
                className="h-4 w-4 text-brand-600 rounded"
              />
            </label>
          </div>
        </div>

        {/* Save CTA */}
        <div>
          <button
            type="submit"
            className="px-6 py-3 rounded-xl bg-brand-600 hover:bg-brand-700 text-white font-semibold text-xs shadow-md transition flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            <span>{t('settings.saveButton')}</span>
          </button>
        </div>
      </form>
    </div>
  );
};

export default Settings;
