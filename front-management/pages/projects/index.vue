<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Projects</h1>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Manage and organize your team projects</p>
      </div>
      <button @click="showCreateProjectModal = true" class="btn btn-primary flex items-center">
        <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Project
      </button>
    </div>

    <!-- Filter and Search Section -->
    <div class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-4 mb-6">
      <div class="flex flex-col md:flex-row gap-4">
        <div class="flex-1">
          <label for="search" class="sr-only">Search</label>
          <div class="relative">
            <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input id="search" v-model="searchQuery" type="text" placeholder="Search projects..." class="input pl-10"
              @input="handleSearch" />
          </div>
        </div>
        <div class="flex space-x-4">
          <div>
            <label for="status-filter" class="sr-only">Status</label>
            <select id="status-filter" v-model="filters.status" class="input" @change="applyFilters">
              <option value="">All Statuses</option>
              <option value="active">Active</option>
              <option value="completed">Completed</option>
              <option value="archived">Archived</option>
            </select>
          </div>
          <div>
            <label for="sort-by" class="sr-only">Sort by</label>
            <select id="sort-by" v-model="sorting.field" class="input" @change="applyFilters">
              <option value="updated_at">Last Updated</option>
              <option value="created_at">Created Date</option>
              <option value="name">Name</option>
            </select>
          </div>
          <button @click="toggleSortDirection" class="btn btn-outline flex items-center"
            :title="sorting.direction === 'desc' ? 'Sort Ascending' : 'Sort Descending'">
            <svg v-if="sorting.direction === 'desc'" class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none"
              viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 4h13M3 8h9m-9 4h6m4 0l4-4m0 0l4 4m-4-4v12" />
            </svg>
            <svg v-else class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 4h13M3 8h9m-9 4h9m5-4v12m0 0l-4-4m4 4l4-4" />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4 text-red-700 dark:text-red-400">
      <p>{{ error }}</p>
      <button @click="fetchProjects" class="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500">
        Try again
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="filteredProjects.length === 0"
      class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No projects found</h3>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        <!-- {{ hasFilters ? "Try adjusting your filters or create a new project." : "Get started by creating your first
        project." }} -->
      </p>
      <div class="mt-6">
        <button @click="showCreateProjectModal = true" class="btn btn-primary inline-flex items-center">
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Project
        </button>
      </div>
    </div>

    <!-- Project Grid -->
    <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="project in filteredProjects" :key="project.id"
        class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
        <!-- Color bar -->
        <div class="h-2" :style="{ backgroundColor: project.color }"></div>

        <div class="p-5">
          <div class="flex justify-between items-start">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
              {{ project.name }}
            </h3>
            <div class="relative">
              <button @click.stop="toggleProjectMenu(project.id)"
                class="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              <!-- Project menu -->
              <div v-show="activeProjectMenu === project.id"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu">
                <div class="py-1" role="none">
                  <NuxtLink :to="`/projects/${project.id}`"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem" @click.stop>
                    View Details
                  </NuxtLink>
                  <button @click.stop="editProject(project)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem">
                    Edit Project
                  </button>
                  <button @click.stop="confirmDeleteProject(project)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    role="menuitem">
                    Delete Project
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Project description -->
          <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {{ project.description || 'No description' }}
          </p>

          <!-- Project stats -->
          <div class="mt-4 flex justify-between items-center">
            <span class="px-2.5 py-0.5 text-xs font-medium rounded-full" :class="{
              'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400': project.status === 'active',
              'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400': project.status === 'completed',
              'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300': project.status === 'archived',
            }">
              {{ capitalize(project.status) }}
            </span>

            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ project.taskCount || 0 }} {{ project.taskCount === 1 ? 'task' : 'tasks' }}
            </div>
          </div>

          <!-- Project team -->
          <div class="mt-4 flex justify-between items-center">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ formatDate(project.updated_at) }}
            </div>

            <NuxtLink :to="`/projects/${project.id}`"
              class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
              View Project
            </NuxtLink>
          </div>
        </div>
      </div>
    </div>

    <!-- Pagination -->
    <div v-if="totalPages > 1" class="mt-6 flex justify-center">
      <nav class="flex space-x-2">
        <button @click="changePage(currentPage - 1)" :disabled="currentPage === 1"
          class="px-3 py-1 rounded-md text-sm font-medium"
          :class="currentPage === 1 ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'">
          Previous
        </button>

        <template v-for="page in paginationRange" :key="page">
          <button v-if="page !== '...'" @click="changePage(page)" class="px-3 py-1 rounded-md text-sm font-medium"
            :class="currentPage === page ? 'bg-primary-100 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'">
            {{ page }}
          </button>
          <span v-else class="px-3 py-1 text-gray-500 dark:text-gray-400 text-sm">
            {{ page }}
          </span>
        </template>

        <button @click="changePage(currentPage + 1)" :disabled="currentPage === totalPages"
          class="px-3 py-1 rounded-md text-sm font-medium"
          :class="currentPage === totalPages ? 'text-gray-400 dark:text-gray-600 cursor-not-allowed' : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700'">
          Next
        </button>
      </nav>
    </div>

    <!-- Create Project Modal -->
    <!-- This would be a component in a real app -->
    <div v-if="showCreateProjectModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div>
              <div class="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Create New Project
                </h3>
                <div class="mt-2">
                  <form @submit.prevent="createProject">
                    <div class="space-y-4">
                      <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Project Name
                        </label>
                        <input id="name" v-model="newProject.name" type="text" required class="mt-1 input"
                          placeholder="Enter project name" />
                      </div>

                      <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea id="description" v-model="newProject.description" rows="3" class="mt-1 input"
                          placeholder="Enter project description"></textarea>
                      </div>

                      <div>
                        <label for="team" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Team
                        </label>
                        <select id="team" v-model="newProject.team_id" required class="mt-1 input">
                          <option value="" disabled>Select a team</option>
                          <option v-for="team in teams" :key="team.id" :value="team.id">
                            {{ team.name }}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Color
                        </label>
                        <div class="mt-2 flex flex-wrap gap-2">
                          <button v-for="color in colorOptions" :key="color" type="button"
                            class="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            :class="{ 'ring-2 ring-offset-2 ring-primary-500': newProject.color === color }"
                            :style="{ backgroundColor: color }" @click="newProject.color = color"></button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="btn btn-primary w-full sm:w-auto" :disabled="isCreating"
              @click="createProject">
              <svg v-if="isCreating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isCreating ? 'Creating...' : 'Create Project' }}
            </button>
            <button type="button" class="btn btn-secondary mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto"
              @click="showCreateProjectModal = false" :disabled="isCreating">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Delete Project
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete the project "{{ projectToDelete?.name }}"? All data including tasks
                    and
                    comments will be permanently removed. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="btn btn-danger w-full sm:w-auto" :disabled="isDeleting" @click="deleteProject">
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isDeleting ? 'Deleting...' : 'Delete' }}
            </button>
            <button type="button" class="btn btn-secondary mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto"
              @click="showDeleteModal = false" :disabled="isDeleting">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- Edit Project Modal -->
    <div v-if="showEditModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div>
              <div class="mt-3 sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  Edit Project
                </h3>
                <div class="mt-2">
                  <form @submit.prevent="updateProject">
                    <div class="space-y-4">
                      <div>
                        <label for="edit-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Project Name
                        </label>
                        <input id="edit-name" v-model="editingProject.name" type="text" required class="mt-1 input"
                          placeholder="Enter project name" />
                      </div>

                      <div>
                        <label for="edit-description"
                          class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea id="edit-description" v-model="editingProject.description" rows="3" class="mt-1 input"
                          placeholder="Enter project description"></textarea>
                      </div>

                      <div>
                        <label for="edit-team" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Team
                        </label>
                        <select id="edit-team" v-model="editingProject.team_id" required class="mt-1 input">
                          <option value="" disabled>Select a team</option>
                          <option v-for="team in teams" :key="team.id" :value="team.id">
                            {{ team.name }}
                          </option>
                        </select>
                      </div>

                      <div>
                        <label for="edit-status" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Status
                        </label>
                        <select id="edit-status" v-model="editingProject.status" required class="mt-1 input">
                          <option value="active">Active</option>
                          <option value="completed">Completed</option>
                          <option value="archived">Archived</option>
                        </select>
                      </div>

                      <div>
                        <label class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Color
                        </label>
                        <div class="mt-2 flex flex-wrap gap-2">
                          <button v-for="color in colorOptions" :key="color" type="button"
                            class="w-8 h-8 rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500"
                            :class="{ 'ring-2 ring-offset-2 ring-primary-500': editingProject.color === color }"
                            :style="{ backgroundColor: color }" @click="editingProject.color = color"></button>
                        </div>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="btn btn-primary w-full sm:w-auto" :disabled="isUpdating"
              @click="updateProject">
              <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isUpdating ? 'Updating...' : 'Update Project' }}
            </button>
            <button type="button" class="btn btn-secondary mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto"
              @click="showEditModal = false" :disabled="isUpdating">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { projectsAPI, teamsAPI } from '~/services/api';
