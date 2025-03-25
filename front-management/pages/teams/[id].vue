// pages/teams/[id].vue
<template>
  <div>
    <!-- Loading state -->
    <div v-if="loading" class="flex justify-center py-20">
      <div class="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary-500"></div>
    </div>

    <!-- Error state -->
    <div v-else-if="error"
      class="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 rounded-lg p-4 text-red-700 dark:text-red-400">
      <p>{{ error }}</p>
      <button @click="fetchTeam" class="mt-2 text-sm font-medium text-red-600 dark:text-red-400 hover:text-red-500">
        Try again
      </button>
    </div>

    <div v-else>
      <!-- Team Header -->
      <div class="mb-6 flex flex-col sm:flex-row justify-between items-start sm:items-center">
        <div class="flex items-center">
          <div
            class="h-12 w-12 rounded-lg bg-primary-100 dark:bg-primary-900/20 text-primary-600 dark:text-primary-400 flex items-center justify-center text-xl font-semibold">
            {{ team.name.charAt(0) }}
          </div>
          <div class="ml-4">
            <h1 class="text-2xl font-bold text-gray-900 dark:text-white">{{ team.name }}</h1>
            <p class="mt-1 text-gray-500 dark:text-gray-400">{{ team.description }}</p>
          </div>
        </div>
        <div class="mt-4 sm:mt-0 flex space-x-3">
          <button @click="showEditTeamModal = true" class="btn btn-outline flex items-center">
            <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
            </svg>
            Edit Team
          </button>
          <button @click="showAddMemberModal = true" class="btn btn-primary flex items-center">
            <svg class="w-4 h-4 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
              stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
            </svg>
            Add Member
          </button>
        </div>
      </div>

      <!-- Team Content Tabs -->
      <div
        class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden">
        <!-- Tab Navigation -->
        <div class="border-b border-gray-200 dark:border-gray-700">
          <nav class="flex -mb-px">
            <button v-for="tab in tabs" :key="tab.id" @click="activeTab = tab.id"
              class="py-4 px-6 font-medium text-sm border-b-2 whitespace-nowrap"
              :class="activeTab === tab.id
                ? 'border-primary-500 text-primary-600 dark:text-primary-400'
                : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300 hover:border-gray-300 dark:hover:border-gray-600'">
              {{ tab.name }}
            </button>
          </nav>
        </div>

        <!-- Tab Content -->
        <!-- Members Tab -->
        <div v-if="activeTab === 'members'" class="p-6">
          <!-- Search and Filter -->
          <div class="mb-6 flex flex-col sm:flex-row gap-4">
            <div class="flex-1">
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg class="h-5 w-5 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg" fill="none"
                    viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                      d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                </div>
                <input v-model="membersSearchQuery" type="text" placeholder="Search members..." class="input pl-10" />
              </div>
            </div>
            <div>
              <select v-model="membersFilter" class="input">
                <option value="">All Roles</option>
                <option value="admin">Admin</option>
                <option value="member">Member</option>
              </select>
            </div>
          </div>

          <!-- Members List -->
          <div class="overflow-x-auto">
            <table class="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
              <thead class="bg-gray-50 dark:bg-gray-700">
                <tr>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Member
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Role
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-left text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Joined
                  </th>
                  <th scope="col"
                    class="px-6 py-3 text-right text-xs font-medium text-gray-500 dark:text-gray-300 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody class="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                <tr v-for="member in filteredMembers" :key="member.id"
                  class="hover:bg-gray-50 dark:hover:bg-gray-700/50">
                  <td class="px-6 py-4 whitespace-nowrap">
                    <div class="flex items-center">
                      <div class="h-10 w-10 flex-shrink-0">
                        <img v-if="member.profile_image" :src="member.profile_image"
                          class="h-10 w-10 rounded-full object-cover" :alt="member.name" />
                        <div v-else
                          class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                          {{ getInitials(member?.User?.first_name || '') }}
                        </div>
                      </div>
                      <div class="ml-4">
                        <div class="text-sm font-medium text-gray-900 dark:text-white">
                          {{ member.User.first_name }} {{ member.User.last_name }}
                        </div>
                        <div class="text-sm text-gray-500 dark:text-gray-400">
                          {{ member.User.email || 'No email' }}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap">
                    <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full"
                      :class="member.role === 'admin' ? 'bg-purple-100 text-purple-800 dark:bg-purple-900/20 dark:text-purple-400' : 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400'">
                      {{ capitalize(member.role) }}
                    </span>
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400">
                    {{ formatDate(member.joined_at || team.created_at) }}
                  </td>
                  <td class="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div class="flex justify-end space-x-2">
                      <button v-if="canManageTeam" @click="editMember(member)"
                        class="text-primary-600 dark:text-primary-400 hover:text-primary-900 dark:hover:text-primary-300">
                        Edit
                      </button>
                      <button v-if="canManageTeam && member.role !== 'admin'" @click="confirmRemoveMember(member)"
                        class="text-red-600 dark:text-red-400 hover:text-red-900 dark:hover:text-red-300">
                        Remove
                      </button>
                    </div>
                  </td>
                </tr>
                <tr v-if="filteredMembers.length === 0">
                  <td colspan="4" class="px-6 py-4 text-center text-gray-500 dark:text-gray-400">
                    No members found.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>

        <!-- Projects Tab -->
        <div v-else-if="activeTab === 'projects'" class="p-6">
          <div v-if="teamProjects.length === 0" class="text-center py-8">
            <svg class="mx-auto h-12 w-12 text-gray-400 dark:text-gray-500" xmlns="http://www.w3.org/2000/svg"
              fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
            </svg>
            <h3 class="mt-2 text-sm font-medium text-gray-900 dark:text-white">No projects</h3>
            <p class="mt-1 text-sm text-gray-500 dark:text-gray-400">This team doesn't have any projects yet.</p>
            <div class="mt-6">
              <NuxtLink to="/projects/new" class="btn btn-primary inline-flex items-center">
                <svg class="w-5 h-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24"
                  stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
                New Project
              </NuxtLink>
            </div>
          </div>
          <div v-else class="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div v-for="project in teamProjects" :key="project.id"
              class="bg-white dark:bg-gray-800 shadow-sm rounded-lg border border-gray-200 dark:border-gray-700 overflow-hidden hover:shadow-md transition-shadow">
              <!-- Color bar -->
              <div class="h-2" :style="{ backgroundColor: project.color }"></div>
              <div class="p-4">
                <div class="flex justify-between">
                  <h3 class="text-lg font-semibold text-gray-900 dark:text-white">
                    {{ project.name }}
                  </h3>
                  <span class="px-2 inline-flex text-xs leading-5 font-semibold rounded-full" :class="{
                    'bg-green-100 dark:bg-green-900/20 text-green-800 dark:text-green-400': project.status === 'active',
                    'bg-blue-100 dark:bg-blue-900/20 text-blue-800 dark:text-blue-400': project.status === 'completed',
                    'bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-300': project.status === 'archived',
                  }">
                    {{ capitalize(project.status) }}
                  </span>
                </div>
                <p class="mt-2 text-sm text-gray-500 dark:text-gray-400 line-clamp-2">
                  {{ project.description || 'No description' }}
                </p>
                <div class="mt-4 flex justify-between items-center">
                  <div class="text-xs text-gray-500 dark:text-gray-400">
                    {{ project.tasks_count || 0 }} {{ project.tasks_count === 1 ? 'task' : 'tasks' }}
                  </div>
                  <NuxtLink :to="`/projects/${project.id}`"
                    class="text-sm font-medium text-primary-600 dark:text-primary-400 hover:text-primary-500 dark:hover:text-primary-300">
                    View Project
                  </NuxtLink>
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Settings Tab -->
        <div v-else-if="activeTab === 'settings'" class="p-6">
          <div class="max-w-xl">
            <!-- Team Info -->
            <div class="mb-8">
              <h3 class="text-lg font-medium text-gray-900 dark:text-white mb-4">Team Information</h3>
              <div class="space-y-4">
                <div>
                  <label for="team-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Team Name
                  </label>
                  <input id="team-name" v-model="editedTeam.name" type="text" class="mt-1 input"
                    placeholder="Enter team name" />
                </div>
                <div>
                  <label for="team-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                    Description
                  </label>
                  <textarea id="team-description" v-model="editedTeam.description" rows="3" class="mt-1 input"
                    placeholder="Enter team description"></textarea>
                </div>
                <div class="pt-2">
                  <button @click="updateTeamInfo" class="btn btn-primary" :disabled="isUpdating">
                    <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                      xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                      <path class="opacity-75" fill="currentColor"
                        d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                      </path>
                    </svg>
                    Save Changes
                  </button>
                </div>
              </div>
            </div>

            <!-- Danger Zone -->
            <div class="pt-6 border-t border-gray-200 dark:border-gray-700">
              <h3 class="text-lg font-medium text-red-600 dark:text-red-400 mb-4">Danger Zone</h3>
              <div class="bg-red-50 dark:bg-red-900/10 border border-red-200 dark:border-red-900/20 rounded-lg p-4">
                <h4 class="text-base font-medium text-red-800 dark:text-red-300">Delete this team</h4>
                <p class="mt-1 text-sm text-red-700 dark:text-red-400">
                  Once deleted, all data will be permanently removed. This action cannot be undone.
                </p>
                <button @click="confirmDeleteTeam" class="mt-3 btn btn-danger">
                  Delete Team
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>

    <!-- Edit Member Modal -->
    <div v-if="showEditMemberModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Edit Team Member
            </h3>
            <div class="space-y-4">
              <div class="flex items-center">
                <div
                  class="h-12 w-12 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-base font-medium mr-4">
                  {{ getInitials(editedMember?.User?.first_name || '') }}
                </div>
                <div>
                  <div class="text-sm font-medium text-gray-900 dark:text-white">
                    {{ editedMember?.User?.first_name }} {{ editedMember?.User?.last_name }}
                  </div>
                  <div class="text-sm text-gray-500 dark:text-gray-400">
                    {{ editedMember?.User.email || 'No email' }}
                  </div>
                </div>
              </div>
              <div>
                <label for="member-role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Role
                </label>
                <select id="member-role" v-model="editedMember.role" class="mt-1 input">
                  <option value="admin">Admin</option>
                  <option value="member">Member</option>
                </select>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="btn btn-primary w-full sm:w-auto" :disabled="isUpdating" @click="updateMember">
              <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isUpdating ? 'Updating...' : 'Save Changes' }}
            </button>
            <button type="button" class="btn btn-secondary mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto"
              @click="showEditMemberModal = false" :disabled="isUpdating">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>


    <!-- Replace the Add Member Modal with this enhanced version -->
