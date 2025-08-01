import { RuleTemplate, TeamRule, RuleExecution, RuleStats } from "@/OnePlatform/RulesModel/type";
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

export const fetchRuleStats = async (ruleId: string): Promise<RuleStats> => {
  const { data: executions, error } = await supabase
    .from("rule_executions")
    .select("*")
    .eq("rule_id", ruleId)
    .order("started_at", { ascending: false });

  if (error) throw error;

  const stats: RuleStats = {
    total_executions: executions?.length || 0,
    successful_executions: executions?.filter((e) => e.status === "success").length || 0,
    failed_executions: executions?.filter((e) => e.status === "failed").length || 0,
    average_execution_time: executions?.reduce((acc, e) => acc + (e.execution_time_ms || 0), 0) / (executions?.length || 1) || 0,
    last_execution: executions?.[0] || undefined,
  };

  return stats;
};

export const createTeamRule = async (teamId: string, ruleData: any): Promise<TeamRule> => {
  const { data, error } = await supabase
    .from("team_rules")
    .insert({
      team_id: teamId,
      template_id: ruleData.templateId,
      enabled: ruleData.enabled ?? true,
      custom_config: ruleData.config || {},
      message: ruleData.message,
    })
    .select()
    .single();

  if (error) throw error;
  return data;
};

export const updateTeamRule = async (ruleId: string, updates: Partial<TeamRule>): Promise<TeamRule> => {
  const { data, error } = await supabase.from("team_rules").update(updates).eq("id", ruleId).select().single();

  if (error) throw error;
  return data;
};

export const fetchRuleExecutions = async (ruleId: string, limit = 10): Promise<RuleExecution[]> => {
  const { data, error } = await supabase
    .from("rule_executions")
    .select("*")
    .eq("rule_id", ruleId)
    .order("started_at", { ascending: false })
    .limit(limit);
  if (error) throw error;
  return data as RuleExecution[];
};
