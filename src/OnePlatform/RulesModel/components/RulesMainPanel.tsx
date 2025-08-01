import React, { useState } from "react";
import { FaPlus, FaBolt, FaClock, FaCheckCircle, FaExclamationTriangle, FaRobot, FaCog, FaList, FaPlay, FaPause, FaSync } from "react-icons/fa";
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
  const [activeTab, setActiveTab] = useState<"team" | "templates">("team");

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

  const items = activeTab === "team" ? teamRules : templates;

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
            const template = isTeamRule ? templates.find((t) => t.id === (item as TeamRule).template_id) : (item as RuleTemplate);

            return (
              <div
                key={item.id}
                onClick={() => onRuleSelect(item.id)}
                className={`
                  relative p-4 rounded-lg cursor-pointer transition-all duration-200
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
                {/* Header Row */}
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    {/* Icon */}
                    <div className={`p-2 rounded ${isDark ? "bg-gray-700/50" : "bg-gray-100"}`}>
                      {React.cloneElement(getTriggerIcon(template?.trigger_type || ""), { className: "w-4 h-4" })}
                    </div>

                    {/* Title and Description */}
                    <div className="flex-1">
                      <div className="flex items-center gap-2">
                        <h3 className="font-medium text-sm">{isTeamRule ? template?.name || "Unknown Rule" : (item as RuleTemplate).name}</h3>
                        {isTeamRule && (
                          <div className="flex items-center gap-1">
                            {(item as TeamRule).enabled ? (
                              <FaPlay className="w-2.5 h-2.5 text-green-500" title="Active" />
                            ) : (
                              <FaPause className="w-2.5 h-2.5 text-gray-400" title="Paused" />
                            )}
                          </div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 mt-0.5">
                        {isTeamRule ? (item as TeamRule).message || "No message" : (item as RuleTemplate).description}
                      </p>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="flex items-center gap-1">
                    {isSelected && <FaCog className={`w-3.5 h-3.5 ${isDark ? "text-gray-400" : "text-gray-500"}`} />}
                  </div>
                </div>

                {/* Template Tags */}
                {!isTeamRule && (item as RuleTemplate).tags && (item as RuleTemplate).tags.length > 0 && (
                  <div className="mt-3 pt-3 border-t border-gray-200 dark:border-gray-700">
                    <div className="flex flex-wrap gap-1">
                      {(item as RuleTemplate).tags.map((tag, index) => (
                        <span
                          key={index}
                          className={`text-xs px-2 py-1 rounded-full ${isDark ? "bg-gray-700 text-gray-300" : "bg-gray-100 text-gray-700"}`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
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
