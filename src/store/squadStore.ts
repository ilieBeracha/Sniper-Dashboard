import { create } from "zustand";
import { getSquadMetricsByRoleRpc } from "@/services/squadService";

interface SquadMetric {
  role: string;
  total_sessions: number;
  avg_hit_ratio: number;
}

interface SquadStore {
  metrics: SquadMetric[] | null;
  getSquadMetricsByRole: (team_id: string) => Promise<void>;
}

export const squadStore = create<SquadStore>((set) => ({
  metrics: null,

  getSquadMetricsByRole: async (team_id) => {
    const data = await getSquadMetricsByRoleRpc(team_id);
    set({ metrics: data });
  },
}));
