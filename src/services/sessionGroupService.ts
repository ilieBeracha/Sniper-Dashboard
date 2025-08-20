import { supabase } from "./supabaseClient";
import { toast } from "react-toastify";
import { 
  TrainingGroup, 
  TrainingGroupWithCount, 
  CreateTrainingGroupPayload,
  AddTrainingsToGroupPayload 
} from "@/types/sessionGroup";

export async function getTrainingGroups(teamId: string): Promise<TrainingGroupWithCount[]> {
  try {
    const { data, error } = await supabase
      .from("training_groups")
      .select(`
        *,
        training_group_trainings (
          count
        )
      `)
      .eq("team_id", teamId)
      .order("created_at", { ascending: false });

    if (error) {
      console.error("Error fetching training groups:", error);
      toast.error("Failed to fetch training groups");
      return [];
    }

    // Transform data to include count
    const groupsWithCount = data?.map(group => ({
      ...group,
      training_count: group.training_group_trainings?.length || 0
    })) || [];

    return groupsWithCount;
  } catch (error: any) {
    console.error("Exception when fetching training groups:", error);
    toast.error(error.message);
    return [];
  }
}

export async function createTrainingGroup(payload: CreateTrainingGroupPayload): Promise<TrainingGroup | null> {
  try {
    const { data, error } = await supabase
      .from("training_groups")
      .insert([{
        team_id: payload.team_id,
        name: payload.name,
        description: payload.description
      }])
      .select()
      .single();

    if (error) {
      console.error("Error creating training group:", error);
      toast.error("Failed to create training group");
      return null;
    }

    toast.success("Training group created successfully");
    return data;
  } catch (error: any) {
    console.error("Exception when creating training group:", error);
    toast.error(error.message);
    return null;
  }
}

export async function addTrainingsToGroup(payload: AddTrainingsToGroupPayload): Promise<boolean> {
  try {
    // First, we need to get the session_stats IDs for these training sessions
    // The foreign key constraint expects session_stats IDs, not training_session IDs
    const { data: sessionStats, error: statsError } = await supabase
      .from("session_stats")
      .select("id, training_id")
      .in("training_id", payload.training_ids);

    if (statsError) {
      console.error("Error fetching session stats:", statsError);
      toast.error("Failed to fetch session statistics");
      return false;
    }

    if (!sessionStats || sessionStats.length === 0) {
      toast.warning("No session statistics found for the selected trainings. Only trainings with recorded statistics can be added to groups.");
      return false;
    }

    // Map to session_stats IDs for the insert
    const insertData = sessionStats.map(stat => ({
      group_id: payload.group_id,
      training_id: stat.id // Use session_stats ID, not training_session ID
    }));

    const { error } = await supabase
      .from("training_group_trainings")
      .insert(insertData);

    if (error) {
      console.error("Error adding trainings to group:", error);
      toast.error("Failed to add trainings to group");
      return false;
    }

    toast.success(`Added ${sessionStats.length} training(s) to group`);
    return true;
  } catch (error: any) {
    console.error("Exception when adding trainings to group:", error);
    toast.error(error.message);
    return false;
  }
}

export async function removeTrainingFromGroup(groupId: string, trainingId: string): Promise<boolean> {
  try {
    // First get the session_stats ID for this training
    const { data: sessionStats, error: statsError } = await supabase
      .from("session_stats")
      .select("id")
      .eq("training_id", trainingId)
      .limit(1)
      .single();

    if (statsError || !sessionStats) {
      console.error("Error fetching session stats:", statsError);
      toast.error("Failed to find session statistics");
      return false;
    }

    const { error } = await supabase
      .from("training_group_trainings")
      .delete()
      .eq("group_id", groupId)
      .eq("training_id", sessionStats.id); // Use session_stats ID

    if (error) {
      console.error("Error removing training from group:", error);
      toast.error("Failed to remove training from group");
      return false;
    }

    toast.success("Training removed from group");
    return true;
  } catch (error: any) {
    console.error("Exception when removing training from group:", error);
    toast.error(error.message);
    return false;
  }
}

export async function getTrainingsInGroup(groupId: string): Promise<any[]> {
  try {
    // First get the session_stats IDs in this group
    const { data: groupTrainings, error: groupError } = await supabase
      .from("training_group_trainings")
      .select("training_id") // This is actually session_stats ID
      .eq("group_id", groupId);

    if (groupError) {
      console.error("Error fetching group trainings:", groupError);
      toast.error("Failed to fetch trainings in group");
      return [];
    }

    if (!groupTrainings || groupTrainings.length === 0) {
      return [];
    }

    // Extract session_stats IDs
    const sessionStatsIds = groupTrainings.map(gt => gt.training_id);

    // Get the actual training_session IDs from session_stats
    const { data: sessionStats, error: statsError } = await supabase
      .from("session_stats")
      .select("training_id")
      .in("id", sessionStatsIds);

    if (statsError) {
      console.error("Error fetching session stats:", statsError);
      toast.error("Failed to fetch session statistics");
      return [];
    }

    if (!sessionStats || sessionStats.length === 0) {
      return [];
    }

    // Get unique training IDs
    const trainingIds = [...new Set(sessionStats.map(stat => stat.training_id))];

    // Now fetch the training sessions
    const { data: trainings, error: trainingsError } = await supabase
      .from("training_session")
      .select(`
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
      `)
      .in("id", trainingIds)
      .order("date", { ascending: false });

    if (trainingsError) {
      console.error("Error fetching trainings:", trainingsError);
      toast.error("Failed to fetch training details");
      return [];
    }

    return trainings || [];
  } catch (error: any) {
    console.error("Exception when fetching trainings in group:", error);
    toast.error(error.message);
    return [];
  }
}

export async function getGroupsForTraining(trainingId: string): Promise<TrainingGroup[]> {
  try {
    const { data, error } = await supabase
      .from("training_groups")
      .select(`
        *,
        training_group_trainings!inner(training_id)
      `)
      .eq("training_group_trainings.training_id", trainingId);

    if (error) {
      console.error("Error fetching groups for training:", error);
      return [];
    }

    return data || [];
  } catch (error: any) {
    console.error("Exception when fetching groups for training:", error);
    return [];
  }
}

export async function deleteTrainingGroup(groupId: string): Promise<boolean> {
  try {
    // First delete all training associations
    await supabase
      .from("training_group_trainings")
      .delete()
      .eq("group_id", groupId);

    // Then delete the group
    const { error } = await supabase
      .from("training_groups")
      .delete()
      .eq("id", groupId);

    if (error) {
      console.error("Error deleting training group:", error);
      toast.error("Failed to delete training group");
      return false;
    }

    toast.success("Training group deleted successfully");
    return true;
  } catch (error: any) {
    console.error("Exception when deleting training group:", error);
    toast.error(error.message);
    return false;
  }
}