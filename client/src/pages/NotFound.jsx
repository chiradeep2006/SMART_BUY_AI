import React from 'react';
import { Link } from 'react-router-dom';
import { ShoppingBag, ArrowLeft, Home } from 'lucide-react';

export const NotFound = () => {
  return (
    <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4 space-y-4">
      <div className="h-16 w-16 rounded-2xl bg-brand-50 text-brand-600 flex items-center justify-center">
        <ShoppingBag className="h-8 w-8" />
      </div>
      <h1 className="text-4xl font-extrabold text-slate-900 dark:text-white">404</h1>
      <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Page Not Found</h2>
      <p className="text-xs text-slate-500 max-w-sm">
        The shopping researcher page you are looking for does not exist or has been relocated.
      </p>
      <Link
        to="/"
        className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-brand-600 text-white font-semibold text-xs shadow-md"
      >
        <Home className="h-4 w-4" />
        <span>Return to Homepage</span>
      </Link>
    </div>
  );
};

export default NotFound;
