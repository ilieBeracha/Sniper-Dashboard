import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import { TrainingSession, TrainingStatus } from "@/types/training";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import { supabase } from "@/services/supabaseClient";
import { scoreStore } from "@/store/scoreSrore";
import { loaderStore } from "@/store/loaderStore";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import { ScoreTarget } from "@/types/score";
import TrainingPageScoreFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageScoreFormModal";
import { Calendar, Activity, Target } from "lucide-react";
import ScoreDetailsModal from "@/components/ScoreDetailsModal";
import { BiCurrentLocation } from "react-icons/bi";
import TrainingScoresTable from "@/components/TrainingScoresTable";
import { useModal } from "@/hooks/useModal";
import { useModal as useGroupModal } from "@/hooks/useModal";
import TrainingPageGroupFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageGroupFormModal";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import BaseButton from "@/components/BaseButton";
import TrainingAnalyticsTab from "@/components/TrainingAnalyticsTab";
import TrainingStatusTab from "@/components/TrainingStatusTab";
import { Score } from "@/types/score";

export default function TrainingPage() {
  const tabs = [
    { label: "Scores", icon: <Target /> },
    { label: "Analytics", icon: <Activity /> },
    { label: "Status", icon: <Calendar /> },
  ];
  const { id } = useParams();
  const { training, loadTrainingById, loadAssignments, createAssignment } = useStore(TrainingStore);

  const { isOpen: isAddAssignmentOpen, setIsOpen: setIsAddAssignmentOpen } = useModal();
  const { isOpen: isAddScoreOpen, setIsOpen: setIsAddScoreOpen } = useModal();
  const { isOpen: isAddGroupScoreOpen, setIsOpen: setIsAddGroupScoreOpen } = useGroupModal();

  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);
  const [pendingStatus, setPendingStatus] = useState<TrainingStatus | null>(null);
  const [selectedScore, setSelectedScore] = useState<any>(null);
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

  const { setIsLoading } = useStore(loaderStore);

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

  // Modals
  const modals = () => {
    return [
      <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onSuccess={handleAddAssignment} />,
      <TrainingPageScoreFormModal
        trainingId={training?.id as string}
        editingScore={editingScore}
        isOpen={isAddScoreOpen}
        onClose={() => {
          setIsAddScoreOpen(false);
          setEditingScore(null);
        }}
        onSubmit={handleAddScore}
      />,
      <TrainingPageGroupFormModal isOpen={isAddGroupScoreOpen} onClose={() => setIsAddGroupScoreOpen(false)} onSubmit={handleAddGroupScore} />,
      <ScoreDetailsModal isOpen={isScoreDetailsOpen} setIsOpen={setIsScoreDetailsOpen} score={selectedScore} />,
      <ConfirmStatusChangeModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        newStatus={pendingStatus as TrainingStatus}
      />,
    ];
  };

  return (
    <SpPage>
      <Header title="Training Session"> </Header>
      <SpPageHeader
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Trainings", link: "/trainings" },
          { label: training?.session_name || "Training Session", link: `/trainings/${id}` },
        ]}
        subtitle={training?.session_name || "Training Session"}
        title={training?.session_name || "Training Session"}
        icon={<BiCurrentLocation />}
        button={[
          <BaseButton style="purple" onClick={() => setIsAddScoreOpen(true)}>
            Add Score
          </BaseButton>,
          <BaseButton style="purple" onClick={() => setIsAddGroupScoreOpen(true)}>
            Add Group Score
          </BaseButton>,
        ]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} />

      <SpPageBody>
        {activeTab.toLowerCase() === "scores" && (
          <TrainingScoresTable scores={scores} onScoreClick={handleScoreClick} onEditClick={handleEditScore} newlyAddedScoreId={newlyAddedScoreId} />
        )}

        {activeTab.toLowerCase() === "analytics" && <TrainingAnalyticsTab scoreRanges={scoreRanges as unknown as ScoreTarget[]} />}

        {activeTab.toLowerCase() === "status" && (
          <TrainingStatusTab training={training as TrainingSession} scores={scores as unknown as Score[]} handleStatusChange={handleStatusChange} />
        )}
      </SpPageBody>
      {modals()}
    </SpPage>
  );
}
