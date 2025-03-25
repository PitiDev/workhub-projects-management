<template>
    <div class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white rounded-lg shadow-lg w-full max-w-md p-6" @click.stop>
        <h3 class="text-lg font-medium text-gray-900 mb-4">
          {{ isEdit ? 'Edit Status' : 'Create New Status' }}
        </h3>
        
        <form @submit.prevent="handleSubmit">
          <!-- Name field -->
          <div class="mb-4">
            <label for="name" class="block text-sm font-medium text-gray-700 mb-1">Status Name</label>
            <input
              id="name"
              v-model="formData.name"
              type="text"
              class="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              :class="{ 'border-red-500': errors.name }"
              placeholder="Enter status name"
              maxlength="50"
              required
            />
            <p v-if="errors.name" class="mt-1 text-sm text-red-600">{{ errors.name }}</p>
          </div>
          
          <!-- Color field -->
          <div class="mb-6">
            <label for="color" class="block text-sm font-medium text-gray-700 mb-1">Color</label>
            <div class="flex items-center gap-2">
              <input
                id="color"
                v-model="formData.color"
                type="text"
                class="flex-1 px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                :class="{ 'border-red-500': errors.color }"
                placeholder="#3B82F6"
                pattern="^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$"
              />
              <div 
                class="w-8 h-8 rounded border border-gray-300"
                :style="{ backgroundColor: isValidColor ? formData.color : '#CCCCCC' }"
              ></div>
              <button
                type="button"
                @click="toggleColorPicker"
                class="px-2 py-2 text-gray-600 hover:text-blue-600 rounded-md"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
                </svg>
              </button>
            </div>
            <div v-if="showColorPicker" class="mt-2 flex flex-wrap gap-2">
              <button
                v-for="color in predefinedColors"
                :key="color"
                type="button"
                class="w-6 h-6 rounded-md border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
                :style="{ backgroundColor: color }"
                @click="selectColor(color)"
              ></button>
            </div>
            <p v-if="errors.color" class="mt-1 text-sm text-red-600">{{ errors.color }}</p>
            <p class="mt-1 text-xs text-gray-500">Use hex format (e.g. #FF0000 for red)</p>
          </div>
          
          <!-- Action buttons -->
          <div class="flex justify-end space-x-3">
            <button
              type="button"
              class="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-gray-500"
              @click="$emit('close')"
            >
              Cancel
            </button>
            <button
              type="submit"
              class="px-4 py-2 text-sm font-medium text-white bg-blue-600 rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500"
              :disabled="loading"
            >
              <span v-if="loading" class="flex items-center">
                <span class="mr-2 h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                Saving...
              </span>
              <span v-else>{{ isEdit ? 'Update' : 'Create' }}</span>
            </button>
          </div>
        </form>
      </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, reactive, onMounted } from 'vue';
  import type { ProjectStatus } from '~/types/project';
  
  const props = defineProps<{
    status?: ProjectStatus | null;
    isEdit: boolean;
  }>();
  
  const emit = defineEmits<{
    close: [];
    save: [{ name: string; color?: string }];
  }>();
  
  const loading = ref(false);
  const formData = reactive({
    name: '',
    color: '#3B82F6' // Default blue color
  });
  
  interface FormErrors {
    name: string;
    color: string;
  }
  
  const errors = reactive<FormErrors>({
    name: '',
    color: ''
  });
  
  const showColorPicker = ref(false);
  const predefinedColors = [
    '#EF4444', // Red
    '#F97316', // Orange
    '#F59E0B', // Amber
    '#10B981', // Emerald
    '#06B6D4', // Cyan
    '#3B82F6', // Blue
    '#6366F1', // Indigo
    '#8B5CF6', // Violet
    '#EC4899', // Pink
    '#6B7280', // Gray
  ];
  
  const isValidColor = computed(() => {
    return /^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$/.test(formData.color);
  });
  
  // Initialize form data if editing
  onMounted(() => {
    if (props.isEdit && props.status) {
      formData.name = props.status.name || '';
      formData.color = props.status.color || '#3B82F6';
    }
  });
  
  const toggleColorPicker = () => {
    showColorPicker.value = !showColorPicker.value;
  };
  
  const selectColor = (color: string) => {
    formData.color = color;
    showColorPicker.value = false;
  };
  
  const validate = (): boolean => {
    let isValid = true;
    
    // Reset errors
    errors.name = '';
    errors.color = '';
    
    // Validate name
    if (!formData.name.trim()) {
      errors.name = 'Status name is required';
      isValid = false;
    } else if (formData.name.length > 50) {
      errors.name = 'Status name must be less than 50 characters';
      isValid = false;
    }
    
    // Validate color
    if (formData.color && !isValidColor.value) {
      errors.color = 'Color must be a valid hex color (e.g., #FFF or #FFFFFF)';
      isValid = false;
    }
    
    return isValid;
  };
  
  const handleSubmit = async () => {
    if (!validate()) return;
    
    loading.value = true;
    
    try {
      emit('save', {
        name: formData.name.trim(),
        color: formData.color
      });
    } catch (error) {
      console.error('Error saving status:', error);
    } finally {
      loading.value = false;
    }
  };
  </script>