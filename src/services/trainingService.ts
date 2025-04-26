import { Assignment } from "@/types/training";
import { supabase } from "./supabaseClient";

export async function getTrainingById(trainingId: string) {
  const { data, error } = await supabase
    .from("training_sessions")
    .select(
      `
      *,
      participants:trainings_participants(
        id,
        participant_id,
        created_at,
        user:participant_id(
          id, 
          first_name, 
          last_name, 
          email, 
          user_role,
          team_id,
          squad_id
        )
      ),
      assignments_trainings:assignments_trainings(
        id,
        assignment:assignment_id(
          id,
          assignment_name,
          created_at
        )
      )
    `
    )
    .eq("id", trainingId)
    .single();

  if (error) {
    console.error("Error fetching training with details:", error);
    return null;
  }

  return data;
}

export async function getTrainingByTeamId(teamId: string) {
  const { data: trainings, error } = await supabase
    .from("training_sessions")
    .select(
      `
      id,
      date,
      session_name,
      location,
      status,
      assignments_trainings:assignments_trainings(
        id,
        assignment:assignment_id(
          id,
          assignment_name,
          created_at
        )
      )
      participants:trainings_participants(
        id,
        participant_id,
        created_at,
        user:participant_id(
          id, 
          first_name, 
      
    `
    )
    .eq("team_id", teamId)
    .order("date", { ascending: true })
    .limit(30);

  if (error) {
    console.error("Error fetching trainings:", error);
    return [];
  }

  return trainings;
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
  return supabase.from("training_sessions").insert([payload]).select("id").maybeSingle();
}

export async function assignParticipantsToTraining(training_id: string, participantIds: string[]) {
  const participants = participantIds.map((participant_id) => ({
    training_id,
    participant_id,
  }));

  const { error } = await supabase.from("trainings_participants").insert(participants);

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
