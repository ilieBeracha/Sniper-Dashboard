// src/store/performanceStore.ts
import { create } from "zustand";
import { DayNightPerformance, HitPercentageData, SquadStats, SquadWeaponPerformance, TrainingEffectiveness } from "@/types/performance";
import { GroupingSummary } from "@/types/groupingScore";
import {
  getUserHitPercentageRpc,
  getWeaponPerformanceBySquadAndWeapon,
  getUserGroupingSummaryRpc,
  getTopAccurateSnipers,
  getDayNightPerformanceByTeam,
  getTrainingEffectivenessByTeam,
  getSquadStatByTeamId,
} from "@/services/performance";
import { userStore } from "./userStore";
import { User } from "@supabase/supabase-js";
import { PositionScore } from "@/types/score";

interface PerformanceStore {
  squadWeaponPerformance: SquadWeaponPerformance[];
  isLoading: boolean;
  topAccurateSnipers: User[];
  getTopAccurateSnipers: (teamId: string) => Promise<void>;
  getSquadWeaponPerformance: (teamId: string) => Promise<void>;
  dayNightPerformance: DayNightPerformance[];
  getDayNightPerformance: (teamId: string) => Promise<void>;
  squadStats: SquadStats[];
  getSquadStats: (teamId: string, position: PositionScore | null, distance: string | null) => Promise<void>;
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
  squadStats: [],

  trainingEffectiveness: [],

  userPerformanceConfig: [],
  bestSquadConfigurations: [],

  getSquadStats: async (teamId: string, position: PositionScore | null, distance: string | null) => {
    try {
      set({ isLoading: true });
      // const data = await getSquadStatByTeamId(teamId, position, distance);
      const data = {
        id: "1",
        team_id: teamId,
        position: position,
        distance: distance,
      };
      set({ squadStats: data as any });
    } catch (error) {
      console.error("Failed to load squad stats:", error);
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
      // const data = await getUserHitPercentageRpc(userId);
      const data = {
        hit_percentage: 0.5,
        total_shots: 100,
        total_hits: 50,
        assignments_count: 10,
      };
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
      // const data = await   (teamId);
      const data = {
        day_percentage: 0.5,
        night_percentage: 0.5,
        assignments_count: 10,
        total_missions: 10,
        accuracy: 0.5,
        first_shot_success_rate: 0.5,
        avg_reaction_time: 0.5,
        day_night: "day",
        team_id: teamId,
        id: "1",
        created_at: "2021-01-01",

        elimination_rate: 0.5,
      };

      set({ dayNightPerformance: data as any });
    } catch (error) {
      console.error("Failed to load day/night performance:", error);
      set({ dayNightPerformance: [] });
    } finally {
      set({ isLoading: false });
    }
  },
}));
