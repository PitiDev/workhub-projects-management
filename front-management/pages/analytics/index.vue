<!-- pages/analytics/index.vue -->
<template>
  <div class="container mx-auto px-4 py-8 max-w-7xl">
    <!-- Page Header -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8">
      <div>
        <h1 class="text-3xl md:text-4xl font-bold text-gray-900 dark:text-white mb-2 tracking-tight">Analytics</h1>
        <p class="text-gray-500 dark:text-gray-400 text-lg">Track your projects' performance and progress</p>
      </div>
      <div class="mt-4 sm:mt-0 flex space-x-3">
        <div class="relative" ref="periodDropdownRef">
          <button @click="periodDropdown = !periodDropdown" type="button"
            class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 flex items-center transition-all duration-200 shadow-sm">
            <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            {{ periodLabels[selectedPeriod] }}
            <svg class="w-4 h-4 ml-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor" :class="{ 'transform rotate-180': periodDropdown }">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
            </svg>
          </button>
          <div v-if="periodDropdown"
            class="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-xl shadow-xl border border-gray-200 dark:border-gray-700 z-10 transition-all duration-200 transform origin-top-right">
            <div class="py-1">
              <button v-for="(label, period) in periodLabels" :key="period" @click="selectPeriod(period)"
                class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                :class="{ 'bg-gray-100 dark:bg-gray-700': selectedPeriod === period }">
                {{ label }}
              </button>
            </div>
          </div>
        </div>
        <select v-model="selectedProject"
          class="px-4 py-2.5 bg-white dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl text-gray-700 dark:text-gray-300 text-sm focus:outline-none focus:ring-2 focus:ring-primary-500 dark:focus:ring-primary-400 transition-all duration-200 shadow-sm">
          <option value="">All Projects</option>
          <option v-for="project in projects" :key="project.id" :value="project.id">{{ project.name }}</option>
        </select>
      </div>
    </div>

    <!-- Loading State -->
    <div v-if="loading" class="flex justify-center py-24">
      <div class="flex flex-col items-center">
        <div class="animate-spin rounded-full h-16 w-16 border-b-4 border-t-4 border-primary-500"></div>
        <p class="mt-4 text-gray-500 dark:text-gray-400">Loading analytics data...</p>
      </div>
    </div>

    <!-- Error State -->
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
      <button @click="fetchData"
        class="mt-5 px-5 py-2.5 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-xl transition-colors duration-200 font-medium">
        Try again
      </button>
    </div>

    <!-- Analytics Dashboard Content -->
    <div v-else>
      <!-- Stats Summary Cards -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <!-- Total Tasks Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Total Tasks</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.totalTasks }}</p>
            </div>
            <div class="p-3 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
              <svg class="w-6 h-6 text-blue-500 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span
              :class="stats.taskGrowth >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
              class="text-sm font-medium flex items-center">
              <svg v-if="stats.taskGrowth >= 0" class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                  clip-rule="evenodd" />
              </svg>
              {{ Math.abs(stats.taskGrowth) }}%
            </span>
            <span class="text-gray-500 dark:text-gray-400 text-sm ml-2">vs previous period</span>
          </div>
        </div>

        <!-- Completed Tasks Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Completed Tasks</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.completedTasks }}</p>
            </div>
            <div class="p-3 bg-green-50 dark:bg-green-900/20 rounded-lg">
              <svg class="w-6 h-6 text-green-500 dark:text-green-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M5 13l4 4L19 7" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
              <div class="bg-green-500 dark:bg-green-400 h-2.5 rounded-full"
                :style="{ width: `${stats.completionRate}%` }"></div>
            </div>
            <p class="text-sm text-gray-500 dark:text-gray-400 mt-2">{{ stats.completionRate }}% completion rate</p>
          </div>
        </div>

        <!-- Overdue Tasks Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Overdue Tasks</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.overdueTasks }}</p>
            </div>
            <div class="p-3 bg-red-50 dark:bg-red-900/20 rounded-lg">
              <svg class="w-6 h-6 text-red-500 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4">
            <span class="px-2.5 py-1 text-xs font-medium rounded-full"
              :class="stats.overdueTasks > 5 ? 'bg-red-100 dark:bg-red-900/30 text-red-800 dark:text-red-300' : 'bg-yellow-100 dark:bg-yellow-900/30 text-yellow-800 dark:text-yellow-300'">
              {{ stats.overdueTasks > 5 ? 'Needs attention' : 'Under control' }}
            </span>
          </div>
        </div>

        <!-- Team Productivity Card -->
        <div
          class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 transition-all duration-300 hover:shadow-lg">
          <div class="flex items-center justify-between">
            <div>
              <p class="text-sm font-medium text-gray-500 dark:text-gray-400 mb-1">Team Productivity</p>
              <p class="text-3xl font-bold text-gray-900 dark:text-white">{{ stats.productivity }}%</p>
            </div>
            <div class="p-3 bg-purple-50 dark:bg-purple-900/20 rounded-lg">
              <svg class="w-6 h-6 text-purple-500 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
            </div>
          </div>
          <div class="mt-4 flex items-center">
            <span
              :class="stats.productivityChange >= 0 ? 'text-green-500 dark:text-green-400' : 'text-red-500 dark:text-red-400'"
              class="text-sm font-medium flex items-center">
              <svg v-if="stats.productivityChange >= 0" class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12 7a1 1 0 110-2h5a1 1 0 011 1v5a1 1 0 11-2 0V8.414l-4.293 4.293a1 1 0 01-1.414 0L8 10.414l-4.293 4.293a1 1 0 01-1.414-1.414l5-5a1 1 0 011.414 0L11 10.586 14.586 7H12z"
                  clip-rule="evenodd" />
              </svg>
              <svg v-else class="w-4 h-4 mr-1" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12 13a1 1 0 100 2h5a1 1 0 001-1V9a1 1 0 10-2 0v2.586l-4.293-4.293a1 1 0 00-1.414 0L8 9.586 3.707 5.293a1 1 0 00-1.414 1.414l5 5a1 1 0 001.414 0L11 9.414 14.586 13H12z"
                  clip-rule="evenodd" />
              </svg>
              {{ Math.abs(stats.productivityChange) }}%
            </span>
            <span class="text-gray-500 dark:text-gray-400 text-sm ml-2">vs previous period</span>
          </div>
        </div>
      </div>

      <!-- Charts Section -->
      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        <!-- Task Completion Trend (Simplified) -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Completion Trend</h2>
          <div class="h-72 flex items-end justify-between gap-2">
            <div v-for="(item, index) in chartData.taskCompletionTrend" :key="index" class="flex flex-col items-center">
              <div class="flex flex-col items-center gap-1">
                <div class="w-6 bg-blue-500 dark:bg-blue-600"
                  :style="{ height: `${(item.created / getMaxValue(chartData.taskCompletionTrend, 'created')) * 150}px` }">
                </div>
                <div class="w-6 bg-green-500 dark:bg-green-600"
                  :style="{ height: `${(item.completed / getMaxValue(chartData.taskCompletionTrend, 'completed')) * 150}px` }">
                </div>
              </div>
              <span class="text-xs text-gray-500 dark:text-gray-400 mt-2">{{ item.date }}</span>
            </div>
          </div>
          <div class="flex justify-center mt-4">
            <div class="flex items-center mr-4">
              <div class="w-3 h-3 bg-blue-500 dark:bg-blue-600 mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">Created</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-green-500 dark:bg-green-600 mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">Completed</span>
            </div>
          </div>
        </div>

        <!-- Task Status Distribution (Simplified) -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Task Status Distribution</h2>
          <br>
          <div class="h-72 flex flex-col justify-center">
            <div class="grid grid-cols-4 gap-4 mb-8">
              <div v-for="(item, index) in chartData.taskStatusDistribution" :key="index"
                class="flex flex-col items-center">
                <div class="w-full aspect-square rounded-full flex items-center justify-center"
                  :style="{ backgroundColor: getStatusColor(item.name) }">
                  <span class="text-lg font-bold text-white">{{ item.value }}%</span>
                </div>
                <span class="text-sm text-gray-600 dark:text-gray-300 mt-2">{{ item.name }}</span>
              </div>
            </div>
          </div>
        </div>

        <!-- Project Progress (Simplified) -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Progress</h2>

          <div class=" flex flex-col justify-center space-y-6">
            <div v-for="(project, index) in chartData.projectProgress" :key="index" class="space-y-2">
              <div class="flex justify-between items-center">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ project.name }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ project.completed }} / {{ project.completed + project.remaining }} tasks
                </span>
              </div>
              <div class="w-full h-6 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="h-full flex">
                  <div class="h-full bg-green-500 dark:bg-green-600"
                    :style="{ width: `${(project.completed / (project.completed + project.remaining)) * 100}%` }"></div>
                  <div class="h-full bg-yellow-500 dark:bg-yellow-600"
                    :style="{ width: `${(project.remaining / (project.completed + project.remaining)) * 100}%` }"></div>
                </div>
              </div>
            </div>
          </div>
          <div class="flex justify-center mt-4">
            <div class="flex items-center mr-4">
              <div class="w-3 h-3 bg-green-500 dark:bg-green-600 mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">Completed</span>
            </div>
            <div class="flex items-center">
              <div class="w-3 h-3 bg-yellow-500 dark:bg-yellow-600 mr-2"></div>
              <span class="text-sm text-gray-600 dark:text-gray-300">Remaining</span>
            </div>
          </div>
        </div>

        <!-- Team Performance (Simplified) -->
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Team Member Performance</h2>
          <div class=" flex flex-col justify-center space-y-8">
            <div v-for="(member, index) in chartData.teamPerformance" :key="index" class="space-y-4">
              <div class="flex items-center justify-between">
                <span class="text-sm font-medium text-gray-700 dark:text-gray-300">{{ member.name }}</span>
                <span class="text-xs text-gray-500 dark:text-gray-400">
                  {{ calculateAverage(member) }}% avg. performance
                </span>
              </div>
              <div class="grid grid-cols-5 gap-2">
                <div
                  v-for="(key, keyIndex) in ['tasks_completed', 'on_time_rate', 'communication', 'quality', 'collaboration']"
                  :key="keyIndex" class="space-y-1">
                  <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-1.5">
                    <div class="bg-purple-500 dark:bg-purple-600 h-1.5 rounded-full"
                      :style="{ width: `${member[key]}%` }"></div>
                  </div>
                  <span class="text-xs text-gray-500 dark:text-gray-400 block text-center">{{ formatMetricName(key)
                    }}</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Task Priority Distribution -->
      <div class="grid grid-cols-1 gap-6 mb-8">
        <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
          <div class="flex justify-between items-center mb-4">
            <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Task Priority Distribution</h2>
            <div class="flex space-x-4">
              <div class="flex items-center">
                <div class="w-3 h-3 bg-red-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-500 dark:text-gray-400">High</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-yellow-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-500 dark:text-gray-400">Medium</span>
              </div>
              <div class="flex items-center">
                <div class="w-3 h-3 bg-blue-500 rounded-full mr-2"></div>
                <span class="text-sm text-gray-500 dark:text-gray-400">Low</span>
              </div>
            </div>
          </div>
          <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-for="(project, index) in priorityData" :key="index"
              class="border border-gray-100 dark:border-gray-700 rounded-lg p-4">
              <div class="flex justify-between items-center mb-3">
                <h3 class="font-medium text-gray-900 dark:text-white">{{ project.name }}</h3>
                <span class="text-xs text-gray-500 dark:text-gray-400">{{ project.total }} tasks</span>
              </div>
              <div class="w-full h-4 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div class="flex h-full">
                  <div class="h-full bg-red-500" :style="{ width: `${project.distribution.high}%` }"></div>
                  <div class="h-full bg-yellow-500" :style="{ width: `${project.distribution.medium}%` }"></div>
                  <div class="h-full bg-blue-500" :style="{ width: `${project.distribution.low}%` }"></div>
                </div>
              </div>
              <div class="flex justify-between mt-2 text-xs text-gray-500 dark:text-gray-400">
                <span>{{ project.distribution.high }}%</span>
                <span>{{ project.distribution.medium }}%</span>
                <span>{{ project.distribution.low }}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
        <div class="flex justify-between items-center mb-4">
          <h2 class="text-lg font-semibold text-gray-900 dark:text-white">Recent Activity</h2>
          <button class="text-primary-600 dark:text-primary-400 text-sm font-medium hover:underline">View All</button>
        </div>
        <div class="space-y-4">
          <div v-for="(activity, index) in recentActivity" :key="index"
            class="p-4 border border-gray-100 dark:border-gray-700 rounded-lg flex items-start space-x-4 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors duration-150">
            <div :class="`p-2 rounded-full ${activity.iconBg}`">
              <svg class="w-5 h-5" :class="activity.iconColor" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" :d="activity.iconPath" />
              </svg>
            </div>
            <div class="flex-1">
              <div class="flex flex-col sm:flex-row sm:justify-between sm:items-center">
                <p class="font-medium text-gray-900 dark:text-white">{{ activity.title }}</p>
                <span class="text-sm text-gray-500 dark:text-gray-400 mt-1 sm:mt-0">{{ activity.time }}</span>
              </div>
              <p class="text-gray-600 dark:text-gray-300 mt-1">{{ activity.description }}</p>
              <div class="flex items-center mt-2">
                <div class="w-6 h-6 rounded-full overflow-hidden bg-gray-200 dark:bg-gray-700 flex-shrink-0">
                  <img v-if="activity.user.image" :src="activity.user.image" alt="User"
                    class="w-full h-full object-cover" />
                  <div v-else
                    class="w-full h-full flex items-center justify-center text-xs font-medium text-gray-600 dark:text-gray-300 uppercase">
                    {{ activity.user.initials }}
                  </div>
                </div>
                <span class="text-sm text-gray-500 dark:text-gray-400 ml-2">{{ activity.user.name }}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<!-- This is not the full file, just the script section with needed changes -->
