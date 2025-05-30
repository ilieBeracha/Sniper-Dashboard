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

export default function Trainings() {
  const { loadTrainingByTeamId, loadAssignments, loadWeeklyAssignmentsStats } = useStore(TrainingStore);
  const useTrainingStore = useStore(TrainingStore);
  const useUserStore = useStore(userStore);
  const teamStoreState = useStore(teamStore);
  const members = teamStoreState.members;

  const { isOpen: isAddTrainingOpen, setIsOpen: setIsAddTrainingOpen } = useModal();

  const user = useUserStore.user;
  const trainings = useTrainingStore.trainings || [];
  const assignments = useTrainingStore.assignments;

  useEffect(() => {
    async function load() {
      if (!user || !user.team_id) {
        return;
      }
      await loadWeeklyAssignmentsStats(user.team_id);
      await loadTrainingByTeamId(user.team_id);
      await loadAssignments();
    }
    load();
  }, [user]);

  async function fetchTrainings() {
    const teamId = userStore.getState().user?.team_id;
    if (!teamId) return;
    await loadTrainingByTeamId(teamId);
  }

  return (
    <div className="min-h-screen bg-[#121212] text-gray-100">
      <Header title="Trainings">
        <span className="flex items-center text-xs font-medium  text-indigo-300 py-1.5 px-3 rounded-full">
          <CalendarIcon className="w-3 h-3 mr-1.5" />
          {trainings.length}
        </span>
      </Header>

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
