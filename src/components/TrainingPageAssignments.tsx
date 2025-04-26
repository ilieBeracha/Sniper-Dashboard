import BaseDashboardCard from "./BaseDashboardCard";
import { Assignment, TrainingSession } from "@/types/training";

type TrainingPageAssignmentsProps = {
  training: TrainingSession | null;
};

export default function TrainingPageAssignments({ training }: TrainingPageAssignmentsProps) {
  return (
    <BaseDashboardCard title="Current Assignments" tooltipContent="List of assignments for this training session">
      <div className="space-y-3">
        {training?.training_assignments &&
          training?.training_assignments?.map((assignment: Assignment) => (
            <div key={assignment.id} className="flex justify-between items-center p-3 bg-[#1A1A1A] rounded-lg">
              <div>
                <h3 className="font-medium">{assignment.assignment.assignment_name}</h3>
                <p className="text-xs text-white/40">Due: {assignment.assignment.created_at}</p>
              </div>
            </div>
          ))}
      </div>
    </BaseDashboardCard>
  );
}
