// src/store/performanceStore.ts
import { create } from "zustand";
import { HitPercentageData, SquadWeaponPerformance } from "@/types/performance";
import { GroupingSummary } from "@/types/groupingScore";
import { getUserHitPercentageRpc, getWeaponPerformanceBySquadAndWeapon, getUserGroupingSummaryRpc, getTopAccurateSnipers } from "@/services/performance";
import { userStore } from "./userStore";
import { User } from "@supabase/supabase-js";

interface PerformanceStore {
  squadWeaponPerformance: SquadWeaponPerformance[];
  isLoading: boolean;
  topAccurateSnipers: User[];
  getTopAccurateSnipers: (teamId: string) => Promise<void>;
  getSquadWeaponPerformance: (teamId: string) => Promise<void>;

  userHitPercentage: HitPercentageData | null;
  getUserHitPercentage: (userId: string) => Promise<HitPercentageData>;

  // New grouping summary state and methods
  groupingSummary: GroupingSummary | null;
  groupingSummaryLoading: boolean;
  getGroupingSummary: () => Promise<void>;
}

export const performanceStore = create<PerformanceStore>((set) => ({
  squadWeaponPerformance: [],
  isLoading: false,
  topAccurateSnipers: [],

  getTopAccurateSnipers: async (teamId: string) => {
    try {
      set({ isLoading: true });
      const data = await getTopAccurateSnipers(teamId);
      set({ topAccurateSnipers: data });
    } catch (error) {
      console.error("Failed to load top accurate snipers:", error);
      set({ topAccurateSnipers: [] });
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

      const data = await getUserGroupingSummaryRpc(userId);
      set({ groupingSummary: data });
    } catch (error) {
      console.error("Failed to load grouping summary:", error);
      set({ groupingSummary: null });
    } finally {
      set({ groupingSummaryLoading: false });
    }
  },
}));

