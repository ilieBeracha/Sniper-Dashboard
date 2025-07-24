import { UserRole } from "@/types/user";

export const isCommander = (role: UserRole | null) => {
  return role === UserRole.Commander;
};

export const isCommanderOrSquadCommander = (role: UserRole | null) => {
  return role === UserRole.Commander || role === UserRole.SquadCommander;
};
export const isSquadCommander = (role: UserRole | null) => {
  return role === UserRole.SquadCommander;
};
