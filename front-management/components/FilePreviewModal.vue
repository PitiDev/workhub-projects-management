<!-- components/FilePreviewModal.vue -->
<template>
    <div v-if="show" class="fixed inset-0 z-50 overflow-y-auto" @click.self="closeModal">
      <div class="flex items-center justify-center min-h-screen px-4 pt-4 pb-20 text-center sm:block sm:p-0">
        <!-- Background overlay -->
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-900 opacity-75"></div>
        </div>
  
        <!-- Modal panel -->
        <div class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-4xl sm:w-full">
          <!-- Header -->
          <div class="bg-gray-100 dark:bg-gray-700 px-4 py-3 border-b border-gray-200 dark:border-gray-600 flex justify-between items-center">
            <h3 class="text-lg font-medium text-gray-900 dark:text-white truncate" :title="file?.name">
              {{ file?.name }}
            </h3>
            <button @click="closeModal" class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
              <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
  
          <!-- Content -->
          <div class="p-4">
            <!-- Loading state -->
            <div v-if="isLoading" class="flex justify-center items-center py-16">
              <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
              <span class="ml-3 text-gray-500 dark:text-gray-400">Loading preview...</span>
            </div>
  
            <!-- Error state -->
            <div v-else-if="error" class="flex flex-col items-center justify-center py-12">
              <svg class="h-16 w-16 text-red-500 mb-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
              <p class="text-lg text-red-600 dark:text-red-400 font-medium">{{ error }}</p>
              <p class="mt-2 text-gray-600 dark:text-gray-300">Preview not available for this file type</p>
            </div>
  
            <!-- Image Preview -->
            <div v-else-if="isImage" class="flex justify-center">
              <img :src="previewUrl" alt="File preview" class="max-h-[70vh] max-w-full object-contain" @error="handleImageError" />
            </div>
  
            <!-- PDF Preview -->
            <div v-else-if="isPdf" class="flex justify-center h-[70vh]">
              <iframe :src="previewUrl" class="w-full h-full" frameborder="0"></iframe>
            </div>
  
            <!-- Google Docs/Sheets/Slides Preview -->
            <div v-else-if="isGoogleDoc" class="flex justify-center h-[70vh]">
              <iframe :src="previewUrl" class="w-full h-full" frameborder="0"></iframe>
            </div>
  
            <!-- Text Preview -->
            <div v-else-if="isText && textContent" class="bg-white dark:bg-gray-900 p-4 rounded border border-gray-200 dark:border-gray-700 overflow-auto max-h-[70vh]">
              <pre class="text-sm text-gray-800 dark:text-gray-200 whitespace-pre-wrap">{{ textContent }}</pre>
            </div>
  
            <!-- Other file types -->
            <div v-else class="flex flex-col items-center justify-center py-12">
              <div class="mb-6">
                <!-- Document icon -->
                <svg v-if="isDocument" class="h-24 w-24 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 5V3.5l4.5 4.5H13V7z"/>
                  <path d="M14 14H7v-1h7v1zm3-2H7v-1h10v1zm0-2H7V9h10v1z"/>
                </svg>
                
                <!-- Spreadsheet icon -->
                <svg v-else-if="isSpreadsheet" class="h-24 w-24 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z"/>
                  <path d="M7 7h4v4H7zm6 0h4v4h-4zm-6 6h4v4H7zm6 0h4v4h-4z"/>
                </svg>
                
                <!-- Generic file icon -->
                <svg v-else class="h-24 w-24 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
                  <path d="M14 3v5h5"/>
                </svg>
              </div>
              
              <p class="text-lg text-gray-700 dark:text-gray-300 font-medium mb-4">
                Preview not available for this file type
              </p>
              
              <div class="space-y-3">
                <a v-if="file?.webViewLink" :href="file.webViewLink" target="_blank" class="inline-flex items-center px-4 py-2 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  Open in Google Drive
                </a>
                
                <a v-if="file?.webContentLink" :href="file.webContentLink" class="inline-flex items-center ml-5 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                  <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                  </svg>
                  Download
                </a>
              </div>
            </div>
          </div>
          
          <!-- Footer with file info -->
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 border-t border-gray-200 dark:border-gray-600">
            <div class="flex flex-wrap gap-4 justify-between items-center">
              <div class="text-sm text-gray-500 dark:text-gray-400">
                <p v-if="file?.size">Size: {{ formatFileSize(file.size) }}</p>
                <p v-if="file?.modifiedTime">Modified: {{ formatDate(file.modifiedTime) }}</p>
              </div>
              
              <div class="flex space-x-3">
                <a v-if="file?.webViewLink" :href="file.webViewLink" target="_blank" class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700">
                  Open in Drive
                </a>
                <a v-if="file?.webContentLink" :href="file.webContentLink" class="inline-flex items-center px-3 py-1.5 border border-transparent rounded-md text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-700">
                  Download
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </template>
  
  <script setup>
  import { ref, computed, watch, onMounted } from 'vue';
  
  const props = defineProps({
    show: {
      type: Boolean,
      default: false
    },
    file: {
      type: Object,
      default: null
    }
  });
  
  const emit = defineEmits(['close']);
  
  const isLoading = ref(false);
  const error = ref(null);
  const textContent = ref(null);
  
  // File type checks
  const isImage = computed(() => props.file?.mimeType?.startsWith('image/'));
  const isPdf = computed(() => props.file?.mimeType === 'application/pdf');
  const isDocument = computed(() => 
    props.file?.mimeType === 'application/vnd.google-apps.document' || 
    props.file?.mimeType === 'application/msword' ||
    props.file?.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    props.file?.name?.endsWith('.txt') ||
    props.file?.name?.endsWith('.doc') ||
    props.file?.name?.endsWith('.docx')
  );
  const isSpreadsheet = computed(() => 
    props.file?.mimeType === 'application/vnd.google-apps.spreadsheet' ||
    props.file?.mimeType === 'application/vnd.ms-excel' ||
    props.file?.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    props.file?.name?.endsWith('.xls') ||
    props.file?.name?.endsWith('.xlsx')
  );
  const isText = computed(() => 
    props.file?.mimeType === 'text/plain' || 
    props.file?.name?.endsWith('.txt') || 
    props.file?.name?.endsWith('.md') || 
    props.file?.name?.endsWith('.json') || 
    props.file?.name?.endsWith('.csv')
  );
  const isGoogleDoc = computed(() => 
    props.file?.mimeType === 'application/vnd.google-apps.document' || 
    props.file?.mimeType === 'application/vnd.google-apps.spreadsheet' || 
    props.file?.mimeType === 'application/vnd.google-apps.presentation'
  );
  
  // Generate preview URL based on file type
  const previewUrl = computed(() => {
    if (!props.file) return '';
    
    if (isImage.value) {
      return `https://drive.google.com/uc?export=view&id=${props.file.id}`;
    }
    
    if (isPdf.value) {
      return `https://drive.google.com/file/d/${props.file.id}/preview`;
    }
    
    if (isGoogleDoc.value) {
      // Google Docs, Sheets, Slides
      return `https://docs.google.com/viewer?embedded=true&url=https://drive.google.com/uc?export=download&id=${props.file.id}`;
    }
    
    return '';
  });
  
  // Load content when modal opens
  watch(() => props.show, async (newVal) => {
    if (newVal && props.file) {
      await loadFilePreview();
    } else {
      // Reset state when modal closes
      error.value = null;
      textContent.value = null;
    }
  });
  
  // When file changes and modal is open, reload content
  watch(() => props.file, async (newVal) => {
    if (props.show && newVal) {
      await loadFilePreview();
    }
  });
  
  // Load file preview
  async function loadFilePreview() {
    isLoading.value = true;
    error.value = null;
    textContent.value = null;
    
    try {
      // Handle text files by trying to load content
      if (isText.value && props.file.webContentLink) {
        try {
          const { $googleDrive } = useNuxtApp();
          if ($googleDrive.downloadFile) {
            const blob = await $googleDrive.downloadFile(props.file.id);
            textContent.value = await blob.text();
          } else {
            // Fallback method if downloadFile not available
            const response = await fetch(props.file.webContentLink);
            const text = await response.text();
            textContent.value = text;
          }
        } catch (err) {
          console.error('Error loading text content:', err);
          error.value = 'Failed to load text content';
        }
      }
      
      // For files that need external viewers
      if ((isDocument.value || isSpreadsheet.value) && !isGoogleDoc.value) {
        // These file types don't have direct preview without Google Docs
        error.value = 'Direct preview not available';
      }
    } catch (err) {
      console.error('Error loading file preview:', err);
      error.value = 'Failed to load preview';
    } finally {
      isLoading.value = false;
    }
  }
  
  function handleImageError() {
    error.value = 'Failed to load image';
  }
  
  function closeModal() {
    emit('close');
  }
  
  // Helper functions
  function formatFileSize(bytes) {
    if (!bytes) return 'Unknown size';
    
    const units = ['B', 'KB', 'MB', 'GB', 'TB'];
    let size = parseInt(bytes, 10);
    let unitIndex = 0;
    
    while (size >= 1024 && unitIndex < units.length - 1) {
      size /= 1024;
      unitIndex++;
    }
    
    return `${size.toFixed(size < 10 && unitIndex > 0 ? 1 : 0)} ${units[unitIndex]}`;
  }
  
  function formatDate(dateString) {
    if (!dateString) return 'Unknown date';
    
    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  </script>