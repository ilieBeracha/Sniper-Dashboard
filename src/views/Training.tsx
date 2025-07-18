import { BiCurrentLocation } from "react-icons/bi";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import { useTrainingPageLogic } from "@/hooks/useTrainingPageLogic";
import { useNavigate } from "react-router-dom";

export default function TrainingPage() {
  const navigate = useNavigate();
  const {
    id,
    tabs,
    activeTab,
    setActiveTab,
    pendingStatus,
    isAddAssignmentOpen,
    setIsAddAssignmentOpen,
    isConfirmModalOpen,
    setIsConfirmModalOpen,
    handleConfirmStatusChange,
    handleAddAssignment,
    renderComponent,
  } = useTrainingPageLogic();

  return (
    <SpPage>
      <Header />
      <SpPageHeader
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Trainings", link: "/trainings" },
          { label: "Training Session", link: `/trainings/${id}` },
        ]}
        title={"Training Session"}
        icon={<BiCurrentLocation />}
        dropdownItems={[
          {
            label: "Full Page Form",
            onClick: () => {
              navigate(`/training/${id}/session-stats-full`);
            },
          },
        ]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab as string)} />
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
