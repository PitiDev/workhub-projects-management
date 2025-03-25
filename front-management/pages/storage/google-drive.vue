<!-- pages/google-drive.vue -->
<template>
    <div class="container mx-auto px-4 py-8">
        <h1 class="text-2xl font-bold text-gray-900 dark:text-white mb-6">Google Drive Integration</h1>

        <div v-if="error" class="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
            {{ error }}
        </div>

        <!-- Authentication section -->
        <div
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md p-6 border border-gray-100 dark:border-gray-700 mb-8">
            <div class="flex flex-col md:flex-row justify-between items-start md:items-center">
                <div>
                    <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-2">Google Drive Connection</h2>
                    <p v-if="!isSignedIn" class="text-gray-500 dark:text-gray-400">
                        Connect your Google Drive account to manage documents
                    </p>
                    <div v-else class="flex items-center mt-2">
                        <div v-if="user?.picture" class="h-10 w-10 rounded-full overflow-hidden mr-3">
                            <img :src="user.picture" alt="User" class="h-full w-full object-cover" />
                        </div>
                        <div>
                            <p class="font-medium text-gray-900 dark:text-white">{{ user?.name }}</p>
                            <p class="text-sm text-gray-500 dark:text-gray-400">{{ user?.email }}</p>
                        </div>
                    </div>
                </div>

                <div class="mt-4 md:mt-0">
                    <!-- Sign-in button container - will be rendered by Google -->
                    <div v-if="!isSignedIn" id="google-signin-button" class="mt-2"></div>

                    <!-- Sign-out button -->
                    <button v-if="isSignedIn" @click="signOut"
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md shadow-sm text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Sign Out
                    </button>

                    <button v-if="isSignedIn && !hasDrivePermissions" @click="requestDrivePermissions"
                        class="ml-2 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Grant Drive Access
                    </button>

                </div>
            </div>
        </div>

        <!-- Files section - only shown when signed in -->
        <div v-if="isSignedIn"
            class="bg-white dark:bg-gray-800 rounded-xl shadow-md border border-gray-100 dark:border-gray-700">
            <div
                class="p-6 border-b border-gray-200 dark:border-gray-700 flex flex-col md:flex-row justify-between md:items-center">
                <h2 class="text-lg font-semibold text-gray-900 dark:text-white mb-4 md:mb-0">My Files</h2>

                <div class="flex items-center space-x-3">
                    <div class="relative">
                        <input type="text" v-model="searchQuery" placeholder="Search files..."
                            class="w-full px-10 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
                        <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                            <svg class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z"
                                    clip-rule="evenodd" />
                            </svg>
                        </div>
                    </div>

                    <button @click="showUploadModal = true"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path fill-rule="evenodd"
                                d="M3 17a1 1 0 011-1h12a1 1 0 110 2H4a1 1 0 01-1-1zM6.293 6.707a1 1 0 010-1.414l3-3a1 1 0 011.414 0l3 3a1 1 0 01-1.414 1.414L11 5.414V13a1 1 0 11-2 0V5.414L7.707 6.707a1 1 0 01-1.414 0z"
                                clip-rule="evenodd" />
                        </svg>
                        Upload File
                    </button>

                    <button @click="showCreateFolderModal = true"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        <svg class="h-4 w-4 mr-2" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                            fill="currentColor">
                            <path d="M2 6a2 2 0 012-2h5l2 2h5a2 2 0 012 2v6a2 2 0 01-2 2H4a2 2 0 01-2-2V6z" />
                            <path fill-rule="evenodd"
                                d="M10 5a1 1 0 011 1v3h3a1 1 0 110 2h-3v3a1 1 0 11-2 0v-3H6a1 1 0 110-2h3V6a1 1 0 011-1z"
                                clip-rule="evenodd" />
                        </svg>
                        New Folder
                    </button>
                </div>
            </div>

            <!-- Breadcrumb Navigation -->
            <div v-if="currentPath.length > 0" class="px-6 pt-4 flex items-center flex-wrap text-sm">
                <button @click="navigateToRoot"
                    class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                    Root
                </button>
                <span class="mx-2 text-gray-400">/</span>

                <template v-for="(folder, index) in currentPath" :key="folder.id">
                    <button v-if="index < currentPath.length - 1" @click="navigateToFolder(index)"
                        class="text-indigo-600 dark:text-indigo-400 hover:text-indigo-800 dark:hover:text-indigo-300">
                        {{ folder.name }}
                    </button>
                    <span v-else class="text-gray-700 dark:text-gray-300">
                        {{ folder.name }}
                    </span>
                    <span v-if="index < currentPath.length - 1" class="mx-2 text-gray-400">/</span>
                </template>
            </div>

            <!-- Loading state -->
            <div v-if="isLoading" class="flex justify-center items-center py-20">
                <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-indigo-500"></div>
                <span class="ml-3 text-gray-500 dark:text-gray-400">Loading files...</span>
            </div>

            <!-- Empty state -->
            <div v-else-if="filteredFiles.length === 0 && folders.length === 0"
                class="flex flex-col items-center justify-center py-16">
                <svg class="h-16 w-16 text-gray-300 dark:text-gray-600" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                        d="M9 13h6m-3-3v6m-9 1V7a2 2 0 012-2h6l2 2h6a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                </svg>
                <p class="mt-3 text-gray-500 dark:text-gray-400">No files found</p>
                <div class="mt-6 flex space-x-3">
                    <button @click="showUploadModal = true"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        Upload File
                    </button>
                    <button @click="showCreateFolderModal = true"
                        class="inline-flex items-center px-4 py-2 border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-800 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500">
                        New Folder
                    </button>
                </div>
            </div>

            <!-- Files grid -->
            <div v-else class="p-6">
                <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">

                    <!-- Folders first -->
                    <div v-for="folder in folders" :key="folder.id"
                        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200 cursor-pointer"
                        @click="handleFolderClick(folder)">

                        <!-- Folder icon -->
                        <div class="h-36 bg-gray-100 dark:bg-gray-700 flex items-center justify-center">
                            <svg class="h-16 w-16 text-yellow-500" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24" fill="currentColor">
                                <path
                                    d="M10 4H4c-1.1 0-1.99.9-1.99 2L2 18c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V8c0-1.1-.9-2-2-2h-8l-2-2z" />
                            </svg>
                        </div>

                        <!-- Folder info -->
                        <div class="p-4">
                            <div class="flex justify-between items-start">
                                <div class="flex-1 pr-2">
                                    <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate"
                                        :title="folder.name">
                                        {{ truncateFileName(folder.name) }}
                                    </h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {{ formatDate(folder.modifiedTime) }}
                                    </p>
                                </div>

                                <!-- Action menu -->
                                <div class="relative" @click.stop="">
                                    <button @click.stop="toggleFileMenu(folder.id)"
                                        class="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>

                                    <!-- Dropdown Menu -->
                                    <div v-if="activeFileMenu === folder.id"
                                        class="absolute bottom-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <div class="py-1">
                                            <button @click.stop="confirmDeleteFile(folder)"
                                                class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Delete Folder
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    <!-- Files with the FilePreview component -->
                    <div v-for="file in filteredFiles" :key="file.id"
                        class="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-md transition-shadow duration-200"
                        @click="openFilePreview(file)">

                        <!-- Use the FilePreview component -->
                        <FilePreview :file="file" />


                        <!-- File info -->
                        <div class="p-4">
                            <div class="flex justify-between items-start">
                                <div class="flex-1 pr-2">
                                    <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate"
                                        :title="file.name">
                                        {{ truncateFileName(file.name) }}
                                    </h3>
                                    <p class="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                        {{ formatDate(file.modifiedTime) }}
                                    </p>
                                </div>

                                <!-- Action menu -->
                                <div class="relative">
                                    <button @click="toggleFileMenu(file.id)"
                                        class="p-1 rounded-full text-gray-400 hover:text-gray-500 dark:hover:text-gray-300 focus:outline-none">
                                        <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20"
                                            fill="currentColor">
                                            <path
                                                d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                                        </svg>
                                    </button>

                                    <!-- Dropdown Menu -->
                                    <div v-if="activeFileMenu === file.id"
                                        class="absolute bottom-full right-0 mt-1 w-48 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg shadow-lg z-10">
                                        <div class="py-1">
                                            <a v-if="file.webViewLink" :href="file.webViewLink" target="_blank"
                                                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Open in Drive
                                            </a>
                                            <a v-if="file.webContentLink" :href="file.webContentLink"
                                                class="block px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Download
                                            </a>
                                            <button @click.stop="confirmDeleteFile(file)"
                                                class="block w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700">
                                                Delete
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <!-- Upload Modal -->
        <div v-if="showUploadModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Upload File</h3>
                    <button @click="showUploadModal = false"
                        class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mb-4">
                    <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        File
                    </label>
                    <div class="mt-1 flex justify-center px-6 pt-5 pb-6 border-2 border-gray-300 dark:border-gray-600 border-dashed rounded-md"
                        @dragover.prevent="dragOver = true" @dragleave.prevent="dragOver = false"
                        @drop.prevent="onFileDrop"
                        :class="{ 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20': dragOver }">
                        <div class="space-y-1 text-center">
                            <svg v-if="!selectedFile" class="mx-auto h-12 w-12 text-gray-400"
                                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                                stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                    d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                            </svg>
                            <div v-if="selectedFile" class="flex items-center justify-center">
                                <svg class="h-5 w-5 text-green-500 mr-2" xmlns="http://www.w3.org/2000/svg"
                                    viewBox="0 0 20 20" fill="currentColor">
                                    <path fill-rule="evenodd"
                                        d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                                        clip-rule="evenodd" />
                                </svg>
                                <span class="text-sm text-gray-900 dark:text-gray-100">{{ selectedFile.name }}</span>
                            </div>
                            <div v-else class="flex text-sm text-gray-600 dark:text-gray-400">
                                <label for="file-upload"
                                    class="relative cursor-pointer rounded-md font-medium text-indigo-600 hover:text-indigo-500 dark:text-indigo-400 dark:hover:text-indigo-300">
                                    <span>Upload a file</span>
                                    <input id="file-upload" name="file-upload" type="file" class="sr-only"
                                        @change="onFileSelect">
                                </label>
                                <p class="pl-1">or drag and drop</p>
                            </div>
                            <p v-if="!selectedFile" class="text-xs text-gray-500">
                                PDF, Word, Excel, images up to 10MB
                            </p>
                        </div>
                    </div>
                </div>

                <div v-if="uploadProgress > 0" class="mb-4">
                    <div class="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2.5">
                        <div class="bg-blue-600 h-2.5 rounded-full" :style="{ width: `${uploadProgress}%` }"></div>
                    </div>
                    <p class="text-xs text-right mt-1 text-gray-500 dark:text-gray-400">{{ uploadProgress }}%</p>
                </div>

                <div class="flex justify-end space-x-3">
                    <button @click="showUploadModal = false"
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Cancel
                    </button>
                    <button @click="uploadFile" :disabled="!selectedFile || isUploading"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        <svg v-if="isUploading" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ isUploading ? 'Uploading...' : 'Upload' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Create Folder Modal -->
        <div v-if="showCreateFolderModal"
            class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Create New Folder</h3>
                    <button @click="showCreateFolderModal = false"
                        class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mb-4">
                    <label for="folder-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                        Folder Name
                    </label>
                    <input id="folder-name" v-model="newFolderName" type="text"
                        class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 dark:bg-gray-700 dark:text-white"
                        placeholder="Enter folder name" />
                </div>

                <div class="flex justify-end space-x-3">
                    <button @click="showCreateFolderModal = false"
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Cancel
                    </button>
                    <button @click="createFolder" :disabled="!newFolderName || isCreatingFolder"
                        class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50">
                        <svg v-if="isCreatingFolder" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ isCreatingFolder ? 'Creating...' : 'Create' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- Delete Confirmation Modal -->
        <div v-if="showDeleteModal" class="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div class="bg-white dark:bg-gray-800 rounded-lg p-6 max-w-md w-full">
                <div class="flex justify-between items-center mb-4">
                    <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete File</h3>
                    <button @click="showDeleteModal = false"
                        class="text-gray-400 hover:text-gray-500 dark:hover:text-gray-300">
                        <svg class="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                            stroke="currentColor">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                                d="M6 18L18 6M6 6l12 12" />
                        </svg>
                    </button>
                </div>

                <div class="mb-6">
                    <div class="bg-red-50 dark:bg-red-900/20 rounded-lg p-4 mb-4">
                        <div class="flex">
                            <svg class="h-5 w-5 text-red-500 mr-2" xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 20 20" fill="currentColor">
                                <path fill-rule="evenodd"
                                    d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z"
                                    clip-rule="evenodd" />
                            </svg>
                            <p class="text-sm text-red-700 dark:text-red-400">
                                Are you sure you want to delete <span class="font-semibold">{{ fileToDelete?.name
                                }}</span>?
                                This action cannot be undone.
                            </p>
                        </div>
                    </div>
                </div>

                <div class="flex justify-end space-x-3">
                    <button @click="showDeleteModal = false"
                        class="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
                        Cancel
                    </button>
                    <button @click="deleteFile" :disabled="isDeleting"
                        class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 disabled:opacity-50">
                        <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white inline-block"
                            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4">
                            </circle>
                            <path class="opacity-75" fill="currentColor"
                                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                            </path>
                        </svg>
                        {{ isDeleting ? 'Deleting...' : 'Delete' }}
                    </button>
                </div>
            </div>
        </div>

        <!-- File Preview Modal -->
        <FilePreviewModal :show="showFilePreviewModal" :file="selectedPreviewFile"
            @close="showFilePreviewModal = false" />

    </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, onBeforeUnmount, watch } from 'vue';
