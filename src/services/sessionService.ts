import { CreateParticipantData, CreateSessionStatsData, CreateTargetEngagementData, CreateTargetStatsData } from "@/types/sessionStats";
import { supabase } from "./supabaseClient";

export const getSessionStatsByTrainingId = async (trainingId: string, limit: number = 20, offset: number = 0) => {
  const { data, error } = await supabase
    .from("session_stats")
    .select(
      ` *, assignment_session ( assignment ( assignment_name ) ), users!session_stats_creator_id_fkey ( first_name, last_name, email ), squads ( squad_name ), teams ( team_name )  `,
    )
    .eq("training_session_id", trainingId)
    .order("created_at", { ascending: false })
    .range(offset, offset + limit - 1);
  if (error) throw error;
  return data;
};

export const getSessionStatsCountByTrainingId = async (trainingId: string) => {
  const { count, error } = await supabase.from("session_stats").select("*", { count: "exact", head: true }).eq("training_session_id", trainingId);
  if (error) throw error;
  return count || 0;
};

// Get paginated assignments (groups) for a training session
export const getAssignmentGroupsByTrainingId = async (trainingId: string, limit: number = 10, offset: number = 0) => {
  // First get all distinct assignment IDs for this training
  const { data: allAssignments, error } = await supabase
    .from("session_stats")
    .select(`
      assignment_id,
      assignment_session!inner ( 
        assignment ( 
          assignment_name 
        ) 
      )
    `)
    .eq("training_session_id", trainingId)
    .not("assignment_id", "is", null);
  
  if (error) throw error;
  
  // Remove duplicates and sort by assignment name
  const uniqueAssignments = Array.from(
    new Map(
      allAssignments?.map(item => [
        item.assignment_id, 
        {
          assignment_id: item.assignment_id,
          assignment_name: item.assignment_session?.assignment?.assignment_name || "Unknown Assignment"
        }
      ]) || []
    ).values()
  ).sort((a, b) => a.assignment_name.localeCompare(b.assignment_name));
  
  // Apply pagination
  const paginatedAssignments = uniqueAssignments.slice(offset, offset + limit);
  
  return paginatedAssignments;
};

// Get all sessions for specific assignment IDs
export const getSessionStatsByAssignmentIds = async (trainingId: string, assignmentIds: string[]) => {
  const { data, error } = await supabase
    .from("session_stats")
    .select(
      ` *, assignment_session ( assignment ( assignment_name ) ), users!session_stats_creator_id_fkey ( first_name, last_name, email ), squads ( squad_name ), teams ( team_name )  `,
    )
    .eq("training_session_id", trainingId)
    .in("assignment_id", assignmentIds)
    .order("assignment_id")
    .order("created_at", { ascending: false });
  
  if (error) throw error;
  return data || [];
};

// Get count of distinct assignments for a training session
export const getAssignmentGroupsCountByTrainingId = async (trainingId: string) => {
  const { data, error } = await supabase
    .from("session_stats")
    .select("assignment_id")
    .eq("training_session_id", trainingId)
    .not("assignment_id", "is", null);
  
  if (error) throw error;
  
  // Count unique assignment IDs
  const uniqueAssignmentIds = new Set(data?.map(item => item.assignment_id) || []);
  return uniqueAssignmentIds.size;
};

export const createSessionStats = async (sessionData: CreateSessionStatsData) => {
  const { data, error } = await supabase.from("session_stats").insert(sessionData).select().single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createSessionParticipants = async (participantsData: CreateParticipantData[]) => {
  const { data, error } = await supabase.from("session_participants").insert(participantsData).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createTargetStats = async (targetData: CreateTargetStatsData) => {
  const { data, error } = await supabase.from("target_stats").insert(targetData).select().single();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

export const createTargetEngagements = async (engagementsData: CreateTargetEngagementData[]) => {
  if (engagementsData.length === 0) return [];

  const { data, error } = await supabase.from("target_engagements").insert(engagementsData).select();

  if (error) {
    throw new Error(error.message);
  }

  return data;
};

// Complete session save - coordinates all database operations
export const saveCompleteSession = async (sessionData: {
  sessionStats: CreateSessionStatsData;
  participants: CreateParticipantData[];
  targets: Array<{
    targetStats: CreateTargetStatsData;
    engagements: CreateTargetEngagementData[];
  }>;
}) => {
  try {
    // 1. Create session stats
    const session = await createSessionStats(sessionData.sessionStats);
    const sessionId = session.id;

    // 2. Create participants with session_id
    const participantsWithSessionId = sessionData.participants.map((p) => ({
      ...p,
      session_stats_id: sessionId,
    }));
    await createSessionParticipants(participantsWithSessionId);

    // 3. Create targets and their engagements
    for (const targetData of sessionData.targets) {
      // Create target with session_id
      const targetWithSessionId = {
        ...targetData.targetStats,
        session_stats_id: sessionId,
      };
      const target = await createTargetStats(targetWithSessionId);

      // Create engagements with target_id
      if (targetData.engagements.length > 0) {
        const engagementsWithTargetId = targetData.engagements.map((e) => ({
          ...e,
          target_stats_id: target.id,
        }));
        await createTargetEngagements(engagementsWithTargetId);
      }
    }

    return session;
  } catch (error) {
    console.error("Error in saveCompleteSession:", error);
    throw error;
  }
};
