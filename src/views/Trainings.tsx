import TrainingAddTrainingSessionModal from "@/components/TrainingModal/AddTrainingSessionModal";
import TrainingList from "@/components/TrainingList";
import { teamStore } from "@/store/teamStore";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { useEffect } from "react";
import { useStore } from "zustand";
import { Calendar as CalendarIcon } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import Header from "@/Headers/Header";
import { performanceStore } from "@/store/performance";
import BaseDashboardCard from "@/components/BaseDashboardCard";
import { useTheme } from "@/contexts/ThemeContext";

export default function Trainings() {
  const { loadTrainingByTeamId, loadAssignments, loadWeeklyAssignmentsStats } = useStore(TrainingStore);
  const useTrainingStore = useStore(TrainingStore);
  const useUserStore = useStore(userStore);
  const teamStoreState = useStore(teamStore);
  const members = teamStoreState.members;
  const { getOverallAccuracyStats, overallAccuracyStats } = useStore(performanceStore);
  const { isOpen: isAddTrainingOpen, setIsOpen: setIsAddTrainingOpen } = useModal();
  const { theme } = useTheme();

  const user = useUserStore.user;
  const trainings = useTrainingStore.trainings || [];
  const assignments = useTrainingStore.assignments;

  useEffect(() => {
    async function load() {
      if (!user?.team_id) return;
      await loadWeeklyAssignmentsStats(user.team_id);
      await loadTrainingByTeamId(user.team_id);
      await loadAssignments();
      await getOverallAccuracyStats();
    }
    load();
  }, []);

  async function fetchTrainings() {
    const teamId = userStore.getState().user?.team_id;
    if (!teamId) return;
    await loadTrainingByTeamId(teamId);
  }
  return (
    <div className={`min-h-screen transition-colors duration-200 ${theme === "dark" ? "bg-[#121212] text-gray-100" : "bg-gray-50 text-gray-900"}`}>
      <Header title="Trainings">
        <span
          className={`flex items-center text-xs font-medium py-1.5 px-3 rounded-full transition-colors duration-200 ${
            theme === "dark" ? "text-indigo-300" : "text-indigo-600"
          }`}
        >
          <CalendarIcon className="w-3 h-3 mr-1.5" />
          {trainings.length}
        </span>
      </Header>

      <div className="grid grid-cols-1 gap-4 md:grid-cols-2 lg:grid-cols-4 p-8 ">
        <BaseDashboardCard header="">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-indigo-500">{overallAccuracyStats?.total_scores || "0"}</div>
              <div className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Total Scores</div>
            </div>
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </BaseDashboardCard>

        <BaseDashboardCard header="">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-indigo-500">{overallAccuracyStats?.accuracy_percent?.toFixed(1) || "0.0"}%</div>
              <div className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Accuracy</div>
            </div>
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7h8m0 0v8m0-8l-8 8-4-4-6 6" />
            </svg>
          </div>
        </BaseDashboardCard>

        <BaseDashboardCard header="">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-indigo-500">{overallAccuracyStats?.total_shots_fired || "0"}</div>
              <div className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Shots Fired</div>
            </div>
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
              />
            </svg>
          </div>
        </BaseDashboardCard>

        <BaseDashboardCard header="">
          <div className="p-4 flex items-center justify-between">
            <div>
              <div className="text-2xl font-bold text-indigo-500">{overallAccuracyStats?.total_target_hits || "0"}</div>
              <div className={`text-sm transition-colors duration-200 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>Target Hits</div>
            </div>
            <svg className="w-8 h-8 text-indigo-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M7 12l3-3 3 3 4-4M8 21l4-4 4 4M3 4h18M4 4h16v12a1 1 0 01-1 1H5a1 1 0 01-1-1V4z"
              />
            </svg>
          </div>
        </BaseDashboardCard>
      </div>

      <main className="px-4 md:px-6 2xl:px-10 pb-10 space-y-6 mt-6">
        <TrainingList trainings={trainings} setIsAddTrainingOpen={setIsAddTrainingOpen} />

        <TrainingAddTrainingSessionModal
          isOpen={isAddTrainingOpen}
          onClose={() => setIsAddTrainingOpen(false)}
          onSuccess={fetchTrainings}
          teamMembers={members}
          assignments={assignments}
        />
      </main>
    </div>
  );
}
