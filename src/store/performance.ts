// src/store/performanceStore.ts
import { create } from "zustand";
import {
  SquadStats,
  SquadWeaponPerformance,
  TrainingEffectiveness,
  UserHitsData,
  TrainingTeamAnalytics,
  WeaponUsageStats,
  SquadMajorityPerformance,
  CommanderUserRoleBreakdown,
  GroupingScoreEntry,
  GroupingStatsCommander,
  GetUserMediansInSquadQueryResult,
  CommanderTeamMedianDispersion,
} from "@/types/performance";
import { GroupingSummary } from "@/types/groupingScore";
import {
  getWeaponPerformanceBySquadAndWeapon,
  getTrainingEffectivenessByTeam,
  // getSquadRoleHitPercentages,
  getUserGroupingStatsRpc,
  getUserHitStatsFull,
  getUserHitStatsWithFilters,
  getSquadHitPercentageByRole,
  getTrainingTeamAnalytics,
  getWeaponUsageStats,
  getCommanderUserRoleBreakdown,
  getSquadMajoritySessionsPerformance,
  getGroupingScoresByTraining,
  getGroupingScoresCountByTraining,
  getGroupingStatsByTeamIdCommander,
  getBestGroupingStatsByTraining,
  getUserMediansInSquad,
  getCommanderTeamMedianDispersion,
} from "@/services/performance";
import { userStore } from "./userStore";
import { PositionScore } from "@/types/user";

interface PerformanceStore {
  squadWeaponPerformance: SquadWeaponPerformance[];
  isLoading: boolean;
  getSquadWeaponPerformance: (teamId: string) => Promise<void>;
  squadStats: SquadStats[];
  // getSquadStats: (position: PositionScore | null, distance: string | null) => Promise<void>;
  getSquadStatsByRole: (position: PositionScore | null, distance: string | null) => Promise<void>;

  // UserHitsData is a new type that includes detailed hit statistics for a user
  userHitsStats: UserHitsData | null;
  userHitsStatsLoading: boolean;
  getUserHitStatsFull: (userId: string) => Promise<UserHitsData>;
  getUserHitStatsWithFilters: (userId: string, distance?: string | null, position?: string | null, weaponType?: string | null) => Promise<void>;

  //
  trainingTeamAnalytics: TrainingTeamAnalytics | null;
  getTrainingTeamAnalytics: (trainingSessionId: string) => Promise<void>;
  //
  groupingSummary: GroupingSummary | null;
  groupingSummaryLoading: boolean;
  getGroupingSummary: (weaponType?: string | null, effort?: boolean | null, groupType?: string | null, position?: string | null) => Promise<void>;

  trainingEffectiveness: TrainingEffectiveness[];
  getTrainingEffectiveness: (teamId: string) => Promise<void>;

  weaponUsageStats: WeaponUsageStats | null;
  weaponUsageStatsMap: Record<string, WeaponUsageStats>;
  getWeaponUsageStats: (weaponId: string) => Promise<void>;

  // commnder view
  commanderUserRoleBreakdown: CommanderUserRoleBreakdown[] | null;
  fetchCommanderUserRoleBreakdown: (teamId: string) => Promise<void>;

  // new
  squadMajorityPerformance: SquadMajorityPerformance[] | null;
  fetchSquadMajorityPerformance: (teamId: string) => Promise<void>;

  groupingScores: GroupingScoreEntry[] | null;
  groupingScoresTotalCount: number;
  fetchGroupingScores: (trainingSessionId: string, limit?: number, offset?: number) => Promise<void>;
  getGroupingScoresCount: (trainingSessionId: string) => Promise<number>;

  groupingStatsCommander: GroupingStatsCommander[] | null;
  getGroupingStatsByTeamIdCommander: (teamId: string, startDate: Date, endDate: Date) => Promise<void>;

  getBestGroupingStatsByTraining: (
    trainingSessionId: string,
  ) => Promise<{ total_groups: number; avg_dispersion: number; best_dispersion: number } | null>;
  bestGroupingByTraining: { total_groups: number; avg_dispersion: number; best_dispersion: number } | null;

  commanderTeamMedianDispersion: CommanderTeamMedianDispersion[] | null;
  fetchCommanderTeamMedianDispersion: (
    teamId: string,
    startDate: Date | string | null,
    endDate: Date | string | null,
    weaponId?: string | null,
    effort?: boolean | null,
    dayPeriod?: string | null,
    type?: string | null,
    position?: string | null,
  ) => Promise<void>;

  userMediansInSquad: GetUserMediansInSquadQueryResult[] | null;
  getUserMediansInSquad: (
    squadId: string,
    weaponId: string | null,
    effort: string | null,
    type: string | null,
    position: string | null,
    startDate: Date | null,
    endDate: Date | null,
  ) => Promise<void>;
  userMediansInSquadLoading: boolean;
}

