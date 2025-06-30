import { createScore, createScoreParticipant, getScoresByTrainingId, createTarget, fetchScoreTargetsByScoreId } from "@/services/scoreService";
import { create } from "zustand";
import { TrainingStore } from "./trainingStore";
import { supabase } from "@/services/supabaseClient";
import { DayNight, PositionScore, ScoreParticipant, ScoreTarget } from "@/types/score";

export interface Score {
  id?: string;
  training_id: string;
  creator_id: string;
  squad_id: string;
  assignment_session_id: string;
  time_until_first_shot: number | null;
  note: string | null;
  wind_strength: number | null;
  first_shot_hit: boolean | null;
  wind_direction: number | null;
  day_night: DayNight | null;
  position: PositionScore;
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
  handleUpdateScore: (scoreId: string, scoreForm: any) => Promise<void>;
  getScoresByTrainingId: (trainingId: string) => Promise<void>;
  getScoreRangesByTrainingId: (trainingId: string) => Promise<void>;
  getScoreTargetsByScoreId: (scoreId: string) => Promise<ScoreTarget[]>;
  scoreTargetsByScoreId: ScoreTarget[];
}

export const scoreStore = create<ScoreStore>((set) => ({
  scores: [],
  scoreRanges: [],
  scoreTargetsByScoreId: [],
  async handleCreateScore(scoreForm: any) {
    console.log(scoreForm);
    const training_id = TrainingStore.getState().training?.id;
    console.log(training_id);
    const score: Score = {
      creator_id: scoreForm.creator_id || "",
      time_until_first_shot: scoreForm.time_until_first_shot,
      note: scoreForm.note,
      wind_strength: scoreForm.wind_strength,
      first_shot_hit: scoreForm.first_shot_hit,
      position: scoreForm.position,
      wind_direction: scoreForm.wind_direction,
      day_night: scoreForm.day_night,
      assignment_session_id: scoreForm.assignment_session_id,
      training_id: training_id || "",
      squad_id: scoreForm.squad_id,
    };

    console.log(score);
    const res = await createScore(score);

    if (res) {
      await createScoreParticipant(scoreForm.score_participants, res[0].id);
      await createTarget(scoreForm.scoreTargets, res[0].id);
      return res;
    }
  },

  async handleUpdateScore(scoreId: string, scoreForm: any) {
    try {
      // Update main score record
      const { error: scoreError } = await supabase
        .from("scores")
        .update({
          assignment_session_id: scoreForm.assignment_session_id,
          day_night: scoreForm.day_night,
          position: scoreForm.position,
          time_until_first_shot: scoreForm.time_until_first_shot,
          first_shot_hit: scoreForm.first_shot_hit,
          wind_strength: scoreForm.wind_strength,
          wind_direction: scoreForm.wind_direction,
          note: scoreForm.note,
        })
        .eq("id", scoreId);

      if (scoreError) throw scoreError;

      // Delete existing score_participants
      const { error: deleteParticipantsError } = await supabase.from("score_participants").delete().eq("score_id", scoreId);

      if (deleteParticipantsError) throw deleteParticipantsError;

      // Delete existing score_targets
      const { error: deleteTargetsError } = await supabase.from("score_targets").delete().eq("score_id", scoreId);

      if (deleteTargetsError) throw deleteTargetsError;

      // Re-create score_participants
      if (scoreForm.participants && scoreForm.participants.length > 0) {
        const participantData = scoreForm.participants.map((userId: string) => ({
          score_id: scoreId,
          user_id: userId,
          duty: scoreForm.duties[userId] || "",
          weapon_id: scoreForm.weapons[userId] || "",
          equipment_id: scoreForm.equipment[userId] || "",
        }));

        const { error: participantsError } = await supabase.from("score_participants").insert(participantData);

        if (participantsError) throw participantsError;
      }

      // Re-create score_targets
      if (scoreForm.scoreTargets && scoreForm.scoreTargets.length > 0) {
        const targetsData = scoreForm.scoreTargets.map((target: any) => ({
          score_id: scoreId,
          distance: target.distance,
          shots_fired: target.shots_fired,
          target_hits: target.target_hits,
        }));

        const { error: targetsError } = await supabase.from("score_ranges").insert(targetsData);
        console.log(targetsError);
        if (targetsError) throw targetsError;
      }
    } catch (error) {
      console.error("Error updating score:", error);
      throw error;
    }
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

  getScoreTargetsByScoreId: async (scoreId: string) => {
    const res = await fetchScoreTargetsByScoreId(scoreId);
    set({ scoreTargetsByScoreId: res });
    return res;
  },
}));
