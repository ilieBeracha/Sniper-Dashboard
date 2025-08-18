import { create } from "zustand";
import {
  createGroupScoreService,
  getGroupingScoreComparisonById,
  getSessionStatsCountByTrainingId,
  saveCompleteSession,
  deleteGroupScoreService,
  updateGroupScoreService,
  getFullSessionById,
  deleteSessionStatsService,
  updateCompleteSession,
} from "@/services/sessionService";
import type { CreateSessionStatsData, CreateParticipantData, CreateTargetStatsData, CreateTargetEngagementData } from "@/types/sessionStats";
import { TrainingStore } from "./trainingStore";
import { getSessionStatsByTrainingId } from "@/services/sessionService";
import { formatForSupabaseInsert, processTrainingSessionToEmbeddings } from "@/services/embedSniperSession";
import { userStore } from "./userStore";

interface SessionStatsState {
  sessionStats: any[];
  isLoading: boolean;
  error: string | null;
  setSessionStats: (sessionStats: any) => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  clearError: () => void;
  saveSessionStats: (sessionData: SessionStatsSaveData) => Promise<any>;
  updateSessionStats: (sessionId: string, sessionData: SessionStatsSaveData) => Promise<any>;
  getSessionStatsByTrainingId: (assignmentId: string, limit?: number, offset?: number) => Promise<any[]>;
  getSessionStatsCountByTrainingId: (assignmentId: string) => Promise<number>;
  createGroupScore: (groupScore: any) => Promise<any>;
  updateGroupScore: (id: string, groupScore: any) => Promise<any>;
  getGroupingScoreComparisonById: (groupScoreId: string) => Promise<any>;
  deleteGroupScore: (id: string) => Promise<any>;
  selectedSession: any | null;
  setSelectedSession: (session: any) => void;
  groupStats: any[];
  groupStatsComparison: GroupStatsComparison | null | undefined;
  getFullSessionById: (id: string) => Promise<any>;
  deleteSessionStats: (id: string) => Promise<any>;
  setFilters: (filters: { dayNight: string | null; effort: string | null; distance: string | null; participated: boolean | null }) => void;
  filters: {
    dayNight: string | null;
    effort: string | null;
    distance: string | null;
    participated: boolean | null;
  };
}

export interface GroupStatsComparison {
  this_score: {
    cm_dispersion: number;
    weapon_type: string;
    position: string;
    type: string;
  };
  user_comparison: {
    user_avg: number;
    user_best: number;
    is_best_score: boolean;
  };
  team_comparison: {
    avg_for_weapon: number;
    avg_for_position: number;
    avg_for_type: number;
  };
}

