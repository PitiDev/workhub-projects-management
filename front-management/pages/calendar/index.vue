<!-- pages/calendar/index.vue -->
<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Page Header with Modern Design -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Calendar</h1>
        <p class="text-gray-500 dark:text-gray-400 text-lg">Visualize and manage your schedule</p>
      </div>
      <div class="mt-4 sm:mt-0">
        <button @click="showNewTaskModal = true"
          class="btn-primary flex items-center px-5 py-2.5 rounded-xl bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-600 dark:hover:bg-primary-700 transition-all duration-200 shadow-sm font-medium">
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Task
        </button>
      </div>
    </div>

    <!-- Modern Calendar View -->
    <div
      class="bg-white dark:bg-gray-800 rounded-2xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden transition-all duration-300">
      <!-- Calendar Header with modern styling -->
      <div
        class="p-6 border-b border-gray-100 dark:border-gray-700 bg-gradient-to-r from-white to-gray-50 dark:from-gray-800 dark:to-gray-750">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center">
          <div class="flex items-center space-x-4">
            <div class="month-year-selector flex items-center">
              <button @click="previousMonth"
                class="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 19l-7-7 7-7" />
                </svg>
              </button>
              <div class="mx-4 relative group">
                <h2
                  class="text-2xl font-bold text-gray-900 dark:text-white flex items-center cursor-pointer tracking-tight">
                  {{ currentMonthName }} {{ currentYear }}
                  <svg class="w-5 h-5 ml-2 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg"
                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                  </svg>
                </h2>
              </div>
              <button @click="nextMonth"
                class="p-2.5 rounded-full text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200">
                <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7" />
                </svg>
              </button>
            </div>
            <button @click="currentDate = new Date(); fetchTasks();"
              class="px-4 py-2 rounded-xl text-sm font-medium bg-primary-50 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 hover:bg-primary-100 dark:hover:bg-primary-900/30 transition-all duration-200 shadow-sm">
              Today
            </button>
          </div>
          <div class="mt-4 sm:mt-0 flex space-x-3">
            <select v-model="selectedProject"
              class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all duration-200 shadow-sm">
              <option value="">All Projects</option>
              <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
            </select>

            <div class="relative" ref="optionsDropdownRef">
              <button @click="viewOptions = !viewOptions" type="button"
                class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 flex items-center transition-all duration-200 shadow-sm">
                <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                Display Options
                <svg class="w-4 h-4 ml-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor" :class="{ 'transform rotate-180': viewOptions }">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
                </svg>
              </button>
              <div v-if="viewOptions"
                class="absolute right-0 mt-2 w-60 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10 options-dropdown transition-all duration-200 transform origin-top-right">
                <div class="p-3 space-y-2">
                  <label
                    class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150">
                    <input type="checkbox" v-model="showCompleted"
                      class="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 rounded-md">
                    Show completed tasks
                  </label>
                  <label
                    class="flex items-center px-3 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 rounded-lg transition-colors duration-150">
                    <input type="checkbox" v-model="showOverdue"
                      class="mr-3 h-4 w-4 text-primary-600 focus:ring-primary-500 rounded-md">
                    Highlight overdue tasks
                  </label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div class="p-6">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-24">
          <div class="flex flex-col items-center">
            <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-primary-500"></div>
            <p class="mt-4 text-gray-500 dark:text-gray-400">Loading your calendar...</p>
          </div>
        </div>

        <!-- Error state -->
        <div v-else-if="error"
          class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl p-8 text-red-700 dark:text-red-400 shadow-sm">
          <div class="flex items-center">
            <svg class="w-8 h-8 mr-4 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="font-medium text-lg">{{ error }}</p>
          </div>
          <button @click="fetchTasks"
            class="mt-5 px-5 py-2.5 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-xl transition-colors duration-200 font-medium">
            Try again
          </button>
        </div>

        <!-- Calendar -->
        <div v-else>
          <!-- Day names header with modern styling -->
          <div class="grid grid-cols-7 mb-2">
            <div v-for="(day, index) in dayNames" :key="day"
              class="py-3 font-medium text-center text-sm uppercase tracking-wider" :class="{
                'text-gray-800 dark:text-gray-200': index !== 0 && index !== 6,
                'text-primary-600 dark:text-primary-400': index === 0 || index === 6
              }">
              {{ day }}
            </div>
          </div>

          <!-- Calendar grid with improved styling -->
          <div class="grid grid-cols-7 gap-2 auto-rows-fr">
            <!-- Calendar day cells -->
            <div v-for="(day, index) in calendarDays" :key="index"
              class="min-h-32 sm:min-h-36 p-3 relative group transition-all duration-200 rounded-xl border border-transparent"
              :class="{
                'bg-white dark:bg-gray-800 shadow-sm border-gray-100 dark:border-gray-700': day.isCurrentMonth,
                'bg-gray-50 dark:bg-gray-750 text-gray-400 dark:text-gray-500': !day.isCurrentMonth,
                'ring-2 ring-primary-500 dark:ring-primary-400 ring-opacity-70 dark:ring-opacity-70': isToday(day.date),
                'opacity-60': !day.isCurrentMonth,
                'bg-blue-50 dark:bg-blue-900/10': isWeekend(day.date) && day.isCurrentMonth
              }">
              <!-- Day number with add task button on hover -->
              <div class="flex justify-between items-center">
                <div class="relative">
                  <span
                    class="inline-flex items-center justify-center text-sm w-8 h-8 rounded-full font-medium transition-all duration-200"
                    :class="{
                      'text-gray-400 dark:text-gray-500 group-hover:bg-gray-100 dark:group-hover:bg-gray-700': !day.isCurrentMonth && !isToday(day.date),
                      'text-gray-800 dark:text-gray-200 group-hover:bg-gray-100 dark:group-hover:bg-gray-700': day.isCurrentMonth && !isToday(day.date),
                      'text-white bg-primary-500 dark:bg-primary-600 shadow-sm': isToday(day.date)
                    }">
                    {{ day.number }}
                  </span>
                </div>

                <!-- Add task button - visible on hover -->
                <button v-if="day.isCurrentMonth" @click.stop="openNewTaskForDate(day.date)"
                  class="opacity-0 group-hover:opacity-100 p-1.5 rounded-full bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-primary-100 dark:hover:bg-primary-900/30 hover:text-primary-600 dark:hover:text-primary-400 transition-all duration-200 shadow-sm">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                  </svg>
                </button>
              </div>

              <!-- Tasks for this day with improved card styling -->
              <div class="mt-2 space-y-1.5 max-h-32 overflow-y-auto scrollbar-thin">
                <div v-for="task in getTasksForDate(day.date)" :key="task.id" @click.stop="viewTaskDetails(task)"
                  class="px-3 py-2 text-xs rounded-lg cursor-pointer transition-all duration-150 transform hover:translate-x-1 hover:shadow-md flex items-center group/task"
                  :class="{
                    'bg-green-50 dark:bg-green-900/20 text-green-800 dark:text-green-400 border-l-2 border-green-500 dark:border-green-600': isTaskCompleted(task),
                    'bg-red-50 dark:bg-red-900/20 text-red-800 dark:text-red-400 border-l-2 border-red-500 dark:border-red-600': showOverdue && isOverdue(task.due_date) && !isTaskCompleted(task),
                    'bg-blue-50 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400 border-l-2 border-blue-500 dark:border-blue-600': !isOverdue(task.due_date) && !isTaskCompleted(task),
                    'line-through opacity-60': isTaskCompleted(task) && !showCompleted
                  }">
                  <!-- Color dot for project -->
                  <div class="w-3 h-3 rounded-full flex-shrink-0 mr-2"
                    :style="{ backgroundColor: getTaskProjectColor(task) }"></div>

                  <!-- Task title -->
                  <span class="truncate flex-grow font-medium">{{ task.title }}</span>

                  <!-- Priority indicator -->
                  <span v-if="task.priority === 'high'" class="ml-1.5 flex items-center text-red-500 dark:text-red-400"
                    title="High Priority">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-3.5 w-3.5" viewBox="0 0 20 20" fill="currentColor">
                      <path fill-rule="evenodd"
                        d="M5.293 7.707a1 1 0 010-1.414l4-4a1 1 0 011.414 0l4 4a1 1 0 01-1.414 1.414L11 5.414V17a1 1 0 11-2 0V5.414L6.707 7.707a1 1 0 01-1.414 0z"
                        clip-rule="evenodd" />
                    </svg>
                  </span>

                  <!-- Quick action buttons - only visible on hover -->
                  <div
                    class="opacity-0 group-hover/task:opacity-100 ml-1.5 flex items-center transition-opacity duration-200">
                    <button @click.stop="editTask(task)"
                      class="text-gray-500 dark:text-gray-400 hover:text-primary-600 dark:hover:text-primary-400 p-0.5">
                      <svg class="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                          d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                      </svg>
                    </button>
                  </div>
                </div>
              </div>

              <!-- More indicator with improved styling -->
              <div v-if="hasMoreTasks(day.date)"
                class="absolute bottom-2 right-2 text-xs font-medium text-primary-600 dark:text-primary-400 bg-white dark:bg-gray-800 shadow-sm px-2 py-0.5 rounded-full border border-gray-100 dark:border-gray-700">
                +{{ getHiddenTaskCount(day.date) }}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- New/Edit Task Modal with modern styling -->
    <div v-if="showTaskModal" class="fixed inset-0 z-50 overflow-y-auto" @keydown.esc="showTaskModal = false">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <!-- Overlay -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true" @click="showTaskModal = false">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75 backdrop-blur-sm"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <!-- Modal content -->
        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-2xl text-left overflow-hidden shadow-2xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full border border-gray-200 dark:border-gray-700">
          <div class="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
            <div class="flex justify-between items-center mb-6">
              <h3 class="text-xl leading-6 font-bold text-gray-900 dark:text-gray-100">
                {{ isEditingTask ? 'Edit Task' : 'New Task' }}
              </h3>
              <button @click="showTaskModal = false"
                class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            <div class="space-y-5">
              <div>
                <label for="task-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input id="task-title" v-model="newTask.title" type="text"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 shadow-sm"
                  placeholder="Enter task title" />
              </div>
              <div>
                <label for="task-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea id="task-description" v-model="newTask.description" rows="3"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 shadow-sm"
                  placeholder="Enter task description"></textarea>
              </div>
              <div>
                <label for="task-project" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project
                </label>
                <select id="task-project" v-model="newTask.project_id" @change="updateProjectStatuses"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 shadow-sm">
                  <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
                </select>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label for="task-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>

                  <select id="task-status" v-model="newTask.status_id"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200">
                    <option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.name }}
                    </option>
                  </select>

                  <!-- <select id="task-status" v-model="newTask.status_id"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 shadow-sm">
                    <option v-for="status in projectStatuses" :key="status.id" :value="status.id">{{ status.name }}</option>
                  </select> -->

                </div>
                <div>
                  <label for="task-priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select id="task-priority" v-model="newTask.priority_id"
                    class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 shadow-sm">
                    <option value="1">Urgent</option>
                    <option value="2">High</option>
                    <option value="3">Medium</option>
                    <option value="4">Low</option>
                    <option value="5">No Priority</option>
                  </select>
                </div>
              </div>

              <!-- Assignee -->
              <div>
                <UserSearch :users="allUsers || []" v-model="newTask.assignee_id" id="task-assignee" label="Assignee" />
              </div>

              <div>
                <label for="task-due-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input id="task-due-date" v-model="newTask.due_date" type="date"
                  class="w-full px-4 py-3 rounded-xl border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 shadow-sm" />
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 dark:bg-gray-750 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
            <button type="button"
              class="px-5 py-2.5 rounded-xl border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-all duration-200 font-medium"
              @click="showTaskModal = false" :disabled="isCreating">
              Cancel
            </button>
            <button type="button"
              class="px-5 py-2.5 rounded-xl bg-primary-600 dark:bg-primary-700 text-white hover:bg-primary-700 dark:hover:bg-primary-600 transition-all duration-200 shadow-sm font-medium flex items-center"
              :disabled="isCreating || !newTask.title" @click="saveTask">
              <svg v-if="isCreating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isCreating ? (isEditingTask ? 'Updating...' : 'Creating...') : (isEditingTask ? 'Update Task' : 'Create Task') }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRouter } from 'vue-router';
