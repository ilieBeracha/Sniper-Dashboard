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
import { format, parseISO } from "date-fns";

export default function TrainingPage() {
  const { id } = useParams();

  const { training, loadTrainingById, loadAssignments, createAssignment, assignments } = useStore(TrainingStore);

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();

  const { userRole } = useStore(userStore);
  const { squadsWithMembers } = useStore(squadStore);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);

  const { isLoading, setIsLoading } = useStore(loaderStore);
  const { members } = useStore(teamStore);
  const { getScoresByTrainingId, scores } = useStore(scoreStore);

  /* ------------ data loading ------------ */
  useEffect(() => {
    const load = async () => {
      if (!id) return;
      await loadAssignments();
      await loadTrainingById(id);
      await getScoresByTrainingId(id);
    };
    load();
  }, [id, isLoading]);

  /* ------------ handlers ------------ */
  const handleStatusChange = (newStatus: TrainingStatus) => {
    setPendingStatus(newStatus);
    setIsConfirmModalOpen(true);
  };

  const handleConfirmStatusChange = async () => {
    try {
      await supabase.from("training_session").update({ status: pendingStatus }).eq("id", training?.id);
      await loadTrainingById(id as string);
    } catch (error) {
      console.error("Error updating status:", error);
    } finally {
      setIsConfirmModalOpen(false);
      setPendingStatus(null);
    }
  };

  const handleEditSuccess = () => training?.id && loadTrainingById(training.id);

  const handleAddAssignment = async (assignmentName: string) => {
    try {
      setIsLoading(true);
      await createAssignment(assignmentName, true, training?.id as string);
      await loadTrainingById(id as string);
    } catch (error) {
      console.error("Error adding assignment:", error);
    } finally {
      setIsAddAssignmentOpen(false);
      setIsLoading(false);
    }
  };

  /* ------------ derived stats ------------ */
  const totalScores = scores.length;
  const dayScores = scores.filter((s) => s.day_night === "day").length;
  const nightScores = scores.filter((s) => s.day_night === "night").length;
  const squadCount = squadsWithMembers?.length || 0;

  const formattedDate = training?.date ? format(parseISO(training.date), "dd MMM yyyy") : "";

  /* ------------ ui ------------ */
  return (
    <div className="min-h-screen  text-gray-100">
      <Header title="Training">
        <span className="flex items-center rounded-full bg-indigo-500/20 py-1.5 px-3 text-xs font-medium text-indigo-300">{formattedDate}</span>
      </Header>

      <main className="mt-6 space-y-8 px-4 pb-10 md:px-6 2xl:px-10">
        {/* stats bar */}
        <div className="grid gap-6 sm:grid-cols-2 md:grid-cols-1 lg:grid-cols-1">
          <TrainingPageScoreStats totalScores={totalScores} dayScores={dayScores} nightScores={nightScores} squadCount={squadCount} />
        </div>

        {/* main grid */}
        <div className="grid gap-6 lg:grid-cols-3">
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

        {/* modals */}
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

        <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onSuccess={handleAddAssignment} />
      </main>
    </div>
  );
}
