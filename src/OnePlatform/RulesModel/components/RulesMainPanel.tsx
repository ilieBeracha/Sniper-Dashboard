import { useEffect, useState } from "react";
import { FaPlus, FaBolt, FaClock, FaCheckCircle, FaExclamationTriangle, FaRobot, FaList, FaPlay, FaPause, FaSync } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";

interface RulesMainPanelProps {
  onRuleSelect: (ruleId: string | null) => void;
  selectedRuleId: string | null;
}

export default function RulesMainPanel({ onRuleSelect, selectedRuleId }: RulesMainPanelProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { templates, teamRules, getRuleExecutions } = useRuleStore();
  const [activeTab, setActiveTab] = useState<"team" | "templates">("team");

  const triggerIcons = {
    score_update: <FaExclamationTriangle className="w-4 h-4 text-amber-500" />,
    schedule: <FaClock className="w-4 h-4 text-blue-500" />,
    training_complete: <FaCheckCircle className="w-4 h-4 text-green-500" />,
    automation: <FaRobot className="w-4 h-4 text-purple-500" />,
  };

  const items = activeTab === "team" ? teamRules : templates;

  useEffect(() => {
    if (selectedRuleId) {
      getRuleExecutions(selectedRuleId);
    }
  }, [selectedRuleId, getRuleExecutions]);

  return (
    <div className="h-full flex flex-col">
      {/* Header with Tabs */}
      <div className="border-b border-gray-200 dark:border-gray-700">
        <div className="p-4 pb-0">
          <div className="flex items-center justify-between mb-3">
            <h2 className="text-lg font-semibold">Rules Engine</h2>
            <button
              className={`p-2 rounded-lg transition-all ${
                isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
              } shadow-sm hover:shadow-md`}
            >
              <FaPlus className="w-3.5 h-3.5" />
            </button>
          </div>

          {/* Tab Buttons */}
          <div className="flex space-x-1">
            <button
              onClick={() => setActiveTab("team")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === "team"
                  ? isDark
                    ? "bg-gray-800 text-purple-400 border-b-2 border-purple-400"
                    : "bg-white text-purple-600 border-b-2 border-purple-600"
                  : isDark
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaList className="w-3.5 h-3.5" />
                <span>Team Rules</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                  {teamRules.length}
                </span>
              </div>
            </button>

            <button
              onClick={() => setActiveTab("templates")}
              className={`px-4 py-2 text-sm font-medium rounded-t-lg transition-all ${
                activeTab === "templates"
                  ? isDark
                    ? "bg-gray-800 text-purple-400 border-b-2 border-purple-400"
                    : "bg-white text-purple-600 border-b-2 border-purple-600"
                  : isDark
                    ? "text-gray-400 hover:text-gray-200"
                    : "text-gray-600 hover:text-gray-900"
              }`}
            >
              <div className="flex items-center gap-2">
                <FaBolt className="w-3.5 h-3.5" />
                <span>Templates</span>
                <span className={`text-xs px-1.5 py-0.5 rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-200 text-gray-700"}`}>
                  {templates.length}
                </span>
              </div>
            </button>
          </div>
        </div>
      </div>

      {/* Rules/Templates List */}
      <div className="flex-1 overflow-y-auto p-3">
        <div className="space-y-3">
          {items.map((item) => {
            const isTeamRule = "template_id" in item;
            const isSelected = selectedRuleId === item.id;
            const template = isTeamRule ? templates.find((t) => t.id === item.template_id) : item;

            return (
              <div
                key={item.id}
                onClick={() => onRuleSelect(item.id)}
                className={`
                  p-4 rounded-lg cursor-pointer transition-all
                  ${
                    isSelected
                      ? "bg-purple-50 dark:bg-purple-900/20 border-purple-400"
                      : "bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-700 border-gray-200 dark:border-gray-700"
                  } border
                `}
              >
                <div className="flex items-start gap-3">
                  <div className="p-2 rounded bg-gray-100 dark:bg-gray-700">
                    {triggerIcons[template?.trigger_type as keyof typeof triggerIcons] || <FaBolt className="w-4 h-4 text-gray-500" />}
                  </div>

                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h3 className="font-medium text-sm">{template?.name || "Unknown Rule"}</h3>
                      {isTeamRule &&
                        (item.enabled ? <FaPlay className="w-2.5 h-2.5 text-green-500" /> : <FaPause className="w-2.5 h-2.5 text-gray-400" />)}
                    </div>
                    <p className="text-xs text-gray-500 mt-0.5">{isTeamRule ? item.message : template?.description}</p>

                    {template?.tags && template.tags.length > 0 && (
                      <div className="flex gap-1 mt-2">
                        {template.tags.map((tag) => (
                          <span key={tag} className="text-xs px-2 py-0.5 rounded-full bg-gray-100 dark:bg-gray-700">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {items.length === 0 && (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <div className={`p-6 rounded-full mb-4 ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
              {activeTab === "team" ? <FaList className="w-12 h-12 text-gray-400" /> : <FaBolt className="w-12 h-12 text-gray-400" />}
            </div>
            <h3 className="text-lg font-semibold mb-2">{activeTab === "team" ? "No Team Rules" : "No Templates"}</h3>
            <p className="text-sm text-gray-500 max-w-xs">
              {activeTab === "team"
                ? "Your team hasn't configured any rules yet. Click the + button to create your first rule from a template."
                : "No rule templates available. Contact your administrator."}
            </p>
          </div>
        )}
      </div>

      {/* Footer with Summary */}
      {activeTab === "team" && teamRules.length > 0 && (
        <div className={`p-3 border-t ${isDark ? "border-gray-700 bg-gray-800/50" : "border-gray-200 bg-gray-50"}`}>
          <div className="flex items-center justify-between text-xs">
            <div className="flex items-center gap-3">
              <span className="text-gray-500">Active:</span>
              <span className="font-medium text-green-600">{teamRules.filter((r) => r.enabled).length}</span>
              <span className="text-gray-400">|</span>
              <span className="text-gray-500">Paused:</span>
              <span className="font-medium text-gray-600">{teamRules.filter((r) => !r.enabled).length}</span>
            </div>
            <button className="flex items-center gap-1 text-purple-500 hover:text-purple-600">
              <FaSync className="w-3 h-3" />
              <span>Refresh</span>
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
