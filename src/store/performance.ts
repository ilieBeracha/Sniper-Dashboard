// src/store/performanceStore.ts
import { create } from "zustand";
import {
  SquadStats,
  SquadWeaponPerformance,
  TrainingEffectiveness,
  OverallAccuracyStats,
  UserHitsData,
  TrainingTeamAnalytics,
  WeaponUsageStats,
  SquadCommanderPerformance,
  SquadMajorityPerformance,
} from "@/types/performance";
import { GroupingSummary } from "@/types/groupingScore";
import {
  getWeaponPerformanceBySquadAndWeapon,
  getTrainingEffectivenessByTeam,
  overallAccuracyStats,
  // getSquadRoleHitPercentages,
  getUserGroupingStatsRpc,
  getUserHitStatsFull,
  getSquadHitPercentageByRole,
  getTrainingTeamAnalytics,
  getWeaponUsageStats,
  getCommanderPerformance,
  getSquadMajoritySessionsPerformance,
} from "@/services/performance";
import { userStore } from "./userStore";
import { PositionScore } from "@/types/score";

interface PerformanceStore {
  squadWeaponPerformance: SquadWeaponPerformance[];
  isLoading: boolean;
  getSquadWeaponPerformance: (teamId: string) => Promise<void>;
  squadStats: SquadStats[];
  // getSquadStats: (position: PositionScore | null, distance: string | null) => Promise<void>;
  getSquadStatsByRole: (position: PositionScore | null, distance: string | null) => Promise<void>;

  // UserHitsData is a new type that includes detailed hit statistics for a user
  userHitsStats: UserHitsData | null;
  getUserHitStatsFull: (userId: string) => Promise<UserHitsData>;

  //
  trainingTeamAnalytics: TrainingTeamAnalytics | null;
  getTrainingTeamAnalytics: (trainingSessionId: string) => Promise<void>;
  //
  groupingSummary: GroupingSummary | null;
  groupingSummaryLoading: boolean;
  getGroupingSummary: () => Promise<void>;

  trainingEffectiveness: TrainingEffectiveness[];
  getTrainingEffectiveness: (teamId: string) => Promise<void>;

  overallAccuracyStats: OverallAccuracyStats | null;
  getOverallAccuracyStats: () => Promise<void>;

  overallAccuracyStatsLoading: boolean;

  weaponUsageStats: WeaponUsageStats | null;
  weaponUsageStatsMap: Record<string, WeaponUsageStats>;
  getWeaponUsageStats: (weaponId: string) => Promise<void>;

  // commnder view
  commanderPerformance: SquadCommanderPerformance[] | null;
  fetchCommanderPerformance: (teamId: string, distanceCategory?: string) => Promise<void>;
  // new
  squadMajorityPerformance: SquadMajorityPerformance[] | null;
  fetchSquadMajorityPerformance: (teamId: string) => Promise<void>;
}

