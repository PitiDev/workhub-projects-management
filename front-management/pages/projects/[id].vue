<!-- projects/[id].vue -->
<template>
    <div class="container mx-auto px-4 py-8 max-w-7xl">
        <!-- Loading state -->
        <div v-if="loading" class="flex justify-center py-20">
            <div class="animate-spin rounded-full h-14 w-14 border-t-4 border-primary-500 border-opacity-50"></div>
        </div>

        <!-- Error state -->
        <div v-else-if="error"
            class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-xl p-6 text-red-700 dark:text-red-400 shadow-sm">
            <div class="flex items-center">
                <svg class="w-6 h-6 mr-3 text-red-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <p class="font-medium">{{ error }}</p>
            </div>
            <button @click="fetchProject"
                class="mt-4 px-4 py-2 bg-red-100 text-red-600 hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900/50 rounded-lg transition-colors duration-200 font-medium text-sm">
                Try again
            </button>
        </div>

        <div v-else>
            <!-- Project Header -->
            <div
                class="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-md overflow-hidden border border-gray-100 dark:border-gray-700">
                <!-- Project color bar -->
                <div class="h-2" :style="{ backgroundColor: project.color }"></div>

                <div class="p-6">
                    <div class="flex flex-col lg:flex-row justify-between gap-4">
                        <div class="flex-1">
                            <div class="flex items-center">
                                <h1 class="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">{{ project.name
                                    }}</h1>
                                <span class="ml-4 px-3 py-1 text-xs font-semibold rounded-full" :class="{
                                    'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400': project.status === 'active',
                                    'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400': project.status === 'completed',
                                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300': project.status === 'archived',
                                }">
                                    {{ capitalize(project.status) }}
                                </span>
                            </div>
                            <p class="mt-2 text-gray-500 dark:text-gray-400">{{ project.description || 'No description'
                                }}</p>

                            <div class="mt-6 flex flex-wrap gap-4">
                                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <svg class="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                                    </svg>
                                    <span>{{ project.Team?.name || 'No team assigned' }}</span>
                                </div>
                                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400">
                                    <svg class="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                                    </svg>
                                    <span>Created on {{ formatDate(project.created_at) }}</span>
                                </div>
                                <div class="flex items-center text-sm text-gray-600 dark:text-gray-400"
                                    v-if="project.due_date">
                                    <svg class="w-5 h-5 mr-2 text-gray-400 dark:text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                                    </svg>
                                    <span>Due {{ formatDate(project.due_date) }}</span>
                                </div>
                            </div>
                        </div>

                        <div class="flex lg:items-end gap-3 flex-wrap">
                            <button @click="showNewTaskModal = true"
                                class="btn-primary flex items-center px-4 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm">
                                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                                New Task
                            </button>
                            <button @click="showEditProjectModal = true"
                                class="btn-outline flex items-center px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200">
                                <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                </svg>
                                Edit Project
                            </button>

                        </div>
                    </div>
                </div>
            </div>

            <!-- Project Stats -->
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-3 rounded-lg bg-blue-100 dark:bg-blue-900/20">
                            <svg class="w-8 h-8 text-blue-600 dark:text-blue-400" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Total Tasks</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ projectStats.totalTasks }}
                            </p>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-3 rounded-lg bg-green-100 dark:bg-green-900/20">
                            <svg class="w-8 h-8 text-green-600 dark:text-green-400" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Completed</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ projectStats.completedTasks
                                }}</p>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-3 rounded-lg bg-yellow-100 dark:bg-yellow-900/20">
                            <svg class="w-8 h-8 text-yellow-600 dark:text-yellow-400" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">In Progress</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ projectStats.inProgressTasks
                                }}</p>
                        </div>
                    </div>
                </div>

                <div
                    class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700">
                    <div class="flex items-center">
                        <div class="p-3 rounded-lg bg-purple-100 dark:bg-purple-900/20">
                            <svg class="w-8 h-8 text-purple-600 dark:text-purple-400" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                            </svg>
                        </div>
                        <div class="ml-4">
                            <p class="text-lg font-semibold text-gray-700 dark:text-gray-300">Team Members</p>
                            <p class="text-2xl font-bold text-gray-900 dark:text-white">{{ projectStats.teamMembers }}
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            <!-- Project Tabs -->
            <div
                class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700 overflow-hidden mb-8">
                <div class="border-b border-gray-200 dark:border-gray-700">
                    <nav class="flex px-4 overflow-x-auto">
                        <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
                            class="py-5 px-6 font-medium text-sm border-b-2 whitespace-nowrap transition-colors duration-200"
                            :class="activeTab === tab.id
                                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'">
                            {{ tab.name }}
                        </button>
                    </nav>
                </div>

                <!-- Tasks Tab -->
                <div v-if="activeTab === 'tasks'" class="p-6">
                    <div class="mb-6 flex flex-col sm:flex-row gap-4">
                        <div class="flex-1">
                            <div class="relative">
                                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <svg class="h-5 w-5 text-gray-400 dark:text-gray-500"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                                    </svg>
                                </div>
                                <input v-model="tasksSearchQuery" type="text" placeholder="Search tasks..."
                                    class="w-full px-4  py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200" />
                            </div>
                        </div>
                        <div class="min-w-[150px]">
                            <select v-model="tasksStatusFilter"
                                class="w-full px-4 py-3 dark:text-gray-300 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200">
                                <option value="">All Statuses</option>
                                <option v-for="status in project.statuses" :key="status.id" :value="status.id">{{
                                    status.name }}</option>
                            </select>
                        </div>
                        <div class="min-w-[150px]">
                            <select v-model="tasksPriorityFilter"
                                class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:text-gray-300 dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200">
                                <option value="">All Priorities</option>
                                <option value="high">High</option>
                                <option value="medium">Medium</option>
                                <option value="low">Low</option>
                            </select>
                        </div>
                    </div>

                    <!-- Tasks Kanban Board/List Toggle -->
                    <div class="mb-6 flex justify-end">
                        <div class="bg-gray-100 dark:bg-gray-700 rounded-lg p-1 inline-flex">
                            <button @click="taskViewMode = 'list'"
                                class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                                :class="taskViewMode === 'list' ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
                                <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6h16M4 10h16M4 14h16M4 18h16" />
                                </svg>
                                List
                            </button>
                            <button @click="taskViewMode = 'board'"
                                class="px-3 py-1.5 rounded-md text-sm font-medium transition-colors duration-200 flex items-center"
                                :class="taskViewMode === 'board' ? 'bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200 shadow-sm' : 'text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'">
                                <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                    viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z" />
                                </svg>
                                Board
                            </button>
                        </div>
                    </div>

                    <!-- List View -->
                    <div v-if="taskViewMode === 'list'" class="overflow-x-auto rounded-lg">
                        <table v-if="filteredTasks.length > 0"
                            class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                            <thead class="bg-gray-50 dark:bg-gray-700/50">
                                <tr>
                                    <th scope="col"
                                        class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                                        Task
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
                                    <td class="px-6 py-4">
                                        <div class="flex items-center">
                                            <input type="checkbox" :checked="task.status_id === completedStatusId"
                                                @change="toggleTaskStatus(task)"
                                                class="h-4 w-4 text-primary-600 focus:ring-primary-500 border-gray-300 rounded transition-colors duration-200">
                                            <div class="ml-4">
                                                <NuxtLink
                                                    :to="`/tasks/${task.id}`"
                                                    class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:underline"
                                                    style="cursor:pointer"
                                                >
                                                    {{ task.title }}
                                                </NuxtLink>
                                                <div v-if="task.description"
                                                    class="text-xs text-gray-500 dark:text-gray-400 line-clamp-1">
                                                    {{ task.description }}
                                                </div>
                                            </div>
                                        </div>
                                    </td>
                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <span class="px-3 py-1 inline-flex text-xs leading-5 font-semibold rounded-full"
                                            :style="{ backgroundColor: getStatusColor(task.status_id, '0.1'), color: getStatusColor(task.status_id) }">
                                            {{ getStatusName(task.status_id) }}
                                        </span>
                                    </td>

                                    <td class="px-6 py-4 whitespace-nowrap">
                                        <!-- Priority badge with direct matching approach -->
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
                                                <img v-if="task.assignee.profile_image"
                                                    :src="task.assignee.profile_image"
                                                    class="h-8 w-8 rounded-lg object-cover shadow-sm"
                                                    :alt="task.assignee.first_name" />
                                                <div v-else
                                                    class="h-8 w-8 rounded-lg bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium shadow-sm">
                                                    {{ getInitials(task.assignee.first_name) }}
                                                </div>
                                            </div>
                                            <div v-else class="text-sm text-gray-500 dark:text-gray-400">Unassigned
                                            </div>
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

                        <!-- Empty tasks list -->
                        <div v-else class="text-center py-12">
                            <svg class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
                            </svg>
                            <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">No tasks found</h3>
                            <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                                {{ filteredTasksMessage }}
                            </p>
                            <div class="mt-6">
                                <button @click="showNewTaskModal = true"
                                    class="inline-flex items-center px-5 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm font-medium">
                                    <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Create Task
                                </button>
                            </div>
                        </div>
                    </div>

                    <!-- Board View -->
                    <div v-else-if="taskViewMode === 'board'" class="overflow-x-auto">
                        <div class="flex gap-6 min-w-max pb-4">
                            <div v-for="status in project.statuses" :key="status.id" class="w-80">
                                <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl p-4">
                                    <div class="flex items-center justify-between mb-4">
                                        <h3 class="font-semibold flex items-center dark:text-gray-300">
                                            <div class="w-3 h-3 rounded-full mr-2"
                                                :style="{ backgroundColor: status.color }"></div>
                                            {{ status.name }}
                                        </h3>
                                        <span
                                            class="text-xs px-2 py-1 bg-gray-200 dark:bg-gray-600 rounded-full text-gray-700 dark:text-gray-300">
                                            {{ getTasksByStatus(status.id).length }}
                                        </span>
                                    </div>

                                    <div v-if="getTasksByStatus(status.id).length === 0"
                                        class="py-10 flex flex-col items-center justify-center bg-white dark:bg-gray-800 rounded-lg border border-dashed border-gray-300 dark:border-gray-600">
                                        <svg class="w-8 h-8 text-gray-300 dark:text-gray-600 mb-2"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                            stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                d="M12 4v16m8-8H4" />
                                        </svg>
                                        <button @click="showNewTaskModal = true; newTask.status_id = status.id"
                                            class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                                            Add a task
                                        </button>
                                    </div>

                                    <div class="space-y-3 mt-1">
                                        <div v-for="task in getTasksByStatus(status.id)" :key="task.id"
                                            class="bg-white dark:bg-gray-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 hover:shadow-md transition-shadow duration-200 cursor-pointer"
                                            @click="editTask(task)">
                                            <div class="flex justify-between items-start mb-2">
                                                <span class="px-2 py-1 text-xs font-semibold rounded-full" :class="{
                                                    'bg-red-100 dark:bg-red-900/20 text-red-800 dark:text-red-400': task.priority === 'high',
                                                    'bg-yellow-100 dark:bg-yellow-900/20 text-yellow-800 dark:text-yellow-400': task.priority === 'medium',
                                                    'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400': task.priority === 'low',
                                                }">
                                                    {{ capitalize(task.priority) }}
                                                </span>
                                                <div v-if="task.due_date" :class="{
                                                    'text-red-600 dark:text-red-400 text-xs': isOverdue(task.due_date),
                                                    'text-gray-500 dark:text-gray-400 text-xs': !isOverdue(task.due_date)
                                                }">
                                                    {{ formatDateShort(task.due_date) }}
                                                </div>
                                            </div>
                                            <h4 class="font-medium text-gray-900 dark:text-white mb-2">{{ task.title }}
                                            </h4>
                                            <p v-if="task.description"
                                                class="text-xs text-gray-500 dark:text-gray-400 line-clamp-2 mb-3">
                                                {{ task.description }}
                                            </p>
                                            <div class="flex justify-between items-center mt-2">
                                                <div v-if="task.assignee" class="flex items-center">
                                                    <div class="h-6 w-6 flex-shrink-0">
                                                        <img v-if="task.assignee.profile_image"
                                                            :src="task.assignee.profile_image"
                                                            class="h-6 w-6 rounded-full object-cover shadow-sm"
                                                            :alt="task.assignee.first_name" />
                                                        <div v-else
                                                            class="h-6 w-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium shadow-sm">
                                                            {{ getInitials(task.assignee.first_name) }}
                                                        </div>
                                                    </div>
                                                </div>
                                                <div v-if="task.checklist_items && task.checklist_items.length > 0"
                                                    class="text-xs text-gray-500 dark:text-gray-400 flex items-center">
                                                    <svg class="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg"
                                                        fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                                    </svg>
                                                    {{task.checklist_items.filter(item => item.completed).length}}/{{
                                                        task.checklist_items.length }}
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Timeline Tab -->
                <div v-else-if="activeTab === 'timeline'" class="p-6">
                    <div class="text-center py-12">
                        <svg class="mx-auto h-16 w-16 text-gray-300 dark:text-gray-600"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                        </svg>
                        <h3 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Timeline View Coming Soon
                        </h3>
                        <p class="mt-2 text-gray-500 dark:text-gray-400 max-w-sm mx-auto">
                            We're working on a timeline view to help you visualize your project schedule.
                        </p>
                    </div>
                </div>

                <!-- Team Tab -->
                <div v-else-if="activeTab === 'team'" class="p-6">
                    <!-- Team Members List -->
                    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        <div v-for="(member, index) in project.team_members" :key="index"
                            class="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-100 dark:border-gray-700 overflow-hidden hover:shadow-md transition-all duration-200">
                            <div class="p-6">
                                <div class="flex items-center">
                                    <div class="h-12 w-12 flex-shrink-0">
                                        <img v-if="member.User.profile_image" :src="member.User.profile_image"
                                            class="h-12 w-12 rounded-lg object-cover shadow-sm" :alt="member.name" />
                                        <div v-else
                                            class="h-12 w-12 rounded-lg bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-base font-medium shadow-sm">
                                            {{ getInitials(member.User.first_name) }}
                                        </div>
                                    </div>
                                    <div class="ml-4">
                                        <div class="text-lg font-medium text-gray-900 dark:text-white">
                                            {{ member.User.first_name }} {{ member.User.last_name }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-gray-400">
                                            {{ member.User.email || member.role }}
                                        </div>
                                        <div class="text-sm text-gray-500 dark:text-white">
                                            {{ member.role }}
                                        </div>
                                    </div>
                                </div>

                                <div class="mt-4 pt-4 border-t border-gray-100 dark:border-gray-700">
                                    <!-- <div class="text-sm text-gray-500 dark:text-gray-400 mb-2">
                                        <span class="font-medium text-gray-700 dark:text-gray-300">Tasks: </span>
                                        {{ member.tasks_count || 0 }}
                                    </div> -->
                                    <div v-if="member.last_active" class="text-sm text-gray-500 dark:text-gray-400">
                                        <span class="font-medium text-gray-700 dark:text-white">Last active: </span>
                                        {{ formatDateFromNow(member.last_active) }}
                                    </div>
                                </div>
                            </div>
                        </div>

                        <!-- Add Team Member -->
                        <div class="bg-gray-50 dark:bg-gray-700/50 rounded-xl border border-dashed border-gray-300 dark:border-gray-600 flex flex-col items-center justify-center p-6 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200 cursor-pointer"
                            @click="showAddTeamMemberModal = true">
                            <div
                                class="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-600 flex items-center justify-center mb-4">
                                <svg class="w-6 h-6 text-gray-500 dark:text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                </svg>
                            </div>
                            <p class="text-base font-medium text-gray-700 dark:text-gray-300">Add Team Member</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400 text-center mt-1">
                                Invite someone to collaborate on this project
                            </p>
                        </div>
                    </div>
                </div>

                <!-- Files Tab -->
                <div v-else-if="activeTab === 'files'" class="p-6">
                    <!-- Files Header -->
                    <div class="flex justify-between items-center mb-6">
                        <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Project Files</h3>
                        <button
                            class="px-4 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm flex items-center">
                            <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0l-4 4m4-4v12" />
                            </svg>
                            Upload File
                        </button>
                    </div>

                    <!-- Files List -->
                    <div class="space-y-4">
                        <div v-for="(file, index) in projectFiles" :key="index"
                            class="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-100 dark:border-gray-700 p-4 flex items-center justify-between hover:shadow-md transition-shadow duration-200">
                            <div class="flex items-center">
                                <div class="p-2 rounded-lg" :class="{
                                    'bg-blue-100 dark:bg-blue-900/20': file.type === 'document',
                                    'bg-green-100 dark:bg-green-900/20': file.type === 'spreadsheet',
                                    'bg-red-100 dark:bg-red-900/20': file.type === 'pdf',
                                    'bg-purple-100 dark:bg-purple-900/20': file.type === 'image',
                                    'bg-gray-100 dark:bg-gray-700': !['document', 'spreadsheet', 'pdf', 'image'].includes(file.type),
                                }">
                                    <svg class="w-8 h-8" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor" :class="{
                                            'text-blue-600 dark:text-blue-400': file.type === 'document',
                                            'text-green-600 dark:text-green-400': file.type === 'spreadsheet',
                                            'text-red-600 dark:text-red-400': file.type === 'pdf',
                                            'text-purple-600 dark:text-purple-400': file.type === 'image',
                                            'text-gray-600 dark:text-gray-400': !['document', 'spreadsheet', 'pdf', 'image'].includes(file.type),
                                        }">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" />
                                    </svg>
                                </div>
                                <div class="ml-4">
                                    <div class="text-base font-medium text-gray-900 dark:text-white">
                                        {{ file.name }}
                                    </div>
                                    <div class="text-sm text-gray-500 dark:text-gray-400 flex items-center">
                                        <span>{{ formatFileSize(file.size) }}</span>
                                        <span class="mx-2">&bull;</span>
                                        <span>{{ formatDate(file.uploaded_at) }}</span>
                                        <span class="mx-2">&bull;</span>
                                        <span>Uploaded by {{ file.uploaded_by }}</span>
                                    </div>
                                </div>
                            </div>
                            <div class="flex space-x-2">
                                <button
                                    class="p-2 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-200">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                                    </svg>
                                </button>
                                <button
                                    class="p-2 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                                    <svg class="w-5 h-5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                </button>
                            </div>
                        </div>
                    </div>
                </div>

                <!-- Settings Tab -->
                <div v-else-if="activeTab === 'settings'" class="p-6">
                    <div class="max-w-3xl mx-auto">
                        <!-- Project Info -->
                        <div
                            class="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                            <h3 class="text-lg font-semibold text-gray-900 dark:text-white mb-4">Project Information
                            </h3>
                            <div class="space-y-4">
                                <div>
                                    <label for="project-name"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Project Name
                                    </label>
                                    <input id="project-name" v-model="editedProject.name" type="text"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200"
                                        placeholder="Enter project name" />
                                </div>
                                <div>
                                    <label for="project-description"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Description
                                    </label>
                                    <textarea id="project-description" v-model="editedProject.description" rows="3"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200"
                                        placeholder="Enter project description"></textarea>
                                </div>
                                <div>
                                    <label for="project-color"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Project Color
                                    </label>
                                    <div class="flex items-center gap-3">
                                        <input id="project-color" v-model="editedProject.color" type="color"
                                            class="h-10 w-16 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer" />
                                        <span class="text-sm text-gray-700 dark:text-gray-300">{{ editedProject.color
                                        }}</span>
                                    </div>
                                </div>
                                <div>
                                    <label for="project-status"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <select id="project-status" v-model="editedProject.status"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200">
                                        <option value="active" class="bg-white dark:bg-gray-800">Active</option>
                                        <option value="completed" class="bg-white dark:bg-gray-800">Completed</option>
                                        <option value="archived" class="bg-white dark:bg-gray-800">Archived</option>
                                    </select>
                                </div>
                                <div>
                                    <label for="project-due-date"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Due Date
                                    </label>
                                    <input id="project-due-date" v-model="editedProject.due_date" type="date"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200" />
                                </div>
                                <div class="pt-4">
                                    <button @click="updateProjectInfo"
                                        class="px-5 py-3 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm font-medium flex items-center"
                                        :disabled="isUpdating">
                                        <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                stroke-width="4"></circle>
                                            <path class="opacity-75" fill="currentColor"
                                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                            </path>
                                        </svg>
                                        Save Changes
                                    </button>
                                </div>
                            </div>
                        </div>

                        <!-- Project Statuses Section (Replace in projects/[id].vue) -->
                        <div
                            class="mb-8 bg-white dark:bg-gray-800 rounded-xl shadow-sm p-6 border border-gray-100 dark:border-gray-700">
                            <div class="flex justify-between items-center mb-4">
                                <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Task Statuses</h3>
                                <button @click="showAddStatusModal = true"
                                    class="px-3 py-1.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm flex items-center text-sm">
                                    <svg class="w-4 h-4 mr-1.5" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                                    </svg>
                                    Add Status
                                </button>
                            </div>

                            <!-- Loading state -->
                            <div v-if="statusesLoading" class="py-8 flex justify-center">
                                <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-primary-500">
                                </div>
                            </div>

                            <!-- Error state -->
                            <div v-else-if="statusesError" class="bg-red-50 text-red-700 p-4 rounded-md mb-4">
                                {{ statusesError }}
                            </div>

                            <!-- Status List with drag and drop -->
                            <div v-else class="space-y-3">
                                <draggable v-model="orderedStatuses" item-key="id" handle=".drag-handle"
                                    ghost-class="bg-primary-50 dark:bg-primary-900/20" @end="onStatusReorder">
                                    <template #item="{ element: status, index }">
                                        <div
                                            class="flex items-center justify-between p-3 bg-gray-50 dark:bg-gray-700/50 rounded-lg">
                                            <div class="flex items-center">
                                                <div class="w-4 h-4 rounded-full mr-3"
                                                    :style="{ backgroundColor: status.color }"></div>
                                                <span class="font-medium text-gray-900 dark:text-white">{{ status.name
                                                    }}</span>
                                            </div>
                                            <div class="flex items-center space-x-2">
                                                <button @click="editStatus(status)"
                                                    class="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200">
                                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                                                    </svg>
                                                </button>
                                                <button v-if="index !== 0 && project.statuses.length > 1"
                                                    @click="confirmDeleteStatus(status)"
                                                    class="p-1.5 text-red-500 dark:text-red-400 hover:text-red-700 dark:hover:text-red-300 rounded-full hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-200">
                                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2"
                                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                </button>
                                                <button
                                                    class="p-1.5 text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors duration-200 cursor-move drag-handle">
                                                    <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                        viewBox="0 0 24 24" stroke="currentColor">
                                                        <path stroke-linecap="round" stroke-linejoin="round"
                                                            stroke-width="2" d="M4 8h16M4 16h16" />
                                                    </svg>
                                                </button>
                                            </div>
                                        </div>
                                    </template>
                                </draggable>
                            </div>

                        </div>

                        <!-- Add/Edit Status Modal -->
                        <div v-if="showAddStatusModal || showEditStatusModal"
                            class="fixed inset-0 z-50 overflow-y-auto">
                            <div
                                class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                                    <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                                </div>

                                <span class="hidden sm:inline-block sm:align-middle sm:h-screen"
                                    aria-hidden="true">&#8203;</span>

                                <div
                                    class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                                    <div class="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
                                        <h3 class="text-xl leading-6 font-semibold text-gray-900 dark:text-white mb-4">
                                            {{ isEditingStatus ? 'Edit Status' : 'New Status' }}
                                        </h3>
                                        <div class="space-y-4">
                                            <div>
                                                <label for="status-name"
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Status Name
                                                </label>
                                                <input id="status-name" v-model="newStatus.name" type="text"
                                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200"
                                                    placeholder="Enter status name" maxlength="50" required />
                                            </div>
                                            <div>
                                                <label for="status-color"
                                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                                    Color
                                                </label>
                                                <div class="flex items-center gap-3">
                                                    <input id="status-color" v-model="newStatus.color" type="color"
                                                        class="h-10 w-16 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer" />
                                                    <span class="text-sm text-gray-700 dark:text-gray-300">
                                                        {{ newStatus.color }}
                                                    </span>
                                                </div>
                                            </div>
                                            <div>
                                                <p class="mt-3 text-sm text-gray-500 dark:text-gray-400">
                                                    Status order can be changed by dragging and dropping in the status
                                                    list.
                                                </p>
                                            </div>
                                        </div>
                                    </div>
                                    <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3">
                                        <button type="button"
                                            class="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                                            @click="closeStatusModal" :disabled="isStatusUpdating">
                                            Cancel
                                        </button>
                                        <button type="button"
                                            class="px-4 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm font-medium flex items-center"
                                            :disabled="isStatusUpdating || !newStatus.name || !newStatus.color"
                                            @click="saveStatus">
                                            <svg v-if="isStatusUpdating"
                                                class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                                    stroke-width="4">
                                                </circle>
                                                <path class="opacity-75" fill="currentColor"
                                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                                </path>
                                            </svg>
                                            {{ isStatusUpdating ? (isEditingStatus ? 'Updating...' : 'Creating...') :
                                            (isEditingStatus ?
                                            'Update' : 'Create') }}
                                        </button>
                                    </div>
                                </div>
                            </div>
                        </div>
                        <!-- Danger Zone -->
                        <div class="pt-6">
                            <h3 class="text-lg font-semibold text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
                            <div
                                class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-xl p-6 shadow-sm">
                                <div class="flex items-center mb-2">
                                    <svg class="w-6 h-6 text-red-500 dark:text-red-400 mr-2"
                                        xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                        stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    <h4 class="text-base font-medium text-red-800 dark:text-red-300">Delete this project
                                    </h4>
                                </div>
                                <p class="text-sm text-red-700 dark:text-red-400 mb-4">
                                    Once deleted, all project data including tasks, comments, and files will be
                                    permanently removed. This action cannot be undone.
                                </p>
                                <button @click="confirmDeleteProject"
                                    class="px-4 py-3 bg-red-600 hover:bg-red-700 dark:bg-red-700 dark:hover:bg-red-800 text-white rounded-lg transition-colors duration-200 font-medium text-sm flex items-center">
                                    <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                    </svg>
                                    Delete Project
                                </button>
                            </div>
                        </div>
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
                        <h3 class="text-xl leading-6 font-semibold text-gray-900 dark:text-white mb-4">
                            {{ isEditingTask ? 'Edit Task' : 'New Task' }}
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label for="task-title"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Title
                                </label>
                                <input id="task-title" v-model="newTask.title" type="text"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200"
                                    placeholder="Enter task title" />
                            </div>
                            <div>
                                <label for="task-description"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea id="task-description" v-model="newTask.description" rows="3"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200"
                                    placeholder="Enter task description"></textarea>
                            </div>
                            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                                <div>
                                    <label for="task-status"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Status
                                    </label>
                                    <select id="task-status" v-model="newTask.status_id"
                                        class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200">
                                        <option v-for="status in project.statuses" :key="status.id" :value="status.id"
                                            class="bg-white dark:bg-gray-800">
                                            {{ status.name }}</option>
                                    </select>
                                </div>

                                <!-- Replace the priority dropdown in your task form with this -->
                                <div>
                                    <label for="task-priority"
                                        class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                        Priority
                                    </label>
                                    <div class="relative">
                                        <select id="task-priority" v-model="newTask.priority_id"
                                            class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200 appearance-none">
                                            <option value="1">Urgent</option>
                                            <option value="2">High</option>
                                            <option value="3">Medium</option>
                                            <option value="4">Low</option>
                                            <option value="5">No Priority</option>
                                        </select>
                                        <div
                                            class="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                            <svg class="w-5 h-5 text-gray-400" xmlns="http://www.w3.org/2000/svg"
                                                viewBox="0 0 20 20" fill="currentColor">
                                                <path fill-rule="evenodd"
                                                    d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z"
                                                    clip-rule="evenodd" />
                                            </svg>
                                        </div>
                                        
                                    </div>
                                </div>

                            </div>

                            <div>
                                <!-- Team members loading state -->
                                <div v-if="teamMembersLoading" class="flex items-center mb-2">
                                    <div class="animate-spin rounded-full h-4 w-4 border-t-2 border-primary-500 mr-2">
                                    </div>
                                    <span class="text-sm text-gray-500 dark:text-gray-400">Loading team
                                        members...</span>
                                </div>

                                <!-- Team member selection section -->
                                <div v-else>
                                    <!-- User Search component -->
                                    <UserSearch :users="project.team_members || []" v-model="newTask.assignee_id"
                                        id="task-assignee" label="Assignee" />

                                    <!-- Refresh team members button -->
                                    <div class="mt-2 text-right">
                                        <button @click="refreshTeamMembers" type="button"
                                            class="inline-flex items-center text-xs text-primary-600 dark:text-primary-400 hover:text-primary-700 dark:hover:text-primary-300">
                                            <svg class="w-3 h-3 mr-1" xmlns="http://www.w3.org/2000/svg" fill="none"
                                                viewBox="0 0 24 24" stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
                                            </svg>
                                            Refresh
                                        </button>
                                    </div>
                                </div>
                            </div>

                            <div>
                                <label for="task-due-date"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Due Date
                                </label>
                                <input id="task-due-date" v-model="newTask.due_date" type="date"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200" />
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3">
                        <button type="button"
                            class="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            @click="showTaskModal = false" :disabled="isCreating">
                            Cancel
                        </button>
                        <button type="button"
                            class="px-4 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm font-medium flex items-center"
                            :disabled="isCreating || !newTask.title" @click="saveTask">
                            <svg v-if="isCreating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4">
                                </circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            {{ isCreating ? (isEditingTask ? 'Updating...' : 'Creating...') : (isEditingTask ? 'Update Task' :
                            'Create Task') }}
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
                                <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg"
                                    fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                        d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                                </svg>
                            </div>
                            <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                                <h3 class="text-xl leading-6 font-semibold text-gray-900 dark:text-white">
                                    {{ getDeleteModalTitle() }}
                                </h3>
                                <div class="mt-3">
                                    <p class="text-base text-gray-500 dark:text-gray-400">
                                        {{ getDeleteModalMessage() }}
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
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4">
                                </circle>
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


        <!-- Edit Project Modal -->
        <div v-if="showEditProjectModal" class="fixed inset-0 z-50 overflow-y-auto">
            <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
                <div class="fixed inset-0 transition-opacity" aria-hidden="true">
                    <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
                </div>

                <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

                <div
                    class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-xl text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
                    <div class="bg-white dark:bg-gray-800 px-6 pt-6 pb-4">
                        <h3 class="text-xl leading-6 font-semibold text-gray-900 dark:text-white mb-4">
                            Edit Project
                        </h3>
                        <div class="space-y-4">
                            <div>
                                <label for="edit-project-name"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Project Name
                                </label>
                                <input id="edit-project-name" v-model="editedProject.name" type="text" required
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200"
                                    placeholder="Enter project name" />
                            </div>

                            <div>
                                <label for="edit-project-description"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Description
                                </label>
                                <textarea id="edit-project-description" v-model="editedProject.description" rows="3"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200"
                                    placeholder="Enter project description"></textarea>
                            </div>

                            <div>
                                <label for="edit-project-status"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Status
                                </label>
                                <select id="edit-project-status" v-model="editedProject.status" required
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200">
                                    <option value="active" class="bg-white dark:bg-gray-800">Active</option>
                                    <option value="completed" class="bg-white dark:bg-gray-800">Completed</option>
                                    <option value="archived" class="bg-white dark:bg-gray-800">Archived</option>
                                </select>
                            </div>

                            <div>
                                <label for="edit-project-duedate"
                                    class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Due Date
                                </label>
                                <input id="edit-project-duedate" v-model="editedProject.due_date" type="date"
                                    class="w-full px-4 py-3 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200" />
                            </div>

                            <div>
                                <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
                                    Project Color
                                </label>
                                <div class="flex items-center gap-3">
                                    <input v-model="editedProject.color" type="color"
                                        class="h-10 w-16 rounded-md border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 cursor-pointer" />
                                    <span class="text-sm text-gray-700 dark:text-gray-300">
                                        {{ editedProject.color }}
                                    </span>
                                </div>
                            </div>
                        </div>
                    </div>
                    <div class="bg-gray-50 dark:bg-gray-700 px-6 py-4 flex justify-end space-x-3">
                        <button type="button"
                            class="px-4 py-2.5 rounded-lg border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
                            @click="showEditProjectModal = false" :disabled="isUpdating">
                            Cancel
                        </button>
                        <button type="button"
                            class="px-4 py-2.5 rounded-lg bg-primary-600 text-white hover:bg-primary-700 dark:bg-primary-700 dark:hover:bg-primary-800 transition-colors duration-200 shadow-sm font-medium flex items-center"
                            :disabled="isUpdating || !editedProject.name" @click="updateProjectInfo">
                            <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4">
                                </circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                            {{ isUpdating ? 'Updating...' : 'Update Project' }}
                        </button>
                    </div>
                </div>
            </div>
        </div>

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch, onBeforeUnmount } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { projectsAPI, tasksAPI, teamsAPI } from '~/services/api';
import type { Project } from '~/types/project';
import type { Task } from '~/types/task';
import UserSearch from '~/components/UserSearch.vue';
import { useProjects } from '~/composables/useProjects';
import draggable from 'vuedraggable';
import { defineAsyncComponent } from 'vue';


