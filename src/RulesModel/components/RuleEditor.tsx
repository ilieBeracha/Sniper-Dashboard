import { useState, useCallback, useMemo, useEffect } from "react";
import {
  ReactFlow,
  ReactFlowProvider,
  Node,
  Edge,
  Connection,
  useNodesState,
  useEdgesState,
  addEdge,
  Background,
  BackgroundVariant,
  Controls,
  Panel,
  Handle,
  Position,
  MarkerType,
  NodeToolbar,
  getBezierPath,
  EdgeProps,
  applyNodeChanges,
  applyEdgeChanges,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { useTheme } from "@/contexts/ThemeContext";
import { useRuleStore } from "../store/ruleStore";
import { RuleTemplate, TeamRule } from "../type";
import NodeConfigPanel from "./RuleEditor/NodeConfigPanel";

// Node Components
const TriggerNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <NodeToolbar isVisible={selected} position={Position.Top}>
        <button className="px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700">
          Edit Trigger
        </button>
      </NodeToolbar>
      <div
        className={`
        px-8 py-6 rounded-xl shadow-lg border-2 min-w-[240px] transition-all
        ${
          selected
            ? isDark
              ? "border-blue-500 shadow-blue-500/20"
              : "border-blue-600 shadow-blue-600/20"
            : isDark
              ? "border-blue-600/30"
              : "border-blue-500/30"
        }
        ${isDark ? "bg-gray-800" : "bg-white"}
      `}
      >
        <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-blue-500 !border-2 !border-white" />
        <div className="text-center">
          <div className={`text-sm font-medium uppercase tracking-wider mb-2 ${isDark ? "text-blue-400" : "text-blue-600"}`}>
            {data.triggerType || "Trigger"}
          </div>
          <div className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{data.label}</div>
          {data.description && <div className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{data.description}</div>}
        </div>
      </div>
    </>
  );
};

const ConditionNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <NodeToolbar isVisible={selected} position={Position.Top}>
        <button className="px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700">
          Configure Condition
        </button>
      </NodeToolbar>
      <div
        className={`
        relative transform rotate-45 w-32 h-32 shadow-lg border-2 transition-all
        ${
          selected
            ? isDark
              ? "border-amber-500 shadow-amber-500/20"
              : "border-amber-600 shadow-amber-600/20"
            : isDark
              ? "border-amber-600/30"
              : "border-amber-500/30"
        }
        ${isDark ? "bg-gray-800" : "bg-white"}
      `}
      >
        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !bg-amber-500 !border-2 !border-white !-top-1.5 !left-1/2 !-translate-x-1/2"
          style={{ transform: "rotate(-45deg) translateX(-50%)" }}
        />
        <div className="absolute inset-0 flex items-center justify-center -rotate-45">
          <div className="text-center p-3">
            <div className={`text-sm font-medium uppercase tracking-wider ${isDark ? "text-amber-400" : "text-amber-600"}`}>
              {data.operator || "If"}
            </div>
            <div className={`text-sm font-semibold mt-1 ${isDark ? "text-gray-100" : "text-gray-900"}`}>{data.label}</div>
          </div>
        </div>
        <Handle
          type="source"
          position={Position.Right}
          id="true"
          className="!w-3 !h-3 !bg-green-500 !border-2 !border-white !top-1/2 !-right-1.5"
          style={{ transform: "rotate(-45deg) translateY(-50%)" }}
        />
        <Handle
          type="source"
          position={Position.Bottom}
          id="false"
          className="!w-3 !h-3 !bg-red-500 !border-2 !border-white !-bottom-1.5 !left-1/2"
          style={{ transform: "rotate(-45deg) translateX(-50%)" }}
        />
      </div>
    </>
  );
};

