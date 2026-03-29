/**
 * Auth Middleware
 * Verifies JWT token for protected routes
 * Sync'd with NEW Production UUID Schema
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

  try {
    // Verify token
    const decoded = jwt.verify(token, process.env.JWT_SECRET);

    // Fetch PROFILE from database (User model was renamed to Profile)
    const profile = await prisma.profile.findUnique({
      where: { id: decoded.id }, // id is now a UUID String
      select: { id: true, name: true, email: true },
    });

    if (!profile) {
      const error = new Error('User profile not found');
      error.statusCode = 401;
      return next(error);
    }

    // Attach profile to request as user for backward compatibility
    req.user = profile;
    next();
  } catch (err) {
    const error = new Error('Authorization failed');
    error.statusCode = 401;
    return next(error);
  }
};

module.exports = { protect };