import type { GoogleUser } from '~/services/googleAuthService';
import ImagePreview from '~/components/ImagePreviewModal.vue';
import PdfPreview from '~/components/PdfPreview.vue';
import FilePreview from '~/components/FilePreview.vue';
import FilePreviewModal from '~/components/FilePreviewModal.vue';

definePageMeta({
    layout: 'dashboard',
});

// Get services from plugin
const { $googleAuth, $googleDrive, $initGoogleServices } = useNuxtApp();

// State
const isSignedIn = ref(false);
const isLoading = ref(false);
const error = ref<string | null>(null);
const user = ref<GoogleUser | null>(null);
const files = ref<any[]>([]);
const searchQuery = ref('');
const activeFileMenu = ref<string | null>(null);

// Upload state
const showUploadModal = ref(false);
const selectedFile = ref<File | null>(null);
const uploadProgress = ref(0);
const isUploading = ref(false);
const dragOver = ref(false);

// Add these to your existing ref variables
const showFilePreviewModal = ref(false);
const selectedPreviewFile = ref(null);

// Folder creation state
const showCreateFolderModal = ref(false);
const newFolderName = ref('');
const isCreatingFolder = ref(false);

// Delete state
const showDeleteModal = ref(false);
const fileToDelete = ref<any | null>(null);
const isDeleting = ref(false);

