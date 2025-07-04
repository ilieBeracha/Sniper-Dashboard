import { useState } from "react";
import { Assignment } from "@/types/training";
import SearchableCheckboxList from "@/components/SearchableCheckboxList";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import { Plus } from "lucide-react";
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
    <div
      className={`rounded-lg border p-6 transition-colors duration-200 ${
        theme === "dark" ? "bg-[#1A1A1A] border-white/5" : "bg-white border-gray-200"
      }`}
    >
      <div className="flex items-center mb-4 justify-between">
        <div className={`flex items-center gap-2 text-sm font-medium justify-between w-full ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium">Assignments</span>
            {assignmentIds.length > 0 && (
              <div className="bg-indigo-500/10 text-indigo-400 px-2 shrink-0 py-0.5 rounded text-xs">{assignmentIds.length} selected</div>
            )}
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
