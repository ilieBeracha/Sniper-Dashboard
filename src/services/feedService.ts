import { supabase } from "./supabaseClient";

export const fetchFeedLog = async () => {
  const { data } = await supabase.from("feed_log").select("*").order("created_at", { ascending: false }).limit(10);
  return data;
};
