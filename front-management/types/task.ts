// types/task.ts
import type { Project, ProjectStatusColumn } from './project';
import type { User } from './auth';

export type TaskPriority = 'low' | 'medium' | 'high' | 'urgent';

export interface Task {
  id: number;
  title: string;
  description: string;
  project_id: number;
  status_id: number;
  assignee_id: number | null;
  reporter_id: number;
  due_date: string | null;
  priority: TaskPriority;
  estimated_hours: number | null;
  created_at: string;
  updated_at: string;
  project?: Project;
  status?: ProjectStatusColumn;
  assignee?: User;
  reporter?: User;
  comments?: TaskComment[];
  checklists?: TaskChecklist[];
  time_entries?: TimeEntry[];
  attachments?: TaskAttachment[];
  total_time_spent?: number;
  completion_percentage?: number;
}

export interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user: User;
}

export interface TaskChecklist {
  id: number;
  task_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  items: TaskChecklistItem[];
}

export interface TaskChecklistItem {
  id: number;
  checklist_id: number;
  content: string;
  is_completed: boolean;
  created_at: string;
  updated_at: string;
}

export interface TimeEntry {
  id: number;
  task_id: number;
  user_id: number;
  start_time: string;
  end_time: string | null;
  description: string | null;
  duration: number | null; // Duration in seconds
  created_at: string;
  updated_at: string;
  user: User;
}

export interface TaskAttachment {
  id: number;
  task_id: number;
  user_id: number;
  filename: string;
  original_filename: string;
  mime_type: string;
  size: number; // Size in bytes
  created_at: string;
  updated_at: string;
  user: User;
  url: string;
}

export interface TaskCreatePayload {
  title: string;
  description?: string;
  project_id: number;
  status_id: number;
  assignee_id?: number | null;
  due_date?: string | null;
  priority?: TaskPriority;
  estimated_hours?: number | null;
}

export interface TaskUpdatePayload {
  title?: string;
  description?: string;
  status_id?: number;
  assignee_id?: number | null;
  due_date?: string | null;
  priority?: TaskPriority;
  estimated_hours?: number | null;
}

export interface TaskCommentCreatePayload {
  content: string;
}

export interface TaskChecklistCreatePayload {
  title: string;
  items?: { content: string }[];
}

export interface TaskChecklistItemCreatePayload {
  content: string;
}

export interface TaskChecklistItemUpdatePayload {
  content?: string;
  is_completed?: boolean;
}

export interface TimeEntryCreatePayload {
  start_time: string;
  description?: string;
}

export interface TimeEntryUpdatePayload {
  end_time: string;
  description?: string;
}

export interface TasksResponse {
  tasks: Task[];
  total: number;
}

export interface TaskResponse {
  task: Task;
}

export interface TaskCommentsResponse {
  comments: TaskComment[];
  total: number;
}

export interface TaskCommentResponse {
  comment: TaskComment;
}

export interface TaskChecklistsResponse {
  checklists: TaskChecklist[];
}

export interface TaskChecklistResponse {
  checklist: TaskChecklist;
}

export interface TaskChecklistItemsResponse {
  items: TaskChecklistItem[];
}

export interface TaskChecklistItemResponse {
  item: TaskChecklistItem;
}

export interface TimeEntriesResponse {
  timeEntries: TimeEntry[];
  total: number;
  total_duration: number;
}

export interface TimeEntryResponse {
  timeEntry: TimeEntry;
}

export interface TaskAttachmentsResponse {
  attachments: TaskAttachment[];
  total: number;
}

export interface TaskAttachmentResponse {
  attachment: TaskAttachment;
}

export interface TaskState {
  tasks: Task[];
  currentTask: Task | null;
  taskComments: Record<number, TaskComment[]>;
  taskChecklists: Record<number, TaskChecklist[]>;
  taskTimeEntries: Record<number, TimeEntry[]>;
  taskAttachments: Record<number, TaskAttachment[]>;
  loading: boolean;
  error: string | null;
}