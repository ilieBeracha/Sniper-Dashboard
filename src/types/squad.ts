import { User } from "./user";

export interface Squad {
  id: string;
  squad_name: string;
  team_id: string;
  squad_commander_id: string | null;
  created_at: string;
  users?: User[];
}
