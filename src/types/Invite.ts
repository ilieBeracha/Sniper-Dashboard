import { UserRole } from "./user";

export interface Invite {
  id: string;
  token: string;
  role: UserRole;
  team_id: string | null;
  squad_id: string | null;
  email?: string;
  created_at: string;
  expires_at?: string;
  used: boolean;
  used_by?: string;
}
