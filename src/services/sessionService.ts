import { supabase } from "./supabaseClient";

export interface CreateSessionStatsData {
  training_session_id: string;
  assignment_id: string | null;
  creator_id: string | null;
  squad_id: string | null;
  team_id: string | null;
  day_period: string | null;
  time_to_first_shot_sec: number | null;
  note?: string | null;
}

export interface CreateParticipantData {
  session_stats_id: string;
  user_id: string;
  user_duty: "Sniper" | "Spotter";
  weapon_id?: string | null;
  equipment_id?: string | null;
  position: string;
}

export interface CreateTargetStatsData {
  session_stats_id: string;
  distance_m: number;
  wind_strength?: number | null;
  wind_direction_deg?: number | null;
  total_hits: number;
  target_eliminated: boolean;
  mistake_code?: string | null;
}

export interface CreateTargetEngagementData {
  target_stats_id: string;
  user_id: string;
  shots_fired: number;
  target_hits: number;
  is_estimated: boolean;
  estimated_method?: string | null;
}

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
