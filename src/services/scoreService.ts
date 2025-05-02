import { Score } from "@/types/score";
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

export async function getScoresByTrainingId(training_id: string): Promise<any[]> {
  try {
    const { data, error } = await supabase
      .from('score')
      .select(`
        *,
        assignment_session!inner(
          id,
          training_id,
          assignment_id,
          assignment:assignment_id (
            assignment_name
          )
        ),
        squad:squad_id (
          squad_name
        ),
        score_participants (
          id,
          user_id,
          role,
          weapon_id,
          equipment_id,
          position,
          created_at,
          user:user_id (
            id,
            squad_id,
            first_name,
            last_name
          )
        )
      `)
      .eq('assignment_session.training_id', training_id)
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error fetching scores:', error);
      throw new Error(`Failed to fetch scores: ${error.message}`);
    }

    return data || [];
  } catch (error) {
    console.error('Exception when fetching scores:', error);
    throw error;
  }
}


export async function createScore(data: Score) {
  const { error } = await supabase.from("score").insert([data]);

  if (error) throw new Error(error.message);
  return data;
}
