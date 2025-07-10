import TrainingAddTrainingSessionModal from "@/components/TrainingModal/AddTrainingSessionModal";
import TrainingList from "@/components/TrainingList";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { Calendar as CalendarIcon } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import { performanceStore } from "@/store/performance";
import BaseButton from "@/components/BaseButton";
import { BiCurrentLocation } from "react-icons/bi";
import { loaderStore } from "@/store/loaderStore";
import { SpPage, SpPageBody, SpPageHeader, SpPageTabs } from "@/layouts/SpPage";
import SpPagination from "@/layouts/SpPagination";
import Header from "@/Headers/Header";

export default function Trainings() {
  const { loadTrainingByTeamId, getTrainingCountByTeamId, loadAssignments, loadWeeklyAssignmentsStats } = useStore(TrainingStore);
  const useTrainingStore = useStore(TrainingStore);
  const useUserStore = useStore(userStore);
  const { getOverallAccuracyStats } = useStore(performanceStore);
  const { isOpen: isAddTrainingOpen, setIsOpen: setIsAddTrainingOpen } = useModal();
  const { setIsLoading } = useStore(loaderStore);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const LIMIT = 20;

  const user = useUserStore.user;
  const assignments = useTrainingStore.assignments;

  useEffect(() => {
    setIsLoading(true);
    async function loadOtherData() {
      if (!user?.team_id) return;
      await loadWeeklyAssignmentsStats(user.team_id);
      await loadAssignments();
      await getOverallAccuracyStats();
      setIsLoading(false);
    }
    loadOtherData();
  }, [user?.team_id]);

  useEffect(() => {
    async function loadTrainings() {
      if (!user?.team_id) return;

      // Load both trainings and total count
      const [result, count] = await Promise.all([
        loadTrainingByTeamId(user.team_id, LIMIT, currentPage * LIMIT),
        getTrainingCountByTeamId(user.team_id),
      ]);

      setTrainings(result || []);
      setTotalCount(count);

      if (result && result.length < LIMIT) {
        setHasMore(false);
      } else {
        setHasMore(true);
      }
    }
    loadTrainings();
  }, [user?.team_id, currentPage]);

  useEffect(() => {
    if (isPageChanging) {
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsPageChanging(false);
      }, 200);
    }
  }, [trainings, isPageChanging]);

  async function fetchTrainings() {
    const teamId = userStore.getState().user?.team_id;
    if (!teamId) return;
    const result = await loadTrainingByTeamId(teamId, LIMIT, currentPage * LIMIT);
    setTrainings(result || []);
    setIsAddTrainingOpen(false);
  }

  const handleModalClose = async () => {
    setIsAddTrainingOpen(false);
    // Reload assignments to ensure new ones appear
    if (user?.team_id) {
      await loadAssignments();
    }
  };

  const nextPageWithScroll = () => {
    if (hasMore) {
      setIsPageChanging(true);
      setCurrentPage((prev) => prev + 1);
    }
  };

  const prevPageWithScroll = () => {
    if (currentPage > 0) {
      setIsPageChanging(true);
      setCurrentPage((prev) => prev - 1);
    }
  };

  const tabs = [{ label: "Active", icon: <CalendarIcon /> }];

  const [activeTab, setActiveTab] = useState(tabs[0].label || "");

  const modals = () => {
    return [
      <TrainingAddTrainingSessionModal isOpen={isAddTrainingOpen} onClose={handleModalClose} onSuccess={fetchTrainings} assignments={assignments} />,
    ];
  };

  return (
    <SpPage>
      <Header title="Trainings"> </Header>
      <SpPageHeader
        title="Trainings"
        icon={<BiCurrentLocation />}
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Trainings", link: "/trainings" },
        ]}
        button={[
          <BaseButton style="purple" onClick={() => setIsAddTrainingOpen(true)}>
            Add Training
          </BaseButton>,
        ]}
      />
      <SpPageTabs tabs={tabs} activeTab={activeTab} onChange={(tab) => setActiveTab(tab)} />

      <SpPageBody>
        <TrainingList trainings={trainings} />
        <SpPagination
          currentPage={currentPage}
          totalCount={totalCount}
          LIMIT={LIMIT}
          prevPageWithScroll={prevPageWithScroll}
          nextPageWithScroll={nextPageWithScroll}
        />
      </SpPageBody>

      {modals()}
    </SpPage>
  );
}
