/**
 * Auth Controller
 * Handles user registration and login with JWT
 * Sync'd with NEW Production UUID Schema
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');

/**
 * Generate JWT token for a user
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * POST /api/auth/register
 * Register a new user profile
 */
const register = async (req, res) => {
  const { name, email, password, phone } = req.body;

  // Validate required fields
  if (!name || !email || !password) {
    const error = new Error('Name, email, and password are required');
    error.statusCode = 400;
    throw error;
  }

  if (password.length < 6) {
    const error = new Error('Password must be at least 6 characters');
    error.statusCode = 400;
    throw error;
  }

  // Check if profile already exists
  const existingProfile = await prisma.profile.findUnique({ where: { email } });
  if (existingProfile) {
    const error = new Error('User with this email already exists');
    error.statusCode = 409;
    throw error;
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(password, 12);

  // Create Profile
  const profile = await prisma.profile.create({
    data: { name, email, password: hashedPassword, phone },
    select: { id: true, name: true, email: true, phone: true, createdAt: true },
  });

  const token = generateToken(profile.id);

  res.status(201).json({
    success: true,
    message: 'User registered successfully',
    data: { user: profile, token },
  });
};

/**
 * POST /api/auth/login
 * Login an existing user
 */
const login = async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    const error = new Error('Email and password are required');
    error.statusCode = 400;
    throw error;
  }

  // Find profile
  const profile = await prisma.profile.findUnique({ where: { email } });
  if (!profile) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  // Compare password
  const isMatch = await bcrypt.compare(password, profile.password);
  if (!isMatch) {
    const error = new Error('Invalid email or password');
    error.statusCode = 401;
    throw error;
  }

  const token = generateToken(profile.id);

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: { id: profile.id, name: profile.name, email: profile.email, phone: profile.phone },
      token,
    },
  });
};

/**
 * GET /api/auth/me
 * Get current logged-in user profile
 */
const getMe = async (req, res) => {
  const profile = await prisma.profile.findUnique({
    where: { id: req.user.id },
    select: { id: true, name: true, email: true, phone: true, address: true, createdAt: true },
  });

  res.json({ success: true, data: profile });
};

/**
 * PUT /api/auth/profile
 * Update user profile
 */
const updateProfile = async (req, res) => {
  const { name, phone, address } = req.body;

  const profile = await prisma.profile.update({
    where: { id: req.user.id },
    data: { name, phone, address },
    select: { id: true, name: true, email: true, phone: true, address: true },
  });

  res.json({ success: true, message: 'Profile updated', data: profile });
};

module.exports = { register, login, getMe, updateProfile };
