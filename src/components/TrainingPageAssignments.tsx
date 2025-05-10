import BaseDashboardCard from "./BaseDashboardCard";
import { Assignment, TrainingSession } from "@/types/training";

type TrainingPageAssignmentsProps = {
  training: TrainingSession | null;
};

export default function TrainingPageAssignments({ training }: TrainingPageAssignmentsProps) {
  return (
    <BaseDashboardCard header="Current Assignments" tooltipContent="List of assignments for this training session">
      <div className="space-y-3 max-h-[300px] overflow-y-auto">
        {training?.assignment_sessions &&
          training?.assignment_sessions?.map((assignment_session: Assignment) => (
            <div key={assignment_session.id} className="flex justify-between items-center p-3 bg-[#1A1A1A] rounded-lg">
              <div>
                <h3 className="font-medium">{assignment_session.assignment_name}</h3>
                <p className="text-xs text-white/40">Due: {assignment_session.created_at}</p>
              </div>
            </div>
          ))}
      </div>
    </BaseDashboardCard>
  );
}
