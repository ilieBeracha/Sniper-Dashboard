export interface CreateSessionStatsData {
  training_session_id: string;
  assignment_id: string | null;
  creator_id: string | null;
  squad_id: string | null;
  team_id: string | null;
  day_period: string | null;
  time_to_first_shot_sec: number | null;
  note?: string | null;
}

export interface CreateParticipantData {
  session_stats_id: string;
  user_id: string;
  user_duty: "Sniper" | "Spotter";
  weapon_id?: string | null;
  equipment_id?: string | null;
  position: string;
}

export interface CreateTargetStatsData {
  session_stats_id: string;
  distance_m: number;
  wind_strength?: number | null;
  wind_direction_deg?: number | null;
  total_hits: number;
  target_eliminated: boolean;
  mistake_code?: string | null;
}

export interface CreateTargetEngagementData {
  target_stats_id: string;
  user_id: string;
  shots_fired: number;
  target_hits: number;
  is_estimated: boolean;
  estimated_method?: string | null;
}
