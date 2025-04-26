import { TrainingStatus } from "@/types/training";

type TrainingStatusButtonsProps = {
  currentStatus: TrainingStatus;
  onStatusChange: (status: TrainingStatus) => void;
};

const statusConfig = {
  [TrainingStatus.Scheduled]: {
    color: "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400",
    displayName: "SCHEDULED",
  },
  [TrainingStatus.InProgress]: {
    color: "bg-yellow-500/20 hover:bg-yellow-500/30 text-yellow-400",
    displayName: "IN PROGRESS",
  },
  [TrainingStatus.Completed]: {
    color: "bg-green-500/20 hover:bg-green-500/30 text-green-400",
    displayName: "COMPLETED",
  },
  [TrainingStatus.Canceled]: {
    color: "bg-red-500/20 hover:bg-red-500/30 text-red-400",
    displayName: "CANCELED",
  },
};

export default function TrainingStatusButtons({ currentStatus, onStatusChange }: TrainingStatusButtonsProps) {
  const mainStatuses = [TrainingStatus.Scheduled, TrainingStatus.InProgress, TrainingStatus.Completed];
  const cancelStatus = TrainingStatus.Canceled;

  return (
    <div className="flex justify-between items-center">
      <div className="flex gap-2">
        {mainStatuses.map((status) => (
          <button
            key={status}
            onClick={() => onStatusChange(status)}
            disabled={status === currentStatus}
            className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
              status === currentStatus ? "opacity-50 cursor-not-allowed" : statusConfig[status].color
            }`}
          >
            {statusConfig[status].displayName}
          </button>
        ))}
      </div>
      <button
        onClick={() => onStatusChange(cancelStatus)}
        disabled={cancelStatus === currentStatus}
        className={`px-3 py-1.5 rounded-md text-xs font-medium transition-colors ${
          cancelStatus === currentStatus ? "opacity-50 cursor-not-allowed" : statusConfig[cancelStatus].color
        }`}
      >
        {statusConfig[cancelStatus].displayName}
      </button>
    </div>
  );
}
