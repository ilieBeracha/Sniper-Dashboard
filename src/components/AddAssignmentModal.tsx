import { useState } from "react";
import BaseModal from "./BaseModal";
import { loaderStore } from "@/store/loaderStore";
import { useStore } from "zustand";
import { toastService } from "@/services/toastService";

export default function AddAssignmentModal({
  isOpen,
  onClose,
  onSuccess,
}: {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (assignmentName: string) => void;
}) {
  const [assignmentName, setAssignmentName] = useState("");
  const { isLoading } = useStore(loaderStore);

  const handleSubmit = () => {
    if (!assignmentName) {
      toastService.error("Please enter an assignment name");
      return;
    }

    setAssignmentName("");
    onSuccess(assignmentName);
  };

  return (
    <BaseModal isOpen={isOpen} onClose={onClose}>
      <div className="w-full">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-white">New Assignment</h2>
        </div>
        <p className="mt-1 text-sm text-gray-400">Create a new assignment to be used in training sessions.</p>
        <div className="mt-4 space-y-6">
          <input
            type="text"
            value={assignmentName}
            onChange={(e) => setAssignmentName(e.target.value)}
            className="block w-full rounded-md bg-white/5 px-3 py-2.5 text-white shadow-sm ring-1 ring-inset ring-white/10 focus:ring-2 focus:ring-inset focus:ring-indigo-500 sm:text-sm"
            placeholder="Assignment Name"
          />
        </div>
        <div className="flex items-center justify-end gap-x-4 mt-4">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-white/5 hover:bg-white/10 transition-colors rounded-md text-sm font-medium text-white"
          >
            Cancel
          </button>
          <button
            disabled={isLoading}
            type="button"
            onClick={handleSubmit}
            className="px-4 py-1.5 bg-indigo-600 hover:bg-indigo-500 disabled:bg-indigo-600/50 transition-colors rounded-md text-sm font-medium text-white shadow-sm disabled:cursor-not-allowed"
          >
            Create
          </button>
        </div>
      </div>
    </BaseModal>
  );
}
