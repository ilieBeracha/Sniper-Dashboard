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
import { FaBolt, FaCompress, FaExpand } from "react-icons/fa";

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function FlowBuilder({ selectedRuleId }: { selectedRuleId?: string | null }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { templates, teamRules } = useRuleStore();
  const [showDetails, setShowDetails] = useState(true);

  const rule = [...teamRules, ...templates].find((r) => r.id === selectedRuleId);
  const isTeamRule = rule && "template_id" in rule;

  const flow = isTeamRule ? rule?.custom_config : (rule as any)?.mock_flow;

  const nodes = flow?.nodes || [];
  const edges = flow?.edges || [];

  if (!selectedRuleId || !rule) {
    return (
      <div className="flex-1 relative flex items-center justify-center">
        <div className="text-center">
          <div className={`p-6 rounded-full mb-4 inline-block ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
            <FaBolt className="w-12 h-12 text-gray-400" />
          </div>
          <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">No Rule Selected</h3>
          <p className="text-sm text-gray-500 max-w-xs">Select a rule from the left panel to visualize its flow</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex">
      <div className={`flex-1 ${showDetails ? "w-3/5" : "w-full"} relative`}>
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          onConnect={() => {}}
          connectionMode={ConnectionMode.Loose}
          fitView
          defaultEdgeOptions={{ type: "custom", animated: true }}
          className={isDark ? "bg-[#0F0F11]" : "bg-gray-50"}
        >
          <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={isDark ? "#1f2937" : "#e5e7eb"} />
          <MiniMap pannable zoomable />
          <Controls showInteractive={false} />
        </ReactFlow>

        <button onClick={() => {}} className="absolute top-4 left-4 z-10 bg-blue-600 text-white px-3 py-1 rounded shadow hover:bg-blue-700">
          Save Flow
        </button>

        <button
          onClick={() => setShowDetails(!showDetails)}
          className={`absolute top-4 right-4 p-2 rounded-lg transition-all ${
            isDark ? "bg-gray-800 hover:bg-gray-700" : "bg-white hover:bg-gray-100"
          } border ${isDark ? "border-gray-700" : "border-gray-200"} shadow-sm`}
          title={showDetails ? "Hide Details" : "Show Details"}
        >
          {showDetails ? <FaCompress className="w-4 h-4" /> : <FaExpand className="w-4 h-4" />}
        </button>
      </div>

      {showDetails && (
        <div className={`w-2/5 border-l ${isDark ? "border-gray-700" : "border-gray-200"}`}>
          <RuleDetailView selectedRuleId={selectedRuleId} />
        </div>
      )}
    </div>
  );
}
