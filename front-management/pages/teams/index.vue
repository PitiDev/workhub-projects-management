// pages/teams/index.vue
<template>
  <div>
    <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white">Teams</h1>
        <p class="mt-1 text-gray-500 dark:text-gray-400">Manage your organization teams</p>
      </div>
      <button @click="showCreateTeamModal = true" class="btn btn-primary flex items-center">
        <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
          stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
        </svg>
        New Team
      </button>
    </div>

    <!-- Debug panel -->
    <!-- <div class="mb-4 p-4 bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg">
      <p class="text-sm text-yellow-800 dark:text-yellow-300">Debug Status:</p>
      <p class="text-xs">Loading: {{ loading }}, Error: {{ !!error }}, Teams Count: {{ teams.length }}</p>
      <button @click="debugFetchTeams" class="mt-1 text-xs text-blue-600 dark:text-blue-400 underline">
        Manually Fetch Teams
      </button>
    </div> -->

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
            <input id="search" v-model="searchQuery" type="text" placeholder="Search teams..." class="input pl-10"
              @input="handleSearch" />
          </div>
        </div>
        <div class="flex space-x-4">
          <div>
            <label for="sort-by" class="sr-only">Sort by</label>
            <select id="sort-by" v-model="sorting.field" class="input" @change="applyFilters">
              <option value="name">Name</option>
              <option value="created_at">Created Date</option>
              <option value="memberCount">Members Count</option>
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
      <button @click="fetchTeams" class="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500">
        Try again
      </button>
    </div>

    <!-- Empty state -->
    <div v-else-if="teams.length === 0"
      class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 p-8 text-center">
      <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
        viewBox="0 0 24 24" stroke="currentColor">
        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
          d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
      </svg>
      <h3 class="mt-2 text-lg font-medium text-gray-900 dark:text-white">No teams found</h3>
      <p class="mt-1 text-gray-500 dark:text-gray-400">
        {{ hasFilters ? "Try adjusting your search or create a new team." : "Get started by creating your first team."
        }}
      </p>
      <div class="mt-6">
        <button @click="showCreateTeamModal = true" class="btn btn-primary inline-flex items-center">
          <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
          </svg>
          New Team
        </button>
      </div>
    </div>

    <!-- Raw data debug -->
    <div v-else-if="teams.length > 0 && showRawData" class="mb-6 p-4 bg-gray-50 rounded overflow-auto max-h-60">
      <h3 class="font-bold mb-2">Raw Teams Data:</h3>
      <pre class="text-xs">{{ JSON.stringify(teams, null, 2) }}</pre>
    </div>

    <!-- Teams Grid -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      <div v-for="team in teams" :key="team.id"
        class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
        <div class="p-5">
          <div class="flex justify-between items-start">
            <div class="flex items-center">
              <div
                class="h-10 w-10 rounded-full bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center text-lg font-semibold">
                {{ team.name.charAt(0) }}
              </div>
              <h3 class="ml-3 text-lg font-semibold text-gray-900 dark:text-white">
                {{ team.name }}
              </h3>
            </div>
            <div class="relative">
              <button @click.stop="toggleTeamMenu(team.id)" :data-team-id="team.id"
                class="p-1 rounded-full text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300 focus:outline-none focus:text-gray-600 dark:focus:text-gray-300">
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M5 12h.01M12 12h.01M19 12h.01M6 12a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0zm7 0a1 1 0 11-2 0 1 1 0 012 0z" />
                </svg>
              </button>
              <!-- Team menu -->
              <div v-if="activeTeamMenu === team.id"
                class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-10"
                role="menu">
                <div class="py-1" role="none">
                  <NuxtLink :to="`/teams/${team.id}`"
                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem">
                    View Details
                  </NuxtLink>
                  <button @click="editTeam(team)"
                    class="block w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    role="menuitem">
                    Edit Team
                  </button>
                  <button @click="confirmDeleteTeam(team)"
                    class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20"
                    role="menuitem">
                    Delete Team
                  </button>
                </div>
              </div>
            </div>
          </div>

          <!-- Team description -->
          <p class="mt-3 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
            {{ team.description || 'No description' }}
          </p>

          <!-- Team creator -->
          <div class="mt-4">
            <div class="text-sm text-gray-500 dark:text-gray-400">
              Created by: {{ team.creator ? `${team.creator.first_name} ${team.creator.last_name}` : 'Unknown' }}
            </div>
          </div>

          <!-- Team stats -->
          <div class="mt-4 flex justify-between items-center">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ team.memberCount || 0 }} {{ (team.memberCount || 0) === 1 ? 'member' : 'members' }}
            </div>
            <div class="text-xs text-gray-500 dark:text-gray-400">
              {{ team.projectCount || 0 }} {{ (team.projectCount || 0) === 1 ? 'project' : 'projects' }}
            </div>
          </div>

          <div class="mt-4 flex justify-between items-center">
            <div class="text-xs text-gray-500 dark:text-gray-400">
              Created {{ formatDate(team.created_at) }}
            </div>
            <NuxtLink :to="`/teams/${team.id}`"
              class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
              View Team
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

    <!-- Create Team Modal -->
    <div v-if="showCreateTeamModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div>
              <div class="mt-3 sm:mt-0 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {{ editingTeam ? 'Edit Team' : 'Create New Team' }}
                </h3>
                <div class="mt-2">
                  <form @submit.prevent="editingTeam ? updateTeam() : createTeam()">
                    <div class="space-y-4">
                      <div>
                        <label for="name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Team Name
                        </label>
                        <input id="name" v-model="newTeam.name" type="text" required class="mt-1 input"
                          placeholder="Enter team name" />
                      </div>

                      <div>
                        <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                          Description
                        </label>
                        <textarea id="description" v-model="newTeam.description" rows="3" class="mt-1 input"
                          placeholder="Enter team description"></textarea>
                      </div>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="btn btn-primary w-full sm:w-auto" :disabled="isCreating"
              @click="editingTeam ? updateTeam() : createTeam()">
              <svg v-if="isCreating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isCreating ? (editingTeam ? 'Updating...' : 'Creating...') : (editingTeam ? 'Update Team' : 'Create Team')}}
            </button>
            <button type="button" class="btn btn-secondary mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto"
              @click="cancelTeamModal" :disabled="isCreating">
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
                  Delete Team
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400">
                    Are you sure you want to delete the team "{{ teamToDelete?.name }}"? All associated data will be
                    permanently removed. This action cannot be undone.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="btn btn-danger w-full sm:w-auto" :disabled="isDeleting" @click="deleteTeam">
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
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRouter } from 'vue-router';
import { teamsAPI } from '~/services/api';

