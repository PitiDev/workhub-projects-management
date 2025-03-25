// services/api/tasks.ts
import apiClient from './client';

// Task interfaces
export interface Task {
  id: number;
  title: string;
  description?: string;
  project_id: number;
  status_id: number;
  type_id?: number;
  priority_id?: number;
  assignee_id?: number;
  start_date?: string;
  due_date?: string;
  created_at?: string;
  updated_at?: string;
  project?: {
    id: number;
    name: string;
    color?: string;
  };
  status?: {
    id: number;
    name: string;
    color?: string;
  };
}

export interface TaskCreateData {
  title: string;
  description?: string;
  project_id: number;
  status_id: number;
  type_id?: number;
  priority_id?: number;
  assignee_id?: number;
  start_date?: string;
  due_date?: string;
}

export interface TaskUpdateData {
  title?: string;
  description?: string;
  project_id?: number;
  status_id?: number;
  type_id?: number;
  priority_id?: number;
  assignee_id?: number;
  start_date?: string;
  due_date?: string;
}

export interface TasksResponse {
  data: Task[];
}

export interface TaskResponse {
  data: Task;
}

export interface ChecklistItem {
  content: string;
  is_completed?: boolean;
}

export const tasksAPI = {
  getAll: (filters?: Record<string, any>) => {
    return apiClient.get<{ data: Task[] }>('/tasks', { params: filters });
  },

  getById: (id: number) => {
    return apiClient.get<{ data: Task }>(`/tasks/${id}`);
  },

  getByProject: (projectId: number) => {
    return apiClient.get<{ data: Task[] }>(`/tasks/project/${projectId}`);
  },

  create: (data: TaskCreateData) => {
    return apiClient.post<{ data: Task }>('/tasks', data);
  },

  update: (id: number, data: TaskUpdateData) => {
    return apiClient.put<{ data: Task }>(`/tasks/${id}`, data);
  },

  delete: (id: number) => {
    return apiClient.delete<{ success: boolean }>(`/tasks/${id}`);
  },

  // Search method with TypeScript types
  search: (params: { query: string; limit?: number }) => {
    return apiClient.get<{ data: Task[] }>('/api/tasks/search', { params });
  },

  getComments: (taskId: number) => {
    return apiClient.get<{ data: any[] }>(`/tasks/${taskId}/comments`);
  },

  addComment: (taskId: number, content: string) => {
    return apiClient.post<{ data: any }>(`/tasks/${taskId}/comments`, { content });
  },

  startTimeTracking: (taskId: number, description?: string) => {
    return apiClient.post<{ data: any }>(`/tasks/${taskId}/time-entries`, {
      start_time: new Date().toISOString(),
      description
    });
  },

  stopTimeTracking: (taskId: number, entryId: number, description?: string) => {
    return apiClient.put<{ data: any }>(`/tasks/${taskId}/time-entries/${entryId}`, {
      end_time: new Date().toISOString(),
      description
    });
  },

  createChecklist: (taskId: number, title: string, items: ChecklistItem[] = []) => {
    return apiClient.post<{ data: any }>(`/tasks/${taskId}/checklists`, { title, items });
  }
};