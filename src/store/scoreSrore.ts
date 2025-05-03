import { createScore, getScoresByTrainingId, createScoreParticipant } from "@/services/scoreService";
import { Score } from "@/types/score";
import { create } from "zustand";
import { TrainingStore } from "./trainingStore";

interface ScoreStore {
  scores: Score[];
  createScore: (score: Score) => Promise<void>;
  getScoresByTrainingId: (training_id: string) => Promise<void>;
}

export const scoreStore = create<ScoreStore>((set) => ({
  scores: [],

  async createScore(scoreForm: any) {
    const training_id = TrainingStore.getState().training?.id;
    const score: any = {
      time_until_first_shot: scoreForm.time_until_first_shot,
      distance: scoreForm.distance,
      target_hit: scoreForm.target_hit,
      note: scoreForm.note,
      target_eliminated: scoreForm.target_eliminated,
      wind_strength: scoreForm.wind_strength,
      first_shot_hit: scoreForm.first_shot_hit,
      shots_fired: scoreForm.shots_fired,
      position: scoreForm.position,
      wind_direction: scoreForm.wind_direction,
      day_night: scoreForm.day_night,
      assignment_session_id: scoreForm.assignment_session_id,
      training_id: training_id,
    };

    if (scoreForm.squad_id) score.squad_id = scoreForm.squad_id;
    const res = await createScore(score);

    if (res) {
      await createScoreParticipant(scoreForm.score_participants, res.id);
    }
  },

  async getScoresByTrainingId(training_id: string) {
    const res = await getScoresByTrainingId(training_id);
    set({ scores: res });
  },
}));