<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { projectsAPI } from '~/services/api';
import { analyticsAPI } from '~/services/api/analytics'; // Import the analytics API

definePageMeta({
  layout: 'dashboard',
});

// State
const loading = ref(true);
const error = ref('');
const projects = ref([]);
const selectedProject = ref('');
const periodDropdown = ref(false);
const periodDropdownRef = ref(null);
const selectedPeriod = ref('week');

// Time periods for filtering
const periodLabels = {
  week: 'Last 7 Days',
  month: 'Last 30 Days',
  quarter: 'Last 90 Days',
  year: 'Last 12 Months'
};

// Statistics data
const stats = ref({
  totalTasks: 0,
  completedTasks: 0,
  overdueTasks: 0,
  productivity: 0,
  taskGrowth: 0,
  productivityChange: 0,
  completionRate: 0
});

// Chart data
const chartData = ref({
  taskCompletionTrend: [],
  taskStatusDistribution: [],
  projectProgress: [],
  teamPerformance: []
});

// Priority distribution data
const priorityData = ref([]);

// Recent activity data
const recentActivity = ref([]);

// Helper functions for simplified charts
const getMaxValue = (data, key) => {
  return Math.max(...data.map(item => item[key]));
};

const getStatusColor = (status) => {
  const colors = {
    'To Do': '#6366F1', // Indigo
    'In Progress': '#F59E0B', // Amber
    'Review': '#7E57C2', // Purple
    'Completed': '#10B981', // Emerald
    'Done': '#10B981', // Also use emerald for "Done" status
    'Cancelled': '#EF4444', // Red
  };
  return colors[status] || '#9CA3AF'; // Default gray
};

