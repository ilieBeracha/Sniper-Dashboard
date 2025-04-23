import { supabase } from "./supabaseClient";

export async function getUserHitPercentageRpc(userId: string) {
  const { data, error } = await supabase.rpc("get_user_hit_percentage", {
    user_id: userId,
  });
  if (error) {
    console.error("SQL function failed:", error.message);
    throw new Error("Could not complete get_user_grouping_scores");
  }
  return data[0];
}

export async function getUserGroupingScoresRpc(userId: string) {
  const { data, error } = await supabase.rpc("get_user_grouping_scores", {
    user_id: userId,
  });
  if (error) {
    console.error("SQL function failed:", error.message);
    throw new Error("Could not complete get_user_grouping_scores");
  }
  return data;
}
