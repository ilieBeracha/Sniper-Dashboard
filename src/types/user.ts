import { Squad } from "./squad";
import { Team } from "./team";

export enum UserDuty {
  SNIPER = "Sniper",
  SPOTTER = "Spotter",
}

export enum UserRole {
  Commander = "commander",
  SquadCommander = "squad_commander",
  Soldier = "soldier",
}

export enum PositionScore {
  Lying = "Lying",
  Sitting = "Sitting",
  Standing = "Standing",
  Crouching = "Crouching",
}

export interface User {
  id: string;
  email: string;
  user_role: UserRole | null;
  first_name: string;
  last_name: string;
  team_name?: string;
  squad_name?: string;
  team_id?: string;
  squad_id?: string;
  registered?: boolean;
  user_default_duty?: UserDuty | null;
  user_default_weapon?: string | null;
  user_default_equipment?: string | null;
  created_at?: string;
  teams?: Team;
  squads?: Squad;
}