const calculateAverage = (member) => {
  const metrics = ['tasks_completed', 'on_time_rate', 'communication', 'quality', 'collaboration'];
  const sum = metrics.reduce((acc, key) => acc + member[key], 0);
  return Math.round(sum / metrics.length);
};

const formatMetricName = (key) => {
  return key.split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ')
    .replace('Completed', 'Tasks');
};

// Functions
const selectPeriod = (period) => {
  selectedPeriod.value = period;
  periodDropdown.value = false;
  fetchData();
};

// Fetch projects from API
const fetchProjects = async () => {
  try {
    // Fetch projects using projectsAPI
    const response = await projectsAPI.getAll().catch((err) => {
      console.error('Error fetching projects:', err);
      // If API call fails, use empty array
      return { data: { data: [] } };
    });

    projects.value = response.data.data || [];
  } catch (err) {
    console.error('Failed to fetch projects:', err);
  }
};

// Format date for recent activities
const formatRelativeTime = (dateString) => {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return 'just now';
  } else if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `${hours} hour${hours > 1 ? 's' : ''} ago`;
  } else if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `${days} day${days > 1 ? 's' : ''} ago`;
  } else {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric'
    });
  }
};

// Fetch data from API
const fetchData = async () => {
  try {
    loading.value = true;
    error.value = '';

    // Define the project ID parameter for API calls
    const projectId = selectedProject.value ? parseInt(selectedProject.value) : undefined;

    // Make all API calls in parallel
    const [
      overviewData,
      trendData,
      statusData,
      progressData,
      teamData,
      priorityData,
      activityData
    ] = await Promise.all([
      analyticsAPI.getOverview(selectedPeriod.value, projectId),
      analyticsAPI.getTaskCompletionTrend(selectedPeriod.value, projectId),
      analyticsAPI.getTaskStatusDistribution(projectId),
      analyticsAPI.getProjectProgress(),
      analyticsAPI.getTeamPerformance(selectedPeriod.value),
      analyticsAPI.getTaskPriorityDistribution(),
      analyticsAPI.getRecentActivity(5)
    ]).catch(err => {
      console.error('Error fetching analytics data:', err);
      error.value = 'Failed to load analytics data. Please try again.';
      throw err;
    });

    // Update the UI state with API data
    stats.value = overviewData;

    // Process task trend data for the UI
    chartData.value.taskCompletionTrend = trendData.map(item => ({
      date: new Date(item.date).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric'
      }).replace(' ', '\n'),
      created: item.created,
      completed: item.completed
    }));

    // Process status distribution
    chartData.value.taskStatusDistribution = statusData;

    // Process project progress data
    chartData.value.projectProgress = progressData;

    // Process team performance data
    chartData.value.teamPerformance = teamData;

    // Process priority distribution data
    priorityData.value = priorityData || [];

    // Process activity data
    recentActivity.value = activityData.map(activity => ({
      ...activity,
      time: formatRelativeTime(activity.time)
    }));

    loading.value = false;
  } catch (err) {
    console.error('Failed to fetch analytics data:', err);
    // Fallback to mock data if API fails in development
    if (process.env.NODE_ENV === 'development') {
      generateMockAnalyticsData();
    }
    loading.value = false;
  }
};

