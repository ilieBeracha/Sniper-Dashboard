import { useState, useEffect } from "react";
import { useStore } from "zustand";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { useLoadingState } from "@/hooks/useLoadingState";
import { SpPage, SpPageBody, SpPageHeader } from "@/layouts/SpPage";
import TrainingList from "@/components/TrainingList";
import SpPagination from "@/layouts/SpPagination";
import TrainingAddTrainingSessionModal from "@/components/TrainingModal/AddTrainingSessionModal";
import { BiCurrentLocation } from "react-icons/bi";
import Header from "@/Headers/Header";
import { weaponsStore } from "@/store/weaponsStore";
import { isCommander } from "@/utils/permissions";
import { UserRole } from "@/types/user";
import { TrainingsListSkeleton } from "@/components/DashboardSkeletons";

export default function Trainings() {
  const { loadTrainingByTeamId, getTrainingCountByTeamId, loadAssignments, loadWeeklyAssignmentsStats } = useStore(TrainingStore);
  const user = useStore(userStore).user;
  const assignments = useStore(TrainingStore).assignments;
  const { getWeapons } = useStore(weaponsStore);

  const LIMIT = 20;
  const [currentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  useLoadingState(async () => {
    if (!user?.team_id) return;
    await loadWeeklyAssignmentsStats(user.team_id);
    await loadAssignments();
    await getWeapons(user.team_id as string);
  }, [user?.team_id]);

  useEffect(() => {
    const loadTrainings = async () => {
      if (!user?.team_id) return;

      setIsLoading(true);
      const [result, count] = await Promise.all([
        loadTrainingByTeamId(user.team_id, LIMIT, currentPage * LIMIT),
        getTrainingCountByTeamId(user.team_id),
      ]);

      setTrainings(result || []);
      setTotalCount(count);
      setHasMore(result?.length === LIMIT);
      setIsLoading(false);
    };

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

  const fetchTrainings = async () => {
    const teamId = user?.team_id;
    if (!teamId) return;
    const result = await loadTrainingByTeamId(teamId, LIMIT, currentPage * LIMIT);
    setTrainings(result || []);
    setIsAddTrainingOpen(false);
  };

  const handleModalClose = async () => {
    setIsAddTrainingOpen(false);
    if (user?.team_id) await loadAssignments();
  };

  const action = (): { label: string; onClick: () => void }[] => {
    if (isCommander(user?.user_role as UserRole)) {
      return [{ label: "Add Training", onClick: () => setIsAddTrainingOpen(true) }];
    }
    return [];
  };
  return (
    <SpPage>
      <Header
        breadcrumbs={[
          { label: "Dashboard", link: "/" },
          { label: "Trainings", link: "/trainings" },
        ]}
      />
      <SpPageHeader title="Trainings" subtitle={"Add, edit, and manage training sessions"} icon={BiCurrentLocation} action={action()} />

      <SpPageBody>
        {isLoading ? (
          <TrainingsListSkeleton count={5} />
        ) : (
          <TrainingList trainings={trainings} />
        )}
        <SpPagination
          currentPage={currentPage}
          totalCount={totalCount}
          LIMIT={LIMIT}
          prevPageWithScroll={() => {
            if (currentPage > 0) {
              setIsPageChanging(true);
            }
          }}
          nextPageWithScroll={() => {
            if (hasMore) {
              setIsPageChanging(true);
            }
          }}
        />
      </SpPageBody>

      <TrainingAddTrainingSessionModal isOpen={isAddTrainingOpen} onClose={handleModalClose} onSuccess={fetchTrainings} assignments={assignments} />
    </SpPage>
  );
}
