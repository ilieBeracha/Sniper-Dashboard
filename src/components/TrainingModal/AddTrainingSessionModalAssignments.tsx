import { useState } from "react";
import { Assignment } from "@/types/training";
import SearchableCheckboxList from "@/components/SearchableCheckboxList";
import AddAssignmentModal from "@/components/AddAssignmentModal";
import { Plus } from "lucide-react";

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

  const formattedAssignments = assignments.map((assignment) => ({
    id: assignment.id,
    label: assignment.assignment_name,
    description: "",
  }));

  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-white/5 p-6">
      <div className="flex items-center mb-4 justify-between">
        <div className="flex items-center gap-2 text-sm font-medium text-white justify-between w-full">
          <div className="flex items-center justify-center gap-2">
            <span className="text-sm font-medium">Assignments</span>
            {assignmentIds.length > 0 && (
              <div className="bg-indigo-500/10 text-indigo-400 px-2 shrink-0 py-0.5 rounded text-xs">{assignmentIds.length} selected</div>
            )}
          </div>
          <button
            onClick={() => setIsAddAssignmentOpen(true)}
            className="text-indigo-400  flex items-center gap-1.5 sm:text-xs text-xs hover:text-indigo-300 bg-indigo-900/20 rounded-lg border border-indigo-700/50 px-3 py-1.5"
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
