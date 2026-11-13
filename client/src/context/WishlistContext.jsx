import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useAuth } from './AuthContext';

const WishlistContext = createContext();

export const WishlistProvider = ({ children }) => {
  const { isAuthenticated } = useAuth();
  const [wishlist, setWishlist] = useState([]);
  const [loading, setLoading] = useState(false);

  // Load wishlist on auth change
  useEffect(() => {
    const fetchWishlist = async () => {
      if (!isAuthenticated) {
        // Guest mode fallback from localStorage
        const local = localStorage.getItem('smartbuy_guest_wishlist');
        setWishlist(local ? JSON.parse(local) : []);
        return;
      }

      setLoading(true);
      try {
        const res = await api.get('/wishlist');
        if (res.data.success) {
          // Normalize items: extract product object
          const items = res.data.wishlist.map((w) => ({
            ...w.product,
            wishlistEntryId: w._id,
          }));
          setWishlist(items);
        }
      } catch (err) {
        console.warn('[WishlistContext] Could not fetch remote wishlist:', err.message);
      } finally {
        setLoading(false);
      }
    };

    fetchWishlist();
  }, [isAuthenticated]);

  const isInWishlist = (productId) => {
    return wishlist.some((item) => String(item._id) === String(productId));
  };

  const addToWishlist = async (product) => {
    if (!product || !product._id) return;
    if (isInWishlist(product._id)) return;

    // Optimistic UI update
    setWishlist((prev) => [product, ...prev]);

    if (isAuthenticated) {
      try {
        await api.post('/wishlist', { productId: product._id });
      } catch (err) {
        console.error('[WishlistContext] Failed to save to database:', err);
      }
    } else {
      const updated = [product, ...wishlist];
      localStorage.setItem('smartbuy_guest_wishlist', JSON.stringify(updated));
    }
  };

  const removeFromWishlist = async (productId) => {
    // Optimistic UI update
    setWishlist((prev) => prev.filter((item) => String(item._id) !== String(productId)));

    if (isAuthenticated) {
      try {
        await api.delete(`/wishlist/${productId}`);
      } catch (err) {
        console.error('[WishlistContext] Failed to delete from database:', err);
      }
    } else {
      const updated = wishlist.filter((item) => String(item._id) !== String(productId));
      localStorage.setItem('smartbuy_guest_wishlist', JSON.stringify(updated));
    }
  };

  const toggleWishlist = async (product) => {
    if (isInWishlist(product._id)) {
      await removeFromWishlist(product._id);
    } else {
      await addToWishlist(product);
    }
  };

  return (
    <WishlistContext.Provider
      value={{
        wishlist,
        loading,
        isInWishlist,
        addToWishlist,
        removeFromWishlist,
        toggleWishlist,
      }}
    >
      {children}
    </WishlistContext.Provider>
  );
};

export const useWishlist = () => useContext(WishlistContext);

