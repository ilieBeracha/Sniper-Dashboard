import { create } from "zustand";
import { askAssistant, getSuggestions } from "@/services/embeddingService";
import { userStore } from "./userStore";
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
  suggestions: any[];
  setSuggestions: (suggestions: any[]) => void;
  generateSuggestions: () => Promise<any[]>;
  getSuggestions: (user_id: string) => Promise<any[]>;
}

export const useAiStore = create<AiStore>((set) => ({
  isLoading: false,
  isError: false,

  suggestions: [],

  setSuggestions: (suggestions: any[]) => set({ suggestions }),
  getSuggestions: async () => {
    const { user } = userStore.getState();
    const tasks = await getSuggestions(user?.id || "");
    set({ suggestions: tasks });
    return tasks;
  },
  generateSuggestions: async () => {
    const { user } = userStore.getState();
    if (!user?.id) {
      set({ isError: true });
      return [];
    }

    set({ isLoading: true, isError: false });

    try {
      const result = await askAssistant("hows my score?, what is my accuracy?, performance?");
      if (result && typeof result === "object") {
        const suggestions = result as unknown as any[];
        set({ suggestions });
        return suggestions;
      } else {
        set({ isError: true, isLoading: false });
        return [];
      }
    } catch (err) {
      console.error("Error generating suggestions:", err);
      set({ isError: true, isLoading: false });
      return [];
    } finally {
      set({ isLoading: false });
    }
  },
}));
