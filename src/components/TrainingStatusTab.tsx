import { TrainingSession, TrainingStatus } from "@/types/training";
import { UserRole } from "@/types/user";

import { useTheme } from "@/contexts/ThemeContext";
import TrainingStatusButtons from "./TrainingStatusButtons";
import { useStore } from "zustand";
import { userStore } from "@/store/userStore";
import { isCommander } from "@/utils/permissions";
import { primitives } from "@/styles/core";

export default function TrainingStatusTab({
  training,
  sessionStats,
  handleStatusChange,
}: {
  training: TrainingSession;
  sessionStats: any[];
  handleStatusChange: (newStatus: TrainingStatus) => void;
}) {
  const { user } = useStore(userStore);
  const { theme } = useTheme();

  return (
    <>
      {isCommander(user?.user_role as UserRole) && (
        <div className="p-2 rounded-2xl ">
          <h3 className="text-lg font-semibold mb-4">Training Status Management</h3>
          <TrainingStatusButtons currentStatus={training?.status as TrainingStatus} onStatusChange={handleStatusChange} />
        </div>
      )}

      {/* Status Information */}
      <div className="p-2 rounded-2xl">
        <h3 className={`text-lg font-semibold mb-4 ${theme === "dark" ? "text-white" : "text-gray-900"}`}>Session Information</h3>
        <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme === "dark" ? primitives.grey.grey300 : primitives.grey.grey700 }}>
              Current Status
            </label>
            <span
              className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-sm font-medium"
              style={{
                backgroundColor:
                  training?.status === TrainingStatus.Scheduled
                    ? theme === "dark"
                      ? `${primitives.blue.blue500}33`
                      : primitives.blue.blue100
                    : training?.status === TrainingStatus.InProgress
                      ? theme === "dark"
                        ? `${primitives.yellow.yellow500}33`
                        : primitives.yellow.yellow100
                      : theme === "dark"
                        ? `${primitives.green.green500}33`
                        : primitives.green.green100,
                color:
                  training?.status === TrainingStatus.Scheduled
                    ? theme === "dark"
                      ? primitives.blue.blue300
                      : primitives.blue.blue600
                    : training?.status === TrainingStatus.InProgress
                      ? theme === "dark"
                        ? primitives.yellow.yellow300
                        : primitives.yellow.yellow600
                      : theme === "dark"
                        ? primitives.green.green300
                        : primitives.green.green600,
              }}
            >
              {training?.status}
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme === "dark" ? primitives.grey.grey300 : primitives.grey.grey700 }}>
              Participants
            </label>
            <span className="text-sm" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
              {training?.participants?.length || 0} registered
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme === "dark" ? primitives.grey.grey300 : primitives.grey.grey700 }}>
              Total Sessions
            </label>
            <span className="text-sm" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
              {sessionStats?.length || 0} recorded
            </span>
          </div>
          <div>
            <label className="block text-sm font-medium mb-2" style={{ color: theme === "dark" ? primitives.grey.grey300 : primitives.grey.grey700 }}>
              Assignments
            </label>
            <span className="text-sm" style={{ color: theme === "dark" ? primitives.grey.grey400 : primitives.grey.grey600 }}>
              {training?.assignments?.length || 0} assigned
            </span>
          </div>
        </div>
      </div>
    </>
  );
}
