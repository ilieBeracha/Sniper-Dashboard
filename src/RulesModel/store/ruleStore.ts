import { create } from "zustand";
import { fetchRuleTemplates, fetchTeamRules } from "../service/ruleService";
import { RuleTemplate, TeamRule } from "../type";

type RuleStore = {
  templates: RuleTemplate[];
  setTemplates: (templates: RuleTemplate[]) => void;
  getRuleTemplates: () => Promise<RuleTemplate[]>;
  teamRules: TeamRule[];
  setTeamRules: (teamRules: TeamRule[]) => void;
  getTeamRules: (teamId: string) => Promise<TeamRule[]>;
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
}));
