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
  errors: Record<string, Error | null>;
  loadingStates: Record<string, boolean>;
  clearErrors: () => void;
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
    errors: {},
    loadingStates: {},
    setUserWeaponPerformanceLoading: (loading: boolean) => set({ userWeaponPerformanceLoading: loading }),
    clearErrors: () => set({ errors: {} }),
    getStatsOverviewTotals: async (filters: StatsFilters) => {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, statsOverview: true },
        errors: { ...state.errors, statsOverview: null }
      }));
      try {
        const statsOverviewTotals = await rpcStatsOverview(filters);
        set((state) => ({ 
          statsOverviewTotals,
          loadingStates: { ...state.loadingStates, statsOverview: false }
        }));
      } catch (error) {
        set((state) => ({ 
          errors: { ...state.errors, statsOverview: error as Error },
          loadingStates: { ...state.loadingStates, statsOverview: false }
        }));
        throw error;
      }
    },
    getFirstShotMetrics: async (filters: StatsFilters) => {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, firstShotMetrics: true },
        errors: { ...state.errors, firstShotMetrics: null }
      }));
      try {
        const firstShotMetrics = await rpcFirstShotMetrics(filters);
        set((state) => ({ 
          firstShotMetrics,
          loadingStates: { ...state.loadingStates, firstShotMetrics: false }
        }));
      } catch (error) {
        set((state) => ({ 
          errors: { ...state.errors, firstShotMetrics: error as Error },
          loadingStates: { ...state.loadingStates, firstShotMetrics: false }
        }));
        throw error;
      }
    },

    getEliminationByPosition: async (filters: StatsFilters) => {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, eliminationByPosition: true },
        errors: { ...state.errors, eliminationByPosition: null }
      }));
      try {
        const eliminationByPosition = await rpcEliminationByPosition(filters);
        set((state) => ({ 
          eliminationByPosition,
          loadingStates: { ...state.loadingStates, eliminationByPosition: false }
        }));
      } catch (error) {
        set((state) => ({ 
          errors: { ...state.errors, eliminationByPosition: error as Error },
          loadingStates: { ...state.loadingStates, eliminationByPosition: false }
        }));
        throw error;
      }
    },

    getWeeklyTrends: async (filters: StatsFilters & { p_group_by_weapon?: boolean }) => {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, weeklyTrends: true },
        errors: { ...state.errors, weeklyTrends: null }
      }));
      try {
        const weeklyTrends = await rpcWeeklyTrends(filters);
        set((state) => ({ 
          weeklyTrends,
          loadingStates: { ...state.loadingStates, weeklyTrends: false }
        }));
      } catch (error) {
        set((state) => ({ 
          errors: { ...state.errors, weeklyTrends: error as Error },
          loadingStates: { ...state.loadingStates, weeklyTrends: false }
        }));
        throw error;
      }
    },

    getFirstShotMatrix: async (
      filters: StatsFilters & {
        p_distance_bucket?: number;
        p_min_targets?: number;
        p_min_distance?: number;
        p_max_distance?: number;
      },
    ) => {
      set((state) => ({ 
        loadingStates: { ...state.loadingStates, firstShotMatrix: true },
        errors: { ...state.errors, firstShotMatrix: null }
      }));
      try {
        const firstShotMatrix = await rpcFirstShotMatrix(filters);
        set((state) => ({ 
          firstShotMatrix,
          loadingStates: { ...state.loadingStates, firstShotMatrix: false }
        }));
      } catch (error) {
        set((state) => ({ 
          errors: { ...state.errors, firstShotMatrix: error as Error },
          loadingStates: { ...state.loadingStates, firstShotMatrix: false }
        }));
        throw error;
      }
    },

    getUserWeaponPerformance: async (filters: StatsFilters) => {
      set((state) => ({ 
        userWeaponPerformanceLoading: true,
        loadingStates: { ...state.loadingStates, userWeaponPerformance: true },
        errors: { ...state.errors, userWeaponPerformance: null }
      }));
      try {
        const data = await userWeaponPerformance(filters);
        set((state) => ({ 
          userWeaponPerformance: data,
          userWeaponPerformanceLoading: false,
          loadingStates: { ...state.loadingStates, userWeaponPerformance: false }
        }));
      } catch (error) {
        console.error("Failed to load user weapon performance:", error);
        set((state) => ({ 
          userWeaponPerformance: null,
          userWeaponPerformanceLoading: false,
          errors: { ...state.errors, userWeaponPerformance: error as Error },
          loadingStates: { ...state.loadingStates, userWeaponPerformance: false }
        }));
        throw error;
      }
    },
  };
});
