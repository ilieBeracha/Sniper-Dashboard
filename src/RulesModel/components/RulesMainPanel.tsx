import { useState, useEffect } from "react";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";
import { RuleTemplate, TeamRule } from "../type";
import { formatDistanceToNow } from "date-fns";
import RuleEditor from "./RuleEditor";

interface RulesMainPanelProps {
  onRuleSelect: (ruleId: string | null) => void;
  selectedRuleId: string | null;
}

export default function RulesMainPanel({ onRuleSelect, selectedRuleId }: RulesMainPanelProps) {
  const { theme } = useTheme();
  const _isDark = theme === "dark";
  const { templates, teamRules, ruleStats, getRuleStats, createRule } = useRuleStore();
  const [activeTab, setActiveTab] = useState<"active" | "templates">("active");
  const [showEditor, setShowEditor] = useState(false);
  const [editingRuleId, setEditingRuleId] = useState<string | undefined>();
  const [_isLoading, setIsLoading] = useState(false);

  // Load stats for team rules
  useEffect(() => {
    teamRules.forEach((rule) => {
      if (!ruleStats[rule.id]) {
        getRuleStats(rule.id).catch(console.error);
      }
    });
  }, [teamRules, ruleStats, getRuleStats]);

  const items = activeTab === "active" ? teamRules : templates;

  return (
    <div className="h-full flex flex-col bg-white dark:bg-gray-900">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Automation Rules</h2>
        <div className="flex gap-6 mt-4">
          <button
            onClick={() => setActiveTab("active")}
            className={`pb-2 text-sm font-medium transition-all relative ${
              activeTab === "active"
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Active Rules
            {activeTab === "active" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500" />}
          </button>
          <button
            onClick={() => setActiveTab("templates")}
            className={`pb-2 text-sm font-medium transition-all relative ${
              activeTab === "templates"
                ? "text-gray-900 dark:text-white"
                : "text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300"
            }`}
          >
            Templates
            {activeTab === "templates" && <div className="absolute bottom-0 left-0 right-0 h-0.5 bg-blue-600 dark:bg-blue-500" />}
          </button>
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 overflow-y-auto">
        <div className="p-4 space-y-2">
          {items.map((item) => {
            const isTeamRule = "template_id" in item;
            const isSelected = selectedRuleId === item.id;
            const stats = isTeamRule ? ruleStats[item.id] : null;
            const template = isTeamRule ? templates.find((t) => t.id === (item as TeamRule).template_id) : (item as RuleTemplate);

            return (
              <div
                key={item.id}
                onClick={() => onRuleSelect(item.id)}
                className={`
                  group relative px-4 py-3 rounded-lg cursor-pointer transition-all
                  ${
                    isSelected
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-800/50 border border-transparent"
                  }
                `}
              >
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {isTeamRule ? template?.name || "Unknown Rule" : (item as RuleTemplate).name}
                      </h3>
                      {isTeamRule && <div className={`w-2 h-2 rounded-full ${(item as TeamRule).enabled ? "bg-green-500" : "bg-gray-400"}`} />}
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                      {isTeamRule ? (item as TeamRule).message || template?.description || "No description" : (item as RuleTemplate).description}
                    </p>
                  </div>

                  {/* Stats for team rules */}
                  {isTeamRule && stats && stats.last_execution && (
                    <div className="flex items-center gap-4 text-xs">
                      <div className="text-right">
                        <div className="text-gray-500 dark:text-gray-400">Last run</div>
                        <div className="font-medium text-gray-700 dark:text-gray-300">
                          {formatDistanceToNow(new Date(stats.last_execution.started_at), { addSuffix: true })}
                        </div>
                      </div>
                      <div
                        className={`w-8 h-8 rounded flex items-center justify-center ${
                          stats.last_execution.status === "success"
                            ? "bg-green-100 dark:bg-green-900/30 text-green-600 dark:text-green-400"
                            : stats.last_execution.status === "failed"
                              ? "bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400"
                              : "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-600 dark:text-yellow-400"
                        }`}
                      >
                        <span className="text-xs font-medium">{stats.successful_executions || 0}</span>
                      </div>
                    </div>
                  )}
                </div>

                {/* Expandable metrics */}
                {isTeamRule && stats && stats.total_executions > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-100 dark:border-gray-800 grid grid-cols-3 gap-4">
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Success Rate</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">
                        {Math.round((stats.successful_executions / stats.total_executions) * 100)}%
                      </div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Avg Duration</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{Math.round(stats.average_execution_time)}ms</div>
                    </div>
                    <div>
                      <div className="text-xs text-gray-500 dark:text-gray-400">Total Runs</div>
                      <div className="text-sm font-medium text-gray-900 dark:text-gray-100">{stats.total_executions}</div>
                    </div>
                  </div>
                )}
              </div>
            );
          })}

          {items.length === 0 && (
            <div className="text-center py-12">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                {activeTab === "active" ? "No active rules configured" : "No templates available"}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Footer Actions */}
      <div className="px-6 py-4 border-t border-gray-200 dark:border-gray-800">
        <button
          onClick={() => {
            setEditingRuleId(undefined);
            setShowEditor(true);
          }}
          className="w-full py-2 px-4 bg-blue-600 hover:bg-blue-700 text-white text-sm font-medium rounded-lg transition-colors"
        >
          {activeTab === "active" ? "Create New Rule" : "Use Template"}
        </button>
      </div>

      {/* Rule Editor Modal */}
      {showEditor && (
        <RuleEditor
          ruleId={editingRuleId}
          templateId={activeTab === "templates" && selectedRuleId ? selectedRuleId : undefined}
          onClose={() => {
            setShowEditor(false);
            setEditingRuleId(undefined);
          }}
          onSave={async (ruleData) => {
            setIsLoading(true);
            try {
              // Get team ID from auth store or context
              const teamId = localStorage.getItem("teamId") || "default-team-id"; // You should get this from your auth context

              if (activeTab === "templates" && selectedRuleId) {
                // Creating from template
                await createRule(teamId, {
                  ...ruleData,
                  templateId: selectedRuleId,
                });
              } else {
                // Creating new rule
                await createRule(teamId, ruleData);
              }

              setShowEditor(false);
              setEditingRuleId(undefined);
              // Optionally refresh team rules
              // await getTeamRules(teamId);
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
