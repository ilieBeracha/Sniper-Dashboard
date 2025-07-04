import { TrainingStatus } from "@/types/training";
import BaseButton from "./BaseButton";
import { useTheme } from "@/contexts/ThemeContext";

type TrainingStatusButtonsProps = {
  currentStatus: TrainingStatus;
  onStatusChange: (status: TrainingStatus) => void;
};

export default function TrainingStatusButtons({ currentStatus, onStatusChange }: TrainingStatusButtonsProps) {
  const { theme } = useTheme();
  const mainStatuses = [TrainingStatus.Scheduled, TrainingStatus.InProgress, TrainingStatus.Completed];
  const cancelStatus = TrainingStatus.Canceled;

  const getStatusColor = (status: TrainingStatus) => {
    const colors = {
      [TrainingStatus.Scheduled]:
        theme === "dark" ? "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400" : "bg-blue-100 hover:bg-blue-200 text-blue-700",
      [TrainingStatus.InProgress]:
        theme === "dark" ? "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400" : "bg-yellow-100 hover:bg-yellow-200 text-yellow-700",
      [TrainingStatus.Completed]:
        theme === "dark" ? "bg-green-500/20 hover:bg-green-500/30 text-green-400" : "bg-green-100 hover:bg-green-200 text-green-700",
      [TrainingStatus.Canceled]: theme === "dark" ? "bg-red-500/20 hover:bg-red-500/30 text-red-400" : "bg-red-100 hover:bg-red-200 text-red-700",
    };
    return colors[status];
  };

  const statusConfig = {
    [TrainingStatus.Scheduled]: { displayName: "SCHEDULED" },
    [TrainingStatus.InProgress]: { displayName: "IN PROGRESS" },
    [TrainingStatus.Completed]: { displayName: "COMPLETED" },
    [TrainingStatus.Canceled]: { displayName: "CANCELED" },
  };

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        {mainStatuses.map((status) => (
          <BaseButton
            key={status}
            type="button"
            onClick={() => onStatusChange(status)}
            disabled={status === currentStatus}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              status === currentStatus ? "opacity-50 cursor-not-allowed" : getStatusColor(status)
            }`}
          >
            {statusConfig[status].displayName}
          </BaseButton>
        ))}
      </div>
      <BaseButton
        type="button"
        onClick={() => onStatusChange(cancelStatus)}
        disabled={cancelStatus === currentStatus}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          cancelStatus === currentStatus ? "opacity-50 cursor-not-allowed" : getStatusColor(cancelStatus)
        }`}
      >
        {statusConfig[cancelStatus].displayName}
      </BaseButton>
    </div>
  );
}
