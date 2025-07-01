import { Assignment } from "@/types/training";
import { supabase } from "./supabaseClient";

export async function getTrainingById(trainingId: string) {
  const { data, error } = await supabase.rpc("get_trainings_with_assignment_sessions", {
    training_id: trainingId,
  });

  if (error) {
    console.error("Error fetching training with details:", error);
    return null;
  }

  return data[0];
}

export async function getTrainingByTeamId(teamId: string, currentUserId?: string) {
  const { data: trainings, error } = await supabase
    .from("training_session")
    .select(
      `
      id,
      date,
      session_name,
      location,
      status,
      assignment_session:assignment_session(
        id,
        assignment:assignment_id(
          id,
          assignment_name,
          created_at
        )
      ),
      participants:trainings_participants(
        id,
        participant_id,
        created_at,
        user:participant_id(
          id, 
          first_name,
          last_name,
          email
        )
      )
      `,
    )
    .eq("team_id", teamId)
    .order("created_at", { ascending: true })
    .limit(1000);

  if (error) {
    console.error("Error fetching trainings:", error);
    return [];
  }

  const processedTrainings = (trainings || []).map((training) => {
    const assignments = training.assignment_session.map((item) => item.assignment).filter(Boolean);
    const participantsCount = training.participants ? training.participants.length : 0;
    const isParticipating = currentUserId && training.participants ? training.participants.some((p) => p.participant_id === currentUserId) : false;

    return {
      ...training,
      assignments,
      participantsCount,
      isParticipating,
      assignment_session: undefined,
    };
  });

  return processedTrainings;
}

export async function getNextAndLastTraining(team_id: string) {
  const { data: nextTraining, error: nextError } = await supabase
    .from("training_session")
    .select(
      `
      id,
      date,
      session_name,
      assignment_session (
        assignment_id,
        assignment (
          id,
          assignment_name
        )
      )
    `,
    )
    .eq("team_id", team_id)
    .gt("date", new Date().toISOString())
    .order("date", { ascending: true })
    .limit(1)
    .maybeSingle();

  const { data: lastTraining, error: lastError } = await supabase
    .from("training_session")
    .select(
      `
      id,
      date,
      session_name,
      assignment_session (
        assignment_id,
        assignment (
          id,
          assignment_name
        )
      )
    `,
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
  return supabase.from("training_session").insert([payload]).select("id").maybeSingle();
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
  const { data, error } = await supabase.from("assignment").select("*");

  if (error) {
    console.error("Failed to fetch assignments:", error.message);
    return [];
  }

  return data || [];
}

export async function getWeeklyAssignmentsStats(team_id: string) {
  const { data, error } = await supabase.rpc("get_weekly_assignment_stats", {
    team_id_param: team_id,
  });

  if (error) throw new Error(error.message);

  return data;
}

export async function insertAssignment(assignmentName: string, teamId: string) {
  const { data, error } = await supabase
    .from("assignment")
    .insert([
      {
        assignment_name: assignmentName,
        team_id: teamId,
      },
    ])
    .select()
    .single();

  if (error) {
    console.error("Error inserting assignment:", error.message);
    return null;
  }

  return data;
}

export async function insertAssignmentSession(assignmentId: string, teamId: string, trainingId: string) {
  const { data, error } = await supabase
    .from("assignment_session")
    .insert([{ assignment_id: assignmentId, team_id: teamId, training_id: trainingId }])
    .select()
    .single();

  if (error) throw new Error(error.message);

  return data;
}
