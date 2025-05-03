// src/services/performanceService.ts
import { supabase } from "./supabaseClient";
import { HitPercentageData, SquadWeaponPerformance } from "@/types/performance";
import { GroupingSummary } from "@/types/groupingScore";
import { User } from "@supabase/supabase-js";

export async function getUserHitPercentageRpc(userId: string): Promise<HitPercentageData> {
  const { data, error } = await supabase.rpc("get_user_hit_percentage_by_single_sniper", {
    user_id: userId,
  });
  if (error) {
    console.error("SQL function failed:", error.message);
    throw new Error("Could not complete get_user_hit_percentage");
  }
  return data[0];
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

export async function getUserGroupingSummaryRpc(userId: string): Promise<GroupingSummary> {
  const { data, error } = await supabase.rpc("get_user_grouping_summary", {
    user_id: userId,
  });

  if (error) {
    console.error("SQL function failed:", error.message);
    throw new Error("Could not complete get_user_grouping_summary");
  }

  if (data && data.length > 0) {
    const result = data[0];

    if (typeof result.weapon_breakdown === "string") {
      result.weapon_breakdown = JSON.parse(result.weapon_breakdown);
    }

    if (typeof result.last_five_groups === "string") {
      result.last_five_groups = JSON.parse(result.last_five_groups);
    }

    return result;
  }

  throw new Error("No grouping summary data returned");
}


export async function getTopAccurateSnipers(teamId: string): Promise<User[]> {
  const { data, error } = await supabase.rpc("get_top_snipers_by_team", {
    team_uuid: teamId,
  });

  if (error) {
    console.error("Error fetching top accurate snipers data:", error.message);
    throw new Error("Failed to fetch top accurate snipers data");
  }

  return data || [];
}