// src/store/performanceStore.ts
import { create } from "zustand";
import { HitPercentageData, SquadWeaponPerformance } from "@/types/performance";
import { GroupingScore } from "@/types/groupingScore";
import { getUserGroupingScoresRpc, getUserHitPercentageRpc, getWeaponPerformanceBySquadAndWeapon } from "@/services/performance";

interface PerformanceStore {
  squadWeaponPerformance: SquadWeaponPerformance[];
  isLoading: boolean;
  getSquadWeaponPerformance: (teamId: string) => Promise<void>;

  userHitPercentage: HitPercentageData | null;
  getUserHitPercentage: (userId: string) => Promise<HitPercentageData>;

  userGroupingScores: GroupingScore[];
  getUserGroupingScores: (userId: string) => Promise<GroupingScore[]>;
}

export const performanceStore = create<PerformanceStore>((set) => ({
  squadWeaponPerformance: [],
  isLoading: false,
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

  userHitPercentage: null,
  getUserHitPercentage: async (userId: string) => {
    try {
      const data = await getUserHitPercentageRpc(userId);
      set({ userHitPercentage: data });
      return data;
    } catch (error) {
      console.error("Failed to load user hit percentage:", error);
      throw error;
    }
  },

  userGroupingScores: [],
  getUserGroupingScores: async (userId: string) => {
    try {
      const data = await getUserGroupingScoresRpc(userId);
      set({ userGroupingScores: data });
      return data;
    } catch (error) {
      console.error("Failed to load user grouping scores:", error);
      throw error;
    }
  },
}));
