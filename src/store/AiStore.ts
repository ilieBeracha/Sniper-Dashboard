import { create } from "zustand";
import { generateTrainingTasks } from "@/services/AiService";
import { userStore } from "./userStore";
import { parseTasksFromAI, ParsedTask } from "@/utils/taskUtils";

export interface Suggestion {
  topic: string;
  issue: string;
  recommendation: string;
}

export interface SuggestionData {
  user_id: string;
  role: string;
  topic: string;
  issue: string;
  recommendation: string;
  objective: string;
  suggestions: Suggestion[];
  last_training_id: string;
  last_training_date: string;
}

export interface AiStore {
  isLoading: boolean;
  isError: boolean;
  userTasks: ParsedTask[];
  getUserTasks: () => Promise<any>;
}

export const useAiStore = create<AiStore>((set) => ({
  isLoading: false,
  isError: false,
  userTasks: [],

  getUserTasks: async () => {
    try {
      set({ isLoading: true, isError: false });
      const aiResponse = await generateTrainingTasks(userStore.getState().user?.id as string);

      if (aiResponse) {
        const parsedTasks = parseTasksFromAI(aiResponse);
        set({ userTasks: parsedTasks, isLoading: false });
        return parsedTasks;
      } else {
        set({ userTasks: [], isLoading: false });
        return [];
      }
    } catch (error) {
      console.error("Failed to get user tasks:", error);
      set({ isError: true, isLoading: false, userTasks: [] });
      return [];
    }
  },
}));
