const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

// In-memory OTP storage for development
// Format: { '9876543210': { otp: '123456', expiresAt: 16700000000 } }
const otpStore = new Map();

/**
 * Generate JWT token for a user
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * POST /api/auth/send-otp
 * Generates and stores a 6 digit OTP for the given phone number
 */
const sendOTP = async (req, res) => {
  const { phone } = req.body;
  if (!phone || phone.length < 10) {
    const error = new Error('A valid 10-digit mobile number is required');
    error.statusCode = 400;
    throw error;
  }

  // Generate 6 digit random number
  const otp = Math.floor(100000 + Math.random() * 900000).toString();
  const expiresAt = Date.now() + 5 * 60 * 1000; // 5 minutes valid

  otpStore.set(phone, { otp, expiresAt });

  // MOCK SMS SENDING by logging to terminal
  console.log(`\n========================================`);
  console.log(`📞 MOCK SMS to ${phone}`);
  console.log(`🔐 OTP CODE: ${otp}`);
  console.log(`========================================\n`);

  res.json({
    success: true,
    message: 'OTP sent successfully',
    otp: process.env.NODE_ENV === 'development' ? otp : undefined
  });
};

/**
 * POST /api/auth/verify-otp
 * Verifies OTP, logs in existing user, or creates a new one
 */
const verifyOTP = async (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    const error = new Error('Phone and OTP are required');
    error.statusCode = 400;
    throw error;
  }

  const storedData = otpStore.get(phone);

  if (!storedData) {
    const error = new Error('Please request a new OTP');
    error.statusCode = 400;
    throw error;
  }

  if (Date.now() > storedData.expiresAt) {
    otpStore.delete(phone);
    const error = new Error('OTP has expired');
    error.statusCode = 400;
    throw error;
  }

  if (storedData.otp !== otp.toString()) {
    const error = new Error('Invalid OTP');
    error.statusCode = 401;
    throw error;
  }

  // OTP verified! Clean up.
  otpStore.delete(phone);

  // Check if user already exists
  let profile = await prisma.profile.findUnique({ where: { phone } });

  let isNewUser = false;
  if (!profile) {
    // Auto-create a stub profile for new mobile users
    profile = await prisma.profile.create({
      data: { 
        phone,
        name: 'User', // Placeholder name
      },
      select: { id: true, name: true, phone: true, email: true, createdAt: true },
    });
    isNewUser = true;
  } else {
    profile = {
      id: profile.id,
      name: profile.name,
      phone: profile.phone,
      email: profile.email
    };
  }

  const token = generateToken(profile.id);

  res.json({
    success: true,
    message: isNewUser ? 'Account created successfully' : 'Login successful',
    data: {
      user: profile,
      token,
    },
  });
};

module.exports = { sendOTP, verifyOTP };
