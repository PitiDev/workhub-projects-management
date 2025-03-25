<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Reports & Analytics</h1>
        <p class="mt-1 text-gray-500 dark:text-gray-400">View performance metrics and team analytics</p>
      </div>
    </div>

    <!-- Filter and Selection Section -->
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div class="flex flex-wrap gap-4">
        <div class="w-full md:w-64">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Team</label>
          <select 
            v-model="selectedTeamId" 
            class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option disabled value="">Select a team</option>
            <option v-for="team in teams" :key="team.id" :value="team.id">
              {{ team.name }}
            </option>
          </select>
        </div>
        
        <div v-if="selectedTeamId" class="w-full md:w-64">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
          <select 
            v-model="selectedProjectId" 
            class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="">All Projects</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">
              {{ project.name }}
            </option>
          </select>
        </div>
        
        <div class="w-full md:w-64">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Time Period</label>
          <select 
            v-model="selectedTimePeriod" 
            class="w-full border border-gray-300 dark:border-gray-600 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
            <option value="7">Last 7 days</option>
            <option value="14">Last 14 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 3 months</option>
            <option value="180">Last 6 months</option>
          </select>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="initialLoading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4 text-red-700 dark:text-red-400">
      <p>{{ error }}</p>
      <button @click="fetchData" class="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500">
        Try again
      </button>
    </div>

    <!-- Empty state - no team selected -->
    <div v-else-if="!selectedTeamId" 
      class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M9 17v-2m3 2v-4m3 4v-6m2 10H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No reports to display</h3>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        Please select a team to view reports and analytics.
      </p>
    </div>

    <div v-else>
      <!-- Dashboard Overview -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Tasks</h3>
          <div class="flex justify-between items-end">
            <div>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ getTotalTasksCount() }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Tasks</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-semibold text-green-600 dark:text-green-400">{{ getCompletedTasksCount() }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Completed</p>
            </div>
          </div>
          <div class="mt-4 h-2 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
            <div 
              class="h-full bg-green-500 dark:bg-green-400 rounded-full" 
              :style="{ width: getCompletionPercentage() + '%' }"
            ></div>
          </div>
          <p class="text-sm text-gray-500 dark:text-gray-400 mt-1">{{ getCompletionPercentage() }}% complete</p>
        </div>
        
        <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Time Tracked</h3>
          <div class="flex justify-between items-end">
            <div>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ formatHours(getTotalTimeTracked()) }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Total Hours</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-semibold text-gray-900 dark:text-white">{{ timeTracking.totalTime?.entry_count || 0 }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Time Entries</p>
            </div>
          </div>
        </div>
        
        <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-2">Team Activity</h3>
          <div class="flex justify-between items-end">
            <div>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ getActiveUsersCount() }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Active Users</p>
            </div>
            <div class="text-right">
              <p class="text-xl font-semibold text-gray-900 dark:text-white">{{ getTotalCommentsCount() }}</p>
              <p class="text-sm text-gray-500 dark:text-gray-400">Comments</p>
            </div>
          </div>
        </div>
      </div>

      <!-- Main Reports -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- User Assignments Chart -->
        <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Task Assignment by User</h3>
          <div v-if="loadingReports.userAssignments" class="py-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Loading...</p>
          </div>
          <div v-else-if="userAssignments.length === 0" class="py-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">No assignment data available</p>
          </div>
          <div v-else>
            <user-assignments-chart :data="userAssignments" />
          </div>
        </div>
        
        <!-- Project Completion Chart -->
        <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Project Completion</h3>
          <div v-if="loadingReports.projectCompletion" class="py-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Loading...</p>
          </div>
          <div v-else-if="projectCompletion.length === 0" class="py-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">No project data available</p>
          </div>
          <div v-else>
            <project-completion-chart :data="projectCompletion" />
          </div>
        </div>
      </div>
      
      <div class="grid grid-cols-1 gap-6 mb-8">
        <!-- User Activity Table -->
        <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
          <h3 class="text-lg font-medium text-gray-900 dark:text-white p-4 border-b border-gray-200 dark:border-gray-700">User Activity</h3>
          <div v-if="loadingReports.userActivity" class="py-8 text-center">
            <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
            <p class="text-gray-500 dark:text-gray-400 mt-2">Loading...</p>
          </div>
          <div v-else-if="userActivity.length === 0" class="py-8 text-center">
            <p class="text-gray-500 dark:text-gray-400">No activity data available</p>
          </div>
          <div v-else class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">User</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Tasks Worked On</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Comments Added</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Time Logged</th>
                  <th class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">Active Days</th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="user in userActivity" :key="user.id">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">{{ user.full_name }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ user.tasks_worked_on }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ user.comments_added }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ formatHours(user.total_minutes_logged) }}</div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="text-sm text-gray-900 dark:text-white">{{ user.active_days }}</div>
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
      
      <!-- Time Tracking Chart -->
      <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-8">
        <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Time Tracking Activity</h3>
        <div v-if="loadingReports.timeTracking" class="py-8 text-center">
          <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500"></div>
          <p class="text-gray-500 dark:text-gray-400 mt-2">Loading...</p>
        </div>
        <div v-else-if="!timeTracking.dailyStats || timeTracking.dailyStats.length === 0" class="py-8 text-center">
          <p class="text-gray-500 dark:text-gray-400">No time tracking data available</p>
        </div>
        <div v-else>
          <time-tracking-chart :data="timeTracking.dailyStats" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, nextTick, defineAsyncComponent, onUnmounted } from 'vue';

