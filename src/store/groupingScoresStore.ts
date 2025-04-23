import { getUserGroupingScoresRpc } from "@/services/groupingScoresService";
import { GroupingScore } from "@/types/groupingScore";
import { create } from "zustand";

interface GroupingScoreStore {
  groupingScores: GroupingScore[] | null;
  getUserGroupingScores: (user_id: string) => GroupingScore[] | any;
}

export const groupingScoreStore = create<GroupingScoreStore>((set) => ({
  groupingScores: null,

  getUserGroupingScores: async (user_id: string) => {
    const data = await getUserGroupingScoresRpc(user_id);
    console.log(data);
    set({ groupingScores: data });
    return data;
  },
}));