<!-- Add Member Modal -->
<div v-if="showAddMemberModal" class="fixed inset-0 z-50 overflow-y-auto">
  <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
    <div class="fixed inset-0 transition-opacity" aria-hidden="true">
      <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
    </div>

    <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

    <div
      class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
      <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
        <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
          Add Team Member
        </h3>
        
        <!-- User Search -->
        <div class="space-y-4">
          <div>
            <label for="member-email" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Search User by Email
            </label>
            <div class="mt-1 relative">
              <input 
                id="member-email" 
                v-model="userSearchQuery" 
                type="email" 
                class="input pr-10" 
                placeholder="Enter email address" 
                @input="debounceSearch"
                autocomplete="off"
              />
              <div class="absolute inset-y-0 right-0 flex items-center pr-3">
                <svg v-if="isSearching" class="animate-spin h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                  <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                <svg v-else class="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
          </div>
          
          <!-- Search Results -->
          <div v-if="searchResults.length > 0" class="mt-2 max-h-60 overflow-y-auto border border-gray-200 dark:border-gray-700 rounded-md">
            <ul class="divide-y divide-gray-200 dark:divide-gray-700">
              <li 
                v-for="user in searchResults" 
                :key="user.id" 
                class="p-3 hover:bg-gray-50 dark:hover:bg-gray-700 cursor-pointer"
                @click="selectUser(user)"
              >
                <div class="flex items-center">
                  <div class="h-10 w-10 flex-shrink-0">
                    <div v-if="user.profile_image" class="h-10 w-10 rounded-full overflow-hidden">
                      <img :src="user.profile_image" class="h-full w-full object-cover" :alt="user.first_name" />
                    </div>
                    <div v-else class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                      {{ getInitials(user.first_name + ' ' + user.last_name) }}
                    </div>
                  </div>
                  <div class="ml-3">
                    <div class="text-sm font-medium text-gray-900 dark:text-white">
                      {{ user.first_name }} {{ user.last_name }}
                    </div>
                    <div class="text-sm text-gray-500 dark:text-gray-400">
                      {{ user.email }}
                    </div>
                  </div>
                  
                  <!-- Already a member indicator -->
                  <div v-if="isUserTeamMember(user.id)" class="ml-auto flex-shrink-0">
                    <span class="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-gray-100 text-gray-800 dark:bg-gray-700 dark:text-gray-300">
                      Already a member
                    </span>
                  </div>
                </div>
              </li>
            </ul>
          </div>
          
          <!-- No results message -->
          <div v-else-if="userSearchQuery && !isSearching && hasSearched" class="mt-2 text-sm text-gray-500 dark:text-gray-400 text-center py-4 border border-gray-200 dark:border-gray-700 rounded-md">
            No users found matching "{{ userSearchQuery }}"
          </div>
          
          <!-- Selected User -->
          <div v-if="selectedUser" class="mt-4 p-3 border border-gray-200 dark:border-gray-700 rounded-md bg-gray-50 dark:bg-gray-700/50">
            <div class="flex items-center">
              <div class="h-10 w-10 flex-shrink-0">
                <div v-if="selectedUser.profile_image" class="h-10 w-10 rounded-full overflow-hidden">
                  <img :src="selectedUser.profile_image" class="h-full w-full object-cover" :alt="selectedUser.first_name" />
                </div>
                <div v-else class="h-10 w-10 rounded-full bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-gray-600 dark:text-gray-300 text-sm font-medium">
                  {{ getInitials(selectedUser.first_name + ' ' + selectedUser.last_name) }}
                </div>
              </div>
              <div class="ml-3">
                <div class="text-sm font-medium text-gray-900 dark:text-white">
                  {{ selectedUser.first_name }} {{ selectedUser.last_name }}
                </div>
                <div class="text-sm text-gray-500 dark:text-gray-400">
                  {{ selectedUser.email }}
                </div>
              </div>
              <button 
                @click="selectedUser = null" 
                class="ml-auto text-gray-400 hover:text-gray-500 dark:hover:text-gray-300"
              >
                <svg class="h-5 w-5" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          </div>
          
          <div>
            <label for="new-member-role" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
              Role
            </label>
            <select id="new-member-role" v-model="newMember.role" class="mt-1 input">
              <option value="admin">Admin</option>
              <option value="member">Member</option>
            </select>
          </div>
        </div>
        
      </div>
      <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
        <button 
          type="button" 
          class="btn btn-primary w-full sm:w-auto" 
          :disabled="isCreating || !selectedUser"
          @click="addMember"
        >
          <svg v-if="isCreating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
            xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
            <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
            <path class="opacity-75" fill="currentColor"
              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
            </path>
          </svg>
          {{ isCreating ? 'Adding...' : 'Add Member' }}
        </button>
        <button type="button" class="btn btn-secondary mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto"
          @click="closeAddMemberModal" :disabled="isCreating">
          Cancel
        </button>
      </div>
    </div>
  </div>
