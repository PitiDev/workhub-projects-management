<!-- pages/notes/[id].vue -->
<template>
  <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
    <!-- Main Content -->
    <div class="flex-1 flex flex-col overflow-hidden">
      <!-- Topbar -->
      <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <div class="flex items-center justify-between h-16 px-4">
          <div class="flex items-center">
            <button @click="navigateToNotes"
              class="mr-3 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z"
                  clip-rule="evenodd" />
              </svg>
            </button>
            <input v-if="note" type="text" v-model="note.title" @blur="saveNote" placeholder="Untitled"
              class="text-lg font-medium text-gray-900 dark:text-white bg-transparent border-0 focus:ring-0 focus:outline-none max-w-lg" />
            <h1 v-else class="text-lg font-medium text-gray-900 dark:text-white">
              Loading note...
            </h1>
          </div>

          <div class="flex items-center space-x-4" v-if="note">
            <button @click="togglePin"
              class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              :class="{ 'text-indigo-600 dark:text-indigo-400': note.is_pinned }" title="Pin note">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path d="M2 4a1 1 0 011-1h6a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
                <path d="M5 5a1 1 0 011-1h6a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5z" />
              </svg>
            </button>

            <button @click="shareNote"
              class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              title="Share note">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path
                  d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
              </svg>
            </button>

            <button @click="deleteNoteConfirm"
              class="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400" title="Delete note">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fill-rule="evenodd"
                  d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z"
                  clip-rule="evenodd" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      <!-- Editor Area -->
      <div class="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-6">
        <div v-if="loading" class="flex items-center justify-center h-full">
          <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
          <p class="ml-3 text-gray-500 dark:text-gray-400">Loading note...</p>
        </div>

        <div v-else-if="error" class="flex flex-col items-center justify-center h-full">
          <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24"
            stroke="currentColor">
            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1"
              d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <p class="mt-2 text-red-500">{{ error }}</p>
          <button @click="fetchNote"
            class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700">
            Try Again
          </button>
        </div>

        <div v-else-if="note" class="max-w-4xl mx-auto">
          <!-- Tiptap Editor -->
          <div class="tiptap-editor-container">
            <editor-content :editor="editor" class="prose prose-sm sm:prose dark:prose-invert max-w-none" />


            <!-- v-if="showColorPicker"  -->
            <div
              class="color-picker-container fixed z-50 p-2 bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700"
              :style="{ top: `150px`, right: `90px` }">
              <div class="grid grid-cols-5 gap-1">
                <button v-for="color in colors" :key="color" @click="setTextColor(color)"
                  class="w-8 h-8 rounded-full border border-gray-300 dark:border-gray-600 focus:outline-none"
                  :style="{ backgroundColor: color }" :title="color"></button>
              </div>
              <div class="mt-2 pt-2 border-t border-gray-200 dark:border-gray-700">
                <div class="flex items-center">
                  <input type="text" v-model="customColor" placeholder="#HEX or name"
                    class="text-xs flex-1 p-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-gray-200" />
                  <button @click="setTextColor(customColor)"
                    class="ml-2 px-2 py-1 text-xs bg-indigo-600 text-white rounded hover:bg-indigo-700">
                    Apply
                  </button>
                </div>
              </div>
              <div class="mt-2 flex justify-between text-xs">
                <button @click="setTextColor('inherit')"
                  class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Default Color
                </button>
                <button @click="showColorPicker = false"
                  class="text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300">
                  Close
                </button>
              </div>
            </div>

            <!-- Floating Menu -->
            <div v-if="showMenu"
              class="floating-menu bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 p-1 flex items-center space-x-1 absolute z-10"
              :style="menuStyle">
              <button v-for="item in menuItems" :key="item.name" @click="item.action" :title="item.title" :class="[
                'p-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700',
                { 'bg-gray-100 dark:bg-gray-700': item.isActive }
              ]">
                <!-- <component :is="item.icon" class="h-4 w-4 text-gray-600 dark:text-gray-300" /> -->
                <span v-html="item.icon" class="h-4 w-4 text-gray-600 dark:text-gray-300"></span>
              </button>



            </div>



            <!-- Slash Command Menu -->
            <div v-if="showCommandMenu"
              class="command-menu bg-white dark:bg-gray-800 shadow-lg rounded-md border border-gray-200 dark:border-gray-700 absolute z-10"
              :style="{
                top: `${commandPosition.y}px`,
                left: `${commandPosition.x}px`,
                maxWidth: '280px',
                width: '280px'
              }">
              <div class="p-2 border-b border-gray-200 dark:border-gray-700">
                <input type="text" v-model="commandQuery" placeholder="Filter commands..."
                  class="w-full px-2 py-1 text-sm bg-gray-100 dark:bg-gray-700 border-0 rounded focus:ring-1 focus:ring-indigo-500 text-gray-900 dark:text-white"
                  @keydown.stop autofocus />
              </div>

              <div class="max-h-64 overflow-y-auto py-1">
                <button v-for="(cmd, index) in filteredCommands" :key="index" @click="executeCommand(cmd)"
                  class="flex items-center w-full px-3 py-2 text-sm text-left hover:bg-gray-100 dark:hover:bg-gray-700">
                  <div class="w-8 h-8 rounded bg-gray-200 dark:bg-gray-700 flex items-center justify-center mr-2">
                    <span class="text-gray-700 dark:text-gray-300">{{ cmd.icon }}</span>
                  </div>
                  <span class="text-gray-800 dark:text-gray-200">{{ cmd.title }}</span>
                </button>

                <div v-if="filteredCommands.length === 0"
                  class="px-3 py-2 text-sm text-gray-500 dark:text-gray-400 text-center">
                  No commands match your query
                </div>
              </div>
            </div>
          </div>
        </div>


      </div>

      <!-- Status Bar -->
      <div
        class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div v-if="note">
          <span>Last edited {{ formatDate(note.updated_at) }}</span>
          <span v-if="isSaving" class="ml-2 text-indigo-500">Saving...</span>
        </div>
        <div class="flex items-center space-x-4">
          <div v-if="editor && !editor.isDestroyed" class="flex items-center space-x-2">
            <button @click="toggleBold" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('bold') }" title="Bold (Ctrl+B)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <path d="M6 4h8a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
                <path d="M6 12h9a4 4 0 0 1 4 4 4 4 0 0 1-4 4H6z"></path>
              </svg>
            </button>
            <button @click="toggleItalic" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('italic') }" title="Italic (Ctrl+I)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <line x1="19" y1="4" x2="10" y2="4"></line>
                <line x1="14" y1="20" x2="5" y2="20"></line>
                <line x1="15" y1="4" x2="9" y2="20"></line>
              </svg>
            </button>
            <button @click="toggleCode" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700"
              :class="{ 'bg-gray-100 dark:bg-gray-700': editor.isActive('code') }" title="Code (Ctrl+E)">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <polyline points="16 18 22 12 16 6"></polyline>
                <polyline points="8 6 2 12 8 18"></polyline>
              </svg>
            </button>
            <div class="h-4 border-r border-gray-300 dark:border-gray-600 mx-1"></div>
            <button @click="addImage" class="p-1 rounded hover:bg-gray-100 dark:hover:bg-gray-700" title="Add Image">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" viewBox="0 0 24 24" fill="none"
                stroke="currentColor" stroke-width="2">
                <rect x="3" y="3" width="18" height="18" rx="2" ry="2"></rect>
                <circle cx="8.5" cy="8.5" r="1.5"></circle>
                <polyline points="21 15 16 10 5 21"></polyline>
              </svg>
            </button>
          </div>
          <span v-if="note && note.content">{{ formatWordCount(getPlainTextContent()) }}</span>
        </div>
      </div>
    </div>

    <!-- Share Modal -->
    <div v-if="showShareModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Share Note</h3>
          <button @click="showShareModal = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <label for="user" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
          <select id="user" v-model="shareForm.user_id"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
            <option value="" disabled>Select a user</option>
            <option v-for="user in users" :key="user.id" :value="user.id">
              {{ user.first_name }} {{ user.last_name }}
            </option>
          </select>
        </div>

        <div class="mb-6">
          <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Permission</label>
          <div class="flex space-x-4">
            <label class="flex items-center">
              <input type="radio" v-model="shareForm.permission" value="view"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">View</span>
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="shareForm.permission" value="edit"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Edit</span>
            </label>
            <label class="flex items-center">
              <input type="radio" v-model="shareForm.permission" value="admin"
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600" />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Admin</span>
            </label>
          </div>
        </div>

        <div class="flex justify-end">
          <button type="button" @click="showShareModal = false"
            class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button type="button" @click="submitShareForm"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            :disabled="!shareForm.user_id">
            Share Note
          </button>
        </div>
      </div>
    </div>

    <!-- Delete Confirmation Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Note</h3>
          <button @click="showDeleteModal = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-6">
          <p class="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the note "<span class="font-semibold">{{ note?.title }}</span>"? This action
            cannot be undone.
          </p>
        </div>

        <div class="flex justify-end">
          <button type="button" @click="showDeleteModal = false"
            class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button type="button" @click="confirmDelete"
            class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700">
            Delete Note
          </button>
        </div>
      </div>
    </div>

    <!-- Add Image Modal -->
    <div v-if="showImageModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Image</h3>
          <button @click="showImageModal = false"
            class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>

        <div class="mb-4">
          <label for="imageUrl" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Image
            URL</label>
          <input type="text" id="imageUrl" v-model="imageUrl" placeholder="https://example.com/image.jpg"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>

        <div class="mb-4">
          <label for="imageAlt" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Alt Text</label>
          <input type="text" id="imageAlt" v-model="imageAlt" placeholder="Image description"
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white" />
        </div>

        <div class="flex justify-end">
          <button type="button" @click="showImageModal = false"
            class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700">
            Cancel
          </button>
          <button type="button" @click="insertImage"
            class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            :disabled="!imageUrl">
            Insert Image
          </button>
        </div>
      </div>
    </div>






  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch, onBeforeUnmount, shallowRef } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { defineComponent } from 'vue';

