import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import TrainingPageOverview from "@/components/TrainingPageOverview";
import TrainingPageAssignments from "@/components/TrainingPageAssignments";
import TrainingPageParticipants from "@/components/TrainingPageParticipants";
import TrainingPageParticipantsScore from "@/components/TrainingPageParticipantsScore";
import BaseDashboardCard from "@/components/BaseDashboardCard";
import { TrainingStatus } from "@/types/training";
import { isCommander } from "@/utils/permissions";
import { userStore } from "@/store/userStore";
import TrainingStatusButtons from "@/components/TrainingStatusButtons";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import { supabase } from "@/services/supabaseClient";

export default function TrainingPage() {
  const params = useParams();
  const { id } = params;
  const { training, loadTrainingById, loadAssignments } = useStore(TrainingStore);
  const { userRole } = useStore(userStore);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);

  useEffect(() => {
    loadAssignments();
    loadTrainingById(id as string);
  }, [id]);

  const handleStatusChange = async (newStatus: TrainingStatus) => {
    setPendingStatus(newStatus);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      const { data, error } = await supabase.from("training_sessions").update({ status: pendingStatus }).eq("id", training?.id);
      if (error) {
        console.error("Error updating training status:", error);
      } else {
        console.log("Status updated successfully:", data);
      }
      await loadTrainingById(id as string);
    } catch (error) {
      console.error("Error updating training status:", error);
    }
    setIsConfirmModalOpen(false);
    setPendingStatus(null);
  };

  return (
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 md:px-16 lg:px-28 py-8 md:py-12">
      <div className="space-y-8">
        <TrainingPageOverview training={training} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrainingPageAssignments training={training} />
          <TrainingPageParticipants training={training} />
        </div>
        <TrainingPageParticipantsScore training={training} />

        {isCommander(userRole) && (
          <BaseDashboardCard title="Training Status" tooltipContent="Change the status of this training session">
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-gray-400">Current Status:</span>
                <span className="text-sm font-medium">{training?.status}</span>
              </div>
              <TrainingStatusButtons currentStatus={training?.status as TrainingStatus} onStatusChange={handleStatusChange} />
            </div>
          </BaseDashboardCard>
        )}
      </div>

      <ConfirmStatusChangeModal
        isOpen={isConfirmModalOpen}
        onClose={() => {
          setIsConfirmModalOpen(false);
          setPendingStatus(null);
        }}
        onConfirm={handleConfirmStatusChange}
        newStatus={pendingStatus as TrainingStatus}
      />
    </div>
  );
}
