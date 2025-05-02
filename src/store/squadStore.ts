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
    const data = await getSquadMetricsByRoleRpc(team_id);
    set({ metrics: data });
  },
  getSquadsWithUsersByTeamId: async (team_id) => {
    const data = await getSquadsWithUsersByTeamId(team_id);
    set({ squadsWithMembers: data as unknown as Squad[] });
  },
  getSquadUsersBySquadId: async (squad_id) => {
    const data = await getSquadUsersBySquadId(squad_id);
    set({ squadUsers: data.users as unknown as any[] });
  },
}));
