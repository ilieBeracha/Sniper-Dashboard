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
