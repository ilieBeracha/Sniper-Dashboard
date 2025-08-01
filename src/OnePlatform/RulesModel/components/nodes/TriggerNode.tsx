import { Handle, Position } from "@xyflow/react";
import { FaBolt } from "react-icons/fa";

export default function TriggerNode({ data }: { data: any }) {
  return (
    <div className="bg-purple-500 text-white rounded-lg p-4 min-w-[140px]">
      <Handle type="target" position={Position.Left} />
      <div className="flex items-center gap-2">
        <FaBolt className="w-3 h-3" />
        <span className="text-xs font-medium">{data.label || "Trigger"}</span>
      </div>
      <Handle type="source" position={Position.Right} />
    </div>
  );
}
