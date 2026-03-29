/**
 * Cart Controller
 * Handles shopping cart operations (add, get, update quantity, remove)
 * Sync'd with NEW Production UUID Schema
 */

const prisma = require('../config/db');

/**
 * GET /api/cart
 * Get current user's cart with all items
 */
const getCart = async (req, res) => {
  const userId = req.user.id; // This is now a UUID String from Supabase

  // Find or create cart for user
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true, title: true, price: true, discountPrice: true,
              discountPct: true, stock: true, brand: true,
              images: { orderBy: { displayOrder: 'asc' } } // New relation
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: { include: { images: true } } } } },
    });
  }

  // Simplify product images for frontend compatibility
  const items = cart.items.map((item) => ({
    ...item,
    product: { 
        ...item.product, 
        images: item.product.images.map(img => img.imageUrl) 
    },
  }));

  // Calculate price breakdown (Prisma Decimals convert to numbers automatically in JSON.stringify, 
  // but for calculation we use Number() cast)
  const subtotal = items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const total = items.reduce((sum, item) => sum + Number(item.product.discountPrice) * item.quantity, 0);
  const discount = subtotal - total;

  res.json({
    success: true,
    data: {
      id: cart.id,
      items,
      summary: {
        subtotal: Math.round(subtotal),
        discount: Math.round(discount),
        total: Math.round(total),
        itemCount: items.reduce((sum, item) => sum + item.quantity, 0),
      },
    },
  });
};

/**
 * POST /api/cart/add
 * Add a product to cart (or increase quantity if already exists)
 */
const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { productId, quantity = 1 } = req.body;

  if (!productId) {
    const error = new Error('Product ID is required');
    error.statusCode = 400;
    throw error;
  }

  // Check product exists and has stock
  const product = await prisma.product.findUnique({ where: { id: productId } });
  if (!product) {
    const error = new Error('Product not found');
    error.statusCode = 404;
    throw error;
  }
  if (product.stock < 1) {
    const error = new Error('Product is out of stock');
    error.statusCode = 400;
    throw error;
  }

  // Find or create cart
  let cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    cart = await prisma.cart.create({ data: { userId } });
  }

  // Upsert cart item (create or increment quantity)
  const existingItem = await prisma.cartItem.findUnique({
    where: { cartId_productId: { cartId: cart.id, productId: productId } },
  });

  let cartItem;
  if (existingItem) {
    const newQuantity = existingItem.quantity + parseInt(quantity);
    if (newQuantity > product.stock) {
      const error = new Error(`Cannot add more. Only ${product.stock} items available in stock.`);
      error.statusCode = 400;
      throw error;
    }
    cartItem = await prisma.cartItem.update({
      where: { id: existingItem.id },
      data: { quantity: newQuantity },
    });
  } else {
    const qtyNum = parseInt(quantity);
    if (qtyNum > product.stock) {
      const error = new Error(`Cannot add more. Only ${product.stock} items available in stock.`);
      error.statusCode = 400;
      throw error;
    }
    cartItem = await prisma.cartItem.create({
      data: { cartId: cart.id, productId: productId, quantity: qtyNum },
    });
  }

  res.status(201).json({ success: true, message: 'Item added to cart', data: cartItem });
};

/**
 * PUT /api/cart/update
 * Update quantity of a cart item
 */
const updateCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItemId, quantity } = req.body;

  if (!cartItemId || quantity === undefined) {
    const error = new Error('Cart item ID and quantity are required');
    error.statusCode = 400;
    throw error;
  }

  const qtyNum = parseInt(quantity);
  if (qtyNum < 1) {
    const error = new Error('Quantity must be at least 1');
    error.statusCode = 400;
    throw error;
  }

  // Verify item belongs to this user's cart
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cartId: cart.id },
    include: { product: { select: { stock: true } } },
  });

  if (!cartItem) {
    const error = new Error('Cart item not found');
    error.statusCode = 404;
    throw error;
  }

  if (qtyNum > cartItem.product.stock) {
    const error = new Error(`Cannot update quantity. Only ${cartItem.product.stock} items available in stock.`);
    error.statusCode = 400;
    throw error;
  }

  const updated = await prisma.cartItem.update({
    where: { id: cartItemId },
    data: { quantity: qtyNum },
  });

  res.json({ success: true, message: 'Cart updated', data: updated });
};

/**
 * DELETE /api/cart/remove
 * Remove an item from cart
 */
const removeFromCart = async (req, res) => {
  const userId = req.user.id;
  const { cartItemId } = req.body;

  if (!cartItemId) {
    const error = new Error('Cart item ID is required');
    error.statusCode = 400;
    throw error;
  }

  // Verify ownership
  const cart = await prisma.cart.findUnique({ where: { userId } });
  if (!cart) {
    const error = new Error('Cart not found');
    error.statusCode = 404;
    throw error;
  }

  const cartItem = await prisma.cartItem.findFirst({
    where: { id: cartItemId, cartId: cart.id },
  });

  if (!cartItem) {
    const error = new Error('Cart item not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.cartItem.delete({ where: { id: cartItemId } });

  res.json({ success: true, message: 'Item removed from cart' });
};

/**
 * DELETE /api/cart/clear
 * Clear all items from cart
 */
const clearCart = async (req, res) => {
  const userId = req.user.id;
  const cart = await prisma.cart.findUnique({ where: { userId } });

  if (cart) {
    await prisma.cartItem.deleteMany({ where: { cartId: cart.id } });
  }

  res.json({ success: true, message: 'Cart cleared' });
};

module.exports = { getCart, addToCart, updateCart, removeFromCart, clearCart };
