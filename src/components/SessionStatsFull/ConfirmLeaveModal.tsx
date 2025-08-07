import { X } from "lucide-react";
import { useTheme } from "@/contexts/ThemeContext";

interface ConfirmLeaveModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  onSaveDraft?: () => void;
  hasUnsavedChanges: boolean;
}

export default function ConfirmLeaveModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  onSaveDraft,
  hasUnsavedChanges 
}: ConfirmLeaveModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-[60] px-4">
      <div
        className={`w-full max-w-md rounded-lg shadow-xl p-6 ${
          theme === "dark" ? "bg-zinc-900 border border-zinc-800" : "bg-white"
        }`}
      >
        {/* Header */}
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">
            {hasUnsavedChanges ? "Unsaved Changes" : "Leave Form"}
          </h3>
          <button
            onClick={onClose}
            className={`p-1 rounded-lg transition-colors ${
              theme === "dark" 
                ? "hover:bg-zinc-800 text-zinc-400" 
                : "hover:bg-gray-100 text-gray-500"
            }`}
          >
            <X size={20} />
          </button>
        </div>

        {/* Message */}
        <p className={`mb-6 ${theme === "dark" ? "text-zinc-300" : "text-gray-700"}`}>
          {hasUnsavedChanges 
            ? "You have unsaved changes. Are you sure you want to leave? Your data will be lost."
            : "Are you sure you want to leave the form?"}
        </p>

        {/* Actions */}
        <div className="flex gap-3 justify-end">
          <button
            onClick={onClose}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-zinc-800 hover:bg-zinc-700 text-zinc-300"
                : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            Cancel
          </button>
          
          {hasUnsavedChanges && onSaveDraft && (
            <button
              onClick={onSaveDraft}
              className={`px-4 py-2 rounded-lg font-medium transition-colors ${
                theme === "dark"
                  ? "bg-blue-600 hover:bg-blue-700 text-white"
                  : "bg-blue-500 hover:bg-blue-600 text-white"
              }`}
            >
              Save Draft
            </button>
          )}

          <button
            onClick={onConfirm}
            className={`px-4 py-2 rounded-lg font-medium transition-colors ${
              theme === "dark"
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-red-500 hover:bg-red-600 text-white"
            }`}
          >
            Leave Without Saving
          </button>
        </div>
      </div>
    </div>
  );
}