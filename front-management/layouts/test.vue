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

            <!-- User profile at bottom -->
            <!-- <div class="absolute bottom-0 left-0 right-0 p-4 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center">
                    <img class="h-8 w-8 rounded-full"
                        :src="user.profileImage || getInitialsAvatar(user.firstName, user.lastName)"
                        alt="User avatar" />
                    <div class="ml-3 truncate">
                        <p class="text-sm font-medium text-gray-900 dark:text-white truncate">
                            {{ user.firstName }} {{ user.lastName }}
                        </p>
                        <p class="text-xs text-gray-500 dark:text-gray-400 truncate">
                            {{ user.email }}
                        </p>
                    </div>
                </div>
            </div> -->
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

                <!-- Search bar with modern look -->
                <div class="flex-1 px-4 flex justify-between items-center">
                    <div class="w-full max-w-xl relative">
                        <input type="text" placeholder="Search..."
                            class="w-full h-10 pl-10 pr-4 py-2 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent transition-all duration-200" />
                        <div class="absolute inset-y-0 left-0 flex items-center pl-3">
                            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg"
                                fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>

                    <!-- Right navbar items -->
                    <div class="ml-4 flex items-center space-x-4">
                        <!-- Notifications -->
                        <!-- <button
                            class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 relative">
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                            </svg>
                            <span class="absolute top-0 right-0 h-2 w-2 rounded-full bg-red-500"></span>
                        </button> -->

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
                                <!-- <a href="#"
                                    class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-150"
                                    role="menuitem">
                                    <div class="flex items-center">
                                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                        </svg>
                                        Settings
                                    </div>
                                </a> -->
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
import { ref, onMounted, watch, onUnmounted } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { useThemeStore } from '~/stores/themeStore';
import { authAPI, teamsAPI } from '~/services/api';

// Initialize theme system
const themeStore = useThemeStore();
onMounted(() => {
    themeStore.initTheme();
});

// Get route and router
const route = useRoute();
const router = useRouter();

// Sidebar state
const sidebarOpen = ref(true);

// Profile menu state
const showProfileMenu = ref(false);

// User data - Fetch from localStorage or API
const user = ref({
    id: 1,
    firstName: 'John',
    lastName: 'Doe',
    email: 'john@example.com',
    profileImage: null,
});

// Load user data
const loadUserData = () => {
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
const fetchUserData = async () => {
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
    } catch (error) {
        console.error('Failed to fetch user data:', error);

        // Redirect to login if unauthorized
        if (error.response?.status === 401) {
            logout();
        }
    }
};

// Menu items with modern SVG icons
// Menu items with inline SVG icons
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
const teams = ref([]);
const fetchTeams = async () => {
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
        // Fallback data
        
    }
};

// Toggle sidebar
const toggleSidebar = () => {
    sidebarOpen.value = !sidebarOpen.value;
};

// Toggle profile menu
const toggleProfileMenu = () => {
    showProfileMenu.value = !showProfileMenu.value;
};

// Logout function - This would use an auth store in a real app
const logout = () => {
    // Remove user data and token from localStorage
    localStorage.removeItem('token');
    localStorage.removeItem('user');
    sessionStorage.removeItem('token');

    // Redirect to login page
    router.push('/login');
};

// Close profile menu when clicking outside
const handleClickOutside = (event: MouseEvent) => {
    const userMenu = document.getElementById('user-menu');
    if (userMenu && !userMenu.contains(event.target as Node) && showProfileMenu.value) {
        showProfileMenu.value = false;
    }
};

// Generate avatar from initials
const getInitialsAvatar = (firstName: string, lastName: string) => {
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

// Remove event listener when component is unmounted
onUnmounted(() => {
    if (process.client) {
        document.removeEventListener('click', handleClickOutside);
    }
});
</script>

<style scoped>
/* Add any custom styles here */
</style>