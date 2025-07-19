import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import TrainingList from "@/components/TrainingList";
import SpPagination from "@/layouts/SpPagination";
import TrainingAddTrainingSessionModal from "@/components/TrainingModal/AddTrainingSessionModal";
import { BiCurrentLocation } from "react-icons/bi";
import { useTrainingsPageLogic } from "@/hooks/useTrainingsPageLogic";
import Header from "@/Headers/Header";

export default function Trainings() {
  const {
    tabs,
    activeTab,
    setActiveTab,
    setIsAddTrainingOpen,
    trainings,
    totalCount,
    currentPage,
    LIMIT,
    hasMore,
    setIsPageChanging,
    isAddTrainingOpen,
    assignments,
    fetchTrainings,
    handleModalClose,
  } = useTrainingsPageLogic();

  return (
    <SpPage>
      <Header
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Trainings", link: "/trainings" },
        ]}
      />
      <SpPageHeader
        title="Trainings"
        subtitle={"Add, edit, and manage training sessions"}
        icon={<BiCurrentLocation />}
        dropdownItems={[{ label: "Add Training", onClick: () => setIsAddTrainingOpen(true) }]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={setActiveTab} />

      <SpPageBody>
        <TrainingList trainings={trainings} />
        <SpPagination
          currentPage={currentPage}
          totalCount={totalCount}
          LIMIT={LIMIT}
          prevPageWithScroll={() => {
            if (currentPage > 0) {
              setIsPageChanging(true);
              setActiveTab(tabs[0].id);
            }
          }}
          nextPageWithScroll={() => {
            if (hasMore) {
              setIsPageChanging(true);
              setActiveTab(tabs[0].id);
            }
          }}
        />
      </SpPageBody>

      <TrainingAddTrainingSessionModal isOpen={isAddTrainingOpen} onClose={handleModalClose} onSuccess={fetchTrainings} assignments={assignments} />
    </SpPage>
  );
}