const hasDrivePermissions = ref(false);

// Folder navigation state
const folders = ref<any[]>([]);
const currentPath = ref<Array<{ id: string, name: string }>>([]);

// Handler for folder clicks
const handleFolderClick = (folder) => {
    console.log('Folder clicked:', folder);
    handleFolderOpen({
        folderId: folder.id,
        folderName: folder.name
    });
};

const openFilePreview = (file) => {
    selectedPreviewFile.value = file;
    showFilePreviewModal.value = true;
};

// Folder navigation methods
const handleFolderOpen = async (folder) => {
    try {
        console.log('Opening folder:', folder);

        // Add current folder to path
        currentPath.value.push({
            id: folder.folderId,
            name: folder.folderName
        });

        // Fetch contents of the opened folder
        await fetchFolderContents(folder.folderId);
    } catch (error) {
        console.error('Error opening folder:', error);
    }
};

const navigateBack = async () => {
    if (currentPath.value.length > 0) {
        // Remove last path item
        currentPath.value.pop();

        // Fetch parent folder contents
        const parentFolderId = currentPath.value.length > 0
            ? currentPath.value[currentPath.value.length - 1].id
            : null;

        await fetchFolderContents(parentFolderId);
    }
};

const navigateToRoot = async () => {
    // Clear path and fetch root contents
    currentPath.value = [];
    await fetchFolderContents(null);
};

