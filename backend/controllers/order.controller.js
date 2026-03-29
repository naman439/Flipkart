/**
 * Order Controller
 * Handles order placement, retrieval, and email notifications
 * Sync'd with NEW Production UUID Schema
 */

const prisma = require('../config/db');
const { sendOrderConfirmationEmail } = require('../services/email.service');

/**
 * POST /api/orders
 * Place a new order from cart items
 */
const placeOrder = async (req, res) => {
  const userId = req.user.id;
  const { addressId, paymentMethod = 'COD' } = req.body;

  // Validate address
  if (!addressId) {
    const error = new Error('Please select a delivery address');
    error.statusCode = 400;
    throw error;
  }

  // Fetch and validate address ownership
  const address = await prisma.address.findFirst({
    where: { id: addressId, userId },
  });

  if (!address) {
    const error = new Error('Address not found or does not belong to you');
    error.statusCode = 400;
    throw error;
  }

  // Snapshot shipping info from address (preserves history even if address is later changed/deleted)
  const shippingName    = address.fullName;
  const shippingPhone   = address.phone;
  const shippingAddress = address.addressLine1 + (address.addressLine2 ? ', ' + address.addressLine2 : '');
  const shippingCity    = address.city;
  const shippingState   = address.state;
  const shippingZip     = address.postalCode;

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

  // Calculate totals (Decimal math handled by prisma as Decimal.js, using Number for intermediate sums)
  const totalAmount = cart.items.reduce((sum, item) => sum + Number(item.product.price) * item.quantity, 0);
  const finalAmount = cart.items.reduce((sum, item) => sum + Number(item.product.discountPrice) * item.quantity, 0);
  const discountAmount = totalAmount - finalAmount;

  try {
    // Create order with items in a transaction
    const order = await prisma.$transaction(async (tx) => {
      // 1. Decrement stock atomically
      for (const item of cart.items) {
        const updateResult = await tx.product.updateMany({
          where: { 
            id: item.productId,
            stock: { gte: item.quantity } 
          },
          data: { stock: { decrement: item.quantity } },
        });

        if (updateResult.count === 0) {
          throw new Error(`Insufficient stock for "${item.product.title}".`);
        }
      }

      // 2. Create the order
      const newOrder = await tx.order.create({
        data: {
          userId,
          totalAmount: totalAmount,
          discountAmount: discountAmount,
          finalAmount: finalAmount,
          shippingName,
          shippingPhone,
          shippingAddress,
          shippingCity,
          shippingState,
          shippingZip,
          paymentMethod,
          status: 'PLACED',
          items: {
            create: cart.items.map((item) => ({
              productId: item.productId,
              quantity: item.quantity,
              priceAtPurchase: item.product.discountPrice,
            })),
          },
        },
        include: { items: true },
      });

      // 3. Clear the cart
      await tx.cartItem.deleteMany({ where: { cartId: cart.id } });

      return newOrder;
    });

    // Send email notification (Profile holds the user name now)
    const profile = await prisma.profile.findUnique({ where: { id: userId }, select: { email: true, name: true } });
    if (profile && profile.email) {
      sendOrderConfirmationEmail(profile.email, profile.name, order).catch(console.error);
    }

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
  } catch (error) {
    if (error.message.includes('Insufficient stock')) {
      error.statusCode = 400;
    }
    throw error;
  }
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
            product: { 
                select: { 
                    id: true, 
                    images: { orderBy: { displayOrder: 'asc' }, take: 1 } 
                } 
            },
          },
        },
      },
    }),
    prisma.order.count({ where: { userId } }),
  ]);

  // Simplify product images
  const parsed = orders.map((order) => ({
    ...order,
    items: order.items.map((item) => ({
      ...item,
      product: item.product
        ? { 
            ...item.product, 
            thumbnail: item.product.images[0]?.imageUrl || null 
          }
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
    where: { id, userId }, // UUID string
    include: {
      items: {
        include: {
          product: { 
              select: { 
                  id: true, 
                  brand: true,
                  images: { orderBy: { displayOrder: 'asc' } } 
              } 
          },
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
        ? { 
            ...item.product, 
            images: item.product.images.map(img => img.imageUrl) 
          }
        : null,
    })),
  };

  res.json({ success: true, data: parsed });
};

module.exports = { placeOrder, getOrders, getOrderById };
