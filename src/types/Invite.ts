import { UserRole } from "./user";

export interface Invite {
  id?: string;
  inviter_id: string;
  token: string;
  role: UserRole | null;
  team_id: string;
  squad_id?: string | null;
  email?: string;
  created_at: string;
  expires_at?: string;
  used: boolean;
  used_by?: string;
  valid?: boolean;
}
