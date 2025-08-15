import { supabase } from "./supabaseClient";
import { toastService } from "./toastService";

export const fetchFeedLog = async (teamId: string) => {
  try {
    const { data, error } = await supabase
      .from("feed_log")
      .select("* , actor_id:users!feed_log_actor_id_fkey (id, first_name, last_name, email)")
      .eq("team_id", teamId)
      .order("created_at", { ascending: false })
      .limit(1000);

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
