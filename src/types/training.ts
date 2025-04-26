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
