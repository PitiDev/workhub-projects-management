<!-- components/ImagePreview.vue -->
<template>
    <div class="relative w-full h-full">
        <!-- Clickable Image Thumbnail -->
        <div 
            @click="openImagePreview" 
            class="cursor-pointer hover:opacity-80 transition-opacity duration-300 w-full h-full"
        >
            <img 
                :src="thumbnailUrl" 
                :alt="fileName" 
                class="w-full h-full object-cover rounded-lg"
                @error="handleThumbnailError"
            />
        </div>

        <!-- Full Image Preview Modal -->
        <div 
            v-if="isPreviewOpen" 
            class="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
            @click.self="closeImagePreview"
        >
            <div class="relative max-w-full max-h-full flex flex-col">
                <!-- Close Button -->
                <button 
                    @click="closeImagePreview" 
                    class="absolute -top-10 right-0 text-white hover:text-gray-300 transition-colors"
                >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-8 w-8" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>

                <!-- Image Preview -->
                <div class="flex items-center justify-center">
                    <div v-if="imageLoadError" class="text-white text-center">
                        <p class="mb-4">Unable to load image</p>
                        <div class="flex justify-center space-x-4">
                            <a 
                                v-if="webContentLink" 
                                :href="webContentLink" 
                                target="_blank" 
                                class="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
                            >
                                Open in Browser
                            </a>
                            <button 
                                @click="retryImageLoad" 
                                class="px-4 py-2 bg-gray-500 text-white rounded hover:bg-gray-600"
                            >
                                Retry
                            </button>
                        </div>
                    </div>
                    <img 
                        v-else
                        :src="fullImageUrl" 
                        :alt="fileName"
                        class="max-w-full max-h-[90vh] object-contain"
                        @error="handleFullImageError"
                    />
                </div>

                <!-- Image Info -->
                <div class="mt-4 text-center text-white">
                    <h3 class="text-lg font-semibold">{{ fileName }}</h3>
                    <p class="text-sm text-gray-300">
                        {{ formatFileDetails }}
                    </p>
                </div>
            </div>
        </div>
    </div>
</template>

<script setup lang="ts">
import { ref, computed } from 'vue'

// Props interface
interface ImagePreviewProps {
    fileId: string
    fileName: string
    fileSize?: number
    modifiedTime?: string
    mimeType?: string
    webContentLink?: string
}

// Component props
const props = defineProps<ImagePreviewProps>()

// State
const isPreviewOpen = ref(false)
const thumbnailLoadError = ref(false)
const imageLoadError = ref(false)

// Computed properties for image URLs
const thumbnailUrl = computed(() => {
    if (thumbnailLoadError.value && props.webContentLink) {
        return props.webContentLink
    }
    return `https://drive.google.com/thumbnail?id=${props.fileId}&sz=w320`
})

const fullImageUrl = computed(() => {
    if (imageLoadError.value && props.webContentLink) {
        return props.webContentLink
    }
    return `https://drive.google.com/thumbnail?id=${props.fileId}&sz=w1024`
})

// Methods
const openImagePreview = () => {
    isPreviewOpen.value = true
    resetErrorStates()
}

const closeImagePreview = () => {
    isPreviewOpen.value = false
    resetErrorStates()
}

const resetErrorStates = () => {
    thumbnailLoadError.value = false
    imageLoadError.value = false
}

// Handle thumbnail load error
const handleThumbnailError = () => {
    thumbnailLoadError.value = true
}

// Handle full image load error
const handleFullImageError = () => {
    imageLoadError.value = true
}

// Retry image loading
const retryImageLoad = () => {
    imageLoadError.value = false
}

// Expose webContentLink for direct browser access
const webContentLink = computed(() => props.webContentLink)

// Utility for formatting file details
const formatFileDetails = computed(() => {
    const details = []
    
    // Add file size if available
    if (props.fileSize) {
        details.push(formatFileSize(props.fileSize))
    }
    
    // Add modified date if available
    if (props.modifiedTime) {
        details.push(formatDate(props.modifiedTime))
    }

    return details.join(' • ')
})

// Utility function to format file size
const formatFileSize = (bytes: number): string => {
    const units = ['B', 'KB', 'MB', 'GB', 'TB']
    let size = bytes
    let unitIndex = 0

    while (size >= 1024 && unitIndex < units.length - 1) {
        size /= 1024
        unitIndex++
    }

    return `${size.toFixed(2)} ${units[unitIndex]}`
}

// Utility function to format date
const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    })
}
</script>