</div>


    <!-- Edit Team Modal -->
    <div v-if="showEditTeamModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white mb-4">
              Edit Team
            </h3>
            <div class="space-y-4">
              <div>
                <label for="edit-team-name" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Team Name
                </label>
                <input id="edit-team-name" v-model="editedTeam.name" type="text" class="mt-1 input"
                  placeholder="Enter team name" />
              </div>
              <div>
                <label for="edit-team-description" class="block text-sm font-medium text-gray-700 dark:text-gray-300">
                  Description
                </label>
                <textarea id="edit-team-description" v-model="editedTeam.description" rows="3" class="mt-1 input"
                  placeholder="Enter team description"></textarea>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="btn btn-primary w-full sm:w-auto" :disabled="isUpdating || !editedTeam.name"
              @click="updateTeam">
              <svg v-if="isUpdating" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isUpdating ? 'Saving...' : 'Save Changes' }}
            </button>
            <button type="button" class="btn btn-secondary mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto"
              @click="showEditTeamModal = false" :disabled="isUpdating">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Confirm Delete Modal -->
    <div v-if="showDeleteModal" class="fixed inset-0 z-50 overflow-y-auto">
      <div class="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
        <div class="fixed inset-0 transition-opacity" aria-hidden="true">
          <div class="absolute inset-0 bg-gray-500 dark:bg-gray-900 opacity-75"></div>
        </div>

        <span class="hidden sm:inline-block sm:align-middle sm:h-screen" aria-hidden="true">&#8203;</span>

        <div
          class="inline-block align-bottom bg-white dark:bg-gray-800 rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-lg sm:w-full">
          <div class="bg-white dark:bg-gray-800 px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
            <div class="sm:flex sm:items-start">
              <div
                class="mx-auto flex-shrink-0 flex items-center justify-center h-12 w-12 rounded-full bg-red-100 dark:bg-red-900/20 sm:mx-0 sm:h-10 sm:w-10">
                <svg class="h-6 w-6 text-red-600 dark:text-red-400" xmlns="http://www.w3.org/2000/svg" fill="none"
                  viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2"
                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
              </div>
              <div class="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
                <h3 class="text-lg leading-6 font-medium text-gray-900 dark:text-white">
                  {{ deleteMode === 'team' ? 'Delete Team' : 'Remove Member' }}
                </h3>
                <div class="mt-2">
                  <p class="text-sm text-gray-500 dark:text-gray-400" v-if="deleteMode === 'team'">
                    Are you sure you want to delete the team "{{ team.name }}"? All associated data will be permanently
                    removed. This action cannot be undone.
                  </p>
                  <p class="text-sm text-gray-500 dark:text-gray-400" v-else>
                    Are you sure you want to remove {{ memberToDelete?.name }} from this team? They will lose access to
                    all team projects and resources.
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div class="bg-gray-50 dark:bg-gray-700 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
            <button type="button" class="btn btn-danger w-full sm:w-auto" :disabled="isDeleting" @click="confirmDelete">
              <svg v-if="isDeleting" class="animate-spin -ml-1 mr-2 h-4 w-4 text-white"
                xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                <path class="opacity-75" fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z">
                </path>
              </svg>
              {{ isDeleting ? 'Processing...' : (deleteMode === 'team' ? 'Delete' : 'Remove') }}
            </button>
            <button type="button" class="btn btn-secondary mt-3 sm:mt-0 sm:mr-3 w-full sm:w-auto"
              @click="showDeleteModal = false" :disabled="isDeleting">
              Cancel
            </button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, computed, onMounted, watch } from 'vue';
