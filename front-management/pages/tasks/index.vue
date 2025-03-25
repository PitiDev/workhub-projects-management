<!-- pages/tasks/index.vue -->
<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Page Title and Actions -->
    <div class="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
      <div>
        <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-2">Tasks</h1>
        <p class="text-gray-500 dark:text-gray-400">Manage and track all your tasks</p>
      </div>
      <div class="mt-4 md:mt-0">
        <button @click="showNewTaskModal = true"
          class="btn-primary flex items-center px-4 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm">
          <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Task
        </button>
      </div>
    </div>

    <!-- Task Stats -->
    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Tasks</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ taskStats.total }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
            <svg class="w-8 h-8 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Completed</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ taskStats.completed }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
            <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">In Progress</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ taskStats.inProgress }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex items-center">
          <div class="p-3 rounded-lg bg-red-100 dark:bg-red-900/20">
            <svg class="w-8 h-8 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div class="ml-4">
            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Overdue</p>
            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ taskStats.overdue }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Task Filters -->
    <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 p-6 mb-8">
      <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Filters</h2>

      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <!-- Search Input -->
        <div>
          <label for="search" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input v-model="filters.search" id="search" type="text" placeholder="Search tasks..."
              class="w-full px-4 py-2.5 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" />
          </div>
        </div>

        <!-- Project Filter -->
        <div>
          <label for="project" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Project</label>
          <select v-model="filters.projectId" id="project"
            class="w-full px-4 py-2.5 rounded-lg border dark:text-gray-300 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
            <option value="">All Projects</option>
            <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
          </select>
        </div>

        <!-- Status Filter -->
        <div>
          <label for="status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Status</label>
          <select v-model="filters.statusId" id="status"
            class="w-full px-4 py-2.5 rounded-lg border dark:text-gray-300 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
            <option value="">All Statuses</option>
            <option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.name }}</option>
          </select>
        </div>

        <!-- Priority Filter -->
        <div>
          <label for="priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Priority</label>
          <select v-model="filters.priority" id="priority"
            class="w-full px-4 py-2.5 rounded-lg border dark:text-gray-300 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
            <option value="">All Priorities</option>
            <option value="high">High</option>
            <option value="medium">Medium</option>
            <option value="low">Low</option>
          </select>
        </div>

        <!-- Assignee Filter -->
        <div>
          <label for="assignee" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
          <select v-model="filters.assigneeId" id="assignee"
            class="w-full px-4 py-2.5 rounded-lg border dark:text-gray-300 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200">
            <option value="">All Assignees</option>
            <option value="me">Assigned to Me</option>
            <option value="unassigned">Unassigned</option>
            <option v-for="user in users" :key="user.id" :value="user.id">{{ user.first_name }} {{ user.last_name }}
            </option>
          </select>
        </div>

        <!-- Due Date Range -->
        <div>
          <label for="due-date-start" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date
            (From)</label>
          <input v-model="filters.dueDateStart" id="due-date-start" type="date"
            class="w-full px-4 py-2.5 rounded-lg border dark:text-gray-300 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" />
        </div>

        <div>
          <label for="due-date-end" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date
            (To)</label>
          <input v-model="filters.dueDateEnd" id="due-date-end" type="date"
            class="w-full px-4 py-2.5 rounded-lg border dark:text-gray-300 border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 transition-all duration-200" />
        </div>

        <!-- Action Buttons -->
        <div class="flex items-end space-x-2">
          <button @click="applyFilters"
            class="px-4 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm">
            Apply
          </button>
          <button @click="resetFilters"
            class="px-4 py-2.5 rounded-lg border dark:text-gray-300 border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
            Reset
          </button>
        </div>
      </div>
    </div>

    <!-- Task List -->
    <div
      class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden">
      <div
        class="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between md:items-center">
        <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">Tasks</h2>
        <div class="flex items-center">
          <span class="text-sm text-gray-500 dark:text-gray-400 mr-4">{{ filteredTasks.length }} task(s)</span>
          <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 inline-flex">
            <button @click="viewMode = 'list'"
              class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              :class="viewMode === 'list' ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
              <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6h16M4 10h16M4 14h16M4 18h16" />
              </svg>
              List
            </button>
            <button @click="viewMode = 'cards'"
              class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
              :class="viewMode === 'cards' ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
              <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
              </svg>
              Cards
            </button>
          </div>
        </div>
      </div>

      <!-- Loading state -->
      <div v-if="loading" class="flex justify-center py-20">
        <div class="animate-spin rounded-full h-14 w-14 border-t-4 border-primary-500 border-opacity-50"></div>
      </div>

      <!-- Error state -->
      <div v-else-if="error"
        class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl m-6 p-6 text-red-700 dark:text-red-400 shadow-sm">
        <div class="flex items-center">
          <svg class="w-6 h-6 mr-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="font-medium">{{ error }}</p>
        </div>
        <button @click="fetchTasks"
          class="mt-4 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors duration-200 font-medium text-sm">
          Try again
        </button>
      </div>

      <!-- Empty state -->
      <div v-else-if="filteredTasks.length === 0" class="text-center py-16">
        <svg class="mx-auto h-20 w-20 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
          viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
        </svg>
        <h3 class="mt-4 text-xl font-medium text-gray-900 dark:text-white">No tasks found</h3>
        <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
          {{ getEmptyStateMessage() }}
        </p>
        <div class="mt-6">
          <button @click="showNewTaskModal = true"
            class="inline-flex items-center px-5 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm font-medium">
            <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            Create Task
          </button>
        </div>
      </div>

      <!-- List View -->
      <div v-else-if="viewMode === 'list'" class="overflow-x-auto">
        <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
          <thead class="bg-gray-50 dark:bg-gray-700/50">
            <tr>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Task
              </th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Project
              </th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Status
              </th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Priority
              </th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Assignee
              </th>
              <th scope="col"
                class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Due Date
              </th>
              <th scope="col"
                class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
            <tr v-for="task in filteredTasks" :key="task.id"
              class="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors duration-150">
              <td class="px-6 py-4" @click="viewTaskDetails(task)">
                <div class="flex items-center">
                  <input type="checkbox" :checked="isTaskCompleted(task)" @change="toggleTaskStatus(task)"
                    class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors duration-200">
                  <div class="ml-4">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ task.title }}
                    </div>
                    <div v-if="task.description" class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                      {{ task.description }}
                    </div>
                  </div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div class="w-2 h-2 rounded-full mr-2" :style="{ backgroundColor: task.Project?.color || '#9CA3AF' }">
                  </div>
                  <span class="text-sm text-gray-700 dark:text-gray-300">{{ task.Project?.name || 'Unknown' }}</span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">

                <task-status-dropdown v-model="task.status_id" :statuses="statuses" :task-id="task.id"
                  :loading="statusUpdating === task.id" @status-change="handleStatusChange" />
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <span class="w-2 h-2 rounded-full mr-2" :style="{
                    backgroundColor:
                      task.priority?.id === 1 || task.priority?.name === 'Urgent' ? '#ff0000' :
                        task.priority?.id === 2 || task.priority?.name === 'High' ? '#ff9900' :
                          task.priority?.id === 3 || task.priority?.name === 'Medium' ? '#ffcc00' :
                            task.priority?.id === 4 || task.priority?.name === 'Low' ? '#00cc00' :
                              '#cccccc'
                  }"></span>
                  <span class="px-2 py-1 text-xs font-medium rounded-full" :class="{
                    'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400':
                      task.priority?.id === 1 || task.priority?.name === 'Urgent',

                    'bg-orange-100 text-orange-800 dark:bg-orange-900/20 dark:text-orange-400':
                      task.priority?.id === 2 || task.priority?.name === 'High',

                    'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400':
                      task.priority?.id === 3 || task.priority?.name === 'Medium',

                    'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400':
                      task.priority?.id === 4 || task.priority?.name === 'Low',

                    'bg-gray-100 text-gray-800 dark:bg-gray-700/20 dark:text-gray-400':
                      task.priority?.id === 5 || task.priority?.name === 'No Priority' || !task.priority
                  }">
                    {{
                      task.priority?.name ||
                      (task.priority?.id === 1 ? 'Urgent' :
                        task.priority?.id === 2 ? 'High' :
                          task.priority?.id === 3 ? 'Medium' :
                            task.priority?.id === 4 ? 'Low' :
                              task.priority?.id === 5 ? 'No Priority' : 'No Priority')
                    }}
                  </span>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap">
                <div class="flex items-center">
                  <div v-if="task.assignee" class="h-8 w-8 flex-shrink-0">
                    <img v-if="task.assignee.profile_image" :src="task.assignee.profile_image"
                      class="h-8 w-8 rounded-lg object-cover shadow-sm" :alt="task.assignee.first_name" />
                    <div v-else
                      class="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium shadow-sm">
                      {{ getInitials(task.assignee.first_name, task.assignee.last_name) }}
                    </div>
                  </div>
                  <div v-else class="text-sm text-gray-500 dark:text-gray-400">Unassigned</div>
                </div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-sm">
                <div v-if="task.due_date" :class="{
                  'text-red-600 dark:text-red-400': isOverdue(task.due_date),
                  'text-gray-600 dark:text-gray-400': !isOverdue(task.due_date)
                }">
                  {{ formatDate(task.due_date) }}
                  <span v-if="isOverdue(task.due_date)"
                    class="text-xs text-red-600 dark:text-red-400 font-medium">(Overdue)</span>
                </div>
                <div v-else class="text-gray-500 dark:text-gray-400">No due date</div>
              </td>
              <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div class="flex justify-end space-x-2">
                  <button @click="viewTaskDetails(task)"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-200">
                    View
                  </button>
                  <button @click="editTask(task)"
                    class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 transition-colors duration-200">
                    Edit
                  </button>
                  <button @click="confirmDeleteTask(task)"
                    class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300 transition-colors duration-200">
                    Delete
                  </button>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Card View -->
      <div v-else-if="viewMode === 'cards'" class="p-6">
        <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div v-for="task in filteredTasks" :key="task.id"
            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 overflow-hidden"
            @click="viewTaskDetails(task)">
            <!-- Card Header -->
            <div class="flex items-center justify-between p-4 border-b border-gray-100 dark:border-gray-700">
              <div class="flex items-center space-x-2">
                <div class="w-2 h-2 rounded-full" :style="{ backgroundColor: task.Project?.color || '#9CA3AF' }"></div>
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ task.Project?.name || 'Unknown'
                  }}</span>
              </div>
              <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full" :class="{
                'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400': task.priority === 'high',
                'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400': task.priority === 'medium',
                'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400': task.priority === 'low',
              }">
                {{ capitalize(task.priority) }}
              </span>
            </div>

            <!-- Card Body -->
            <div class="p-4">
              <div class="flex items-center space-x-2 mb-2">
                <input type="checkbox" :checked="isTaskCompleted(task)" @change.stop="toggleTaskStatus(task)"
                  class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors duration-200">
                <h3 class="text-base font-medium text-gray-900 dark:text-white">{{ task.title }}</h3>
              </div>

              <p v-if="task.description" class="text-sm text-gray-500 dark:text-gray-400 mt-1 mb-3 line-clamp-2">
                {{ task.description }}
              </p>

              <div class="flex items-center justify-between mt-4">
                <!-- <span class="px-2.5 py-0.5 text-xs font-semibold rounded-full" :style="{
                  backgroundColor: getStatusColor(task.status_id, '0.1'),
                  color: getStatusColor(task.status_id)
                }">
                  {{ task.status?.name || 'Unknown' }}
                </span> -->
                <task-status-dropdown v-model="task.status_id" :statuses="statuses" :task-id="task.id"
                  :loading="statusUpdating === task.id" @status-change="handleStatusChange" class="inline-block" />

                <div v-if="task.due_date" :class="{
                  'text-xs text-red-600 dark:text-red-400': isOverdue(task.due_date),
                  'text-xs text-gray-500 dark:text-gray-400': !isOverdue(task.due_date)
                }">
                  {{ formatDate(task.due_date) }}
                </div>
              </div>
            </div>

            <!-- Card Footer -->
            <div class="px-4 py-3 bg-gray-50 dark:bg-gray-700/50 flex items-center justify-between">
              <div class="flex items-center">
                <div v-if="task.assignee" class="h-6 w-6 flex-shrink-0">
                  <img v-if="task.assignee.profile_image" :src="task.assignee.profile_image"
                    class="h-6 w-6 rounded-full object-cover shadow-sm" :alt="task.assignee.first_name" />
                  <div v-else
                    class="h-6 w-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium shadow-sm">
                    {{ getInitials(task.assignee.first_name, task.assignee.last_name) }}
                  </div>
                </div>
                <div v-else class="text-xs text-gray-500 dark:text-gray-400">Unassigned</div>
              </div>

              <div class="flex space-x-2">
                <button @click.stop="editTask(task)"
                  class="p-1.5 text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300 rounded-full hover:bg-primary-50 dark:hover:bg-primary-900/20 transition-colors duration-200">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </button>
                <button @click.stop="confirmDeleteTask(task)"
                  class="p-1.5 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                  <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                    stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pagination -->
      <div v-if="filteredTasks.length > 0"
        class="px-6 py-4 bg-gray-50 dark:bg-gray-700/50 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between">
        <div class="flex-1 flex justify-between sm:hidden">
          <button @click="previousPage" :disabled="currentPage === 1"
            class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
            Previous
          </button>
          <button @click="nextPage" :disabled="currentPage === totalPages"
            class="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
            :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
            Next
          </button>
        </div>
        <div class="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
          <div>
            <p class="text-sm text-gray-700 dark:text-gray-300">
              Showing
              <span class="font-medium">{{ paginationStart }}</span>
              to
              <span class="font-medium">{{ paginationEnd }}</span>
              of
              <span class="font-medium">{{ filteredTasks.length }}</span>
              results
            </p>
          </div>
          <div>
            <nav class="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
              <button @click="previousPage" :disabled="currentPage === 1"
                class="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === 1 }">
                <span class="sr-only">Previous</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>

              <template v-for="page in displayedPages" :key="page">
                <button v-if="page !== '...'" @click="goToPage(page)"
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 text-sm font-medium"
                  :class="page === currentPage ? 'z-10 bg-primary-50 dark:bg-primary-900/20 border-primary-500 dark:border-primary-500 text-primary-600 dark:text-primary-400' : 'bg-white dark:bg-gray-800 text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700'">
                  {{ page }}
                </button>
                <span v-else
                  class="relative inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-700 dark:text-gray-300">
                  ...
                </span>
              </template>

              <button @click="nextPage" :disabled="currentPage === totalPages"
                class="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium text-gray-500 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                :class="{ 'opacity-50 cursor-not-allowed': currentPage === totalPages }">
                <span class="sr-only">Next</span>
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
                  aria-hidden="true">
                  <path fill-rule="evenodd"
                    d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z"
                    clip-rule="evenodd" />
                </svg>
              </button>
            </nav>
          </div>
        </div>
      </div>
    </div>

    <!-- New/Edit Task Modal -->
    <div v-if="showTaskModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
            <h3 class="text-xl leading-6 font-semibold text-gray-900 dark:text-gray-100 mb-4">
              {{ isEditingTask ? 'Edit Task' : 'New Task' }}
            </h3>
            <div class="space-y-4">
              <div>
                <label for="task-title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Title
                </label>
                <input id="task-title" v-model="newTask.title" type="text"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200"
                  placeholder="Enter task title" />
              </div>
              <div>
                <label for="task-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Description
                </label>
                <textarea id="task-description" v-model="newTask.description" rows="3"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200"
                  placeholder="Enter task description"></textarea>
              </div>
              <div>
                <label for="task-project" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Project
                </label>
                <select id="task-project" v-model="newTask.project_id" @change="updateProjectStatuses"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200">
                  <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
                </select>
              </div>
              <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label for="task-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Status
                  </label>
                  <select id="task-status" v-model="newTask.status_id"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200">
                    <option v-for="status in statuses" :key="status.id" :value="status.id">{{ status.name }}
                    </option>
                  </select>
                </div>
                <div>
                  <label for="task-priority" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                    Priority
                  </label>
                  <select id="task-priority" v-model="newTask.priority_id"
                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200">
                    <option value="1" class="bg-white dark:bg-gray-800">Urgent</option>
                    <option value="2" class="bg-white dark:bg-gray-800">High</option>
                    <option value="3" class="bg-white dark:bg-gray-800">Medium</option>
                    <option value="4" class="bg-white dark:bg-gray-800">Low</option>
                    <option value="5" class="bg-white dark:bg-gray-800">No Priority</option>
                  </select>
                </div>
              </div>
              <div>
                <label for="task-assignee" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Assignee
                </label>


                <!-- User Search -->
                <div class="space-y-4">
                  <div>
                    <label for="member-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                      Search User by Email
                    </label>
                    <div class="mt-1 relative">
                      <input id="member-email" v-model="userSearchQuery" type="email"
                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200"
                        placeholder="Enter email address" @input="debounceSearch" autocomplete="off" />
                      <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                        <svg v-if="isSearching" class="animate-spin h-5 w-5 text-gray-400"
                          xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                          </circle>
                          <path class="opacity-75" fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                          </path>
                        </svg>
                        <svg v-else class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                          viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                        </svg>
                      </div>
                    </div>
                  </div>

                  <!-- Search Results -->
                  <div v-if="searchResults.length > 0"
                    class="mt-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
                    <ul class="divide-y divide-gray-200 dark:divide-gray-700">
                      <li v-for="user in searchResults" :key="user.id"
                        class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer" @click="selectUser(user)">
                        <div class="flex items-center">
                          <div class="h-10 w-10 flex-shrink-0">
                            <div v-if="user.profile_image" class="h-10 w-10 rounded-full overflow-hidden">
                              <img :src="user.profile_image" class="h-full w-full object-cover"
                                :alt="user.first_name" />
                            </div>
                            <div v-else
                              class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                              {{ getInitials(user.first_name + ' ' + user.last_name) }}
                            </div>
                          </div>
                          <div class="ml-3">
                            <div class="text-sm font-medium text-gray-900 dark:text-white">
                              {{ user.first_name }} {{ user.last_name }}
                            </div>
                            <div class="text-sm text-gray-500 dark:text-gray-400">
                              {{ user.email }}
                            </div>
                          </div>

                        </div>
                      </li>
                    </ul>
                  </div>

                  <!-- No results message -->
                  <div v-else-if="userSearchQuery && !isSearching && hasSearched"
                    class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center py-4 border border-gray-200 dark:border-gray-700 rounded-md">
                    No users found matching "{{ userSearchQuery }}"
                  </div>

                  <!-- Selected User -->
                  <div v-if="selectedUser"
                    class="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700/50">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <div v-if="selectedUser.profile_image" class="h-10 w-10 rounded-full overflow-hidden">
                          <img :src="selectedUser.profile_image" class="h-full w-full object-cover"
                            :alt="selectedUser.first_name" />
                        </div>
                        <div v-else
                          class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                          {{ getInitials(selectedUser.first_name + ' ' + selectedUser.last_name) }}
                        </div>
                      </div>
                      <div class="ml-3">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ selectedUser.first_name }} {{ selectedUser.last_name }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ selectedUser.email }}
                        </div>
                      </div>
                      <button @click="selectedUser = null"
                        class="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                          stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>

                </div>


                <!-- <select id="task-assignee" v-model="newTask.assignee_id"
              class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200">
              <option value="">Unassigned</option>
              <option v-for="user in users" :key="user.id" :value="user.id">
                {{ user.first_name }} {{ user.last_name }}
              </option>
            </select> -->


              </div>
              <div>
                <label for="task-due-date" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                  Due Date
                </label>
                <input id="task-due-date" v-model="newTask.due_date" type="date"
                  class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200" />
              </div>
            </div>
          </div>
          <div
            class="bg-gray-50 dark:bg-gray-750 px-6 py-4 flex justify-end space-x-3 border-t border-gray-200 dark:border-gray-700">
            <button type="button"
              class="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              @click="showTaskModal = false" :disabled="isCreating">
              Cancel
            </button>
            <button type="button"
              class="px-4 py-2.5 rounded-lg bg-primary-600 dark:bg-primary-700 text-white hover:bg-primary-700 dark:hover:bg-primary-600 transition-colors duration-200 shadow-sm font-medium flex items-center"
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

    <!-- Confirm Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-12 sm:w-12">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-xl leading-6 font-semibold text-gray-900 dark:text-white">
                  Delete Task
                </h3>
                <div class="mt-3">
                  <p class="text-base text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete the task "{{ itemToDelete?.title }}"? This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3">
            <button type="button"
              class="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              @click="showDeleteModal = false" :disabled="isDeleting">
              Cancel
            </button>
            <button type="button"
              class="px-4 py-2.5 rounded-lg bg-red-600 text-white hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 transition-colors duration-200 shadow-sm font-medium flex items-center"
              :disabled="isDeleting" @click="confirmDelete">
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { tasksAPI, projectsAPI, teamsAPI } from '~/services/api';
import TaskStatusDropdown from '~/components/TaskStatusDropdown.vue';


