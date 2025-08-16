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
  totalCount: number;
  isLoading: boolean;
  hasMore: boolean;
  currentPage: number;
  setFeed: (feed: FeedItem[]) => void;
  fetchFeedLog: (teamId: string, reset?: boolean) => void;
  resetFeed: () => void;
}

const ITEMS_PER_PAGE = 20;

export const feedStore = create<FeedStore>((set, get) => ({
  feed: [],
  totalCount: 0,
  isLoading: false,
  hasMore: true,
  currentPage: 0,
  
  setFeed: (feed) => set({ feed }),
  
  resetFeed: () => set({ 
    feed: [], 
    totalCount: 0, 
    currentPage: 0, 
    hasMore: true,
    isLoading: false 
  }),

  fetchFeedLog: async (teamId: string, reset = false) => {
    const state = get();
    
    // If already loading or no more items, return
    if (state.isLoading || (!reset && !state.hasMore)) return;
    
    set({ isLoading: true });
    
    try {
      const page = reset ? 0 : state.currentPage;
      const offset = page * ITEMS_PER_PAGE;
      
      const { data, count } = await fetchFeedLog(teamId, ITEMS_PER_PAGE, offset);
      
      if (reset) {
        set({ 
          feed: data || [], 
          totalCount: count || 0,
          currentPage: 1,
          hasMore: (data?.length || 0) < (count || 0),
          isLoading: false
        });
      } else {
        const newFeed = [...state.feed, ...(data || [])];
        set({ 
          feed: newFeed,
          totalCount: count || 0,
          currentPage: state.currentPage + 1,
          hasMore: newFeed.length < (count || 0),
          isLoading: false
        });
      }
    } catch (error) {
      console.error("Error fetching feed:", error);
      set({ isLoading: false });
    }
  },
}));