export const performanceStore = create<PerformanceStore>((set) => ({
  squadWeaponPerformance: [],
  isLoading: false,
  squadStats: [],
  trainingEffectiveness: [],
  overallAccuracyStats: null,
  userHitsStats: null,
  overallAccuracyStatsLoading: false,
  trainingTeamAnalytics: null,
  weaponUsageStats: null,
  weaponUsageStatsMap: {},
  commanderPerformance: null,
  squadMajorityPerformance: null,

  getWeaponUsageStats: async (weaponId: string) => {
    try {
      set({ isLoading: true });
      console.log("Store - fetching weapon usage for weaponId:", weaponId);
      const stats = await getWeaponUsageStats(weaponId);
      console.log("Store - received stats:", stats);
      set((state) => ({
        weaponUsageStats: stats,
        weaponUsageStatsMap: {
          ...state.weaponUsageStatsMap,
          [weaponId]: stats,
        },
      }));
    } catch (error) {
      console.error("Failed to load weapon usage stats:", error);
      set({ weaponUsageStats: null });
    } finally {
      set({ isLoading: false });
    }
  },

  getOverallAccuracyStats: async () => {
    try {
      set({ overallAccuracyStatsLoading: true });
      const data = await overallAccuracyStats();
      set({ overallAccuracyStats: data });
    } catch (error) {
      console.error("Failed to load training summary stats:", error);
      set({ overallAccuracyStats: null });
    } finally {
      set({ overallAccuracyStatsLoading: false });
    }
  },

  // getSquadStats: async (_position: PositionScore | null, distance: string | null) => {
  //   const squadId = userStore.getState().user?.squad_id;
  //   try {
  //     set({ isLoading: true });
  //     const data = await getSquadRoleHitPercentages(squadId!, distance);
  //     set({ squadStats: data });
  //   } catch (error) {
  //     console.error("Failed to load squad stats:", error);
  //     set({ squadStats: [] });
  //   } finally {
  //     set({ isLoading: false });
  //   }
  // },

  getSquadStatsByRole: async (_position: PositionScore | null, distance: string | null) => {
    const squadId = userStore.getState().user?.squad_id;
    try {
      set({ isLoading: true });
      const data = await getSquadHitPercentageByRole(squadId!, distance);
      set({ squadStats: data });
    } catch (error) {
      console.error("Failed to load squad stats (session-based):", error);
      set({ squadStats: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getTrainingEffectiveness: async (teamId: string) => {
    try {
      set({ isLoading: true });
      const data = await getTrainingEffectivenessByTeam(teamId);
      set({ trainingEffectiveness: data });
    } catch (error) {
      console.error("Failed to load training effectiveness:", error);
      set({ trainingEffectiveness: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getSquadWeaponPerformance: async (teamId: string) => {
    try {
      set({ isLoading: true });
      const data = await getWeaponPerformanceBySquadAndWeapon(teamId);
      set({ squadWeaponPerformance: data });
    } catch (error) {
      console.error("Failed to load weapon performance:", error);
      set({ squadWeaponPerformance: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getUserHitStatsFull: async (userId: string) => {
    try {
      const data = await getUserHitStatsFull(userId);
      set({ userHitsStats: data });
      return data;
    } catch (error) {
      console.error("Failed to load user hit stats full:", error);
      throw error;
    }
  },
  getTrainingTeamAnalytics: async (trainingSessionId: string) => {
    try {
      set({ isLoading: true });
      const analytics = await getTrainingTeamAnalytics(trainingSessionId);
      set({ trainingTeamAnalytics: analytics });
    } catch (error) {
      console.error("Failed to load training team analytics:", error);
      set({ trainingTeamAnalytics: null });
    } finally {
      set({ isLoading: false });
    }
  },

  groupingSummary: null,
  groupingSummaryLoading: false,
  getGroupingSummary: async () => {
    try {
      set({ groupingSummaryLoading: true });
      const userId = userStore.getState().user?.id;
      if (!userId) {
        console.error("No user ID available");
        return;
      }

      const data = await getUserGroupingStatsRpc(userId);
      set({ groupingSummary: data });
    } catch (error) {
      console.error("Failed to load grouping summary:", error);
      set({ groupingSummary: null });
    } finally {
      set({ groupingSummaryLoading: false });
    }
  },
  // commander view
  fetchCommanderPerformance: async (teamId: string, distanceCategory?: string) => {
    try {
      set({ isLoading: true });
      const data = await getCommanderPerformance(teamId, distanceCategory);
      set({ commanderPerformance: data });
    } catch (error) {
      console.error("Failed to load commander performance:", error);
      set({ commanderPerformance: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  // new
  fetchSquadMajorityPerformance: async (teamId: string) => {
    try {
      set({ isLoading: true });
      const data = await getSquadMajoritySessionsPerformance(teamId);
      set({ squadMajorityPerformance: data });
    } catch (error) {
      console.error("Failed to load squad majority session performance:", error);
      set({ squadMajorityPerformance: null });
    } finally {
      set({ isLoading: false });
    }
  },
}));
