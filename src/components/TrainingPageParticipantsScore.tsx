import BaseDashboardCard from "./BaseDashboardCard";

export default function TrainingPageParticipantsScore() {
  return (
    <BaseDashboardCard title="Participant Score" tooltipContent="Visual representation of participant score">
      <div className="h-64 flex items-center justify-center text-gray-400">Participants Scores</div>
    </BaseDashboardCard>
  );
}
