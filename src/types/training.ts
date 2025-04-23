export interface TrainingSession {
  id: string;
  date: string;
  session_name: string;
  assignments_trainings: {
    assignment_id: string;
    assignments: {
      id: string;
      assignment_name: string;
    }[]; // <-- was missing array brackets here
  }[];
}
