/**
 * Utility functions for formatting, helpers, etc.
 */

/** Format price to Indian Rupee format */
export const formatPrice = (price) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    maximumFractionDigits: 0,
  }).format(price);
};

/** Calculate discount percentage */
export const calcDiscount = (original, discounted) => {
  return Math.round(((original - discounted) / original) * 100);
};

/** Truncate string to a max length */
export const truncate = (str, max = 60) => {
  if (!str) return '';
  return str.length > max ? str.substring(0, max) + '...' : str;
};

/** Get error message from axios error */
export const getErrorMessage = (err) => {
  return err?.response?.data?.message || err?.message || 'Something went wrong';
};

/** Star rating array helper */
export const getStars = (rating) => {
  const full = Math.floor(rating);
  const half = rating % 1 >= 0.5 ? 1 : 0;
  const empty = 5 - full - half;
  return { full, half, empty };
};
