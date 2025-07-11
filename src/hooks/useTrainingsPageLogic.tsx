import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { TrainingStore } from "@/store/trainingStore";
import { performanceStore } from "@/store/performance";
import { loaderStore } from "@/store/loaderStore";
import { userStore } from "@/store/userStore";
import { Calendar as CalendarIcon } from "lucide-react";

export function useTrainingsPageLogic() {
  const { loadTrainingByTeamId, getTrainingCountByTeamId, loadAssignments, loadWeeklyAssignmentsStats } = useStore(TrainingStore);
  const { getOverallAccuracyStats } = useStore(performanceStore);
  const { setIsLoading } = useStore(loaderStore);
  const user = useStore(userStore).user;
  const assignments = useStore(TrainingStore).assignments;

  const LIMIT = 20;
  const [currentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const [isPageChanging, setIsPageChanging] = useState(false);
  const [isAddTrainingOpen, setIsAddTrainingOpen] = useState(false);

  const tabs = [{ label: "Active", icon: CalendarIcon }];
  const [activeTab, setActiveTab] = useState<string>(tabs[0].label);

  useEffect(() => {
    setIsLoading(true);
    const loadStats = async () => {
      if (!user?.team_id) return;
      await loadWeeklyAssignmentsStats(user.team_id);
      await loadAssignments();
      await getOverallAccuracyStats();
      setIsLoading(false);
    };
    loadStats();
  }, [user?.team_id]);

  useEffect(() => {
    const loadTrainings = async () => {
      if (!user?.team_id) return;

      const [result, count] = await Promise.all([
        loadTrainingByTeamId(user.team_id, LIMIT, currentPage * LIMIT),
        getTrainingCountByTeamId(user.team_id),
      ]);

      setTrainings(result || []);
      setTotalCount(count);
      setHasMore(result?.length === LIMIT);
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

  return {
    user,
    tabs,
    activeTab,
    setActiveTab,
    currentPage,
    totalCount,
    trainings,
    assignments,
    LIMIT,
    isAddTrainingOpen,
    setIsAddTrainingOpen,
    fetchTrainings,
    handleModalClose,
    hasMore,
    setIsPageChanging,
  };
}
