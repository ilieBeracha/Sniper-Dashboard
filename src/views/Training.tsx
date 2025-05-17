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
import TrainingPageScore from "@/components/TrainingPageScore";
import { scoreStore } from "@/store/scoreSrore";
import { loaderStore } from "@/store/loaderStore";
import TrainingPageScoreStats from "@/components/TrainingPageScoreStats";
import { squadStore } from "@/store/squadStore";
import { useModal } from "@/hooks/useModal";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import Header from "@/Headers/Header";

export default function TrainingPage() {
  const params = useParams();
  const { id } = params;
  const { training, loadTrainingById, loadAssignments, createAssignment } = useStore(TrainingStore);
  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();

  const { userRole } = useStore(userStore);
  const { squadsWithMembers } = useStore(squadStore);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { isLoading, setIsLoading } = useStore(loaderStore);
  const { members } = useStore(teamStore);
  const { assignments } = useStore(TrainingStore);

  const { getScoresByTrainingId, scores } = useStore(scoreStore);

  useEffect(() => {
    const load = async () => {
      if (id) {
        await loadAssignments();
        await loadTrainingById(id as string);
        await getScoresByTrainingId(id as string);
      }
    };

    load();
  }, [id, isLoading]);

  const handleStatusChange = async (newStatus: TrainingStatus) => {
    setPendingStatus(newStatus);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      const { error } = await supabase.from("training_session").update({ status: pendingStatus }).eq("id", training?.id);
      if (error) {
        console.error("Error updating training status:", error);
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

  const handleAddAssignment = async (assignmentName: string) => {
    try {
      setIsLoading(true);
      await createAssignment(assignmentName, true, training?.id as string);
      loadTrainingById(id as string);
      setIsAddAssignmentOpen(false);
      setIsLoading(false);
    } catch (error) {
      console.error("Error adding assignment:", error);
    }
  };

  const totalScores = scores.length;
  const dayScores = scores.filter((score) => score.day_night === "day").length;
  const nightScores = scores.filter((score) => score.day_night === "night").length;
  const squadCount = squadsWithMembers?.length || 0;

  return (
    <div className="min-h-screen from-[#1E1E20] ">
      <Header title="Training">
        <span className="flex items-center text-xs font-medium bg-indigo-500/20 text-indigo-300 py-1.5 px-3 rounded-full">{training?.date}</span>{" "}
      </Header>

      <div className="grid grid-cols-1 gap-2 p-4 md:p-6 2xl:p-10 ">
        <div className="grid sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1 gap-2 w-full">
          <TrainingPageScoreStats totalScores={totalScores} dayScores={dayScores} nightScores={nightScores} squadCount={squadCount} />
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-2">
          <div className="lg:col-span-2">
            <TrainingPageOverview training={training} />
          </div>
          <div className="lg:col-span-1">
            <TrainingPageAssignments training={training} setIsAddAssignmentOpen={setIsAddAssignmentOpen} />
          </div>

          {isCommander(userRole) && (
            <div className="lg:col-span-3">
              <TrainingPageChangeStatus training={training as TrainingSession} onStatusChange={handleStatusChange} />
            </div>
          )}

          <div className="lg:col-span-3">
            <TrainingPageScore />
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
      </div>

      <ConfirmStatusChangeModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        newStatus={pendingStatus as TrainingStatus}
      />

      <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onSuccess={handleAddAssignment} />
    </div>
  );
}
