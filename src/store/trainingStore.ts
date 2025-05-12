import { create } from "zustand";
import {
  getAssignments,
  getNextAndLastTraining,
  getTrainingById,
  getTrainingByTeamId,
  insertTraining,
  getWeeklyAssignmentsStats,
  insertAssignment,
  insertAssignmentSession,
} from "@/services/trainingService";
import { TrainingsNextLastChart, TrainingSession, Assignment, WeeklyAssignmentStats } from "@/types/training";
import { userStore } from "./userStore";

interface TrainingStore {
  training: TrainingSession | null;
  trainings: TrainingSession[] | [];
  assignments: Assignment[] | [];
  trainingsChartDisplay: TrainingsNextLastChart;
  weeklyAssignmentsStats: WeeklyAssignmentStats[] | [];
  loadNextAndLastTraining: (team_id: string) => Promise<void>;
  loadTrainingByTeamId: (team_id: string) => Promise<void>;
  loadAssignments: () => Promise<Assignment[] | any>;
  createTraining: (payload: TrainingSession) => Promise<TrainingSession | any>;
  loadTrainingById: (trainingId: string) => Promise<void>;
  loadWeeklyAssignmentsStats: (team_id: string) => Promise<void>;
  createAssignment: (assignmentName: string, isInTraining: boolean, trainingId?: string) => Promise<Assignment | any>;
  resetTraining: () => void;
}

export const TrainingStore = create<TrainingStore>((set) => ({
  training: null,
  trainings: [] as TrainingSession[],
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

  createAssignment: async (assignmentName: string, isInTraining: boolean = false, trainingId?: string) => {
    try {
      const { user } = userStore.getState();
      if (!user?.team_id) return;
      const assignmentData = await insertAssignment(assignmentName, user.team_id);
      if (isInTraining) {
        const trainingSession = await insertAssignmentSession(assignmentData.id, user.team_id, trainingId as string);
        return trainingSession;
      }
      return assignmentData;
    } catch (error) {
      console.error("Failed to create assignment:", error);
    }
  },

  resetTraining: () => {
    set({ training: null, trainings: [], assignments: [], trainingsChartDisplay: { next: null, last: null } });
  },
}));
