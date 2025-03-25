<template>
    <div class="bg-white rounded-lg shadow p-6">
      <div class="flex justify-between items-center mb-6">
        <h2 class="text-xl font-bold">Task Statuses</h2>
        <button
          @click="showNewStatusModal = true"
          class="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm font-medium"
        >
          Add Status
        </button>
      </div>
      
      <!-- Loading state -->
      <div v-if="isLoading" class="flex justify-center py-8">
        <div class="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-blue-500"></div>
      </div>
      
      <!-- Error state -->
      <div v-else-if="error" class="bg-red-50 text-red-700 p-4 rounded-md mb-4">
        {{ error }}
      </div>
      
      <!-- Statuses List -->
      <div v-else-if="statuses.length > 0" class="space-y-3">
        <div class="flex items-center text-sm font-medium text-gray-500 px-4 pb-2">
          <span class="w-10"></span>
          <span class="flex-1">Status Name</span>
          <span class="w-16">Color</span>
          <span class="w-20">Actions</span>
        </div>
        
        <TransitionGroup name="list" tag="div" class="space-y-2">
          <div
            v-for="status in orderedStatuses"
            :key="status.id"
            class="flex items-center bg-gray-50 border border-gray-200 rounded-md px-4 py-3"
            :class="{ 'opacity-50': isDragging && draggedStatus?.id === status.id }"
            draggable="true"
            @dragstart="onDragStart($event, status)"
            @dragover.prevent
            @dragenter="onDragEnter($event, status)"
            @dragleave="onDragLeave($event)"
            @drop="onDrop($event, status)"
            @dragend="onDragEnd"
          >
            <!-- Drag handle -->
            <span class="cursor-move w-10 text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M4 8h16M4 16h16" />
              </svg>
            </span>
            
            <!-- Status name -->
            <span class="flex-1 font-medium">{{ status.name }}</span>
            
            <!-- Status color -->
            <span class="w-16 flex items-center">
              <span 
                class="w-6 h-6 rounded-md" 
                :style="{ backgroundColor: status.color || '#CCCCCC' }"
              ></span>
            </span>
            
            <!-- Actions -->
            <span class="w-20 flex gap-3">
              <button @click="editStatus(status)" class="text-gray-600 hover:text-blue-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                </svg>
              </button>
              <button @click="confirmDeleteStatus(status)" class="text-gray-600 hover:text-red-600">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                </svg>
              </button>
            </span>
          </div>
        </TransitionGroup>
      </div>
      
      <!-- Empty state -->
      <div v-else class="py-10 text-center">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 mx-auto text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p class="text-gray-500 mb-2">No statuses found</p>
        <p class="text-gray-400 text-sm">Add a new status to organize your tasks</p>
      </div>
      
      <!-- Status Form Modal -->
      <StatusFormModal
        v-if="showNewStatusModal || showEditStatusModal"
        :status="editingStatus"
        :is-edit="showEditStatusModal"
        @close="closeModals"
        @save="saveStatus"
      />
      
      <!-- Confirmation Modal -->
      <ConfirmationModal
        v-if="showDeleteModal"
        title="Delete Status"
        :message="`Are you sure you want to delete '${statusToDelete?.name}'? This action cannot be undone.`"
        confirm-text="Delete"
        confirm-color="red"
        @confirm="deleteStatus"
        @cancel="showDeleteModal = false"
      />
    </div>
  </template>
  
  <script setup lang="ts">
  import { ref, computed, onMounted, watch } from 'vue';
  import { useRoute } from 'vue-router';
  import { useProjects } from '~/composables/useProjects';
  import { useProjectsStore } from '~/stores/projects';
  import type { ProjectStatus } from '~/types/project';
  import StatusFormModal from './StatusFormModal.vue';
  import ConfirmationModal from '~/components/ui/ConfirmationModal.vue';
  
  const route = useRoute();
  const projectId = computed(() => parseInt(route.params.id as string));
  const projectsStore = useProjectsStore();
  const { 
    fetchProjectStatuses, 
    createProjectStatus, 
    updateProjectStatus, 
    deleteProjectStatus,
    reorderProjectStatuses 
  } = useProjects();
  
  // State
  const statuses = ref<ProjectStatus[]>([]);
  const isLoading = computed(() => projectsStore.loading);
  const error = computed(() => projectsStore.error);
  
  // Get ordered statuses
  const orderedStatuses = computed(() => {
    return [...statuses.value].sort((a, b) => a.order_position - b.order_position);
  });
  
  // Modal state
  const showNewStatusModal = ref(false);
  const showEditStatusModal = ref(false);
  const showDeleteModal = ref(false);
  const editingStatus = ref<ProjectStatus | null>(null);
  const statusToDelete = ref<ProjectStatus | null>(null);
  
  // Drag and drop state
  const isDragging = ref(false);
  const draggedStatus = ref<ProjectStatus | null>(null);
  
  // Watch for project ID changes and fetch statuses
  watch(() => projectId.value, async (newId) => {
    if (newId) {
      await loadStatuses();
    }
  }, { immediate: true });
  
  // Fetch statuses on mount
  onMounted(async () => {
    if (projectId.value) {
      await loadStatuses();
    }
  });
  
  async function loadStatuses() {
    const fetchedStatuses = await fetchProjectStatuses(projectId.value);
    statuses.value = fetchedStatuses;
  }
  
  // Methods
  const closeModals = () => {
    showNewStatusModal.value = false;
    showEditStatusModal.value = false;
    editingStatus.value = null;
  };
  
  const editStatus = (status: ProjectStatus) => {
    editingStatus.value = { ...status };
    showEditStatusModal.value = true;
  };
  
  const saveStatus = async (statusData: { name: string; color?: string }) => {
    try {
      if (showEditStatusModal.value && editingStatus.value) {
        await updateProjectStatus(projectId.value, editingStatus.value.id, statusData);
      } else {
        await createProjectStatus(projectId.value, statusData);
      }
      closeModals();
      await loadStatuses(); // Refresh the list
    } catch (error) {
      console.error('Failed to save status:', error);
    }
  };
  
  const confirmDeleteStatus = (status: ProjectStatus) => {
    statusToDelete.value = status;
    showDeleteModal.value = true;
  };
  
  const deleteStatus = async () => {
    if (!statusToDelete.value) return;
    
    try {
      await deleteProjectStatus(projectId.value, statusToDelete.value.id);
      showDeleteModal.value = false;
      statusToDelete.value = null;
      await loadStatuses(); // Refresh the list
    } catch (error) {
      console.error('Failed to delete status:', error);
    }
  };
  
  // Drag and drop handlers
  const onDragStart = (event: DragEvent, status: ProjectStatus) => {
    isDragging.value = true;
    draggedStatus.value = status;
    if (event.dataTransfer) {
      event.dataTransfer.effectAllowed = 'move';
    }
    
    // Add styling to show dragging element
    if (event.target instanceof HTMLElement) {
      event.target.classList.add('opacity-50');
    }
  };
  
  const onDragEnter = (event: DragEvent, status: ProjectStatus) => {
    if (draggedStatus.value && draggedStatus.value.id !== status.id) {
      if (event.currentTarget instanceof HTMLElement) {
        event.currentTarget.classList.add('bg-blue-50', 'border-blue-300');
      }
    }
  };
  
  const onDragLeave = (event: DragEvent) => {
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
    }
  };
  
  const onDragEnd = (event: DragEvent) => {
    isDragging.value = false;
    draggedStatus.value = null;
    
    if (event.target instanceof HTMLElement) {
      event.target.classList.remove('opacity-50');
    }
    
    // Remove all drag styles
    document.querySelectorAll('[draggable="true"]').forEach(el => {
      if (el instanceof HTMLElement) {
        el.classList.remove('bg-blue-50', 'border-blue-300');
      }
    });
  };
  
  const onDrop = async (event: DragEvent, targetStatus: ProjectStatus) => {
    if (!draggedStatus.value || draggedStatus.value.id === targetStatus.id) {
      return;
    }
    
    // Remove drag styling
    if (event.currentTarget instanceof HTMLElement) {
      event.currentTarget.classList.remove('bg-blue-50', 'border-blue-300');
    }
    
    // Create a new order array
    const statusOrder = orderedStatuses.value.map(status => status.id);
    
    // Get the positions
    const draggedIndex = statusOrder.indexOf(draggedStatus.value.id);
    const targetIndex = statusOrder.indexOf(targetStatus.id);
    
    // Reorder the array
    statusOrder.splice(draggedIndex, 1);
    statusOrder.splice(targetIndex, 0, draggedStatus.value.id);
    
    // Save the new order
    try {
      await reorderProjectStatuses(projectId.value, statusOrder);
      await loadStatuses(); // Refresh with the new order
    } catch (error) {
      console.error('Failed to reorder statuses:', error);
    }
  };
  </script>
  
  <style scoped>
  .list-move, /* apply transition to moving elements */
  .list-enter-active,
  .list-leave-active {
    transition: all 0.3s ease;
  }
  
  .list-enter-from,
  .list-leave-to {
    opacity: 0;
    transform: translateY(30px);
  }
  
  /* ensure leaving items are taken out of layout flow so that moving
     animations can be calculated correctly. */
  .list-leave-active {
    position: absolute;
  }
  </style>