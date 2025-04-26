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
import { AlertCircle, CheckCircle2 } from "lucide-react";
import { Shield } from "lucide-react";

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
    <>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 ">
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

              <div className="grid grid-cols-2 gap-4">
                <div className="bg-[#1A1A1A] px-3 py-6 h-full rounded-lg text-center">
                  <div className="text-2xl font-medium text-indigo-400">
                    {training?.assignments_trainings && training?.assignments_trainings?.length}
                  </div>
                  <div className="text-xs text-gray-400">Assignments</div>
                </div>
                <div className="bg-[#1A1A1A] px-3 py-6 h-full rounded-lg text-center">
                  <div className="text-2xl font-medium text-green-400">{training?.participants && training?.participants?.length}</div>
                  <div className="text-xs text-gray-400">Participants</div>
                </div>
              </div>
            </div>
          </BaseDashboardCard>
        </div>
        <div className="lg:col-span-1">
          <BaseDashboardCard title="Training Readiness" tooltipContent="Check your preparation status for this training session">
            <div className="space-y-1">
              {/* Preparation Status */}
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500/10 to-emerald-500/10 rounded-lg blur-xl"></div>
                <div className="relative p-4 bg-gradient-to-br from-[#1A1A1A] to-[#222] rounded-lg border border-white/5">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-sm font-medium text-gray-300">Your Preparation</h3>
                    <div className="px-2 py-1 bg-green-500/20 rounded-full flex justify-center items-center">
                      <span className="text-xs text-green-400">Ready</span>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-400">Tasks Completed</span>
                      <span className="text-sm font-medium text-white">4/5</span>
                    </div>
                    <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                      <div className="h-full w-4/5 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full"></div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Checklist */}

              {/* Safety & Requirements */}
              <div className="p-3 bg-[#1A1A1A] rounded-lg border border-white/5">
                <div className="flex items-center gap-2 mb-3">
                  <Shield className="w-4 h-4 text-blue-400" />
                  <span className="text-sm font-medium text-gray-300">Safety Requirements</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Safety gear checked</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle2 className="w-4 h-4 text-green-400" />
                    <span className="text-sm text-gray-300">Medical clearance</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <AlertCircle className="w-4 h-4 text-yellow-400" />
                    <span className="text-sm text-gray-300">Weather check pending</span>
                  </div>
                </div>
              </div>

              {/* Action Button */}
              {isCommander(userRole) && (
                <button className="w-full px-4 py-2 bg-gradient-to-r from-green-500/20 to-emerald-500/20 hover:from-green-500/30 hover:to-emerald-500/30 text-green-400 rounded-lg text-sm flex items-center justify-center gap-2 transition-colors">
                  <Shield className="w-4 h-4" />
                  <span>Manage Safety Requirements</span>
                </button>
              )}
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