definePageMeta({
  layout: 'dashboard',
});

// Router
const router = useRouter();

// State
const teams = ref<any[]>([]);
const loading = ref(true);
const error = ref('');
const activeTeamMenu = ref<number | null>(null);
const searchQuery = ref('');
const showCreateTeamModal = ref(false);
const showDeleteModal = ref(false);
const isCreating = ref(false);
const isDeleting = ref(false);
const teamToDelete = ref<any | null>(null);
const editingTeam = ref<any | null>(null);
const showRawData = ref(false); // Debug option to show raw data

// Pagination
const currentPage = ref(1);
const itemsPerPage = ref(10); // Adjust based on your API's default limit
const totalItems = ref(0);

// Filtering and sorting
const sorting = ref({
  field: 'name',
  direction: 'asc' as 'asc' | 'desc',
});

// New team form
const newTeam = ref({
  name: '',
  description: '',
});

// Computed
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
  return searchQuery.value !== '';
});

// Debug function to manually fetch teams
const debugFetchTeams = async () => {
  console.log("Debug: Manually fetching teams");
  await fetchTeams();
  console.log("Debug: Teams fetched, teams.length =", teams.value.length);
};

// Methods
const fetchTeams = async () => {
  try {
    if (!process.client) return;

    loading.value = true;
    error.value = '';

    // Build query parameters
    const params = {
      page: currentPage.value,
      limit: itemsPerPage.value,
      sort_by: sorting.value.field,
      sort_direction: sorting.value.direction,
      search: searchQuery.value || undefined
    };

    console.log('Fetching teams with params:', params);

    // Fetch teams from API using teamsAPI service
    const response = await teamsAPI.getAll(params);

    console.log('API response:', response.data);

    // The API returns data in response.data
    teams.value = response.data.data;

    // Set pagination data from meta
    if (response.meta) {
      totalItems.value = response.meta.total;
    }
  } catch (err) {
    console.error('Failed to fetch teams:', err);
    error.value = 'Failed to load teams. Please try again.';

    // Reset teams on error
    teams.value = [];
    totalItems.value = 0;
  } finally {
    loading.value = false;
  }
};

