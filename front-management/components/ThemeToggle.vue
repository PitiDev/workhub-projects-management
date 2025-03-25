<!-- components/ThemeToggle.vue -->
<template>
    <button
      @click="toggleTheme"
      class="p-2 text-gray-500 dark:text-gray-400 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 relative overflow-hidden"
      :title="isDark ? 'Switch to light mode' : 'Switch to dark mode'"
    >
      <Transition name="theme-toggle">
        <!-- Sun icon for dark mode (switch to light) -->
        <svg
          v-if="isDark"
          key="sun-icon"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 theme-toggle-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
        <!-- Moon icon for light mode (switch to dark) -->
        <svg
          v-else
          key="moon-icon"
          xmlns="http://www.w3.org/2000/svg"
          class="h-5 w-5 theme-toggle-icon"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
        >
          <path
            stroke-linecap="round"
            stroke-linejoin="round"
            stroke-width="2"
            d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
          />
        </svg>
      </Transition>
    </button>
  </template>
  
  <script setup lang="ts">
  import { useThemeStore } from '~/stores/themeStore';
  import { computed } from 'vue';
  
  const themeStore = useThemeStore();
  const isDark = computed(() => themeStore.isDark);
  
  const toggleTheme = () => {
    themeStore.toggleTheme();
  };
  </script>
  
  <style scoped>
  .theme-toggle-enter-active,
  .theme-toggle-leave-active {
    transition: transform 0.5s cubic-bezier(0.175, 0.885, 0.32, 1.275), opacity 0.5s ease;
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
  }
  
  .theme-toggle-enter-from {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(45deg) scale(0);
  }
  
  .theme-toggle-leave-to {
    opacity: 0;
    transform: translate(-50%, -50%) rotate(-45deg) scale(0);
  }
  
  .theme-toggle-enter-to,
  .theme-toggle-leave-from {
    opacity: 1;
    transform: translate(-50%, -50%) rotate(0) scale(1);
  }
  </style>