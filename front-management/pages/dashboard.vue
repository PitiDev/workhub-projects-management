<template>
  <div class="bg-gray-50 dark:bg-gray-900 min-h-screen p-4 md:p-6">
    <div class="max-w-7xl mx-auto">
      <!-- Header Section with Gradient -->
      <div class="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-xl p-6 mb-8 shadow-lg">
        <h1 class="text-3xl font-bold text-white">Dashboard</h1>
        <p class="mt-2 text-indigo-100">Welcome back, {{ user.first_name }}</p>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center items-center py-12">
        <div class="animate-spin rounded-full h-14 w-14 border-t-4 border-b-4 border-indigo-600"></div>
      </div>

      <div v-else class="space-y-8">
        <!-- Stats overview with hover effects and animations -->
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-5">
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border-0 p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 rounded-full bg-indigo-600 flex items-center justify-center">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Active Projects</p>
                <h2 class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.activeProjects }}</h2>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border-0 p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 rounded-full bg-emerald-600 flex items-center justify-center">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Completed Tasks</p>
                <h2 class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.completedTasks }}</h2>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border-0 p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 rounded-full bg-rose-600 flex items-center justify-center">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Overdue Tasks</p>
                <h2 class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.overdueTasks }}</h2>
              </div>
            </div>
          </div>

          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border-0 p-6 transition-all duration-300 hover:shadow-lg hover:translate-y-[-2px]">
            <div class="flex items-center">
              <div class="flex-shrink-0 h-12 w-12 rounded-full bg-violet-600 flex items-center justify-center">
                <svg class="h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                </svg>
              </div>
              <div class="ml-5">
                <p class="text-sm font-medium text-gray-500 dark:text-gray-400">Team Members</p>
                <h2 class="mt-1 text-3xl font-bold text-gray-900 dark:text-white">{{ stats.teamMembers }}</h2>
              </div>
            </div>
          </div>
        </div>

        <!-- Task and Project Card Row -->
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- My Tasks -->
          <div class="lg:col-span-2 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M9 2a1 1 0 000 2h2a1 1 0 100-2H9z" />
                  <path fill-rule="evenodd" d="M4 5a2 2 0 012-2 3 3 0 003 3h2a3 3 0 003-3 2 2 0 012 2v11a2 2 0 01-2 2H6a2 2 0 01-2-2V5zm3 4a1 1 0 000 2h.01a1 1 0 100-2H7zm3 0a1 1 0 000 2h3a1 1 0 100-2h-3zm-3 4a1 1 0 100 2h.01a1 1 0 100-2H7zm3 0a1 1 0 100 2h3a1 1 0 100-2h-3z" clip-rule="evenodd" />
                </svg>
                My Tasks
              </h2>
              <NuxtLink to="/tasks" class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors flex items-center">
                View all
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
            <div>
              <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                <li v-for="task in recentTasks" :key="task.id" class="px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <div class="flex items-center justify-between">
                    <div class="flex items-center">
                      <input type="checkbox" :checked="isTaskCompleted(task)" @change="toggleTaskStatus(task)"
                        class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:border-gray-600 dark:bg-gray-700" />
                      <div class="ml-4">
                        <p class="text-sm font-medium text-gray-900 dark:text-white"
                          :class="{ 'line-through opacity-70': isTaskCompleted(task) }">
                          {{ task.title }}
                        </p>
                        <div class="flex items-center mt-1.5 flex-wrap gap-2">
                          <span v-if="task.project"
                            class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                            :style="`background-color: ${task.project.color}20; color: ${task.project.color}`">
                            {{ task.project.name }}
                          </span>
                          <span v-if="task.due_date" class="ml-1 text-xs text-gray-500 dark:text-gray-400 flex items-center">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                              <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                            </svg>
                            {{ formatDate(task.due_date) }}
                          </span>
                        </div>
                      </div>
                    </div>
                    <div>
                      <span v-if="task.status"
                        class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                        :class="getStatusClass(task.status.name)">
                        {{ task.status.name }}
                      </span>
                    </div>
                  </div>
                </li>
                <li v-if="recentTasks.length === 0" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
                  </svg>
                  <p>No tasks assigned to you</p>
                </li>
              </ul>
            </div>
          </div>

          <!-- Recent Projects -->
          <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden">
            <div class="px-6 py-5 border-b border-gray-200 dark:border-gray-700 flex justify-between items-center">
              <h2 class="text-xl font-semibold text-gray-900 dark:text-white flex items-center">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2 text-indigo-600" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M3 4a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1V4zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2zm0 6a1 1 0 011-1h12a1 1 0 011 1v2a1 1 0 01-1 1H4a1 1 0 01-1-1v-2z" clip-rule="evenodd" />
                </svg>
                Recent Projects
              </h2>
              <NuxtLink to="/projects" class="text-sm font-medium text-indigo-600 hover:text-indigo-500 transition-colors flex items-center">
                View all
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 ml-1" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M10.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L12.586 11H5a1 1 0 110-2h7.586l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
                </svg>
              </NuxtLink>
            </div>
            <div>
              <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                <li v-for="project in recentProjects" :key="project.id"
                  class="px-6 py-4 transition-colors hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <NuxtLink :to="`/projects/${project.id}`" class="flex items-center">
                    <div class="flex-shrink-0 h-10 w-10 rounded-lg flex items-center justify-center text-white font-semibold text-lg"
                      :style="`background-color: ${project.color}`">
                      {{ project.name.charAt(0) }}
                    </div>
                    <div class="ml-4">
                      <p class="text-sm font-medium text-gray-900 dark:text-white">{{ project.name }}</p>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-1 flex items-center">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5 mr-1" viewBox="0 0 20 20" fill="currentColor">
                          <path fill-rule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clip-rule="evenodd" />
                        </svg>
                        {{ project.taskCount || 0 }} tasks
                      </p>
                    </div>
                  </NuxtLink>
                </li>
                <li v-if="recentProjects.length == 0" class="px-6 py-10 text-center text-gray-500 dark:text-gray-400">
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto mb-3 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
                  </svg>
                  <p>No recent projects</p>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import { authAPI, projectsAPI, tasksAPI, teamsAPI } from '~/services/api';
