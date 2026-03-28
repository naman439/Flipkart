/**
 * Cart Controller
 * Handles shopping cart operations (add, get, update quantity, remove)
 */

const prisma = require('../config/db');

/**
 * GET /api/cart
 * Get current user's cart with all items
 */
const getCart = async (req, res) => {
  const userId = req.user.id;

  // Find or create cart for user
  let cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: {
            select: {
              id: true, title: true, price: true, discountPrice: true,
              discountPct: true, stock: true, images: true, brand: true,
            },
          },
        },
      },
    },
  });

  if (!cart) {
    cart = await prisma.cart.create({
      data: { userId },
      include: { items: { include: { product: true } } },
    });
  }

  // Parse product images
  const items = cart.items.map((item) => ({
    ...item,
    product: { ...item.product, images: JSON.parse(item.product.images || '[]') },
  }));

  // Calculate price breakdown
  const subtotal = items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const total = items.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0);
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
  const product = await prisma.product.findUnique({ where: { id: parseInt(productId) } });
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
    where: { cartId_productId: { cartId: cart.id, productId: parseInt(productId) } },
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
    if (parseInt(quantity) > product.stock) {
      const error = new Error(`Cannot add more. Only ${product.stock} items available in stock.`);
      error.statusCode = 400;
      throw error;
    }
    cartItem = await prisma.cartItem.create({
      data: { cartId: cart.id, productId: parseInt(productId), quantity: parseInt(quantity) },
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

  if (quantity < 1) {
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
    where: { id: parseInt(cartItemId), cartId: cart.id },
    include: { product: { select: { stock: true } } },
  });

  if (!cartItem) {
    const error = new Error('Cart item not found');
    error.statusCode = 404;
    throw error;
  }

  if (parseInt(quantity) > cartItem.product.stock) {
    const error = new Error(`Cannot update quantity. Only ${cartItem.product.stock} items available in stock.`);
    error.statusCode = 400;
    throw error;
  }

  const updated = await prisma.cartItem.update({
    where: { id: parseInt(cartItemId) },
    data: { quantity: parseInt(quantity) },
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
    where: { id: parseInt(cartItemId), cartId: cart.id },
  });

  if (!cartItem) {
    const error = new Error('Cart item not found');
    error.statusCode = 404;
    throw error;
  }

  await prisma.cartItem.delete({ where: { id: parseInt(cartItemId) } });

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
