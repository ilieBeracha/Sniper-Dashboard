import { useState } from "react";
import { Assignment } from "@/types/training";
import SearchableCheckboxList from "./SearchableCheckboxList";

type AssignmentsSectionProps = {
  assignments: Assignment[];
  assignmentIds: string[];
  setAssignmentIds: (ids: string[]) => void;
};

export default function AssignmentsSection({
  assignments,
  assignmentIds,
  setAssignmentIds,
}: AssignmentsSectionProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const formattedAssignments = assignments.map((assignment) => ({
    id: assignment.id,
    label: assignment.assignment_name,
    description: "",
  }));

  return (
    <div className="bg-[#1A1A1A] rounded-lg border border-white/5 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-sm font-medium text-white">Training Assignments</h3>
        {assignmentIds.length > 0 && (
          <div className="bg-indigo-500/10 text-indigo-400 px-2 py-0.5 rounded text-xs">
            {assignmentIds.length} selected
          </div>
        )}
      </div>

      <SearchableCheckboxList
        items={formattedAssignments}
        selectedIds={assignmentIds}
        setSelectedIds={setAssignmentIds}
        searchTerm={searchTerm}
        setSearchTerm={setSearchTerm}
        searchPlaceholder="Search assignments..."
        emptyMessage="No assignments found"
        maxHeight={176} // 44px × 4 items
      />
    </div>
  );
}
