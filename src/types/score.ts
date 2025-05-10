export interface Score {
  id?: string;
  assignment_session: {
    id: string;
    training_id: string;
    assignment_id: string;
    assignment: {
      assignment_name: string;
    };
  };
  time_until_first_shot: number | null;
  wind_strength: number | null;
  first_shot_hit: boolean | null;
  wind_direction: number | null;
  note: string | null;
  target_eliminated: boolean | null;
  distance?: number | null;
  target_hit?: number | null;
  day_night?: DayNight | null;
  created_at?: string;
  shots_fired?: number | null;
  mistake?: any;
  score_participants: any;
  squad_id: string;
  creator_id: string;
  squad: {
    squad_name: string;
  };
  position: PositionScore;
}

export interface ScoreParticipant {
  id?: string;
  score_id?: string;
  user_id: string;
  user: {
    first_name: string;
    last_name: string;
    email: string;
  };
  user_duty: UserDuty;
  weapon_id?: string;
  weapon?: {
    weapon_type: string;
    serial_number: string;
  };
  equipment_id?: string;
  equipment?: {
    equipment_type: string;
    serial_number: string;
  };
}

export type DayNight = "day" | "night";

export interface UserDuty {
  SNIPER: "sniper";
  SPOTTER: "spotter";
}

export enum PositionScore {
  LYING = "lying",
  STANDING = "standing",
  SITTING = "sitting",
  OPERATIONAL = "operational",
}
