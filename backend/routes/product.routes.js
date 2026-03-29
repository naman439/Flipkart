/**
 * Product Routes
 * GET /api/products          - list with filters/search/sort/pagination
 * GET /api/products/featured - featured products
 * GET /api/products/categories - all categories
 * GET /api/products/:id      - single product
 */

const express = require('express');
const router = express.Router();
const {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getCategories,
  getBrands,
  getDynamicFilters,
  getHomeLayout,
} = require('../controllers/product.controller');

const { createReview, getProductReviews } = require('../controllers/review.controller');
const { protect } = require('../middleware/auth.middleware');

router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/featured', getFeaturedProducts);
router.get('/filters', getDynamicFilters);

// Category Home Layout (Must be above /:id)
router.get('/home-layout', getHomeLayout);

router.get('/', getProducts);
router.get('/:id', getProductById);

// Reviews
router.post('/:id/review', protect, createReview);
router.get('/:id/reviews', getProductReviews);

module.exports = router;
