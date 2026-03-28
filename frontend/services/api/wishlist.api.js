import api from './axios';

export const getWishlist = async () => {
  const res = await api.get('/wishlist');
  return res.data;
};

export const toggleWishlist = async (productId) => {
  const res = await api.post('/wishlist', { productId });
  return res.data;
};

export const removeFromWishlist = async (productId) => {
  const res = await api.delete(`/wishlist/${productId}`);
  return res.data;
};
