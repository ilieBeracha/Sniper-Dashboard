import { BiCurrentLocation } from "react-icons/bi";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import Header from "@/Headers/Header";
import BaseButton from "@/components/base/BaseButton";
import ConfirmStatusChangeModal from "@/components/ConfirmStatusChangeModal";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import { useTrainingPageLogic } from "@/hooks/useTrainingPageLogic";
import { useNavigate } from "react-router-dom";
import { FileText } from "lucide-react";

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
        subtitle={"Training Session"}
        title={"Training Session"}
        icon={<BiCurrentLocation />}
        button={[
          <BaseButton className="flex items-center gap-2" style="white" onClick={() => navigate(`/training/${id}/session-stats-full`)}>
            <FileText className="w-4 h-4" />
            Full Page Form
          </BaseButton>,
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
