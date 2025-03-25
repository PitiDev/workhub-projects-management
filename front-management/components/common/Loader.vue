<!-- components/common/Loader.vue -->
<template>
    <div 
      :class="[
        'flex items-center justify-center',
        fullPage ? 'fixed inset-0 bg-white bg-opacity-75 z-50' : 'h-full w-full py-6'
      ]"
    >
      <div :class="['animate-spin rounded-full border-t-2', `border-${color}-500 h-${size} w-${size}`]"></div>
      <span v-if="text" class="ml-3 font-medium text-gray-700">{{ text }}</span>
    </div>
  </template>
  
  <script setup lang="ts">
  defineProps({
    fullPage: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: '8', // Default to h-8 w-8 (32px)
      validator: (value: string) => ['4', '6', '8', '10', '12', '16'].includes(value)
    },
    color: {
      type: String,
      default: 'indigo', // Default to Tailwind's indigo color
      validator: (value: string) => [
        'indigo',
        'blue',
        'green',
        'red',
        'yellow',
        'purple',
        'pink'
      ].includes(value)
    },
    text: {
      type: String,
      default: ''
    }
  });
  </script>