// types/notification.ts
import type { User } from './auth';

export type NotificationType = 
  | 'task_assigned'
  | 'task_completed'
  | 'comment_added'
  | 'task_due_soon'
  | 'task_overdue'
  | 'mentioned'
  | 'project_member_added'
  | 'team_member_added';

export interface Notification {
  id: number;
  user_id: number;
  type: NotificationType;
  title: string;
  message: string;
  is_read: boolean;
  data: Record<string, any>;
  created_at: string;
  updated_at: string;
}

export interface NotificationWithUser extends Notification {
  user: User;
}

export interface NotificationsResponse {
  notifications: Notification[];
  total: number;
  unread_count: number;
}

export interface NotificationResponse {
  notification: Notification;
}

export interface NotificationState {
  notifications: Notification[];
  unreadCount: number;
  loading: boolean;
  error: string | null;
}