definePageMeta({
  layout: 'dashboard',
});

// Router
const router = useRouter();

// State
const loading = ref(true);
const error = ref('');
const tasks = ref([]);
const allTasks = ref([]);
const projects = ref([]);
const statuses = ref([]);
const users = ref([]);
const projectStatuses = ref([]);

// UI State
const viewMode = ref('list'); // 'list' or 'cards'
const showTaskModal = ref(false);
const showNewTaskModal = ref(false);
const showDeleteModal = ref(false);
const isCreating = ref(false);
const isDeleting = ref(false);
const isEditingTask = ref(false);
const currentTaskId = ref(null);
const itemToDelete = ref(null);

//search User
const userSearchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const hasSearched = ref(false);
const selectedUser = ref(null);
let searchTimeout = null;

const statusUpdating = ref(null);

// Filters
const filters = ref({
  search: '',
  projectId: '',
  statusId: '',
  priority: '',
  assigneeId: '',
  dueDateStart: '',
  dueDateEnd: ''
});

// Pagination
const currentPage = ref(1);
const pageSize = ref(10);

// Task form
const newTask = ref({
  title: '',
  description: '',
  project_id: '',
  status_id: '',
  priority_id: 3,
  assignee_id: '',
  due_date: ''
});

// Task stats
const taskStats = ref({
  total: 0,
  completed: 0,
  inProgress: 0,
  overdue: 0
});

