import { create } from "zustand";
import { fetchFeedLog } from "@/services/feedService";

interface FeedItem {
  id: string;
  created_at: string;
  actor_id: string;
  action_type: string;
  context: Record<string, any>;
  team_id: string;
  squad_id: string;
  description?: string | null;
}

interface FeedStore {
  feed: FeedItem[];
  setFeed: (feed: FeedItem[]) => void;
  fetchFeedLog: (teamId: string) => void;
}

export const feedStore = create<FeedStore>((set) => ({
  feed: [],
  setFeed: (feed) => set({ feed }),

  fetchFeedLog: async (teamId: string) => {
    const data = await fetchFeedLog(teamId);
    set({ feed: data || [] });
  },
}));
