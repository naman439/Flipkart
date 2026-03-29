/**
 * Address Routes
 * All routes are protected — requires valid JWT
 *
 * GET    /api/addresses          - get all addresses
 * POST   /api/addresses          - create address
 * PUT    /api/addresses/:id      - update address
 * DELETE /api/addresses/:id      - delete address
 * PATCH  /api/addresses/:id/default - set as default
 */

const express = require('express');
const router = express.Router();
const {
  getAddresses,
  createAddress,
  updateAddress,
  deleteAddress,
  setDefaultAddress,
} = require('../controllers/address.controller');
const { protect } = require('../middleware/auth.middleware');

router.use(protect);

router.get('/', getAddresses);
router.post('/', createAddress);
router.put('/:id', updateAddress);
router.delete('/:id', deleteAddress);
router.patch('/:id/default', setDefaultAddress);

module.exports = router;
