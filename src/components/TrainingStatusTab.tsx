import { TrainingSession, TrainingStatus } from "@/types/training";
import { UserRole } from "@/types/user";

import { useTheme } from "@/contexts/ThemeContext";
import TrainingStatusButtons from "./TrainingStatusButtons";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { Score } from "@/types/score";
import { isCommander } from "@/utils/permissions";

export default function TrainingStatusTab({
  training,
  scores,
  handleStatusChange,
}: {
  training: TrainingSession;
  scores: Score[];
  handleStatusChange: (newStatus: TrainingStatus) => void;
}) {
  const { user } = useStore(userStore);
  const { theme } = useTheme();

  return (
    <>
      {isCommander(user?.user_role as UserRole) && (
        <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
          <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Training Status Management</h3>
          <TrainingStatusButtons currentStatus={training?.status as TrainingStatus} onStatusChange={handleStatusChange} />
        </div>
      )}

      {/* Status Information */}
      <div className={`p-6 rounded-2xl ${theme === "dark" ? "bg-zinc-900/50 border border-zinc-800" : "bg-white border border-gray-100"}`}>
        <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Session Information</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Current Status</label>
            <span
              className={`inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium ${
                training?.status === TrainingStatus.Scheduled
                  ? theme === "dark"
                    ? "bg-blue-500/20 text-blue-300"
                    : "bg-blue-100 text-blue-700"
                  : training?.status === TrainingStatus.InProgress
                    ? theme === "dark"
                      ? "bg-yellow-500/20 text-yellow-300"
                      : "bg-yellow-100 text-yellow-700"
                    : theme === "dark"
                      ? "bg-green-500/20 text-green-300"
                      : "bg-green-100 text-green-700"
              }`}
            >
              {training?.status}
            </span>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Participants</label>
            <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>
              {training?.participants?.length || 0} registered
            </span>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Total Scores</label>
            <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{scores.length} recorded</span>
          </div>
          <div>
            <label className={`block text-sm font-medium mb-2 ${theme === "dark" ? "text-gray-300" : "text-gray-700"}`}>Assignments</label>
            <span className={`text-sm ${theme === "dark" ? "text-gray-400" : "text-gray-600"}`}>{training?.assignments?.length || 0} assigned</span>
          </div>
        </div>
      </div>
    </>
  );
}
