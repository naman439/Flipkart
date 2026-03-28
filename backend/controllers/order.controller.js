/**
 * Order Controller
 * Handles order placement, retrieval, and email notifications
 */

const prisma = require('../config/db');
const { sendOrderConfirmationEmail } = require('../services/email.service');

/**
 * POST /api/orders
 * Place a new order from cart items
 */
const placeOrder = async (req, res) => {
  const userId = req.user.id;
  const {
    shippingName,
    shippingPhone,
    shippingAddress,
    shippingCity,
    shippingState,
    shippingZip,
    paymentMethod = 'COD',
  } = req.body;

  // Validate shipping fields
  if (!shippingName || !shippingPhone || !shippingAddress || !shippingCity || !shippingState || !shippingZip) {
    const error = new Error('All shipping fields are required');
    error.statusCode = 400;
    throw error;
  }

  // Fetch user's cart
  const cart = await prisma.cart.findUnique({
    where: { userId },
    include: {
      items: {
        include: {
          product: { select: { id: true, title: true, discountPrice: true, price: true, stock: true } },
        },
      },
    },
  });

  if (!cart || cart.items.length === 0) {
    const error = new Error('Cart is empty. Please add items before placing an order');
    error.statusCode = 400;
    throw error;
  }

  // Check stock for all items
  for (const item of cart.items) {
    if (item.quantity > item.product.stock) {
      const error = new Error(`Insufficient stock for "${item.product.title}"`);
      error.statusCode = 400;
      throw error;
    }
  }

  // Calculate totals
  const totalAmount = cart.items.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
  const finalAmount = cart.items.reduce((sum, item) => sum + item.product.discountPrice * item.quantity, 0);
  const discountAmount = totalAmount - finalAmount;

  // Create order with items in a transaction
  const order = await prisma.$transaction(async (tx) => {
    // Create the order
    const newOrder = await tx.order.create({
      data: {
        userId,
        totalAmount: Math.round(totalAmount),
        discountAmount: Math.round(discountAmount),
        finalAmount: Math.round(finalAmount),
        shippingName,
        shippingPhone,
        shippingAddress,
        shippingCity,
        shippingState,
        shippingZip,
        paymentMethod,
        status: 'CONFIRMED',
        items: {
          create: cart.items.map((item) => ({
            productId: item.productId,
            quantity: item.quantity,
            price: item.product.discountPrice,
            title: item.product.title,
          })),
        },
      },
      include: { items: true },
    });

    // Decrement stock for each product
    for (const item of cart.items) {
      await tx.product.update({
        where: { id: item.productId },
        data: { stock: { decrement: item.quantity } },
      });
    }

    // Clear the cart
    await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

    return newOrder;
  });

  // Send email notification (fire-and-forget, don't block response)
  const user = await prisma.user.findUnique({ where: { id: userId }, select: { email: true, name: true } });
  sendOrderConfirmationEmail(user.email, user.name, order).catch(console.error);

  res.status(201).json({
    success: true,
    message: 'Order placed successfully!',
    data: {
      orderId: order.id,
      status: order.status,
      finalAmount: order.finalAmount,
      itemCount: order.items.length,
    },
  });
};

/**
 * GET /api/orders
 * Get all orders for the logged-in user
 */
const getOrders = async (req, res) => {
  const userId = req.user.id;
  const { page = 1, limit = 10 } = req.query;

  const pageNum = parseInt(page);
  const limitNum = parseInt(limit);
  const skip = (pageNum - 1) * limitNum;

  const [orders, total] = await Promise.all([
    prisma.order.findMany({
      where: { userId },
      orderBy: { createdAt: 'desc' },
      skip,
      take: limitNum,
      include: {
        items: {
          include: {
            product: { select: { id: true, images: true } },
          },
        },
      },
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  // Parse product images
  const parsed = orders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      product: item.product
        ? { ...item.product, images: JSON.parse(item.product.images || '[]') }
        : null,
    })),
  }));

  res.json({
    success: true,
    data: parsed,
    pagination: {
      total,
      page: pageNum,
      limit: limitNum,
      totalPages: Math.ceil(total / limitNum),
    },
  });
};

/**
 * GET /api/orders/:id
 * Get a specific order by ID
 */
const getOrderById = async (req, res) => {
  const userId = req.user.id;
  const { id } = req.params;

  const order = await prisma.order.findFirst({
    where: { id: parseInt(id), userId },
    include: {
      items: {
        include: {
          product: { select: { id: true, images: true, brand: true } },
        },
      },
    },
  });

  if (!order) {
    const error = new Error('Order not found');
    error.statusCode = 404;
    throw error;
  }

  const parsed = {
    ...order,
    items: order.items.map((item) => ({
      ...item,
      product: item.product
        ? { ...item.product, images: JSON.parse(item.product.images || '[]') }
        : null,
    })),
  };

  res.json({ success: true, data: parsed });
};

module.exports = { placeOrder, getOrders, getOrderById };
