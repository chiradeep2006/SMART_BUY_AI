import React, { createContext, useContext, useState, useEffect } from 'react';

const CompareContext = createContext();

export const CompareProvider = ({ children }) => {
  const [compareList, setCompareList] = useState(() => {
    try {
      const saved = sessionStorage.getItem('smartbuy_compare_list');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      sessionStorage.setItem('smartbuy_compare_list', JSON.stringify(compareList));
    } catch (e) {
      console.warn('Failed to persist compare list to sessionStorage:', e);
    }
  }, [compareList]);

  const isComparing = (productId) => {
    return compareList.some((item) => String(item._id) === String(productId));
  };

  const addToCompare = (product) => {
    if (!product || !product._id) return { success: false, reason: 'invalid_product' };
    if (isComparing(product._id)) return { success: false, reason: 'already_added' };
    if (compareList.length >= 5) {
      return { success: false, reason: 'limit_reached', max: 5 };
    }

    setCompareList((prev) => [...prev, product]);
    return { success: true };
  };

  const removeFromCompare = (productId) => {
    setCompareList((prev) => prev.filter((item) => String(item._id) !== String(productId)));
  };

  const clearCompare = () => {
    setCompareList([]);
  };

  return (
    <CompareContext.Provider
      value={{
        compareList,
        isComparing,
        addToCompare,
        removeFromCompare,
        clearCompare,
      }}
    >
      {children}
    </CompareContext.Provider>
  );
};

export const useCompare = () => useContext(CompareContext);