import { tasksAPI, projectsAPI, userAPI } from '~/services/api';
import UserSearch from '~/components/UserSearch.vue';

definePageMeta({
  layout: 'dashboard',
});

// Helper functions - defined early so they can be used in initialization
const formatDate = (date) => {
  if (!date) return '';
  return date.toISOString().split('T')[0]; // YYYY-MM-DD
};

const formatDateForInput = (date) => {
  return formatDate(date);
};

// Router
const router = useRouter();

// State
const loading = ref(true);
const error = ref('');
const tasks = ref([]);
const projects = ref([]);
const projectStatuses = ref([]);
const statuses = ref([]);

const optionsDropdownRef = ref(null);

const allUsers = ref([]);
const loadingUsers = ref(false);

// UI State
const currentDate = ref(new Date());
const selectedProject = ref('');
const showCompleted = ref(true);
const showOverdue = ref(true);
const viewOptions = ref(false);
const showTaskModal = ref(false);
const showNewTaskModal = ref(false);
const isCreating = ref(false);
const isEditingTask = ref(false);
const currentTaskId = ref(null);

// Task form
const newTask = ref({
  title: '',
  description: '',
  project_id: '',
  status_id: '',
  priority_id: 3,
  assignee_id: '',
  due_date: formatDateForInput(new Date()) // Today's date by default
});

