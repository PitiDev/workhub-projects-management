// composables/useAuth.ts
import { useAuthStore } from '~/stores/auth';
import type { LoginPayload, RegisterPayload, User } from '~/types/auth';

export function useAuth() {
  const { $api } = useNuxtApp();
  const authStore = useAuthStore();
  
  const login = async (payload: LoginPayload) => {
    try {
      authStore.setLoading(true);
      
      // In a real application, you would call the API
      // const response = await $api.post('/auth/login', payload);
      // const { user, token, refreshToken } = response.data;
      
      // For development/demo purposes, use mock data
      // This simulates a successful login with mock data
      const mockUser: User = {
        id: 1,
        email: payload.email,
        first_name: 'John',
        last_name: 'Doe',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      const token = 'mock-token-' + Math.random().toString(36).substring(2);
      const refreshToken = 'mock-refresh-token-' + Math.random().toString(36).substring(2);
      
      // Store in localStorage for persistence
      localStorage.setItem('token', token);
      localStorage.setItem('refreshToken', refreshToken);
      
      // Update store
      authStore.setUser(mockUser);
      authStore.setToken(token);
      authStore.setRefreshToken(refreshToken);
      
      return { success: true };
    } catch (error: any) {
      authStore.setError(error.response?.data?.error || 'Failed to login');
      return { success: false, error: error.response?.data?.error || 'Failed to login' };
    } finally {
      authStore.setLoading(false);
    }
  };
  
  const register = async (payload: RegisterPayload) => {
    try {
      authStore.setLoading(true);
      
      // In a real application, you would call the API
      // await $api.post('/auth/register', payload);
      
      // For development/demo purposes, simulate a successful registration
      console.log('Registered user:', payload);
      
      return { success: true };
    } catch (error: any) {
      authStore.setError(error.response?.data?.error || 'Failed to register');
      return { success: false, error: error.response?.data?.error || 'Failed to register' };
    } finally {
      authStore.setLoading(false);
    }
  };
  
  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('refreshToken');
    authStore.clearAuth();
    navigateTo('/auth/login');
  };
  
  const fetchCurrentUser = async () => {
    try {
      authStore.setLoading(true);
      
      // Check if we have a token
      const token = localStorage.getItem('token');
      if (!token) {
        return null;
      }
      
      // In a real application, you would call the API
      // const response = await $api.get('/auth/me');
      // const user = response.data.user;
      
      // For development/demo purposes, use mock data
      const mockUser: User = {
        id: 1,
        email: 'user@example.com',
        first_name: 'John',
        last_name: 'Doe',
        role: 'admin',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString()
      };
      
      authStore.setUser(mockUser);
      return mockUser;
    } catch (error: any) {
      authStore.setError(error.response?.data?.error || 'Failed to fetch user');
      return null;
    } finally {
      authStore.setLoading(false);
    }
  };
  
  const updateProfile = async (userData: Partial<User>) => {
    try {
      authStore.setLoading(true);
      
      // In a real application, you would call the API
      // const response = await $api.put('/users/profile', userData);
      // const updatedUser = response.data.user;
      
      // For development/demo purposes, simulate profile update
      const currentUser = authStore.getUser;
      if (!currentUser) {
        throw new Error('User not found');
      }
      
      const updatedUser: User = {
        ...currentUser,
        ...userData,
        updated_at: new Date().toISOString()
      };
      
      authStore.setUser(updatedUser);
      return { success: true, user: updatedUser };
    } catch (error: any) {
      authStore.setError(error.response?.data?.error || 'Failed to update profile');
      return { success: false, error: error.response?.data?.error || 'Failed to update profile' };
    } finally {
      authStore.setLoading(false);
    }
  };
  
  const changePassword = async (currentPassword: string, newPassword: string) => {
    try {
      authStore.setLoading(true);
      
      // In a real application, you would call the API
      // await $api.post('/auth/change-password', {
      //   current_password: currentPassword,
      //   new_password: newPassword
      // });
      
      // For development/demo purposes, simulate password change
      console.log('Password changed from', currentPassword, 'to', newPassword);
      
      return { success: true };
    } catch (error: any) {
      authStore.setError(error.response?.data?.error || 'Failed to change password');
      return { success: false, error: error.response?.data?.error || 'Failed to change password' };
    } finally {
      authStore.setLoading(false);
    }
  };
  
  // Initialize auth state from localStorage on client-side
  const initAuth = () => {
    if (process.client) {
      const token = localStorage.getItem('token');
      const refreshToken = localStorage.getItem('refreshToken');
      
      if (token) {
        authStore.setToken(token);
        if (refreshToken) {
          authStore.setRefreshToken(refreshToken);
        }
        
        // Fetch current user if token exists
        fetchCurrentUser();
      }
    }
  };
  
  // Return user object and auth methods
  return {
    user: computed(() => authStore.getUser),
    isAuthenticated: computed(() => authStore.isAuthenticated),
    isAdmin: computed(() => authStore.isAdmin),
    isLoading: computed(() => authStore.isLoading),
    error: computed(() => authStore.getError),
    login,
    register,
    logout,
    fetchCurrentUser,
    updateProfile,
    changePassword,
    initAuth
  };
}