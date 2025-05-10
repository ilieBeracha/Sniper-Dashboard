import { useState } from "react";
import { Assignment } from "@/types/training";
import SearchableCheckboxList from "./SearchableCheckboxList";
import { PlusCircleIcon } from "lucide-react";
import AddAssignmentModal from "./AddAssignmentModal";

type AssignmentsSectionProps = {
  assignments: Assignment[];
  assignmentIds: string[];
  setAssignmentIds: (ids: string[]) => void;
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
        <div className="flex items-center gap-2">
          <h3 className="text-sm font-medium text-white">Training Assignments</h3>
          <div
            className="flex items-center gap-2 bg-indigo-200/10  px-2 py-0.5 rounded text-xs cursor-pointer"
            onClick={() => setIsAddAssignmentOpen(true)}
          >
            <span className="text-sm font-medium text-gray-200">Create</span>
            <PlusCircleIcon className="w-4 h-4 text-gray-200" />
          </div>
        </div>
        {assignmentIds.length > 0 && (
          <div className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-xs">{assignmentIds.length} selected</div>
        )}
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
