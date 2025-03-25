// stores/tasks.ts
import { defineStore } from 'pinia';

// Define types locally instead of importing from a problematic module
interface Task {
  id: number;
  title: string;
  description?: string;
  project_id: number;
  status_id: number;
  type_id?: number;
  priority_id?: number;
  parent_task_id?: number;
  assignee_id?: number;
  estimated_time?: number;
  start_date?: string;
  due_date?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  [key: string]: any; // Allow other properties
}

interface TaskComment {
  id: number;
  task_id: number;
  user_id: number;
  content: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  [key: string]: any; // Allow other properties
}

interface ChecklistItem {
  id: number;
  checklist_id: number;
  content: string;
  is_completed: boolean;
  order_position: number;
  created_at: string;
  updated_at: string;
  [key: string]: any; // Allow other properties
}

interface TaskChecklist {
  id: number;
  task_id: number;
  title: string;
  created_at: string;
  updated_at: string;
  items: ChecklistItem[];
  [key: string]: any; // Allow other properties
}

interface TimeEntry {
  id: number;
  task_id: number;
  user_id: number;
  start_time: string;
  end_time?: string;
  duration?: number;
  description?: string;
  created_at: string;
  updated_at: string;
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    profile_image?: string;
  };
  [key: string]: any; // Allow other properties
}

interface TasksState {
  tasks: Task[];
  currentTask: Task | null;
  taskComments: Record<number, TaskComment[]>;
  taskChecklists: Record<number, TaskChecklist[]>;
  taskTimeEntries: Record<number, TimeEntry[]>;
  loading: boolean;
  error: string | null;
}

export const useTasksStore = defineStore('tasks', {
  state: (): TasksState => ({
    tasks: [],
    currentTask: null,
    taskComments: {},
    taskChecklists: {},
    taskTimeEntries: {},
    loading: false,
    error: null
  }),
  
  getters: {
    getTasks: (state) => state.tasks,
    getTasksByProjectId: (state) => (projectId: number) => state.tasks.filter((task) => task.project_id === projectId),
    getTasksByStatusId: (state) => (statusId: number) => state.tasks.filter((task) => task.status_id === statusId),
    getCurrentTask: (state) => state.currentTask,
    getTaskComments: (state) => (taskId: number) => state.taskComments[taskId] || [],
    getTaskChecklists: (state) => (taskId: number) => state.taskChecklists[taskId] || [],
    getTaskTimeEntries: (state) => (taskId: number) => state.taskTimeEntries[taskId] || [],
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  },
  
  actions: {
    setTasks(tasks: Task[]) {
      this.tasks = tasks;
    },
    
    setCurrentTask(task: Task) {
      this.currentTask = task;
    },
    
    addTask(task: Task) {
      this.tasks.push(task);
    },
    
    updateTask(id: number, updatedTask: Partial<Task>) {
      const index = this.tasks.findIndex((task) => task.id === id);
      if (index !== -1) {
        this.tasks[index] = { ...this.tasks[index], ...updatedTask };
      }
      
      if (this.currentTask && this.currentTask.id === id) {
        this.currentTask = { ...this.currentTask, ...updatedTask };
      }
    },
    
    removeTask(id: number) {
      this.tasks = this.tasks.filter((task) => task.id !== id);
      
      if (this.currentTask && this.currentTask.id === id) {
        this.currentTask = null;
      }
      
      // Clean up related data
      if (this.taskComments[id]) {
        delete this.taskComments[id];
      }
      
      if (this.taskChecklists[id]) {
        delete this.taskChecklists[id];
      }
      
      if (this.taskTimeEntries[id]) {
        delete this.taskTimeEntries[id];
      }
    },
    
    setTaskComments(taskId: number, comments: TaskComment[]) {
      this.taskComments[taskId] = comments;
    },
    
    addTaskComment(taskId: number, comment: TaskComment) {
      if (!this.taskComments[taskId]) {
        this.taskComments[taskId] = [];
      }
      this.taskComments[taskId].push(comment);
    },
    
    setTaskChecklists(taskId: number, checklists: TaskChecklist[]) {
      this.taskChecklists[taskId] = checklists;
    },
    
    addTaskChecklist(taskId: number, checklist: TaskChecklist) {
      if (!this.taskChecklists[taskId]) {
        this.taskChecklists[taskId] = [];
      }
      this.taskChecklists[taskId].push(checklist);
    },
    
    setTaskTimeEntries(taskId: number, timeEntries: TimeEntry[]) {
      this.taskTimeEntries[taskId] = timeEntries;
    },
    
    addTimeEntry(taskId: number, timeEntry: TimeEntry) {
      if (!this.taskTimeEntries[taskId]) {
        this.taskTimeEntries[taskId] = [];
      }
      this.taskTimeEntries[taskId].push(timeEntry);
    },
    
    updateTimeEntry(taskId: number, timeEntryId: number, updatedTimeEntry: TimeEntry) {
      if (this.taskTimeEntries[taskId]) {
        const index = this.taskTimeEntries[taskId].findIndex((entry) => entry.id === timeEntryId);
        if (index !== -1) {
          this.taskTimeEntries[taskId][index] = { ...this.taskTimeEntries[taskId][index], ...updatedTimeEntry };
        }
      }
    },
    
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    
    setError(error: string | null) {
      this.error = error;
    }
  }
});