import BaseDashboardCard from "./BaseDashboardCard";
import { TrainingParticipant, TrainingSession } from "@/types/training";

type TrainingPageParticipantsProps = {
  training: TrainingSession | null;
};

export default function TrainingPageParticipants({ training }: TrainingPageParticipantsProps) {
  return (
    <BaseDashboardCard title="Training Participants" tooltipContent="List of participants and their progress">
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {training?.participants &&
          training?.participants?.map((participant: TrainingParticipant) => (
            <div key={participant.id} className="flex justify-between items-center p-3 bg-[#1A1A1A] rounded-lg">
              <div>
                <h3 className="font-medium">
                  {participant.user?.first_name} {participant.user?.last_name}
                </h3>
                <p className="text-xs text-gray-400">{participant.user?.user_role}</p>
              </div>
            </div>
          ))}
      </div>
    </BaseDashboardCard>
  );
}
