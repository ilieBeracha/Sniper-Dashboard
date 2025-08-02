import { Background, Controls, MiniMap, ReactFlow, BackgroundVariant, ConnectionMode } from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";
import { useState } from "react";
import RuleDetailView from "./RuleDetailView";
import TriggerNode from "./nodes/TriggerNode";
import ConditionNode from "./nodes/ConditionNode";
import ActionNode from "./nodes/ActionNode";
import CustomEdge from "./edges/CustomEdge";
import { FaBolt, FaEye, FaEyeSlash } from "react-icons/fa";
import { motion, AnimatePresence } from "framer-motion";

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

interface FlowBuilderProps {
  selectedRuleId?: string | null;
  isTemplate?: boolean;
  hideDetails?: boolean;
}

export default function FlowBuilder({ selectedRuleId, isTemplate = false, hideDetails = false }: FlowBuilderProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { templates, teamRules } = useRuleStore();
  const [showDetails, setShowDetails] = useState(!hideDetails);

  const rule = isTemplate ? templates.find((r) => r.id === selectedRuleId) : [...teamRules, ...templates].find((r) => r.id === selectedRuleId);
  const isTeamRule = rule && "template_id" in rule;

  const flow = isTeamRule ? rule?.custom_config : (rule as any)?.mock_flow;

  const nodes = flow?.nodes || [];
  const edges = flow?.edges || [];

  if (!selectedRuleId || !rule) {
    return (
      <div className="flex-1 relative flex items-center justify-center h-full bg-gray-50 dark:bg-black/30">
        <div className="text-center">
          <div className="p-6 rounded-2xl bg-gray-100 dark:bg-gray-900 inline-block mb-4">
            <FaBolt className="w-10 h-10 text-gray-400 dark:text-gray-600" />
          </div>
          <h3 className="text-lg font-medium mb-1 text-gray-700 dark:text-gray-300">No Rule Selected</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">Select a rule to view its flow</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex">
      <AnimatePresence mode="wait">
        <motion.div
          key={showDetails ? "with-details" : "without-details"}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className={`${showDetails && !hideDetails ? "flex-1" : "w-full"} relative`}
        >
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onConnect={() => {}}
            connectionMode={ConnectionMode.Loose}
            fitView
            defaultEdgeOptions={{ type: "custom", animated: true }}
            className="bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-950 dark:to-gray-900 bg-alpha-black"
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} />
            <MiniMap
              style={{
                backgroundColor: isDark ? "#1f2937" : "#ffffff",
                border: "1px solid",
                borderColor: isDark ? "#374151" : "#e5e7eb",
              }}
              nodeColor={(node) => {
                if (node.type === "trigger") return "#6366f1";
                if (node.type === "condition") return "#f59e0b";
                if (node.type === "action") return "#10b981";
                return "#94a3b8";
              }}
            />
            <Controls
              style={{
                border: "1px solid",
                borderRadius: "0.5rem",
              }}
              showInteractive={false}
            />
          </ReactFlow>

          {!hideDetails && (
            <motion.button
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setShowDetails(!showDetails)}
              className="absolute top-4 right-4 p-3 rounded-xl transition-all bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700 border border-gray-200 dark:border-gray-700 shadow-lg group"
              title={showDetails ? "Hide Details" : "Show Details"}
            >
              <div className="flex items-center gap-2">
                {showDetails ? (
                  <>
                    <FaEyeSlash className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                      Hide Details
                    </span>
                  </>
                ) : (
                  <>
                    <FaEye className="w-4 h-4 text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200" />
                    <span className="text-sm font-medium text-gray-600 dark:text-gray-400 group-hover:text-gray-800 dark:group-hover:text-gray-200">
                      Show Details
                    </span>
                  </>
                )}
              </div>
            </motion.button>
          )}
        </motion.div>
      </AnimatePresence>

      <AnimatePresence>
        {showDetails && !hideDetails && (
          <motion.div
            initial={{ width: 0, opacity: 0 }}
            animate={{ width: "24rem", opacity: 1 }}
            exit={{ width: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-l border-gray-200 dark:border-gray-800 overflow-hidden"
          >
            <div className="w-96 h-full">
              <RuleDetailView selectedRuleId={selectedRuleId} />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