// Computed values
const filteredTasks = computed(() => {
  let result = [...allTasks.value];

  // Apply filters
  if (filters.value.search) {
    const query = filters.value.search.toLowerCase();
    result = result.filter(task =>
      task.title.toLowerCase().includes(query) ||
      (task.description && task.description.toLowerCase().includes(query))
    );
  }

  if (filters.value.projectId) {
    result = result.filter(task => task.project_id === parseInt(filters.value.projectId));
  }

  if (filters.value.statusId) {
    result = result.filter(task => task.status_id === parseInt(filters.value.statusId));
  }

  if (filters.value.priority) {
    result = result.filter(task => task.priority === filters.value.priority);
  }

  if (filters.value.assigneeId) {
    if (filters.value.assigneeId === 'me') {
      // Assuming there's a way to get current user ID
      const currentUserId = '1'; // Replace with actual user ID
      result = result.filter(task => task.assignee_id === currentUserId);
    } else if (filters.value.assigneeId === 'unassigned') {
      result = result.filter(task => !task.assignee_id);
    } else {
      result = result.filter(task => task.assignee_id === filters.value.assigneeId);
    }
  }

  if (filters.value.dueDateStart) {
    const startDate = new Date(filters.value.dueDateStart);
    result = result.filter(task => task.due_date && new Date(task.due_date) >= startDate);
  }

  if (filters.value.dueDateEnd) {
    const endDate = new Date(filters.value.dueDateEnd);
    endDate.setHours(23, 59, 59);
    result = result.filter(task => task.due_date && new Date(task.due_date) <= endDate);
  }

  return result;
});