export const performanceStore = create<PerformanceStore>((set) => ({
  squadWeaponPerformance: [],
  isLoading: false,
  squadStats: [],
  trainingEffectiveness: [],
  userHitsStats: null,
  userHitsStatsLoading: false,
  trainingTeamAnalytics: null,
  weaponUsageStats: null,
  weaponUsageStatsMap: {},
  commanderUserRoleBreakdown: null,
  squadMajorityPerformance: null,
  groupingScores: null,
  groupingScoresTotalCount: 0,
  groupingStatsCommander: null,
  bestGroupingByTraining: null,
  userMediansInSquad: null,
  commanderTeamMedianDispersion: null,

  userMediansInSquadLoading: false,
  fetchGroupingScores: async (trainingSessionId: string, limit: number = 20, offset: number = 0) => {
    try {
      set({ isLoading: true });
      const data = await getGroupingScoresByTraining(trainingSessionId, limit, offset);
      set({ groupingScores: data });
    } catch (error) {
      console.error("Failed to load grouping scores:", error);
      set({ groupingScores: null });
    } finally {
      set({ isLoading: false });
    }
  },

  getGroupingScoresCount: async (trainingSessionId: string) => {
    try {
      const count = await getGroupingScoresCountByTraining(trainingSessionId);
      set({ groupingScoresTotalCount: count });
      return count;
    } catch (error) {
      console.error("Failed to load grouping scores count:", error);
      set({ groupingScoresTotalCount: 0 });
      return 0;
    }
  },

  fetchCommanderTeamMedianDispersion: async (
    teamId,
    startDate,
    endDate,
    weaponId = null,
    effort = null,
    dayPeriod = null,
    type = null,
    position = null,
  ) => {
    try {
      const formatDate = (d: Date | string | null) => {
        if (!d) return null;
        if (typeof d === "string") return d;
        return d.toISOString().split("T")[0];
      };

      const payload = await getCommanderTeamMedianDispersion(
        teamId,
        formatDate(startDate),
        formatDate(endDate),
        weaponId,
        effort,
        dayPeriod,
        type,
        position,
      );

      set({ commanderTeamMedianDispersion: payload });
    } catch (err) {
      console.error("fetchCommanderTeamMedianDispersion error:", err);
      set({ commanderTeamMedianDispersion: null });
    }
  },
  getBestGroupingStatsByTraining: async (
    trainingSessionId: string,
  ): Promise<{ total_groups: number; avg_dispersion: number; best_dispersion: number }> => {
    try {
      set({ isLoading: true });
      const data = await getBestGroupingStatsByTraining(trainingSessionId);
      set({ bestGroupingByTraining: data });
      return data;
    } catch (error) {
      console.error("Failed to load best grouping by training:", error);
      set({ bestGroupingByTraining: { total_groups: 0, avg_dispersion: 0, best_dispersion: 0 } });
      return { total_groups: 0, avg_dispersion: 0, best_dispersion: 0 };
    } finally {
      set({ isLoading: false });
    }
  },

  getWeaponUsageStats: async (weaponId: string) => {
    try {
      set({ isLoading: true });
      const stats = await getWeaponUsageStats(weaponId);
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

  getUserHitStatsWithFilters: async (
    userId: string,
    distance: string | null = null,
    position: string | null = null,
    weaponType: string | null = null,
  ) => {
    try {
      set({ userHitsStatsLoading: true });
      const data = await getUserHitStatsWithFilters(userId, distance, position, weaponType);
      set({ userHitsStats: data });
    } catch (error) {
      console.error("Failed to load user hit stats with filters:", error);
      set({ userHitsStats: null });
    } finally {
      set({ userHitsStatsLoading: false });
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
  getGroupingSummary: async (
    weaponType: string | null = null,
    effort: boolean | null = null,
    groupType: string | null = null,
    position: string | null = null,
  ) => {
    try {
      set({ groupingSummaryLoading: true });
      const userId = userStore.getState().user?.id;
      if (!userId) {
        console.error("No user ID available");
        return;
      }

      const data = await getUserGroupingStatsRpc(userId, weaponType, effort, groupType, position);
      set({ groupingSummary: data });
    } catch (error) {
      console.error("Failed to load grouping summary:", error);
      set({ groupingSummary: null });
    } finally {
      set({ groupingSummaryLoading: false });
    }
  },
  // commander view
  fetchCommanderUserRoleBreakdown: async (teamId: string) => {
    try {
      const data = await getCommanderUserRoleBreakdown(teamId);
      set({ commanderUserRoleBreakdown: data });
    } catch (error) {
      console.error("Failed to fetch commander user role breakdown:", error);
    }
  },

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

  getGroupingStatsByTeamIdCommander: async (teamId: string, startDate: Date, endDate: Date) => {
    try {
      const data = await getGroupingStatsByTeamIdCommander(teamId, startDate, endDate);
      set({ groupingStatsCommander: data });
    } catch (error) {
      console.error("Failed to load grouping stats:", error);
      set({ groupingStatsCommander: null });
    }
  },

  getUserMediansInSquad: async (
    squadId: string,
    weaponId: string | null,
    effort: string | null,
    type: string | null,
    position: string | null,
    startDate: Date | null,
    endDate: Date | null,
  ) => {
    try {
      set({ userMediansInSquadLoading: true });
      const data = await getUserMediansInSquad(squadId, weaponId, effort, type, position, startDate, endDate);
      set({ userMediansInSquad: data });
    } catch (error) {
      console.error("Failed to load user medians in squad:", error);
      set({ userMediansInSquad: null });
    } finally {
      set({ userMediansInSquadLoading: false });
    }
  },
}));
