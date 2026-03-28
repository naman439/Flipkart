/**
 * Product Controller
 * Handles product listing, filtering, search, sorting, and detail
 */

const prisma = require('../config/db');
const { fetchLiveProductDetails } = require('../services/flipkartScraper');

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
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { is: { name: { contains: search, mode: 'insensitive' } } } }
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

  // Handle dynamic specification filters (anything not standard)
  const standardParams = ['search', 'category', 'sort', 'order', 'page', 'limit', 'minPrice', 'maxPrice', 'brand', 'minRating', 'isFeatured'];
  for (const [key, value] of Object.entries(req.query)) {
    if (!standardParams.includes(key)) {
      // It's a dynamic spec like ?Color=Red or ?RAM=8GB
      // Since specs are stored as JSON string, we match substring. 
      // e.g., "Color":"Red"
      
      const specArr = [];
      const values = value.split(','); // handle comma separated values
      for (const val of values) {
        specArr.push({ specifications: { contains: `"${key}":"${val}"` } });
      }
      
      if (!where.AND) where.AND = [];
      where.AND.push({ OR: specArr });
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

  let parsedImages = JSON.parse(product.images || '[]');
  let parsedSpecs = product.specifications ? JSON.parse(product.specifications) : {};

  // Check if we need to fetch live details
  // Condition: Dummy specs or very few images
  const isDummyData = 
    parsedImages.length <= 1 || 
    Object.keys(parsedSpecs).length <= 2 || 
    (parsedSpecs.Authenticity === 'Verified');

  if (isDummyData) {
    try {
      const liveData = await fetchLiveProductDetails(product.brand ? `${product.brand} ${product.title}` : product.title);
      
      if (liveData.success) {
        // Update DB
        product = await prisma.product.update({
          where: { id: parseInt(id) },
          data: {
            images: JSON.stringify(liveData.data.images.length > 0 ? liveData.data.images : parsedImages),
            specifications: JSON.stringify(liveData.data.specifications),
            description: liveData.data.description || product.description
          },
          include: {
            category: { select: { id: true, name: true, slug: true } },
          },
        });
        
        parsedImages = JSON.parse(product.images || '[]');
        parsedSpecs = product.specifications ? JSON.parse(product.specifications) : {};
      }
    } catch (err) {
      console.error('Error fetching live data:', err.message);
    }
  }

  res.json({
    success: true,
    data: {
      ...product,
      images: parsedImages,
      specifications: parsedSpecs,
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

/**
 * GET /api/products/filters
 * Extract all unique brands and dynamic specifications for a given category
 */
const getDynamicFilters = async (req, res) => {
  const { category, search } = req.query;
  
  const where = {};
  if (category) {
    where.category = { slug: category.toLowerCase() };
  }
  
  if (search) {
    where.OR = [
      { title: { contains: search, mode: 'insensitive' } },
      { description: { contains: search, mode: 'insensitive' } },
      { category: { is: { name: { contains: search, mode: 'insensitive' } } } }
    ];
  }

  // Only grab what we need to build filters
  const products = await prisma.product.findMany({
    where,
    select: { brand: true, specifications: true }
  });

  const brandsMap = {};
  const specsMap = {};

  products.forEach(p => {
    if (p.brand) {
      brandsMap[p.brand] = (brandsMap[p.brand] || 0) + 1;
    }
    if (p.specifications) {
      try {
        const specs = JSON.parse(p.specifications);
        for (const [key, value] of Object.entries(specs)) {
          if (!specsMap[key]) specsMap[key] = {};
          specsMap[key][value] = (specsMap[key][value] || 0) + 1;
        }
      } catch (e) {}
    }
  });

  res.json({
    success: true,
    data: {
      brands: brandsMap,
      specifications: specsMap
    }
  });
};

module.exports = { getProducts, getProductById, getFeaturedProducts, getCategories, getBrands, getDynamicFilters };
