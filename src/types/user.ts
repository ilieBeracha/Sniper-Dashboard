export interface User {
  id: string;
  email: string;
  user_role: "Team commander" | "Soldier" | string;
  first_name: string;
  last_name: string;
  team_id: string;
  squad_id?: string;
  invite_code?: string;
}
