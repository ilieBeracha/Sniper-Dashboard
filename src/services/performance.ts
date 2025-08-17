import { supabase } from "./supabaseClient";
import {
  SquadWeaponPerformance,
  UserHitsData,
  TrainingTeamAnalytics,
  WeaponUsageStats,
  SquadMajorityPerformance,
  CommanderUserRoleBreakdown,
  GroupingScoreEntry,
  CommanderTeamDispersionEntry,
} from "@/types/performance";
import { GroupingSummary } from "@/types/groupingScore";
import { PositionScore } from "@/types/user";

export async function getUserHitStatsFull(userId: string): Promise<UserHitsData> {
  try {
    const { data, error } = await supabase.rpc("get_user_hit_stats_full", {
      p_user_id: userId,
    });
    if (error) throw error;
    return data[0];
  } catch (error: any) {
    console.error("Error fetching user hit stats:", error.message);
    throw new Error("Could not complete get_user_hit_stats_full");
  }
}

export async function getUserHitStatsWithFilters(
  userId: string,
  distance: string | null = null,
  position: string | null = null,
  weaponType: string | null = null,
): Promise<UserHitsData> {
  try {
    const { data, error } = await supabase.rpc("get_user_hit_stats_with_filters", {
      p_user_id: userId,
      p_distance_category: distance,
      p_position: position,
      p_weapon_type: weaponType,
    });
    if (error) throw error;
    return data[0];
  } catch (error: any) {
    console.error("Error fetching user hit stats with filters:", error.message);
    throw new Error("Could not complete get_user_hit_stats_with_filters");
  }
}

export async function getCommanderTeamMedianDispersion(
  teamId: string,
  startDate?: string,
  endDate?: string,
  weaponType?: string,
  position?: string,
  dayPeriod?: string,
): Promise<CommanderTeamDispersionEntry[]> {
  const { data, error } = await supabase.rpc("get_commander_team_median_dispersion", {
    p_team_id: teamId,
    p_start_date: startDate ?? null,
    p_end_date: endDate ?? null,
    p_weapon_type: weaponType || null,
    p_position: position || null,
    p_day_period: dayPeriod || null,
  });

  if (error) throw error;
  return data || [];
}

export interface SquadImpactData {
  user_id: string;
  user_name: string;
  weapon_id: string;
  weapon_name: string;
  training_date: string;
  user_hit_rate: number;
  squad_hit_rate_before: number;
  squad_hit_rate_after: number;
  impact_percentage: number;
  total_shots: number;
  squad_members_count: number;
}

export async function getSquadPerformanceImpact(
  teamId: string,
  userId?: string,
  weaponId?: string,
  startDate?: string,
  endDate?: string,
): Promise<SquadImpactData[]> {
  try {
    // Try to call the RPC function
    const { data, error } = await supabase.rpc("get_squad_performance_impact", {
      p_team_id: teamId,
      p_user_id: userId || null,
      p_weapon_id: weaponId || null,
      p_start_date: startDate || null,
      p_end_date: endDate || null,
    });

    if (error) {
      // If RPC doesn't exist, return mock data for demonstration
      if (error.message.includes("Could not find the function")) {
        console.warn("RPC function not deployed yet. Run the migration in supabase/migrations/squad_performance_impact.sql");

        // Return empty array for now
        return [];

        // Or return mock data for testing:
        // return getMockSquadImpactData(teamId, userId, weaponId, startDate, endDate);
      }
      throw error;
    }

    return data || [];
  } catch (error: any) {
    console.error("Error fetching squad performance impact:", error.message);
    throw new Error("Failed to fetch squad performance impact");
  }
}

export async function getSquadRoleHitPercentages(squadId: string, distance: string | null = null) {
  try {
    const { data, error } = await supabase.rpc("get_squad_hit_percentages_by_role", {
      p_squad_id: squadId,
      p_distance_category: distance,
    });

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error("Error fetching squad role hit percentages:", error.message);
    throw new Error("Failed to fetch squad role hit percentages");
  }
}