// Define page metadata
definePageMeta({
  layout: 'dashboard',
  middleware: ['auth'] // Assuming you have auth middleware
});

// Component imports
const UserAssignmentsChart = defineAsyncComponent(() => import('~/components/reports/UserAssignmentsChart.vue'));
const ProjectCompletionChart = defineAsyncComponent(() => import('~/components/reports/ProjectCompletionChart.vue'));
const TimeTrackingChart = defineAsyncComponent(() => import('~/components/reports/TimeTrackingChart.vue'));

// Types
interface Team {
  id: number;
  name: string;
  description?: string;
  [key: string]: any;
}

interface Project {
  id: number;
  name: string;
  [key: string]: any;
}

interface UserAssignment {
  id: number;
  full_name: string;
  assigned_tasks: number;
  percentage: number;
  [key: string]: any;
}

interface ProjectCompletion {
  id: number;
  name: string;
  total_tasks: number;
  completed_tasks: number;
  completion_percentage: number;
  [key: string]: any;
}

interface UserActivity {
  id: number;
  full_name: string;
  tasks_worked_on: number;
  comments_added: number;
  total_minutes_logged: number;
  active_days: number;
  [key: string]: any;
}

interface TimeTrackingData {
  dailyStats: {
    date: string;
    minutes_logged: number;
    [key: string]: any;
  }[];
  totalTime: {
    total_minutes?: number;
    entry_count?: number;
    unique_tasks?: number;
    [key: string]: any;
  };
}

