import TrainingAddTrainingSessionModal from "@/components/TrainingModal/AddTrainingSessionModal";
import TrainingList from "@/components/TrainingList";
import { teamStore } from "@/store/teamStore";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";
import { Calendar as CalendarIcon } from "lucide-react";
import TrainingKanbanBoard from "@/components/TrainingKanbanBoard";
import { useModal } from "@/hooks/useModal";

import Header from "@/Headers/Header";

export default function Trainings() {
  const { loadTrainingByTeamId, loadAssignments, loadWeeklyAssignmentsStats } = useStore(TrainingStore);
  const useTrainingStore = useStore(TrainingStore);
  const useUserStore = useStore(userStore);
  const teamStoreState = useStore(teamStore);
  const members = teamStoreState.members;

  const { isOpen: isAddTrainingOpen, setIsOpen: setIsAddTrainingOpen } = useModal();
  const [kanbanView, setKanbanView] = useState(false);

  const user = useUserStore.user;
  const trainings = useTrainingStore.trainings || [];
  const assignments = useTrainingStore.assignments;

  useEffect(() => {
    const load = async () => {
      isAddTrainingOpen;
      if (!user?.team_id) return;
      await loadWeeklyAssignmentsStats(user?.team_id);
      await loadTrainingByTeamId(user?.team_id);
      await loadAssignments();
    };
    load();
  }, []);

  async function fetchTrainings() {
    const teamId = userStore.getState().user?.team_id;
    if (!teamId) return;
    await loadTrainingByTeamId(teamId);
  }

  return (
    <div>
      <Header title="Trainings">
        <span className="flex items-center text-xs font-medium bg-indigo-500/20 text-indigo-300 py-1.5 px-3 rounded-full">
          <CalendarIcon className="w-3 h-3 mr-1.5" />
        </span>
        <button
          onClick={() => setKanbanView(!kanbanView)}
          className="px-4 py-2 bg-[#222] hover:bg-[#333] border border-white/10 rounded-lg text-sm font-medium text-white transition-all"
        >
          {kanbanView ? "List" : "Board"}
        </button>
      </Header>
      <div className="">{kanbanView ? <TrainingKanbanBoard trainings={trainings} /> : <TrainingList trainings={trainings} />}</div>

      <TrainingAddTrainingSessionModal
        isOpen={isAddTrainingOpen}
        onClose={() => setIsAddTrainingOpen(false)}
        onSuccess={fetchTrainings}
        teamMembers={members}
        assignments={assignments}
      />
    </div>
  );
}
