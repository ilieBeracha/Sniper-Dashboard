import React, { useEffect, useState } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";
import { RuleTemplate, TeamRule } from "../type";
import { format, formatDistanceToNow } from "date-fns";
import RuleEditor from "./RuleEditor";

interface RuleDetailViewProps {
  selectedRuleId: string;
}

export default function RuleDetailView({ selectedRuleId }: RuleDetailViewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { templates, teamRules, ruleStats, ruleExecutions, getRuleStats, getRuleExecutions, updateRule } = useRuleStore();
  const [showEditor, setShowEditor] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Find the selected rule
  const rule = [...teamRules, ...templates].find((r) => r.id === selectedRuleId);
  const isTeamRule = rule && "template_id" in rule;
  const template = isTeamRule ? templates.find((t) => t.id === (rule as TeamRule).template_id) : (rule as RuleTemplate);

  const stats = ruleStats[selectedRuleId];
  const executions = ruleExecutions[selectedRuleId] || [];

  // Load data when rule is selected
  useEffect(() => {
    if (selectedRuleId && isTeamRule) {
      getRuleStats(selectedRuleId).catch(console.error);
      getRuleExecutions(selectedRuleId).catch(console.error);
    }
  }, [selectedRuleId, isTeamRule, getRuleStats, getRuleExecutions]);

  if (!rule || !template) {
    return null;
  }

  return (
    <div className="h-full overflow-y-auto bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
        <div className="flex items-start justify-between">
          <div>
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{template.name}</h2>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{template.description}</p>
          </div>
          {isTeamRule && (
            <div
              className={`px-3 py-1 rounded-full text-xs font-medium ${
                (rule as TeamRule).enabled
                  ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-400"
                  : "bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-400"
              }`}
            >
              {(rule as TeamRule).enabled ? "Active" : "Inactive"}
            </div>
          )}
        </div>
      </div>

      {/* Performance Metrics */}
      {isTeamRule && stats && (
        <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Performance</h3>
          <div className="grid grid-cols-2 gap-4">
            <div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {stats.total_executions > 0 ? `${Math.round((stats.successful_executions / stats.total_executions) * 100)}%` : "—"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">
                {stats.average_execution_time > 0 ? `${Math.round(stats.average_execution_time)}ms` : "—"}
              </div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Avg Duration</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.total_executions}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Total Runs</div>
            </div>
            <div>
              <div className="text-2xl font-semibold text-gray-900 dark:text-gray-100">{stats.failed_executions}</div>
              <div className="text-xs text-gray-500 dark:text-gray-400">Failed</div>
            </div>
          </div>
        </div>
      )}

      {/* Configuration */}
      <div className="px-6 py-6 border-b border-gray-200 dark:border-gray-800">
        <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Configuration</h3>
        <div className="space-y-3">
          <div>
            <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Trigger Type</div>
            <div className="text-sm text-gray-900 dark:text-gray-100 font-medium capitalize">{template.trigger_type.replace(/_/g, " ")}</div>
          </div>
          {isTeamRule && (rule as TeamRule).message && (
            <div>
              <div className="text-xs text-gray-500 dark:text-gray-400 mb-1">Custom Message</div>
              <div className="text-sm text-gray-900 dark:text-gray-100">{(rule as TeamRule).message}</div>
            </div>
          )}
        </div>
      </div>

      {/* Execution History */}
      {isTeamRule && (
        <div className="px-6 py-6">
          <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 mb-4">Recent Executions</h3>
          {executions.length > 0 ? (
            <div className="space-y-3">
              {executions.slice(0, 5).map((execution) => (
                <div key={execution.id} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        execution.status === "success" ? "bg-green-500" : execution.status === "failed" ? "bg-red-500" : "bg-yellow-500"
                      }`}
                    />
                    <div>
                      <div className="text-sm text-gray-900 dark:text-gray-100">
                        {execution.status === "success" ? "Success" : execution.status === "failed" ? "Failed" : "Pending"}
                      </div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDistanceToNow(new Date(execution.started_at), { addSuffix: true })}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <div className="text-sm text-gray-900 dark:text-gray-100">{execution.execution_time_ms}ms</div>
                    <div className="text-xs text-gray-500 dark:text-gray-400">{format(new Date(execution.started_at), "HH:mm")}</div>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <p className="text-sm text-gray-500 dark:text-gray-400">No execution history</p>
          )}
        </div>
      )}

      {/* Actions */}
      {isTeamRule && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <div className="flex gap-2">
            <button
              onClick={() => setShowEditor(true)}
              className="flex-1 py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
            >
              Edit Rule
            </button>
            <button
              className={`py-2 px-4 text-sm font-medium rounded-lg transition-colors border ${
                (rule as TeamRule).enabled
                  ? "border-gray-300 dark:border-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-800"
                  : "bg-green-600 hover:bg-green-700 text-white border-green-600"
              }`}
            >
              {(rule as TeamRule).enabled ? "Disable" : "Enable"}
            </button>
          </div>
        </div>
      )}

      {/* Template Actions */}
      {!isTeamRule && (
        <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
          <button
            onClick={() => setShowEditor(true)}
            className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
          >
            Use This Template
          </button>
        </div>
      )}

      {/* Rule Editor Modal */}
      {showEditor && (
        <RuleEditor
          ruleId={isTeamRule ? selectedRuleId : undefined}
          templateId={!isTeamRule ? selectedRuleId : undefined}
          onClose={() => setShowEditor(false)}
          onSave={async (ruleData) => {
            setIsLoading(true);
            try {
              if (isTeamRule) {
                await updateRule(selectedRuleId, ruleData);
              } else {
                // Creating from template
                const teamId = localStorage.getItem("teamId") || "default-team-id";
                // This would be handled by creating a new rule from template
                // You might want to close this view and open the create flow
              }
              setShowEditor(false);
            } catch (error) {
              console.error("Failed to save rule:", error);
              // Handle error - show toast notification
            } finally {
              setIsLoading(false);
            }
          }}
        />
      )}
    </div>
  );
}