export interface SessionStatsSaveData {
  // Session data from wizard
  sessionData: {
    training_session_id: string | null;
    assignment_id: string | null;
    team_id: string | null;
    dayPeriod: string | null;
    timeToFirstShot: number | null;
    effort: boolean | null;
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
    meter_per_second?: number;
    totalHits?: number;
    mistakeCode?: string;
    first_shot_hit?: boolean | null;
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
  selectedSession: null,
  groupStats: [],
  groupStatsComparison: null,
  isLoading: false,
  error: null,
  filters: {
    dayNight: null,
    effort: null,
    distance: null,
    participated: null,
  },
  setFilters: (filters: { dayNight: string | null; effort: string | null; distance: string | null; participated: boolean | null }) =>
    set({ filters }),
  setSessionStats: (sessionStats: any) => set({ sessionStats }),
  setLoading: (loading: boolean) => set({ isLoading: loading }),
  setError: (error: string | null) => set({ error }),
  clearError: () => set({ error: null }),
  setSelectedSession: (session: any) => set({ selectedSession: session }),

  getSessionStatsByTrainingId: async (assignmentId: string, limit: number = 20, offset: number = 0) => {
    const state = sessionStore.getState();
    const userEmail = userStore.getState().user?.email || null;

    const filters = {
      dayNight: state.filters.dayNight,
      effort: state.filters.effort,
      distance: state.filters.distance,
      participated: state.filters.participated,
      userEmail: userEmail,
    };

    const result = await getSessionStatsByTrainingId(assignmentId, limit, offset, filters);
    set({ sessionStats: Array.isArray(result) ? result : [] });
    return Array.isArray(result) ? result : [];
  },

  getSessionStatsCountByTrainingId: async (assignmentId: string) => {
    return await getSessionStatsCountByTrainingId(assignmentId);
  },

  createGroupScore: async (groupScore: any) => {
    const trainingStore = TrainingStore.getState().training;
    const res = await createGroupScoreService(groupScore, trainingStore?.id || "");
    set({ groupStats: res });

    return res;
  },

  getGroupingScoreComparisonById: async (groupScoreId: string) => {
    const res = await getGroupingScoreComparisonById(groupScoreId);
    set({ groupStatsComparison: res });
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
        effort: wizardData.sessionData.effort || false,
        note: wizardData.sessionData.note || null,
        squad_id: userStore.getState().user?.squad_id || null,
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
            first_shot_hit: target.first_shot_hit !== undefined ? target.first_shot_hit : null,
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
  updateGroupScore: async (id: string, groupScore: any) => {
    const res = await updateGroupScoreService(id, groupScore);
    set({ groupStats: res });
    return res;
  },

  deleteGroupScore: async (id: string) => {
    const res = await deleteGroupScoreService(id);
    set({ groupStats: res });
    return res;
  },

  getFullSessionById: async (id: string) => {
    const res = await getFullSessionById(id);
    set({ selectedSession: res });
    return res;
  },

  deleteSessionStats: async (id: string) => {
    const res = await deleteSessionStatsService(id);
    const sessionsList = sessionStore.getState().sessionStats.filter((session: any) => session.id !== id);
    set({ sessionStats: sessionsList });
    return res;
  },

  updateSessionStats: async (sessionId: string, wizardData: SessionStatsSaveData) => {
    set({ isLoading: true, error: null });
    const trainingStore = TrainingStore.getState().training;

    try {
      // Transform wizard data to database format (same as save)
      const sessionStatsData: CreateSessionStatsData = {
        training_session_id: wizardData.sessionData.training_session_id || trainingStore?.id || "",
        assignment_id: wizardData.sessionData.assignment_id,
        creator_id: wizardData.currentUser?.id || null,
        team_id: wizardData.sessionData.team_id,
        day_period: wizardData.sessionData.dayPeriod,
        time_to_first_shot_sec: wizardData.sessionData.timeToFirstShot,
        effort: wizardData.sessionData.effort || false,
        note: wizardData.sessionData.note || null,
        squad_id: userStore.getState().user?.squad_id || null,
      };

      // Transform participants data
      const participantsData: CreateParticipantData[] = wizardData.participants.map((p) => ({
        user_id: p.user_id,
        user_duty: p.user_duty,
        weapon_id: p.weapon_id || null,
        equipment_id: p.equipment_id || null,
        position: p.position,
        session_stats_id: sessionId, // Will be overwritten in service
      }));

      // Transform targets and engagements data
      const targetsData = wizardData.targets.map((target) => {
        // Calculate total hits from engagements
        const totalHits = target.engagements.reduce((sum: number, eng: any) => {
          return sum + (eng.target_hits || 0);
        }, 0);

        // Target stats
        const targetStats: CreateTargetStatsData = {
          distance_m: target.distance,
          wind_strength: target.windStrength || null,
          wind_direction_deg: target.windDirection || null,
          total_hits: totalHits,
          target_eliminated: totalHits >= 2,
          mistake_code: target.mistakeCode || null,
          first_shot_hit: target.first_shot_hit || false,
          session_stats_id: sessionId, // Will be overwritten in service
        };

        const engagements: CreateTargetEngagementData[] = target.engagements.map((eng) => ({
          user_id: eng.user_id,
          shots_fired: eng.shots_fired || 0,
          target_hits: eng.target_hits || 0,
          is_estimated: eng.target_hits === undefined || eng.target_hits === null,
          estimated_method: eng.target_hits === undefined || eng.target_hits === null ? "shots_ratio" : null,
          target_stats_id: "", // Will be set in service
        }));

        return {
          targetStats,
          engagements,
        };
      });

      // Call service to update everything
      const updatedSession = await updateCompleteSession(sessionId, {
        sessionStats: sessionStatsData,
        participants: participantsData,
        targets: targetsData,
      });

      // Update the sessionStats list with the updated session
      const trainingId = trainingStore?.id;
      if (trainingId) {
        await sessionStore.getState().getSessionStatsByTrainingId(trainingId);
      }

      set({
        selectedSession: updatedSession,
        isLoading: false,
        error: null,
      });

      return updatedSession;
    } catch (error: any) {
      const errorMessage = error.message || "Failed to update session statistics";
      set({
        isLoading: false,
        error: errorMessage,
      });
      throw error;
    }
  },
}));
