<!-- pages/tasks/[id].vue -->
<template>
    <div class="flex h-screen bg-gray-50 dark:bg-gray-900 overflow-hidden">
      <!-- Main Content -->
      <div class="flex-1 flex flex-col overflow-hidden">
        <!-- Topbar -->
        <div class="border-b border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
          <div class="flex items-center justify-between h-16 px-4">
            <div class="flex items-center">
              <button 
                @click="navigateBack" 
                class="mr-3 text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
              >
                <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                  <path fill-rule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clip-rule="evenodd" />
                </svg>
              </button>
              <h1 class="text-lg font-medium text-gray-900 dark:text-white flex items-center">
                <span v-if="loading">Loading task...</span>
                <template v-else-if="task">
                  <span 
                    class="w-3 h-3 rounded-full mr-2" 
                    :style="{ backgroundColor: getStatusColor() }"
                  ></span>
                  {{ task.title }}
                </template>
              </h1>
            </div>
            
            <div class="flex items-center space-x-4" v-if="task">
              <span 
                class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium"
                :class="getPriorityClass()"
              >
                {{ getPriorityLabel() }}
              </span>
              
              <div class="relative">
                <button 
                  @click="showMoreMenu = !showMoreMenu" 
                  class="text-gray-500 hover:text-indigo-600 dark:text-gray-400 dark:hover:text-indigo-400"
                  title="More actions"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path d="M10 6a2 2 0 110-4 2 2 0 010 4zM10 12a2 2 0 110-4 2 2 0 010 4zM10 18a2 2 0 110-4 2 2 0 010 4z" />
                  </svg>
                </button>
                
                <!-- More Menu -->
                <div 
                  v-if="showMoreMenu" 
                  class="origin-top-right absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white dark:bg-gray-800 ring-1 ring-black ring-opacity-5 focus:outline-none z-50"
                >
                  <div class="py-1" role="menu" aria-orientation="vertical">
                    <button 
                      @click="editTask" 
                      class="w-full text-left px-4 py-2 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700" 
                      role="menuitem"
                    >
                      Edit Task
                    </button>
                    <button 
                      @click="deleteTaskConfirm" 
                      class="w-full text-left px-4 py-2 text-sm text-red-600 dark:text-red-400 hover:bg-gray-100 dark:hover:bg-gray-700" 
                      role="menuitem"
                    >
                      Delete Task
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        <!-- Task Content Area -->
        <div class="flex-1 overflow-y-auto bg-white dark:bg-gray-800">
          <div v-if="loading" class="flex items-center justify-center h-full">
            <div class="animate-spin h-8 w-8 border-t-2 border-b-2 border-indigo-500 rounded-full"></div>
            <p class="ml-3 text-gray-500 dark:text-gray-400">Loading task...</p>
          </div>
  
          <div v-else-if="error" class="flex flex-col items-center justify-center h-full">
            <svg xmlns="http://www.w3.org/2000/svg" class="h-12 w-12 text-red-500" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="1" d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <p class="mt-2 text-red-500">{{ error }}</p>
            <button 
              @click="fetchTask" 
              class="mt-4 px-4 py-2 bg-indigo-600 text-white rounded-md text-sm hover:bg-indigo-700"
            >
              Try Again
            </button>
          </div>
            
          <div v-else-if="task" class="max-w-4xl mx-auto p-6">
            <!-- Task Header -->
            <div class="flex items-start justify-between mb-6">
              <div>
                <h2 class="text-2xl font-bold text-gray-900 dark:text-white">
                  {{ task.title }}
                </h2>
                <div class="mt-1 flex items-center text-sm text-gray-500 dark:text-gray-400">
                  <span>#{{ task.id }} • Created by {{ task.created_by_name }} on {{ formatDate(task.created_at) }}</span>
                </div>
              </div>
              
              <div class="flex items-center space-x-2">
                <button 
                  v-if="!isTimeTrackingActive" 
                  @click="startTimeTracking" 
                  class="inline-flex items-center px-3 py-1.5 border border-green-500 text-sm font-medium rounded-md text-green-500 bg-white dark:bg-gray-800 hover:bg-green-50 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M14.752 11.168l-3.197-2.132A1 1 0 0010 9.87v4.263a1 1 0 001.555.832l3.197-2.132a1 1 0 000-1.664z" />
                  </svg>
                  Start Time
                </button>
                <button 
                  v-else 
                  @click="stopTimeTracking" 
                  class="inline-flex items-center px-3 py-1.5 border border-red-500 text-sm font-medium rounded-md text-red-500 bg-white dark:bg-gray-800 hover:bg-red-50 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 10a1 1 0 011-1h4a1 1 0 011 1v4a1 1 0 01-1 1h-4a1 1 0 01-1-1v-4z" />
                  </svg>
                  Stop Time ({{ formatTimeTracking() }})
                </button>
              </div>
            </div>
            
            <!-- Task Details -->
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <!-- Left Column - Description and Comments -->
              <div class="md:col-span-2 space-y-6">
                <!-- Description -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Description</h3>
                  <div class="prose prose-sm max-w-none dark:prose-invert">
                    <div v-if="task.description" v-html="task.description"></div>
                    <div v-else class="text-gray-500 dark:text-gray-400 italic">No description provided</div>
                  </div>
                </div>
                
                <!-- Checklists -->
                <div v-if="checklists && checklists.length > 0" class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                    <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Checklists</h3>
                    <div v-for="checklist in checklists" :key="checklist.id" class="mb-4">
                        <div class="flex items-center justify-between mb-2">
                        <h4 class="font-medium text-gray-800 dark:text-gray-200">{{ checklist.title }}</h4>
                        <div class="flex items-center">
                            <div class="text-sm text-gray-500 dark:text-gray-400 mr-2">
                            {{ getCompletedItems(checklist) }} of {{ (checklist.ChecklistItems || checklist.items || []).length }} completed
                            </div>
                            <button 
                            @click="deleteChecklistConfirm(checklist)"
                            class="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                            title="Delete checklist"
                            >
                            <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                            </svg>
                            </button>
                        </div>
                        </div>
                        
                        <!-- Rest of the checklist items code remains the same -->
                        <div class="space-y-2">
                        <div 
                            v-for="item in (checklist.ChecklistItems || checklist.items || [])" 
                            :key="item.id" 
                            class="flex items-start"
                        >
                            <input 
                            type="checkbox" 
                            :checked="item.is_completed" 
                            @change="toggleChecklistItem(checklist.id, item.id)" 
                            class="mt-1 h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded dark:bg-gray-700 dark:border-gray-600"
                            />
                            <span 
                            class="ml-2 text-gray-800 dark:text-gray-200"
                            :class="{ 'line-through text-gray-500 dark:text-gray-400': item.is_completed }"
                            >
                            {{ item.content }}
                            </span>
                        </div>
                        </div>
                    </div>
                    
                    <button 
                        @click="addNewChecklistItem" 
                        class="mt-3 inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
                        </svg>
                        Add New Item
                    </button>
                    </div>
                
                <!-- Add Checklist Button -->
                <button
                  @click="addNewChecklist"
                  class="inline-flex items-center px-3 py-1.5 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                  Add Checklist
                </button>
                
                <!-- Comments -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-3">Comments</h3>
                  
                  <!-- Comment List -->
                  <div class="space-y-4 mb-4">
                    <div 
                      v-for="comment in comments" 
                      :key="comment.id" 
                      class="flex space-x-3"
                    >
                      <div class="flex-shrink-0">
                        <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                          {{ getInitials(comment.User.first_name) }}
                        </div>
                      </div>
                      <div class="flex-1 bg-white dark:bg-gray-800 rounded-lg p-3 shadow-sm">
                        <div class="flex items-center justify-between">
                          <h4 class="text-sm font-medium text-gray-300 dark:text-white">
                            {{ comment.User.first_name }}
                          </h4>
                          <span class="text-xs text-gray-500 dark:text-gray-400">
                            {{ formatDate(comment.created_at) }}
                          </span>
                        </div>
                        <div class="mt-1 text-sm text-gray-800 dark:text-gray-200">
                          {{ comment.content }}
                        </div>
                      </div>
                    </div>
                  </div>
                  
                  <!-- Add Comment -->
                  <div class="mt-3">
                    <label for="comment" class="sr-only">Add a comment</label>
                    <textarea
                      id="comment"
                      v-model="newComment"
                      rows="3"
                      class="block w-full shadow-sm sm:text-sm focus:ring-indigo-500 focus:border-indigo-500 border border-gray-300 dark:border-gray-600 rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                      placeholder="Add a comment..."
                    ></textarea>
                    <div class="mt-2 flex justify-end">
                      <button
                        @click="addComment"
                        :disabled="!newComment.trim()"
                        class="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50"
                      >
                        Add Comment
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Right Column - Metadata and Actions -->
              <div class="space-y-6">
                <!-- Status -->

                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Status</h3>
                  <div v-if="statusesLoading" class="py-2">
                    <div class="animate-pulse h-8 bg-gray-200 dark:bg-gray-700 rounded"></div>
                  </div>
                  <div v-else-if="statusesError" class="text-red-500 text-sm">
                    {{ statusesError }}
                    <button 
                      @click="fetchStatuses" 
                      class="ml-2 text-indigo-600 hover:text-indigo-500"
                    >
                      Retry
                    </button>
                  </div>
                  <div v-else>
                    <div class="flex items-center">
                      <span 
                        v-if="getStatusColor() !== '#cccccc'" 
                        class="w-3 h-3 rounded-full mr-2" 
                        :style="{ backgroundColor: getStatusColor() }"
                      ></span>
                      <select
                        v-model="task.status_id"
                        @change="updateTaskStatus"
                        class="flex-1 pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                        :disabled="statusUpdateLoading"
                      >
                        <option 
                          v-for="status in statuses" 
                          :key="status.id" 
                          :value="status.id"
                        >
                          {{ status.name }}
                        </option>
                      </select>
                    </div>
                    
                    <!-- Debug info for development - remove in production -->
                    <div v-if="statuses.length === 0" class="mt-2 text-xs text-red-500">
                      No statuses available. Check console for details.
                    </div>
                    
                    <div v-if="statusUpdateLoading" class="mt-2 text-sm text-indigo-600 dark:text-indigo-400 flex items-center">
                      <svg class="animate-spin h-4 w-4 mr-2 text-indigo-600" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                        <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      Updating status...
                    </div>
                    <div v-if="statusUpdateError" class="mt-2 text-sm text-red-500 dark:text-red-400">
                      {{ statusUpdateError }}
                    </div>
                  </div>
                  </div>
                
                <!-- Assignee -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Assignee</h3>
                  <div v-if="task.assignee_id" class="flex items-center">
                    <div class="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center text-white font-medium">
                      {{ getInitials(task.assignee.first_name) }}
                    </div>
                    <span class="ml-2 text-gray-800 dark:text-gray-200">{{ task.assignee.first_name }} {{ task.assignee.last_name  }}</span>
                  </div>
                  <div v-else class="text-gray-500 dark:text-gray-400 italic">Unassigned</div>
                  
                  <button
                    @click="showAssigneeModal = true"
                    class="mt-3 inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                    </svg>
                    Change Assignee
                  </button>
                </div>
                
                <!-- Due Date -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Due Date</h3>
                  <div v-if="task.due_date" class="flex items-center">
                    <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                    <span 
                      class="ml-2 text-gray-800 dark:text-gray-200"
                      :class="{ 'text-red-600 dark:text-red-400': isOverdue() }"
                    >
                      {{ formatDate(task.due_date) }}
                      <span v-if="isOverdue()" class="text-red-600 dark:text-red-400 ml-1">(Overdue)</span>
                    </span>
                  </div>
                  <div v-else class="text-gray-500 dark:text-gray-400 italic">No due date</div>
                  
                  <div class="mt-3 grid grid-cols-1 gap-3">
                    <button
                      @click="showDueDateModal = true"
                      class="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
                      </svg>
                      Set Due Date
                    </button>
                    
                    <button
                      v-if="task.due_date"
                      @click="removeDueDate"
                      class="inline-flex items-center px-3 py-1 border border-gray-300 dark:border-gray-600 text-sm font-medium rounded-md text-gray-700 dark:text-gray-300 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                      </svg>
                      Remove Due Date
                    </button>
                  </div>
                </div>
                
                <!-- Priority -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Priority</h3>
                  <select
                    v-model="task.priority_id"
                    @change="updateTaskPriority"
                    class="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 dark:border-gray-600 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm rounded-md bg-white dark:bg-gray-800 text-gray-800 dark:text-gray-200"
                  >
                    <option 
                      v-for="priority in priorities" 
                      :key="priority.id" 
                      :value="priority.id"
                    >
                      {{ priority.name }}
                    </option>
                  </select>
                </div>
                
                <!-- Time Tracking Summary -->
                <div class="bg-gray-50 dark:bg-gray-900 rounded-lg p-4">
                  <h3 class="text-sm font-medium text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-2">Time Tracking</h3>
                  <div class="flex items-center justify-between">
                    <span class="text-gray-800 dark:text-gray-200">Total Time Spent</span>
                    <span class="font-medium text-gray-900 dark:text-white">{{ formatMinutes(totalTimeSpent) }}</span>
                  </div>
                  
                  <div class="mt-3">
                    <div class="text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Recent Time Entries</div>
                    <div v-if="timeEntries.length === 0" class="text-gray-500 dark:text-gray-400 italic text-sm">No time entries yet</div>
                    <div v-else class="space-y-2 max-h-40 overflow-y-auto">
                      <div 
                        v-for="entry in timeEntries" 
                        :key="entry.id" 
                        class="bg-white dark:bg-gray-800 rounded p-2 text-sm"
                      >
                        <div class="flex items-center justify-between">
                          <span class="text-gray-800 dark:text-gray-200">{{ formatDate(entry.start_time) }}</span>
                          <span class="font-medium text-gray-900 dark:text-white">{{ formatMinutes(entry.duration) }}</span>
                        </div>
                        <p v-if="entry.description" class="text-gray-500 dark:text-gray-400 mt-1 text-xs">
                          {{ entry.description }}
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Edit Task Modal -->
      <div v-if="showEditModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Edit Task</h3>
            <button @click="showEditModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="space-y-4">
            <div>
              <label for="title" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Title</label>
              <input 
                type="text" 
                id="title" 
                v-model="editForm.title" 
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              />
            </div>
            
            <div>
              <label for="description" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
              <textarea 
                id="description" 
                v-model="editForm.description" 
                rows="4"
                class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              ></textarea>
            </div>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button 
              type="button" 
              @click="showEditModal = false" 
              class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="button" 
              @click="updateTask" 
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Save Changes
            </button>
          </div>
        </div>
      </div>
      
      <!-- Delete Confirmation Modal -->
      <div v-if="showDeleteModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Task</h3>
            <button @click="showDeleteModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div class="mb-6">
            <p class="text-gray-700 dark:text-gray-300">
              Are you sure you want to delete the task "<span class="font-semibold">{{ task?.title }}</span>"? This action cannot be undone.
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
              @click="deleteTask" 
              class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
            >
              Delete Task
            </button>
          </div>
        </div>
      </div>
      
      <!-- Assignee Modal -->
      <div v-if="showAssigneeModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Change Assignee</h3>
            <button @click="showAssigneeModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div>
            <label for="assignee" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Assignee</label>
            <select 
              id="assignee" 
              v-model="selectedAssignee" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option :value="null">Unassigned</option>
              <option 
                v-for="user in users" 
                :key="user.id" 
                :value="user.id"
              >
                {{ user.first_name }} {{ user.last_name }}
              </option>
            </select>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button 
              type="button" 
              @click="showAssigneeModal = false" 
              class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="button" 
              @click="updateAssignee" 
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
      
      <!-- Due Date Modal -->
      <div v-if="showDueDateModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Set Due Date</h3>
            <button @click="showDueDateModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div>
            <label for="dueDate" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Due Date</label>
            <input 
              type="datetime-local" 
              id="dueDate" 
              v-model="selectedDueDate" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            />
          </div>
          
          <div class="mt-6 flex justify-end">
            <button 
              type="button" 
              @click="showDueDateModal = false" 
              class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="button" 
              @click="updateDueDate" 
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
            >
              Save
            </button>
          </div>
        </div>
      </div>
  
      <!-- New Checklist Modal -->
      <div v-if="showChecklistModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Checklist</h3>
            <button @click="showChecklistModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div>
            <label for="checklistTitle" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Checklist Title</label>
            <input 
              type="text" 
              id="checklistTitle" 
              v-model="newChecklist.title" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Testing Steps"
            />
          </div>
          
          <div class="mt-4">
            <label class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Items</label>
            <div class="space-y-2">
              <div 
                v-for="(item, index) in newChecklist.items" 
                :key="index"
                class="flex items-center"
              >
                <input 
                  type="text" 
                  v-model="item.content" 
                  class="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  placeholder="Checklist item"
                />
                <button 
                  @click="removeChecklistItem(index)" 
                  class="ml-2 text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
            
            <button 
              @click="addChecklistItem" 
              class="mt-2 inline-flex items-center text-sm text-indigo-600 dark:text-indigo-400 hover:text-indigo-500 dark:hover:text-indigo-300"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4 mr-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 4v16m8-8H4" />
              </svg>
              Add Item
            </button>
          </div>
          
          <div class="mt-6 flex justify-end">
            <button 
              type="button" 
              @click="showChecklistModal = false" 
              class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="button" 
              @click="createChecklist" 
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              :disabled="!newChecklist.title.trim() || newChecklist.items.length === 0"
            >
              Save
            </button>
          </div>
        </div>
      </div>
  
      <!-- New Checklist Item Modal -->
      <div v-if="showChecklistItemModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
        <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
          <div class="flex justify-between items-center mb-4">
            <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Add Checklist Item</h3>
            <button @click="showChecklistItemModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
              <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
          
          <div>
            <label for="checklistSelect" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Select Checklist</label>
            <select 
              id="checklistSelect" 
              v-model="selectedChecklistId" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
            >
              <option 
                v-for="checklist in checklists" 
                :key="checklist.id" 
                :value="checklist.id"
              >
                {{ checklist.title }}
              </option>
            </select>
          </div>
          
          <div class="mt-4">
            <label for="itemContent" class="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Item Content</label>
            <input 
              type="text" 
              id="itemContent" 
              v-model="newChecklistItem.content" 
              class="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
              placeholder="e.g., Verify user login works"
            />
          </div>
          
          <div class="mt-6 flex justify-end">
            <button 
              type="button" 
              @click="showChecklistItemModal = false" 
              class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
            >
              Cancel
            </button>
            <button 
              type="button" 
              @click="createChecklistItem" 
              class="px-4 py-2 bg-indigo-600 text-white rounded-md text-sm font-medium hover:bg-indigo-700"
              :disabled="!newChecklistItem.content.trim() || !selectedChecklistId"
            >
              Save
            </button>
          </div>
        </div>
      </div>

      <!-- Add Delete Checklist Confirmation Modal -->