// Computed values
const currentYear = computed(() => {
  return currentDate.value.getFullYear();
});

const currentMonth = computed(() => {
  return currentDate.value.getMonth();
});

const currentMonthName = computed(() => {
  return new Intl.DateTimeFormat('en-US', { month: 'long' }).format(currentDate.value);
});

const dayNames = computed(() => {
  return ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
});

const calendarDays = computed(() => {
  const year = currentYear.value;
  const month = currentMonth.value;

  // First day of the month
  const firstDay = new Date(year, month, 1);
  // Last day of the month
  const lastDay = new Date(year, month + 1, 0);

  // Get the day of the week for the first day (0 = Sunday, 6 = Saturday)
  const firstDayOfWeek = firstDay.getDay();

  // Calculate days from previous month to show
  const daysFromPrevMonth = firstDayOfWeek;
  // Calculate total days to display (previous month + current month + next month)
  const totalDays = 42; // 6 rows of 7 days

  const result = [];

  // Add days from previous month
  const prevMonth = new Date(year, month, 0);
  const prevMonthDays = prevMonth.getDate();

  for (let i = prevMonthDays - daysFromPrevMonth + 1; i <= prevMonthDays; i++) {
    const date = new Date(year, month - 1, i);
    result.push({
      number: i,
      date: date,
      isCurrentMonth: false
    });
  }

  // Add days from current month
  for (let i = 1; i <= lastDay.getDate(); i++) {
    const date = new Date(year, month, i);
    result.push({
      number: i,
      date: date,
      isCurrentMonth: true
    });
  }

  // Add days from next month
  const remainingDays = totalDays - result.length;
  for (let i = 1; i <= remainingDays; i++) {
    const date = new Date(year, month + 1, i);
    result.push({
      number: i,
      date: date,
      isCurrentMonth: false
    });
  }

  return result;
});

