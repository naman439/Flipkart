/**
 * Address Controller
 * Full CRUD for user saved addresses
 * Production-grade: ownership validation, default address management
 */

const prisma = require('../config/db');

/**
 * GET /api/addresses
 * Get all addresses for the logged-in user
 */
const getAddresses = async (req, res) => {
  const userId = req.user.id;

  const addresses = await prisma.address.findMany({
    where: { userId },
    orderBy: [
      { isDefault: 'desc' }, // Default address first
      { createdAt: 'desc' },
    ],
  });

  res.json({ success: true, data: addresses });
};

/**
 * POST /api/addresses
 * Create a new address for the logged-in user
 */
const createAddress = async (req, res) => {
  const userId = req.user.id;
  const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country = 'India', isDefault = false } = req.body;

  // Validate required fields
  if (!fullName || !phone || !addressLine1 || !city || !state || !postalCode) {
    const error = new Error('Full name, phone, address line 1, city, state, and postal code are required');
    error.statusCode = 400;
    throw error;
  }

  // Validate phone format (basic)
  if (!/^\+?[\d\s\-]{10,15}$/.test(phone)) {
    const error = new Error('Please enter a valid phone number');
    error.statusCode = 400;
    throw error;
  }

  // If this is set as default, unset all existing defaults for this user
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId },
      data: { isDefault: false },
    });
  }

  const address = await prisma.address.create({
    data: {
      userId,
      fullName,
      phone,
      addressLine1,
      addressLine2,
      city,
      state,
      postalCode,
      country,
      isDefault,
    },
  });

  res.status(201).json({ success: true, message: 'Address saved', data: address });
};

/**
 * PUT /api/addresses/:id
 * Update an existing address (must belong to user)
 */
const updateAddress = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;
  const { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault } = req.body;

  // Verify ownership
  const existing = await prisma.address.findFirst({ where: { id, userId } });
  if (!existing) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  // If setting as default, unset others
  if (isDefault) {
    await prisma.address.updateMany({
      where: { userId, id: { not: id } },
      data: { isDefault: false },
    });
  }

  const updated = await prisma.address.update({
    where: { id },
    data: { fullName, phone, addressLine1, addressLine2, city, state, postalCode, country, isDefault },
  });

  res.json({ success: true, message: 'Address updated', data: updated });
};

/**
 * DELETE /api/addresses/:id
 * Delete an address (must belong to user)
 */
const deleteAddress = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existing = await prisma.address.findFirst({ where: { id, userId } });
  if (!existing) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.address.delete({ where: { id } });

  res.json({ success: true, message: 'Address deleted' });
};

/**
 * PATCH /api/addresses/:id/default
 * Set an address as the default
 */
const setDefaultAddress = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const existing = await prisma.address.findFirst({ where: { id, userId } });
  if (!existing) {
    const error = new Error('Address not found');
    error.statusCode = 404;
    throw error;
  }

  // Unset all defaults, then set this one
  await prisma.address.updateMany({ where: { userId }, data: { isDefault: false } });
  await prisma.address.update({ where: { id }, data: { isDefault: true } });

  res.json({ success: true, message: 'Default address updated' });
};

module.exports = { getAddresses, createAddress, updateAddress, deleteAddress, setDefaultAddress };
