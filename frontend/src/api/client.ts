import axios from 'axios';

const rawBase = import.meta.env.VITE_API_URL || '';

const getNormalizedBaseUrl = (): string => {
  if (!rawBase || rawBase.trim() === '') {
    return '/api';
  }

  let clean = rawBase.trim().replace(/\/+$/, '');

  if (!clean.endsWith('/api')) {
    clean = `${clean}/api`;
  }

  return clean;
};

export const API_BASE = getNormalizedBaseUrl();

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor: Attach JWT Token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('memora_token');
    if (token && config.headers) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Avoid redirect loops
    }
    return Promise.reject(error);
  }
);

export default api;