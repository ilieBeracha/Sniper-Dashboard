import { Target, Plus, Crosshair } from "lucide-react";
import AddAssignmentModal from "../AddAssignmentModal";
import { Assignment } from "@/types/training";
import { useFormContext } from "react-hook-form";

export default function TrainingPageScoreFormModalInfo({
  setIsAddAssignmentOpen,
  filteredAssignments,
  isAddAssignmentOpen,
  handleOnAddAssignment,
}: {
  setIsAddAssignmentOpen: (isOpen: boolean) => void;
  filteredAssignments: any;
  isAddAssignmentOpen: boolean;
  handleOnAddAssignment: (assignmentName: string) => void;
}) {
  const { register } = useFormContext();

  return (
    <div className="space-y-6">
      {/* Mission Selection */}
      <div className="p-4 bg-zinc-800/30 rounded-lg border border-zinc-700/50 flex flex-col gap-4">
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <Target className="text-indigo-400" size={16} />
            <h2 className="text-base font-semibold text-white">Mission Selection</h2>
          </div>

          <button
            onClick={() => setIsAddAssignmentOpen(true)}
            className="text-indigo-400  flex items-center gap-1.5 sm:text-xs text-xs hover:text-indigo-300 bg-indigo-900/20 rounded-lg border border-indigo-700/50 px-3 py-1.5 "
          >
            <Plus size={14} />
          </button>
        </div>
        <select
          {...register("assignment_session_id")}
          className="w-full min-h-9 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
        >
          <option value="">Select assignment</option>
          {filteredAssignments?.map((assignment: Assignment) => {
            return (
              <option key={assignment.id} value={assignment.id}>
                {assignment.assignment_name}
              </option>
            );
          })}
        </select>
        <AddAssignmentModal
          isOpen={isAddAssignmentOpen}
          onClose={() => setIsAddAssignmentOpen(false)}
          onSuccess={(assignmentName: string) => {
            handleOnAddAssignment(assignmentName);
          }}
        />
      </div>

      {/* Combat Details */}
      <div className="space-y-4">
        <div className="flex items-center gap-2">
          <Crosshair className="text-green-400" size={16} />
          <h4 className="text-sm font-semibold text-white">Combat Details</h4>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-1 gap-4">
          <select
            {...register("day_night")}
            className="w-full min-h-10 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
          >
            <option value="day">Day</option>
            <option value="night">Night</option>
          </select>

          <select {...register("position")} className="w-full min-h-10 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700">
            <option value="">Select position</option>
            <option value="lying">Lying</option>
            <option value="standing">Standing</option>
            <option value="sitting">Sitting</option>
            <option value="operational">Operational</option>
          </select>

          <input
            type="number"
            {...register("time_until_first_shot")}
            placeholder="Time until first shot (seconds)"
            className="w-full min-h-10 rounded-lg bg-zinc-800/50 px-3 py-2 text-sm text-white border border-zinc-700"
          />
        </div>
      </div>
    </div>
  );
}
