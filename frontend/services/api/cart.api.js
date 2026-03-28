import api from './axios';

export const getCart = async () => {
  const res = await api.get('/cart');
  return res.data;
};

export const addToCart = async (productId, quantity = 1) => {
  const res = await api.post('/cart/add', { productId, quantity });
  return res.data;
};

export const updateCart = async (cartItemId, quantity) => {
  const res = await api.put('/cart/update', { cartItemId, quantity });
  return res.data;
};

export const removeFromCart = async (cartItemId) => {
  const res = await api.delete('/cart/remove', { data: { cartItemId } });
  return res.data;
};

export const clearCart = async () => {
  const res = await api.delete('/cart/clear');
  return res.data;
};
