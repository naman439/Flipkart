/**
 * Wishlist Controller
 * Handles adding/removing products from wishlist
 */

const prisma = require('../config/db');

/**
 * GET /api/wishlist
 * Get current user's wishlist
 */
const getWishlist = async (req, res) => {
  const userId = req.user.id;

  const wishlist = await prisma.wishlist.findMany({
    where: { userId },
    include: {
      product: {
        select: {
          id: true, title: true, price: true, discountPrice: true,
          discountPct: true, rating: true, images: true, stock: true,
          category: { select: { name: true, slug: true } },
        },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  const parsed = wishlist.map((item) => ({
    ...item,
    product: {
      ...item.product,
      images: JSON.parse(item.product.images || '[]'),
    },
  }));

  res.json({ success: true, data: parsed });
};

/**
 * POST /api/wishlist
 * Add a product to wishlist (toggle behavior)
 */
const addToWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.body;

  if (!productId) {
    const error = new Error('Product ID is required');
    error.statusCode = 400;
    throw error;
  }

  // Check product exists
  const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  // Check if already in wishlist
  const existing = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId: parseInt(productId) } },
  });

  if (existing) {
    // Toggle: remove from wishlist
    await prisma.wishlist.delete({ where: { id: existing.id } });
    return res.json({ success: true, message: 'Removed from wishlist', inWishlist: false });
  }

  // Add to wishlist
  const item = await prisma.wishlist.create({
    data: { userId, productId: parseInt(productId) },
  });

  res.status(201).json({ success: true, message: 'Added to wishlist', inWishlist: true, data: item });
};

/**
 * DELETE /api/wishlist/:productId
 * Remove a product from wishlist
 */
const removeFromWishlist = async (req, res) => {
  const userId = req.user.id;
  const { productId } = req.params;

  const item = await prisma.wishlist.findUnique({
    where: { userId_productId: { userId, productId: parseInt(productId) } },
  });

  if (!item) {
    const error = new Error('Item not found in wishlist');
    error.statusCode = 404;
    throw error;
  }

  await prisma.wishlist.delete({ where: { id: item.id } });

  res.json({ success: true, message: 'Removed from wishlist' });
};

module.exports = { getWishlist, addToWishlist, removeFromWishlist };
