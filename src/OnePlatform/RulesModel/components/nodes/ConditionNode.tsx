import { Handle, Position } from "@xyflow/react";
import { FaCodeBranch } from "react-icons/fa";

interface ConditionNodeProps {
  data: {
    label: string;
  };
}

export default function ConditionNode({ data }: ConditionNodeProps) {
  return (
    <div className="relative group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 min-w-[120px] hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2 mb-2">
          <div className="bg-amber-500 p-1.5 rounded">
            <FaCodeBranch className="w-3 h-3 text-white" />
          </div>
          <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
            {data.label}
          </p>
        </div>
        <div className="flex justify-between text-[10px] text-gray-500 dark:text-gray-400">
          <span>✓ Yes</span>
          <span>✗ No</span>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-amber-500 !border-2 !border-white dark:!border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="true"
        style={{ left: "25%" }}
        className="!w-2 !h-2 !bg-emerald-500 !border-2 !border-white dark:!border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        id="false"
        style={{ left: "75%" }}
        className="!w-2 !h-2 !bg-red-500 !border-2 !border-white dark:!border-gray-800"
      />
    </div>
  );
}
