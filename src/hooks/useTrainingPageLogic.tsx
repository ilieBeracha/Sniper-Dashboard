import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { TrainingSession, TrainingStatus } from "@/types/training";
import { supabase } from "@/services/supabaseClient";
import { scoreStore } from "@/store/scoreSrore";
import { loaderStore } from "@/store/loaderStore";
import { Calendar, Activity, Target } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { TrainingStore } from "@/store/trainingStore";
import SessionStatsModal from "@/components/SessionStats/SessionStatsModal";
import SessionStatsTable from "@/components/SessionStatsTable";
import TrainingAnalyticsTab from "@/components/TrainingAnalyticsTab";
import TrainingStatusTab from "@/components/TrainingStatusTab";
import { ScoreTarget } from "@/types/score";
import { sessionStore } from "@/store/sessionStore";

export function useTrainingPageLogic() {
  const tabs = [
    { label: "Session Stats", icon: Target },
    { label: "Analytics", icon: Activity },
    { label: "Status", icon: Calendar },
  ];

  const { id } = useParams();
  const { loadTrainingById, loadAssignments, createAssignment } = useStore(TrainingStore);
  const { setIsLoading } = useStore(loaderStore);
  const { training } = useStore(TrainingStore);

  const {
    getScoresByTrainingId,
    scores,
    handleCreateScore: createScoreAction,
    getScoreRangesByTrainingId,
    scoreRanges,
    getScoreTargetsByScoreId,
    handlePatchScore,
    handleCreateGroupScore: createGroupScoreAction,
    forceRefreshScores,
  } = useStore(scoreStore);

  const { sessionStats, getSessionStatsByTrainingId } = useStore(sessionStore);

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [isSessionStatsOpen, setIsSessionStatsOpen] = useState(false);
  const [newlyAddedSessionId, setNewlyAddedSessionId] = useState<string | null>(null);
  const [selectedSession, setSelectedSession] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].label);

  useEffect(() => {
    setIsLoading(true);
    const load = async () => {
      if (!id) return;
      await loadAssignments();
      await loadTrainingById(id);
      await getSessionStatsByTrainingId(id);
      await getScoresByTrainingId(id);
      await getScoreRangesByTrainingId(id);
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
    // TODO: Implement session details modal
  };

  const handleEditSession = (session: any) => {
    // TODO: Implement session edit functionality
    console.log("Edit session:", session);
  };

  const renderComponent = () => {
    if (activeTab.toLowerCase() === "session stats") {
      return (
        <>
          <SessionStatsModal
            isOpen={isSessionStatsOpen}
            onClose={() => setIsSessionStatsOpen(false)}
            onSuccess={async (sessionId) => {
              setNewlyAddedSessionId(sessionId);
              await getSessionStatsByTrainingId(id as string);
            }}
          />
          <SessionStatsTable
            sessionStats={sessionStats}
            onSessionClick={handleSessionClick}
            onEditClick={handleEditSession}
            newlyAddedSessionId={newlyAddedSessionId}
          />
        </>
      );
    }

    if (activeTab.toLowerCase() === "analytics") {
      return <TrainingAnalyticsTab scoreRanges={scoreRanges as unknown as ScoreTarget[]} />;
    }

    if (activeTab.toLowerCase() === "status") {
      return <TrainingStatusTab training={training as TrainingSession} scores={scores as any} handleStatusChange={handleStatusChange} />;
    }
  };

  return {
    // Data
    id,
    training,
    scores,
    scoreRanges,
    tabs,
    activeTab,
    setActiveTab,
    newlyAddedSessionId,
    selectedSession,
    pendingStatus,

    // Modal states
    isAddAssignmentOpen,
    setIsAddAssignmentOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isSessionStatsOpen,
    setIsSessionStatsOpen,
    // Handlers
    handleStatusChange,
    handleConfirmStatusChange,
    handleAddAssignment,
    renderComponent,
  };
}
