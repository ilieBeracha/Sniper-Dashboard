import { RuleTemplate, TeamRule } from "../type";
import { supabase } from "@/services/supabaseClient";

export const fetchRuleTemplates = async (): Promise<RuleTemplate[]> => {
  const { data, error } = await supabase.from("rule_templates").select("*");
  if (error) throw error;
  return data as RuleTemplate[];
};

export const fetchTeamRules = async (teamId: string): Promise<TeamRule[]> => {
  const { data, error } = await supabase.from("team_rules").select("*").eq("team_id", teamId);
  if (error) throw error;
  return data as TeamRule[];
};
