// services/api/client.ts
import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';

// Create a custom axios instance
const apiClient: AxiosInstance = axios.create({
  baseURL: '/api', // Match the proxy path in nuxt.config.ts
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for API calls
apiClient.interceptors.request.use(
  (config) => {
    // Only add auth header when in client environment
    if (process.client) {
      // Get the token from localStorage or sessionStorage
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      
      // If token exists, add it to the headers
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for API calls
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;
    
    // Only handle 401 errors on client-side
    if (process.client && error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Try to refresh the token (if you have a refresh token mechanism)
        const refreshToken = localStorage.getItem('refreshToken');
        
        if (refreshToken) {
          const response = await axios.post('/api/auth/refresh-token', {
            token: refreshToken
          });
          
          const { token } = response.data;
          localStorage.setItem('token', token);
          
          // Update the Authorization header
          originalRequest.headers.Authorization = `Bearer ${token}`;
          
          // Retry the original request
          return apiClient(originalRequest);
        } else {
          // Check if we're already on the login page to prevent redirect loops
          if (window.location.pathname !== '/login') {
            // If no refresh token, redirect to login
            window.location.href = '/login';
          }
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If token refresh fails and we're not already on login page
        if (window.location.pathname !== '/login') {
          // Clear tokens
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          // Redirect to login
          window.location.href = '/login';
        }
        return Promise.reject(error);
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;