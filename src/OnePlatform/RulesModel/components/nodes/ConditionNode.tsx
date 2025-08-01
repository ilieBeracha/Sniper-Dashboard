import { Handle, Position } from "@xyflow/react";
import { FaCodeBranch } from "react-icons/fa";

export default function ConditionNode({ data }: { data: any }) {
  return (
    <div className="bg-amber-500 text-white rounded-lg p-4 min-w-[140px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <FaCodeBranch className="w-3 h-3" />
        <span className="text-xs font-medium">{data.label || "Condition"}</span>
      </div>
      <Handle type="source" position={Position.Bottom} id="true" style={{ left: "30%" }} />
      <Handle type="source" position={Position.Bottom} id="false" style={{ left: "70%" }} />
    </div>
  );
}
