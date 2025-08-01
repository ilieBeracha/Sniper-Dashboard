export type RuleTemplate = {
  id: string;
  name: string;
  trigger_type: string;
  default_config: any;
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
