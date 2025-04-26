import { useState } from "react";
import BaseDashboardCard from "./BaseDashboardCard";
import { TrainingSession } from "@/types/training";
import TrainingPageStatus from "./TrainingPageStatus";
import EditTrainingSessionModal from "./EditTrainingSessionModal";
import { useStore } from "zustand";
import { teamStore } from "@/store/teamStore";
import { TrainingStore } from "@/store/trainingStore";

type TrainingPageOverviewProps = {
  training: TrainingSession | null;
};

export default function TrainingPageOverview({ training }: TrainingPageOverviewProps) {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const { members } = useStore(teamStore);
  const { loadTrainingById } = useStore(TrainingStore);
  const { assignments } = useStore(TrainingStore);

  const handleEditSuccess = () => {
    if (training?.id) {
      loadTrainingById(training.id);
    }
  };

  return (
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <BaseDashboardCard title="Training Overview" tooltipContent="Detailed information about the current training session">
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <h3 className="text-xl font-semibold">{training?.session_name}</h3>
                  <p className="text-sm text-gray-400">Session #{training?.id}</p>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => setIsEditModalOpen(true)} className="px-3 py-1.5 bg-white/10 hover:bg-white/20 rounded-md text-xs">
                    Edit Training
                  </button>
                </div>
              </div>

              {training && <TrainingPageStatus status={training.status} date={training.date} />}

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1A1A] px-3 py-6 rounded-lg text-center">
                  <div className="text-lg font-medium text-indigo-400">
                    {training?.training_assignments && training?.training_assignments?.length}
                  </div>
                  <div className="text-xs text-gray-400">Assignments</div>
                </div>
                <div className="bg-[#1A1A1A] px-3 py-6 rounded-lg text-center">
                  <div className="text-lg font-medium text-green-400">{training?.participants && training?.participants?.length}</div>
                  <div className="text-xs text-gray-400">Participants</div>
                </div>
              </div>
            </div>
          </BaseDashboardCard>
        </div>
        <div className="lg:col-span-1">
          <BaseDashboardCard title="Quick Actions" tooltipContent="Common actions for this training session">
            <div className="space-y-3">
              <button className="w-full px-4 py-2 bg-[#1A1A1A] hover:bg-[#222] rounded-lg text-sm flex items-center justify-between">
                <span>Add Assignment</span>
                <span className="text-gray-400">+</span>
              </button>
              <button className="w-full px-4 py-2 bg-[#1A1A1A] hover:bg-[#222] rounded-lg text-sm flex items-center justify-between">
                <span>Invite Participants</span>
                <span className="text-gray-400">+</span>
              </button>
              <button className="w-full px-4 py-2 bg-[#1A1A1A] hover:bg-[#222] rounded-lg text-sm flex items-center justify-between">
                <span>Schedule Session</span>
                <span className="text-gray-400">+</span>
              </button>
            </div>
          </BaseDashboardCard>
        </div>
      </div>

      <EditTrainingSessionModal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        onSuccess={handleEditSuccess}
        teamMembers={members}
        assignments={assignments}
        training={training}
      />
    </>
  );
}
