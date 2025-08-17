// /services/statsService.ts (or /api/stats.ts)
import { supabase } from "@/services/supabaseClient";
import { StatsFilters, RpcFilters } from "@/types/stats";

// Ensure scope is valid: if self-view but no userId, fallback to squad view
function normalizeScope(f: StatsFilters): StatsFilters {
  if (!f.isSquad && !f.userId) {
    return { ...f, isSquad: true };
  }
  return f;
}

function arrOrNull<T>(a: T[] | null | undefined): T[] | null {
  return a && a.length ? a : null;
}

export function toRpcFilters(f: StatsFilters): RpcFilters {
  const n = normalizeScope(f);
  const dayNight = arrOrNull(n.dayNight)?.map((x) => String(x).toUpperCase()) ?? null;

  return {
    p_team_id: n.teamId ?? null,
    p_squad_id: n.squadId ?? null,
    p_user_id: n.userId ?? null,
    p_is_squad: !!n.isSquad,
    p_start: n.startDate ?? null,
    p_end: n.endDate ?? null,
    p_day_night: dayNight,
    p_positions: arrOrNull(n.positions) ?? null,
    p_min_shots: typeof n.minShots === "number" ? n.minShots : null,
  };
}

/** Overview cards */
export async function rpcStatsOverview(filters: StatsFilters) {
  const { data, error } = await supabase.rpc("stats_overview", toRpcFilters(filters));
  if (error) throw error;
  return (data?.[0] ?? {
    sessions: 0,
    shots: 0,
    hits: 0,
    targets: 0,
    hit_pct: 0,
    median_ttf_sec: null,
    elimination_pct: 0,
  }) as {
    sessions: number;
    shots: number;
    hits: number;
    targets: number;
    hit_pct: number; // 0..1
    median_ttf_sec: number | null;
    elimination_pct: number; // 0..1
  };
}

/** First-shot metrics (OVERALL/DAY/NIGHT) */
export async function rpcFirstShotMetrics(filters: StatsFilters) {
  const { data, error } = await supabase.rpc("first_shot_metrics", toRpcFilters(filters));
  if (error) throw error;
  return (data ?? []) as Array<{
    scope: "OVERALL" | "DAY" | "NIGHT";
    engagements: number;
    first_shot_hits: number;
    first_shot_hit_pct: number; // 0..1
    sessions: number;
    median_ttf_sec: number | null;
  }>;
}

/** Elimination by position */
export async function rpcEliminationByPosition(filters: StatsFilters) {
  const { data, error } = await supabase.rpc("squad_position_elimination_pct", toRpcFilters(filters));
  if (error) throw error;
  return (data ?? []) as Array<{
    bucket: "Sitting" | "Standing" | "Total";
    targets: number;
    eliminated: number;
    elimination_pct: number; // 0..1
  }>;
}

/** Weekly trends (set p_group_by_weapon on demand) */
export async function rpcWeeklyTrends(filters: StatsFilters & { p_group_by_weapon?: boolean }) {
  const payload = { ...toRpcFilters(filters), p_group_by_weapon: !!(filters as any).p_group_by_weapon };
  const { data, error } = await supabase.rpc("weekly_trends", payload);
  if (error) throw error;
  return (data ?? []) as Array<{
    week_start: string; // YYYY-MM-DD
    weapon_id: string | null;
    weapon_name: string | null;
    shots: number;
    hits: number;
    hit_pct: number; // 0..1
    sessions: number;
    median_ttf_sec: number | null;
    targets: number;
    eliminated: number;
    elimination_pct: number; // 0..1
  }>;
}
