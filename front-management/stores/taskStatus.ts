import { defineStore } from 'pinia';
import axios from 'axios';
import { useToast } from 'vue3-toastify';

export interface TaskStatus {
  id: number;
  project_id: number;
  name: string;
  color: string | null;
  order_position: number;
  created_at?: string;
  updated_at?: string;
}

interface TaskStatusState {
  statuses: TaskStatus[];
  loading: boolean;
  error: string | null;
}

export const useTaskStatusStore = defineStore('taskStatus', {
  state: (): TaskStatusState => ({
    statuses: [],
    loading: false,
    error: null
  }),
  
  getters: {
    getOrderedStatuses: (state): TaskStatus[] => {
      return [...state.statuses].sort((a, b) => a.order_position - b.order_position);
    }
  },
  
  actions: {
    async fetchStatuses(projectId: number) {
      const config = useRuntimeConfig();
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.get<TaskStatus[]>(`${config.public.apiBaseUrl}/projects/${projectId}/statuses`);
        this.statuses = response.data;
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to fetch statuses';
        useToast().error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async createStatus(projectId: number, statusData: { name: string; color?: string }) {
      const config = useRuntimeConfig();
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.post<TaskStatus>(
          `${config.public.apiBaseUrl}/projects/${projectId}/statuses`,
          statusData
        );
        
        this.statuses.push(response.data);
        useToast().success('Status created successfully');
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to create status';
        useToast().error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async updateStatus(projectId: number, statusId: number, statusData: { name?: string; color?: string }) {
      const config = useRuntimeConfig();
      this.loading = true;
      this.error = null;
      
      try {
        const response = await axios.put<TaskStatus>(
          `${config.public.apiBaseUrl}/projects/${projectId}/statuses/${statusId}`,
          statusData
        );
        
        const index = this.statuses.findIndex(status => status.id === statusId);
        if (index !== -1) {
          this.statuses[index] = response.data;
        }
        
        useToast().success('Status updated successfully');
        return response.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to update status';
        useToast().error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async deleteStatus(projectId: number, statusId: number) {
      const config = useRuntimeConfig();
      this.loading = true;
      this.error = null;
      
      try {
        await axios.delete(`${config.public.apiBaseUrl}/projects/${projectId}/statuses/${statusId}`);
        
        this.statuses = this.statuses.filter(status => status.id !== statusId);
        useToast().success('Status deleted successfully');
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to delete status';
        useToast().error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async reorderStatuses(projectId: number, statusOrder: number[]) {
      const config = useRuntimeConfig();
      this.loading = true;
      this.error = null;
      
      try {
        await axios.put(
          `${config.public.apiBaseUrl}/projects/${projectId}/statuses/reorder`,
          { statusOrder }
        );
        
        // Update local order_position values
        statusOrder.forEach((statusId, index) => {
          const status = this.statuses.find(s => s.id === statusId);
          if (status) {
            status.order_position = index;
          }
        });
        
        useToast().success('Statuses reordered successfully');
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Failed to reorder statuses';
        useToast().error(this.error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});