// Import Tiptap editor
import { Editor, EditorContent } from '@tiptap/vue-3';
import StarterKit from '@tiptap/starter-kit';
import Image from '@tiptap/extension-image';
import Placeholder from '@tiptap/extension-placeholder';
import TaskList from '@tiptap/extension-task-list';
import TaskItem from '@tiptap/extension-task-item';
import TextAlign from '@tiptap/extension-text-align';
import Highlight from '@tiptap/extension-highlight';
import Link from '@tiptap/extension-link';
import Underline from '@tiptap/extension-underline';
import CodeBlock from '@tiptap/extension-code-block';
import TextStyle from '@tiptap/extension-text-style'
import Color from '@tiptap/extension-color'
import { Extension } from '@tiptap/core'
// Import Mark from tiptap at the top of your file
import { Mark } from '@tiptap/core'

definePageMeta({
  layout: 'dashboard'
});

const route = useRoute();
const router = useRouter();
const noteId = route.params.id;

// State
const note = ref(null);
const loading = ref(true);
const error = ref(null);
const showShareModal = ref(false);
const showDeleteModal = ref(false);
const showImageModal = ref(false);
const imageUrl = ref('');
const imageAlt = ref('');
const users = ref([]);
const shareForm = ref({
  user_id: '',
  permission: 'view'
});
const isSaving = ref(false);
const saveTimeout = ref(null);
const editor = shallowRef(null);
const showMenu = ref(false);
const menuPosition = ref({ x: 0, y: 0 });

