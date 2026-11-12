import React, { useState, useEffect, useRef } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import api from '../services/api';
import { useLanguage } from '../context/LanguageContext';
import {
  Bot,
  Send,
  Trash2,
  Sparkles,
  ShoppingBag,
  ExternalLink,
  ArrowRight,
  User,
  AlertCircle
} from 'lucide-react';

export const AIAssistant = () => {
  const { t } = useTranslation();
  const { currentLanguage } = useLanguage();
  const [searchParams] = useSearchParams();
  const productId = searchParams.get('productId');

  const [messages, setMessages] = useState([
    {
      sender: 'assistant',
      text: 'Hello! I am SmartBuy AI, your unbiased shopping researcher. Ask me to compare products, evaluate specs, check price histories, or recommend the best purchases for your exact budget.',
      products: [],
    },
  ]);
  const [inputMessage, setInputMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, loading]);

  // If a productId was provided in query param, auto-send an initial research request
  useEffect(() => {
    if (productId) {
      handleSendMessage(`Can you analyze this product, summarize its specifications, and tell me if it is worth the current price?`);
    }
  }, [productId]);

  const handleSendMessage = async (customText = null) => {
    const textToSend = customText || inputMessage;
    if (!textToSend.trim() || loading) return;

    setError('');
    const userMsg = { sender: 'user', text: textToSend };
    setMessages((prev) => [...prev, userMsg]);
    if (!customText) setInputMessage('');
    setLoading(true);

    try {
      const res = await api.post('/ai/chat', {
        message: textToSend,
        productId,
        language: currentLanguage,
      });

      if (res.data.success) {
        setMessages((prev) => [
          ...prev,
          {
            sender: 'assistant',
            text: res.data.reply,
            products: res.data.suggestedProducts || [],
          },
        ]);
      }
    } catch (err) {
      setError('Unable to reach AI assistant service. Please check connection and retry.');
    } finally {
      setLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([
      {
        sender: 'assistant',
        text: 'Chat history cleared. How can I assist your shopping research today?',
        products: [],
      },
    ]);
  };

  const sampleQuestions = [
    'Best laptop under ₹60,000 for programming',
    'Compare iPhone 15 vs Samsung Galaxy S24',
    'What should I look for in an ergonomic office chair?',
    'Running shoes under ₹3,000 for daily training',
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 py-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center gap-3">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-brand-600 to-indigo-600 text-white flex items-center justify-center shadow-md">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h1 className="text-xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
              {t('assistant.title')}
              <span className="text-[10px] bg-brand-100 text-brand-700 dark:bg-brand-950 dark:text-brand-300 px-2 py-0.5 rounded-full font-bold">
                Gemini 1.5
              </span>
            </h1>
            <p className="text-xs text-slate-500">
              Unbiased, context-aware shopping guidance in 11 Indian languages
            </p>
          </div>
        </div>

        <button
          onClick={clearChat}
          className="text-xs font-semibold text-slate-400 hover:text-rose-600 flex items-center gap-1.5 transition"
        >
          <Trash2 className="h-3.5 w-3.5" />
          <span>{t('assistant.clear')}</span>
        </button>
      </div>

      {/* Chat Messages Container */}
      <div className="min-h-[450px] max-h-[550px] overflow-y-auto space-y-4 p-4 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 shadow-sm">
        {messages.map((msg, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 ${
              msg.sender === 'user' ? 'justify-end' : 'justify-start'
            }`}
          >
            {msg.sender === 'assistant' && (
              <div className="h-8 w-8 rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-950 dark:text-brand-400 flex items-center justify-center flex-shrink-0 mt-0.5">
                <Bot className="h-4 w-4" />
              </div>
            )}

            <div className={`max-w-[85%] rounded-2xl p-4 text-xs sm:text-sm leading-relaxed whitespace-pre-line shadow-xs ${
              msg.sender === 'user'
                ? 'bg-brand-600 text-white rounded-tr-none'
                : 'bg-slate-50 dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-100 dark:border-slate-700/60 rounded-tl-none'
            }`}>
              {msg.text}

              {/* Inline Product Cards Recommendation if available */}
              {msg.products && msg.products.length > 0 && (
                <div className="mt-3 pt-3 border-t border-slate-200 dark:border-slate-700 grid grid-cols-1 sm:grid-cols-2 gap-2 text-left">
                  {msg.products.map((p) => (
                    <Link
                      key={p.id}
                      to={`/product/${p.id}`}
                      className="p-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 flex items-center gap-2 hover:border-brand-500 transition group"
                    >
                      <img src={p.image} alt="" className="h-10 w-10 rounded object-cover" />
                      <div className="truncate flex-1">
                        <div className="font-semibold text-xs text-slate-900 dark:text-white truncate">
                          {p.title}
                        </div>
                        <div className="text-[11px] text-emerald-600 font-bold">
                          ₹{p.price.toLocaleString('en-IN')} • {p.retailer}
                        </div>
                      </div>
                      <ArrowRight className="h-3.5 w-3.5 text-slate-400 group-hover:text-brand-600" />
                    </Link>
                  ))}
                </div>
              )}
            </div>

            {msg.sender === 'user' && (
              <div className="h-8 w-8 rounded-lg bg-slate-200 text-slate-700 dark:bg-slate-700 dark:text-slate-200 flex items-center justify-center flex-shrink-0 mt-0.5">
                <User className="h-4 w-4" />
              </div>
            )}
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs text-slate-400 italic p-2">
            <div className="h-4 w-4 border-2 border-brand-500 border-t-transparent rounded-full animate-spin" />
            <span>{t('assistant.typing')}</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Suggested prompts */}
      <div className="flex flex-wrap items-center gap-2 text-xs">
        <span className="text-slate-400 font-semibold">{t('assistant.suggestions')}</span>
        {sampleQuestions.map((q, i) => (
          <button
            key={i}
            onClick={() => handleSendMessage(q)}
            className="rounded-full bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-brand-50 hover:text-brand-600 px-3 py-1 transition border border-slate-200 dark:border-slate-700"
          >
            {q}
          </button>
        ))}
      </div>

      {/* Input Box */}
      <form onSubmit={(e) => { e.preventDefault(); handleSendMessage(); }} className="relative flex items-center">
        <input
          type="text"
          value={inputMessage}
          onChange={(e) => setInputMessage(e.target.value)}
          placeholder={t('assistant.placeholder')}
          className="w-full pl-4 pr-24 py-3.5 rounded-2xl border-2 border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 text-slate-900 dark:text-white text-sm shadow-md focus:outline-none focus:border-brand-500 transition"
        />
        <button
          type="submit"
          disabled={!inputMessage.trim() || loading}
          className="absolute right-2 px-4 py-2 rounded-xl bg-brand-600 hover:bg-brand-700 text-white text-xs font-semibold shadow-sm transition disabled:opacity-40 flex items-center gap-1.5"
        >
          <span>{t('assistant.send')}</span>
          <Send className="h-3.5 w-3.5" />
        </button>
      </form>
    </div>
  );
};

export default AIAssistant;