import { useRoute, useRouter } from 'vue-router';
import { teamsAPI, projectsAPI } from '~/services/api';
import type { Team } from '~/types/team';
import type { Project } from '~/types/project';


definePageMeta({
  layout: 'dashboard',
});

// Route and router
const route = useRoute();
const router = useRouter();
const teamId = computed(() => parseInt(route.params.id as string));

// State
const team = ref<Team>({} as Team);
const loading = ref(true);
const error = ref('');
const activeTab = ref('members');
const teamProjects = ref<Project[]>([]);
const membersSearchQuery = ref('');
const membersFilter = ref('');
const currentUser = ref(null);
const canManageTeam = ref(true); // In a real app, check user permissions

// Add to your state variables
const userSearchQuery = ref('');
const searchResults = ref([]);
const isSearching = ref(false);
const hasSearched = ref(false);
const selectedUser = ref(null);
let searchTimeout = null;

// Modals
const showEditMemberModal = ref(false);
const showAddMemberModal = ref(false);
const showEditTeamModal = ref(false);
const showDeleteModal = ref(false);
const isCreating = ref(false);
const isUpdating = ref(false);
const isDeleting = ref(false);
const editedMember = ref<any>({});
const memberToDelete = ref<any>(null);
const deleteMode = ref<'team' | 'member'>('member');