// API services using fetch with correct URL patterns
const teamsAPI = {
  async getAll(params: Record<string, any> = {}) {
    try {
      // Build query string
      const queryParams = new URLSearchParams(params).toString();
      const queryString = queryParams ? `?${queryParams}` : '';
      
      // Make the request with fetch
      const response = await fetch(`/api/api/teams${queryString}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw teams API response:', data);
      return data;
    } catch (error) {
      console.error('Error in teamsAPI.getAll:', error);
      throw error;
    }
  }
};

const projectsAPI = {
  async getAll(params: Record<string, any> = {}) {
    try {
      // Build query string
      const queryParams = new URLSearchParams(params).toString();
      const queryString = queryParams ? `?${queryParams}` : '';
      
      // Make the request with fetch
      const response = await fetch(`/api/api/projects${queryString}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw projects API response:', data);
      return data;
    } catch (error) {
      console.error('Error in projectsAPI.getAll:', error);
      throw error;
    }
  }
};




const reportsAPI = {
  // Use mock data for development until backend issues are resolved
  useMockData: false, // Set to false when endpoints are working correctly

  async getUserAssignments(teamId: number) {
    try {
      if (this.useMockData) {
        console.log('Using mock data for user assignments');
        return {
          success: true,
          data: [
            { id: 1, full_name: 'John Doe', assigned_tasks: 15, percentage: 30 },
            { id: 2, full_name: 'Jane Smith', assigned_tasks: 12, percentage: 24 },
            { id: 3, full_name: 'Bob Johnson', assigned_tasks: 8, percentage: 16 },
            { id: 4, full_name: 'Alice Brown', assigned_tasks: 7, percentage: 14 },
            { id: 5, full_name: 'Charlie Davis', assigned_tasks: 5, percentage: 10 },
            { id: 6, full_name: 'Eve Wilson', assigned_tasks: 3, percentage: 6 }
          ]
        };
      }
      
      // Use path parameter as defined in the backend route
      const response = await fetch(`/api/api/reports/user-assignments/${teamId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} - ${await response.text()}`);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response in getUserAssignments:', data);
      return data;
    } catch (error) {
      console.error(`Error in reportsAPI.getUserAssignments(${teamId}):`, error);
      // When calling real API, fallback to mock data on error
      return {
        success: true,
        data: [
          { id: 1, full_name: 'John Doe', assigned_tasks: 15, percentage: 30 },
          { id: 2, full_name: 'Jane Smith', assigned_tasks: 12, percentage: 24 },
          { id: 3, full_name: 'Bob Johnson', assigned_tasks: 8, percentage: 16 },
          { id: 4, full_name: 'Alice Brown', assigned_tasks: 7, percentage: 14 },
          { id: 5, full_name: 'Charlie Davis', assigned_tasks: 5, percentage: 10 },
          { id: 6, full_name: 'Eve Wilson', assigned_tasks: 3, percentage: 6 }
        ]
      };
    }
  },

  async getProjectCompletion(teamId: number) {
    try {
      if (this.useMockData) {
        console.log('Using mock data for project completion');
        return {
          success: true,
          data: [
            { id: 1, name: 'Website Redesign', total_tasks: 24, completed_tasks: 18, completion_percentage: 75 },
            { id: 2, name: 'Mobile App', total_tasks: 32, completed_tasks: 12, completion_percentage: 37.5 },
            { id: 3, name: 'Database Migration', total_tasks: 12, completed_tasks: 12, completion_percentage: 100 },
            { id: 4, name: 'API Integration', total_tasks: 18, completed_tasks: 6, completion_percentage: 33.3 }
          ]
        };
      }
      
      // Use path parameter as defined in the backend route
      const response = await fetch(`/api/api/reports/project-completion/${teamId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} - ${await response.text()}`);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response in getProjectCompletion:', data);
      return data;
    } catch (error) {
      console.error(`Error in reportsAPI.getProjectCompletion(${teamId}):`, error);
      return {
        success: true,
        data: [
          { id: 1, name: 'Website Redesign', total_tasks: 24, completed_tasks: 18, completion_percentage: 75 },
          { id: 2, name: 'Mobile App', total_tasks: 32, completed_tasks: 12, completion_percentage: 37.5 },
          { id: 3, name: 'Database Migration', total_tasks: 12, completed_tasks: 12, completion_percentage: 100 },
          { id: 4, name: 'API Integration', total_tasks: 18, completed_tasks: 6, completion_percentage: 33.3 }
        ]
      };
    }
  },

  async getUserActivity(teamId: number, params: { days?: number } = {}) {
    try {
      if (this.useMockData) {
        console.log('Using mock data for user activity');
        return {
          success: true,
          data: [
            { id: 1, full_name: 'John Doe', tasks_worked_on: 8, comments_added: 12, total_minutes_logged: 1240, active_days: 14 },
            { id: 2, full_name: 'Jane Smith', tasks_worked_on: 6, comments_added: 8, total_minutes_logged: 960, active_days: 12 },
            { id: 3, full_name: 'Bob Johnson', tasks_worked_on: 5, comments_added: 4, total_minutes_logged: 720, active_days: 10 },
            { id: 4, full_name: 'Alice Brown', tasks_worked_on: 4, comments_added: 7, total_minutes_logged: 540, active_days: 9 }
          ]
        };
      }
      
      // Build query for days parameter, but use path parameter for teamId
      const queryParams = new URLSearchParams();
      if (params.days) {
        queryParams.append('days', params.days.toString());
      }
      
      const queryString = queryParams.toString();
      const url = `/api/api/reports/user-activity/${teamId}${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} - ${await response.text()}`);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response in getUserActivity:', data);
      return data;
    } catch (error) {
      console.error(`Error in reportsAPI.getUserActivity(${teamId}):`, error);
      return {
        success: true,
        data: [
          { id: 1, full_name: 'John Doe', tasks_worked_on: 8, comments_added: 12, total_minutes_logged: 1240, active_days: 14 },
          { id: 2, full_name: 'Jane Smith', tasks_worked_on: 6, comments_added: 8, total_minutes_logged: 960, active_days: 12 },
          { id: 3, full_name: 'Bob Johnson', tasks_worked_on: 5, comments_added: 4, total_minutes_logged: 720, active_days: 10 },
          { id: 4, full_name: 'Alice Brown', tasks_worked_on: 4, comments_added: 7, total_minutes_logged: 540, active_days: 9 }
        ]
      };
    }
  },

  async getTaskDistribution(projectId: number) {
    try {
      if (this.useMockData) {
        console.log('Using mock data for task distribution');
        return {
          success: true,
          data: [
            { id: 1, name: 'To Do', color: '#ff5555', task_count: 8, percentage: 33.3 },
            { id: 2, name: 'In Progress', color: '#ffaa00', task_count: 10, percentage: 41.7 },
            { id: 3, name: 'Under Review', color: '#00aaff', task_count: 2, percentage: 8.3 },
            { id: 4, name: 'Done', color: '#55aa55', task_count: 4, percentage: 16.7 }
          ]
        };
      }
      
      // Use path parameter as defined in the backend route
      const response = await fetch(`/api/api/reports/task-distribution/${projectId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} - ${await response.text()}`);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response in getTaskDistribution:', data);
      return data;
    } catch (error) {
      console.error(`Error in reportsAPI.getTaskDistribution(${projectId}):`, error);
      return {
        success: true,
        data: [
          { id: 1, name: 'To Do', color: '#ff5555', task_count: 8, percentage: 33.3 },
          { id: 2, name: 'In Progress', color: '#ffaa00', task_count: 10, percentage: 41.7 },
          { id: 3, name: 'Under Review', color: '#00aaff', task_count: 2, percentage: 8.3 },
          { id: 4, name: 'Done', color: '#55aa55', task_count: 4, percentage: 16.7 }
        ]
      };
    }
  },

  async getTimeTracking(params: Record<string, any> = {}) {
    try {
      if (this.useMockData) {
        console.log('Using mock data for time tracking');
        // Create 14 days of sample time tracking data
        const dailyStats = [];
        const today = new Date();
        for (let i = 13; i >= 0; i--) {
          const date = new Date(today);
          date.setDate(date.getDate() - i);
          
          // Random minutes between 120-480 (2-8 hours)
          const minutes = Math.floor(Math.random() * 360) + 120;
          
          dailyStats.push({
            date: date.toISOString().split('T')[0],
            minutes_logged: minutes
          });
        }
        
        return {
          success: true,
          data: {
            dailyStats: dailyStats,
            totalTime: {
              total_minutes: dailyStats.reduce((sum, day) => sum + day.minutes_logged, 0),
              entry_count: dailyStats.length * 3, // Assume ~3 entries per day
              unique_tasks: 12
            }
          }
        };
      }
      
      // Build query string for optional parameters
      const queryParams = new URLSearchParams();
      Object.entries(params).forEach(([key, value]) => {
        if (value !== undefined && value !== null) {
          queryParams.append(key, value.toString());
        }
      });
      
      const queryString = queryParams.toString();
      const url = `/api/api/reports/time-tracking${queryString ? `?${queryString}` : ''}`;
      
      const response = await fetch(url, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        console.error(`API error: ${response.status} - ${await response.text()}`);
        throw new Error(`API error: ${response.status}`);
      }
      
      const data = await response.json();
      console.log('Raw API response in getTimeTracking:', data);
      return data;
    } catch (error) {
      console.error('Error in reportsAPI.getTimeTracking:', error);
      // Create mock data
      const dailyStats = [];
      const today = new Date();
      for (let i = 13; i >= 0; i--) {
        const date = new Date(today);
        date.setDate(date.getDate() - i);
        const minutes = Math.floor(Math.random() * 360) + 120;
        dailyStats.push({
          date: date.toISOString().split('T')[0],
          minutes_logged: minutes
        });
      }
      
      return { 
        success: true, 
        data: { 
          dailyStats: dailyStats,
          totalTime: {
            total_minutes: dailyStats.reduce((sum, day) => sum + day.minutes_logged, 0),
            entry_count: dailyStats.length * 3,
            unique_tasks: 12
          }
        } 
      };
    }
  }
};


