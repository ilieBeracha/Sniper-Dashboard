import { supabase } from "./supabaseClient";

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

export async function getScoresByAssignmentSessionId(assignmentSessionId: string) {
  const { data, error } = await supabase.from("score").select("*").eq("assignment_session_id", assignmentSessionId);
  if (error) {
    console.error("Error fetching scores by assignment ID:", error);
    throw error;
  }

  return data;
}

export async function getScoresByTrainingId(trainingId: string) {
  const { data, error } = await supabase.rpc("get_scores_by_training_session", {
    training_session_id: trainingId,
  });

  if (error) {
    console.error("Error fetching scores by training ID:", error);
    throw error;
  }
  return data;
}
