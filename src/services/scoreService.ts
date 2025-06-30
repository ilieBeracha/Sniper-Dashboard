import { Score, ScoreParticipant, ScoreTarget } from "@/types/score";
import { supabase } from "./supabaseClient";
// import { ScoreFormValues } from "@/hooks/useScoreForm";

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
export async function createScore(scoreData: Partial<Score>) {
  const { data, error } = await supabase.from("score").insert(scoreData).select("*");
  if (error) throw error;
  return data;
}
export async function getScoresByTrainingId(training_id: string) {
  try {
    const { data, error } = await supabase
      .from("score")
      .select(
        `
        *,
        assignment_session(
          id,
          training_id,
          assignment_id,
          assignment!inner(
            assignment_name
          )
        ),
        score_participants(
          id,
          user_id,
          user_duty,
          weapon_id,
          equipment_id,
          created_at,
          user:user_id(
            id,
            squad_id,
            first_name,
            last_name,
            squad:squad_id(
              squad_name
            )
          )
        )
      `,
      )
      .eq("training_id", training_id)
      .order("created_at", { ascending: false });

    console.log("Fetched scores:", data);

    if (error) {
      console.error("Error fetching scores:", error);
      throw new Error(`Failed to fetch scores: ${error.message}`);
    }

    return data;
  } catch (error) {
    console.error("Exception when fetching scores:", error);
    throw error;
  }
}
export async function createScoreParticipant(scoreParticipantData: Partial<ScoreParticipant>[], score_id: string) {
  try {
    if (!Array.isArray(scoreParticipantData) || scoreParticipantData.length === 0) {
      throw new Error("scoreParticipantData must be a non-empty array");
    }
    const participantsWithScoreId = scoreParticipantData.map((participant) => ({
      ...participant,
      score_id,
    }));
    const { data, error } = await supabase.from("score_participants").insert(participantsWithScoreId).select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Error creating score participant:", error);
    throw error;
  }
}
export async function createTarget(scoreData: Partial<ScoreTarget>[], score_id: string) {
  try {
    const targetsWithScoreId = scoreData.map((target) => ({
      ...target,
      score_id,
    }));
    const { data, error } = await supabase.from("score_ranges").insert(targetsWithScoreId).select("*");
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Exception when creating target:", error);
    throw error;
  }
}

export async function fetchScoreTargetsByScoreId(score_id: string) {
  try {
    const { data, error } = await supabase.from("score_ranges").select("*").eq("score_id", score_id);
    if (error) throw error;
    return data;
  } catch (error) {
    console.error("Exception when fetching score targets:", error);
    throw error;
  }
}