import type { Project } from '~/types/project';
import type { Team } from '~/types/team';

definePageMeta({
  layout: 'dashboard',
});

// State
const projects = ref<Project[]>([]);
const teams = ref<Team[]>([]);
const loading = ref(true);
const error = ref('');
const activeProjectMenu = ref<number | null>(null);
const searchQuery = ref('');
const showCreateProjectModal = ref(false);
const showDeleteModal = ref(false);
const showEditModal = ref(false);
const isUpdating = ref(false);
const isCreating = ref(false);
const isDeleting = ref(false);
const projectToDelete = ref<Project | null>(null);

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(9);
const totalItems = ref(0);

// Filtering and sorting
const filters = ref({
  status: '',
});

const sorting = ref({
  field: 'updated_at',
  direction: 'desc' as 'asc' | 'desc',
});

// New project form
const newProject = ref({
  name: '',
  description: '',
  team_id: '',
  color: '#3b82f6', // Default color (blue)
});

// Edit project form
const editingProject = ref<{
  id: number;
  name: string;
  description: string;
  team_id: string | number;
  color: string;
  status: string;
}>({
  id: 0,
  name: '',
  description: '',
  team_id: '',
  color: '#3b82f6',
  status: 'active'
});

// Color options
const colorOptions = [
  '#3b82f6', // blue
  '#10b981', // green
  '#ef4444', // red
  '#f59e0b', // amber
  '#8b5cf6', // purple
  '#ec4899', // pink
  '#6366f1', // indigo
  '#14b8a6', // teal
  '#f97316', // orange
  '#6b7280', // gray
];

