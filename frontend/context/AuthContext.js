'use client';

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { 
  login as loginApi, 
  register as registerApi, 
  getMe, 
  sendOTP as sendOTPApi, 
  verifyOTP as verifyOTPApi 
} from '@/services/api/auth.api';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    if (typeof window !== 'undefined') {
      try {
        const storedUser = localStorage.getItem('user');
        return storedUser ? JSON.parse(storedUser) : null;
      } catch (err) {
        return null;
      }
    }
    return null;
  });
  const [loading, setLoading] = useState(true);

  // Mark loading as false once hydration/initialization is complete
  useEffect(() => {
    setLoading(false);
  }, []);

  /** Login and store token + user */
  const login = useCallback(async (email, password) => {
    const data = await loginApi({ email, password });
    if (data.success && data.data) {
      const { token, user: userData } = data.data;
      localStorage.setItem('token', token);
      localStorage.setItem('user', JSON.stringify(userData));
      setUser(userData);
      return userData;
    }
    return null;
  }, []);

  /** Register (Waiting for verification) */
  const register = useCallback(async (name, email, password, phone) => {
    const data = await registerApi({ name, email, password, phone });
    // Registration with Supabase doesn't log in immediately if verification is on
    // So we just return the success message
    return data;
  }, []);

  /** Send OTP (DEPRECATED - Removed for strict email requirement) */
  const sendOTP = useCallback(async (phone) => {
    throw new Error('Mobile login is disabled');
  }, []);

  /** Verify OTP (DEPRECATED - Removed for strict email requirement) */
  const verifyOTP = useCallback(async (phone, otp) => {
    throw new Error('Mobile login is disabled');
  }, []);

  /** Logout */
  const logout = useCallback(() => {
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    setUser(null);
    toast.success('Logged out successfully');
  }, []);

  /** Refresh user from API */
  const refreshUser = useCallback(async () => {
    try {
      const data = await getMe();
      const updated = data.data;
      setUser(updated);
      localStorage.setItem('user', JSON.stringify(updated));
      return updated;
    } catch (err) {
      logout();
    }
  }, [logout]);

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ 
      user, 
      loading, 
      isAuthenticated, 
      login, 
      register, 
      logout, 
      refreshUser,
      sendOTP,
      verifyOTP
    }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  // Return empty object instead of throwing to avoid build-time crashes during prerendering
  return ctx || { user: null, loading: true, isAuthenticated: false };
};
