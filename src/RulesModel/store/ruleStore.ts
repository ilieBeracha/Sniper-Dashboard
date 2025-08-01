import { create } from "zustand";
import { RuleTemplate, TeamRule, RuleStats, RuleExecution } from "../type";
import {
  fetchRuleTemplates,
  fetchTeamRules,
  fetchRuleStats,
  fetchRuleExecutions,
  createTeamRule,
  updateTeamRule,
} from "@/OnePlatform/RulesModel/service/ruleService";

type RuleStore = {
  templates: RuleTemplate[];
  setTemplates: (templates: RuleTemplate[]) => void;
  getRuleTemplates: () => Promise<RuleTemplate[]>;
  teamRules: TeamRule[];
  setTeamRules: (teamRules: TeamRule[]) => void;
  getTeamRules: (teamId: string) => Promise<TeamRule[]>;
  ruleStats: Record<string, RuleStats>;
  getRuleStats: (ruleId: string) => Promise<RuleStats>;
  ruleExecutions: Record<string, RuleExecution[]>;
  getRuleExecutions: (ruleId: string) => Promise<RuleExecution[]>;
  createRule: (teamId: string, ruleData: any) => Promise<TeamRule>;
  updateRule: (ruleId: string, ruleData: any) => Promise<TeamRule>;
};

export const useRuleStore = create<RuleStore>((set) => ({
  templates: [],
  setTemplates: (templates: RuleTemplate[]) => set({ templates }),
  getRuleTemplates: async () => {
    const templates = await fetchRuleTemplates();
    set({ templates });
    return templates;
  },

  teamRules: [],
  setTeamRules: (teamRules: TeamRule[]) => set({ teamRules }),
  getTeamRules: async (teamId: string) => {
    const teamRules = await fetchTeamRules(teamId);
    set({ teamRules });
    return teamRules;
  },

  ruleStats: {},
  getRuleStats: async (ruleId: string) => {
    const stats = await fetchRuleStats(ruleId);
    set((state) => ({
      ruleStats: { ...state.ruleStats, [ruleId]: stats },
    }));
    return stats;
  },

  ruleExecutions: {},
  getRuleExecutions: async (ruleId: string) => {
    const executions = await fetchRuleExecutions(ruleId);
    set((state) => ({
      ruleExecutions: { ...state.ruleExecutions, [ruleId]: executions },
    }));
    return executions;
  },

  createRule: async (teamId: string, ruleData: any) => {
    const newRule = await createTeamRule(teamId, ruleData);
    set((state) => ({
      teamRules: [...state.teamRules, newRule],
    }));
    return newRule;
  },

  updateRule: async (ruleId: string, ruleData: any) => {
    const updatedRule = await updateTeamRule(ruleId, ruleData);
    set((state) => ({
      teamRules: state.teamRules.map((rule) => (rule.id === ruleId ? updatedRule : rule)),
    }));
    return updatedRule;
  },
}));