const filteredTasks = computed(() => {
  let filtered = [...tasks.value];

  // Apply project filter
  if (selectedProject.value) {
    filtered = filtered.filter(task => {
      // Ensure both are treated as the same type for comparison
      const taskProjectId = Number(task.project_id);
      const selectedProjectId = Number(selectedProject.value);
      return taskProjectId === selectedProjectId;
    });
  }

  // Filter out completed tasks if not showing them
  if (!showCompleted.value) {
    filtered = filtered.filter(task => !isTaskCompleted(task));
  }

  return filtered;
});

// Function to check if a date is a weekend
const isWeekend = (date) => {
  const day = date.getDay();
  return day === 0 || day === 6; // 0 is Sunday, 6 is Saturday
};

// Function to fetch all users
const fetchAllUsers = async () => {
  try {
    loadingUsers.value = true;

    // Fetch all users from the API
    const response = await userAPI.getAll().catch(() => {
      // Mock data for development
      return {
        data: {
          data: getMockUsers()
        }
      };
    });

    // Transform the data to match your component's expected structure
    allUsers.value = response.data.data.map(user => ({
      User: {
        id: user.id,
        first_name: user.first_name,
        last_name: user.last_name,
        email: user.email
      },
      profile_image: user.profile_image
    }));

  } catch (err) {
    console.error('Failed to fetch users:', err);
    allUsers.value = [];
  } finally {
    loadingUsers.value = false;
  }
};

