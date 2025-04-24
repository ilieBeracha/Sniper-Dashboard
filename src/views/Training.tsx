import TrainingCalendar from "@/components/TrainingCalendar";
import TrainingList from "@/components/TrainingList";
import { TrainingStore } from "@/store/trainingStore";
import { userStore } from "@/store/userStore";
import { useEffect } from "react";
import { useStore } from "zustand";

export default function Training() {
  const { loadTrainingByTeamId } = useStore(TrainingStore);
  const useTrainingStore = useStore(TrainingStore);
  const useUserStore = useStore(userStore);

  const user = useUserStore.user;
  const trainings = useTrainingStore.trainings || [];

  useEffect(() => {
    const load = async () => {
      if (!user?.team_id) return;
      await loadTrainingByTeamId(user?.team_id);
    };

    load();
  }, []);

  return (
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 md:px-16 lg:px-28 py-8 md:py-12 ">
      <div className="grid grid-cols-1 xl:grid-cols-5 gap-6 text-white">
        <TrainingList trainings={trainings} />
        <TrainingCalendar trainings={trainings} />
      </div>
    </div>
  );
}
