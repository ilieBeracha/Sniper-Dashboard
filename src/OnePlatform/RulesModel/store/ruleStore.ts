import { create } from "zustand";
import {
  fetchRuleEventTypes,
  fetchRuleActionTypes,
  fetchRuleDefinitions,
  fetchRuleEvents,
  fetchRuleActions,
  fetchRuleExecutions,
  RuleEventType,
  RuleActionType,
  RuleDefinition,
  RuleEvent,
  RuleActionStep,
  RuleExecution,
  fetchRuleEvent,
  createRuleDefinition,
  updateRuleDefinition,
} from "@/OnePlatform/RulesModel/service/ruleService";

type RuleStore = {
  eventTypes: RuleEventType[];
  actionTypes: RuleActionType[];
  definitions: RuleDefinition[];
  events: Record<string, RuleEvent[]>;
  actions: Record<string, RuleActionStep[]>;
  executions: Record<string, RuleExecution[]>;

  loadEventTypes: () => Promise<void>;
  loadActionTypes: () => Promise<void>;
  loadDefinitions: (teamId: string) => Promise<void>;
  loadEvents: (eventTypeId: string, teamId: string) => Promise<void>;
  loadEvent: (eventId: string) => Promise<void>;
  loadActions: (definitionId: string) => Promise<void>;
  loadExecutions: (definitionId: string) => Promise<void>;
  createRuleDefinition: (definition: RuleDefinition) => Promise<void>;
  updateRuleDefinition: (definition: RuleDefinition) => Promise<void>;
};

export const useRuleStore = create<RuleStore>((set, get) => ({
  eventTypes: [],
  actionTypes: [],
  definitions: [],
  events: {},
  actions: {},
  executions: {},

  loadEventTypes: async () => {
    const { data, error } = await fetchRuleEventTypes();
    if (error) throw error;
    set({ eventTypes: data });
  },

  loadActionTypes: async () => {
    const { data, error } = await fetchRuleActionTypes();
    if (error) throw error;
    set({ actionTypes: data });
  },

  loadDefinitions: async (teamId) => {
    const { data, error } = await fetchRuleDefinitions(teamId);
    if (error) throw error;
    set({ definitions: data });
  },

  loadEvents: async (eventTypeId, teamId) => {
    const { data, error } = await fetchRuleEvents(eventTypeId, teamId);
    if (error) throw error;
    set((s) => ({ events: { ...s.events, [eventTypeId]: data } }));
  },

  loadEvent: async (eventId) => {
    const { data, error } = await fetchRuleEvent(eventId);
    if (error) throw error;
    set({ events: { ...get().events, [eventId]: data } });
  },

  loadActions: async (definitionId) => {
    const { data, error } = await fetchRuleActions(definitionId);
    if (error) throw error;
    set((s) => ({ actions: { ...s.actions, [definitionId]: data } }));
  },

  loadExecutions: async (definitionId) => {
    const { data, error } = await fetchRuleExecutions(definitionId);
    if (error) throw error;
    set((s) => ({ executions: { ...s.executions, [definitionId]: data } }));
  },

  createRuleDefinition: async (definition) => {
    const { data, error } = await createRuleDefinition(definition);
    if (error) throw error;
    if (data) set((s) => ({ definitions: [...s.definitions, data] }));
  },

  updateRuleDefinition: async (definition) => {
    const { data, error } = await updateRuleDefinition(definition);
    if (error) throw error;
    if (data) set((s) => ({ definitions: s.definitions.map((d) => (d.id === definition.id ? data : d)) }));
  },
}));
