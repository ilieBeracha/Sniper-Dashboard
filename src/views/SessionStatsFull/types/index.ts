export interface SessionData {
  assignment_id: string;
  dayPeriod: string;
  timeToFirstShot: number | null;
  note: string;
  squad_id: string;
}

export interface Participant {
  userId: string;
  name: string;
  userDuty: string;
  position: string;
  weaponId: string;
  equipmentId: string;
}

export interface TargetEngagement {
  userId: string;
  shotsFired: number;
  targetHits: number;
}

export interface Target {
  id: string;
  distance: number;
  windStrength: number | null;
  windDirection: number | null;
  mistakeCode: string;
  engagements: TargetEngagement[];
}

export interface Section {
  id: string;
  title: string;
  icon: any;
  description: string;
}