definePageMeta({
    layout: 'dashboard',
});

// Route and router
const route = useRoute();
const router = useRouter();
const projectId = computed(() => parseInt(route.params.id as string));

// State
const loading = ref(true);
const error = ref('');
const project = ref<Project>({} as Project);
const tasks = ref<Task[]>([]);
const activeTab = ref('tasks');
const taskViewMode = ref('list'); // 'board' or 'list'
const tasksSearchQuery = ref('');
const tasksStatusFilter = ref('');
const tasksPriorityFilter = ref('');
const actionsMenuRef = ref(null);
const showActionsMenu = ref(false);
const showTaskModal = ref(false);
const showNewTaskModal = ref(false);
const showEditProjectModal = ref(false);
const showDeleteModal = ref(false);
const showAddStatusModal = ref(false);
const showAddTeamMemberModal = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const isEditingTask = ref(false);
const currentTaskId = ref<number | null>(null);
const deleteMode = ref<'project' | 'task' | 'status'>('task');
const itemToDelete = ref<any>(null);

const teamMembersLoading = ref(false);

const statuses = ref([]);

const showEditModal = ref(false);



// Client-only import for VueDraggable
const Draggable = defineAsyncComponent(() => {
    if (process.client) {
        return import('vuedraggable').then(module => module.default);
    }
    return Promise.resolve({ render: () => null });
});