const showCommandMenu = ref(false);
const commandPosition = ref({ x: 0, y: 0 });
const commandQuery = ref('');
const filteredCommands = ref([]);

const colorPickerPosition = ref({ x: 0, y: 0 });
const showColorPicker = ref(false);
const currentColor = ref('#000000');
const customColor = ref('');
const colors = [
  '#000000', // Black
  '#5c6ac4', // Blue
  '#007d9c', // Teal
  '#1aaa55', // Green
  '#629300', // Lime
  '#e6e338', // Yellow
  '#f5a623', // Orange
  '#d0021b', // Red
  '#e71162', // Pink
  '#7b61ff', // Purple
  '#6b7280', // Gray
  '#ffffff', // White
  
];


// Command definitions with proper icons
const commands = [
  {
    title: 'Text Color',
    icon: '🎨',
    action: () => {
      if (!editor.value || editor.value.isDestroyed) return;

      const pos = editor.value.view.state.selection.$from;
      const coords = editor.value.view.coordsAtPos(pos.pos);

      colorPickerPosition.value = {
        x: coords.left,
        y: coords.bottom + 10 // Position below cursor
      };

      showColorPicker.value = true;
      showCommandMenu.value = false;
    },
    keywords: ['color', 'text color', 'font color', 'foreground']
  },
  {
    title: 'Heading 1',
    icon: 'H1',
    action: () => editor.value?.chain().focus().toggleHeading({ level: 1 }).run(),
    keywords: ['h1', 'heading', 'title', 'large']
  },
  {
    title: 'Heading 2',
    icon: 'H2',
    action: () => editor.value?.chain().focus().toggleHeading({ level: 2 }).run(),
    keywords: ['h2', 'heading', 'subtitle']
  },
  {
    title: 'Bullet List',
    icon: '•',
    action: () => editor.value?.chain().focus().toggleBulletList().run(),
    keywords: ['bullet', 'list', 'ul', 'unordered']
  },
  {
    title: 'Numbered List',
    icon: '1.',
    action: () => editor.value?.chain().focus().toggleOrderedList().run(),
    keywords: ['number', 'ordered', 'list', 'ol']
  },
  {
    title: 'Task List',
    icon: '✓',
    action: () => editor.value?.chain().focus().toggleTaskList().run(),
    keywords: ['task', 'todo', 'checkbox', 'check']
  },
  {
    title: 'Code Block',
    icon: '</>',
    action: () => editor.value?.chain().focus().toggleCodeBlock().run(),
    keywords: ['code', 'codeblock', 'pre']
  },
  {
    title: 'Quote',
    icon: '"',
    action: () => editor.value?.chain().focus().toggleBlockquote().run(),
    keywords: ['quote', 'blockquote', 'citation']
  },
  {
    title: 'Horizontal Rule',
    icon: '—',
    action: () => editor.value?.chain().focus().setHorizontalRule().run(),
    keywords: ['rule', 'line', 'divider', 'hr']
  }
];



// Computed
const menuStyle = computed(() => {
  return {
    top: `${menuPosition.value.y}px`,
    left: `${menuPosition.value.x}px`,
  };
});