<div v-if="showDeleteChecklistModal" class="fixed inset-0 bg-gray-900 bg-opacity-50 flex items-center justify-center z-50">
  <div class="bg-white dark:bg-gray-800 rounded-lg shadow-lg max-w-md w-full p-6">
    <div class="flex justify-between items-center mb-4">
      <h3 class="text-lg font-semibold text-gray-900 dark:text-white">Delete Checklist</h3>
      <button @click="showDeleteChecklistModal = false" class="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300">
        <svg xmlns="http://www.w3.org/2000/svg" class="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
        </svg>
      </button>
    </div>
    
    <div class="mb-6">
      <p class="text-gray-700 dark:text-gray-300">
        Are you sure you want to delete the checklist "<span class="font-semibold">{{ selectedChecklist?.title }}</span>"? This will remove all checklist items as well.
      </p>
    </div>
    
    <div class="flex justify-end">
      <button 
        type="button" 
        @click="showDeleteChecklistModal = false" 
        class="mr-3 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-md text-sm font-medium text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700"
      >
        Cancel
      </button>
      <button 
        type="button" 
        @click="deleteChecklist" 
        class="px-4 py-2 bg-red-600 text-white rounded-md text-sm font-medium hover:bg-red-700"
      >
        Delete Checklist
      </button>
    </div>
  </div>
