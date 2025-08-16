import { supabase } from "./supabaseClient";
import { toastService } from "./toastService";

export const fetchFeedLog = async (teamId: string, limit = 20, offset = 0) => {
  try {
    const { data, error, count } = await supabase
      .from("feed_log")
      .select("* , actor_id:users!feed_log_actor_id_fkey (id, first_name, last_name, email)", { count: "exact" })
      .eq("team_id", teamId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);

    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to fetch feed log");
    }

    return { data, count };
  } catch (error: any) {
    console.error("Error fetching feed log:", error.message);
    throw new Error("Failed to fetch feed log");
  }
};