// Computed
const filteredProjects = computed(() => {
  if (!projects.value) return [];

  return projects.value;
});

const totalPages = computed(() => {
  return Math.ceil(totalItems.value / itemsPerPage.value);
});

const paginationRange = computed(() => {
  const range: (number | string)[] = [];
  const maxButtonsToShow = 5;

  if (totalPages.value <= maxButtonsToShow) {
    // Show all page buttons
    for (let i = 1; i <= totalPages.value; i++) {
      range.push(i);
    }
  } else {
    // Complex logic for "..." pagination
    const leftSide = Math.floor(maxButtonsToShow / 2);
    const rightSide = maxButtonsToShow - leftSide - 1;

    if (currentPage.value <= leftSide + 1) {
      // Beginning pages
      for (let i = 1; i <= maxButtonsToShow - 1; i++) {
        range.push(i);
      }
      range.push('...');
      range.push(totalPages.value);
    } else if (currentPage.value >= totalPages.value - rightSide) {
      // End pages
      range.push(1);
      range.push('...');
      for (let i = totalPages.value - maxButtonsToShow + 2; i <= totalPages.value; i++) {
        range.push(i);
      }
    } else {
      // Middle pages
      range.push(1);
      range.push('...');
      for (let i = currentPage.value - 1; i <= currentPage.value + 1; i++) {
        range.push(i);
      }
      range.push('...');
      range.push(totalPages.value);
    }
  }

  return range;
});

const hasFilters = computed(() => {
  return searchQuery.value !== '' || filters.status !== '';
});

