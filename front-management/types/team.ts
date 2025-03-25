// types/team.ts
import type { User } from './auth';

export interface Team {
  id: number;
  name: string;
  description: string;
  created_by?: number;
  created_at: string;
  updated_at: string;
  members_count?: number;
  projects_count?: number;
  user?: User;
}

export interface TeamMember {
  id: number;
  team_id: number;
  user_id: number;
  role: 'owner' | 'admin' | 'member';
  user: User;
  created_at: string;
  updated_at: string;
}

export interface TeamCreatePayload {
  name: string;
  description: string;
}

export interface TeamUpdatePayload {
  name?: string;
  description?: string;
}

export interface TeamMemberCreatePayload {
  user_id: number;
  role: 'admin' | 'member';
}

export interface TeamMemberUpdatePayload {
  role: 'admin' | 'member';
}

export interface TeamWithMembers extends Team {
  members: TeamMember[];
}

export interface TeamsResponse {
  teams: Team[];
  total: number;
}

export interface TeamResponse {
  team: Team;
}

export interface TeamMembersResponse {
  members: TeamMember[];
  total: number;
}

export interface TeamMemberResponse {
  member: TeamMember;
}

export interface TeamState {
  teams: Team[];
  currentTeam: Team | null;
  teamMembers: Record<number, TeamMember[]>;
  loading: boolean;
  error: string | null;
}