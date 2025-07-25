import { Assignment } from "@/types/training";
import { supabase } from "./supabaseClient";
import { toast } from "react-toastify";

export async function getTrainingById(trainingId: string) {
  const { data, error } = await supabase.rpc("get_training_by_id", {
    training_id: trainingId,
  });

  if (error) {
    console.error("Error fetching training with details:", error);
    return null;
  }

  return data[0];
}

export async function getTrainingCountByTeamId(teamId: string) {
  try {
    const { count, error } = await supabase
      .from("training_session")
      .select("*", { count: "exact", head: true })
      .eq("team_id", teamId)
      .neq("status", "canceled");

    if (error) {
      console.error("Error fetching training count:", error);
      return 0;
    }

    return count || 0;
  } catch (error: any) {
    console.error("Exception when fetching training count:", error);
    toast.error(error.message);
    throw new Error("Failed to fetch training count");
    return 0;
  }
}

export async function getTrainingByTeamId(teamId: string, limit: number = 0, range: number = 0) {
  let query = supabase
    .from("training_session")
    .select(
      `
      id,
      date,
      session_name,
      location,
      status,
      creator:users!fk_training_session_creator_id (
        id,
        first_name,
        last_name,
        email
      ),
      assignment_session:assignment_session (
        id,
        assignment:assignment_id (
          id,
          assignment_name,
          created_at
        )
      )
      `,
    )
    .eq("team_id", teamId)
    .neq("status", "canceled")
    .order("date", { ascending: false });

  if (limit > 0) {
    const rangeEnd = range + limit - 1;
    query = query.range(range, rangeEnd);
  }

  const { data: trainings, error } = await query;

  if (error) {
    console.error("Error fetching trainings:", error);
    toast.error(error.message);
    throw new Error("Failed to fetch trainings");
    return [];
  }

  const processedTrainings = (trainings || []).map((training) => {
    const assignments = training.assignment_session?.map((item) => item.assignment).filter(Boolean);
    return {
      ...training,
      assignments,
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
    toast.error(nextError?.message || lastError?.message);
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

  if (error) {
    toast.error(error.message);
    throw new Error("Failed to assign participants to training");
  }
}

export async function getAssignments(teamId: string): Promise<Assignment[] | []> {
  const { data, error } = await supabase.from("assignment").select("*").eq("team_id", teamId);

  if (error) {
    console.error("Failed to fetch assignments:", error.message);
    toast.error(error.message);
    throw new Error("Failed to fetch assignments");
    return [];
  }

  return data || [];
}

export async function getWeeklyAssignmentsStats(team_id: string) {
  try {
    const { data, error } = await supabase.rpc("get_weekly_assignment_stats", {
      team_id_param: team_id,
    });

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching weekly assignments stats:", error);
    toast.error(error.message);
    throw new Error("Failed to fetch weekly assignments stats");
    return [];
  }
}

export async function insertAssignment(assignmentName: string, teamId: string) {
  try {
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
      console.error("Error inserting assignment:", error);
      return null;
    }

    return data;
  } catch (error: any) {
    console.error("Error inserting assignment:", error);
    toast.error(error.message);
    throw new Error("Failed to insert assignment");
    return null;
  }
}

export async function getAssignmentSessions(assignmentId: string) {
  try {
    const { data, error } = await supabase.from("assignment_session").select("*").eq("assignment_id", assignmentId);
    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error fetching assignment sessions:", error);
    toast.error(error.message);
    throw new Error("Failed to fetch assignment sessions");
    return [];
  }
}

export async function insertAssignmentSession(assignmentId: string, teamId: string, trainingId: string) {
  try {
    const { data, error } = await supabase
      .from("assignment_session")
      .insert([{ assignment_id: assignmentId, team_id: teamId, training_id: trainingId }])
      .select()
      .single();

    if (error) throw error;
    return data;
  } catch (error: any) {
    console.error("Error inserting assignment session:", error);
    toast.error(error.message);
    throw new Error("Failed to insert assignment session");
    return null;
  }
}