// Get the project methods but avoid the destructuring to prevent SSR issues
const projectsComposable = useProjects();

// New state for status management
const showEditStatusModal = ref(false);
const isEditingStatus = ref(false);
const statusesLoading = ref(false);
const statusesError = ref('');
const isStatusUpdating = ref(false);
const currentStatusId = ref(null);
const newStatus = ref({
    name: '',
    color: '#3B82F6'
});

// Computed for ordered statuses
const orderedStatuses = computed({
    get: () => {
        return [...(project.value.statuses || [])].sort((a, b) => a.order_position - b.order_position);
    },
    set: (value) => {
        project.value.statuses = value;
    }
});

// Tabs
const tabs = [
    { id: 'tasks', name: 'Tasks' },
    { id: 'timeline', name: 'Timeline' },
    { id: 'team', name: 'Team' },
    { id: 'files', name: 'Files' },
    { id: 'settings', name: 'Settings' },
];

// New task form
const newTask = ref({
    title: '',
    description: '',
    status_id: 0,
    priority_id: 3,
    assignee_id: '',
    due_date: ''
});

// Edited project data
const editedProject = ref({
    name: '',
    description: '',
    color: '#4A90E2',
    status: 'active',
    due_date: ''
});

// Mock project stats
const projectStats = ref({
    totalTasks: 0,
    completedTasks: 0,
    inProgressTasks: 0,
    teamMembers: 0
});

