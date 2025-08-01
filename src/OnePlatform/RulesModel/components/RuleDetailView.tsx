import { FaHistory, FaPlay, FaPause, FaEdit, FaTrash } from "react-icons/fa";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";
import { RuleTemplate, TeamRule } from "../type";
import { format } from "date-fns";

interface RuleDetailViewProps {
  selectedRuleId: string;
}

export default function RuleDetailView({ selectedRuleId }: RuleDetailViewProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { templates, teamRules } = useRuleStore();

  // Find the selected rule
  const rule = [...teamRules, ...templates].find((r) => r.id === selectedRuleId);
  const isTeamRule = rule && "template_id" in rule;
  const template = isTeamRule ? templates.find((t) => t.id === (rule as TeamRule).template_id) : (rule as RuleTemplate);

  if (!rule || !template) {
    return null;
  }

  return (
    <div className={`h-full p-6 overflow-y-auto ${isDark ? "bg-gray-900/50" : "bg-gray-50"}`}>
      {/* Header */}
      <div className="mb-6">
        <div className="flex items-start justify-between mb-2">
          <div>
            <h1 className="text-2xl font-bold mb-1">{template.name}</h1>
            <p className="text-gray-500">{template.description}</p>
          </div>
          {isTeamRule && (
            <div className="flex items-center gap-2">
              <button
                className={`p-2 rounded-lg transition-all ${
                  isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
                } border ${isDark ? "border-gray-700" : "border-gray-200"}`}
              >
                <FaEdit className="w-4 h-4" />
              </button>
              <button
                className={`p-2 rounded-lg transition-all ${
                  (rule as TeamRule).enabled ? "bg-green-500 hover:bg-green-600 text-white" : "bg-gray-500 hover:bg-gray-600 text-white"
                }`}
              >
                {(rule as TeamRule).enabled ? <FaPause className="w-4 h-4" /> : <FaPlay className="w-4 h-4" />}
              </button>
              <button className="p-2 rounded-lg bg-red-500 hover:bg-red-600 text-white transition-all">
                <FaTrash className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Tags */}
        {template.tags && template.tags.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-3">
            {template.tags.map((tag, index) => (
              <span
                key={index}
                className={`text-xs px-3 py-1 rounded-full ${isDark ? "bg-purple-900/30 text-purple-400" : "bg-purple-100 text-purple-700"}`}
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>

      {/* Configuration */}
      {isTeamRule && (
        <div className={`mb-6 p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <h3 className="text-lg font-semibold mb-3">Configuration</h3>
          <div className="space-y-2">
            <div>
              <span className="text-sm text-gray-500">Message:</span>
              <p className="text-sm mt-1">{(rule as TeamRule).message || "No custom message"}</p>
            </div>
            {(rule as TeamRule).custom_config && (
              <div className="mt-3">
                <span className="text-sm text-gray-500">Custom Config:</span>
                <pre className={`text-xs mt-1 p-3 rounded ${isDark ? "bg-gray-900" : "bg-gray-100"} overflow-x-auto`}>
                  {JSON.stringify((rule as TeamRule).custom_config, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Execution History */}
      {isTeamRule && (
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-semibold flex items-center gap-2">
              <FaHistory className="w-5 h-5" />
              Execution History
            </h3>
            <span className="text-sm text-gray-500">Last 10 runs</span>
          </div>
        </div>
      )}

      {/* Template Info (for templates view) */}
      {!isTeamRule && (
        <div className={`p-4 rounded-lg ${isDark ? "bg-gray-800" : "bg-white"} border ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <h3 className="text-lg font-semibold mb-3">Template Configuration</h3>
          <div className="space-y-3">
            <div>
              <span className="text-sm text-gray-500">Trigger Type:</span>
              <p className="text-sm mt-1 font-medium capitalize">{template.trigger_type.replace(/_/g, " ")}</p>
            </div>
            <div>
              <span className="text-sm text-gray-500">Default Configuration:</span>
              <pre className={`text-xs mt-1 p-3 rounded ${isDark ? "bg-gray-900" : "bg-gray-100"} overflow-x-auto`}>
                {JSON.stringify(template.default_config, null, 2)}
              </pre>
            </div>
            <div>
              <span className="text-sm text-gray-500">Created:</span>
              <p className="text-sm mt-1">{format(new Date(template.created_at), "MMM d, yyyy")}</p>
            </div>
          </div>

          <button
            className={`mt-4 w-full py-2 px-4 rounded-lg font-medium transition-all ${
              isDark ? "bg-purple-600 hover:bg-purple-700 text-white" : "bg-purple-500 hover:bg-purple-600 text-white"
            }`}
          >
            Use This Template
          </button>
        </div>
      )}
    </div>
  );
}
