<!-- pages/notes.vue -->
<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <!-- Sidebar -->
      <div class="w-64 border-r border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 flex flex-col">
        <!-- Sidebar Header -->
        <div class="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center justify-between">
          <h2 class="text-lg font-medium text-gray-900 dark:text-white">Notes</h2>
          <button 
            @click="createNewNote" 
            class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
            </svg>
          </button>
        </div>
        
        <!-- Search Bar -->
        <div class="p-4">
          <div class="relative">
            <input 
              type="text" 
              v-model="searchQuery" 
              placeholder="Search notes..." 
              class="w-full px-4 py-2 bg-gray-100 dark:bg-gray-700 border-0 rounded-md text-gray-900 dark:text-white placeholder-gray-500 dark:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500"
            />
            <svg 
              xmlns="http://www.w3.org/2000/svg" 
              class="h-5 w-5 text-gray-400 absolute right-3 top-2.5" 
              fill="none" 
              viewBox="0 0 24 24" 
              stroke="currentColor"
            >
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
            </svg>
          </div>
        </div>
        
        <!-- Note List -->
        <div class="flex-1 overflow-y-auto">
          <div v-if="loading" class="p-4 text-center">
            <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full mx-auto"></div>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">Loading notes...</p>
          </div>
          
          <div v-else-if="notes.length === 0" class="p-4 text-center">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-gray-300 dark:text-gray-600 mx-auto" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <p class="mt-2 text-sm text-gray-500 dark:text-gray-400">No notes found.</p>
            <button 
              @click="createNewNote" 
              class="mt-3 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Create your first note
            </button>
          </div>
          
          <div v-else>
            <!-- Pinned Notes -->
            <div v-if="pinnedNotes.length > 0" class="pt-2">
              <div class="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                Pinned
              </div>
              <div class="mt-1">
                <div 
                  v-for="note in pinnedNotes" 
                  :key="note.id" 
                  @click="selectNote(note)" 
                  class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-100"
                  :class="{ 'bg-indigo-50 dark:bg-indigo-900/20': selectedNote && selectedNote.id === note.id }"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ note.title }}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {{ note.content ? stripMarkdown(note.content).substring(0, 50) : 'No content' }}
                      </p>
                    </div>
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 text-indigo-500" viewBox="0 0 20 20" fill="currentColor">
                      <path d="M2 4a1 1 0 011-1h6a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
                      <path d="M5 5a1 1 0 011-1h6a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5z" />
                    </svg>
                  </div>
                  <div class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ formatDate(note.updated_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
            
            <!-- Other Notes -->
            <div class="pt-2">
              <div class="px-4 text-xs font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider">
                All Notes
              </div>
              <div class="mt-1">
                <div 
                  v-for="note in unpinnedNotes" 
                  :key="note.id" 
                  @click="selectNote(note)" 
                  class="px-4 py-2 cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors duration-100"
                  :class="{ 'bg-indigo-50 dark:bg-indigo-900/20': selectedNote && selectedNote.id === note.id }"
                >
                  <div class="flex items-center justify-between">
                    <div class="flex-1 min-w-0">
                      <h3 class="text-sm font-medium text-gray-900 dark:text-white truncate">{{ note.title }}</h3>
                      <p class="text-xs text-gray-500 dark:text-gray-400 mt-0.5 truncate">
                        {{ note.content ? stripMarkdown(note.content).substring(0, 50) : 'No content' }}
                      </p>
                    </div>
                  </div>
                  <div class="mt-1 flex items-center text-xs text-gray-500 dark:text-gray-400">
                    <span>{{ formatDate(note.updated_at) }}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Topbar -->
        <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div class="flex items-center justify-between h-16 px-4">
            <div class="flex items-center">
              <h1 class="text-lg font-medium text-gray-900 dark:text-white">
                {{ selectedNote ? selectedNote.title : 'Welcome to Notes' }}
              </h1>
            </div>
            
            <div class="flex items-center space-x-4" v-if="selectedNote">
              <button 
                @click="togglePin" 
                class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                :class="{ 'text-indigo-600 dark:text-indigo-400': selectedNote.is_pinned }"
                title="Pin note"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M2 4a1 1 0 011-1h6a1 1 0 011 1v14a1 1 0 01-1 1H3a1 1 0 01-1-1V4z" />
                  <path d="M5 5a1 1 0 011-1h6a1 1 0 011 1v14a1 1 0 01-1 1H6a1 1 0 01-1-1V5z" />
                </svg>
              </button>
              
              <button 
                @click="shareNote" 
                class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                title="Share note"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path d="M15 8a3 3 0 10-2.977-2.63l-4.94 2.47a3 3 0 100 4.319l4.94 2.47a3 3 0 10.895-1.789l-4.94-2.47a3.027 3.027 0 000-.74l4.94-2.47C13.456 7.68 14.19 8 15 8z" />
                </svg>
              </button>
              
              <button 
                @click="deleteNoteConfirm" 
                class="text-gray-500 hover:text-red-600 dark:text-gray-400 dark:hover:text-red-400"
                title="Delete note"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M9 2a1 1 0 00-.894.553L7.382 4H4a1 1 0 000 2v10a2 2 0 002 2h8a2 2 0 002-2V6a1 1 0 100-2h-3.382l-.724-1.447A1 1 0 0011 2H9zM7 8a1 1 0 012 0v6a1 1 0 11-2 0V8zm5-1a1 1 0 00-1 1v6a1 1 0 102 0V8a1 1 0 00-1-1z" clip-rule="evenodd" />
                </svg>
              </button>
            </div>
          </div>
        </div>
        
        <!-- Editor -->
        <div class="flex-1 overflow-y-auto bg-white dark:bg-gray-800 p-4">
          <div v-if="!selectedNote" class="flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-16 w-16 text-gray-300 dark:text-gray-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            <h2 class="mt-4 text-lg font-medium text-gray-900 dark:text-white">Welcome to Notes!</h2>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">Select a note to view or edit its contents.</p>
            <button 
              @click="createNewNote" 
              class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Create a new note
            </button>
          </div>
          
          <div v-else>
            <!-- Title Input -->
            <input 
              type="text" 
              v-model="selectedNote.title" 
              @blur="saveNote" 
              placeholder="Untitled" 
              class="w-full text-2xl font-bold text-gray-900 dark:text-white bg-transparent border-0 focus:ring-0 focus:outline-none"
            />
            
            <!-- Content Editor -->
            <div class="mt-6">
              <textarea 
                v-if="selectedNote.is_markdown" 
                v-model="selectedNote.content" 
                @blur="saveNote" 
                placeholder="Start writing..." 
                rows="20" 
                class="w-full bg-transparent border-0 focus:ring-0 resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
              ></textarea>
              
              <!-- In a real application, you'd use a rich text editor component here for non-markdown mode -->
              <div v-else>
                <p class="text-gray-500 dark:text-gray-400 text-sm mb-2">Rich text editor would be here.</p>
                <textarea 
                  v-model="selectedNote.content" 
                  @blur="saveNote" 
                  placeholder="Start writing..." 
                  rows="20" 
                  class="w-full bg-transparent border-0 focus:ring-0 resize-none text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500"
                ></textarea>
              </div>
            </div>
          </div>
        </div>
        
<!-- Status Bar -->
<div class="border-t border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 px-4 py-2 flex justify-between items-center text-xs text-gray-500 dark:text-gray-400">
        <div v-if="selectedNote">
          <span>Last edited {{ formatDate(selectedNote.updated_at) }}</span>
        </div>
        <div class="flex items-center space-x-4">
          <button 
            v-if="selectedNote"
            @click="toggleMarkdown" 
            class="flex items-center hover:text-indigo-600 dark:hover:text-indigo-400"
            :class="{ 'text-indigo-600 dark:text-indigo-400': selectedNote.is_markdown }"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" viewBox="0 0 20 20" fill="currentColor">
              <path fill-rule="evenodd" d="M12.316 3.051a1 1 0 01.633 1.265l-4 12a1 1 0 11-1.898-.632l4-12a1 1 0 011.265-.633zM5.707 6.293a1 1 0 010 1.414L3.414 10l2.293 2.293a1 1 0 11-1.414 1.414l-3-3a1 1 0 010-1.414l3-3a1 1 0 011.414 0zm8.586 0a1 1 0 011.414 0l3 3a1 1 0 010 1.414l-3 3a1 1 0 11-1.414-1.414L16.586 10l-2.293-2.293a1 1 0 010-1.414z" clip-rule="evenodd" />
            </svg>
            <span>Markdown</span>
          </button>
          <span v-if="selectedNote">{{ formatWordCount(selectedNote.content) }}</span>
        </div>
      </div>
    </div>
    
    <!-- Share Modal -->
    <div v-if="showShareModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
      <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
        <div class="flex justify-between items-center mb-4">
          <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Share Note</h3>
          <button @click="showShareModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mb-4">
          <label for="user" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">User</label>
          <select 
            id="user" 
            v-model="shareForm.user_id" 
            class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
          >
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
              <input 
                type="radio" 
                v-model="shareForm.permission" 
                value="view" 
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">View</span>
            </label>
            <label class="flex items-center">
              <input 
                type="radio" 
                v-model="shareForm.permission" 
                value="edit" 
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Edit</span>
            </label>
            <label class="flex items-center">
              <input 
                type="radio" 
                v-model="shareForm.permission" 
                value="admin" 
                class="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 dark:border-gray-600"
              />
              <span class="ml-2 text-sm text-gray-700 dark:text-gray-300">Admin</span>
            </label>
          </div>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="button" 
            @click="showShareModal = false" 
            class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button 
            type="button" 
            @click="submitShareForm" 
            class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            :disabled="!shareForm.user_id"
          >
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
          <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
            </svg>
          </button>
        </div>
        
        <div class="mb-6">
          <p class="text-gray-700 dark:text-gray-300">
            Are you sure you want to delete the note "<span class="font-semibold">{{ selectedNote?.title }}</span>"? This action cannot be undone.
          </p>
        </div>
        
        <div class="flex justify-end">
          <button 
            type="button" 
            @click="showDeleteModal = false" 
            class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
          >
            Cancel
          </button>
          <button 
            type="button" 
            @click="confirmDelete" 
            class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
          >
            Delete Note
          </button>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { format } from 'date-fns';

definePageMeta({
  layout: 'dashboard',
});

const route = useRoute();
const router = useRouter();

// State
const notes = ref([]);
const selectedNote = ref(null);
const loading = ref(true);
const searchQuery = ref('');
const showShareModal = ref(false);
const showDeleteModal = ref(false);
const users = ref([]);
const shareForm = ref({
  user_id: '',
  permission: 'view'
});

// Computed
const filteredNotes = computed(() => {
  if (!searchQuery.value) return notes.value;
  
  const query = searchQuery.value.toLowerCase();
  return notes.value.filter(note => 
    note.title.toLowerCase().includes(query) || 
    (note.content && note.content.toLowerCase().includes(query))
  );
});

const pinnedNotes = computed(() => {
  return filteredNotes.value.filter(note => note.is_pinned);
});

const unpinnedNotes = computed(() => {
  return filteredNotes.value.filter(note => !note.is_pinned);
});

// Lifecycle
onMounted(async () => {
  await fetchNotes();
  
  // If note ID is in the route, load that note
  if (route.params.id) {
    await fetchNoteById(route.params.id);
  }
  
  // Fetch users for sharing
  await fetchUsers();
});

// Watch for changes in route
watch(() => route.params.id, async (newId) => {
  if (newId) {
    await fetchNoteById(newId);
  } else {
    selectedNote.value = null;
  }
});

// Methods
async function fetchNotes() {
  try {
    loading.value = true;
    
    // Get notes from API
    const response = await fetch('/api/api/notes', {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch notes');
    }
    
    const data = await response.json();
    notes.value = data.data;
  } catch (error) {
    console.error('Error fetching notes:', error);
    // Display error message to user
  } finally {
    loading.value = false;
  }
}

async function fetchNoteById(id) {
  try {
    // Get note from API
    const response = await fetch(`/api/api/notes/${id}`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch note');
    }
    
    const data = await response.json();
    selectedNote.value = data.data;
  } catch (error) {
    console.error('Error fetching note:', error);
    // Display error message to user
  }
}

async function fetchUsers() {
  try {
    // Get users from API
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
  } catch (error) {
    console.error('Error fetching users:', error);
    // Display error message to user
  }
}

async function createNewNote() {
  try {
    // Create new note via API
    const response = await fetch('/api/api/notes', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        title: 'Untitled',
        content: '',
        is_markdown: true
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to create note');
    }
    
    const data = await response.json();
    
    // Add new note to list
    notes.value.push(data.data);
    
    // Select the new note
    selectNote(data.data);
  } catch (error) {
    console.error('Error creating note:', error);
    // Display error message to user
  }
}

function selectNote(note) {
  // Navigate to the note route, which will trigger the watcher
  router.push(`/notes/${note.id}`);
}

async function saveNote() {
  if (!selectedNote.value) return;
  
  try {
    // Update note via API
    const response = await fetch(`/api/api/notes/${selectedNote.value.id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        title: selectedNote.value.title,
        content: selectedNote.value.content,
        is_markdown: selectedNote.value.is_markdown
      })
    });
    
    if (!response.ok) {
      throw new Error('Failed to update note');
    }
    
    // Update the note in the notes list
    const index = notes.value.findIndex(note => note.id === selectedNote.value.id);
    if (index !== -1) {
      notes.value[index] = {
        ...notes.value[index],
        title: selectedNote.value.title,
        content: selectedNote.value.content,
        updated_at: new Date().toISOString()
      };
    }
  } catch (error) {
    console.error('Error saving note:', error);
    // Display error message to user
  }
}

async function togglePin() {
  if (!selectedNote.value) return;
  
  try {
    const newPinnedState = !selectedNote.value.is_pinned;
    
    // Update note via API
    const response = await fetch(`/api/api/notes/${selectedNote.value.id}`, {
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
    
    // Update the note in state
    selectedNote.value.is_pinned = newPinnedState;
    
    // Update the note in the notes list
    const index = notes.value.findIndex(note => note.id === selectedNote.value.id);
    if (index !== -1) {
      notes.value[index].is_pinned = newPinnedState;
    }
  } catch (error) {
    console.error('Error toggling pin:', error);
    // Display error message to user
  }
}

async function toggleMarkdown() {
  if (!selectedNote.value) return;
  
  try {
    const newMarkdownState = !selectedNote.value.is_markdown;
    
    // Update note via API
    const response = await fetch(`/api/api/notes/${selectedNote.value.id}`, {
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
    
    // Update the note in state
    selectedNote.value.is_markdown = newMarkdownState;
    
    // Update the note in the notes list
    const index = notes.value.findIndex(note => note.id === selectedNote.value.id);
    if (index !== -1) {
      notes.value[index].is_markdown = newMarkdownState;
    }
  } catch (error) {
    console.error('Error toggling markdown:', error);
    // Display error message to user
  }
}

function shareNote() {
  // Reset share form
  shareForm.value = {
    user_id: '',
    permission: 'view'
  };
  
  // Show share modal
  showShareModal.value = true;
}

async function submitShareForm() {
  if (!selectedNote.value || !shareForm.value.user_id) return;
  
  try {
    // Share note via API
    const response = await fetch(`/api/api/notes/${selectedNote.value.id}/share`, {
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
    
    // Hide share modal
    showShareModal.value = false;
    
    // Show success message
    alert('Note shared successfully.');
  } catch (error) {
    console.error('Error sharing note:', error);
    alert('Failed to share note. Please try again.');
  }
}

function deleteNoteConfirm() {
  if (!selectedNote.value) return;
  
  // Show delete confirmation modal
  showDeleteModal.value = true;
}

async function confirmDelete() {
  if (!selectedNote.value) return;
  
  try {
    // Delete note via API
    const response = await fetch(`/api/api/notes/${selectedNote.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete note');
    }
    
    // Remove note from list
    notes.value = notes.value.filter(note => note.id !== selectedNote.value.id);
    
    // Clear selected note and hide modal
    showDeleteModal.value = false;
    selectedNote.value = null;
    
    // Navigate back to notes page
    router.push('/notes');
  } catch (error) {
    console.error('Error deleting note:', error);
    alert('Failed to delete note. Please try again.');
  }
}

// Helper methods
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

function stripMarkdown(text) {
  if (!text) return '';
  
  return text
    .replace(/#{1,6}\s+/g, '')          // headers
    .replace(/\*\*(.+?)\*\*/g, '$1')    // bold
    .replace(/\*(.+?)\*/g, '$1')        // italic
    .replace(/\[(.+?)\]\(.+?\)/g, '$1') // links
    .replace(/\n/g, ' ')                // new lines
    .replace(/\s+/g, ' ')               // extra spaces
    .trim();
}
</script>