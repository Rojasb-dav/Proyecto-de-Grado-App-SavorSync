// API Configuration for SavorSync Mobile App

// Base URL del backend
export const API_BASE_URL = 'http://192.168.2.6:5000/api';

// Endpoints de la API
export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
    POSTS: (id: string) => `/users/${id}/posts`,
    FOLLOWERS: (id: string) => `/users/${id}/followers`,
    FOLLOWING: (id: string) => `/users/${id}/following`,
  },
  
  // Restaurants
  RESTAURANTS: {
    BASE: '/restaurants',
    BY_ID: (id: string) => `/restaurants/${id}`,
    NEARBY: '/restaurants/nearby/location',
  },
  
  // Posts
  POSTS: {
    BASE: '/posts',
    BY_ID: (id: string) => `/posts/${id}`,
    LIKE: (id: string) => `/posts/${id}/like`,
    FEATURED: '/posts/featured',
  },
};

// Configuración de timeouts
export const API_TIMEOUT = 10000; // 10 segundos

// Headers por defecto
export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
