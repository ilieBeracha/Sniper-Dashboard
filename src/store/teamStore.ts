import { create } from "zustand";
import { User } from "@/types/user";
import { getTeamMembers } from "@/services/teamService";

interface TeamStore {
  teamId: string | null;
  members: User[];
  fetchMembers: (teamId: string) => Promise<void>;
}

export const teamStore = create<TeamStore>((set) => ({
  teamId: null,
  members: [],

  fetchMembers: async (teamId) => {
    try {
      const members = await getTeamMembers(teamId);
      set({ members });
      console.log("members", members);
      set({ teamId });
    } catch (err) {
      console.error("Failed to fetch team members:", err);
      set({ members: [] });
    }
  },
}));
