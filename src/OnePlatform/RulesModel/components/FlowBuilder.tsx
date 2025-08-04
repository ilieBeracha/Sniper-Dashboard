import { generateFlowFromConfig } from "@/OnePlatform/RulesModel/utils/generateFlowFromConfig";
import { useRuleStore } from "../store/ruleStore";
import { BackgroundVariant, Background, Controls, ReactFlow, ReactFlowProvider } from "@xyflow/react";
import TriggerNode from "./nodes/TriggerNode";
import ConditionNode from "./nodes/ConditionNode";
import ActionNode from "./nodes/ActionNode";
import "@xyflow/react/dist/style.css";
import { applyDagreLayout, centerNodes } from "@/OnePlatform/RulesModel/utils/applyDagreLayout";

export default function FlowBuilder({ selectedRuleId, overrideLogic }: { selectedRuleId: string; overrideLogic?: any }) {
  const { definitions, actions, executions } = useRuleStore();
  const def = definitions.find((d) => d.id === selectedRuleId);
  const acts = actions[selectedRuleId] || [];
  const execs = executions[selectedRuleId] || [];

  if (!def) {
    return (
      <div className="h-full w-full flex items-center justify-center" style={{ minHeight: "500px" }}>
        <div className="text-center p-8">
          <p className="text-gray-500 dark:text-gray-400 mb-4">No rule selected. Create or select a rule to define conditions and actions.</p>
          <div className="text-sm text-gray-400 dark:text-gray-500">Flow builder will appear here once a rule is created.</div>
        </div>
      </div>
    );
  }

  const mergedDef = overrideLogic !== undefined ? { ...def, logic: overrideLogic } : def;

  const { nodes, edges, labelFromLogic } = generateFlowFromConfig(mergedDef, acts, execs) as any;

  const { nodes: layoutNodes, edges: layoutEdges } = applyDagreLayout(nodes, edges);
  const centeredNodes = centerNodes(layoutNodes);

  const nodeTypes = {
    trigger: TriggerNode,
    condition: ConditionNode,
    action: ActionNode,
  } as const;

  // friendly textual summary of logic
  const summaryItems: string[] = [];
  if (Array.isArray(mergedDef.logic?.and)) {
    summaryItems.push("All of these must be true:");
    mergedDef.logic.and.forEach((c: any) => summaryItems.push(labelFromLogic(c)));
  } else if (Array.isArray(mergedDef.logic?.or)) {
    summaryItems.push("Any of these can be true:");
    mergedDef.logic.or.forEach((c: any) => summaryItems.push(labelFromLogic(c)));
  }

  return (
    <ReactFlowProvider>
      <div className="h-full w-full flex flex-col" style={{ minHeight: "500px" }}>
        {summaryItems.length > 0 && (
          <div className="mb-2 bg-gray-100 dark:bg-gray-800/40 p-2 rounded-lg text-xs text-gray-800 dark:text-gray-200 max-h-28 overflow-auto">
            {summaryItems.map((s, i) => (
              <div key={i}>{s}</div>
            ))}
          </div>
        )}
        <div className="flex-1">
          <ReactFlow nodes={centeredNodes} edges={layoutEdges} fitView nodeTypes={nodeTypes}>
            <Background variant={BackgroundVariant.Dots} />
            <Controls
              style={{
                background: "#000",
                border: "1px solid #222",
              }}
              className="[&_button]:!bg-black [&_button]:!text-white [&_button]:!border-gray-700 [&_button]:hover:!bg-gray-800"
            />
          </ReactFlow>
        </div>
      </div>
    </ReactFlowProvider>
  );
}