// Tabs
const tabs = [
  { id: 'members', name: 'Members' },
  { id: 'projects', name: 'Projects' },
  { id: 'settings', name: 'Settings' },
];

// New member form
const newMember = ref({
  email: '',
  role: 'member'
});

// Edited team data
const editedTeam = ref({
  name: '',
  description: ''
});

// Computed
const filteredMembers = computed(() => {
  if (!team.value?.members) return [];

  let members = team.value.members;

  // Filter by search query
  if (membersSearchQuery.value) {
    const query = membersSearchQuery.value.toLowerCase();
    members = members.filter(member =>
      member.name.toLowerCase().includes(query) ||
      (member.email && member.email.toLowerCase().includes(query))
    );
  }

  // Filter by role
  if (membersFilter.value) {
    members = members.filter(member => member.role === membersFilter.value);
  }

  return members;
});

// Debounce search
const debounceSearch = () => {
  // Clear any pending search
  if (searchTimeout) {
    clearTimeout(searchTimeout);
  }
  
  // If the search query is empty, clear results
  if (!userSearchQuery.value.trim()) {
    searchResults.value = [];
    hasSearched.value = false;
    return;
  }
  
  // Set a timeout for the search
  searchTimeout = setTimeout(() => {
    searchUsers();
  }, 300); // 300ms debounce
};

