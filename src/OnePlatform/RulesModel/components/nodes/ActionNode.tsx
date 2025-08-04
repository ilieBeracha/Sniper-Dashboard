import { Handle, Position } from "@xyflow/react";
import { BiSolidZap } from "react-icons/bi";
import { FaPaperPlane, FaBell, FaDatabase, FaCode, FaPlay } from "react-icons/fa";

interface ActionNodeProps {
  data: {
    label: string;
    actionType?: string;
  };
}

export default function ActionNode({ data }: ActionNodeProps) {
  const actionConfig = {
    send: { icon: FaPaperPlane, color: "bg-blue-500" },
    notify: { icon: FaBell, color: "bg-yellow-500" },
    update: { icon: FaDatabase, color: "bg-purple-500" },
    execute: { icon: FaCode, color: "bg-gray-500" },
    trigger: { icon: FaPlay, color: "bg-green-500" },
    default: { icon: BiSolidZap, color: "bg-emerald-500" },
  };

  const config = actionConfig[data.actionType as keyof typeof actionConfig] || actionConfig.default;
  const Icon = config.icon;

  return (
    <div className="relative group">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-sm border border-gray-200 dark:border-gray-700 p-3 min-w-[140px] hover:shadow-md transition-shadow">
        <div className="flex items-center gap-2">
          <div className={`${config.color} p-1.5 rounded`}>
            <Icon className="w-3 h-3 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-xs font-semibold text-gray-900 dark:text-gray-100 truncate">
              {data.label}
            </p>
            <p className="text-[10px] text-gray-500 dark:text-gray-400">
              Action
            </p>
          </div>
        </div>
      </div>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-2 !h-2 !bg-emerald-500 !border-2 !border-white dark:!border-gray-800"
      />
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-gray-400 !border-2 !border-white dark:!border-gray-800 opacity-50"
      />
    </div>
  );
}
