import { create } from "zustand";
import {
  getAssignments,
  getNextAndLastTraining,
  getTrainingByTeamId,
  insertTraining,
} from "@/services/trainingService";
import {
  TrainingsNextLastChart,
  TrainingSession,
  Assignment,
} from "@/types/training";

interface TrainingStore {
  trainings: TrainingSession[] | [];
  assignments: Assignment[] | [];
  trainingsChartDisplay: TrainingsNextLastChart;
  loadNextAndLastTraining: (team_id: string) => Promise<void>;
  loadTrainingByTeamId: (team_id: string) => Promise<void>;
  loadAssignments: () => Promise<Assignment[] | any>;
  createTraining: (payload: TrainingSession) => Promise<TrainingSession | any>;
}

export const TrainingStore = create<TrainingStore>((set) => ({
  trainings: [],
  assignments: [],
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

  loadAssignments: async () => {
    try {
      const res = await getAssignments();
      set({ assignments: res });
      return res;
    } catch (error) {
      console.error("Failed to load getAssignments:", error);
    }
  },

  createTraining: async (sessionData: TrainingSession) => {
    const { data, error } = await insertTraining(sessionData);
    if (error || !data?.id) return data;
  },
}));
