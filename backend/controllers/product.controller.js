/**
 * Product Controller
 * Handles product listing, filtering, search, sorting, and detail
 * Sync'd with NEW Production UUID Schema
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
 * Query params: search, category, sort, order, page, limit, minPrice, maxPrice
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
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { name: { contains: search, mode: 'insensitive' } } }
    ];
  }

  if (category) {
    where.category = { slug: category.toLowerCase() };
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

  // Handle dynamic specification filters (Native JSONB path)
  const standardParams = ['search', 'category', 'sort', 'order', 'page', 'limit', 'minPrice', 'maxPrice', 'brand', 'minRating', 'isFeatured'];
  for (const [key, value] of Object.entries(req.query)) {
    if (!standardParams.includes(key)) {
      // It's a dynamic spec like ?Color=Red or ?RAM=8GB
      // Using Prisma's JSON path filtering for JSONB
      const values = value.split(',');
      
      const specFilter = {
        OR: values.map(val => ({
          specifications: { path: [key], equals: val }
        }))
      };
      
      if (!where.AND) where.AND = [];
      where.AND.push(specFilter);
    }
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
        images: { orderBy: { displayOrder: 'asc' } },
      },
    }),
    prisma.product.count({ where }),
  ]);

  // Map images to simple array for frontend backwards compatibility
  let simplified = products.map((p) => ({
    ...p,
    images: p.images.map(img => img.imageUrl),
    // specifications is already an object now (JSONB)
  }));

  if (!req.query.sort) {
    simplified = shuffleArray(simplified);
  }

  // No caching for filtered product lists (dynamic per user)
  res.setHeader('Cache-Control', 'public, max-age=30, stale-while-revalidate=60');
  res.json({
    success: true,
    data: simplified,
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
 * Fetch a single product by ID (UUID)
 */
const getProductById = async (req, res) => {
  const { id } = req.params;

  const product = await prisma.product.findUnique({
    where: { id }, // No more parseInt, it's a UUID string
    include: {
      category: { select: { id: true, name: true, slug: true } },
      images: { orderBy: { displayOrder: 'asc' } },
      reviews: {
        take: 10,
        orderBy: { createdAt: 'desc' },
        include: { user: { select: { name: true, avatarUrl: true } } }
      }
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
      images: product.images.map(img => img.imageUrl), // Map to simple array
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
    include: { 
        category: { select: { name: true, slug: true } },
        images: { orderBy: { displayOrder: 'asc' } }
    },
    orderBy: { rating: 'desc' },
  });

  const simplified = products.map((p) => ({
    ...p,
    images: p.images.map(img => img.imageUrl),
  }));

  // Cache featured products for 2 minutes
  res.setHeader('Cache-Control', 'public, max-age=120, stale-while-revalidate=300');
  res.json({ success: true, data: simplified });
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

  // Cache categories for 5 minutes (rarely change)
  res.setHeader('Cache-Control', 'public, max-age=300, stale-while-revalidate=600');
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

/**
 * GET /api/products/filters
 * Extract all unique brands and dynamic specifications for a given category
 */
const getDynamicFilters = async (req, res) => {
  const { category, search } = req.query;
  
  const where = {};
  if (category) {
    where.category = {
      slug: category.toLowerCase()
    };
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { name: { contains: search, mode: 'insensitive' } } }
    ];
  }

  const products = await prisma.product.findMany({
    where,
    select: { brand: true, specifications: true, discountPrice: true }
  });

  const brandsMap = {};
  const specsMap = {};
  let minPrice = Infinity;
  let maxPrice = 0;

  products.forEach(p => {
    if (p.brand) {
      brandsMap[p.brand] = (brandsMap[p.brand] || 0) + 1;
    }
    if (p.specifications) {
      // Specifications is already an object now (JSONB)
      for (const [key, value] of Object.entries(p.specifications)) {
        if (!specsMap[key]) specsMap[key] = {};
        specsMap[key][value] = (specsMap[key][value] || 0) + 1;
      }
    }
    if (p.discountPrice != null) {
      const dp = Number(p.discountPrice);
      if (dp < minPrice) minPrice = dp;
      if (dp > maxPrice) maxPrice = dp;
    }
  });

  if (minPrice === Infinity) {
    minPrice = 0;
    maxPrice = 100000;
  }

  res.json({
    success: true,
    data: {
      brands: brandsMap,
      specifications: specsMap,
      minPrice,
      maxPrice
    }
  });
};

/**
 * GET /api/products/home-layout
 * Fetch 10 categories and top 8 products for each
 */
const getHomeLayout = async (req, res) => {
  // Single query: fetch categories with their top-rated products + images
  const categories = await prisma.category.findMany({
    orderBy: { name: 'asc' },
    select: {
      id: true,
      name: true,
      slug: true,
      products: {
        take: 8,
        orderBy: { rating: 'desc' },
        include: { images: { orderBy: { displayOrder: 'asc' } } }
      }
    }
  });

  const layout = categories.map(cat => ({
    categoryName: cat.name,
    slug: cat.slug,
    products: cat.products.map(p => ({
      ...p,
      images: p.images.map(img => img.imageUrl)
    }))
  }));

  // Cache home layout for 60 seconds
  res.setHeader('Cache-Control', 'public, max-age=60, stale-while-revalidate=120');
  res.json({ success: true, data: layout });
};

module.exports = {
  getProducts,
  getProductById,
  getFeaturedProducts,
  getHomeLayout,
  getCategories,
  getBrands,
  getDynamicFilters
};