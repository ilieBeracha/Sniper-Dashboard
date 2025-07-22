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
import { Calendar } from "lucide-react";
import { Target } from "lucide-react";
import SessionStatsTable from "@/components/SessionStatsTable";
import TrainingStatusTab from "@/components/TrainingStatusTab";
import TrainingSessionStatsCard from "@/components/TrainingSessionStatsCard";

export default function TrainingPage() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { loadTrainingById, loadAssignments, createAssignment } = useStore(TrainingStore);
  const { setIsLoading } = useStore(loaderStore);
  const { training } = useStore(TrainingStore);
  const { getSessionStatsByTrainingId } = useStore(sessionStore);

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();

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
  const { tabs, activeTab, handleTabChange } = useTabs({
    tabs: [
      { id: "session-stats", label: "Session Stats", icon: Target },
      // { id: "analytics", label: "Analytics", icon: Activity },
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

    // if (activeTab.id === "analytics") {
    //   return <TrainingAnalyticsTab trainingSessionId={id!} />;
    // }

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
        dropdownItems={[
          {
            label: "Full Page Form",
            onClick: () => {
              navigate(`/training/${id}/session-stats-full`);
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
    </SpPage>
  );
}
