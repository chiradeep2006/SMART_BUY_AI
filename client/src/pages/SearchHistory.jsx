import React, { useState, useEffect } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { History, Trash2, ArrowUpRight, Search, Clock, AlertCircle } from 'lucide-react';

export const SearchHistory = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [historyList, setHistoryList] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchHistory = async () => {
    setLoading(true);
    try {
      const res = await api.get('/search/history');
      if (res.data.success) {
        setHistoryList(res.data.history);
      }
    } catch (err) {
      console.warn('Error fetching search history:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  const handleDeleteItem = async (id, e) => {
    e.stopPropagation();
    try {
      await api.delete(`/search/history/${id}`);
      setHistoryList((prev) => prev.filter((item) => item._id !== id));
    } catch (err) {
      console.error('Failed to delete history item:', err);
    }
  };

  const handleClearAll = async () => {
    try {
      await api.delete('/search/history');
      setHistoryList([]);
    } catch (err) {
      console.error('Failed to clear search history:', err);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div>
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-xs font-semibold bg-brand-50 text-brand-600 mb-2">
            <History className="h-3.5 w-3.5" />
            <span>Activity Log</span>
          </div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-white">
            {t('nav.history')}
          </h1>
          <p className="text-xs text-slate-500">
            Past product searches and natural language queries saved to your account.
          </p>
        </div>

        {historyList.length > 0 && (
          <button
            onClick={handleClearAll}
            className="text-xs font-semibold text-rose-600 hover:text-rose-700 hover:underline flex items-center gap-1"
          >
            <Trash2 className="h-3.5 w-3.5" />
            <span>Clear All History</span>
          </button>
        )}
      </div>

      {loading && (
        <div className="py-12 text-center text-xs text-slate-400">
          Loading past searches...
        </div>
      )}

      {!loading && historyList.length === 0 && (
        <div className="p-12 rounded-2xl border border-dashed border-slate-300 dark:border-slate-800 text-center space-y-3 bg-white dark:bg-slate-900">
          <Clock className="h-8 w-8 text-slate-400 mx-auto" />
          <p className="text-sm font-semibold text-slate-800 dark:text-slate-200">
            No Search History Yet
          </p>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            Your searches for laptops, smartphones, fashion, and home appliances will appear here.
          </p>
          <Link
            to="/search"
            className="inline-block px-5 py-2.5 rounded-xl bg-brand-600 text-white text-xs font-semibold"
          >
            Start Searching
          </Link>
        </div>
      )}

      {/* History List */}
      <div className="space-y-2">
        {historyList.map((item) => (
          <div
            key={item._id}
            onClick={() => navigate(`/search?q=${encodeURIComponent(item.query)}`)}
            className="p-4 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:border-brand-400 hover:shadow-xs transition flex items-center justify-between cursor-pointer group"
          >
            <div className="flex items-center gap-3">
              <div className="h-9 w-9 rounded-lg bg-slate-100 dark:bg-slate-800 text-slate-500 flex items-center justify-center flex-shrink-0">
                <Search className="h-4 w-4" />
              </div>
              <div>
                <h4 className="font-semibold text-sm text-slate-900 dark:text-white group-hover:text-brand-600 transition">
                  {item.query}
                </h4>
                <div className="flex items-center gap-3 text-xs text-slate-400 mt-0.5">
                  <span>{new Date(item.createdAt).toLocaleDateString()}</span>
                  <span>•</span>
                  <span className="text-brand-600 font-medium">{item.category || 'All Categories'}</span>
                </div>
              </div>
            </div>

            <div className="flex items-center gap-2">
              <button
                onClick={(e) => handleDeleteItem(item._id, e)}
                className="p-2 text-slate-400 hover:text-rose-600 transition rounded-lg"
                title="Delete this record"
              >
                <Trash2 className="h-4 w-4" />
              </button>
              <ArrowUpRight className="h-4 w-4 text-slate-400 group-hover:text-brand-600 transition" />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default SearchHistory;
