import api from './axios';

export const placeOrder = async (orderData) => {
  const res = await api.post('/orders', orderData);
  return res.data;
};

export const getOrders = async (params = {}) => {
  const res = await api.get('/orders', { params });
  return res.data;
};

export const getOrderById = async (id) => {
  const res = await api.get(`/orders/${id}`);
  return res.data;
};
