// Types for SavorSync Mobile App

export interface User {
  id: string;
  email: string;
  username: string;
  fullName: string;
  avatarUrl?: string;
  phone?: string;
  bio?: string;
  locationName?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Restaurant {
  id: string;
  name: string;
  address: string;
  latitude: number;
  longitude: number;
  phone: string;
  email?: string;
  website?: string;
  category: string;
  priceRange: number;
  ratingAverage: number;
  totalReviews: number;
  isActive: boolean;
  isVerified: boolean;
  ownerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface Post {
  id: string;
  userId: string;
  restaurantId?: string;
  content: string;
  imageUrl?: string;
  rating?: number;
  likesCount: number;
  commentsCount: number;
  isPublic: boolean;
  isFeatured: boolean;
  createdAt: string;
  updatedAt: string;
  user?: User;
  restaurant?: Restaurant;
}

export interface AuthResponse {
  token: string;
  refreshToken: string;
  user: User;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  username: string;
  password: string;
  fullName: string;
  phone?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

export interface ApiError {
  message: string;
  statusCode: number;
  errors?: any[];
}

// Navigation types
export type RootStackParamList = {
  Login: undefined;
  Register: undefined;
  Main: undefined;
};

export type MainTabParamList = {
  Home: undefined;
  Search: undefined;
  CreatePost: undefined;
  Profile: undefined;
};

export type HomeStackParamList = {
  Feed: undefined;
  PostDetail: { postId: string };
  RestaurantDetail: { restaurantId: string };
  UserProfile: { userId: string };
};