const fetchProjects = async () => {
  try {
    // Fetch projects using projectsAPI
    const response = await projectsAPI.getAll().catch(() => {
      // Mock data for development
      return {
        data: {
          data: getMockProjects()
        }
      };
    });

    projects.value = response.data.data;

    // If we have projects, set the default for new task
    if (projects.value.length > 0) {
      newTask.value.project_id = projects.value[0].id;

      // Update project statuses for the first project
      updateProjectStatuses();
      fetchAllProjectStatuses();
    }
  } catch (err) {
    console.error('Failed to fetch projects:', err);
  }
};

const fetchAllProjectStatuses = async () => {
  try {
    let allStatuses = [];

    // First try to fetch statuses for each project
    for (const project of projects.value) {
      try {
        const response = await fetch(`/api/api/projects/${project.id}/statuses`, {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('token')}`
          }
        });

        if (response.ok) {
          const data = await response.json();
          if (data.data && Array.isArray(data.data)) {
            // Add the project statuses to our collection, avoiding duplicates
            data.data.forEach(status => {
              if (!allStatuses.some(s => s.id === status.id)) {
                allStatuses.push(status);
              }
            });
          }
        }
      } catch (err) {
        console.warn(`Error fetching statuses for project ${project.id}:`, err);
      }
    }

    // If we have statuses, use them; otherwise fall back to mock data
    if (allStatuses.length > 0) {
      statuses.value = allStatuses;
      console.log('Loaded statuses from all projects:', statuses.value);
    } else {
      console.warn('No statuses found for any project, using mock data');
    }
  } catch (err) {
    console.error('Error fetching all project statuses:', err);
  }
};

const previousMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() - 1);
  currentDate.value = newDate;
};

const nextMonth = () => {
  const newDate = new Date(currentDate.value);
  newDate.setMonth(newDate.getMonth() + 1);
  currentDate.value = newDate;
};

const isToday = (date) => {
  const today = new Date();
  return date.getDate() === today.getDate() &&
    date.getMonth() === today.getMonth() &&
    date.getFullYear() === today.getFullYear();
};

// Helper to safely get project color from task
const getTaskProjectColor = (task) => {
  if (task.project?.color) return task.project.color;

  // Fallback: Find project by id and get its color
  if (task.project_id) {
    const project = projects.value.find(p => Number(p.id) === Number(task.project_id));
    if (project?.color) return project.color;
  }

  return '#9CA3AF'; // Default gray color
};

const getTasksForDate = (date) => {
  // Format date to match task due_date
  const formattedDate = formatDate(date);

  // Get tasks for this date
  return filteredTasks.value.filter(task => {
    // Normalize both dates for comparison (date strings can sometimes
    // have timezone issues)
    const taskDate = task.due_date ? task.due_date.split('T')[0] : null;
    return taskDate === formattedDate;
  });
};

const hasMoreTasks = (date) => {
  // Check if there are more tasks than can be displayed
  const tasks = getTasksForDate(date);
  return tasks.length > 3; // Assuming we can display 3 tasks comfortably
};

const getHiddenTaskCount = (date) => {
  const tasks = getTasksForDate(date);
  return tasks.length - 3; // Assuming we show 3 and hide the rest
};

const isTaskCompleted = (task) => {
  // Check both status object and ID
  if (task.status?.name) {
    const status = task.status.name.toLowerCase();
    return status === 'done' || status === 'completed';
  }

  // If no status object, check if we can find status by ID
  if (task.status_id) {
    const status = projectStatuses.value.find(s => Number(s.id) === Number(task.status_id));
    if (status) {
      const statusName = status.name.toLowerCase();
      return statusName === 'done' || statusName === 'completed';
    }
  }

  return false;
};

const isOverdue = (dateString) => {
  if (!dateString) return false;

  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day
  return dueDate < today;
};

const openNewTaskForDate = (date) => {
  resetTaskForm();
  newTask.value.due_date = formatDateForInput(date);
  showTaskModal.value = true;
};

const viewTaskDetails = (task) => {
  editTask(task);
};

const editTask = (task) => {
  console.log('Editing task:', task.priority);
  isEditingTask.value = true;
  currentTaskId.value = task.id;
  newTask.value = {
    title: task.title,
    description: task.description || '',
    project_id: task.project_id,
    status_id: task.status_id,
    priority_id: task.priority?.id || 3,
    assignee_id: task.assignee_id || '',
    due_date: task.due_date || ''
  };

  console.log('Edit task:', newTask.value);

  // Update project statuses for this task's project
  updateProjectStatuses();

  showTaskModal.value = true;
};

const updateProjectStatuses = () => {
  const projectId = newTask.value.project_id;
  if (!projectId) return;

  const project = projects.value.find(p => Number(p.id) === Number(projectId));
  if (project && project.statuses) {
    projectStatuses.value = project.statuses;

    // Set default status if available
    if (projectStatuses.value.length > 0 && !isEditingTask.value) {
      newTask.value.status_id = projectStatuses.value[0].id;
    }
  } else {
    // Fallback to mock statuses
    projectStatuses.value = getMockStatuses();
  }
};

const saveTask = async () => {
  try {
    if (!newTask.value.title) return;

    isCreating.value = true;

    if (isEditingTask.value && currentTaskId.value) {
      // Update existing task
      await tasksAPI.update(currentTaskId.value, newTask.value).catch(() => {
        // Mock update for development
        const index = tasks.value.findIndex(t => t.id === currentTaskId.value);
        if (index !== -1) {
          const updatedTask = {
            // ...tasks.value[index],
            // ...newTask.value,

          };
          tasks.value[index] = updatedTask;
        }
      });
      fetchTasks();
    } else {
      // Create new task
      await tasksAPI.create(newTask.value).catch(() => {
        // Mock create for development
        const newId = Math.max(0, ...tasks.value.map(t => t.id)) + 1;

        // Find project and status
        const project = projects.value.find(p => Number(p.id) === Number(newTask.value.project_id));
        const status = project?.statuses?.find(s => Number(s.id) === Number(newTask.value.status_id));

        // Find assignee
        const assignee = allUsers.value.find(u => u.User.id === newTask.value.assignee_id);

        const newTaskWithId = {
          id: newId,
          ...newTask.value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          project: project,
          status: status,
          assignee: assignee ? assignee.User : null
        };

        tasks.value.push(newTaskWithId);
      });
      fetchTasks();
    }

    // Reset form and close modal
    resetTaskForm();
    showTaskModal.value = false;
  } catch (err) {
    console.error('Failed to save task:', err);
  } finally {
    isCreating.value = false;
  }
};

const resetTaskForm = () => {
  isEditingTask.value = false;
  currentTaskId.value = null;

  // Reset to default values
  newTask.value = {
    title: '',
    description: '',
    project_id: projects.value.length > 0 ? projects.value[0].id : '',
    status_id: projectStatuses.value.length > 0 ? projectStatuses.value[0].id : '',
    priority_id: 3,
    assignee_id: '',
    due_date: formatDateForInput(new Date())
  };
};

// Mock data generators
const getMockTasks = () => {
  const count = 50; // Create more tasks to have multiple per day
  const tasks = [];

  const taskTitles = [
    'Design homepage layout', 'Implement user authentication', 'Create database schema',
    'Setup API endpoints', 'Write unit tests', 'Deploy to staging environment',
    'Conduct user testing', 'Fix responsive layout issues', 'Optimize database queries',
    'Add error logging', 'Create documentation', 'Setup CI/CD pipeline',
    'Research API technologies', 'Update dependencies', 'Refactor authentication logic',
    'Create user dashboard', 'Design notification system', 'Implement dark mode'
  ];

  const descriptions = [
    'Create a responsive layout for the homepage with focus on mobile experience',
    'Implement secure user authentication with JWT tokens and refresh mechanism',
    'Design and create database schema with proper relations and indexes',
    'Setup RESTful API endpoints with proper validation and error handling',
    'Write comprehensive unit tests for core functionality',
    'Deploy application to staging environment for testing'
  ];

  const priorities = ['low', 'medium', 'high'];

  // Generate tasks for dates in the current month and surrounding months
  const currentYear = currentDate.value.getFullYear();
  const currentMonth = currentDate.value.getMonth();

  // Date range: previous month to next month
  const startDate = new Date(currentYear, currentMonth - 1, 1);
  const endDate = new Date(currentYear, currentMonth + 2, 0);

  for (let i = 0; i < count; i++) {
    // Project ID between 1-5
    const projectId = Math.floor(Math.random() * 5) + 1;

    // Status ID between 1-4
    const statusId = Math.floor(Math.random() * 4) + 1;

    // Random date within the range
    const randomDays = Math.floor(Math.random() * ((endDate - startDate) / (1000 * 60 * 60 * 24)));
    const dueDate = new Date(startDate);
    dueDate.setDate(startDate.getDate() + randomDays);

    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));

    // Random assignee - 30% chance of being unassigned
    const assigneeId = Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : null;

    // Create the task object with properly formatted due date
    tasks.push({
      id: i + 1,
      title: taskTitles[i % taskTitles.length],
      description: descriptions[i % descriptions.length],
      project_id: projectId,
      status_id: statusId,
      priority_id: priorities[Math.floor(Math.random() * priorities.length)],
      assignee_id: assigneeId,
      due_date: formatDate(dueDate),
      created_at: createdDate.toISOString(),
      updated_at: new Date().toISOString(),

      // Include related objects for UI display
      project: {
        id: projectId,
        name: getMockProjectName(projectId),
        color: getMockColor(projectId)
      },
      status: {
        id: statusId,
        name: getMockStatusName(statusId),
        color: getMockStatusColor(statusId)
      },
      assignee: assigneeId ? {
        id: assigneeId,
        first_name: getMockFirstName(assigneeId),
        last_name: getMockLastName(assigneeId)
      } : null
    });
  }

  return tasks;
};

const getMockProjects = () => {
  const projects = [];

  for (let i = 1; i <= 5; i++) {
    // Generate mock statuses for each project
    const statuses = [];
    const statusNames = ['To Do', 'In Progress', 'Review', 'Done'];
    const statusColors = ['#6B7280', '#F59E0B', '#7E57C2', '#16A34A'];

    for (let j = 0; j < statusNames.length; j++) {
      statuses.push({
        id: (i - 1) * 10 + j + 1,
        name: statusNames[j],
        color: statusColors[j],
        order_position: j + 1
      });
    }

    projects.push({
      id: i,
      name: getMockProjectName(i),
      description: `Description for project ${i}`,
      color: getMockColor(i),
      status: 'active',
      statuses: statuses
    });
  }

  return projects;
};

const getMockUsers = () => {
  const users = [];
  const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie'];
  const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];

  for (let i = 0; i < 5; i++) {
    users.push({
      id: i + 1,
      first_name: firstNames[i],
      last_name: lastNames[i],
      email: `${firstNames[i].toLowerCase()}@example.com`
    });
  }

  return users;
};

const getMockStatuses = () => {
  return [
    { id: 1, name: 'To Do', color: '#6B7280' },
    { id: 2, name: 'In Progress', color: '#F59E0B' },
    { id: 3, name: 'Review', color: '#7E57C2' },
    { id: 4, name: 'Done', color: '#16A34A' }
  ];
};

const getMockProjectName = (id) => {
  const names = [
    'Website Redesign',
    'Mobile App',
    'Analytics Dashboard',
    'User Authentication',
    'Payment Integration'
  ];
  return names[(id - 1) % names.length];
};

const getMockColor = (id) => {
  const colors = ['#4A90E2', '#7E57C2', '#16A34A', '#F59E0B', '#EF4444'];
  return colors[(id - 1) % colors.length];
};

const getMockStatusName = (id) => {
  const names = ['To Do', 'In Progress', 'Review', 'Done'];
  return names[(id - 1) % names.length];
};

const getMockStatusColor = (id) => {
  const colors = ['#6B7280', '#F59E0B', '#7E57C2', '#16A34A'];
  return colors[(id - 1) % colors.length];
};

const getMockFirstName = (id) => {
  const names = ['John', 'Jane', 'Alice', 'Bob', 'Charlie'];
  return names[(id - 1) % names.length];
};

const getMockLastName = (id) => {
  const names = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones'];
  return names[(id - 1) % names.length];
};

const fetchProjectTasks = async (projectId) => {
  try {
    loading.value = true;
    error.value = '';

    // Get date range for the calendar view (previous, current, and next month)
    const startMonth = new Date(currentYear.value, currentMonth.value - 1, 1);
    const endMonth = new Date(currentYear.value, currentMonth.value + 2, 0);

    // Prepare query parameters
    const params = {
      due_date_start: formatDate(startMonth),
      due_date_end: formatDate(endMonth)
    };

    // Add project_id if specified
    if (projectId) {
      params.project_id = projectId;
    }

    // Fetch tasks using tasksAPI with date filtering and project filtering
    const response = await tasksAPI.getAll(params).catch(() => {
      // Mock data for development
      // Filter mock tasks based on projectId if needed
      const mockTasks = getMockTasks();
      const filteredMockTasks = projectId
        ? mockTasks.filter(task => Number(task.project_id) === Number(projectId))
        : mockTasks;

      return {
        data: {
          data: filteredMockTasks
        }
      };
    });

    // Store the tasks and ensure due_date is properly formatted
    tasks.value = response.data.data.map(task => ({
      ...task,
      due_date: task.due_date ? task.due_date.split('T')[0] : null
    }));

    loading.value = false;
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    error.value = 'Failed to load tasks. Please try again.';
    loading.value = false;
  }
};

// Update the original fetchTasks function to use the new shared logic
const fetchTasks = () => fetchProjectTasks(selectedProject.value);

// Watch for new task modal
watch(showNewTaskModal, (newVal) => {
  if (newVal) {
    resetTaskForm();
    showTaskModal.value = true;
    showNewTaskModal.value = false;
  }
});

// Watch for month changes to refetch tasks
watch([currentYear, currentMonth], () => {
  fetchTasks();
});

watch(selectedProject, (newProjectId) => {
  // Re-fetch tasks specifically for this project
  fetchProjectTasks(newProjectId);
});

// Lifecycle
onMounted(() => {
  // Load data at component mount
  fetchAllUsers();
  fetchProjects();
  fetchTasks();
  fetchAllProjectStatuses();

  // Add keyboard listener for Escape key to close modal
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && showTaskModal.value) {
      showTaskModal.value = false;
    }
  });
});

// Click outside to close dropdown
const handleClickOutside = (event) => {
  if (viewOptions.value && optionsDropdownRef.value && !optionsDropdownRef.value.contains(event.target)) {
    viewOptions.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
  document.removeEventListener('keydown', (e) => {
    if (e.key === 'Escape' && showTaskModal.value) {
      showTaskModal.value = false;
    }
  });
});
</script>

<style scoped>
/* Custom scrollbar for task lists */
.scrollbar-thin::-webkit-scrollbar {
  width: 4px;
}

.scrollbar-thin::-webkit-scrollbar-track {
  background: transparent;
}

.scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.3);
  border-radius: 9999px;
}

.dark .scrollbar-thin::-webkit-scrollbar-thumb {
  background-color: rgba(156, 163, 175, 0.5);
}

/* Scale transition for task cards */
.hover\:translate-x-1:hover {
  transform: translateX(4px);
}

/* Month transition animation */
.month-year-selector {
  position: relative;
}

@keyframes fadeIn {
  from {
    opacity: 0;
    transform: translateY(-10px);
  }

  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@keyframes fadeOut {
  from {
    opacity: 1;
    transform: translateY(0);
  }

  to {
    opacity: 0;
    transform: translateY(10px);
  }
}

.fade-enter-active {
  animation: fadeIn 0.2s ease-out;
}

.fade-leave-active {
  animation: fadeOut 0.2s ease-in;
}
</style>