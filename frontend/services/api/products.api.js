import api from './axios';

/** Fetch products with optional filters */
export const getProducts = async (params = {}) => {
  const res = await api.get('/products', { params });
  return res.data;
};

/** Fetch a single product by ID */
export const getProductById = async (id) => {
  const res = await api.get(`/products/${id}`);
  return res.data;
};

/** Fetch featured products */
export const getFeaturedProducts = async () => {
  const res = await api.get('/products/featured');
  return res.data;
};

/** Fetch all categories */
export const getCategories = async () => {
  const res = await api.get('/products/categories');
  return res.data;
};

/** Fetch all unique brands */
export const getBrands = async () => {
  const res = await api.get('/products/brands');
  return res.data;
};

/** Fetch dynamic specs and brands for a specific category or search */
export const getDynamicFilters = async (params = {}) => {
  const res = await api.get('/products/filters', { params });
  return res.data;
};
