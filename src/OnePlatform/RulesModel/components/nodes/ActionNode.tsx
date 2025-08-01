import { Handle, Position } from "@xyflow/react";
import { BiSolidZap } from "react-icons/bi";

export default function ActionNode({ data }: { data: any }) {
  return (
    <div className="bg-blue-500 text-white rounded-lg p-4 min-w-[140px]">
      <Handle type="target" position={Position.Top} />
      <div className="flex items-center gap-2">
        <BiSolidZap className="w-3 h-3" />
        <span className="text-xs font-medium">{data.label || "Action"}</span>
      </div>
      <Handle type="source" position={Position.Bottom} />
    </div>
  );
}
