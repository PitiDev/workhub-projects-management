// composables/useProjects.ts
import { useProjectsStore } from '~/stores/projects';

// Define a minimal interface for project creation payload
interface ProjectCreatePayload {
  name: string;
  description?: string;
  color?: string;
  team_id: number;
  [key: string]: any;
}

export function useProjects() {
  const { $api } = useNuxtApp();
  const projectsStore = useProjectsStore();
  
  const fetchProjects = async () => {
    try {
      projectsStore.setLoading(true);
      const response = await $api.get('/projects');
      projectsStore.setProjects(response.data.projects);
      return response.data.projects;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch projects';
      projectsStore.setError(errorMessage);
      return [];
    } finally {
      projectsStore.setLoading(false);
    }
  };
  
  const fetchProjectById = async (id: number) => {
    try {
      projectsStore.setLoading(true);
      const response = await $api.get(`/projects/${id}`);
      projectsStore.setCurrentProject(response.data.project);
      return response.data.project;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch project';
      projectsStore.setError(errorMessage);
      return null;
    } finally {
      projectsStore.setLoading(false);
    }
  };
  
  const createProject = async (payload: ProjectCreatePayload) => {
    try {
      projectsStore.setLoading(true);
      const response = await $api.post('/projects', payload);
      projectsStore.addProject(response.data.project);
      return { success: true, project: response.data.project };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to create project';
      projectsStore.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      projectsStore.setLoading(false);
    }
  };
  
  const updateProject = async (id: number, payload: Partial<ProjectCreatePayload & { status?: string }>) => {
    try {
      projectsStore.setLoading(true);
      const response = await $api.put(`/projects/${id}`, payload);
      projectsStore.updateProject(id, response.data.project);
      return { success: true, project: response.data.project };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update project';
      projectsStore.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      projectsStore.setLoading(false);
    }
  };
  
  const deleteProject = async (id: number) => {
    try {
      projectsStore.setLoading(true);
      await $api.delete(`/projects/${id}`);
      projectsStore.removeProject(id);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete project';
      projectsStore.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      projectsStore.setLoading(false);
    }
  };
  
  // Task Status Management
  
  const fetchProjectStatuses = async (projectId: number) => {
    try {
      projectsStore.setLoading(true);
      const response = await $api.get(`/projects/${projectId}/statuses`);
      // Handle both response formats: { statuses: [...] } or direct array [...]
      const statuses = Array.isArray(response.data) ? response.data : response.data.statuses;
      projectsStore.setProjectStatuses(projectId, statuses);
      return statuses;
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to fetch project statuses';
      projectsStore.setError(errorMessage);
      return [];
    } finally {
      projectsStore.setLoading(false);
    }
  };
  
  const createProjectStatus = async (projectId: number, payload: { name: string; color: string; order_position?: number }) => {
    try {
      projectsStore.setLoading(true);
      // Add the project_id to the payload
      const response = await $api.post(`/projects/${projectId}/statuses`, payload);
      // Handle both response formats: { status: {...} } or direct object {...}
      const status = response.data.status || response.data;
      projectsStore.addProjectStatus(projectId, status);
      return { success: true, status };
    } catch (error: any) {
      console.error('Error creating status:', error.response?.data || error);
      const errorMessage = error.response?.data?.error || 'Failed to create project status';
      projectsStore.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      projectsStore.setLoading(false);
    }
  };

  
  const updateProjectStatus = async (
    projectId: number,
    statusId: number,
    payload: { name?: string; color?: string; order_position?: number }
  ) => {
    try {
      projectsStore.setLoading(true);
      const response = await $api.put(`/projects/${projectId}/statuses/${statusId}`, payload);
      // Handle both response formats: { status: {...} } or direct object {...}
      const status = response.data.status || response.data;
      projectsStore.updateProjectStatus(projectId, statusId, status);
      return { success: true, status };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to update project status';
      projectsStore.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      projectsStore.setLoading(false);
    }
  };
  
  const deleteProjectStatus = async (projectId: number, statusId: number) => {
    try {
      projectsStore.setLoading(true);
      await $api.delete(`/projects/${projectId}/statuses/${statusId}`);
      projectsStore.removeProjectStatus(projectId, statusId);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to delete project status';
      projectsStore.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      projectsStore.setLoading(false);
    }
  };

  
  
  const reorderProjectStatuses = async (projectId: number, statusOrder: number[]) => {
    try {
      projectsStore.setLoading(true);
      await $api.put(`/projects/${projectId}/statuses/reorder`, { statusOrder });
      // Update local store with the new order
      await fetchProjectStatuses(projectId);
      return { success: true };
    } catch (error: any) {
      const errorMessage = error.response?.data?.error || 'Failed to reorder project statuses';
      projectsStore.setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      projectsStore.setLoading(false);
    }
  };
  
  return {
    // Project methods
    fetchProjects,
    fetchProjectById,
    createProject,
    updateProject,
    deleteProject,
    
    // Task Status methods
    fetchProjectStatuses,
    createProjectStatus,
    updateProjectStatus,
    deleteProjectStatus,
    reorderProjectStatuses,
  };
}