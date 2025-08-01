import {
  Background,
  Controls,
  MiniMap,
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";
import { useMemo, useCallback } from "react";
import { FaBolt, FaCodeBranch, FaCheckCircle, FaClock, FaExclamationTriangle, FaRobot, FaCogs, FaDatabase } from "react-icons/fa";
import { BiSolidZap } from "react-icons/bi";
import { MdInput } from "react-icons/md";

// Custom Edge Component
const CustomEdge = ({ sourceX, sourceY, targetX, targetY, sourcePosition, targetPosition, style = {}, markerEnd, data }: EdgeProps) => {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  });

  return (
    <>
      <path id="edge-path" style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} />
      {data?.label && (
        <text>
          <textPath href="#edge-path" style={{ fontSize: 12 }} startOffset="50%" textAnchor="middle">
            {data.label as string}
          </textPath>
        </text>
      )}
    </>
  );
};

// Custom node components
const TriggerNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative px-4 py-3 rounded-lg shadow-md border min-w-[160px] ${
        isDark
          ? "bg-gradient-to-br from-purple-900 to-purple-800 border-purple-600 text-white"
          : "bg-gradient-to-br from-purple-500 to-purple-600 border-purple-400 text-white"
      }`}
    >
      <Handle type="target" position={Position.Left} className="!bg-purple-400 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        {data.icon || <FaBolt className="w-3.5 h-3.5" />}
        <span className="font-semibold text-xs uppercase tracking-wider">Trigger</span>
      </div>
      <div className="text-xs font-medium">{data.label}</div>
      <Handle type="source" position={Position.Right} className="!bg-purple-400 !w-3 !h-3 !border-2 !border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-purple-400 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
};

const ConditionNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative px-4 py-3 rounded-lg shadow-md border min-w-[160px] ${
        isDark
          ? "bg-gradient-to-br from-amber-900 to-amber-800 border-amber-600 text-white"
          : "bg-gradient-to-br from-amber-500 to-amber-600 border-amber-400 text-white"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-amber-400 !w-3 !h-3 !border-2 !border-white" />
      <Handle type="target" position={Position.Left} id="left" className="!bg-amber-400 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <FaCodeBranch className="w-3.5 h-3.5" />
        <span className="font-semibold text-xs uppercase tracking-wider">Condition</span>
      </div>
      <div className="text-xs font-medium">{data.label}</div>
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        className="!bg-green-400 !w-3 !h-3 !border-2 !border-white"
        style={{ left: "30%" }}
      />
      <Handle type="source" position={Position.Bottom} id="false" className="!bg-red-400 !w-3 !h-3 !border-2 !border-white" style={{ left: "70%" }} />
    </div>
  );
};

const ActionNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative px-4 py-3 rounded-lg shadow-md border min-w-[160px] ${
        isDark
          ? "bg-gradient-to-br from-blue-900 to-blue-800 border-blue-600 text-white"
          : "bg-gradient-to-br from-blue-500 to-blue-600 border-blue-400 text-white"
      }`}
    >
      <Handle type="target" position={Position.Top} className="!bg-blue-400 !w-3 !h-3 !border-2 !border-white" />
      <div className="flex items-center gap-2 mb-1">
        <BiSolidZap className="w-3.5 h-3.5" />
        <span className="font-semibold text-xs uppercase tracking-wider">Action</span>
      </div>
      <div className="text-xs font-medium">{data.label}</div>
      <Handle type="source" position={Position.Right} className="!bg-blue-400 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
};

// User Input Node
const InputNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative px-4 py-3 rounded-lg shadow-md border min-w-[160px] ${
        isDark
          ? "bg-gradient-to-br from-teal-800 to-teal-700 border-teal-600 text-white"
          : "bg-gradient-to-br from-teal-100 to-teal-200 border-teal-300 text-teal-900"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <MdInput className="w-3.5 h-3.5" />
        <span className="font-semibold text-xs uppercase tracking-wider">Input</span>
      </div>
      <div className="text-xs">{data.label}</div>
      <Handle type="source" position={Position.Right} className="!bg-teal-400 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
};

// Property/Config Node
const PropertyNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative px-4 py-3 rounded-lg shadow-md border min-w-[160px] ${
        isDark
          ? "bg-gradient-to-br from-gray-700 to-gray-600 border-gray-500 text-white"
          : "bg-gradient-to-br from-gray-100 to-gray-200 border-gray-300 text-gray-900"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <FaCogs className="w-3.5 h-3.5" />
        <span className="font-semibold text-xs uppercase tracking-wider">Config</span>
      </div>
      <div className="text-xs">{data.label}</div>
      <Handle type="source" position={Position.Left} className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white" />
      <Handle type="source" position={Position.Bottom} id="bottom" className="!bg-gray-400 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
};

