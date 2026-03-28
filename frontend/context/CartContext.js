'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { getCart as getCartApi, addToCart as addToCartApi, updateCart as updateCartApi, removeFromCart as removeFromCartApi, clearCart as clearCartApi } from '@/services/api/cart.api';
import { useAuth } from './AuthContext';
import toast from 'react-hot-toast';

const CartContext = createContext(null);

export function CartProvider({ children }) {
  const { isAuthenticated } = useAuth();
  const [cart, setCart] = useState({ items: [], summary: { subtotal: 0, discount: 0, total: 0, itemCount: 0 } });
  const [loading, setLoading] = useState(false);

  /** Fetch cart from API */
  const fetchCart = useCallback(async () => {
    if (!isAuthenticated) {
      setCart({ items: [], summary: { subtotal: 0, discount: 0, total: 0, itemCount: 0 } });
      return;
    }
    try {
      setLoading(true);
      const data = await getCartApi();
      setCart(data.data);
    } catch (err) {
      console.error('Failed to fetch cart', err);
    } finally {
      setLoading(false);
    }
  }, [isAuthenticated]);

  useEffect(() => {
    fetchCart();
  }, [fetchCart]);

  /** Add item to cart */
  const addItem = useCallback(async (productId, quantity = 1) => {
    if (!isAuthenticated) {
      toast.error('Please login to add items to cart');
      return false;
    }
    try {
      await addToCartApi(productId, quantity);
      await fetchCart();
      toast.success('Added to cart!');
      return true;
    } catch (err) {
      toast.error(err?.response?.data?.message || 'Failed to add to cart');
      return false;
    }
  }, [isAuthenticated, fetchCart]);

  /** Update cart item quantity */
  const updateItem = useCallback(async (cartItemId, quantity) => {
    try {
      await updateCartApi(cartItemId, quantity);
      await fetchCart();
    } catch (err) {
      toast.error('Failed to update cart');
    }
  }, [fetchCart]);

  /** Remove cart item */
  const removeItem = useCallback(async (cartItemId) => {
    try {
      await removeFromCartApi(cartItemId);
      await fetchCart();
      toast.success('Item removed');
    } catch (err) {
      toast.error('Failed to remove item');
    }
  }, [fetchCart]);

  /** Clear entire cart */
  const clearCartItems = useCallback(async () => {
    try {
      await clearCartApi();
      setCart({ items: [], summary: { subtotal: 0, discount: 0, total: 0, itemCount: 0 } });
    } catch (err) {
      console.error(err);
    }
  }, []);

  return (
    <CartContext.Provider value={{ cart, loading, fetchCart, addItem, updateItem, removeItem, clearCartItems }}>
      {children}
    </CartContext.Provider>
  );
}

export const useCart = () => {
  const ctx = useContext(CartContext);
  return ctx || { cart: { items: [], summary: {} }, loading: false };
};
