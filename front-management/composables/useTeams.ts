// composables/useTeams.ts
import type { Team, TeamCreatePayload, TeamMember } from '~/types/team';

export function useTeams() {
  const { $api } = useNuxtApp();
  
  const fetchTeams = async () => {
    try {
      // In a real application, you would call the API
      // const response = await $api.get('/teams');
      // return response.data.teams;
      
      // For development/demo purposes, use mock data
      const mockTeams: Team[] = [
        {
          id: 1,
          name: 'Engineering',
          description: 'Engineering team responsible for building and maintaining the platform',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          members_count: 5,
          projects_count: 3
        },
        {
          id: 2,
          name: 'Marketing',
          description: 'Marketing team focused on growth and user acquisition',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          members_count: 3,
          projects_count: 2
        },
        {
          id: 3,
          name: 'Product',
          description: 'Product team working on product strategy and roadmap',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          members_count: 4,
          projects_count: 5
        },
        {
          id: 4,
          name: 'Design',
          description: 'Design team creating user experiences and interfaces',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          members_count: 2,
          projects_count: 1
        }
      ];
      
      return mockTeams;
    } catch (error) {
      console.error('Failed to fetch teams:', error);
      return [];
    }
  };
  
  const fetchTeamById = async (id: number) => {
    try {
      // In a real application, you would call the API
      // const response = await $api.get(`/teams/${id}`);
      // return response.data.team;
      
      // For development/demo purposes, use mock data
      const mockTeam: Team = {
        id,
        name: id === 1 ? 'Engineering' : id === 2 ? 'Marketing' : id === 3 ? 'Product' : 'Design',
        description: 'Team description goes here',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        members_count: 5,
        projects_count: 3
      };
      
      return mockTeam;
    } catch (error) {
      console.error(`Failed to fetch team with id ${id}:`, error);
      return null;
    }
  };
  
  const createTeam = async (payload: TeamCreatePayload) => {
    try {
      // In a real application, you would call the API using the provided curl example:
      // curl --location 'http://localhost:3001/api/teams' \
      // --header 'Content-Type: application/json' \
      // --header 'Authorization: Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...' \
      // --data '{ "name": "Piti Team", "description": "laosss" }'
      
      // const response = await $api.post('/teams', payload);
      // return { success: true, team: response.data.team };
      
      // For development/demo purposes, use mock data
      const mockTeam: Team = {
        id: Math.floor(Math.random() * 1000) + 10, // Generate random ID
        name: payload.name,
        description: payload.description,
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        members_count: 1,
        projects_count: 0
      };
      
      console.log('Created team:', mockTeam);
      
      return { success: true, team: mockTeam };
    } catch (error: any) {
      console.error('Failed to create team:', error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to create team' 
      };
    }
  };
  
  const updateTeam = async (id: number, payload: Partial<TeamCreatePayload>) => {
    try {
      // In a real application, you would call the API
      // const response = await $api.put(`/teams/${id}`, payload);
      // return { success: true, team: response.data.team };
      
      // For development/demo purposes, use mock data
      const mockTeam: Team = {
        id,
        name: payload.name || 'Team Name',
        description: payload.description || 'Team Description',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        members_count: 5,
        projects_count: 3
      };
      
      console.log('Updated team:', mockTeam);
      
      return { success: true, team: mockTeam };
    } catch (error: any) {
      console.error(`Failed to update team with id ${id}:`, error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to update team' 
      };
    }
  };
  
  const deleteTeam = async (id: number) => {
    try {
      // In a real application, you would call the API
      // await $api.delete(`/teams/${id}`);
      
      // For development/demo purposes, log the deletion
      console.log(`Deleted team with id ${id}`);
      
      return { success: true };
    } catch (error: any) {
      console.error(`Failed to delete team with id ${id}:`, error);
      return { 
        success: false, 
        error: error.response?.data?.error || 'Failed to delete team' 
      };
    }
  };
  
  const fetchTeamMembers = async (teamId: number) => {
    try {
      // In a real application, you would call the API
      // const response = await $api.get(`/teams/${teamId}/members`);
      // return response.data.members;
      
      // For development/demo purposes, use mock data
      const mockMembers: TeamMember[] = [
        {
          id: 1,
          team_id: teamId,
          user_id: 1,
          role: 'owner',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: 1,
            email: 'john@example.com',
            first_name: 'John',
            last_name: 'Doe',
            role: 'admin',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        },
        {
          id: 2,
          team_id: teamId,
          user_id: 2,
          role: 'admin',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: 2,
            email: 'jane@example.com',
            first_name: 'Jane',
            last_name: 'Smith',
            role: 'manager',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        },
        {
          id: 3,
          team_id: teamId,
          user_id: 3,
          role: 'member',
          created_at: new Date().toISOString(),
          updated_at: new Date().toISOString(),
          user: {
            id: 3,
            email: 'bob@example.com',
            first_name: 'Bob',
            last_name: 'Johnson',
            role: 'user',
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
          }
        }
      ];
      
      return mockMembers;
    } catch (error) {
      console.error(`Failed to fetch members for team with id ${teamId}:`, error);
      return [];
    }
  };
  
  // Return team-related functions
  return {
    fetchTeams,
    fetchTeamById,
    createTeam,
    updateTeam,
    deleteTeam,
    fetchTeamMembers
  };
}