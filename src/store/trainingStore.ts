import { create } from "zustand";
import {
  getNextAndLastTraining,
  getTrainingByTeamId,
} from "@/services/trainingService";
import { TrainingsNextLastChart, TrainingSession } from "@/types/training";

interface TrainingStore {
  trainings: TrainingSession[] | [];
  trainingsChartDisplay: TrainingsNextLastChart;
  loadNextAndLastTraining: (team_id: string) => Promise<void>;
  loadTrainingByTeamId: (team_id: string) => Promise<void>;
}

export const TrainingStore = create<TrainingStore>((set) => ({
  trainings: [],
  trainingsChartDisplay: {
    next: null,
    last: null,
  },

  loadTrainingByTeamId: async (teamId: string) => {
    const res = await getTrainingByTeamId(teamId);
    set({ trainings: res });
  },

  loadNextAndLastTraining: async (team_id: string) => {
    try {
      const { nextTraining, lastTraining } = await getNextAndLastTraining(
        team_id
      );
      set({
        trainingsChartDisplay: { next: nextTraining, last: lastTraining },
      });
    } catch (err) {
      console.error("Failed to load trainings:", err);
    }
  },
}));
