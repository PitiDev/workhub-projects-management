// services/api/analytics.ts
import apiClient from './client';

// Interfaces for analytics data
export interface OverviewStats {
  totalTasks: number;
  completedTasks: number;
  overdueTasks: number;
  productivity: number;
  taskGrowth: number;
  productivityChange: number;
  completionRate: number;
}

export interface TrendDataPoint {
  date: string;
  created: number;
  completed: number;
}

export interface StatusDistribution {
  name: string;
  value: number;
}

export interface ProjectProgress {
  name: string;
  completed: number;
  remaining: number;
}

export interface TeamPerformance {
  name: string;
  tasks_completed: number;
  on_time_rate: number;
  communication: number;
  quality: number;
  collaboration: number;
}

export interface PriorityDistribution {
  name: string;
  total: number;
  distribution: {
    high: number;
    medium: number;
    low: number;
  };
}

export interface ActivityItem {
  id: number;
  type: string;
  title: string;
  description: string;
  time: string;
  user: {
    id: number;
    name: string;
    initials?: string;
    image?: string | null;
  };
  iconPath?: string;
  iconColor?: string;
  iconBg?: string;
}

export const analyticsAPI = {
  // Get dashboard overview metrics
  getOverview: async (period: string = 'month', projectId?: number): Promise<OverviewStats> => {
    try {
      const params: any = { period };
      if (projectId) params.project_id = projectId;
      
      const response = await apiClient.get('/api/analytics/overview', { params });
      return response.data;
    } catch (error) {
      console.error('Error in analyticsAPI.getOverview:', error);
      throw error;
    }
  },
  
  // Get task completion trend data
  getTaskCompletionTrend: async (period: string = 'month', projectId?: number): Promise<TrendDataPoint[]> => {
    try {
      const params: any = { period };
      if (projectId) params.project_id = projectId;
      
      const response = await apiClient.get('/api/analytics/tasks/trend', { params });
      return response.data;
    } catch (error) {
      console.error('Error in analyticsAPI.getTaskCompletionTrend:', error);
      throw error;
    }
  },
  
  // Get task status distribution
  getTaskStatusDistribution: async (projectId?: number): Promise<StatusDistribution[]> => {
    try {
      const params: any = {};
      if (projectId) params.project_id = projectId;
      
      const response = await apiClient.get('/api/analytics/tasks/status-distribution', { params });
      return response.data;
    } catch (error) {
      console.error('Error in analyticsAPI.getTaskStatusDistribution:', error);
      throw error;
    }
  },
  
  // Get project progress data
  getProjectProgress: async (): Promise<ProjectProgress[]> => {
    try {
      const response = await apiClient.get('/api/analytics/projects/progress');
      return response.data;
    } catch (error) {
      console.error('Error in analyticsAPI.getProjectProgress:', error);
      throw error;
    }
  },
  
  // Get team performance metrics
  getTeamPerformance: async (period: string = 'month'): Promise<TeamPerformance[]> => {
    try {
      const response = await apiClient.get('/api/analytics/team/performance', { 
        params: { period } 
      });
      return response.data;
    } catch (error) {
      console.error('Error in analyticsAPI.getTeamPerformance:', error);
      throw error;
    }
  },
  
  // Get task priority distribution by project
  getTaskPriorityDistribution: async (): Promise<PriorityDistribution[]> => {
    try {
      const response = await apiClient.get('/api/analytics/tasks/priority-distribution');
      return response.data;
    } catch (error) {
      console.error('Error in analyticsAPI.getTaskPriorityDistribution:', error);
      throw error;
    }
  },
  
  // Get recent activity
  getRecentActivity: async (limit: number = 5): Promise<ActivityItem[]> => {
    try {
      const response = await apiClient.get('/api/analytics/activity', { 
        params: { limit } 
      });
      
      // Process activity items to add UI-specific properties
      const activities = response.data.map((activity: ActivityItem) => {
        const iconInfo = getActivityTypeIcon(activity.type);
        return {
          ...activity,
          ...iconInfo
        };
      });
      
      return activities;
    } catch (error) {
      console.error('Error in analyticsAPI.getRecentActivity:', error);
      throw error;
    }
  },
  
  // Get burndown data for specific project
  getBurndownChart: async (projectId: number, period: string = 'month') => {
    try {
      const response = await apiClient.get(`/api/analytics/projects/${projectId}/burndown`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error(`Error in analyticsAPI.getBurndownChart(${projectId}):`, error);
      throw error;
    }
  },
  
  // Get user productivity metrics
  getUserProductivity: async (userId: number, period: string = 'month') => {
    try {
      const response = await apiClient.get(`/api/analytics/users/${userId}/productivity`, {
        params: { period }
      });
      return response.data;
    } catch (error) {
      console.error(`Error in analyticsAPI.getUserProductivity(${userId}):`, error);
      throw error;
    }
  },
  
  // Get task completion by assignee 
  getTaskCompletionByAssignee: async (period: string = 'month', projectId?: number) => {
    try {
      const params: any = { period };
      if (projectId) params.project_id = projectId;
      
      const response = await apiClient.get('/api/analytics/tasks/by-assignee', { params });
      return response.data;
    } catch (error) {
      console.error('Error in analyticsAPI.getTaskCompletionByAssignee:', error);
      throw error;
    }
  },
  
  // Get task growth over time
  getTaskGrowthTrend: async (period: string = 'month', projectId?: number) => {
    try {
      const params: any = { period };
      if (projectId) params.project_id = projectId;
      
      const response = await apiClient.get('/api/analytics/tasks/growth', { params });
      return response.data;
    } catch (error) {
      console.error('Error in analyticsAPI.getTaskGrowthTrend:', error);
      throw error;
    }
  }
};

// Helper function to get activity icon properties
function getActivityTypeIcon(type: string) {
  switch (type) {
    case 'task_created':
      return {
        iconPath: 'M12 4v16m8-8H4',
        iconColor: 'text-primary-500',
        iconBg: 'bg-primary-100 dark:bg-primary-900/20'
      };
    case 'comment_added':
      return {
        iconPath: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
        iconColor: 'text-blue-500',
        iconBg: 'bg-blue-100 dark:bg-blue-900/20'
      };
    case 'file_uploaded':
      return {
        iconPath: 'M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
        iconColor: 'text-purple-500',
        iconBg: 'bg-purple-100 dark:bg-purple-900/20'
      };
    case 'task_completed':
      return {
        iconPath: 'M5 13l4 4L19 7',
        iconColor: 'text-green-500',
        iconBg: 'bg-green-100 dark:bg-green-900/20'
      };
    case 'task_updated':
      return {
        iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
        iconColor: 'text-yellow-500',
        iconBg: 'bg-yellow-100 dark:bg-yellow-900/20'
      };
    default:
      return {
        iconPath: 'M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z',
        iconColor: 'text-gray-500',
        iconBg: 'bg-gray-100 dark:bg-gray-900/20'
      };
  }
}

export default analyticsAPI;