/**
 * Product Controller
 * Handles product listing, filtering, search, sorting, and detail
 */

const prisma = require('../config/db');

// Helper to shuffle an array
const shuffleArray = (array) => {
  const newArr = [...array];
  for (let i = newArr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArr[i], newArr[j]] = [newArr[j], newArr[i]];
  }
  return newArr;
};

/**
 * GET /api/products
 * Fetch products with optional filtering, search, sorting, pagination
 * Query params: search, category, sort, page, limit, minPrice, maxPrice
 */
const getProducts = async (req, res) => {
  const {
    search = '',
    category = '',
    sort = 'createdAt',
    order = 'desc',
    page = 1,
    limit = 12,
    minPrice,
    maxPrice,
    brand,
    minRating,
    isFeatured,
  } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  // Build WHERE clause
  const where = {};

  if (search) {
    where.OR = [
      { title: { contains: search } },
      { description: { contains: search } },
      { category: { is: { name: { contains: search } } } }
    ];
  }

  if (category) {
    where.category = { slug: category };
  }

  if (isFeatured === 'true' || isFeatured === true) {
    where.isFeatured = true;
  }

  if (minPrice || maxPrice) {
    where.discountPrice = {};
    if (minPrice) where.discountPrice.gte = parseFloat(minPrice);
    if (maxPrice) where.discountPrice.lte = parseFloat(maxPrice);
  }

  if (brand) {
    const brandsArray = brand.split(',');
    where.brand = { in: brandsArray };
  }

  if (minRating) {
    where.rating = { gte: parseFloat(minRating) };
  }

  // Build ORDER BY
  const validSortFields = ['price', 'discountPrice', 'rating', 'createdAt', 'title'];
  const sortField = validSortFields.includes(sort) ? sort : 'createdAt';
  const sortOrder = order === 'asc' ? 'asc' : 'desc';

  const orderBy = { [sortField]: sortOrder };

  // Fetch products + total count
  const [products, total] = await Promise.all([
    prisma.product.findMany({
      where,
      orderBy,
      skip,
      take: limitNum,
      include: {
        category: { select: { id: true, name: true, slug: true } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  // Parse JSON fields and shuffle if no specific sort is applied
  let parsed = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    specifications: p.specifications ? JSON.parse(p.specifications) : {},
  }));

  if (!req.query.sort) {
    parsed = shuffleArray(parsed);
  }

  res.json({
    success: true,
    data: parsed,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
      hasMore: pageNum * limitNum < total,
    },
  });
};

/**
 * GET /api/products/:id
 * Fetch a single product by ID
 */
const getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id: parseInt(id) },
    include: {
      category: { select: { id: true, name: true, slug: true } },
    },
  });

  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }

  res.json({
    success: true,
    data: {
      ...product,
      images: JSON.parse(product.images || '[]'),
      specifications: product.specifications ? JSON.parse(product.specifications) : {},
    },
  });
};

/**
 * GET /api/products/featured
 * Fetch featured products for home page banner
 */
const getFeaturedProducts = async (req, res) => {
  const products = await prisma.product.findMany({
    where: { isFeatured: true },
    take: 8,
    include: { category: { select: { name: true, slug: true } } },
    orderBy: { rating: 'desc' },
  });

  const parsed = products.map((p) => ({
    ...p,
    images: JSON.parse(p.images || '[]'),
    specifications: p.specifications ? JSON.parse(p.specifications) : {},
  }));

  res.json({ success: true, data: parsed });
};

/**
 * GET /api/categories
 * Fetch all categories
 */
const getCategories = async (req, res) => {
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    include: { _count: { select: { products: true } } },
  });

  res.json({ success: true, data: categories });
};

/**
 * GET /api/products/brands
 * Fetch all unique brands
 */
const getBrands = async (req, res) => {
  const products = await prisma.product.findMany({
    select: { brand: true },
    distinct: ['brand'],
    orderBy: { brand: 'asc' },
  });

  const brands = products.map((p) => p.brand).filter(Boolean);
  res.json({ success: true, data: brands });
};

module.exports = { getProducts, getProductById, getFeaturedProducts, getCategories, getBrands };
