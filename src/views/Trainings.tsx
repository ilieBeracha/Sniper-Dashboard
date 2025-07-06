import TrainingAddTrainingSessionModal from "@/components/TrainingModal/AddTrainingSessionModal";
import TrainingList from "@/components/TrainingList";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { Calendar as CalendarIcon, Plus, ChevronLeft, ChevronRight, Loader2 } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import Header from "@/Headers/Header";
import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import BaseButton from "@/components/BaseButton";
import { isMobile } from "react-device-detect";
import { BiCurrentLocation } from "react-icons/bi";
import { Breadcrumb, BreadcrumbList, BreadcrumbItem, BreadcrumbLink, BreadcrumbSeparator, BreadcrumbPage } from "@/components/ui/breadcrumb";
import { Link } from "react-router-dom";
import { loaderStore } from "@/store/loaderStore";

export default function Trainings() {
  const { loadTrainingByTeamId, getTrainingCountByTeamId, loadAssignments, loadWeeklyAssignmentsStats } = useStore(TrainingStore);
  const useTrainingStore = useStore(TrainingStore);
  const useUserStore = useStore(userStore);
  const { getOverallAccuracyStats } = useStore(performanceStore);
  const { isOpen: isAddTrainingOpen, setIsOpen: setIsAddTrainingOpen } = useModal();
  const { theme } = useTheme();
  const { setIsLoading, isLoading } = useStore(loaderStore);
  // Pagination state
  const [currentPage, setCurrentPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  const [trainings, setTrainings] = useState<any[]>([]);
  const [totalCount, setTotalCount] = useState(0);
  const LIMIT = 20;

  const user = useUserStore.user;
  const assignments = useTrainingStore.assignments;

  // Load trainings and total count
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

      console.log(`Loaded ${result?.length || 0} trainings, Total: ${count}`);
    }
    loadTrainings();
  }, [user?.team_id, currentPage]);

  // Load other data
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

  async function fetchTrainings() {
    const teamId = userStore.getState().user?.team_id;
    if (!teamId) return;
    const result = await loadTrainingByTeamId(teamId, LIMIT, currentPage * LIMIT);
    setTrainings(result || []);
  }

  // Scroll to top when page changes
  const [isPageChanging, setIsPageChanging] = useState(false);

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

  // Scroll to top after data loads
  useEffect(() => {
    if (isPageChanging) {
      // Wait for data to load, then scroll
      setTimeout(() => {
        window.scrollTo({ top: 0, behavior: "smooth" });
        setIsPageChanging(false);
      }, 200);
    }
  }, [trainings, isPageChanging]);
  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === "dark" ? "bg-[#121212] text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      {isLoading ? (
        <div className="flex justify-center items-center h-screen">
          <Loader2 className="w-8 h-8 animate-spin" />
        </div>
      ) : (
        <>
          <Header title="Trainings">
            <span
              className={`flex items-center text-xs font-medium py-1.5 px-3 rounded-full transition-all duration-200 ${
                theme === "dark" ? "text-indigo-300" : "text-indigo-600"
              }`}
            >
              <CalendarIcon className="w-3 h-3 mr-1.5" />
              {totalCount || trainings.length}
            </span>
          </Header>

          <main className="md:px-6 py-4 2xl:px-6 px-4 pb-10 space-y-6">
            {/* Breadcrumb */}
            <Breadcrumb>
              <BreadcrumbList>
                <BreadcrumbItem>
                  <BreadcrumbLink asChild>
                    <Link
                      to="/"
                      className={`hover:text-purple-500 transition-colors ${
                        theme === "dark" ? "text-gray-400 hover:text-purple-400" : "text-gray-600 hover:text-purple-600"
                      }`}
                    >
                      Dashboard
                    </Link>
                  </BreadcrumbLink>
                </BreadcrumbItem>
                <BreadcrumbSeparator />
                <BreadcrumbItem>
                  <BreadcrumbPage className={`${theme === "dark" ? "text-white" : "text-gray-900"}`}>Trainings</BreadcrumbPage>
                </BreadcrumbItem>
              </BreadcrumbList>
            </Breadcrumb>

            {/* Header Card */}
            <div className={`p-4 rounded-2xl transition-all duration-200`}>
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className={`p-3 rounded-xl ${theme === "dark" ? "bg-purple-500/20" : "bg-purple-100"}`}>
                    <BiCurrentLocation className={`w-5 h-5 ${theme === "dark" ? "text-purple-400" : "text-purple-600"}`} />
                  </div>
                  <div>
                    <h2 className={`text-lg font-bold ${theme === "dark" ? "text-gray-100" : "text-gray-900"}`}>Training Sessions</h2>
                    <div className="flex items-center gap-4 mt-1">
                      <div className={`flex items-center py-1 gap-1.5 text-xs ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                        <CalendarIcon className="w-4 h-4" />
                        <span>{totalCount || trainings.length} sessions</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Add Training Button */}
                <BaseButton
                  type="button"
                  onClick={() => setIsAddTrainingOpen(true)}
                  style="purple"
                  className={`flex mt-2 items-center gap-2 font-medium transition-all duration-200 ${
                    isMobile ? "w-full justify-center rounded-xl px-4 py-3 text-sm" : "px-4 py-2.5 rounded-lg text-sm hover:shadow-lg"
                  }`}
                >
                  <Plus size={16} />
                  <span>Add Training</span>
                </BaseButton>
              </div>
            </div>

            <TrainingList trainings={trainings} totalCount={totalCount} />

            {trainings.length > 0 && (
              <div className="flex items-center justify-between mt-6">
                <div className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
                  Page {currentPage + 1} of {Math.ceil(totalCount / LIMIT)} • Showing {trainings.length} of {LIMIT} trainings
                  {totalCount > 0 && ` • ${totalCount} total trainings`}
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={prevPageWithScroll}
                    disabled={currentPage === 0}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                      currentPage === 0
                        ? "opacity-50 cursor-not-allowed"
                        : theme === "dark"
                          ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    <ChevronLeft className="w-4 h-4" />
                    Previous
                  </button>

                  <button
                    onClick={nextPageWithScroll}
                    disabled={!hasMore}
                    className={`flex items-center gap-2 px-3 py-2 rounded-lg text-sm transition-colors duration-200 ${
                      !hasMore
                        ? "opacity-50 cursor-not-allowed"
                        : theme === "dark"
                          ? "bg-zinc-800 text-gray-300 hover:bg-zinc-700"
                          : "bg-gray-100 text-gray-600 hover:bg-gray-200"
                    }`}
                  >
                    Next
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </div>
              </div>
            )}
            {/* Pagination Controls */}

            <TrainingAddTrainingSessionModal
              isOpen={isAddTrainingOpen}
              onClose={() => setIsAddTrainingOpen(false)}
              onSuccess={fetchTrainings}
              // teamMembers={members}
              assignments={assignments}
            />
          </main>
        </>
      )}
    </div>
  );
}