// Toggle team menu
const toggleTeamMenu = (teamId: number) => {
  console.log('Toggle team menu clicked for team ID:', teamId);

  // If this menu is already active, close it
  if (activeTeamMenu.value === teamId) {
    activeTeamMenu.value = null;
    console.log('Menu closed');
  }
  // If a different menu is active, close that one and open this one
  else {
    activeTeamMenu.value = teamId;
    console.log('Menu opened for team ID:', teamId);
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
  fetchTeams();
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
  fetchTeams();
};

// Create team
const createTeam = async () => {
  try {
    if (!process.client) return;

    if (!newTeam.value.name) {
      return; // Form validation
    }

    isCreating.value = true;

    // Create team using teamsAPI service
    await teamsAPI.create({
      name: newTeam.value.name,
      description: newTeam.value.description
    });

    // Reset form and close modal
    resetTeamForm();
    showCreateTeamModal.value = false;

    // Refresh teams list
    fetchTeams();
  } catch (err) {
    console.error('Failed to create team:', err);
  } finally {
    isCreating.value = false;
  }
};

// Edit team
const editTeam = (team: any) => {
  editingTeam.value = team;
  newTeam.value = {
    name: team.name,
    description: team.description || '',
  };
  showCreateTeamModal.value = true;
  activeTeamMenu.value = null;
};

// Update team
const updateTeam = async () => {
  try {
    if (!process.client || !editingTeam.value) return;

    if (!newTeam.value.name) {
      return; // Form validation
    }

    isCreating.value = true;

    // Update team using teamsAPI service
    await teamsAPI.update(editingTeam.value.id, {
      name: newTeam.value.name,
      description: newTeam.value.description
    });

    // Reset form and close modal
    resetTeamForm();
    showCreateTeamModal.value = false;

    // Refresh teams list
    fetchTeams();
  } catch (err) {
    console.error('Failed to update team:', err);
  } finally {
    isCreating.value = false;
    editingTeam.value = null;
  }
};

// Cancel team modal
const cancelTeamModal = () => {
  resetTeamForm();
  showCreateTeamModal.value = false;
  editingTeam.value = null;
};

// Reset team form
const resetTeamForm = () => {
  newTeam.value = {
    name: '',
    description: '',
  };
};

// Confirm team deletion
const confirmDeleteTeam = (team: any) => {
  teamToDelete.value = team;
  showDeleteModal.value = true;
  activeTeamMenu.value = null;
};

// Delete team
const deleteTeam = async () => {
  if (!process.client || !teamToDelete.value) return;

  try {
    isDeleting.value = true;

    // Delete team using teamsAPI service
    await teamsAPI.delete(teamToDelete.value.id);

    // Close modal
    showDeleteModal.value = false;
    teamToDelete.value = null;

    // Refresh teams list
    fetchTeams();
  } catch (err) {
    console.error('Failed to delete team:', err);
  } finally {
    isDeleting.value = false;
  }
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

// Close team menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
  // Only process if we have an active menu
  if (activeTeamMenu.value !== null) {
    // Find menu elements
    const menuButton = document.querySelector(`button[data-team-id="${activeTeamMenu.value}"]`);
    const menuElement = document.querySelector('.origin-top-right[role="menu"]');

    // Check if click is outside of both the button and menu
    if ((!menuButton || !menuButton.contains(event.target as Node)) &&
      (!menuElement || !menuElement.contains(event.target as Node))) {
      console.log('Click outside detected, closing menu');
      activeTeamMenu.value = null;
    }
  }
};

// Lifecycle hooks
onMounted(() => {
  console.log("Component mounted");
  if (process.client) {
    console.log("Running on client-side");
    document.addEventListener('click', handleClickOutside);

    // Set a timer to fetch teams to avoid SSR issues
    setTimeout(() => {
      fetchTeams().catch(err => {
        console.error("Error fetching teams:", err);
      });
    }, 100);
  }
});

// Clean up event listener
onUnmounted(() => {
  if (process.client) {
    document.removeEventListener('click', handleClickOutside);
  }
});

// Watch for filter changes to reset pagination
watch([() => searchQuery.value], () => {
  currentPage.value = 1;
  fetchTeams();
});

watch(activeTeamMenu, (newValue) => {
  console.log('Active team menu changed to:', newValue);
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