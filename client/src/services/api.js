import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || '/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
  timeout: 15000,
});

// Intercept requests to inject JWT auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('smartbuy_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Intercept responses to handle auth expiration
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // Token expired or invalid
      if (typeof window !== 'undefined' && localStorage.getItem('smartbuy_token')) {
        console.warn('[API Auth] Session expired. Clearing token.');
        localStorage.removeItem('smartbuy_token');
        localStorage.removeItem('smartbuy_user');
      }
    }
    return Promise.reject(error);
  }
);

export default api;

