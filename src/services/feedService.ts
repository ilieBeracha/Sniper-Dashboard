import { supabase } from "./supabaseClient";
import { toastService } from "./toastService";

export const fetchFeedLog = async (teamId: string) => {
  try {
    const { data, error } = await supabase.from("feed_log").select("*").eq("team_id", teamId).order("created_at", { ascending: false }).limit(10);

    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to fetch feed log");
    }

    return data;
  } catch (error: any) {
    console.error("Error fetching feed log:", error.message);
    throw new Error("Failed to fetch feed log");
  }
};