// Search users by email
const searchUsers = async () => {
  try {
    if (!userSearchQuery.value.trim() || userSearchQuery.value.length < 2) {
      searchResults.value = [];
      hasSearched.value = false;
      return;
    }
    
    isSearching.value = true;
    hasSearched.value = true;
    
    // Call the searchUsers function from teamsAPI
    const response = await teamsAPI.searchUsers(userSearchQuery.value.trim());

    console.log("userSearchQuery: ",response.success)
    
    // Update results based on the API response format
    searchResults.value = response.data.data || [];
  } catch (err) {
    console.error('Failed to search users:', err);
    searchResults.value = [];
  } finally {
    isSearching.value = false;
  }
};

// Check if user is already a team member
const isUserTeamMember = (userId) => {
  if (!team.value?.members) return false;
  
  return team.value.members.some(member => {
    // Check both member.id (if the member object itself has an id)
    // or member.user_id/member.User?.id (depending on your API response structure)
    return member.id === userId || 
           member.user_id === userId || 
           (member.User && member.User.id === userId);
  });
};

// Select a user from search results
const selectUser = (user) => {
  // Check if the user is already a team member
  if (isUserTeamMember(user.id)) {
    // Alert or toast notification
    alert('This user is already a member of the team');
    return;
  }
  
  selectedUser.value = user;
  userSearchQuery.value = '';
  searchResults.value = [];
};

// Close the add member modal and reset state
const closeAddMemberModal = () => {
  showAddMemberModal.value = false;
  userSearchQuery.value = '';
  searchResults.value = [];
  selectedUser.value = null;
  hasSearched.value = false;
};

// Fetch team and related data
const fetchTeam = async () => {
  try {
    if (!process.client) return;

    loading.value = true;
    error.value = '';

    // Fetch team details using teamsAPI
    const response = await teamsAPI.getById(teamId.value).catch(() => {

    });

    team.value = response.data.data;

    console.log('response team:', team.value.name);

    // Initialize edited team data
    editedTeam.value = {
      name: team.value.name,
      description: team.value.description || ''
    };

    // Fetch team projects
    fetchTeamProjects();
  } catch (err) {
    console.error('Failed to fetch team:', err);
    error.value = 'Failed to load team. Please try again.';
  } finally {
    loading.value = false;
  }
};

// Fetch team projects
const fetchTeamProjects = async () => {
  try {
    // In a real app, you would have a dedicated endpoint for team projects
    // For now, we'll mock this with a filter
    const response = await projectsAPI.getAll({
      team_id: teamId.value
    }).catch(() => {
      
    });

    teamProjects.value = response.data.data;
  } catch (err) {
    console.error('Failed to fetch team projects:', err);
    teamProjects.value = [];
  }
};

// Edit member
const editMember = (member: any) => {
  editedMember.value = { ...member };
  showEditMemberModal.value = true;
};

