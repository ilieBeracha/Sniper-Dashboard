import { StatsFilters } from "@/types/stats";
import { rpcEliminationByPosition, rpcFirstShotMetrics, rpcStatsOverview } from "@/services/statsService";
import { create } from "zustand";

interface StatsStore {
  statsOverviewTotals: any | null;
  getStatsOverviewTotals: (filters: StatsFilters) => Promise<any>;
  firstShotMetrics: any | null;
  getFirstShotMetrics: (filters: StatsFilters) => Promise<any>;
  eliminationByPosition: any | null;
  getEliminationByPosition: (filters: StatsFilters) => Promise<any>;
}

export const useStatsStore = create<StatsStore>((set) => {
  return {
    statsOverviewTotals: null,
    firstShotMetrics: null,
    eliminationByPosition: null,

    getStatsOverviewTotals: async (filters: StatsFilters) => {
      const statsOverviewTotals = await rpcStatsOverview(filters);
      console.log("statsOverviewTotals", statsOverviewTotals);
      set({ statsOverviewTotals });
    },
    getFirstShotMetrics: async (filters: StatsFilters) => {
      const firstShotMetrics = await rpcFirstShotMetrics(filters);
      console.log("firstShotMetrics", firstShotMetrics);
      set({ firstShotMetrics });
    },

    getEliminationByPosition: async (filters: StatsFilters) => {
      const eliminationByPosition = await rpcEliminationByPosition(filters);
      console.log("eliminationByPosition", eliminationByPosition);
      set({ eliminationByPosition });
    },
  };
});
