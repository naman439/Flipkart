/**
 * Auth Middleware
 * Verifies JWT token for protected routes
 */

const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    const error = new Error('Not authorized, no token provided');
    error.statusCode = 401;
    return next(error);
  }

  // Verify token
  const decoded = jwt.verify(token, process.env.JWT_SECRET);

  // Fetch user from database
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
    select: { id: true, name: true, email: true },
  });

  if (!user) {
    const error = new Error('User not found');
    error.statusCode = 401;
    return next(error);
  }

  // Attach user to request
  req.user = user;
  next();
};

module.exports = { protect };
