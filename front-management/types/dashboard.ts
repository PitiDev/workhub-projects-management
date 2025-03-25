// types/dashboard.ts
import type { Project } from './project';
import type { Task } from './task';
import type { User } from './auth';
import type { Team } from './team';

export interface DashboardSummary {
  total_projects: number;
  active_projects: number;
  total_tasks: number;
  completed_tasks: number;
  overdue_tasks: number;
  upcoming_tasks: number; // Tasks due in the next 7 days
  total_teams: number;
  recent_activity: ActivityItem[];
}

export interface ActivityItem {
  id: number;
  user_id: number;
  action_type: ActivityActionType;
  entity_type: 'project' | 'task' | 'team' | 'comment';
  entity_id: number;
  details: Record<string, any>;
  created_at: string;
  user?: User;
}

export type ActivityActionType = 
  | 'created'
  | 'updated'
  | 'deleted'
  | 'completed'
  | 'assigned'
  | 'commented'
  | 'status_changed'
  | 'joined'
  | 'left';

export interface UserWorkload {
  user: User;
  assigned_tasks_count: number;
  overdue_tasks_count: number;
  completed_tasks_this_week: number;
  total_time_spent_this_week: number; // In seconds
}

export interface ProjectStats {
  project: Project;
  tasks_count: number;
  completed_tasks_count: number;
  completion_percentage: number;
  overdue_tasks_count: number;
  team_members_count: number;
}

export interface RecentTask extends Task {
  project_name: string;
  status_name: string;
}

export interface UserStats {
  tasks_created_count: number;
  tasks_completed_count: number;
  tasks_in_progress_count: number;
  total_time_logged: number; // In seconds
  tasks_by_priority: {
    low: number;
    medium: number;
    high: number;
    urgent: number;
  };
}

export interface TimeSpentByProject {
  project_id: number;
  project_name: string;
  time_spent: number; // In seconds
  percentage: number;
}

export interface TeamOverview {
  team: Team;
  members_count: number;
  projects_count: number;
  tasks_count: number;
  completed_tasks_count: number;
  completion_percentage: number;
}

export interface DashboardResponse {
  summary: DashboardSummary;
}

export interface UserWorkloadResponse {
  workloads: UserWorkload[];
}

export interface ProjectStatsResponse {
  stats: ProjectStats[];
}

export interface RecentTasksResponse {
  tasks: RecentTask[];
}

export interface UserStatsResponse {
  stats: UserStats;
}

export interface TimeSpentByProjectResponse {
  data: TimeSpentByProject[];
}

export interface TeamOverviewResponse {
  teams: TeamOverview[];
}