const totalPages = computed(() => {
  return Math.ceil(filteredTasks.value.length / pageSize.value);
});

const paginatedTasks = computed(() => {
  const start = (currentPage.value - 1) * pageSize.value;
  const end = start + pageSize.value;
  return filteredTasks.value.slice(start, end);
});

const paginationStart = computed(() => {
  return (currentPage.value - 1) * pageSize.value + 1;
});

const paginationEnd = computed(() => {
  const end = currentPage.value * pageSize.value;
  return end > filteredTasks.value.length ? filteredTasks.value.length : end;
});

const displayedPages = computed(() => {
  const pages = [];
  const maxPagesToShow = 5;

  if (totalPages.value <= maxPagesToShow) {
    for (let i = 1; i <= totalPages.value; i++) {
      pages.push(i);
    }
  } else {
    // Always show first page
    pages.push(1);

    // Calculate middle pages
    let startPage = Math.max(2, currentPage.value - 1);
    let endPage = Math.min(totalPages.value - 1, currentPage.value + 1);

    // Adjust if we're at the beginning or end
    if (currentPage.value <= 2) {
      endPage = Math.min(totalPages.value - 1, maxPagesToShow - 1);
    } else if (currentPage.value >= totalPages.value - 1) {
      startPage = Math.max(2, totalPages.value - maxPagesToShow + 2);
    }

    // Add ellipsis if needed
    if (startPage > 2) {
      pages.push('...');
    }

    // Add middle pages
    for (let i = startPage; i <= endPage; i++) {
      pages.push(i);
    }

    // Add ellipsis if needed
    if (endPage < totalPages.value - 1) {
      pages.push('...');
    }

    // Always show last page
    pages.push(totalPages.value);
  }

  return pages;
});

