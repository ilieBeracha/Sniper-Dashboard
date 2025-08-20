export interface TrainingGroup {
  id: string;
  team_id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
}

export interface TrainingGroupTraining {
  id?: string;
  group_id: string;
  training_id: string;
  created_at?: string;
}

export interface TrainingGroupWithCount extends TrainingGroup {
  training_count?: number;
}

export interface CreateTrainingGroupPayload {
  team_id: string;
  name: string;
  description?: string;
}

export interface AddTrainingsToGroupPayload {
  group_id: string;
  training_ids: string[];
}