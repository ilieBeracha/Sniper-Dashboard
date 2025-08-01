import React from "react";
import { FaPlus, FaBolt, FaClock, FaCheckCircle, FaExclamationTriangle, FaRobot, FaCog } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";
import { RuleTemplate, TeamRule } from "../type";

interface RulesMainPanelProps {
  onRuleSelect: (ruleId: string | null) => void;
  selectedRuleId: string | null;
}

export default function RulesMainPanel({ onRuleSelect, selectedRuleId }: RulesMainPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { templates, teamRules } = useRuleStore();

  // Determine what to display
  const hasTeamRules = teamRules && teamRules.length > 0;
  const items = hasTeamRules ? teamRules : templates;

  // Get icon based on trigger type
  const getTriggerIcon = (type: string) => {
    switch (type) {
      case "score_update":
        return <FaExclamationTriangle className="w-4 h-4 text-amber-500" />;
      case "schedule":
        return <FaClock className="w-4 h-4 text-blue-500" />;
      case "training_complete":
        return <FaCheckCircle className="w-4 h-4 text-green-500" />;
      case "automation":
        return <FaRobot className="w-4 h-4 text-purple-500" />;
      default:
        return <FaBolt className="w-4 h-4 text-gray-500" />;
    }
  };

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-gray-700">
        <div className="flex items-center justify-between mb-1">
          <h2 className="text-lg font-semibold">{hasTeamRules ? "Team Rules" : "Templates"}</h2>
          <button
            className={`p-2 rounded-lg transition-all ${
              isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
            } shadow-sm hover:shadow-md`}
          >
            <FaPlus className="w-3.5 h-3.5" />
          </button>
        </div>
        <p className="text-xs text-gray-500">{hasTeamRules ? `${teamRules.length} active` : `${templates.length} available`}</p>
      </div>

      {/* Rules/Templates List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-2">
          {items.map((item) => {
            const isTeamRule = "template_id" in item;
            const isSelected = selectedRuleId === item.id;

            return (
              <div
                key={item.id}
                onClick={() => onRuleSelect(item.id)}
                className={`
                  relative p-3 rounded-lg cursor-pointer transition-all duration-200
                  ${
                    isSelected
                      ? isDark
                        ? "bg-purple-900/30 border border-purple-500"
                        : "bg-purple-50 border border-purple-400"
                      : isDark
                        ? "bg-gray-800/50 hover:bg-gray-700/50 border border-transparent hover:border-gray-600"
                        : "bg-white hover:bg-gray-50 border border-gray-200 hover:border-gray-300"
                  }
                `}
              >
                {/* Status Badge for Team Rules */}
                {isTeamRule && (
                  <div
                    className={`absolute top-2 right-2 w-2 h-2 rounded-full ${(item as TeamRule).enabled ? "bg-green-400" : "bg-gray-400"}`}
                    title={(item as TeamRule).enabled ? "Active" : "Inactive"}
                  />
                )}

                <div className="flex items-center gap-3">
                  {/* Icon */}
                  <div className={`p-2 rounded ${isDark ? "bg-gray-700/50" : "bg-gray-100"}`}>
                    {React.cloneElement(
                      getTriggerIcon(
                        isTeamRule
                          ? templates.find((t) => t.id === (item as TeamRule).template_id)?.trigger_type || ""
                          : (item as RuleTemplate).trigger_type,
                      ),
                      { className: "w-3.5 h-3.5" },
                    )}
                  </div>

                  {/* Content */}
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-sm truncate">
                      {isTeamRule
                        ? templates.find((t) => t.id === (item as TeamRule).template_id)?.name || "Unknown Rule"
                        : (item as RuleTemplate).name}
                    </h3>

                    <p className="text-xs text-gray-500 truncate">
                      {isTeamRule ? (item as TeamRule).message || "No message" : (item as RuleTemplate).description}
                    </p>
                  </div>

                  {/* Quick Action */}
                  {isSelected && <FaCog className={`w-3.5 h-3.5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`p-6 rounded-full mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
              <FaBolt className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2">No Rules Found</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              {hasTeamRules
                ? "Your team hasn't configured any rules yet. Click the + button to create your first rule."
                : "No rule templates available. Contact your administrator."}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
