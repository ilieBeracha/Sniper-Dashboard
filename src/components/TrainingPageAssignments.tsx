import BaseCreateBtn from "./BaseCreateBtn";
import BaseDashboardCard from "./BaseDashboardCard";
import { Assignment, TrainingSession } from "@/types/training";

type TrainingPageAssignmentsProps = {
  training: TrainingSession | null;
  setIsAddAssignmentOpen: (isOpen: boolean) => void;
};

export default function TrainingPageAssignments({ training, setIsAddAssignmentOpen }: TrainingPageAssignmentsProps) {
  return (
    <BaseDashboardCard
      header={
        <div className="flex items-center gap-2">
          <h4 className="font-medium">Related Assignments</h4>
          <BaseCreateBtn onClick={() => setIsAddAssignmentOpen(true)} />
        </div>
      }
      tooltipContent="List of assignments for this training session"
    >
      <div className="space-y-3 max-h-[200px] overflow-y-auto">
        {training?.assignment_sessions &&
          training?.assignment_sessions?.map((assignment_session: Assignment) => (
            <div key={assignment_session.id} className="flex justify-between items-center p-3 bg-[#1A1A1A] rounded-lg">
              <div>
                <h4 className="font-medium">{assignment_session.assignment_name}</h4>
                <p className="text-xs text-white/40">Due: {assignment_session.created_at}</p>
              </div>
            </div>
          ))}
      </div>
    </BaseDashboardCard>
  );
}
