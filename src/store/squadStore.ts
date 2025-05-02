import { create } from "zustand";
import { getSquadMetricsByRoleRpc, getSquadsWithUsersByTeamId } from "@/services/squadService";
import { Squad } from "@/types/squad";

interface SquadMetric {
  role: string;
  total_sessions: number;
  avg_hit_ratio: number;
}

interface SquadStore {
  metrics: SquadMetric[] | null;
  squadsWithMembers: Squad[] | null;

  getSquadMetricsByRole: (team_id: string) => Promise<void>;
  getSquadsWithUsersByTeamId: (team_id: string) => Promise<void>;
}

export const squadStore = create<SquadStore>((set) => ({
  metrics: null,
  squadsWithMembers: null,

  getSquadMetricsByRole: async (team_id) => {
    const data = await getSquadMetricsByRoleRpc(team_id);
    set({ metrics: data });
  },
  getSquadsWithUsersByTeamId: async (team_id) => {
    const data = await getSquadsWithUsersByTeamId(team_id);
    set({ squadsWithMembers: data as unknown as Squad[] });
  },
}));