const navigateToFolder = async (index) => {
    // Trim path to selected folder
    currentPath.value = currentPath.value.slice(0, index + 1);

    const targetFolderId = currentPath.value[index].id;
    await fetchFolderContents(targetFolderId);
};

// Fetch folder contents - using listFiles with a query instead of a separate method
const fetchFolderContents = async (folderId) => {
    try {
        console.log('Fetching contents for folder ID:', folderId);
        isLoading.value = true;
        error.value = null;

        // Build query to get folder contents
        let query = "trashed=false";

        if (folderId === null) {
            // List files in root if no folder ID provided
            query += " and 'root' in parents";
        } else {
            // List files in the specified folder
            query += ` and '${folderId}' in parents`;
        }

        // Use the existing listFiles method with our custom query
        const allItems = await $googleDrive.listFiles({
            query: query
        });

        // Separate folders from files
        folders.value = allItems.filter(item =>
            item.mimeType === 'application/vnd.google-apps.folder'
        ) || [];

        files.value = allItems.filter(item =>
            item.mimeType !== 'application/vnd.google-apps.folder'
        ) || [];

        console.log('Folders:', folders.value.length, 'Files:', files.value.length);
    } catch (error) {
        console.error('Error fetching folder contents:', error);
        error.value = 'Failed to fetch folder contents. Please try again.';
    } finally {
        isLoading.value = false;
    }
};

