// types/project.ts
import type { Team } from './team';
import type { User } from './auth';

export type ProjectStatus = 'active' | 'archived' | 'completed';

export interface Project {
  id: number;
  name: string;
  description: string;
  color: string;
  team_id: number;
  status: ProjectStatus;
  created_by: number;
  created_at: string;
  updated_at: string;
  team?: Team;
  user?: User;
  statuses?: ProjectStatusColumn[];
  tasks_count?: number;
}

export interface ProjectStatusColumn {
  id: number;
  project_id: number;
  name: string;
  color: string;
  order_position: number;
  created_at: string;
  updated_at: string;
  tasks_count?: number;
}

export interface ProjectCreatePayload {
  name: string;
  description: string;
  color: string;
  team_id: number;
}

export interface ProjectUpdatePayload {
  name?: string;
  description?: string;
  color?: string;
  status?: ProjectStatus;
}

export interface ProjectStatusCreatePayload {
  name: string;
  color: string;
  order_position?: number;
}

export interface ProjectStatusUpdatePayload {
  name?: string;
  color?: string;
  order_position?: number;
}

export interface StatusReorderPayload {
  statusOrder: number[];
}

export interface ProjectsResponse {
  projects: Project[];
  total: number;
}

export interface ProjectResponse {
  project: Project;
}

export interface ProjectStatusesResponse {
  statuses: ProjectStatusColumn[];
}

export interface ProjectStatusResponse {
  status: ProjectStatusColumn;
}

export interface ProjectWithDetails extends Project {
  statuses: ProjectStatusColumn[];
}

export interface ProjectState {
  projects: Project[];
  currentProject: Project | null;
  projectStatuses: Record<number, ProjectStatusColumn[]>;
  loading: boolean;
  error: string | null;
}