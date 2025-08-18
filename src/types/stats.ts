import { DayNight } from "./equipment";
import { PositionScore } from "./user";

// /types/stats-filters.ts
export type PositionEnum = "Sitting" | "Standing" | "Lying" | "Operational";

export interface StatsFilters {
  squadIds: string[] | null; // if non-empty -> squad mode
  userId: string | null; // used when squadIds is null/empty
  startDate: string | null; // ISO
  endDate: string | null; // ISO
  dayNight: DayNight[] | null; // ["DAY","NIGHT"]
  positions: PositionEnum[] | null; // enum literals
  minShots: number | null; // null = no filter - kept for backward compatibility but always null
}

type RpcFilters = {
  p_squad_ids: string[] | null;
  p_user_id: string | null;
  p_start: string | null;
  p_end: string | null;
  p_day_night: DayNight[] | null;
  p_positions: PositionEnum[] | null;
  p_min_shots: number | null;
};

const arrOrNull = <T>(a: T[] | null | undefined) => (a && a.length ? a : null);

export function toRpcFilters(f: StatsFilters): RpcFilters {
  return {
    p_squad_ids: arrOrNull(f.squadIds),
    p_user_id: f.userId ?? null,
    p_start: f.startDate ?? null,
    p_end: f.endDate ?? null,
    p_day_night: arrOrNull(f.dayNight),
    p_positions: arrOrNull(f.positions),
    p_min_shots: typeof f.minShots === "number" ? f.minShots : null,
  };
}

/** ========== Overview cards ========== */
export interface StatsOverviewResponse {
  sessions: number;
  shots: number;
  hits: number;
  targets: number;
  /** Hit % across all shots (0..1) */
  hit_pct: number;
  /** Median time-to-first-shot in seconds */
  median_ttf_sec: number | null;
  /** % of targets eliminated (0..1) */
  elimination_pct: number;
}

/** ========== First-shot metrics ========== */
export type FirstShotScope = "OVERALL" | "DAY" | "NIGHT";

export interface FirstShotMetricsResponse {
  scope: FirstShotScope;
  engagements: number;
  first_shot_hits: number;
  /** First-shot hit % (0..1) */
  first_shot_hit_pct: number;
  sessions: number;
  median_ttf_sec: number | null;
}

/** ========== Elimination by position ========== */
export interface EliminationByPositionResponse {
  bucket: PositionScore;
  targets: number;
  eliminated: number;
  /** Elimination % (0..1) */
  elimination_pct: number;
}
[];

/** ========== Weekly trends ========== */
export interface WeeklyTrendsResponse {
  week_start: string; // ISO date
  weapon_id: string | null;
  weapon_name: string | null;
  shots: number;
  hits: number;
  /** Hit % (0..1) */
  hit_pct: number;
  sessions: number;
  median_ttf_sec: number | null;
  targets: number;
  eliminated: number;
  /** Elimination % (0..1) */
  elimination_pct: number;
}

/** ========== Distance metrics ========== */
export interface DistanceMetricsResponse {
  distance_bucket: number; // e.g. 100,125,...
  shots: number;
  hits: number;
  /** Hit % (0..1) */
  hit_pct: number;
  /** First-shot hit % (0..1) */
  first_shot_hit_pct: number | null;
  targets: number;
  eliminated: number;
  elimination_pct: number;
  median_ttf_sec: number | null;
}
