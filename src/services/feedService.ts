import { supabase } from "./supabaseClient";

export const fetchFeedLog = async () => {
  try {
    const { data } = await supabase.from("feed_log").select("*").order("created_at", { ascending: false }).limit(10);
    return data;
  } catch (error: any) {
    console.error("Error fetching feed log:", error.message);
    throw new Error("Failed to fetch feed log");
  }
};
