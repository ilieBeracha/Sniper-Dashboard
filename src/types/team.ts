export interface Team {
  id: string;
  team_name: string;
  team_code: string | null;
  team_commander_id: string;
  created_at: string; // ISO timestamp
  invite_code: string;
}
