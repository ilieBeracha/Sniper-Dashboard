import TrainingAddTrainingSessionModal from "@/components/AddTrainingSessionModal";
import TrainingCalendar from "@/components/TrainingCalendar";
import TrainingList from "@/components/TrainingList";
import TrainingStats from "@/components/TrainingStats";
import { teamStore } from "@/store/teamStore";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { Plus, Calendar as CalendarIcon, List } from "lucide-react";
import { isCommander } from "@/utils/permissions";

export default function Training() {
  const { loadTrainingByTeamId, loadAssignments } = useStore(TrainingStore);
  const useTrainingStore = useStore(TrainingStore);
  const useUserStore = useStore(userStore);
  const teamStoreState = useStore(teamStore);
  const members = teamStoreState.members;
  const { userRole } = useUserStore;

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);

  const user = useUserStore.user;
  const trainings = useTrainingStore.trainings || [];
  const assignments = useTrainingStore.assignments;

  function handleAddTrainingModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    const load = async () => {
      setIsLoading(true);
      if (!user?.team_id) return;
      await loadTrainingByTeamId(user?.team_id);
      await loadAssignments();
      setIsLoading(false);
    };
    load();
  }, []);

  function fetchTrainings() {
    const teamId = userStore.getState().user?.team_id;
    if (!teamId) return;
    return loadTrainingByTeamId(teamId);
  }

  return (
    <div className="text-gray-100 px-6 md:px-16 lg:px-28 py-8 md:py-12">
      {/* Header with title and action button */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-8">
        <div className="mb-4 md:mb-0">
          <h1 className="text-lg md:text-xl font-bold text-white mb-2">Training Sessions</h1>
          <p className="text-gray-400">Manage and track your team's training progress</p>
        </div>
        {isCommander(userRole) && (
          <button
            onClick={handleAddTrainingModal}
            className="mt-4 md:mt-0 flex items-center gap-2 bg-gradient-to-r from-indigo-600 to-indigo-500 hover:from-indigo-500 hover:to-indigo-400 px-4 py-2.5 rounded-lg text-white text-sm font-medium shadow-lg shadow-indigo-900/20 transition-all hover:shadow-indigo-900/30 hover:scale-[1.02] active:scale-[0.98]"
          >
            <Plus size={18} />
            Schedule Training Session
          </button>
        )}
      </div>

      {isLoading ? (
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-400">Loading training data...</p>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 xl:grid-cols-5 gap-8">
          <div className="xl:col-span-3 order-2 xl:order-1">
            <div className="bg-[#1A1A1A] rounded-xl shadow-xl border border-white/5 overflow-hidden backdrop-blur-sm">
              <div className="flex items-center justify-between p-6 border-b border-white/5">
                <div className="flex items-center">
                  <List className="w-5 h-5 text-indigo-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">Training Sessions</h2>
                </div>
                <div className="flex items-center gap-2">
                  <span className="flex items-center text-xs font-medium bg-indigo-500/20 text-indigo-300 py-1.5 px-3 rounded-full">
                    <CalendarIcon className="w-3 h-3 mr-1.5" />
                    {trainings.length} {trainings.length === 1 ? "session" : "sessions"}
                  </span>
                </div>
              </div>

              <div className="p-6">
                <TrainingList trainings={trainings} />
              </div>
            </div>
          </div>

          <div className="xl:col-span-2 order-1 xl:order-2 space-y-8">
            <TrainingStats trainings={trainings} />

            <div className="bg-[#1A1A1A] rounded-xl shadow-xl border border-white/5 overflow-hidden backdrop-blur-sm">
              <div className="border-b border-white/5 p-6">
                <div className="flex items-center">
                  <CalendarIcon className="w-5 h-5 text-indigo-400 mr-3" />
                  <h2 className="text-xl font-bold text-white">Training Calendar</h2>
                </div>
              </div>

              <div className="p-6">
                <TrainingCalendar trainings={trainings} />
              </div>
            </div>
          </div>
        </div>
      )}

      <TrainingAddTrainingSessionModal
        isOpen={showModal}
        onClose={() => setShowModal(false)}
        onSuccess={fetchTrainings}
        teamMembers={members}
        assignments={assignments}
      />
    </div>
  );
}
