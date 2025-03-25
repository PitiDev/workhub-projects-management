<template>
    <div class="min-h-screen bg-gray-50 dark:bg-gray-900">
        <!-- Sidebar with modern design -->
        <div class="fixed inset-y-0 left-0 z-20 w-64 bg-white dark:bg-gray-800 border-r border-gray-200 dark:border-gray-700 shadow-sm transition-transform duration-300 ease-in-out"
            :class="{ '-translate-x-full': !sidebarOpen, 'translate-x-0': sidebarOpen }">

            <!-- Logo and app name -->
            <div class="h-16 px-6 flex items-center border-b border-gray-200 dark:border-gray-700">
                <NuxtLink to="/dashboard" class="flex items-center space-x-3">
                    <div class="h-9 w-9 bg-primary-600 rounded-xl flex items-center justify-center text-white">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" viewBox="0 0 24 24" fill="none"
                            stroke="currentColor" stroke-width="2">
                            <path stroke-linecap="round" stroke-linejoin="round"
                                d="M5 3v4M3 5h4M6 17v4m-2-2h4m5-16l2.286 6.857L21 12l-5.714 2.143L13 21l-2.286-6.857L5 12l5.714-2.143L13 3z" />
                        </svg>
                    </div>
                    <span class="font-bold text-lg text-gray-900 dark:text-white">ProjectHub</span>
                </NuxtLink>
            </div>

            <!-- Navigation Menu with modern look -->
            <div class="py-6 px-3">
                <div class="space-y-1">
                    <NuxtLink v-for="item in menuItems" :key="item.path" :to="item.path"
                        class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg transition-all duration-200"
                        :class="route.path.startsWith(item.path)
                            ? 'bg-primary-50 dark:bg-primary-900/20 text-primary-700 dark:text-primary-400'
                            : 'text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 hover:text-gray-900 dark:hover:text-white'
                            ">
                        <span v-html="item.icon"
                            :class="route.path.startsWith(item.path) ? 'text-primary-600 dark:text-primary-400' : 'text-gray-500 dark:text-gray-400'"
                            class="mr-3 flex-shrink-0"></span>
                        <span>{{ item.name }}</span>
                    </NuxtLink>
                </div>
            </div>

            <!-- Teams section with modern style -->
            <div class="px-3 mt-2">
                <h3 class="px-3 text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                    My Teams
                </h3>
                <div class="mt-2 space-y-1">
                    <div v-for="team in teams" :key="team.id"
                        class="group flex items-center px-3 py-2.5 text-sm font-medium rounded-lg text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-all duration-200">
                        <div
                            class="mr-3 h-6 w-6 text-gray-600 dark:text-gray-300 bg-gray-100 dark:bg-gray-700 group-hover:bg-gray-200 dark:group-hover:bg-gray-600 rounded-md flex items-center justify-center">
                            {{ team.name.charAt(0) }}
                        </div>
                        <span>{{ team.name }}</span>
                    </div>
                </div>
            </div>
        </div>

        <!-- Main Content -->
        <div class="lg:pl-64 flex flex-col min-h-screen transition-all duration-300"
            :class="{ 'lg:pl-0': !sidebarOpen }">
            <!-- Top navbar with modern design -->
            <div
                class="sticky top-0 z-10 bg-white dark:bg-gray-800 h-16 border-b border-gray-200 dark:border-gray-700 flex items-center shadow-sm">
                <!-- Mobile menu button -->
                <button @click="toggleSidebar"
                    class="px-4 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500 lg:hidden">
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path v-if="!sidebarOpen" stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h16M4 18h16" />
                        <path v-else stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Small toggle for desktop sidebar -->
                <button @click="toggleSidebar"
                    class="hidden lg:block px-4 text-gray-500 dark:text-gray-400 focus:outline-none focus:ring-2 focus:ring-primary-500">
                    <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                        stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                            d="M4 6h16M4 12h8M4 18h16" />
                    </svg>
                </button>

                <!-- Fixed Search Bar Layout -->
                <div class="flex-1 px-4">
                    <div class="w-full max-w-xl relative">
                        <input type="text" placeholder="Search projects, tasks..." v-model="searchQuery"
                            @input="handleSearch" @focus="showSearchResults = true"
                            @keydown.down.prevent="navigateResults('down')" @keydown.up.prevent="navigateResults('up')"
                            @keydown.enter.prevent="selectResult(activeResultIndex)" @keydown.esc="resetSearch"
                            class="w-full h-10 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" />
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>

                        <!-- Loading indicator -->
                        <div v-if="isSearching" class="absolute inset-y-0 right-0 flex items-center pr-3">
                            <svg class="animate-spin h-5 w-5 text-primary-500" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24">
                                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor"
                                    stroke-width="4"></circle>
                                <path class="opacity-75" fill="currentColor"
                                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                                </path>
                            </svg>
                        </div>

                        <!-- Search Results Dropdown with improved positioning and visibility -->
                        <div v-if="showSearchResults && searchQuery.trim().length >= 2"
                            class="absolute left-0 top-full z-[100] mt-1 w-full bg-white dark:bg-gray-800 rounded-md shadow-lg max-h-96 overflow-y-auto border border-gray-200 dark:border-gray-700"
                            ref="searchResultsDropdown">
                            <!-- Add debugging output during development -->
                            <div
                                class="p-2 border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400">
                                Query: "{{ searchQuery }}", Results: {{ searchResults.projects.length +
                                    searchResults.tasks.length }}
                            </div>

                            <!-- Project Results -->
                            <div v-if="searchResults.projects && searchResults.projects.length > 0">
                                <div
                                    class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                                    Projects ({{ searchResults.projects.length }})
                                </div>
                                <div v-for="(project, index) in searchResults.projects" :key="'project-' + project.id">
                                    <div @click="navigateToProject(project)" @mouseenter="activeResultIndex = index"
                                        class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150 flex items-center"
                                        :class="{ 'bg-gray-100 dark:bg-gray-700': activeResultIndex === index }">
                                        <div class="w-2.5 h-2.5 rounded-full mr-2 flex-shrink-0"
                                            :style="{ backgroundColor: project.color || '#9CA3AF' }"></div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {{ project.name }}
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {{ project.Team?.name || 'No team' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- Task Results -->
                            <div v-if="searchResults.tasks && searchResults.tasks.length > 0">
                                <div
                                    class="px-4 py-2 text-xs font-semibold text-gray-500 dark:text-gray-400 bg-gray-50 dark:bg-gray-900">
                                    Tasks ({{ searchResults.tasks.length }})
                                </div>
                                <div v-for="(task, index) in searchResults.tasks" :key="'task-' + task.id">
                                    <div @click="navigateToTask(task)"
                                        @mouseenter="activeResultIndex = searchResults.projects.length + index"
                                        class="px-4 py-3 hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors duration-150 flex items-center"
                                        :class="{ 'bg-gray-100 dark:bg-gray-700': activeResultIndex === searchResults.projects.length + index }">
                                        <div
                                            class="flex items-center justify-center w-6 h-6 bg-gray-100 dark:bg-gray-700 rounded-md mr-2 flex-shrink-0">
                                            <svg class="w-4 h-4 text-gray-500 dark:text-gray-400"
                                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                                stroke="currentColor">
                                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                                    d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                                            </svg>
                                        </div>
                                        <div class="flex-1 min-w-0">
                                            <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                                                {{ task.title }}
                                            </p>
                                            <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                                                {{ task.Project?.name || 'No project' }}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            <!-- No Results Message -->
                            <div v-if="!isSearching && searchQuery.trim().length >= 2 &&
                                (!searchResults.projects || searchResults.projects.length === 0) &&
                                (!searchResults.tasks || searchResults.tasks.length === 0)"
                                class="px-4 py-3 text-sm text-gray-500 dark:text-gray-400">
                                No results found for "{{ searchQuery }}"
                            </div>
                        </div>
                    </div>

                </div>


                <!-- Right navbar items -->
                <div class="ml-4 flex items-center space-x-4 mr-4">
                    <!-- Theme toggle -->
                    <ThemeToggle />

                    <!-- Profile dropdown -->
                    <div class="relative">
                        <div>
                            <button @click="toggleProfileMenu" id="user-menu"
                                class="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500">
                                <span class="sr-only">Open user menu</span>
                                <img class="h-8 w-8 rounded-full"
                                    :src="user.profileImage || getInitialsAvatar(user.firstName, user.lastName)"
                                    alt="" />
                            </button>
                        </div>
                        <!-- Profile dropdown menu with modern styling -->
                        <div v-if="showProfileMenu"
                            class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg py-1 bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 z-30"
                            role="menu">
                            <NuxtLink to="/profile"
                                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                                role="menuitem">
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                    </svg>
                                    Your Profile
                                </div>
                            </NuxtLink>
                            <div class="border-t border-gray-100 dark:border-gray-700 my-1"></div>
                            <a href="#" @click.prevent="logout"
                                class="block px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 transition-colors duration-150"
                                role="menuitem">
                                <div class="flex items-center">
                                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none"
                                        viewBox="0 0 24 24" stroke="currentColor">
                                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                            d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
                                    </svg>
                                    Sign out
                                </div>
                            </a>
                        </div>
                    </div>
                </div>



            </div>

            <!-- Main Content with subtle background pattern -->
            <main class="py-6 flex-grow bg-gray-50 dark:bg-gray-900">
                <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <slot />
                </div>
            </main>
        </div>
    </div>
</template>


<script setup lang="ts">
import { ref, onMounted, watch, onUnmounted, nextTick } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from '~/stores/themeStore';
import { authAPI, teamsAPI } from '~/services/api';
import { useDebounce } from '~/composables/useDebounce';
import { projectsAPI } from '~/services/api/projects';
import { tasksAPI } from '~/services/api/tasks';

// Import TypeScript interfaces
import type { User, Team, Project, Task, MenuItem, SearchResults } from '~/types';

// Initialize theme system
const themeStore = useThemeStore();
onMounted(() => {
    themeStore.initTheme();
});

// Get route and router
const route = useRoute();
const router = useRouter();

// Search functionality
const searchQuery = ref<string>('');
const debouncedSearchQuery = useDebounce<string>(searchQuery, 300);
const isSearching = ref<boolean>(false);
const showSearchResults = ref<boolean>(false);
const searchResults = ref<SearchResults>({
    projects: [],
    tasks: []
});
const activeResultIndex = ref<number>(-1);
const searchResultsDropdown = ref<HTMLElement | null>(null);

// Sidebar state
const sidebarOpen = ref<boolean>(true);

// Profile menu state
const showProfileMenu = ref<boolean>(false);

// User data - Fetch from localStorage or API
const user = ref<User>({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    profileImage: null,
});

// Search function
// Search function with detailed logging and improved error handling
const handleSearch = async (): Promise<void> => {
    if (searchQuery.value.trim().length < 2) {
        resetSearchResults();
        return;
    }

    isSearching.value = true;
    console.log('Searching for:', searchQuery.value);

    try {
        // Fetch projects and tasks simultaneously
        const [projectsResponse, tasksResponse] = await Promise.all([
            projectsAPI.search({ query: searchQuery.value }),
            tasksAPI.search({ query: searchQuery.value })
        ]);

        console.log('Projects API response:', projectsResponse);
        console.log('Tasks API response:', tasksResponse);

        // Debug log full responses in development mode
        console.log('Projects API response:', projectsResponse);
        console.log('Tasks API response:', tasksResponse);

        // Check the structure of the responses
        if (
            !projectsResponse ||
            !projectsResponse.data ||
            !tasksResponse ||
            !tasksResponse.data
        ) {
            console.error('Invalid API response structure:', { projectsResponse, tasksResponse });
            resetSearchResults();
            return;
        }

        // Determine the correct path to data
        // Some APIs return data directly, others return data.data
        const projectsData = Array.isArray(projectsResponse.data)
            ? projectsResponse.data
            : (projectsResponse.data.data || []);

        const tasksData = Array.isArray(tasksResponse.data)
            ? tasksResponse.data
            : (tasksResponse.data.data || []);

        console.log('Projects data (processed):', projectsData);
        console.log('Tasks data (processed):', tasksData);

        // Update search results
        searchResults.value = {
            projects: projectsData,
            tasks: tasksData
        };

        // Log final search results
        console.log('Final search results:', searchResults.value);

        // Reset active index when results change
        activeResultIndex.value = searchResults.value.projects.length > 0 ? 0 : -1;
    } catch (error) {
        console.error('Search error:', error);
        // Show detailed error message
        if (error.response) {
            console.error('Error response:', error.response.data);
            console.error('Error status:', error.response.status);
        }

        // Fallback to empty results on error
        searchResults.value = { projects: [], tasks: [] };
    } finally {
        isSearching.value = false;
    }
};

// Navigation functions
const navigateToProject = (project: Project): void => {
    router.push(`/projects/${project.id}`);
    resetSearch();
};

const navigateToTask = (task: Task): void => {
    router.push(`/projects/${task.project_id}/tasks/${task.id}`);
    resetSearch();
};

// Search results navigation with keyboard
const navigateResults = (direction: 'up' | 'down'): void => {
    if (!showSearchResults.value) return;

    const totalResults = searchResults.value.projects.length + searchResults.value.tasks.length;
    if (totalResults === 0) return;

    if (direction === 'down') {
        activeResultIndex.value = (activeResultIndex.value + 1) % totalResults;
    } else {
        activeResultIndex.value = activeResultIndex.value <= 0 ? totalResults - 1 : activeResultIndex.value - 1;
    }

    // Scroll to active item
    nextTick(() => {
        const activeElement = searchResultsDropdown.value?.querySelector('.bg-gray-100, .dark\\:bg-gray-700');
        if (activeElement) {
            activeElement.scrollIntoView({ block: 'nearest' });
        }
    });
};

const selectResult = (index: number): void => {
    if (index < 0) return;

    if (index < searchResults.value.projects.length) {
        navigateToProject(searchResults.value.projects[index]);
    } else {
        const taskIndex = index - searchResults.value.projects.length;
        navigateToTask(searchResults.value.tasks[taskIndex]);
    }
};

const resetSearch = (): void => {
    searchQuery.value = '';
    showSearchResults.value = false;
    resetSearchResults();
};

const resetSearchResults = (): void => {
    searchResults.value = { projects: [], tasks: [] };
    activeResultIndex.value = -1;
};

// Close search results when clicking outside
const handleClickOutside = (event: MouseEvent): void => {
    if (searchResultsDropdown.value && !searchResultsDropdown.value.contains(event.target as Node)) {
        showSearchResults.value = false;
    }
};

// Watch for search query changes (using debounced value)
watch(debouncedSearchQuery, () => {
    if (debouncedSearchQuery.value) {
        handleSearch();
    } else {
        resetSearchResults();
    }
});

// Load user data
const loadUserData = (): void => {
    const userData = localStorage.getItem('user');
    if (userData) {
        try {
            const parsedUser = JSON.parse(userData);
            user.value = {
                id: parsedUser.id,
                firstName: parsedUser.first_name || parsedUser.firstName,
                lastName: parsedUser.last_name || parsedUser.lastName,
                email: parsedUser.email,
                profileImage: parsedUser.profile_image || parsedUser.profileImage,
            };
        } catch (error) {
            console.error('Error parsing user data:', error);
        }
    } else {
        // Fetch from API if not in localStorage
        fetchUserData();
    }
};

// Fetch user data from API
const fetchUserData = async (): Promise<void> => {
    try {
        // Check for token before proceeding
        if (!process.client) return;

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) {
            router.push('/login');
            return;
        }

        // Use authAPI instead of direct axios
        const response = await authAPI.me();
        const userData = response.data.user;

        user.value = {
            id: userData.id,
            firstName: userData.first_name || userData.firstName,
            lastName: userData.last_name || userData.lastName,
            email: userData.email,
            profileImage: userData.profile_image || userData.profileImage,
        };

        // Save to localStorage
        localStorage.setItem('user', JSON.stringify(userData));
    } catch (error: any) {
        console.error('Failed to fetch user data:', error);

        // Redirect to login if unauthorized
        if (error.response?.status === 401) {
            logout();
        }
    }
};

// Menu items with modern SVG icons
const menuItems = ref([
    {
        name: 'Dashboard',
        path: '/dashboard',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
               </svg>`
    },
    {
        name: 'Projects',
        path: '/projects',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
               </svg>`
    },
    {
        name: 'Teams',
        path: '/teams',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
               </svg>`
    },
    {
        name: 'My Tasks',
        path: '/tasks',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-6 9l2 2 4-4" />
               </svg>`
    },
    {
        name: 'Calendar',
        path: '/calendar',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
               </svg>`
    },
    {
        name: 'Notes',
        path: '/notes',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
               </svg>`
    },
    {
        name: 'Analytics',
        path: '/analytics',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
               </svg>`
    },
    {
        name: 'Google Drive',
        path: '/storage/google-drive',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M2 20V4C2 3.44772 2.44772 3 3 3H21C21.5523 3 22 3.44772 22 4V20C22 20.5523 21.5523 21 21 21H3C2.44772 21 2 20.5523 2 20Z"></path><line x1="2" y1="8" x2="22" y2="8"></line><line x1="2" y1="14" x2="22" y2="14"></line><circle cx="6" cy="5.5" r="1"></circle><circle cx="6" cy="11" r="1"></circle><circle cx="6" cy="17" r="1"></circle></svg>`

    },
    {
        name: 'Reports',
        path: '/reports',
        icon: `<svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z" />
               </svg>`
    },
]);

// Teams - Fetch from API
const teams = ref<Team[]>([]);
const fetchTeams = async (): Promise<void> => {
    try {
        // Check for client-side execution
        if (!process.client) return;

        const token = localStorage.getItem('token') || sessionStorage.getItem('token');
        if (!token) return;

        // Use teamsAPI instead of direct axios
        const response = await teamsAPI.getAll().catch(() => {
            // Fallback to mock data if API fails
            return {
                data: {
                    data: [
                        { id: 1, name: 'Development Team' },
                        { id: 2, name: 'Marketing Team' },
                        { id: 3, name: 'Design Team' },
                    ]
                }
            };
        });

        teams.value = response.data.data || [];
    } catch (error) {
        console.error('Failed to fetch teams:', error);
        // Use fallback data if needed
    }
};

// Toggle sidebar
const toggleSidebar = (): void => {
    sidebarOpen.value = !sidebarOpen.value;
};

// Toggle profile menu
const toggleProfileMenu = (): void => {
    showProfileMenu.value = !showProfileMenu.value;
};

// Logout function
const logout = (): void => {
    // Remove user data and token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');

    // Redirect to login page
    router.push('/login');
};

// Generate avatar from initials
const getInitialsAvatar = (firstName: string, lastName: string): string => {
    return `https://ui-avatars.com/api/?name=${firstName}+${lastName}&background=random`;
};

// When component is mounted
onMounted(() => {
    // Only execute client-side code when in browser
    if (process.client) {
        // Load user data
        loadUserData();

        // Fetch teams
        fetchTeams();

        // Register click outside handler
        document.addEventListener('click', handleClickOutside);

        // Use localStorage to remember sidebar state
        const storedSidebarState = localStorage.getItem('sidebarOpen');
        if (storedSidebarState !== null) {
            sidebarOpen.value = storedSidebarState === 'true';
        }
    }

    // Update sidebar state in localStorage when it changes
    watch(sidebarOpen, (newValue) => {
        if (process.client) {
            localStorage.setItem('sidebarOpen', String(newValue));
        }
    });
});

// Clean up event listeners when component is unmounted
onUnmounted(() => {
    if (process.client) {
        document.removeEventListener('click', handleClickOutside);
    }
});
</script>



<style scoped>
/* Search dropdown specific styles */
.search-dropdown {
    position: absolute;
    left: 0;
    right: 0;
    top: calc(100% + 4px);
    width: 100%;
    min-width: 400px;
    z-index: 9999 !important;
    /* Force highest z-index */
    background-color: white;
    border-radius: 0.375rem;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
    border: 1px solid #e5e7eb;
    max-height: 28rem;
    overflow-y: auto;
    display: block !important;
}

/* Dark mode styles */
:deep(.dark) .search-dropdown {
    background-color: #1f2937;
    border-color: #374151;
}

/* Optional: Add a nice transition effect */
.search-dropdown-enter-active,
.search-dropdown-leave-active {
    transition: opacity 0.2s ease, transform 0.2s ease;
}

.search-dropdown-enter-from,
.search-dropdown-leave-to {
    opacity: 0;
    transform: translateY(-10px);
}

/* Override any parent element that might be causing issues */
.search-input-container {
    position: relative !important;
    z-index: 100 !important;
}
</style>