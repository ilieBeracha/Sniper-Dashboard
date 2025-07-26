import { useParams, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useStore } from "zustand";
import { TrainingSession, TrainingStatus } from "@/types/training";
import { supabase } from "@/services/supabaseClient";
import { loaderStore } from "@/store/loaderStore";
import { TrainingStore } from "@/store/trainingStore";
import { sessionStore } from "@/store/sessionStore";
import { useLoadingState } from "@/hooks/useLoadingState";
import { BiCurrentLocation } from "react-icons/bi";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import { useModal } from "@/hooks/useModal";
import { useTabs } from "@/hooks/useTabs";
import { Calendar, Target, Crosshair } from "lucide-react";
import SessionStatsTable from "@/components/SessionStatsTable";
import GroupStatsTable from "@/components/GroupStatsTable";
import TrainingStatusTab from "@/components/TrainingStatusTab";
import TrainingSessionStatsCard from "@/components/TrainingSessionStatsCard";
import TrainingPageGroupFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageGroupFormModal";
import { toast } from "react-toastify";
import { performanceStore } from "@/store/performance";

export default function TrainingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loadTrainingById, loadAssignments, createAssignment } = useStore(TrainingStore);
  const { setIsLoading } = useStore(loaderStore);
  const { training } = useStore(TrainingStore);
  const { getSessionStatsByTrainingId } = useStore(sessionStore);
  const { createGroupScore } = useStore(sessionStore);
  const { fetchGroupingScores } = useStore(performanceStore);
  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();
  const { isOpen: isOpen, setIsOpen: setIsOpen } = useModal();
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);

  useLoadingState(async () => {
    if (!id) return;
    await loadAssignments();
    await loadTrainingById(id);
    await getSessionStatsByTrainingId(id);
  }, [id]);

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

  const handleSessionClick = (session: any) => {
    setSelectedSession(session);
  };

  const handleCreateGroupScore = async (groupScore: any) => {
    try {
      await createGroupScore(groupScore);
      setIsOpen(false);
      toast.success("Group score created successfully");
      await fetchGroupingScores(id as string  );
    } catch (error) {
      console.error("Error creating group score:", error);
    }
  };

  const { tabs, activeTab, handleTabChange } = useTabs({
    tabs: [
      { id: "session-stats", label: "Session Stats", icon: Target },
      { id: "group-stats", label: "Group Stats", icon: Crosshair },
      { id: "status", label: "Status", icon: Calendar },
    ],
  });

  const renderComponent = () => {
    if (activeTab.id === "session-stats") {
      return (
        <div className="grid grid-cols-1 gap-4">
          <TrainingSessionStatsCard trainingSessionId={id!} />
          <SessionStatsTable sessionStats={selectedSession} onSessionStatsClick={handleSessionClick} onSessionStatsEditClick={() => {}} />
        </div>
      );
    }

    if (activeTab.id === "group-stats") {
      return (
        <div className="grid grid-cols-1 gap-4">
          <GroupStatsTable onGroupStatsClick={handleSessionClick} onGroupStatsEditClick={() => {}} />
        </div>
      );
    }

    if (activeTab.id === "status") {
      return <TrainingStatusTab training={training as TrainingSession} sessionStats={selectedSession} handleStatusChange={handleStatusChange} />;
    }
  };

  return (
    <SpPage>
      <Header
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Trainings", link: "/trainings" },
          { label: "Training Session", link: `/trainings/${id}` },
        ]}
      />
      <SpPageHeader
        title={"Training Session"}
        icon={BiCurrentLocation}
        action={[
          {
            label: "Add Session",
            onClick: () => {
              navigate(`/training/${id}/session-stats-full`);
            },
          },
          {
            label: "Add Group",
            onClick: () => {
              setIsOpen(true);
            },
          },
        ]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab.id} onChange={handleTabChange} />
      <SpPageBody>{renderComponent()}</SpPageBody>
      <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onSuccess={handleAddAssignment} />
      <ConfirmStatusChangeModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        newStatus={pendingStatus!}
      />
      <TrainingPageGroupFormModal isOpen={isOpen} onClose={() => setIsOpen(false)} onSubmit={handleCreateGroupScore} />
    </SpPage>
  );
}
