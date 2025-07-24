import { create } from "zustand";
import { createGroupScoreService, getSessionStatsCountByTrainingId, saveCompleteSession } from "@/services/sessionService";
import type { CreateSessionStatsData, CreateParticipantData, CreateTargetStatsData, CreateTargetEngagementData } from "@/types/sessionStats";
import { TrainingStore } from "./trainingStore";
import { getSessionStatsByTrainingId } from "@/services/sessionService";
import { formatForSupabaseInsert, processTrainingSessionToEmbeddings } from "@/services/embedSniperSession";

interface SessionStatsState {
  sessionStats: any[];
  isLoading: boolean;
  error: string | null;
  setSessionStats: (sessionStats: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  saveSessionStats: (sessionData: SessionStatsSaveData) => Promise<any>;
  getSessionStatsByTrainingId: (trainingId: string, limit?: number, offset?: number) => Promise<any[]>;
  getSessionStatsCountByTrainingId: (trainingId: string) => Promise<number>;
  createGroupScore: (groupScore: any) => Promise<any>;
  groupStats: any[];
}

export interface SessionStatsSaveData {
  // Session data from wizard
  sessionData: {
    training_session_id: string | null;
    assignment_id: string | null;
    team_id: string | null;
    dayPeriod: string | null;
    timeToFirstShot: number | null;
    note?: string | null;
  };
  // Participants data from wizard
  participants: Array<{
    user_id: string;
    user_duty: "Sniper" | "Spotter";
    weapon_id?: string | null;
    equipment_id?: string | null;
    position: string;
  }>;
  // Targets data from wizard
  targets: Array<{
    distance: number;
    windStrength?: number;
    windDirection?: number;
    totalHits?: number;
    mistakeCode?: string;
    engagements: Array<{
      user_id: string;
      shots_fired: number;
      target_hits?: number;
    }>;
  }>;
  // Current user for creator_id
  currentUser: {
    id: string;
  } | null;
}

export const sessionStore = create<SessionStatsState>((set) => ({
  sessionStats: [],
  groupStats: [],
  isLoading: false,
  error: null,

  setSessionStats: (sessionStats: any) => set({ sessionStats }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),

  getSessionStatsByTrainingId: async (trainingId: string, limit: number = 20, offset: number = 0) => {
    const result = await getSessionStatsByTrainingId(trainingId, limit, offset);
    set({ sessionStats: result });
    return result;
  },

  getSessionStatsCountByTrainingId: async (trainingId: string) => {
    return await getSessionStatsCountByTrainingId(trainingId);
  },

  createGroupScore: async (groupScore: any) => {
    const trainingStore = TrainingStore.getState().training;
    const res = await createGroupScoreService(groupScore, trainingStore?.id || "");
    set({ groupStats: res });

    return res;
  },

  saveSessionStats: async (wizardData: SessionStatsSaveData) => {
    set({ isLoading: true, error: null });
    const trainingStore = TrainingStore.getState().training;

    try {
      // Transform wizard data to database format
      const sessionStatsData: CreateSessionStatsData = {
        training_session_id: wizardData.sessionData.training_session_id || trainingStore?.id || "",
        assignment_id: wizardData.sessionData.assignment_id,
        creator_id: wizardData.currentUser?.id || null,
        team_id: wizardData.sessionData.team_id,
        day_period: wizardData.sessionData.dayPeriod,
        time_to_first_shot_sec: wizardData.sessionData.timeToFirstShot,
        note: wizardData.sessionData.note || null,
      };

      // Transform participants data (without session_id - service will add it)
      const participantsData: Omit<CreateParticipantData, "session_stats_id">[] = wizardData.participants.map((p) => ({
        user_id: p.user_id,
        user_duty: p.user_duty,
        weapon_id: p.weapon_id || null,
        equipment_id: p.equipment_id || null,
        position: p.position,
      }));

      // Transform targets and engagements data
      const targetsData = await Promise.all(
        wizardData.targets.map(async (target) => {
          // Calculate total hits from engagements
          const totalHits = target.engagements.reduce((sum: number, eng: any) => {
            return sum + (eng.target_hits || 0);
          }, 0);

          // Target stats (without session_id - service will add it)
          const targetStats: Omit<CreateTargetStatsData, "session_stats_id"> = {
            distance_m: target.distance,
            wind_strength: target.windStrength || null,
            wind_direction_deg: target.windDirection || null,
            total_hits: totalHits,
            target_eliminated: totalHits >= 2,
            mistake_code: target.mistakeCode || null,
          };

          const engagements: Omit<CreateTargetEngagementData, "target_stats_id">[] = target.engagements.map((eng) => {
            return {
              user_id: eng.user_id,
              shots_fired: eng.shots_fired || 0,
              target_hits: eng.target_hits || 0,
              is_estimated: eng.target_hits === undefined || eng.target_hits === null,
              estimated_method: eng.target_hits === undefined || eng.target_hits === null ? "shots_ratio" : null,
            };
          });

          const processedData = await processTrainingSessionToEmbeddings({
            sessionData: wizardData.sessionData,
            participants: wizardData.participants,
            targets: wizardData.targets,
          });

          const supabaseRecords = formatForSupabaseInsert(processedData);
          console.log("supabaseRecords", supabaseRecords);
          console.log("participantsData", processedData);

          return {
            targetStats,
            engagements,
          };
        }),
      );

      // Call service to save everything
      const savedSession = await saveCompleteSession({
        sessionStats: sessionStatsData,
        participants: participantsData as CreateParticipantData[], // service will add session_id
        targets: targetsData as Array<{
          targetStats: CreateTargetStatsData;
          engagements: CreateTargetEngagementData[];
        }>, // service will add session_id and target_id
      });

      set({
        sessionStats: savedSession,
        isLoading: false,
        error: null,
      });

      return savedSession;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to save session statistics";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },
}));
