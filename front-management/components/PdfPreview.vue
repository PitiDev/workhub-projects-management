<!-- components/PdfPreview.vue -->
<template>
    <div class="relative w-full h-full">
        <!-- PDF Thumbnail -->
        <div @click="openPdfViewer"
            class="cursor-pointer hover:opacity-80 transition-opacity duration-300 w-full h-full flex items-center justify-center">
            <div class="flex flex-col items-center">
                <svg class="h-12 w-12 text-red-500 mb-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"
                    fill="currentColor">
                    <path d="M12 16H8V8h4v8zm2 0V8h4v8h-4z" />
                </svg>
                <span class="text-xs text-gray-600 dark:text-gray-300 truncate max-w-full">
                    {{ truncatedFileName }}
                </span>
            </div>
        </div>

        <!-- PDF Viewer Modal -->
        <div v-if="isPdfViewerOpen"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
            @click.self="closePdfViewer">
            <div class="bg-white dark:bg-gray-800 rounded-lg max-w-4xl w-full max-h-[90vh] flex flex-col">
                <!-- Header -->
                <div class="flex justify-between items-center p-4 border-b border-gray-200 dark:border-gray-700">
                    <!-- File Name -->
                    <div className="flex-grow mr-4 overflow-hidden">
                        <h2 className="text-lg font-semibold text-gray-900 dark:text-white truncate">{{ fileName }}</h2>
                        <p className="text-sm text-gray-500 dark:text-gray-400">{{ formattedFileSize }} • {{
                            modifiedDate }}</p>
                    </div>

                    <!-- Action Buttons -->
                    <div className="flex items-center space-x-2">
                        <!-- Download Button -->
                        <a v-if="webContentLink" :href="webContentLink" target="_blank"
                            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
                            title="Download PDF">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4" />
                            </svg>
                        </a>

                        <!-- Close Button -->
                        <button @click="closePdfViewer"
                            className="text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700 p-2 rounded-full transition-colors"
                            title="Close PDF">
                            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M6 18L18 6M6 6l12 12" />
                            </svg>
                        </button>
                    </div>
                </div>

                <!-- PDF Viewer Content -->
                <div className="flex-grow overflow-hidden">
                    <!-- Error Handling -->
                    <div v-if="loadError" className="h-full flex flex-col items-center justify-center space-y-4 p-4">
                        <svg xmlns="http://www.w3.org/2000/svg" className="h-12 w-12 text-red-500" fill="none"
                            viewBox="0 0 24 24" stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                        </svg>
                        <p className="text-lg text-gray-900 dark:text-white">Unable to load PDF</p>
                        <div className="flex space-x-4">
                            <a v-if="webContentLink" :href="webContentLink" target="_blank"
                                className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors">
                                Open in Browser
                            </a>
                            <button @click="retryLoad"
                                className="px-4 py-2 bg-gray-600 text-white rounded hover:bg-gray-700 transition-colors">
                                Retry
                            </button>
                        </div>
                    </div>

                    <!-- PDF Iframe -->
                    <iframe v-else :src="pdfUrl" className="w-full h-[calc(90vh-100px)] object-contain" frameborder="0"
                        @error="handleLoadError"></iframe>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props interface
interface PdfPreviewProps {
    fileId: string
    fileName: string
    fileSize?: number
    modifiedTime?: string
    webContentLink?: string
}

// Component props
const props = defineProps<PdfPreviewProps>()

// State
const isPdfViewerOpen = ref(false)
const loadError = ref(false)

// Computed properties
const pdfUrl = computed(() => {
    if (loadError.value && props.webContentLink) {
        return props.webContentLink
    }
    return `https://drive.google.com/file/d/${props.fileId}/preview`
})

const truncatedFileName = computed(() => {
    const maxLength = 15
    return props.fileName.length > maxLength
        ? `${props.fileName.slice(0, maxLength)}...`
        : props.fileName
})

// Formatted file details
const formattedFileSize = computed(() => {
    if (!props.fileSize) return 'Unknown size'

    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = props.fileSize
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
})

const modifiedDate = computed(() => {
    if (!props.modifiedTime) return 'Unknown date'

    return new Date(props.modifiedTime).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
})

// Methods
const openPdfViewer = () => {
    isPdfViewerOpen.value = true
    loadError.value = false
}

const closePdfViewer = () => {
    isPdfViewerOpen.value = false
    loadError.value = false
}

// Error handling methods
const handleLoadError = () => {
    loadError.value = true
}

const retryLoad = () => {
    loadError.value = false
}
</script>