// Update member
const updateMember = async () => {
  try {
    if (!process.client) return;

    isUpdating.value = true;

    // Update member using teamsAPI
    await teamsAPI.updateMemberRole(
      teamId.value,
      editedMember.value.id,
      editedMember.value.role
    ).catch(() => {
      // Mock update for development
      console.log('Mock update member:', editedMember.value);

      // Update in local state
      if (team.value.members) {
        const index = team.value.members.findIndex(m => m.id === editedMember.value.id);
        if (index !== -1) {
          team.value.members[index].role = editedMember.value.role;
        }
      }
    });

    // Close modal and refresh data
    showEditMemberModal.value = false;
    fetchTeam();
  } catch (err) {
    console.error('Failed to update member:', err);
  } finally {
    isUpdating.value = false;
  }
};

// Confirm remove member
const confirmRemoveMember = (member: any) => {
  memberToDelete.value = member;
  deleteMode.value = 'member';
  showDeleteModal.value = true;

  console.log('memberToDelete.value: ',memberToDelete.value);
};

// Add new member
const addMember = async () => {
  try {
    if (!process.client || !selectedUser.value) return;

    isCreating.value = true;

    // Add member using teamsAPI
   const response =  await teamsAPI.addMember(
      teamId.value,
      selectedUser.value.id,
      newMember.value.role
    ).catch(() => {
      
    });

    // Reset form and close modal
    closeAddMemberModal();
    fetchTeam();
    // Reset role for next time
    newMember.value = { role: 'member' };
    

  } catch (err) {
    console.error('Failed to add member:', err);
    closeAddMemberModal();
  } finally {
    isCreating.value = false;
  }
};


// Confirm delete team
const confirmDeleteTeam = () => {
  deleteMode.value = 'team';
  showDeleteModal.value = true;
};

// Update team
const updateTeam = async () => {
  try {
    if (!process.client) return;

    if (!editedTeam.value.name) {
      return; // Validation
    }

    isUpdating.value = true;

    // Update team using teamsAPI
    await teamsAPI.update(teamId.value, {
      name: editedTeam.value.name,
      description: editedTeam.value.description
    }).catch(() => {
      // Mock update for development
      console.log('Mock update team:', editedTeam.value);

      // Update in local state
      team.value.name = editedTeam.value.name;
      team.value.description = editedTeam.value.description;
    });

    // Close modal and refresh
    showEditTeamModal.value = false;
    fetchTeam();
  } catch (err) {
    console.error('Failed to update team:', err);
  } finally {
    isUpdating.value = false;
  }
};

// Update team info (settings tab)
const updateTeamInfo = async () => {
  await updateTeam();
};

// Handle delete/remove confirmation
const confirmDelete = async () => {
  try {
    if (!process.client) return;

    isDeleting.value = true;

    if (deleteMode.value === 'team') {
      // Delete team
      await teamsAPI.delete(teamId.value).catch(() => {
        console.log('Mock delete team:', teamId.value);
      });


    } else if (deleteMode.value === 'member' && memberToDelete.value) {
      // Remove member
      await teamsAPI.removeMember(teamId.value, memberToDelete.value.user_id).catch(() => {
        console.log('Mock remove member:', memberToDelete.value);

        // Remove from local state
        if (team.value.members) {
          team.value.members = team.value.members.filter(m => m.id !== memberToDelete.value.id);
        }
      });

      // Close modal and refresh
      showDeleteModal.value = false;
      fetchTeam();
    }
  } catch (err) {
    console.error('Failed to delete:', err);
  } finally {
    isDeleting.value = false;
  }
};

// Format date helper
const formatDate = (dateString: string) => {
  const date = new Date(dateString);
  return new Intl.DateTimeFormat('en-US', { month: 'short', day: 'numeric', year: 'numeric' }).format(date);
};

// Get initials from name
const getInitials = (name: string): string => {
  if (!name) return ''; // Handle the case when name is undefined or empty

  return name
    .split(' ')
    .map(part => part.charAt(0))
    .join('')
    .toUpperCase()
    .substring(0, 2);
};

// Capitalize first letter
const capitalize = (str: string): string => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};




// Lifecycle
onMounted(() => {
  if (process.client) {
    fetchTeam();
  }
});

// Watch for route changes
watch(() => route.params.id, (newId, oldId) => {
  if (newId !== oldId) {
    fetchTeam();
  }
});
</script>

<style scoped>
.line-clamp-2 {
  display: -webkit-box;
  -webkit-line-clamp: 2;
  -webkit-box-orient: vertical;
  overflow: hidden;
}
</style>