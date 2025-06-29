import { getScoresByTrainingId
  // createScoreParticipant
 } from "@/services/scoreService";
import { create } from "zustand";
import { TrainingStore } from "./trainingStore";
import { supabase } from "@/services/supabaseClient";

export interface Score {
  id: string;
  training_id: string;
}

export interface ScoreRangeRow {
  id?: string;
  score_id: string;
  distance: number;
  shots_fired: number;
  target_hit: number;
  created_at?: string;
}

export interface NewScoreRange {
  score_id: string;
  distance: number;
  shots_fired: number;
  target_hit: number;
}

export interface ScoreState {
  scores: Score[];
  scoreRanges: ScoreRangeRow[];
  getScoresByTrainingId: (trainingId: string) => Promise<void>;
  getScoreRangesByTrainingId: (trainingId: string) => Promise<void>;
  addScoreRange: (payload: NewScoreRange) => Promise<void>;
}

interface ScoreStore {
  scores: Score[];
  scoreRanges: ScoreRangeRow[];
  createScore: (score: Score) => Promise<void>;
  getScoresByTrainingId: (training_id: string) => Promise<void>;
  getScoreRangesByTrainingId: (trainingId: string) => Promise<void>;
  addScoreRange: (payload: NewScoreRange) => Promise<void>;
}

export const scoreStore = create<ScoreStore>((set) => ({
  scores: [],
  scoreRanges: [],

  async createScore(scoreForm: any) {
    const training_id = TrainingStore.getState().training?.id;
    const score: any = {
      creator_id: scoreForm.creator_id,
      time_until_first_shot: scoreForm.time_until_first_shot,
      note: scoreForm.note,
      target_eliminated: scoreForm.target_eliminated,
      wind_strength: scoreForm.wind_strength,
      first_shot_hit: scoreForm.first_shot_hit,
      position: scoreForm.position,
      wind_direction: scoreForm.wind_direction,
      day_night: scoreForm.day_night,
      assignment_session_id: scoreForm.assignment_session_id,
      training_id: training_id,
    };
    // Add squad_id only if it exists
    if (scoreForm.squad_id) {
      score.squad_id = scoreForm.squad_id;
    }
    // const res = await createScore(score);

    // if (res) {
    //   await createScoreParticipant(scoreForm.score_participants, res.id);
    // }
  },

  async getScoresByTrainingId(training_id: string) {
    const res = await getScoresByTrainingId(training_id);
    set({ scores: res });
  },

  // pulls all ranges for *every* score in the training (1 query)
  getScoreRangesByTrainingId: async (trainingId: string) => {
    const { data, error } = await supabase.rpc("get_score_ranges_by_training_id", { training_id: trainingId });
    if (error) throw error;
    set({ scoreRanges: data });
  },

  addScoreRange: async (payload: NewScoreRange) => {
    const { error } = await supabase.from("score_ranges").insert(payload);
    if (error) throw error;
  },
}));
