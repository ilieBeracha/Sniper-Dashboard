import { getUserHitPercentageRpc } from "@/services/scoreService";
import { create } from "zustand";

interface ScoreStore {
  userHitPercentage: string | number | null;
  getUserHitPercentage: (user_id: string) => any;
}

export const ScoreStore = create<ScoreStore>((set) => ({
  userHitPercentage: null,

  getUserHitPercentage: async (user_id: string) => {
    const data = await getUserHitPercentageRpc(user_id);
    console.log(data);
    set({ userHitPercentage: data });
    return data;
  },
}));
