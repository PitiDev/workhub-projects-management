// services/api/user.ts
import apiClient from './client';

export type User = {
  id: number | string;
  first_name: string;
  last_name: string;
  email: string;
  profile_image?: string | null;
  role?: string;
  created_at?: string;
  updated_at?: string;
};

export type UserSearchParams = {
  query?: string;
  role?: string;
  team_id?: number | string;
  page?: number;
  limit?: number;
  sort_by?: string;
  sort_dir?: 'asc' | 'desc';
};

export const userAPI = {
  /**
   * Get all users
   * @param params - Query parameters for filtering
   */
  getAll: (params = {}) => {
    return apiClient.get('/api/users', { params });
  },

  /**
   * Get user by ID
   * @param id - User ID
   */
  getById: (id: any) => {
    return $fetch(`/api/users/${id}`, {
      method: 'GET'
    });
  },

  /**
   * Create a new user
   * @param data - User data
   */
  create: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
    role?: string;
    profile_image?: string | null;
  }) => {
    return apiClient.post('/api/users', data);
  },

  /**
   * Update an existing user
   * @param id - User ID
   * @param data - User data to update
   */
  update: (
    id: number | string,
    data: Partial<Omit<User, 'id' | 'created_at' | 'updated_at'>>
  ) => {
    return apiClient.put(`/api/users/${id}`, data);
  },

  /**
   * Delete a user
   * @param id - User ID
   */
  delete: (id: number | string) => {
    return apiClient.delete(`/api/users/${id}`);
  },

  // Search users by email or name
  search: (query: any) => {
    return $fetch('/api/users/search', {
      method: 'GET',
      params: { q: query }
    });
  },

  /**
   * Get current user profile
   */
  getProfile: () => {
    return apiClient.get('/api/users/profile');
  },

  /**
   * Update current user profile
   */
  updateProfile: (data: {
    first_name?: string;
    last_name?: string;
    email?: string;
    profile_image?: string | null;
  }) => {
    return apiClient.put('/api/users/profile', data);
  },

  /**
   * Get users by team ID
   * @param teamId - Team ID
   */
  getByTeam: (teamId: number | string) => {
    return apiClient.get(`/api/teams/${teamId}/members`);
  },

  /**
   * Change user password
   */
  changePassword: (data: {
    current_password: string;
    new_password: string;
  }) => {
    return apiClient.post('/api/users/change-password', data);
  },

  /**
   * Upload profile image
   */
  uploadProfileImage: (formData: FormData) => {
    return apiClient.post('/api/users/profile/image', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};