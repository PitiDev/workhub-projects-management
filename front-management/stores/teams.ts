// stores/teams.ts
import { defineStore } from 'pinia';

// Define types locally instead of importing from a problematic module
interface Team {
  id: number;
  name: string;
  description?: string;
  created_by: number;
  created_at: string;
  updated_at: string;
  [key: string]: any; // Allow other properties
}

interface TeamMember {
  id: number;
  team_id: number;
  user_id: number;
  role: 'owner' | 'admin' | 'member';
  user?: {
    id: number;
    first_name: string;
    last_name: string;
    email: string;
    profile_image?: string;
  };
  [key: string]: any; // Allow other properties
}

interface TeamsState {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: Record<number, TeamMember[]>;
  loading: boolean;
  error: string | null;
}

export const useTeamsStore = defineStore('teams', {
  state: (): TeamsState => ({
    teams: [],
    currentTeam: null,
    teamMembers: {},
    loading: false,
    error: null
  }),
  
  getters: {
    getTeams: (state) => state.teams,
    getCurrentTeam: (state) => state.currentTeam,
    getTeamMembers: (state) => (teamId: number) => state.teamMembers[teamId] || [],
    isLoading: (state) => state.loading,
    getError: (state) => state.error
  },
  
  actions: {
    setTeams(teams: Team[]) {
      this.teams = teams;
    },
    
    setCurrentTeam(team: Team) {
      this.currentTeam = team;
    },
    
    addTeam(team: Team) {
      this.teams.push(team);
    },
    
    updateTeam(id: number, updatedTeam: Team) {
      const index = this.teams.findIndex((team) => team.id === id);
      if (index !== -1) {
        this.teams[index] = { ...this.teams[index], ...updatedTeam };
      }
      
      if (this.currentTeam && this.currentTeam.id === id) {
        this.currentTeam = { ...this.currentTeam, ...updatedTeam };
      }
    },
    
    removeTeam(id: number) {
      this.teams = this.teams.filter((team) => team.id !== id);
      
      if (this.currentTeam && this.currentTeam.id === id) {
        this.currentTeam = null;
      }
      
      // Clean up team members
      if (this.teamMembers[id]) {
        delete this.teamMembers[id];
      }
    },
    
    setTeamMembers(teamId: number, members: TeamMember[]) {
      this.teamMembers[teamId] = members;
    },
    
    addTeamMember(teamId: number, member: TeamMember) {
      if (!this.teamMembers[teamId]) {
        this.teamMembers[teamId] = [];
      }
      this.teamMembers[teamId].push(member);
    },
    
    updateTeamMember(teamId: number, userId: number, updatedMember: TeamMember) {
      if (this.teamMembers[teamId]) {
        const index = this.teamMembers[teamId].findIndex((member) => member.user_id === userId);
        if (index !== -1) {
          this.teamMembers[teamId][index] = { ...this.teamMembers[teamId][index], ...updatedMember };
        }
      }
    },
    
    removeTeamMember(teamId: number, userId: number) {
      if (this.teamMembers[teamId]) {
        this.teamMembers[teamId] = this.teamMembers[teamId].filter((member) => member.user_id !== userId);
      }
    },
    
    setLoading(loading: boolean) {
      this.loading = loading;
    },
    
    setError(error: string | null) {
      this.error = error;
    },

    // Add API methods to mirror the expectations from the reports page
    async fetchTeams() {
      this.setLoading(true);
      this.setError(null);
      
      try {
        // Implement API call to fetch teams
        // For now, just returning existing teams
        return this.teams;
      } catch (error: any) {
        this.setError(error.message || 'Error fetching teams');
        throw error;
      } finally {
        this.setLoading(false);
      }
    },
    
    async fetchTeamMembers(teamId: number) {
      this.setLoading(true);
      this.setError(null);
      
      try {
        // Implement API call to fetch team members
        // For now, just returning existing team members
        return this.teamMembers[teamId] || [];
      } catch (error: any) {
        this.setError(error.message || 'Error fetching team members');
        throw error;
      } finally {
        this.setLoading(false);
      }
    }
  }
});