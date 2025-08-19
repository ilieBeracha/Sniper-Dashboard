// /api/stats.ts
import { supabase } from "@/services/supabaseClient";
import {
  StatsFilters,
  toRpcFilters,
  StatsOverviewResponse,
  FirstShotMetricsResponse,
  EliminationByPositionResponse,
  WeeklyTrendsResponse,
  UserWeaponPerformanceResponse,
} from "@/types/stats";
import { apiCallWithTimeout, ApiError } from "@/utils/apiUtils";

/** Overview cards */
export async function rpcStatsOverview(filters: StatsFilters): Promise<StatsOverviewResponse> {
  return apiCallWithTimeout(async () => {
    const { data, error } = await supabase.rpc("stats_overview", toRpcFilters(filters));
    if (error) throw new ApiError(error.message, error.code, error);
    return (data?.[0] ?? {
      sessions: 0,
      shots: 0,
      hits: 0,
      targets: 0,
      hit_pct: 0,
      median_ttf_sec: null,
      elimination_pct: 0,
    }) as StatsOverviewResponse;
  });
}

/** First-shot metrics (OVERALL/DAY/NIGHT) */
export async function rpcFirstShotMetrics(filters: StatsFilters): Promise<FirstShotMetricsResponse[]> {
  return apiCallWithTimeout(async () => {
    const { data, error } = await supabase.rpc("first_shot_metrics", toRpcFilters(filters));
    if (error) throw new ApiError(error.message, error.code, error);
    return (data ?? []) as FirstShotMetricsResponse[];
  });
}

/** Elimination by position */
export async function rpcEliminationByPosition(filters: StatsFilters): Promise<EliminationByPositionResponse[]> {
  return apiCallWithTimeout(async () => {
    const { data, error } = await supabase.rpc("user_position_elimination_pct", toRpcFilters(filters));
    if (error) throw new ApiError(error.message, error.code, error);
    return (data ?? []) as EliminationByPositionResponse[];
  });
}

/** Weekly trends (add p_group_by_weapon as needed) */
export async function rpcWeeklyTrends(filters: StatsFilters & { p_group_by_weapon?: boolean }): Promise<WeeklyTrendsResponse[]> {
  return apiCallWithTimeout(async () => {
    const payload = { ...toRpcFilters(filters), p_group_by_weapon: !!(filters as any).p_group_by_weapon };
    const { data, error } = await supabase.rpc("weekly_trends", payload);
    if (error) throw new ApiError(error.message, error.code, error);
    return (data ?? []) as WeeklyTrendsResponse[];
  });
}

/** Distance buckets for ChartMatrix (first shot matrix) */
export async function rpcFirstShotMatrix(
  filters: StatsFilters & {
    p_distance_bucket?: number;
    p_min_targets?: number;
    p_min_distance?: number;
    p_max_distance?: number;
  },
) {
  return apiCallWithTimeout(async () => {
    const { p_distance_bucket, p_min_targets, p_min_distance, p_max_distance, ...rest } = filters as any;
    const { data, error } = await supabase.rpc("get_first_shot_matrix", {
      ...toRpcFilters(rest),
      p_distance_bucket: p_distance_bucket ?? 25,
      p_min_targets: p_min_targets ?? 0,
      p_min_distance: p_min_distance ?? 100,
      p_max_distance: p_max_distance ?? 900,
    });
    if (error) throw new ApiError(error.message, error.code, error);
    return (data ?? []) as Array<{
      distance_bucket: number;
      targets: number;
      first_shot_hit_rate: number | null;
      avg_time_to_first_shot_sec: number | null;
    }>;
  });
}

export async function userWeaponPerformance(filters: StatsFilters): Promise<UserWeaponPerformanceResponse[]> {
  return apiCallWithTimeout(async () => {
    const { data, error } = await supabase.rpc("user_weapon_performance", toRpcFilters(filters));
    if (error) throw new ApiError(error.message, error.code, error);
    return (data ?? []) as UserWeaponPerformanceResponse[];
  });
}
