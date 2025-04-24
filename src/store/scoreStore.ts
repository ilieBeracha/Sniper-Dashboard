import {
  getUserGroupingScoresRpc,
  getUserHitPercentageRpc,
} from "@/services/scoreService";
import { GroupingScore } from "@/types/groupingScore";
import { HitPercentageData } from "@/types/score";
import { create } from "zustand";

interface ScoreStore {
  userHitPercentage: HitPercentageData | null;
  userGroupingScores: GroupingScore[];
  getUserHitPercentage: (user_id: string) => any;
  getUserGroupingScores: (user_id: string) => any;
}

export const ScoreStore = create<ScoreStore>((set) => ({
  userHitPercentage: null,
  userGroupingScores: [],

  getUserHitPercentage: async (user_id: string) => {
    const data = await getUserHitPercentageRpc(user_id);
    set({ userHitPercentage: data });
    return data;
  },

  getUserGroupingScores: async (user_id: string) => {
    const data = await getUserGroupingScoresRpc(user_id);
    set({ userGroupingScores: data });
    return data;
  },
}));
