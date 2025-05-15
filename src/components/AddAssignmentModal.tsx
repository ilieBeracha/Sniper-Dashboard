import { useState } from "react";
import { loaderStore } from "@/store/loaderStore";
import { useStore } from "zustand";
import { toastService } from "@/services/toastService";
import BaseMobileDrawer from "./BaseDrawer/BaseMobileDrawer";
import BaseDesktopDrawer from "./BaseDrawer/BaseDesktopDrawer";
import { isMobile } from "react-device-detect";
import BaseInput from "./BaseInput";
import { FileQuestion } from "lucide-react";

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
    if (!assignmentName.trim()) {
      toastService.error("Please enter an assignment name");
      return;
    }

    onSuccess(assignmentName.trim());
    setAssignmentName("");
  };

  const Content = (
    <div className="w-full text-white p-4 space-y-6">
      <div>
        <h2 className="text-xl font-semibold">New Assignment</h2>
        <p className="mt-1 text-sm text-gray-400">Create a new assignment to be used in training sessions.</p>
      </div>

      <BaseInput
        label="Assignment Name"
        type="text"
        value={assignmentName}
        onChange={(e) => setAssignmentName(e.target.value)}
        placeholder="Enter assignment name"
        leftIcon={<FileQuestion size={16} className="text-gray-400" />}
        containerClassName="bg-transparent"
      />

      <div className="flex items-center justify-end gap-x-4">
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
  );

  return isMobile ? (
    <BaseMobileDrawer isOpen={isOpen} setIsOpen={onClose} title="New Assignment">
      {Content}
    </BaseMobileDrawer>
  ) : (
    <BaseDesktopDrawer isOpen={isOpen} setIsOpen={onClose} title="New Assignment" width="400px">
      {Content}
    </BaseDesktopDrawer>
  );
}