export async function getGroupingScoresByTraining(trainingSessionId: string, limit = 50, offset = 0): Promise<GroupingScoreEntry[]> {
  const { data, error } = await supabase
    .from("group_scores")
    .select(
      `
      id,
      sniper_user_id,
      users!sniper_user_id (
        first_name,
        last_name
      ),
      weapon_id,
      weapons!weapon_id (
        serial_number,
        weapon_type
      ),
      bullets_fired,
      time_seconds,
      cm_dispersion,
      shooting_position,
      effort,
      created_at,
      day_period,
      type
    `,
    )
    .eq("training_session_id", trainingSessionId)
    .range(offset, offset + limit - 1)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching grouping scores:", error.message);
    throw new Error("Failed to fetch grouping score entries");
  }

  return (data || []).map((entry: any) => ({
    ...entry,
    sniper_first_name: entry.users?.first_name ?? null,
    sniper_last_name: entry.users?.last_name ?? null,
    weapon_serial_number: entry.weapons?.serial_number ?? null,
    weapon_type: entry.weapons?.weapon_type ?? null,
  }));
}

export async function getBestGroupingStatsByTraining(
  trainingSessionId: string,
): Promise<{ total_groups: number; avg_dispersion: number; best_dispersion: number }> {
  const { data, error } = await supabase.rpc("get_best_training_group_stats", { p_training_session_id: trainingSessionId });
  if (error) {
    console.error("Error fetching best grouping by training:", error.message);
    throw new Error("Failed to fetch best grouping by training");
  }

  return data[0];
}

export async function getGroupingScoresCountByTraining(trainingSessionId: string): Promise<number> {
  const { count, error } = await supabase
    .from("group_scores")
    .select("*", { count: "exact", head: true })
    .eq("training_session_id", trainingSessionId);

  if (error) {
    console.error("Error fetching grouping scores count:", error.message);
    throw new Error("Failed to fetch grouping scores count");
  }

  return count || 0;
}

// This function is a duplicate of the one above, so we can remove it to avoid redundancy.
export async function getSquadHitPercentageByRole(squadId: string, distance: string | null = null) {
  try {
    const { data, error } = await supabase.rpc("get_squad_hit_percentages_by_role_v3", {
      p_squad_id: squadId,
      p_distance_category: distance,
    });

    if (error) throw error;

    return data || [];
  } catch (error: any) {
    console.error("Error fetching session-based role stats:", error.message);
    throw new Error("Failed to fetch session-based role stats");
  }
}

export async function getTrainingTeamAnalytics(trainingSessionId: string): Promise<TrainingTeamAnalytics | null> {
  try {
    const { data, error } = await supabase.rpc("get_training_team_analytics", {
      p_training_session_id: trainingSessionId,
    });

    if (error) {
      console.error("Error fetching training analytics:", error.message);
      return null;
    }

    return data?.[0] ?? null;
  } catch (error: any) {
    console.error("Error fetching training analytics:", error.message);
    throw new Error("Failed to fetch training analytics");
  }
}

export async function getWeaponPerformanceBySquadAndWeapon(teamId: string): Promise<SquadWeaponPerformance[]> {
  const { data, error } = await supabase.rpc("get_weapon_performance_by_squad_and_weapon", {
    team_id: teamId,
  });

  if (error) {
    console.error("Error fetching squad weapon performance data:", error.message);
    throw new Error("Failed to fetch squad weapon performance data");
  }

  return data || [];
}

export async function getUserGroupingStatsRpc(
  userId: string,
  weaponType: string | null = null,
  effort: boolean | null = null,
  type: string | null = null,
  position: string | null = null,
): Promise<GroupingSummary> {
  const { data, error } = await supabase.rpc("get_user_grouping_stats_v3", {
    p_user_id: userId,
    p_weapon_type: weaponType,
    p_effort: effort,
    p_type: type,
    p_position: position,
  });

  if (error) {
    console.error("SQL function failed:", error.message);
    throw new Error("Could not complete get_user_grouping_stats");
  }

  if (!data || data.length === 0) {
    throw new Error("No grouping data returned");
  }

  const result = data[0];

  return {
    avg_dispersion: result.avg_dispersion,
    best_dispersion: result.best_dispersion,
    avg_time_to_group: result.avg_time_to_group,
    total_groupings: result.total_groupings,
    weapon_breakdown: [], // You can populate this later if needed
    last_five_groups: result.last_five_groups ?? [],
  };
}
// In your service
export async function getDayNightPerformanceByTeam(teamId: string) {
  const { data, error } = await supabase.rpc("get_day_night_performance_by_team", {
    p_team_id: teamId,
  });

  if (error) {
    console.error("Error fetching day/night performance for team:", error);
    throw error;
  }

  return data;
}

