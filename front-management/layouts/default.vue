<!-- layouts/default.vue -->
<template>
  <div class="">
    <main class="flex-1 transition-all duration-300">
        <slot />
      </main>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { useAuth } from '~/composables/useAuth';
import { useAuthStore } from '~/stores/auth';

const sidebarExpanded = ref(true);

// Emits
const emit = defineEmits(['update:sidebar-expanded']);

// Methods
const toggleSidebar = () => {
  sidebarExpanded.value = !sidebarExpanded.value;
  emit('update:sidebar-expanded', sidebarExpanded.value);

  // Save preference to localStorage
  localStorage.setItem('sidebarExpanded', sidebarExpanded.value.toString());
};

const handleToggleSidebar = (expanded: boolean) => {
  sidebarExpanded.value = expanded;
  emit('update:sidebar-expanded', expanded);
};

// Socket.IO connection
const { $socket } = useNuxtApp();

onMounted(async () => {
  // Connect to Socket.IO
  $socket?.connectSocket?.();

  // Subscribe to notifications
  $socket?.subscribeToNotifications?.();

  // Fetch current user if not already available
  const authStore = useAuthStore();
  if (!authStore.user) {
    const { fetchCurrentUser } = useAuth();
    await fetchCurrentUser();
  }

  // Restore sidebar state from localStorage
  const savedExpanded = localStorage.getItem('sidebarExpanded');
  if (savedExpanded !== null) {
    sidebarExpanded.value = savedExpanded === 'true';
  }
});

onBeforeUnmount(() => {
  // Disconnect Socket.IO when component is unmounted
  $socket?.disconnectSocket?.();
});
</script>