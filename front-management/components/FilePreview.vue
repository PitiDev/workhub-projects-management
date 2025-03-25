<!-- components/FilePreview.vue -->
<template>
    <div class="h-36 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
      <!-- Image files -->
      <template v-if="isImage">
        <div class="relative w-full h-full flex items-center justify-center">
          <!-- Actual image -->
          <img 
            v-if="!imageError" 
            :src="thumbnailUrl" 
            alt="File preview"
            class="h-full w-full object-contain"
            @error="imageError = true" 
          />
          
          <!-- Fallback if image fails to load -->
          <div v-else class="flex flex-col items-center justify-center">
            <svg class="h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            <p class="text-xs text-gray-500 mt-2">Image preview unavailable</p>
          </div>
        </div>
      </template>
  
      <!-- PDF files -->
      <template v-else-if="isPdf">
        <svg class="h-16 w-16 text-red-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M7 11.5h10v1H7v-1zM7 8.5h10v1H7v-1zM7 14.5h7v1H7v-1z"/>
          <path d="M16 3.5H8v-1h8v1z"/>
          <path d="M19 3.5h-1v1h1v16H5v-16h1v-1H5c-.55 0-1 .45-1 1v16c0 .55.45 1 1 1h14c.55 0 1-.45 1-1v-16c0-.55-.45-1-1-1z"/>
          <path d="M15 5.5V1.5l4 4h-4z"/>
        </svg>
      </template>
  
      <!-- Folder -->
      <template v-else-if="isFolder">
        <svg class="h-16 w-16 text-yellow-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
        </svg>
      </template>
  
      <!-- Document files (e.g. word, text) -->
      <template v-else-if="isDocument">
        <svg class="h-16 w-16 text-blue-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6zm-1 5V3.5l4.5 4.5H13V7z"/>
          <path d="M14 14H7v-1h7v1zm3-2H7v-1h10v1zm0-2H7V9h10v1z"/>
        </svg>
      </template>
  
      <!-- Spreadsheet files -->
      <template v-else-if="isSpreadsheet">
        <svg class="h-16 w-16 text-green-500" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-1 16H6c-.55 0-1-.45-1-1V6c0-.55.45-1 1-1h12c.55 0 1 .45 1 1v12c0 .55-.45 1-1 1z"/>
          <path d="M7 7h4v4H7zm6 0h4v4h-4zm-6 6h4v4H7zm6 0h4v4h-4z"/>
        </svg>
      </template>
  
      <!-- Default file icon for other types -->
      <template v-else>
        <svg class="h-16 w-16 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8l-6-6z" />
          <path d="M14 3v5h5"/>
        </svg>
      </template>
    </div>
  </template>
  
  <script setup>
  import { ref, computed } from 'vue';
  
  const props = defineProps({
    file: {
      type: Object,
      required: true
    }
  });
  
  const imageError = ref(false);
  
  // Computed properties to determine file type
  const isImage = computed(() => props.file.mimeType.startsWith('image/'));
  const isPdf = computed(() => props.file.mimeType === 'application/pdf');
  const isFolder = computed(() => props.file.mimeType === 'application/vnd.google-apps.folder');
  const isDocument = computed(() => 
    props.file.mimeType === 'application/vnd.google-apps.document' || 
    props.file.mimeType === 'application/msword' ||
    props.file.mimeType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
    props.file.name.endsWith('.txt') ||
    props.file.name.endsWith('.doc') ||
    props.file.name.endsWith('.docx')
  );
  const isSpreadsheet = computed(() => 
    props.file.mimeType === 'application/vnd.google-apps.spreadsheet' ||
    props.file.mimeType === 'application/vnd.ms-excel' ||
    props.file.mimeType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
    props.file.name.endsWith('.xls') ||
    props.file.name.endsWith('.xlsx')
  );
  
  // Compute thumbnail URL
  const thumbnailUrl = computed(() => {
    if (props.file && props.file.id) {
      return `https://drive.google.com/thumbnail?id=${props.file.id}&sz=w320`;
    }
    return '';
  });
  </script>