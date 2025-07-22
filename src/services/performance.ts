import { supabase } from "./supabaseClient";
import {
  SquadWeaponPerformance,
  UserHitsData,
  TrainingTeamAnalytics,
  WeaponUsageStats,
  SquadMajorityPerformance,
  CommanderUserRoleBreakdown,
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

export async function getUserGroupingStatsRpc(userId: string, weaponId: string | null = null): Promise<GroupingSummary> {
  const { data, error } = await supabase.rpc("get_user_grouping_stats", {
    p_user_id: userId,
    p_weapon_id: weaponId,
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
    weapon_breakdown: [],
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

export async function overallAccuracyStats() {
  const { data, error } = await supabase.rpc("overall_accuracy_stats");

  if (error) {
    console.error("Error fetching training summary stats:", error);
    throw error;
  }

  return data[0];
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
  console.log(data, "Data from getSquadMajoritySessionsPerformance");
  if (error) {
    console.error("Error fetching squad majority performance:", error);
    throw error;
  }

  return data;
};

export async function getWeaponUsageStats(weaponId: string): Promise<WeaponUsageStats> {
  console.log("Service - getWeaponUsageStats called with weaponId:", weaponId);

  const { data, error } = await supabase.rpc("get_weapon_usage_stats", {
    p_weapon_id: weaponId,
  });

  if (data && data.length > 0) {
    console.log("Service - First data item:", data[0]);
    console.log("Service - Data item keys:", Object.keys(data[0]));
    console.log("Service - total_shots_fired value:", data[0].total_shots_fired, "type:", typeof data[0].total_shots_fired);
    console.log("Service - total_hits value:", data[0].total_hits, "type:", typeof data[0].total_hits);
  }

  if (error) {
    console.error("Error fetching weapon usage stats:", error.message);
    throw error;
  }

  // Handle case where data exists but might have different field names or null values
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
