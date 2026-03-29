import api from './axios';

export const getAddresses = async () => {
  const res = await api.get('/addresses');
  return res.data;
};

export const createAddress = async (data) => {
  const res = await api.post('/addresses', data);
  return res.data;
};

export const updateAddress = async (id, data) => {
  const res = await api.put(`/addresses/${id}`, data);
  return res.data;
};

export const deleteAddress = async (id) => {
  const res = await api.delete(`/addresses/${id}`);
  return res.data;
};

export const setDefaultAddress = async (id) => {
  const res = await api.patch(`/addresses/${id}/default`);
  return res.data;
};