const debounceSearch = () => {
  // Clear any pending search
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }

  // If the search query is empty, clear results
  if (!userSearchQuery.value.trim()) {
    searchResults.value = [];
    hasSearched.value = false;
    return;
  }

  // Set a timeout for the search
  searchTimeout = setTimeout(() => {
    searchUsers();
  }, 300); // 300ms debounce
};

// Search users by email
const searchUsers = async () => {
  try {
    if (!userSearchQuery.value.trim() || userSearchQuery.value.length < 2) {
      searchResults.value = [];
      hasSearched.value = false;
      return;
    }

    isSearching.value = true;
    hasSearched.value = true;

    // Call the searchUsers function from teamsAPI
    const response = await teamsAPI.searchUsers(userSearchQuery.value.trim());

    console.log("userSearchQuery: ", response.success)

    // Update results based on the API response format
    searchResults.value = response.data.data || [];
  } catch (err) {
    console.error('Failed to search users:', err);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};


// Select a user from search results
const selectUser = (user) => {
  newTask.value.assignee_id = user.id;
  console.log("user: ", user)
  console.log("user assignee_id: ", newTask.value.assignee_id)
  selectedUser.value = user;
  userSearchQuery.value = '';
  searchResults.value = [];
};

// Functions
const fetchTasks = async () => {
  try {
    loading.value = true;
    error.value = '';

    // Fetch tasks using tasksAPI
    const response = await tasksAPI.getAll().catch(() => {
      // Mock data for development
      return {
        data: {
          data: getMockTasks()
        }
      };
    });

    allTasks.value = response.data.data;
    tasks.value = allTasks.value;

    // Update task stats
    updateTaskStats();

    loading.value = false;
  } catch (err) {
    console.error('Failed to fetch tasks:', err);
    error.value = 'Failed to load tasks. Please try again.';
    loading.value = false;
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
    }
  } catch (err) {
    console.error('Failed to fetch projects:', err);
  }
};

