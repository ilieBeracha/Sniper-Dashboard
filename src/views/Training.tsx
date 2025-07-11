import { TrainingSession } from "@/types/training";
import { ScoreTarget } from "@/types/score";
import { Score } from "@/types/score";
import { BiCurrentLocation } from "react-icons/bi";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import BaseButton from "@/components/BaseButton";
import TrainingScoresTable from "@/components/TrainingScoresTable";
import TrainingAnalyticsTab from "@/components/TrainingAnalyticsTab";
import TrainingStatusTab from "@/components/TrainingStatusTab";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import TrainingPageScoreFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageScoreFormModal";
import TrainingPageGroupFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageGroupFormModal";
import ScoreDetailsModal from "@/components/ScoreDetailsModal";
import { useTrainingPageLogic } from "@/hooks/useTrainingPageLogic";

export default function TrainingPage() {
  const {
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
    handleStatusChange,
    handleConfirmStatusChange,
    handleAddAssignment,
    handleAddScore,
    handleScoreClick,
    handleEditScore,
    handleAddGroupScore,
  } = useTrainingPageLogic();

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
      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as string)} />

      <SpPageBody>
        {activeTab.toLowerCase() === "scores" && (
          <TrainingScoresTable scores={scores} onScoreClick={handleScoreClick} onEditClick={handleEditScore} newlyAddedScoreId={newlyAddedScoreId} />
        )}

        {activeTab.toLowerCase() === "analytics" && <TrainingAnalyticsTab scoreRanges={scoreRanges as unknown as ScoreTarget[]} />}

        {activeTab.toLowerCase() === "status" && (
          <TrainingStatusTab training={training as TrainingSession} scores={scores as unknown as Score[]} handleStatusChange={handleStatusChange} />
        )}
      </SpPageBody>
      <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onSuccess={handleAddAssignment} />
      <TrainingPageScoreFormModal
        trainingId={training?.id as string}
        editingScore={editingScore}
        isOpen={isAddScoreOpen}
        onClose={() => {
          setIsAddScoreOpen(false);
        }}
        onSubmit={handleAddScore}
      />
      <TrainingPageGroupFormModal isOpen={isAddGroupScoreOpen} onClose={() => setIsAddGroupScoreOpen(false)} onSubmit={handleAddGroupScore} />
      <ScoreDetailsModal isOpen={isScoreDetailsOpen} setIsOpen={setIsScoreDetailsOpen} score={selectedScore} />
      <ConfirmStatusChangeModal
        isOpen={isConfirmModalOpen}
        onClose={() => setIsConfirmModalOpen(false)}
        onConfirm={handleConfirmStatusChange}
        newStatus={pendingStatus!}
      />
    </SpPage>
  );
}
