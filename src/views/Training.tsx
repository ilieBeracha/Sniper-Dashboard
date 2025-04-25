import TrainingAddTrainingSessionModal from "@/components/AddTrainingSessionModal";
import TrainingCalendar from "@/components/TrainingCalendar";
import TrainingList from "@/components/TrainingList";
import { teamStore } from "@/store/teamStore";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { useEffect, useState } from "react";
import { useStore } from "zustand";

export default function Training() {
  const { loadTrainingByTeamId, loadAssignments } = useStore(TrainingStore);
  const useTrainingStore = useStore(TrainingStore);
  const useUserStore = useStore(userStore);
  const teamStoreState = useStore(teamStore);
  const members = teamStoreState.members;

  const [showModal, setShowModal] = useState(false);

  const user = useUserStore.user;
  const trainings = useTrainingStore.trainings || [];
  const assignments = useTrainingStore.assignments;

  function handleAddTrainingModal() {
    setShowModal(!showModal);
  }

  useEffect(() => {
    const load = async () => {
      if (!user?.team_id) return;
      await loadTrainingByTeamId(user?.team_id);
      await loadAssignments();
    };
    load();
  }, []);

  function fetchTrainings() {
    const teamId = userStore.getState().user?.team_id;
    if (!teamId) return;
    return loadTrainingByTeamId(teamId);
  }

  return (
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 md:px-16 lg:px-28 py-8 md:py-12 ">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 text-white">
        <TrainingList trainings={trainings} />
        <TrainingCalendar
          trainings={trainings}
          handleAddTrainingModal={handleAddTrainingModal}
        />
      </div>
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