const priorityIdToString = {
    1: 'urgent',
    2: 'high',
    3: 'medium',
    4: 'low',
    5: 'no priority'
};

// Mock project files
const projectFiles = ref([
    {
        id: 1,
        name: 'Project Requirements.docx',
        size: 245000,
        type: 'document',
        uploaded_at: '2023-08-15T10:30:00',
        uploaded_by: 'John Doe'
    },
    {
        id: 2,
        name: 'Budget Estimation.xlsx',
        size: 350000,
        type: 'spreadsheet',
        uploaded_at: '2023-08-10T15:45:00',
        uploaded_by: 'Jane Smith'
    },
    {
        id: 3,
        name: 'Design Mockups.pdf',
        size: 2500000,
        type: 'pdf',
        uploaded_at: '2023-08-05T09:15:00',
        uploaded_by: 'Mike Johnson'
    },
    {
        id: 4,
        name: 'Logo Final.png',
        size: 550000,
        type: 'image',
        uploaded_at: '2023-07-28T14:20:00',
        uploaded_by: 'Sarah Williams'
    }
]);

// Computed values
const filteredTasks = computed(() => {
    let filtered = [...tasks.value];

    console.log('Filtered tasks 999:', filtered.length);

    // Filter by search query
    if (tasksSearchQuery.value) {
        const query = tasksSearchQuery.value.toLowerCase();
        filtered = filtered.filter(task =>
            task.title.toLowerCase().includes(query) ||
            (task.description && task.description.toLowerCase().includes(query))
        );
    }

    // Filter by status
    if (tasksStatusFilter.value) {
        filtered = filtered.filter(task => task.status_id === parseInt(tasksStatusFilter.value));
    }

    // Filter by priority
    if (tasksPriorityFilter.value) {
        filtered = filtered.filter(task => task.priority === tasksPriorityFilter.value);
    }

    return filtered;
});

