import { create } from "zustand";
import { getSquadMetricsByRoleRpc, getSquadsWithUsersByTeamId, getSquadUsersBySquadId } from "@/services/squadService";
import { Squad } from "@/types/squad";

interface SquadMetric {
  role: string;
  total_sessions: number;
  avg_hit_ratio: number;
}

interface SquadStore {
  metrics: SquadMetric[] | null;
  squadsWithMembers: Squad[] | null;
  squadUsers: any[] | null;

  getSquadMetricsByRole: (team_id: string) => Promise<void>;
  getSquadsWithUsersByTeamId: (team_id: string) => Promise<void>;
  getSquadUsersBySquadId: (squad_id: string) => Promise<void>;
}

export const squadStore = create<SquadStore>((set) => ({
  metrics: null,
  squadsWithMembers: null,
  squadUsers: null,

  getSquadMetricsByRole: async (team_id) => {
    try {
      const data = await getSquadMetricsByRoleRpc(team_id);
      set({ metrics: data });
    } catch (error) {
      console.error("Failed to fetch squad metrics:", error);
      set({ metrics: null });
    }
  },
  getSquadsWithUsersByTeamId: async (team_id) => {
    try {
      const data = await getSquadsWithUsersByTeamId(team_id);
      set({ squadsWithMembers: data as unknown as Squad[] });
    } catch (error) {
      console.error("Failed to fetch squads with members:", error);
      set({ squadsWithMembers: null });
    }
  },
  getSquadUsersBySquadId: async (squad_id) => {
    try {
      const data = await getSquadUsersBySquadId(squad_id);
      set({ squadUsers: data as unknown as any[] });
    } catch (error) {
      console.error("Failed to fetch squad users:", error);
      set({ squadUsers: null });
    }
  },
}));