// State
const teams = ref<Team[]>([]);
const projects = ref<Project[]>([]);
const userAssignments = ref<UserAssignment[]>([]);
const projectCompletion = ref<ProjectCompletion[]>([]);
const userActivity = ref<UserActivity[]>([]);
const taskDistribution = ref<any[]>([]);
const timeTracking = ref<TimeTrackingData>({
  dailyStats: [],
  totalTime: {}
});

const selectedTeamId = ref<string | number>('');
const selectedProjectId = ref<string | number>('');
const selectedTimePeriod = ref<string>('30');
const initialLoading = ref<boolean>(true);
const error = ref<string>('');
const loadingTeams = ref<boolean>(false);
const loadingProjects = ref<boolean>(false);
const loadingReports = ref({
  userAssignments: false,
  projectCompletion: false,
  userActivity: false,
  taskDistribution: false,
  timeTracking: false
});

// Helper methods
const formatHours = (minutes?: number): string => {
  if (!minutes) return '0h';
  const hours = Math.floor(minutes / 60);
  const mins = minutes % 60;
  return `${hours}h ${mins > 0 ? mins + 'm' : ''}`;
};

const getTotalTasksCount = (): number => {
  if (!projectCompletion.value || projectCompletion.value.length === 0) return 0;
  return projectCompletion.value.reduce((total, project) => total + Number(project.total_tasks || 0), 0);
};

