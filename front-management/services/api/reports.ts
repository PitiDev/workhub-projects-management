// services/api/reports.ts
import apiClient from './client';

export const reportsAPI = {
  // Get user assignment statistics for a team
  getUserAssignments: async (teamId: number) => {
    try {
      const response = await apiClient.get(`/reports/user-assignments/${teamId}`);
      console.log('Raw API response in getUserAssignments:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error in reportsAPI.getUserAssignments(${teamId}):`, error);
      throw error;
    }
  },

  // Get project completion statistics for a team
  getProjectCompletion: async (teamId: number) => {
    try {
      const response = await apiClient.get(`/reports/project-completion/${teamId}`);
      console.log('Raw API response in getProjectCompletion:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error in reportsAPI.getProjectCompletion(${teamId}):`, error);
      throw error;
    }
  },

  // Get user activity statistics for a team
  getUserActivity: async (teamId: number, params?: { days?: number }) => {
    try {
      const response = await apiClient.get(`/reports/user-activity/${teamId}`, { params });
      console.log('Raw API response in getUserActivity:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error in reportsAPI.getUserActivity(${teamId}):`, error);
      throw error;
    }
  },

  // Get task status distribution for a project
  getTaskDistribution: async (projectId: number) => {
    try {
      const response = await apiClient.get(`/reports/task-distribution/${projectId}`);
      console.log('Raw API response in getTaskDistribution:', response.data);
      return response.data;
    } catch (error) {
      console.error(`Error in reportsAPI.getTaskDistribution(${projectId}):`, error);
      throw error;
    }
  },

  // Get time tracking statistics
  getTimeTracking: async (params?: { projectId?: number; userId?: number; days?: number }) => {
    try {
      const response = await apiClient.get('/reports/time-tracking', { params });
      console.log('Raw API response in getTimeTracking:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in reportsAPI.getTimeTracking:', error);
      throw error;
    }
  }
};