import { create } from "zustand";
import { fetchRuleTemplates, fetchTeamRules, fetchRuleExecutions } from "@/OnePlatform/RulesModel/service/ruleService";
import { RuleTemplate, TeamRule, RuleExecution } from "@/OnePlatform/RulesModel/type";

type RuleStore = {
  templates: RuleTemplate[];
  setTemplates: (templates: RuleTemplate[]) => void;
  getRuleTemplates: () => Promise<RuleTemplate[]>;
  teamRules: TeamRule[];
  setTeamRules: (teamRules: TeamRule[]) => void;
  getTeamRules: (teamId: string) => Promise<TeamRule[]>;
  ruleExecutions: Record<string, RuleExecution[]>;
  setRuleExecutions: (ruleExecutions: Record<string, RuleExecution[]>) => void;
  getRuleExecutions: (ruleId: string) => Promise<RuleExecution[]>;
};

export const useRuleStore = create<RuleStore>((set) => ({
  templates: [],
  setTemplates: (templates) => set({ templates }),
  getRuleTemplates: async () => {
    const templates = await fetchRuleTemplates();
    set({ templates });
    return templates;
  },

  teamRules: [],
  setTeamRules: (teamRules) => set({ teamRules }),
  getTeamRules: async (teamId) => {
    const teamRules = await fetchTeamRules(teamId);
    set({ teamRules });
    return teamRules;
  },

  ruleExecutions: {},
  setRuleExecutions: (ruleExecutions) => set({ ruleExecutions }),
  getRuleExecutions: async (ruleId) => {
    const executions = await fetchRuleExecutions(ruleId);
    set((state) => ({
      ruleExecutions: { ...state.ruleExecutions, [ruleId]: executions },
    }));
    return executions;
  },
}));