// Data Source Node
const DataNode = ({ data }: { data: any }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <div
      className={`relative px-4 py-3 rounded-lg shadow-md border min-w-[160px] ${
        isDark
          ? "bg-gradient-to-br from-indigo-800 to-indigo-700 border-indigo-600 text-white"
          : "bg-gradient-to-br from-indigo-100 to-indigo-200 border-indigo-300 text-indigo-900"
      }`}
    >
      <div className="flex items-center gap-2 mb-1">
        <FaDatabase className="w-3.5 h-3.5" />
        <span className="font-semibold text-xs uppercase tracking-wider">Data</span>
      </div>
      <div className="text-xs">{data.label}</div>
      <Handle type="source" position={Position.Left} className="!bg-indigo-400 !w-3 !h-3 !border-2 !border-white" />
    </div>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
  input: InputNode,
  property: PropertyNode,
  data: DataNode,
};

const edgeTypes = {
  custom: CustomEdge,
};

export default function FlowBuilder({ selectedRuleId }: { selectedRuleId?: string | null }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { templates, teamRules } = useRuleStore();

  // Get trigger icon
  const getTriggerIcon = (type: string) => {
    switch (type) {
      case "score_update":
        return <FaExclamationTriangle className="w-4 h-4" />;
      case "schedule":
        return <FaClock className="w-4 h-4" />;
      case "training_complete":
        return <FaCheckCircle className="w-4 h-4" />;
      case "automation":
        return <FaRobot className="w-4 h-4" />;
      default:
        return <FaBolt className="w-4 h-4" />;
    }
  };

  // Generate nodes and edges based on selected rule
  const { nodes, edges } = useMemo(() => {
    if (!selectedRuleId) {
      return { nodes: [], edges: [] };
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

    // Create a more sophisticated flow layout
    const centerX = 400;
    const startY = 50;
    const verticalSpacing = 120;

    // Trigger node (centered)
    generatedNodes.push({
      id: "trigger-1",
      type: "trigger",
      position: { x: centerX, y: startY },
      data: {
        label: template.name,
        icon: getTriggerIcon(template.trigger_type),
      },
    });

    // Parse config for conditions and actions
    const config = isTeamRule ? rule.custom_config : template.default_config;

    // Add input nodes for trigger parameters
    if (template.trigger_type === "score_update" || template.trigger_type === "training_complete") {
      generatedNodes.push({
        id: "input-1",
        type: "input",
        position: { x: centerX - 200, y: startY },
        data: { label: "User Score" },
      });

      generatedNodes.push({
        id: "data-1",
        type: "data",
        position: { x: centerX + 200, y: startY },
        data: { label: "Training Data" },
      });

      // Connect inputs to trigger
      generatedEdges.push({
        id: "e-input-trigger",
        source: "input-1",
        target: "trigger-1",
        targetHandle: Position.Left,
        type: "custom",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isDark ? "#4ade80" : "#22c55e",
        },
        style: {
          stroke: isDark ? "#4ade80" : "#22c55e",
          strokeWidth: 2,
        },
        data: { label: "Score Input" },
      });

      generatedEdges.push({
        id: "e-data-trigger",
        source: "data-1",
        target: "trigger-1",
        targetHandle: Position.Right,
        type: "custom",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isDark ? "#818cf8" : "#6366f1",
        },
        style: {
          stroke: isDark ? "#818cf8" : "#6366f1",
          strokeWidth: 2,
        },
        data: { label: "Training Data" },
      });
    }

    // Add property/config node
    generatedNodes.push({
      id: "property-1",
      type: "property",
      position: { x: centerX + 250, y: startY + verticalSpacing },
      data: { label: "Rule Config" },
    });

    let lastNodeId = "trigger-1";
    let currentY = startY + verticalSpacing;

    // Add condition nodes if any
    if (config?.conditions && config.conditions.length > 0) {
      config.conditions.forEach((condition: any, index: number) => {
        const conditionId = `condition-${index + 1}`;
        currentY += verticalSpacing;

        generatedNodes.push({
          id: conditionId,
          type: "condition",
          position: { x: centerX, y: currentY },
          data: { label: condition.label || `Check ${condition.field || "Condition"}` },
        });

        // Add input node for condition parameters
        if (index === 0) {
          generatedNodes.push({
            id: `input-condition-${index + 1}`,
            type: "input",
            position: { x: centerX - 200, y: currentY },
            data: { label: "Threshold Value" },
          });

          generatedEdges.push({
            id: `e-input-condition-${index + 1}`,
            source: `input-condition-${index + 1}`,
            target: conditionId,
            animated: true,
            style: { stroke: isDark ? "#4ade80" : "#22c55e" },
          });
        }

        // Connect from last node to condition
        generatedEdges.push({
          id: `e-${lastNodeId}-${conditionId}`,
          source: lastNodeId,
          sourceHandle: lastNodeId === "trigger-1" ? "bottom" : "true",
          target: conditionId,
          targetHandle: Position.Top,
          type: "custom",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: isDark ? "#f59e0b" : "#f97316",
          },
          style: {
            stroke: isDark ? "#f59e0b" : "#f97316",
            strokeWidth: 2,
          },
        });

        // Connect property to condition
        generatedEdges.push({
          id: `e-property-${conditionId}`,
          source: "property-1",
          sourceHandle: Position.Left,
          target: conditionId,
          targetHandle: "left",
          type: "custom",
          animated: false,
          style: {
            stroke: isDark ? "#6b7280" : "#9ca3af",
            strokeDasharray: "5 5",
            strokeWidth: 2,
          },
          data: { label: "Config" },
        });

        lastNodeId = conditionId;
      });
    }

    // Add action nodes with better layout
    const actions = config?.actions || [{ type: "notify", label: isTeamRule ? rule.message : "Default Action" }];
    if (actions.length === 1) {
      // Single action - center it
      currentY += verticalSpacing;
      const actionId = "action-1";

      generatedNodes.push({
        id: actionId,
        type: "action",
        position: { x: centerX, y: currentY },
        data: { label: actions[0].label || actions[0].type || "Execute Action" },
      });

      generatedEdges.push({
        id: `e-${lastNodeId}-${actionId}`,
        source: lastNodeId,
        sourceHandle: lastNodeId.includes("condition") ? "true" : "bottom",
        target: actionId,
        targetHandle: Position.Top,
        type: "custom",
        animated: true,
        markerEnd: {
          type: MarkerType.ArrowClosed,
          width: 20,
          height: 20,
          color: isDark ? "#60a5fa" : "#3b82f6",
        },
        style: {
          stroke: isDark ? "#60a5fa" : "#3b82f6",
          strokeWidth: 2,
        },
        data: { label: "Execute" },
      });
    } else {
      // Multiple actions - spread them horizontally
      currentY += verticalSpacing;
      const actionSpacing = 200;
      const startX = centerX - ((actions.length - 1) * actionSpacing) / 2;

      actions.forEach((action: any, index: number) => {
        const actionId = `action-${index + 1}`;

        generatedNodes.push({
          id: actionId,
          type: "action",
          position: { x: startX + index * actionSpacing, y: currentY },
          data: { label: action.label || action.type || `Action ${index + 1}` },
        });

        // For multiple actions from conditions, use different source handles
        const sourceHandle = lastNodeId.includes("condition") ? (index === 0 ? "true" : "false") : "bottom";

        generatedEdges.push({
          id: `e-${lastNodeId}-${actionId}`,
          source: lastNodeId,
          sourceHandle: sourceHandle,
          target: actionId,
          targetHandle: Position.Top,
          type: "custom",
          animated: true,
          markerEnd: {
            type: MarkerType.ArrowClosed,
            width: 20,
            height: 20,
            color: sourceHandle === "false" ? "#ef4444" : isDark ? "#60a5fa" : "#3b82f6",
          },
          style: {
            stroke: sourceHandle === "false" ? "#ef4444" : isDark ? "#60a5fa" : "#3b82f6",
            strokeWidth: 2,
          },
          data: { label: sourceHandle === "false" ? "On Fail" : "Execute" },
        });
      });
    }

    return { nodes: generatedNodes, edges: generatedEdges };
  }, [selectedRuleId, templates, teamRules, isDark]);

  const onConnect = useCallback(() => {
    // Prevent new connections in view mode
    return;
  }, []);

  return (
    <div className="w-full h-full flex flex-col">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        nodeTypes={nodeTypes}
        edgeTypes={edgeTypes}
        onConnect={onConnect}
        connectionMode={ConnectionMode.Loose}
        fitView
        fitViewOptions={{
          padding: 0.4,
          includeHiddenNodes: false,
          minZoom: 0.5,
          maxZoom: 1.5,
        }}
        defaultViewport={{ x: 0, y: 0, zoom: 0.8 }}
        proOptions={{ hideAttribution: true }}
        className={`flex-1 ${isDark ? "bg-[#0F0F11]" : "bg-gray-50"}`}
        connectionLineStyle={{
          stroke: isDark ? "#6366f1" : "#8b5cf6",
          strokeWidth: 2,
        }}
        defaultEdgeOptions={{
          type: "custom",
          animated: true,
        }}
      >
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={isDark ? "#1f2937" : "#e5e7eb"} />
        <MiniMap
          maskColor={isDark ? "rgba(0, 0, 0, 0.8)" : "rgba(255, 255, 255, 0.8)"}
          nodeColor={(node) => {
            switch (node.type) {
              case "trigger":
                return "#a855f7";
              case "condition":
                return "#f59e0b";
              case "action":
                return "#3b82f6";
              case "input":
                return "#14b8a6";
              case "property":
                return "#6b7280";
              case "data":
                return "#6366f1";
              default:
                return "#6b7280";
            }
          }}
          pannable
          zoomable
        />
        <Controls showInteractive={false} />
      </ReactFlow>

      {/* No Rule Selected State */}
      {!selectedRuleId && (
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="text-center">
            <div className={`p-6 rounded-full mb-4 inline-block ${isDark ? "bg-gray-800" : "bg-gray-100"}`}>
              <FaBolt className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold mb-2 text-gray-600 dark:text-gray-400">No Rule Selected</h3>
            <p className="text-sm text-gray-500 max-w-xs">Select a rule from the left panel to visualize its flow</p>
          </div>
        </div>
      )}
    </div>
  );
}
