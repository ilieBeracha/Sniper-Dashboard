import { create } from "zustand";
import {
  getTrainingGroups,
  createTrainingGroup,
  addTrainingsToGroup,
  removeTrainingFromGroup,
  getTrainingsInGroup,
  getGroupsForTraining,
  deleteTrainingGroup
} from "@/services/sessionGroupService";
import { 
  TrainingGroup, 
  TrainingGroupWithCount,
  CreateTrainingGroupPayload,
  AddTrainingsToGroupPayload 
} from "@/types/sessionGroup";

interface SessionGroupStore {
  groups: TrainingGroupWithCount[];
  selectedGroup: TrainingGroup | null;
  trainingsInGroup: any[];
  isLoading: boolean;
  
  // Actions
  loadGroups: (teamId: string) => Promise<void>;
  createGroup: (payload: CreateTrainingGroupPayload) => Promise<TrainingGroup | null>;
  selectGroup: (group: TrainingGroup | null) => void;
  addTrainingsToGroup: (payload: AddTrainingsToGroupPayload) => Promise<boolean>;
  removeTrainingFromGroup: (groupId: string, trainingId: string) => Promise<boolean>;
  loadTrainingsInGroup: (groupId: string) => Promise<void>;
  getGroupsForTraining: (trainingId: string) => Promise<TrainingGroup[]>;
  deleteGroup: (groupId: string) => Promise<boolean>;
  resetStore: () => void;
}

export const sessionGroupStore = create<SessionGroupStore>((set, get) => ({
  groups: [],
  selectedGroup: null,
  trainingsInGroup: [],
  isLoading: false,

  loadGroups: async (teamId: string) => {
    set({ isLoading: true });
    try {
      const groups = await getTrainingGroups(teamId);
      set({ groups, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  createGroup: async (payload: CreateTrainingGroupPayload) => {
    const newGroup = await createTrainingGroup(payload);
    if (newGroup) {
      // Reload groups to get updated list with counts
      await get().loadGroups(payload.team_id);
    }
    return newGroup;
  },

  selectGroup: (group: TrainingGroup | null) => {
    set({ selectedGroup: group });
    if (group) {
      get().loadTrainingsInGroup(group.id);
    } else {
      set({ trainingsInGroup: [] });
    }
  },

  addTrainingsToGroup: async (payload: AddTrainingsToGroupPayload) => {
    const success = await addTrainingsToGroup(payload);
    if (success) {
      const { selectedGroup } = get();
      if (selectedGroup?.id === payload.group_id) {
        // Reload trainings in the selected group
        await get().loadTrainingsInGroup(payload.group_id);
      }
      // Update group counts
      const teamId = get().groups[0]?.team_id;
      if (teamId) {
        await get().loadGroups(teamId);
      }
    }
    return success;
  },

  removeTrainingFromGroup: async (groupId: string, trainingId: string) => {
    const success = await removeTrainingFromGroup(groupId, trainingId);
    if (success) {
      const { selectedGroup } = get();
      if (selectedGroup?.id === groupId) {
        // Reload trainings in the selected group
        await get().loadTrainingsInGroup(groupId);
      }
      // Update group counts
      const teamId = get().groups[0]?.team_id;
      if (teamId) {
        await get().loadGroups(teamId);
      }
    }
    return success;
  },

  loadTrainingsInGroup: async (groupId: string) => {
    set({ isLoading: true });
    try {
      const trainings = await getTrainingsInGroup(groupId);
      set({ trainingsInGroup: trainings, isLoading: false });
    } catch (error) {
      set({ isLoading: false });
    }
  },

  getGroupsForTraining: async (trainingId: string) => {
    return await getGroupsForTraining(trainingId);
  },

  deleteGroup: async (groupId: string) => {
    const success = await deleteTrainingGroup(groupId);
    if (success) {
      const { selectedGroup } = get();
      if (selectedGroup?.id === groupId) {
        set({ selectedGroup: null, trainingsInGroup: [] });
      }
      // Update groups list
      const teamId = get().groups[0]?.team_id;
      if (teamId) {
        await get().loadGroups(teamId);
      }
    }
    return success;
  },

  resetStore: () => {
    set({
      groups: [],
      selectedGroup: null,
      trainingsInGroup: [],
      isLoading: false
    });
  }
}));