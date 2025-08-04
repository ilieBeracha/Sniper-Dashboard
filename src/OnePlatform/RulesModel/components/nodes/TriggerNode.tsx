import { Handle, Position } from "@xyflow/react";
import { FaBolt, FaClock, FaCheckCircle, FaExclamationTriangle, FaRobot } from "react-icons/fa";

interface TriggerNodeProps {
  data: {
    label: string;
    type: string;
  };
}

export default function TriggerNode({ data }: TriggerNodeProps) {
  const triggerConfig = {
    score_update: { icon: FaExclamationTriangle, color: "bg-amber-500" },
    schedule: { icon: FaClock, color: "bg-blue-500" },
    training_complete: { icon: FaCheckCircle, color: "bg-emerald-500" },
    automation: { icon: FaRobot, color: "bg-purple-500" },
    default: { icon: FaBolt, color: "bg-indigo-500" },
  };

  const config = triggerConfig[data.type as keyof typeof triggerConfig] || triggerConfig.default;
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
              Trigger
            </p>
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-2 !h-2 !bg-indigo-500 !border-2 !border-white dark:!border-gray-800"
      />
    </div>
  );
}