const ActionNode = ({ data, selected }: { data: any; selected: boolean }) => {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  return (
    <>
      <NodeToolbar isVisible={selected} position={Position.Top}>
        <button className="px-2 py-1 text-xs bg-white dark:bg-gray-800 rounded shadow-lg border border-gray-200 dark:border-gray-700">
          Configure Action
        </button>
      </NodeToolbar>
      <div
        className={`
        px-8 py-6 rounded-xl shadow-lg border-2 min-w-[240px] transition-all
        ${
          selected
            ? isDark
              ? "border-green-500 shadow-green-500/20"
              : "border-green-600 shadow-green-600/20"
            : isDark
              ? "border-green-600/30"
              : "border-green-500/30"
        }
        ${isDark ? "bg-gray-800" : "bg-white"}
      `}
      >
        <Handle type="target" position={Position.Top} className="!w-3 !h-3 !bg-green-500 !border-2 !border-white" />
        <Handle type="source" position={Position.Bottom} className="!w-3 !h-3 !bg-green-500 !border-2 !border-white" />
        <div className="text-center">
          <div className={`text-sm font-medium uppercase tracking-wider mb-2 ${isDark ? "text-green-400" : "text-green-600"}`}>
            {data.actionType || "Action"}
          </div>
          <div className={`text-base font-semibold ${isDark ? "text-gray-100" : "text-gray-900"}`}>{data.label}</div>
          {data.parameters && (
            <div className={`text-sm mt-2 ${isDark ? "text-gray-400" : "text-gray-600"}`}>{Object.keys(data.parameters).length} parameters</div>
          )}
        </div>
      </div>
    </>
  );
};

const nodeTypes = {
  trigger: TriggerNode,
  condition: ConditionNode,
  action: ActionNode,
};

// Custom Edge
const CustomEdge = ({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  selected,
  data,
}: EdgeProps & { selected?: boolean }) => {
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
      <path style={style} className="react-flow__edge-path" d={edgePath} markerEnd={markerEnd} strokeWidth={selected ? 3 : 2} />
      {data?.label && (
        <text>
          <textPath href={`#${edgePath}`} style={{ fontSize: 12 }} startOffset="50%" textAnchor="middle">
            {data.label}
          </textPath>
        </text>
      )}
    </>
  );
};

const edgeTypes = {
  custom: CustomEdge,
};

interface RuleEditorProps {
  ruleId?: string;
  templateId?: string;
  onClose: () => void;
  onSave: (ruleData: any) => void;
}

