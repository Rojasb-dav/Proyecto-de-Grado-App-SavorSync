// API Configuration for SavorSync Web Owners

export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

export const API_ENDPOINTS = {
  // Auth
  AUTH: {
    REGISTER: '/auth/register',
    LOGIN: '/auth/login',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    REFRESH: '/auth/refresh',
  },
  
  // Restaurants
  RESTAURANTS: {
    BASE: '/restaurants',
    BY_ID: (id: string) => `/restaurants/${id}`,
    MENU: (id: string) => `/restaurants/${id}/menu`,
    HOURS: (id: string) => `/restaurants/${id}/hours`,
    PROMOTIONS: (id: string) => `/restaurants/${id}/promotions`,
  },
  
  // Posts
  POSTS: {
    BASE: '/posts',
    BY_ID: (id: string) => `/posts/${id}`,
    BY_RESTAURANT: (restaurantId: string) => `/posts?restaurantId=${restaurantId}`,
  },
  
  // Users
  USERS: {
    BASE: '/users',
    BY_ID: (id: string) => `/users/${id}`,
  },
};

export const API_TIMEOUT = 10000;

export const DEFAULT_HEADERS = {
  'Content-Type': 'application/json',
  'Accept': 'application/json',
};