import type { User } from '~/types/auth';
import type { Project } from '~/types/project';
import type { Task } from '~/types/task';

definePageMeta({
  layout: 'dashboard',
});

// Router
const router = useRouter();

// State
const user = ref({} as User);
const loading = ref(true);
const stats = ref({
  activeProjects: 0,
  completedTasks: 0,
  overdueTasks: 0,
  teamMembers: 0
});
const recentProjects = ref([] as Project[]);
const recentTasks = ref([] as Task[]);
const allProjects = ref([] as Project[]);
const allTasks = ref([] as Task[]);
const allTeamMembers = ref([]);

// Fetch dashboard data
onMounted(async () => {
  // Only run on client-side
  if (!process.client) return;

  // Check if token exists
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');

  if (!token) {
    router.push('/login');
    return;
  }

  try {
    loading.value = true;

    // Get current user
    const userData = localStorage.getItem('user');
    if (userData) {
      user.value = JSON.parse(userData);
    } else {
      // Fetch user data if not in localStorage
      const userResponse = await authAPI.me();
      user.value = userResponse.data.user;
      localStorage.setItem('user', JSON.stringify(user.value));
    }

    // Fetch dashboard data
    await fetchDashboardData();
  } catch (error) {
    console.error('Failed to load dashboard data:', error);

    // If 401 error, redirect to login
    if (error.response?.status === 401) {
      logout();
    }

    // Set default data
    setDefaultData();
  } finally {
    loading.value = false;
  }
});

