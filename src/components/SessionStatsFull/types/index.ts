export interface SessionData {
  assignment_id: string;
  dayPeriod: string;
  timeToFirstShot: number | null;
  note: string;
  squad_id: string;
  effort: boolean;
}

export interface Participant {
  userId: string;
  name: string;
  userDuty: string;
  position: string;
  weaponId: string;
  equipmentId: string;
  user_default_duty?: string;
  user_default_weapon?: string;
  user_default_equipment?: string;
}

export interface TargetEngagement {
  userId: string;
  shotsFired: number | null;
  targetHits: number | null;
}

export interface Target {
  id: string;
  distance: number;
  windStrength: number | null;
  windDirection: number | null;
  mistakeCode: string;
  firstShotHit: boolean;
  engagements: TargetEngagement[];
}

export interface Section {
  id: string;
  title: string;
  icon: any;
  description: string;
}
