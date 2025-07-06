import { Target, Plus } from "lucide-react";
import AddAssignmentModal from "../AddAssignmentModal";
import { Assignment } from "@/types/training";
import { useFormContext } from "react-hook-form";
import { useTheme } from "@/contexts/ThemeContext";

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
  const { theme } = useTheme();

  return (
    <div className="space-y-6">
      {/* Mission Selection */}
      <div
        className={`p-4 rounded-lg border flex flex-col gap-4 transition-colors duration-200 ${
          theme === "dark" ? "bg-zinc-800/30 border-zinc-700/50" : "bg-gray-100 border-gray-300"
        }`}
      >
        <div className="flex items-center justify-between ">
          <div className="flex items-center gap-2">
            <Target className={` transition-colors duration-200 ${theme === "dark" ? "text-indigo-400" : "text-indigo-600"}`} size={16} />
            <h2 className={`text-base font-semibold transition-colors duration-200 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
              Mission Selection
            </h2>
          </div>

          <button
            onClick={() => setIsAddAssignmentOpen(true)}
            className={`flex items-center gap-1.5 sm:text-xs text-xs rounded-lg border px-3 py-1.5 transition-colors duration-200 ${
              theme === "dark"
                ? "text-indigo-400 hover:text-indigo-300 bg-indigo-900/20 border-indigo-700/50"
                : "text-indigo-600 hover:text-indigo-700 bg-indigo-50 border-indigo-200"
            }`}
          >
            <Plus size={14} />
          </button>
        </div>

        <select
          {...register("assignment_session_id")}
          className={`w-full min-h-9 rounded-lg px-3 py-2 text-sm border transition-colors duration-200 ${
            theme === "dark" ? "bg-zinc-800/50 text-white border-zinc-700" : "bg-white text-gray-900 border-gray-300"
          }`}
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
    </div>
  );
}