// Add this function to calculate the adjusted position
function getAdjustedPosition() {
  // Get the original position
  const { x, y } = colorPickerPosition.value;

  // Get viewport dimensions
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;

  // Get color picker dimensions (approximation)
  const pickerWidth = 200;
  const pickerHeight = 220; // Approximate height based on content

  // Get scrolling offsets
  const scrollX = window.scrollX || window.pageXOffset;
  const scrollY = window.scrollY || window.pageYOffset;

  // Convert from editor-relative to document-absolute position
  let editorRect = { top: 0, left: 0 };
  if (editor.value && !editor.value.isDestroyed && editor.value.view) {
    editorRect = editor.value.view.dom.getBoundingClientRect();
  }

  // Calculate absolute position
  let absLeft = editorRect.left + x + scrollX;
  let absTop = editorRect.top + y + scrollY;

  // Ensure the picker doesn't go outside the viewport
  // Check right edge
  if (absLeft + pickerWidth > viewportWidth + scrollX) {
    absLeft = viewportWidth + scrollX - pickerWidth - 10;
  }

  // Check bottom edge
  if (absTop + pickerHeight > viewportHeight + scrollY) {
    // If it would go below viewport, position above the selection instead
    absTop = absTop - pickerHeight - 40; // 40px above to account for the selection itself
  }

  return {
    left: absLeft,
    top: absTop
  };
}

