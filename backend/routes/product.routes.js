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
} = require('../controllers/product.controller');

router.get('/categories', getCategories);
router.get('/brands', getBrands);
router.get('/featured', getFeaturedProducts);
router.get('/filters', getDynamicFilters);
router.get('/', getProducts);
router.get('/:id', getProductById);

module.exports = router;