</div>


    </div>
  </template>
  
  <script setup>
  import { ref, computed, onMounted, onBeforeUnmount } from 'vue';
  import { useRoute, useRouter } from 'vue-router';
  import { io } from 'socket.io-client';

  const { $socket } = useNuxtApp();
  let taskSocket = null;
  
  definePageMeta({
    layout: 'dashboard'
  });
  
  const route = useRoute();
  const router = useRouter();
  const taskId = route.params.id;
  
  // State
  const task = ref(null);
  const loading = ref(true);
  const error = ref(null);
  const comments = ref([]);
  const checklists = ref([]);
  const timeEntries = ref([]);
  const statuses = ref([]);
  const priorities = ref([]);
  const users = ref([]);
  const projects = ref([]);

 // New state variables for status handling
  const statusesLoading = ref(false);
  const statusesError = ref(null);
  const statusUpdateLoading = ref(false);
  const statusUpdateError = ref(null);

  const newComment = ref('');
  const showMoreMenu = ref(false);
  const showEditModal = ref(false);
  const showDeleteModal = ref(false);
  const showAssigneeModal = ref(false);
  const showDueDateModal = ref(false);
  const showChecklistModal = ref(false);
  const showChecklistItemModal = ref(false);
  const selectedAssignee = ref(null);
  const selectedDueDate = ref('');
  const selectedChecklistId = ref(null);
  const newChecklist = ref({
    title: '',
    items: []
  });
  const newChecklistItem = ref({
    content: '',
    is_completed: false
  });
  const editForm = ref({
    title: '',
    description: ''
  });
  const isTimeTrackingActive = ref(false);
  const timeTrackingStartTime = ref(null);
  const currentTimeEntry = ref(null);
  const socket = ref(null);
  const totalTimeSpent = ref(0);

  const showDeleteChecklistModal = ref(false);
  const selectedChecklist = ref(null);
  
  // Computed
  const getStatusColor = () => {
    if (!task.value || !statuses.value.length) return '#cccccc';
    
    const status = statuses.value.find(s => s.id === task.value.status_id);
    return status ? status.color : '#cccccc';
  };
  
  const getPriorityLabel = () => {
    if (!task.value || !priorities.value.length) return 'No Priority';
    
    const priority = priorities.value.find(p => p.id === task.value.priority_id);
    return priority ? priority.name : 'No Priority';
  };
  
  const getPriorityClass = () => {
    if (!task.value || !priorities.value.length) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    const priority = priorities.value.find(p => p.id === task.value.priority_id);
    if (!priority) return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    
    switch (priority.name.toLowerCase()) {
      case 'urgent':
        return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
      case 'high':
        return 'bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300';
      case 'medium':
        return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
      case 'low':
        return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
      default:
        return 'bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300';
    }
  };
  
  // Lifecycle
  onMounted(async () => {
    await Promise.all([
      fetchTask(),
      fetchPriorities(),
      fetchUsers(),
      fetchComments(),
      fetchChecklists(),
      fetchTimeEntries(),
      
    ]);
    
    // Connect to socket
    connectSocket();
    
    // Listen for click events to hide menus
    document.addEventListener('click', handleDocumentClick);
  });
  
  onBeforeUnmount(() => {
  // Clean up
  document.removeEventListener('click', handleDocumentClick);
  
  // Leave task room if socket is connected
  if (taskSocket) {
    taskSocket.emit('leave-task', taskId);
  }
  
  // Stop time tracking if active
  if (isTimeTrackingActive.value) {
    stopTimeTracking();
  }
});
  
  // Methods
  async function fetchTask() {
    loading.value = true;
    error.value = null;
    
    try {
      const response = await fetch(`/api/api/tasks/${taskId}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch task');
      }
      
      const data = await response.json();
      task.value = data.data;
      fetchStatuses(),
      
      // Initialize edit form
      editForm.value = {
        title: task.value.title,
        description: task.value.description || ''
      };
      
      // Initialize assignee
      selectedAssignee.value = task.value.assignee_id;
      
      // Initialize due date
      if (task.value.due_date) {
        selectedDueDate.value = formatDateForInput(task.value.due_date);
      }
    } catch (err) {
      console.error('Error fetching task:', err);
      error.value = 'Failed to load task. Please try again.';
    } finally {
      loading.value = false;
    }
  }
  
  async function fetchStatuses() {
    statusesLoading.value = true;
    statusesError.value = null;
    
    try {
      const projectId = task.value?.Project.id;
      //console.error('Project ID not available in task data:', task.value);
      // if (!projectId) {
      //   console.error('Project ID not available in task data:', task.value);
      //   throw new Error('Project ID not found');
      // }
      
      console.log(`Fetching statuses for project ID: ${projectId}`);
      
      const response = await fetch(`/api/api/projects/${projectId}/statuses`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      console.log('Status API response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = `Failed to fetch statuses (Status: ${response.status})`;
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          // If JSON parsing fails, use the default error message
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('Raw statuses response:', data);
      
      // Handle different API response formats
      let statusesData;
      if (Array.isArray(data)) {
        statusesData = data;
      } else if (data.data && Array.isArray(data.data)) {
        statusesData = data.data;
      } else if (data.statuses && Array.isArray(data.statuses)) {
        statusesData = data.statuses;
      } else {
        console.warn('Unexpected statuses data format:', data);
        // Fallback to empty array but don't throw error
        statusesData = [];
      }
      
      if (statusesData.length === 0) {
        console.warn('No statuses found for this project - using default statuses');
        // Provide default statuses if none are returned
        statusesData = [
          { id: 1, name: "To Do", color: "#cccccc" },
          { id: 2, name: "In Progress", color: "#3498db" },
          { id: 3, name: "Done", color: "#2ecc71" }
        ];
      }
      
      statuses.value = statusesData;
      console.log('Processed statuses:', statuses.value);
    } catch (err) {
      console.error('Error fetching statuses:', err);
      statusesError.value = err.message || 'Failed to load task statuses';
      
      // Fallback to default statuses in case of error
      statuses.value = [
        { id: 1, name: "To Do", color: "#cccccc" },
        { id: 2, name: "In Progress", color: "#3498db" },
        { id: 3, name: "Done", color: "#2ecc71" }
      ];
      console.log('Using fallback default statuses');
    } finally {
      statusesLoading.value = false;
    }
  }
  
  async function fetchPriorities() {
    try {
      const response = await fetch('/api/api/priorities', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch priorities');
      }
      
      const data = await response.json();
      priorities.value = data.data;
    } catch (err) {
      console.error('Error fetching priorities:', err);
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
  
  async function fetchComments() {
    try {
      const response = await fetch(`/api/api/tasks/${taskId}/comments`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch comments');
      }
      
      const data = await response.json();
      comments.value = data.data;
    } catch (err) {
      console.error('Error fetching comments:', err);
    }
  }
  
  async function fetchChecklists() {
  try {
    const response = await fetch(`/api/api/tasks/${taskId}/checklists`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to fetch checklists');
    }
    
    const data = await response.json();
    
    // Process the checklists to normalize the data structure
    checklists.value = data.data.map(checklist => {
      // If the API sends ChecklistItems, normalize it to items for consistent usage in UI
      if (checklist.ChecklistItems) {
        return {
          ...checklist,
          items: checklist.ChecklistItems
        };
      }
      return checklist;
    });
    
    console.log('Fetched checklists:', checklists.value);
  } catch (err) {
    console.error('Error fetching checklists:', err);
  }
}
  
async function fetchTimeEntries() {
  try {
    const response = await fetch(`/api/api/tasks/${taskId}/time-entries`, {
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        console.warn('Time entries endpoint not found. The route might not be implemented yet.');
        return;
      }
      throw new Error('Failed to fetch time entries');
    }
    
    const data = await response.json();
    console.log('Full time entries response:', data);
    
    // Make sure we have an array of time entries
    timeEntries.value = Array.isArray(data.data) ? data.data : [];
    console.log('Time entries array:', timeEntries.value);
    
    // Update total time spent
    if (data.meta && data.meta.totalTimeSpent !== undefined) {
      totalTimeSpent.value = data.meta.totalTimeSpent;
    } else {
      // Fallback calculation if meta data isn't provided
      totalTimeSpent.value = timeEntries.value.reduce((total, entry) => {
        return total + (entry.duration || 0);
      }, 0);
    }
    
    // Log all entries to check their structure
    timeEntries.value.forEach((entry, index) => {
      console.log(`Entry ${index}:`, entry);
      console.log(`  Has end_time:`, entry.end_time !== undefined);
      console.log(`  end_time value:`, entry.end_time);
      console.log(`  !entry.end_time:`, !entry.end_time);
    });
    
    // More robust detection of active time entry
    const activeEntry = timeEntries.value.find(entry => {
      // Check for null, undefined, or empty string
      return entry.end_time === null || 
             entry.end_time === undefined || 
             entry.end_time === "";
    });
    
    console.log('Active entry found:', activeEntry);
    
    if (activeEntry) {
      isTimeTrackingActive.value = true;
      currentTimeEntry.value = activeEntry;
      timeTrackingStartTime.value = new Date(activeEntry.start_time);
      
      // Start the timer
      startTimeTrackingTimer();
      console.log('Time tracking activated for entry:', activeEntry.id);
    } else {
      console.log('No active time entry found');
      isTimeTrackingActive.value = false;
      currentTimeEntry.value = null;
      timeTrackingStartTime.value = null;
    }
    
  } catch (err) {
    console.error('Error fetching time entries:', err);
  }
}
  
  function connectSocket() {
    if (!taskSocket) {
        // Get socket from the plugin
        taskSocket = $socket.getSocket();
        
        if (taskSocket) {
        console.log('Using socket connection from plugin');
        
        // Join task room
        taskSocket.emit('join-task', taskId);
        
        // Set up event listeners
        taskSocket.on('task-updated', data => {
            if (data.id === parseInt(taskId)) {
            task.value = { ...task.value, ...data };
            }
        });
        
        // Listen for comment updates
        taskSocket.on('new-comment', data => {
            if (data.task_id === parseInt(taskId)) {
            comments.value.push(data);
            }
        });
        
        // Listen for checklist updates
        taskSocket.on('checklist-updated', data => {
            fetchChecklists();
        });
        
        // Listen for time entry updates
        taskSocket.on('time-entry-updated', data => {
            fetchTimeEntries();
        });
        } else {
        console.warn('Socket connection not available');
        // Set up polling as fallback
        setupPollingFallback();
        }
    }
    }

    function setupPollingFallback() {
  console.log('Setting up polling fallback for real-time updates');
  
  const pollingInterval = setInterval(() => {
    if (task.value) {
      fetchTask();
      fetchComments();
      fetchChecklists();
      fetchTimeEntries();
    }
  }, 10000); // Poll every 10 seconds
  
  // Clean up on component unmount
  onBeforeUnmount(() => {
    clearInterval(pollingInterval);
  });
}
  
  function handleDocumentClick(event) {
    // Hide more menu if clicked outside
    if (showMoreMenu.value && !event.target.closest('.relative')) {
      showMoreMenu.value = false;
    }
  }
  
  function navigateBack() {
    router.push('/tasks');
  }
  
  function editTask() {
    showMoreMenu.value = false;
    showEditModal.value = true;
    
    // Reset form with current task data
    editForm.value = {
      title: task.value.title,
      description: task.value.description || ''
    };
  }
  
  async function updateTask() {
    try {
      const response = await fetch(`/api/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: editForm.value.title,
          description: editForm.value.description
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task');
      }
      
      const data = await response.json();
      task.value = data.data;
      
      showEditModal.value = false;
    } catch (err) {
      console.error('Error updating task:', err);
      alert('Failed to update task. Please try again.');
    }
  }
  
  function deleteTaskConfirm() {
    showMoreMenu.value = false;
    showDeleteModal.value = true;
  }
  
  async function deleteTask() {
    try {
      const response = await fetch(`/api/api/tasks/${taskId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      
      if (!response.ok) {
        throw new Error('Failed to delete task');
      }
      
      showDeleteModal.value = false;
      router.push('/tasks');
    } catch (err) {
      console.error('Error deleting task:', err);
      alert('Failed to delete task. Please try again.');
    }
  }
  
  async function updateTaskStatus() {
    if (!task.value) {
      console.error('Cannot update status: Task data is not available');
      return;
    }
    
    // Save the current status before updating
    const previousStatusId = task.value.status_id;
    
    statusUpdateLoading.value = true;
    statusUpdateError.value = null;
    
    try {
      console.log(`Updating task status to: ${task.value.status_id}`);
      
      // Get the status name for better logging
      const statusName = statuses.value.find(s => s.id === task.value.status_id)?.name || 'Unknown';
      console.log(`Status name: ${statusName}`);
      
      const response = await fetch(`/api/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          status_id: task.value.status_id
        })
      });
      
      console.log('Status update response code:', response.status);
      
      if (!response.ok) {
        let errorMessage = `Failed to update task status (${response.status})`;
        try {
          const errorData = await response.json();
          console.error('Error response data:', errorData);
          errorMessage = errorData.error || errorMessage;
        } catch (e) {
          console.error('Failed to parse error response:', e);
        }
        throw new Error(errorMessage);
      }
      
      // Parse the response data
      let data;
      try {
        data = await response.json();
        console.log('Status update response data:', data);
      } catch (e) {
        console.warn('No JSON response from status update');
      }
      
      // Emit event to socket if available
      if (taskSocket) {
        taskSocket.emit('update-task', {
          id: parseInt(taskId),
          status_id: task.value.status_id
        });
      }
      
      // Show success notification
      // First try using Vue Toastify if available
      if (window.$toast && window.$toast.success) {
        window.$toast.success('Task status updated successfully');
      } else if (window.toast && window.toast.success) {
        window.toast.success('Task status updated successfully');
      } else {
        console.log('Status updated successfully (toast notification not available)');
      }
    } catch (err) {
      console.error('Error updating task status:', err);
      statusUpdateError.value = err.message || 'Failed to update task status';
      
      // Revert to previous status
      task.value.status_id = previousStatusId;
      
      // Show error notification
      if (window.$toast && window.$toast.error) {
        window.$toast.error(statusUpdateError.value);
      } else if (window.toast && window.toast.error) {
        window.toast.error(statusUpdateError.value);
      }
    } finally {
      statusUpdateLoading.value = false;
    }
  }
  
  function handleStatusChange() {
    if (task.value) {
      // Store previous status for potential reversion
      task.value._prevStatus = task.value.status_id;
    }
    updateTaskStatus();
  }

  async function updateTaskPriority() {
    try {
      const response = await fetch(`/api/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          priority_id: task.value.priority_id
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update task priority');
      }
    } catch (err) {
      console.error('Error updating task priority:', err);
      alert('Failed to update task priority. Please try again.');
    }
  }
  
  async function updateAssignee() {
    try {
      const response = await fetch(`/api/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          assignee_id: selectedAssignee.value
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update assignee');
      }
      
      // Update local task data
      const data = await response.json();
      task.value = data.data;
      
      showAssigneeModal.value = false;
    } catch (err) {
      console.error('Error updating assignee:', err);
      alert('Failed to update assignee. Please try again.');
    }
  }
  
  async function updateDueDate() {
    try {
      const response = await fetch(`/api/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          due_date: selectedDueDate.value
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to update due date');
      }
      
      // Update local task data
      const data = await response.json();
      task.value = data.data;
      
      showDueDateModal.value = false;
    } catch (err) {
      console.error('Error updating due date:', err);
      alert('Failed to update due date. Please try again.');
    }
  }
  
  async function removeDueDate() {
    try {
      const response = await fetch(`/api/api/tasks/${taskId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          due_date: null
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to remove due date');
      }
      
      // Update local task data
      const data = await response.json();
      task.value = data.data;
    } catch (err) {
      console.error('Error removing due date:', err);
      alert('Failed to remove due date. Please try again.');
    }
  }
  
  async function addComment() {
  if (!newComment.value.trim()) return;
  
  try {
    // Try to use socket if available
    if (taskSocket) {
      $socket.addComment(parseInt(taskId), newComment.value);
      
      // Optimistically add the comment to the UI
      // const mockComment = {
      //   id: 'temp-' + Date.now(),
      //   task_id: parseInt(taskId),
      //   user_id: parseInt(localStorage.getItem('userId') || '0'),
      //   user_name: localStorage.getItem('userName') || 'You',
      //   content: newComment.value,
      //   created_at: new Date().toISOString()
      // };
      
      // comments.value.push(mockComment);
      newComment.value = '';
    } else {
      // Fall back to REST API
      const response = await fetch(`/api/api/tasks/${taskId}/comments`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newComment.value
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to add comment');
      }
      
      // Clear comment field
      newComment.value = '';
      
      // Fetch updated comments
      //await fetchComments();
    }
  } catch (err) {
    console.error('Error adding comment:', err);
    alert('Failed to add comment. Please try again.');
  }
}
  
  function addNewChecklist() {
    newChecklist.value = {
      title: '',
      items: [{
        content: '',
        is_completed: false
      }]
    };
    
    showChecklistModal.value = true;
  }
  
  function addChecklistItem() {
    newChecklist.value.items.push({
      content: '',
      is_completed: false
    });
  }
  
  function removeChecklistItem(index) {
    newChecklist.value.items.splice(index, 1);
  }
  
  async function createChecklist() {
    if (!newChecklist.value.title.trim() || newChecklist.value.items.length === 0) return;
    
    try {
      const response = await fetch(`/api/api/tasks/${taskId}/checklists`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          title: newChecklist.value.title,
          items: newChecklist.value.items.filter(item => item.content.trim())
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create checklist');
      }
      
      showChecklistModal.value = false;
      
      // Fetch updated checklists
      await fetchChecklists();
    } catch (err) {
      console.error('Error creating checklist:', err);
      alert('Failed to create checklist. Please try again.');
    }
  }
  
  function addNewChecklistItem() {
    if (checklists.value.length === 0) {
      addNewChecklist();
      return;
    }
    
    newChecklistItem.value = {
      content: '',
      is_completed: false
    };
    
    selectedChecklistId.value = checklists.value[0].id;
    showChecklistItemModal.value = true;
  }
  
  async function createChecklistItem() {
    if (!newChecklistItem.value.content.trim() || !selectedChecklistId.value) return;
    
    try {
      const response = await fetch(`/api/api/checklists/${selectedChecklistId.value}/items`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          content: newChecklistItem.value.content,
          is_completed: newChecklistItem.value.is_completed
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to create checklist item');
      }
      
      showChecklistItemModal.value = false;
      
      // Fetch updated checklists
      await fetchChecklists();
    } catch (err) {
      console.error('Error creating checklist item:', err);
      alert('Failed to create checklist item. Please try again.');
    }
  }
  
  async function toggleChecklistItem(checklistId, itemId) {
  try {
    // Find the checklist and item
    const checklist = checklists.value.find(c => c.id === checklistId);
    if (!checklist) return;
    
    // Handle both possible property names
    const items = checklist.ChecklistItems || checklist.items || [];
    const item = items.find(i => i.id === itemId);
    if (!item) return;
    
    // Toggle completion status
    const newStatus = !item.is_completed;
    
    const response = await fetch(`/api/api/checklist-items/${itemId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        is_completed: newStatus
      })
    });
    
    if (!response.ok) {
      // Try the alternative endpoint format if first one fails
      const altResponse = await fetch(`/api/api/checklists/${checklistId}/items/${itemId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          is_completed: newStatus
        })
      });
      
      if (!altResponse.ok) {
        console.error('Failed to update checklist item with either endpoint');
        throw new Error('Failed to update checklist item');
      }
    }
    
    // Update local state
    item.is_completed = newStatus;
  } catch (err) {
    console.error('Error toggling checklist item:', err);
    alert('Failed to update checklist item. Please try again.');
  }
}
  
  function getCompletedItems(checklist) {
  // Handle both possible property names (ChecklistItems from API and items from local state)
  const items = checklist.ChecklistItems || checklist.items || [];
  return items.filter(item => item.is_completed).length;
}
  
 
async function startTimeTracking() {
  try {
    const response = await fetch(`/api/api/tasks/${taskId}/time-entries`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({
        // Don't send task_id, it comes from the URL
        start_time: new Date().toISOString(),
        description: ''
      })
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('Time tracking error:', errorData);
      throw new Error(errorData.error || 'Failed to start time tracking');
    }
    
    const data = await response.json();
    currentTimeEntry.value = data.data;
    
    // Set tracking state
    isTimeTrackingActive.value = true;
    timeTrackingStartTime.value = new Date();
    
    // Start the timer
    startTimeTrackingTimer();
  } catch (err) {
    console.error('Error starting time tracking:', err);
    alert('Failed to start time tracking. Please try again.');
  }
}
  
  async function stopTimeTracking() {
    if (!currentTimeEntry.value) return;
    
    try {
      const response = await fetch(`/api/api/tasks/${taskId}/time-entries/${currentTimeEntry.value.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          end_time: new Date().toISOString()
        })
      });
      
      if (!response.ok) {
        throw new Error('Failed to stop time tracking');
      }
      
      // Reset tracking state
      isTimeTrackingActive.value = false;
      timeTrackingStartTime.value = null;
      currentTimeEntry.value = null;
      
      // Fetch updated time entries
      await fetchTimeEntries();
    } catch (err) {
      console.error('Error stopping time tracking:', err);
      alert('Failed to stop time tracking. Please try again.');
    }
  }
  
  let timerInterval = null;
  
  function startTimeTrackingTimer() {
    // Clear any existing timer
    if (timerInterval) {
      clearInterval(timerInterval);
    }
    
    // Start a new timer that updates every second
    timerInterval = setInterval(() => {
      // Force component update
      task.value = { ...task.value };
    }, 1000);
  }
  
  function formatTimeTracking() {
    if (!timeTrackingStartTime.value) return '0:00:00';
    
    const now = new Date();
    const diff = Math.floor((now - timeTrackingStartTime.value) / 1000);
    
    const hours = Math.floor(diff / 3600);
    const minutes = Math.floor((diff % 3600) / 60);
    const seconds = diff % 60;
    
    return `${hours}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
  }
  
  function isOverdue() {
    if (!task.value || !task.value.due_date) return false;
    
    const dueDate = new Date(task.value.due_date);
    const now = new Date();
    
    return dueDate < now;
  }
  
  // Helper functions
  function formatDate(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    return date.toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  }
  
  function formatDateForInput(dateString) {
    if (!dateString) return '';
    
    const date = new Date(dateString);
    
    // Format: YYYY-MM-DDTHH:MM
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  }
  
  function formatMinutes(minutes) {
    if (!minutes) return '0h 0m';
    
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    
    return `${hours}h ${mins}m`;
  }
  
  function getInitials(name) {
    if (!name) return '??';
    
    const parts = name.split(' ');
    if (parts.length === 1) return parts[0].charAt(0).toUpperCase();
    
    return (parts[0].charAt(0) + parts[parts.length - 1].charAt(0)).toUpperCase();
  }

  /**
 * Show confirmation dialog for deleting a checklist
 * @param {Object} checklist - The checklist to delete
 */
function deleteChecklistConfirm(checklist) {
  selectedChecklist.value = checklist;
  showDeleteChecklistModal.value = true;
}

/**
 * Delete a checklist and all its items
 */
async function deleteChecklist() {
  if (!selectedChecklist.value) return;
  
  try {
    const response = await fetch(`/api/api/checklists/${selectedChecklist.value.id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error('Failed to delete checklist');
    }
    
    // Remove the deleted checklist from the local state
    checklists.value = checklists.value.filter(c => c.id !== selectedChecklist.value.id);
    
    // Close the modal
    showDeleteChecklistModal.value = false;
    selectedChecklist.value = null;
    
    // Show success notification
    toast.success('Checklist deleted successfully');
  } catch (err) {
    console.error('Error deleting checklist:', err);
    toast.error('Failed to delete checklist. Please try again.');
  }
}

  </script>
  
  <style scoped>
  /* Task-specific styles */
  .task-content {
    min-height: 100px;
  }
  
  /* Animation for the loading spinner */
  @keyframes spin {
    from { transform: rotate(0deg); }
    to { transform: rotate(360deg); }
  }
  
  .animate-spin {
    animation: spin 1s linear infinite;
  }
  </style>