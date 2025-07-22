import { CreateParticipantData, CreateSessionStatsData, CreateTargetEngagementData, CreateTargetStatsData } from "@/types/sessionStats";
import { supabase } from "./supabaseClient";
import { toastService } from "./toastService";

export const getSessionStatsByTrainingId = async (trainingId: string, limit: number = 20, offset: number = 0) => {
  try {
    const { data, error } = await supabase
      .from("session_stats")
      .select(
        ` *, assignment_session ( assignment ( assignment_name ) ), users!session_stats_creator_id_fkey ( first_name, last_name, email ), teams ( team_name )  `,
      )
      .eq("training_session_id", trainingId)
      .order("created_at", { ascending: false })
      .range(offset, offset + limit - 1);
    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to fetch session stats");
    }
    return data;
  } catch (error: any) {
    console.error("Error fetching session stats:", error.message);
    throw new Error("Failed to fetch session stats");
  }
};

export const getSessionStatsCountByTrainingId = async (trainingId: string) => {
  try {
    const { count, error } = await supabase.from("session_stats").select("*", { count: "exact", head: true }).eq("training_session_id", trainingId);
    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to fetch session stats count");
    }
    return count || 0;
  } catch (error: any) {
    console.error("Error fetching session stats count:", error.message);
    throw new Error("Failed to fetch session stats count");
  }
};

export const createSessionStats = async (sessionData: CreateSessionStatsData) => {
  try {
    const { data, error } = await supabase.from("session_stats").insert(sessionData).select().single();

    if (error) {
      toastService.error(error.message);
      throw new Error(error.message);
    }

    return data;
  } catch (error: any) {
    console.error("Error creating session stats:", error.message);
    throw new Error("Failed to create session stats");
  }
};

export const createSessionParticipants = async (participantsData: CreateParticipantData[]) => {
  try {
    const { data, error } = await supabase.from("session_participants").insert(participantsData).select();
    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to create session participants");
    }
    return data;
  } catch (error: any) {
    console.error("Error creating session participants:", error.message);
    throw new Error("Failed to create session participants");
  }
};

export const createTargetStats = async (targetData: CreateTargetStatsData) => {
  try {
    const { data, error } = await supabase.from("target_stats").insert(targetData).select().single();
    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to create target stats");
    }
    return data;
  } catch (error: any) {
    console.error("Error creating target stats:", error.message);
    throw new Error("Failed to create target stats");
  }
};

export const createTargetEngagements = async (engagementsData: CreateTargetEngagementData[]) => {
  try {
    if (engagementsData.length === 0) return [];

    const { data, error } = await supabase.from("target_engagements").insert(engagementsData).select();

    if (error) {
      toastService.error(error.message);
      throw new Error("Failed to create target engagements");
    }

    return data;
  } catch (error: any) {
    console.error("Error creating target engagements:", error.message);
    throw new Error("Failed to create target engagements");
  }
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
  } catch (error: any) {
    console.error("Error in saveCompleteSession:", error.message);
    toastService.error(error.message);
    throw error;
  }
};
