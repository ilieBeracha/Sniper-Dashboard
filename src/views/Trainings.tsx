import TrainingAddTrainingSessionModal from "@/components/TrainingModal/AddTrainingSessionModal";
import TrainingList from "@/components/TrainingList";
import { teamStore } from "@/store/teamStore";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { useEffect } from "react";
import { useStore } from "zustand";
import { Calendar as CalendarIcon, Plus } from "lucide-react";
import { useModal } from "@/hooks/useModal";
import Header from "@/Headers/Header";
import { performanceStore } from "@/store/performance";
import { useTheme } from "@/contexts/ThemeContext";
import BaseButton from "@/components/BaseButton";
import { isMobile } from "react-device-detect";
import { BiCurrentLocation } from "react-icons/bi";

export default function Trainings() {
  const { loadTrainingByTeamId, loadAssignments, loadWeeklyAssignmentsStats } = useStore(TrainingStore);
  const useTrainingStore = useStore(TrainingStore);
  const useUserStore = useStore(userStore);
  const teamStoreState = useStore(teamStore);
  const members = teamStoreState.members;
  const { getOverallAccuracyStats } = useStore(performanceStore);
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

      <main className="px-4 md:px-6 2xl:px-10 pb-10 space-y-6 mt-2">
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
                    <span>{trainings.length} sessions</span>
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
