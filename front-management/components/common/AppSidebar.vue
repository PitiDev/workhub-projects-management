<!-- components/common/AppSidebar.vue -->
<template>
    <aside 
      :class="[
        'fixed left-0 top-14 bottom-0 z-10 bg-white border-r border-gray-200 transition-all duration-300',
        isExpanded ? 'w-64' : 'w-16'
      ]"
    >
      <div class="h-full flex flex-col">
        <!-- Sidebar Header -->
        <div class="p-3 flex items-center justify-between border-b border-gray-200">
          <div v-if="isExpanded" class="text-sm font-medium text-gray-600">Workspace</div>
          <button @click="toggleSidebar" class="p-1 rounded-md text-gray-500 hover:bg-gray-100">
            <svg v-if="isExpanded" xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M11 19l-7-7 7-7m8 14l-7-7 7-7" />
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" class="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13 5l7 7-7 7M5 5l7 7-7 7" />
            </svg>
          </button>
        </div>
        
        <!-- Main Navigation -->
        <nav class="flex-1 overflow-y-auto py-2 space-y-1">
          <!-- Home -->
          <NuxtLink 
            to="/" 
            class="flex items-center px-3 py-2 text-sm font-medium" 
            :class="[
              route.path === '/' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-100',
              isExpanded ? 'justify-start' : 'justify-center'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="[!isExpanded && 'mr-0']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <span v-if="isExpanded">Dashboard</span>
          </NuxtLink>
          
          <!-- Tasks -->
          <NuxtLink 
            to="/tasks" 
            class="flex items-center px-3 py-2 text-sm font-medium" 
            :class="[
              route.path.startsWith('/tasks') ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-100',
              isExpanded ? 'justify-start' : 'justify-center'
            ]"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="[!isExpanded && 'mr-0']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01" />
            </svg>
            <span v-if="isExpanded">Tasks</span>
          </NuxtLink>
          
          <!-- Projects -->
          <div class="space-y-1">
            <div v-if="isExpanded" class="flex items-center justify-between px-3 py-2">
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Projects</span>
              <NuxtLink to="/projects/new" class="p-1 rounded-md text-gray-500 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </NuxtLink>
            </div>
            
            <NuxtLink 
              to="/projects" 
              class="flex items-center px-3 py-2 text-sm font-medium" 
              :class="[
                route.path === '/projects' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-100',
                isExpanded ? 'justify-start' : 'justify-center'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="[!isExpanded && 'mr-0']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-6l-2-2H5a2 2 0 00-2 2z" />
              </svg>
              <span v-if="isExpanded">All Projects</span>
            </NuxtLink>
            
            <!-- Recent Projects - Only shown when sidebar is expanded -->
            <div v-if="isExpanded && recentProjects.length > 0" class="pl-8 space-y-1">
              <NuxtLink 
                v-for="project in recentProjects" 
                :key="project.id" 
                :to="`/projects/${project.id}`" 
                class="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                :class="{ 'text-indigo-600 bg-indigo-50': route.params.id === String(project.id) }"
              >
                <div class="w-2 h-2 rounded-full mr-2" :style="{ backgroundColor: project.color }"></div>
                <span class="truncate">{{ project.name }}</span>
              </NuxtLink>
            </div>
          </div>
          
          <!-- Teams -->
          <div class="space-y-1">
            <div v-if="isExpanded" class="flex items-center justify-between px-3 py-2">
              <span class="text-xs font-semibold text-gray-500 uppercase tracking-wider">Teams</span>
              <NuxtLink to="/teams/new" class="p-1 rounded-md text-gray-500 hover:bg-gray-100">
                <svg xmlns="http://www.w3.org/2000/svg" class="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M12 6v6m0 0v6m0-6h6m-6 0H6" />
                </svg>
              </NuxtLink>
            </div>
            
            <NuxtLink 
              to="/teams" 
              class="flex items-center px-3 py-2 text-sm font-medium" 
              :class="[
                route.path === '/teams' ? 'text-indigo-600 bg-indigo-50' : 'text-gray-600 hover:bg-gray-100',
                isExpanded ? 'justify-start' : 'justify-center'
              ]"
            >
              <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="[!isExpanded && 'mr-0']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
              </svg>
              <span v-if="isExpanded">All Teams</span>
            </NuxtLink>
            
            <!-- Team List - Only shown when sidebar is expanded -->
            <div v-if="isExpanded && teams.length > 0" class="pl-8 space-y-1">
              <NuxtLink 
                v-for="team in teams" 
                :key="team.id" 
                :to="`/teams/${team.id}`" 
                class="flex items-center px-3 py-1 text-sm text-gray-600 hover:bg-gray-100 rounded-md"
                :class="{ 'text-indigo-600 bg-indigo-50': route.params.id === String(team.id) }"
              >
                <span class="truncate">{{ team.name }}</span>
              </NuxtLink>
            </div>
          </div>
        </nav>
        
        <!-- Bottom Section -->
        <div class="p-3 border-t border-gray-200">
          <NuxtLink 
            to="/settings" 
            class="flex items-center px-2 py-2 text-sm font-medium text-gray-600 hover:bg-gray-100 rounded-md" 
            :class="[isExpanded ? 'justify-start' : 'justify-center']"
          >
            <svg xmlns="http://www.w3.org/2000/svg" class="h-5 w-5 mr-2" :class="[!isExpanded && 'mr-0']" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
              <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            <span v-if="isExpanded">Settings</span>
          </NuxtLink>
        </div>
      </div>
    </aside>
  </template>
  
  <script setup lang="ts">
  import { ref, onMounted } from 'vue';
  import { useRoute } from 'vue-router';
  import { Project } from '~/types/project';
  import { Team } from '~/types/team';
  import { useTeams } from '~/composables/useTeams';
  import { useProjects } from '~/composables/useProjects';
  
  // Props
  const props = defineProps<{
    initialExpanded?: boolean;
  }>();
  
  // Route
  const route = useRoute();
  
  // State
  const isExpanded = ref(props.initialExpanded !== undefined ? props.initialExpanded : true);
  const recentProjects = ref<Project[]>([]);
  const teams = ref<Team[]>([]);
  
  // Emits
  const emit = defineEmits(['toggle']);
  
  // Methods
  const toggleSidebar = () => {
    isExpanded.value = !isExpanded.value;
    emit('toggle', isExpanded.value);
    
    // Save preference to localStorage
    localStorage.setItem('sidebarExpanded', isExpanded.value.toString());
  };
  
  // Load recent projects
  const fetchRecentProjects = async () => {
    try {
      const { fetchProjects } = useProjects();
      const projects = await fetchProjects();
      
      if (projects && projects.length > 0) {
        // Sort by most recently updated and take the first 5
        recentProjects.value = [...projects]
          .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
          .slice(0, 5);
      } else {
        // Fallback to dummy data if API call fails or returns empty
        recentProjects.value = [
          {
            id: 1,
            name: 'Website Redesign',
            description: 'Redesign the company website',
            color: '#3b82f6',
            team_id: 1,
            status: 'active',
            created_by: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tasks_count: 12
          },
          {
            id: 2,
            name: 'Mobile App Development',
            description: 'Develop a new mobile app',
            color: '#10b981',
            team_id: 1,
            status: 'active',
            created_by: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tasks_count: 8
          },
          {
            id: 3,
            name: 'Marketing Campaign',
            description: 'Plan and execute Q3 marketing campaign',
            color: '#f59e0b',
            team_id: 2,
            status: 'active',
            created_by: 1,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            tasks_count: 5
          }
        ];
      }
    } catch (error) {
      console.error('Failed to fetch recent projects:', error);
      
      // Fallback to dummy data
      recentProjects.value = [
        {
          id: 1,
          name: 'Website Redesign',
          description: 'Redesign the company website',
          color: '#3b82f6',
          team_id: 1,
          status: 'active',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tasks_count: 12
        },
        {
          id: 2,
          name: 'Mobile App Development',
          description: 'Develop a new mobile app',
          color: '#10b981',
          team_id: 1,
          status: 'active',
          created_by: 1,
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          tasks_count: 8
        }
      ];
    }
  };
  
  // Fetch teams
  const fetchTeams = async () => {
    try {
      const { fetchTeams: getTeams } = useTeams();
      const result = await getTeams();
      
      if (result && result.length) {
        teams.value = result;
      } else {
        // Fallback to dummy data if API call fails or returns empty
        teams.value = [
          {
            id: 1,
            name: 'Engineering',
            description: 'Engineering team',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            members_count: 5
          },
          {
            id: 2,
            name: 'Marketing',
            description: 'Marketing team',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            members_count: 3
          },
          {
            id: 3,
            name: 'Product',
            description: 'Product team',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
            members_count: 4
          }
        ];
      }
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      
      // Fallback to dummy data if API call fails
      teams.value = [
        {
          id: 1,
          name: 'Engineering',
          description: 'Engineering team',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          members_count: 5
        },
        {
          id: 2,
          name: 'Marketing',
          description: 'Marketing team',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          members_count: 3
        }
      ];
    }
  };
  
  // Initialize on component mount
  onMounted(async () => {
    // Restore sidebar state from localStorage
    const savedExpanded = localStorage.getItem('sidebarExpanded');
    if (savedExpanded !== null) {
      isExpanded.value = savedExpanded === 'true';
    }
    
    // Fetch data
    await Promise.all([
      fetchRecentProjects(),
      fetchTeams()
    ]);
  });
  </script>
  
  <style scoped>
  /* When the sidebar is collapsed, show tooltips on hover */
  @media (max-width: 768px) {
    [data-tooltip]:hover::before {
      content: attr(data-tooltip);
      position: absolute;
      left: 100%;
      top: 50%;
      transform: translateY(-50%);
      z-index: 20;
      white-space: nowrap;
      background: rgba(0, 0, 0, 0.8);
      color: white;
      padding: 0.5rem;
      border-radius: 0.25rem;
      font-size: 0.75rem;
    }
  }
  </style>