// Fetch dashboard data from API
const fetchDashboardData = async () => {
  try {
    // Parallel API requests to get all the data we need for stats
    const [projectsResponse, tasksResponse, teamsResponse, myTasksResponse, recentProjectsResponse] = await Promise.all([
      // All projects for counting active projects
      projectsAPI.getAll({
        limit: 100 // Adjust limit as needed
      }).catch(() => ({ data: { data: [] } })),

      // All tasks to calculate stats
      tasksAPI.getAll({
        limit: 100 // Adjust limit as needed
      }).catch(() => ({ data: { data: [] } })),

      // Team members count
      teamsAPI.getAll().catch(() => ({ data: { data: [] } })),

      // My recent tasks
      tasksAPI.getAll({
        assignee_id: user.value.id,
        limit: 5,
        sort_by: 'created_at',
        sort_direction: 'desc'
      }).catch(() => ({ data: { data: [] } })),

      // Recent projects
      projectsAPI.getAll({
        limit: 5,
        sort_by: 'updated_at',
        sort_direction: 'desc'
      }).catch(() => ({ data: { data: [] } }))
    ]);

    // Store the data
    allProjects.value = projectsResponse.data.data || [];
    allTasks.value = tasksResponse.data.data || [];
    allTeamMembers.value = teamsResponse.data.data || [];
    recentTasks.value = myTasksResponse.data.data || [];
    recentProjects.value = recentProjectsResponse.data.data || [];

    // Calculate stats
    calculateStats();

    console.log('Dashboard data loaded:', {
      projects: allProjects.value.length,
      tasks: allTasks.value.length,
      teamMembers: allTeamMembers.value.length,
      recentTasks: recentTasks.value.length,
      recentProjects: recentProjects.value.length
    });
  } catch (error) {
    console.error('Failed to fetch dashboard data:', error);
    setDefaultData();
  }
};

// Calculate stats from fetched data
const calculateStats = () => {
  // Count active projects
  const activeProjects = allProjects.value.filter(project => project.status === 'active').length;

  // Count tasks by status and due date
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  
  let completedTasks = 0;
  let overdueTasks = 0;

  allTasks.value.forEach(task => {
    // Count completed tasks (tasks with "Done" or "Completed" status)
    if (task.status?.name === 'Done' || task.status?.name === 'Completed') {
      completedTasks++;
    }

    // Count overdue tasks (due date is in the past and task is not completed)
    if (task.due_date) {
      const dueDate = new Date(task.due_date);
      dueDate.setHours(0, 0, 0, 0);
      
      if (dueDate < today && !(task.status?.name === 'Done' || task.status?.name === 'Completed')) {
        overdueTasks++;
      }
    }
  });

  // Update stats
  stats.value = {
    activeProjects,
    completedTasks,
    overdueTasks,
    teamMembers: allTeamMembers.value.length
  };
};

// Set default data if API fails
const setDefaultData = () => {
  stats.value = {
    activeProjects: 0,
    completedTasks: 0,
    overdueTasks: 0,
    teamMembers: 0
  };
  recentProjects.value = [];
  recentTasks.value = [];
};

// Check if task is completed
const isTaskCompleted = (task: Task): boolean => {
  return task.status?.name === 'Done' || task.status?.name === 'Completed';
};

// Toggle task status
const toggleTaskStatus = async (task: Task) => {
  try {
    const isDone = isTaskCompleted(task);

    // Find Done status ID or next logical status
    let newStatusId = task.status_id;

    if (isDone) {
      // If already done, set to "To Do" or first status
      newStatusId = 1; // Assuming 1 is the "To Do" status
    } else {
      // If not done, set to "Done" status or last status
      newStatusId = 4; // Assuming 4 is the "Done" status
    }

    // Update task status using tasksAPI
    await tasksAPI.update(task.id, {
      status_id: newStatusId
    }).catch(() => {
      // For demo purposes, just update locally
      task.status = {
        id: newStatusId,
        name: isDone ? 'To Do' : 'Done',
        color: isDone ? '#6b7280' : '#10B981',
        project_id: task.project_id,
        order_position: newStatusId,
        created_at: '',
        updated_at: ''
      };
    });

    // Refresh dashboard data
    fetchDashboardData();
  } catch (error) {
    console.error('Failed to update task status:', error);
  }
};

// Format date helper function
const formatDate = (dateStr: string) => {
  const date = new Date(dateStr);
  return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
};

// Get status class for task status
const getStatusClass = (status: string) => {
  switch (status) {
    case 'To Do':
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    case 'In Progress':
      return 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-400';
    case 'Review':
      return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400';
    case 'Done':
    case 'Completed':
      return 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400';
    case 'Blocked':
      return 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400';
    default:
      return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
  }
};

// Logout function
const logout = () => {
  if (!process.client) return;
  
  localStorage.removeItem('token');
  sessionStorage.removeItem('token');
  localStorage.removeItem('user');
  router.push('/login');
};
</script>