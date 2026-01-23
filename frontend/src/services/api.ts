/**
 * API Service Layer
 * Handles all HTTP requests to the backend API
 */
import axios, { AxiosInstance, AxiosError } from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

// Create axios instance
const api: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Response interceptor for token refresh
api.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && originalRequest && !originalRequest.headers) {
      originalRequest.headers = {} as any;
    }
    
    if (error.response?.status === 401 && originalRequest) {
      // Try to refresh token
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_URL}/auth/token/refresh/`, {
            refresh: refreshToken,
          });
          
          const { access } = response.data;
          localStorage.setItem('access_token', access);
          
          // Retry original request
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
          }
          return axios(originalRequest);
        } catch (refreshError) {
          // Refresh failed, logout user
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          window.location.href = '/login';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  register: (data: RegisterData) => api.post('/auth/register/', data),
  login: (data: LoginData) => api.post('/auth/login/', data),
  getProfile: () => api.get('/auth/profile/'),
};

// Measurements API
export const measurementsAPI = {
  get: () => api.get('/measurements/'),
  create: (data: MeasurementData) => api.post('/measurements/', data),
  update: (data: MeasurementData) => api.put('/measurements/', data),
};

// Outfits API
export const outfitsAPI = {
  list: (params?: OutfitListParams) => api.get('/outfits/', { params }),
  create: (data: FormData) => api.post('/outfits/', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  get: (id: number) => api.get(`/outfits/${id}/`),
  update: (id: number, data: FormData) => api.put(`/outfits/${id}/`, data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  }),
  delete: (id: number) => api.delete(`/outfits/${id}/`),
  toggleFavorite: (id: number) => api.post(`/outfits/${id}/favorite/`),
  markAsWorn: (id: number) => api.post(`/outfits/${id}/worn/`),
  favorites: () => api.get('/outfits/favorites/'),
  stats: () => api.get('/outfits/stats/'),
};

// Predictions API
export const predictionsAPI = {
  predict: (outfitId: number) => api.post('/predictions/predict/', { outfit_id: outfitId }),
  history: (params?: { fit_status?: string }) => api.get('/predictions/history/', { params }),
};

// Recommendations API
export const recommendationsAPI = {
  getRecommendations: (params?: { occasion?: string; season?: string; limit?: number }) =>
    api.get('/recommendations/outfits/', { params }),
  getSimilar: (outfitId: number, limit?: number) =>
    api.get(`/recommendations/outfits/${outfitId}/similar/`, { params: { limit } }),
};

// Types
export interface RegisterData {
  username: string;
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
}

export interface LoginData {
  username: string;
  password: string;
}

export interface MeasurementData {
  height: number;
  weight: number;
  chest?: number;
  waist?: number;
  hips?: number;
  shoulder?: number;
  gender: 'male' | 'female' | 'other';
}

export interface OutfitListParams {
  page?: number;
  category?: string;
  occasion?: string;
  season?: string;
  search?: string;
  ordering?: string;
  is_favorite?: boolean;
}

export default api;