// Function to generate mock data (keep as fallback)
const generateMockAnalyticsData = () => {
  console.warn('Using mock data because API call failed');

  // Generate mock stats
  stats.value = {
    totalTasks: Math.floor(Math.random() * 100) + 100,
    completedTasks: Math.floor(Math.random() * 80) + 20,
    overdueTasks: Math.floor(Math.random() * 15),
    productivity: Math.floor(Math.random() * 30) + 70,
    taskGrowth: Math.floor(Math.random() * 20) - 5,
    productivityChange: Math.floor(Math.random() * 15) - 3,
    completionRate: 0
  };

  // Calculate completion rate
  stats.value.completionRate = Math.round((stats.value.completedTasks / stats.value.totalTasks) * 100);

  // Generate task completion trend data
  chartData.value.taskCompletionTrend = generateTaskCompletionTrendData();

  // Generate task status distribution data
  chartData.value.taskStatusDistribution = [
    { name: 'To Do', value: Math.floor(Math.random() * 40) + 10 },
    { name: 'In Progress', value: Math.floor(Math.random() * 30) + 10 },
    { name: 'Review', value: Math.floor(Math.random() * 20) + 5 },
    { name: 'Completed', value: Math.floor(Math.random() * 50) + 20 }
  ];

  // Generate project progress data
  chartData.value.projectProgress = generateProjectProgressData();

  // Generate team performance data
  chartData.value.teamPerformance = [
    { name: 'John', tasks_completed: Math.floor(Math.random() * 50) + 50, on_time_rate: Math.floor(Math.random() * 30) + 70, communication: Math.floor(Math.random() * 20) + 80, quality: Math.floor(Math.random() * 25) + 75, collaboration: Math.floor(Math.random() * 20) + 80 },
    { name: 'Jane', tasks_completed: Math.floor(Math.random() * 50) + 50, on_time_rate: Math.floor(Math.random() * 30) + 70, communication: Math.floor(Math.random() * 20) + 80, quality: Math.floor(Math.random() * 25) + 75, collaboration: Math.floor(Math.random() * 20) + 80 },
    { name: 'Alice', tasks_completed: Math.floor(Math.random() * 50) + 50, on_time_rate: Math.floor(Math.random() * 30) + 70, communication: Math.floor(Math.random() * 20) + 80, quality: Math.floor(Math.random() * 25) + 75, collaboration: Math.floor(Math.random() * 20) + 80 }
  ];

  // Generate priority distribution data
  priorityData.value = generatePriorityData();

  // Generate recent activity data
  recentActivity.value = generateRecentActivityData();
};

