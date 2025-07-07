import {
  createScore,
  createScoreParticipant,
  getScoresByTrainingId,
  getScoresCountByTrainingId,
  createTarget,
  fetchScoreTargetsByScoreId,
  patchScore,
} from "@/services/scoreService";
import { create } from "zustand";
import { TrainingStore } from "./trainingStore";
import { supabase } from "@/services/supabaseClient";
import { DayNight, PositionScore, ScoreParticipant, ScoreTarget } from "@/types/score";
import { userStore } from "./userStore";
import { embedScore } from "@/services/embeddingService";

export interface Score {
  id?: string;
  training_id: string;
  creator_id: string;
  assignment_session_id: string;
  time_until_first_shot: number | null;
  note: string | null;
  wind_strength: number | null;
  first_shot_hit: boolean | null;
  wind_direction: number | null;
  day_night: DayNight | null;
  position: PositionScore;
  team_id: string;
  score_ranges?: ScoreTarget[];
  score_participants?: ScoreParticipant[];
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

interface ScoreStore {
  scores: Score[];
  scoreRanges: ScoreRangeRow[];
  handleCreateScore: (score: Score) => Promise<any[] | undefined>;
  handlePatchScore: (scoreForm: any, scoreId: string) => Promise<void>;
  getScoresByTrainingId: (trainingId: string, limit?: number, range?: number) => Promise<Score[]>;
  getScoresCountByTrainingId: (trainingId: string) => Promise<number>;
  getScoreRangesByTrainingId: (trainingId: string) => Promise<void>;
  getScoreTargetsByScoreId: (scoreId: string) => Promise<ScoreTarget[]>;
  scoreTargetsByScoreId: ScoreTarget[];
  scoreParticipantsByScoreId: ScoreParticipant[];
}

export const scoreStore = create<ScoreStore>((set) => ({
  scores: [],
  scoreRanges: [],
  scoreTargetsByScoreId: [],
  scoreParticipantsByScoreId: [],
  async handleCreateScore(scoreForm: any) {
    const training_id = TrainingStore.getState().training?.id;
    const score: Score = {
      creator_id: userStore.getState().user?.id || "",
      time_until_first_shot: scoreForm.time_until_first_shot,
      note: scoreForm.note,
      team_id: userStore.getState().user?.team_id || "",
      wind_strength: scoreForm.wind_strength,
      first_shot_hit: scoreForm.first_shot_hit,
      position: scoreForm.position,
      wind_direction: scoreForm.wind_direction,
      day_night: scoreForm.day_night,
      assignment_session_id: scoreForm.assignment_session_id,
      training_id: training_id || "",
    };

    const res = await createScore(score);

    if (res) {
      await createScoreParticipant(scoreForm.score_participants, res[0].id);
      await createTarget(scoreForm.scoreTargets, res[0].id);
      await embedScore(score as any, res[0].id, training_id || "", scoreForm.scoreTargets, scoreForm.score_participants);
      return res;
    }
  },

  async getScoresByTrainingId(training_id: string, limit: number = 0, range: number = 0) {
    const res = await getScoresByTrainingId(training_id, limit, range);
    if (limit > 0) {
      // For pagination, return the scores without setting them in global state
      return res as Score[];
    } else {
      set({ scores: res });
      return res as Score[];
    }
  },

  async getScoresCountByTrainingId(training_id: string) {
    return await getScoresCountByTrainingId(training_id);
  },

  // pulls all ranges for *every* score in the training (1 query)
  getScoreRangesByTrainingId: async (trainingId: string) => {
    const { data, error } = await supabase.rpc("get_score_ranges_by_training_id", { training_id: trainingId });
    if (error) throw error;
    set({ scoreRanges: data });
  },

  getScoreTargetsByScoreId: async (scoreId: string) => {
    const res = await fetchScoreTargetsByScoreId(scoreId);
    set({ scoreTargetsByScoreId: res });
    return res;
  },

  handlePatchScore: async (scoreForm: any, scoreId: string) => {
    try {
      const scoreData = {
        assignment_session_id: scoreForm.assignment_session_id,
        time_until_first_shot: scoreForm.time_until_first_shot,
        wind_strength: scoreForm.wind_strength,
        first_shot_hit: false,
        team_id: userStore.getState().user?.team_id || "",
        wind_direction: scoreForm.wind_direction,
        day_night: scoreForm.day_night,
        note: scoreForm.note,
        position: scoreForm.position,
      };

      await patchScore(scoreData, scoreId);

      const { error: deleteParticipantsError } = await supabase.from("score_participants").delete().eq("score_id", scoreId);

      if (deleteParticipantsError) throw deleteParticipantsError;

      const { error: deleteTargetsError } = await supabase.from("score_ranges").delete().eq("score_id", scoreId);

      if (deleteTargetsError) throw deleteTargetsError;

      // Create new participants with updated data
      if (scoreForm.score_participants && scoreForm.score_participants.length > 0) {
        await createScoreParticipant(scoreForm.score_participants, scoreId);
      }

      // Create new targets with updated data
      if (scoreForm.scoreTargets && scoreForm.scoreTargets.length > 0) {
        await createTarget(scoreForm.scoreTargets, scoreId);
      }
    } catch (error) {
      console.error("Error updating score:", error);
      throw error;
    }
  },
}));