export default function RuleEditor({ ruleId, templateId, onClose, onSave }: RuleEditorProps) {
  const { theme } = useTheme();
  const isDark = theme === "dark";
  const { templates, teamRules } = useRuleStore();

  const [ruleName, setRuleName] = useState("");
  const [ruleDescription, setRuleDescription] = useState("");
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [ruleEnabled, setRuleEnabled] = useState(true);
  const [allowManualTrigger, setAllowManualTrigger] = useState(false);

  // Initialize nodes and edges
  const initialNodes: Node[] = [
    {
      id: "trigger",
      type: "trigger",
      position: { x: 400, y: 50 },
      data: {
        label: "Select Trigger",
        triggerType: "event",
        description: "Choose when this rule should activate",
      },
    },
  ];

  const initialEdges: Edge[] = [];

  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);

  // Load existing rule data if editing
  useEffect(() => {
    if (ruleId && teamRules) {
      const rule = teamRules.find((r) => r.id === ruleId);
      if (rule) {
        setRuleName(rule.message || "");
        setRuleEnabled(rule.enabled);
        // Load custom config into nodes/edges
        if (rule.custom_config) {
          // Parse and load the flow configuration
          const config = rule.custom_config;
          if (config.nodes) setNodes(config.nodes);
          if (config.edges) setEdges(config.edges);
        }
      }
    } else if (templateId && templates) {
      const template = templates.find((t) => t.id === templateId);
      if (template) {
        setRuleName(template.name);
        setRuleDescription(template.description);
        // Load template default config
        if (template.default_config) {
          const config = template.default_config;
          // Create initial flow based on template
          const newNodes: Node[] = [
            {
              id: "trigger",
              type: "trigger",
              position: { x: 400, y: 50 },
              data: {
                label: template.name,
                triggerType: template.trigger_type,
                description: template.description,
              },
            },
          ];

          if (config.conditions && config.conditions.length > 0) {
            newNodes.push({
              id: "condition-1",
              type: "condition",
              position: { x: 388, y: 200 },
              data: {
                label: config.conditions[0].label || "Condition",
                ...config.conditions[0],
              },
            });
          }

          if (config.actions && config.actions.length > 0) {
            config.actions.forEach((action: any, index: number) => {
              newNodes.push({
                id: `action-${index + 1}`,
                type: "action",
                position: { x: 400 + index * 150, y: 350 },
                data: {
                  label: action.label || action.type || "Action",
                  ...action,
                },
              });
            });
          }

          setNodes(newNodes);
        }
      }
    }
  }, [ruleId, templateId, teamRules, templates, setNodes, setEdges]);

  const onConnect = useCallback(
    (params: Connection) => {
      setEdges((eds) =>
        addEdge(
          {
            ...params,
            type: "custom",
            animated: true,
            style: { stroke: isDark ? "#6b7280" : "#9ca3af", strokeWidth: 2 },
            markerEnd: {
              type: MarkerType.ArrowClosed,
              width: 20,
              height: 20,
              color: isDark ? "#6b7280" : "#9ca3af",
            },
          },
          eds,
        ),
      );
    },
    [isDark, setEdges],
  );

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedNodeId(node.id);
  }, []);

  // Get selected node
  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId);
  }, [nodes, selectedNodeId]);

  // Update node data
  const updateNodeData = useCallback(
    (nodeId: string, data: any) => {
      setNodes((nds) =>
        nds.map((node) => {
          if (node.id === nodeId) {
            // Update the label based on the data
            let label = node.data.label;
            if (node.type === "trigger" && data.triggerType) {
              label = data.triggerType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
            } else if (node.type === "condition" && data.field) {
              label = `${data.field} ${data.operator || "equals"} ${data.value || ""}`.trim();
            } else if (node.type === "action" && data.actionType) {
              label = data.actionType.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
            }

            return {
              ...node,
              data: {
                ...node.data,
                ...data,
                label,
              },
            };
          }
          return node;
        }),
      );
    },
    [setNodes],
  );

  const addConditionNode = () => {
    const newNode: Node = {
      id: `condition-${Date.now()}`,
      type: "condition",
      position: { x: 388, y: 200 },
      data: {
        label: "New Condition",
        operator: "equals",
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  const addActionNode = () => {
    const newNode: Node = {
      id: `action-${Date.now()}`,
      type: "action",
      position: { x: 400, y: 350 },
      data: {
        label: "New Action",
        actionType: "notification",
        parameters: {},
      },
    };
    setNodes((nds) => nds.concat(newNode));
  };

  // Validate rule
  const validateRule = () => {
    if (!ruleName.trim()) {
      alert("Please enter a rule name");
      return false;
    }

    const triggerNode = nodes.find((n) => n.type === "trigger");
    if (!triggerNode || !triggerNode.data.triggerType || triggerNode.data.triggerType === "event") {
      alert("Please configure the trigger");
      return false;
    }

    const actionNodes = nodes.filter((n) => n.type === "action");
    if (actionNodes.length === 0) {
      alert("Please add at least one action");
      return false;
    }

    // Check if actions are connected
    const connectedNodeIds = new Set(edges.flatMap((e) => [e.source, e.target]));
    const unconnectedActions = actionNodes.filter((n) => !connectedNodeIds.has(n.id));
    if (unconnectedActions.length > 0) {
      alert("All actions must be connected to the flow");
      return false;
    }

    return true;
  };

  // Handle save
  const handleSave = () => {
    if (!validateRule()) {
      return;
    }

    // Extract rule configuration from nodes and edges
    const triggerNode = nodes.find((n) => n.type === "trigger");
    const conditionNodes = nodes.filter((n) => n.type === "condition");
    const actionNodes = nodes.filter((n) => n.type === "action");

    const ruleData = {
      name: ruleName,
      description: ruleDescription,
      enabled: ruleEnabled,
      allowManualTrigger,
      trigger: triggerNode?.data || {},
      conditions: conditionNodes.map((n) => n.data),
      actions: actionNodes.map((n) => n.data),
      flow: {
        nodes,
        edges,
      },
    };

    onSave(ruleData);
  };

  return (
    <ReactFlowProvider>
      <div className="fixed inset-0 z-50 flex bg-gray-900/50">
        <div className="flex-1 flex flex-col bg-white dark:bg-gray-900">
          {/* Header */}
          <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-gray-100">{ruleId ? "Edit Rule" : "Create New Rule"}</h2>
            <div className="flex items-center gap-3">
              <button
                onClick={onClose}
                className="px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 hover:text-gray-900 dark:hover:text-gray-100"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 text-sm font-medium bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
              >
                Save Rule
              </button>
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1 flex">
            {/* Flow Canvas - Larger */}
            <div className="flex-1 relative">
              <ReactFlow
                nodes={nodes}
                edges={edges}
                onNodesChange={onNodesChange}
                onEdgesChange={onEdgesChange}
                onConnect={onConnect}
                onNodeClick={onNodeClick}
                nodeTypes={nodeTypes}
                edgeTypes={edgeTypes}
                fitView
                className={isDark ? "bg-gray-950" : "bg-gray-50"}
              >
                <Background variant={BackgroundVariant.Dots} gap={20} size={1} color={isDark ? "#374151" : "#e5e7eb"} />
                <Controls className={isDark ? "!bg-gray-800 !border-gray-700" : "!bg-white !border-gray-200"} />

                {/* Toolbar */}
                <Panel position="top-left" className="flex gap-2">
                  <button
                    onClick={addConditionNode}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      isDark
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700"
                        : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                    } shadow-sm`}
                  >
                    + Add Condition
                  </button>
                  <button
                    onClick={addActionNode}
                    className={`px-4 py-2 text-sm font-medium rounded-lg transition-all ${
                      isDark
                        ? "bg-gray-800 hover:bg-gray-700 text-gray-100 border border-gray-700"
                        : "bg-white hover:bg-gray-50 text-gray-900 border border-gray-200"
                    } shadow-sm`}
                  >
                    + Add Action
                  </button>
                </Panel>
              </ReactFlow>
            </div>

            {/* Configuration Form - Right Side */}
            <div className={`w-96 border-l ${isDark ? "border-gray-800 bg-gray-900" : "border-gray-200 bg-white"} overflow-y-auto`}>
              <div className="p-6">
                {/* Basic Info */}
                <div className="mb-8">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Rule Information</h3>
                  <div className="space-y-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Rule Name</label>
                      <input
                        type="text"
                        value={ruleName}
                        onChange={(e) => setRuleName(e.target.value)}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Enter rule name"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                      <textarea
                        value={ruleDescription}
                        onChange={(e) => setRuleDescription(e.target.value)}
                        rows={3}
                        className={`w-full px-3 py-2 rounded-lg border ${
                          isDark ? "bg-gray-800 border-gray-700 text-gray-100" : "bg-white border-gray-300 text-gray-900"
                        } focus:outline-none focus:ring-2 focus:ring-blue-500`}
                        placeholder="Describe what this rule does"
                      />
                    </div>
                  </div>
                </div>

                {/* Node Configuration */}
                {selectedNode && (
                  <div className="mb-8">
                    <NodeConfigPanel
                      nodeId={selectedNode.id}
                      nodeType={selectedNode.type || "trigger"}
                      nodeData={selectedNode.data}
                      onUpdate={updateNodeData}
                    />
                  </div>
                )}

                {/* Advanced Settings */}
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4">Advanced Settings</h3>
                  <div className="space-y-4">
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Enable Rule</label>
                      <button
                        onClick={() => setRuleEnabled(!ruleEnabled)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          ruleEnabled ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            ruleEnabled ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                    <div className="flex items-center justify-between">
                      <label className="text-sm font-medium text-gray-700 dark:text-gray-300">Allow Manual Trigger</label>
                      <button
                        onClick={() => setAllowManualTrigger(!allowManualTrigger)}
                        className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${
                          allowManualTrigger ? "bg-blue-600" : "bg-gray-200 dark:bg-gray-700"
                        }`}
                      >
                        <span
                          className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                            allowManualTrigger ? "translate-x-6" : "translate-x-1"
                          }`}
                        />
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