// Keep these helper functions for mock data generation as fallback
const generateTaskCompletionTrendData = () => {
  const data = [];
  const numDays = selectedPeriod.value === 'week' ? 7 :
    selectedPeriod.value === 'month' ? 10 :
      selectedPeriod.value === 'quarter' ? 6 : 12;

  for (let i = 0; i < numDays; i++) {
    const date = new Date();
    date.setDate(date.getDate() - (numDays - i - 1));

    const formattedDate = selectedPeriod.value === 'week' ?
      date.toLocaleDateString('en-US', { weekday: 'short' }) :
      date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' }).replace(' ', '\n');

    data.push({
      date: formattedDate,
      created: Math.floor(Math.random() * 10) + 1,
      completed: Math.floor(Math.random() * 8) + 1
    });
  }

  return data;
};

const generateProjectProgressData = () => {
  const projectNames = ['Website Redesign', 'Mobile App', 'Analytics Dashboard', 'User Authentication', 'Payment Integration'];
  const data = [];

  for (let i = 0; i < 5; i++) {
    const total = Math.floor(Math.random() * 50) + 20;
    const completed = Math.floor(Math.random() * total);
    const remaining = total - completed;

    data.push({
      name: projectNames[i % projectNames.length],
      completed,
      remaining
    });
  }

  return data;
};

