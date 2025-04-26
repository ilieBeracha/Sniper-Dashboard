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
  assignments_trainings?: Assignment[];
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