const fetchUsers = async () => {
  try {
    // Since usersAPI is not available, we'll use mock data
    users.value = getMockUsers();
  } catch (err) {
    console.error('Failed to generate mock users:', err);
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
      statuses.value = getMockStatuses();
    }
  } catch (err) {
    console.error('Error fetching all project statuses:', err);
    statuses.value = getMockStatuses();
  }
};

const updateProjectStatuses = () => {
  const projectId = newTask.value.project_id;
  if (!projectId) return;

  const project = projects.value.find(p => p.id === parseInt(projectId));
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

// Task actions
const updateTaskStats = () => {
  const total = allTasks.value.length;

  // Count completed tasks (assuming a status with name 'Done' or 'Completed')
  const completedTasks = allTasks.value.filter(task => {
    const status = task.status?.name?.toLowerCase();
    return status === 'done' || status === 'completed';
  }).length;

  // Count in-progress tasks
  const inProgressTasks = allTasks.value.filter(task => {
    const status = task.status?.name?.toLowerCase();
    return status === 'in progress' || status === 'doing';
  }).length;

  // Count overdue tasks
  const overdueTasks = allTasks.value.filter(task => isOverdue(task.due_date)).length;

  taskStats.value = {
    total,
    completed: completedTasks,
    inProgress: inProgressTasks,
    overdue: overdueTasks
  };
};

const handleStatusChange = async ({ taskId, statusId }) => {
  try {
    statusUpdating.value = taskId;

    // Find the task
    const task = allTasks.value.find(t => t.id === taskId);
    if (!task) {
      throw new Error(`Task with ID ${taskId} not found`);
    }

    // Create updated task with new status
    const updatedTask = {
      ...task,
      status_id: statusId
    };

    // Find the status object for logging
    const newStatus = statuses.value.find(s => s.id === statusId);
    console.log(`Changing task ${taskId} status to ${newStatus?.name || 'Unknown'} (${statusId})`);

    // Update the task
    await updateTask(updatedTask);

    // Success notification
    if (window.$toast && window.$toast.success) {
      window.$toast.success(`Task status updated to ${newStatus?.name || 'Unknown'}`);
    }
  } catch (err) {
    console.error('Error changing task status:', err);

    // Revert the status in UI (will be refreshed on next data fetch)
    const task = allTasks.value.find(t => t.id === taskId);
    if (task) {
      // This will trigger a refresh of the component
      task._forceRefresh = Date.now();
    }

    // Error notification
    if (window.$toast && window.$toast.error) {
      window.$toast.error('Failed to update task status');
    }
  } finally {
    statusUpdating.value = null;
  }
};

const isTaskCompleted = (task: any) => {
  // Check by status id if possible
  if (task.status_id) {
    const status = statuses.value.find(s => s.id === task.status_id);
    if (status) {
      const name = status.name.toLowerCase();
      return name === 'done' || name === 'completed';
    }
  }

  // Fall back to checking status name if available
  if (task.status && task.status.name) {
    const name = task.status.name.toLowerCase();
    return name === 'done' || name === 'completed';
  }

  return false;
}

const toggleTaskStatus = async (task) => {
  try {
    // Find 'Done/Completed' and 'To Do' statuses
    const doneStatus = statuses.value.find(s =>
      s.name.toLowerCase() === 'done' || s.name.toLowerCase() === 'completed'
    );

    const todoStatus = statuses.value.find(s =>
      s.name.toLowerCase() === 'to do' || s.name.toLowerCase() === 'todo' || s.name.toLowerCase() === 'backlog'
    );

    if (!doneStatus || !todoStatus) {
      console.error('Cannot find appropriate statuses for toggling');
      return;
    }

    // Determine the new status
    const isCurrentlyDone = isTaskCompleted(task);
    const newStatusId = isCurrentlyDone ? todoStatus.id : doneStatus.id;

    console.log(`Toggling task ${task.id} from ${task.status?.name} (${task.status_id}) to ${isCurrentlyDone ? todoStatus.name : doneStatus.name} (${newStatusId})`);

    // Create updated task object
    const updatedTask = {
      ...task,
      status_id: newStatusId
    };

    // Update the task via API
    await updateTask(updatedTask);

    // Show success notification if available
    if (window.$toast && window.$toast.success) {
      window.$toast.success(`Task ${isCurrentlyDone ? 'unmarked' : 'marked'} as ${isCurrentlyDone ? 'incomplete' : 'complete'}`);
    }
  } catch (err) {
    console.error('Error toggling task status:', err);

    // Show error notification if available
    if (window.$toast && window.$toast.error) {
      window.$toast.error('Failed to update task status');
    }
  }
};

const updateTask = async (task) => {
  try {
    // Create a payload with only the necessary fields for the update
    const payload = {
      status_id: task.status_id
    };

    console.log(`Updating task ${task.id} with payload:`, payload);

    // Update via API
    const response = await fetch(`/api/api/tasks/${task.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify(payload)
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Failed to update task');
    }

    // Get the updated task from the response
    const updatedData = await response.json();
    console.log('Task updated successfully:', updatedData);

    // Update task in local state
    const index = allTasks.value.findIndex(t => t.id === task.id);
    if (index !== -1) {
      // Merge the updated data with existing task data
      allTasks.value[index] = {
        ...allTasks.value[index],
        ...updatedData.data || updatedData
      };

      // Update task stats
      updateTaskStats();
    }
  } catch (err) {
    console.error('Failed to update task:', err);
    throw err; // Re-throw to handle in the calling function
  }
};

const editTask = (task) => {
  isEditingTask.value = true;
  currentTaskId.value = task.id;
  newTask.value = {
    title: task.title,
    description: task.description || '',
    project_id: task.project_id,
    status_id: task.status_id,
    priority: task.priority,
    assignee_id: task.assignee_id || '',
    due_date: task.due_date || ''
  };

  // Update project statuses for this task's project
  updateProjectStatuses();

  showTaskModal.value = true;
};

const viewTaskDetails = (task) => {
  // Navigate to task detail page
  router.push(`/tasks/${task.id}`);
};

const saveTask = async () => {
  try {
    if (!newTask.value.title) return;

    isCreating.value = true;

    if (isEditingTask.value && currentTaskId.value) {
      // Update existing task
      await tasksAPI.update(currentTaskId.value, newTask.value).catch(() => {
        // Mock update for development
        const index = allTasks.value.findIndex(t => t.id === currentTaskId.value);
        if (index !== -1) {
          const updatedTask = {
            ...allTasks.value[index],
            ...newTask.value
          };
          allTasks.value[index] = updatedTask;
        }
      });
      fetchTasks();
    } else {
      // Create new task
      await tasksAPI.create(newTask.value).catch(() => {
        // Mock create for development
        const newId = Math.max(0, ...allTasks.value.map(t => t.id)) + 1;

        // Find project and status
        const project = projects.value.find(p => p.id === parseInt(newTask.value.project_id));
        const status = project?.statuses?.find(s => s.id === parseInt(newTask.value.status_id)) ||
          statuses.value.find(s => s.id === parseInt(newTask.value.status_id));

        // Find assignee
        const assignee = users.value.find(u => u.id === newTask.value.assignee_id);

        const newTaskWithId = {
          id: newId,
          ...newTask.value,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          project: project,
          status: status,
          assignee: assignee
        };

        allTasks.value.push(newTaskWithId);
      });

      fetchTasks();
    }

    // Reset form and close modal
    resetTaskForm();
    showTaskModal.value = false;

    // Update task stats
    updateTaskStats();
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
    priority: 'medium',
    assignee_id: '',
    due_date: ''
  };
};

const confirmDeleteTask = (task) => {
  itemToDelete.value = task;
  showDeleteModal.value = true;
};

const confirmDelete = async () => {
  try {
    isDeleting.value = true;

    if (itemToDelete.value) {
      await tasksAPI.delete(itemToDelete.value.id).catch(() => {
        // Mock delete for development
        allTasks.value = allTasks.value.filter(t => t.id !== itemToDelete.value.id);
      });
    }

    // Close modal and refresh
    showDeleteModal.value = false;
    fetchTasks();
  } catch (err) {
    console.error('Failed to delete task:', err);
  } finally {
    isDeleting.value = false;
  }
};

// Filter functions
const applyFilters = () => {
  currentPage.value = 1; // Reset to first page when applying filters
};

const resetFilters = () => {
  filters.value = {
    search: '',
    projectId: '',
    statusId: '',
    priority: '',
    assigneeId: '',
    dueDateStart: '',
    dueDateEnd: ''
  };
  currentPage.value = 1;
};

// Pagination
const previousPage = () => {
  if (currentPage.value > 1) {
    currentPage.value--;
  }
};

const nextPage = () => {
  if (currentPage.value < totalPages.value) {
    currentPage.value++;
  }
};

const goToPage = (page) => {
  currentPage.value = page;
};

// Helper functions
const getEmptyStateMessage = () => {
  // Check if filters are applied
  const hasFilters = filters.value.search || filters.value.projectId || filters.value.statusId ||
    filters.value.priority || filters.value.assigneeId ||
    filters.value.dueDateStart || filters.value.dueDateEnd;

  if (hasFilters) {
    return "No tasks match your current filters. Try adjusting your search criteria.";
  }

  return "You don't have any tasks yet. Create your first task to get started.";
};

const isOverdue = (dateString) => {
  if (!dateString) return false;

  const dueDate = new Date(dateString);
  const today = new Date();
  today.setHours(0, 0, 0, 0); // Set to beginning of day
  return dueDate < today;
};

const getStatusColor = (statusId, opacity = '1') => {
  // Find status in the project statuses or global statuses
  const status = statuses.value.find(s => s.id === statusId);

  if (status) {
    if (opacity !== '1') {
      // Convert hex to rgba
      const hex = status.color.replace('#', '');
      const r = parseInt(hex.substring(0, 2), 16);
      const g = parseInt(hex.substring(2, 4), 16);
      const b = parseInt(hex.substring(4, 6), 16);
      return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }
    return status.color;
  }

  // Default colors based on status names
  const statusName = getStatusName(statusId).toLowerCase();
  if (statusName.includes('done') || statusName.includes('completed')) {
    return opacity === '1' ? '#16A34A' : 'rgba(22, 163, 74, ' + opacity + ')';
  } else if (statusName.includes('progress') || statusName.includes('doing')) {
    return opacity === '1' ? '#F59E0B' : 'rgba(245, 158, 11, ' + opacity + ')';
  } else if (statusName.includes('todo') || statusName.includes('backlog')) {
    return opacity === '1' ? '#6B7280' : 'rgba(107, 114, 128, ' + opacity + ')';
  } else if (statusName.includes('review')) {
    return opacity === '1' ? '#7E57C2' : 'rgba(126, 87, 194, ' + opacity + ')';
  }

  return opacity === '1' ? '#6B7280' : 'rgba(107, 114, 128, ' + opacity + ')';
};

const getStatusName = (statusId) => {
  const status = statuses.value.find(s => s.id === statusId);
  return status ? status.name : 'Unknown';
};

// Format helpers
const formatDate = (dateString) => {
  if (!dateString) return '';
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const getInitials = (firstName, lastName) => {
  const first = firstName ? firstName.charAt(0).toUpperCase() : '';
  const last = lastName ? lastName.charAt(0).toUpperCase() : '';
  return (first + last).substring(0, 2);
};

const capitalize = (str) => {
  if (!str || typeof str !== 'string') return '';
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Mock data generators
const getMockTasks = () => {
  const count = 35;
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
  const dueInDays = [-5, -2, 0, 3, 7, 14, 30]; // Negative means overdue

  for (let i = 0; i < count; i++) {
    // Project ID between 1-5
    const projectId = Math.floor(Math.random() * 5) + 1;

    // Status ID between 1-4
    const statusId = Math.floor(Math.random() * 4) + 1;

    // Generate dates
    const dueDay = dueInDays[Math.floor(Math.random() * dueInDays.length)];
    const dueDate = new Date();
    dueDate.setDate(dueDate.getDate() + dueDay);

    const createdDate = new Date();
    createdDate.setDate(createdDate.getDate() - Math.floor(Math.random() * 30));

    // Random assignee - 30% chance of being unassigned
    const assigneeId = Math.random() > 0.3 ? Math.floor(Math.random() * 5) + 1 : null;

    // Create the task object
    tasks.push({
      id: i + 1,
      title: taskTitles[i % taskTitles.length],
      description: descriptions[i % descriptions.length],
      project_id: projectId,
      status_id: statusId,
      priority: priorities[Math.floor(Math.random() * priorities.length)],
      assignee_id: assigneeId,
      due_date: Math.random() > 0.2 ? dueDate.toISOString().split('T')[0] : null,
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
        last_name: getMockLastName(assigneeId),
        profile_image: Math.random() > 0.5 ? `https://i.pravatar.cc/150?u=${assigneeId}` : null
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
      email: `${firstNames[i].toLowerCase()}@example.com`,
      profile_image: Math.random() > 0.5 ? `https://i.pravatar.cc/150?u=${i + 1}` : null
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

// Watch for new task modal
watch(showNewTaskModal, (newVal) => {
  if (newVal) {
    resetTaskForm();
    showTaskModal.value = true;
    showNewTaskModal.value = false;
  }
});

// Lifecycle
onMounted(async () => {
  try {
    // Fetch projects first
    await fetchProjects();

    // Then fetch all statuses from all projects
    await fetchAllProjectStatuses();

    // Fetch remaining data
    await Promise.all([
      fetchTasks(),
      fetchUsers()
    ]);
  } catch (err) {
    console.error('Error during component initialization:', err);
  }
});

</script>