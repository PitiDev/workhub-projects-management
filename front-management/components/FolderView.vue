<!-- components/FolderView.vue -->
<template>
    <div class="w-full h-full">
        <!-- Folder Representation -->
        <div 
            @click="openFolder" 
            class="cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-lg flex items-center transition-colors duration-200"
        >
            <div class="flex items-center space-x-3 w-full">
                <!-- Folder Icon -->
                <div class="flex-shrink-0">
                    <svg 
                        class="h-10 w-10 text-yellow-500" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 24 24" 
                        fill="currentColor"
                    >
                        <path 
                            d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v10a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" 
                        />
                    </svg>
                </div>

                <!-- Folder Details -->
                <div class="flex-1 min-w-0">
                    <p 
                        class="text-sm font-medium text-gray-900 dark:text-white truncate" 
                        :title="folderName"
                    >
                        {{ truncateFolderName(folderName) }}
                    </p>
                    <p class="text-xs text-gray-500 dark:text-gray-400">
                        {{ itemCount }} items
                    </p>
                </div>

                <!-- Navigation Indicator -->
                <div class="flex-shrink-0">
                    <svg 
                        class="h-5 w-5 text-gray-400 dark:text-gray-500" 
                        xmlns="http://www.w3.org/2000/svg" 
                        viewBox="0 0 20 20" 
                        fill="currentColor"
                    >
                        <path 
                            fill-rule="evenodd" 
                            d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" 
                            clip-rule="evenodd" 
                        />
                    </svg>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { defineProps, defineEmits } from 'vue'

// Props interface
interface FolderViewProps {
    folderId: string
    folderName: string
    itemCount?: number
}

// Component props
const props = withDefaults(defineProps<FolderViewProps>(), {
    itemCount: 0
})

// Emits
const emit = defineEmits(['open-folder'])

// Utility function to truncate folder name
const truncateFolderName = (name: string, maxLength = 25): string => {
    return name.length > maxLength 
        ? `${name.slice(0, maxLength)}...` 
        : name
}

// Method to open folder
const openFolder = () => {
    emit('open-folder', {
        folderId: props.folderId,
        folderName: props.folderName
    })
}
</script>