<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6" @click.stop>
        <h3 class="text-lg font-medium text-gray-900 mb-2">{{ title }}</h3>
        
        <p class="text-gray-600 mb-6">{{ message }}</p>
        
        <div class="flex justify-end space-x-3">
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
            @click="$emit('cancel')"
          >
            {{ cancelText }}
          </button>
          <button
            type="button"
            class="px-4 py-2 text-sm font-medium text-white rounded-md focus:outline-none focus:ring-2"
            :class="confirmButtonClass"
            @click="$emit('confirm')"
          >
            {{ confirmText }}
          </button>
        </div>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  type ColorType = 'blue' | 'red' | 'green';
  
  const props = withDefaults(defineProps<{
    title?: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
    confirmColor?: ColorType;
  }>(), {
    title: 'Confirm Action',
    confirmText: 'Confirm',
    cancelText: 'Cancel',
    confirmColor: 'blue'
  });
  
  const emit = defineEmits<{
    confirm: [];
    cancel: [];
  }>();
  
  const confirmButtonClass = computed(() => {
    const colorClasses = {
      blue: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500',
      red: 'bg-red-600 hover:bg-red-700 focus:ring-red-500',
      green: 'bg-green-600 hover:bg-green-700 focus:ring-green-500'
    };
    
    return colorClasses[props.confirmColor] || colorClasses.blue;
  });
  </script>