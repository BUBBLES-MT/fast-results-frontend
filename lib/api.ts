// lib/api.ts

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// ============================================================
// 🔥 BASE URL CONFIGURATION - Works everywhere!
// ============================================================

/**
 * Determines the base URL for API calls
 * - Browser: Uses relative path (Next.js rewrites handle it)
 * - Server: Uses full URL (for RSC/Server Components)
 * - Production (Vercel): Uses NEXT_PUBLIC_API_URL
 */
const getBaseURL = (): string => {
  // 🔥 For browser: use relative path (Next.js rewrites)
  if (typeof window !== 'undefined') {
    // In production (Vercel), we might want absolute URL
    if (process.env.NEXT_PUBLIC_IS_VERCEL === '1') {
      return process.env.NEXT_PUBLIC_API_URL?.replace(/\/$/, '') || '';
    }
    // Local development: use relative path
    return '';
  }

  // 🔥 For server-side (RSC, Server Components)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
  if (apiUrl) {
    return apiUrl.replace(/\/$/, '');
  }

  // Fallback for local server-side
  return 'http://127.0.0.1:8000';
};

const baseURL = getBaseURL();

// Log config in development
if (process.env.NODE_ENV === 'development') {
  console.log('🔧 API Client Config:');
  console.log(`   Base URL: ${baseURL || '(relative - using rewrites)'}`);
  console.log(`   Environment: ${process.env.NODE_ENV}`);
  console.log(`   Browser: ${typeof window !== 'undefined'}`);
}

// ============================================================
// 🔥 AXIOS INSTANCE
// ============================================================

const api = axios.create({
  baseURL,
  timeout: 30000, // Increased to 30 seconds for slow connections
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false, // Set to true if using cookies
});

// ============================================================
// 🔥 REQUEST INTERCEPTOR (Attach token & logging)
// ============================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    // 🔥 Attach authentication token (browser only)
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('user_type');

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        
        // Optional: Add user type header for debugging
        if (userType) {
          config.headers['X-User-Type'] = userType;
        }
      }
    }

    // 🔥 Log requests in development
    if (process.env.NODE_ENV === 'development') {
      const fullUrl = config.baseURL 
        ? `${config.baseURL}${config.url}` 
        : config.url;
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
      
      if (config.data) {
        console.log(`   📦 Data:`, config.data);
      }
    }

    // 🔥 Add timestamp to prevent caching (optional)
    // config.params = { ...config.params, _t: Date.now() };

    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// ============================================================
// 🔥 RESPONSE INTERCEPTOR (Handle responses & errors)
// ============================================================

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    // 🔥 Log responses in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError<any>): Promise<any> => {
    // 🔥 Get error details
    const status = error.response?.status;
    const statusText = error.response?.statusText;
    const data = error.response?.data;
    const message = data?.detail || data?.message || error.message || 'Something went wrong. Please try again.';

    // 🔥 Log error in development
    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ [API Error] ${status} ${error.config?.url}`);
      console.error(`   Message: ${message}`);
      console.error(`   Data:`, data);
    }

    // 🔥 Handle specific status codes
    switch (status) {
      // 401 Unauthorized - Token expired or invalid
      case 401:
        if (typeof window !== 'undefined') {
          // Clear all auth data
          localStorage.removeItem('token');
          localStorage.removeItem('user_type');
          localStorage.removeItem('user_name');
          localStorage.removeItem('user_id');
          localStorage.removeItem('school_id');
          localStorage.removeItem('school_level');
          
          // Redirect to login if not already there
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/parent/login')) {
            window.location.href = '/login';
          }
        }
        break;

      // 402 Payment Required - Subscription expired
      case 402:
        if (typeof window !== 'undefined') {
          const schoolId = data?.school_id || data?.schoolId;
          const schoolName = data?.school_name || data?.schoolName || 'Shule yako';
          
          // Redirect to payment page
          if (schoolId) {
            window.location.href = `/payment?school_id=${schoolId}&school_name=${encodeURIComponent(schoolName)}`;
          } else {
            // Show error message
            console.error('Subscription expired. Please contact support.');
          }
        }
        break;

      // 403 Forbidden - Access denied
      case 403:
        if (typeof window !== 'undefined') {
          // Check if it's a subscription expired message
          if (data?.error === 'SUBSCRIPTION_EXPIRED' || 
              data?.error === 'SCHOOL_LOCKED' ||
              message.includes('subscription') ||
              message.includes('expired')) {
            // Redirect to payment
            const schoolId = data?.school_id || data?.schoolId;
            if (schoolId) {
              window.location.href = `/payment?school_id=${schoolId}`;
            }
          } else {
            console.warn('Access denied:', message);
            // Could show a toast/notification here
          }
        }
        break;

      // 404 Not Found
      case 404:
        console.warn('Resource not found:', error.config?.url);
        break;

      // 422 Validation Error
      case 422:
        console.warn('Validation error:', data);
        break;

      // 429 Too Many Requests
      case 429:
        console.warn('Rate limit exceeded. Please wait and try again.');
        break;

      // 500+ Server Error
      case 500:
      case 502:
      case 503:
      case 504:
        console.error('Server error:', status, message);
        // Could show a toast/notification here
        break;

      // Network error (no response)
      default:
        if (!error.response) {
          console.error('Network error - Backend might be down:', error.message);
          // Could show a toast/notification here
        }
        break;
    }

    // 🔥 Return a user-friendly error message
    const userMessage = 
      status === 401 ? 'Your session has expired. Please login again.' :
      status === 402 ? 'Subscription expired. Please renew to continue.' :
      status === 403 ? 'Access denied. You do not have permission to perform this action.' :
      status === 404 ? 'Resource not found.' :
      status === 429 ? 'Too many requests. Please try again later.' :
      status && status >= 500 ? 'Server error. Please try again later.' :
      !error.response ? 'Network error. Please check your connection.' :
      message;

    // 🔥 Return error with additional context
    const enhancedError = {
      status,
      message: userMessage,
      originalMessage: message,
      data: data,
      config: error.config,
    };

    return Promise.reject(enhancedError);
  }
);

// ============================================================
// 🔥 HELPER FUNCTIONS
// ============================================================

/**
 * Get full URL for an endpoint
 */
export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (baseURL) {
    return `${baseURL}${cleanEndpoint}`;
  }
  
  return cleanEndpoint;
};

/**
 * Check if user is authenticated
 */
export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !!token;
};

/**
 * Get current user type
 */
export const getUserType = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_type');
};

/**
 * Get current user name
 */
export const getUserName = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_name');
};

/**
 * Logout user
 */
export const logout = (redirect: boolean = true): void => {
  if (typeof window === 'undefined') return;
  
  const keys = [
    'token',
    'user_type',
    'user_name',
    'user_id',
    'school_id',
    'school_level',
    'teacher_id',
    'parent_id',
    'impersonating',
    'last_activity'
  ];
  
  keys.forEach(key => localStorage.removeItem(key));
  
  if (redirect) {
    window.location.href = '/login';
  }
};

/**
 * Clear all auth data (for security)
 */
export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  
  // Clear localStorage
  localStorage.clear();
  
  // Clear cookies if needed
  document.cookie.split(';').forEach(cookie => {
    document.cookie = cookie
      .replace(/^ +/, '')
      .replace(/=.*/, `=; expires=${new Date(0).toUTCString()}; path=/`);
  });
};

// ============================================================
// 🔥 EXPORT
// ============================================================

export default api;