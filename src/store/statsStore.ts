import {
  StatsFilters,
  StatsOverviewResponse,
  FirstShotMetricsResponse,
  EliminationByPositionResponse,
  WeeklyTrendsResponse,
  UserWeaponPerformanceResponse,
} from "@/types/stats";
import {
  rpcEliminationByPosition,
  rpcFirstShotMetrics,
  rpcStatsOverview,
  rpcWeeklyTrends,
  rpcFirstShotMatrix,
  userWeaponPerformance,
} from "@/services/statsService";
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
  userWeaponPerformance: UserWeaponPerformanceResponse[] | null;
  getUserWeaponPerformance: (filters: StatsFilters) => Promise<void>;
  userWeaponPerformanceLoading: boolean;
  setUserWeaponPerformanceLoading: (loading: boolean) => void;
}

export const useStatsStore = create<StatsStore>((set) => {
  return {
    statsOverviewTotals: null,
    firstShotMetrics: null,
    eliminationByPosition: null,
    weeklyTrends: null,
    firstShotMatrix: null,
    userWeaponPerformance: null,
    userWeaponPerformanceLoading: false,
    setUserWeaponPerformanceLoading: (loading: boolean) => set({ userWeaponPerformanceLoading: loading }),
    getStatsOverviewTotals: async (filters: StatsFilters) => {
      const statsOverviewTotals = await rpcStatsOverview(filters);
      set({ statsOverviewTotals });
    },
    getFirstShotMetrics: async (filters: StatsFilters) => {
      const firstShotMetrics = await rpcFirstShotMetrics(filters);
      set({ firstShotMetrics });
    },

    getEliminationByPosition: async (filters: StatsFilters) => {
      const eliminationByPosition = await rpcEliminationByPosition(filters);
      set({ eliminationByPosition });
    },

    getWeeklyTrends: async (filters: StatsFilters & { p_group_by_weapon?: boolean }) => {
      const weeklyTrends = await rpcWeeklyTrends(filters);
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
      set({ firstShotMatrix });
    },

    getUserWeaponPerformance: async (filters: StatsFilters) => {
      try {
        set({ userWeaponPerformanceLoading: true });
        const data = await userWeaponPerformance(filters);
        set({ userWeaponPerformance: data });
      } catch (error) {
        console.error("Failed to load user weapon performance:", error);
        set({ userWeaponPerformance: null });
      } finally {
        set({ userWeaponPerformanceLoading: false });
      }
    },
  };
});
