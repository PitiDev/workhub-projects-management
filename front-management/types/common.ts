// types/common.ts

// Pagination parameters for API requests
export interface PaginationParams {
    page?: number;
    limit?: number;
  }
  
  // Sorting parameters for API requests
  export interface SortingParams {
    sort_by?: string;
    sort_direction?: 'asc' | 'desc';
  }
  
  // Filter parameters for API requests
  export interface FilterParams {
    [key: string]: any;
  }
  
  // Standard API request parameters combining pagination, sorting, and filtering
  export interface RequestParams extends PaginationParams, SortingParams, FilterParams {}
  
  // Standard pagination metadata returned in API responses
  export interface PaginationMeta {
    total: number;
    page: number;
    limit: number;
    total_pages: number;
  }
  
  // Base API response structure
  export interface ApiResponse<T> {
    success: boolean;
    data?: T;
    meta?: PaginationMeta;
    error?: string;
    message?: string;
  }
  
  // API error response
  export interface ApiError {
    error: string;
    details?: {
      field: string;
      message: string;
    }[];
  }
  
  // Socket.IO events
  export enum SocketEvents {
    // Authentication events
    CONNECT = 'connect',
    DISCONNECT = 'disconnect',
    CONNECT_ERROR = 'connect_error',
    
    // Project events
    JOIN_PROJECT = 'join-project',
    LEAVE_PROJECT = 'leave-project',
    TASK_CREATED = 'task-created',
    TASK_UPDATED = 'task-updated',
    TASK_DELETED = 'task-deleted',
    
    // Task events
    CREATE_TASK = 'create-task',
    UPDATE_TASK = 'update-task',
    DELETE_TASK = 'delete-task',
    ADD_COMMENT = 'add-comment',
    
    // Notification events
    SUBSCRIBE_NOTIFICATIONS = 'subscribe-notifications',
    NEW_NOTIFICATION = 'new-notification',
    NOTIFICATION_COUNT = 'notification-count',
    MARK_NOTIFICATION_READ = 'mark-notification-read',
    MARK_ALL_NOTIFICATIONS_READ = 'mark-all-notifications-read'
  }
  
  // Color options for projects and statuses
  export type ColorOption = 
    | 'blue'
    | 'green'
    | 'red'
    | 'yellow'
    | 'purple'
    | 'pink'
    | 'indigo'
    | 'teal'
    | 'orange'
    | 'gray';
  
  // Map of color options to their corresponding hex values and tailwind classes
  export const colorMap: Record<ColorOption, { hex: string; class: string }> = {
    blue: { hex: '#3b82f6', class: 'bg-blue-500' },
    green: { hex: '#10b981', class: 'bg-green-500' },
    red: { hex: '#ef4444', class: 'bg-red-500' },
    yellow: { hex: '#f59e0b', class: 'bg-yellow-500' },
    purple: { hex: '#8b5cf6', class: 'bg-purple-500' },
    pink: { hex: '#ec4899', class: 'bg-pink-500' },
    indigo: { hex: '#6366f1', class: 'bg-indigo-500' },
    teal: { hex: '#14b8a6', class: 'bg-teal-500' },
    orange: { hex: '#f97316', class: 'bg-orange-500' },
    gray: { hex: '#6b7280', class: 'bg-gray-500' }
  };
  
  // Map of task priorities to their corresponding colors and icons
  export const priorityMap: Record<string, { label: string; color: string; icon: string }> = {
    low: { 
      label: 'Low', 
      color: 'bg-blue-100 text-blue-800', 
      icon: 'arrow-down' 
    },
    medium: { 
      label: 'Medium', 
      color: 'bg-green-100 text-green-800', 
      icon: 'minus' 
    },
    high: { 
      label: 'High', 
      color: 'bg-orange-100 text-orange-800', 
      icon: 'arrow-up' 
    },
    urgent: { 
      label: 'Urgent', 
      color: 'bg-red-100 text-red-800', 
      icon: 'alert-circle' 
    }
  };
  
  // Types for form validation
  export interface ValidationRule {
    required?: boolean;
    minLength?: number;
    maxLength?: number;
    min?: number;
    max?: number;
    pattern?: RegExp;
    email?: boolean;
    match?: string;
    custom?: (value: any) => boolean | string;
  }
  
  export interface ValidationResult {
    valid: boolean;
    errors: Record<string, string>;
  }
  
  // Theme configuration
  export interface ThemeConfig {
    dark: boolean;
    sidebar: {
      expanded: boolean;
    };
    layout: 'default' | 'compact' | 'comfortable';
  }