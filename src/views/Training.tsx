import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import TrainingPageOverview from "@/components/TrainingPageOverview";
import TrainingPageAssignments from "@/components/TrainingPageAssignments";
import { TrainingSession, TrainingStatus } from "@/types/training";
import { isCommander } from "@/utils/permissions";
import { userStore } from "@/store/userStore";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import { supabase } from "@/services/supabaseClient";
import EditTrainingSessionModal from "@/components/EditTrainingSessionModal";
import { teamStore } from "@/store/teamStore";
import TrainingPageChangeStatus from "@/components/TrainingPageChangeStatus";
import TrainingPageScores from "@/components/TrainingPageScores";

export default function TrainingPage() {
  const params = useParams();
  const { id } = params;
  const { training, loadTrainingById, loadAssignments, getScoresGroupedBySquad } = useStore(TrainingStore);

  const { userRole } = useStore(userStore);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { members } = useStore(teamStore);
  const { assignments } = useStore(TrainingStore);

  useEffect(() => {
    const load = async () => {
      await loadAssignments();
      await loadTrainingById(id as string);
      await getScoresGroupedBySquad(id as string);
    };

    load();
  }, [id]);

  const handleStatusChange = async (newStatus: TrainingStatus) => {
    setPendingStatus(newStatus);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      const { data, error } = await supabase.from("training_session").update({ status: pendingStatus }).eq("id", training?.id);
      console.log(data, error);
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

  const handleEditSuccess = () => {
    if (training?.id) {
      loadTrainingById(training.id);
    }
  };

  return (
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 md:px-16 lg:px-28 py-8 md:py-12">
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <TrainingPageOverview training={training} />
        </div>
        <div className="lg:col-span-1">
          <TrainingPageAssignments training={training} />
        </div>

        <div className="lg:col-span-3">
          {isCommander(userRole) ? <TrainingPageChangeStatus training={training as TrainingSession} onStatusChange={handleStatusChange} /> : <></>}
        </div>

        <div className="lg:col-span-3">
          <TrainingPageScores />
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


      <ConfirmStatusChangeModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        newStatus={pendingStatus as TrainingStatus}
      />
    </div>
  );
}
