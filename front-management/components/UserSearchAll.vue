<!-- components/UserSearchAll.vue -->
<template>
    <div>
      <label v-if="label" :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
        {{ label }}
      </label>
      <div class="relative">
        <!-- Search Input -->
        <div class="relative">
          <input
            :id="id"
            v-model="searchQuery"
            type="text"
            :placeholder="placeholder || 'Search users...'"
            class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-gray-900 dark:text-gray-100 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-400 dark:focus:border-primary-400 transition-all duration-200"
            @focus="showResults = true"
            @input="onSearch"
          />
          <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
          <div v-if="searchQuery && !loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <button @click="clearSearch" class="text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          <div v-if="loading" class="absolute inset-y-0 right-0 pr-3 flex items-center">
            <svg class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
              <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
              <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
            </svg>
          </div>
        </div>
  
        <!-- Search Results -->
        <div v-if="showResults && searchResults.length > 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg max-h-60 rounded-md py-1 text-base overflow-auto focus:outline-none sm:text-sm border border-gray-200 dark:border-gray-700">
          <div @click="selectUser(null)" class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              <span class="ml-3 block font-medium text-gray-700 dark:text-gray-300">
                Unassigned
              </span>
            </div>
          </div>
          <div v-for="user in searchResults" :key="user.id" @click="selectUser(user)" class="cursor-pointer select-none relative py-2 pl-3 pr-9 hover:bg-gray-100 dark:hover:bg-gray-700">
            <div class="flex items-center">
              <div class="h-8 w-8 flex-shrink-0">
                <img v-if="user.profile_image" :src="user.profile_image" class="h-8 w-8 rounded-full object-cover" :alt="getUserName(user)" />
                <div v-else class="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium">
                  {{ getInitials(getUserName(user)) }}
                </div>
              </div>
              <span class="ml-3 block font-medium text-gray-700 dark:text-gray-300">
                {{ getUserName(user) }}
              </span>
            </div>
            <span v-if="modelValue && user.id == modelValue" class="absolute inset-y-0 right-0 flex items-center pr-4 text-primary-600 dark:text-primary-400">
              <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fill-rule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clip-rule="evenodd" />
              </svg>
            </span>
          </div>
        </div>
  
        <!-- No Results Message -->
        <div v-else-if="showResults && searchQuery && !loading && searchResults.length === 0" class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-md py-3 text-center border border-gray-200 dark:border-gray-700">
          <p class="text-gray-500 dark:text-gray-400">No users found</p>
        </div>
      </div>
  
      <!-- Selected User Display -->
      <div v-if="selectedUser" class="mt-2 flex items-center">
        <div class="h-6 w-6 flex-shrink-0">
          <img v-if="selectedUser.profile_image" :src="selectedUser.profile_image" class="h-6 w-6 rounded-full object-cover" :alt="getUserName(selectedUser)" />
          <div v-else class="h-6 w-6 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium">
            {{ getInitials(getUserName(selectedUser)) }}
          </div>
        </div>
        <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">
          {{ getUserName(selectedUser) }}
        </span>
        <button @click="clearSelection" class="ml-2 text-gray-400 hover:text-gray-500 dark:text-gray-500 dark:hover:text-gray-400">
          <svg class="h-4 w-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, watch, onMounted, computed, onBeforeUnmount } from 'vue';
  import { userAPI } from '~/services/api';
  
  const props = defineProps({
    modelValue: {
      type: [String, Number],
      default: ''
    },
    label: {
      type: String,
      default: ''
    },
    id: {
      type: String,
      default: 'user-search'
    },
    placeholder: {
      type: String,
      default: 'Search users...'
    },
    teamId: {
      type: [String, Number],
      default: ''
    }
  });
  
  const emit = defineEmits(['update:modelValue']);
  
  // State
  const searchQuery = ref('');
  const searchResults = ref([]);
  const showResults = ref(false);
  const loading = ref(false);
  const selectedUser = ref(null);
  
  // Methods
  const onSearch = async () => {
    if (!searchQuery.value) {
      searchResults.value = [];
      return;
    }
  
    loading.value = true;
    try {
      let response;
      
      if (props.teamId) {
        // If teamId is provided, get users from that team
        response = await userAPI.getByTeam(props.teamId).catch(() => {
          // Mock data for development
          return {
            data: {
              data: getMockTeamMembers()
            }
          };
        });
      } else {
        // Otherwise search all users
        const response = await userAPI.getAll().catch(() => {
          // Mock data for development
        //   return {
        //     data: {
        //       data: getMockUsers().filter(user => 
        //         user.first_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        //         user.last_name.toLowerCase().includes(searchQuery.value.toLowerCase()) ||
        //         (user.email && user.email.toLowerCase().includes(searchQuery.value.toLowerCase()))
        //       )
        //     }
        //   };
        });
      }
      
      searchResults.value = response.data.data;
    } catch (error) {
      console.error('Error searching users:', error);
      searchResults.value = [];
    } finally {
      loading.value = false;
    }
  };
  
  const selectUser = (user) => {
    selectedUser.value = user;
    emit('update:modelValue', user ? user.id : '');
    searchQuery.value = user ? getUserName(user) : '';
    showResults.value = false;
  };
  
  const clearSearch = () => {
    searchQuery.value = '';
    searchResults.value = [];
  };
  
  const clearSelection = () => {
    selectedUser.value = null;
    searchQuery.value = '';
    emit('update:modelValue', '');
  };
  
  const getUserName = (user) => {
    if (!user) return '';
    return `${user.first_name || ''} ${user.last_name || ''}`.trim();
  };
  
  const getInitials = (name) => {
    if (!name) return '';
    return name
      .split(' ')
      .map(part => part.charAt(0))
      .join('')
      .toUpperCase()
      .substring(0, 2);
  };
  
  // Get user by ID helper
  const getUserById = async (userId) => {
    if (!userId) return null;
    
    try {
      const response = await userAPI.getById(userId).catch(() => {
        // Mock data for development
        // const mockUsers = getMockUsers();
        // const user = mockUsers.find(u => u.id == userId);
        // return { data: { data: user } };
      });
      return response.data.data;
    } catch (error) {
      console.error('Error fetching user:', error);
      return null;
    }
  };
  
  // Mock data for development
  const getMockUsers = () => {
    const users = [];
    const firstNames = ['John', 'Jane', 'Alice', 'Bob', 'Charlie', 'Diana', 'Edward', 'Fiona'];
    const lastNames = ['Smith', 'Johnson', 'Williams', 'Brown', 'Jones', 'Miller', 'Davis', 'Garcia'];
    
    for (let i = 0; i < 8; i++) {
      users.push({
        id: i + 1,
        first_name: firstNames[i],
        last_name: lastNames[i],
        email: `${firstNames[i].toLowerCase()}@example.com`.toLowerCase(),
        profile_image: Math.random() > 0.5 ? `https://i.pravatar.cc/150?u=${i+1}` : null
      });
    }
    
    return users;
  };
  
  const getMockTeamMembers = () => {
    // Return a subset of mock users as team members
    return getMockUsers().slice(0, 5);
  };
  
  // Set initial user if modelValue is provided
  const initializeSelectedUser = async () => {
    if (props.modelValue) {
      const user = await getUserById(props.modelValue);
      if (user) {
        selectedUser.value = user;
        searchQuery.value = getUserName(user);
      }
    }
  };
  
  // Watch for outside clicks
  const handleClickOutside = (event) => {
    if (showResults.value && !event.target.closest(`#${props.id}`)) {
      showResults.value = false;
    }
  };
  
  // Watch for model value changes from parent
  watch(() => props.modelValue, async (newVal, oldVal) => {
    if (newVal !== oldVal) {
      if (newVal) {
        const user = await getUserById(newVal);
        if (user) {
          selectedUser.value = user;
          searchQuery.value = getUserName(user);
        }
      } else {
        selectedUser.value = null;
        searchQuery.value = '';
      }
    }
  }, { immediate: true });
  
  // Lifecycle hooks
  onMounted(() => {
    initializeSelectedUser();
    document.addEventListener('click', handleClickOutside);
  });
  
  onBeforeUnmount(() => {
    document.removeEventListener('click', handleClickOutside);
  });
  </script>