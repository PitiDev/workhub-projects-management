// stores/projects.ts
import { defineStore } from 'pinia';
import axios from 'axios';
import { useRuntimeConfig } from '#app';

// Define types locally instead of importing from a problematic module
interface Project {
  id: number;
  name: string;
  description?: string;
  color?: string;
  icon?: string;
  team_id: number;
  is_private?: boolean;
  status: 'active' | 'completed' | 'archived';
  created_by: number;
  created_at: string;
  updated_at: string;
  team?: any;
  team_members?: any[];
  statuses?: ProjectStatus[];
  due_date?: string;
  [key: string]: any; // Allow other properties
}

interface ProjectStatus {
  id: number;
  project_id: number;
  name: string;
  color: string;
  order_position: number;
  created_at?: string;
  updated_at?: string;
  [key: string]: any; // Allow other properties
}

interface ProjectsState {
  projects: Project[];
  currentProject: Project | null;
  projectStatuses: Record<number, ProjectStatus[]>;
  loading: boolean;
  error: string | null;
}

export const useProjectsStore = defineStore('projects', {
  state: (): ProjectsState => ({
    projects: [],
    currentProject: null,
    projectStatuses: {},
    loading: false,
    error: null
  }),

  getters: {
    getProjects: (state) => state.projects,
    getCurrentProject: (state) => state.currentProject,
    getProjectStatuses: (state) => (projectId: number) => state.projectStatuses[projectId] || [],
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  },

  actions: {
    setProjects(projects: Project[]) {
      this.projects = projects;
    },

    setCurrentProject(project: Project) {
      this.currentProject = project;
    },

    addProject(project: Project) {
      this.projects.push(project);
    },

    updateProject(id: number, updatedProject: Project) {
      const index = this.projects.findIndex((project) => project.id === id);
      if (index !== -1) {
        this.projects[index] = { ...this.projects[index], ...updatedProject };
      }

      if (this.currentProject && this.currentProject.id === id) {
        this.currentProject = { ...this.currentProject, ...updatedProject };
      }
    },

    removeProject(id: number) {
      this.projects = this.projects.filter((project) => project.id !== id);

      if (this.currentProject && this.currentProject.id === id) {
        this.currentProject = null;
      }

      // Clean up project statuses
      if (this.projectStatuses[id]) {
        delete this.projectStatuses[id];
      }
    },

    setProjectStatuses(projectId: number, statuses: ProjectStatus[]) {
      this.projectStatuses[projectId] = statuses;
    },

    addProjectStatus(projectId: number, status: ProjectStatus) {
      if (!this.projectStatuses[projectId]) {
        this.projectStatuses[projectId] = [];
      }
      this.projectStatuses[projectId].push(status);
      // Sort by order_position
      this.projectStatuses[projectId].sort((a, b) => a.order_position - b.order_position);
    },

    updateProjectStatus(projectId: number, statusId: number, updatedStatus: ProjectStatus) {
      if (this.projectStatuses[projectId]) {
        const index = this.projectStatuses[projectId].findIndex((status) => status.id === statusId);
        if (index !== -1) {
          this.projectStatuses[projectId][index] = { ...this.projectStatuses[projectId][index], ...updatedStatus };
        }
        // Sort by order_position
        this.projectStatuses[projectId].sort((a, b) => a.order_position - b.order_position);
      }
    },

    removeProjectStatus(projectId: number, statusId: number) {
      if (this.projectStatuses[projectId]) {
        this.projectStatuses[projectId] = this.projectStatuses[projectId].filter((status) => status.id !== statusId);
      }
    },

    setLoading(loading: boolean) {
      this.loading = loading;
    },

    setError(error: string | null) {
      this.error = error;
    },

    // Add API methods needed for the reports page
    async fetchProjects(teamId?: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const runtimeConfig = useRuntimeConfig();
        const url = teamId 
          ? `${runtimeConfig.public.apiBaseUrl}/projects?team_id=${teamId}` 
          : `${runtimeConfig.public.apiBaseUrl}/projects`;
        
        const response = await axios.get(url, { withCredentials: true });
        
        if (response.data && response.data.data) {
          this.setProjects(response.data.data);
        }
        
        return this.projects;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Error fetching projects';
        this.setError(errorMessage);
        console.error('Error fetching projects:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    },
    
    async fetchProject(projectId: number) {
      this.loading = true;
      this.error = null;
      
      try {
        const runtimeConfig = useRuntimeConfig();
        const response = await axios.get(
          `${runtimeConfig.public.apiBaseUrl}/projects/${projectId}`,
          { withCredentials: true }
        );
        
        if (response.data && response.data.data) {
          this.setCurrentProject(response.data.data);
        }
        
        return this.currentProject;
      } catch (error: any) {
        const errorMessage = error.response?.data?.error || 'Error fetching project';
        this.setError(errorMessage);
        console.error('Error fetching project:', error);
        throw error;
      } finally {
        this.loading = false;
      }
    }
  }
});