const menuItems = computed(() => {
  if (!editor.value || editor.value.isDestroyed) return [];

  return [
    {
      name: 'textColor',
      title: 'Text Color',
      icon: `
        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
          <path d="M9 7h6l-3 10z"></path>
          <path d="M4 20h16"></path>
        </svg>
      `,
      isActive: false,
      action: () => {
        // Get the selection position
        if (!editor.value || editor.value.isDestroyed) return;

        const { view } = editor.value;
        const { from, to } = view.state.selection;

        // Get coordinates at the end of selection
        const coords = view.coordsAtPos(to);

        // Calculate position below the selection
        colorPickerPosition.value = {
          x: coords.left,
          y: coords.bottom + 10 // Position 10px below the selection
        };

        // Show the color picker
        showColorPicker.value = true;
      }
    },
    {
      name: 'heading1',
      title: 'Heading 1',
      icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12h16"></path>
              <path d="M4 6h8"></path>
              <path d="M4 18h12"></path>
            </svg>
          `,
      isActive: editor.value.isActive('heading', { level: 1 }),
      action: () => editor.value.chain().focus().toggleHeading({ level: 1 }).run()
    },
    {
      name: 'heading2',
      title: 'Heading 2',
      icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M4 12h10"></path>
              <path d="M4 6h16"></path>
              <path d="M4 18h8"></path>
            </svg>
          `,
      isActive: editor.value.isActive('heading', { level: 2 }),
      action: () => editor.value.chain().focus().toggleHeading({ level: 2 }).run()
    },
    {
      name: 'bulletList',
      title: 'Bullet List',
      icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="8" y1="6" x2="21" y2="6"></line>
              <line x1="8" y1="12" x2="21" y2="12"></line>
              <line x1="8" y1="18" x2="21" y2="18"></line>
              <line x1="3" y1="6" x2="3.01" y2="6"></line>
              <line x1="3" y1="12" x2="3.01" y2="12"></line>
              <line x1="3" y1="18" x2="3.01" y2="18"></line>
            </svg>
          `,
      isActive: editor.value.isActive('bulletList'),
      action: () => editor.value.chain().focus().toggleBulletList().run()
    },
    {
      name: 'orderedList',
      title: 'Ordered List',
      icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="10" y1="6" x2="21" y2="6"></line>
              <line x1="10" y1="12" x2="21" y2="12"></line>
              <line x1="10" y1="18" x2="21" y2="18"></line>
              <path d="M4 6h1v4"></path>
              <path d="M4 10h2"></path>
              <path d="M6 18H4c0-1 2-2 2-3s-1-1.5-2-1"></path>
            </svg>
          `,
      isActive: editor.value.isActive('orderedList'),
      action: () => editor.value.chain().focus().toggleOrderedList().run()
    },
    {
      name: 'taskList',
      title: 'Task List',
      icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2"></rect>
              <line x1="9" y1="9" x2="15" y2="15"></line>
              <line x1="15" y1="9" x2="9" y2="15"></line>
            </svg>
          `,
      isActive: editor.value.isActive('taskList'),
      action: () => editor.value.chain().focus().toggleTaskList().run()
    },
    {
      name: 'codeBlock',
      title: 'Code Block',
      icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="16 18 22 12 16 6"></polyline>
              <polyline points="8 6 2 12 8 18"></polyline>
            </svg>
          `,
      isActive: editor.value.isActive('codeBlock'),
      action: () => editor.value.chain().focus().toggleCodeBlock().run()
    },
    {
      name: 'blockquote',
      title: 'Blockquote',
      icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M3 21c3 0 7-1 7-8V5c0-1.25-.756-2.017-2-2H4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2 1 0 1 0 1 1v1c0 1-1 2-2 2s-1 .008-1 1.031V20c0 1 0 1 1 1z"></path>
              <path d="M15 21c3 0 7-1 7-8V5c0-1.25-.757-2.017-2-2h-4c-1.25 0-2 .75-2 1.972V11c0 1.25.75 2 2 2h.75c0 2.25.25 4-2.75 4v3c0 1 0 1 1 1z"></path>
            </svg>
          `,
      isActive: editor.value.isActive('blockquote'),
      action: () => editor.value.chain().focus().toggleBlockquote().run()
    },
    {
      name: 'horizontalRule',
      title: 'Horizontal Rule',
      icon: `
            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <line x1="5" y1="12" x2="19" y2="12"></line>
            </svg>
          `,
      isActive: false,
      action: () => editor.value.chain().focus().setHorizontalRule().run()
    }
  ];
});

const TextColor = Extension.create({
  name: 'textColor',

  addOptions() {
    return {
      types: ['textStyle'],
    }
  },

  addGlobalAttributes() {
    return [
      {
        types: this.options.types,
        attributes: {
          color: {
            default: null,
            parseHTML: element => element.style.color || null,
            renderHTML: attributes => {
              if (!attributes.color) {
                return {}
              }

              return {
                style: `color: ${attributes.color}`,
              }
            },
          },
        },
      },
    ]
  },

  addCommands() {
    return {
      setTextColor: color => ({ chain }) => {
        return chain()
          .setMark('textStyle', { color })
          .run()
      },
      unsetTextColor: () => ({ chain }) => {
        return chain()
          .setMark('textStyle', { color: null })
          .removeEmptyTextStyle()
          .run()
      },
    }
  },
})

// If the TipTap extensions aren't working for color, we can try a more direct approach
// CRITICAL FUNCTION: This needs to be simplified and fixed
function setTextColor(color) {
  if (!editor.value || editor.value.isDestroyed) return;

  try {
    // First, make sure we have the editor's focus
    editor.value.commands.focus();

    if (color === 'inherit' || color === '') {
      // Remove color
      editor.value.chain().setColor('').run();
    } else {
      // Set color - use the standard method
      editor.value.chain().setColor(color).run();
    }

    // Log for debugging
    console.log(`Applied color: ${color}`);

    // Update current color for display
    currentColor.value = color === 'inherit' ? '#000000' : color;

    // Always hide the picker after selecting
    showColorPicker.value = false;
  } catch (error) {
    console.error('Error in setTextColor:', error);

    // Fallback to execCommand approach
    try {
      // Make sure selection is active
      editor.value.commands.focus();

      if (document.queryCommandSupported('foreColor')) {
        const colorValue = color === 'inherit' ? '' : color;
        document.execCommand('foreColor', false, colorValue);
        console.log(`Applied color via execCommand: ${color}`);
      }

      // Update color and hide picker
      currentColor.value = color === 'inherit' ? '#000000' : color;
      showColorPicker.value = false;
    } catch (fallbackError) {
      console.error('Fallback error:', fallbackError);
    }
  }
}

// 2. Alternative approach - use a mark instead of textStyle
// First, create a custom mark for colored text
const ColorMark = Mark.create({
  name: 'textColor',

  addAttributes() {
    return {
      color: {
        default: null,
        parseHTML: element => element.getAttribute('data-color') || element.style.color,
        renderHTML: attributes => {
          if (!attributes.color) return {}

          return {
            style: `color: ${attributes.color}`,
            'data-color': attributes.color,
          }
        },
      },
    }
  },

  parseHTML() {
    return [
      {
        tag: 'span[style*=color]',
        getAttrs: element => ({ color: element.style.color }),
      },
      {
        tag: 'span[data-color]',
        getAttrs: element => ({ color: element.getAttribute('data-color') }),
      },
    ]
  },

  renderHTML({ HTMLAttributes }) {
    return ['span', HTMLAttributes, 0]
  },
})


// And update the setTextColor function to use the mark
function setTextColorWithMark(color) {
  if (!editor.value || editor.value.isDestroyed) return;

  try {
    if (color === 'inherit' || color === '') {
      editor.value.chain().focus().unsetMark('textColor').run();
    } else {
      editor.value.chain().focus().setMark('textColor', { color }).run();
    }

    // Update current color for display
    currentColor.value = color === 'inherit' ? '#000000' : color;

    // Hide the color picker after applying
    showColorPicker.value = false;
  } catch (error) {
    console.error('Error applying text color with mark:', error);
  }
}



// Lifecycle
onMounted(async () => {
  await fetchNote();
  await fetchUsers();

  // Listen for click events to hide the floating menu
  document.addEventListener('click', handleDocumentClick);
  // Add click-outside handler for color picker
  document.addEventListener('click', (event) => {
    if (showColorPicker.value && !event.target.closest('.color-picker-container') && !event.target.closest('[title="Text Color"]')) {
      showColorPicker.value = false;
    }
  });

});

onBeforeUnmount(() => {
  // Clean up listeners and editor
  document.removeEventListener('click', handleDocumentClick);
  if (editor.value && !editor.value.isDestroyed) {
    editor.value.destroy();
  }

  // Remove click listener
  document.removeEventListener('click', (event) => {
    if (showColorPicker.value && !event.target.closest('.color-picker-container') && !event.target.closest('[title="Text Color"]')) {
      showColorPicker.value = false;
    }
  });

});

// Watch for route changes (different note)
watch(() => route.params.id, async (newId) => {
  if (newId && newId !== noteId) {
    // Destroy current editor if exists
    if (editor.value && !editor.value.isDestroyed) {
      editor.value.destroy();
    }

    await fetchNote();
  }
});

// Watch for note content changes to initialize editor
watch(() => note.value, (newNote) => {
  if (newNote) {
    initEditor(newNote.content || '');
  }
}, { immediate: false });

// Watch commandQuery for filtering
watch(commandQuery, (newQuery) => {
  filterCommands(newQuery);
});

// Methods
async function fetchNote() {
  loading.value = true;
  error.value = null;

  try {
    const response = await fetch(`/api/api/notes/${noteId}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch note');
    }

    const data = await response.json();
    note.value = data.data;
  } catch (err) {
    console.error('Error fetching note:', err);
    error.value = 'Failed to load note. Please try again.';
  } finally {
    loading.value = false;
  }
}



// The critical fix is in the initEditor function
function initEditor(content) {
  // Destroy previous editor if exists
  if (editor.value && !editor.value.isDestroyed) {
    editor.value.destroy();
  }

  // Create editor instance with the correct extensions
  editor.value = new Editor({
    content,
    extensions: [
      StarterKit.configure({
        heading: {
          levels: [1, 2, 3]
        }
      }),
      Placeholder.configure({
        placeholder: 'Type "/" for commands...'
      }),
      Image,
      TaskList,
      TaskItem.configure({
        nested: true
      }),
      TextAlign.configure({
        types: ['heading', 'paragraph']
      }),
      Highlight,
      Link,
      Underline,
      TextStyle, // Required for Color to work
      Color,     // The standard Color extension
      CodeBlock,
    ],
    editorProps: {
      attributes: {
        class: 'prose prose-sm sm:prose focus:outline-none dark:prose-invert max-w-none min-h-[300px] p-4'
      }
    },
    // Rest of your editor configuration remains unchanged
    onUpdate: ({ editor }) => {
      // Auto-save changes
      if (editor && !editor.isDestroyed) {
        autoSaveNote(editor.getHTML());
      }
    },
    onSelectionUpdate: ({ editor }) => {
      // Show menu when text is selected
      if (!editor || editor.isDestroyed || !editor.view) {
        showMenu.value = false;
        return;
      }

      if (editor.view.state.selection.empty) {
        showMenu.value = false;
        return;
      }

      const { from, to } = editor.view.state.selection;
      if (from === to) {
        showMenu.value = false;
        return;
      }

      try {
        // Get position for floating menu
        const { view } = editor;
        const { top, left, width } = view.dom.getBoundingClientRect();
        const { x, y } = view.coordsAtPos(from);

        menuPosition.value = {
          x: Math.min(x - left, left + width - 200),
          y: y - top - 40
        };

        showMenu.value = true;
      } catch (error) {
        console.error('Error updating selection:', error);
        showMenu.value = false;
      }
    },
    onCreate: ({ editor }) => {
      // Slash command handler remains unchanged
      try {
        if (editor && !editor.isDestroyed && editor.view && editor.view.dom) {
          const handleKeyDown = (e) => {
            if (editor.isDestroyed) {
              editor.view.dom.removeEventListener('keydown', handleKeyDown);
              return;
            }

            if (e.key === '/' && editor.view.state.selection.empty) {
              e.preventDefault();
              showCommandSuggestions(editor);
            }

            if (e.key === 'Escape' && showCommandMenu.value) {
              showCommandMenu.value = false;
            }
          };

          editor.view.dom.addEventListener('keydown', handleKeyDown);
        }
      } catch (error) {
        console.error('Error setting up editor event listeners:', error);
      }
    }
  });
}

function showCommandSuggestions(editor) {
  // Check if editor is defined and not destroyed
  if (!editor || editor.isDestroyed || !editor.view) {
    return;
  }

  const { view } = editor;
  const { state } = view;

  // Make sure DOM is available
  if (!view.dom) {
    return;
  }

  try {
    // Get cursor position safely
    const currentPos = state.selection.$anchor.pos;
    const currentPosCoords = view.coordsAtPos(currentPos);
    const editorDom = view.dom.getBoundingClientRect();

    commandPosition.value = {
      x: currentPosCoords.left - editorDom.left,
      y: currentPosCoords.top - editorDom.top + 24 // Position below cursor
    };

    // Reset query and filter commands
    commandQuery.value = '';
    filteredCommands.value = commands;

    // Show menu
    showCommandMenu.value = true;

    // Set up event listener to close menu on click outside
    setTimeout(() => {
      const clickHandler = (e) => {
        if (!e.target.closest('.command-menu')) {
          showCommandMenu.value = false;
          document.removeEventListener('click', clickHandler);
        }
      };
      document.addEventListener('click', clickHandler);
    }, 0);
  } catch (error) {
    console.error('Error showing command suggestions:', error);
    showCommandMenu.value = false;
  }
}

function filterCommands(query) {
  if (!query) {
    filteredCommands.value = commands;
    return;
  }

  const normalizedQuery = query.toLowerCase();
  filteredCommands.value = commands.filter(cmd =>
    cmd.title.toLowerCase().includes(normalizedQuery) ||
    cmd.keywords.some(k => k.includes(normalizedQuery))
  );
}

function executeCommand(command) {
  command.action();
  showCommandMenu.value = false;
  commandQuery.value = '';


}

function handleDocumentClick(event) {
  if (showMenu.value && !event.target.closest('.floating-menu')) {
    showMenu.value = false;
  }
}

async function fetchUsers() {
  try {
    const response = await fetch('/api/api/users', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to fetch users');
    }

    const data = await response.json();
    users.value = data.data;
  } catch (err) {
    console.error('Error fetching users:', err);
  }
}

function navigateToNotes() {
  router.push('/notes');
}

// Auto-save with debounce
function autoSaveNote(content) {
  isSaving.value = true;

  // Clear existing timeout
  if (saveTimeout.value) {
    clearTimeout(saveTimeout.value);
  }

  // Set new timeout (1 second delay)
  saveTimeout.value = setTimeout(() => {
    if (note.value) {
      note.value.content = content;
      saveNote();
    }
  }, 1000);
}

async function saveNote() {
  if (!note.value) return;

  isSaving.value = true;

  try {
    const response = await fetch(`/api/api/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        title: note.value.title,
        content: editor.value ? editor.value.getHTML() : note.value.content,
        is_markdown: note.value.is_markdown
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update note');
    }

    // Update the updated_at timestamp locally
    note.value.updated_at = new Date().toISOString();
  } catch (err) {
    console.error('Error saving note:', err);
  } finally {
    isSaving.value = false;
  }
}

async function togglePin() {
  if (!note.value) return;

  try {
    const newPinnedState = !note.value.is_pinned;

    const response = await fetch(`/api/api/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        is_pinned: newPinnedState
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update note');
    }

    note.value.is_pinned = newPinnedState;
  } catch (err) {
    console.error('Error toggling pin:', err);
  }
}

async function toggleMarkdown() {
  if (!note.value) return;

  try {
    const newMarkdownState = !note.value.is_markdown;

    const response = await fetch(`/api/api/notes/${noteId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        is_markdown: newMarkdownState
      })
    });

    if (!response.ok) {
      throw new Error('Failed to update note');
    }

    note.value.is_markdown = newMarkdownState;
  } catch (err) {
    console.error('Error toggling markdown:', err);
  }
}

function shareNote() {
  shareForm.value = {
    user_id: '',
    permission: 'view'
  };

  showShareModal.value = true;
}

async function submitShareForm() {
  if (!note.value || !shareForm.value.user_id) return;

  try {
    const response = await fetch(`/api/api/notes/${noteId}/share`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        user_id: shareForm.value.user_id,
        permission: shareForm.value.permission
      })
    });

    if (!response.ok) {
      throw new Error('Failed to share note');
    }

    showShareModal.value = false;
    alert('Note shared successfully.');
  } catch (err) {
    console.error('Error sharing note:', err);
    alert('Failed to share note. Please try again.');
  }
}

function deleteNoteConfirm() {
  if (!note.value) return;

  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!note.value) return;

  try {
    const response = await fetch(`/api/api/notes/${noteId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });

    if (!response.ok) {
      throw new Error('Failed to delete note');
    }

    showDeleteModal.value = false;
    router.push('/notes');
  } catch (err) {
    console.error('Error deleting note:', err);
    alert('Failed to delete note. Please try again.');
  }
}

// Editor methods
function toggleBold() {
  if (editor.value && !editor.value.isDestroyed) {
    editor.value.chain().focus().toggleBold().run();
  }
}

function toggleItalic() {
  if (editor.value && !editor.value.isDestroyed) {
    editor.value.chain().focus().toggleItalic().run();
  }
}

function toggleCode() {
  if (editor.value && !editor.value.isDestroyed) {
    editor.value.chain().focus().toggleCode().run();
  }
}

function addImage() {
  showImageModal.value = true;
  imageUrl.value = '';
  imageAlt.value = '';
}

function insertImage() {
  if (editor.value && !editor.value.isDestroyed && imageUrl.value) {
    editor.value.chain().focus().setImage({
      src: imageUrl.value,
      alt: imageAlt.value || 'Image'
    }).run();

    showImageModal.value = false;
  }
}

function getPlainTextContent() {
  if (editor.value && !editor.value.isDestroyed) {
    try {
      return editor.value.getText();
    } catch (error) {
      console.error('Error getting plain text:', error);
      return '';
    }
  }
  return note.value?.content || '';
}

// Helper functions
function formatDate(dateString) {
  if (!dateString) return '';

  try {
    const date = new Date(dateString);

    // Check if date is valid
    if (isNaN(date.getTime())) return dateString;

    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    const month = months[date.getMonth()];
    const day = date.getDate();
    const year = date.getFullYear();

    let hours = date.getHours();
    const minutes = date.getMinutes().toString().padStart(2, '0');
    const ampm = hours >= 12 ? 'pm' : 'am';

    hours = hours % 12;
    hours = hours ? hours : 12; // Convert 0 to 12

    return `${month} ${day}, ${year} ${hours}:${minutes} ${ampm}`;
  } catch (e) {
    return dateString || '';
  }
}

function formatWordCount(text) {
  if (!text) return '0 words';

  const wordCount = text.trim().split(/\s+/).length;
  return `${wordCount} ${wordCount === 1 ? 'word' : 'words'}`;
}
</script>

<style>
/* TipTap editor styles */
.tiptap-editor-container {
  position: relative;
}

.ProseMirror {
  min-height: 300px;
  padding: 1rem;
}

.ProseMirror p.is-editor-empty:first-child::before {
  content: attr(data-placeholder);
  float: left;
  color: #adb5bd;
  pointer-events: none;
  height: 0;
}

.ProseMirror ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}

