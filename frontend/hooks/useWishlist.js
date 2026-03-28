import { useState, useCallback } from 'react';
import { toggleWishlist } from '@/services/api/wishlist.api';
import { useAuth } from '@/context/AuthContext';
import toast from 'react-hot-toast';

/**
 * useWishlist hook
 * Manages wishlist state and provides toggle functionality.
 */
export function useWishlist(initialWishlistIds = []) {
  const { isAuthenticated } = useAuth();
  const [wishlistIds, setWishlistIds] = useState(new Set(initialWishlistIds));
  const [loading, setLoading] = useState(false);

  const toggle = useCallback(async (productId) => {
    if (!isAuthenticated) {
      toast.error('Please login to add to wishlist');
      return;
    }
    try {
      setLoading(true);
      const res = await toggleWishlist(productId);
      if (res.inWishlist) {
        setWishlistIds((prev) => new Set([...prev, productId]));
        toast.success('Added to wishlist');
      } else {
        setWishlistIds((prev) => {
          const next = new Set(prev);
          next.delete(productId);
          return next;
        });
        toast.success('Removed from wishlist');
      }
    } catch (err) {
      toast.error('Failed to update wishlist');
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  const isInWishlist = useCallback((productId) => wishlistIds.has(productId), [wishlistIds]);

  return { wishlistIds, toggle, isInWishlist, loading };
}
