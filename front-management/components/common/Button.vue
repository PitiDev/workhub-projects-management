<!-- components/common/Button.vue -->
<template>
    <button
      :type="type"
      :class="[
        'inline-flex items-center justify-center rounded-md transition-colors focus:outline-none',
        sizeClasses[size],
        variantClasses[variant],
        block ? 'w-full' : '',
        rounded ? 'rounded-full' : '',
        disabled || loading ? 'opacity-60 cursor-not-allowed' : ''
      ]"
      :disabled="disabled || loading"
      @click="$emit('click', $event)"
    >
      <!-- Loading spinner -->
      <svg
        v-if="loading"
        class="animate-spin -ml-1 mr-2 h-4 w-4"
        :class="{ 'text-white': ['primary', 'success', 'danger', 'warning', 'info'].includes(variant), 'text-indigo-600': variant === 'outline' }"
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
      >
        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
      </svg>
      
      <!-- Left icon -->
      <component 
        v-if="iconLeft && !loading" 
        :is="iconLeft" 
        :class="[
          iconSizeClasses[size],
          { 'mr-2': $slots.default }
        ]"
      />
      
      <!-- Button text -->
      <slot></slot>
      
      <!-- Right icon -->
      <component 
        v-if="iconRight" 
        :is="iconRight" 
        :class="[
          iconSizeClasses[size],
          { 'ml-2': $slots.default }
        ]"
      />
    </button>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  const props = defineProps({
    variant: {
      type: String,
      default: 'primary',
      validator: (value: string) => [
        'primary',
        'secondary',
        'success',
        'danger',
        'warning',
        'info',
        'outline',
        'ghost',
        'link'
      ].includes(value)
    },
    size: {
      type: String,
      default: 'md',
      validator: (value: string) => ['xs', 'sm', 'md', 'lg', 'xl'].includes(value)
    },
    type: {
      type: String,
      default: 'button',
      validator: (value: string) => ['button', 'submit', 'reset'].includes(value)
    },
    disabled: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    rounded: {
      type: Boolean,
      default: false
    },
    iconLeft: {
      type: [Object, Function],
      default: null
    },
    iconRight: {
      type: [Object, Function],
      default: null
    }
  });
  
  defineEmits(['click']);
  
  // Variant classes
  const variantClasses = {
    primary: 'bg-indigo-600 hover:bg-indigo-700 text-white border border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    secondary: 'bg-gray-200 hover:bg-gray-300 text-gray-800 border border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-gray-400',
    success: 'bg-green-600 hover:bg-green-700 text-white border border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-green-500',
    danger: 'bg-red-600 hover:bg-red-700 text-white border border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-red-500',
    warning: 'bg-yellow-500 hover:bg-yellow-600 text-white border border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-yellow-400',
    info: 'bg-blue-500 hover:bg-blue-600 text-white border border-transparent focus:ring-2 focus:ring-offset-2 focus:ring-blue-400',
    outline: 'bg-white hover:bg-gray-50 text-indigo-600 border border-indigo-600 focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500',
    ghost: 'bg-transparent hover:bg-gray-100 text-gray-700 border border-transparent',
    link: 'bg-transparent hover:underline text-indigo-600 border-0 shadow-none'
  };
  
  // Size classes
  const sizeClasses = {
    xs: 'text-xs px-2.5 py-1.5',
    sm: 'text-sm px-3 py-2',
    md: 'text-sm px-4 py-2',
    lg: 'text-base px-5 py-2.5',
    xl: 'text-lg px-6 py-3'
  };
  
  // Icon size classes
  const iconSizeClasses = {
    xs: 'h-3.5 w-3.5',
    sm: 'h-4 w-4',
    md: 'h-4 w-4',
    lg: 'h-5 w-5',
    xl: 'h-6 w-6'
  };
  </script>