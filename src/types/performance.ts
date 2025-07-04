export interface SquadWeaponPerformance {
  squad: string;
  weapon_type: string;
  confirmed: number;
  potential: number;
  accuracy: number;
}

export interface HitPercentageData {
  hit_percentage: number;
  total_shots: number;
  total_hits: number;
  assignments_count: number;
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
  out_name: string;
  out_performance: number;
  out_accuracy: number;
  out_elimination: number;
  out_coordination: number;
}

export interface OverallAccuracyStats {
  total_scores: number;
  total_shots_fired: number;
  total_target_hits: number;
  accuracy_percent: number;
}
