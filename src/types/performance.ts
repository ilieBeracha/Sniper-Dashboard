export interface SquadWeaponPerformance {
  squad: string;
  weapon_type: string;
  confirmed: number;
  potential: number;
  accuracy: number;
}

export interface CommanderTeamMedianDispersion {
  user_id: string;
  first_name: string;
  last_name: string;
  squad_name: string;
  median_cm_dispersion: number | null;

  // new fields
  weapon_name: string | null;
  position: string | null;
  effort: boolean | null;
  type: string | null;
  day_period: string | null;
}

export interface CommanderTeamDispersionEntry {
  user_id: string;
  first_name: string;
  last_name: string;
  squad_name: string;
  total_median: number | null;
  median_effort_false: number | null;
  median_effort_true: number | null;
  median_type_timed: number | null;
  weapon_type: string | null;
  shooting_position: string | null;
  day_period: string | null;
}

export type GroupingScoreEntry = {
  id: string;
  sniper_user_id: string;
  sniper_first_name: string;
  sniper_last_name: string;
  weapon_id: string;
  weapon_serial_number: string;
  weapon_type: string; // weapon_names enum as string
  bullets_fired: number;
  time_seconds: number;
  cm_dispersion: number;
  shooting_position: string;
  effort: boolean;
  created_at: string; // ISO date
  type: string; // grouping_type_enum as string
};

export type GroupingStatsCommander = {
  avg_bullets: number;
  avg_dispersion: number;
  avg_time_seconds: number;
  best_dispersion: number;
  effort_percentage: number;
  first_name: string;
  last_name: string;
  mistake_count: number | null;
  sniper_user_id: string;
  team_id: string;
  top_mistake: string | null;
  total_groups: number;
  worst_dispersion: number;
};

export interface HitPercentageData {
  hit_percentage: number;
  total_shots: number;
  total_hits: number;
  assignments_count: number;
}
export interface UserHitsData {
  hit_percentage: number | null;
  shots_fired: number;
  target_hits: number;
  session_count: number;
  confirmed_hit_percentage: number | null;
  confirmed_hits: number;
  eliminated_targets: number;
}

export enum UserPosition {
  SNIPER = "Sniper",
  SPOTTER = "Spotter",
}

export interface DayNightPerformance {
  day_night: "day" | "night";
  total_missions: number;
  accuracy: string; // e.g., "85.5%"
  first_shot_success_rate: string; // e.g., "72.3%"
  avg_reaction_time: string; // e.g., "4.2 sec"
  elimination_rate: string; // e.g., "91.5%"
}

export interface SquadPerformance {
  squad_id: string;
  squad_name: string;
  total_missions: number;
  avg_accuracy: number;
  avg_reaction_time: number;
  first_shot_success_rate: number;
  elimination_rate: number;
  total_snipers: number;
  best_sniper: string;
}

export interface TrainingEffectiveness {
  assignment_name: string;
  total_sessions: number;
  avg_accuracy_improvement: number;
  avg_reaction_time_improvement: number;
  skill_correlation: string;
  recommended_frequency: string;
  current_gap_days: number;
}

export interface SquadStats {
  first_name: string;
  last_name: string;
  role_or_weapon: string;
  hit_percentage: number;
  session_count: number;
  squad_name: string;
}

export interface getStatsWhenUserHoldsWeapon {
  user_id: string;
  first_name: string;
  last_name: string;
  squad_name: string;
  total_shots: number;
}
export interface WeaponUsageStats {
  weapon_id: string;
  total_shots_fired: number;
  total_hits: number;
  hit_percentage: number;
  avg_cm_dispersion: number | null;
  best_cm_dispersion: number | null;
}

export type TrainingTeamAnalytics = {
  total_participants: number;
  total_shots_fired: number;
  overall_hit_percentage: number;
  total_targets_eliminated: number;
  avg_time_to_first_shot: number;
  short_shots: number;
  short_hit_percentage: number;
  medium_shots: number;
  medium_hit_percentage: number;
  long_shots: number;
  long_hit_percentage: number | null;
  avg_cm_dispersion: number;
  best_cm_dispersion: number;
  best_user_first_name: string;
  best_user_last_name: string;
  times_grouped: number;
};

// commander view
export type SquadUserPerformance = {
  first_name: string;
  last_name: string;
  role_or_weapon: string; // e.g. "spotter", "sniper", "semi_auto"
  hit_percentage: number;
  shots: number;
  hits: number;
  sessions: number;
};

export type CommanderUserRoleBreakdown = {
  squad_name: string;
  first_name: string;
  last_name: string;
  role_or_weapon: string; // "spotter", "sniper", "semi_auto"
  hit_percentage: number;
  shots: number;
  hits: number;
  sessions: number;
};

// new
export type SquadMajorityPerformance = {
  squad_name: string;
  total_shots: number;
  total_hits: number;
  total_sessions: number;
  hit_percentage: number;
  avg_time_to_first_shot: number;
  elimination_rate: number;
};

export interface GetUserMediansInSquad {
  squad_id: string;
  user_id: string;
  user_duty: "Sniper" | "Spotter";
  weapon_id?: string | null;
  equipment_id?: string | null;
  position: string;
}

export interface GetUserMediansInSquadQuery {
  p_squad_id: string;
  p_weapon_id: string | null;
  p_effort: string | null;
  p_type: string | null;
  p_position: string | null;
  p_start_date: Date | null;
  p_end_date: Date | null;
}

export interface GetUserMediansInSquadQueryResult {
  user_id: string;
  first_name: string;
  last_name: string;
  median_cm_dispersion: number;
}

export interface SquadWeaponStatsQuery {
  squad_id: string;
  training_session_id: string;
  training_date: string;
  other_weapon_id: string;
  other_weapon_name: string;
  total_shots: number;
  total_hits: number;
  hit_rate: number;
  users_count: number;
}

export interface SquadWeaponStats {
  user_id: string;
  first_name: string;
  last_name: string;
  squad_name: string;
  total_shots: number;
  total_hits: number;
  hit_rate: number;
  users_count: number;
  created_at: string;
  action_type: string;
  actor_id: string;
}

export interface UserWeeklyKpisForUser {
  user_id: string;

  trainings_current: number;
  trainings_prev: number;
  trainings_change: number;
  trainings_change_pct: number | null;

  sessions_current: number;
  sessions_prev: number;
  sessions_change: number;
  sessions_change_pct: number | null;

  engagements_current: number;
  engagements_prev: number;
  engagements_change: number;
  engagements_change_pct: number | null;

  targets_current: number;
  targets_prev: number;
  targets_change: number;
  targets_change_pct: number | null;

  hit_ratio_current: number;
  hit_ratio_prev: number;
  hit_ratio_change: number;
  hit_ratio_change_pct: number | null;

  engagement_rate_current: number;
  engagement_rate_prev: number;
  engagement_rate_change: number;

  targets_per_session_current: number;
  targets_per_session_prev: number;
  targets_per_session_change: number;
}