const filteredTasksMessage = computed(() => {
    if (tasks.value.length === 0) {
        return "You haven't created any tasks for this project yet. Create your first task to get started.";
    }

    return "No tasks match your current filters. Try adjusting your search criteria.";
});

const completedStatusId = computed(() => {
    const completedStatus = project.value.statuses?.find(status =>
        status.name.toLowerCase() === 'completed' || status.name.toLowerCase() === 'done');
    return completedStatus?.id || 0;
});

// Fetch project and related data
const fetchProject = async () => {
    try {
        if (!process.client) return;

        loading.value = true;
        error.value = '';

        // Fetch project details using projectsAPI
        const response = await projectsAPI.getById(projectId.value).catch(() => {
            // Mock data for development
            // return {
            //     data: {
            //         data: getMockProject(projectId.value)
            //     }
            // };
        });

        project.value = response.data.data;

        // Initialize edited project data
        editedProject.value = {
            name: project.value.name,
            description: project.value.description || '',
            color: project.value.color,
            status: project.value.status,
            due_date: project.value.due_date || ''
        };

        // Set default status for new tasks
        if (project.value.statuses && project.value.statuses.length > 0) {
            newTask.value.status_id = project.value.statuses[0].id;
        }

        // เพิ่มบรรทัดนี้เพื่อดึงข้อมูลสมาชิกในทีมหลังจากดึงข้อมูลโปรเจค
        await fetchTeamMembers();

        // Fetch tasks
        fetchTasks();

        // Calculate project stats
        updateProjectStats();
    } catch (err) {
        console.error('Failed to fetch project:', err);
        error.value = 'Failed to load project. Please try again.';
    } finally {
        loading.value = false;
    }
};

