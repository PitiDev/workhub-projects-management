UserSearch.vue
<template>
  <div class="relative">

    <label :for="id" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">
      {{ label }}
    </label>

    <div class="relative">

      <div class="relative">
        <input :id="id" type="text" v-model="searchQuery" @focus="isFocused = true" @blur="handleBlur"
          @keydown.down.prevent="navigateResults(1)" @keydown.up.prevent="navigateResults(-1)"
          @keydown.enter.prevent="selectHighlighted" @keydown.esc="closeDropdown"
          placeholder="Search by name or email..."
          class="w-full px-4 py-3 pl-10 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-primary-500 focus:border-primary-500 dark:focus:ring-primary-500 dark:focus:border-primary-500 transition-all duration-200" />
        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
          <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
            viewBox="0 0 24 24" stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </div>


        <div v-if="selectedUser" class="absolute right-3 top-1/2 transform -translate-y-1/2 flex items-center">
          <div
            class="flex items-center bg-primary-100 dark:bg-primary-900/20 text-primary-800 dark:text-primary-400 rounded-full px-3 py-1 mr-2">
            <span class="text-sm font-medium truncate max-w-[150px]">{{ selectedUser.User.first_name }} {{
              selectedUser.User.last_name }}</span>
            <button @click.stop="clearSelection"
              class="ml-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg class="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>
      </div>


      <div v-if="isFocused && !selectedUser && filteredUsers.length > 0"
        class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 max-h-60 overflow-y-auto">
        <ul class="py-1">
          <li v-for="(user, index) in filteredUsers" :key="user.User.id" @mousedown.prevent="selectUser(user)"
            @mouseover="highlightedIndex = index" :class="[
              'px-4 py-2 cursor-pointer flex items-center',
              highlightedIndex === index
                ? 'bg-primary-50 dark:bg-primary-900/10 text-primary-700 dark:text-primary-400'
                : 'hover:bg-gray-50 dark:hover:bg-gray-700/50 text-gray-900 dark:text-gray-100'
            ]">
            <div class="h-8 w-8 flex-shrink-0 mr-3">
              <img v-if="user.profile_image" :src="user.profile_image" class="h-8 w-8 rounded-full object-cover"
                :alt="user.User.first_name + ' ' + user.User.last_name" />
              <div v-else
                class="h-8 w-8 rounded-full bg-gradient-to-br from-gray-100 to-gray-300 dark:from-gray-700 dark:to-gray-800 flex items-center justify-center text-gray-600 dark:text-gray-300 text-xs font-medium">
                {{ getInitials(user.User.first_name) }}
              </div>
            </div>

            <div class="flex-1 min-w-0">
              <p class="text-sm font-medium truncate">{{ user.User.first_name }} {{ user.User.last_name }}</p>
              <p class="text-xs text-gray-500 dark:text-gray-400 truncate">{{ user.User.email }}</p>
            </div>
          </li>
        </ul>
      </div>


      <div v-if="isFocused && !selectedUser && searchQuery && filteredUsers.length === 0"
        class="absolute z-10 mt-1 w-full bg-white dark:bg-gray-800 shadow-lg rounded-lg border border-gray-200 dark:border-gray-700 py-3 px-4 text-center">
        <p class="text-sm text-gray-500 dark:text-gray-400">No users found</p>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, watch, defineProps, defineEmits } from 'vue';

// Define props
const props = defineProps({
  users: {
    type: Array,
    required: true
  },
  modelValue: {
    type: [String, Number],
    default: ''
  },
  label: {
    type: String,
    default: 'Assignee'
  },
  id: {
    type: String,
    default: 'user-search'
  }
});

// Define emits
const emit = defineEmits(['update:modelValue']);

// Component state
const searchQuery = ref('');
const isFocused = ref(false);
const highlightedIndex = ref(0);

// Filter users based on search query
const filteredUsers = computed(() => {
  if (!searchQuery.value) return props.users;

  const query = searchQuery.value.toLowerCase();
  return props.users.filter(user => {
    const nameMatch = user.User.first_name && user.User.first_name.toLowerCase().includes(query);
    const emailMatch = user.User.email && user.User.email.toLowerCase().includes(query);
    return nameMatch || emailMatch;
  });
});

// Get the currently selected user
const selectedUser = computed(() => {
  if (!props.modelValue) return null;
  return props.users.find(user => user.User.id.toString() === props.modelValue.toString());
});

// Handle blur event - close dropdown unless clicking on it
const handleBlur = () => {
  // Give time for click to register before closing dropdown
  setTimeout(() => {
    isFocused.value = false;
  }, 200);
};

// Close dropdown
const closeDropdown = () => {
  isFocused.value = false;
};

// Select a user from the dropdown
const selectUser = (user) => {
  emit('update:modelValue', user.User.id.toString());
  searchQuery.value = '';
  isFocused.value = false;
};

// Clear selected user
const clearSelection = () => {
  emit('update:modelValue', '');
  searchQuery.value = '';
  setTimeout(() => {
    isFocused.value = true;
  }, 10);
};

// Navigate through results with keyboard
const navigateResults = (direction) => {
  const newIndex = highlightedIndex.value + direction;
  if (newIndex >= 0 && newIndex < filteredUsers.value.length) {
    highlightedIndex.value = newIndex;
  }
};

// Select highlighted result with enter key
const selectHighlighted = () => {
  if (filteredUsers.value.length > 0) {
    selectUser(filteredUsers.value[highlightedIndex.value]);
  }
};

// Reset highlighted index when filtered results change
watch(filteredUsers, () => {
  highlightedIndex.value = 0;
});

// Get initials from user name
const getInitials = (name) => {
  if (!name) return '';

  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// When component mounts, if there's a selected value, make sure dropdown is closed
if (props.modelValue) {
  isFocused.value = false;
}
</script>