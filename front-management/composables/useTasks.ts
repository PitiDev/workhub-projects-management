// composables/useTasks.ts
import { useTasksStore } from '~/stores/tasks';
import type { Task, TaskCreatePayload, TaskComment } from '~/types/task';

export function useTasks() {
  const { $api } = useNuxtApp();
  const tasksStore = useTasksStore();

  const fetchTasks = async (filters: Record<string, any> = {}) => {
    try {
      tasksStore.setLoading(true);
      const response = await $api.get('/tasks', { params: filters });
      tasksStore.setTasks(response.data.tasks);
      return response.data.tasks;
    } catch (error: any) {
      tasksStore.setError(error.response?.data?.error || 'Failed to fetch tasks');
      return [];
    } finally {
      tasksStore.setLoading(false);
    }
  };

  const fetchTasksByProject = async (projectId: number) => {
    return fetchTasks({ project_id: projectId });
  };

  const fetchTaskById = async (id: number) => {
    try {
      tasksStore.setLoading(true);
      const response = await $api.get(`/tasks/${id}`);
      tasksStore.setCurrentTask(response.data.task);
      return response.data.task;
    } catch (error: any) {
      tasksStore.setError(error.response?.data?.error || 'Failed to fetch task');
      return null;
    } finally {
      tasksStore.setLoading(false);
    }
  };

  const createTask = async (payload: TaskCreatePayload) => {
    try {
      tasksStore.setLoading(true);
      const response = await $api.post('/tasks', payload);
      tasksStore.addTask(response.data.task);
      return { success: true, task: response.data.task };
    } catch (error: any) {
      tasksStore.setError(error.response?.data?.error || 'Failed to create task');
      return { success: false, error: error.response?.data?.error || 'Failed to create task' };
    } finally {
      tasksStore.setLoading(false);
    }
  };

  const updateTask = async (id: number, payload: Partial<TaskCreatePayload>) => {
    try {
      tasksStore.setLoading(true);
      const response = await $api.put(`/tasks/${id}`, payload);
      tasksStore.updateTask(id, response.data.task);
      return { success: true, task: response.data.task };
    } catch (error: any) {
      tasksStore.setError(error.response?.data?.error || 'Failed to update task');
      return { success: false, error: error.response?.data?.error || 'Failed to update task' };
    } finally {
      tasksStore.setLoading(false);
    }
  };

  const deleteTask = async (id: number) => {
    try {
      tasksStore.setLoading(true);
      await $api.delete(`/tasks/${id}`);
      tasksStore.removeTask(id);
      return { success: true };
    } catch (error: any) {
      tasksStore.setError(error.response?.data?.error || 'Failed to delete task');
      return { success: false, error: error.response?.data?.error || 'Failed to delete task' };
    } finally {
      tasksStore.setLoading(false);
    }
  };

  const fetchTaskComments = async (taskId: number) => {
    try {
      tasksStore.setLoading(true);
      const response = await $api.get(`/tasks/${taskId}/comments`);
      tasksStore.setTaskComments(taskId, response.data.comments);
      return response.data.comments;
    } catch (error: any) {
      tasksStore.setError(error.response?.data?.error || 'Failed to fetch task comments');
      return [];
    } finally {
      tasksStore.setLoading(false);
    }
  };

  const addTaskComment = async (taskId: number, content: string) => {
    try {
      tasksStore.setLoading(true);
      const response = await $api.post(`/tasks/${taskId}/comments`, { content });
      tasksStore.addTaskComment(taskId, response.data.comment);
      return { success: true, comment: response.data.comment };
    } catch (error: any) {
      tasksStore.setError(error.response?.data?.error || 'Failed to add comment');
      return { success: false, error: error.response?.data?.error || 'Failed to add comment' };
    } finally {
      tasksStore.setLoading(false);
    }
  };

  const startTimeTracking = async (taskId: number, description?: string) => {
    try {
      tasksStore.setLoading(true);
      const startTime = new Date().toISOString();
      const response = await $api.post(`/tasks/${taskId}/time-entries`, {
        start_time: startTime,
        description
      });
      tasksStore.addTimeEntry(taskId, response.data.timeEntry);
      return { success: true, timeEntry: response.data.timeEntry };
    } catch (error: any) {
      tasksStore.setError(error.response?.data?.error || 'Failed to start time tracking');
      return { success: false, error: error.response?.data?.error || 'Failed to start time tracking' };
    } finally {
      tasksStore.setLoading(false);
    }
  };

  const stopTimeTracking = async (taskId: number, timeEntryId: number, description?: string) => {
    try {
      tasksStore.setLoading(true);
      const endTime = new Date().toISOString();
      const response = await $api.put(`/tasks/${taskId}/time-entries/${timeEntryId}`, {
        end_time: endTime,
        description
      });
      tasksStore.updateTimeEntry(taskId, timeEntryId, response.data.timeEntry);
      return { success: true, timeEntry: response.data.timeEntry };
    } catch (error: any) {
      tasksStore.setError(error.response?.data?.error || 'Failed to stop time tracking');
      return { success: false, error: error.response?.data?.error || 'Failed to stop time tracking' };
    } finally {
      tasksStore.setLoading(false);
    }
  };

  const createTaskChecklist = async (taskId: number, title: string, items: { content: string }[] = []) => {
    try {
      tasksStore.setLoading(true);
      const response = await $api.post(`/tasks/${taskId}/checklists`, { title, items });
      tasksStore.addTaskChecklist(taskId, response.data.checklist);
      return { success: true, checklist: response.data.checklist };
    } catch (error: any) {
      tasksStore.setError(error.response?.data?.error || 'Failed to create checklist');
      return { success: false, error: error.response?.data?.error || 'Failed to create checklist' };
    } finally {
      tasksStore.setLoading(false);
    }
  };

  return {
    fetchTasks,
    fetchTasksByProject,
    fetchTaskById,
    createTask,
    updateTask,
    deleteTask,
    fetchTaskComments,
    addTaskComment,
    startTimeTracking,
    stopTimeTracking,
    createTaskChecklist
  };
}