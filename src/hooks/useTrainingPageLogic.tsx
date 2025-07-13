import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { TrainingSession, TrainingStatus } from "@/types/training";
import { supabase } from "@/services/supabaseClient";
import { scoreStore } from "@/store/scoreSrore";
import { loaderStore } from "@/store/loaderStore";
import { Calendar, Activity, Target } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { useModal as useGroupModal } from "@/hooks/useModal";
import { TrainingStore } from "@/store/trainingStore";
import SessionStatsModal from "@/components/SessionStats/SessionStatsModal";
import TrainingScoresTable from "@/components/TrainingScoresTable";
import TrainingAnalyticsTab from "@/components/TrainingAnalyticsTab";
import TrainingStatusTab from "@/components/TrainingStatusTab";

export function useTrainingPageLogic() {
  const tabs = [
    { label: "Scores", icon: Target },
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

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();
  const { isOpen: isAddScoreOpen, setIsOpen: setIsAddScoreOpen } = useModal();
  const { isOpen: isAddGroupScoreOpen, setIsOpen: setIsAddGroupScoreOpen } = useGroupModal();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [selectedScore, setSelectedScore] = useState<any>(null);
  const [isSessionStatsOpen, setIsSessionStatsOpen] = useState(false);
  const [isScoreDetailsOpen, setIsScoreDetailsOpen] = useState(false);
  const [newlyAddedScoreId, setNewlyAddedScoreId] = useState<string | null>(null);
  const [editingScore, setEditingScore] = useState<any>(null);
  const [activeTab, setActiveTab] = useState<string>(tabs[0].label);

  useEffect(() => {
    setIsLoading(true);
    const load = async () => {
      if (!id) return;
      await loadAssignments();
      await loadTrainingById(id);
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

  const handleAddScore = async (data: any) => {
    if (editingScore?.id) {
      handleUpdateScore(data);
      return;
    }
    try {
      const newScore = await createScoreAction(data);
      console.log(newScore);

      if (newScore?.[0]?.id) {
        setNewlyAddedScoreId(newScore[0].id as string);
        setIsAddScoreOpen(false);

        await new Promise((resolve) => setTimeout(resolve, 100));

        await forceRefreshScores(id as string);
      } else {
        console.error("No score ID returned:", newScore);
      }
    } catch (error) {
      console.error("Error adding score:", error);
    }
  };

  const handleScoreClick = (score: any) => {
    setSelectedScore(score);
    getScoreTargetsByScoreId(score.id);
    setIsScoreDetailsOpen(true);
  };

  const handleEditScore = (score: any) => {
    setEditingScore(score);
    getScoreTargetsByScoreId(score.id);
    setIsAddScoreOpen(true);
  };

  const handleUpdateScore = async (data: any) => {
    try {
      await handlePatchScore(data, editingScore.id);
      await forceRefreshScores(id as string);
      setIsAddScoreOpen(false);
      setEditingScore(null);
    } catch (error) {
      console.error("Error updating score:", error);
    }
  };

  const handleAddGroupScore = async (data: any) => {
    try {
      const result = await createGroupScoreAction(data);
      if (result) {
        setIsAddGroupScoreOpen(false);
        await forceRefreshScores(id as string);
      }
    } catch (error) {
      console.error("Error adding group score:", error);
    }
  };

  const renderComponent = () => {
    if (activeTab.toLowerCase() === "scores") {
      return (
        <>
          <SessionStatsModal isOpen={isSessionStatsOpen} onClose={() => setIsSessionStatsOpen(false)} />
          <TrainingScoresTable scores={scores} onScoreClick={handleScoreClick} onEditClick={handleEditScore} newlyAddedScoreId={newlyAddedScoreId} />
        </>
      );
    }

    if (activeTab.toLowerCase() === "analytics") {
      return<TrainingAnalyticsTab
      trainingSessionId={id!}
    />;
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
    selectedScore,
    editingScore,
    newlyAddedScoreId,
    pendingStatus,

    // Modal states
    isAddAssignmentOpen,
    setIsAddAssignmentOpen,
    isAddScoreOpen,
    setIsAddScoreOpen,
    isAddGroupScoreOpen,
    setIsAddGroupScoreOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    isScoreDetailsOpen,
    setIsScoreDetailsOpen,
    isSessionStatsOpen,
    setIsSessionStatsOpen,
    // Handlers
    handleStatusChange,
    handleConfirmStatusChange,
    handleAddAssignment,
    handleAddScore,
    handleScoreClick,
    handleEditScore,
    handleUpdateScore,
    handleAddGroupScore,
    renderComponent,
  };
}
