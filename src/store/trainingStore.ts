import { create } from "zustand";
import { getNextAndLastTraining } from "@/services/trainingService";
import { TrainingSession } from "@/types/training";

interface Trainings {
  next: TrainingSession | null;
  last: TrainingSession | null;
}

interface TrainingStore {
  trainings: Trainings;
  loadTrainings: (team_id: string) => Promise<void>;
}

export const trainingStore = create<TrainingStore>((set) => ({
  trainings: {
    next: null,
    last: null,
  },

  loadTrainings: async (team_id: string) => {
    try {
      const { nextTraining, lastTraining } = await getNextAndLastTraining(
        team_id
      );
      console.log({ nextTraining, lastTraining });
      set({ trainings: { next: nextTraining, last: lastTraining } });
    } catch (err) {
      console.error("Failed to load trainings:", err);
    }
  },
}));
