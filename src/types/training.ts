export interface Assignment {
  assignment: {
    id: string;
    assignment_name: string;
    created_at: string;
  };
}

export interface TrainingParticipant {
  id: string;
  training_id: string;
  participant_id: string;
  created_at: string;
  user?: {
    id: string;
    first_name: string;
    last_name: string;
    email: string;
    user_role: string;
  };
}

export enum TrainingStatus {
  Scheduled = "scheduled",
  InProgress = "in_progress",
  Completed = "completed",
  Canceled = "canceled",
}

export interface WeeklyAssignmentStats {
  total_trainings: number;
  total_unique_assignments: number;
  most_common: {
    id: string;
    name: string;
    count: number;
  };
  least_common: {
    id: string;
    name: string;
    count: number;
  };
  all_assignments: Array<{
    id: string;
    name: string;
    count: number;
  }>;
}

export interface TrainingSession {
  id?: string;
  date: string; // ISO string
  session_name: string;
  location: string;
  team_id?: string;
  assignment_session?: Assignment[];
  participants?: TrainingParticipant[];
  status: TrainingStatus;
}

export interface TrainingSessionChart {
  id: string;
  date: string;
  session_name: string;
}

export interface TrainingsNextLastChart {
  next: TrainingSessionChart | null;
  last: TrainingSessionChart | null;
}

export interface Assignment {
  id: string;
  assignment_name: string;
  text: string;
  created_at: string;
}

export interface TrainingPageParticipantsScoreData {
  shots_fired: number | null;
  hits: number | null;
  time_until_first_shot: number | null;
  distance: number | null;
  target_hit: number | null;
  position: string;
  day_night: string;
}

export interface TrainingPageParticipantsScoreInputProps {
  value: number | null;
  onChange: (value: number | null) => void;
  placeholder: string;
  className?: string;
}

export interface TrainingPageParticipantsScoreSelectProps {
  value: string;
  onChange: (value: string) => void;
  options: string[];
  className?: string;
}

export interface TrainingPageParticipantsScoreParticipantScoresProps {
  participant: any;
  assignments: any[];
  participantScores: Record<string, Record<string, any>>;
  isCurrentUser: boolean;
  isParticipant: boolean;
  onEditScore: (participantId: string, assignmentId: string) => void;
  onSaveScore: () => void;
  onCancelEdit: () => void;
  isEditing: boolean;
  editingParticipantId: string | null;
  editingAssignmentId: string | null;
  scoreData: TrainingPageParticipantsScoreData;
  setScoreData: (data: TrainingPageParticipantsScoreData) => void;
  isSubmitting: boolean;
  training: TrainingSession | null;
}

export enum ScorePosition {
  Lying = "Lying",
  Squatting = "Squatting",
  Kneeling = "Kneeling",
  Sitting = "Sitting",
}

export interface Score {
  assignment_session_id: string;
  created_at: string;
  day_night: string;
  distance: number;
  hits: number;
  id: string;
  shots_fired: number;
  squad_id: string;
  target_hit: number;
  time_until_first_shot: number;
  training_id: string;
  user_participants: {
    user_id: string;
    weapon_id: string;
    equipment_id: string;
    position: string;
  }[];
}

export interface SquadScoreMember {
  user_id: string;
  first_name: string;
  last_name: string;
  weapon_id: string | null;
  equipment_id: string | null;
  position: string | null;
}

export interface SquadScore {
  score_id: string;
  assignment_session_id: string;
  time_until_first_shot: number;
  distance: number;
  target_hit: number;
  day_night: string;
  shots_fired: number;
  hits: number;
  created_at: string;
  squad_members: SquadScoreMember[];
}

export interface SquadScoresGrouped {
  squad_id: string;
  squad_name: string;
  scores: SquadScore[];
}
