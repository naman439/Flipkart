/**
 * Order Routes (all protected)
 * POST /api/orders       - place order
 * GET  /api/orders       - get user's order history
 * GET  /api/orders/:id   - get specific order
 */

const express = require('express');
const router = express.Router();
const { placeOrder, getOrders, getOrderById } = require('../controllers/order.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.post('/', placeOrder);
router.get('/', getOrders);
router.get('/:id', getOrderById);

module.exports = router;
