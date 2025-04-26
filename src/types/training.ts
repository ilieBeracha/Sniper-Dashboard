export interface Assignment {
  id: string;
  assignment_name: string;
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

export interface TrainingSession {
  id?: string;
  date: string; // ISO string
  session_name: string;
  location: string;
  team_id?: string;
  assignments_trainings?: Assignment[];
  trainings_participants?: TrainingParticipant[];
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