// Computed
const filteredFiles = computed(() => {
    if (!searchQuery.value) return files.value;

    const query = searchQuery.value.toLowerCase();
    return files.value.filter(file => file.name.toLowerCase().includes(query));
});

const requestDrivePermissions = async () => {
    try {
        await $googleAuth.requestDriveScopes();
        hasDrivePermissions.value = true;
        await fetchFiles();
    } catch (err) {
        console.error('Error requesting Drive permissions:', err);
        error.value = 'Failed to get Drive permissions. Please try again.';
    }
};

// Utility function to truncate file name
const truncateFileName = (fileName, maxLength = 20) => {
    if (!fileName || fileName.length <= maxLength) {
        return fileName || '';
    }

    // Find the file extension
    const extensionIndex = fileName.lastIndexOf('.');
    const extension = extensionIndex !== -1 ? fileName.slice(extensionIndex) : '';

    // Truncate the name part
    const nameWithoutExtension = extensionIndex !== -1
        ? fileName.slice(0, extensionIndex)
        : fileName;

    // Calculate remaining length for name
    const remainingLength = maxLength - extension.length - 3; // 3 for '...'

    // Truncate and reconstruct
    return `${nameWithoutExtension.slice(0, remainingLength)}...${extension}`;
};

// Initialize on mount
onMounted(async () => {
    try {
        // Initialize Google services
        await $initGoogleServices();

        // Set initial state
        isSignedIn.value = $googleAuth.isSignedIn.value;
        user.value = $googleAuth.user.value;

        // Render Google Sign-In button if not signed in
        if (!isSignedIn.value) {
            $googleAuth.renderSignInButton('google-signin-button', async (user) => {
                isSignedIn.value = true;
                await fetchFolderContents(null);
            });
        } else {
            // If already signed in, fetch files
            await fetchFolderContents(null);
        }

        // Watch for sign-in state changes
        const unwatch = watch(() => $googleAuth.isSignedIn.value, async (newValue) => {
            isSignedIn.value = newValue;
            user.value = $googleAuth.user.value;

            if (newValue) {
                await fetchFolderContents(null);
            } else {
                files.value = [];
                folders.value = [];
                currentPath.value = [];
            }
        });

        // Handle click outside file menus
        document.addEventListener('click', handleClickOutside);

        // Cleanup
        onBeforeUnmount(() => {
            document.removeEventListener('click', handleClickOutside);
            unwatch();
        });
    } catch (err) {
        console.error('Error initializing Google Drive page:', err);
        error.value = err.message || 'Failed to initialize Google Drive integration';
    }
});

