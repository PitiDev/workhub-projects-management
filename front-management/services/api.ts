// services/api.ts
import axios, { type AxiosInstance, type AxiosResponse, type AxiosError } from 'axios';

// Create a custom axios instance
const api: AxiosInstance = axios.create({
  baseURL: '/api/api/', // Use the proxy we set up in nuxt.config.ts
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json'
  }
});

// Request interceptor for API calls
api.interceptors.request.use(
  (config) => {
    // Get the token from localStorage or sessionStorage
    const token = localStorage.getItem('token') || sessionStorage.getItem('token');

    // If token exists, add it to the headers
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
  (response: AxiosResponse) => {
    return response;
  },
  async (error: AxiosError) => {
    const originalRequest: any = error.config;

    // If error is 401 Unauthorized and not already retrying
    if (error.response?.status === 401 && !originalRequest._retry) {
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
          return api(originalRequest);
        } else {
          // If no refresh token, redirect to login
          window.location.href = '/login';
          return Promise.reject(error);
        }
      } catch (refreshError) {
        // If token refresh fails, redirect to login
        localStorage.removeItem('token');
        localStorage.removeItem('refreshToken');
        window.location.href = '/login';
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

// Auth API
export const authAPI = {
  login: (email: string, password: string) => {
    return api.post('/auth/login', { email, password });
  },

  register: (data: {
    first_name: string;
    last_name: string;
    email: string;
    password: string;
  }) => {
    return api.post('/auth/register', data);
  },

  forgotPassword: (email: string) => {
    return api.post('/auth/forgot-password', { email });
  },

  resetPassword: (token: string, password: string) => {
    return api.post('/auth/reset-password', { token, password });
  },

  me: () => {
    return api.get('/auth/me');
  }
};

// Teams API
export const teamsAPI = {
  getAll: () => {
    return api.get('/teams');
  },

  getById: (id: number) => {
    return api.get(`/teams/${id}`);
  },

  create: (data: { name: string; description: string }) => {
    return api.post('/teams', data);
  },

  update: (id: number, data: { name?: string; description?: string }) => {
    return api.put(`/teams/${id}`, data);
  },

  delete: (id: number) => {
    return api.delete(`/teams/${id}`);
  },

  getMembers: (teamId: number) => {
    return api.get(`/teams/${teamId}/members`);
  },

  addMember: (teamId: number, userId: number, role: string) => {
    return api.post(`/teams/${teamId}/members`, { user_id: userId, role });
  },

  updateMemberRole: (teamId: number, userId: number, role: string) => {
    return api.put(`/teams/${teamId}/members/${userId}`, { role });
  },

  removeMember: (teamId: number, userId: number) => {
    return api.delete(`/teams/${teamId}/members/${userId}`);
  },

  // Add this new function for searching users
  searchUsers: (query:any) => {
    
    return api.get(`/users/search?query=${query}`);
  }

};

// Projects API
export const projectsAPI = {
  getAll: () => {
    return api.get('/projects');
  },

  getById: (id: number) => {
    return api.get(`/projects/${id}`);
  },

  create: (data: { name: string; description: string; color: string; team_id: number }) => {
    return api.post('/projects', data);
  },

  update: (id: number, data: { name?: string; description?: string; color?: string; status?: string }) => {
    return api.put(`/projects/${id}`, data);
  },

  delete: (id: number) => {
    return api.delete(`/projects/${id}`);
  },

  getStatuses: (projectId: number) => {
    return api.get(`/projects/${projectId}/statuses`);
  },

  createStatus: (projectId: number, data: { name: string; color: string; order_position: number }) => {
    return api.post(`/projects/${projectId}/statuses`, data);
  },

  updateStatus: (projectId: number, statusId: number, data: { name?: string; color?: string; order_position?: number }) => {
    return api.put(`/projects/${projectId}/statuses/${statusId}`, data);
  },

  deleteStatus: (projectId: number, statusId: number) => {
    return api.delete(`/projects/${projectId}/statuses/${statusId}`);
  },

  reorderStatuses: (projectId: number, statusOrder: number[]) => {
    return api.put(`/projects/${projectId}/statuses/reorder`, { statusOrder });
  },

  search: (params: { query: string; limit?: number }) => {
    return api.get('/projects/search', { params });
  }
};

// Tasks API
export const tasksAPI = {
  getAll: (filters?: Record<string, any>) => {
    return api.get('/tasks', { params: filters });
  },

  getById: (id: number) => {
    return api.get(`/tasks/${id}`);
  },

  getByProject: (projectId: number) => {
    return api.get(`/tasks/project/${projectId}`);
  },

  create: (data: any) => {
    return api.post('/tasks', data);
  },

  update: (id: number, data: any) => {
    return api.put(`/tasks/${id}`, data);
  },

  delete: (id: number) => {
    return api.delete(`/tasks/${id}`);
  },

  search: (params: { query: string; limit?: number }) => {
    return api.get('/tasks/search', { params });
  },

  getComments: (taskId: number) => {
    return api.get(`/tasks/${taskId}/comments`);
  },

  addComment: (taskId: number, content: string) => {
    return api.post(`/tasks/${taskId}/comments`, { content });
  },

  startTimeTracking: (taskId: number, description?: string) => {
    return api.post(`/tasks/${taskId}/time-entries`, {
      start_time: new Date().toISOString(),
      description
    });
  },

  stopTimeTracking: (taskId: number, entryId: number, description?: string) => {
    return api.put(`/tasks/${taskId}/time-entries/${entryId}`, {
      end_time: new Date().toISOString(),
      description
    });
  },

  createChecklist: (taskId: number, title: string, items: { content: string }[] = []) => {
    return api.post(`/tasks/${taskId}/checklists`, { title, items });
  }
};

// User API
export const userAPI = {
  getAll: () => {
    return api.get('/users');
  },
};

// Export default api for custom requests
export default api;