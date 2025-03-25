// services/api/projects.ts
import apiClient from './client';
import type { Project } from '~/types';

export interface ProjectSearchParams {
  query: string;
  limit?: number;
}

export interface ProjectResponse {
  data: {
    data: Project[];
  };
}

export const projectsAPI = {
  getAll: (params?: any) => {
    return apiClient.get<ProjectResponse>('/projects', { params });
  },
  
  getById: (id: number) => {
    return apiClient.get<{ data: Project }>(`/projects/${id}`);
  },
  
  create: (data: { name: string; description: string; color: string; team_id: number }) => {
    return apiClient.post<{ data: Project }>('/projects', data);
  },
  
  update: (id: number, data: { name?: string; description?: string; color?: string; status?: string }) => {
    return apiClient.put<{ data: Project }>(`/projects/${id}`, data);
  },
  
  delete: (id: number) => {
    return apiClient.delete(`/projects/${id}`);
  },
     
  getStatuses: (projectId: number) => {
    return apiClient.get(`/projects/${projectId}/statuses`);
  },
  
  createStatus: (projectId: number, data: { name: string; color: string; order_position: number }) => {
    return apiClient.post(`/projects/${projectId}/statuses`, data);
  },
  
  updateStatus: (projectId: number, statusId: number, data: { name?: string; color?: string; order_position?: number }) => {
    return apiClient.put(`/projects/${projectId}/statuses/${statusId}`, data);
  },
  
  deleteStatus: (projectId: number, statusId: number) => {
    return apiClient.delete(`/projects/${projectId}/statuses/${statusId}`);
  },
  
  reorderStatuses: (projectId: number, statusOrder: number[]) => {
    return apiClient.put(`/projects/${projectId}/statuses/reorder`, { statusOrder });
  },
  
  // Search method
  search: (params: ProjectSearchParams) => {
    return apiClient.get<ProjectResponse>('/api/projects/search', { params });
  }
};