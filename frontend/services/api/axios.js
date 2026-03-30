/**
 * Axios Instance
 * Configured base axios instance with interceptors for JWT auth
 */

import axios from 'axios';

const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4050/api';

const axiosInstance = axios.create({
  baseURL: API_URL,
  headers: { 'Content-Type': 'application/json' },
  timeout: 30000, // Increased to 30s for cold starts (Render/Vercel free tier)
});

/** 
 * Utility to wait for a specific duration
 * Helpful for retrying after a delay
 */
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

// Request interceptor: attach JWT token to every request
axiosInstance.interceptors.request.use(
  (config) => {
    // Get token from localStorage (client-side only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor: handle retries and globals
axiosInstance.interceptors.response.use(
  (response) => {
    // Debug logging for developers
    console.log(`📡 API SUCCESS: ${response.config.method.toUpperCase()} ${response.config.url}`);
    return response;
  },
  async (error) => {
    const { config, message } = error;

    // Retry settings (up to 3 times, 2s delay)
    const MAX_RETRIES = 3;
    const RETRY_DELAY = 2000;

    // Add retry count if it doesn't exist
    if (!config || !config.retryCount) {
      if (config) config.retryCount = 0;
    }

    // Determine if we should retry:
    // 1. Timeout (ECONNABORTED or message contains timeout)
    // 2. Network Error (no response object)
    const isRetryable = error.code === 'ECONNABORTED' || !error.response || message.includes('timeout');

    if (isRetryable && config.retryCount < MAX_RETRIES) {
      config.retryCount += 1;
      console.warn(`🔄 Retrying API call (${config.retryCount}/${MAX_RETRIES}): ${config.url}...`);
      
      // Delay before next attempt
      await sleep(RETRY_DELAY);
      
      // Return a new call with the same config
      return axiosInstance(config);
    }

    // Handle standard global errors (after all retries fail)
    console.error(`❌ API ERROR: ${error.config?.url}`, error.response?.data || error.message);
    
    if (error.response?.status === 401) {
      if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        if (!window.location.pathname.startsWith('/auth')) {
          window.location.href = '/auth/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

/**
 * Reusable fetch utility with retry logic
 * Ensures uniform error handling and retry support across components
 */
export const fetchWithRetry = async (apiCallFn) => {
  try {
    return await apiCallFn();
  } catch (error) {
    // If all retries inside the interceptor fail, we catch it here
    console.error('Final API attempt failed after retries:', error);
    throw error;
  }
};

export default axiosInstance;