export async function getTrainingEffectivenessByTeam(teamId: string) {
  const { data, error } = await supabase.rpc("get_training_effectiveness_by_team", {
    p_team_id: teamId,
  });

  if (error) {
    console.error("Error fetching training effectiveness:", error);
    throw error;
  }

  return data;
}

export async function getSquadStatByTeamId(teamId: string, position: PositionScore | null, distance: string | null) {
  const { data, error } = await supabase.rpc("get_squad_stats_with_filters", {
    p_position: position ? (position as PositionScore) : null,
    p_team_id: teamId,
    p_distance: distance ? distance : null,
  });

  if (error) {
    console.error("Error fetching squad stats:", error);
    return;
  }
  return data;
}

// commander view
export const getCommanderUserRoleBreakdown = async (teamId: string): Promise<CommanderUserRoleBreakdown[]> => {
  const { data, error } = await supabase.rpc("get_commander_user_role_breakdown", {
    p_team_id: teamId,
  });

  if (error) {
    console.error("Error fetching user role breakdown:", error);
    throw error;
  }

  return data ?? [];
};

// new
export const getSquadMajoritySessionsPerformance = async (teamId: string): Promise<SquadMajorityPerformance[]> => {
  const { data, error } = await supabase.rpc("get_squad_majority_sessions_performance", { p_team_id: teamId });
  if (error) {
    console.error("Error fetching squad majority performance:", error);
    throw error;
  }

  return data;
};

export async function getWeaponUsageStats(weaponId: string): Promise<WeaponUsageStats> {
  const { data, error } = await supabase.rpc("get_weapon_usage_stats", {
    p_weapon_id: weaponId,
  });

  if (error) {
    console.error("Error fetching weapon usage stats:", error.message);
    throw error;
  }
  console.log("data", data);

  const rawResult = data?.[0];
  const result = rawResult
    ? {
        weapon_id: rawResult.weapon_id || weaponId,
        total_shots_fired: rawResult.total_shots_fired ?? rawResult.total_shots ?? rawResult.shots_fired ?? 0,
        total_hits: rawResult.total_hits ?? rawResult.hits ?? 0,
        hit_percentage: rawResult.hit_percentage ?? 0,
        avg_cm_dispersion: rawResult.avg_cm_dispersion ?? null,
        best_cm_dispersion: rawResult.best_cm_dispersion ?? null,
      }
    : {
        weapon_id: weaponId,
        total_shots_fired: 0,
        total_hits: 0,
        hit_percentage: 0,
        avg_cm_dispersion: 0,
        best_cm_dispersion: 0,
      };

  return result;
}

export async function getGroupingStatsByTeamIdCommander(teamId: string, startDate: Date, endDate: Date) {
  const { data, error } = await supabase.rpc("get_grouping_stats_for_team", {
    p_team_id: teamId,
    p_start_date: startDate,
    p_end_date: endDate,
  });

  if (error) {
    console.error("Error fetching grouping stats:", error);
    throw error;
  }

  return data;
}

export async function getUserMediansInSquad(
  squadId: string,
  weaponId: string | null,
  effort: string | null,
  type: string | null,
  position: string | null,
  startDate: Date | null,
  endDate: Date | null,
) {
  const { data, error } = await supabase.rpc("get_user_medians_in_squad", {
    p_squad_id: squadId,
    p_weapon_id: weaponId,
    p_effort: effort,
    p_type: type,
    p_position: position,
    p_start_date: startDate,
    p_end_date: endDate,
  });   

  if (error) {
    console.error("Error fetching user medians in squad:", error);
    throw error;
  }

  return data;
}
