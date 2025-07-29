import { useTheme } from "@/contexts/ThemeContext";
import { Loader2 } from "lucide-react";

type BaseConfirmDeleteModalProps = {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  isLoading: boolean;
};

export default function BaseConfirmDeleteModal({ isOpen, onClose, onConfirm, title, message, isLoading }: BaseConfirmDeleteModalProps) {
  const { theme } = useTheme();

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50">
      <div className={`rounded-lg p-6 max-w-md w-full mx-4 ${theme === "dark" ? "bg-[#1A1A1A]" : "bg-white"}`}>
        <h4 className={`text-lg font-semibold mb-2 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>{title}</h4>
        <p className={`text-sm mb-6 ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{message}</p>
        <div className="flex justify-end gap-3">
          <button
            disabled={isLoading}
            onClick={onClose}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              theme === "dark" ? "bg-white/5 hover:bg-white/10 text-white" : "bg-gray-100 hover:bg-gray-200 text-gray-700"
            }`}
          >
            No, Keep Current
          </button>
          <button
            disabled={isLoading}
            onClick={onConfirm}
            className={`px-4 py-2 text-sm rounded-md transition-colors ${
              theme === "dark" ? "bg-red-500/20 hover:bg-red-500/30 text-red-400" : "bg-blue-500/20 hover:bg-blue-500/30 text-blue-400"
            }`}
          >
            {isLoading ? <Loader2 className="animate-spin" /> : "Yes, Delete"}
          </button>
        </div>
      </div>
    </div>
  );
}