const generatePriorityData = () => {
  const projectNames = ['Website Redesign', 'Mobile App', 'Analytics Dashboard', 'User Authentication', 'Payment Integration'];
  const data = [];

  for (let i = 0; i < 5; i++) {
    const highPercentage = Math.floor(Math.random() * 30) + 10;
    const mediumPercentage = Math.floor(Math.random() * 30) + 30;
    const lowPercentage = 100 - highPercentage - mediumPercentage;
    const total = Math.floor(Math.random() * 50) + 20;

    data.push({
      name: projectNames[i % projectNames.length],
      total,
      distribution: {
        high: highPercentage,
        medium: mediumPercentage,
        low: lowPercentage
      }
    });
  }

  return data;
};

const generateRecentActivityData = () => {
  const activities = [
    {
      title: 'Task Completed',
      description: 'Homepage design has been marked as completed.',
      time: '3 hours ago',
      user: { name: 'John Smith', initials: 'JS', image: null },
      iconPath: 'M5 13l4 4L19 7',
      iconColor: 'text-green-500',
      iconBg: 'bg-green-100 dark:bg-green-900/20'
    },
    {
      title: 'New Comment',
      description: 'Added a comment to the User Authentication task.',
      time: '5 hours ago',
      user: { name: 'Jane Johnson', initials: 'JJ', image: null },
      iconPath: 'M7 8h10M7 12h4m1 8l-4-4H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-3l-4 4z',
      iconColor: 'text-blue-500',
      iconBg: 'bg-blue-100 dark:bg-blue-900/20'
    },
    {
      title: 'Task Created',
      description: 'Created a new task: "Implement dark mode" for Website Redesign project.',
      time: '1 day ago',
      user: { name: 'Alice Williams', initials: 'AW', image: null },
      iconPath: 'M12 4v16m8-8H4',
      iconColor: 'text-primary-500',
      iconBg: 'bg-primary-100 dark:bg-primary-900/20'
    },
    {
      title: 'Task Status Updated',
      description: 'API Integration task moved from In Progress to Review.',
      time: '2 days ago',
      user: { name: 'Bob Brown', initials: 'BB', image: null },
      iconPath: 'M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15',
      iconColor: 'text-yellow-500',
      iconBg: 'bg-yellow-100 dark:bg-yellow-900/20'
    },
    {
      title: 'Project Created',
      description: 'New project "Analytics Dashboard" has been created.',
      time: '4 days ago',
      user: { name: 'Charlie Jones', initials: 'CJ', image: null },
      iconPath: 'M9 13h6m-3-3v6m5 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z',
      iconColor: 'text-purple-500',
      iconBg: 'bg-purple-100 dark:bg-purple-900/20'
    }
  ];

  return activities;
};

// Lifecycle hooks
onMounted(() => {
  fetchProjects();
  fetchData();
});

// Watch for changes
watch([selectedProject, selectedPeriod], () => {
  fetchData();
});

// Click outside to close dropdown
const handleClickOutside = (event) => {
  if (periodDropdown.value && periodDropdownRef.value && !periodDropdownRef.value.contains(event.target)) {
    periodDropdown.value = false;
  }
};

onMounted(() => {
  document.addEventListener('click', handleClickOutside);
});

onBeforeUnmount(() => {
  document.removeEventListener('click', handleClickOutside);
});
</script>