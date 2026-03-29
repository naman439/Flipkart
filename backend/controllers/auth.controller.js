/**
 * Auth Controller
 * Handles user registration and login with JWT
 * Sync'd with NEW Production UUID Schema
 */

const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const prisma = require('../config/db');
const supabase = require('../config/supabase');

/**
 * Generate JWT token for a user (Legacy - keeping for compatibility)
 */
const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRES_IN || '7d',
  });
};

/**
 * Regex patterns as per requirements
 */
const REGEX = {
  NAME: /^[A-Za-z ]{2,50}$/,
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,20}$/,
  PHONE: /^[6-9]\d{9}$/
};

/**
 * POST /api/auth/register
 * Register a new user with Supabase Auth
 */
const register = async (req, res) => {
  let { name, email, password, phone } = req.body;

  // 1. Sanitize & Validate Email
  if (!email) throw new Error('Email is required');
  email = email.trim().toLowerCase();
  
  if (!REGEX.EMAIL.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address" });
  }

  // 2. Validate Name
  if (!name || !REGEX.NAME.test(name)) {
    return res.status(400).json({ success: false, message: "Invalid name format (Alphabets only, 2-50 chars)" });
  }

  // 3. Validate Password
  if (!password || !REGEX.PASSWORD.test(password)) {
    return res.status(400).json({ success: false, message: "Password must be 8-20 characters with uppercase, lowercase, number, and special character" });
  }

  // 4. Validate Phone (Optional)
  if (phone && !REGEX.PHONE.test(phone)) {
    return res.status(400).json({ success: false, message: "Invalid Indian mobile number" });
  }

  // 5. Supabase Signup
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email,
    password,
    options: {
      data: { display_name: name }
    }
  });

  if (authError) {
    return res.status(400).json({ success: false, message: authError.message });
  }

  if (!authData.user) {
    return res.status(400).json({ success: false, message: "Registration failed. Please try again." });
  }

  // 6. Sync with Profiles table using Supabase UID
  try {
    const profile = await prisma.profile.create({
      data: {
        id: authData.user.id,
        name,
        email,
        phone: phone || null,
        // Password is NOT stored in profiles table for Supabase Auth users
      },
      select: { id: true, name: true, email: true, phone: true, createdAt: true },
    });

    res.status(201).json({
      success: true,
      message: 'Please check your email to verify your account',
      data: { user: profile }
    });
  } catch (dbErr) {
    console.error("DB Sync Error:", dbErr);
    // If profile creation fails but auth succeeded, we should ideally handle rollback or retry
    res.status(500).json({ success: false, message: "Error syncing user profile" });
  }
};

/**
 * POST /api/auth/login
 * Login with Supabase Auth (STRICT EMAIL ONLY)
 */
const login = async (req, res) => {
  let { email, password } = req.body;

  // 1. Sanitize & Validate Email
  if (!email || !email.includes('@')) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address" });
  }
  email = email.trim().toLowerCase();

  if (!REGEX.EMAIL.test(email)) {
    return res.status(400).json({ success: false, message: "Please enter a valid email address" });
  }

  // 2. Validate Password
  if (!password) {
    return res.status(400).json({ success: false, message: "Invalid email or password" });
  }

  // 3. Supabase Login
  const { data, error } = await supabase.auth.signInWithPassword({
    email,
    password,
  });

  if (error) {
    // SECURITY: Always return generic message
    return res.status(401).json({ success: false, message: "Invalid email or password" });
  }

  // 4. Check if session exists (Verification Check)
  if (!data.session) {
    return res.status(401).json({ success: false, message: "Please verify your email to log in" });
  }

  // 5. Get Profile from DB
  const profile = await prisma.profile.findUnique({ where: { id: data.user.id } });

  res.json({
    success: true,
    message: 'Login successful',
    data: {
      user: profile,
      token: data.session.access_token,
      session: data.session
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