// Fetch tasks
const fetchTasks = async () => {
    console.log('Fetching tasks for project:', projectId.value);
    try {
        if (!process.client) return;

        // Fetch tasks using tasksAPI
        const response = await tasksAPI.getByProject(projectId.value).catch(() => {

        });


        tasks.value = response.data.data;
        console.log('Tasks response xx:', tasks.value);

        updateProjectStats();
    } catch (err) {
        console.error('Failed to fetch tasks:', err);
        tasks.value = [];
    }
};

// Update project stats
const updateProjectStats = () => {
    const completedTasks = tasks.value.filter(task => task.status_id === completedStatusId.value).length;
    const totalTasks = tasks.value.length;
    const inProgressTasks = totalTasks - completedTasks;
    const teamMembers = project.value.team_members?.length || 0;

    projectStats.value = {
        totalTasks,
        completedTasks,
        inProgressTasks,
        teamMembers
    };
};

// Task actions
const toggleTaskStatus = (task: Task) => {
    const updatedTask = { ...task };
    updatedTask.status_id = updatedTask.status_id === completedStatusId.value
        ? project.value.statuses[0].id // Set to first status (usually "To Do" or similar)
        : completedStatusId.value;

    updateTask(updatedTask);
};

const editTask = (task: Task) => {
    isEditingTask.value = true;
    currentTaskId.value = task.id;
    newTask.value = {
        title: task.title,
        description: task.description || '',
        status_id: task.status_id,
        priority_id: task.priority?.id || 
                (typeof task.priority === 'number' ? task.priority : 
                 task.priority === 'high' ? 2 :
                 task.priority === 'medium' ? 3 :
                 task.priority === 'low' ? 4 : 5),
        assignee_id: task.assignee_id || '',
        due_date: task.due_date || ''
    };
    showTaskModal.value = true;  // Change this line to use .value
};

