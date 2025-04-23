import { supabase } from "./supabaseClient";

export async function getNextAndLastTraining(team_id: string) {
  const { data: nextTraining, error: nextError } = await supabase
    .from("training_sessions")
    .select(
      `
      id,
      date,
      session_name,
      assignments_trainings (
        assignment_id,
        assignments (
          id,
          assignment_name
        )
      )
    `
    )
    .eq("team_id", team_id)
    .gt("date", new Date().toISOString())
    .order("date", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: lastTraining, error: lastError } = await supabase
    .from("training_sessions")
    .select(
      `
      id,
      date,
      session_name,
      assignments_trainings (
        assignment_id,
        assignments (
          id,
          assignment_name
        )
      )
    `
    )
    .eq("team_id", team_id)
    .lt("date", new Date().toISOString())
    .order("date", { ascending: false })
    .limit(1)
    .maybeSingle();

  if (nextError || lastError) {
    throw new Error("Failed to fetch trainings");
  }

  return { nextTraining, lastTraining };
}
