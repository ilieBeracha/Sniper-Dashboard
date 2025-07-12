import { BiCurrentLocation } from "react-icons/bi";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import BaseButton from "@/components/base/BaseButton";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import TrainingPageScoreFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageScoreFormModal";
import TrainingPageGroupFormModal from "@/components/TrainingPageScoreFormModal/TrainingPageGroupFormModal";
import ScoreDetailsModal from "@/components/ScoreDetailsModal";
import { useTrainingPageLogic } from "@/hooks/useTrainingPageLogic";

export default function TrainingPage() {
  const {
    id,
    tabs,
    activeTab,
    setActiveTab,
    selectedScore,
    editingScore,
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
    handleConfirmStatusChange,
    handleAddAssignment,
    handleAddScore,
    handleAddGroupScore,
    setIsSessionStatsOpen,
    renderComponent,
  } = useTrainingPageLogic();

  return (
    <SpPage>
      <Header title="Training Session"> </Header>
      <SpPageHeader
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Trainings", link: "/trainings" },
          { label: "Training Session", link: `/trainings/${id}` },
        ]}
        subtitle={"Training Session"}
        title={"Training Session"}
        icon={<BiCurrentLocation />}
        button={[
          <BaseButton className="flex items-center gap-2" style="purple" onClick={() => setIsSessionStatsOpen(true)}>
            Add Session Stats
          </BaseButton>,

          <BaseButton onClick={() => setIsAddGroupScoreOpen(true)}>Add Group Score</BaseButton>,
        ]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as string)} />

      <SpPageBody>{renderComponent()}</SpPageBody>
      <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onSuccess={handleAddAssignment} />
      <TrainingPageScoreFormModal
        trainingId={id as string}
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
