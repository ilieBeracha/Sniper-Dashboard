import { supabase } from "./supabaseClient";
import { SquadWeaponPerformance, UserHitsData,TrainingTeamAnalytics,WeaponUsageStats } from "@/types/performance";
import { GroupingSummary } from "@/types/groupingScore";
import { PositionScore } from "@/types/score";


export async function getUserHitStatsFull(userId: string): Promise<UserHitsData> {
  const { data, error } = await supabase.rpc("get_user_hit_stats_full", {
    p_user_id: userId,
  });
  if (error) {
    console.error("SQL function failed:", error.message);
    throw new Error("Could not complete get_user_hit_stats_full");
  }
  return data[0];
}


export async function getSquadRoleHitPercentages(squadId: string, distance: string | null = null) {
  const { data, error } = await supabase.rpc("get_squad_hit_percentages_by_role", {
    p_squad_id: squadId,
    p_distance_category: distance,
  });

  if (error) {
    console.error("Error fetching squad role hit percentages:", error.message);
    throw error;
  }

  return data || [];
}
// This function is a duplicate of the one above, so we can remove it to avoid redundancy.
export async function getSquadHitPercentageByRole(squadId: string, distance: string | null = null) {
  const { data, error } = await supabase.rpc("get_squad_hit_percentages_by_role_v3", {
    p_squad_id: squadId,
    p_distance_category: distance,
  });

  if (error) {
    console.error("Error fetching session-based role stats:", error.message);
    throw error;
  }

  return data || [];
}

export async function getTrainingTeamAnalytics(trainingSessionId: string): Promise<TrainingTeamAnalytics | null> {
  const { data, error } = await supabase.rpc('get_training_team_analytics', {
    p_training_session_id: trainingSessionId,
  });

  if (error) {
    console.error('Error fetching training analytics:', error.message);
    return null;
  }

  return data?.[0] ?? null;
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


export async function getWeaponUsageStats(weaponId: string): Promise<WeaponUsageStats> {
  console.log("Service - getWeaponUsageStats called with weaponId:", weaponId);
  
  const { data, error } = await supabase.rpc("get_weapon_usage_stats", {
    p_weapon_id: weaponId,
  });

  console.log("Service - RPC response data:", data);
  console.log("Service - RPC response error:", error);

  if (error) {
    console.error("Error fetching weapon usage stats:", error.message);
    throw error;
  }

  const result = data?.[0] ?? {
    weapon_id: weaponId,
    total_shots_fired: 0,
    total_hits: 0,
    hit_percentage: 0,
    avg_cm_dispersion: 0,
    best_cm_dispersion: 0,
  };

  console.log("Service - returning result:", result);
  return result;
}