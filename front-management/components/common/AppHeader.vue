<!-- components/common/AppHeader.vue -->
<template>
    <header class="bg-white border-b border-gray-200 z-20 fixed top-0 left-0 right-0 h-14">
      <div class="h-full flex items-center justify-between px-4">
        <!-- Left Section: Toggle Sidebar & Logo -->
        <div class="flex items-center space-x-4">
          <button @click="toggleSidebar" class="p-1 rounded-md text-gray-500 hover:bg-gray-100">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 6h16M4 12h16M4 18h16" />
            </svg>
          </button>
          <div class="flex items-center">
            <span class="text-lg font-semibold text-indigo-600">PM System</span>
          </div>
        </div>
  
        <!-- Middle Section: Search -->
        <div class="hidden md:block flex-1 max-w-2xl mx-4">
          <div class="relative">
            <input
              type="text"
              placeholder="Search tasks, projects, or teams..."
              class="w-full bg-gray-100 border border-gray-200 rounded-md py-2 pl-10 pr-4 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-transparent"
            />
            <div class="absolute left-3 top-2.5">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
          </div>
        </div>
  
        <!-- Right Section: Notifications & User Profile -->
        <div class="flex items-center space-x-2">
          <!-- Create Button -->
          <button class="hidden sm:flex items-center space-x-1 bg-indigo-600 hover:bg-indigo-700 text-white px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
            </svg>
            <span>Create</span>
          </button>
          
          <!-- Notifications -->
          <div class="relative">
            <button @click="toggleNotifications" class="p-2 rounded-full text-gray-500 hover:bg-gray-100 focus:outline-none">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 17h5l-1.405-1.405A2.032 2.032 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
              </svg>
              <span v-if="notificationCount > 0" class="absolute top-0 right-0 inline-flex items-center justify-center px-1.5 py-0.5 text-xs font-bold leading-none text-white bg-red-500 rounded-full">
                {{ notificationCount > 99 ? '99+' : notificationCount }}
              </span>
            </button>
            
            <!-- Notifications Dropdown -->
            <div v-if="showNotifications" class="origin-top-right absolute right-0 mt-2 w-80 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30" role="menu">
              <div class="p-3 border-b border-gray-200 flex items-center justify-between">
                <h3 class="text-sm font-medium text-gray-900">Notifications</h3>
                <button @click="markAllNotificationsRead" class="text-xs text-indigo-600 hover:text-indigo-800">
                  Mark all as read
                </button>
              </div>
              <div class="max-h-96 overflow-y-auto">
                <div v-if="notifications.length === 0" class="p-4 text-center text-sm text-gray-500">
                  No notifications
                </div>
                <div v-else>
                  <div v-for="notification in notifications" :key="notification.id" class="p-3 border-b border-gray-100 hover:bg-gray-50">
                    <div class="flex items-start">
                      <div :class="[notification.is_read ? 'bg-gray-200' : 'bg-indigo-500', 'rounded-full h-2 w-2 mt-1.5 mr-2']"></div>
                      <div class="flex-1">
                        <p class="text-sm font-medium text-gray-900">{{ notification.title }}</p>
                        <p class="text-xs text-gray-500">{{ notification.message }}</p>
                        <p class="text-xs text-gray-400 mt-1">{{ formatDate(notification.created_at) }}</p>
                      </div>
                      <button @click="markNotificationRead(notification.id)" class="text-gray-400 hover:text-gray-600">
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              <div class="p-2 border-t border-gray-200">
                <button @click="viewAllNotifications" class="w-full text-center text-xs text-indigo-600 hover:text-indigo-800 p-1">
                  View all notifications
                </button>
              </div>
            </div>
          </div>
          
          <!-- User Profile -->
          <div class="relative">
            <button @click="toggleUserMenu" class="flex items-center space-x-2 focus:outline-none">
              <div v-if="user?.profile_image" class="h-8 w-8 rounded-full overflow-hidden bg-gray-200">
                <img :src="user.profile_image" alt="Profile" class="h-full w-full object-cover" />
              </div>
              <div v-else class="h-8 w-8 rounded-full bg-indigo-600 flex items-center justify-center text-white text-sm font-medium">
                {{ userInitials }}
              </div>
              <div class="hidden md:block">
                <span class="text-sm font-medium text-gray-900">{{ user?.first_name }} {{ user?.last_name }}</span>
              </div>
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-gray-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
              </svg>
            </button>
            
            <!-- User Menu Dropdown -->
            <div v-if="showUserMenu" class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white ring-1 ring-black ring-opacity-5 focus:outline-none z-30" role="menu">
              <div class="py-1" role="none">
                <NuxtLink to="/profile" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" @click="showUserMenu = false">
                  Your Profile
                </NuxtLink>
                <NuxtLink to="/settings" class="block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem" @click="showUserMenu = false">
                  Settings
                </NuxtLink>
                <button @click="logout" class="w-full text-left block px-4 py-2 text-sm text-gray-700 hover:bg-gray-100" role="menuitem">
                  Sign out
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </header>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, onUnmounted } from 'vue';
  import { useAuth } from '~/composables/useAuth';
  import { User } from '~/types/auth';
  import { Notification } from '~/types/notification';
  
  // Emits
  const emit = defineEmits(['toggle-sidebar']);
  
  // State
  const showNotifications = ref(false);
  const showUserMenu = ref(false);
  const notifications = ref<Notification[]>([]);
  const notificationCount = ref(0);
  
  // Auth store and user
  const authStore = useAuthStore();
  const user = computed(() => authStore.getUser);
  
  // User initials for avatar
  const userInitials = computed(() => {
    if (!user.value) return '';
    
    const firstInitial = user.value.first_name.charAt(0).toUpperCase();
    const lastInitial = user.value.last_name.charAt(0).toUpperCase();
    
    return `${firstInitial}${lastInitial}`;
  });
  
  // Socket connection
  const { $socket } = useNuxtApp();
  
  // Methods
  const toggleSidebar = () => {
    emit('toggle-sidebar');
  };
  
  const toggleNotifications = () => {
    showNotifications.value = !showNotifications.value;
    
    if (showNotifications.value) {
      // Close user menu if open
      showUserMenu.value = false;
      
      // Load notifications
      fetchNotifications();
    }
  };
  
  const toggleUserMenu = () => {
    showUserMenu.value = !showUserMenu.value;
    
    if (showUserMenu.value) {
      // Close notifications if open
      showNotifications.value = false;
    }
  };
  
  const fetchNotifications = async () => {
    try {
      // Placeholder for actual API call
      // In a real implementation, you would fetch notifications from the API
      // const response = await $api.get('/notifications');
      // notifications.value = response.data.notifications;
      
      // For now, we'll use dummy data
      notifications.value = [
        {
          id: 1,
          user_id: 1,
          type: 'task_assigned',
          title: 'Task Assigned',
          message: 'You have been assigned to task "Update dashboard design"',
          is_read: false,
          data: { task_id: 123 },
          created_at: new Date(Date.now() - 1000 * 60 * 30).toISOString(), // 30 minutes ago
          updated_at: new Date(Date.now() - 1000 * 60 * 30).toISOString()
        },
        {
          id: 2,
          user_id: 1,
          type: 'comment_added',
          title: 'New Comment',
          message: 'John Doe commented on your task "Implement user authentication"',
          is_read: true,
          data: { task_id: 456, comment_id: 789 },
          created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
          updated_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString()
        }
      ];
    } catch (error) {
      console.error('Failed to fetch notifications:', error);
    }
  };
  
  const markNotificationRead = async (notificationId: number) => {
    try {
      // Mark notification as read
      // In a real implementation, you would call the API
      // await $api.post(`/notifications/${notificationId}/read`);
      
      // For now, we'll just update the local state
      const notification = notifications.value.find(n => n.id === notificationId);
      if (notification) {
        notification.is_read = true;
      }
      
      // Update notification count
      notificationCount.value = notifications.value.filter(n => !n.is_read).length;
      
      // Also use Socket.IO if available
      $socket.markNotificationRead(notificationId);
    } catch (error) {
      console.error('Failed to mark notification as read:', error);
    }
  };
  
  const markAllNotificationsRead = async () => {
    try {
      // Mark all notifications as read
      // In a real implementation, you would call the API
      // await $api.post('/notifications/read-all');
      
      // For now, we'll just update the local state
      notifications.value.forEach(notification => {
        notification.is_read = true;
      });
      
      // Update notification count
      notificationCount.value = 0;
      
      // Also use Socket.IO if available
      $socket.markAllNotificationsRead();
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };
  
  const viewAllNotifications = () => {
    // Navigate to notifications page
    navigateTo('/notifications');
    showNotifications.value = false;
  };
  
  const logout = () => {
    const { logout: authLogout } = useAuth();
    authLogout();
    showUserMenu.value = false;
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now.getTime() - date.getTime();
    const diffMins = Math.floor(diffMs / (1000 * 60));
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    
    if (diffMins < 60) {
      return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
    } else if (diffHours < 24) {
      return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
    } else if (diffDays < 7) {
      return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
    } else {
      return date.toLocaleDateString();
    }
  };
  
  // Socket.IO event listeners
  const setupSocketListeners = () => {
    // Listen for new notifications
    $socket.onNewNotification((event: any) => {
      notifications.value.unshift(event.notification);
      notificationCount.value += 1;
    });
    
    // Listen for notification count updates
    $socket.onNotificationCount((event: any) => {
      notificationCount.value = event.count;
    });
  };
  
  // Close dropdowns when clicking outside
  const handleClickOutside = (event: MouseEvent) => {
    const target = event.target as HTMLElement;
    
    // Check if click is outside notifications dropdown
    if (showNotifications.value && !target.closest('[role="menu"]')) {
      showNotifications.value = false;
    }
    
    // Check if click is outside user menu dropdown
    if (showUserMenu.value && !target.closest('[role="menu"]')) {
      showUserMenu.value = false;
    }
  };
  
  // Lifecycle hooks
  onMounted(() => {
    // Set up click outside listener
    document.addEventListener('click', handleClickOutside);
    
    // Set up socket listeners
    setupSocketListeners();
    
    // Fetch initial notification count
    // In a real implementation, you would call the API
    // const fetchNotificationCount = async () => {
    //   try {
    //     const response = await $api.get('/notifications/count');
    //     notificationCount.value = response.data.count;
    //   } catch (error) {
    //     console.error('Failed to fetch notification count:', error);
    //   }
    // };
    // fetchNotificationCount();
    
    // For now, we'll just set a dummy count
    notificationCount.value = 3;
  });
  
  onUnmounted(() => {
    // Clean up click outside listener
    document.removeEventListener('click', handleClickOutside);
  });
  </script>
  
  <style scoped>
  /* Add any scoped styles here */
  </style>