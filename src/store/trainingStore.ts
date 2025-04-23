import { create } from "zustand";
import { getNextAndLastTraining } from "@/services/trainingService";
import { Trainings } from "@/types/training";

interface TrainingStore {
  trainings: Trainings;
  loadTrainings: (team_id: string) => Promise<void>;
}

export const TrainingStore = create<TrainingStore>((set) => ({
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
