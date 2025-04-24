import { create } from "zustand";
import { User } from "@/types/user";
import { getTeamMembers } from "@/services/teamService";
import { userStore } from "./userStore";
interface TeamStore {
  members: User[];
  fetchMembers: (teamId: string) => Promise<void>;
}

export const teamStore = create<TeamStore>((set) => ({
  members: [],

  fetchMembers: async (teamId) => {
    try {
      const currentUser = userStore.getState().user;
      const members = await getTeamMembers(teamId, currentUser as User);
      set({ members });
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      set({ members: [] });
    }
  },
}));