// Methods
const fetchFiles = async () => {
    if (!isSignedIn.value) return;

    try {
        isLoading.value = true;
        error.value = null;

        try {
            const filesList = await $googleDrive.listFiles();
            files.value = filesList;
            hasDrivePermissions.value = true;
        } catch (err) {
            console.error('Error fetching files:', err);

            // Check if this is a permissions issue
            if (err.message && (
                err.message.includes('permission') ||
                err.message.includes('access token') ||
                err.message.includes('popup')
            )) {
                hasDrivePermissions.value = false;
                error.value = 'Google Drive access not granted. Please click "Grant Drive Access" button.';
            } else {
                error.value = err.message || 'Failed to fetch files';
            }
        }
    } finally {
        isLoading.value = false;
    }
};

const signOut = async () => {
    try {
        await $googleAuth.signOut();
        isSignedIn.value = false;
        user.value = null;
        files.value = [];
        folders.value = [];
        currentPath.value = [];
        navigateTo('/');
    } catch (err) {
        console.error('Error signing out:', err);
        error.value = err.message || 'Failed to sign out';
    }
};

const onFileSelect = (event) => {
    const input = event.target as HTMLInputElement;
    if (input.files && input.files.length > 0) {
        selectedFile.value = input.files[0];
    }
};

const onFileDrop = (event) => {
    dragOver.value = false;
    if (event.dataTransfer?.files && event.dataTransfer.files.length > 0) {
        selectedFile.value = event.dataTransfer.files[0];
    }
};

const uploadFile = async () => {
    if (!selectedFile.value) return;

    try {
        isUploading.value = true;
        uploadProgress.value = 0;

        // Get the current folder ID from the path (or null for root)
        const currentFolderId = currentPath.value.length > 0
            ? currentPath.value[currentPath.value.length - 1].id
            : null;

        // Upload file to the current folder
        await $googleDrive.uploadFile(selectedFile.value, {
            folderId: currentFolderId,
            onProgress: (progress) => {
                uploadProgress.value = progress;
            }
        });

        // Reset state
        selectedFile.value = null;
        showUploadModal.value = false;

        // Refresh the current folder contents
        await fetchFolderContents(currentFolderId);
    } catch (err) {
        console.error('Error uploading file:', err);
        error.value = err.message || 'Failed to upload file';
    } finally {
        isUploading.value = false;
    }
};

const createFolder = async () => {
    if (!newFolderName.value) return;

    try {
        isCreatingFolder.value = true;

        // Get the current folder ID from the path (or null for root)
        const currentFolderId = currentPath.value.length > 0
            ? currentPath.value[currentPath.value.length - 1].id
            : null;

        // Create folder in the current location
        await $googleDrive.createFolder(newFolderName.value, currentFolderId);

        // Reset state
        newFolderName.value = '';
        showCreateFolderModal.value = false;

        // Refresh the current folder contents
        await fetchFolderContents(currentFolderId);
    } catch (err) {
        console.error('Error creating folder:', err);
        error.value = err.message || 'Failed to create folder';
    } finally {
        isCreatingFolder.value = false;
    }
};

const toggleFileMenu = (fileId) => {
    if (activeFileMenu.value === fileId) {
        activeFileMenu.value = null;
    } else {
        activeFileMenu.value = fileId;
    }
};

const handleClickOutside = (event) => {
    if (activeFileMenu.value && !(event.target as Element).closest('.relative')) {
        activeFileMenu.value = null;
    }
};

const confirmDeleteFile = (file) => {
    fileToDelete.value = file;
    showDeleteModal.value = true;
    activeFileMenu.value = null;
};

const deleteFile = async () => {
    if (!fileToDelete.value) return;

    try {
        isDeleting.value = true;

        await $googleDrive.deleteFile(fileToDelete.value.id);

        // Reset state
        showDeleteModal.value = false;
        fileToDelete.value = null;

        // Get the current folder ID from the path (or null for root)
        const currentFolderId = currentPath.value.length > 0
            ? currentPath.value[currentPath.value.length - 1].id
            : null;

        // Refresh the current folder contents
        await fetchFolderContents(currentFolderId);
    } catch (err) {
        console.error('Error deleting file:', err);
        error.value = err.message || 'Failed to delete file';
    } finally {
        isDeleting.value = false;
    }
};

// Helper functions
const formatDate = (dateString) => {
    if (!dateString) return 'Unknown date';

    const date = new Date(dateString);
    return date.toLocaleDateString(undefined, {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
    });
};
</script>