const saveTask = async () => {
    try {
        if (!process.client || !newTask.value.title) return;

        isCreating.value = true;

        // Create a payload with correct priority handling
        const taskPayload = {
            ...newTask.value,
            project_id: projectId.value,
            // Convert priority_id to a number if it's a string
            priority_id: newTask.value.priority_id ? parseInt(newTask.value.priority_id) : undefined
        };

        if (isEditingTask.value && currentTaskId.value) {
            // Update existing task
            await tasksAPI.update(currentTaskId.value, taskPayload).catch((error) => {
                console.error('Error updating task:', error);
                // You can add more error handling here if needed
            });
        } else {
            // Create new task
            await tasksAPI.create(taskPayload).catch((error) => {
                console.error('Error creating task:', error);
                // You can add more error handling here if needed
            });
        }
        // Reset form and close modal
        resetTaskForm();
        showTaskModal.value = false;
        fetchTasks();

        // Show success notification if available
        if (window.$toast && window.$toast.success) {
            window.$toast.success(isEditingTask.value ? 'Task updated successfully' : 'Task created successfully');
        }
        updateProjectStats();
    } catch (err) {
        console.error('Failed to save task:', err);
        
        // Show error notification if available
        if (window.$toast && window.$toast.error) {
            window.$toast.error('Failed to save task. Please try again.');
        }
    } finally {
        isCreating.value = false;
    }
};

// Helper function to get priority name from ID
const getPriorityNameById = (priorityId:any) => {
  switch (parseInt(priorityId)) {
    case 1: return 'Urgent';
    case 2: return 'High';
    case 3: return 'Medium';
    case 4: return 'Low';
    case 5: return 'No Priority';
    default: return 'No Priority';
  }
};


const resetTaskForm = () => {
    isEditingTask.value = false;
    currentTaskId.value = null;
    newTask.value = {
        title: '',
        description: '',
        status_id: project.value.statuses?.[0]?.id || 0,
        priority_id: 3,
        assignee_id: '',
        due_date: ''
    };
};

const confirmDeleteTask = (task: Task) => {
    deleteMode.value = 'task';
    itemToDelete.value = task;
    showDeleteModal.value = true;
};

const updateTask = async (task: Task) => {
    try {
        await tasksAPI.update(task.id, task).catch(() => {
            // Mock update for development
            const index = tasks.value.findIndex(t => t.id === task.id);
            if (index !== -1) {
                tasks.value[index] = task;
            }
        });

        // Update local state
        fetchTasks();
    } catch (err) {
        console.error('Failed to update task:', err);
    }
};

// Project actions
const updateProjectInfo = async () => {
    try {
        if (!process.client) return;

        isUpdating.value = true;

        // Update project using projectsAPI
        await projectsAPI.update(projectId.value, editedProject.value).catch(() => {
            // Mock update for development
            console.log('Mock update project:', editedProject.value);

            // Update in local state
            project.value = {
                ...project.value,
                ...editedProject.value
            };
        });

        // Close modal and refresh
        showEditProjectModal.value = false;
        fetchProject();
    } catch (err) {
        console.error('Failed to update project:', err);
    } finally {
        isUpdating.value = false;
    }
};

const confirmDeleteProject = () => {
    deleteMode.value = 'project';
    showDeleteModal.value = true;
};

const exportProject = () => {
    showActionsMenu.value = false;
    console.log('Export project');
    // Implementation would generate and download a file
};

const duplicateProject = () => {
    showActionsMenu.value = false;
    console.log('Duplicate project');
    // Implementation would create a copy of the project
};

const archiveProject = async () => {
    try {
        showActionsMenu.value = false;
        isUpdating.value = true;

        const updatedProject = {
            ...editedProject.value,
            status: 'archived'
        };

        await projectsAPI.update(projectId.value, updatedProject).catch(() => {
            // Mock update for development
            project.value.status = 'archived';
        });

        fetchProject();
    } catch (err) {
        console.error('Failed to archive project:', err);
    } finally {
        isUpdating.value = false;
    }
};

const restoreProject = async () => {
    try {
        showActionsMenu.value = false;
        isUpdating.value = true;

        const updatedProject = {
            ...editedProject.value,
            status: 'active'
        };

        await projectsAPI.update(projectId.value, updatedProject).catch(() => {
            // Mock update for development
            project.value.status = 'active';
        });

        fetchProject();
    } catch (err) {
        console.error('Failed to restore project:', err);
    } finally {
        isUpdating.value = false;
    }
};


// Delete confirmation
const getDeleteModalTitle = () => {
    switch (deleteMode.value) {
        case 'project':
            return 'Delete Project';
        case 'task':
            return 'Delete Task';
        case 'status':
            return 'Delete Status';
        default:
            return 'Delete';
    }
};

const getDeleteModalMessage = () => {
    switch (deleteMode.value) {
        case 'project':
            return `Are you sure you want to delete the project "${project.value.name}"? All associated data will be permanently removed. This action cannot be undone.`;
        case 'task':
            return `Are you sure you want to delete the task "${itemToDelete.value?.title}"? This action cannot be undone.`;
        case 'status':
            return `Are you sure you want to delete the status "${itemToDelete.value?.name}"? Tasks with this status will be moved to the default status. This action cannot be undone.`;
        default:
            return 'Are you sure you want to delete this item? This action cannot be undone.';
    }
};

const confirmDelete = async () => {
    try {
        if (!process.client) return;

        isDeleting.value = true;

        switch (deleteMode.value) {
            case 'project':
                await projectsAPI.delete(projectId.value).catch(() => {
                    console.log('Mock delete project:', projectId.value);
                });
                // Redirect to projects list
                router.push('/projects');
                break;

            case 'task':
                if (itemToDelete.value) {
                    await tasksAPI.delete(itemToDelete.value.id).catch(() => {
                        console.log('Mock delete task:', itemToDelete.value);
                        // Remove from local state
                        tasks.value = tasks.value.filter(t => t.id !== itemToDelete.value.id);
                    });
                    // Close modal and refresh
                    showDeleteModal.value = false;
                    fetchTasks();
                }
                break;

            case 'status':
                if (itemToDelete.value) {
                    try {
                        console.log('Deleting status:', itemToDelete.value);

                        // Use the deleteProjectStatus function
                        const result = await projectsComposable.deleteProjectStatus(projectId.value, itemToDelete.value.id);

                        if (result.success) {
                            console.log('Status deleted successfully');

                            // Update local state by removing the deleted status
                            if (project.value.statuses) {
                                project.value.statuses = project.value.statuses.filter(
                                    s => s.id !== itemToDelete.value.id
                                );
                            }

                            // Refresh project data to ensure UI is updated
                            await fetchProject();
                        } else {
                            console.error('Failed to delete status:', result.error);
                        }
                    } catch (statusError) {
                        console.error('Error in status deletion:', statusError);
                    } finally {
                        // Close modal regardless of success or failure
                        showDeleteModal.value = false;
                    }
                }
                break;
        }
    } catch (err) {
        console.error('Failed to delete:', err);
    } finally {
        isDeleting.value = false;
    }
};

// Helper functions
const getTasksByStatus = (statusId: number) => {
    return filteredTasks.value.filter(task => task.status_id === statusId);
};


const isOverdue = (dateString: string) => {
    if (!dateString) return false;

    const dueDate = new Date(dateString);
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Set to beginning of day
    return dueDate < today;
};

// Format date helper
const formatDate = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

const formatDateShort = (dateString: string) => {
    if (!dateString) return '';
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric' }).format(date);
};

