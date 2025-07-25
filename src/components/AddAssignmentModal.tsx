import { useState } from "react";
import { loaderStore } from "@/store/loaderStore";
import { useStore } from "zustand";
import BaseMobileDrawer from "./BaseDrawer/BaseMobileDrawer";
import BaseDesktopDrawer from "./BaseDrawer/BaseDesktopDrawer";
import { useIsMobile } from "@/hooks/useIsMobile";
import BaseInput from "./base/BaseInput";
import { FileQuestion } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";
import { validateAssignmentForm } from "@/lib/formValidation";
import { useDebounce } from "@/hooks/useDebounce";

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
  const [error, setError] = useState("");
  const { isLoading } = useStore(loaderStore);
  const isMobile = useIsMobile();
  const { theme } = useTheme();

  const handleSubmit = () => {
    setError("");

    const validationError = validateAssignmentForm({ assignmentName });
    if (validationError) {
      setError(validationError);
      return;
    }

    onSuccess(assignmentName.trim());
    setAssignmentName("");
  };

  // Debounce the submit handler to prevent rapid clicks
  const [debouncedSubmit] = useDebounce(handleSubmit, 500, [assignmentName, onSuccess]);

  const Content = (
    <div className={`w-full p-4 space-y-6 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>
      <div>
        <h2 className={`text-xl font-semibold ${theme === "dark" ? "text-white" : "text-gray-900"}`}>New Assignment</h2>
        <p className={`mt-1 text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
          Create a new assignment to be used in training sessions.
        </p>
      </div>

      {error && (
        <div
          className={`p-3 rounded-lg text-sm ${
            theme === "dark" ? "bg-red-900/50 text-red-300 border border-red-800" : "bg-red-50 text-red-700 border border-red-200"
          }`}
        >
          {error}
        </div>
      )}

      <BaseInput
        label="Assignment Name"
        type="text"
        value={assignmentName}
        onChange={(e) => setAssignmentName(e.target.value)}
        placeholder="Enter assignment name"
        leftIcon={<FileQuestion size={16} className={theme === "dark" ? "text-gray-400" : "text-gray-500"} />}
        containerClassName="bg-transparent"
      />

      <div className="flex items-center justify-end gap-x-4">
        <button
          type="button"
          onClick={onClose}
          className={`px-4 py-1.5 transition-colors rounded-md text-sm font-medium ${
            theme === "dark" ? "bg-white/5 hover:bg-white/10 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
          }`}
        >
          Cancel
        </button>
        <button
          disabled={isLoading}
          type="button"
          onClick={debouncedSubmit}
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
    <BaseDesktopDrawer isOpen={isOpen} setIsOpen={onClose} title="New Assignment" width="600px">
      {Content}
    </BaseDesktopDrawer>
  );
}
