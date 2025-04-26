import { TrainingStatus } from "@/types/training";
import { Clock, PlayCircle, CheckCircle2, XCircle } from "lucide-react";

type TrainingPageStatusProps = {
  status: TrainingStatus;
  date: string;
};

export default function TrainingPageStatus({ status, date }: TrainingPageStatusProps) {
  const statusConfig = {
    [TrainingStatus.Scheduled]: {
      icon: Clock,
      color: "text-blue-400",
      bgColor: "bg-blue-400/10",
      label: "Scheduled",
      description: "Training session is scheduled for",
    },
    [TrainingStatus.InProgress]: {
      icon: PlayCircle,
      color: "text-green-400",
      bgColor: "bg-green-400/10",
      label: "In Progress",
      description: "Training session is currently active",
    },
    [TrainingStatus.Completed]: {
      icon: CheckCircle2,
      color: "text-purple-400",
      bgColor: "bg-purple-400/10",
      label: "Completed",
      description: "Training session has been completed",
    },
    [TrainingStatus.Canceled]: {
      icon: XCircle,
      color: "text-red-400",
      bgColor: "bg-red-400/10",
      label: "Canceled",
      description: "Training session has been canceled",
    },
  };

  const config = statusConfig[status];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg ${config.bgColor}`}>
      <div className={`p-2 rounded-full ${config.bgColor}`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
          {status === TrainingStatus.Scheduled && <span className="text-xs text-gray-400">{new Date(date).toLocaleDateString()}</span>}
        </div>
        <p className="text-xs text-gray-400">{config.description}</p>
      </div>
    </div>
  );
}
