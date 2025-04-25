import { Assignment } from "@/types/training";
import { supabase } from "./supabaseClient";

export async function getTrainingByTeamId(teamId: string) {
  const now = new Date().toISOString();

  const { data: trainings, error } = await supabase
    .from("training_sessions")
    .select(
      `
      id,
      date,
      session_name,
      location,
      assignments_trainings (
        assignments (
          id,
          assignment_name
        )
      )
    `
    )
    .eq("team_id", teamId)
    .gte("date", now)
    .order("date", { ascending: true });

  if (error) {
    console.error("Error fetching trainings:", error);
    return [];
  }

  // 🔥 Transform the nested assignments structure here
  const flattenedTrainings = (trainings || []).map((t) => ({
    ...t,
    assignments_trainings: t.assignments_trainings
      .map((a: any) => a.assignments)
      .filter(Boolean),
  }));

  return flattenedTrainings;
}

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

export async function insertTraining(payload: any) {
  return supabase
    .from("training_sessions")
    .insert([payload])
    .select("id")
    .maybeSingle();
}

export async function assignParticipantsToTraining(
  training_id: string,
  participantIds: string[]
) {
  const participants = participantIds.map((participant_id) => ({
    training_id,
    participant_id,
  }));

  const { error } = await supabase
    .from("trainings_participants")
    .insert(participants);

  if (error) throw new Error(error.message);
}

export async function getAssignments(): Promise<Assignment[] | []> {
  const { data, error } = await supabase.from("assignments").select("*");

  if (error) {
    console.error("Failed to fetch assignments:", error.message);
    return [];
  }

  return data || [];
}
