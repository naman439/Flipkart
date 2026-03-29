/**
 * Auth Middleware
 * Verifies JWT token for protected routes
 * Sync'd with NEW Production UUID Schema
 */

const prisma = require('../config/db');
const supabase = require('../config/supabase');

const protect = async (req, res, next) => {
  let token;

  // Extract token from Authorization header
  if (req.headers.authorization && req.headers.authorization.startsWith('Bearer ')) {
    token = req.headers.authorization.split(' ')[1];
  }

  if (!token) {
    return res.status(401).json({ success: false, message: 'Not authorized, no token provided' });
  }

  try {
    // 1. Verify token with Supabase
    const { data: { user }, error } = await supabase.auth.getUser(token);

    if (error || !user) {
      return res.status(401).json({ success: false, message: 'Authorization failed or session expired' });
    }

    // 2. Fetch PROFILE from database using the Supabase UUID
    const profile = await prisma.profile.findUnique({
      where: { id: user.id },
      select: { id: true, name: true, email: true },
    });

    if (!profile) {
      return res.status(401).json({ success: false, message: 'User profile not found in database' });
    }

    // 3. Attach profile to request
    req.user = profile;
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ success: false, message: 'Authorization failed' });
  }
};

module.exports = { protect };
