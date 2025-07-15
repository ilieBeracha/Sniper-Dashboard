import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { TrainingSession, TrainingStatus } from "@/types/training";
import { supabase } from "@/services/supabaseClient";
import { loaderStore } from "@/store/loaderStore";
import { Calendar, Activity, Target } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { TrainingStore } from "@/store/trainingStore";
import SessionStatsTable from "@/components/SessionStatsTable";
import TrainingAnalyticsTab from "@/components/TrainingAnalyticsTab";
import TrainingStatusTab from "@/components/TrainingStatusTab";
import { sessionStore } from "@/store/sessionStore";

export function useTrainingPageLogic() {
  const tabs = [
    { id: "session-stats", label: "Session Stats", icon: Target },
    { id: "analytics", label: "Analytics", icon: Activity },
    { id: "status", label: "Status", icon: Calendar },
  ];

  const { id } = useParams();
  const { loadTrainingById, loadAssignments, createAssignment } = useStore(TrainingStore);
  const { setIsLoading } = useStore(loaderStore);
  const { training } = useStore(TrainingStore);

  const { sessionStats, getSessionStatsByTrainingId } = useStore(sessionStore);

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);

  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].id);

  useEffect(() => {
    setIsLoading(true);
    const load = async () => {
      if (!id) return;
      await loadAssignments();
      await loadTrainingById(id);
      await getSessionStatsByTrainingId(id);
      setIsLoading(false);
    };
    load();
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

  const renderComponent = () => {
    if (activeTab.toLowerCase() === "session-stats") {
      return (
        <>
          <SessionStatsTable sessionStats={sessionStats} onSessionStatsClick={handleSessionClick} onSessionStatsEditClick={() => {}} />
        </>
      );
    }

    if (activeTab.toLowerCase() === "analytics") {
      return <TrainingAnalyticsTab trainingSessionId={id!} />;
    }

    if (activeTab.toLowerCase() === "status") {
      return <TrainingStatusTab training={training as TrainingSession} sessionStats={sessionStats} handleStatusChange={handleStatusChange} />;
    }
  };

  return {
    id,
    training,
    tabs,
    activeTab,
    setActiveTab,
    selectedSession,
    pendingStatus,

    isAddAssignmentOpen,
    setIsAddAssignmentOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,

    handleStatusChange,
    handleConfirmStatusChange,
    handleAddAssignment,
    renderComponent,
  };
}
