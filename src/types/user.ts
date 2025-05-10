import { Squad } from "./squad";
import { Team } from "./team";

export enum UserRole {
  Commander = "commander",
  SquadCommander = "squad_commander",
  Soldier = "soldier",
}

export interface User {
  id: string;
  email: string;
  user_role: UserRole;
  first_name: string;
  last_name: string;
  team_name: string;
  squad_name: string;
  team_id: string;
  squad_id?: string | null;
  registered?: boolean;

  teams?: Team;
  squads?: Squad;
}
