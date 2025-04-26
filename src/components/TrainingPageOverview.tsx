import { useState } from "react";
import BaseDashboardCard from "./BaseDashboardCard";
import { TrainingSession } from "@/types/training";
import TrainingPageStatus from "./TrainingPageStatus";
import EditTrainingSessionModal from "./EditTrainingSessionModal";
import { useStore } from "zustand";
import { teamStore } from "@/store/teamStore";
import { TrainingStore } from "@/store/trainingStore";
import { isCommander } from "@/utils/permissions";
import { userStore } from "@/store/userStore";
import TrainingStats from "./TrainingStats";

type TrainingPageOverviewProps = {
  training: TrainingSession | null;
};

export default function TrainingPageOverview({ training }: TrainingPageOverviewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { members } = useStore(teamStore);
  const { loadTrainingById } = useStore(TrainingStore);
  const { assignments } = useStore(TrainingStore);
  const { userRole } = useStore(userStore);

  const handleEditSuccess = () => {
    if (training?.id) {
      loadTrainingById(training.id);
    }
  };

  return (
    <BaseDashboardCard title="Training Overview" tooltipContent="Detailed information about the current training session">
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-xl font-semibold">{training?.session_name}</h3>
            <p className="text-sm text-gray-400">Session #{training?.id}</p>
          </div>
          <div className="flex gap-2">
            {isCommander(userRole) && (
              <button onClick={() => setIsEditModalOpen(true)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-xs">
                Edit Training
              </button>
            )}
          </div>
        </div>

        {training && <TrainingPageStatus status={training.status} date={training.date} />}

        <TrainingStats trainings={[training].filter(Boolean) as TrainingSession[]} />
        <EditTrainingSessionModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          onSuccess={handleEditSuccess}
          teamMembers={members}
          assignments={assignments}
          training={training}
        />
      </div>
    </BaseDashboardCard>
  );
}
