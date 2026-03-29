/**
 * Review Controller
 * Handles submitting and fetching product reviews
 */

const prisma = require('../config/db');

/**
 * POST /api/products/:id/review
 * Create a new review and update product average rating
 */
const createReview = async (req, res) => {
  const { id: productId } = req.params;
  const { rating, comment } = req.body;
  const userId = req.user.id; // From protect middleware

  if (!rating || rating < 1 || rating > 5) {
    const error = new Error('Please provide a rating between 1 and 5');
    error.statusCode = 400;
    throw error;
  }

  // Use a transaction to ensure atomic update
  const result = await prisma.$transaction(async (tx) => {
    // 1. Check if product exists
    const product = await tx.product.findUnique({ where: { id: productId } });
    if (!product) {
      throw new Error('Product not found');
    }

    // 2. Check if user already reviewed this product
    const existingReview = await tx.review.findUnique({
      where: { userId_productId: { userId, productId } }
    });

    if (existingReview) {
      throw new Error('You have already reviewed this product');
    }

    // 3. Create the review
    const review = await tx.review.create({
      data: {
        productId,
        userId,
        rating: parseInt(rating),
        comment
      }
    });

    // 4. Recalculate average rating and count
    const reviews = await tx.review.aggregate({
      where: { productId },
      _avg: { rating: true },
      _count: { rating: true }
    });

    // 5. Update the product
    await tx.product.update({
      where: { id: productId },
      data: {
        rating: reviews._avg.rating || 0,
        reviewCount: reviews._count.rating || 0
      }
    });

    return review;
  });

  res.status(201).json({
    success: true,
    message: 'Review submitted successfully',
    data: result
  });
};

/**
 * GET /api/products/:id/reviews
 * Fetch all reviews for a product
 */
const getProductReviews = async (req, res) => {
  const { id: productId } = req.params;

  const reviews = await prisma.review.findMany({
    where: { productId },
    include: {
      user: { select: { name: true, avatarUrl: true } }
    },
    orderBy: { createdAt: 'desc' }
  });

  res.json({
    success: true,
    data: reviews
  });
};

module.exports = { createReview, getProductReviews };
