import { useState } from "react";
import { Assignment } from "@/types/training";
import SearchableCheckboxList from "@/components/SearchableCheckboxList";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import { Plus, Target } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

type AssignmentsSectionProps = {
  assignments: Assignment[];
  assignmentIds: string[];
  setAssignmentIds: React.Dispatch<React.SetStateAction<string[]>>;
  handleAddAssignment: (assignmentName: string) => void;
  isAddAssignmentOpen: boolean;
  setIsAddAssignmentOpen: (open: boolean) => void;
};

export default function AssignmentsSection({
  assignments,
  assignmentIds,
  setAssignmentIds,
  handleAddAssignment,
  isAddAssignmentOpen,
  setIsAddAssignmentOpen,
}: AssignmentsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");
  const { theme } = useTheme();

  const formattedAssignments = assignments.map((assignment) => ({
    id: assignment.id,
    label: assignment.assignment_name,
    description: "",
  }));

  return (
    <div className={`rounded-lg border p-4 ${theme === "dark" ? "bg-zinc-900/30 border-zinc-800" : "bg-gray-50 border-gray-200"}`}>
      <div className="flex items-center justify-between mb-3">
        <h4 className={`text-sm font-semibold flex items-center gap-2 ${theme === "dark" ? "text-zinc-200" : "text-gray-900"}`}>
          <Target size={16} className="opacity-60" />
          Training Assignments
          {assignmentIds.length > 0 && (
            <span
              className={`ml-2 px-2 py-0.5 rounded-full text-xs font-normal ${
                theme === "dark" ? "bg-blue-500/20 text-blue-400" : "bg-blue-100 text-blue-700"
              }`}
            >
              {assignmentIds.length} selected
            </span>
          )}
        </h4>
        <button
          onClick={() => setIsAddAssignmentOpen(true)}
          className={`
            p-1.5 rounded-lg transition-all text-sm
            flex items-center gap-1
            ${theme === "dark" ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300" : "bg-white hover:bg-gray-100 text-gray-700 border border-gray-200"}
          `}
        >
          <Plus size={14} />
        </button>
      </div>

      <SearchableCheckboxList
        items={formattedAssignments}
        selectedIds={assignmentIds}
        setSelectedIds={setAssignmentIds}
        searchTerm={searchTerm}
        showClearButton={false}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Select assignments..."
        emptyMessage="No assignments found"
        maxHeight={180} // Reduced height to fit better
      />
      <AddAssignmentModal isOpen={isAddAssignmentOpen} onClose={() => setIsAddAssignmentOpen(false)} onSuccess={handleAddAssignment} />
    </div>
  );
}
