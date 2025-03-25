<!-- Add this component to your project -->
<!-- components/TaskStatusDropdown.vue -->
<template>
    <div class="relative">
      <button 
        @click="isOpen = !isOpen"
        @blur="handleBlur"
        type="button"
        class="inline-flex items-center justify-between w-full px-3 py-1.5 text-xs font-medium rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary-500 dark:focus:ring-primary-400"
        :style="{
          backgroundColor: getStatusColor(modelValue, '0.1'),
          color: getStatusColor(modelValue)
        }"
      >
        <span>{{ getCurrentStatusName() }}</span>
        <svg class="ml-2 w-4 h-4" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path fill-rule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clip-rule="evenodd" />
        </svg>
      </button>
      
      <div 
        v-if="isOpen" 
        class="origin-top-right absolute z-10 right-0 mt-1 w-40 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none"
        @click="isOpen = false"
      >
        <div class="py-1" role="menu" aria-orientation="vertical">
          <button
            v-for="status in statuses"
            :key="status.id"
            @click="updateStatus(status.id)"
            class="block w-full text-left px-4 py-2 text-sm hover:bg-gray-100 dark:hover:bg-gray-700"
            :class="status.id === modelValue ? 'bg-gray-50 dark:bg-gray-700/50 font-medium' : 'text-gray-700 dark:text-gray-300'"
            role="menuitem"
          >
            <div class="flex items-center">
              <span 
                class="w-2 h-2 rounded-full mr-2"
                :style="{ backgroundColor: status.color || '#9CA3AF' }"
              ></span>
              {{ status.name }}
            </div>
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, onMounted, watch, nextTick } from 'vue';
  
  const props = defineProps({
    modelValue: {
      type: Number,
      required: true
    },
    statuses: {
      type: Array,
      required: true
    },
    taskId: {
      type: Number,
      required: true
    },
    loading: {
      type: Boolean,
      default: false
    }
  });
  
  const emit = defineEmits(['update:modelValue', 'status-change']);
  
  const isOpen = ref(false);
  const dropdownRef = ref(null);
  
  // Get the name of the current status
  const getCurrentStatusName = () => {
    const currentStatus = props.statuses.find(s => s.id === props.modelValue);
    return currentStatus ? currentStatus.name : 'Unknown';
  };
  
  // Get color for a status
  const getStatusColor = (statusId, opacity = '1') => {
    // Find the status by ID
    const status = props.statuses.find(s => s.id === statusId);
    
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
    const statusName = getCurrentStatusName().toLowerCase();
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
  
  // Update the status
  const updateStatus = (statusId) => {
    if (props.loading || statusId === props.modelValue) return;
    
    emit('update:modelValue', statusId);
    emit('status-change', {
      taskId: props.taskId,
      statusId: statusId
    });
  };
  
  // Handle click outside to close dropdown
  const handleBlur = (event) => {
    // Close dropdown after a short delay to allow for click events inside the dropdown
    setTimeout(() => {
      isOpen.value = false;
    }, 150);
  };
  
  // Close dropdown when escape key is pressed
  const handleEscapeKey = (event) => {
    if (event.key === 'Escape' && isOpen.value) {
      isOpen.value = false;
    }
  };
  
  onMounted(() => {
    // Add event listener for escape key
    document.addEventListener('keydown', handleEscapeKey);
  });
  
  // Clean up event listeners
  onUnmounted(() => {
    document.removeEventListener('keydown', handleEscapeKey);
  });
  
  // Watch for loading state
  watch(() => props.loading, (newValue) => {
    if (newValue) {
      isOpen.value = false;
    }
  });
  </script>