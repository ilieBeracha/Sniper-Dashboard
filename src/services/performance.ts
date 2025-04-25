// src/services/performanceService.ts
import { supabase } from "./supabaseClient";
import { HitPercentageData, SquadWeaponPerformance } from "@/types/performance";
import { GroupingScore } from "@/types/groupingScore";

export async function getUserHitPercentageRpc(userId: string): Promise<HitPercentageData> {
  const { data, error } = await supabase.rpc("get_user_hit_percentage", {
    user_id: userId,
  });
  if (error) {
    console.error("SQL function failed:", error.message);
    throw new Error("Could not complete get_user_hit_percentage");
  }
  return data[0];
}

export async function getUserGroupingScoresRpc(userId: string): Promise<GroupingScore[]> {
  const { data, error } = await supabase.rpc("get_user_grouping_scores", {
    user_id: userId,
  });
  if (error) {
    console.error("SQL function failed:", error.message);
    throw new Error("Could not complete get_user_grouping_scores");
  }
  return data;
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
