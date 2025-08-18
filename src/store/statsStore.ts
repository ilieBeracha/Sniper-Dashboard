import { StatsFilters, StatsOverviewResponse, FirstShotMetricsResponse, EliminationByPositionResponse, WeeklyTrendsResponse } from "@/types/stats";
import { rpcEliminationByPosition, rpcFirstShotMetrics, rpcStatsOverview, rpcWeeklyTrends, rpcFirstShotMatrix } from "@/services/statsService";
import { create } from "zustand";

interface StatsStore {
  statsOverviewTotals: StatsOverviewResponse | null;
  getStatsOverviewTotals: (filters: StatsFilters) => Promise<void>;
  firstShotMetrics: FirstShotMetricsResponse[] | null;
  getFirstShotMetrics: (filters: StatsFilters) => Promise<void>;
  eliminationByPosition: EliminationByPositionResponse[] | null;
  getEliminationByPosition: (filters: StatsFilters) => Promise<void>;
  weeklyTrends: WeeklyTrendsResponse[] | null;
  getWeeklyTrends: (filters: StatsFilters & { p_group_by_weapon?: boolean }) => Promise<void>;
  firstShotMatrix: Array<{
    distance_bucket: number;
    targets: number;
    first_shot_hit_rate: number | null;
    avg_time_to_first_shot_sec: number | null;
  }> | null;
  getFirstShotMatrix: (
    filters: StatsFilters & {
      p_distance_bucket?: number;
      p_min_targets?: number;
      p_min_distance?: number;
      p_max_distance?: number;
    },
  ) => Promise<void>;
}

export const useStatsStore = create<StatsStore>((set) => {
  return {
    statsOverviewTotals: null,
    firstShotMetrics: null,
    eliminationByPosition: null,
    weeklyTrends: null,
    firstShotMatrix: null,

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

    getWeeklyTrends: async (filters: StatsFilters & { p_group_by_weapon?: boolean }) => {
      const weeklyTrends = await rpcWeeklyTrends(filters);
      console.log("weeklyTrends", weeklyTrends);
      set({ weeklyTrends });
    },

    getFirstShotMatrix: async (
      filters: StatsFilters & {
        p_distance_bucket?: number;
        p_min_targets?: number;
        p_min_distance?: number;
        p_max_distance?: number;
      },
    ) => {
      const firstShotMatrix = await rpcFirstShotMatrix(filters);
      console.log("firstShotMatrix", firstShotMatrix);
      set({ firstShotMatrix });
    },
  };
});
