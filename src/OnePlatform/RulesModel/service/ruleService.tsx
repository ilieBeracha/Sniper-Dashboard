import { supabase } from "@/services/supabaseClient";

export type RuleEventType = { id: string; key: string; name: string };
export type RuleActionType = { id: string; key: string; name: string };
export type RuleDefinition = {
  id: string;
  team_id: string;
  name: string;
  event_type_id: string;
  logic: any;
  is_active: boolean;
  created_at: string;
};
export type RuleEvent = {
  id: string;
  event_type_id: string;
  payload: any;
  created_at: string;
};
export type RuleActionStep = {
  id: string;
  definition_id: string;
  action_type_id: string;
  params: any;
  step_order: number;
};
export type RuleExecution = {
  id: string;
  definition_id: string;
  event_id: string;
  status: string;
  result: any;
  executed_at: string;
};

export const fetchRuleEventTypes = () => supabase.from("rule_event_types").select("*");

export const fetchRuleActionTypes = () => supabase.from("rule_action_types").select("*");

export const fetchRuleDefinitions = (teamId: string) => supabase.from("rule_definitions").select("*").eq("team_id", teamId);

export const fetchRuleEvent = (eventId: string) => supabase.from("rule_events").select("*").eq("id", eventId).single();

export const fetchRuleEvents = (eventTypeId: string, teamId: string) =>
  supabase
    .from("rule_events")
    .select("*")
    .eq("event_type_id", eventTypeId)
    .contains("payload", { team_id: teamId })
    .order("created_at", { ascending: false });

export const fetchRuleActions = (definitionId: string) =>
  supabase.from("rule_actions").select("*").eq("definition_id", definitionId).order("step_order", { ascending: true });

export const fetchRuleExecutions = (definitionId: string) =>
  supabase.from("rule_executions").select("*").eq("definition_id", definitionId).order("executed_at", { ascending: false });

export const createRuleDefinition = async (newDef: RuleDefinition) => {
  // drop the id field so Postgres can gen one
  const { id, ...payload } = newDef as any;
  const { data, error } = await supabase.from("rule_definitions").insert(payload).select().single();
  return { data, error } as { data: RuleDefinition | null; error: any };
};

export const updateRuleDefinition = async (definition: RuleDefinition) => {
  const { id, ...payload } = definition as any;
  const { data, error } = await supabase.from("rule_definitions").update(payload).eq("id", id).select().single();
  return { data, error } as { data: RuleDefinition | null; error: any };
};
