import api from './axios';

/** Register a new user */
export const register = async (data) => {
  const res = await api.post('/auth/register', data);
  return res.data;
};

/** Login with email/password */
export const login = async (data) => {
  const res = await api.post('/auth/login', data);
  return res.data;
};

/** Get current user profile */
export const getMe = async () => {
  const res = await api.get('/auth/me');
  return res.data;
};

/** Update user profile */
export const updateProfile = async (data) => {
  const res = await api.put('/auth/profile', data);
  return res.data;
};
