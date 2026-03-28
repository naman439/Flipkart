/**
 * Cart Routes (all protected)
 * GET    /api/cart         - get cart
 * POST   /api/cart/add     - add item
 * PUT    /api/cart/update  - update quantity
 * DELETE /api/cart/remove  - remove item
 * DELETE /api/cart/clear   - clear cart
 */

const express = require('express');
const router = express.Router();
const { getCart, addToCart, updateCart, removeFromCart, clearCart } = require('../controllers/cart.controller');
const { protect } = require('../middleware/auth.middleware');

// All cart routes require authentication
router.use(protect);

router.get('/', getCart);
router.post('/add', addToCart);
router.put('/update', updateCart);
router.delete('/remove', removeFromCart);
router.delete('/clear', clearCart);

module.exports = router;