.ProseMirror ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
}

.ProseMirror ul[data-type="taskList"] li>label {
  margin-right: 0.5rem;
  user-select: none;
}

.ProseMirror ul[data-type="taskList"] li>div {
  flex: 1;
}

/* Dark mode optimizations */
.dark .ProseMirror {
  color: white;
}

.dark .ProseMirror code {
  background-color: rgba(55, 65, 81, 0.5);
  color: #e5e7eb;
}

.dark .ProseMirror pre {
  background-color: rgba(17, 24, 39, 0.8);
  color: #e5e7eb;
}

.dark .ProseMirror blockquote {
  border-left-color: rgba(75, 85, 99, 0.5);
  color: #d1d5db;
}

/* Better styling for floating menu */
.floating-menu {
  transform: translateY(-8px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  border-radius: 0.5rem;
  padding: 0.5rem;
  display: flex;
  align-items: center;
  gap: 0.25rem;
}

.dark .floating-menu {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
}

.floating-menu button {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 2rem;
  height: 2rem;
  border-radius: 0.25rem;
  color: #4b5563;
  transition: all 0.2s;
}

.dark .floating-menu button {
  color: #d1d5db;
}

.floating-menu button:hover {
  background-color: #f3f4f6;
}

.dark .floating-menu button:hover {
  background-color: #374151;
}

.floating-menu button.active {
  background-color: #e5e7eb;
  color: #1f2937;
}

.dark .floating-menu button.active {
  background-color: #4b5563;
  color: white;
}

/* Command menu styling */
.command-menu {
  z-index: 50;
}

/* Add these CSS styles to your <style> section */

/* Improved task list styling */
.ProseMirror ul[data-type="taskList"] {
  list-style: none;
  padding: 0;
}

.ProseMirror ul[data-type="taskList"] li {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.5em;
  position: relative;
  /* This is critical for alignment */
  line-height: 1.5;
}

/* Fix the checkbox positioning */
.ProseMirror ul[data-type="taskList"] li>label {
  margin-right: 0.5rem;
  user-select: none;
  margin-top: 0.25em;
  /* Align with first line of text */
}

/* Make sure paragraphs inside task list don't have unwanted margins */
.ProseMirror ul[data-type="taskList"] li p {
  margin: 0;
}

/* Ensure task list content is properly aligned */
.ProseMirror ul[data-type="taskList"] li>div {
  flex: 1;
  min-height: 1.5em;
  /* Ensure minimum height even for empty items */
}

/* Custom checkbox styling */
.ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
  margin: 0;
  cursor: pointer;
  width: 16px;
  height: 16px;
}

