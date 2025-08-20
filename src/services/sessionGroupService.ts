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
    const insertData = payload.training_ids.map(training_id => ({
      group_id: payload.group_id,
      training_id: training_id
    }));

    const { error } = await supabase
      .from("training_group_trainings")
      .insert(insertData);

    if (error) {
      console.error("Error adding trainings to group:", error);
      toast.error("Failed to add trainings to group");
      return false;
    }

    toast.success(`Added ${payload.training_ids.length} training(s) to group`);
    return true;
  } catch (error: any) {
    console.error("Exception when adding trainings to group:", error);
    toast.error(error.message);
    return false;
  }
}

export async function removeTrainingFromGroup(groupId: string, trainingId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("training_group_trainings")
      .delete()
      .eq("group_id", groupId)
      .eq("training_id", trainingId);

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
    const { data, error } = await supabase
      .rpc("get_trainings_in_group", {
        p_group_id: groupId
      });

    if (error) {
      // If RPC doesn't exist, use regular join query
      const { data: joinData, error: joinError } = await supabase
        .from("session_stats")
        .select("*")
        .in("id", 
          supabase
            .from("training_group_trainings")
            .select("training_id")
            .eq("group_id", groupId)
        );

      if (joinError) {
        console.error("Error fetching trainings in group:", joinError);
        toast.error("Failed to fetch trainings in group");
        return [];
      }

      return joinData || [];
    }

    return data || [];
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