const formatDateFromNow = (dateString: string) => {
    if (!dateString) return '';

    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 0) {
        return 'Today';
    } else if (diffDays === 1) {
        return 'Yesterday';
    } else if (diffDays < 7) {
        return `${diffDays} days ago`;
    } else if (diffDays < 30) {
        const diffWeeks = Math.floor(diffDays / 7);
        return `${diffWeeks} ${diffWeeks === 1 ? 'week' : 'weeks'} ago`;
    } else {
        return formatDate(dateString);
    }
};

const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';

    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));

    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
};

// Get initials from name
const getInitials = (name: string): string => {
    if (!name) return '';

    return name
        .split(' ')
        .map(part => part.charAt(0))
        .join('')
        .toUpperCase()
        .substring(0, 2);
};

// Capitalize first letter
const capitalize = (str: any): string => {
    // First check if str exists and is a string
    if (!str || typeof str !== 'string') return '';

    return str.charAt(0).toUpperCase() + str.slice(1);
};

// Outside click detection for dropdown menus
const closeActionsMenu = (event: MouseEvent) => {
    if (actionsMenuRef.value && !actionsMenuRef.value.contains(event.target)) {
        showActionsMenu.value = false;
    }
};


const fetchTeamMembers = async () => {
    try {
        if (!process.client || !project.value?.team_id) return;

        const teamId = project.value.team_id;
        teamMembersLoading.value = true;
        console.log('Fetching team members for team ID:', teamId);

        // ใช้ API client ของคุณในการดึงข้อมูลสมาชิกในทีม
        const response = await teamsAPI.getMembers(teamId)
            // const response = await fetch(`/api/api/teams/${teamId}/members`)
            .catch(() => {
                // ข้อมูลตัวอย่างสำหรับการพัฒนา - ลบออกในการใช้งานจริง
                console.log('Using mock team members data');
                // return {
                //   ok: true,
                //   json: async () => ({
                //     data: getMockTeamMembers(teamId)
                //   })
                // };
            });

        console.log('Team members response:', response.data);


        //const data = await response.json();

        // ถ้า API ของคุณส่งคืนข้อมูลในโครงสร้างเฉพาะ ให้ปรับบรรทัดนี้
        const teamMembers = response.data.data || [];

        console.log('Team members xxx:', teamMembers);

        // อัปเดต project.team_members ด้วยข้อมูลที่ดึงมา
        if (teamMembers.length > 0) {
            project.value.team_members = teamMembers;

            // อัปเดตจำนวนสมาชิกในทีมในสถิติโปรเจค
            projectStats.value.teamMembers = teamMembers.length;
        }

        console.log('Team members loaded:', teamMembers.length);

    } catch (err) {
        console.error('Failed to fetch team members:', err);
    } finally {
        teamMembersLoading.value = false;
    }
};

// รีเฟรชข้อมูลสมาชิกในทีม
const refreshTeamMembers = async () => {
    teamMembersLoading.value = true;
    await fetchTeamMembers();
    teamMembersLoading.value = false;
};


// Lifecycle
onMounted(() => {
    if (process.client) {
        fetchProject();
        document.addEventListener('click', closeActionsMenu);
    }
});

onBeforeUnmount(() => {
    if (process.client) {
        document.removeEventListener('click', closeActionsMenu);
    }
});

// Watch for route changes
watch(() => route.params.id, (newId, oldId) => {
    if (newId !== oldId) {
        fetchProject();
    }
});

// Watch for modals
watch(showNewTaskModal, (newVal) => {
    if (newVal) {
        resetTaskForm();
        showTaskModal.value = true;
        showNewTaskModal.value = false;
    }
});



// Status management methods
const editStatus = (status) => {
    isEditingStatus.value = true;
    currentStatusId.value = status.id;
    newStatus.value = {
        name: status.name,
        color: status.color
    };
    showEditStatusModal.value = true;
};

const closeStatusModal = () => {
    showAddStatusModal.value = false;
    showEditStatusModal.value = false;
    isEditingStatus.value = false;
    currentStatusId.value = null;
    newStatus.value = {
        name: '',
        color: '#3B82F6'
    };
};

const saveStatus = async () => {
    try {
        if (!process.client || !newStatus.value.name || !newStatus.value.color) return;

        isStatusUpdating.value = true;

        if (isEditingStatus.value && currentStatusId.value) {
            // Update existing status
            const result = await projectsComposable.updateProjectStatus(
                projectId.value,
                currentStatusId.value,
                newStatus.value
            );

            if (result.success) {
                console.log('Status updated successfully:', result.status);
                // Update local state
                const index = project.value.statuses.findIndex(s => s.id === currentStatusId.value);
                if (index !== -1) {
                    project.value.statuses[index] = {
                        ...project.value.statuses[index],
                        ...newStatus.value
                    };
                }
            }
        } else {
            // Create new status
            const payload = {
                ...newStatus.value,
                project_id: projectId.value, // Explicitly include project_id
                order_position: project.value.statuses?.length || 0
            };

            const result = await projectsComposable.createProjectStatus(projectId.value, payload);

            if (result.success && result.status) {
                console.log('Status created successfully:', result.status);
                // Add to local state
                if (!project.value.statuses) {
                    project.value.statuses = [];
                }
                project.value.statuses.push(result.status);

                // Sort statuses by order_position to ensure correct display order
                project.value.statuses.sort((a, b) => a.order_position - b.order_position);
            }
        }

        // Close modal
        closeStatusModal();

        // Refresh project data from server to ensure UI has the latest data
        await fetchProject();

        // If you have a dedicated function to fetch just the statuses, you could use that instead
        // for better performance:
        // const statuses = await fetchProjectStatuses(projectId.value);
        // if (statuses && statuses.length) {
        //   project.value.statuses = statuses;
        // }

    } catch (err) {
        console.error('Failed to save status:', err);
        statusesError.value = 'Failed to save status. Please try again.';
    } finally {
        isStatusUpdating.value = false;
    }
};

const onStatusReorder = async () => {
    try {
        // Get the reordered IDs
        const statusOrder = orderedStatuses.value.map(status => status.id);

        // Update order_position locally
        orderedStatuses.value.forEach((status, index) => {
            status.order_position = index;
        });

        // Call API to update in backend
        await projectsComposable.reorderProjectStatuses(projectId.value, statusOrder);
    } catch (err) {
        console.error('Failed to reorder statuses:', err);
        statusesError.value = 'Failed to update status order. Please try again.';

        // Refresh statuses from server to reset the order
        await projectsComposable.fetchProjectStatuses(projectId.value);
    }
};

const confirmDeleteStatus = (status) => {
    deleteMode.value = 'status';
    itemToDelete.value = status;
    showDeleteModal.value = true;
};

const getStatusColor = (statusId, opacity = '1') => {
    // Find status in statuses array
    const status = statuses.value.find(s => s.id === statusId);

    if (status && status.color) {
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

/**
 * Gets the name of a status based on its ID
 * @param {number} statusId - The status ID
 * @returns {string} - The status name
 */
const getStatusName = (statusId) => {
    const status = statuses.value.find(s => s.id === statusId);
    if (status) return status.name;

    // Default names based on common status IDs
    switch (statusId) {
        case 1: return 'To Do';
        case 2: return 'In Progress';
        case 3: return 'Review';
        case 4: return 'Done';
        default: return 'Unknown';
    }
};

</script>