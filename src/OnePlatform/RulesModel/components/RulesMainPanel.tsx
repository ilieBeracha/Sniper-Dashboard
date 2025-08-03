import { useEffect } from "react";
import { FaPlay, FaBolt, FaClock, FaCheckCircle, FaExclamationTriangle, FaRobot, FaPlus, FaMagic } from "react-icons/fa";
import { useRuleStore } from "../store/ruleStore";
import { motion, AnimatePresence } from "framer-motion";

interface RulesMainPanelProps {
  onRuleSelect: (ruleId: string | null) => void;
  selectedRuleId: string | null;
  onTemplateClick: () => void;
}

export default function RulesMainPanel({ onRuleSelect, selectedRuleId, onTemplateClick }: RulesMainPanelProps) {
  const { definitions, eventTypes, loadExecutions, loadEvents } = useRuleStore();

  const triggerIcons = {
    score_update: <FaExclamationTriangle className="w-3.5 h-3.5" />,
    schedule: <FaClock className="w-3.5 h-3.5" />,
    training_complete: <FaCheckCircle className="w-3.5 h-3.5" />,
    automation: <FaRobot className="w-3.5 h-3.5" />,
  };

  const activeRules = definitions.filter((r) => r.is_active);
  const totalRules = definitions.length;

  useEffect(() => {
    if (selectedRuleId) {
      loadExecutions(selectedRuleId);
      loadEvents(selectedRuleId, selectedRuleId);
    }
  }, [selectedRuleId, loadExecutions, loadEvents]);

  return (
    <div className="h-full flex flex-col">
      {/* Header */}
      <div className="px-6 py-5 border-b border-gray-200 dark:border-gray-800">
        <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">Rules Engine</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">Automate your workflow</p>
      </div>

      {/* Stats Cards */}
      <div className="px-6 py-4 space-y-3">
        <motion.div initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="grid grid-cols-2 gap-3">
          <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-950/30 dark:to-indigo-950/30 rounded-xl p-4 border border-blue-100 dark:border-blue-900/50">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-blue-700 dark:text-blue-300">Active Rules</p>
              <div className="p-1.5 bg-blue-100 dark:bg-blue-900/50 rounded-lg">
                <FaPlay className="w-3 h-3 text-blue-600 dark:text-blue-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-blue-900 dark:text-blue-100">{activeRules.length}</p>
          </div>

          <div className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-800/50 dark:to-gray-900/50 rounded-xl p-4 border border-gray-200 dark:border-gray-700">
            <div className="flex items-center justify-between mb-2">
              <p className="text-xs font-medium text-gray-600 dark:text-gray-400">Total Rules</p>
              <div className="p-1.5 bg-gray-200 dark:bg-gray-700 rounded-lg">
                <FaBolt className="w-3 h-3 text-gray-500 dark:text-gray-400" />
              </div>
            </div>
            <p className="text-2xl font-bold text-gray-800 dark:text-gray-200">{totalRules}</p>
          </div>
        </motion.div>

        {/* Action Buttons */}
        <div className="space-y-2">
          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTemplateClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white rounded-xl transition-all duration-200 text-sm font-medium shadow-lg shadow-blue-500/20"
          >
            <FaPlus className="w-3.5 h-3.5" />
            Create New Rule
          </motion.button>

          <motion.button
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={onTemplateClick}
            className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-white dark:bg-gray-800 hover:bg-gray-50 dark:hover:bg-gray-750 text-gray-700 dark:text-gray-300 rounded-xl transition-all duration-200 text-sm font-medium border border-gray-200 dark:border-gray-700"
          >
            <FaMagic className="w-3.5 h-3.5" />
            Browse Templates
          </motion.button>
        </div>
      </div>

      {/* Active Rules List */}
      <div className="flex-1 overflow-y-auto px-6 pb-6">
        <h3 className="text-xs font-semibold text-gray-500 dark:text-gray-400 uppercase tracking-wider mb-3">Active Rules</h3>

        {activeRules.length === 0 ? (
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
            <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-800 inline-block mb-3">
              <FaBolt className="w-8 h-8 text-gray-400" />
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400">No active rules yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Create your first rule to get started</p>
          </motion.div>
        ) : (
          <AnimatePresence>
            <div className="space-y-2">
              {activeRules.map((rule, index) => {
                const template = eventTypes.find((t) => t.id === rule.event_type_id);
                const isSelected = selectedRuleId === rule.id;

                return (
                  <motion.div
                    key={rule.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    whileHover={{ x: 4 }}
                    onClick={() => onRuleSelect(rule.id)}
                    className={`
                      relative p-4 rounded-xl cursor-pointer transition-all duration-200 border
                      ${
                        isSelected
                          ? "bg-gradient-to-r from-blue-50 to-indigo-50 dark:from-blue-950/20 dark:to-indigo-950/20 border-blue-200 dark:border-blue-800 shadow-md"
                          : "bg-white dark:bg-gray-800/50 hover:bg-gray-50 dark:hover:bg-gray-800 border-gray-200 dark:border-gray-700 hover:shadow-sm"
                      }
                    `}
                  >
                    {isSelected && (
                      <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-8 bg-gradient-to-b from-blue-500 to-indigo-500 rounded-r-full" />
                    )}

                    <div className="flex items-center gap-3">
                      <div
                        className={`
                        p-2 rounded-lg transition-colors
                        ${
                          isSelected
                            ? "bg-gradient-to-br from-blue-100 to-indigo-100 dark:from-blue-900/50 dark:to-indigo-900/50"
                            : "bg-gray-100 dark:bg-gray-700/50"
                        }
                      `}
                      >
                        <div className={isSelected ? "text-blue-600 dark:text-blue-400" : "text-gray-500 dark:text-gray-400"}>
                          {triggerIcons[template?.key as keyof typeof triggerIcons] || <FaBolt className="w-3.5 h-3.5" />}
                        </div>
                      </div>

                      <div className="flex-1 min-w-0">
                        <h4 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">{template?.name || "Unknown Rule"}</h4>
                        <p className="text-xs text-gray-500 dark:text-gray-400 truncate mt-0.5">{rule.name}</p>
                      </div>

                      <div className="flex-shrink-0">
                        <span className="flex items-center gap-1 text-xs text-green-600 dark:text-green-400 font-medium">
                          <FaPlay className="w-2.5 h-2.5" />
                          Active
                        </span>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </AnimatePresence>
        )}
      </div>
    </div>
  );
}
