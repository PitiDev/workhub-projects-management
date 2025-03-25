// stores/reportStore.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { useRuntimeConfig } from '#app';

// TypeScript interfaces
interface UserAssignment {
  id: number;
  full_name: string;
  assigned_tasks: number;
  percentage: number;
}

interface ProjectCompletion {
  id: number;
  name: string;
  total_tasks: number;
  completed_tasks: number;
  completion_percentage: number;
}

interface UserActivity {
  id: number;
  full_name: string;
  tasks_worked_on: number;
  comments_added: number;
  total_minutes_logged: number;
  active_days: number;
}

interface TaskDistribution {
  id: number;
  name: string;
  color: string;
  task_count: number;
  percentage: number;
}

interface DailyTimeStats {
  date: string;
  minutes_logged: number;
}

interface TotalTimeStats {
  total_minutes?: number;
  entry_count?: number;
  unique_tasks?: number;
}

interface TimeTracking {
  dailyStats: DailyTimeStats[];
  totalTime: TotalTimeStats;
}

interface LoadingState {
  userAssignments: boolean;
  projectCompletion: boolean;
  userActivity: boolean;
  taskDistribution: boolean;
  timeTracking: boolean;
}

interface TimeTrackingParams {
  projectId?: number;
  userId?: number;
  days?: number;
}

interface ReportState {
  userAssignments: UserAssignment[];
  projectCompletion: ProjectCompletion[];
  userActivity: UserActivity[];
  taskDistribution: TaskDistribution[];
  timeTracking: TimeTracking;
  loading: LoadingState;
  error: string | null;
}

export const useReportStore = defineStore('report', {
  state: (): ReportState => ({
    userAssignments: [],
    projectCompletion: [],
    userActivity: [],
    taskDistribution: [],
    timeTracking: {
      dailyStats: [],
      totalTime: {}
    },
    loading: {
      userAssignments: false,
      projectCompletion: false,
      userActivity: false,
      taskDistribution: false,
      timeTracking: false
    },
    error: null
  }),
  
  actions: {
    async fetchUserAssignments(teamId: number): Promise<void> {
      this.loading.userAssignments = true;
      this.error = null;
      
      try {
        const runtimeConfig = useRuntimeConfig();
        const response = await axios.get<{ success: boolean, data: UserAssignment[] }>(
          `${runtimeConfig.public.apiBaseUrl}/reports/user-assignments/${teamId}`,
          { withCredentials: true }
        );
        
        this.userAssignments = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Error fetching user assignments';
        console.error('Error fetching user assignments:', error);
      } finally {
        this.loading.userAssignments = false;
      }
    },
    
    async fetchProjectCompletion(teamId: number): Promise<void> {
      this.loading.projectCompletion = true;
      this.error = null;
      
      try {
        const runtimeConfig = useRuntimeConfig();
        const response = await axios.get<{ success: boolean, data: ProjectCompletion[] }>(
          `${runtimeConfig.public.apiBaseUrl}/reports/project-completion/${teamId}`,
          { withCredentials: true }
        );
        
        this.projectCompletion = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Error fetching project completion data';
        console.error('Error fetching project completion:', error);
      } finally {
        this.loading.projectCompletion = false;
      }
    },
    
    async fetchUserActivity(teamId: number, days: number = 30): Promise<void> {
      this.loading.userActivity = true;
      this.error = null;
      
      try {
        const runtimeConfig = useRuntimeConfig();
        const response = await axios.get<{ success: boolean, data: UserActivity[] }>(
          `${runtimeConfig.public.apiBaseUrl}/reports/user-activity/${teamId}?days=${days}`,
          { withCredentials: true }
        );
        
        this.userActivity = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Error fetching user activity data';
        console.error('Error fetching user activity:', error);
      } finally {
        this.loading.userActivity = false;
      }
    },
    
    async fetchTaskDistribution(projectId: number): Promise<void> {
      this.loading.taskDistribution = true;
      this.error = null;
      
      try {
        const runtimeConfig = useRuntimeConfig();
        const response = await axios.get<{ success: boolean, data: TaskDistribution[] }>(
          `${runtimeConfig.public.apiBaseUrl}/reports/task-distribution/${projectId}`,
          { withCredentials: true }
        );
        
        this.taskDistribution = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Error fetching task distribution data';
        console.error('Error fetching task distribution:', error);
      } finally {
        this.loading.taskDistribution = false;
      }
    },
    
    async fetchTimeTracking(params: TimeTrackingParams = {}): Promise<void> {
      this.loading.timeTracking = true;
      this.error = null;
      
      try {
        const runtimeConfig = useRuntimeConfig();
        const queryParams = new URLSearchParams();
        
        if (params.projectId) queryParams.append('projectId', params.projectId.toString());
        if (params.userId) queryParams.append('userId', params.userId.toString());
        if (params.days) queryParams.append('days', params.days.toString());
        
        const url = `${runtimeConfig.public.apiBaseUrl}/reports/time-tracking?${queryParams.toString()}`;
        
        const response = await axios.get<{ success: boolean, data: TimeTracking }>(
          url, 
          { withCredentials: true }
        );
        
        this.timeTracking = response.data.data;
      } catch (error: any) {
        this.error = error.response?.data?.error || 'Error fetching time tracking data';
        console.error('Error fetching time tracking:', error);
      } finally {
        this.loading.timeTracking = false;
      }
    }
  }
});