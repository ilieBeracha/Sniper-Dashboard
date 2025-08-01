import { create } from "zustand";
import { fetchRuleTemplates, fetchTeamRules } from "@/OnePlatform/RulesModel/service/ruleService";
import { RuleTemplate, TeamRule } from "@/OnePlatform/RulesModel/type";

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
}));
