import {
  Background,
  Controls,
  ReactFlow,
  Node,
  Edge,
  ConnectionMode,
  BackgroundVariant,
  Handle,
  Position,
  MarkerType,
  EdgeProps,
  getBezierPath,
  ReactFlowProvider,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";
import { useMemo, useCallback, useState } from "react";
import RuleDetailView from "./RuleDetailView";

// Custom Edge Component with smooth curves
const CustomEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd }: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.25,
  });

  return (
    <>
      <path style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} strokeWidth={2} />
    </>
  );
};

// Professional node designs
const TriggerNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`
      px-6 py-4 rounded-xl shadow-sm border-2 min-w-[200px]
      ${isDark ? "bg-gray-800 border-blue-600/50" : "bg-white border-blue-500/50"}
    `}
    >
      <Handle type="source" position={Position.Bottom} className="!w-2 !h-2 !bg-blue-500 !border-2 !border-white" />
      <div className="text-center">
        <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? "text-blue-400" : "text-blue-600"}`}>Trigger</div>
        <div className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{data.label}</div>
      </div>
    </div>
  );
};

const ConditionNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`
      relative transform rotate-45 w-24 h-24 shadow-sm border-2
      ${isDark ? "bg-gray-800 border-amber-600/50" : "bg-white border-amber-500/50"}
    `}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-amber-500 !border-2 !border-white !-top-1 !left-1/2 !-translate-x-1/2"
        style={{ transform: "rotate(-45deg) translateX(-50%)" }}
      />
      <div className="absolute inset-0 flex items-center justify-center -rotate-45">
        <div className="text-center p-2">
          <div className={`text-xs font-medium uppercase tracking-wider ${isDark ? "text-amber-400" : "text-amber-600"}`}>If</div>
          <div className={`text-xs font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{data.label}</div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        id="true"
        className="!w-2 !h-2 !bg-green-500 !border-2 !border-white !top-1/2 !-right-1"
        style={{ transform: "rotate(-45deg) translateY(-50%)" }}
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        className="!w-2 !h-2 !bg-red-500 !border-2 !border-white !-bottom-1 !left-1/2"
        style={{ transform: "rotate(-45deg) translateX(-50%)" }}
      />
    </div>
  );
};

const ActionNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`
      px-6 py-4 rounded-xl shadow-sm border-2 min-w-[200px]
      ${isDark ? "bg-gray-800 border-green-600/50" : "bg-white border-green-500/50"}
    `}
    >
      <Handle type="target" position={Position.Top} className="!w-2 !h-2 !bg-green-500 !border-2 !border-white" />
      <div className="text-center">
        <div className={`text-xs font-medium uppercase tracking-wider mb-1 ${isDark ? "text-green-400" : "text-green-600"}`}>Action</div>
        <div className={`text-sm font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{data.label}</div>
      </div>
    </div>
  );
};

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
  const [showDetails, setShowDetails] = useState(false);

  // Generate nodes and edges based on selected rule
  const { nodes, edges } = useMemo(() => {
    if (!selectedRuleId) {
      // Show default template flow
      return {
        nodes: [
          {
            id: "trigger-default",
            type: "trigger",
            position: { x: 250, y: 50 },
            data: { label: "Event Trigger" },
          },
          {
            id: "condition-default",
            type: "condition",
            position: { x: 238, y: 150 },
            data: { label: "Condition" },
          },
          {
            id: "action-1-default",
            type: "action",
            position: { x: 100, y: 300 },
            data: { label: "Action (True)" },
          },
          {
            id: "action-2-default",
            type: "action",
            position: { x: 350, y: 300 },
            data: { label: "Action (False)" },
          },
        ],
        edges: [
          {
            id: "e-trigger-condition",
            source: "trigger-default",
            target: "condition-default",
            type: "custom",
            animated: true,
            style: { stroke: isDark ? "#6b7280" : "#9ca3af", strokeWidth: 2 },
          },
          {
            id: "e-condition-true",
            source: "condition-default",
            sourceHandle: "true",
            target: "action-1-default",
            type: "custom",
            animated: true,
            style: { stroke: "#10b981", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#10b981",
            },
          },
          {
            id: "e-condition-false",
            source: "condition-default",
            sourceHandle: "false",
            target: "action-2-default",
            type: "custom",
            animated: true,
            style: { stroke: "#ef4444", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: "#ef4444",
            },
          },
        ],
      };
    }

    const rule = [...teamRules, ...templates].find((r) => r.id === selectedRuleId);
    if (!rule) {
      return { nodes: [], edges: [] };
    }

    const generatedNodes: Node[] = [];
    const generatedEdges: Edge[] = [];

    const isTeamRule = "template_id" in rule;
    const template = isTeamRule ? templates.find((t) => t.id === rule.template_id) : rule;

    if (!template) return { nodes: [], edges: [] };

    // Simple flow layout
    const centerX = 250;
    let currentY = 50;
    const verticalSpacing = 120;

    // Trigger node
    generatedNodes.push({
      id: "trigger-1",
      type: "trigger",
      position: { x: centerX, y: currentY },
      data: { label: template.name },
    });

    currentY += verticalSpacing;

    // Add condition if configured
    const config = isTeamRule ? rule.custom_config : template.default_config;
    if (config?.conditions && config.conditions.length > 0) {
      generatedNodes.push({
        id: "condition-1",
        type: "condition",
        position: { x: centerX - 12, y: currentY },
        data: { label: config.conditions[0].label || "Check Condition" },
      });

      generatedEdges.push({
        id: "e-trigger-condition",
        source: "trigger-1",
        target: "condition-1",
        type: "custom",
        animated: true,
        style: {
          stroke: isDark ? "#6b7280" : "#9ca3af",
          strokeWidth: 2,
        },
      });

      currentY += verticalSpacing + 50;

      // True path action
      generatedNodes.push({
        id: "action-true",
        type: "action",
        position: { x: centerX - 150, y: currentY },
        data: { label: "Execute Action" },
      });

      generatedEdges.push({
        id: "e-condition-true",
        source: "condition-1",
        sourceHandle: "true",
        target: "action-true",
        type: "custom",
        animated: true,
        style: { stroke: "#10b981", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#10b981",
        },
      });

      // False path action
      generatedNodes.push({
        id: "action-false",
        type: "action",
        position: { x: centerX + 150, y: currentY },
        data: { label: "Skip" },
      });

      generatedEdges.push({
        id: "e-condition-false",
        source: "condition-1",
        sourceHandle: "false",
        target: "action-false",
        type: "custom",
        animated: true,
        style: { stroke: "#ef4444", strokeWidth: 2 },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: "#ef4444",
        },
      });
    } else {
      // Direct action
      generatedNodes.push({
        id: "action-1",
        type: "action",
        position: { x: centerX, y: currentY },
        data: { label: isTeamRule ? rule.message || "Execute Action" : "Execute Action" },
      });

      generatedEdges.push({
        id: "e-trigger-action",
        source: "trigger-1",
        target: "action-1",
        type: "custom",
        animated: true,
        style: {
          stroke: isDark ? "#3b82f6" : "#2563eb",
          strokeWidth: 2,
        },
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isDark ? "#3b82f6" : "#2563eb",
        },
      });
    }

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [selectedRuleId, templates, teamRules, isDark]);

  const onConnect = useCallback(() => {
    return;
  }, []);

  return (
    <ReactFlowProvider>
      <div className="w-full h-full flex">
        <div className={`flex-1 relative ${showDetails && selectedRuleId ? "w-3/5" : "w-full"}`}>
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            onConnect={onConnect}
            connectionMode={ConnectionMode.Loose}
            fitView
            fitViewOptions={{
              padding: 0.2,
              includeHiddenNodes: false,
              minZoom: 0.5,
              maxZoom: 1.5,
            }}
            defaultViewport={{ x: 0, y: 0, zoom: 1 }}
            proOptions={{ hideAttribution: true }}
            className={`${isDark ? "bg-gray-950" : "bg-gray-50"}`}
            defaultEdgeOptions={{
              type: "custom",
              animated: true,
            }}
          >
            <Background variant={BackgroundVariant.Dots} gap={16} size={1} color={isDark ? "#374151" : "#e5e7eb"} />
            <Controls showInteractive={false} className={isDark ? "!bg-gray-800 !border-gray-700" : "!bg-white !border-gray-200"} />

            {/* Details Toggle */}
            {selectedRuleId && (
              <button
                onClick={() => setShowDetails(!showDetails)}
                className={`absolute top-4 right-4 px-3 py-2 text-sm font-medium rounded-lg transition-all ${
                  isDark
                    ? "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700"
                    : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                } shadow-sm`}
              >
                {showDetails ? "Hide Details" : "Show Details"}
              </button>
            )}
          </ReactFlow>
        </div>

        {/* Detail Panel */}
        {showDetails && selectedRuleId && (
          <div className={`w-2/5 border-l ${isDark ? "border-gray-800" : "border-gray-200"}`}>
            <RuleDetailView selectedRuleId={selectedRuleId} />
          </div>
        )}
      </div>
    </ReactFlowProvider>
  );
}
