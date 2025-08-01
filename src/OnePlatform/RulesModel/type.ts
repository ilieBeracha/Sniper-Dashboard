export type RuleTemplate = {
  id: string;
  name: string;
  trigger_type: string;
  default_config: any;
  mock_flow?: {
    nodes: any[];
    edges: any[];
  };
  description: string;
  tags: string[];
  created_at: string;
};

export type TeamRule = {
  id: string;
  team_id: string;
  template_id: string;
  custom_config: any;
  message: string;
  enabled: boolean;
  created_at: string;
};

export type RuleExecution = {
  id: string;
  rule_id: string;
  team_id: string;
  status: "success" | "failed" | "pending";
  started_at: string;
  completed_at?: string;
  error_message?: string;
  affected_items?: number;
  execution_time_ms?: number;
};

export type RuleStats = {
  total_executions: number;
  successful_executions: number;
  failed_executions: number;
  average_execution_time: number;
  last_execution?: RuleExecution;
};
