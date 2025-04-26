import { useParams } from "react-router-dom";
import { useEffect } from "react";
import { TrainingStore } from "@/store/trainingStore";
import { useStore } from "zustand";
import TrainingPageOverview from "@/components/TrainingPageOverview";
import TrainingPageAssignments from "@/components/TrainingPageAssignments";
import TrainingPageParticipants from "@/components/TrainingPageParticipants";
import TrainingPageParticipantsScore from "@/components/TrainingPageParticipantsScore";

export default function TrainingPage() {
  const params = useParams();
  const { id } = params;
  const { training, loadTrainingById } = useStore(TrainingStore);

  useEffect(() => {
    loadTrainingById(id as string);
  }, [id]);

  return (
    <div className="min-h-screen from-[#1E1E20] text-gray-100 px-6 md:px-16 lg:px-28 py-8 md:py-12">
      <div className="space-y-8">
        <TrainingPageOverview training={training} />
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <TrainingPageAssignments training={training} />
          <TrainingPageParticipants training={training} />
        </div>
        <TrainingPageParticipantsScore />
      </div>
    </div>
  );
}
