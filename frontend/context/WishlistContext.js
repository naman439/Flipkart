'use client';

import { createContext, useContext, useState, useEffect, useCallback, useMemo } from 'react';
import { getWishlist as getWishlistApi, toggleWishlist as toggleWishlistApi, removeFromWishlist as removeFromWishlistApi } from '@/services/api/wishlist.api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const WishlistContext = createContext(null);

export function WishlistProvider({ children }) {
  const { isAuthenticated } = useAuth();
  
  // Array of full product objects/wishlist mapped rows
  const [wishlistItems, setWishlistItems] = useState([]);
  
  // Set of IDs purely for fast O(1) synchronous lookup on UI cards
  const [wishlistIds, setWishlistIds] = useState(new Set());
  
  const [loading, setLoading] = useState(false);

  /** Fetch wishlist from API and sync the IDs */
  const fetchWishlist = useCallback(async () => {
    if (!isAuthenticated) {
      setWishlistItems([]);
      setWishlistIds(new Set());
      return;
    }
    try {
      setLoading(true);
      const res = await getWishlistApi();
      const items = res.data || [];
      setWishlistItems(items);
      
      // Update the fast-lookup Set (items typically have `productId` from the Wishlist model)
      const ids = new Set(items.map(i => i.productId));
      setWishlistIds(ids);
    } catch (_err) {
      console.error('Failed to fetch wishlist');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchWishlist();
  }, [fetchWishlist]);

  /** Helper to instantly check if an item is liked */
  const isInWishlist = useCallback((productId) => {
    return wishlistIds.has(productId);
  }, [wishlistIds]);

  /** Centralized toggling action (API calls backend and syncs context instantly) */
  const toggleWishlist = useCallback(async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to modify your wishlist');
      return;
    }
    try {
      // Optimistic visual update
      setWishlistIds(prev => {
        const next = new Set(prev);
        if (next.has(productId)) next.delete(productId);
        else next.add(productId);
        return next;
      });

      const res = await toggleWishlistApi(productId);
      
      if (res.inWishlist) {
        toast.success('Added to wishlist');
      } else {
        toast.success('Removed from wishlist');
      }
      
      // Sync strictly to backend after API success
      await fetchWishlist();
    } catch (err) {
      toast.error('Failed to update wishlist');
      await fetchWishlist(); // Rollback in case of err
    }
  }, [isAuthenticated, fetchWishlist]);

  /** Direct removal bypassing toggle API (e.g. for exact deletes on Wishlist page) */
  const removeFromWishlist = useCallback(async (productId) => {
    try {
      // Optimistic update
      setWishlistIds(prev => {
        const next = new Set(prev);
        next.delete(productId);
        return next;
      });
      setWishlistItems(prev => prev.filter(i => i.productId !== productId));

      await removeFromWishlistApi(productId);
      toast.success('Removed from wishlist');
      await fetchWishlist();
    } catch (err) {
      toast.error('Failed to remove item');
      await fetchWishlist(); // Rollback
    }
  }, [fetchWishlist]);

  // Wrap context payload securely
  const value = useMemo(() => ({
    wishlistItems,
    wishlistIds,
    loading,
    fetchWishlist,
    toggleWishlist,
    removeFromWishlist,
    isInWishlist
  }), [wishlistItems, wishlistIds, loading, fetchWishlist, toggleWishlist, removeFromWishlist, isInWishlist]);

  return (
    <WishlistContext.Provider value={value}>
      {children}
    </WishlistContext.Provider>
  );
}

export const useWishlist = () => {
  const ctx = useContext(WishlistContext);
  return ctx || { 
    wishlistItems: [], 
    wishlistIds: new Set(), 
    loading: false, 
    toggleWishlist: () => {}, 
    removeFromWishlist: () => {}, 
    isInWishlist: () => false 
  };
};
