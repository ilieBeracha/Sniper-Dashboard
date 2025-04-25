export interface Assignment {
  id: string;
  assignment_name: string;
}

export interface TrainingSession {
  id: string;
  date: string; // ISO string
  session_name: string;
  location: string;
  assignments_trainings: Assignment[]; // now a flat array of assignments
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
