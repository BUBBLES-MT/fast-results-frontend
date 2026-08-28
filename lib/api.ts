// lib/api.ts

import axios, { AxiosError, InternalAxiosRequestConfig, AxiosResponse } from 'axios';

// ============================================================
// 🔥 BASE URL CONFIGURATION - FIXED!
// ============================================================

/**
 * Determines the base URL for API calls
 * - Browser: Uses NEXT_PUBLIC_API_URL if available (production)
 * - Browser: Uses relative path if no env (development with rewrites)
 * - Server: Uses full URL (for RSC/Server Components)
 */
const getBaseURL = (): string => {
  // 🔥 Kwa browser
  if (typeof window !== 'undefined') {
    // 🔥 MUHIMU: Angalia NEXT_PUBLIC_API_URL kwanza
    const apiUrl = process.env.NEXT_PUBLIC_API_URL;
    if (apiUrl) {
      console.log('🔧 Using API URL from env:', apiUrl);
      return apiUrl.replace(/\/$/, '');
    }
    
    // 🔥 Ikiwa hakuna env, tumia relative path (kwa local development)
    console.log('🔧 Using relative path (development mode)');
    return '';
  }

  // 🔥 Kwa server-side (RSC, Server Components)
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || process.env.BACKEND_URL;
  if (apiUrl) {
    return apiUrl.replace(/\/$/, '');
  }

  // Fallback kwa local server-side
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
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
  withCredentials: false,
});

// ============================================================
// 🔥 REQUEST INTERCEPTOR
// ============================================================

api.interceptors.request.use(
  (config: InternalAxiosRequestConfig): InternalAxiosRequestConfig => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('token');
      const userType = localStorage.getItem('user_type');

      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
        
        if (userType) {
          config.headers['X-User-Type'] = userType;
        }
      }
    }

    if (process.env.NODE_ENV === 'development') {
      const fullUrl = config.baseURL 
        ? `${config.baseURL}${config.url}` 
        : config.url;
      console.log(`🚀 [API Request] ${config.method?.toUpperCase()} ${fullUrl}`);
      
      if (config.data) {
        console.log(`   📦 Data:`, config.data);
      }
    }

    return config;
  },
  (error) => {
    console.error('❌ Request Interceptor Error:', error);
    return Promise.reject(error);
  }
);

// ============================================================
// 🔥 RESPONSE INTERCEPTOR
// ============================================================

api.interceptors.response.use(
  (response: AxiosResponse): AxiosResponse => {
    if (process.env.NODE_ENV === 'development') {
      console.log(`✅ [API Response] ${response.status} ${response.config.url}`);
    }
    return response;
  },
  async (error: AxiosError<any>): Promise<any> => {
    const status = error.response?.status;
    const data = error.response?.data;
    const message = data?.detail || data?.message || error.message || 'Something went wrong. Please try again.';

    if (process.env.NODE_ENV === 'development') {
      console.error(`❌ [API Error] ${status} ${error.config?.url}`);
      console.error(`   Message: ${message}`);
      console.error(`   Data:`, data);
    }

    switch (status) {
      case 401:
        if (typeof window !== 'undefined') {
          localStorage.removeItem('token');
          localStorage.removeItem('user_type');
          localStorage.removeItem('user_name');
          localStorage.removeItem('user_id');
          localStorage.removeItem('school_id');
          localStorage.removeItem('school_level');
          
          if (!window.location.pathname.includes('/login') && 
              !window.location.pathname.includes('/parent/login')) {
            window.location.href = '/login';
          }
        }
        break;

      case 402:
        if (typeof window !== 'undefined') {
          const schoolId = data?.school_id || data?.schoolId;
          const schoolName = data?.school_name || data?.schoolName || 'Shule yako';
          
          if (schoolId) {
            window.location.href = `/payment?school_id=${schoolId}&school_name=${encodeURIComponent(schoolName)}`;
          } else {
            console.error('Subscription expired. Please contact support.');
          }
        }
        break;

      case 403:
        if (typeof window !== 'undefined') {
          if (data?.error === 'SUBSCRIPTION_EXPIRED' || 
              data?.error === 'SCHOOL_LOCKED' ||
              message.includes('subscription') ||
              message.includes('expired')) {
            const schoolId = data?.school_id || data?.schoolId;
            if (schoolId) {
              window.location.href = `/payment?school_id=${schoolId}`;
            }
          } else {
            console.warn('Access denied:', message);
          }
        }
        break;

      case 404:
        console.warn('Resource not found:', error.config?.url);
        break;

      case 422:
        console.warn('Validation error:', data);
        break;

      case 429:
        console.warn('Rate limit exceeded. Please wait and try again.');
        break;

      case 500:
      case 502:
      case 503:
      case 504:
        console.error('Server error:', status, message);
        break;

      default:
        if (!error.response) {
          console.error('Network error - Backend might be down:', error.message);
        }
        break;
    }

    const userMessage = 
      status === 401 ? 'Your session has expired. Please login again.' :
      status === 402 ? 'Subscription expired. Please renew to continue.' :
      status === 403 ? 'Access denied. You do not have permission to perform this action.' :
      status === 404 ? 'Resource not found.' :
      status === 429 ? 'Too many requests. Please try again later.' :
      status && status >= 500 ? 'Server error. Please try again later.' :
      !error.response ? 'Network error. Please check your connection.' :
      message;

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

export const getApiUrl = (endpoint: string): string => {
  const cleanEndpoint = endpoint.startsWith('/') ? endpoint : `/${endpoint}`;
  
  if (baseURL) {
    return `${baseURL}${cleanEndpoint}`;
  }
  
  return cleanEndpoint;
};

export const isAuthenticated = (): boolean => {
  if (typeof window === 'undefined') return false;
  const token = localStorage.getItem('token');
  return !!token;
};

export const getUserType = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_type');
};

export const getUserName = (): string | null => {
  if (typeof window === 'undefined') return null;
  return localStorage.getItem('user_name');
};

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

export const clearAuth = (): void => {
  if (typeof window === 'undefined') return;
  
  localStorage.clear();
  
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
export { api };