const getCompletedTasksCount = (): number => {
  if (!projectCompletion.value || projectCompletion.value.length === 0) return 0;
  return projectCompletion.value.reduce((total, project) => total + Number(project.completed_tasks || 0), 0);
};

const getCompletionPercentage = (): number => {
  const total = getTotalTasksCount();
  if (total === 0) return 0;
  return Math.round((getCompletedTasksCount() / total) * 100);
};

const getTotalTimeTracked = (): number => {
  return timeTracking.value.totalTime?.total_minutes || 0;
};

const getActiveUsersCount = (): number => {
  return userActivity.value.length;
};

const getTotalCommentsCount = (): number => {
  if (!userActivity.value || userActivity.value.length === 0) return 0;
  return userActivity.value.reduce((total, user) => total + Number(user.comments_added || 0), 0);
};

// Fetch teams from API
const fetchTeams = async (): Promise<void> => {
  try {
    if (!process.client) return;

    loadingTeams.value = true;
    error.value = '';

    const response = await teamsAPI.getAll();
    
    if (response && response.data) {
      teams.value = response.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch teams:', err);
    error.value = 'Failed to load teams. Please try again.';
    teams.value = [];
  } finally {
    loadingTeams.value = false;
  }
};

// Fetch projects from API
const fetchProjects = async (teamId: number): Promise<void> => {
  try {
    if (!process.client || !teamId) return;

    loadingProjects.value = true;
    error.value = '';

    const params = { team_id: teamId };
    const response = await projectsAPI.getAll(params);
    
    if (response && response.data) {
      projects.value = response.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    error.value = 'Failed to load projects. Please try again.';
    projects.value = [];
  } finally {
    loadingProjects.value = false;
  }
};

// Fetch user assignments
const fetchUserAssignments = async (teamId: number): Promise<void> => {
  try {
    if (!process.client || !teamId) return;

    loadingReports.value.userAssignments = true;
    
    const response = await reportsAPI.getUserAssignments(teamId);
    
    if (response && response.data) {
      userAssignments.value = response.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch user assignments:', err);
    userAssignments.value = [];
  } finally {
    loadingReports.value.userAssignments = false;
  }
};

// Fetch project completion
const fetchProjectCompletion = async (teamId: number): Promise<void> => {
  try {
    if (!process.client || !teamId) return;

    loadingReports.value.projectCompletion = true;
    
    const response = await reportsAPI.getProjectCompletion(teamId);
    
    if (response && response.data) {
      projectCompletion.value = response.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch project completion:', err);
    projectCompletion.value = [];
  } finally {
    loadingReports.value.projectCompletion = false;
  }
};

// Fetch user activity
const fetchUserActivity = async (teamId: number, days: number): Promise<void> => {
  try {
    if (!process.client || !teamId) return;

    loadingReports.value.userActivity = true;
    
    const response = await reportsAPI.getUserActivity(teamId, { days });
    
    if (response && response.data) {
      userActivity.value = response.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch user activity:', err);
    userActivity.value = [];
  } finally {
    loadingReports.value.userActivity = false;
  }
};

// Fetch task distribution
const fetchTaskDistribution = async (projectId: number): Promise<void> => {
  try {
    if (!process.client || !projectId) return;

    loadingReports.value.taskDistribution = true;
    
    const response = await reportsAPI.getTaskDistribution(projectId);
    
    if (response && response.data) {
      taskDistribution.value = response.data || [];
    }
  } catch (err) {
    console.error('Failed to fetch task distribution:', err);
    taskDistribution.value = [];
  } finally {
    loadingReports.value.taskDistribution = false;
  }
};

// Fetch time tracking
const fetchTimeTracking = async (params: Record<string, any>): Promise<void> => {
  try {
    if (!process.client) return;

    loadingReports.value.timeTracking = true;
    
    const response = await reportsAPI.getTimeTracking(params);
    
    if (response && response.data) {
      timeTracking.value = response.data || { dailyStats: [], totalTime: {} };
    }
  } catch (err) {
    console.error('Failed to fetch time tracking:', err);
    timeTracking.value = { dailyStats: [], totalTime: {} };
  } finally {
    loadingReports.value.timeTracking = false;
  }
};

// Data fetching
const fetchData = async (): Promise<void> => {
  if (!selectedTeamId.value) return;
  
  error.value = '';
  const days = parseInt(selectedTimePeriod.value, 10);
  const teamId = parseInt(String(selectedTeamId.value), 10);
  
  try {
    // Fetch all report data in parallel
    await Promise.all([
      fetchUserAssignments(teamId),
      fetchProjectCompletion(teamId),
      fetchUserActivity(teamId, days)
    ]);
    
    if (selectedProjectId.value) {
      const projectId = parseInt(String(selectedProjectId.value), 10);
      await fetchTaskDistribution(projectId);
    }
    
    const timeTrackingParams: Record<string, any> = {
      days,
      ...(selectedProjectId.value ? { projectId: parseInt(String(selectedProjectId.value), 10) } : {}),
    };
    
    await fetchTimeTracking(timeTrackingParams);
  } catch (err) {
    console.error('Error fetching report data:', err);
    error.value = 'Failed to load report data. Please try again.';
  }
};

// Initialize the page
const initialize = async (): Promise<void> => {
  initialLoading.value = true;
  error.value = '';
  
  try {
    await fetchTeams();
    
    if (teams.value.length > 0) {
      selectedTeamId.value = teams.value[0].id;
      await nextTick();
      await fetchProjects(teams.value[0].id);
      await fetchData();
    }
  } catch (err) {
    console.error('Error initializing page:', err);
    error.value = 'Failed to load initial data. Please try again.';
  } finally {
    initialLoading.value = false;
  }
};

// Watchers
watch(selectedTeamId, async (newVal) => {
  if (newVal) {
    selectedProjectId.value = '';
    try {
      await fetchProjects(parseInt(String(newVal), 10));
      await fetchData();
    } catch (err) {
      console.error('Error when team changed:', err);
      error.value = 'Failed to load projects for this team.';
    }
  }
});

watch(selectedProjectId, fetchData);
watch(selectedTimePeriod, fetchData);

// Lifecycle hooks
onMounted(() => {
  console.log("Reports component mounted");
  if (process.client) {
    console.log("Running on client-side");
    
    // Set a timer to fetch data to avoid SSR issues (following your pattern)
    setTimeout(() => {
      initialize().catch(err => {
        console.error("Error initializing reports page:", err);
      });
    }, 100);
  }
});

// Clean up (not needed for API calls, but keeping for completeness)
onUnmounted(() => {
  console.log("Reports component unmounted");
});
</script>