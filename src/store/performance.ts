// src/store/performanceStore.ts
import { create } from "zustand";
import {
  DayNightPerformance,
  HitPercentageData,
  SquadWeaponPerformance,
  SquadPerformance,
  TrainingEffectiveness,
  UserPerformanceConfig,
  BestSquadConfig,
} from "@/types/performance";
import { GroupingSummary } from "@/types/groupingScore";
import {
  getUserHitPercentageRpc,
  getWeaponPerformanceBySquadAndWeapon,
  getUserGroupingSummaryRpc,
  getTopAccurateSnipers,
  getDayNightPerformanceByTeam,
  getTrainingEffectivenessByTeam,
  getSquadPerformanceByTeam,
  getBestSquadConfigurations,
  getUserPerformanceByConfiguration,
} from "@/services/performance";
import { userStore } from "./userStore";
import { User } from "@supabase/supabase-js";


interface PerformanceStore {
  squadWeaponPerformance: SquadWeaponPerformance[];
  isLoading: boolean;
  topAccurateSnipers: User[];
  getTopAccurateSnipers: (teamId: string) => Promise<void>;
  getSquadWeaponPerformance: (teamId: string) => Promise<void>;
  dayNightPerformance: DayNightPerformance[];
  getDayNightPerformance: (teamId: string) => Promise<void>;

  squadPerformance: SquadPerformance[];
  getSquadPerformance: (teamId: string) => Promise<void>;

  userPerformanceConfig: UserPerformanceConfig[];
  getUserPerformanceConfig: (teamId: string) => Promise<void>;

  bestSquadConfigurations: BestSquadConfig[];
  getBestSquadConfigurations: (teamId: string) => Promise<void>;

  userHitPercentage: HitPercentageData | null;
  getUserHitPercentage: (userId: string) => Promise<HitPercentageData>;

  groupingSummary: GroupingSummary | null;
  groupingSummaryLoading: boolean;
  getGroupingSummary: () => Promise<void>;

  trainingEffectiveness: TrainingEffectiveness[];
  getTrainingEffectiveness: (teamId: string) => Promise<void>;
}

export const performanceStore = create<PerformanceStore>((set) => ({
  squadWeaponPerformance: [],
  isLoading: false,
  topAccurateSnipers: [],
  dayNightPerformance: [],
  squadPerformance: [],
  trainingEffectiveness: [],

  userPerformanceConfig: [],
  bestSquadConfigurations: [],

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

  getSquadPerformanceByTeam: async (teamId: string) => {
    try {
      set({ isLoading: true });
      const data = await getSquadPerformanceByTeam(teamId);
      set({ squadPerformance: data });
    } catch (error) {
      console.error("Failed to load squad performance:", error);
      set({ squadPerformance: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getBestSquadConfigurations: async (teamId: string) => {
    try {
      set({ isLoading: true });
      const data = await getBestSquadConfigurations(teamId);
      console.log(data);
      set({ bestSquadConfigurations: data });
    } catch (error) {
      console.error("Failed to load best squad configurations:", error);
    } finally {
      set({ isLoading: false });
    }
  },

  getUserPerformanceConfig: async (teamId: string) => {
    try {
      set({ isLoading: true });
      const data = await getUserPerformanceByConfiguration(teamId);
      set({ userPerformanceConfig: data });
    } catch (error) {
      console.error("Failed to load user performance config:", error);
    } finally {
      set({ isLoading: false });
    }
  },

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

  getDayNightPerformance: async (teamId: string) => {
    try {
      set({ isLoading: true });
      const data = await getDayNightPerformanceByTeam(teamId);
      set({ dayNightPerformance: data });
    } catch (error) {
      console.error("Failed to load day/night performance:", error);
      set({ dayNightPerformance: [] });
    } finally {
      set({ isLoading: false });
    }
  },

  getSquadPerformance: async (teamId: string) => {
    try {
      set({ isLoading: true });
      const data = await getSquadPerformanceByTeam(teamId);
      set({ squadPerformance: data });
    } catch (error) {
      console.error("Failed to load squad performance:", error);
      set({ squadPerformance: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
