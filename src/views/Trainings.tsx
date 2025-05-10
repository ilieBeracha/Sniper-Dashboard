import TrainingAddTrainingSessionModal from "@/components/AddTrainingSessionModal";
import TrainingList from "@/components/TrainingList";
import { teamStore } from "@/store/teamStore";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { Calendar as CalendarIcon, List } from "lucide-react";
import { useNavigate } from "react-router-dom";
import TrainingKanbanBoard from "@/components/TrainingKanbanBoard";
import TrainingsHeader from "@/components/TrainingsHeader";

export default function Training() {
  const { loadTrainingByTeamId, loadAssignments, loadWeeklyAssignmentsStats } = useStore(TrainingStore);
  const useTrainingStore = useStore(TrainingStore);
  const useUserStore = useStore(userStore);
  const teamStoreState = useStore(teamStore);
  const members = teamStoreState.members;
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [kanbanView, setKanbanView] = useState(false);

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
      await loadWeeklyAssignmentsStats(user?.team_id);
      await loadTrainingByTeamId(user?.team_id);
      await loadAssignments();
      setIsLoading(false);
    };
    load();
  }, []);

  function fetchTrainings() {
    const teamId = userStore.getState().user?.team_id;
    if (!teamId) return;
    navigate(`/training/${teamId}`);
    return loadTrainingByTeamId(teamId);
  }

  return (
    <div className="min-h-screen w-full from-[#1E1E20] text-gray-100 p-3">
      <div className="flex flex-col md:flex-row md:items-center md:justify-between">
        <div className="mb-2 md:mb-0"></div>
        <TrainingsHeader setIsOpen={handleAddTrainingModal} kanbanView={kanbanView} setKanbanView={setKanbanView} />
      </div>

      {isLoading ? (
        <div className="min-h-[500px] flex items-center justify-center">
          <div className="flex flex-col items-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-500"></div>
            <p className="mt-4 text-gray-400">Loading training data...</p>
          </div>
        </div>
      ) : (
        <div className="sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-5 gap-8">
          <div className="xl:col-span-5 order-2 xl:order-1">
            <div className="">
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

              <div className="pt-2 pb-6">{kanbanView ? <TrainingKanbanBoard trainings={trainings} /> : <TrainingList trainings={trainings} />}</div>
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