/* Dark mode adjustments */
.dark .ProseMirror ul[data-type="taskList"] input[type="checkbox"] {
  border-color: #4b5563;
  background-color: #1f2937;
}

/* Color picker styles */

/* Ensure color buttons have proper contrast with borders */
.dark button[style*="background-color: #000000"] {
  border: 1px solid #6b7280;
}

button[style*="background-color: #ffffff"] {
  border: 1px solid #9ca3af;
}

/* This ensures proper styling for colored text in the editor */
.ProseMirror [style*="color:"] {
  text-decoration: none;
}

/* Add a small indicator for the current text color */
.text-color-indicator {
  position: absolute;
  bottom: 0;
  left: 3px;
  right: 3px;
  height: 2px;
  border-radius: 1px;
}

/* Add these styles to your <style> section */

/* Ensure the color picker has a high z-index */
.color-picker-container {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
  z-index: 100;
  /* Make sure it's above other elements */
}

.dark .color-picker-container {
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.35);
}

/* Color buttons */
.color-picker-container button.rounded-full {
  transition: transform 0.2s ease;
}

.color-picker-container button.rounded-full:hover {
  transform: scale(1.1);
}

/* White/Black color buttons need borders for visibility */

.dark .color-picker-container button[style*="background-color: #000000"] {
  border: 1px solid #6b7280;
}

.color-picker-container::before {
  content: '';
  position: absolute;
  top: -8px;
  left: 20px;
  width: 0;
  height: 0;
  border-left: 8px solid transparent;
  border-right: 8px solid transparent;
  border-bottom: 8px solid white;
}

.dark .color-picker-container::before {
  border-bottom-color: #1f2937;
  /* Dark mode arrow color */
}
</style>