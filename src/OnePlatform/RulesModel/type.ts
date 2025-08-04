export type RuleEventType = {
  id: string;
  key: string;
  name: string;
};

export type RuleActionType = {
  id: string;
  key: string;
  name: string;
};

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

export type RuleAction = {
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
