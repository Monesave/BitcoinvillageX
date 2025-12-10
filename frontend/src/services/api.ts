import axios from 'axios';
import { supabase } from './supabase';

const API_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3000';

// Create axios instance
const api = axios.create({
  baseURL: `${API_URL}/api`,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  async (config) => {
    const { data: { session } } = await supabase.auth.getSession();
    if (session?.access_token) {
      config.headers.Authorization = `Bearer ${session.access_token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Handle auth errors
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    if (error.response?.status === 401) {
      // Token expired, try to refresh
      const { data: { session } } = await supabase.auth.getSession();
      if (session?.refresh_token) {
        await supabase.auth.refreshSession();
        // Retry the request
        const { data: { session: newSession } } = await supabase.auth.getSession();
        if (newSession?.access_token) {
          error.config.headers.Authorization = `Bearer ${newSession.access_token}`;
          return api.request(error.config);
        }
      }
      // If refresh fails, redirect to login
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Auth API methods
export const authAPI = {
  register: async (data: { email: string; password: string; username?: string; displayName?: string }) => {
    const response = await api.post('/auth/register', data);
    return response.data;
  },

  login: async (data: { email: string; password: string }) => {
    const response = await api.post('/auth/login', data);
    return response.data;
  },

  logout: async () => {
    const response = await api.post('/auth/logout');
    return response.data;
  },

  getCurrentUser: async () => {
    const response = await api.get('/auth/me');
    return response.data;
  },

  updateProfile: async (data: { username?: string; displayName?: string; bio?: string; location?: string; avatarUrl?: string }) => {
    const response = await api.put('/auth/profile', data);
    return response.data;
  },

  googleAuth: async (redirectTo?: string) => {
    const response = await api.post('/auth/oauth/google', { redirectTo });
    return response.data;
  },

  sendPhoneOTP: async (phone: string) => {
    const response = await api.post('/auth/phone/send-otp', { phone });
    return response.data;
  },

  verifyPhoneOTP: async (phone: string, token: string) => {
    const response = await api.post('/auth/phone/verify-otp', { phone, token });
    return response.data;
  },
};

// Marketplace API methods
export const marketplaceAPI = {
  getListings: async (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    country?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.location) queryParams.append('location', params.location);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await api.get(`/marketplace/listings?${queryParams.toString()}`);
    return response.data;
  },

  getListing: async (id: string) => {
    const response = await api.get(`/marketplace/listings/${id}`);
    return response.data;
  },

  createListing: async (data: any) => {
    const response = await api.post('/marketplace/listings', data);
    return response.data;
  },
};

// Services API methods
export const servicesAPI = {
  getListings: async (params?: {
    category?: string;
    minPrice?: number;
    maxPrice?: number;
    location?: string;
    country?: string;
    search?: string;
    page?: number;
    limit?: number;
  }) => {
    const queryParams = new URLSearchParams();
    if (params?.category) queryParams.append('category', params.category);
    if (params?.minPrice) queryParams.append('minPrice', params.minPrice.toString());
    if (params?.maxPrice) queryParams.append('maxPrice', params.maxPrice.toString());
    if (params?.location) queryParams.append('location', params.location);
    if (params?.country) queryParams.append('country', params.country);
    if (params?.search) queryParams.append('search', params.search);
    if (params?.page) queryParams.append('page', params.page.toString());
    if (params?.limit) queryParams.append('limit', params.limit.toString());
    
    const response = await api.get(`/services/listings?${queryParams.toString()}`);
    return response.data;
  },

  getListing: async (id: string) => {
    const response = await api.get(`/services/listings/${id}`);
    return response.data;
  },

  createListing: async (data: any) => {
    const response = await api.post('/services/listings', data);
    return response.data;
  },
};

export default api;

