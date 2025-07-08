import { TrainingStatus } from "@/types/training";
import { Clock, PlayCircle, CheckCircle2, XCircle } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type TrainingPageStatusProps = {
  status: TrainingStatus;
  date: string;
};

export default function TrainingPageStatus({ status, date }: TrainingPageStatusProps) {
  const { theme } = useTheme();

  const statusConfig = {
    [TrainingStatus.Scheduled]: {
      icon: Clock,
      color: theme === "dark" ? "text-blue-400" : "text-blue-600",
      bgColor: theme === "dark" ? "bg-blue-400/10" : "bg-blue-100",
      label: "Scheduled",
      description: "Training session is scheduled for",
    },
    [TrainingStatus.InProgress]: {
      icon: PlayCircle,
      color: theme === "dark" ? "text-green-400" : "text-green-600",
      bgColor: theme === "dark" ? "bg-green-400/10" : "bg-green-100",
      label: "In Progress",
      description: "Training session is currently active",
    },
    [TrainingStatus.Completed]: {
      icon: CheckCircle2,
      color: theme === "dark" ? "text-purple-400" : "text-purple-600",
      bgColor: theme === "dark" ? "bg-purple-400/10" : "bg-purple-100",
      label: "Completed",
      description: "Training session has been completed",
    },
    [TrainingStatus.Canceled]: {
      icon: XCircle,
      color: theme === "dark" ? "text-red-400" : "text-red-600",
      bgColor: theme === "dark" ? "bg-red-400/10" : "bg-red-100",
      label: "Canceled",
      description: "Training session has been canceled",
    },
  };

  const config = statusConfig[status as keyof typeof statusConfig];
  const Icon = config.icon;

  return (
    <div className={`flex items-center gap-3 p-3 rounded-lg transition-colors duration-200 ${config.bgColor}`}>
      <div className={`p-2 rounded-full ${config.bgColor}`}>
        <Icon className={`w-5 h-5 ${config.color}`} />
      </div>
      <div>
        <div className="flex items-center gap-2">
          <span className={`text-sm font-medium ${config.color}`}>{config.label}</span>
          {status === TrainingStatus.Scheduled && (
            <span className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {new Date(date).toLocaleDateString()}
            </span>
          )}
        </div>
        <p className={`text-xs transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{config.description}</p>
      </div>
    </div>
  );
}
