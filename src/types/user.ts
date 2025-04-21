export interface User {
  id: string;
  email: string;
  user_role: "Team commander" | "Soldier" | string;
  full_name: string;
  team_id: string;
  squad_id?: string;
  invite_code?: string;
}
