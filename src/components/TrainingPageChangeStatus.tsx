import { TrainingStatus } from "@/types/training";

import TrainingStatusButtons from "./TrainingStatusButtons";

import BaseDashboardCard from "./BaseDashboardCard";
import { TrainingSession } from "@/types/training";

export default function TrainingPageChangeStatus({
  training,
  onStatusChange,
}: {
  training: TrainingSession;
  onStatusChange: (status: TrainingStatus) => void;
}) {
  return (
    <BaseDashboardCard title="Training Status" tooltipContent="Change the status of this training session">
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <span className="text-sm text-gray-400">Current Status:</span>
          <span className="text-sm font-medium">{training?.status}</span>
        </div>
        <TrainingStatusButtons currentStatus={training?.status as TrainingStatus} onStatusChange={(status) => onStatusChange(status)} />
      </div>
    </BaseDashboardCard>
  );
}
