// src/types/groupingScore.ts

// Existing interface
export interface GroupingScore {
  id: string;
  cm_dispersion: number;
  effort: boolean;
  time_seconds: number;
  shooting_position: string;
  bullets_fired: number;
  created_at: string;
  assignment_name: string;
  weapon_type: string;
  weapon_serial: string;
}

// New interfaces for the summary data
export interface GroupingSummary {
  avg_dispersion: number;
  best_dispersion: number;
  total_groups: number;
  weapon_breakdown: WeaponBreakdown[];
  last_five_groups: RecentGroup[];
}

export interface WeaponBreakdown {
  weapon_type: string;
  count: number;
  avg_dispersion: number;
}

export interface RecentGroup {
  cm_dispersion: number;
  weapon_type: string;
  created_at: string;
}
