import { useRuleStore } from "../store/ruleStore";
import { RuleTemplate, TeamRule } from "../type";
import { format } from "date-fns";

interface RuleDetailViewProps {
  selectedRuleId: string;
}

export default function RuleDetailView({ selectedRuleId }: RuleDetailViewProps) {
  const { templates, teamRules, ruleExecutions } = useRuleStore();

  const rule = [...teamRules, ...templates].find((r) => r.id === selectedRuleId);
  const isTeamRule = rule && "template_id" in rule;
  const template = isTeamRule ? templates.find((t) => t.id === (rule as TeamRule).template_id) : (rule as RuleTemplate);

  if (!rule || !template) return null;

  const config = isTeamRule ? (rule as TeamRule).custom_config : template.default_config;
  const executions = ruleExecutions[selectedRuleId] || [];

  return (
    <div className="h-full p-6 overflow-y-auto bg-white dark:bg-gray-900 border-l">
      <h2 className="text-xl font-semibold mb-2">{template.name}</h2>
      <p className="text-sm text-gray-500 mb-4">{template.description}</p>

      {template.tags?.length > 0 && (
        <div className="flex flex-wrap gap-2 mb-4">
          {template.tags.map((tag) => (
            <span key={tag} className="text-xs bg-purple-100 text-purple-700 px-2 py-0.5 rounded">
              {tag}
            </span>
          ))}
        </div>
      )}

      {isTeamRule && (
        <div className="mb-6">
          <h4 className="text-sm font-medium text-gray-600 mb-1">Custom Message</h4>
          <p className="text-sm bg-gray-100 dark:bg-gray-800 p-3 rounded text-gray-800 dark:text-gray-200">{(rule as TeamRule).message}</p>
        </div>
      )}

      <div className="mb-6">
        <h4 className="text-sm font-medium text-gray-600 mb-1">Configuration</h4>
        <pre className="text-xs bg-gray-100 dark:bg-gray-800 p-3 rounded overflow-x-auto text-gray-800 dark:text-gray-200">
          {JSON.stringify(config, null, 2)}
        </pre>
      </div>

      {isTeamRule && executions.length > 0 && (
        <div>
          <h4 className="text-sm font-medium text-gray-600 mb-2">Last Executions</h4>
          <ul className="text-xs space-y-1">
            {executions.map((exec) => (
              <li key={exec.id} className="flex justify-between border-b pb-1 last:border-none">
                <span>{exec.status.toUpperCase()}</span>
                <span className="text-gray-400">{format(new Date(exec.started_at), "MMM d, HH:mm")}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
