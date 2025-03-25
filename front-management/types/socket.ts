// types/socket.ts
import type { Task, TaskComment } from './task';
import type { Notification } from './notification';

// Payload for joining a project room
export interface JoinProjectPayload {
  projectId: number;
}

// Payload for leaving a project room
export interface LeaveProjectPayload {
  projectId: number;
}

// Socket event for task created
export interface TaskCreatedEvent {
  task: Task;
  projectId: number;
}

// Socket event for task updated
export interface TaskUpdatedEvent {
  task: Task;
  projectId: number;
  changes: Partial<Task>;
}

// Socket event for task deleted
export interface TaskDeletedEvent {
  taskId: number;
  projectId: number;
}

// Payload for creating a task via socket
export interface CreateTaskPayload {
  title: string;
  description?: string;
  project_id: number;
  status_id: number;
  assignee_id?: number;
  due_date?: string;
  priority?: string;
  estimated_hours?: number;
}

// Payload for updating a task via socket
export interface UpdateTaskPayload {
  taskId: number;
  title?: string;
  description?: string;
  status_id?: number;
  assignee_id?: number;
  due_date?: string;
  priority?: string;
  estimated_hours?: number;
}

// Payload for deleting a task via socket
export interface DeleteTaskPayload {
  taskId: number;
}

// Payload for adding a comment via socket
export interface AddCommentPayload {
  taskId: number;
  content: string;
}

// Socket event for comment added
export interface CommentAddedEvent {
  comment: TaskComment;
  taskId: number;
  projectId: number;
}

// Socket event for new notification
export interface NewNotificationEvent {
  notification: Notification;
}

// Socket event for notification count
export interface NotificationCountEvent {
  count: number;
}

// Payload for marking a notification as read
export interface MarkNotificationReadPayload {
  notificationId: number;
}

// Socket event for notification marked as read
export interface NotificationMarkedReadEvent {
  notificationId: number;
}

// Socket event for all notifications marked as read
export interface AllNotificationsMarkedReadEvent {
  userId: number;
}

// Type for socket connection status
export type SocketConnectionStatus = 'connected' | 'disconnected' | 'connecting' | 'error';

// Interface for socket service
export interface SocketService {
  connectSocket: () => void;
  disconnectSocket: () => void;
  getSocket: () => any;
  joinProjectRoom: (projectId: number) => void;
  leaveProjectRoom: (projectId: number) => void;
  subscribeToNotifications: () => void;
  markNotificationRead: (notificationId: number) => void;
  markAllNotificationsRead: () => void;
  onTaskCreated: (callback: (event: TaskCreatedEvent) => void) => void;
  onTaskUpdated: (callback: (event: TaskUpdatedEvent) => void) => void;
  onTaskDeleted: (callback: (event: TaskDeletedEvent) => void) => void;
  onNewNotification: (callback: (event: NewNotificationEvent) => void) => void;
  onNotificationCount: (callback: (event: NotificationCountEvent) => void) => void;
  createTask: (payload: CreateTaskPayload) => void;
  updateTask: (payload: UpdateTaskPayload) => void;
  deleteTask: (payload: DeleteTaskPayload) => void;
  addComment: (payload: AddCommentPayload) => void;
  offAllEvents: () => void;
  getConnectionStatus: () => SocketConnectionStatus;
}

// Socket state for store
export interface SocketState {
  connected: boolean;
  connectionStatus: SocketConnectionStatus;
  notifications: Notification[];
  unreadCount: number;
  error: string | null;
}