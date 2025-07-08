import { create } from "zustand";

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
}

export const useAiStore = create<AiStore>(() => ({
  isLoading: false,
  isError: false,
}));