// Methods
const fetchProjects = async () => {
  try {
    loading.value = true;
    error.value = '';

    // Build query parameters
    const params = new URLSearchParams();
    params.append('page', currentPage.value.toString());
    params.append('limit', itemsPerPage.value.toString());
    params.append('sort_by', sorting.value.field);
    params.append('sort_direction', sorting.value.direction);

    if (searchQuery.value) {
      params.append('search', searchQuery.value);
    }

    if (filters.status) {
      params.append('status', filters.status);
    }

    // Create an object from the URLSearchParams for the API call
    const queryParams = Object.fromEntries(params.entries());

    // Fetch projects from API using projectsAPI service
    const response = await projectsAPI.getAll(queryParams).catch(() => {

    });

    projects.value = response.data.data;

    // Set pagination data if available
    if (response.data.meta) {
      totalItems.value = response.data.meta.total;
    } else {
      totalItems.value = projects.value.length;
    }
  } catch (err) {
    console.error('Failed to fetch projects:', err);
    error.value = 'Failed to load projects. Please try again.';

    // Fallback to mock data in case of error
    projects.value = null;
    totalItems.value = projects.value.length;
  } finally {
    loading.value = false;
  }
};

// Fetch teams for project creation
const fetchTeams = async () => {
  try {
    // Fetch teams using teamsAPI service
    const response = await teamsAPI.getAll().catch(() => {
      // For development/demo purposes, return mock data if API fails
      // return {
      //   data: {
      //     teams: [
      //       { id: 1, name: 'Engineering' },
      //       { id: 2, name: 'Marketing' },
      //       { id: 3, name: 'Design' },
      //       { id: 4, name: 'Product' }
      //     ]
      //   }
      // };
    });

    teams.value = response.data.data;

    // Set default team if available
    if (teams.value.length > 0 && !newProject.value.team_id) {
      newProject.value.team_id = teams.value[0].id.toString();
    }
  } catch (err) {
    console.error('Failed to fetch teams:', err);

    // Fallback data
    teams.value = [
      { id: 1, name: 'Engineering' },
      { id: 2, name: 'Marketing' },
      { id: 3, name: 'Design' },
      { id: 4, name: 'Product' }
    ];
  }
};

// Toggle project menu
const toggleProjectMenu = (projectId: number) => {
  // Stop event propagation to prevent immediate closing by document click handler
  event?.stopPropagation();

  if (activeProjectMenu.value === projectId) {
    activeProjectMenu.value = null;
  } else {
    activeProjectMenu.value = projectId;
  }
};

// Handle search
const handleSearch = () => {
  // Reset to first page when searching
  currentPage.value = 1;
  applyFilters();
};

// Apply filters
const applyFilters = () => {
  fetchProjects();
};

// Toggle sort direction
const toggleSortDirection = () => {
  sorting.value.direction = sorting.value.direction === 'asc' ? 'desc' : 'asc';
  applyFilters();
};

// Change page
const changePage = (page: number) => {
  if (page < 1 || page > totalPages.value) return;

  currentPage.value = page;
  fetchProjects();
};

// Create project
const createProject = async () => {
  try {
    if (!newProject.value.name || !newProject.value.team_id) {
      return; // Form validation (would be more robust in a real app)
    }

    isCreating.value = true;

    // Create project using projectsAPI service
    await projectsAPI.create({
      name: newProject.value.name,
      description: newProject.value.description,
      team_id: parseInt(newProject.value.team_id as string),
      color: newProject.value.color
    }).catch((err) => {
      console.log('Mock project creation:', newProject.value);
      // For demo purposes, just pretend it worked
    });

    // Reset form and close modal
    newProject.value = {
      name: '',
      description: '',
      team_id: teams.value.length > 0 ? teams.value[0].id.toString() : '',
      color: '#3b82f6'
    };

    showCreateProjectModal.value = false;

    // Refresh projects list
    fetchProjects();
  } catch (err) {
    console.error('Failed to create project:', err);
    // In a real app, show error message to user
  } finally {
    isCreating.value = false;
  }
};

// Edit project - Modified to open edit modal
const editProject = (project: Project) => {
  // Populate the editing project form with current project data
  editingProject.value = {
    id: project.id,
    name: project.name,
    description: project.description || '',
    team_id: project.team_id,
    color: project.color,
    status: project.status
  };

  // Close the project menu and open edit modal
  activeProjectMenu.value = null;
  showEditModal.value = true;
};

