// services/api/auth.ts
import apiClient from './client';

export const authAPI = {
  login: (email: string, password: string) => {
    return apiClient.post('/auth/login', { email, password });
  },
  
  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    return apiClient.post('/auth/register', data);
  },
  
  forgotPassword: (email: string) => {
    return apiClient.post('/auth/forgot-password', { email });
  },
  
  resetPassword: (token: string, password: string) => {
    return apiClient.post('/auth/reset-password', { token, password });
  },
  
  me: () => {
    return apiClient.get('/auth/me');
  },

  // Check if the user is logged in
  checkAuth: () => {
    // Only check in client-side
    if (process.client) {
      const token = localStorage.getItem('token') || sessionStorage.getItem('token');
      return !!token;
    }
    return false;
  }
};