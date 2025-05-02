import { create } from "zustand";
import {
  getAssignments,
  getNextAndLastTraining,
  getTrainingById,
  getTrainingByTeamId,
  insertTraining,
  getWeeklyAssignmentsStats,
} from "@/services/trainingService";
import { TrainingsNextLastChart, TrainingSession, Assignment, WeeklyAssignmentStats, Score, SquadScore, SquadScoresGrouped } from "@/types/training";
import { getScoresGroupedBySquad } from "@/services/scoreService";
interface TrainingStore {
  training: TrainingSession | null;
  trainings: TrainingSession[] | [];
  assignments: Assignment[] | [];
  scoresGroupedBySquad: SquadScore[] | [];
  trainingsChartDisplay: TrainingsNextLastChart;
  weeklyAssignmentsStats: WeeklyAssignmentStats[] | [];
  loadNextAndLastTraining: (team_id: string) => Promise<void>;
  loadTrainingByTeamId: (team_id: string) => Promise<void>;
  loadAssignments: () => Promise<Assignment[] | any>;
  createTraining: (payload: TrainingSession) => Promise<TrainingSession | any>;
  loadTrainingById: (trainingId: string) => Promise<void>;
  loadWeeklyAssignmentsStats: (team_id: string) => Promise<WeeklyAssignmentStats[] | any>;
  resetTraining: () => void;
  getScoresGroupedBySquad: (trainingId: string) =>  Promise<SquadScore[] | any>;
}

export const TrainingStore = create<TrainingStore>((set) => ({
  training: null,
  trainings: [] as TrainingSession[],
  scores: [] as Score[],
  scoresGroupedBySquad: [] as SquadScoresGrouped[] | any,
  assignments: [] as Assignment[],
  weeklyAssignmentsStats: [] as WeeklyAssignmentStats[],
  trainingsChartDisplay: {
    next: null,
    last: null,
  },

  loadTrainingById: async (trainingId: string) => {
    const res = await getTrainingById(trainingId);
    set({ training: res });
  },

  loadTrainingByTeamId: async (teamId: string) => {
    const res = await getTrainingByTeamId(teamId);
    set({ trainings: res as any });
  },

  loadNextAndLastTraining: async (team_id: string) => {
    try {
      const { nextTraining, lastTraining } = await getNextAndLastTraining(team_id);
      set({
        trainingsChartDisplay: { next: nextTraining, last: lastTraining },
      });
    } catch (err) {
      console.error("Failed to load trainings:", err);
    }
  },

  getScoresGroupedBySquad: async (trainingId: string) => {
    const res = await getScoresGroupedBySquad(trainingId);
    console.log("res", res);
    set({ scoresGroupedBySquad: res as SquadScoresGrouped[] | any   });
    return res;
  },

  loadWeeklyAssignmentsStats: async (team_id: string) => {
    try {
      const res = await getWeeklyAssignmentsStats(team_id);
      set({ weeklyAssignmentsStats: res });
      return res;
    } catch (error) {
      console.error("Failed to load weekly assignments stats:", error);
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

  resetTraining: () => {
    set({ training: null, trainings: [], assignments: [], trainingsChartDisplay: { next: null, last: null } });
  },
}));
