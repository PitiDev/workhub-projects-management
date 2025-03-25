// services/api/teams.ts
import apiClient from './client';

export const teamsAPI = {
  // Get all teams - directly returning the full response for debugging
  getAll: async (params?: any) => {
    try {
      const response = await apiClient.get('/teams', { params });
      console.log('Raw API response in service:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error in teamsAPI.getAll:', error);
      throw error;
    }
  },
  
  // Get team by ID
  getById: async (id: number) => {
    try {
      const response = await apiClient.get(`/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error in teamsAPI.getById(${id}):`, error);
      throw error;
    }
  },
  
  // Create a new team
  create: async (data: { name: string; description: string }) => {
    try {
      const response = await apiClient.post('/teams', data);
      return response.data;
    } catch (error) {
      console.error('Error in teamsAPI.create:', error);
      throw error;
    }
  },
  
  // Update a team
  update: async (id: number, data: { name?: string; description?: string }) => {
    try {
      const response = await apiClient.put(`/teams/${id}`, data);
      return response.data;
    } catch (error) {
      console.error(`Error in teamsAPI.update(${id}):`, error);
      throw error;
    }
  },
  
  // Delete a team
  delete: async (id: number) => {
    try {
      const response = await apiClient.delete(`/teams/${id}`);
      return response.data;
    } catch (error) {
      console.error(`Error in teamsAPI.delete(${id}):`, error);
      throw error;
    }
  },
  
  // Get team members
  getMembers: async (teamId: number) => {
    try {
      const response = await apiClient.get(`/teams/${teamId}/members`);
      return response.data;
    } catch (error) {
      console.error(`Error in teamsAPI.getMembers(${teamId}):`, error);
      throw error;
    }
  },
  
  // Add a member to a team
  addMember: async (teamId: number, userId: number, role: string) => {
    try {
      const response = await apiClient.post(`/teams/${teamId}/members`, { user_id: userId, role });
      return response.data;
    } catch (error) {
      console.error(`Error in teamsAPI.addMember(${teamId}, ${userId}):`, error);
      throw error;
    }
  },
  
  // Update a member's role
  updateMemberRole: async (teamId: number, userId: number, role: string) => {
    try {
      const response = await apiClient.put(`/teams/${teamId}/members/${userId}`, { role });
      return response.data;
    } catch (error) {
      console.error(`Error in teamsAPI.updateMemberRole(${teamId}, ${userId}):`, error);
      throw error;
    }
  },
  
  // Remove a member from a team
  removeMember: async (teamId: number, userId: number) => {
    try {
      const response = await apiClient.delete(`/teams/${teamId}/members/${userId}`);
      return response.data;
    } catch (error) {
      console.error(`Error in teamsAPI.removeMember(${teamId}, ${userId}):`, error);
      throw error;
    }
  }
};