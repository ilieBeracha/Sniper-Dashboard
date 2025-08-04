import { create } from "zustand";
import {
  getSquadsHitsByTeamId,
  getSquadMetricsByRoleRpc,
  getSquadsWithUsersByTeamId,
  getSquadUsersBySquadId,
  getSquads,
} from "@/services/squadService";
import { Squad } from "@/types/squad";

interface SquadMetric {
  role: string;
  total_sessions: number;
  avg_hit_ratio: number;
}

interface SquadsHits {
  squad_id: string;
  squad_name: string;
  avg_hit_percentage: number;
  total_shots: number;
  total_hits: number;
}

interface SquadStore {
  metrics: SquadMetric[] | null;
  squadsWithMembers: Squad[] | null;
  squadUsers: any[] | null;
  squadsHits: SquadsHits[] | null;
  squads: Squad[] | null;
  getSquadMetricsByRole: (team_id: string) => Promise<void>;
  getSquadsWithUsersByTeamId: (team_id: string) => Promise<void>;
  getSquadUsersBySquadId: (squad_id: string) => Promise<void>;
  getSquadsHitsByTeamId: (team_id: string) => Promise<void>;
  getSquads: (team_id: string) => Promise<void>;
}

export const squadStore = create<SquadStore>((set) => ({
  metrics: null,
  squadsWithMembers: null,
  squadUsers: null,
  squadsHits: null,
  squads: null,

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
    set({ squadUsers: data as unknown as any[] });
  },
  getSquadsHitsByTeamId: async (team_id) => {
    const data = await getSquadsHitsByTeamId(team_id);
    set({ squadsHits: data as unknown as any[] });
  },
  getSquads: async (team_id) => {
    const data = await getSquads(team_id);
    set({ squads: data as unknown as Squad[] });
  },
}));
