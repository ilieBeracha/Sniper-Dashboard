import { CreateParticipantData, CreateSessionStatsData, CreateTargetEngagementData, CreateTargetStatsData } from "@/types/sessionStats";
import { supabase } from "./supabaseClient";
import { toastService } from "./toastService";

export const getSessionStatsByTrainingId = async (
  trainingId: string,
  limit: number = 20,
  offset: number = 0,
  filters?: {
    dayNight: string | null;
    effort: string | null;
    distance: string | null;
    participated: boolean | null;
    userEmail?: string | null;
  },
) => {
  let queryBuilder = supabase.from("session_stats").select(
    `
      *,
      assignment_session (
        assignment (
          assignment_name
        )
      ),
      users!session_stats_creator_id_fkey (
        first_name,
        last_name,
        email
      ),
      teams (
        team_name
      ),
      target_stats!target_stats_session_stats_id_fkey (
        distance_m
      ),
      session_participants!session_participants_session_stats_id_fkey (
        *,
        users!session_participants_user_id_fkey (
          first_name,
          last_name,
          email
        )
      )
      `,
  );

  queryBuilder = queryBuilder.eq("training_session_id", trainingId);

  if (filters) {
    if (filters.dayNight && filters.dayNight !== "all") {
      queryBuilder = queryBuilder.eq("day_period", filters.dayNight);
    }

    if (filters.effort && filters.effort !== "all") {
      const effortBool = filters.effort === "true";
      queryBuilder = queryBuilder.eq("effort", effortBool);
    }

    if (filters.participated && filters.userEmail) {
      const { data: userData, error: userError } = await supabase.from("users").select("id").eq("email", filters.userEmail).single();

      if (!userError && userData) {
        const { data: userSessions, error: sessionsError } = await supabase
          .from("session_participants")
          .select("session_stats_id")
          .eq("user_id", userData.id);

        if (!sessionsError && userSessions) {
          const sessionIds = userSessions.map((s) => s.session_stats_id);
          if (sessionIds.length > 0) {
            queryBuilder = queryBuilder.in("id", sessionIds);
          } else {
            return [];
          }
        }
      } else {
        return [];
      }
    }
  }

  queryBuilder = queryBuilder.order("created_at", { ascending: false }).range(offset, offset + limit - 1);

  const { data, error } = await queryBuilder;
  if (error) {
    toastService.error(error.message);
    console.error("Failed to fetch session stats:", error);
    return []; // Return empty array on error instead of throwing
  }
  return data || []; // Ensure we always return an array
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

export const updateGroupScoreService = async (id: string, groupScore: any) => {
  const { data, error } = await supabase.from("group_scores").update(groupScore).eq("id", id).select();
  if (error) throw error;
  return data;
};

export const saveCompleteSession = async (sessionData: {
  sessionStats: CreateSessionStatsData;
  participants: CreateParticipantData[];
  targets: Array<{
    targetStats: CreateTargetStatsData;
    engagements: CreateTargetEngagementData[];
  }>;
}) => {
  try {
    const session = await createSessionStats(sessionData.sessionStats);
    const sessionId = session.id;

    const participantsWithSessionId = sessionData.participants.map((p) => ({
      ...p,
      session_stats_id: sessionId,
    }));
    await createSessionParticipants(participantsWithSessionId);

    for (const targetData of sessionData.targets) {
      const targetWithSessionId = {
        ...targetData.targetStats,
        session_stats_id: sessionId,
      };
      const target = await createTargetStats(targetWithSessionId);

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
export async function createGroupScoreService(groupScoreData: any, trainingSessionId: string): Promise<any> {
  const { data, error } = await supabase
    .from("group_scores")
    .insert({ ...groupScoreData, training_session_id: trainingSessionId })
    .select("*");
  if (error) throw error;
  return data;
}

export async function getGroupingScoreComparisonById(groupScoreId: string): Promise<any> {
  const { data, error } = await supabase.rpc("get_grouping_comparison_by_id", { p_group_score_id: groupScoreId }).select("*");
  if (error) throw error;
  return data;
}

export async function deleteGroupScoreService(id: string): Promise<any> {
  const { data, error } = await supabase.from("group_scores").delete().eq("id", id).select();
  if (error) throw error;
  return data;
}

export async function deleteSessionStatsService(id: string): Promise<any> {
  const { data, error } = await supabase.from("session_stats").delete().eq("id", id).select();
  if (error) throw error;
  return data;
}

export async function updateCompleteSession(
  sessionId: string,
  sessionData: {
    sessionStats: CreateSessionStatsData;
    participants: CreateParticipantData[];
    targets: Array<{
      targetStats: CreateTargetStatsData;
      engagements: CreateTargetEngagementData[];
    }>;
  },
) {
  const { sessionStats, participants, targets } = sessionData;

  try {
    const { error: sessionError } = await supabase
      .from("session_stats")
      .update({
        training_session_id: sessionStats.training_session_id,
        assignment_id: sessionStats.assignment_id,
        team_id: sessionStats.team_id,
        day_period: sessionStats.day_period,
        time_to_first_shot_sec: sessionStats.time_to_first_shot_sec,
        note: sessionStats.note,
        squad_id: sessionStats.squad_id,
        effort: sessionStats.effort,
      })
      .eq("id", sessionId);

    if (sessionError) throw sessionError;

    const { error: deleteParticipantsError } = await supabase.from("session_participants").delete().eq("session_stats_id", sessionId);

    if (deleteParticipantsError) throw deleteParticipantsError;

    const participantsWithSessionId = participants.map((p) => ({
      ...p,
      session_stats_id: sessionId,
    }));

    const { error: participantsError } = await supabase.from("session_participants").insert(participantsWithSessionId);

    if (participantsError) throw participantsError;

    const { error: deleteTargetsError } = await supabase.from("target_stats").delete().eq("session_stats_id", sessionId);

    if (deleteTargetsError) throw deleteTargetsError;

    for (const target of targets) {
      const targetWithSessionId = {
        ...target.targetStats,
        session_stats_id: sessionId,
      };

      const { data: insertedTarget, error: targetError } = await supabase.from("target_stats").insert(targetWithSessionId).select().single();

      if (targetError) throw targetError;

      if (target.engagements.length > 0) {
        const engagementsWithTargetId = target.engagements.map((e) => ({
          ...e,
          target_stats_id: insertedTarget.id,
        }));

        const { error: engagementsError } = await supabase.from("target_engagements").insert(engagementsWithTargetId);

        if (engagementsError) throw engagementsError;
      }
    }

    return await getFullSessionById(sessionId);
  } catch (error: any) {
    console.error("Error in updateCompleteSession:", error.message);
    toastService.error(error.message);
    throw error;
  }
}

export async function getFullSessionById(sessionId: string): Promise<{
  sessionStats: CreateSessionStatsData;
  participants: CreateParticipantData[];
  targets: {
    targetStats: CreateTargetStatsData;
    engagements: CreateTargetEngagementData[];
  }[];
}> {
  const { data: session, error: sessionError } = await supabase.from("session_stats").select("*").eq("id", sessionId).single();
  if (sessionError) throw sessionError;

  const { data: participants, error: participantsError } = await supabase.from("session_participants").select("*").eq("session_stats_id", sessionId);
  if (participantsError) throw participantsError;
  const { data: targets, error: targetsError } = await supabase
    .from("target_stats")
    .select("*, target_engagements(*)")
    .eq("session_stats_id", sessionId);
  if (targetsError) throw targetsError;

  return {
    sessionStats: {
      training_session_id: session.training_session_id,
      assignment_id: session.assignment_id,
      team_id: session.team_id,
      day_period: session.day_period,
      time_to_first_shot_sec: session.time_to_first_shot_sec,
      note: session.note,
      creator_id: session.creator_id,
      squad_id: session.squad_id,
      effort: session.effort,
    },
    participants: participants.map((p) => ({
      user_id: p.user_id,
      user_duty: p.user_duty,
      weapon_id: p.weapon_id,
      equipment_id: p.equipment_id,
      position: p.position,
      session_stats_id: p.session_stats_id,
    })),
    targets: targets.map((t) => ({
      targetStats: {
        distance_m: t.distance_m,
        wind_strength: t.wind_strength,
        wind_direction_deg: t.wind_direction_deg,
        total_hits: t.total_hits,
        target_eliminated: t.target_eliminated,
        first_shot_hit: t.first_shot_hit,
        mistake_code: t.mistake_code,
        session_stats_id: t.session_stats_id,
        target_stats_id: t.id,
      },
      engagements: t.target_engagements.map((e: any) => ({
        user_id: e.user_id,
        shots_fired: e.shots_fired,
        target_hits: e.target_hits,
        is_estimated: e.is_estimated,
        estimated_method: e.estimated_method,
        target_stats_id: t.id,
      })),
    })),
  };
}