// Update project
const updateProject = async () => {
  try {
    if (!editingProject.value.name || !editingProject.value.team_id) {
      return; // Basic form validation
    }

    isUpdating.value = true;

    // Update project using projectsAPI service
    await projectsAPI.update(editingProject.value.id, {
      name: editingProject.value.name,
      description: editingProject.value.description,
      team_id: typeof editingProject.value.team_id === 'string'
        ? parseInt(editingProject.value.team_id)
        : editingProject.value.team_id,
      color: editingProject.value.color,
      status: editingProject.value.status
    }).catch((err) => {
      console.log('Mock project update:', editingProject.value);
      // For demo purposes, just pretend it worked
    });

    // Close modal
    showEditModal.value = false;

    // Update the project in the local array to avoid a full refetch
    const index = projects.value.findIndex(p => p.id === editingProject.value.id);
    if (index !== -1) {
      projects.value[index] = {
        ...projects.value[index],
        name: editingProject.value.name,
        description: editingProject.value.description,
        team_id: typeof editingProject.value.team_id === 'string'
          ? parseInt(editingProject.value.team_id)
          : editingProject.value.team_id,
        color: editingProject.value.color,
        status: editingProject.value.status,
        updated_at: new Date().toISOString()
      };
    }

    // Refresh projects list to get the latest data
    fetchProjects();
  } catch (err) {
    console.error('Failed to update project:', err);
    // In a real app, show error message to user
  } finally {
    isUpdating.value = false;
  }
};

// Confirm project deletion
const confirmDeleteProject = (project: Project) => {
  projectToDelete.value = project;
  showDeleteModal.value = true;
  activeProjectMenu.value = null;
};

// Delete project
const deleteProject = async () => {
  if (!projectToDelete.value) return;

  try {
    isDeleting.value = true;

    // Delete project using projectsAPI service
    await projectsAPI.delete(projectToDelete.value.id).catch((err) => {
      console.log('Mock project deletion:', projectToDelete.value);
      // For demo purposes, just pretend it worked
    });

    // Close modal and refresh projects
    showDeleteModal.value = false;
    projectToDelete.value = null;

    // Remove the project from the local list
    projects.value = projects.value.filter(p => p.id !== projectToDelete.value?.id);

    // Refresh the list if we potentially moved to a different page
    if (projects.value.length === 0 && currentPage.value > 1) {
      currentPage.value = currentPage.value - 1;
    }

    fetchProjects();
  } catch (err) {
    console.error('Failed to delete project:', err);
    // In a real app, show error message to user
  } finally {
    isDeleting.value = false;
  }
};



// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

// Capitalize first letter
const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

// Close project menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  if (activeProjectMenu.value !== null) {
    // Check if the click target is part of any project menu toggle button
    const isMenuButton = (event.target as Element).closest('[role="menu"]') ||
      (event.target as Element).closest('button[class*="rounded-full"]');

    if (!isMenuButton) {
      activeProjectMenu.value = null;
    }
  }
};

// Manual auth check
const checkAuth = () => {
  if (!process.client) return true;

  console.log("Checking auth in page component");
  const token = localStorage.getItem('token') || sessionStorage.getItem('token');
  console.log("Token exists:", !!token);

  if (!token) {
    console.log("No token found, navigating to login");
    router.push('/login');
    return false;
  }

  return true;
};

// Modified lifecycle hooks
onBeforeMount(() => {
  // Check auth before component mounts
  if (process.client) {
    const isAuthenticated = checkAuth();
    console.log("Authentication check result:", isAuthenticated);
  }
});

onMounted(() => {
  // Only proceed if authenticated
  if (process.client && checkAuth()) {
    document.addEventListener('click', handleClickOutside);

    console.log('Component mounted, fetching projects and teams data');
    fetchProjects().catch(err => {
      console.error('Error in initial projects fetch:', err);
    });

    fetchTeams().catch(err => {
      console.error('Error in initial teams fetch:', err);
    });
  }
});

// Clean up event listener
onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside);
});

// Watch for filter changes to reset pagination
watch([() => filters.status], () => {
  currentPage.value = 1;
  fetchProjects();
});
</script>

<style scoped>
/* Add any scoped styles here */
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>