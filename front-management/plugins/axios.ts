// plugins/axios.ts
import axios from 'axios';

export default defineNuxtPlugin((nuxtApp) => {
  const config = useRuntimeConfig();

  const api = axios.create({
    baseURL: config.public.apiBaseUrl,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  // Request interceptor for API calls
  api.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  // Response interceptor for API calls
  api.interceptors.response.use(
    (response) => {
      return response;
    },
    async (error) => {
      const originalRequest = error.config;

      // If the error status is 401 and there is no originalRequest._retry flag,
      // it means the token has expired and we need to refresh it
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;

        try {
          const refreshToken = localStorage.getItem('refreshToken');
          const response = await axios.post(`${config.public.apiBaseUrl}/auth/refresh-token`, {
            token: refreshToken,
          });

          const { token } = response.data;
          localStorage.setItem('token', token);

          // Update the Authorization header for the original request
          originalRequest.headers.Authorization = `Bearer ${token}`;

          // Retry the original request
          return api(originalRequest);
        } catch (error) {
          // If refreshing the token fails, redirect to login
          localStorage.removeItem('token');
          localStorage.removeItem('refreshToken');
          navigateTo('/auth/login');
          return Promise.reject(error);
        }
      }

      return Promise.reject(error);
    }
  );

  return {
    provide: {
      api,
    },
  };
});