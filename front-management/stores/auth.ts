// stores/auth.ts
import { defineStore } from 'pinia';
import type { User } from '~/types/auth';

// Define the AuthState interface directly in the store file
interface AuthState {
  user: User | null;
  token: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  loading: boolean;
  error: string | null;
}

export const useAuthStore = defineStore('auth', {
  state: (): AuthState => ({
    user: null,
    token: null,
    refreshToken: null,
    isAuthenticated: false,
    loading: false,
    error: null
  }),
  
  getters: {
    getUser: (state) => state.user,
    isAdmin: (state) => state.user?.role === 'admin',
    isManager: (state) => state.user?.role === 'manager' || state.user?.role === 'admin',
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  },
  
  actions: {
    setUser(user: User) {
      this.user = user;
      this.isAuthenticated = true;
    },
    
    setToken(token: string) {
      this.token = token;
      this.isAuthenticated = true;
    },
    
    setRefreshToken(refreshToken: string) {
      this.refreshToken = refreshToken;
    },
    
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    
    setError(error: string | null) {
      this.error = error;
    },
    
    clearAuth() {
      this.user = null;
      this.token = null;
      this.refreshToken = null;
      this.isAuthenticated = false;
      this.error = null;
    }
  }
});