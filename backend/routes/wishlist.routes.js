/**
 * Wishlist Routes (all protected)
 * GET    /api/wishlist              - get wishlist
 * POST   /api/wishlist              - toggle add/remove product
 * DELETE /api/wishlist/:productId   - remove specific product
 */

const express = require('express');
const router = express.Router();
const { getWishlist, addToWishlist, removeFromWishlist } = require('../controllers/wishlist.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getWishlist);
router.post('/', addToWishlist);
router.delete('/:productId', removeFromWishlist);

module.exports = router;
